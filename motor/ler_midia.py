"""Converte o material de estratégia do dono (dados/estratégias/<tema>/) em texto e imagens que o Claude lê.

  PDF   -> _lido/<nome>.md (texto de cada página) e, nas páginas que são só imagem, _lido/<nome>-pNN.jpg
  áudio -> _lido/<nome>.md (transcrição local com faster-whisper, com marcação de tempo)
  vídeo -> _lido/<nome>.md (transcrição do áudio) e _lido/<nome>-quadrosNN.jpg (folhas 3x3, um quadro a cada 15 s)

Só processa arquivo novo ou alterado (controle em _lido/_controle.json). Nada sai da máquina: a transcrição
é local; só o modelo de voz é baixado uma vez (Hugging Face).

uso: python motor/ler_midia.py [tema] [--modelo small|medium|large-v3] [--refazer]
"""
import json, os, subprocess, sys, tempfile, time

RAIZ = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dados", "estratégias")
AUDIO = (".m4a", ".mp3", ".wav", ".ogg", ".aac", ".flac")
VIDEO = (".mp4", ".mov", ".mkv", ".webm")
PDF = (".pdf",)
QUADRO_S = 15


def ffmpeg():
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def tempo(s):
    s = int(s)
    return "%02d:%02d" % (s // 60, s % 60) if s < 3600 else "%d:%02d:%02d" % (s // 3600, s // 60 % 60, s % 60)


_modelo = {}


def _dlls_nvidia():
    """No Windows, as bibliotecas da NVIDIA instaladas pelo pip (nvidia-cublas-cu12, nvidia-cudnn-cu12) ficam fora do PATH."""
    try:
        import nvidia
    except ImportError:
        return
    for raiz in nvidia.__path__:
        for sub in os.listdir(raiz):
            b = os.path.join(raiz, sub, "bin")
            if os.path.isdir(b):
                os.add_dll_directory(b)
                os.environ["PATH"] = b + os.pathsep + os.environ.get("PATH", "")


_dlls_nvidia()


def _pcm(arq):
    """Áudio em 16 kHz mono pelo ffmpeg: evita o leitor de áudio do faster-whisper (PyAV), que quebra entre versões."""
    import numpy
    r = subprocess.run([ffmpeg(), "-loglevel", "error", "-i", arq, "-vn", "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True, check=True)
    return numpy.frombuffer(r.stdout, numpy.float32)


def transcrever(arq, nome_modelo):
    from faster_whisper import WhisperModel
    for dev, tipo in (("cuda", "float16"), ("cpu", "int8")):
        if _modelo.get("falhou_" + dev):
            continue
        try:
            if (nome_modelo, dev) not in _modelo:
                _modelo[(nome_modelo, dev)] = WhisperModel(nome_modelo, device=dev, compute_type=tipo)
            seg, info = _modelo[(nome_modelo, dev)].transcribe(_pcm(arq), beam_size=5, vad_filter=True)
            linhas = ["- [%s] %s" % (tempo(s.start), s.text.strip()) for s in seg]   # a transcrição roda aqui
            print("  transcrito no", "processador" if dev == "cpu" else "placa de vídeo", flush=True)
            return info, linhas
        except Exception as e:
            if dev == "cpu":
                raise
            _modelo["falhou_cuda"] = True
            print("  placa de vídeo indisponível (%s); sigo no processador" % str(e)[:100], flush=True)


def ler_pdf(arq, lido, base):
    import pymupdf
    doc = pymupdf.open(arq)
    L = ["# %s" % os.path.basename(arq), "", "%d páginas. Página sem texto vira imagem: %s-pNN.jpg." % (len(doc), base), ""]
    imgs = 0
    for i, pg in enumerate(doc, 1):
        t = pg.get_text().strip()
        L += ["## Página %d" % i, ""]
        if len(t) < 80:
            png = os.path.join(lido, "%s-p%02d.jpg" % (base, i))
            pg.get_pixmap(dpi=90).save(png, jpg_quality=80)
            imgs += 1
            L += ["(imagem: %s)" % os.path.basename(png)]
        if t:
            L += [t]
        L += [""]
    return L, "%d páginas, %d como imagem" % (len(doc), imgs)


def ler_audio(arq, base, modelo):
    t0 = time.time()
    info, linhas = transcrever(arq, modelo)
    L = ["# %s" % os.path.basename(arq), "",
         "Transcrição local (faster-whisper %s), idioma %s, %s de áudio. Pode ter erros de nomes de cartas: confira no Scryfall." %
         (modelo, info.language, tempo(info.duration)), ""] + linhas
    return L, "%s de áudio em %d s" % (tempo(info.duration), time.time() - t0)


def ler_video(arq, lido, base, modelo):
    ff = ffmpeg()
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, "a.wav")
        subprocess.run([ff, "-y", "-loglevel", "error", "-i", arq, "-vn", "-ac", "1", "-ar", "16000", wav], check=True)
        L, res = ler_audio(wav, base, modelo)
    L[0] = "# %s" % os.path.basename(arq)
    for f in os.listdir(lido):
        if f.startswith(base + "-quadros"):
            os.remove(os.path.join(lido, f))
    subprocess.run([ff, "-y", "-loglevel", "error", "-i", arq, "-vf", "fps=1/%d,scale=640:-2,tile=3x3:padding=6:color=white" % QUADRO_S,
                    "-q:v", "4", os.path.join(lido, base + "-quadros%02d.jpg")], check=True)
    folhas = sorted(f for f in os.listdir(lido) if f.startswith(base + "-quadros"))
    L[2:2] = ["Quadros: um a cada %d s, 9 por folha, da esquerda para a direita: %s." % (QUADRO_S, ", ".join(folhas)), ""]
    return L, res + ", %d folhas de quadros" % len(folhas)


def tema(pasta, modelo, refazer):
    lido = os.path.join(pasta, "_lido")
    os.makedirs(lido, exist_ok=True)
    ctl_p = os.path.join(lido, "_controle.json")
    ctl = {} if refazer or not os.path.exists(ctl_p) else json.load(open(ctl_p, encoding="utf-8"))
    feitos = 0
    for f in sorted(os.listdir(pasta)):
        arq = os.path.join(pasta, f)
        ext = os.path.splitext(f)[1].lower()
        if not os.path.isfile(arq) or ext not in AUDIO + VIDEO + PDF:
            continue
        st = os.stat(arq)
        marca = "%d-%d" % (st.st_size, int(st.st_mtime))
        if ctl.get(f, {}).get("marca") == marca:
            print("  já lido:", f)
            continue
        base = os.path.splitext(f)[0]
        if sum(1 for g in os.listdir(pasta) if os.path.splitext(g)[0] == base and os.path.splitext(g)[1].lower() in AUDIO + VIDEO + PDF) > 1:
            base += "-" + ext[1:]   # PDF e vídeo com o mesmo nome não se sobrescrevem
        print("  lendo:", f, flush=True)
        try:
            if ext in PDF:
                L, res = ler_pdf(arq, lido, base)
            elif ext in AUDIO:
                L, res = ler_audio(arq, base, modelo)
            else:
                L, res = ler_video(arq, lido, base, modelo)
        except Exception as e:
            print("  FALHOU:", f, "|", e)
            continue
        open(os.path.join(lido, base + ".md"), "w", encoding="utf-8", newline="\n").write("\n".join(L) + "\n")
        ctl[f] = dict(marca=marca, lido=time.strftime("%Y-%m-%d"), resultado=res)
        json.dump(ctl, open(ctl_p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print("  ok:", res, flush=True)
        feitos += 1
    return feitos


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    a = sys.argv[1:]
    modelo = a[a.index("--modelo") + 1] if "--modelo" in a else "medium"
    refazer = "--refazer" in a
    nomes = [x for i, x in enumerate(a) if not x.startswith("--") and (i == 0 or a[i - 1] != "--modelo")]
    temas = nomes or sorted(d for d in os.listdir(RAIZ) if os.path.isdir(os.path.join(RAIZ, d)) and not d.startswith("_"))
    for t in temas:
        p = os.path.join(RAIZ, t)
        if not os.path.isdir(p):
            sys.exit("tema não encontrado: %s" % p)
        print(t)
        print("  %d arquivo(s) convertido(s)" % tema(p, modelo, refazer))


if __name__ == "__main__":
    main()

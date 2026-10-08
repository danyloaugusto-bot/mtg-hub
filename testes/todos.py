# -*- coding: utf-8 -*-
"""Roda todos os testes de um deck, em sequência, depois de montar o painel uma vez.

    python testes/todos.py --deck "02. Clavileño"

O teste de origem só roda para o Clavileño, que é o deck do painel que deu origem ao motor.
"""
import os, subprocess, sys
import comum

a = comum.argumentos("Todos os testes de um deck")
comum.html(a.deck, montar=not a.sem_montar)
aqui = os.path.dirname(os.path.abspath(__file__))
testes = ["contrato.py", "regressao.py", "publicada.py", "layout.py"] + (["origem.py"] if a.deck == "02. Clavileño" else [])
falhou = []
for t in testes:
    r = subprocess.run([sys.executable, "-B", os.path.join(aqui, t), "--deck", a.deck, "--sem-montar"], capture_output=True, text=True, encoding="utf-8")
    ultima = [l for l in r.stdout.splitlines() if l.startswith("resultado:")]
    print("%-14s %s" % (t, ultima[0] if ultima else "sem resultado"))
    if r.returncode:
        falhou.append(t)
        print(r.stdout[-3000:] + r.stderr[-2000:])
print("tudo certo" if not falhou else "falharam: " + ", ".join(falhou))
sys.exit(1 if falhou else 0)

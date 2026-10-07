import re, unicodedata, os, json
def slug(s):
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode()
    s=s.lower().replace("'","").replace(",","").replace(".","").replace(":","").replace("!","")
    return re.sub(r'[\s\-]+','_',s)
def parse_face(txt):
    d={}
    for line in txt.splitlines():
        for k in ("Name","ManaCost","Types","PT","Loyalty","Defense","Oracle","Colors","AlternateMode"):
            if line.startswith(k+":"):
                d.setdefault(k,line[len(k)+1:].strip())
    return d
def load(name):
    p=f"forge/{slug(name)}.txt"
    t=open(p,encoding='utf8').read()
    parts=re.split(r'\n\s*ALTERNATE\s*\n',t)
    faces=[parse_face(x) for x in parts]
    return faces
if __name__=="__main__":
    import sys
    for l in open('decklist.txt',encoding='utf8'):
        m=re.match(r'(\d+) (.+?) \((\w+)\) (\S+)(.*)',l.strip())
        n=m.group(2)
        for i,f in enumerate(load(n)):
            print(("  // " if i else "")+f"{f.get('Name')} | {f.get('ManaCost')} | {f.get('Types')} | {f.get('PT') or f.get('Loyalty') or f.get('Defense') or ''} | {f.get('AlternateMode','')}")
            print("      ", f.get('Oracle','').replace('\\n',' ¶ ')[:600])

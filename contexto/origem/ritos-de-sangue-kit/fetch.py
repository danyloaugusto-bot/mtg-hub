import re, unicodedata, subprocess, os, json, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
BASE="https://raw.githubusercontent.com/Card-Forge/forge/master/forge-gui/res/cardsfolder/"
DFC={
 "Agadeem's Awakening":"Agadeem, the Undercrypt",
 "Bloodline Keeper":"Lord of Lineage",
 "Brightclimb Pathway":"Grimclimb Pathway",
 "Edgar, Charmed Groom":"Edgar Markov's Coffin",
 "Glasswing Grace":"Age-Graced Chapel",
 "Henrika Domnathi":"Henrika, Infernal Seer",
 "Invasion of New Capenna":"Holy Frazzle-Cannon",
 "Legion's Landing":"Adanto, the First Fort",
 "Malakir Rebirth":"Malakir Mire",
 "Ojer Taq, Deepest Foundation":"Temple of Civilization",
 "Emeritus of Woe":"Demonic Tutor",
 "Scheming Silvertongue":"Sign in Blood",
}
def slug(s):
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode()
    s=s.lower().replace("'","").replace(",","").replace(".","").replace(":","").replace("!","")
    s=re.sub(r'[\s\-]+','_',s)
    return s
names=[]
for l in open('decklist.txt',encoding='utf8'):
    m=re.match(r'(\d+) (.+?) \((\w+)\) (\S+)(.*)',l.strip())
    names.append(m.group(2))
names += ["Saw in Half","Emeritus of Woe","Scheming Silvertongue","Tip the Scales","Vein Ripper","Cruel Celebrant","Indulgent Aristocrat","Champion of Dusk","Patriarch's Bidding","Haunting Voyage","Pitiless Plunderer","Falkenrath Noble","Sanctum Seeker","Kindred Dominance","Pact of the Serpent","Bloodtracker","Voldaren Bloodcaster","Kalitas, Traitor of Ghet","Sorin, Imperious Bloodlord","Crossway Troublemakers","Dreadhorde Invasion","Bolas's Citadel","Elenda and Azor","Sorin of House Markov","Vampire Nocturnus"]
miss=[]
for n in names:
    cands=[slug(n)]
    if n in DFC: cands.insert(0, slug(n)+"_"+slug(DFC[n]))
    ok=False
    for c in cands:
        out=f"forge/{slug(n)}.txt"
        if os.path.exists(out) and os.path.getsize(out)>30: ok=True;break
        url=BASE+c[0]+"/"+c+".txt"
        r=subprocess.run(["curl","-s","-m","25","-w","%{http_code}","-o",out,url],capture_output=True,text=True)
        if r.stdout.strip()=="200": ok=True;break
        else:
            if os.path.exists(out): os.remove(out)
    if not ok: miss.append(n)
print("missing:",miss)

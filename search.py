import json

def search(text, f):
     L=[]
     for i in range(len(f["publications"])):
         for j in f["publications"][i].keys():
              if text.strip() in f["publications"][i][j].strip():
                  L.append(i)
                  break
     return L

def records(text,file="data/Astrosat_Pubs.json"):
    f = json.load(open(file))
    indices=search(text,f)
    return json.dumps([f["publications"][i] for i in indices])
    
# print(search("NGC 2420",json.load(open("data/Astrosat_Pubs.json"))))
# print(records("NGC 2420"))

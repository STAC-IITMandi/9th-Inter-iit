import json

def search(text, file="data/Astrosat_Pubs.json"):
     f = json.load(open(file))
     L=[]
     for i in range(len(f["publications"])):
         for j in f["publications"][i].keys():
              if text.strip() in f["publications"][i][j].strip():
                  L.append(i)
                  break
     return L
         
print(search("NGC 2420"))
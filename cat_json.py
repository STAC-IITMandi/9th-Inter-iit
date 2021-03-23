# -*- coding: utf-8 -*-
"""
Created on Sat Mar 20 13:12:38 2021

@author: dell
"""

import cat_functions
import json
import os
import sys

def catA_json(data_dir = "data", Fields=['Type', 'RAh', 'RAm', 'RAs', 'DE-', 'DEd', 'DEm', 'DEs', 'GLON', 'GLAT']):
    A=cat_functions.catA(dir_name=data_dir)
    data=[]
    for i in range(280):
        data.append({'Name': A.index[i]})
        for field in Fields:
            data[-1].update({field: A[field][i]})
            
    objects={"objects":data}
    with open(os.path.join("data", "Dataset.json"), 'w') as f:
        json.dump(objects, f, indent=3)
    
def catB_json(data_dir = "data", Fields=['Name','Ra','Dec']):
    B=cat_functions.catB(dir_name=data_dir)
    data=[]
    for i in range(900):
        data.append({})
        for field in Fields:
            data[-1].update({field: B[field][i]})
            
    objects={"objects":data}
    with open(os.path.join("data", "Astrosat.json"), 'w') as f:
        json.dump(objects, f, indent=3)
    
    
def catC_json(data_dir = "data"):
    publications=cat_functions.catC(dir_name=data_dir)
    with open(os.path.join("data", "Astrosat_Pubs.json"), 'w') as f:
        json.dump(publications, f, indent=3)
        
def BtoC_json():
    B=json.load(open(os.path.join("data", "Astrosat.json")))
    C=json.load(open(os.path.join("data", "Astrosat_Pubs.json")))
    B = B['objects']
    C = C['publications']
    search=cat_functions.relateBtoC(B,C)
    with open(os.path.join("data", "BtoC.json"), 'w') as f:
        json.dump(search, f, indent=3)

if __name__ == "__main__" :
    try:
        data_dir_ = sys.argv[1]
        catA_json(data_dir = data_dir_)
        catB_json(data_dir = data_dir_)
        catC_json(data_dir = data_dir_)
    except:
        catA_json()
        catB_json()
        catC_json()

    BtoC_json()
# -*- coding: utf-8 -*-
"""
Created on Sat Mar 20 13:12:38 2021

@author: dell
"""

import cat_functions
import json

def catA_json(Fields=['Type', 'RAh', 'RAm', 'RAs', 'DE-', 'DEd', 'DEm', 'DEs', 'GLON', 'GLAT']):
    A=cat_functions.catA()
    data=[]
    for i in range(280):
        data.append({'Name': A.index[i]})
        for field in Fields:
            data[-1].update({field: A[field][i]})
            
    objects={"objects":data}
    with open("Dataset.json", 'w') as f:
        json.dump(objects, f, indent=3)
    
def catB_json(Fields=['Name','Ra','Dec']):
    B=cat_functions.catB()
    data=[]
    for i in range(280):
        data.append({})
        for field in Fields:
            data[-1].update({field: B[field][i]})
            
    objects={"objects":data}
    with open("Astrosat.json", 'w') as f:
        json.dump(objects, f, indent=3)
    
    
def catC_json():
    publications=cat_functions.catC()
    with open("Astrosat_Pubs.json", 'w') as f:
        json.dump(publications, f, indent=3)
        
catA_json()
catB_json()
catC_json()
# -*- coding: utf-8 -*-
"""
Created on Sat Mar 20 13:12:38 2021

@author: dell
"""

import cat_functions
import json

def catA_json(Fields=['Type', 'RAh', 'RAm', 'RAs', 'u_RAs', 'DE-', 'DEd', 'DEm', 'DEs', 'u_DEs', 'GLON', 'GLAT', 'Pos', 'e_Pos', 'Opt', 'r_Opt', 'Vmag', 'Vmagl', 'u_Vmag', 'B-V', 'u_B-V', 'B-Vl', 'U-B', 'l_E(B-V)', 'E(B-V)', 'l_E(B-V)2', 'E(B-V)2', 'u_E(B-V)', 'r_Vmag', 'l_Fx', 'Fx', 'Fxu', 'Range', 'r_Fx', 'Porb', 'Porb2', 'u_Porb', 'Ppulse', 'u_Ppulse', 'r_Ppulse', 'Cat', 'SpType', 'Name2',  'u_Name2', 'Name3']):
    A=cat_functions.catA()
    data=[]
    for i in range(280):
        data.append({'Name': A.index[i]})
        for field in Fields:
            data[-1].update({field: A[field][i]})
            
    objects={"objects":data}
    with open("Dataset.json", 'w') as f:
        json.dump(objects, f, indent=3)
    
def catB_json(Fields=['DnT','ProposalId','TargetID','Ra','Dec','Observation_Id','Source_Name','Instrument']):
    B=cat_functions.catB()
    data=[]
    for i in range(900):
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
        
def BtoC_json():
    B=json.load(open("Astrosat.json"))
    C=json.load(open("Astrosat_Pubs.json"))
    B = B['objects']
    C = C['publications']
    search=cat_functions.MatchingBtoC(B,C)
    with open("BtoC.json", 'w') as f:
        json.dump(search, f, indent=3)

def AtoB_json():
    A=json.load(open("Dataset.json"))
    B=json.load(open("Astrosat.json"))
    A = A['objects']
    B = B['objects']
    search = cat_functions.MatchingBtoA(A, B)
    with open('Dataset.json','w') as outfile:
        json.dump(search, outfile, indent=3)

catA_json()
catB_json()
catC_json()
BtoC_json()
AtoB_json()
#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
import numpy as np
import re
import json
import os
data = './data/'
os.chdir(data)

pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)
pd.set_option('display.max_colwidth', None)

def catA(fname='hmxbcat.dat', Fields=['Name','Type','RAh','RAm','RAs','u_RAs','DE_','DEd','DEm','DEs','u_DEs','GLOS','GLAT','Pos','e_Pos','Opt',
       'r_Opt','Vmag','Vmagl','u_Vmag','B_V','u_B_V','B_Vl','U_B','l_EB_V','EB_V','l_EB_V2','EB_V2','u_EB_V','r_Vmag',
       'l_Fx','Fx','Fxu','Range','RFx','Porb','Porb2','u_Porb','Ppulse','u_Ppulse','r_Ppulse','Cat','SpType','Name2',
       'u_Name2','Name3']):
    
    data=[]    
    with open(fname, "r") as f:  # binary mode
        all_data = f.readlines()
        for line in all_data:
            line = line.rstrip('\n')
            Name=line[1-1:16-1].strip(' ')
            Type=line[18-1:23-1].strip(' ')
            RAh=line[25-1:26-1].strip(' ')
            RAm=line[28-1:29-1].strip(' ')
            RAs=line[31-1:36-1].strip(' ')
            u_RAs=line[37-1].strip(' ')
            DE_=line[38-1].strip(' ')
            DEd=line[39-1:40-1].strip(' ')
            DEm=line[42-1:43-1].strip(' ')
            DEs=line[45-1:49-1].strip(' ')
            u_DEs=line[50-1].strip(' ')
            GLON=line[52-1:57-1].strip(' ')
            GLAT=line[59-1:66-1].strip(' ')
            Pos=line[68-1:71-1].strip(' ')
            e_Pos=line[73-1:79-1].strip(' ')
            Opt=line[81-1:97-1].strip(' ')
            __1=line[99-1].strip(' ')
            r_Opt=line[100-1:114-1].strip(' ')
            __2=line[115-1].strip(' ')
            Vmag=line[117-1:122-1].strip(' ')
            __3=line[123-1].strip(' ')
            Vmagl=line[124-1:128-1].strip(' ')
            u_Vmag=line[129-1].strip(' ')
            B_V=line[131-1:136-1].strip(' ')
            u_B_V=line[137-1].strip(' ')
            __4=line[138-1].strip(' ')
            B_Vl=line[139-1:142-1].strip(' ')
            U_B=line[144-1:148-1].strip(' ')
            l_EB_V=line[150-1].strip(' ')
            EB_V=line[151-1:156-1].strip(' ')
            __5=line[157-1].strip(' ')
            l_EB_V2=line[158-1:159-1].strip(' ')
            EB_V2=line[160-1:163-1].strip(' ')
            u_EB_V=line[164-1].strip(' ')
            __6=line[166-1].strip(' ')
            r_Vmag=line[167-1:182-1].strip(' ')
            __7=line[183-1].strip(' ')
            l_Fx=line[185-1].strip(' ')
            Fx=line[186-1:196-1].strip(' ')
            __8=line[197-1].strip(' ')
            Fxu=line[198-1:205-1].strip(' ')
            Range=line[207-1:220-1].strip(' ')
            __9=line[222-1].strip(' ')
            r_Fx=line[223-1:240-1].strip(' ')
            __10=line[241-1].strip(' ')
            Porb=line[243-1:252-1].strip(' ')
            __11=line[253-1].strip(' ')
            Porb2=line[254-1:257-1].strip(' ')
            u_Porb=line[258-1].strip(' ')
            Ppulse=line[260-1:270-1].strip(' ')
            u_Ppulse=line[271-1].strip(' ')
            __12=line[273-1].strip(' ')
            r_Ppulse=line[274-1:288-1].strip(' ')
            __13=line[289-1].strip(' ')
            Cat=line[291-1:315-1].strip(' ')
            SpType=line[317-1:328-1].strip(' ')
            Name2=line[330-1:342-1].strip(' ')
            u_Name2=line[343-1].strip(' ')
            try:
                __14=line[344-1].strip(' ')
                Name3=line[345-1:359-1].strip(' ')
            except IndexError as e:
                __14 = ''
                Name3 = ''
            data.append([x for x in (Name,Type,RAh,RAm,RAs,u_RAs,DE_,DEd,DEm,DEs,u_DEs,GLON,GLAT,Pos,e_Pos,Opt,r_Opt,Vmag,Vmagl,u_Vmag,B_V,u_B_V,B_Vl,U_B,l_EB_V,EB_V,l_EB_V2,EB_V2,u_EB_V,r_Vmag,l_Fx,Fx,Fxu,Range,r_Fx,Porb,Porb2,u_Porb,Ppulse,u_Ppulse,r_Ppulse,Cat,SpType,Name2,u_Name2,Name3)])
    return pd.DataFrame(data,columns=Fields).set_index(['Name'])

hmxb=catA('hmxbcat.dat')
lmxb=catA('lmxbcat.dat')

hmxb.to_csv('hmxbcat.csv',sep=';')
lmxb.to_csv('lmxbcat.csv',sep=';')

def catB(fname="AS_observations_cat_Sept2018.txt",length=900,Fields=['Id','DnT','ObsId','Obs','Ra','Dec','ObsName','Name','Sat']):
    data=[]
    with open(fname, "r") as f:
        for i in range(900):
            data.append(re.split('\t|::|\n',f.readline())[:-1])
    return pd.DataFrame(data,columns=Fields).set_index(['Id'])

astrosat=catB()
astrosat.to_csv("Astrosat_Obs.csv")

def catC(fname="AS_publications2019-21.txt"):
    with open(fname,'r',encoding='utf8') as f:
        data=[ [y for y in x.split('\n ') if y.lstrip() != ''] for x in list(f.read().split('\n\n\n'))]

    data_dict=[]
    for i in range(len(data)):
        data_dict.append({})
        for cell in range(len(data[i])):
            key=data[i][cell].lstrip().partition(':')[0]
            data_dict[i].update({key : data[i][cell].lstrip().partition(':')[2].lstrip()})
    final_data = {'articles':data_dict}
    return final_data

publications=catC()

with open("Astrosat_Pubs.json", 'w') as f:
    json.dump(publications, f, indent=3)





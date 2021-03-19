# -*- coding: utf-8 -*-
"""
Created on Fri Mar 19 20:35:32 2021

@author: dell
"""

import pandas as pd
import numpy as np
pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)
pd.set_option('display.max_colwidth', None)

def catA(fname='hmxbcat.dat', length=119):
    Fields=['Name','Type','RAh','RAm','RAs','u_RAs','DE_','DEd','DEm','DEs','u_DEs','GLOS','GLAT','Pos','e_Pos','Opt',
       'r_Opt','Vmag','Vmagl','u_Vmag','B_V','u_B_V','B_Vl','U_B','l_EB_V','EB_V','l_EB_V2','EB_V2','u_EB_V','r_Vmag',
       'l_Fx','Fx','Fxu','Range','RFx','Porb','Porb2','u_Porb','Ppulse','u_Ppulse','r_Ppulse','Cat','SpType','Name2',
       'u_Name2','Name3']
    data=[]
    with open("D:/Inter-IIT-Astro/J_A+AS_147_25/"+fname, "rb") as f:  # binary mode
        for i in range(length):
            Name=f.read(16);f.read(1)
            Type=f.read(6);f.read(1)
            RAh=f.read(2);f.read(1)
            RAm=f.read(2);f.read(1)
            RAs=f.read(6)
            u_RAs=f.read(1)
            DE_=f.read(1)
            DEd=f.read(2);f.read(1)
            DEm=f.read(2);f.read(1)
            DEs=f.read(5)
            u_DEs=f.read(1);f.read(1)
            GLON=f.read(6);f.read(1)
            GLAT=f.read(8);f.read(1)
            Pos=f.read(4);f.read(1)
            e_Pos=f.read(7);f.read(1)
            Opt=f.read(17);f.read(1)
            __1=f.read(1)
            r_Opt=f.read(15)
            __2=f.read(1);f.read(1)
            Vmag=f.read(6)
            __3=f.read(1)
            Vmagl=f.read(5)
            u_Vmag=f.read(1);f.read(1)
            B_V=f.read(6)
            u_B_V=f.read(1)
            __4=f.read(1)
            B_Vl=f.read(4);f.read(1)
            U_B=f.read(5);f.read(1)
            l_EB_V=f.read(1)
            EB_V=f.read(6)
            __5=f.read(1)
            l_EB_V2=f.read(2)
            EB_V2=f.read(4)
            u_EB_V=f.read(1);f.read(1)
            __6=f.read(1)
            r_Vmag=f.read(16)
            __7=f.read(1);f.read(1)
            l_Fx=f.read(1)
            Fx=f.read(11)
            __8=f.read(1)
            Fxu=f.read(8);f.read(1)
            Range=f.read(14);f.read(1)
            __9=f.read(1)
            r_Fx=f.read(18)
            __10=f.read(1);f.read(1)
            Porb=f.read(10)
            __11=f.read(1)
            Porb2=f.read(4)
            u_Porb=f.read(1);f.read(1)
            Ppulse=f.read(11)
            u_Ppulse=f.read(1);f.read(1)
            __12=f.read(1)
            r_Ppulse=f.read(15)
            __13=f.read(1);f.read(1)
            Cat=f.read(25);f.read(1)
            SpType=f.read(12);f.read(1)
            Name2=f.read(13)
            u_Name2=f.read(1)
            __14=f.read(1)
            Name3=f.read(15)
            f.readline()
            data.append([x.decode('utf-8').replace(' ','') for x in (Name,Type,RAh,RAm,RAs,u_RAs,DE_,DEd,DEm,DEs,u_DEs,GLON,GLAT,Pos,e_Pos,Opt,r_Opt,Vmag,Vmagl,u_Vmag,B_V,u_B_V,B_Vl,U_B,l_EB_V,EB_V,l_EB_V2,EB_V2,u_EB_V,r_Vmag,l_Fx,Fx,Fxu,Range,r_Fx,Porb,Porb2,u_Porb,Ppulse,u_Ppulse,r_Ppulse,Cat,SpType,Name2,u_Name2,Name3)])
    return pd.DataFrame(data,columns=Fields)
    
hmxb=catA('hmxbcat.dat',130)
lmxb=catA('lmxbcat.dat',150)
print(type(hmxb))
print("\n\n")
print(hmxb.iloc[0])
print("\n\n")
print(lmxb.iloc[0])

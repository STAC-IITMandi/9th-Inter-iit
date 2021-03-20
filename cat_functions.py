# Python

import pandas as pd
import numpy as np
import re
import json
import os
os.chdir('data')


# This file is used to process data and returns three dataframes, for catalog A, B and C
def catA(fname = ['hmxbcat.dat', 'lmxbcat.dat'], repDlm = [17, 24, 27, 30, 41, 44, 51, 58, 67, 72, 80, 98, 116, 130, 143, 149, 165, 184, 206, 221, 242, 259, 272, 290, 316, 329], insDlm = [36, 37, 38, 49, 122, 123, 128, 136, 137, 138, 150, 156, 157, 159, 163, 185, 196, 197, 252, 253, 257, 270, 342, 343, 344], Fields = ['Name', 'Type', 'RAh', 'RAm', 'RAs', 'u_RAs', 'DE-', 'DEd', 'DEm', 'DEs', 'u_DEs', 'GLON', 'GLAT', 'Pos', 'e_Pos', 'Opt', 'r_Opt', 'Vmag', '---', 'Vmagl', 'u_Vmag', 'B-V', 'u_B-V', '---', 'B-Vl', 'U-B', 'l_E(B-V)', 'E(B-V)', '---', 'l_E(B-V)2', 'E(B-V)2', 'u_E(B-V)', 'r_Vmag', 'l_Fx', 'Fx', '---', 'Fxu', 'Range', 'r_Fx', 'Porb', '---', 'Porb2', 'u_Porb', 'Ppulse', 'u_Ppulse', 'r_Ppulse', 'Cat', 'SpType', 'Name2',  'u_Name2', '---', 'Name3']):
    """
    This function reads catalog A (consisting of hxmbcat.dat and lmxbcat.dat)
    and
    returns a dataframe consisting of 52 columns and 280 rows which can be used further.
    """
    data = []
    for file in fname:
        file = open(file)
        data += file.readlines()
        file.close()
    
    def repChar(str, pos, char):
        '''This function replaces <pos> with <char> at a specific position in a string <str>.'''
        str = str[:pos] + char + str[pos + 1:]
        return str

    def insertChar(str, pos, char):
        '''This inserts <char> next to the position <pos> in string <str>'''
        str = str[:pos + 1] + char + str[pos + 1:]
        return str
    for i in range(len(data)):
        temp = data[i]
        for delimiter in repDlm:
            temp = repChar(temp, delimiter - 1, '$')
        for delimiter in insDlm:
            temp = insertChar(temp, delimiter -1 + insDlm.index(delimiter), '$')
        data[i] = temp

    for i in range(len(data)):
        data[i] = np.array([i.strip() for i in data[i].split('$')])
    
    return pd.DataFrame(data, columns = Fields).set_index(['Name'])


def catB(fname="AS_observations_cat_Sept2018.txt",length=900,Fields=['Id','DnT','ObsId','Obs','Ra','Dec','ObsName','Name','Sat']):
    """
        Convert catalog B to json, add ROSAT name
    """
    def radeg2hms(ra):
        h = ra//15
        m = ra - (h * 15)
        m *= 4
        m = int(m)
        s = ra - (h * 15) - (m / 4)
        s *= 240
        return (h, m, s)

    def decdeg2dms(dd):
        negative = dd < 0
        dd = abs(dd)
        minutes,seconds = divmod(dd*3600,60)
        degrees,minutes = divmod(minutes,60)
        if negative:
            if degrees > 0:
                degrees = -degrees
            elif minutes > 0:
                minutes = -minutes
            else:
                seconds = -seconds
        return (degrees,minutes,seconds)

    def RADECtoROSAT(data, j2000=True):
        rah, ram, ras, decd, decm, decs = list(data)
        if j2000:
            hh = int(rah)
            
            mm = ram + ras/60
            mm = f"{mm:04.1f}"
            mm = float(mm)
            
            final = f"J{hh:02d}"
            
            if mm == int(mm):
                final += f"{int(mm):02d}"
            else:
                final += f"{mm:04.1f}"
        
            dd = int(decd)
            
            if dd < 0:
                dd = abs(dd)
                final += f"-{dd:02d}"
            else:
                dd = abs(dd)
                final += f"+{dd:02d}"
            
            mm = decm + decs/60
            mm = int(mm)
            final += f"{mm:02d}"
            return final

    data=[]
    with open(fname, "r") as f:
        for i in range(900):
            data.append([i.strip() for i in re.split('\t|::|\n',f.readline())[:-1]])

    data = pd.DataFrame(data,columns=Fields).set_index(['Id'])

    data['Ra'] = data['Ra'].apply(pd.to_numeric)
    data['Rah'], data['Ram'], data['Ras'] = zip(*data['Ra'].apply(radeg2hms))

    data['Dec'] = data['Dec'].apply(pd.to_numeric)
    data['Decd'], data['Decm'], data['Decs'] = zip(*data['Dec'].apply(decdeg2dms))

    data['ROSAT'] = data[['Rah', 'Ram', 'Ras', 'Decd', 'Decm', 'Decs']].apply(RADECtoROSAT, axis=1)
    
    return data

def catC(fname="AS_publications2019-21.txt"):
    """
        Convert catalog C to json
    """
    with open(fname,'r',encoding='utf8') as f:
        data=[ [y for y in x.split('\n ') if y.lstrip() != ''] for x in list(f.read().split('\n\n\n'))]

    data_dict=[]
    for i in range(len(data)):
        data_dict.append({})
        for cell in range(len(data[i])):
            key=data[i][cell].lstrip().partition(':')[0]
            data_dict[i].update({key : data[i][cell].lstrip().partition(':')[2].lstrip()})
    final_data = {'publications':data_dict}
    return final_data

def relateBtoC(B, C):
    """
        Searches observations in B, and returns a dict of which source is in which publication.
    """
    my_search = dict()
    for obj in B:
        if obj:
            name = obj['Name']
            my_search[name] = []
            for index, pub in enumerate(C):
                if pub:
                    searches = [str(i).lower() for i in [pub['Title'], pub['Keywords'], pub['Abstract']]]
                    for s in searches:
                        if name.lower() in s:
                            # object exist
                            my_search[name].append(index)
                            break

    final = []
    for key, val in my_search.items():
        if val != []:
            final.append((key, val))
    final = dict(final)
    return final

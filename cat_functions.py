# Python

import os
import re
import json
import numpy as np
import pandas as pd
from astropy.coordinates import SkyCoord, FK5
os.chdir('data')


# This file is used to process data and returns three dataframes, for catalog A, B and C
def catA(fname = ['hmxbcat.dat', 'lmxbcat.dat'], repDlm = [17, 24, 27, 30, 41, 44, 51, 58, 67, 72, 80, 98, 116, 130, 143, 149, 165, 184, 206, 221, 242, 259, 272, 290, 316, 329], insDlm = [36, 37, 38, 49, 122, 123, 128, 136, 137, 138, 150, 156, 157, 159, 163, 185, 196, 197, 252, 253, 257, 270, 342, 343, 344], Fields = ['Name', 'Type', 'RAh', 'RAm', 'RAs', 'u_RAs', 'DE-', 'DEd', 'DEm', 'DEs', 'u_DEs', 'GLON', 'GLAT', 'Pos', 'e_Pos', 'Opt', 'r_Opt', 'Vmag', '---', 'Vmagl', 'u_Vmag', 'B-V', 'u_B-V', '---', 'B-Vl', 'U-B', 'l_E(B-V)', 'E(B-V)', '---', 'l_E(B-V)2', 'E(B-V)2', 'u_E(B-V)', 'r_Vmag', 'l_Fx', 'Fx', '---', 'Fxu', 'Range', 'r_Fx', 'Porb', '---', 'Porb2', 'u_Porb', 'Ppulse', 'u_Ppulse', 'r_Ppulse', 'Cat', 'SpType', 'Name2',  'u_Name2', '---', 'Name3']):
    '''This function reads catalog A (consisting of hxmbcat.dat and lmxbcat.dat) and returns a dataframe consisting of 52 columns and 280 rows which can be used further.'''
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


def catB(fname="AS_observations_cat_Sept2018.txt",length=900,Fields=['Id','DnT','ProposalId','TargetID','Ra','Dec','Observation_Id','Source_Name','Instrument']):
    data=[]
    with open(fname, "r") as f:
        for i in range(900):
            data.append([i.strip() for i in re.split(r'\t|::|\n',f.readline())[:-1]])
    return pd.DataFrame(data,columns=Fields).set_index(['Id'])

def catC(fname="AS_publications2019-21.txt"):
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

def MatchingBtoC(B, C):
    """
        Searches observations in B, and returns a dict of which source is in which publication.
    """
    my_search = dict()
    for obj in B:
        if obj:
            name = obj['Source_Name']
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

def MatchingBtoA(A, B):
    
    # Conversion of J2000 RA/DEC coordinates to Galactic Lat and Long
    for dct in B:
        cd = SkyCoord(ra=float(dct['Ra']), dec=float(dct['Dec']), unit='deg', frame=FK5, equinox='J2000')
        gc = cd.transform_to('galactic')
        dct['glon'] = str(round(gc.l.degree,1))
        dct['glat'] = str(round(gc.b.degree,1))

    """
    Matching Catlog A and B for Astrosat Observations
    and Transferring matched sources' data from B to A
    """

    for d1 in A:
        flag = True
        for d2 in B:            
            if float(d1['GLON']) == float(d2['glon']) and float(d1['GLAT']) == float(d2['glat']):
                d1['Astrosat_obs'] ='Yes'
                d1['Source Name'] = d2['Source_Name']
                d1['Astrosat Instrument'] = d2['Instrument']
                d1['Date and Time'] = d2['DnT']
                d1['Observation_Id'] = d2['Observation_Id']
                d1['ProposalId'] = d2['ProposalId']
                d1['TargetId'] = d2['TargetID']
                flag = False
        if flag: 
            d1['Astrosat_obs']='No'

    return A


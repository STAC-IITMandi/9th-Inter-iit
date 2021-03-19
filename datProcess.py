#python
import os
import pandas as pd
os.chdir('data')
file = open('hmxbcat.dat')

data = file.readlines()
file.close()
def repChar(str, pos, char):
    '''This function replaces <pos> with <char> at a specific position in a string <str>.'''
    str = str[:pos] + char + str[pos + 1:]
    return str

def insertChar(str, pos, char):
    '''This inserts <char> next to the position <pos> in string <str>'''
    str = str[:pos + 1] + char + str[pos + 1:]
    return str

replCommas = [17, 24, 27, 30, 41, 44, 51, 58, 67, 72, 80, 98, 116, 130, 143, 149, 165, 184, 206, 221, 242, 259, 272, 290, 316, 329] # this is list of indexes where we need to replace some char with comma.
insComma = [36, 37, 49, 50, 122, 123, 128, 136, 137, 138, 150, 156, 157, 159, 163, 185, 196, 197, 252, 253, 257, 270, 342, 343, 344] # This is a list of indexed, where we need to put comma next to this index.
for i in range(len(data)):
    temp = data[i]
    for delimiter in replCommas:
        temp = repChar(temp, delimiter - 1, ',')
    for delimiter in insComma:
        temp = insertChar(temp, delimiter -1 + insComma.index(delimiter), ',')
    data[i] = temp

Fields = ['Name', 
'Type',
'RAh',
'RAm',
'RAs',
'u_RAs',
'DE-',
'DEd',
'DEm',
'DEs',
'u_DEs',
'GLON',
'GLAT',
'Pos',
'e_Pos',
'Opt',
'r_Opt',
'Vmag',
'---',
'Vmagl',
'u_Vmag',
'B-V',
'u_B-V',
'---',
'B-Vl',
'U-B',
'l_E(B-V)',
'E(B-V)',
'---',
'l_E(B-V)2',
'E(B-V)2',
'u_E(B-V)',
'r_Vmag',
'l_Fx',
'Fx',
'---',
'Fxu',
'Range',
'r_Fx',
'Porb',
'---',
'Porb2',
'u_Porb',
'Ppulse',
'u_Ppulse',
'r_Ppulse',
'Cat',
'SpType',
'Name2', 
'u_Name2',
'---',
'Name3']
for i in range(len(data)):
    data[i] = data[i].split(',')

import numpy as np
data = np.array(data, dtype = object)
print(data)
# print(pd.DataFrame(data, columns = Fields))

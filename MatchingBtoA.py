import json
from astropy.coordinates import SkyCoord,FK5
f=open('Astrosat.json','r')
astro_data=json.load(f)
#Conversion of J2000 RA/DEC coordinates to Galactic Lat and Long
for dct in astro_data['objects']:
    cd=SkyCoord(ra=float(dct['Ra']),dec=float(dct['Dec']),unit='deg',frame=FK5,equinox='J2000')
    gc=cd.transform_to('galactic')
    dct['glon']=str(round(gc.l.degree,1));dct['glat']=str(round(gc.b.degree,1))

cosmic_data=json.load(open('Dataset.json','r'))
#Matching Catlag A and B for Astrosat Observations
#and Transferring matched sources' data from B to A
for d1 in cosmic_data['objects']:
    flag=True
    for d2 in astro_data['objects']:            
        if float(d1['GLON'])==float(d2['glon']) and float(d1['GLAT'])==float(d2['glat']):
            d1['Astrosat_obs']='Yes';d1['Name 2']=d2['Source_Name']
            d1['Astrosat Instrument']=d2['Instrument']
            d1['Date and Time']=d2['DnT'];d1['Observation_Id']=d2['Observation_Id']
            d1['ProposalId']=d2['ProposalId'];d1['TargetId']=d2['TargetID']
            flag=False
    if flag: 
        d1['Astrosat_obs']='No'
'''
with open('Dataset.json','w') as outfile:
    json.dump(cosmic_data,outfile)
'''   
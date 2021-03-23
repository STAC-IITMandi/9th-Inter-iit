## Introduction

Astrosat was launched on September 28, 2015 for studing cosmic sources in different in different spectral bands like X-ray, optical and UV. Thus the processing of the data would be helpful to scientists for identifying various characteristics of the celestial sources.

### Problem Statement

The problem involves developing a visualization tool for identifying the characteristics of a given cosmic source. The Catalog shared would be AstroSat observations products.

### Data Processing

We were given three catalogs A, B and C consisting of cosmic sources, astrosat data and publications respectively.

In general the data processing consisted of conversion of given data to a high performance data structure for calculations. (we used Pandas DataFrame and Numpy Array in `Python`)
We converted it to JSON (Java Script Object Notation) format to use the data in our web application.

To check which of the cosmic sources from catalog A were observed by the AstroSat, we compared their coordinates.

ADD HERE..

### Web Application

To run the web application you can either directly launch the executable given or use `npm`. Please check the readme file to install the necessary dependencies.

When you run the web app, you can access it at `https://127.0.0.1:8080`.

The web app will consist a plot of aitoff projection of the sky map. We used the galatic coordinates to plot all the sources.

ADD SS OF OPENING INCLUDING THE ZOOM BUTTON ETC

You can see the legend at the right which tells you whether a cosmic source was observed by the AstroSat or not. You can click on them to only display the selected. You can zoom in the graph using the scroll bar.

The web app allows you to click on any source and download the related data.

ADD SS OF BUTTONS ETC

You can download the given data from catalog about a source in three different format.

ADD SS ?

And you can see the proposal ID and the publications.

#### Scalibility

ADD

#### Used Technologies

All the technologies used were open sources. We used Python, Node JS, npm, ADD HERE

### Minimum Requirements

ADD HERE....
Web Browser -

Python - 3.6+ <- Please check this

OS -

Node js -

npm -

## Conclusion

We would like to thank

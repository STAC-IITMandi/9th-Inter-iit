## Introduction

Astrosat was launched on September 28, 2015 for studying cosmic sources in different spectral bands like X-ray, optical and UV. Thus the processing of the data would be helpful to scientists for identifying various characteristics of the celestial sources.

### Problem Statement

The problem involves developing a visualization tool for identifying the characteristics of a given cosmic source. The Catalog shared would be AstroSat observations products.

### Data Processing

We were given three catalogs A, B and C consisting of cosmic sources, astrosat data and publications respectively.

**Catalogue A**: This is catalogue of observed cosmic sources from observations different from [Astrosat](https://www.isro.gov.in/astrosat-0).

**Catalogue B**: This is catalogue of cosmic sources observed by [Astrosat](https://www.isro.gov.in/astrosat-0).

**Catalogue C**: This is a catalogue of available publications/information about cosmic sources.

In general the data processing consisted of conversion of given data to a high performance data structure for calculations. We used Pandas DataFrame and Numpy Array in `Python` and finally converted the dataset to JSON in order to use this in our NodeJS application.

To check which of the cosmic sources from catalog A were observed by the AstroSat, we compared their galactic lattitude and longitude coordinates. And we searched the names of objects, which were there in Catalogue A and B both, with the objects in catalogue C.

### Web Application

To run the web application you can

* directly launch the executable given.
* use `npm` to run the web application locally (Please check the readme file to install the necessary dependencies).

When you run the web app, you can access it at `https://127.0.0.1:8080`.

The web app consists a plot of aitoff projection of the sky map. We used the galatic coordinates to plot all the sources.

Here is a look of web application

![9thinteriit](https://user-images.githubusercontent.com/63332774/112233135-d8157a00-8c5f-11eb-9d78-de9636dfdd4e.png)

You can see the legend at the right which tells you whether a cosmic source was observed by the AstroSat or not. You can click on them to only display the selected. You can zoom in the graph using the scroll bar.

The web app allows you to click on any source and download the related data.

ADD SS OF BUTTONS ETC

You can download the given data from catalog about a source in three different format.

ADD SS ?

And you can see the proposal ID and the publications.

#### Scalibility

ADD

#### Used Technologies

We used Javascript and Python programming languages. We also used several frameworks - 

1. jQuery 3.4.1 - for handling DOM Manipulation
2. Bootstrap 4.4.1 - for styling the document.
3. jsPDF, FileSave, json2csv - for converting JSON object to PDF, JSON, CSV formats.
4. pkg - for packaging the app to executable.
5. npm - for installing the frameworks.
6. express - for handling the server.
7. pandas, numpy - for data structures.

### Minimum Requirements

The app was tested on the following :-

Web Browser - Google Chrome 89

Python - 3.6+

OS - Ubuntu 20.04

npm - v6.14.11

## Conclusion

We would like to thank the Inter IIT team for the organization, ISRO for preparing the problem and the open source community without this would not have been possible.

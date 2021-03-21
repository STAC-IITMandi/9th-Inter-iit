# Python

import pandas as pd
import numpy as np
import re
import json
import os

os.chdir("data")


# This file is used to process data and returns three dataframes, for catalog A, B and C
def catA(
    fname=["hmxbcat.dat", "lmxbcat.dat"],
    repDlm=[
        17,
        24,
        27,
        30,
        41,
        44,
        51,
        58,
        67,
        72,
        80,
        98,
        116,
        130,
        143,
        149,
        165,
        184,
        206,
        221,
        242,
        259,
        272,
        290,
        316,
        329,
    ],
    insDlm=[
        36,
        37,
        38,
        49,
        122,
        123,
        128,
        136,
        137,
        138,
        150,
        156,
        157,
        159,
        163,
        185,
        196,
        197,
        252,
        253,
        257,
        270,
        342,
        343,
        344,
    ],
    Fields=[
        "Name",
        "Type",
        "RAh",
        "RAm",
        "RAs",
        "u_RAs",
        "DE-",
        "DEd",
        "DEm",
        "DEs",
        "u_DEs",
        "GLON",
        "GLAT",
        "Pos",
        "e_Pos",
        "Opt",
        "r_Opt",
        "Vmag",
        "---",
        "Vmagl",
        "u_Vmag",
        "B-V",
        "u_B-V",
        "---",
        "B-Vl",
        "U-B",
        "l_E(B-V)",
        "E(B-V)",
        "---",
        "l_E(B-V)2",
        "E(B-V)2",
        "u_E(B-V)",
        "r_Vmag",
        "l_Fx",
        "Fx",
        "---",
        "Fxu",
        "Range",
        "r_Fx",
        "Porb",
        "---",
        "Porb2",
        "u_Porb",
        "Ppulse",
        "u_Ppulse",
        "r_Ppulse",
        "Cat",
        "SpType",
        "Name2",
        "u_Name2",
        "---",
        "Name3",
    ],
):
    """This function reads catalog A (consisting of hxmbcat.dat and lmxbcat.dat) and returns a dataframe consisting of 52 columns and 280 rows which can be used further."""
    data = []
    for file in fname:
        file = open(file)
        data += file.readlines()
        file.close()

    def repChar(str, pos, char):
        """This function replaces <pos> with <char> at a specific position in a string <str>."""
        str = str[:pos] + char + str[pos + 1 :]
        return str

    def insertChar(str, pos, char):
        """This inserts <char> next to the position <pos> in string <str>"""
        str = str[: pos + 1] + char + str[pos + 1 :]
        return str

    for i in range(len(data)):
        temp = data[i]
        for delimiter in repDlm:
            temp = repChar(temp, delimiter - 1, "$")
        for delimiter in insDlm:
            temp = insertChar(temp, delimiter - 1 + insDlm.index(delimiter), "$")
        data[i] = temp

    for i in range(len(data)):
        data[i] = np.array(data[i].split("$"))

    return pd.DataFrame(data, columns=Fields).set_index(["Name"])


def catB(
    fname="AS_observations_cat_Sept2018.txt",
    length=900,
    Fields=["Id", "DnT", "ObsId", "Obs", "Ra", "Dec", "ObsName", "Name", "Sat"],
):
    data = []
    with open(fname, "r") as f:
        for i in range(900):
            data.append(re.split("\t|::|\n", f.readline())[:-1])
    return pd.DataFrame(data, columns=Fields).set_index(["Id"])


def catC(fname="AS_publications2019-21.txt"):
    with open(fname, "r", encoding="utf8") as f:
        data = [
            [y for y in x.split("\n ") if y.lstrip() != ""]
            for x in list(f.read().split("\n\n\n"))
        ]

    data_dict = []
    for i in range(len(data)):
        data_dict.append({})
        for cell in range(len(data[i])):
            key = data[i][cell].lstrip().partition(":")[0]
            data_dict[i].update(
                {key: data[i][cell].lstrip().partition(":")[2].lstrip()}
            )
    final_data = data_dict  # publications
    return pd.DataFrame.from_dict(final_data)


# catalog objects
df_a = catA().reset_index()
b = catB()
c = catC()


def plot_data(df):
    df = df[["Name", "GLON", "GLAT"]]
    return df


def plot_info_data(df):
    df = df[
        [
            "Name",
            "Type",
            "RAh",
            "RAm",
            "RAs",
            "DE-",
            "DEd",
            "DEs",
            "Opt",
            "Vmag",
            "B-V",
            "Fx",
            "Cat",
            "GLON",
            "GLAT",
        ]
    ]
    return df.set_index("Name")


coord = plot_data(df_a)
coord_info = plot_info_data(df_a)

## saving dataframe in json file
coord.to_json("coordinates.json", indent=4, orient="records")
coord_info.to_json("coordinates_info.json", indent=4, orient="records")
b.to_json("Astrosat.json", indent=4, orient="records")
c.to_json("Astrosat_Pubs.json", indent=4, orient="records")

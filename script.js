const url = "/dataset";
const { Parser } = window.json2csv;

// Grid
// right asc.
const grid_ra_x = [-180, -150, -120, -90, -60, -30,
    0,
    30,
    60,
    90,
    120,
    150,
    180,
];
const grid_ra_y = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const grid_ra_hovtext = [
    "180°",
    "-150°",
    "-120°",
    "-90°",
    "-60°",
    "-30°",
    "0°",
    "30°",
    "60°",
    "90°",
    "120°",
    "150°",
    "180°",
];

const grid_ra_textposition = [
    "middle center",
    "middle center",
    "middle center",
    "middle center",
    "middle center",
    "middle center",
    "middle center",
    "middle center",
    "middle center",
    "middle center",
    "middle center",
    "middle center",
];

// dec
const grid_dec_x = [0, 0, 0, 0, 0, 0, 0];
const grid_dec_y = [-90, -60, -30, 0, 30, 60, 90];
const grid_dec_hovtext = ["-90°", "-60°", "-30°", "0°", "+30°", "+60°", "+90°"];
const grid_dec_textposition = [
    "top center",
    "middle center",
    "middle center",
    "middle center",
    "middle center",
    "middle center",
    "bottom center",
];

let graph = document.getElementById("graph");

Plotly.d3.json(url, function(figure) {
    function unpack(rows, key) {
        return rows.map(function(row) {
            // console.log("in unpack",row);
            return row[key];
        });
    }
    // unpack_glat to extract Galactic latitudes
    function unpack_glat(rows, key) {
        return rows.map(function(row) {
            return parseFloat(row[key]);
        });
    }
    // unpack_glon to extract Galactic longitudes
    function unpack_glon(rows, key) {
        return rows.map(function(row) {
            let current_lon = parseFloat(row[key]);
            if (current_lon > 180.0) {
                current_lon -= 360.0;
            }
            return current_lon;
        });
    }

    let { astro, not_astro } = figure;

    let hover_template =
        "Lon: %{lon}<br>Lat: %{lat}<br>Name: %{text}<br>Astrosat Observed: %{customdata}";
    let trace = [{
            mode: "markers",
            name: "Sources (Observed by AstroSat)",
            type: "scattergeo",
            lon: unpack_glon(astro, "GLON"), // calling unpack_glon function
            lat: unpack_glat(astro, "GLAT"), // calling unpack_glat function
            customdata: unpack(astro, "Astrosat_obs"),
            text: unpack(astro, "Name"),
            hovertemplate: hover_template,
            hoverlabel: { namelength: 0 },
            marker: {
                symbol: "star",
                size: 8,
                color: "red",
            },
        },
        {
            mode: "markers",
            name: "Sources (Not observed by Astrosat)",
            type: "scattergeo",
            lon: unpack_glon(not_astro, "GLON"), // calling unpack_glon function
            lat: unpack_glat(not_astro, "GLAT"), // calling unpack_glat function
            customdata: unpack(not_astro, "Astrosat_obs"),
            text: unpack(not_astro, "Name"),
            hovertemplate: hover_template,
            hoverlabel: { namelength: 0 },
            marker: {
                symbol: "star",
                size: 8,
                color: "#85c1e9 ",
            },
        },
        {
            // Grid RA
            type: "scattergeo",
            mode: "text",
            lon: grid_ra_x,
            lat: grid_ra_y,
            text: grid_ra_hovtext,
            hoverinfo: "none",
            textfont: {
                size: 8,
                color: "#696969",
            },
            textposition: grid_ra_textposition,
            showlegend: false,
        },
        {
            // Grid Dec
            type: "scattergeo",
            mode: "text",
            lon: grid_dec_x,
            lat: grid_dec_y,
            text: grid_dec_hovtext,
            hoverinfo: "none",
            textfont: {
                size: 8,
                color: "#696969",
            },
            textposition: grid_dec_textposition,
            showlegend: false,
        },
    ];

    let layout = {
        title: "",
        geo: {
            projection: {
                type: "aitoff",
            },
            lonaxis: {
                showgrid: true,
                tick0: 0,
                dtick: 15,
                gridcolor: "#aaa",
                gridwidth: 1,
            },
            lataxis: {
                showgrid: true,
                tick0: 90,
                dtick: 30,
                gridcolor: "#aaa",
                gridwidth: 1,
            },
            showcoastlines: false,
            showland: false,
            showrivers: false,
            showlakes: false,
            showocean: false,
            showcountries: false,
            showsubunits: false,
            bgcolor:  'rgba(0,0,0,0)',
        },
        yaxis: { title: "LAT" },
        xaxis: { title: "LON" },
        font: {
            size: 24,
        },
        margin: {
            l:0,
            r:0,
            t:0,
            b:0,
        },
        paper_bgcolor: "transparent",
        // plot_bgcolor: "#f4fbfe",
        autosize: true,
    };

    var config = { responsive: true };

    Plotly.plot(graph, trace, layout, config, {
        displayModeBar: true,
        showlegend: true,
        legend: {
            x: 1,
            y: 0.5,
        },
    });
    let previous_state = "";
    const pdf_config = {
        startY: false,
        theme: "grid",
        columnWidth: "wrap",
        showHeader: "everyPage",
        columnStyles: {
            0: { columnWidth: "100" },
        },
        headerStyles: { theme: "grid" },
        styles: {
            overflow: "linebreak",
            columnWidth: "100",
            font: "arial",
            fontSize: 10,
            cellPadding: 4,
            overflowColumns: "linebreak",
        },
    };
    graph.on("plotly_click", function(data) {
        const { curveNumber, pointNumber } = data.points[0];
        fetch(url + "?traceIndex=" + curveNumber + "&pointIndex=" + pointNumber)
            .then((response) => {
                return response.json();
            })
            .then(function(response) {
                const { source_data, publications } = response;
                const data_div = document.getElementById("showdata");
                while (data_div.firstChild) {
                    data_div.removeChild(data_div.lastChild);
                }
                let ele1 = document.createElement("div");
                ele1.className += "col-sm text-center";
                let ele2 = document.createElement("h3");
                ele2.className+="text-white";
                ele2.innerHTML =
                    "Data for " +
                    source_data.Name +
                    "<small> (Download data to get full list of products)";

                // information table
                const data_keys = ["Name", "GLON", "GLAT", "Astrosat_obs"];
                const data_keys_observed = ["Astrosat_Instrument", "Observation_Id", "ProposalId"];

                for (let key of data_keys) {
                    table_info(key, info(key), source_data);
                }
                if (source_data["Astrosat_obs"] === "Yes") {
                    for (let key of data_keys_observed) {
                        table_info(key, info(key), source_data);
                        document.getElementById(key).hidden = false;
                        document.getElementById(info(key)).hidden = false;
                    }
                    const curr_title = ele2.innerHTML;
                    const i = curr_title.search("<small>");
                    ele2.innerHTML = curr_title.substr(0, i) + ` (${source_data["Source Name"]})` + curr_title.substr(i, curr_title.length - i);
                }
                else {
                    for (let key of data_keys_observed) {
                        document.getElementById(info(key)).hidden = true;
                        document.getElementById(key).hidden = true;
                    }
                }
                data_div.appendChild(ele1).appendChild(ele2);
                document.getElementById("info_table").hidden = false;

                $("#download_json")
                    .off()
                    .on("click", () => {
                        const fileName = `${source_data["Name"]}.json`;
                        // Create a blob of the data
                        let fileToSave = new Blob(
                            [JSON.stringify(source_data, null, 3)], {
                                type: "application/json",
                                name: fileName,
                            }
                        );
                        // Save the file
                        saveAs(fileToSave, fileName);
                    });

                $("#download_pdf")
                    .off()
                    .on("click", () => {
                        // PDF mode
                        const doc = new jsPDF();
                        let col = ["Property", "Value"],
                            row = [];
                        for (let key in source_data) {
                            row.push([key, source_data[key]]);
                        }
                        doc.autoTable(col, row);
                        doc.save(`${source_data["Name"]}.pdf`, pdf_config);
                    });

                $("#download_csv")
                    .off()
                    .on("click", () => {
                        // CSV
                        const fileName = `${source_data["Name"]}.csv`;
                        const csv = json2csv.parse(
                            [source_data],
                            Object.keys(source_data)
                        );
                        const csv_data = new Blob([csv], {
                            type: "text/plain;charset=utf-8",
                            name: fileName,
                        });
                        saveAs(csv_data, fileName);
                    });

                console.log(publications);
                // publications table
                if (
                    publications !== undefined &&
                    publications.length !== 0 &&
                    previous_state !== source_data["Name"]
                ) {
                    previous_state = source_data["Name"];
                    const tbody = document.getElementById("pub_body");
                    while (tbody.firstChild) {
                        tbody.removeChild(tbody.firstChild);
                    }
                    for (let publication of publications) {
                        let trow = document.createElement("tr");
                        const array_pub = [
                            "Source Name",
                            "Title",
                            "Authors",
                            "URL",
                        ];
                        console.log(source_data["Name"]);
                        console.log(source_data);
                        for (let key of array_pub) {
                            if (key === "Source Name") {
                                const td = document.createElement("td");
                                td.innerHTML = source_data["Source Name"];
                                trow.appendChild(td);
                            } else if (key === "URL") {
                                const td = document.createElement("td");
                                td.innerHTML = publication["URL"];
                                trow.appendChild(td);
                            } else {
                                const td = document.createElement("td");
                                td.innerHTML = publication[key];
                                trow.appendChild(td);
                            }
                        }
                        tbody.appendChild(trow);
                    }

                    div1 = document.getElementById("publication_pdf");

                    if (document.getElementById("download_pdf_publication") === null) {
                        let button1 = document.createElement("button");
                        button1.setAttribute("id", `download_pdf_publication`);
                        button1.className += "btn btn-success me-2";
                        button1.innerHTML = "Download Publications information PDF";
                        div1.appendChild(button1);
                    }
                    $("#download_pdf_publication")
                        .off()
                        .on("click", () => {
                            // PDF mode
                            const doc = new jsPDF();
                            const lst = [
                                "Source Name",
                                "Astrosat Instrument",
                                "Date and Time",
                                "Observation_Id",
                                "ProposalId",
                                "TargetId",
                            ];
                            let col = ["Property", "Value"],
                                row = [];
                            for (let key of lst) {
                                row.push([key, source_data[key]]);
                            }
                            console.log(publications);
                            // if publication atleast 1
                            for (
                                let index = 0; index < publications.length; index++
                            ) {
                                row.push(["        ", "        "]);
                                row.push(["Publication", index + 1]);
                                row.push(["Title", publications[index].Title]);
                                row.push([
                                    "Authors",
                                    publications[index].Authors,
                                ]);
                            }
                            doc.autoTable(col, row);
                            doc.save(
                                `${source_data["Name"]}.pdf`,
                                pdf_config
                            );
                        });
                    document.getElementById("pub_table").hidden = false;
                } else {
                    if (previous_state === source_data["Name"]) {
                        document.getElementById("pub_table").hidden = false;
                    } else {
                        document.getElementById("pub_table").hidden = true;
                    }
                }
            });
    });
});

const info = a => `info_${a}`;

function table_info(key, value, response) {
    document
        .getElementById(value)
        .innerHTML = response[key];
}
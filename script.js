const url = "/dataset";
const { Parser } = window.json2csv;

// Grid
// right asc.
const grid_ra_x = [
    -180,
    -150,
    -120,
    -90,
    -60,
    -30,
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

Plotly.d3.json(url, function (figure) {
    function unpack(rows, key) {
        return rows.map(function (row) {
            return row[key];
        });
    }

    function unpack_glat(rows, key) {
        return rows.map(function (row) {
            return parseFloat(row[key]);
        });
    }

    function unpack_glon(rows, key) {
        return rows.map(function (row) {
            let current_lon = parseFloat(row[key]);
            if (current_lon > 180.0) {
                current_lon -= 360.0;
            }
            return current_lon;
        });
    }

    let { astro, not_astro } = figure;

    const hover_template =
        "Lon: %{lon}<br>Lat: %{lat}<br>Name: %{text}<br>Astro: %{customdata}<br>Type: %{text}";

    let trace = [
        {
            mode: "markers",
            name: "Sources (Observed by AstroSat)",
            type: "scattergeo",
            lon: unpack_glon(astro, "GLON"),
            lat: unpack_glat(astro, "GLAT"),
            customdata: unpack(astro, "Astrosat_obs"),
            typ: unpack(astro, "Type"),
            text: unpack(astro, "Name"),
            hovertemplate: hover_template,
            hoverlabel: { namelength: 0 },
            marker: {
                symbol: "star",
                size: 8,
            },
        },
        {
            mode: "markers",
            name: "Sources (Not observed by Astrosat)",
            type: "scattergeo",
            lon: unpack_glon(not_astro, "GLON"),
            lat: unpack_glat(not_astro, "GLAT"),
            customdata: unpack(not_astro, "Astrosat_obs"),
            text: unpack(not_astro, "type"),
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
        },
        yaxis: { title: "LAT" },
        xaxis: { title: "LON" },
        font: {
            size: 24,
        },
        // autosize: true,
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

    graph.on("plotly_click", function (data) {
        const { curveNumber, pointNumber } = data.points[0];
        fetch(url + "?trace=" + curveNumber + "&point=" + pointNumber)
            .then((response) => {
                return response.json();
            })
            .then(function (data) {
                const data_div = document.getElementById("showdata");
                while (data_div.firstChild) {
                    data_div.removeChild(data_div.lastChild);
                }
                let ele1 = document.createElement("div");
                ele1.className += "col-sm text-center";
                let ele2 = document.createElement("h5");
                ele2.innerHTML = "Data for " + data.Name;
                let ele3 = document.createElement("div");
                ele3.className += "col-sm text-center";
                data_div.appendChild(ele1).appendChild(ele2);

                // information table
                const data_keys = ["Name", "GLON", "GLAT", "Astrosat_obs"];

                for (let key of data_keys) {
                    table_info(key, data);
                }
                document.getElementById("info_table").hidden = false;

                $("#download_json")
                    .off()
                    .on("click", () => {
                        const fileName = `${data["Name"]}.json`;
                        // Create a blob of the data
                        let fileToSave = new Blob([JSON.stringify(data)], {
                            type: "application/json",
                            name: fileName,
                        });
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
                        for (let key in data) {
                            row.push([key, data[key]]);
                        }
                        doc.autoTable(col, row);
                        doc.save(`${data["Name"]}.pdf`);
                    });

                $("#download_csv")
                    .off()
                    .on("click", () => {
                        // CSV
                        const fileName = `${data["Name"]}.csv`;
                        const csv = json2csv.parse([data], Object.keys(data));
                        const csv_data = new Blob([csv], {
                            type: "text/plain;charset=utf-8",
                            name: fileName,
                        });
                        saveAs(csv_data, fileName);
                    });
            });
    });
});

function table_info(value, response) {
    document.getElementById(`info_${value}`).innerHTML = response[value];
}

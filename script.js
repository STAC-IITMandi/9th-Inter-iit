const url = "/dataset";

// Grid
// right asc.
const grid_ra_x = [-180, -150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];
const grid_ra_y = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const grid_ra_hovtext = [
    "180°",
    "210°",
    "240°",
    "270°",
    "300°",
    "330°",
    "0°",
    "30°",
    "60°",
    "90°",
    "120°",
    "150°",
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

var graph = document.getElementById("graph");

Plotly.d3.json(url, function(figure) {
    function unpack(rows, key) {
        return rows.map(function(row) {
            return row[key];
        });
    }

    function unpack_glat(rows, key) {
        return rows.map(function(row) {
            return parseFloat(row[key]);
        });
    }

    function unpack_glon(rows, key) {
        return rows.map(function(row) {
            return parseFloat(row[key]) - 180.0;
        });
    }

    const data = figure.objects;
    let astro = [];
    let not_astro = [];

    for (let d of data) {
        if (d["Astrosat_obs"] == "Yes") {
            astro.push(d);
        } else {
            not_astro.push(d);
        }
    }

    let hover_template =
        "Lon: %{lon}<br>Lat: %{lat}<br>Name: %{text}<br>Astro: %{customdata}<br>Type: %{text}";

    let trace = [{
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
                color: '#85c1e9 ',
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
        // autosize: true,
    };

    var config = { responsive: true }

    Plotly.plot(graph, trace, layout, config, {
        displayModeBar: true,
        showlegend: true,
        legend: {
            x: 1,
            y: 0.5
        }
    });

    graph.on('plotly_click', function(data) {
        fetch(url + "?glat=" + data.points[0].lat + "&glon=" + (data.points[0].lon + 180.0)).then(response => {
            return response.json()
        }).then(function(data) {
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


            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
            // var downloadAnchorNode = document.createElement('a');
            // downloadAnchorNode.setAttribute("href", dataStr);
            // downloadAnchorNode.setAttribute("download", data.Name + ".json");
            // downloadAnchorNode.innerHTML = "json format";
            // ele3.appendChild(downloadAnchorNode); // required for firefox
            // data_div.appendChild(ele3);

            // information table
            console.log("DATA",data);
            const data_keys =["Name", "GLON", "GLAT", "Astrosat_obs"];
            for(let q = 0; q<(data_keys.length); q++){
                table_info(data_keys[q], data); 
            }

            $("#download_json").off().on("click", () => {    
                const fileName = `${data["Name"]}.json`;            
                // Create a blob of the data
                var fileToSave = new Blob([JSON.stringify(data)], {
                    type: 'application/json',
                    name: fileName
                });
                
                // Save the file
                saveAs(fileToSave, fileName);
            });
            document.getElementById("info_table").hidden=false;

            $("#download_pdf").off().on("click", () => {
                // PDF mode
                const doc = new jsPDF();
                let col = ["Property", "Value"], 
                    row = [];
                for (let key in data) {
                    row.push([key, data[key]]);
                }
                doc.autoTable(col, row);
                doc.save(`${data["Name"]}.pdf`);
            })
        });
    });
});

function table_info(value, response){
    document.getElementById(`info_${value}`).innerHTML=response[value];
}

const url = "/dataset";

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
      lon: unpack(not_astro, "GLON"),
      lat: unpack(not_astro, "GLAT"),
      customdata: unpack(not_astro, "Astrosat_obs"),
      text: unpack(not_astro, "type"),
      text: unpack(not_astro, "Name"),
      hovertemplate: hover_template,
      hoverlabel: { namelength: 0 },
      marker: {
        symbol: "star",
        size: 8,
        color: "#888888",
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
    autosize: true,
  };

  var config = { responsive: true };

  Plotly.plot(graph, trace, layout, config, {
    displayModeBar: true,
    showlegend: true,
  });

  graph.on("plotly_click", function (data) {
    console.log(data);
  });
});

function showMenu(e) {
  var menu = document.getElementById("contextMenu");
  menu.style.display = "block";
  menu.style.left = e.pageX + "px";
  menu.style.top = e.pageY + "px";
}

function hideMenu() {
  document.getElementById("contextMenu").style.display = "none";
}

document
  .querySelector("#graph")
  .addEventListener("contextmenu", function (event) {
    event.preventDefault();
    console.log(event);
    if (document.getElementById("contextMenu").style.display == "block") {
      hideMenu();
    } else {
      showMenu(event);
    }
  });

document.querySelector("#graph").addEventListener("keydown", (e) => {
  console.log(e);
  //   if (e.key === "Esc") {
  //     hideMenu();
  //   }
});

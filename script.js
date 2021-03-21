const url = "./Dataset.json";

// Grid
// right asc.
const grid_ra_x = [-180, -150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150];
const grid_ra_y = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const grid_ra_hovtext = [
  "180°",
  "150°",
  "120°",
  "90°",
  "60°",
  "30°",
  "0°",
  "330°",
  "300°",
  "270°",
  "240°",
  "210°",
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

Plotly.d3.json(url, function (figure) {
  function unpack(rows, key) {
    return rows.map(function (row) {
      return row[key];
    });
  }

  const data = figure.objects;
  let astro = [];
  let not_astro = [];

  for (let d of data) {
    if (d["Astrosat_obs"]) {
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
      name: "Sources (with Astrosat)",
      type: "scattergeo",
      lon: unpack(astro, "GLON"),
      lat: unpack(astro, "GLAT"),
      customdata: unpack(astro, "Astrosat_obs"),
      text: unpack(astro, "type"),
      text: unpack(astro, "Name"),
      hovertemplate: hover_template,
      marker: {
        symbol: "star",
        size: 8,
      },
    },
    {
      mode: "markers",
      name: "Sources (not with Astrosat)",
      type: "scattergeo",
      lon: unpack(not_astro, "GLON"),
      lat: unpack(not_astro, "GLAT"),
      customdata: unpack(not_astro, "Astrosat_obs"),
      text: unpack(not_astro, "type"),
      text: unpack(not_astro, "Name"),
      hovertemplate: hover_template,
      marker: {
        symbol: "star",
        size: 8,
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
    title: "AstroSat Visualisation",
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
  };

  Plotly.plot(document.getElementById("graph"), trace, layout, {
    displayModeBar: true,
    showlegend: true,
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

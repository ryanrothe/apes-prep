/* Terra Unit 4 diagram library (APES: Earth Systems and Resources).
   Same two-mode contract as Units 1 and 2: Study (labels on) and Label It (slots blank). */
(function () {

function slot(id, x, y, w) {
  return '<g class="lslot" data-slot="' + id + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="30" rx="9"/>' +
    '<text x="' + (x + w / 2) + '" y="' + (y + 20) + '" text-anchor="middle" font-size="12.5"></text></g>';
}
function txt(x, y, s, size, weight, anchor, color) {
  return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 12) + '" font-weight="' + (weight || 500) +
    '" text-anchor="' + (anchor || "start") + '" fill="' + (color || "var(--text-secondary)") + '">' + s + "</text>";
}
function arrow(x1, y1, x2, y2, color) {
  var c = color || "var(--text-muted)";
  var ang = Math.atan2(y2 - y1, x2 - x1), L = 9;
  var p1x = x2 - L * Math.cos(ang - 0.42), p1y = y2 - L * Math.sin(ang - 0.42);
  var p2x = x2 - L * Math.cos(ang + 0.42), p2y = y2 - L * Math.sin(ang + 0.42);
  return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + c + '" stroke-width="2"/>' +
    '<polygon points="' + x2 + "," + y2 + " " + p1x + "," + p1y + " " + p2x + "," + p2y + '" fill="' + c + '"/>';
}
function svgOpen(h) { return '<svg viewBox="0 0 700 ' + h + '" xmlns="http://www.w3.org/2000/svg" font-family="inherit">'; }

/* Stacked rows: [slotId, descriptor, secondLine?]. Slot on the left, text on the right. */
function rows(list, color, opts) {
  var o = opts || {}, sw = o.slotWidth || 230, top = o.top || 8, gap = o.gap || 58;
  var base = top + (o.title ? 26 : 0);
  var h = base + list.length * gap + (o.pad || 8) + (o.footer ? 22 : 0);
  var out = svgOpen(h);
  if (o.title) out += txt(10, top + 14, o.title, 12.5, 700, "start", "var(--text-primary)");
  list.forEach(function (r, i) {
    var y = base + i * gap;
    out += '<rect x="8" y="' + y + '" width="684" height="46" rx="12" fill="var(--d-' + color + ')" opacity="' + (0.09 + i * 0.03) + '"/>';
    out += slot(r[0], 16, y + 8, sw);
    if (r[2]) {
      out += txt(sw + 30, y + 20, r[1], 12);
      out += txt(sw + 30, y + 36, r[2], 12);
    } else {
      out += txt(sw + 30, y + 28, r[1], 12.5);
    }
  });
  if (o.footer) out += txt(350, h - 8, o.footer, 13, 700, "middle", "var(--d-" + color + ")");
  return out + "</svg>";
}

window.DIAGRAMS = window.DIAGRAMS || [];
var D = window.DIAGRAMS;

/* ---------- 1. Earth's structure ---------- */
D.push({
  id: "u4-earth-layers", domain: "tect", title: "Earth's Structure, Outside In",
  svg: rows([
    ["el1", "the SURFACE we live on, the thinnest layer"],
    ["el2", "thin, BRITTLE rock broken up into tectonic plates"],
    ["el3", "SOLID but FLEXIBLE rock that the plates slide over"],
    ["el4", "thick layer of hot rock and magma that slowly circulates"],
    ["el5", "the center: radioactive elements give off HEAT"]
  ], "tect", { slotWidth: 170, top: 10, gap: 56, title: "From the surface down to the center" }),
  slots: [
    { id: "el1", label: "Crust" },
    { id: "el2", label: "Lithosphere" },
    { id: "el3", label: "Asthenosphere" },
    { id: "el4", label: "Mantle" },
    { id: "el5", label: "Core" }
  ],
  distractors: ["Stratosphere"],
  caption: "The <b>core</b> makes the heat, the <b>mantle</b> carries it upward in slow convection loops, the flexible <b>asthenosphere</b> lets the brittle <b>lithosphere</b> plates slide, and the <b>crust</b> is the top skin we live on. Trap: the <b>stratosphere</b> is a layer of the atmosphere, not of Earth.",
  mnemonic: "Lithosphere is Like a cracked eggshell; Asthenosphere is the soft putty under it."
});

/* ---------- 2. Plate boundaries ---------- */
D.push({
  id: "u4-boundaries", domain: "tect", title: "The Three Plate Boundaries",
  svg: (function () {
    var out = svgOpen(282);
    var cols = [
      ["pb1", 8, "plates move APART", "forms: ridges, rift valleys,", "and volcanoes"],
      ["pb2", 240, "plates move TOWARD each other", "forms: mountains, volcanoes,", "and trenches"],
      ["pb3", 472, "plates SLIDE past each other", "forms: earthquakes", ""]
    ];
    cols.forEach(function (c, i) {
      var x = c[1];
      out += '<rect x="' + x + '" y="8" width="220" height="200" rx="12" fill="var(--d-tect)" opacity="' + (0.10 + i * 0.03) + '"/>';
      out += txt(x + 110, 30, c[2], 12, 600, "middle", "var(--text-primary)");
      if (i === 0) {
        out += '<rect x="' + (x + 20) + '" y="72" width="80" height="20" rx="3" fill="var(--d-tect)" opacity="0.55"/>';
        out += '<rect x="' + (x + 120) + '" y="72" width="80" height="20" rx="3" fill="var(--d-tect)" opacity="0.55"/>';
        out += '<polygon points="' + (x + 101) + ',104 ' + (x + 119) + ',104 ' + (x + 110) + ',72" fill="var(--d-enso)" opacity="0.75"/>';
        out += arrow(x + 70, 58, x + 30, 58) + arrow(x + 150, 58, x + 190, 58);
      } else if (i === 1) {
        out += '<rect x="' + (x + 15) + '" y="72" width="95" height="20" rx="3" fill="var(--d-tect)" opacity="0.55"/>';
        out += '<polygon points="' + (x + 112) + ',72 ' + (x + 205) + ',72 ' + (x + 205) + ',92 ' + (x + 128) + ',92 ' + (x + 100) + ',112 ' + (x + 90) + ',104" fill="var(--d-tect)" opacity="0.35"/>';
        out += arrow(x + 30, 58, x + 80, 58) + arrow(x + 190, 58, x + 140, 58);
      } else {
        out += '<rect x="' + (x + 20) + '" y="50" width="180" height="24" rx="3" fill="var(--d-tect)" opacity="0.35"/>';
        out += '<rect x="' + (x + 20) + '" y="78" width="180" height="24" rx="3" fill="var(--d-tect)" opacity="0.55"/>';
        out += arrow(x + 60, 62, x + 160, 62, "var(--text-primary)") + arrow(x + 160, 90, x + 60, 90, "var(--text-primary)");
      }
      out += slot(c[0], x + 20, 122, 180);
      out += txt(x + 110, 176, c[3], 11.5, 500, "middle");
      if (c[4]) out += txt(x + 110, 194, c[4], 11.5, 500, "middle");
    });
    out += '<rect x="8" y="222" width="684" height="46" rx="12" fill="var(--d-tect)" opacity="0.18"/>';
    out += slot("pb4", 16, 230, 150);
    out += txt(180, 250, "one plate dives under another; it happens at the middle boundary", 12.5);
    return out + "</svg>";
  })(),
  slots: [
    { id: "pb1", label: "Divergent" },
    { id: "pb2", label: "Convergent" },
    { id: "pb3", label: "Transform" },
    { id: "pb4", label: "Subduction" }
  ],
  distractors: ["Hot spot"],
  caption: "<b>Divergent</b>: rising magma forces plates apart and builds new crust. <b>Convergent</b>: plates collide, and the denser one dives under (<b>subduction</b>), making trenches, volcanoes, and mountains. <b>Transform</b>: plates grind sideways, stick, and slip as earthquakes. Trap: a <b>hot spot</b> is not a boundary at all, it sits in the middle of a plate.",
  mnemonic: "DIvergent DIvides. CONvergent COllides. TRANSform TRAvels sideways."
});

/* ---------- 3. What forms where ---------- */
D.push({
  id: "u4-subduction", domain: "tect", title: "What Forms Where Plates Meet",
  svg: rows([
    ["sb1", "one ocean plate dives under another: trench + a curved", "chain of volcanic islands (Japan, the Aleutians)"],
    ["sb2", "the denser ocean plate sinks under a continent: trench", "offshore, volcanoes and mountains on land (Andes)"],
    ["sb3", "neither plate sinks much, so the crust crumples into", "the tallest mountains on Earth (Himalayas)"],
    ["sb4", "extra hot magma rises through the MIDDLE of a plate,", "not at a boundary (Hawaii)"]
  ], "tect", { slotWidth: 200, top: 10, gap: 56, title: "Collision types, plus the one volcano maker that is not a boundary" }),
  slots: [
    { id: "sb1", label: "Oceanic-oceanic" },
    { id: "sb2", label: "Oceanic-continental" },
    { id: "sb3", label: "Continental-continental" },
    { id: "sb4", label: "Hot spot" }
  ],
  distractors: ["Transform fault"],
  caption: "Density decides who sinks. Ocean crust is denser, so it <b>subducts</b>: under another ocean plate you get an <b>island arc</b>, under a continent you get coastal volcanoes. Two continents are too light to sink, so they pile up into mountains. A <b>hot spot</b> builds islands far from any edge. Trap: a <b>transform fault</b> makes earthquakes, not volcanoes or island chains.",
  mnemonic: "Ocean dives, continent rises."
});

/* ---------- 4. Soil horizons ---------- */
D.push({
  id: "u4-horizons", domain: "soilf", title: "Soil Horizons",
  svg: (function () {
    var bands = [
      ["hz1", 40, "leaf litter and organic matter on top", 0.75],
      ["hz2", 52, "humus + minerals, the MOST life", 0.6],
      ["hz3", 40, "washed-out (leached) zone, some soils", 0.25],
      ["hz4", 52, "minerals, little or no organic matter", 0.4],
      ["hz5", 48, "weathered rock near the parent material", 0.3],
      ["hz6", 40, "solid parent rock at the very bottom", 0.5]
    ];
    var y = 10, out = svgOpen(286);
    bands.forEach(function (b, i) {
      var fill = i === 5 ? "var(--text-muted)" : "var(--d-soilf)";
      out += '<rect x="20" y="' + y + '" width="170" height="' + b[1] + '" fill="' + fill + '" opacity="' + b[3] + '"' + (i === 0 ? ' rx="6"' : "") + "/>";
      out += '<line x1="20" y1="' + (y + b[1]) + '" x2="690" y2="' + (y + b[1]) + '" stroke="var(--border)" stroke-width="1"/>';
      var sy = y + (b[1] - 30) / 2;
      out += slot(b[0], 202, sy, 196);
      out += txt(410, sy + 20, b[2], 12.5);
      y += b[1];
    });
    return out + "</svg>";
  })(),
  slots: [
    { id: "hz1", label: "O horizon" },
    { id: "hz2", label: "A horizon (topsoil)" },
    { id: "hz3", label: "E horizon" },
    { id: "hz4", label: "B horizon (subsoil)" },
    { id: "hz5", label: "C horizon" },
    { id: "hz6", label: "Bedrock" }
  ],
  distractors: ["Humus"],
  caption: "Read it top down: <b>O</b> is organic litter, <b>A</b> (topsoil) is where humus and life concentrate, <b>E</b> shows up in some soils where water leaches minerals down into <b>B</b> (subsoil), <b>C</b> is chunky weathered rock, and <b>bedrock</b> is the parent material. Trap: <b>humus</b> is an ingredient found mostly in the A horizon, not a horizon of its own.",
  mnemonic: "<b>O</b>ld <b>A</b>nts <b>E</b>at <b>B</b>read <b>C</b>rumbs, then hit Rock."
});

/* ---------- 5. Soil particles and water ---------- */
D.push({
  id: "u4-particles", domain: "soilp", title: "Soil Particles and Water",
  svg: (function () {
    var out = svgOpen(354);
    out += txt(10, 22, "Biggest to smallest, then the two water properties", 12.5, 700, "start", "var(--text-primary)");
    var rowsDef = [
      ["pa1", "BIGGEST grains (0.05 to 2 mm): big gaps, water drains fast"],
      ["pa2", "MIDDLE size grains (0.002 to 0.05 mm)"],
      ["pa3", "SMALLEST grains (under 0.002 mm): holds water, drains slow"],
      ["pa4", "the ideal BALANCE of all three particle sizes"],
      ["pa5", "how much water a soil can HOLD (clay is high)"],
      ["pa6", "how easily water DRAINS through (sand is high)"]
    ];
    rowsDef.forEach(function (r, i) {
      var y = 34 + i * 52;
      out += '<rect x="8" y="' + y + '" width="684" height="44" rx="12" fill="var(--d-soilp)" opacity="' + (0.09 + i * 0.025) + '"/>';
      var cy = y + 22, k;
      if (i === 0) for (k = 0; k < 3; k++) out += '<circle cx="' + (30 + k * 24) + '" cy="' + cy + '" r="11" fill="var(--d-soilp)" opacity="0.6"/>';
      if (i === 1) for (k = 0; k < 6; k++) out += '<circle cx="' + (24 + k * 12) + '" cy="' + cy + '" r="5" fill="var(--d-soilp)" opacity="0.6"/>';
      if (i === 2) for (k = 0; k < 12; k++) out += '<circle cx="' + (22 + k * 6) + '" cy="' + (cy + (k % 2 ? 3 : -3)) + '" r="2.4" fill="var(--d-soilp)" opacity="0.7"/>';
      if (i === 3) out += '<circle cx="30" cy="' + cy + '" r="10" fill="var(--d-soilp)" opacity="0.6"/><circle cx="52" cy="' + cy + '" r="5" fill="var(--d-soilp)" opacity="0.6"/><circle cx="66" cy="' + (cy - 3) + '" r="2.4" fill="var(--d-soilp)" opacity="0.7"/><circle cx="74" cy="' + (cy + 3) + '" r="2.4" fill="var(--d-soilp)" opacity="0.7"/><circle cx="86" cy="' + cy + '" r="5" fill="var(--d-soilp)" opacity="0.6"/>';
      out += slot(r[0], 104, y + 7, 140);
      out += txt(256, y + 27, r[1], 12.5);
    });
    return out + "</svg>";
  })(),
  slots: [
    { id: "pa1", label: "Sand" },
    { id: "pa2", label: "Silt" },
    { id: "pa3", label: "Clay" },
    { id: "pa4", label: "Loam" },
    { id: "pa5", label: "Porosity" },
    { id: "pa6", label: "Permeability" }
  ],
  distractors: ["Humus"],
  caption: "Particle size controls water. <b>Sand</b> leaves big gaps, so it has high <b>permeability</b> and low <b>porosity</b>: roots dry out. <b>Clay</b> packs tight, so it has high porosity and low permeability: roots get waterlogged. <b>Loam</b> balances all three. Trap: <b>humus</b> is organic matter, not one of the three rock particles.",
  mnemonic: "Sand Speeds through. Clay Clings. Loam is just right."
});

/* ---------- 6. Atmosphere layers ---------- */
D.push({
  id: "u4-atmo-layers", domain: "atmo", title: "Layers of the Atmosphere",
  svg: rows([
    ["al5", "OUTERMOST layer, merges with space; satellites orbit here", "can be very hot, but too thin to transfer heat"],
    ["al4", "HOTTEST layer (about 3,100 F) from absorbing solar radiation", "charged gas makes the northern lights"],
    ["al3", "COLDEST layer (about -150 F); meteors burn up here", "temperature drops as you go up"],
    ["al2", "thickest OZONE layer: absorbs UV-B and UV-C", "temperature RISES as you go up (warmed by UV)"],
    ["al1", "WEATHER happens here, and so do we", "temperature drops as you go up; ozone here is BAD"]
  ], "atmo", { slotWidth: 160, top: 10, gap: 56, title: "Top of the sky (space) down to the ground", footer: "GROUND LEVEL" }),
  slots: [
    { id: "al5", label: "Exosphere" },
    { id: "al4", label: "Thermosphere" },
    { id: "al3", label: "Mesosphere" },
    { id: "al2", label: "Stratosphere" },
    { id: "al1", label: "Troposphere" }
  ],
  distractors: ["Lithosphere"],
  caption: "Temperature zig-zags as you climb: it falls through the <b>troposphere</b>, rises through the <b>stratosphere</b> (ozone soaking up UV), falls through the <b>mesosphere</b> to the coldest point, then soars in the <b>thermosphere</b>. The <b>exosphere</b> fades into space. Trap: the <b>lithosphere</b> is rock, part of the solid Earth.",
  mnemonic: "Ground up: <b>T</b>he <b>S</b>illy <b>M</b>onkey <b>T</b>hrew <b>E</b>ggs."
});

/* ---------- 7. Global circulation cells ---------- */
D.push({
  id: "u4-cells", domain: "wind", title: "Global Circulation Cells",
  svg: (function () {
    var out = svgOpen(322);
    out += txt(350, 22, "Northern Hemisphere side view: equator on the left, North Pole on the right", 12, 600, "middle", "var(--text-primary)");
    var lat = [40, 247, 453, 660];
    var cells = [[lat[0], lat[1], "wc1"], [lat[1], lat[2], "wc2"], [lat[2], lat[3], "wc3"]];
    cells.forEach(function (c) {
      out += '<rect x="' + (c[0] + 8) + '" y="40" width="' + (c[1] - c[0] - 16) + '" height="144" rx="40" fill="var(--d-wind)" fill-opacity="0.10" stroke="var(--d-wind)" stroke-opacity="0.6" stroke-width="2"/>';
      out += slot(c[2], (c[0] + c[1]) / 2 - 75, 97, 150);
    });
    /* rising air at 0 and 60, sinking at 30 and 90 */
    out += arrow(60, 172, 60, 56, "var(--d-wind)") + arrow(227, 56, 227, 172, "var(--d-wind)");
    out += arrow(267, 56, 267, 172, "var(--d-wind)") + arrow(433, 172, 433, 56, "var(--d-wind)");
    out += arrow(473, 172, 473, 56, "var(--d-wind)") + arrow(640, 56, 640, 172, "var(--d-wind)");
    out += '<line x1="16" y1="194" x2="684" y2="194" stroke="var(--text-muted)" stroke-width="2"/>';
    out += txt(40, 212, "0°", 12, 700, "middle", "var(--text-primary)");
    out += txt(247, 212, "30°", 12, 700, "middle", "var(--text-primary)");
    out += txt(453, 212, "60°", 12, 700, "middle", "var(--text-primary)");
    out += txt(660, 212, "90°", 12, 700, "middle", "var(--text-primary)");
    out += txt(14, 232, "LOW, rainy", 11.5, 500, "start");
    out += slot("wc4", 172, 218, 150);
    out += txt(453, 232, "LOW", 11.5, 500, "middle");
    out += txt(686, 232, "HIGH", 11.5, 500, "end");
    out += '<rect x="8" y="260" width="684" height="46" rx="12" fill="var(--d-wind)" opacity="0.14"/>';
    out += txt(684, 288, "surface winds", 11.5, 600, "end");
    out += slot("wc5", 50, 268, 140);
    out += txt(198, 288, "← E to W", 12, 600);
    out += slot("wc6", 270, 268, 140);
    out += txt(418, 288, "W to E →", 12, 600);
    return out + "</svg>";
  })(),
  slots: [
    { id: "wc1", label: "Hadley cell" },
    { id: "wc2", label: "Ferrel cell" },
    { id: "wc3", label: "Polar cell" },
    { id: "wc4", label: "High pressure" },
    { id: "wc5", label: "Trade winds" },
    { id: "wc6", label: "Westerlies" }
  ],
  distractors: ["Low pressure", "Gyre"],
  caption: "Air rises at 0° and 60° (low pressure, rain) and sinks at 30° and 90° (<b>high pressure</b>, dry). That builds three loops: <b>Hadley</b> 0 to 30, <b>Ferrel</b> 30 to 60, <b>Polar</b> 60 to 90. Surface air spreads out from 30°: toward the equator as the <b>trade winds</b> (east to west) and toward 60° as the <b>westerlies</b> (west to east). Trap: a <b>gyre</b> is an ocean loop, not an air cell.",
  mnemonic: "Low, High, Low, High from the equator out. Cells: <b>H</b>ot, <b>F</b>air, <b>P</b>olar."
});

/* ---------- 8. Eutrophication chain ---------- */
D.push({
  id: "u4-eutro", domain: "wshed", title: "The Eutrophication Chain",
  svg: rows([
    ["eu1", "fertilizer, animal waste, and sewage wash into the water"],
    ["eu2", "algae explode across the surface of the water"],
    ["eu3", "the algae block the Sun, so underwater plants die"],
    ["eu4", "decomposers use up oxygen breaking down the dead plants"],
    ["eu5", "fish and other animals suffocate"]
  ], "wshed", { slotWidth: 210, top: 10, gap: 54, title: "Each step causes the next one", footer: "FIX IT AT THE SOURCE: CONTROL N AND P" }),
  slots: [
    { id: "eu1", label: "Excess N and P" },
    { id: "eu2", label: "Algae bloom" },
    { id: "eu3", label: "Sunlight blocked" },
    { id: "eu4", label: "Oxygen drops" },
    { id: "eu5", label: "Fish die-off" }
  ],
  distractors: ["Oxygen increases"],
  caption: "Nutrient pollution (<b>excess N and P</b>) feeds an <b>algae bloom</b>, the mat <b>blocks sunlight</b>, plants die, and decomposers breaking them down make the <b>oxygen drop</b>, so fish die. Trap: algae make oxygen while alive, but the net result is <b>less</b> oxygen, never more. Solutions: manure management, cover crops, riparian buffers, and better nutrient removal at sewage plants.",
  mnemonic: "Feed, Bloom, Block, Breathe out, Bye fish."
});

/* ---------- 9. Seasons ---------- */
D.push({
  id: "u4-seasons", domain: "insol", title: "Tilt and the Seasons",
  svg: (function () {
    var out = svgOpen(488);
    out += '<ellipse cx="350" cy="96" rx="230" ry="62" fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="5 5"/>';
    out += '<circle cx="350" cy="96" r="24" fill="var(--d-insol)" opacity="0.8"/>';
    out += txt(350, 100, "Sun", 11.5, 700, "middle", "var(--text-primary)");
    var earths = [[120, 96, "1"], [350, 158, "2"], [580, 96, "3"], [350, 34, "4"]];
    earths.forEach(function (e) {
      out += '<circle cx="' + e[0] + '" cy="' + e[1] + '" r="15" fill="var(--d-insol)" opacity="0.3" stroke="var(--d-insol)" stroke-width="1.5"/>';
      out += '<line x1="' + (e[0] - 7) + '" y1="' + (e[1] + 20) + '" x2="' + (e[0] + 7) + '" y2="' + (e[1] - 20) + '" stroke="var(--text-primary)" stroke-width="2"/>';
      var lx = e[2] === "4" ? e[0] + 30 : (e[2] === "2" ? e[0] + 30 : e[0]), ly = e[2] === "1" || e[2] === "3" ? e[1] + 38 : e[1] + 5;
      out += txt(lx, ly, e[2], 13, 800, "middle", "var(--text-primary)");
    });
    out += txt(10, 198, "The axis always leans the same way in space (N end tipped right).", 11.5, 500);
    var rowsDef = [
      ["ss1", "(1) North tilted most TOWARD the Sun: longest northern day"],
      ["ss2", "(2) Sun straight over the equator: about 12 hours of day and night"],
      ["ss3", "(3) North tilted most AWAY from the Sun: northern winter begins"],
      ["ss4", "(4) Sun over the equator again: northern spring begins"],
      ["ss5", "the lean of Earth's axis that causes all of this"]
    ];
    rowsDef.forEach(function (r, i) {
      var y = 208 + i * 54;
      out += '<rect x="8" y="' + y + '" width="684" height="46" rx="12" fill="var(--d-insol)" opacity="' + (0.10 + i * 0.03) + '"/>';
      out += slot(r[0], 16, y + 8, 180);
      out += txt(206, y + 28, r[1], 12);
    });
    return out + "</svg>";
  })(),
  slots: [
    { id: "ss1", label: "June solstice" },
    { id: "ss2", label: "September equinox" },
    { id: "ss3", label: "December solstice" },
    { id: "ss4", label: "March equinox" },
    { id: "ss5", label: "23.5° tilt" }
  ],
  distractors: ["Closest to the Sun"],
  caption: "The axis is tilted <b>23.5°</b> and keeps pointing the same direction as Earth orbits. At the <b>June solstice</b> the north leans toward the Sun (northern summer); at the <b>December solstice</b> it leans away (northern winter). At both <b>equinoxes</b> the Sun sits over the equator and day and night are about equal. Trap: seasons are NOT caused by distance from the Sun.",
  mnemonic: "Tilt, not distance. Equinox = equal night."
});

/* ---------- 10. Albedo ---------- */
D.push({
  id: "u4-albedo", domain: "insol", title: "Albedo: How Much Sunlight Bounces Back",
  svg: (function () {
    var out = svgOpen(306);
    out += txt(10, 22, "Percent of sunlight each surface reflects", 12.5, 700, "start", "var(--text-primary)");
    var bars = [["ab1", 87, "80 to 95%"], ["ab2", 60, "50 to 70%"], ["ab3", 18, "10 to 25%"], ["ab4", 7, "5 to 10%"]];
    bars.forEach(function (b, i) {
      var y = 34 + i * 50;
      out += '<rect x="8" y="' + y + '" width="684" height="42" rx="12" fill="var(--d-insol)" opacity="0.08"/>';
      out += slot(b[0], 16, y + 6, 160);
      out += '<rect x="190" y="' + (y + 10) + '" width="' + (b[1] * 4.2) + '" height="22" rx="5" fill="var(--d-insol)" opacity="0.7"/>';
      out += txt(198 + b[1] * 4.2, y + 26, b[2], 12, 600);
    });
    out += '<rect x="8" y="238" width="684" height="46" rx="12" fill="var(--d-insol)" opacity="0.18"/>';
    out += slot("ab5", 16, 246, 170);
    out += txt(198, 266, "cities run hotter than the countryside: blacktop absorbs heat", 12.5);
    return out + "</svg>";
  })(),
  slots: [
    { id: "ab1", label: "Fresh snow" },
    { id: "ab2", label: "Sea ice" },
    { id: "ab3", label: "Cropland" },
    { id: "ab4", label: "Asphalt" },
    { id: "ab5", label: "Urban heat island" }
  ],
  distractors: ["High heat capacity"],
  caption: "High albedo (<b>fresh snow</b>, <b>sea ice</b>) reflects most sunlight and stays cool. Low albedo (<b>asphalt</b>, water, bare soil) absorbs it and re-releases it as heat, which is why cities form an <b>urban heat island</b>. Trap: <b>high heat capacity</b> explains why the ocean warms slowly, it is not about reflecting light.",
  mnemonic: "Light surfaces bounce, dark surfaces bake."
});

/* ---------- 11. Rain shadow ---------- */
D.push({
  id: "u4-rainshadow", domain: "clim", title: "The Rain Shadow Effect",
  svg: (function () {
    var out = svgOpen(318);
    out += '<rect x="8" y="190" width="190" height="40" fill="var(--d-aqua)" opacity="0.35"/>';
    out += '<polygon points="198,230 230,200 350,60 470,200 520,214 692,214 692,230" fill="var(--d-clim)" opacity="0.22"/>';
    out += '<line x1="8" y1="230" x2="692" y2="230" stroke="var(--text-muted)" stroke-width="1.5"/>';
    out += slot("rs1", 24, 128, 170);
    out += arrow(30, 172, 190, 172);
    out += slot("rs2", 24, 195, 160);
    out += '<ellipse cx="292" cy="62" rx="38" ry="15" fill="var(--text-muted)" opacity="0.35"/>';
    out += '<ellipse cx="262" cy="70" rx="22" ry="11" fill="var(--text-muted)" opacity="0.35"/>';
    [[254, 88], [274, 90], [294, 88]].forEach(function (p) {
      out += '<line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + (p[0] - 6) + '" y2="' + (p[1] + 24) + '" stroke="var(--d-aqua)" stroke-width="2"/>';
    });
    out += arrow(212, 176, 318, 88);
    out += arrow(384, 88, 492, 178);
    out += slot("rs3", 170, 240, 150);
    out += slot("rs4", 340, 240, 150);
    out += slot("rs5", 510, 240, 175);
    out += txt(245, 288, "the side the wind hits FIRST", 11.5, 500, "middle");
    out += txt(245, 304, "air rises, cools: rain, lush", 11.5, 500, "middle");
    out += txt(415, 288, "the side facing AWAY", 11.5, 500, "middle");
    out += txt(415, 304, "dry air sinks down", 11.5, 500, "middle");
    out += txt(597, 288, "dry, arid zone the", 11.5, 500, "middle");
    out += txt(597, 304, "mountain creates", 11.5, 500, "middle");
    return out + "</svg>";
  })(),
  slots: [
    { id: "rs1", label: "Prevailing winds" },
    { id: "rs2", label: "Evaporation" },
    { id: "rs3", label: "Windward side" },
    { id: "rs4", label: "Leeward side" },
    { id: "rs5", label: "Rain shadow" }
  ],
  distractors: ["Upwelling"],
  caption: "<b>Prevailing winds</b> pick up moisture from ocean <b>evaporation</b>. On the <b>windward side</b> the air is forced up, cools, and rains, so it is lush. The dried-out air sinks down the <b>leeward side</b> and warms, leaving a dry <b>rain shadow</b> (Cascades in Washington, Andes and the Atacama). Trap: <b>upwelling</b> is cold ocean water rising, not air.",
  mnemonic: "Windward = Wet. Leeward = Lacking rain."
});

/* ---------- 12. ENSO ---------- */
D.push({
  id: "u4-enso", domain: "enso", title: "Normal Year, El Niño, La Niña",
  svg: rows([
    ["en1", "trade winds blow east to west at normal strength", "cool upwelling off South America; rain over SE Asia, Australia"],
    ["en2", "trade winds WEAKEN or even reverse", "warm water stays east; upwelling suppressed; Australia dries"],
    ["en3", "trade winds blow STRONGER than normal", "extra upwelling; cooler South American coast; rainier SE Asia"],
    ["en4", "wind pushes warm surface water away from the coast", "cold, nutrient-rich water rises: great fishing"]
  ], "enso", { slotWidth: 200, top: 10, gap: 56, title: "The Pacific Ocean, from South America (east) to Asia (west)" }),
  slots: [
    { id: "en1", label: "Normal year" },
    { id: "en2", label: "El Niño" },
    { id: "en3", label: "La Niña" },
    { id: "en4", label: "Upwelling" }
  ],
  distractors: ["Thermohaline circulation"],
  caption: "Everything starts with the trade winds. <b>Normal</b>: water piles up warm in the west and <b>upwelling</b> feeds fish off Peru. <b>El Niño</b>: weak winds let warm water slide back east, so the Americas flood, Australia and SE Asia dry out, and fishing crashes. <b>La Niña</b>: strong winds turn normal up a notch. Trap: <b>thermohaline circulation</b> is the slow, deep, salt-and-temperature loop, not the Pacific wind pattern.",
  mnemonic: "El Niño = weak winds. La Niña = loud (strong) winds."
});

})();

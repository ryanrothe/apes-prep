/* Terra diagram library. Each diagram renders two ways: Study (labels on) and Label It (slots blank).
   Slot boxes are <g class="lslot" data-slot="id"> groups; app.js fills the <text> from state. */
(function () {

function slot(id, x, y, w) {
  return '<g class="lslot" data-slot="' + id + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="30" rx="9"/>' +
    '<text x="' + (x + w / 2) + '" y="' + (y + 20) + '" text-anchor="middle" font-size="12.5"></text></g>';
}
function txt(x, y, s, size, weight, anchor, color) {
  return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 12) + '" font-weight="' + (weight || 500) +
    '" text-anchor="' + (anchor || "start") + '" fill="' + (color || "var(--text-secondary)") + '">' + s + "</text>";
}
function arrow(x1, y1, x2, y2) {
  var ang = Math.atan2(y2 - y1, x2 - x1), L = 9;
  var p1x = x2 - L * Math.cos(ang - 0.42), p1y = y2 - L * Math.sin(ang - 0.42);
  var p2x = x2 - L * Math.cos(ang + 0.42), p2y = y2 - L * Math.sin(ang + 0.42);
  return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="var(--text-muted)" stroke-width="2"/>' +
    '<polygon points="' + x2 + "," + y2 + " " + p1x + "," + p1y + " " + p2x + "," + p2y + '" fill="var(--text-muted)"/>';
}
function svgOpen(h) { return '<svg viewBox="0 0 700 ' + h + '" xmlns="http://www.w3.org/2000/svg" font-family="inherit">'; }

window.DIAGRAMS = [

/* ---------- 1. Levels of organization ---------- */
{
  id: "levels", domain: "eco", title: "Levels of Organization",
  svg: (function () {
    var rows = [
      ["l1", "one single deer", 170],
      ["l2", "a group of the SAME species (all the deer)", 250],
      ["l3", "ALL the living things (deer + oaks + fungi)", 330],
      ["l4", "living things + NONLIVING (water, soil, sun)", 410],
      ["l5", "a big region defined by CLIMATE", 490],
      ["l6", "every living thing on Earth", 570]
    ];
    var out = svgOpen(rows.length * 56 + 14);
    rows.forEach(function (r, i) {
      var y = 8 + i * 56;
      out += '<rect x="8" y="' + y + '" width="' + r[2] + '" height="44" rx="12" fill="var(--d-eco)" opacity="' + (0.14 + i * 0.05) + '"/>';
      out += slot(r[0], 16, y + 7, 150);
      out += txt(180, y + 27, r[1], 12.5);
      if (i < rows.length - 1) out += arrow(90, y + 44, 90, y + 55);
    });
    return out + "</svg>";
  })(),
  slots: [
    { id: "l1", label: "Individual" }, { id: "l2", label: "Population" }, { id: "l3", label: "Community" },
    { id: "l4", label: "Ecosystem" }, { id: "l5", label: "Biome" }, { id: "l6", label: "Biosphere" }
  ],
  distractors: ["Niche"],
  caption: "Each level swallows the one before it. The two jumps everyone mixes up: <b>community</b> = all LIVING things, and <b>ecosystem</b> = living + NONLIVING. A <b>biome</b> is defined by climate.",
  mnemonic: "<b>I</b> <b>P</b>ut <b>C</b>heese <b>E</b>verywhere <b>B</b>ecause… <b>B</b>ites! Individual, Population, Community, Ecosystem, Biome, Biosphere."
},

/* ---------- 2. Species interactions scorecard ---------- */
{
  id: "interactions", domain: "eco", title: "Species Interactions Scorecard",
  svg: (function () {
    var rows = [
      ["i1", "− / −", "both lose: fighting over the same limited resource"],
      ["i2", "+ / −", "one kills and eats the other (the prey dies)"],
      ["i3", "+ / −", "one feeds on the other slowly (host harmed, kept alive)"],
      ["i4", "+ / +", "both benefit (coral &amp; algae, bee &amp; flower)"],
      ["i5", "+ / 0", "one benefits, the other is unaffected (bird nests in tree)"]
    ];
    var out = svgOpen(rows.length * 54 + 40);
    out += txt(14, 22, "Species 1 / Species 2", 12, 700, "start", "var(--text-primary)");
    rows.forEach(function (r, i) {
      var y = 34 + i * 54;
      out += '<rect x="8" y="' + y + '" width="684" height="46" rx="12" fill="var(--d-eco)" opacity="0.10"/>';
      out += txt(46, y + 29, r[1], 15, 800, "middle", "var(--text-primary)");
      out += slot(r[0], 92, y + 8, 168);
      out += txt(272, y + 28, r[2], 12.5);
    });
    return out + "</svg>";
  })(),
  slots: [
    { id: "i1", label: "Competition" }, { id: "i2", label: "Predation" }, { id: "i3", label: "Parasitism" },
    { id: "i4", label: "Mutualism" }, { id: "i5", label: "Commensalism" }
  ],
  distractors: ["Symbiosis"],
  caption: "Predation and parasitism are both + / −, so read the description: <b>killed quickly</b> = predation, <b>harmed slowly</b> = parasitism. Watch out for the extra label: <b>symbiosis</b> is the umbrella word, not a row.",
  mnemonic: "Score it like a game: win-win = mutualism, win-lose = predation or parasitism, win-whatever = commensalism, lose-lose = competition."
},

/* ---------- 3. Predator-prey cycles ---------- */
{
  id: "predprey", domain: "eco", title: "Predator-Prey Cycles",
  svg: (function () {
    var out = svgOpen(300);
    out += '<line x1="40" y1="230" x2="680" y2="230" stroke="var(--border)" stroke-width="2"/>';
    out += '<line x1="40" y1="230" x2="40" y2="30" stroke="var(--border)" stroke-width="2"/>';
    out += txt(24, 130, "Population", 11, 600, "middle") .replace('<text ', '<text transform="rotate(-90 24 130)" ');
    out += txt(360, 252, "Time →", 12, 600, "middle");
    var prey = "M 40 160", pred = "M 40 190", i, x, yA, yB;
    for (i = 0; i <= 64; i++) {
      x = 40 + i * 10;
      yA = 130 - 65 * Math.sin(i / 6.4);
      yB = 130 - 45 * Math.sin(i / 6.4 - 1.25);
      prey += " L " + x + " " + yA.toFixed(1);
      pred += " L " + x + " " + (yB + 30).toFixed(1);
    }
    out += '<path d="' + prey + '" fill="none" stroke="var(--d-aqua)" stroke-width="3.5"/>';
    out += '<path d="' + pred + '" fill="none" stroke="var(--d-energy)" stroke-width="3.5"/>';
    out += arrow(140, 62, 122, 72);
    out += slot("pp1", 146, 44, 130);
    out += txt(284, 63, "peaks FIRST", 11.5, 700);
    out += arrow(260, 148, 244, 132);
    out += slot("pp2", 264, 148, 130);
    out += txt(402, 167, "peaks AFTER (lags)", 11.5, 700);
    return out + "</svg>";
  })(),
  slots: [ { id: "pp1", label: "Prey" }, { id: "pp2", label: "Predator" } ],
  distractors: ["Producer", "Decomposer"],
  caption: "The <b>prey</b> curve always moves first; the <b>predator</b> curve copies it a beat later. More prey feeds more predators, then heavy hunting knocks the prey back down, and the predators follow. This lagging seesaw is a <b>negative feedback loop</b> that lets both populations recover.",
  mnemonic: "Prey Pops first, Predators Play catch-up."
},

/* ---------- 4. Lake zones ---------- */
{
  id: "lake", domain: "aqua", title: "Zones of a Lake",
  svg: (function () {
    var out = svgOpen(330);
    out += '<path d="M 10 60 L 690 60 L 690 300 L 10 300 Z" fill="var(--d-aqua)" opacity="0.10"/>';
    out += '<path d="M 10 60 C 150 80 200 200 320 260 L 690 260 L 690 300 L 10 300 Z" fill="var(--d-terr)" opacity="0.25"/>';
    out += '<line x1="10" y1="60" x2="690" y2="60" stroke="var(--d-aqua)" stroke-width="3"/>';
    out += '<line x1="180" y1="60" x2="180" y2="130" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="4 4"/>';
    out += '<line x1="180" y1="150" x2="690" y2="150" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="4 4"/>';
    out += txt(600, 145, "light stops here", 11);
    out += slot("z1", 30, 74, 140);
    out += txt(100, 122, "shallow edge, rooted plants", 11, 500, "middle");
    out += slot("z2", 380, 92, 150);
    out += txt(455, 138, "open water, light reaches", 11, 500, "middle");
    out += slot("z3", 380, 185, 150);
    out += txt(455, 231, "too deep for sunlight", 11, 500, "middle");
    out += slot("z4", 530, 264, 150);
    out += txt(505, 285, "murky bottom: nutrient-rich sediment →", 11, 500, "end");
    return out + "</svg>";
  })(),
  slots: [
    { id: "z1", label: "Littoral zone" }, { id: "z2", label: "Limnetic zone" },
    { id: "z3", label: "Profundal zone" }, { id: "z4", label: "Benthic zone" }
  ],
  distractors: ["Intertidal zone"],
  caption: "Shore to bottom: <b>littoral</b> (shallow, sunlit, rooted plants) → <b>limnetic</b> (open water where light still reaches) → <b>profundal</b> (too deep for sun) → <b>benthic</b> (the bottom itself, nutrient-rich sediment). The trap label, intertidal, belongs to the OCEAN shoreline, not lakes.",
  mnemonic: "<b>L</b>ittle <b>L</b>akes <b>P</b>ack <b>B</b>ottoms: Littoral, Limnetic, Profundal, Benthic."
},

/* ---------- 5. Ocean zones ---------- */
{
  id: "ocean", domain: "aqua", title: "Ocean Zones",
  svg: (function () {
    var out = svgOpen(330);
    out += '<path d="M 10 90 L 690 90 L 690 300 L 10 300 Z" fill="var(--d-aqua)" opacity="0.10"/>';
    out += '<path d="M 10 60 L 120 80 C 200 100 220 150 320 170 L 320 300 L 10 300 Z" fill="var(--d-terr)" opacity="0.28"/>';
    out += '<line x1="10" y1="90" x2="690" y2="90" stroke="var(--d-aqua)" stroke-width="3"/>';
    out += '<line x1="10" y1="70" x2="150" y2="92" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="3 3"/>';
    out += '<line x1="330" y1="185" x2="690" y2="185" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="4 4"/>';
    out += txt(560, 180, "sunlight stops here", 11);
    out += slot("o1", 16, 100, 150);
    out += txt(92, 148, "between high &amp; low tide", 11, 500, "middle");
    out += '<path d="M 200 140 q 10 -14 20 0 q 10 -14 20 0 q 10 -14 20 0" fill="none" stroke="var(--d-prod)" stroke-width="3"/>';
    out += slot("o2", 175, 150, 140);
    out += txt(245, 198, "warm, shallow, diverse", 11, 500, "middle");
    out += slot("o3", 460, 108, 150);
    out += txt(535, 155, "sunlight = photosynthesis", 11, 500, "middle");
    out += slot("o4", 460, 210, 150);
    out += txt(535, 258, "no light at all (a = without)", 11, 500, "middle");
    return out + "</svg>";
  })(),
  slots: [
    { id: "o1", label: "Intertidal zone" }, { id: "o2", label: "Coral reef" },
    { id: "o3", label: "Photic zone" }, { id: "o4", label: "Aphotic zone" }
  ],
  distractors: ["Littoral zone"],
  caption: "The <b>intertidal</b> zone is the narrow coastline strip between high and low tide. <b>Coral reefs</b> need warm, shallow water. The open ocean splits by light: <b>photic</b> (sunlit, low nutrients, low productivity) over <b>aphotic</b> (dark). Littoral is the LAKE version of the shallow zone: don't fall for it.",
  mnemonic: "PHOTic = PHOTOsynthesis possible. Aphotic: the A means ABSENT light."
},

/* ---------- 6. Carbon cycle ---------- */
{
  id: "carbon", domain: "cycles", title: "The Carbon Cycle",
  svg: (function () {
    var out = svgOpen(430);
    out += '<rect x="250" y="10" width="200" height="42" rx="21" fill="var(--d-cycles)" opacity="0.18"/>';
    out += txt(350, 37, "CO2 in the atmosphere", 14, 800, "middle", "var(--text-primary)");
    out += '<path d="M 10 330 L 690 330 L 690 420 L 10 420 Z" fill="var(--d-terr)" opacity="0.22"/>';
    out += '<path d="M 480 330 L 690 330 L 690 250 L 480 250 Z" fill="var(--d-aqua)" opacity="0.14"/>';
    out += txt(585, 295, "ocean", 12, 700, "middle");
    out += txt(120, 375, "buried dead plants &amp; animals", 11.5, 500, "middle");
    out += txt(120, 393, "(millions of years)", 11, 500, "middle");
    out += '<path d="M 60 330 L 90 270 L 120 330 Z M 100 330 L 130 260 L 160 330 Z" fill="var(--d-eco)" opacity="0.5"/>';
    out += txt(110, 250, "plants", 11.5, 700, "middle");
    out += txt(260, 322, "animals", 11.5, 700, "middle");
    out += txt(395, 255, "factory / cars", 11.5, 700, "middle");
    out += '<rect x="372" y="262" width="46" height="66" fill="var(--d-energy)" opacity="0.4"/>';
    out += arrow(300, 56, 130, 240);
    out += slot("c1", 130, 128, 152);
    out += arrow(255, 300, 310, 62);
    out += slot("c2", 262, 208, 130);
    out += arrow(400, 258, 372, 60);
    out += slot("c3", 300, 92, 130);
    out += arrow(452, 42, 560, 246);
    out += slot("c4", 486, 150, 190);
    out += arrow(200, 350, 168, 344);
    out += slot("c5", 205, 336, 140);
    out += slot("c6", 30, 336, 130);
    return out + "</svg>";
  })(),
  slots: [
    { id: "c1", label: "Photosynthesis" }, { id: "c2", label: "Respiration" }, { id: "c3", label: "Combustion" },
    { id: "c4", label: "CO2 dissolves in ocean" }, { id: "c5", label: "Decomposition" }, { id: "c6", label: "Fossil fuels" }
  ],
  distractors: ["Transpiration"],
  caption: "The FAST cycle: <b>photosynthesis</b> pulls CO2 down into plants, <b>respiration</b> and <b>decomposition</b> send it back up. The SLOW cycle: buried remains become <b>fossil fuels</b> over millions of years, and <b>combustion</b> releases that ancient carbon in seconds. The <b>ocean</b> is the giant sink that absorbs CO2. Trap label: transpiration is the WATER cycle's plant move.",
  mnemonic: "Down with photosynthesis, up with the 3 C-releasers: resPiration, decomPosition, comBustion."
},

/* ---------- 7. Nitrogen cycle ---------- */
{
  id: "nitrogen", domain: "cycles", title: "The Nitrogen Cycle",
  svg: (function () {
    function box(x, y, w, label, sub) {
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="44" rx="10" fill="var(--d-cycles)" opacity="0.16"/>' +
        txt(x + w / 2, y + 19, label, 13, 800, "middle", "var(--text-primary)") +
        (sub ? txt(x + w / 2, y + 35, sub, 10.5, 500, "middle") : "");
    }
    var out = svgOpen(350);
    out += box(250, 10, 200, "N2 in the air", "78% of the atmosphere");
    out += box(40, 150, 150, "NH3 / NH4", "ammonia / ammonium");
    out += box(275, 265, 150, "NO2 → NO3", "nitrite → nitrate");
    out += box(510, 150, 160, "Plants &amp; animals", "proteins and DNA");
    out += arrow(255, 54, 130, 146);
    out += slot("n1", 78, 88, 160);
    out += arrow(140, 198, 300, 268);
    out += slot("n2", 138, 232, 130);
    out += arrow(425, 280, 555, 198);
    out += slot("n3", 452, 236, 120);
    out += arrow(555, 146, 205, 168);
    out += slot("n4", 285, 180, 140);
    out += arrow(430, 265, 445, 58);
    out += slot("n5", 476, 84, 150);
    out += txt(350, 338, "Bacteria run almost every arrow. N2 is useless to plants until it is FIXED.", 12, 600, "middle");
    return out + "</svg>";
  })(),
  slots: [
    { id: "n1", label: "Nitrogen fixation" }, { id: "n2", label: "Nitrification" }, { id: "n3", label: "Assimilation" },
    { id: "n4", label: "Ammonification" }, { id: "n5", label: "Denitrification" }
  ],
  distractors: ["Photosynthesis"],
  caption: "Follow the loop: <b>fixation</b> turns useless N2 gas into ammonia (bacteria + lightning). <b>Nitrification</b> upgrades it to nitrite then nitrate. Plants absorb nitrate (<b>assimilation</b>) and build proteins and DNA. Death and waste get recycled to ammonium by decomposers (<b>ammonification</b>). Finally <b>denitrification</b> sends nitrogen back to the air as N2.",
  mnemonic: "Fix it, Nitrify it, Assimilate it, Ammonify it, Denitrify it: <b>F</b>at <b>N</b>injas <b>A</b>lways <b>A</b>ttack <b>D</b>ragons."
},

/* ---------- 8. Phosphorus cycle ---------- */
{
  id: "phosphorus", domain: "cycles", title: "The Phosphorus Cycle",
  svg: (function () {
    var out = svgOpen(420);
    out += '<rect x="8" y="8" width="250" height="34" rx="10" fill="var(--d-cycles)" opacity="0.18"/>';
    out += txt(133, 30, "P has NO GAS FORM: rock only!", 12.5, 800, "middle", "var(--text-primary)");
    out += '<path d="M 480 320 L 570 160 L 660 320 Z" fill="var(--d-terr)" opacity="0.45"/>';
    out += txt(570, 300, "rock", 12, 700, "middle");
    out += '<path d="M 10 320 L 690 320 L 690 410 L 10 410 Z" fill="var(--d-terr)" opacity="0.2"/>';
    out += '<path d="M 200 320 L 360 320 L 360 410 L 200 410 Z" fill="var(--d-aqua)" opacity="0.18"/>';
    out += txt(280, 400, "water", 11.5, 700, "middle");
    out += txt(90, 340 , "farm field", 11.5, 700, "middle");
    out += txt(560, 342, "soil (P in soil)", 11.5, 700, "middle");
    out += '<path d="M 400 330 L 430 280 L 460 330 Z" fill="var(--d-eco)" opacity="0.55"/>';
    out += txt(430, 268, "plants", 11.5, 700, "middle");
    out += arrow(560, 180, 480, 330);
    out += slot("p1", 445, 210, 170);
    out += arrow(60, 250, 75, 316);
    out += slot("p2", 16, 220, 120);
    out += arrow(150, 340, 220, 370);
    out += slot("p3", 148, 352, 110);
    out += arrow(520, 330, 452, 310);
    out += slot("p4", 470, 358, 130);
    out += arrow(360, 270, 415, 300);
    out += slot("p5", 268, 250, 140);
    return out + "</svg>";
  })(),
  slots: [
    { id: "p1", label: "Weathering & erosion" }, { id: "p2", label: "Fertilizer" }, { id: "p3", label: "Runoff" },
    { id: "p4", label: "Root uptake" }, { id: "p5", label: "Decomposition" }
  ],
  distractors: ["Evaporation"],
  caption: "Phosphorus creeps: rain and weather break down <b>rock</b> (weathering &amp; erosion), releasing P into soil and water. Plants pull it up by <b>root uptake</b>, animals eat plants, and <b>decomposition</b> returns it. Humans shortcut the cycle with <b>fertilizer</b>, and <b>runoff</b> flushes it into waterways where it feeds algal blooms. The trap: <b>evaporation</b> is impossible here because P has no gas form.",
  mnemonic: "P is a rock star with no air game: it never flies (no gas form), it only rolls downhill: rock → soil → water."
},

/* ---------- 9. Water cycle ---------- */
{
  id: "water", domain: "cycles", title: "The Water (Hydrologic) Cycle",
  svg: (function () {
    var out = svgOpen(430);
    out += '<circle cx="60" cy="55" r="30" fill="var(--d-terr)" opacity="0.55"/>';
    out += txt(20, 105, "the SUN drives the cycle", 11.5, 700, "start");
    out += '<ellipse cx="360" cy="55" rx="90" ry="28" fill="var(--d-aqua)" opacity="0.25"/>';
    out += txt(360, 60, "clouds", 12, 700, "middle");
    out += '<path d="M 10 330 L 250 330 L 250 420 L 10 420 Z" fill="var(--d-aqua)" opacity="0.2"/>';
    out += txt(130, 408, "ocean (the big reservoir)", 11.5, 700, "middle");
    out += '<path d="M 250 330 L 690 330 L 690 420 L 250 420 Z" fill="var(--d-terr)" opacity="0.22"/>';
    out += '<path d="M 480 330 L 560 210 L 640 330 Z" fill="var(--d-terr)" opacity="0.4"/>';
    out += '<path d="M 300 330 L 330 275 L 360 330 Z" fill="var(--d-eco)" opacity="0.5"/>';
    out += txt(330, 262, "tree", 11.5, 700, "middle");
    out += arrow(140, 320, 255, 80);
    out += slot("w1", 118, 180, 130);
    out += arrow(335, 272, 350, 90);
    out += slot("w2", 348, 170, 140);
    out += slot("w3", 300, 12, 130);
    out += arrow(430, 80, 530, 240);
    out += slot("w4", 452, 128, 130);
    out += arrow(510, 300, 300, 345);
    out += slot("w5", 380, 296, 100);
    out += arrow(600, 335, 600, 395);
    out += slot("w6", 505, 358, 180);
    return out + "</svg>";
  })(),
  slots: [
    { id: "w1", label: "Evaporation" }, { id: "w2", label: "Transpiration" }, { id: "w3", label: "Condensation" },
    { id: "w4", label: "Precipitation" }, { id: "w5", label: "Runoff" }, { id: "w6", label: "Infiltration & percolation" }
  ],
  distractors: ["Combustion"],
  caption: "Sun heats the ocean → <b>evaporation</b>. Plants add vapor through their stomata → <b>transpiration</b> (together: evapotranspiration). Vapor cools into clouds → <b>condensation</b>, falls as <b>precipitation</b>, then either races over the surface as <b>runoff</b> (picking up pollutants on concrete) or soaks down through permeable soil as <b>infiltration &amp; percolation</b>, recharging groundwater.",
  mnemonic: "Every Tree Can Pour Rain Inside: Evaporation, Transpiration, Condensation, Precipitation, Runoff, Infiltration."
},

/* ---------- 10. Energy pyramid & 10% rule ---------- */
{
  id: "pyramid", domain: "energy", title: "Energy Pyramid & the 10% Rule",
  svg: (function () {
    var out = svgOpen(430);
    var levels = [
      ["e4", 250, 20, 200, "eats secondary consumers (apex predator)"],
      ["e3", 200, 115, 300, "eat primary consumers"],
      ["e2", 150, 210, 400, "eat plants (herbivores)"],
      ["e1", 100, 305, 500, "convert sunlight → glucose"]
    ];
    out += '<path d="M 350 15 L 130 390 L 570 390 Z" fill="var(--d-energy)" opacity="0.14"/>';
    out += '<line x1="242" y1="200" x2="458" y2="200" stroke="var(--border)" stroke-width="2"/>';
    out += '<line x1="297" y1="105" x2="403" y2="105" stroke="var(--border)" stroke-width="2"/>';
    out += '<line x1="186" y1="295" x2="514" y2="295" stroke="var(--border)" stroke-width="2"/>';
    out += slot("e4", 275, 40, 150);
    out += slot("e3", 262, 118, 176);
    out += slot("e2", 262, 213, 176);
    out += slot("e1", 275, 308, 150);
    out += txt(350, 92, "apex predator", 10.5, 500, "middle");
    out += txt(350, 187, "eat primary consumers", 10.5, 500, "middle");
    out += txt(350, 282, "eat plants", 10.5, 500, "middle");
    out += txt(350, 360, "convert sunlight into glucose", 10.5, 500, "middle");
    out += '<rect x="560" y="330" width="130" height="30" rx="9" fill="var(--d-energy)" opacity="0.2"/>';
    out += txt(625, 350, "10,000 kcal", 12.5, 800, "middle", "var(--text-primary)");
    out += slot("e5", 560, 235, 130);
    out += slot("e6", 560, 140, 130);
    out += slot("e7", 560, 45, 130);
    out += arrow(625, 328, 625, 270);
    out += arrow(625, 233, 625, 175);
    out += arrow(625, 138, 625, 80);
    out += txt(648, 302, "× 10%", 11, 700);
    out += txt(648, 207, "× 10%", 11, 700);
    out += txt(648, 112, "× 10%", 11, 700);
    return out + "</svg>";
  })(),
  slots: [
    { id: "e1", label: "Producers" }, { id: "e2", label: "Primary consumers" },
    { id: "e3", label: "Secondary consumers" }, { id: "e4", label: "Tertiary consumers" },
    { id: "e5", label: "1,000 kcal" }, { id: "e6", label: "100 kcal" }, { id: "e7", label: "10 kcal" }
  ],
  distractors: ["Decomposers", "5,000 kcal"],
  caption: "Only about <b>10%</b> of the energy at each level makes it to the next; the other 90% is lost as <b>heat</b> (2nd law of thermodynamics). Math trick: move the decimal one spot left per level: 10,000 → 1,000 → 100 → 10. That shrinkage is why pyramids are wide at the bottom and why apex predators are rare.",
  mnemonic: "<b>P</b>lease <b>P</b>ass <b>S</b>ome <b>T</b>acos: Producers, Primary, Secondary, Tertiary. And the energy just moves its decimal left."
},

/* ---------- 11. GPP, RL, NPP ---------- */
{
  id: "npp", domain: "prod", title: "GPP − RL = NPP",
  svg: (function () {
    var out = svgOpen(330);
    out += '<circle cx="70" cy="60" r="34" fill="var(--d-terr)" opacity="0.55"/>';
    out += txt(16, 118, "sunlight (only ~1% captured)", 11.5, 700, "start");
    out += arrow(112, 78, 208, 148);
    out += '<rect x="212" y="128" width="200" height="70" rx="14" fill="var(--d-prod)" opacity="0.2"/>';
    out += slot("g1", 237, 148, 150);
    out += txt(312, 216, "TOTAL energy captured by photosynthesis", 10.5, 500, "middle");
    out += arrow(330, 126, 400, 52);
    out += slot("g2", 400, 34, 150);
    out += txt(475, 86, "~60% burned for the plant's own cell processes (lost as heat)", 10, 500, "middle");
    out += arrow(414, 172, 500, 220);
    out += slot("g3", 500, 228, 150);
    out += txt(540, 280, "~40% left over: growth and the food chain", 10.5, 500, "middle");
    out += txt(240, 310, "NPP = GPP − RL   (example: 85,000 − 8,000 = 77,000 kcal/m2/yr)", 12.5, 700);
    return out + "</svg>";
  })(),
  slots: [
    { id: "g1", label: "GPP (gross)" }, { id: "g2", label: "RL (respiration loss)" }, { id: "g3", label: "NPP (net)" }
  ],
  distractors: ["GDP (wrong class)"],
  caption: "Think paycheck: <b>GPP</b> is the whole paycheck (all energy captured), <b>RL</b> is the bills the plant must pay to stay alive (~60%, lost as heat), and <b>NPP</b> is the take-home pay (~40%) that becomes growth and food for everything else. NPP = GPP − RL.",
  mnemonic: "Gross pay − bills = Net pay. Plants do taxes too."
},

/* ---------- 12. Biome latitude bands ---------- */
{
  id: "latitude", domain: "terr", title: "Biome Latitude Bands",
  svg: (function () {
    var out = svgOpen(360);
    out += '<rect x="120" y="30" width="460" height="80" rx="12" fill="var(--d-aqua)" opacity="0.18"/>';
    out += '<rect x="120" y="118" width="460" height="80" rx="12" fill="var(--d-eco)" opacity="0.16"/>';
    out += '<rect x="120" y="206" width="460" height="80" rx="12" fill="var(--d-energy)" opacity="0.16"/>';
    out += txt(96, 40, "90°", 12, 700, "end");
    out += txt(96, 122, "60°", 12, 700, "end");
    out += txt(96, 210, "30°", 12, 700, "end");
    out += txt(96, 296, "0°", 12, 700, "end");
    out += txt(60, 320, "equator →", 11.5, 600);
    out += '<line x1="120" y1="290" x2="580" y2="290" stroke="var(--text-muted)" stroke-width="2" stroke-dasharray="6 4"/>';
    out += slot("b1", 150, 55, 170);
    out += txt(430, 62, "coldest: farthest from equator", 11, 500, "start");
    out += txt(430, 78, "(tundra, taiga, permafrost)", 11, 500, "start");
    out += slot("b2", 150, 143, 170);
    out += txt(430, 150, "seasons + fertile soil", 11, 500, "start");
    out += txt(430, 166, "(grasslands, deciduous forest)", 11, 500, "start");
    out += slot("b3", 150, 231, 170);
    out += txt(430, 238, "warm + wet, most biodiverse", 11, 500, "start");
    out += txt(430, 254, "(tropical rainforest)", 11, 500, "start");
    out += txt(350, 344, "Latitude sets temperature and rain, which is why biomes form predictable bands.", 11.5, 600, "middle");
    return out + "</svg>";
  })(),
  slots: [
    { id: "b1", label: "Tundra & Boreal (60°+)" }, { id: "b2", label: "Temperate (30°-60°)" }, { id: "b3", label: "Tropical (0°-30°)" }
  ],
  distractors: ["Estuary"],
  caption: "Distance from the equator (latitude) controls temperature and precipitation, so biomes stack in bands: <b>tropical</b> near the equator, <b>temperate</b> in the middle latitudes, <b>tundra and boreal</b> above 60°. As climate change warms the planet, these bands <b>shift</b> toward the poles.",
  mnemonic: "Equator = heater. The farther you walk from the heater, the colder the room gets."
}

];
})();

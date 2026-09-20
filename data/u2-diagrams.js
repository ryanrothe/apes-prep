/* Terra Unit 2 diagram library (APES: The Living World, Biodiversity).
   Same two-mode contract as the Unit 1 diagrams: Study (labels on) and Label It (slots blank). */
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

/* Stacked rows: [slotId, descriptor, secondLine?]. Slot on the left, text on the right.
   opts: slotWidth, top, gap, pad, title, footer. Returns a complete <svg>. */
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

/* ---------- 1. Three levels of biodiversity ---------- */
D.push({
  id: "u2-biodiv-levels", domain: "bio", title: "The Three Levels of Biodiversity",
  svg: rows([
    ["bl1", "the number of different HABITATS in an area (pond + meadow + forest)"],
    ["bl2", "the number of different SPECIES living there"],
    ["bl3", "how different the GENES are inside one species"]
  ], "bio", { slotWidth: 190, top: 10, gap: 60, footer: "HIGH BIODIVERSITY = HIGH ECOSYSTEM HEALTH" }),
  slots: [
    { id: "bl1", label: "Ecosystem diversity" },
    { id: "bl2", label: "Species diversity" },
    { id: "bl3", label: "Genetic diversity" }
  ],
  distractors: ["Species evenness"],
  caption: "Zoom in one step at a time: <b>ecosystem</b> diversity counts habitats, <b>species</b> diversity counts species, <b>genetic</b> diversity looks inside a single species at its genes. Trap: <b>evenness</b> is not a level of biodiversity, it is a way of measuring species diversity.",
  mnemonic: "Big to small: <b>E</b>cosystem, <b>S</b>pecies, <b>G</b>enes. Habitats, then species, then DNA."
});

/* ---------- 2. Richness vs evenness ---------- */
D.push({
  id: "u2-rich-even", domain: "bio", title: "Richness vs Evenness",
  svg: (function () {
    var out = svgOpen(268);
    [["Community 1", 8, ["25%", "25%", "25%", "25%"], "re1"], ["Community 2", 356, ["6%", "12%", "70%", "12%"], "re2"]].forEach(function (c) {
      var x = c[1];
      out += '<rect x="' + x + '" y="8" width="336" height="150" rx="12" fill="var(--d-bio)" opacity="0.10"/>';
      out += txt(x + 168, 30, c[0], 13, 700, "middle", "var(--text-primary)");
      c[2].forEach(function (p, i) {
        var bx = x + 18 + i * 78, h = Math.max(10, parseInt(p) * 0.9);
        out += '<rect x="' + bx + '" y="' + (112 - h) + '" width="46" height="' + h + '" rx="5" fill="var(--d-bio)" opacity="0.65"/>';
        out += txt(bx + 23, 128, p, 11.5, 600, "middle");
      });
      out += slot(c[3], x + 78, 136, 180);
    });
    out += '<rect x="8" y="170" width="684" height="46" rx="12" fill="var(--d-bio)" opacity="0.16"/>';
    out += slot("re3", 16, 178, 200);
    out += txt(230, 198, "both communities have 4 species, so this measure is EQUAL", 12.5);
    out += txt(350, 246, "Same richness. Community 1 is more balanced, so it is better off.", 12, 500, "middle");
    return out + "</svg>";
  })(),
  slots: [
    { id: "re1", label: "High evenness" },
    { id: "re2", label: "Low evenness" },
    { id: "re3", label: "Species richness" }
  ],
  distractors: ["Genetic diversity", "Ecosystem diversity"],
  caption: "Both communities hold 4 tree species, so <b>richness</b> ties at 4. Community 1 splits 25/25/25/25, which is <b>high evenness</b>. Community 2 lets one species take 70 percent, which is <b>low evenness</b>. Trap: a dominant species does not raise richness, it lowers evenness.",
  mnemonic: "Richness <b>counts</b>. Evenness <b>balances</b>."
});

/* ---------- 3. Bottleneck effect ---------- */
D.push({
  id: "u2-bottleneck", domain: "bio", title: "The Bottleneck Effect",
  svg: (function () {
    var out = svgOpen(252);
    var cols = [
      ["bn1", 8, "40% black", "10% brown", "50% white"],
      ["bn2", 244, "a hurricane hits", "survivors are random", "genes do not matter"],
      ["bn3", 480, "67% black", "33% brown", "0% white"]
    ];
    cols.forEach(function (c, i) {
      out += '<rect x="' + c[1] + '" y="8" width="212" height="118" rx="12" fill="var(--d-bio)" opacity="' + (0.10 + i * 0.03) + '"/>';
      out += txt(c[1] + 106, 34, c[2], 12.5, 600, "middle", "var(--text-primary)");
      out += txt(c[1] + 106, 56, c[3], 12, 500, "middle");
      out += txt(c[1] + 106, 78, c[4], 12, 500, "middle");
      out += slot(c[0], c[1] + 16, 90, 180);
      if (i < 2) out += arrow(c[1] + 216, 67, c[1] + 240, 67);
    });
    out += '<rect x="8" y="140" width="684" height="46" rx="12" fill="var(--d-bio)" opacity="0.18"/>';
    out += slot("bn4", 16, 148, 220);
    out += txt(250, 168, "the white gene version is gone forever, so this is the result", 12.5);
    out += txt(350, 214, "Genetic drift: the survivors were lucky, not fitter.", 12.5, 600, "middle", "var(--d-bio)");
    out += txt(350, 234, "A bottleneck kills REGARDLESS of genome.", 12, 500, "middle");
    return out + "</svg>";
  })(),
  slots: [
    { id: "bn1", label: "Original population" },
    { id: "bn2", label: "Bottleneck event" },
    { id: "bn3", label: "Surviving population" },
    { id: "bn4", label: "Reduced genetic diversity" }
  ],
  distractors: ["Inbreeding depression", "Natural selection"],
  caption: "A disturbance crashes the population <b>regardless of genome</b>, so the survivors are a random slice of the old gene pool. White beetles were not selected against, they were just unlucky. Trap: this is <b>not natural selection</b> (no trait was favored) and not <b>inbreeding depression</b> (that is harm from relatives mating afterward).",
  mnemonic: "Bottleneck = bad luck. Natural selection = bad traits."
});

/* ---------- 4. The four ecosystem services ---------- */
D.push({
  id: "u2-services", domain: "serv", title: "The Four Ecosystem Services",
  svg: rows([
    ["sv1", "GOODS taken directly from nature: fishing, hunting, lumber, rubber", "disrupted by overharvest or clearing land"],
    ["sv2", "STABILIZE and PROTECT: trees lower CO2 and filter air pollutants", "disrupted by deforestation"],
    ["sv3", "BUILD and MAINTAIN what we would otherwise do: bees pollinate, wetlands filter water", "disrupted by pollinator habitat loss and filling wetlands"],
    ["sv4", "money from RECREATION and knowledge: parks, camping, licenses", "disrupted by pollution, urbanization and deforestation"]
  ], "serv", { slotWidth: 150, top: 12, gap: 62, title: "Goods and services from nature that benefit humans" }),
  slots: [
    { id: "sv1", label: "Provisioning" },
    { id: "sv2", label: "Regulating" },
    { id: "sv3", label: "Supporting" },
    { id: "sv4", label: "Cultural" }
  ],
  distractors: ["Anthropogenic"],
  caption: "Four categories, four verbs. <b>Provisioning</b> = take it. <b>Regulating</b> = stabilize and protect. <b>Supporting</b> = build and maintain. <b>Cultural</b> = enjoy and learn. Trap: <b>anthropogenic</b> is not a category, it just means human caused.",
  mnemonic: "<b>P</b>retty <b>R</b>ad <b>S</b>ea <b>C</b>reatures: Provisioning, Regulating, Supporting, Cultural."
});

/* ---------- 5. Island biogeography ---------- */
D.push({
  id: "u2-island", domain: "isl", title: "Island Biogeography: the Two Rules",
  svg: (function () {
    var out = svgOpen(300);
    /* graph 1: area vs species (up) */
    out += '<rect x="8" y="8" width="336" height="130" rx="12" fill="var(--d-isl)" opacity="0.10"/>';
    out += txt(176, 28, "island AREA vs number of species", 12, 600, "middle", "var(--text-primary)");
    out += '<line x1="48" y1="120" x2="316" y2="120" stroke="var(--text-muted)" stroke-width="1.5"/>';
    out += '<line x1="48" y1="120" x2="48" y2="40" stroke="var(--text-muted)" stroke-width="1.5"/>';
    out += '<line x1="58" y1="112" x2="306" y2="48" stroke="var(--d-isl)" stroke-width="2.5"/>';
    /* graph 2: distance vs species (down) */
    out += '<rect x="356" y="8" width="336" height="130" rx="12" fill="var(--d-isl)" opacity="0.10"/>';
    out += txt(524, 28, "DISTANCE from mainland vs number of species", 12, 600, "middle", "var(--text-primary)");
    out += '<line x1="396" y1="120" x2="664" y2="120" stroke="var(--text-muted)" stroke-width="1.5"/>';
    out += '<line x1="396" y1="120" x2="396" y2="40" stroke="var(--text-muted)" stroke-width="1.5"/>';
    out += '<line x1="406" y1="48" x2="654" y2="112" stroke="var(--d-isl)" stroke-width="2.5"/>';
    out += slot("is1", 66, 146, 212);
    out += txt(286, 166, "this line", 11.5);
    out += slot("is2", 414, 146, 212);
    out += txt(634, 166, "this line", 11.5);
    [["is3", "a LARGER island supports more species because it offers more of these"],
     ["is4", "an island CLOSER to the mainland has more species because this is easier"]].forEach(function (r, i) {
      var y = 190 + i * 52;
      out += '<rect x="8" y="' + y + '" width="684" height="44" rx="12" fill="var(--d-isl)" opacity="' + (0.13 + i * 0.03) + '"/>';
      out += slot(r[0], 16, y + 7, 190);
      out += txt(218, y + 27, r[1], 12.5);
    });
    return out + "</svg>";
  })(),
  slots: [
    { id: "is1", label: "Positive correlation" },
    { id: "is2", label: "Inverse relationship" },
    { id: "is3", label: "Niches and food sources" },
    { id: "is4", label: "Migration" }
  ],
  distractors: ["No correlation"],
  caption: "Rule 1: bigger island, more species, so area and richness show a <b>positive correlation</b> (line slopes up). Rule 2: farther island, fewer species, an <b>inverse relationship</b> (line slopes down). Big islands win on <b>niches and food sources</b>; near islands win because <b>migration</b> by swimming or flying is easier.",
  mnemonic: "Big and near beats small and far, every time."
});

/* ---------- 6. Habitat fragmentation ---------- */
D.push({
  id: "u2-fragmentation", domain: "isl", title: "Habitat Fragmentation and Corridors",
  svg: (function () {
    var out = svgOpen(296);
    out += '<rect x="8" y="8" width="212" height="96" rx="10" fill="var(--d-isl)" opacity="0.45"/>';
    out += txt(114, 118, "before", 11.5, 600, "middle");
    out += arrow(228, 56, 252, 56);
    [[262, 8], [380, 8], [262, 62], [380, 62]].forEach(function (p) {
      out += '<rect x="' + p[0] + '" y="' + p[1] + '" width="104" height="42" rx="8" fill="var(--d-isl)" opacity="0.45"/>';
    });
    out += '<line x1="256" y1="56" x2="490" y2="56" stroke="var(--text-muted)" stroke-width="3" stroke-dasharray="7 5"/>';
    out += '<line x1="373" y1="4" x2="373" y2="108" stroke="var(--text-muted)" stroke-width="3" stroke-dasharray="7 5"/>';
    out += txt(373, 122, "after: roads and farms cut it apart", 11.5, 600, "middle");
    out += '<rect x="516" y="30" width="72" height="50" rx="8" fill="var(--d-isl)" opacity="0.45"/>';
    out += '<rect x="620" y="30" width="72" height="50" rx="8" fill="var(--d-isl)" opacity="0.45"/>';
    out += '<rect x="588" y="46" width="32" height="18" rx="6" fill="var(--d-isl)" opacity="0.8"/>';
    out += txt(604, 118, "reconnected", 11.5, 600, "middle");
    [["fr1", "one large, continuous expanse of natural habitat"],
     ["fr2", "that expanse broken into smaller, isolated, scattered patches"],
     ["fr3", "the very different edge (road, field, city) that now surrounds each patch"],
     ["fr4", "a connection point that lets animals move and breed between patches"]].forEach(function (r, i) {
      var y = 136 + i * 40;
      out += '<rect x="8" y="' + y + '" width="684" height="34" rx="10" fill="var(--d-isl)" opacity="' + (0.10 + i * 0.03) + '"/>';
      out += slot(r[0], 14, y + 2, 186);
      out += txt(212, y + 22, r[1], 12);
    });
    return out + "</svg>";
  })(),
  slots: [
    { id: "fr1", label: "Continuous habitat" },
    { id: "fr2", label: "Habitat fragmentation" },
    { id: "fr3", label: "Altered perimeter" },
    { id: "fr4", label: "Wildlife corridor" }
  ],
  distractors: ["Ecological succession"],
  caption: "Each leftover patch behaves like an <b>island</b>: small and isolated means fewer species, smaller populations and more inbreeding. The damage is not only lost area, it is the <b>altered perimeter</b> that changes conditions inside every patch. <b>Wildlife corridors</b> mitigate it by reconnecting the gene pools.",
  mnemonic: "Fragmentation makes islands out of forests. Corridors turn them back into one."
});

/* ---------- 7. Ecological tolerance curve ---------- */
D.push({
  id: "u2-tolerance", domain: "tol", title: "The Ecological Tolerance Curve",
  svg: (function () {
    var out = svgOpen(376);
    var x0 = 20, bw = 132, bands = ["A", "B", "C", "B", "A"];
    bands.forEach(function (lab, i) {
      var x = x0 + i * bw, op = lab === "C" ? 0.26 : (lab === "B" ? 0.16 : 0.07);
      out += '<rect x="' + x + '" y="24" width="' + bw + '" height="150" rx="' + (i === 0 || i === 4 ? 10 : 0) + '" fill="var(--d-tol)" opacity="' + op + '"/>';
      out += txt(x + bw / 2, 44, "band " + lab, 12.5, 700, "middle", "var(--text-primary)");
    });
    out += '<path d="M20 174 C 130 174, 180 60, 350 60 C 520 60, 570 174, 680 174" fill="none" stroke="var(--d-tol)" stroke-width="3"/>';
    out += '<line x1="20" y1="174" x2="680" y2="174" stroke="var(--text-muted)" stroke-width="1.5"/>';
    out += txt(20, 192, "too cold / too acidic", 11.5);
    out += txt(680, 192, "too hot / too alkaline", 11.5, 500, "end");
    out += txt(350, 192, "the condition (temperature, pH, salinity)", 11.5, 600, "middle");
    out += txt(14, 212, "y-axis = number of organisms. The curve peaks where conditions are best.", 11.5);
    [["tz1", "band C: the organism THRIVES and REPRODUCES"],
     ["tz2", "band B: it SURVIVES but lacks fertility and growth"],
     ["tz3", "band A: it DIES (thermal shock, lack of oxygen)"]].forEach(function (r, i) {
      var y = 226 + i * 48;
      out += '<rect x="8" y="' + y + '" width="684" height="42" rx="12" fill="var(--d-tol)" opacity="' + (0.10 + i * 0.04) + '"/>';
      out += slot(r[0], 16, y + 6, 236);
      out += txt(264, y + 26, r[1], 12.5);
    });
    return out + "</svg>";
  })(),
  slots: [
    { id: "tz1", label: "Optimal range" },
    { id: "tz2", label: "Zone of physiological stress" },
    { id: "tz3", label: "Zone of intolerance" }
  ],
  distractors: ["Fundamental niche", "Realized niche"],
  caption: "The curve is <b>symmetrical</b>: too little of a condition kills just as surely as too much, so band A and band B each appear on both sides. Read it as thrive, struggle, die. Trap: <b>fundamental niche</b> is another name for the whole tolerance range and <b>realized niche</b> is where the species actually lives once competitors are added, so neither is a zone on this graph.",
  mnemonic: "Center out: <b>thrive</b>, <b>struggle</b>, <b>die</b>."
});

/* ---------- 8. Types of natural disturbance ---------- */
D.push({
  id: "u2-disturbance", domain: "dist", title: "Three Types of Natural Disturbance",
  svg: rows([
    ["dt1", "REGULAR frequency, you could put it on a calendar (dry and wet seasons)"],
    ["dt2", "IRREGULAR frequency, it recurs but you cannot date it (hurricane, tornado)"],
    ["dt3", "NO regular occurrence at all (volcano, asteroid, earthquake)"]
  ], "dist", { slotWidth: 160, top: 12, gap: 58, title: "An event that disrupts an ecosystem, sorted by how often it happens" }),
  slots: [
    { id: "dt1", label: "Periodic" },
    { id: "dt2", label: "Episodic" },
    { id: "dt3", label: "Random" }
  ],
  distractors: ["Anthropogenic"],
  caption: "All three are <b>natural</b>, and natural disturbances can be even greater than human ones. The split is frequency: <b>periodic</b> is scheduled, <b>episodic</b> recurs without a schedule, <b>random</b> has no pattern at all. Trap: <b>anthropogenic</b> means human caused, so it does not belong on this list.",
  mnemonic: "Periodic = <b>P</b>redictable. Episodic = <b>E</b>xpected but undated. Random = no pattern."
});

/* ---------- 9. Natural selection, step by step ---------- */
D.push({
  id: "u2-selection", domain: "adapt", title: "How Natural Selection Works",
  svg: (function () {
    var out = svgOpen(266);
    var list = [
      ["ns1", "random DNA mutation and crossing over make individuals different"],
      ["ns2", "a drought or a hawk kills the less-suited individuals"],
      ["ns3", "the better-adapted individuals survive and reproduce"],
      ["ns4", "the helpful trait becomes common in the population"]
    ];
    list.forEach(function (r, i) {
      var y = 10 + i * 62;
      out += '<rect x="8" y="' + y + '" width="684" height="44" rx="12" fill="var(--d-adapt)" opacity="' + (0.09 + i * 0.04) + '"/>';
      out += slot(r[0], 16, y + 7, 210);
      out += txt(240, y + 28, r[1], 12.5);
      if (i < list.length - 1) out += arrow(121, y + 44, 121, y + 60);
    });
    return out + "</svg>";
  })(),
  slots: [
    { id: "ns1", label: "Genetic variation" },
    { id: "ns2", label: "Selective pressure" },
    { id: "ns3", label: "Survive and reproduce" },
    { id: "ns4", label: "Adaptation" }
  ],
  distractors: ["Individuals evolve"],
  caption: "Variation has to exist <b>first</b>, because selection can only pick from what is already there. Then the <b>selective pressure</b> filters, survivors reproduce, and the trait spreads. Trap: <b>individuals never evolve</b>. A single mouse does not turn darker, the population's gene mix shifts across generations.",
  mnemonic: "<b>V</b>ariation, <b>P</b>ressure, <b>S</b>urvival, <b>S</b>pread."
});

/* ---------- 10. Primary vs secondary succession ---------- */
D.push({
  id: "u2-succession", domain: "succ", title: "Succession: Types and Stages",
  svg: rows([
    ["sc1", "starts on BARE ROCK with no soil (volcano, glacial retreat). Very slow"],
    ["sc2", "an ALREADY ESTABLISHED ecosystem after a disturbance (fire). Much faster"],
    ["sc3", "first colonizers, fast growing, wind or animal seeds: moss, lichen, grasses"],
    ["sc4", "deeper soil, more nutrients: shrubs, bushes, fast trees like pine and aspen"],
    ["sc5", "deepened soil enriched by nutrient cycling: slow trees like maple and oak"]
  ], "succ", { slotWidth: 200, top: 12, gap: 58, title: "The one question that splits the two types: is there soil already?" }),
  slots: [
    { id: "sc1", label: "Primary succession" },
    { id: "sc2", label: "Secondary succession" },
    { id: "sc3", label: "Pioneer species" },
    { id: "sc4", label: "Mid-successional species" },
    { id: "sc5", label: "Climax community" }
  ],
  distractors: ["Keystone species"],
  caption: "Soil is the whole test: no soil means <b>primary</b> and centuries of waiting while mosses and lichens grind rock into soil, soil present means <b>secondary</b> and a much faster comeback. Either way the stages run pioneer, mid-successional, climax, named by which plants dominate.",
  mnemonic: "<b>P</b>rimary = <b>P</b>lain rock. Secondary = soil survived."
});

/* ---------- 11. Invasive vs indicator vs keystone ---------- */
D.push({
  id: "u2-species-roles", domain: "succ", title: "Invasive vs Indicator vs Keystone",
  svg: rows([
    ["sr1", "non-native, spreads fast, has NO natural predator here, causes harm"],
    ["sr2", "its presence, absence or health REVEALS the condition of the ecosystem"],
    ["sr3", "small population, huge influence; remove it and a trophic cascade follows"],
    ["sr4", "the first colonizing species on bare rock or after a fire"]
  ], "succ", { slotWidth: 200, top: 12, gap: 58, title: "Four species roles that are easy to mix up" }),
  slots: [
    { id: "sr1", label: "Invasive species" },
    { id: "sr2", label: "Indicator species" },
    { id: "sr3", label: "Keystone species" },
    { id: "sr4", label: "Pioneer species" }
  ],
  distractors: ["Native species"],
  caption: "An <b>indicator</b> is a thermometer: it tells you the condition, and it is usually a specialist with a narrow tolerance range. A <b>keystone</b> is a support beam: sea otters, beavers, gray wolves. An <b>invasive</b> wins because nothing here eats it. Trap: <b>native</b> just means it belongs here, it is not a role.",
  mnemonic: "Indicator <b>tells</b>. Keystone <b>holds</b>. Invasive <b>takes</b>."
});

})();

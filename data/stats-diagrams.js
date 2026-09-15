/* Statistics diagram library. Same two-mode contract as the APES diagrams: Study (labels on) and Label It (slots blank).
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
function line(x1, y1, x2, y2, w, dash, color) {
  return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (color || "var(--text-muted)") + '" stroke-width="' + (w || 1.5) + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : "") + "/>";
}
function arrow(x1, y1, x2, y2) {
  var ang = Math.atan2(y2 - y1, x2 - x1), L = 9;
  var p1x = x2 - L * Math.cos(ang - 0.42), p1y = y2 - L * Math.sin(ang - 0.42);
  var p2x = x2 - L * Math.cos(ang + 0.42), p2y = y2 - L * Math.sin(ang + 0.42);
  return line(x1, y1, x2, y2, 2) + '<polygon points="' + x2 + "," + y2 + " " + p1x + "," + p1y + " " + p2x + "," + p2y + '" fill="var(--text-muted)"/>';
}
function svgOpen(h) { return '<svg viewBox="0 0 700 ' + h + '" xmlns="http://www.w3.org/2000/svg" font-family="inherit">'; }
/* number line with integer ticks from a to b, labels every `every` */
function numberLine(x0, x1, y, a, b, every) {
  var out = line(x0 - 10, y, x1 + 10, y, 2, null, "var(--text-secondary)");
  var scale = (x1 - x0) / (b - a);
  for (var v = a; v <= b; v++) {
    var x = x0 + (v - a) * scale;
    out += line(x, y - 5, x, y + 5, 1.5, null, "var(--text-secondary)");
    if ((v - a) % every === 0) out += txt(x, y + 20, String(v), 11.5, 600, "middle");
  }
  return out;
}
/* mini histogram: bars touch; heights in units of `unit` px, baseline y */
function hist(x0, baseY, heights, bw, unit, color) {
  var out = "";
  heights.forEach(function (h, i) {
    out += '<rect x="' + (x0 + i * bw) + '" y="' + (baseY - h * unit) + '" width="' + bw + '" height="' + (h * unit) + '" fill="' + color + '" opacity="0.45" stroke="' + color + '" stroke-width="1.2"/>';
  });
  out += line(x0 - 6, baseY, x0 + heights.length * bw + 6, baseY, 1.5, null, "var(--text-secondary)");
  return out;
}

window.DIAGRAMS = window.DIAGRAMS || [];
var D = window.DIAGRAMS;

/* ---------- 1. Box plot anatomy (the test grades) ---------- */
D.push({
  id: "st-boxplot", domain: "box", title: "Box Plot Anatomy (the test grades)",
  svg: (function () {
    var X = function (v) { return 60 + (v - 40) * 10; };
    var out = svgOpen(290);
    /* whiskers + box */
    out += line(X(56), 150, X(74.5), 150, 2.5, null, "var(--text-primary)");
    out += line(X(95), 150, X(100), 150, 2.5, null, "var(--text-primary)");
    out += line(X(56), 138, X(56), 162, 2.5, null, "var(--text-primary)");
    out += line(X(100), 138, X(100), 162, 2.5, null, "var(--text-primary)");
    out += '<rect x="' + X(74.5) + '" y="120" width="' + (X(95) - X(74.5)) + '" height="60" fill="var(--d-box)" opacity="0.18" stroke="var(--text-primary)" stroke-width="2.5"/>';
    out += line(X(88.5), 120, X(88.5), 180, 3.5, null, "var(--text-primary)");
    /* values */
    [[56, "56"], [74.5, "74.5"], [88.5, "88.5"], [95, "95"], [100, "100"]].forEach(function (p) {
      out += txt(X(p[0]), 198, p[1], 11.5, 700, "middle", "var(--text-primary)");
    });
    out += numberLine(X(40), X(100), 218, 40, 100, 10);
    /* slots row A (y 40) and row B (y 80) with leaders */
    out += txt(X(56), 30, "smallest value", 10.5, 600, "middle");
    out += slot("b1", 165, 40, 110); out += line(220, 70, X(56), 136, 1.2, "3,3");
    out += txt(525, 30, "the middle value", 10.5, 600, "middle");
    out += slot("b3", 470, 40, 110); out += line(525, 70, X(88.5), 118, 1.2, "3,3");
    out += txt(645, 30, "largest value", 10.5, 600, "middle");
    out += slot("b5", 600, 40, 92); out += line(646, 70, X(100), 136, 1.2, "3,3");
    out += slot("b2", 350, 80, 110); out += line(405, 110, X(74.5), 118, 1.2, "3,3");
    out += slot("b4", 540, 80, 100); out += line(590, 110, X(95), 118, 1.2, "3,3");
    out += txt(350, 262, "Left box edge = middle of the lower half · Right box edge = middle of the upper half · Box width = IQR = 20.5", 10.5, 500, "middle");
    return out + "</svg>";
  })(),
  slots: [
    { id: "b1", label: "Minimum" }, { id: "b2", label: "Q1" }, { id: "b3", label: "Median" },
    { id: "b4", label: "Q3" }, { id: "b5", label: "Maximum" }
  ],
  distractors: ["Mean", "Range"],
  caption: "The box runs from <b>Q1 (74.5)</b> to <b>Q3 (95)</b>, so it holds the middle 50% of the grades and its width is the IQR (20.5). The line inside is the <b>median (88.5)</b>, not the mean. Whiskers reach out to the <b>min (56)</b> and <b>max (100)</b> because the 1.5 x IQR check found no outliers. Trap: Mean and Range are not parts of a box plot.",
  mnemonic: "Min, Q1, Med, Q3, Max: five numbers, left to right, always in order."
});

/* ---------- 2. Shape gallery ---------- */
D.push({
  id: "st-shapes", domain: "socv", title: "Shape Gallery",
  svg: (function () {
    var panels = [
      ["s1", [1, 3, 7, 7, 3, 1], "fold it: halves match"],
      ["s2", [1, 2, 3, 5, 7, 9], "thin tail drags LEFT"],
      ["s3", [5, 5, 5, 5, 5, 5], "flat: every bar alike"],
      ["s4", [9, 7, 5, 3, 2, 1], "thin tail drags RIGHT"],
      ["s5", [2, 7, 4, 1, 4, 7], "two peaks"]
    ];
    var out = svgOpen(215);
    panels.forEach(function (p, i) {
      var x0 = 15 + i * 137;
      out += txt(x0 + 65, 30, p[2], 10.5, 600, "middle");
      out += hist(x0 + 17, 145, p[1], 16, 10, "var(--d-socv)");
      out += slot(p[0], x0 + 5, 165, 120);
    });
    return out + "</svg>";
  })(),
  slots: [
    { id: "s1", label: "Symmetric" }, { id: "s2", label: "Skewed left" }, { id: "s3", label: "Uniform" },
    { id: "s4", label: "Skewed right" }, { id: "s5", label: "Bimodal" }
  ],
  distractors: ["Skewed up", "Random"],
  caption: "Name a skew for the <b>tail</b>, not the tall part. <b>Skewed right</b> = the thin tail drags toward the higher values on the right. <b>Symmetric</b> = fold it in the middle and the halves match. <b>Uniform</b> = flat, every bar about the same. <b>Bimodal</b> = two peaks, usually two groups mixed together.",
  mnemonic: "The tail tells the tale."
});

/* ---------- 3. Which graph? decision tree ---------- */
D.push({
  id: "st-graph-picker", domain: "dtype", title: "Which Graph? Decision Tree",
  svg: (function () {
    var out = svgOpen(255);
    out += '<rect x="240" y="8" width="220" height="38" rx="12" fill="var(--d-dtype)" opacity="0.18"/>';
    out += txt(350, 32, "What kind of variable is it?", 13, 700, "middle", "var(--text-primary)");
    out += arrow(300, 46, 165, 78); out += arrow(400, 46, 535, 78);
    out += slot("c1", 90, 80, 150); out += slot("c2", 460, 80, 150);
    out += txt(165, 128, "labels or groups", 10.5, 600, "middle");
    out += txt(165, 141, "(major, color, shape)", 10.5, 600, "middle");
    out += txt(535, 128, "numbers you can do math with", 10.5, 600, "middle");
    out += txt(535, 141, "(height, pages, temperature)", 10.5, 600, "middle");
    out += arrow(140, 146, 96, 168); out += arrow(190, 146, 220, 168);
    out += arrow(500, 145, 408, 168); out += arrow(535, 145, 522, 168); out += arrow(570, 145, 636, 168);
    out += slot("g1", 30, 170, 122); out += slot("g2", 162, 170, 122);
    out += slot("g3", 350, 170, 112); out += slot("g4", 468, 170, 112); out += slot("g5", 586, 170, 108);
    out += txt(91, 222, "gaps between bars", 10.5, 600, "middle"); out += txt(223, 222, "share of the whole", 10.5, 600, "middle");
    out += txt(406, 222, "one dot per value", 10.5, 600, "middle"); out += txt(524, 222, "bars touch, intervals", 10.5, 600, "middle"); out += txt(640, 222, "five-number summary", 10.5, 600, "middle");
    return out + "</svg>";
  })(),
  slots: [
    { id: "c1", label: "Categorical" }, { id: "c2", label: "Quantitative" },
    { id: "g1", label: "Bar graph" }, { id: "g2", label: "Pie chart" },
    { id: "g3", label: "Dot plot" }, { id: "g4", label: "Histogram" }, { id: "g5", label: "Box plot" }
  ],
  distractors: ["Skewed right", "Table"],
  caption: "First ask: is the variable a label (<b>categorical</b>) or a number you can do math with (<b>quantitative</b>)? Categorical data get <b>bar graphs</b> and <b>pie charts</b>. Quantitative data get <b>dot plots</b>, <b>histograms</b>, and <b>box plots</b>. Trap: 'Skewed right' is a shape you describe, not a graph you draw."
});

/* ---------- 4. SOCV checklist ---------- */
D.push({
  id: "st-socv", domain: "socv", title: "SOCV: Describe a Distribution",
  svg: (function () {
    var rows = [
      ["v4", "check the 1.5 x IQR fences, then say 'none' or list them"],
      ["v1", "skewed left / skewed right / symmetric / uniform / bimodal"],
      ["v3", "IQR (with the median) or standard deviation (with the mean); range works too"],
      ["v2", "median (skewed) or mean (symmetric), and give the number"]
    ];
    var out = svgOpen(rows.length * 54 + 30);
    out += txt(14, 20, "Every description names all four. Which part is which?", 12, 700, "start", "var(--text-primary)");
    rows.forEach(function (r, i) {
      var y = 32 + i * 54;
      out += '<rect x="8" y="' + y + '" width="684" height="46" rx="12" fill="var(--d-socv)" opacity="0.10"/>';
      out += slot(r[0], 18, y + 8, 140);
      out += txt(172, y + 28, r[1], 12);
    });
    return out + "</svg>";
  })(),
  slots: [
    { id: "v1", label: "Shape" }, { id: "v2", label: "Center" }, { id: "v3", label: "Variability" }, { id: "v4", label: "Outliers" }
  ],
  distractors: ["Size", "Value"],
  caption: "Every description has four parts: <b>Shape, Center, Variability, Outliers</b>. Write them as a checklist. From the die dot plot: S: skewed right (slightly). C: median of 3. V: IQR = 3. O: none (fences at -2.5 and 9.5).",
  mnemonic: "SOCV: Some Old Cats Vanish. Shape, Outliers, Center, Variability."
});

/* ---------- 5. Which measures go together ---------- */
D.push({
  id: "st-measure-match", domain: "socv", title: "Which Measures Go Together",
  svg: (function () {
    var out = svgOpen(185);
    out += txt(305, 22, "Center", 12, 700, "middle", "var(--text-primary)");
    out += txt(525, 22, "Spread", 12, 700, "middle", "var(--text-primary)");
    var rows = [
      [36, "Symmetric shape,", "no outliers", "m1", "m2"],
      [106, "Skewed shape,", "or outliers present", "m3", "m4"]
    ];
    rows.forEach(function (r) {
      out += '<rect x="8" y="' + (r[0] - 6) + '" width="684" height="52" rx="12" fill="var(--d-socv)" opacity="0.10"/>';
      out += txt(18, r[0] + 14, r[1], 12.5, 700, "start", "var(--text-primary)");
      out += txt(18, r[0] + 30, r[2], 11.5, 500);
      out += slot(r[3], 240, r[0] + 5, 130);
      out += slot(r[4], 440, r[0] + 5, 170);
    });
    out += txt(350, 176, "Pair them up: the two resistant measures go with skewed data; the two sensitive ones go with symmetric data.", 10.5, 500, "middle");
    return out + "</svg>";
  })(),
  slots: [
    { id: "m1", label: "Mean" }, { id: "m2", label: "Standard deviation" }, { id: "m3", label: "Median" }, { id: "m4", label: "IQR" }
  ],
  distractors: ["Range", "Mode"],
  caption: "Match resistant with resistant: <b>median and IQR</b> shrug off outliers and tails, so they describe skewed data. <b>Mean and standard deviation</b> use every value, so they belong with symmetric data that has no outliers. The key used median + IQR for the skewed-left grades and the mean for the symmetric ACT histogram."
});

/* ---------- 6. Outlier fences (die data) ---------- */
D.push({
  id: "st-fences", domain: "box", title: "Outlier Fences (1.5 x IQR rule)",
  svg: (function () {
    var X = function (v) { return 60 + (v + 4) * (600 / 14); };
    var out = svgOpen(268);
    /* safe zone between fences */
    out += '<rect x="' + X(-2.5) + '" y="128" width="' + (X(9.5) - X(-2.5)) + '" height="44" fill="var(--good)" opacity="0.08"/>';
    /* data span 1..6 and box Q1..Q3 */
    out += line(X(1), 150, X(6), 150, 6, null, "var(--d-box)");
    out += '<rect x="' + X(2) + '" y="138" width="' + (X(5) - X(2)) + '" height="24" fill="var(--d-box)" opacity="0.35" stroke="var(--d-box)" stroke-width="2"/>';
    /* fences */
    out += line(X(-2.5), 100, X(-2.5), 176, 2, "5,4", "var(--bad)");
    out += line(X(9.5), 100, X(9.5), 176, 2, "5,4", "var(--bad)");
    out += numberLine(X(-4), X(10), 178, -4, 10, 2);
    /* slots */
    out += slot("f1", 60, 40, 120); out += txt(120, 88, "Q1 - 1.5(IQR) = 2 - 4.5", 10.5, 600, "middle");
    out += slot("f2", 578, 40, 120); out += txt(638, 88, "Q3 + 1.5(IQR) = 5 + 4.5", 10.5, 600, "middle");
    out += line(X(2), 118, X(5), 118, 1.5); out += line(X(2), 114, X(2), 122, 1.5); out += line(X(5), 114, X(5), 122, 1.5);
    out += txt(X(3.5), 76, "5 - 2 = 3", 10.5, 600, "middle");
    out += slot("f5", X(3.5) - 55, 82, 110);
    out += slot("f3", X(2) - 50, 212, 100); out += line(X(2), 190, X(2), 210, 1.2, "3,3");
    out += slot("f4", X(5) - 50, 212, 100); out += line(X(5), 190, X(5), 210, 1.2, "3,3");
    out += txt(350, 260, "rolls run 1 to 6: all inside the fences, so no outliers", 10.5, 600, "middle");
    return out + "</svg>";
  })(),
  slots: [
    { id: "f1", label: "Lower fence" }, { id: "f2", label: "Upper fence" }, { id: "f3", label: "Q1" }, { id: "f4", label: "Q3" }, { id: "f5", label: "IQR" }
  ],
  distractors: ["Mean", "Median"],
  caption: "IQR = Q3 - Q1 = 5 - 2 = <b>3</b>. Multiply by 1.5 to get 4.5. <b>Lower fence</b> = 2 - 4.5 = -2.5. <b>Upper fence</b> = 5 + 4.5 = 9.5. Every die roll (1 to 6) sits inside the fences, so there are no outliers. A negative fence is fine: it just means nothing on the low side can be an outlier.",
  mnemonic: "Q1 minus, Q3 plus, 1.5 IQR each way."
});

/* ---------- 7. Histogram vs bar graph ---------- */
D.push({
  id: "st-hist-vs-bar", domain: "dtype", title: "Histogram vs Bar Graph",
  svg: (function () {
    var out = svgOpen(270);
    /* left: histogram */
    var L = 20;
    out += slot("h1", L + 95, 8, 130);
    out += hist(L + 40, 170, [3, 6, 9, 7, 4, 2], 40, 12, "var(--d-dtype)");
    [50, 60, 70, 80, 90, 100, 110].forEach(function (v, i) { out += txt(L + 40 + i * 40, 188, String(v), 10.5, 600, "middle"); });
    out += slot("h3", L + 20, 210, 130); out += slot("h5", L + 165, 210, 140);
    out += txt(L + 85, 258, "axis is a number line", 10.5, 600, "middle"); out += txt(L + 235, 258, "no space between them", 10.5, 600, "middle");
    /* right: bar graph */
    var R = 360;
    out += slot("h2", R + 95, 8, 130);
    [[8, "Bio"], [3, "CS"], [6, "EE"], [5, "ME"]].forEach(function (b, i) {
      var x = R + 50 + i * 64;
      out += '<rect x="' + x + '" y="' + (170 - b[0] * 12) + '" width="44" height="' + (b[0] * 12) + '" fill="var(--d-dtype)" opacity="0.45" stroke="var(--d-dtype)" stroke-width="1.2"/>';
      out += txt(x + 22, 188, b[1], 10.5, 600, "middle");
    });
    out += line(R + 34, 170, R + 306, 170, 1.5, null, "var(--text-secondary)");
    out += slot("h4", R + 20, 210, 130); out += slot("h6", R + 165, 210, 140);
    out += txt(R + 85, 258, "each bar is a group name", 10.5, 600, "middle"); out += txt(R + 235, 258, "space between them", 10.5, 600, "middle");
    return out + "</svg>";
  })(),
  slots: [
    { id: "h1", label: "Histogram" }, { id: "h2", label: "Bar graph" },
    { id: "h3", label: "Quantitative" }, { id: "h4", label: "Categorical" },
    { id: "h5", label: "Bars touch" }, { id: "h6", label: "Gaps between bars" }
  ],
  distractors: ["Pie chart", "Skewed"],
  caption: "Left: a <b>histogram</b>. The horizontal axis is a number line cut into intervals, so the bars <b>touch</b> and the data are <b>quantitative</b>. Right: a <b>bar graph</b>. Each bar is a category, so there are <b>gaps</b> and the data are <b>categorical</b>. Trap: a pie chart is also for categorical data, but it is not in this picture."
});

/* ---------- 8. Where the mean goes when data skew ---------- */
D.push({
  id: "st-skew-pull", domain: "socv", title: "Where the Mean Goes When Data Skew",
  svg: (function () {
    var panels = [
      ["k1", "r1", [1, 2, 3, 5, 7, 9], 3.56, 4],
      ["k2", "r2", [1, 3, 7, 7, 3, 1], 2.45, 2.55],
      ["k3", "r3", [9, 7, 5, 3, 2, 1], 1.44, 1]
    ];
    var out = svgOpen(235);
    panels.forEach(function (p, i) {
      var x0 = 20 + i * 230;
      out += slot(p[1], x0 + 40, 10, 130);
      out += hist(x0 + 15, 150, p[2], 30, 9, "var(--d-socv)");
      var mx = x0 + 30 + p[3] * 30, md = x0 + 30 + p[4] * 30;
      out += line(md, 58, md, 150, 3, null, "var(--text-primary)");
      out += line(mx, 58, mx, 150, 3, "6,4", "var(--bad)");
      out += slot(p[0], x0 + 40, 165, 130);
    });
    out += txt(350, 222, "solid line = median · dashed red line = mean", 11, 600, "middle");
    return out + "</svg>";
  })(),
  slots: [
    { id: "k1", label: "Skewed left" }, { id: "k2", label: "Symmetric" }, { id: "k3", label: "Skewed right" },
    { id: "r1", label: "Mean < Median" }, { id: "r2", label: "Mean = Median" }, { id: "r3", label: "Mean > Median" }
  ],
  distractors: ["Mean = 0", "Uniform"],
  caption: "The mean chases the tail. <b>Skewed right</b>: the tail is on the right, so the mean is pulled above the median (<b>mean &gt; median</b>). <b>Skewed left</b>: the tail pulls the mean below the median (<b>mean &lt; median</b>). <b>Symmetric</b>: they land in the same spot. That is why the grades (skewed left) had mean 83.67 but median 88.5.",
  mnemonic: "The mean follows the tail; the median stays home."
});

/* ---------- 9. Relative frequency, step by step ---------- */
D.push({
  id: "st-relfreq", domain: "freq", title: "Relative Frequency, Step by Step",
  svg: (function () {
    var out = svgOpen(175);
    out += slot("p1", 10, 40, 120); out += txt(70, 95, "9", 15, 800, "middle", "var(--text-primary)"); out += txt(70, 128, "count in the group", 10.5, 600, "middle");
    out += txt(145, 62, "÷", 20, 800, "middle", "var(--text-primary)");
    out += slot("p2", 165, 40, 100); out += txt(215, 95, "28", 15, 800, "middle", "var(--text-primary)"); out += txt(215, 128, "count of everything", 10.5, 600, "middle");
    out += txt(280, 62, "=", 20, 800, "middle", "var(--text-primary)");
    out += slot("p3", 300, 40, 170); out += txt(385, 95, "0.3214", 15, 800, "middle", "var(--text-primary)"); out += txt(385, 128, "decimal share of the whole", 10.5, 600, "middle");
    out += txt(510, 62, "× 100 =", 14, 800, "middle", "var(--text-primary)");
    out += slot("p4", 560, 40, 120); out += txt(620, 95, "32.14%", 15, 800, "middle", "var(--text-primary)"); out += txt(620, 128, "move the decimal 2 places", 10.5, 600, "middle");
    out += txt(350, 160, "Same steps: 17 / 28 = 0.6071 = 60.71%   ·   3 / 28 = 0.1071 = 10.71%", 11, 600, "middle");
    return out + "</svg>";
  })(),
  slots: [
    { id: "p1", label: "Frequency" }, { id: "p2", label: "Total" }, { id: "p3", label: "Relative frequency" }, { id: "p4", label: "Percent" }
  ],
  distractors: ["Mean", "Range"],
  caption: "<b>Relative frequency</b> = the count in the group (<b>frequency</b>) divided by the <b>total</b> count. 9 of the 28 American League teams hit between 50 and 62 home runs: 9 / 28 = 0.3214, and times 100 that is <b>32.14%</b>. Relative frequency lets you compare groups of different sizes fairly."
});

/* ---------- 10. Reading a dot plot (18 die rolls) ---------- */
D.push({
  id: "st-dotplot", domain: "calc", title: "Reading a Dot Plot (18 die rolls)",
  svg: (function () {
    var X = function (v) { return 100 + (v - 1) * 100; };
    var counts = [2, 3, 5, 3, 3, 2];
    var out = svgOpen(350);
    counts.forEach(function (n, i) {
      for (var k = 0; k < n; k++) out += '<circle cx="' + X(i + 1) + '" cy="' + (200 - k * 20) + '" r="7" fill="var(--d-calc)"/>';
    });
    out += numberLine(X(1), X(6), 216, 1, 6, 1);
    out += txt(350, 256, "Number on cube", 11, 600, "middle");
    /* range bracket */
    out += line(X(1), 92, X(6), 92, 1.5); out += line(X(1), 86, X(1), 98, 1.5); out += line(X(6), 86, X(6), 98, 1.5);
    out += slot("d6", 290, 52, 120); out += txt(350, 110, "6 - 1 = 5", 10.5, 600, "middle");
    /* five-number slots */
    out += slot("d4", 50, 272, 100); out += txt(100, 320, "smallest", 10.5, 600, "middle");
    out += slot("d2", 150, 272, 100); out += txt(200, 336, "middle of the lower 9", 10.5, 600, "middle");
    out += slot("d1", 250, 272, 100); out += txt(300, 320, "9th & 10th of 18", 10.5, 600, "middle");
    out += slot("d3", 450, 272, 100); out += txt(500, 336, "middle of the upper 9", 10.5, 600, "middle");
    out += slot("d5", 550, 272, 100); out += txt(600, 320, "largest", 10.5, 600, "middle");
    return out + "</svg>";
  })(),
  slots: [
    { id: "d4", label: "Minimum" }, { id: "d2", label: "Q1" }, { id: "d1", label: "Median" },
    { id: "d3", label: "Q3" }, { id: "d5", label: "Maximum" }, { id: "d6", label: "Range" }
  ],
  distractors: ["Mean", "Mode"],
  caption: "18 rolls in order: 1,1,2,2,2,3,3,3,3,3,4,4,4,5,5,5,6,6. <b>Median</b> = average of the 9th and 10th values = 3. <b>Q1</b> = middle of the lower nine = 2. <b>Q3</b> = middle of the upper nine = 5. <b>Range</b> = 6 - 1 = 5. IQR = 5 - 2 = 3. Trap: the mean (3.44) and the mode (3) are not part of the five-number summary."
});

})();

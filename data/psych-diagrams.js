/* Terra AP Psychology diagram library (Unit 1: Biological Bases of Behavior).
   Same two-mode contract as the APES and Stats diagrams: Study (labels on) and Label It (slots blank). */
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
/* Leader line from a slot to the spot it names, ending in a dot. */
function lead(x1, y1, x2, y2) {
  return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="var(--text-muted)" stroke-width="1.5"/>' +
    '<circle cx="' + x2 + '" cy="' + y2 + '" r="4" fill="var(--text-primary)"/>';
}
function line(x1, y1, x2, y2, w) {
  return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="var(--text-muted)" stroke-width="' + (w || 2) + '"/>';
}
function svgOpen(h) { return '<svg viewBox="0 0 700 ' + h + '" xmlns="http://www.w3.org/2000/svg" font-family="inherit">'; }

/* Stacked rows: [slotId, descriptor]. Slot on the left, descriptor on the right. */
function rows(list, color, opts) {
  var o = opts || {}, sw = o.slotWidth || 230, top = o.top || 8, gap = o.gap || 54;
  var base = top + (o.title ? 26 : 0);
  var h = base + list.length * gap + (o.pad || 6) + (o.footer ? 22 : 0);
  var out = svgOpen(h);
  if (o.title) out += txt(10, top + 14, o.title, 12.5, 700, "start", "var(--text-primary)");
  list.forEach(function (r, i) {
    var y = base + i * gap;
    out += '<rect x="8" y="' + y + '" width="684" height="44" rx="12" fill="var(--d-' + color + ')" opacity="' + (0.08 + (i % 2) * 0.05) + '"/>';
    out += slot(r[0], 16, y + 7, sw);
    out += txt(sw + 30, y + 27, r[1], 12.5);
  });
  if (o.footer) out += txt(350, h - 8, o.footer, 12.5, 700, "middle", "var(--d-" + color + ")");
  return out + "</svg>";
}

window.DIAGRAMS = window.DIAGRAMS || [];
var D = window.DIAGRAMS;

/* ---------- 1. Divisions of the nervous system ---------- */
D.push({
  id: "ps-ns-tree", domain: "ns", title: "Divisions of the Nervous System",
  svg: (function () {
    var out = svgOpen(318);
    out += line(350, 38, 135, 70) + line(350, 38, 515, 70);
    out += line(135, 126, 100, 160) + line(135, 126, 195, 160);
    out += line(515, 126, 377, 160) + line(515, 126, 597, 160);
    out += line(597, 216, 445, 255) + line(597, 216, 617, 255);
    out += '<rect x="245" y="6" width="210" height="32" rx="10" fill="var(--d-ns)" opacity="0.25"/>';
    out += txt(350, 27, "NERVOUS SYSTEM", 13, 800, "middle", "var(--text-primary)");
    out += slot("ns1", 45, 70, 180) + txt(135, 118, "brain + spinal cord", 12, 500, "middle");
    out += slot("ns2", 425, 70, 180) + txt(515, 118, "every nerve outside them", 12, 500, "middle");
    out += '<rect x="50" y="160" width="90" height="30" rx="9" fill="var(--d-ns)" opacity="0.14"/>' + txt(95, 180, "brain", 12, 600, "middle");
    out += '<rect x="148" y="160" width="100" height="30" rx="9" fill="var(--d-ns)" opacity="0.14"/>' + txt(198, 180, "spinal cord", 12, 600, "middle");
    out += slot("ns3", 300, 160, 155) + txt(377, 208, "voluntary: skeletal muscles", 12, 500, "middle");
    out += slot("ns4", 517, 160, 160) + txt(597, 208, "automatic: organs + glands", 12, 500, "middle");
    out += slot("ns5", 375, 255, 140) + txt(445, 303, "arouses: fight or flight", 12, 500, "middle");
    out += slot("ns6", 537, 255, 155) + txt(617, 303, "calms: rest and digest", 12, 500, "middle");
    return out + "</svg>";
  })(),
  slots: [
    { id: "ns1", label: "Central (CNS)" },
    { id: "ns2", label: "Peripheral (PNS)" },
    { id: "ns3", label: "Somatic" },
    { id: "ns4", label: "Autonomic" },
    { id: "ns5", label: "Sympathetic" },
    { id: "ns6", label: "Parasympathetic" }
  ],
  distractors: ["Somatosensory"],
  caption: "The system splits twice. The <b>central</b> nervous system (brain + spinal cord) is the command center; the <b>peripheral</b> system is every nerve outside it. The peripheral system splits into <b>somatic</b> (movements you choose) and <b>autonomic</b> (automatic), and the autonomic system splits into <b>sympathetic</b> (arouse) and <b>parasympathetic</b> (calm). Trap: <b>somatosensory</b> is a strip of cortex in the brain, not a division of the nervous system.",
  mnemonic: "Sympathetic = Stress. Parasympathetic = Parachute you back down."
});

/* ---------- 2. Reflex arc ---------- */
D.push({
  id: "ps-reflex", domain: "neur", title: "The Reflex Arc",
  svg: (function () {
    var out = svgOpen(322);
    out += '<rect x="475" y="22" width="215" height="238" rx="16" fill="var(--d-ns)" opacity="0.14"/>';
    out += txt(582, 46, "SPINAL CORD", 12, 800, "middle", "var(--d-ns)");
    out += '<rect x="10" y="30" width="175" height="60" rx="12" fill="var(--d-neur)" opacity="0.14"/>';
    out += txt(97, 56, "Hand touches", 13, 700, "middle", "var(--text-primary)") + txt(97, 74, "a hot pan", 13, 700, "middle", "var(--text-primary)");
    out += arrow(188, 60, 224, 60);
    out += slot("rf1", 228, 45, 165) + txt(310, 100, "carries 'HOT!' IN", 12, 500, "middle");
    out += arrow(396, 60, 498, 60);
    out += arrow(582, 66, 582, 120);
    out += slot("rf2", 500, 125, 165) + txt(582, 180, "passes it across", 12, 500, "middle");
    out += line(582, 192, 582, 236) + arrow(582, 236, 398, 236);
    out += slot("rf3", 228, 221, 165) + txt(310, 276, "carries the command OUT", 12, 500, "middle");
    out += arrow(226, 236, 190, 236);
    out += '<rect x="10" y="206" width="175" height="60" rx="12" fill="var(--d-neur)" opacity="0.14"/>';
    out += txt(97, 232, "Arm muscle", 13, 700, "middle", "var(--text-primary)") + txt(97, 250, "yanks hand back", 13, 700, "middle", "var(--text-primary)");
    out += txt(350, 310, "The brain hears about it a split second later, after the hand has already moved.", 12, 650, "middle", "var(--d-neur)");
    return out + "</svg>";
  })(),
  slots: [
    { id: "rf1", label: "Sensory neuron" },
    { id: "rf2", label: "Interneuron" },
    { id: "rf3", label: "Motor neuron" }
  ],
  distractors: ["Glial cell"],
  caption: "A reflex arc skips the brain. The <b>sensory neuron</b> carries the message in, an <b>interneuron</b> in the spinal cord passes it across, and the <b>motor neuron</b> carries the command out to the muscle. Trap: <b>glial cells</b> support neurons, but they don't carry the message.",
  mnemonic: "SAME: Sensory = Afferent (arrive), Motor = Efferent (exit)."
});

/* ---------- 3. Action potential ---------- */
D.push({
  id: "ps-action", domain: "neur", title: "Neural Firing: the Action Potential",
  svg: (function () {
    var out = svgOpen(320);
    out += line(80, 22, 80, 282, 1.5) + line(80, 282, 680, 282, 1.5);
    out += txt(86, 16, "charge inside the neuron (mV)", 11, 650);
    out += txt(680, 302, "time (milliseconds) →", 11, 650, "end");
    [["+40", 44], ["0", 114], ["-55", 210], ["-70", 236]].forEach(function (l) { out += txt(72, l[1], l[0], 11, 600, "end"); });
    out += '<line x1="80" y1="110" x2="680" y2="110" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="3 5" opacity="0.6"/>';
    out += '<line x1="80" y1="206" x2="560" y2="206" stroke="var(--warn)" stroke-width="2" stroke-dasharray="7 6"/>';
    out += '<path d="M 80 232 L 230 232 C 245 232, 252 216, 262 206 C 270 176, 278 70, 290 44 C 298 28, 306 56, 314 120 C 324 222, 332 252, 352 250 C 382 248, 410 234, 440 232 L 680 232" fill="none" stroke="var(--d-neur)" stroke-width="3.5" stroke-linejoin="round"/>';
    out += txt(306, 50, "the spike: the neuron fires", 11.5, 650, "start", "var(--text-primary)");
    out += slot("ap1", 112, 244, 170);
    out += slot("ap2", 565, 191, 125);
    out += slot("ap3", 92, 80, 160) + lead(252, 95, 275, 120);
    out += slot("ap4", 400, 140, 165) + lead(430, 170, 352, 246);
    return out + "</svg>";
  })(),
  slots: [
    { id: "ap1", label: "Resting potential" },
    { id: "ap2", label: "Threshold" },
    { id: "ap3", label: "Depolarization" },
    { id: "ap4", label: "Refractory period" }
  ],
  distractors: ["Reuptake"],
  caption: "At rest the inside of a neuron sits at about -70 mV (<b>resting potential</b>). Push it to the <b>threshold</b>, about -55 mV, and it fires all the way: positive ions rush in (<b>depolarization</b>) and the charge spikes. Then it dips below rest and can't fire again for a moment (<b>refractory period</b>). Every spike is the same height: that's the all or nothing principle. Trap: <b>reuptake</b> happens at the synapse, not on this graph.",
  mnemonic: "Rest, reach threshold, spike, recharge."
});

/* ---------- 4. The synapse: reuptake, agonists, antagonists ---------- */
D.push({
  id: "ps-synapse", domain: "drugs", title: "At the Synapse: Agonists, Antagonists, Reuptake",
  svg: (function () {
    var out = svgOpen(318);
    out += '<path d="M 210 14 L 490 14 L 490 66 C 490 116, 440 136, 350 136 C 260 136, 210 116, 210 66 Z" fill="var(--d-neur)" fill-opacity="0.15" stroke="var(--d-neur)" stroke-width="1.5"/>';
    out += txt(350, 34, "SENDING NEURON", 11.5, 800, "middle", "var(--d-neur)");
    [[290, 78], [350, 92], [410, 78]].forEach(function (v) {
      out += '<circle cx="' + v[0] + '" cy="' + v[1] + '" r="17" fill="var(--d-chem)" fill-opacity="0.18" stroke="var(--d-chem)" stroke-width="1.2"/>';
      [[-6, -4], [5, -5], [0, 6]].forEach(function (d) { out += '<circle cx="' + (v[0] + d[0]) + '" cy="' + (v[1] + d[1]) + '" r="3.5" fill="var(--d-chem)"/>'; });
    });
    out += '<rect x="130" y="210" width="398" height="92" rx="18" fill="var(--d-brain)" fill-opacity="0.12" stroke="var(--d-brain)" stroke-width="1.2"/>';
    out += txt(329, 288, "RECEIVING NEURON", 11.5, 800, "middle", "var(--d-brain)");
    out += txt(146, 236, "receptor sites ↑", 11, 600);
    [250, 330, 410, 490].forEach(function (x) {
      out += '<path d="M ' + (x - 14) + ' 210 L ' + (x - 14) + ' 196 L ' + (x - 8) + ' 196 L ' + (x - 8) + ' 204 L ' + (x + 8) + ' 204 L ' + (x + 8) + ' 196 L ' + (x + 14) + ' 196 L ' + (x + 14) + ' 210" fill="none" stroke="var(--d-brain)" stroke-width="2"/>';
    });
    out += '<circle cx="250" cy="198" r="7" fill="var(--d-chem)"/>';
    out += '<circle cx="322" cy="166" r="7" fill="var(--d-chem)"/>' + '<circle cx="356" cy="156" r="7" fill="var(--d-chem)"/>';
    out += txt(372, 160, "neurotransmitters cross the gap", 11, 600);
    out += '<rect x="398" y="186" width="24" height="18" rx="3" fill="var(--d-sleep)"/>';
    out += '<circle cx="490" cy="198" r="7" fill="var(--d-drugs)" stroke="var(--text-primary)" stroke-width="1.2"/>';
    out += '<path d="M 238 182 C 214 176, 206 152, 224 132" fill="none" stroke="var(--text-muted)" stroke-width="2"/>';
    out += '<polygon points="224,132 216,142 227,143" fill="var(--text-muted)"/>';
    out += '<circle cx="240" cy="183" r="6" fill="var(--d-chem)" fill-opacity="0.7"/>';
    out += slot("sy1", 10, 150, 150) + lead(160, 165, 212, 160) + txt(85, 198, "pulled back in", 11.5, 500, "middle");
    out += slot("sy2", 540, 92, 150) + lead(540, 107, 412, 186) + txt(615, 138, "fits but BLOCKS it", 11.5, 500, "middle");
    out += slot("sy3", 540, 222, 150) + lead(540, 237, 497, 200) + txt(615, 268, "fits AND turns it on", 11.5, 500, "middle");
    return out + "</svg>";
  })(),
  slots: [
    { id: "sy1", label: "Reuptake" },
    { id: "sy2", label: "Antagonist" },
    { id: "sy3", label: "Agonist" }
  ],
  distractors: ["Hormone"],
  caption: "Neurotransmitters cross the synapse and fit receptor sites like keys in locks. An <b>agonist</b> fits the lock and turns it ON (morphine copying endorphins). An <b>antagonist</b> fits but blocks it, keeping it OFF (Narcan blocking opioids). <b>Reuptake</b> pulls leftover neurotransmitter back into the sending neuron to end the signal; SSRIs block it. Trap: <b>hormones</b> travel in the blood, not across a synapse.",
  mnemonic: "Agonist = Amplifier. Antagonist = Against."
});

/* ---------- 5. Neurotransmitters ---------- */
D.push({
  id: "ps-nt", domain: "chem", title: "Neurotransmitters and Their Jobs",
  svg: rows([
    ["nt1", "muscle movement + memory · low in Alzheimer's"],
    ["nt2", "reward, motivation, movement · low in Parkinson's"],
    ["nt3", "mood, hunger, sleep · low is linked to depression"],
    ["nt4", "the main GO signal (excitatory) · memory"],
    ["nt5", "the main STOP signal (inhibitory) · calm"],
    ["nt6", "natural painkillers · runner's high"],
    ["nt7", "carries the pain message"]
  ], "chem", { slotWidth: 170 }),
  slots: [
    { id: "nt1", label: "Acetylcholine" },
    { id: "nt2", label: "Dopamine" },
    { id: "nt3", label: "Serotonin" },
    { id: "nt4", label: "Glutamate" },
    { id: "nt5", label: "GABA" },
    { id: "nt6", label: "Endorphins" },
    { id: "nt7", label: "Substance P" }
  ],
  distractors: ["Melatonin", "Norepinephrine"],
  caption: "Seven messengers, seven jobs. Match the job, not the sound of the name. Traps: <b>melatonin</b> is a hormone from the pineal gland, and <b>norepinephrine</b> (alertness) isn't one of these seven jobs.",
  mnemonic: "ACh = Action + memory. Dopamine = 'do it again.' Serotonin = Serenity, Sleep, Snacks. Glutamate = gas, GABA = brake."
});

/* ---------- 6. Hormones ---------- */
D.push({
  id: "ps-hormones", domain: "chem", title: "Hormones: Messages Sent Through the Blood",
  svg: rows([
    ["ho1", "from the adrenal glands · fight-or-flight energy"],
    ["ho2", "rises as it gets dark · makes you sleepy"],
    ["ho3", "from fat cells · 'I'm full, there's enough stored'"],
    ["ho4", "from an empty stomach · 'I'm hungry'"],
    ["ho5", "bonding and trust · hugs, childbirth"]
  ], "chem", { slotWidth: 170 }),
  slots: [
    { id: "ho1", label: "Adrenaline" },
    { id: "ho2", label: "Melatonin" },
    { id: "ho3", label: "Leptin" },
    { id: "ho4", label: "Ghrelin" },
    { id: "ho5", label: "Oxytocin" }
  ],
  distractors: ["Dopamine"],
  caption: "Hormones come from glands and ride the bloodstream, so they're slower than neurotransmitters but last longer. The hunger pair: <b>ghrelin</b> says eat (growling stomach) and <b>leptin</b> says you can stop. Trap: <b>dopamine</b> is a neurotransmitter, not a hormone.",
  mnemonic: "Ghrelin = Growl. Leptin = Leave the table. Melatonin = darkness."
});

/* ---------- 7. Drug categories ---------- */
D.push({
  id: "ps-drugs", domain: "drugs", title: "Four Kinds of Psychoactive Drugs",
  svg: rows([
    ["dg1", "speed the body up · caffeine, nicotine, cocaine"],
    ["dg2", "slow the body down · alcohol, tranquilizers"],
    ["dg3", "distort perception · LSD, mushrooms"],
    ["dg4", "copy endorphins to block pain · heroin, fentanyl"]
  ], "drugs", { slotWidth: 170, footer: "ALL FOUR CHANGE HOW NEURONS COMMUNICATE" }),
  slots: [
    { id: "dg1", label: "Stimulants" },
    { id: "dg2", label: "Depressants" },
    { id: "dg3", label: "Hallucinogens" },
    { id: "dg4", label: "Opioids" }
  ],
  distractors: ["Psychoactive drugs"],
  caption: "Sort by what the drug does: gas pedal (<b>stimulants</b>), brake (<b>depressants</b>), funhouse mirror (<b>hallucinogens</b>), or a painkiller copying endorphins (<b>opioids</b>, which also slow the body like depressants). Trap: <b>psychoactive drugs</b> is the umbrella name for all four, not a separate kind.",
  mnemonic: "Gas, brake, mirror, painkiller."
});

/* ---------- 8. Lobes, side view ---------- */
var BRAIN_SIDE = "M 180 232 C 158 200, 160 140, 205 108 C 245 78, 300 66, 345 68 C 412 68, 472 86, 512 126 C 546 162, 550 210, 526 240 C 506 258, 470 258, 446 262 C 410 284, 350 294, 300 286 C 264 280, 242 262, 234 242 C 222 238, 205 240, 180 232 Z";
D.push({
  id: "ps-lobes", domain: "brain", title: "The Lobes of the Cortex (side view)",
  svg: (function () {
    var out = svgOpen(400);
    out += '<path d="M 400 262 L 432 262 L 444 366 L 414 366 Z" fill="var(--d-brain)" fill-opacity="0.16" stroke="var(--text-muted)" stroke-width="1.5"/>';
    out += '<ellipse cx="490" cy="290" rx="56" ry="32" fill="var(--d-ns)" fill-opacity="0.3" stroke="var(--text-muted)" stroke-width="1.5"/>';
    out += '<path d="M 448 284 C 470 274, 512 274, 536 284 M 450 297 C 472 289, 512 289, 540 297 M 460 310 C 480 303, 506 303, 528 310" fill="none" stroke="var(--text-muted)" stroke-width="1" opacity="0.7"/>';
    out += '<defs><clipPath id="ps-side-clip"><path d="' + BRAIN_SIDE + '"/></clipPath></defs>';
    out += '<path d="' + BRAIN_SIDE + '" fill="var(--surface-2)"/>';
    out += '<g clip-path="url(#ps-side-clip)">' +
      '<polygon points="120,20 355,20 303,218 236,240 120,250" fill="var(--d-hered)" fill-opacity="0.22"/>' +
      '<polygon points="355,20 478,20 470,92 462,206 412,200 332,214 303,218" fill="var(--d-hemi)" fill-opacity="0.18"/>' +
      '<polygon points="120,250 236,240 332,214 412,200 462,206 460,330 120,330" fill="var(--d-chem)" fill-opacity="0.2"/>' +
      '<polygon points="478,20 640,20 640,330 460,330 462,206 470,92" fill="var(--d-drugs)" fill-opacity="0.2"/>' +
      '<polygon points="333,20 355,20 303,218 281,218" fill="var(--d-sleep)" fill-opacity="0.45"/>' +
      '<polygon points="355,20 377,20 325,218 303,218" fill="var(--d-neur)" fill-opacity="0.45"/>' +
      '<path d="M 200 150 C 225 140, 240 160, 265 150 S 290 120, 305 108 M 196 196 C 216 186, 236 200, 256 190 S 278 168, 292 158 M 390 100 C 410 115, 430 105, 445 120 S 452 150, 440 172 M 262 264 C 292 256, 322 264, 352 254 S 402 246, 432 242 M 482 138 C 497 160, 490 185, 502 206" fill="none" stroke="var(--text-muted)" stroke-width="1.2" opacity="0.45"/>' +
      "</g>";
    out += '<path d="M 236 240 C 280 228, 330 214, 412 200" fill="none" stroke="var(--text-muted)" stroke-width="2"/>';
    out += '<path d="' + BRAIN_SIDE + '" fill="none" stroke="var(--text-muted)" stroke-width="2"/>';
    out += slot("lb1", 8, 120, 145) + lead(153, 135, 228, 152) + txt(10, 168, "plans, judges", 11.5);
    out += slot("lb2", 150, 18, 140) + lead(290, 33, 330, 76) + txt(220, 64, "moves the body", 11.5, 500, "middle");
    out += slot("lb3", 398, 10, 200) + lead(398, 25, 352, 78) + txt(498, 56, "feels touch", 11.5, 500, "middle");
    out += slot("lb4", 560, 74, 132) + lead(560, 89, 425, 125) + txt(626, 120, "touch + body position", 11.5, 500, "middle");
    out += slot("lb5", 560, 160, 132) + lead(560, 175, 514, 186) + txt(626, 206, "vision", 11.5, 500, "middle");
    out += slot("lb6", 560, 300, 132) + lead(560, 315, 532, 300) + txt(626, 346, "balance, coordination", 11.5, 500, "middle");
    out += slot("lb7", 40, 300, 150) + lead(190, 315, 300, 262) + txt(115, 346, "hearing", 11.5, 500, "middle");
    out += txt(452, 360, "brain stem", 11, 600);
    out += txt(14, 392, "◀ FRONT (forehead)", 11, 700, "start", "var(--text-primary)");
    out += txt(690, 392, "BACK ▶", 11, 700, "end", "var(--text-primary)");
    return out + "</svg>";
  })(),
  slots: [
    { id: "lb1", label: "Frontal lobe" },
    { id: "lb2", label: "Motor cortex" },
    { id: "lb3", label: "Somatosensory cortex" },
    { id: "lb4", label: "Parietal lobe" },
    { id: "lb5", label: "Occipital lobe" },
    { id: "lb6", label: "Cerebellum" },
    { id: "lb7", label: "Temporal lobe" }
  ],
  distractors: ["Hippocampus"],
  caption: "Front to back: the <b>frontal lobe</b> plans and judges, ending in the <b>motor cortex</b> strip that moves the body. Right behind it, the <b>somatosensory cortex</b> strip feels touch at the front of the <b>parietal lobe</b>. The <b>occipital lobe</b> at the back handles vision, the <b>temporal lobe</b> by the ear handles hearing, and the <b>cerebellum</b> tucked underneath handles balance. Trap: the <b>hippocampus</b> is hidden deep inside, not on the surface.",
  mnemonic: "Motor in front, sensory behind: you MOVE forward and FEEL behind."
});

/* ---------- 9 and 10. Midline view: old brain, then limbic system ---------- */
var BRAIN_MID = "M 165 236 C 142 168, 192 86, 300 68 C 402 52, 506 80, 546 146 C 570 190, 552 238, 512 250 C 486 256, 460 252, 440 246 L 428 236 L 394 236 C 392 262, 372 288, 330 294 C 280 298, 220 282, 190 264 C 176 256, 168 248, 165 236 Z";
function midline(show) {
  var on = function (k) { return show.indexOf(k) >= 0; };
  var out = '<path d="' + BRAIN_MID + '" fill="var(--surface-2)" stroke="var(--text-muted)" stroke-width="2"/>';
  out += '<path d="M 230 120 C 260 100, 300 96, 330 104 M 200 180 C 214 150, 240 136, 262 140 M 470 112 C 500 128, 520 150, 528 178" fill="none" stroke="var(--text-muted)" stroke-width="1" opacity="0.45"/>';
  out += '<path d="M 268 182 C 272 134, 350 112, 418 120 C 462 125, 485 148, 474 178" fill="none" stroke="var(--d-hemi)" stroke-width="13" stroke-linecap="round" opacity="' + (on("cc") ? 0.7 : 0.25) + '"/>';
  out += '<ellipse cx="495" cy="294" rx="52" ry="33" fill="var(--d-ns)" fill-opacity="' + (on("cereb") ? 0.32 : 0.12) + '" stroke="var(--text-muted)" stroke-width="1.5" opacity="' + (on("cereb") ? 1 : 0.5) + '"/>';
  out += '<path d="M 452 288 C 474 278, 514 278, 540 288 M 456 302 C 478 294, 514 294, 542 302" fill="none" stroke="var(--text-muted)" stroke-width="1" opacity="' + (on("cereb") ? 0.7 : 0.3) + '"/>';
  out += '<path d="M 392 214 C 386 250, 400 290, 405 320 L 410 372 L 440 372 L 440 320 C 446 290, 442 250, 428 214 Z" fill="var(--d-brain)" fill-opacity="' + (on("stem") ? 0.22 : 0.08) + '" stroke="var(--text-muted)" stroke-width="1.5" opacity="' + (on("stem") ? 1 : 0.45) + '"/>';
  if (on("stem")) out += '<line x1="404" y1="324" x2="442" y2="324" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="3 3"/>';
  if (on("ras")) {
    out += '<polyline points="412,232 420,248 409,262 421,276 411,290 422,304 414,316" fill="none" stroke="var(--d-drugs)" stroke-width="1.5"/>';
    [[412, 232], [420, 248], [409, 262], [421, 276], [411, 290], [422, 304], [414, 316]].forEach(function (p) {
      out += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="var(--d-drugs)"/>';
    });
  }
  out += '<ellipse cx="405" cy="196" rx="30" ry="18" fill="var(--d-brain)" fill-opacity="' + (on("thal") ? 0.55 : 0.25) + '"/>';
  if (on("limbic")) {
    out += '<ellipse cx="355" cy="226" rx="20" ry="11" fill="var(--d-sleep)" fill-opacity="0.65"/>';
    out += '<line x1="350" y1="236" x2="343" y2="256" stroke="var(--d-chem)" stroke-width="3"/>';
    out += '<circle cx="341" cy="266" r="10" fill="var(--d-chem)" fill-opacity="0.75"/>';
    out += '<path d="M 393 268 C 420 282, 462 268, 472 232" fill="none" stroke="var(--d-neur)" stroke-width="12" stroke-linecap="round" opacity="0.75"/>';
    out += '<ellipse cx="380" cy="263" rx="13" ry="9" fill="var(--d-drugs)" fill-opacity="0.8"/>';
  }
  out += txt(14, 22, "◀ FRONT", 11, 700, "start", "var(--text-primary)") + txt(690, 22, "BACK ▶", 11, 700, "end", "var(--text-primary)");
  return out;
}
D.push({
  id: "ps-inner", domain: "brain", title: "Inside the Brain: the Old Brain",
  svg: (function () {
    var out = svgOpen(420) + midline(["cc", "thal", "stem", "ras", "cereb"]);
    out += slot("ib1", 16, 56, 170) + lead(186, 71, 300, 145) + txt(101, 102, "bridge between the halves", 11.5, 500, "middle");
    out += slot("ib2", 556, 112, 136) + lead(556, 127, 428, 190) + txt(624, 158, "sensory relay station", 11.5, 500, "middle");
    out += slot("ib3", 160, 300, 150) + lead(310, 315, 398, 296);
    out += txt(235, 346, "the oldest core: survival basics", 11.5, 500, "middle");
    out += slot("ib4", 160, 356, 150) + lead(310, 371, 424, 352);
    out += txt(320, 404, "heartbeat + breathing", 11.5, 500, "start");
    out += slot("ib5", 486, 380, 206) + lead(500, 380, 418, 288);
    out += txt(589, 372, "arousal + alertness", 11.5, 500, "middle");
    out += slot("ib6", 560, 238, 132) + lead(600, 268, 530, 288) + txt(626, 226, "balance, coordination", 11.5, 500, "middle");
    return out + "</svg>";
  })(),
  slots: [
    { id: "ib1", label: "Corpus callosum" },
    { id: "ib2", label: "Thalamus" },
    { id: "ib3", label: "Brain stem" },
    { id: "ib4", label: "Medulla" },
    { id: "ib5", label: "Reticular activating system" },
    { id: "ib6", label: "Cerebellum" }
  ],
  distractors: ["Hypothalamus"],
  caption: "Under the cortex sits the old brain. The <b>brain stem</b> runs the automatic basics, its base (the <b>medulla</b>) controls heartbeat and breathing, and the <b>reticular activating system</b> threads through it to keep you awake and alert. The <b>thalamus</b> on top relays the senses, the <b>cerebellum</b> in back handles balance, and the <b>corpus callosum</b> bridges the two halves. Trap: the <b>hypothalamus</b> sits just BELOW the thalamus and runs hunger, thirst, and temperature.",
  mnemonic: "Thalamus = traffic cop for the senses. Hypo means below it."
});
D.push({
  id: "ps-limbic", domain: "brain", title: "Inside the Brain: the Limbic System",
  svg: (function () {
    var out = svgOpen(420) + midline(["thal", "limbic"]);
    out += slot("lm1", 10, 150, 150) + lead(160, 165, 338, 224) + txt(12, 198, "hunger + thirst + temp", 11.5);
    out += slot("lm2", 10, 300, 160) + lead(170, 315, 333, 270) + txt(12, 348, "the master gland", 11.5);
    out += slot("lm3", 200, 362, 140) + lead(310, 362, 378, 270) + txt(350, 384, "fear + aggression", 11.5);
    out += slot("lm4", 552, 140, 140) + lead(552, 155, 470, 238) + txt(622, 188, "forms new memories", 11.5, 500, "middle");
    return out + "</svg>";
  })(),
  slots: [
    { id: "lm1", label: "Hypothalamus" },
    { id: "lm2", label: "Pituitary gland" },
    { id: "lm3", label: "Amygdala" },
    { id: "lm4", label: "Hippocampus" }
  ],
  distractors: ["Thalamus", "Medulla"],
  caption: "The limbic system ties together emotion, memory, and drives. The <b>hypothalamus</b> runs hunger, thirst, and temperature and gives orders to the <b>pituitary gland</b>, the master gland hanging below it. The <b>amygdala</b> handles fear and aggression, and the <b>hippocampus</b> saves new memories. Trap: the <b>thalamus</b> sits right above the hypothalamus, but it is the sensory relay station.",
  mnemonic: "Hippocampus saves memories. Amygdala = Afraid + Aggressive. Hypothalamus = Hunger, thirst, Heat."
});

/* ---------- 11. Split brain, seen from above ---------- */
D.push({
  id: "ps-split", domain: "hemi", title: "Two Hemispheres (seen from above)",
  svg: (function () {
    var out = svgOpen(440);
    var L = "M 342 50 C 270 48, 200 100, 196 190 C 192 280, 250 340, 342 346 Z";
    var R = "M 358 50 C 430 48, 500 100, 504 190 C 508 280, 450 340, 358 346 Z";
    out += '<path d="' + L + '" fill="var(--d-hemi)" fill-opacity="0.16" stroke="var(--text-muted)" stroke-width="2"/>';
    out += '<path d="' + R + '" fill="var(--d-brain)" fill-opacity="0.16" stroke="var(--text-muted)" stroke-width="2"/>';
    out += '<rect x="339" y="150" width="22" height="100" rx="6" fill="var(--d-neur)" fill-opacity="0.6"/>';
    out += txt(350, 30, "FRONT ▲", 11, 700, "middle", "var(--text-primary)");
    out += txt(268, 152, "language + logic", 11.5, 600, "middle") + txt(268, 170, "runs the RIGHT side", 11.5, 600, "middle");
    out += txt(433, 152, "faces, emotion, space", 11.5, 600, "middle") + txt(433, 170, "runs the LEFT side", 11.5, 600, "middle");
    out += '<circle cx="214" cy="136" r="8" fill="var(--d-sleep)"/>' + '<circle cx="214" cy="258" r="8" fill="var(--d-drugs)"/>';
    out += slot("sp1", 150, 6, 140) + lead(222, 36, 262, 96);
    out += slot("sp2", 410, 6, 140) + lead(478, 36, 438, 96);
    out += slot("sp3", 8, 108, 150) + lead(158, 123, 206, 134) + txt(10, 156, "producing speech", 11.5);
    out += slot("sp4", 8, 232, 150) + lead(158, 247, 206, 256) + txt(10, 280, "understanding words", 11.5);
    out += slot("sp5", 545, 186, 148) + lead(545, 201, 361, 201) + txt(619, 234, "bridge between halves", 11.5, 500, "middle");
    out += arrow(292, 330, 508, 398) + arrow(408, 330, 192, 398);
    out += txt(170, 424, "LEFT hand + left side", 12, 700, "middle", "var(--text-primary)");
    out += txt(530, 424, "RIGHT hand + right side", 12, 700, "middle", "var(--text-primary)");
    return out + "</svg>";
  })(),
  slots: [
    { id: "sp1", label: "Left hemisphere" },
    { id: "sp2", label: "Right hemisphere" },
    { id: "sp3", label: "Broca's area" },
    { id: "sp4", label: "Wernicke's area" },
    { id: "sp5", label: "Corpus callosum" }
  ],
  distractors: ["Brain stem"],
  caption: "Each hemisphere runs the OPPOSITE side of the body (contralateral organization), which is why the arrows cross. The <b>left hemisphere</b> leads on language and logic, including <b>Broca's area</b> (producing speech, frontal lobe) and <b>Wernicke's area</b> (understanding language, temporal lobe). The <b>right hemisphere</b> leads on faces, emotion, and space. The <b>corpus callosum</b> bridges them; cut it and you get a split brain. Trap: the <b>brain stem</b> connects the brain to the spinal cord, not the two halves to each other.",
  mnemonic: "Left = Language and Logic. Broca = Broken speech. Wernicke = Words don't make sense."
});

/* ---------- 12. A night of sleep ---------- */
D.push({
  id: "ps-sleep", domain: "sleep", title: "A Night of Sleep: the 90-Minute Cycle",
  svg: (function () {
    var out = svgOpen(330);
    var X0 = 120, X1 = 640, PX = (X1 - X0) / 480;
    var Y = { A: 60, R: 92, N1: 124, N2: 160, N3: 196 };
    var X = function (min) { return Math.round((X0 + min * PX) * 10) / 10; };
    out += '<rect x="' + X0 + '" y="80" width="' + (X1 - X0) + '" height="24" fill="var(--d-sleep)" opacity="0.10"/>';
    out += '<rect x="' + X0 + '" y="112" width="' + (X1 - X0) + '" height="96" fill="var(--d-drugs)" opacity="0.07"/>';
    out += txt(112, 64, "Awake", 11.5, 600, "end");
    out += txt(112, 128, "1", 11.5, 700, "end") + txt(112, 164, "2", 11.5, 700, "end") + txt(112, 200, "3", 11.5, 700, "end");
    out += line(92, 116, 92, 204, 2) + line(92, 116, 100, 116, 2) + line(92, 204, 100, 204, 2);
    out += slot("sl1", 6, 77, 98);
    out += slot("sl2", 4, 145, 84);
    var seq = [[0, "A"], [8, "N1"], [16, "N2"], [34, "N3"], [66, "N2"], [78, "R"], [88, "N2"], [108, "N3"], [136, "N2"], [160, "R"], [178, "N2"],
      [205, "N3"], [218, "N2"], [248, "R"], [276, "N2"], [322, "R"], [356, "N1"], [364, "N2"], [400, "R"], [452, "A"]];
    var d = "M " + X(0) + " " + Y.A;
    seq.forEach(function (s, i) { if (i) d += " V " + Y[s[1]]; var nx = i < seq.length - 1 ? seq[i + 1][0] : 480; d += " H " + X(nx); });
    out += '<path d="' + d + '" fill="none" stroke="var(--text-secondary)" stroke-width="2"/>';
    seq.forEach(function (s, i) {
      if (s[1] !== "R") return;
      out += '<line x1="' + X(s[0]) + '" y1="' + Y.R + '" x2="' + X(seq[i + 1][0]) + '" y2="' + Y.R + '" stroke="var(--d-sleep)" stroke-width="7" stroke-linecap="round"/>';
    });
    for (var h = 0; h <= 8; h++) { out += line(X(h * 60), 208, X(h * 60), 214, 1.5) + txt(X(h * 60), 228, h + "h", 10.5, 600, "middle"); }
    out += line(X(8), 238, X(98), 238, 2) + line(X(8), 232, X(8), 244, 2) + line(X(98), 232, X(98), 244, 2);
    out += slot("sl3", 150, 6, 200) + lead(190, 36, X(8) + 2, 124) + txt(360, 26, "the falling feeling as you drift off", 11.5);
    out += slot("sl4", 300, 262, 150) + lead(345, 262, X(122), 198) + txt(375, 312, "sleepwalking happens in this deep stage", 11.5, 500, "middle");
    out += slot("sl5", 94, 262, 160) + lead(174, 262, X(53), 240) + txt(174, 312, "one trip down and back up", 11.5, 500, "middle");
    out += txt(X1, 250, "REM gets longer toward morning →", 11.5, 600, "end", "var(--d-sleep)");
    return out + "</svg>";
  })(),
  slots: [
    { id: "sl1", label: "REM sleep" },
    { id: "sl2", label: "NREM sleep" },
    { id: "sl3", label: "Hypnagogic sensations" },
    { id: "sl4", label: "Somnambulism" },
    { id: "sl5", label: "90-minute cycle" }
  ],
  distractors: ["Circadian rhythm", "REM sleep behavior disorder"],
  caption: "One night of sleep drawn as a staircase. You drift down through <b>NREM</b> stages 1, 2, and 3, climb back up, and enter <b>REM sleep</b> (vivid dreams), roughly every 90 minutes. Early cycles have lots of deep stage 3; toward morning REM periods stretch out. <b>Hypnagogic sensations</b> hit at sleep onset, and <b>somnambulism</b> (sleepwalking) happens in deep stage 3. Traps: the 90-minute cycle is NOT the <b>circadian rhythm</b> (that's the 24-hour clock), and <b>REM sleep behavior disorder</b> happens in REM, not stage 3.",
  mnemonic: "Down the stairs, back up, dream. About five rounds a night."
});

})();

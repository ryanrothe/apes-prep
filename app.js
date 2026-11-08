/* Terra study hub engine (adapted from Summit; course layer added 2026-09-15).
   One engine, many courses. Each course owns its domains, diagrams, worked examples, and its own localStorage key. */
(function () {
"use strict";

const DATA = window.EXAM_DATA || {};
const DOMAINS_ALL = DATA.domains || {};
const WORKED_ALL = DATA.worked || {};
const ALL_DIAGRAMS = window.DIAGRAMS || [];
const COURSES = window.COURSES || [];
const COURSE_KEY = "terra.course";
const DAY = 86400000;
const BOX_DAYS = [0, 1, 3, 7, 14];

/* ---------- course + state ---------- */
let COURSE = null, DOMAINS = [], DIAGRAMS = [], UNIT_NAMES = {}, SIM_SPEC = null, WORKED = [], KEY = "";
let S = null;
let QZ = null, FL = null, LB = null, DR = null, MT = null;

function courseById(id) { return COURSES.find(c => c.id === id) || null; }
function loadCourse(id) {
  const c = courseById(id);
  if (!c) return false;
  COURSE = c;
  DOMAINS = c.domains.filter(d => DOMAINS_ALL[d]);
  DIAGRAMS = ALL_DIAGRAMS.filter(v => c.domains.includes(v.domain));
  UNIT_NAMES = c.units || {};
  SIM_SPEC = c.sim;
  WORKED = WORKED_ALL[c.id] || [];
  KEY = c.storageKey;
  S = load();
  QZ = FL = LB = DR = MT = null;
  try { localStorage.setItem(COURSE_KEY, id); } catch (e) {}
  document.documentElement.setAttribute("data-course", id);
  return true;
}
function leaveCourse() {
  COURSE = null; DOMAINS = []; DIAGRAMS = []; UNIT_NAMES = {}; SIM_SPEC = null; WORKED = []; KEY = ""; S = null;
  QZ = FL = LB = DR = MT = null;
  document.documentElement.removeAttribute("data-course");
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return migrate(JSON.parse(raw));
  } catch (e) { /* corrupted state falls through to fresh */ }
  return fresh();
}
function freshSettings() {
  const s = {};
  ((COURSE && COURSE.dates) || []).forEach(d => { s[d.key] = ""; });
  return s;
}
function fresh() {
  return { settings: freshSettings(), items: {}, conf: {}, hist: [], labs: {}, streak: { day: "", n: 0 }, sim: null };
}
function migrate(s) {
  const f = fresh();
  const out = Object.assign(f, s);
  out.settings = Object.assign(freshSettings(), s.settings || {});
  out.labs = s.labs || {};
  return out;
}
function save() { if (!KEY || !S) return; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

/* Run fn with another course's data + stored state loaded, without disturbing the current session.
   Used by the hub to show per-course readiness. Nothing is saved while inside. */
function withCourse(c, fn) {
  const keep = { COURSE, DOMAINS, DIAGRAMS, UNIT_NAMES, SIM_SPEC, WORKED, KEY, S };
  COURSE = c; DOMAINS = c.domains.filter(d => DOMAINS_ALL[d]); DIAGRAMS = ALL_DIAGRAMS.filter(v => c.domains.includes(v.domain));
  UNIT_NAMES = c.units || {}; SIM_SPEC = c.sim; WORKED = WORKED_ALL[c.id] || []; KEY = c.storageKey; S = load();
  let out;
  try { out = fn(); } finally {
    COURSE = keep.COURSE; DOMAINS = keep.DOMAINS; DIAGRAMS = keep.DIAGRAMS; UNIT_NAMES = keep.UNIT_NAMES;
    SIM_SPEC = keep.SIM_SPEC; WORKED = keep.WORKED; KEY = keep.KEY; S = keep.S;
  }
  return out;
}

/* ---------- helpers ---------- */
const $ = sel => document.querySelector(sel);
function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function todayStr(d) { const x = d || new Date(); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); }
function daysSince(ts) { return ts ? (Date.now() - ts) / DAY : Infinity; }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pct(x) { return Math.round(x * 100); }
function plural(n, w) { return n + " " + w + (n === 1 ? "" : "s"); }
function simCount() { return SIM_SPEC ? Object.values(SIM_SPEC.mix).reduce((a, b) => a + b, 0) + (SIM_SPEC.terms || 0) : 0; }
function simLabel() { return "⏱ Timed practice test · " + simCount() + " Q · " + SIM_SPEC.minutes + " min"; }
function unitsPresent() { const u = []; DOMAINS.forEach(d => { const n = DOMAINS_ALL[d].unit || 1; if (!u.includes(n)) u.push(n); }); return u; }

function itemStat(id) { return S.items[id] || { n: 0, c: 0, streak: 0, last: 0, box: 0, due: 0 }; }
function setItemStat(id, st) { S.items[id] = st; }

function bumpStreak() {
  const t = todayStr();
  if (S.streak.day === t) return;
  const y = todayStr(new Date(Date.now() - DAY));
  S.streak.n = (S.streak.day === y) ? S.streak.n + 1 : 1;
  S.streak.day = t;
}

function recordAnswer(id, correct) {
  const st = itemStat(id);
  st.n++; if (correct) st.c++;
  st.streak = correct ? st.streak + 1 : 0;
  st.last = Date.now();
  setItemStat(id, st);
  bumpStreak(); save();
}

/* ---------- analytics ---------- */
function domainQuiz(d) { return (DOMAINS_ALL[d] && DOMAINS_ALL[d].quiz) || []; }
/* Vocabulary courses (AP Psych) carry a `terms` list: {id, term, short, def, ex, hook, accept?, near?, exAvoid?}.
   Each term doubles as a flashcard (same id) and is the progress anchor for every word drill. */
function domainTerms(d) { return (DOMAINS_ALL[d] && DOMAINS_ALL[d].terms) || []; }
function termCard(t) { return { id: t.id, topic: "", front: t.term, back: t.def, term: t }; }
function domainCards(d) {
  const dm = DOMAINS_ALL[d];
  if (!dm) return [];
  return (dm.cards || []).concat((dm.terms || []).map(termCard));
}
function hasTerms() { return DOMAINS.some(d => domainTerms(d).length); }
function allTermItems() { return DOMAINS.flatMap(d => domainTerms(d).map(t => ({ t, d }))); }
function termItem(id) {
  for (const d of DOMAINS) { const t = domainTerms(d).find(x => x.id === id); if (t) return { t, d }; }
  return null;
}
/* 0 new · 1 learning · 2 getting there · 3 mastered. Drill streaks and flashcard boxes both count. */
const LEVELS = [
  { name: "New", color: "var(--ring-track)" },
  { name: "Learning", color: "var(--bad)" },
  { name: "Getting there", color: "var(--warn)" },
  { name: "Mastered", color: "var(--good)" }
];
function termLevel(id) {
  const st = itemStat(id);
  if (!st.n && !st.box) return 0;
  if (st.streak >= 3 || st.box >= 4) return 3;
  if (st.streak >= 1 || st.box >= 2) return 2;
  return 1;
}
function levelCounts(list) {
  const c = [0, 0, 0, 0];
  list.forEach(x => c[termLevel(x.t.id)]++);
  return c;
}
function masteryBar(list) {
  const c = levelCounts(list), n = list.length || 1;
  return '<div class="mbar">' + [3, 2, 1, 0].map(l => c[l] ? '<i style="width:' + (100 * c[l] / n) + '%;background:' + LEVELS[l].color + '"></i>' : "").join("") + "</div>" +
    '<div class="mlegend">' + [3, 2, 1, 0].map(l => '<span><i style="background:' + LEVELS[l].color + '"></i>' + LEVELS[l].name + " <b>" + c[l] + "</b></span>").join("") + "</div>";
}
/* A missed word goes straight back into the flashcard queue. */
function nudgeCard(id) {
  const st = itemStat(id);
  if (st.box > 1) { st.box = 1; st.due = Date.now(); setItemStat(id, st); save(); }
}

function domStats(d) {
  const qs = domainQuiz(d).concat(domainTerms(d)), cs = domainCards(d);
  let attempts = 0, correct = 0, seen = 0, lastTs = 0;
  qs.forEach(q => { const st = itemStat(q.id); attempts += st.n; correct += st.c; if (st.n) seen++; if (st.last > lastTs) lastTs = st.last; });
  cs.forEach(c => { const st = itemStat(c.id); if (st.last > lastTs) lastTs = st.last; });
  const conf = S.conf[d] ? S.conf[d].v : 0;
  const acc = attempts ? correct / attempts : 0;
  const cov = qs.length ? seen / qs.length : 0;
  const stale = daysSince(lastTs);
  const fresh01 = lastTs ? Math.exp(-Math.max(0, stale) / 12) : 0;
  const conf01 = conf ? (conf - 1) / 4 : 0.5;
  const readiness = Math.round(100 * (0.4 * acc + 0.3 * cov + 0.15 * conf01 + 0.15 * fresh01));
  return { d, acc, cov, attempts, correct, seen, total: qs.length, conf, stale, readiness, lastTs };
}

function focusReason(s) {
  if (s.cov < 0.3) return "mostly untouched";
  if (s.acc < 0.65 && s.attempts >= 5) return "accuracy " + pct(s.acc) + "%";
  if (s.stale > 7 && s.stale < 10000) return "not reviewed in " + Math.floor(s.stale) + " days";
  if (s.conf && s.conf <= 2) return "you rated it shaky";
  if (s.stale === Infinity) return "not started yet";
  return "keep it warm";
}

function rankedNeeds() {
  return DOMAINS.map(domStats).sort((a, b) => a.readiness - b.readiness);
}

function dueCards(d) {
  const now = Date.now();
  let pool = [];
  (d ? [d] : DOMAINS).forEach(dom => {
    domainCards(dom).forEach(c => {
      const st = itemStat(c.id);
      if (!st.box || now >= st.due) pool.push({ card: c, dom, isNew: !st.box });
    });
  });
  return pool;
}

function topicBreakdown(minAttempts) {
  const map = {};
  DOMAINS.forEach(d => domainQuiz(d).forEach(q => {
    const st = itemStat(q.id); if (!st.n) return;
    const k = d + "||" + (q.topic || "General");
    map[k] = map[k] || { dom: d, topic: q.topic || "General", n: 0, c: 0 };
    map[k].n += st.n; map[k].c += st.c;
  }));
  return Object.values(map).filter(t => t.n >= (minAttempts || 3));
}

/* ---------- smart quiz selection ---------- */
function smartSet(n) {
  const needs = {};
  rankedNeeds().forEach(s => { needs[s.d] = (100 - s.readiness) / 100; });
  let pool = [];
  DOMAINS.forEach(d => domainQuiz(d).forEach(q => {
    const st = itemStat(q.id);
    let w;
    if (!st.n) w = 1.6;
    else {
      const wrongRate = 1 - st.c / st.n;
      w = 0.5 + 1.4 * wrongRate + (daysSince(st.last) > 7 ? 0.5 : 0) + (st.streak === 0 ? 0.3 : 0);
    }
    w *= 0.55 + needs[d];
    pool.push({ q, d, w });
  }));
  const out = [];
  while (out.length < n && pool.length) {
    let sum = pool.reduce((a, p) => a + p.w, 0), r = Math.random() * sum, idx = 0;
    for (let i = 0; i < pool.length; i++) { r -= pool[i].w; if (r <= 0) { idx = i; break; } }
    out.push(pool[idx]); pool.splice(idx, 1);
  }
  return out;
}

function missedSet(n) {
  let pool = [];
  DOMAINS.forEach(d => domainQuiz(d).forEach(q => {
    const st = itemStat(q.id);
    if (st.n && st.streak === 0) pool.push({ q, d, last: st.last });
  }));
  pool.sort((a, b) => b.last - a.last);
  return pool.slice(0, n);
}

/* ---------- navigation ---------- */
let view = { name: "hub" };
function go(name, params) { view = Object.assign({ name }, params || {}); render(); window.scrollTo(0, 0); }

document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => go(t.dataset.view)));

function setTabs() {
  document.body.classList.toggle("no-tabs", !COURSE || view.name === "hub");
  document.body.classList.toggle("has-terms", !!COURSE && hasTerms());
  const top = ["quiz", "flash", "worked", "practice", "drill", "match"].includes(view.name) ? "study" :
              ["diagram", "label"].includes(view.name) ? "diagrams" : view.name;
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.view === top));
}

/* ---------- sheet ---------- */
function openSheet(html) {
  $("#sheet").innerHTML = html;
  $("#sheet").classList.remove("hidden");
  $("#sheet-backdrop").classList.remove("hidden");
}
function closeSheet() { $("#sheet").classList.add("hidden"); $("#sheet-backdrop").classList.add("hidden"); }
$("#sheet-backdrop").addEventListener("click", closeSheet);

/* ---------- svg ring ---------- */
function ring(p, color, size, stroke) {
  size = size || 62; stroke = stroke || 7;
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + " " + size + '">' +
    '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--ring-track)" stroke-width="' + stroke + '"/>' +
    '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="' + stroke + '" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + c * (1 - Math.max(0.005, p)) + '"/></svg>';
}
function domColor(d) { return "var(--d-" + d + ")"; }
function domShort(d) { return DOMAINS_ALL[d] ? DOMAINS_ALL[d].short : d; }
function domName(d) { return DOMAINS_ALL[d] ? DOMAINS_ALL[d].name : d; }

/* ---------- views ---------- */
function render() {
  setTabs();
  const m = $("#main");
  if (!COURSE || view.name === "hub") return renderHub(m);
  if (!DOMAINS.length) { m.innerHTML = '<div class="card">Question banks are still loading into this build. Pull the latest version.</div>'; return; }
  if (view.name === "home") return renderHome(m);
  if (view.name === "study") return renderStudy(m);
  if (view.name === "quiz") return renderQuiz(m);
  if (view.name === "flash") return renderFlash(m);
  if (view.name === "worked") return renderWorked(m);
  if (view.name === "practice") return renderPractice(m);
  if (view.name === "drill") return renderDrill(m);
  if (view.name === "match") return renderMatch(m);
  if (view.name === "terms") return renderTerms(m);
  if (view.name === "diagrams") return renderDiagramList(m);
  if (view.name === "diagram") return renderDiagramStudy(m);
  if (view.name === "label") return renderLabel(m);
  if (view.name === "exam") return renderExam(m);
  if (view.name === "progress") return renderProgress(m);
  renderHome(m);
}

/* ----- hub: pick a course ----- */
function courseSnapshot(c) {
  return withCourse(c, () => {
    const doms = DOMAINS;
    const needs = doms.map(domStats);
    const overall = needs.length ? Math.round(needs.reduce((a, s) => a + s.readiness, 0) / needs.length) : 0;
    const qn = doms.reduce((a, d) => a + domainQuiz(d).length, 0);
    const cn = doms.reduce((a, d) => a + domainCards(d).length, 0);
    const tn = doms.reduce((a, d) => a + domainTerms(d).length, 0);
    const due = dueCards(null).length;
    const answered = Object.values(S.items).reduce((a, s) => a + (s.n || 0), 0);
    const lastTs = Math.max(0, ...needs.map(s => s.lastTs || 0));
    const overallShown = (answered || lastTs) ? overall : 0;
    const dates = (c.dates || []).map(d => ({ label: d.label, ds: S.settings[d.key] })).filter(d => d.ds)
      .map(d => ({ label: d.label, diff: Math.ceil((new Date(d.ds + "T12:00:00") - Date.now()) / DAY) })).filter(d => d.diff >= 0);
    return { overall: overallShown, qn, cn, tn, dn: DIAGRAMS.length, wn: WORKED.length, due, answered, lastTs, dates, resumeSim: !!(S.sim && !S.sim.submitted) };
  });
}

function renderHub(m) {
  let last = "";
  try { last = localStorage.getItem(COURSE_KEY) || ""; } catch (e) {}
  m.innerHTML = '<h1>Terra</h1><p class="sub">Your study hub. Pick a course.</p>' +
    COURSES.map(c => {
      const s = courseSnapshot(c);
      const started = s.answered > 0 || s.lastTs > 0;
      const meta = (s.tn ? plural(s.tn, "term") + " · " + plural(s.qn, "question") : plural(s.qn, "question") + " · " + plural(s.cn, "flashcard")) + (s.dn ? " · " + plural(s.dn, "diagram") : "") + (s.wn ? " · " + plural(s.wn, "worked example") : "");
      const status = !started ? "Not started yet" :
        (s.due ? plural(s.due, "card") + " due" : "Cards caught up") +
        (s.lastTs ? " · last studied " + (daysSince(s.lastTs) < 1 ? "today" : Math.floor(daysSince(s.lastTs)) + "d ago") : "");
      const count = s.dates.length ? '<div class="hub-count"><b>' + s.dates[0].diff + '</b> days to ' + esc(s.dates[0].label) + "</div>" : "";
      return '<div class="card hub-card" style="--dc:' + c.color + '">' +
        '<div class="row"><span class="ring-wrap"><span class="ring-svg">' + ring(s.overall / 100, c.color) + '</span><span class="ring-num">' + s.overall + "</span></span>" +
        '<div class="grow"><b class="hub-name">' + esc(c.name) + "</b><div class=\"muted\">" + esc(meta) + "</div>" +
        '<div class="muted hub-status">' + esc(status) + "</div></div></div>" +
        count +
        '<button class="btn block hub-open" data-course="' + c.id + '" style="background:' + c.color + '">' +
        (s.resumeSim ? "Resume practice test" : (last === c.id && started) ? "Continue" : started ? "Open" : "Start") + " →</button></div>";
    }).join("") +
    '<p class="muted center" style="margin-top:10px">Each course keeps its own progress, streak, and backup code.</p>';
  m.querySelectorAll(".hub-open").forEach(b => b.addEventListener("click", () => {
    if (loadCourse(b.dataset.course)) go(S.sim && !S.sim.submitted ? "exam" : "home");
  }));
}

/* ----- home ----- */
function examCountdown() {
  const out = [];
  (COURSE.dates || []).forEach(d => {
    const ds = S.settings[d.key];
    if (!ds) return;
    const diff = Math.ceil((new Date(ds + "T12:00:00") - Date.now()) / DAY);
    if (diff >= 0) out.push({ label: d.label, diff });
  });
  return out;
}

function nextDiagram() {
  const fresh = DIAGRAMS.filter(v => v.slots && v.slots.length && !S.labs[v.id]);
  if (fresh.length) return fresh[0];
  const done = DIAGRAMS.filter(v => v.slots && v.slots.length).sort((a, b) => (S.labs[a.id].t || 0) - (S.labs[b.id].t || 0));
  return done[0] || null;
}

function courseHeader(title, sub) {
  return '<div class="row course-bar"><button class="btn small secondary" id="go-hub">‹ Courses</button><span class="chip" style="--dc:' + COURSE.color + '"><span class="dot"></span>' + esc(COURSE.short) + "</span></div>" +
    "<h1>" + esc(title) + '</h1><p class="sub">' + esc(sub) + "</p>";
}
function wireHub(m) { const b = m.querySelector("#go-hub"); if (b) b.addEventListener("click", () => { leaveCourse(); go("hub"); }); }

function renderHome(m) {
  const needs = rankedNeeds();
  const due = dueCards(null).length;
  const counts = examCountdown();
  const focus = needs.slice(0, 2);
  const streakActive = S.streak.day === todayStr() || S.streak.day === todayStr(new Date(Date.now() - DAY));
  const streakN = streakActive ? S.streak.n : 0;
  const nd = nextDiagram();
  const terms = hasTerms();

  m.innerHTML =
    courseHeader(COURSE.name, COURSE.tagline) +
    (counts.length ? '<div class="exam-count">' + counts.map(c =>
      '<div class="exam-pill"><div class="n">' + c.diff + '</div><div class="l">days to ' + esc(c.label) + "</div></div>").join("") + "</div>"
      : '<div class="card row"><div class="grow">Set your test date to see a countdown.</div><button class="btn small" id="set-dates">Set dates</button></div>') +
    '<div class="card row"><div class="grow"><b>' + (streakN ? "🔥 " + plural(streakN, "day") + " streak" : "Start today’s streak") + "</b>" +
    '<div class="muted">' + (due ? plural(due, "card") + " due for review" : "All caught up on flashcards") + "</div></div>" +
    '<button class="btn small" id="go-settings">⚙︎</button></div>' +

    (terms ? "<h2>Your words</h2>" + '<div class="card">' + masteryBar(allTermItems()) +
      '<div style="height:12px"></div><button class="btn block" id="smart-drill">▶ Smart word drill (10 words)</button>' +
      '<div style="height:8px"></div><div class="row"><button class="btn secondary grow" id="go-practice">More ways to practice</button>' +
      '<button class="btn secondary grow" id="go-terms">Word list</button></div></div>' : "") +

    "<h2>Today’s focus</h2>" +
    focus.map(s =>
      '<div class="card row" style="--dc:' + domColor(s.d) + '"><span class="dot"></span><div class="grow"><b>' + esc(domName(s.d)) + "</b>" +
      '<div class="muted">' + focusReason(s) + " · readiness " + s.readiness + "%</div></div>" +
      (terms ? '<button class="btn small" data-words="' + s.d + '">Words</button>' : "") +
      '<button class="btn small' + (terms ? " secondary" : "") + '" data-quiz="' + s.d + '">Quiz</button>' +
      (terms ? "" : '<button class="btn small secondary" data-flash="' + s.d + '">Cards</button>') + "</div>").join("") +

    "<h2>Readiness by topic</h2><div class=\"card\"><div class=\"ring-grid\" style=\"grid-template-columns:repeat(3,1fr)\">" +
    DOMAINS.map(d => { const s = needs.find(x => x.d === d);
      return '<button class="ring-cell" data-dom="' + d + '"><span class="ring-wrap">' + ring(s.readiness / 100, domColor(d)) +
        '<span class="ring-num">' + s.readiness + '</span></span><span class="ring-label">' + esc(domShort(d)) + "</span></button>"; }).join("") +
    '</div><p class="muted" style="margin:10px 0 0">Readiness blends accuracy, coverage, your confidence rating, and how recently you touched the topic. Tap a ring to drill in.</p></div>' +

    "<h2>Jump in</h2>" +
    '<div class="card"><button class="btn block' + (terms ? " secondary" : "") + '" id="smart-quiz">' + (terms ? "Test-style questions (smart quiz, 10)" : "▶ Smart quiz (10 questions where you need it most)") + "</button>" +
    '<div style="height:8px"></div>' +
    '<button class="btn block secondary" id="due-flash">Review due flashcards' + (due ? " (" + due + ")" : "") + "</button>" +
    '<div style="height:8px"></div>' +
    (nd ? '<button class="btn block secondary" id="go-label">◫ Label a diagram: ' + esc(nd.title) + '</button><div style="height:8px"></div>' : "") +
    (WORKED.length ? '<button class="btn block secondary" id="go-worked">✎ Worked examples, step by step (' + WORKED.length + ')</button><div style="height:8px"></div>' : "") +
    '<button class="btn block secondary" id="go-exam">' + (S.sim && !S.sim.submitted ? "⏱ Resume practice test" : simLabel()) + '</button></div>';

  wireHub(m);
  m.querySelectorAll("[data-quiz]").forEach(b => b.addEventListener("click", () => startQuiz(b.dataset.quiz)));
  m.querySelectorAll("[data-flash]").forEach(b => b.addEventListener("click", () => startFlash(b.dataset.flash)));
  m.querySelectorAll("[data-words]").forEach(b => b.addEventListener("click", () => go("practice", { scope: b.dataset.words })));
  m.querySelectorAll("[data-dom]").forEach(b => b.addEventListener("click", () => go("study", { dom: b.dataset.dom })));
  const sdr = $("#smart-drill"); if (sdr) sdr.addEventListener("click", () => startDrill("mix", "all"));
  const gp = $("#go-practice"); if (gp) gp.addEventListener("click", () => go("practice"));
  const gt = $("#go-terms"); if (gt) gt.addEventListener("click", () => go("terms"));
  const sd = $("#set-dates"); if (sd) sd.addEventListener("click", settingsSheet);
  $("#go-settings").addEventListener("click", settingsSheet);
  $("#smart-quiz").addEventListener("click", () => startQuiz(null));
  $("#due-flash").addEventListener("click", () => startFlash(null));
  const gl = $("#go-label"); if (gl) gl.addEventListener("click", () => startLabel(nd.id));
  const gw = $("#go-worked"); if (gw) gw.addEventListener("click", () => go("worked"));
  $("#go-exam").addEventListener("click", startSim);
}

/* ----- study hub ----- */
function renderStudy(m) {
  const missed = missedSet(10).length;
  const terms = hasTerms();
  m.innerHTML = courseHeader("Study", "Pick a mode, or drill a single topic.") +
    '<div class="card">' +
    (terms ? '<button class="btn block" id="go-practice">▶ Practice the words (7 ways)</button><div style="height:8px"></div>' : "") +
    '<button class="btn block' + (terms ? " secondary" : "") + '" id="smart-quiz">' + (terms ? "Test-style questions (smart quiz)" : "▶ Smart quiz") + '</button><div style="height:8px"></div>' +
    '<div class="row"><button class="btn secondary grow" id="due-flash">Flashcards due (' + dueCards(null).length + ')</button>' +
    '<button class="btn secondary grow" id="go-diagrams">Diagrams</button></div>' +
    '<div style="height:8px"></div><button class="btn block secondary" id="go-exam">' + (S.sim && !S.sim.submitted ? "⏱ Resume practice test" : simLabel()) + '</button>' +
    (missed ? '<div style="height:8px"></div><button class="btn block secondary" id="review-missed">Review recent misses (' + missed + ")</button>" : "") +
    "</div>" +
    unitsPresent().map(u => "<h2>" + esc(UNIT_NAMES[u] || ("Unit " + u)) + "</h2>" +
      DOMAINS.filter(d => (DOMAINS_ALL[d].unit || 1) === u).map(d => {
        const s = domStats(d);
        return '<div class="card" style="--dc:' + domColor(d) + '">' +
          '<div class="row"><span class="dot"></span><div class="grow"><b>' + esc(domName(d)) + "</b>" +
          '<div class="muted">' + (terms ? plural(domainTerms(d).length, "word") + " · " + s.seen + "/" + s.total + " words + questions practiced" : s.seen + "/" + s.total + " questions seen") +
          " · " + (s.attempts ? "accuracy " + pct(s.acc) + "%" : "no attempts yet") + "</div></div>" +
          '<span class="chip">' + s.readiness + "%</span></div>" +
          '<div class="row" style="margin-top:10px">' +
          (terms ? '<button class="btn small grow" data-words="' + d + '">Words</button>' : "") +
          '<button class="btn small grow' + (terms ? " secondary" : "") + '" data-quiz="' + d + '">Quiz</button>' +
          '<button class="btn small secondary grow" data-flash="' + d + '">' + (terms ? "Cards" : "Flashcards") + "</button></div></div>";
      }).join("")).join("") +
    (WORKED.length ? "<h2>Worked examples</h2>" + WORKED.map((w, i) =>
      '<button class="card worked-card" data-worked="' + i + '" style="--dc:' + domColor(w.domain) + '"><span class="row"><span class="dot"></span><span class="grow"><b>' + esc(w.title) + '</b><span class="muted" style="display:block">' + esc(domShort(w.domain)) + " · " + plural(w.steps.length, "step") + "</span></span><span class=\"muted\">›</span></span></button>").join("") : "");
  wireHub(m);
  $("#smart-quiz").addEventListener("click", () => startQuiz(null));
  $("#due-flash").addEventListener("click", () => startFlash(null));
  $("#go-diagrams").addEventListener("click", () => go("diagrams"));
  $("#go-exam").addEventListener("click", startSim);
  const rm = $("#review-missed"); if (rm) rm.addEventListener("click", () => startQuiz("__missed__"));
  const gp = $("#go-practice"); if (gp) gp.addEventListener("click", () => go("practice"));
  m.querySelectorAll("[data-quiz]").forEach(b => b.addEventListener("click", () => startQuiz(b.dataset.quiz)));
  m.querySelectorAll("[data-flash]").forEach(b => b.addEventListener("click", () => startFlash(b.dataset.flash)));
  m.querySelectorAll("[data-words]").forEach(b => b.addEventListener("click", () => go("practice", { scope: b.dataset.words })));
  m.querySelectorAll("[data-worked]").forEach(b => b.addEventListener("click", () => go("worked", { wi: Number(b.dataset.worked) })));
  if (view.dom) { const el = m.querySelector('[data-quiz="' + view.dom + '"]'); if (el) el.closest(".card").scrollIntoView(); }
}

/* ----- worked examples ----- */
function renderWorked(m) {
  if (view.wi == null) {
    m.innerHTML = '<div class="row"><button class="btn small secondary" id="wk-back">← Study</button></div>' +
      "<h1>Worked examples</h1><p class=\"sub\">The study-guide problems, solved one step at a time. Cover the steps, try it yourself, then reveal.</p>" +
      WORKED.map((w, i) =>
        '<button class="card worked-card" data-worked="' + i + '" style="--dc:' + domColor(w.domain) + '"><span class="row"><span class="dot"></span><span class="grow"><b>' + esc(w.title) + '</b><span class="muted" style="display:block">' + esc(domShort(w.domain)) + " · " + plural(w.steps.length, "step") + "</span></span><span class=\"muted\">›</span></span></button>").join("");
    $("#wk-back").addEventListener("click", () => go("study"));
    m.querySelectorAll("[data-worked]").forEach(b => b.addEventListener("click", () => go("worked", { wi: Number(b.dataset.worked) })));
    return;
  }
  const w = WORKED[view.wi];
  if (!w) return go("worked");
  const shown = view.shown == null ? 0 : view.shown;
  m.innerHTML = '<div class="row"><button class="btn small secondary" id="wk-back">← Examples</button>' +
    '<div class="grow center"><span class="chip" style="--dc:' + domColor(w.domain) + '"><span class="dot"></span>' + esc(domShort(w.domain)) + "</span></div><span class=\"muted\">" + (view.wi + 1) + "/" + WORKED.length + "</span></div>" +
    "<h1>" + esc(w.title) + "</h1>" +
    '<div class="card narrative">' + esc(w.prompt) + "</div>" +
    '<ol class="steps">' + w.steps.slice(0, shown).map(s => '<li><b>' + esc(s.h) + "</b><div>" + esc(s.t) + "</div></li>").join("") + "</ol>" +
    (shown < w.steps.length ?
      '<button class="btn block" id="wk-next">' + (shown === 0 ? "Show step 1" : "Show step " + (shown + 1) + " of " + w.steps.length) + "</button>" +
      '<div style="height:8px"></div><button class="btn block secondary" id="wk-all">Show all steps</button>'
      : '<div class="explain"><b>Answer.</b> ' + esc(w.answer) + "</div>" +
        '<div class="row"><button class="btn secondary grow" id="wk-again">Hide steps</button>' +
        '<button class="btn grow" data-quiz="' + w.domain + '">Quiz this topic</button></div>' +
        (view.wi < WORKED.length - 1 ? '<div style="height:8px"></div><button class="btn block secondary" id="wk-nextex">Next example →</button>' : ""));
  $("#wk-back").addEventListener("click", () => go("worked"));
  const nx = $("#wk-next"); if (nx) nx.addEventListener("click", () => { view.shown = shown + 1; render(); });
  const al = $("#wk-all"); if (al) al.addEventListener("click", () => { view.shown = w.steps.length; render(); });
  const ag = $("#wk-again"); if (ag) ag.addEventListener("click", () => { view.shown = 0; render(); window.scrollTo(0, 0); });
  const ne = $("#wk-nextex"); if (ne) ne.addEventListener("click", () => go("worked", { wi: view.wi + 1 }));
  const qb = m.querySelector("[data-quiz]"); if (qb) qb.addEventListener("click", () => startQuiz(qb.dataset.quiz));
}

/* ----- quiz ----- */
function startQuiz(dom) {
  let set;
  if (dom === "__missed__") set = missedSet(10);
  else if (dom) set = shuffle(domainQuiz(dom).map(q => ({ q, d: dom }))
      .sort((a, b) => { const sa = itemStat(a.q.id), sb = itemStat(b.q.id); return (sa.n - sb.n) || (sa.c / (sa.n || 1) - sb.c / (sb.n || 1)); })
      .slice(0, 14)).slice(0, 10);
  else set = smartSet(10);
  if (!set.length) { openSheet("<h2>Nothing to quiz yet</h2><p class='sub'>This bank is empty in the current build.</p>"); return; }
  QZ = { set, i: 0, answers: [], dom: dom && dom !== "__missed__" ? dom : null, picked: null };
  go("quiz");
}

function renderQuiz(m) {
  if (!QZ) return go("study");
  if (QZ.i >= QZ.set.length) return renderQuizSummary(m);
  const item = QZ.set[QZ.i], q = item.q;
  const answered = QZ.picked != null;
  m.innerHTML =
    '<div class="row"><button class="btn small secondary" id="qz-exit">✕ End</button><div class="grow center"><span class="chip" style="--dc:' + domColor(item.d) + '"><span class="dot"></span>' + esc(domShort(item.d)) + (q.topic ? " · " + esc(q.topic) : "") + "</span></div><span class=\"muted\">" + (QZ.i + 1) + "/" + QZ.set.length + "</span></div>" +
    '<div class="q-progress">' + QZ.set.map((_, i) =>
      "<i class=\"" + (i < QZ.i ? (QZ.answers[i].correct ? "done-right" : "done-wrong") : i === QZ.i ? "current" : "") + "\"></i>").join("") + "</div>" +
    '<div class="q-stem">' + esc(q.q) + "</div>" +
    q.choices.map((c, i) => {
      let cls = "choice";
      if (answered) { if (i === q.answer) cls += " correct"; else if (i === QZ.picked) cls += " wrong"; else cls += " dim"; }
      return '<button class="' + cls + '" data-i="' + i + '"' + (answered ? " disabled" : "") + '><span class="key">' + "ABCD"[i] + "</span><span>" + esc(c) + "</span></button>";
    }).join("") +
    (answered ? '<div class="explain"><b>' + (QZ.picked === q.answer ? "Correct." : "Not quite.") + "</b> " + esc(q.explain) + "</div>" +
      '<button class="btn block" id="qz-next">' + (QZ.i === QZ.set.length - 1 ? "See results" : "Next question") + "</button>" : "");
  $("#qz-exit").addEventListener("click", () => { QZ = null; go("study"); });
  if (!answered) m.querySelectorAll(".choice").forEach(b => b.addEventListener("click", () => {
    QZ.picked = Number(b.dataset.i);
    const correct = QZ.picked === q.answer;
    QZ.answers[QZ.i] = { id: q.id, correct, d: item.d, topic: q.topic };
    recordAnswer(q.id, correct);
    render();
  }));
  else $("#qz-next").addEventListener("click", () => { QZ.i++; QZ.picked = null; render(); });
}

function renderQuizSummary(m) {
  const n = QZ.answers.length, c = QZ.answers.filter(a => a.correct).length;
  /* Re-renders (after the confidence sheet closes) must not log the round twice or reopen the sheet. */
  const first = !QZ.done;
  if (first) {
    S.hist.push({ t: Date.now(), mode: "quiz", dom: QZ.dom, n, c });
    if (S.hist.length > 400) S.hist = S.hist.slice(-400);
    save();
  }
  const byTopic = {};
  QZ.answers.forEach(a => { const k = a.topic || "General"; byTopic[k] = byTopic[k] || { n: 0, c: 0 }; byTopic[k].n++; if (a.correct) byTopic[k].c++; });
  const quizDom = QZ.dom;
  m.innerHTML = '<div class="center" style="padding-top:24px"><div class="summary-hero">' + c + "/" + n + "</div>" +
    '<p class="sub">' + (c / n >= 0.8 ? "Strong. That’s A-level pace." : c / n >= 0.6 ? "Solid base. The explanations you just read are the gold." : "Good reps. Every miss here is a point you’ll get back on test day.") + "</p></div>" +
    '<div class="card">' + Object.keys(byTopic).map(t =>
      '<div class="topic-pill"><span>' + esc(t) + "</span><b>" + byTopic[t].c + "/" + byTopic[t].n + "</b></div>").join("") + "</div>" +
    '<button class="btn block" id="qz-again">Another round</button><div style="height:8px"></div>' +
    '<button class="btn block secondary" id="qz-home">Done</button>';
  $("#qz-again").addEventListener("click", () => startQuiz(quizDom));
  $("#qz-home").addEventListener("click", () => { QZ = null; go("home"); });
  if (quizDom && first) confidenceSheet(quizDom);
  QZ = { set: [], i: 0, answers: QZ.answers, dom: quizDom, done: true };
}

function confidenceSheet(d) {
  const cur = S.conf[d] ? S.conf[d].v : 0;
  openSheet('<h2>Confidence check</h2><p class="sub">After that round, how confident do you feel in <b>' + esc(domName(d)) + "</b>?</p>" +
    '<div class="conf-row">' + [1, 2, 3, 4, 5].map(v =>
      '<button class="conf-btn' + (v === cur ? " sel" : "") + '" data-v="' + v + '">' + v + "</button>").join("") + "</div>" +
    '<p class="muted" style="margin-top:8px">1 = shaky · 5 = own it. This feeds your readiness rings.</p>');
  $("#sheet").querySelectorAll(".conf-btn").forEach(b => b.addEventListener("click", () => {
    S.conf[d] = { v: Number(b.dataset.v), t: Date.now() }; save(); closeSheet(); render();
  }));
}

/* ----- flashcards ----- */
function startFlash(dom) {
  let pool = dueCards(dom);
  if (!pool.length) {
    pool = (dom ? [dom] : DOMAINS).flatMap(d => domainCards(d).map(c => ({ card: c, dom: d, isNew: false })));
    pool = shuffle(pool).slice(0, 12);
    if (!pool.length) { openSheet("<h2>No cards yet</h2><p class='sub'>This deck is empty in the current build.</p>"); return; }
    FL = { pool, i: 0, dom, flipped: false, extra: true, done: 0 };
  } else {
    const rev = shuffle(pool.filter(p => !p.isNew)), nw = shuffle(pool.filter(p => p.isNew)).slice(0, 10);
    FL = { pool: rev.concat(nw).slice(0, 20), i: 0, dom, flipped: false, extra: false, done: 0 };
  }
  FL.dirs = flashDirs(FL.pool.length);
  go("flash");
}
/* Flashcards for a hand-picked set of words (drill misses, a practice scope). */
function startFlashTerms(list) {
  if (!list.length) return;
  FL = { pool: list.map(x => ({ card: termCard(x.t), dom: x.d, isNew: false })), i: 0, dom: null, flipped: false, extra: true, done: 0 };
  FL.dirs = flashDirs(FL.pool.length);
  go("flash");
}
/* Word cards can show the word first, the definition first, or a mix. Preference is per course. */
function cardDir() { return (S.settings && S.settings.cardDir) || "term"; }
function flashDirs(n) {
  const d = cardDir();
  return Array.from({ length: n }, () => d === "mix" ? (Math.random() < 0.5 ? "term" : "def") : d);
}

function renderFlash(m) {
  if (!FL) return go("study");
  if (FL.i >= FL.pool.length) {
    S.hist.push({ t: Date.now(), mode: "cards", dom: FL.dom, n: FL.pool.length, c: FL.done });
    save();
    m.innerHTML = '<div class="center" style="padding-top:40px"><div class="summary-hero">✓</div>' +
      '<p class="sub">' + plural(FL.pool.length, "card") + " reviewed. Spacing does the remembering for you, come back when the next batch is due.</p>" +
      '<button class="btn" id="fl-home">Done</button></div>';
    $("#fl-home").addEventListener("click", () => { FL = null; go("home"); });
    return;
  }
  const p = FL.pool[FL.i], st = itemStat(p.card.id);
  const t = p.card.term, dir = (FL.dirs && FL.dirs[FL.i]) || "term";
  let frontHtml, backHtml;
  if (t) {
    const extra = (t.ex ? '<div class="bk-ex"><b>Example:</b> ' + esc(t.ex) + "</div>" : "") + (t.hook ? '<div class="bk-hook">🧠 ' + esc(t.hook) + "</div>" : "");
    if (dir === "def") {
      frontHtml = '<span class="flash-topic chip">Definition → word</span><div class="fr fr-def">' + esc(t.def) + "</div>";
      backHtml = '<div class="fr">' + esc(t.term) + "</div>" + extra;
    } else {
      frontHtml = '<span class="flash-topic chip">Word → definition</span><div class="fr">' + esc(t.term) + "</div>";
      backHtml = '<div class="bk-word">' + esc(t.term) + '</div><div class="bk">' + esc(t.def) + "</div>" + extra;
    }
  } else {
    frontHtml = '<span class="flash-topic chip">' + esc(p.card.topic || "") + '</span><div class="fr">' + esc(p.card.front) + "</div>";
    backHtml = '<div class="bk">' + esc(p.card.back) + "</div>";
  }
  const seg = hasTerms() ? '<div class="seg" role="group" aria-label="Card direction">' + [["term", "Word first"], ["def", "Definition first"], ["mix", "Mix"]].map(o =>
    '<button class="seg-btn' + (cardDir() === o[0] ? " on" : "") + '" data-dir="' + o[0] + '">' + o[1] + "</button>").join("") + "</div>" : "";
  m.innerHTML =
    '<div class="row"><button class="btn small secondary" id="fl-exit">✕ End</button><div class="grow center"><span class="chip" style="--dc:' + domColor(p.dom) + '"><span class="dot"></span>' + esc(domShort(p.dom)) + "</span></div><span class=\"muted\">" + (FL.i + 1) + "/" + FL.pool.length + "</span></div>" +
    seg +
    '<div class="flash-scene"><div class="flash-card' + (t ? " tall" : "") + (FL.flipped ? " flipped" : "") + '" id="fl-card">' +
    '<div class="flash-face"><div class="face-in">' + frontHtml + '<div class="muted" style="margin-top:14px">tap to flip</div></div></div>' +
    '<div class="flash-face back"><div class="face-in">' + backHtml + "</div></div></div></div>" +
    (FL.flipped ?
      '<div class="rate-row">' +
      '<button class="btn rate-again" data-r="again">Again</button>' +
      '<button class="btn rate-hard" data-r="hard">Hard</button>' +
      '<button class="btn rate-good" data-r="good">Good</button>' +
      '<button class="btn rate-easy" data-r="easy">Easy</button></div>' +
      '<p class="muted center" style="margin-top:8px">Again resets it · Easy pushes it out ' + BOX_DAYS[Math.min(4, (st.box || 1) + 1)] + " days</p>"
      : '<p class="muted center">Say the answer out loud, then flip.</p>');
  $("#fl-exit").addEventListener("click", () => { FL = null; go("study"); });
  $("#fl-card").addEventListener("click", () => { FL.flipped = !FL.flipped; render(); });
  m.querySelectorAll("[data-dir]").forEach(b => b.addEventListener("click", () => {
    S.settings.cardDir = b.dataset.dir; save();
    const rest = flashDirs(FL.pool.length - FL.i);
    FL.dirs = FL.dirs.slice(0, FL.i).concat(rest);
    FL.flipped = false; render();
  }));
  m.querySelectorAll("[data-r]").forEach(b => b.addEventListener("click", () => {
    const st2 = itemStat(p.card.id);
    let box = st2.box || 1;
    if (b.dataset.r === "again") box = 1;
    else if (b.dataset.r === "good") box = Math.min(5, box + 1);
    else if (b.dataset.r === "easy") box = Math.min(5, box + 2);
    st2.box = box;
    st2.due = Date.now() + (b.dataset.r === "again" ? 600000 : b.dataset.r === "hard" ? DAY : BOX_DAYS[box - 1] * DAY || 600000);
    st2.last = Date.now();
    setItemStat(p.card.id, st2);
    bumpStreak(); save();
    FL.done++; FL.i++; FL.flipped = false; render();
  }));
}

/* ----- word practice (vocabulary courses) ----- */
const DRILL_MODES = [
  { id: "mix", title: "Mixed drill", desc: "10 words, asked every which way. New words start easy; words you know get harder. The best all-round practice." },
  { id: "t2d", title: "Word → definition", desc: "See the word, pick what it means." },
  { id: "d2t", title: "Definition → word", desc: "Read the meaning, pick the word." },
  { id: "ex", title: "Real-life examples", desc: "Read a situation, name the term it shows. This is how the AP exam asks." },
  { id: "type", title: "Type it", desc: "Read the meaning, type the word from memory. The hardest mode, and the best prep for a written test." },
  { id: "match", title: "Match-up", desc: "Pair 6 words with their meanings as fast as you can." },
  { id: "cards", title: "Flashcards", desc: "Flip through the words, word first or definition first. The app spaces them out for you." },
  { id: "apply", title: "Test-style questions", desc: "Scenario questions with an explanation after every answer." }
];
const KIND_LABEL = { t2d: "Word → definition", d2t: "Definition → word", ex: "Real-life example", type: "Type it" };

function scopeTerms(scope) {
  const all = allTermItems();
  if (!scope || scope === "all") return all;
  if (scope === "weak") return all.filter(x => { const st = itemStat(x.t.id); return st.n && (st.streak === 0 || st.c / st.n < 0.7); });
  if (scope === "new") return all.filter(x => !itemStat(x.t.id).n && !itemStat(x.t.id).box);
  return all.filter(x => x.d === scope);
}
function scopeLabel(scope) {
  if (!scope || scope === "all") return "All words";
  if (scope === "weak") return "Words I keep missing";
  if (scope === "new") return "Words I haven't tried";
  return domName(scope);
}
/* Weighted pick: untried words first, then misses, then anything going stale. Mastered words still show up, just less. */
function pickTerms(pool, n) {
  let p = pool.map(x => {
    const st = itemStat(x.t.id);
    let w;
    if (!st.n) w = 1.6;
    else w = 0.5 + 1.4 * (1 - st.c / st.n) + (daysSince(st.last) > 5 ? 0.5 : 0) + (st.streak === 0 ? 0.4 : 0);
    if (termLevel(x.t.id) === 3) w *= 0.4;
    return { x, w };
  });
  const out = [];
  while (out.length < n && p.length) {
    let sum = p.reduce((a, q) => a + q.w, 0), r = Math.random() * sum, idx = 0;
    for (let i = 0; i < p.length; i++) { r -= p[i].w; if (r <= 0) { idx = i; break; } }
    out.push(p[idx].x); p.splice(idx, 1);
  }
  return out;
}
/* Wrong choices: the word's known look-alikes first (near), then its own topic, then the rest of the course.
   In example mode, exAvoid words are never offered, because the example could honestly fit them too. */
function distractors(x, k, kind) {
  const avoid = new Set([x.t.id].concat(kind === "ex" ? (x.t.exAvoid || []) : []));
  const out = [];
  const add = y => { if (y && out.length < k && !avoid.has(y.t.id) && !out.some(o => o.t.id === y.t.id) && (kind !== "ex" || !(y.t.exAvoid || []).includes(x.t.id))) out.push(y); };
  shuffle(x.t.near || []).slice(0, 2).forEach(id => add(termItem(id)));
  shuffle(domainTerms(x.d).map(t => ({ t, d: x.d }))).forEach(add);
  shuffle(allTermItems()).forEach(add);
  return out;
}
function buildItem(x, kind) {
  const item = { t: x.t, d: x.d, kind };
  if (kind === "type") return item;
  const opts = shuffle([x].concat(distractors(x, 3, kind)));
  item.choices = opts.map(o => kind === "t2d" ? o.t.def : o.t.term);
  item.answer = opts.findIndex(o => o.t.id === x.t.id);
  return item;
}
function mixKind(x) {
  const st = itemStat(x.t.id), r = Math.random();
  if (!st.n) return r < 0.5 ? "t2d" : "d2t";
  if (r < 0.2) return "t2d";
  if (r < 0.45) return "d2t";
  if (r < 0.75 && x.t.ex) return "ex";
  return "type";
}

function renderPractice(m) {
  const all = allTermItems();
  const weak = scopeTerms("weak").length, nw = scopeTerms("new").length;
  const opts = [["all", "All words (" + all.length + ")"]]
    .concat(weak ? [["weak", "Words I keep missing (" + weak + ")"]] : [])
    .concat(nw && nw < all.length ? [["new", "Words I haven't tried (" + nw + ")"]] : [])
    .concat(DOMAINS.filter(d => domainTerms(d).length).map(d => [d, domName(d) + " (" + domainTerms(d).length + ")"]));
  const scope = opts.some(o => o[0] === view.scope) ? view.scope : "all";
  const list = scopeTerms(scope);
  m.innerHTML = '<div class="row"><button class="btn small secondary" id="pr-back">← Study</button></div>' +
    "<h1>Practice the words</h1>" +
    '<p class="sub">Pick which words, then pick how you want to be quizzed. Every word you miss goes back into your flashcards.</p>' +
    '<label class="field" for="pr-scope">Which words?</label><select id="pr-scope">' +
    opts.map(o => '<option value="' + esc(o[0]) + '"' + (o[0] === scope ? " selected" : "") + ">" + esc(o[1]) + "</option>").join("") + "</select>" +
    '<div class="card" style="margin-top:12px">' + masteryBar(list) + "</div>" +
    '<div class="mode-list">' + DRILL_MODES.map(md =>
      '<button class="mode-row" data-mode="' + md.id + '"><span class="grow"><b>' + esc(md.title) + '</b><span class="muted">' + esc(md.desc) + '</span></span><span class="mode-go">›</span></button>').join("") + "</div>";
  $("#pr-back").addEventListener("click", () => go("study"));
  $("#pr-scope").addEventListener("change", e => { view.scope = e.target.value; render(); });
  m.querySelectorAll("[data-mode]").forEach(b => b.addEventListener("click", () => {
    const md = b.dataset.mode;
    if (md === "cards") {
      if (scope === "all") return startFlash(null);
      if (DOMAINS.includes(scope)) return startFlash(scope);
      return startFlashTerms(shuffle(scopeTerms(scope)).slice(0, 20));
    }
    if (md === "apply") return startQuiz(DOMAINS.includes(scope) ? scope : null);
    startDrill(md, scope);
  }));
}

function startDrill(mode, scope) {
  if (mode === "match") return startMatch(scope);
  const pool = scopeTerms(scope).filter(x => mode !== "ex" || x.t.ex);
  if (!pool.length) { openSheet("<h2>No words here yet</h2><p class='sub'>Pick a different set of words.</p>"); return; }
  const items = pickTerms(pool, Math.min(10, pool.length)).map(x => buildItem(x, mode === "mix" ? mixKind(x) : mode));
  DR = { mode, scope, items, i: 0, answers: [], picked: null, typed: "", res: null, logged: false };
  go("drill");
}

function normAnswer(s) {
  return String(s || "").toLowerCase().replace(/\([^)]*\)/g, " ").replace(/[“”"'’`.,!?]/g, "").replace(/[-‐–—_/]/g, " ").replace(/\s+/g, " ").trim();
}
function singular(s) { return s.replace(/s\b/g, ""); }
/* Search keeps parenthetical text (unlike answer checking), so "fight or flight" finds the sympathetic system. */
function normSearch(s) { return String(s || "").toLowerCase().replace(/[“”"'’`.,!?()]/g, "").replace(/[-‐–—_/]/g, " ").replace(/\s+/g, " ").trim(); }
function lev(a, b) {
  const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i].concat(Array(n).fill(0)));
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
function acceptList(t) { return [t.term].concat(t.accept || []).map(normAnswer).filter(Boolean); }
/* Exact (or plural/singular) match is right. Another word's exact name is wrong, even if the spelling is close
   (so "REM sleep" never passes for "NREM sleep"). Otherwise a small typo is forgiven and the spelling is shown. */
function checkTyped(t, typed) {
  const a = normAnswer(typed);
  if (!a) return { ok: false, close: false };
  const mine = acceptList(t);
  if (mine.some(x => x === a || singular(x) === singular(a))) return { ok: true, close: false };
  const other = allTermItems().some(y => y.t.id !== t.id && acceptList(y.t).some(x => x === a || singular(x) === singular(a)));
  if (other) return { ok: false, close: false };
  const near = mine.some(x => { const tol = x.length >= 9 ? 2 : x.length >= 5 ? 1 : 0; return tol && lev(x, a) <= tol; });
  return { ok: near, close: near };
}

function drillFeedback(it, correct, extra) {
  const t = it.t;
  return '<div class="explain"><b>' + (correct ? "Correct." : "Not quite.") + "</b> " + (extra || "") +
    "<div class=\"fb-term\">" + esc(t.term) + "</div>" + esc(t.def) +
    (t.ex && it.kind !== "ex" ? '<div class="fb-ex"><b>Example:</b> ' + esc(t.ex) + "</div>" : "") +
    (t.hook ? '<div class="fb-hook">🧠 ' + esc(t.hook) + "</div>" : "") + "</div>";
}

function renderDrill(m) {
  if (!DR) return go("practice");
  if (DR.i >= DR.items.length) return renderDrillSummary(m);
  const it = DR.items[DR.i], t = it.t;
  const answered = it.kind === "type" ? DR.res != null : DR.picked != null;
  const head = '<div class="row"><button class="btn small secondary" id="dr-exit">✕ End</button><div class="grow center"><span class="chip" style="--dc:' + domColor(it.d) + '"><span class="dot"></span>' + esc(domShort(it.d)) + "</span></div><span class=\"muted\">" + (DR.i + 1) + "/" + DR.items.length + "</span></div>" +
    '<div class="q-progress">' + DR.items.map((_, i) => "<i class=\"" + (i < DR.i ? (DR.answers[i] && DR.answers[i].correct ? "done-right" : "done-wrong") : i === DR.i ? "current" : "") + "\"></i>").join("") + "</div>" +
    '<div class="kind-tag">' + esc(KIND_LABEL[it.kind]) + "</div>";
  let body = "";
  if (it.kind === "t2d") body = '<div class="term-big">' + esc(t.term) + '</div><p class="muted" style="margin:0 0 12px">Which definition fits this word?</p>';
  else if (it.kind === "d2t") body = '<p class="muted" style="margin:0 0 6px">Which word matches this definition?</p><div class="q-stem">' + esc(t.def) + "</div>";
  else if (it.kind === "ex") body = '<p class="muted" style="margin:0 0 6px">Which term does this example show?</p><div class="q-stem">' + esc(t.ex) + "</div>";
  else body = '<p class="muted" style="margin:0 0 6px">Type the word that matches this definition.</p><div class="q-stem">' + esc(t.def) + "</div>";

  if (it.kind === "type") {
    if (!answered) {
      body += '<input type="text" id="dr-type" class="type-in" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Type the word" value="' + esc(DR.typed) + '">' +
        '<div class="row" style="margin-top:10px"><button class="btn secondary grow" id="dr-idk">Show me</button><button class="btn grow" id="dr-check">Check</button></div>';
    } else {
      const r = DR.res;
      body += '<div class="typed ' + (r.ok ? "ok" : "bad") + '">' + (r.typed ? "You typed: <b>" + esc(r.typed) + "</b>" : "No answer") + "</div>" +
        drillFeedback(it, r.ok, r.close ? "Close enough, counted right. Check the spelling below." : "") +
        (!r.ok && r.typed ? '<button class="btn block secondary" id="dr-override">I had it right, count it</button><div style="height:8px"></div>' : "") +
        '<button class="btn block" id="dr-next">' + (DR.i === DR.items.length - 1 ? "See results" : "Next word") + "</button>";
    }
  } else {
    body += it.choices.map((c, i) => {
      let cls = "choice" + (it.kind === "t2d" ? " choice-def" : "");
      if (answered) { if (i === it.answer) cls += " correct"; else if (i === DR.picked) cls += " wrong"; else cls += " dim"; }
      return '<button class="' + cls + '" data-i="' + i + '"' + (answered ? " disabled" : "") + '><span class="key">' + "ABCD"[i] + "</span><span>" + esc(c) + "</span></button>";
    }).join("") +
    (answered ? drillFeedback(it, DR.picked === it.answer) + '<button class="btn block" id="dr-next">' + (DR.i === DR.items.length - 1 ? "See results" : "Next word") + "</button>" : "");
  }
  m.innerHTML = head + body;

  $("#dr-exit").addEventListener("click", () => { DR = null; go("practice"); });
  if (it.kind === "type" && !answered) {
    const inp = $("#dr-type");
    const check = () => {
      const typed = inp.value.trim();
      if (!typed) { inp.focus(); return; }
      const r = checkTyped(t, typed);
      DR.prev = Object.assign({}, itemStat(t.id));
      DR.res = { ok: r.ok, close: r.close, typed };
      DR.answers[DR.i] = { id: t.id, correct: r.ok };
      recordAnswer(t.id, r.ok); if (!r.ok) nudgeCard(t.id);
      render();
    };
    inp.addEventListener("input", () => { DR.typed = inp.value; });
    inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); check(); } });
    $("#dr-check").addEventListener("click", check);
    $("#dr-idk").addEventListener("click", () => {
      DR.res = { ok: false, close: false, typed: "" };
      DR.answers[DR.i] = { id: t.id, correct: false };
      recordAnswer(t.id, false); nudgeCard(t.id);
      render();
    });
    try { inp.focus({ preventScroll: true }); } catch (e) {}
    return;
  }
  if (!answered) m.querySelectorAll(".choice").forEach(b => b.addEventListener("click", () => {
    DR.picked = Number(b.dataset.i);
    const correct = DR.picked === it.answer;
    DR.answers[DR.i] = { id: t.id, correct };
    recordAnswer(t.id, correct); if (!correct) nudgeCard(t.id);
    render();
  }));
  const ov = $("#dr-override");
  if (ov) ov.addEventListener("click", () => {
    setItemStat(t.id, DR.prev); recordAnswer(t.id, true);
    DR.res.ok = true; DR.answers[DR.i].correct = true;
    render();
  });
  const nx = $("#dr-next");
  if (nx) nx.addEventListener("click", () => { DR.i++; DR.picked = null; DR.res = null; DR.typed = ""; render(); window.scrollTo(0, 0); });
}

function renderDrillSummary(m) {
  const n = DR.answers.length, c = DR.answers.filter(a => a && a.correct).length;
  if (!DR.logged) {
    S.hist.push({ t: Date.now(), mode: "drill", dom: DOMAINS.includes(DR.scope) ? DR.scope : null, n, c });
    if (S.hist.length > 400) S.hist = S.hist.slice(-400);
    save(); DR.logged = true;
  }
  const missed = DR.items.filter((it, i) => !(DR.answers[i] && DR.answers[i].correct));
  const md = DRILL_MODES.find(x => x.id === DR.mode);
  m.innerHTML = '<div class="center" style="padding-top:24px"><div class="summary-hero">' + c + "/" + n + "</div>" +
    '<p class="sub">' + esc(md ? md.title : "Drill") + " · " + esc(scopeLabel(DR.scope)) + "<br>" +
    (n && c / n >= 0.9 ? "You know these. Try a harder mode next." : n && c / n >= 0.7 ? "Strong. Lock in the misses below." : "Good reps. The misses below are already back in your flashcards.") + "</p></div>" +
    (missed.length ? "<h2>Words to look at again</h2><div class=\"card\">" + missed.map(it =>
      '<div class="miss-row"><b>' + esc(it.t.term) + "</b><div class=\"muted\">" + esc(it.t.short || it.t.def) + "</div></div>").join("") + "</div>" +
      '<button class="btn block" id="dr-misscards">Flashcards for these ' + plural(missed.length, "word") + "</button><div style=\"height:8px\"></div>" : "") +
    '<button class="btn block' + (missed.length ? " secondary" : "") + '" id="dr-again">Another round</button><div style="height:8px"></div>' +
    '<div class="row"><button class="btn secondary grow" id="dr-modes">Change mode</button><button class="btn secondary grow" id="dr-home">Done</button></div>';
  const mode = DR.mode, scope = DR.scope;
  const mc = $("#dr-misscards");
  if (mc) mc.addEventListener("click", () => { const list = missed.map(it => ({ t: it.t, d: it.d })); DR = null; startFlashTerms(list); });
  $("#dr-again").addEventListener("click", () => startDrill(mode, scope));
  $("#dr-modes").addEventListener("click", () => { DR = null; go("practice", { scope }); });
  $("#dr-home").addEventListener("click", () => { DR = null; go("home"); });
}

/* ----- match-up ----- */
let MTTIMER = null;
function startMatch(scope) {
  const pool = scopeTerms(scope);
  if (pool.length < 2) { openSheet("<h2>Not enough words</h2><p class='sub'>Match-up needs at least 2 words. Pick a bigger set.</p>"); return; }
  const picked = pickTerms(pool, Math.min(6, pool.length));
  const tiles = shuffle(picked.flatMap((x, k) => [{ k, side: "t", text: x.t.term }, { k, side: "m", text: x.t.short || x.t.def }]));
  MT = { scope, picked, tiles, sel: null, done: [], miss: {}, bad: null, start: Date.now(), end: 0, logged: false };
  go("match");
}
function renderMatch(m) {
  if (!MT) return go("practice");
  if (MT.end) return renderMatchSummary(m);
  m.innerHTML = '<div class="row"><button class="btn small secondary" id="mt-exit">✕ End</button><div class="grow center"><b>Match-up</b></div><span class="chip"><span id="mt-clock" class="ex-timer">' + fmtTime(Date.now() - MT.start) + "</span></span></div>" +
    '<p class="sub" style="margin-top:10px">Tap a word, then tap its meaning. ' + MT.done.length + " of " + MT.picked.length + " matched.</p>" +
    '<div class="match-grid">' + MT.tiles.map((tl, i) => {
      let cls = "mtile " + (tl.side === "t" ? "mt-term" : "mt-mean");
      if (MT.done.includes(tl.k)) cls += " done";
      else if (MT.bad && MT.bad.includes(i)) cls += " bad";
      else if (MT.sel === i) cls += " sel";
      return '<button class="' + cls + '" data-ti="' + i + '"' + (MT.done.includes(tl.k) ? " disabled" : "") + ">" + esc(tl.text) + "</button>";
    }).join("") + "</div>";
  $("#mt-exit").addEventListener("click", () => { MT = null; go("practice"); });
  m.querySelectorAll("[data-ti]").forEach(b => b.addEventListener("click", () => {
    const i = Number(b.dataset.ti), tl = MT.tiles[i];
    if (MT.done.includes(tl.k)) return;
    MT.bad = null;
    if (MT.sel == null || MT.sel === i) { MT.sel = MT.sel === i ? null : i; return render(); }
    const first = MT.tiles[MT.sel];
    if (first.side === tl.side) { MT.sel = i; return render(); }
    if (first.k === tl.k) {
      MT.done.push(tl.k); MT.sel = null;
      if (MT.done.length === MT.picked.length) finishMatch();
      return render();
    }
    MT.miss[first.k] = (MT.miss[first.k] || 0) + 1;
    MT.bad = [MT.sel, i]; MT.sel = null;
    render();
    setTimeout(() => { if (MT && MT.bad) { MT.bad = null; render(); } }, 650);
  }));
  if (MTTIMER) clearInterval(MTTIMER);
  MTTIMER = setInterval(() => {
    if (view.name !== "match" || !MT || MT.end) { clearInterval(MTTIMER); MTTIMER = null; return; }
    const el = document.getElementById("mt-clock"); if (el) el.textContent = fmtTime(Date.now() - MT.start);
  }, 1000);
}
function finishMatch() {
  MT.end = Date.now();
  let c = 0;
  MT.picked.forEach((x, k) => { const ok = !MT.miss[k]; if (ok) c++; recordAnswer(x.t.id, ok); if (!ok) nudgeCard(x.t.id); });
  const secs = Math.round((MT.end - MT.start) / 1000);
  MT.best = S.settings.matchBest || 0;
  MT.newBest = c === MT.picked.length && MT.picked.length === 6 && (!MT.best || secs < MT.best);
  if (MT.newBest) S.settings.matchBest = secs;
  S.hist.push({ t: Date.now(), mode: "match", dom: DOMAINS.includes(MT.scope) ? MT.scope : null, n: MT.picked.length, c });
  if (S.hist.length > 400) S.hist = S.hist.slice(-400);
  save();
}
function renderMatchSummary(m) {
  const misses = Object.values(MT.miss).reduce((a, b) => a + b, 0);
  m.innerHTML = '<div class="center" style="padding-top:24px"><div class="summary-hero">' + fmtTime(MT.end - MT.start) + "</div>" +
    '<p class="sub">' + (misses ? misses + (misses === 1 ? " wrong match" : " wrong matches") + ". Those words are back in your flashcards." : "No wrong matches.") +
    (MT.newBest ? " New best time!" : MT.best ? " Best clean board: " + fmtTime(MT.best * 1000) + "." : "") + "</p></div>" +
    '<div class="card">' + MT.picked.map((x, k) =>
      '<div class="miss-row"><b>' + (MT.miss[k] ? "✗ " : "✓ ") + esc(x.t.term) + '</b><div class="muted">' + esc(x.t.short) + "</div></div>").join("") + "</div>" +
    '<button class="btn block" id="mt-again">New board</button><div style="height:8px"></div>' +
    '<div class="row"><button class="btn secondary grow" id="mt-modes">Change mode</button><button class="btn secondary grow" id="mt-home">Done</button></div>';
  const scope = MT.scope;
  $("#mt-again").addEventListener("click", () => startMatch(scope));
  $("#mt-modes").addEventListener("click", () => { MT = null; go("practice", { scope }); });
  $("#mt-home").addEventListener("click", () => { MT = null; go("home"); });
}

/* ----- word list ----- */
function renderTerms(m) {
  const f = view.filter || "all";
  const doms = DOMAINS.filter(d => domainTerms(d).length && (f === "all" || f === d));
  const all = allTermItems();
  m.innerHTML = courseHeader("Word list", plural(all.length, "term") + " from your class list: meaning, a real-life example, and a memory trick for each.") +
    '<div class="card">' + masteryBar(all) + "</div>" +
    '<div class="row" style="gap:8px;margin-bottom:12px"><select id="tm-filter" class="grow"><option value="all">All topics</option>' +
    DOMAINS.filter(d => domainTerms(d).length).map(d => '<option value="' + d + '"' + (f === d ? " selected" : "") + ">" + esc(domName(d)) + "</option>").join("") + "</select></div>" +
    '<input type="search" id="tm-search" class="type-in" placeholder="Search words or meanings" autocomplete="off" autocapitalize="off" spellcheck="false">' +
    doms.map(d => '<div class="gloss-group" style="--dc:' + domColor(d) + '"><div class="row gloss-head"><span class="dot"></span><h2 class="grow">' + esc(domName(d)) + '</h2><button class="btn small secondary" data-words="' + d + '">Practice</button></div>' +
      domainTerms(d).map(t => {
        const lv = termLevel(t.id);
        return '<div class="card gloss" data-q="' + esc(normSearch(t.term + " " + t.def + " " + (t.accept || []).join(" "))) + '">' +
          '<div class="row"><span class="lvl" style="background:' + LEVELS[lv].color + '" title="' + LEVELS[lv].name + '"></span><b class="grow g-term">' + esc(t.term) + '</b><span class="muted">' + LEVELS[lv].name + "</span></div>" +
          '<div class="g-def">' + esc(t.def) + "</div>" +
          (t.ex ? '<div class="g-ex"><b>Example:</b> ' + esc(t.ex) + "</div>" : "") +
          (t.hook ? '<div class="g-hook">🧠 ' + esc(t.hook) + "</div>" : "") + "</div>";
      }).join("") + "</div>").join("") +
    '<p class="muted center" id="tm-none" style="display:none">No words match that search.</p>';
  wireHub(m);
  $("#tm-filter").addEventListener("change", e => { view.filter = e.target.value; render(); });
  m.querySelectorAll("[data-words]").forEach(b => b.addEventListener("click", () => go("practice", { scope: b.dataset.words })));
  $("#tm-search").addEventListener("input", e => {
    const q = normSearch(e.target.value);
    let shown = 0;
    m.querySelectorAll(".gloss-group").forEach(g => {
      let any = 0;
      g.querySelectorAll(".gloss").forEach(el => { const hit = !q || el.dataset.q.includes(q); el.style.display = hit ? "" : "none"; if (hit) any++; });
      g.style.display = any ? "" : "none"; shown += any;
    });
    $("#tm-none").style.display = shown ? "none" : "";
  });
}

/* ----- diagrams: list, study, label ----- */
function renderDiagramList(m) {
  m.innerHTML = courseHeader("Diagrams", "Every diagram works two ways: study it with the labels on, then prove it by labeling it yourself.") +
    (DIAGRAMS.length ? DIAGRAMS.map((v, i) => {
      const pr = S.labs[v.id];
      const hasLab = v.slots && v.slots.length;
      return '<div class="card vis-card" style="--dc:' + domColor(v.domain) + '">' +
        '<div class="row"><span class="dot"></span><div class="grow"><b>' + esc(v.title) + "</b><div class=\"muted\">" + esc(domName(v.domain)) +
        (pr ? " · best " + pr.score + "/" + pr.total : "") + "</div></div></div>" +
        '<div class="row" style="margin-top:10px"><button class="btn small grow" data-study="' + i + '">Study</button>' +
        (hasLab ? '<button class="btn small secondary grow" data-label="' + esc(v.id) + '">' + (pr ? "Label again" : "Label it") + "</button>" : "") + "</div></div>";
    }).join("") : '<div class="card">Diagrams are still loading into this build.</div>');
  wireHub(m);
  m.querySelectorAll("[data-study]").forEach(b => b.addEventListener("click", () => go("diagram", { vi: Number(b.dataset.study) })));
  m.querySelectorAll("[data-label]").forEach(b => b.addEventListener("click", () => startLabel(b.dataset.label)));
}

function fillSlots(m, mode, LBref) {
  m.querySelectorAll(".lslot").forEach(g => {
    const sid = g.getAttribute("data-slot");
    const v = (mode === "study") ? null : LBref.d.slots.find(s => s.id === sid);
    const t = g.querySelector("text");
    if (mode === "study") {
      const diag = DIAGRAMS[view.vi];
      const slot = diag.slots.find(s => s.id === sid);
      if (slot && t) t.textContent = slot.label;
      g.classList.add("study");
      return;
    }
    const placed = LBref.placed[sid];
    if (t) t.textContent = placed || "?";
    g.classList.toggle("filled", !!placed);
    g.classList.toggle("sel", !LBref.checked && LBref.sel === sid);
    if (LBref.checked && v) {
      g.classList.remove("sel", "filled");
      g.classList.add(placed === v.label ? "right" : "wrong");
      if (placed !== v.label && t) t.textContent = v.label;
    }
  });
  m.querySelectorAll(".lslot").forEach(fitSlotText);
}
/* A long chip dropped into a narrow slot squeezes to fit its box instead of spilling over the drawing. */
function fitSlotText(g) {
  const t = g.querySelector("text"), r = g.querySelector("rect");
  if (!t || !r) return;
  t.removeAttribute("textLength"); t.removeAttribute("lengthAdjust");
  try {
    const max = Number(r.getAttribute("width")) - 10;
    if (t.getComputedTextLength() > max) { t.setAttribute("textLength", max); t.setAttribute("lengthAdjust", "spacingAndGlyphs"); }
  } catch (e) { /* not rendered yet */ }
}

function renderDiagramStudy(m) {
  const v = DIAGRAMS[view.vi];
  if (!v) return go("diagrams");
  m.innerHTML = '<div class="row"><button class="btn small secondary" id="vs-back">← Diagrams</button></div>' +
    "<h1>" + esc(v.title) + "</h1>" +
    '<div class="card vis-detail lab-wrap" style="--dc:' + domColor(v.domain) + '">' + v.svg + '<div class="vis-caption">' + v.caption + "</div>" +
    (v.mnemonic ? '<div class="mnemonic">🧠 ' + v.mnemonic + "</div>" : "") + "</div>" +
    (v.slots && v.slots.length ? '<button class="btn block" id="vs-label">◫ Now label it myself</button><div style="height:8px"></div>' : "") +
    '<button class="btn block secondary" data-quiz="' + v.domain + '">Quiz this topic</button>';
  fillSlots(m, "study", null);
  $("#vs-back").addEventListener("click", () => go("diagrams"));
  const vl = $("#vs-label"); if (vl) vl.addEventListener("click", () => startLabel(v.id));
  m.querySelector("[data-quiz]").addEventListener("click", () => startQuiz(v.domain));
}

function startLabel(id) {
  const d = DIAGRAMS.find(x => x.id === id);
  if (!d || !d.slots || !d.slots.length) return go("diagrams");
  const bank = shuffle(d.slots.map(s => s.label).concat(d.distractors || []));
  LB = { d, bank, placed: {}, sel: d.slots[0].id, checked: false };
  go("label");
}

function nextEmptySlot() {
  const s = LB.d.slots.find(s => !LB.placed[s.id]);
  return s ? s.id : null;
}

function renderLabel(m) {
  if (!LB) return go("diagrams");
  const d = LB.d;
  const placedN = Object.keys(LB.placed).length, total = d.slots.length;
  const usedLabels = Object.values(LB.placed);
  let score = 0;
  if (LB.checked) d.slots.forEach(s => { if (LB.placed[s.id] === s.label) score++; });

  m.innerHTML =
    '<div class="row"><button class="btn small secondary" id="lb-exit">✕ End</button>' +
    '<div class="grow center"><span class="chip" style="--dc:' + domColor(d.domain) + '"><span class="dot"></span>' + esc(d.title) + "</span></div>" +
    '<span class="muted">' + placedN + "/" + total + "</span></div>" +
    (LB.checked ?
      '<div class="center" style="padding:12px 0 4px"><div class="summary-hero">' + score + "/" + total + "</div>" +
      '<p class="sub">' + (score === total ? "Perfect. You own this diagram." : score / total >= 0.7 ? "Close. The red boxes show the right answers, study them and run it again." : "No stress. The red boxes show the right answers. Study the picture, then try again.") + "</p></div>"
      : '<p class="sub" style="margin-top:10px">Tap a box on the diagram, then tap the label that belongs there. Tap a filled box to clear it.</p>') +
    '<div class="card lab-wrap" style="--dc:' + domColor(d.domain) + '">' + d.svg + "</div>" +
    (LB.checked ?
      '<div class="explain">' + d.caption + "</div>" +
      '<button class="btn block" id="lb-study">Study the labeled version</button><div style="height:8px"></div>' +
      '<div class="row"><button class="btn secondary grow" id="lb-again">Try again</button><button class="btn secondary grow" id="lb-done">Done</button></div>'
      :
      '<div class="bank">' + LB.bank.map((l, i) =>
        '<button class="bank-chip' + (usedLabels.includes(l) ? " used" : "") + '" data-l="' + esc(l) + '">' + esc(l) + "</button>").join("") + "</div>" +
      '<button class="btn block" id="lb-check"' + (placedN < total ? " disabled" : "") + '>Check my answers</button>');

  fillSlots(m, "label", LB);

  $("#lb-exit").addEventListener("click", () => { LB = null; go("diagrams"); });
  if (LB.checked) {
    $("#lb-study").addEventListener("click", () => { const vi = DIAGRAMS.indexOf(d); LB = null; go("diagram", { vi }); });
    $("#lb-again").addEventListener("click", () => startLabel(d.id));
    $("#lb-done").addEventListener("click", () => { LB = null; go("diagrams"); });
    return;
  }
  m.querySelectorAll(".lslot").forEach(g => g.addEventListener("click", () => {
    const sid = g.getAttribute("data-slot");
    if (LB.placed[sid]) { delete LB.placed[sid]; LB.sel = sid; }
    else LB.sel = sid;
    render();
  }));
  m.querySelectorAll(".bank-chip").forEach(b => b.addEventListener("click", () => {
    const label = b.dataset.l;
    if (usedLabels.includes(label)) return;
    if (!LB.sel) LB.sel = nextEmptySlot();
    if (!LB.sel) return;
    LB.placed[LB.sel] = label;
    LB.sel = nextEmptySlot();
    render();
  }));
  const ck = $("#lb-check");
  if (ck) ck.addEventListener("click", () => {
    if (Object.keys(LB.placed).length < total) return;
    LB.checked = true;
    let sc = 0;
    d.slots.forEach(s => {
      const correct = LB.placed[s.id] === s.label;
      if (correct) sc++;
      recordAnswer("lab:" + d.id + ":" + s.id, correct);
    });
    const prev = S.labs[d.id];
    S.labs[d.id] = { t: Date.now(), score: Math.max(sc, prev ? prev.score : 0), total, lastScore: sc };
    S.hist.push({ t: Date.now(), mode: "label", dom: d.domain, n: total, c: sc });
    if (S.hist.length > 400) S.hist = S.hist.slice(-400);
    save(); render();
  });
}

/* ----- progress ----- */
function renderProgress(m) {
  const needs = rankedNeeds();
  const overall = Math.round(needs.reduce((a, s) => a + s.readiness, 0) / needs.length);
  const weak = topicBreakdown(3).map(t => ({ ...t, acc: t.c / t.n })).filter(t => t.acc < 0.75).sort((a, b) => a.acc - b.acc).slice(0, 8);
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d0 = new Date(Date.now() - i * DAY); const ds = todayStr(d0);
    const n = S.hist.filter(h => todayStr(new Date(h.t)) === ds).reduce((a, h) => a + h.n, 0);
    days.push({ ds, n });
  }
  const maxN = Math.max(1, ...days.map(x => x.n));
  const answered = Object.values(S.items).reduce((a, s) => a + (s.n || 0), 0);
  const labDone = DIAGRAMS.filter(v => S.labs[v.id]).length;
  const labTotal = DIAGRAMS.filter(v => v.slots && v.slots.length).length;

  m.innerHTML = courseHeader("Progress", plural(answered, "question") + " answered so far in " + COURSE.name + ".") +
    '<div class="card row"><span class="ring-wrap" style="width:84px;height:84px">' + ring(overall / 100, "var(--accent)", 84, 9) +
    '<span class="ring-num" style="font-size:20px">' + overall + '</span></span><div class="grow"><b>Overall readiness</b>' +
    '<div class="muted">Weighted blend across all ' + DOMAINS.length + " topics. Aim to get every ring past 75 before test day.</div></div></div>" +

    (hasTerms() ? (function () {
      const all = allTermItems();
      const tough = all.map(x => ({ x, st: itemStat(x.t.id) })).filter(o => o.st.n >= 2 && o.st.c / o.st.n < 0.75)
        .sort((a, b) => a.st.c / a.st.n - b.st.c / b.st.n).slice(0, 8);
      return "<h2>Words mastered</h2><div class=\"card\">" + masteryBar(all) + '<div style="height:6px"></div>' +
        DOMAINS.filter(d => domainTerms(d).length).map(d => {
          const list = domainTerms(d).map(t => ({ t, d })), c = levelCounts(list);
          return '<div class="topic-pill" style="--dc:' + domColor(d) + '"><span class="row"><span class="dot"></span>' + esc(domShort(d)) + "</span><b>" + c[3] + "/" + list.length + "</b></div>";
        }).join("") +
        '<p class="muted" style="margin:8px 0 0">Mastered = right 3 times in a row in the drills, or pushed far out in the flashcard schedule.</p></div>' +
        (tough.length ? "<h2>Toughest words</h2><div class=\"card\">" + tough.map(o =>
          '<div class="topic-pill" style="--dc:' + domColor(o.x.d) + '"><span class="row"><span class="dot"></span>' + esc(o.x.t.term) + "</span><b>" + pct(o.st.c / o.st.n) + "%</b></div>").join("") +
          '<button class="btn block secondary" id="pg-weak" style="margin-top:10px">Drill these words</button></div>' : "");
    })() : "") +

    "<h2>Topics, weakest first</h2><div class=\"card\">" +
    needs.map(s => '<div class="bar-row" style="--dc:' + domColor(s.d) + '"><div class="bar-head"><span>' + esc(domName(s.d)) + "</span><span>" +
      (s.attempts ? pct(s.acc) + "% acc" : "no data") + (s.conf ? " · conf " + s.conf + "/5" : "") + "</span></div>" +
      '<div class="bar-track"><div class="bar-fill" style="width:' + Math.max(2, s.attempts ? pct(s.acc) : 0) + '%"></div></div>' +
      '<div class="bar-cov"><div style="width:' + pct(s.cov) + '%"></div></div></div>').join("") +
    '<p class="muted" style="margin:8px 0 0">Thick bar = accuracy in the topic color. Thin gray bar = how much of the bank you’ve seen.</p></div>' +

    (labTotal ? "<h2>Diagrams labeled</h2><div class=\"card\">" +
    '<div class="topic-pill"><span>Labeled at least once</span><b>' + labDone + "/" + labTotal + "</b></div>" +
    DIAGRAMS.filter(v => S.labs[v.id]).map(v =>
      '<div class="topic-pill" style="--dc:' + domColor(v.domain) + '"><span class="row"><span class="dot"></span>' + esc(v.title) + '</span><b>' + S.labs[v.id].score + "/" + S.labs[v.id].total + "</b></div>").join("") + "</div>" : "") +

    (weak.length ? "<h2>Weak spots to attack</h2><div class=\"card\">" + weak.map(t =>
      '<div class="topic-pill" style="--dc:' + domColor(t.dom) + '"><span class="row"><span class="dot"></span>' + esc(t.topic) + '</span><b>' + pct(t.acc) + "%</b></div>").join("") + "</div>" : "") +

    "<h2>Last 14 days</h2><div class=\"card\"><div class=\"spark\">" +
    days.map(x => '<i style="height:' + Math.max(4, (x.n / maxN) * 100) + '%" class="' + (x.n ? "" : "zero") + '" title="' + x.ds + ": " + x.n + '"></i>').join("") +
    '</div><p class="muted" style="margin:8px 0 0">Questions + cards per day. Small daily beats big cramming, spacing is the science.</p></div>' +

    (function(){
      const exams = S.hist.filter(h => h.mode === "exam").slice(-5).reverse();
      if (!exams.length) return "";
      return "<h2>Practice tests</h2><div class=\"card\">" + exams.map(e =>
        '<div class="topic-pill"><span>' + todayStr(new Date(e.t)) + " · " + esc(COURSE.short) + "</span><b>" + e.c + "/" + e.n + " · " + pct(e.c / e.n) + "%</b></div>").join("") + "</div>";
    })() +

    "<h2>Confidence self-ratings</h2><div class=\"card\">" +
    DOMAINS.map(d => { const cv = S.conf[d] ? S.conf[d].v : 0;
      return '<div class="bar-head" style="margin:8px 0 4px"><span>' + esc(domShort(d)) + '</span></div><div class="conf-row" data-confdom="' + d + '">' +
        [1, 2, 3, 4, 5].map(v => '<button class="conf-btn' + (v === cv ? " sel" : "") + '" data-v="' + v + '">' + v + "</button>").join("") + "</div>"; }).join("") + "</div>" +

    '<h2>Backup & settings</h2><div class="card">' +
    '<button class="btn block secondary" id="pg-settings">Test dates & backup</button></div>';

  wireHub(m);
  m.querySelectorAll("[data-confdom]").forEach(row => row.querySelectorAll(".conf-btn").forEach(b =>
    b.addEventListener("click", () => { S.conf[row.dataset.confdom] = { v: Number(b.dataset.v), t: Date.now() }; save(); render(); })));
  $("#pg-settings").addEventListener("click", settingsSheet);
  const pw = $("#pg-weak"); if (pw) pw.addEventListener("click", () => startDrill("mix", "weak"));
}

/* ----- settings sheet ----- */
function settingsSheet() {
  openSheet('<h2>' + esc(COURSE.short) + ' settings</h2>' +
    (COURSE.dates || []).map(d => '<label class="field">' + esc(d.field) + '</label><input type="date" data-datekey="' + esc(d.key) + '" value="' + esc(S.settings[d.key] || "") + '">').join("") +
    '<label class="field">Backup your progress</label>' +
    '<p class="muted" style="margin:0 0 8px">Progress for this course lives on this device. To move it (say, phone to laptop), copy the code here and paste it on the other device.</p>' +
    '<div class="row"><button class="btn small secondary grow" id="st-export">Copy backup code</button>' +
    '<button class="btn small secondary grow" id="st-import">Paste to restore</button></div>' +
    '<textarea id="st-blob" placeholder="Backup code appears / gets pasted here" style="margin-top:8px"></textarea>' +
    '<div style="height:14px"></div>' +
    '<button class="btn block secondary" id="st-reset" style="color:var(--bad)">Reset all ' + esc(COURSE.short) + ' progress</button>' +
    '<div style="height:8px"></div><button class="btn block" id="st-done">Done</button>');
  $("#sheet").querySelectorAll("[data-datekey]").forEach(inp => inp.addEventListener("change", e => { S.settings[inp.dataset.datekey] = e.target.value; save(); }));
  $("#st-export").addEventListener("click", () => {
    const blob = btoa(unescape(encodeURIComponent(JSON.stringify(S))));
    $("#st-blob").value = blob;
    $("#st-blob").select();
    try { navigator.clipboard.writeText(blob); $("#st-export").textContent = "Copied ✓"; } catch (e) { document.execCommand("copy"); }
  });
  $("#st-import").addEventListener("click", () => {
    const blob = $("#st-blob").value.trim();
    if (!blob) { $("#st-blob").placeholder = "Paste your backup code here first, then tap restore again."; return; }
    try {
      const parsed = JSON.parse(decodeURIComponent(escape(atob(blob))));
      if (!parsed.items) throw new Error("bad");
      S = migrate(parsed); save(); closeSheet(); render();
    } catch (e) { $("#st-blob").value = ""; $("#st-blob").placeholder = "That code didn’t parse. Copy it again from the other device."; }
  });
  $("#st-reset").addEventListener("click", () => {
    if (confirm("Erase all " + COURSE.short + " progress on this device? This cannot be undone.")) { S = fresh(); save(); closeSheet(); render(); }
  });
  $("#st-done").addEventListener("click", () => { closeSheet(); render(); });
}

/* ----- timed practice test ----- */
let EXTIMER = null;
function fmtTime(ms) {
  const t = Math.max(0, Math.ceil(ms / 1000));
  return Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0");
}
function simQ(id) {
  /* "g:N" = a definition question generated from the word list when the test started, frozen in S.sim.gen. */
  if (typeof id === "string" && id.indexOf("g:") === 0) {
    const g = S.sim && S.sim.gen && S.sim.gen[Number(id.slice(2))];
    return g ? { q: g, d: g.d } : null;
  }
  for (const d of DOMAINS) { const q = domainQuiz(d).find(x => x.id === id); if (q) return { q, d }; }
  return null;
}
function genTermQuestions(n) {
  const out = [];
  shuffle(allTermItems()).slice(0, n).forEach((x, j) => {
    const kind = j % 3 === 0 ? "t2d" : j % 3 === 2 && x.t.ex ? "ex" : "d2t";
    const it = buildItem(x, kind);
    const q = kind === "t2d" ? "Which is the best definition of “" + x.t.term + "”?" :
      kind === "ex" ? "Which term does this example show? " + x.t.ex :
      "Which term matches this definition? " + x.t.def;
    out.push({ tid: x.t.id, d: x.d, kind, q, choices: it.choices, answer: it.answer, explain: x.t.term + ": " + x.t.def });
  });
  return out;
}
function startSim() {
  if (S.sim && !S.sim.submitted) { go("exam"); return; }
  openSheet('<h2>' + esc(COURSE.short) + ' practice test</h2>' +
    '<p class="sub">' + simCount() + " questions, " + SIM_SPEC.minutes + " minutes, mixed across " + DOMAINS.filter(d => (SIM_SPEC.mix[d] ?? 4) > 0).length + " topics. No feedback until you submit, just like the real thing.</p>" +
    '<button class="btn block" id="sim-go">Start the clock</button>');
  $("#sim-go").addEventListener("click", () => { closeSheet(); beginSim(); });
}
function beginSim() {
  const qids = [];
  DOMAINS.forEach(d => shuffle(domainQuiz(d)).slice(0, SIM_SPEC.mix[d] ?? 4).forEach(q => qids.push(q.id)));
  const gen = SIM_SPEC.terms ? genTermQuestions(SIM_SPEC.terms) : [];
  gen.forEach((_, j) => qids.push("g:" + j));
  S.sim = { qids: shuffle(qids), gen, endAt: Date.now() + SIM_SPEC.minutes * 60000, answers: {}, flags: [], i: 0, submitted: false, score: 0 };
  save();
  go("exam");
}
function submitSim(auto) {
  const sim = S.sim;
  if (!sim || sim.submitted) return;
  let score = 0;
  sim.qids.forEach((id, i) => {
    const item = simQ(id); if (!item) return;
    const picked = sim.answers[i];
    if (picked != null) {
      const correct = Number(picked) === item.q.answer;
      if (correct) score++;
      recordAnswer(item.q.tid || id, correct);
      if (item.q.tid && !correct) nudgeCard(item.q.tid);
    }
  });
  sim.submitted = true; sim.score = score; sim.auto = !!auto;
  S.hist.push({ t: Date.now(), mode: "exam", kind: COURSE.id, dom: null, n: sim.qids.length, c: score });
  if (S.hist.length > 400) S.hist = S.hist.slice(-400);
  save();
  view = { name: "exam" };
  render(); window.scrollTo(0, 0);
}
function renderExam(m) {
  const sim = S.sim;
  if (!sim) return go("study");
  if (!sim.submitted && Date.now() >= sim.endAt) return submitSim(true);
  if (sim.submitted) return view.review != null ? renderExamReview(m) : renderExamResults(m);

  const i = sim.i, item = simQ(sim.qids[i]);
  if (!item) { S.sim = null; save(); return go("study"); }
  const picked = sim.answers[i];
  const flagged = sim.flags.includes(i);
  const answeredCount = Object.keys(sim.answers).length;
  m.innerHTML =
    '<div class="row"><button class="btn small secondary" id="ex-exit">✕</button>' +
    '<div class="grow center"><span class="chip">' + esc(COURSE.short) + ' · <span id="ex-timer" class="ex-timer">' + fmtTime(sim.endAt - Date.now()) + "</span></span></div>" +
    '<button class="btn small secondary' + (flagged ? " flag-on" : "") + '" id="ex-flag">⚑' + (flagged ? " Flagged" : " Flag") + "</button></div>" +
    '<div class="palette">' + sim.qids.map((_, pi) => {
      let cls = "pal";
      if (sim.answers[pi] != null) cls += " answered";
      if (sim.flags.includes(pi)) cls += " flagged";
      if (pi === i) cls += " current";
      return '<button class="' + cls + '" data-pi="' + pi + '">' + (pi + 1) + "</button>";
    }).join("") + "</div>" +
    '<div class="muted" style="margin-bottom:6px">Question ' + (i + 1) + " of " + sim.qids.length + " · " + answeredCount + " answered</div>" +
    '<div class="q-stem">' + esc(item.q.q) + "</div>" +
    item.q.choices.map((c, ci) =>
      '<button class="choice' + (Number(picked) === ci ? " sel" : "") + '" data-i="' + ci + '"><span class="key">' + "ABCD"[ci] + "</span><span>" + esc(c) + "</span></button>").join("") +
    '<div class="row" style="margin-top:12px"><button class="btn secondary grow" id="ex-prev"' + (i === 0 ? " disabled" : "") + '>← Prev</button>' +
    '<button class="btn grow" id="ex-next"' + (i === sim.qids.length - 1 ? " disabled" : "") + '>Next →</button></div>' +
    '<div style="height:8px"></div><button class="btn block secondary" id="ex-submit">Submit test</button>' +
    '<p class="muted center" style="margin-top:6px">No feedback until you submit, just like the real thing.</p>';

  $("#ex-exit").addEventListener("click", () => {
    if (confirm("Leave the practice test? The clock keeps running and you can resume from Home.")) go("home");
  });
  $("#ex-flag").addEventListener("click", () => {
    const ix = sim.flags.indexOf(i);
    if (ix >= 0) sim.flags.splice(ix, 1); else sim.flags.push(i);
    save(); render();
  });
  m.querySelectorAll(".pal").forEach(b => b.addEventListener("click", () => { sim.i = Number(b.dataset.pi); save(); render(); }));
  m.querySelectorAll(".choice").forEach(b => b.addEventListener("click", () => {
    sim.answers[i] = Number(b.dataset.i);
    if (i < sim.qids.length - 1) sim.i = i + 1;
    save(); render();
  }));
  $("#ex-prev").addEventListener("click", () => { sim.i = Math.max(0, i - 1); save(); render(); });
  $("#ex-next").addEventListener("click", () => { sim.i = Math.min(sim.qids.length - 1, i + 1); save(); render(); });
  $("#ex-submit").addEventListener("click", () => {
    const blank = sim.qids.length - Object.keys(sim.answers).length;
    if (blank > 0 && !confirm(blank + " unanswered question" + (blank === 1 ? "" : "s") + " will count as wrong. Submit anyway?")) return;
    submitSim(false);
  });

  if (EXTIMER) clearInterval(EXTIMER);
  EXTIMER = setInterval(() => {
    if (view.name !== "exam" || !S || !S.sim || S.sim.submitted) { clearInterval(EXTIMER); EXTIMER = null; return; }
    const rem = S.sim.endAt - Date.now();
    if (rem <= 0) { clearInterval(EXTIMER); EXTIMER = null; submitSim(true); return; }
    const el = document.getElementById("ex-timer");
    if (el) { el.textContent = fmtTime(rem); if (rem < 300000) el.classList.add("ex-warn"); }
  }, 1000);
}
function renderExamResults(m) {
  const sim = S.sim;
  const n = sim.qids.length, score = sim.score, p = score / n;
  const byDom = {};
  sim.qids.forEach((id, i) => {
    const item = simQ(id); if (!item) return;
    byDom[item.d] = byDom[item.d] || { n: 0, c: 0 };
    byDom[item.d].n++;
    if (Number(sim.answers[i]) === item.q.answer) byDom[item.d].c++;
  });
  m.innerHTML = '<div class="center" style="padding-top:24px"><div class="summary-hero">' + score + "/" + n + "</div>" +
    '<p class="sub">' + esc(COURSE.short) + " practice test · " + pct(p) + "%" + (sim.auto ? " · time expired" : "") + " · " +
    (p >= 0.85 ? "That’s an A. Keep every topic warm and you’re set." : p >= 0.7 ? "Right in the fight. Review the misses below and retake in a couple of days." : "This is exactly what practice tests are for. Every miss becomes a flashcard rep.") + "</p></div>" +
    '<div class="card">' + DOMAINS.filter(d => byDom[d]).map(d =>
      '<div class="topic-pill" style="--dc:' + domColor(d) + '"><span class="row"><span class="dot"></span>' + esc(domShort(d)) + "</span><b>" + byDom[d].c + "/" + byDom[d].n + "</b></div>").join("") + "</div>" +
    '<button class="btn block" id="ex-review">Review all answers</button><div style="height:8px"></div>' +
    '<button class="btn block secondary" id="ex-finish">Finish</button>';
  $("#ex-review").addEventListener("click", () => { view.review = 0; render(); window.scrollTo(0, 0); });
  $("#ex-finish").addEventListener("click", () => { S.sim = null; save(); go("home"); });
}
function renderExamReview(m) {
  const sim = S.sim;
  const i = view.review, item = simQ(sim.qids[i]);
  const picked = sim.answers[i] != null ? Number(sim.answers[i]) : null;
  m.innerHTML =
    '<div class="row"><button class="btn small secondary" id="ex-back">← Results</button>' +
    '<div class="grow center"><span class="chip" style="--dc:' + domColor(item.d) + '"><span class="dot"></span>' + esc(domShort(item.d)) + "</span></div>" +
    '<span class="muted">' + (i + 1) + "/" + sim.qids.length + "</span></div>" +
    '<div class="palette">' + sim.qids.map((id, pi) => {
      const it = simQ(id);
      const ok = Number(sim.answers[pi]) === it.q.answer;
      return '<button class="pal ' + (ok ? "right" : "wrong") + (pi === i ? " current" : "") + '" data-pi="' + pi + '">' + (pi + 1) + "</button>";
    }).join("") + "</div>" +
    '<div class="q-stem">' + esc(item.q.q) + "</div>" +
    item.q.choices.map((c, ci) => {
      let cls = "choice";
      if (ci === item.q.answer) cls += " correct";
      else if (ci === picked) cls += " wrong";
      else cls += " dim";
      return '<button class="' + cls + '" disabled><span class="key">' + "ABCD"[ci] + "</span><span>" + esc(c) + "</span></button>";
    }).join("") +
    (picked == null ? '<p class="muted">You left this one blank.</p>' : "") +
    '<div class="explain">' + esc(item.q.explain) + "</div>" +
    '<div class="row"><button class="btn secondary grow" id="ex-rprev"' + (i === 0 ? " disabled" : "") + '>← Prev</button>' +
    '<button class="btn grow" id="ex-rnext"' + (i === sim.qids.length - 1 ? " disabled" : "") + '>Next →</button></div>';
  $("#ex-back").addEventListener("click", () => { delete view.review; render(); window.scrollTo(0, 0); });
  m.querySelectorAll(".pal").forEach(b => b.addEventListener("click", () => { view.review = Number(b.dataset.pi); render(); }));
  $("#ex-rprev").addEventListener("click", () => { view.review = Math.max(0, i - 1); render(); window.scrollTo(0, 0); });
  $("#ex-rnext").addEventListener("click", () => { view.review = Math.min(sim.qids.length - 1, i + 1); render(); window.scrollTo(0, 0); });
}

/* ---------- boot ---------- */
/* Always land on the hub. A single-course build skips it. A course with a live practice test resumes straight into it. */
if (COURSES.length === 1) { loadCourse(COURSES[0].id); go(S.sim && !S.sim.submitted ? "exam" : "home"); }
else render();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(function () {});
}
})();

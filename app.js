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
let QZ = null, FL = null, LB = null;

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
  QZ = FL = LB = null;
  try { localStorage.setItem(COURSE_KEY, id); } catch (e) {}
  document.documentElement.setAttribute("data-course", id);
  return true;
}
function leaveCourse() {
  COURSE = null; DOMAINS = []; DIAGRAMS = []; UNIT_NAMES = {}; SIM_SPEC = null; WORKED = []; KEY = ""; S = null;
  QZ = FL = LB = null;
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
function simCount() { return SIM_SPEC ? Object.values(SIM_SPEC.mix).reduce((a, b) => a + b, 0) : 0; }
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
function domainCards(d) { return (DOMAINS_ALL[d] && DOMAINS_ALL[d].cards) || []; }

function domStats(d) {
  const qs = domainQuiz(d), cs = domainCards(d);
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
  const top = ["quiz", "flash", "worked"].includes(view.name) ? "study" :
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
    const due = dueCards(null).length;
    const answered = Object.values(S.items).reduce((a, s) => a + (s.n || 0), 0);
    const lastTs = Math.max(0, ...needs.map(s => s.lastTs || 0));
    const overallShown = (answered || lastTs) ? overall : 0;
    const dates = (c.dates || []).map(d => ({ label: d.label, ds: S.settings[d.key] })).filter(d => d.ds)
      .map(d => ({ label: d.label, diff: Math.ceil((new Date(d.ds + "T12:00:00") - Date.now()) / DAY) })).filter(d => d.diff >= 0);
    return { overall: overallShown, qn, cn, dn: DIAGRAMS.length, wn: WORKED.length, due, answered, lastTs, dates, resumeSim: !!(S.sim && !S.sim.submitted) };
  });
}

function renderHub(m) {
  let last = "";
  try { last = localStorage.getItem(COURSE_KEY) || ""; } catch (e) {}
  m.innerHTML = '<h1>Terra</h1><p class="sub">Your study hub. Pick a course.</p>' +
    COURSES.map(c => {
      const s = courseSnapshot(c);
      const started = s.answered > 0 || s.lastTs > 0;
      const meta = plural(s.qn, "question") + " · " + plural(s.cn, "flashcard") + (s.dn ? " · " + plural(s.dn, "diagram") : "") + (s.wn ? " · " + plural(s.wn, "worked example") : "");
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

  m.innerHTML =
    courseHeader(COURSE.name, COURSE.tagline) +
    (counts.length ? '<div class="exam-count">' + counts.map(c =>
      '<div class="exam-pill"><div class="n">' + c.diff + '</div><div class="l">days to ' + esc(c.label) + "</div></div>").join("") + "</div>"
      : '<div class="card row"><div class="grow">Set your test date to see a countdown.</div><button class="btn small" id="set-dates">Set dates</button></div>') +
    '<div class="card row"><div class="grow"><b>' + (streakN ? "🔥 " + plural(streakN, "day") + " streak" : "Start today’s streak") + "</b>" +
    '<div class="muted">' + (due ? plural(due, "card") + " due for review" : "All caught up on flashcards") + "</div></div>" +
    '<button class="btn small" id="go-settings">⚙︎</button></div>' +

    "<h2>Today’s focus</h2>" +
    focus.map(s =>
      '<div class="card row" style="--dc:' + domColor(s.d) + '"><span class="dot"></span><div class="grow"><b>' + esc(domName(s.d)) + "</b>" +
      '<div class="muted">' + focusReason(s) + " · readiness " + s.readiness + "%</div></div>" +
      '<button class="btn small" data-quiz="' + s.d + '">Quiz</button>' +
      '<button class="btn small secondary" data-flash="' + s.d + '">Cards</button></div>').join("") +

    "<h2>Readiness by topic</h2><div class=\"card\"><div class=\"ring-grid\" style=\"grid-template-columns:repeat(3,1fr)\">" +
    DOMAINS.map(d => { const s = needs.find(x => x.d === d);
      return '<button class="ring-cell" data-dom="' + d + '"><span class="ring-wrap">' + ring(s.readiness / 100, domColor(d)) +
        '<span class="ring-num">' + s.readiness + '</span></span><span class="ring-label">' + esc(domShort(d)) + "</span></button>"; }).join("") +
    '</div><p class="muted" style="margin:10px 0 0">Readiness blends accuracy, coverage, your confidence rating, and how recently you touched the topic. Tap a ring to drill in.</p></div>' +

    "<h2>Jump in</h2>" +
    '<div class="card"><button class="btn block" id="smart-quiz">▶ Smart quiz (10 questions where you need it most)</button>' +
    '<div style="height:8px"></div>' +
    '<button class="btn block secondary" id="due-flash">Review due flashcards' + (due ? " (" + due + ")" : "") + "</button>" +
    '<div style="height:8px"></div>' +
    (nd ? '<button class="btn block secondary" id="go-label">◫ Label a diagram: ' + esc(nd.title) + '</button><div style="height:8px"></div>' : "") +
    (WORKED.length ? '<button class="btn block secondary" id="go-worked">✎ Worked examples, step by step (' + WORKED.length + ')</button><div style="height:8px"></div>' : "") +
    '<button class="btn block secondary" id="go-exam">' + (S.sim && !S.sim.submitted ? "⏱ Resume practice test" : simLabel()) + '</button></div>';

  wireHub(m);
  m.querySelectorAll("[data-quiz]").forEach(b => b.addEventListener("click", () => startQuiz(b.dataset.quiz)));
  m.querySelectorAll("[data-flash]").forEach(b => b.addEventListener("click", () => startFlash(b.dataset.flash)));
  m.querySelectorAll("[data-dom]").forEach(b => b.addEventListener("click", () => go("study", { dom: b.dataset.dom })));
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
  m.innerHTML = courseHeader("Study", "Pick a mode, or drill a single topic.") +
    '<div class="card"><button class="btn block" id="smart-quiz">▶ Smart quiz</button><div style="height:8px"></div>' +
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
          '<div class="muted">' + s.seen + "/" + s.total + " questions seen · " + (s.attempts ? "accuracy " + pct(s.acc) + "%" : "no attempts yet") + "</div></div>" +
          '<span class="chip">' + s.readiness + "%</span></div>" +
          '<div class="row" style="margin-top:10px"><button class="btn small grow" data-quiz="' + d + '">Quiz</button>' +
          '<button class="btn small secondary grow" data-flash="' + d + '">Flashcards</button></div></div>';
      }).join("")).join("") +
    (WORKED.length ? "<h2>Worked examples</h2>" + WORKED.map((w, i) =>
      '<button class="card worked-card" data-worked="' + i + '" style="--dc:' + domColor(w.domain) + '"><span class="row"><span class="dot"></span><span class="grow"><b>' + esc(w.title) + '</b><span class="muted" style="display:block">' + esc(domShort(w.domain)) + " · " + plural(w.steps.length, "step") + "</span></span><span class=\"muted\">›</span></span></button>").join("") : "");
  wireHub(m);
  $("#smart-quiz").addEventListener("click", () => startQuiz(null));
  $("#due-flash").addEventListener("click", () => startFlash(null));
  $("#go-diagrams").addEventListener("click", () => go("diagrams"));
  $("#go-exam").addEventListener("click", startSim);
  const rm = $("#review-missed"); if (rm) rm.addEventListener("click", () => startQuiz("__missed__"));
  m.querySelectorAll("[data-quiz]").forEach(b => b.addEventListener("click", () => startQuiz(b.dataset.quiz)));
  m.querySelectorAll("[data-flash]").forEach(b => b.addEventListener("click", () => startFlash(b.dataset.flash)));
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
  S.hist.push({ t: Date.now(), mode: "quiz", dom: QZ.dom, n, c });
  if (S.hist.length > 400) S.hist = S.hist.slice(-400);
  save();
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
  if (quizDom) confidenceSheet(quizDom);
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
  go("flash");
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
  m.innerHTML =
    '<div class="row"><button class="btn small secondary" id="fl-exit">✕ End</button><div class="grow center"><span class="chip" style="--dc:' + domColor(p.dom) + '"><span class="dot"></span>' + esc(domShort(p.dom)) + "</span></div><span class=\"muted\">" + (FL.i + 1) + "/" + FL.pool.length + "</span></div>" +
    '<div class="flash-scene"><div class="flash-card' + (FL.flipped ? " flipped" : "") + '" id="fl-card">' +
    '<div class="flash-face"><span class="flash-topic chip">' + esc(p.card.topic || "") + '</span><div class="fr">' + esc(p.card.front) + '</div><div class="muted" style="margin-top:14px">tap to flip</div></div>' +
    '<div class="flash-face back"><div class="bk">' + esc(p.card.back) + "</div></div></div></div>" +
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
  for (const d of DOMAINS) { const q = domainQuiz(d).find(x => x.id === id); if (q) return { q, d }; }
  return null;
}
function startSim() {
  if (S.sim && !S.sim.submitted) { go("exam"); return; }
  openSheet('<h2>' + esc(COURSE.short) + ' practice test</h2>' +
    '<p class="sub">' + simCount() + " questions, " + SIM_SPEC.minutes + " minutes, mixed across all " + DOMAINS.length + " topics. No feedback until you submit, just like the real thing.</p>" +
    '<button class="btn block" id="sim-go">Start the clock</button>');
  $("#sim-go").addEventListener("click", () => { closeSheet(); beginSim(); });
}
function beginSim() {
  const qids = [];
  DOMAINS.forEach(d => shuffle(domainQuiz(d)).slice(0, SIM_SPEC.mix[d] || 4).forEach(q => qids.push(q.id)));
  S.sim = { qids: shuffle(qids), endAt: Date.now() + SIM_SPEC.minutes * 60000, answers: {}, flags: [], i: 0, submitted: false, score: 0 };
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
      recordAnswer(id, correct);
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

/* Terra course registry. One entry per course; the engine loads exactly one at a time.
   RULES: storageKey is the progress anchor for that course, never change it. domains lists data-file ids in display order.
   Adding a course = new data files + one entry here + script tags in index.html + ASSETS in sw.js (and bump CACHE). */
window.COURSES = [
  {
    id: "apes",
    name: "AP Environmental Science",
    short: "APES",
    tagline: "AP Environmental Science, one step at a time.",
    color: "#1e8f52",
    storageKey: "apesPrep.v1",
    domains: ["eco", "terr", "aqua", "cycles", "prod", "energy"],
    units: { 1: "Unit 1 · The Living World: Ecosystems" },
    dates: [
      { key: "testDate", label: "unit test", field: "Next class test date" },
      { key: "apDate", label: "AP exam", field: "AP exam date (May)" }
    ],
    sim: { minutes: 30, mix: { eco: 4, terr: 4, aqua: 4, cycles: 6, prod: 3, energy: 4 } }
  },
  {
    id: "stats",
    name: "Statistics",
    short: "Stats",
    tagline: "Descriptive statistics: read it, describe it, compute it.",
    color: "#2a78d6",
    storageKey: "statsPrep.v1",
    domains: ["dtype", "socv", "calc", "box", "freq"],
    units: { 1: "Unit 1 · Descriptive Statistics" },
    dates: [
      { key: "testDate", label: "retake / test", field: "Next test or retake date" }
    ],
    sim: { minutes: 25, mix: { dtype: 4, socv: 5, calc: 6, box: 5, freq: 5 } }
  }
];

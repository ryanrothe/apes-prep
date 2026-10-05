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
    domains: ["eco", "terr", "aqua", "cycles", "prod", "energy",
      "bio", "serv", "isl", "tol", "dist", "adapt", "succ"],
    units: {
      1: "Unit 1 · The Living World: Ecosystems",
      2: "Unit 2 · The Living World: Biodiversity"
    },
    dates: [
      { key: "testDate", label: "unit test", field: "Next class test date" },
      { key: "apDate", label: "AP exam", field: "AP exam date (May)" }
    ],
    sim: {
      minutes: 40,
      mix: {
        eco: 2, terr: 2, aqua: 2, cycles: 2, prod: 1, energy: 1,
        bio: 4, serv: 3, isl: 3, tol: 3, dist: 3, adapt: 3, succ: 5
      }
    }
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
  },
  {
    /* Vocabulary-first course: each domain carries `terms`, which power the word drills, two-way flashcards,
       the word list, and `sim.terms` generated definition questions in the practice test. */
    id: "psych",
    name: "AP Psychology",
    short: "AP Psych",
    tagline: "Know the word, the meaning, and where it shows up in real life.",
    color: "#7c3aed",
    storageKey: "psychPrep.v1",
    domains: ["hered", "ns", "neur", "chem", "drugs", "brain", "hemi", "sleep"],
    units: { 1: "Unit 1 · Biological Bases of Behavior" },
    dates: [
      { key: "testDate", label: "unit test", field: "Next test date (definitions test, unit test)" },
      { key: "apDate", label: "AP exam", field: "AP exam date (May)" }
    ],
    sim: {
      minutes: 30,
      mix: { hered: 2, ns: 2, neur: 3, chem: 3, drugs: 2, brain: 3, hemi: 2, sleep: 3 },
      terms: 20
    }
  }
];

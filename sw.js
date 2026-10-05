/* Terra service worker. RULE: bump CACHE on ANY file change or installed copies keep serving stale files. */
const CACHE = "terra-prep-v4";
const ASSETS = [
  ".", "index.html", "styles.css", "app.js", "manifest.webmanifest",
  "data/courses.js",
  "data/eco.js", "data/terr.js", "data/aqua.js", "data/cycles.js",
  "data/prod.js", "data/energy.js", "data/diagrams.js",
  "data/u2-bio.js", "data/u2-serv.js", "data/u2-isl.js", "data/u2-tol.js",
  "data/u2-dist.js", "data/u2-adapt.js", "data/u2-succ.js", "data/u2-diagrams.js",
  "data/stats-dtype.js", "data/stats-socv.js", "data/stats-calc.js", "data/stats-box.js", "data/stats-freq.js",
  "data/stats-diagrams.js", "data/stats-worked.js",
  "data/psych-hered.js", "data/psych-ns.js", "data/psych-neur.js", "data/psych-chem.js", "data/psych-drugs.js",
  "data/psych-brain.js", "data/psych-hemi.js", "data/psych-sleep.js", "data/psych-diagrams.js",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-180.png"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(m => m || caches.match("index.html")))
  );
});

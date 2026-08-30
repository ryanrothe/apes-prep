# Terra — AP Environmental Science Prep

A personal study companion for AP Environmental Science, built one unit at a time. Right now it covers **Unit 1: The Living World — Ecosystems** (topics 1.1 through 1.11), built straight from class notes.

**Use it here: https://ryanrothe.github.io/apes-prep/**

## Put it on your iPhone

1. Open the link above in Safari
2. Tap the Share button, then **Add to Home Screen**
3. It installs like an app: full screen, works offline, keeps your progress

On a laptop, just open the same link in any browser.

## What's inside

- **130 exam-style questions** across all 6 Unit 1 topic groups, each with a plain-English explanation
- **76 flashcards** on a spaced-repetition schedule (the app decides when you're due to see each one again)
- **12 interactive diagrams**: every one works two ways — study it with the labels on, then prove it by labeling it yourself (carbon cycle, nitrogen cycle, energy pyramid, lake zones, and more)
- **Smart quiz**: pulls questions from wherever your accuracy is lowest, your confidence is shakiest, or the material has gone stale
- **Timed practice test**: 25 questions, 30 minutes, mixed across all six topics, with flag-and-jump navigation and full answer review
- **Readiness rings** that tell you exactly where to spend today's study minutes

## How the app finds your weak spots

Every topic gets a readiness ring (0-100) blending four signals: your **accuracy**, how much of the bank you've **covered**, your own **confidence rating** (it asks after quiz rounds), and **freshness** (topics untouched for days start to fade, matching how memory actually works). The Home screen always tells you where to start.

## Progress and backup

Progress saves automatically on the device you're using. To move it between phone and laptop: **Progress → Test dates & backup → Copy backup code**, text it to yourself, and paste it on the other device with **Paste to restore**.

## For maintainers

Plain HTML/CSS/JS, no build step. Question banks live in `data/*.js` (one file per topic), diagrams in `data/diagrams.js`. Future units slot in as new data files with `unit: 2` etc. After any file change, bump `CACHE` in `sw.js` or installed copies keep serving the old version. Deploy with `./deploy.sh` from the local clone.

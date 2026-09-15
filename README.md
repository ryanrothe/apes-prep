# Terra — Study Hub

A personal study companion, built one course and one unit at a time from class notes and study guides. Open it, pick a course, and the app tells you where to spend today's study minutes.

**Use it here: https://ryanrothe.github.io/apes-prep/**

## Courses inside

- **AP Environmental Science**: Unit 1, The Living World: Ecosystems (topics 1.1 through 1.11). 130 questions, 76 flashcards, 12 labelable diagrams.
- **Statistics**: Unit 1, Descriptive Statistics. 113 questions, 57 flashcards, 10 labelable diagrams, and 6 worked examples that solve the retake study guide problems step by step (five-number summary, outlier fences, mean and standard deviation by hand, relative frequency, SOCV write-ups, building a bar graph).

Each course keeps its own progress, streak, readiness rings, and backup code. Switching courses never touches the other one.

## Put it on your iPhone

1. Open the link above in Safari
2. Tap the Share button, then **Add to Home Screen**
3. It installs like an app: full screen, works offline, keeps your progress

On a laptop, just open the same link in any browser.

## What's inside every course

- **Exam-style questions** with a plain-English explanation after every answer, right or wrong
- **Flashcards** on a spaced-repetition schedule (the app decides when you're due to see each one again)
- **Diagrams** that work two ways: study them with the labels on, then prove it by labeling them yourself
- **Worked examples** (where a course has them): cover the steps, try the problem, reveal one step at a time
- **Smart quiz**: pulls questions from wherever your accuracy is lowest, your confidence is shakiest, or the material has gone stale
- **Timed practice test** mixed across every topic, with flag-and-jump navigation and full answer review
- **Readiness rings** that tell you exactly where to start

## How the app finds your weak spots

Every topic gets a readiness ring (0-100) blending four signals: your **accuracy**, how much of the bank you've **covered**, your own **confidence rating** (it asks after quiz rounds), and **freshness** (topics untouched for days start to fade, matching how memory actually works).

## Progress and backup

Progress saves automatically on the device you're using, separately per course. To move it between phone and laptop: **Progress → Test dates & backup → Copy backup code**, text it to yourself, and paste it on the other device with **Paste to restore**.

## For maintainers

Plain HTML/CSS/JS, no build step. `data/courses.js` is the course registry (one entry per course: name, colour, storage key, domain order, practice-test mix). Question banks live in `data/*.js` (one file per topic), diagrams in `data/diagrams.js` and `data/stats-diagrams.js`, worked examples in `data/stats-worked.js`. New units slot in as new data files with `unit: 2` etc.; new courses add data files plus one registry entry. After any file change, bump `CACHE` in `sw.js` or installed copies keep serving the old version. Deploy with `./deploy.sh` from the local clone.

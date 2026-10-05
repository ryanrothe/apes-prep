# Terra — Study Hub

A personal study companion, built one course and one unit at a time from class notes and study guides. Open it, pick a course, and the app tells you where to spend today's study minutes.

**Use it here: https://ryanrothe.github.io/apes-prep/**

## Courses inside

- **AP Environmental Science**: Unit 1, The Living World: Ecosystems (topics 1.1 through 1.11) and Unit 2, The Living World: Biodiversity (2.1 through 2.7). 280 questions, 168 flashcards, 23 labelable diagrams.
- **Statistics**: Unit 1, Descriptive Statistics. 113 questions, 57 flashcards, 10 labelable diagrams, and 6 worked examples that solve the retake study guide problems step by step (five-number summary, outlier fences, mean and standard deviation by hand, relative frequency, SOCV write-ups, building a bar graph).
- **AP Psychology**: Unit 1, Biological Bases of Behavior (the class term list, 1.1 through 1.5). All 100 terms, each with a plain-English definition, a real-life example, and a memory trick; 119 test-style scenario questions; 12 labelable diagrams (nervous system, reflex arc, neural firing, the synapse, brain lobes, inner brain, limbic system, split brain, a night of sleep, and more).

## Practicing vocabulary (AP Psychology)

AP Psych has a **Words** tab with the full term list (search it, or filter by topic), plus seven ways to practice under **Study → Practice the words**:

- **Mixed drill**: a bit of everything. New words start easy; words you know get harder.
- **Word → definition** and **Definition → word**: pick the match.
- **Real-life examples**: read a situation, name the term it shows. This is how the AP exam asks.
- **Type it**: read the meaning, type the word. Small typos are forgiven; another term's name is not.
- **Match-up**: pair 6 words with their meanings against the clock.
- **Flashcards**: word first, definition first, or mixed.
- **Test-style questions**: scenario questions with an explanation after every answer.

Pick which words first: everything, one topic, the words you keep missing, or the ones you haven't tried. Every miss goes straight back into your flashcards. The timed practice test mixes 20 test-style questions with 20 definition questions.

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

Plain HTML/CSS/JS, no build step. `data/courses.js` is the course registry (one entry per course: name, colour, storage key, domain order, practice-test mix). Question banks live in `data/*.js` (one file per topic), diagrams in `data/diagrams.js`, `data/u2-diagrams.js`, `data/stats-diagrams.js` and `data/psych-diagrams.js`, worked examples in `data/stats-worked.js`. A topic file can also carry `terms` (`{id, term, short, def, ex, hook, accept, near, exAvoid}`): that switches on the word drills, two-way flashcards, the Words tab, and generated definition questions in the practice test (`sim.terms` in the registry). New units slot in as new data files with `unit: 2` etc.; new courses add data files plus one registry entry. After any file change, bump `CACHE` in `sw.js` or installed copies keep serving the old version. Deploy with `./deploy.sh` from the local clone.

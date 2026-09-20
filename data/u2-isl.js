window.EXAM_DATA = window.EXAM_DATA || {};
window.EXAM_DATA.domains = window.EXAM_DATA.domains || {};
window.EXAM_DATA.domains["isl"] = {
  id: "isl",
  name: "Island Biogeography & Fragmentation",
  short: "Islands",
  unit: 2,
  quiz: [
    { id: "ib-q1", topic: "The two rules",
      q: "Island biogeography says an island will have more species when it is:",
      choices: [
        "Large and far from the mainland",
        "Small and close to the mainland",
        "Small and far from the mainland",
        "Large and close to the mainland"
      ],
      answer: 3,
      explain: "The two rules together: bigger islands hold more species, and islands closer to the mainland get more arrivals. Large plus close is the maximum." },
    { id: "ib-q2", topic: "Island size",
      q: "Why do larger islands support higher species diversity?",
      choices: [
        "They have more available niches and different food sources",
        "They are always closer to the mainland",
        "They have fewer predators",
        "They get more rainfall by law"
      ],
      answer: 0,
      explain: "A bigger island has more room and more variety of space, which means more niches (roles) and more different food sources for species to fill." },
    { id: "ib-q3", topic: "Island size",
      q: "Larger islands also tend to hold more genetic diversity because:",
      choices: [
        "Species on big islands never mutate",
        "Large islands have fewer species",
        "Larger populations usually have more genetic diversity",
        "Bigger islands have older rocks"
      ],
      answer: 2,
      explain: "Bigger island equals bigger populations, and bigger populations carry more gene variety, which makes them more RESILIENT to change and disease." },
    { id: "ib-q4", topic: "Island size",
      q: "The relationship between island size and species richness is:",
      choices: ["Positive correlation", "No relationship", "Random", "Inverse"],
      answer: 0,
      explain: "Positive correlation: as island area goes up, number of species goes up. Draw it and the line slopes upward to the right." },
    { id: "ib-q5", topic: "Distance to mainland",
      q: "Why does an island closer to the mainland have higher species richness?",
      choices: [
        "It is always larger",
        "It has fewer niches",
        "It has more rainfall",
        "It is easier for species to migrate there by swimming or flying"
      ],
      answer: 3,
      explain: "Closer means the trip is survivable. More species manage to swim, fly, or drift over, and each arrival brings genetic diversity with it." },
    { id: "ib-q6", topic: "Distance to mainland",
      q: "The relationship between distance from the mainland and species richness is:",
      choices: ["Exponential growth", "Positive correlation", "Inverse relationship", "No relationship"],
      answer: 2,
      explain: "Inverse: the farther the island, the FEWER species. On a graph the line slopes downward as distance increases." },
    { id: "ib-q7", topic: "Distance to mainland",
      q: "Two islands are the same size. Island A is 5 km offshore, Island B is 500 km offshore. Predict:",
      choices: [
        "Island B has more species because it is more isolated",
        "Island A has more species because migration is easier",
        "They will have identical species counts",
        "Island B has more genetic diversity"
      ],
      answer: 1,
      explain: "Same size cancels out the area rule, so distance decides. The near island receives far more migrants, so it holds more species and more incoming genetic diversity." },
    { id: "ib-q8", topic: "Combining the rules",
      q: "Rank these islands from MOST to FEWEST species: (1) large and near, (2) small and far, (3) large and far.",
      choices: ["3, 1, 2", "1, 2, 3", "1, 3, 2", "2, 3, 1"],
      answer: 2,
      explain: "Large and near wins both rules. Large and far wins only on size. Small and far loses both, so it ends up with the fewest species." },
    { id: "ib-q9", topic: "Evolution on islands",
      q: "A single finch species arrives on a new island. Over time it becomes many species with different beak shapes. Why?",
      choices: [
        "The birds migrated back to the mainland",
        "Inbreeding created new species instantly",
        "The island got larger",
        "Different beaks were selected for so the birds could fit different food sources"
      ],
      answer: 3,
      explain: "A single colonizing species evolves to adapt to the new island. Different beaks get selected for so the birds can quickly fit different food sources: seeds, insects, cactus flowers." },
    { id: "ib-q10", topic: "Evolution on islands",
      q: "The Galapagos finch family tree shows that all the species share:",
      choices: [
        "A common ancestor from the South American mainland",
        "The same beak shape",
        "An inability to fly",
        "The exact same diet"
      ],
      answer: 0,
      explain: "The tree traces back to one common ancestor from the mainland. One colonizing species spread out and adapted into many, each filling a different food niche." },
    { id: "ib-q11", topic: "Habitat fragmentation",
      q: "Habitat fragmentation is:",
      choices: [
        "A habitat that grows larger over time",
        "The total destruction of all habitat in a region",
        "A large continuous habitat broken into smaller isolated patches",
        "Two habitats merging into one"
      ],
      answer: 2,
      explain: "A big connected habitat gets transformed into a patchwork of smaller, scattered islands of habitat surrounded by a very different altered perimeter." },
    { id: "ib-q12", topic: "Habitat fragmentation",
      q: "Which of these causes habitat fragmentation?",
      choices: ["Photosynthesis", "Genetic drift", "Roads, agriculture, and urban development", "Rainfall"],
      answer: 2,
      explain: "Fragmentation comes from human structures cutting habitat apart: roads, farm fields, and cities. These form the altered perimeter around each leftover patch." },
    { id: "ib-q13", topic: "Habitat fragmentation",
      q: "Why is island biogeography used to explain habitat fragmentation on land?",
      choices: [
        "Because each leftover patch acts like an island: small and isolated means fewer species",
        "Because fragments always become larger over time",
        "Because only birds live in fragments",
        "Because fragments are surrounded by water"
      ],
      answer: 0,
      explain: "A forest patch ringed by highway behaves like an island in an ocean. The same two rules apply: small patches and isolated patches lose species." },
    { id: "ib-q14", topic: "Habitat fragmentation",
      q: "A highway splits one large deer population into two small ones. The most likely genetic outcome is:",
      choices: [
        "Increased genetic diversity in both groups",
        "Reduced genetic diversity and more inbreeding in each group",
        "No genetic change at all",
        "The deer will immediately evolve into two species"
      ],
      answer: 1,
      explain: "Two small isolated populations cannot exchange genes. Smaller mating pools mean less genetic diversity and a higher chance of inbreeding depression." },
    { id: "ib-q15", topic: "Wildlife corridors",
      q: "A wildlife corridor is best described as:",
      choices: [
        "A zone where hunting is allowed",
        "A road built through a protected forest",
        "A fence that keeps animals off roads",
        "A connection point that links separated habitat patches"
      ],
      answer: 3,
      explain: "Corridors are connection points. They stitch fragmented patches back together so animals can move, feed, and breed across the whole area again." },
    { id: "ib-q16", topic: "Wildlife corridors",
      q: "The main genetic benefit of a wildlife corridor is that it:",
      choices: [
        "Removes all predators from the area",
        "Makes each patch physically larger overnight",
        "Increases the number of roads",
        "Lets separated populations interbreed, which keeps genetic diversity up"
      ],
      answer: 3,
      explain: "Corridors reconnect gene pools. Animals crossing between patches mix genes, which fights inbreeding depression and keeps genetic diversity high." },
    { id: "ib-q17", topic: "Mitigation",
      q: "Mitigating fragmentation means:",
      choices: [
        "Making the fragments smaller",
        "Resolving or preventing the problem",
        "Measuring how bad the problem is",
        "Accepting the problem and moving on"
      ],
      answer: 1,
      explain: "To mitigate is to RESOLVE or PREVENT. Wildlife corridors and overpasses are the standard mitigation tools for fragmentation." },
    { id: "ib-q18", topic: "Applying it",
      q: "A park is planning either one 500-acre reserve or five separate 100-acre reserves. Island biogeography predicts the single large reserve will:",
      choices: [
        "Hold more species, because bigger area means more niches and larger populations",
        "Hold the same number of species",
        "Have more inbreeding than the five small ones",
        "Hold fewer species because it has one habitat type"
      ],
      answer: 0,
      explain: "Bigger area means more niches, more food sources, and larger populations with more genetic diversity. If the five small reserves must be used, connect them with corridors." },
    { id: "ib-q19", topic: "Applying it",
      q: "A patch of forest is cut in half, and edge conditions (wind, sun, invasive plants) creep in from the new border. This shows that fragmentation:",
      choices: [
        "Only reduces total area, nothing else",
        "Also changes conditions inside the patch, since each patch is surrounded by an altered perimeter",
        "Improves habitat quality",
        "Has no effect until the patch is completely gone"
      ],
      answer: 1,
      explain: "The definition specifically says each fragment is surrounded by a very different, ALTERED perimeter. That changed edge degrades the habitat beyond just shrinking it." },
    { id: "ib-q20", topic: "Applying it",
      q: "Which pair of islands would you expect to have the MOST similar species lists?",
      choices: [
        "A large near island and a small far island",
        "Two small islands the same distance from the mainland",
        "A large far island and a small near island",
        "Islands never share species"
      ],
      answer: 1,
      explain: "Matching on both variables, size and distance, gives the most similar conditions and therefore the most similar species richness." }
  ],
  cards: [
    { id: "ib-c1", topic: "Two rules", front: "The two rules of island biogeography?", back: "1. LARGE islands = more species. 2. CLOSE to mainland = more species. Large + near is the jackpot." },
    { id: "ib-c2", topic: "Island size", front: "Why do large islands hold more species?", back: "More available NICHES (roles) and different food sources, plus LARGER populations, which carry more genetic diversity and are more resilient." },
    { id: "ib-c3", topic: "Graph shape", front: "Island AREA vs species richness: what kind of relationship?", back: "POSITIVE correlation. Bigger area, more species. The line slopes UP." },
    { id: "ib-c4", topic: "Graph shape", front: "DISTANCE from mainland vs species richness?", back: "INVERSE relationship. Farther away, FEWER species. The line slopes DOWN." },
    { id: "ib-c5", topic: "Distance", front: "Why does closer to the mainland mean more richness?", back: "Easier to MIGRATE, by swimming or flying. Each arrival also brings genetic diversity with it." },
    { id: "ib-c6", topic: "Evolution", front: "What happens to a single colonizing species on a new island?", back: "It evolves to adapt to the new island. Different traits get selected for so the population can quickly fit different food sources. Example: Galapagos finch beaks." },
    { id: "ib-c7", topic: "Fragmentation", front: "Habitat fragmentation, in one line?", back: "A large continuous habitat is broken into a patchwork of smaller, isolated, scattered fragments surrounded by a very different ALTERED perimeter." },
    { id: "ib-c8", topic: "Fragmentation", front: "What causes fragmentation?", back: "Roads, agriculture, and urban development." },
    { id: "ib-c9", topic: "Fragmentation", front: "Why is fragmentation an island problem?", back: "Each leftover patch acts like an ISLAND. Small and isolated means fewer species, smaller populations, and more inbreeding." },
    { id: "ib-c10", topic: "Mitigation", front: "What does mitigating fragmentation mean?", back: "RESOLVE or PREVENT the problem." },
    { id: "ib-c11", topic: "Corridors", front: "Wildlife corridors: what do they do?", back: "They are CONNECTION POINTS between fragments. Animals move between patches, gene pools mix, genetic diversity stays up, inbreeding drops." },
    { id: "ib-c12", topic: "Applying it", front: "One 500-acre reserve or five 100-acre reserves?", back: "One large wins: more niches, bigger populations, more genetic diversity. If you must use the five, link them with CORRIDORS." }
  ]
};

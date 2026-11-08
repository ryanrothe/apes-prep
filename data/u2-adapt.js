window.EXAM_DATA = window.EXAM_DATA || {};
window.EXAM_DATA.domains = window.EXAM_DATA.domains || {};
window.EXAM_DATA.domains["adapt"] = {
  id: "adapt",
  name: "Adaptations & Natural Selection",
  short: "Adaptations",
  unit: 2,
  quiz: [
    { id: "ad-q1", topic: "Fitness",
      q: "In biology, fitness means:",
      choices: [
        "How fast an organism can run",
        "How long an organism lives",
        "How physically strong an organism is",
        "The ability to survive and reproduce"
      ],
      answer: 3,
      explain: "Fitness is the ability to SURVIVE AND REPRODUCE. An animal that lives a long time but leaves no offspring has low fitness, no matter how strong it is." },
    { id: "ad-q2", topic: "Adaptations",
      q: "An adaptation is:",
      choices: [
        "A behavior learned from parents",
        "A disease that spreads through a population",
        "Any change an organism makes during its lifetime",
        "A new trait that increases an organism's fitness"
      ],
      answer: 3,
      explain: "An adaptation is a NEW TRAIT that increases fitness, meaning it helps the organism survive and reproduce. Traits learned in one lifetime do not count." },
    { id: "ad-q3", topic: "Source of variation",
      q: "Genetic diversity creates variation through:",
      choices: [
        "Competition and predation between members of the same species",
        "Succession and habitat fragmentation changing where species live",
        "Random mutation of DNA and crossing over of parent DNA in meiosis",
        "Migration and hibernation when the seasons change each year"
      ],
      answer: 2,
      explain: "Two sources: random DNA mutation makes brand new versions of genes, and crossing over during meiosis shuffles parent DNA into new combinations." },
    { id: "ad-q4", topic: "Source of variation",
      q: "Why is genetic diversity the starting point for adaptation?",
      choices: [
        "Because it guarantees every organism survives",
        "Because natural selection needs variation to select from",
        "Because it prevents mutations",
        "Because it makes populations smaller"
      ],
      answer: 1,
      explain: "Selection can only pick from what already exists. No variation means no differences to favor, so the population cannot adapt." },
    { id: "ad-q5", topic: "Natural selection",
      q: "Natural selection is the idea that:",
      choices: [
        "Organisms that are better adapted will survive and reproduce",
        "All organisms in a population survive equally",
        "The largest organisms always win",
        "Organisms choose which traits to develop"
      ],
      answer: 0,
      explain: "Organisms that are BETTER ADAPTED will survive and reproduce, passing those traits on. Nothing chooses anything; the environment just filters." },
    { id: "ad-q6", topic: "Selective pressure",
      q: "A selective pressure is:",
      choices: [
        "A gene that is passed on to every offspring",
        "The body weight an organism needs to survive",
        "The speed at which a population grows each year",
        "An environmental condition that kills weaker organisms"
      ],
      answer: 3,
      explain: "A selective pressure is an environmental condition that kills off less-suited organisms: a drought, a predator, a cold snap. It is the filter that does the selecting." },
    { id: "ad-q7", topic: "Natural selection",
      q: "In the mouse and hawk example, dark mice on dark soil survive better. Over generations the population becomes darker because:",
      choices: [
        "Hawks decide to eat only light mice, so light mice choose darker soil",
        "Dark mice live longer, so each one keeps having babies for many years",
        "Light mice turn dark over their lifetime so they can hide from hawks",
        "Light mice are eaten more, so dark mice reproduce and pass on the trait"
      ],
      answer: 3,
      explain: "The hawk is the selective pressure. Light mice are spotted and eaten, dark mice survive and reproduce, and the next generation carries more of the dark gene. Individuals do not change color; the POPULATION shifts." },
    { id: "ad-q8", topic: "Environment decides",
      q: "What determines which traits count as adaptations?",
      choices: ["The environment", "The number of predators only", "Genetic diversity alone", "The organism itself"],
      answer: 0,
      explain: "The ENVIRONMENT determines which traits are adaptations. The same trait can be an advantage in one place and a liability somewhere else." },
    { id: "ad-q9", topic: "Environment decides",
      q: "As the environment changes:",
      choices: [
        "Genetic diversity disappears, because new traits stop forming",
        "Traits that were adaptations stay adaptations forever, no matter what",
        "New traits can become adaptations, and old ones can become disadvantages",
        "All organisms stop reproducing until the old conditions come back"
      ],
      answer: 2,
      explain: "There is no permanently good trait. When conditions shift, yesterday's advantage can become today's disadvantage, and traits that were useless suddenly matter." },
    { id: "ad-q10", topic: "Finch beaks",
      q: "In the 1977 Galapagos drought, the mean beak depth of surviving finches increased. Why?",
      choices: [
        "The drought made every finch grow a bigger beak during its lifetime",
        "Only hard seeds remained, so birds with larger beaks could crack them and survive",
        "Small-beaked finches all migrated to the mainland to find soft seeds",
        "Larger beaks helped the birds drink more water during the dry season"
      ],
      answer: 1,
      explain: "The drought killed off soft seeds. Finches with smaller beaks could not crack the hard ones and died. Larger beaks became an adaptation because the FOOD changed." },
    { id: "ad-q11", topic: "Finch beaks",
      q: "In the finch data, the total number of birds fell from 751 in 1976 to 90 survivors in 1977. This crash is also an example of:",
      choices: ["Ecological succession", "Habitat fragmentation", "A bottleneck event", "Inbreeding depression"],
      answer: 2,
      explain: "A disturbance sharply cut population size, which is a bottleneck. Here the survivors were selected by beak size, so natural selection and a population crash happened together." },
    { id: "ad-q12", topic: "Pace of evolution",
      q: "The more rapidly an environment changes:",
      choices: [
        "The less likely a species is to adapt to those changes",
        "The faster new mutations appear to help it",
        "The larger every population gets over time",
        "The more likely a species is to adapt to them"
      ],
      answer: 0,
      explain: "Adaptation takes generations. If conditions change faster than a species can produce those generations, it cannot keep up, so it migrates or dies." },
    { id: "ad-q13", topic: "Pace of evolution",
      q: "When an environment changes too fast for a species, the two outcomes are:",
      choices: ["Compete or cooperate", "Migrate or die", "Grow or shrink", "Hibernate or reproduce"],
      answer: 1,
      explain: "Species migrate or die. Moving to suitable habitat is the only option left when there is no time to adapt in place." },
    { id: "ad-q14", topic: "Pace of evolution",
      q: "Oceans warm quickly and fish cannot migrate fast enough, so they die from lack of oxygen. This happens because:",
      choices: [
        "Warm water increases fish metabolism only",
        "Warm water holds less oxygen",
        "Warm water holds more oxygen",
        "Fish stop breathing in warm water by choice"
      ],
      answer: 1,
      explain: "Warm water holds LESS dissolved oxygen. Fish that cannot reach cooler water in time suffocate. This is the classic distractor: many people assume warm water holds more." },
    { id: "ad-q15", topic: "Diversity and survival",
      q: "The more genetic diversity a population has:",
      choices: [
        "The greater its chance of survival, since some individuals may have good mutations",
        "The fewer offspring it produces, since energy goes to making new genes",
        "The faster it goes extinct, since its members are too different to mate",
        "The lower its chance of survival, since mutations are always harmful"
      ],
      answer: 0,
      explain: "More genetic diversity means a higher chance that SOME individuals already carry a useful mutation when conditions change. It is the same insurance idea as the potato blight." },
    { id: "ad-q16", topic: "Lifespan and rate",
      q: "How does lifespan affect the rate of evolution?",
      choices: [
        "Only body size affects the rate",
        "Longer lifespan means a slower rate of evolution",
        "Longer lifespan means a faster rate of evolution",
        "Lifespan has no effect"
      ],
      answer: 1,
      explain: "LONGER LIFESPAN equals a SLOWER rate of evolution, because evolution happens across generations. Fewer generations per century means slower change." },
    { id: "ad-q17", topic: "Lifespan and rate",
      q: "Bacteria evolve in days while humans take thousands of years because:",
      choices: [
        "Bacteria reproduce in a much shorter generation time",
        "Human DNA never mutates, so humans cannot evolve",
        "Bacteria choose to evolve whenever they need to",
        "Bacteria have much more DNA than humans do"
      ],
      answer: 0,
      explain: "Bacteria: days. Humans: thousands of years. Short generations stack up mutations and selection rounds far faster, which is why antibiotic resistance appears so quickly." },
    { id: "ad-q18", topic: "Common mistakes",
      q: "Which statement about natural selection is FALSE?",
      choices: [
        "Populations change over generations",
        "Selective pressures kill less-suited organisms",
        "Genetic variation must exist for selection to act",
        "Individuals evolve during their lifetime to fit the environment"
      ],
      answer: 3,
      explain: "Individuals do NOT evolve. A single mouse never turns darker. Selection changes which genes are common in the POPULATION over generations." },
    { id: "ad-q19", topic: "Putting it together",
      q: "Put these in the correct order for natural selection to work.",
      choices: [
        "Trait becomes common → variation exists → selective pressure → survivors reproduce",
        "Selective pressure → variation exists → survivors reproduce → trait becomes common",
        "Variation exists → selective pressure → survivors reproduce → trait becomes common",
        "Survivors reproduce → variation exists → selective pressure → trait becomes common"
      ],
      answer: 2,
      explain: "Variation has to be there FIRST, from mutation and recombination. Then the pressure filters it, survivors reproduce, and the helpful trait spreads through the population." },
    { id: "ad-q20", topic: "Putting it together",
      q: "Two beetle populations face the same new pesticide. Population A has high genetic diversity, Population B is nearly identical genetically. Predict:",
      choices: [
        "Neither will be affected",
        "B is more likely to have resistant individuals and survive",
        "A is more likely to have resistant individuals and survive",
        "Both will be wiped out equally"
      ],
      answer: 2,
      explain: "High genetic diversity means a bigger deck of cards, so Population A is more likely to already hold a resistance mutation. Low diversity is the cloned-potato problem again." }
  ],
  cards: [
    { id: "ad-c1", topic: "Fitness", front: "What does fitness mean in biology?", back: "The ability to SURVIVE AND REPRODUCE. Not strength, not speed, not lifespan." },
    { id: "ad-c2", topic: "Adaptation", front: "Define adaptation.", back: "A NEW TRAIT that increases an organism's fitness, meaning it helps it survive and reproduce." },
    { id: "ad-c3", topic: "Variation", front: "Where does the variation for adaptation come from?", back: "1. RANDOM MUTATION of DNA. 2. CROSSING OVER of parent DNA during meiosis. Genetic diversity creates variation." },
    { id: "ad-c4", topic: "Natural selection", front: "Natural selection in one sentence?", back: "Organisms that are BETTER ADAPTED will SURVIVE AND REPRODUCE, so their traits get more common." },
    { id: "ad-c5", topic: "Selective pressure", front: "Selective pressure?", back: "An environmental condition that KILLS WEAKER (less-suited) organisms. The drought, the hawk, the cold snap." },
    { id: "ad-c6", topic: "Big idea", front: "What decides which traits are adaptations?", back: "The ENVIRONMENT. As it changes, different traits become adaptations and old traits can become disadvantages." },
    { id: "ad-c7", topic: "Finches", front: "The 1977 finch drought: what happened and why?", back: "Drought left only hard seeds. Small-beaked finches could not crack them and died, so mean beak depth went UP. 751 birds fell to 90 survivors." },
    { id: "ad-c8", topic: "Pace", front: "The faster the environment changes...", back: "...the LESS likely a species can adapt. The two outcomes are MIGRATE OR DIE." },
    { id: "ad-c9", topic: "Pace", front: "The warming ocean example?", back: "Oceans warm quickly, fish cannot migrate fast enough, and they die from LACK OF OXYGEN, because warm water holds LESS oxygen." },
    { id: "ad-c10", topic: "Diversity", front: "Why does more genetic diversity raise survival odds?", back: "A better chance that SOME individuals already carry a good mutation when things change." },
    { id: "ad-c11", topic: "Lifespan", front: "Lifespan vs rate of evolution?", back: "LONGER LIFESPAN = SLOWER rate of evolution. Bacteria: days. Humans: thousands of years. Evolution runs on generations, not years." },
    { id: "ad-c12", topic: "Trap", front: "Do individuals evolve?", back: "NO. A single mouse never turns darker. POPULATIONS change across generations as gene frequencies shift." }
  ]
};

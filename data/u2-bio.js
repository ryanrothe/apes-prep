window.EXAM_DATA = window.EXAM_DATA || {};
window.EXAM_DATA.domains = window.EXAM_DATA.domains || {};
window.EXAM_DATA.domains["bio"] = {
  id: "bio",
  name: "Intro to Biodiversity",
  short: "Biodiversity",
  unit: 2,
  quiz: [
    { id: "bd-q1", topic: "Three kinds of diversity",
      q: "A park has a pond, a meadow, and a pine forest all inside it. Which kind of diversity is that describing?",
      choices: ["Genetic diversity", "Ecosystem diversity", "Evenness", "Species diversity"],
      answer: 1,
      explain: "Ecosystem diversity counts the number of different HABITATS in an area. Species diversity counts different species, and genetic diversity is about how different the genes are inside one species." },
    { id: "bd-q2", topic: "Three kinds of diversity",
      q: "Genetic diversity means:",
      choices: [
        "How different the genes are within a species",
        "How many total species live in an area",
        "How balanced the population sizes are",
        "How many different habitats an area has"
      ],
      answer: 0,
      explain: "Genetic diversity is how different the GENES are. Two forests can have the same species list, but the one whose individuals carry more gene variety handles disease and change far better." },
    { id: "bd-q3", topic: "Three kinds of diversity",
      q: "Which list goes from the biggest scale down to the smallest?",
      choices: [
        "Genetic, species, ecosystem",
        "Species, ecosystem, genetic",
        "Ecosystem, species, genetic",
        "Ecosystem, genetic, species"
      ],
      answer: 2,
      explain: "Zoom in: ecosystem diversity (different habitats) contains species diversity (different species), which contains genetic diversity (different genes inside one species)." },
    { id: "bd-q4", topic: "Biodiversity and health",
      q: "In general, high biodiversity means:",
      choices: [
        "Nothing about ecosystem health",
        "That the ecosystem is brand new",
        "High ecosystem health",
        "Low ecosystem health"
      ],
      answer: 2,
      explain: "High biodiversity equals high ecosystem health. More variety means more backup: if one species fails, others can still do its job." },
    { id: "bd-q5", topic: "Richness",
      q: "Species richness is:",
      choices: [
        "How balanced the population sizes are",
        "The total number of different species in an area",
        "The number of individuals of one species",
        "The number of habitats in an area"
      ],
      answer: 1,
      explain: "Richness is a plain count of how many different species are present. It says nothing about whether those species are evenly balanced, that is evenness." },
    { id: "bd-q6", topic: "Richness",
      q: "Why is high species richness usually good for an ecosystem?",
      choices: [
        "It guarantees every population is the same size",
        "More species means more resources are available and used",
        "It keeps the ecosystem from ever changing",
        "It means fewer predators"
      ],
      answer: 1,
      explain: "More species means more resources get used and more roles get filled, so the ecosystem is better off. It does not mean populations are equal in size." },
    { id: "bd-q7", topic: "Evenness",
      q: "Species evenness measures:",
      choices: [
        "How fast the population is growing",
        "How balanced the population sizes of the different species are",
        "How many species there are in total",
        "How many habitats are in the area"
      ],
      answer: 1,
      explain: "Evenness is about BALANCE. Four tree species at 25 percent each is very even. One species at 70 percent with the rest squeezed underneath is uneven." },
    { id: "bd-q8", topic: "Evenness",
      q: "Community 1 is 25% / 25% / 25% / 25% of four tree species. Community 2 is 6% / 12% / 70% / 12% of the same four species. Which statement is true?",
      choices: [
        "They have the same richness, but Community 1 has higher evenness",
        "Community 1 has higher richness and lower evenness",
        "Community 2 is more even because one species is dominant",
        "Community 2 has higher richness"
      ],
      answer: 0,
      explain: "Both have 4 species, so richness ties. Community 1 splits evenly, so it wins on evenness and is better off. Dominance by one species is the opposite of even." },
    { id: "bd-q9", topic: "Evenness",
      q: "An ecosystem has 12 species, but one species makes up 85 percent of all individuals. The best description is:",
      choices: [
        "High richness, high evenness",
        "Low richness, high evenness",
        "High richness, low evenness",
        "Low richness, low evenness"
      ],
      answer: 2,
      explain: "Twelve species is a solid count, so richness is high. One species hogging 85 percent means the populations are badly unbalanced, so evenness is low." },
    { id: "bd-q10", topic: "Genetic diversity",
      q: "Which two processes create genetic diversity?",
      choices: [
        "Inbreeding and bottlenecks",
        "Migration and hibernation",
        "Cloning and grafting",
        "Random mutations in DNA and recombination of chromosomes"
      ],
      answer: 3,
      explain: "New gene versions come from random DNA mutations, and sexual reproduction shuffles them through recombination of chromosomes. Inbreeding and bottlenecks REDUCE diversity." },
    { id: "bd-q11", topic: "Genetic diversity",
      q: "A blight sweeps through two potato fields. The field of genetically diverse potatoes loses some plants, but the field of cloned potatoes is wiped out completely. Why?",
      choices: [
        "The clones are genetically identical, so if one is susceptible they all are",
        "Clones have more predators",
        "Diverse potatoes are immune to all disease",
        "Cloned potatoes grow slower"
      ],
      answer: 0,
      explain: "Clones share one genome, so a disease that beats one beats every single plant. In the diverse field, some individuals happen to carry resistance and survive. That is exactly why genetic diversity matters." },
    { id: "bd-q12", topic: "Genetic diversity",
      q: "Higher genetic diversity in a population mainly increases the chance that:",
      choices: [
        "The population stops mutating",
        "Some individuals have traits that let them survive a new threat",
        "The population becomes a new species",
        "Every individual survives a disturbance"
      ],
      answer: 1,
      explain: "Genetic diversity is not a shield for everyone. It is a bigger deck of cards, so the odds go up that SOME individuals are already built to survive whatever comes." },
    { id: "bd-q13", topic: "Bottleneck effect",
      q: "The bottleneck effect happens when:",
      choices: [
        "Two species compete for the same resource",
        "Closely related organisms mate",
        "A population slowly grows over many years",
        "An environmental disturbance drastically reduces population size"
      ],
      answer: 3,
      explain: "A bottleneck is a sudden crash in population size from a disturbance such as a fire, hurricane, or hunting. The few survivors carry only a slice of the original gene pool." },
    { id: "bd-q14", topic: "Bottleneck effect",
      q: "Before a bottleneck a beetle population is 40% black, 10% brown, and 50% white. After the crash the survivors are 67% black and 33% brown. What happened to white?",
      choices: [
        "White beetles migrated away to a new habitat",
        "White beetles became the dominant allele",
        "White beetles evolved into brown ones",
        "White beetles were eliminated by random chance, so that gene version is gone"
      ],
      answer: 3,
      explain: "A bottleneck kills REGARDLESS of which genes an individual has. White was not selected against for being white, it was just unlucky. That gene version is now lost from the population." },
    { id: "bd-q15", topic: "Bottleneck effect",
      q: "The bottleneck effect is a form of genetic drift because:",
      choices: [
        "It always increases genetic diversity",
        "It only happens to plants",
        "It only affects the strongest individuals",
        "It changes gene frequencies randomly, not by fitness"
      ],
      answer: 3,
      explain: "Genetic drift means gene frequencies change by RANDOM chance rather than by which traits are better. That is the core of a bottleneck: survival is luck, not fitness." },
    { id: "bd-q16", topic: "Bottleneck effect",
      q: "The biggest long-term problem for a population that just went through a bottleneck is:",
      choices: [
        "It has reduced genetic diversity, so it adapts poorly to the next threat",
        "It has too many different genes",
        "It will immediately go extinct",
        "It can no longer reproduce at all"
      ],
      answer: 0,
      explain: "Even if numbers recover, the gene pool stays narrow. Reduced genetic diversity means fewer options when the next disease or climate shift arrives." },
    { id: "bd-q17", topic: "Inbreeding depression",
      q: "Inbreeding depression occurs when:",
      choices: [
        "A population grows too quickly",
        "A population migrates to a new habitat",
        "Organisms mate with closely related members, raising harmful mutations",
        "Two different species interbreed"
      ],
      answer: 2,
      explain: "Close relatives carry the same recessive problem genes. When they mate, offspring are far more likely to get two copies, so harmful traits show up and fitness drops." },
    { id: "bd-q18", topic: "Inbreeding depression",
      q: "Inbreeding depression is most likely in:",
      choices: [
        "Small populations",
        "Populations with high genetic diversity",
        "Populations spread across many habitats",
        "Large populations"
      ],
      answer: 0,
      explain: "Small populations have few mates to choose from, so relatives end up breeding with relatives. Big, well-mixed populations rarely run into this." },
    { id: "bd-q19", topic: "Bottleneck vs inbreeding",
      q: "What is the key difference between the bottleneck effect and inbreeding depression?",
      choices: [
        "They are two names for the same process",
        "Bottleneck increases diversity, inbreeding decreases it",
        "Bottleneck is caused by mating choices, inbreeding is caused by disasters",
        "A bottleneck is a sudden crash from a disturbance, inbreeding is harm from relatives mating"
      ],
      answer: 3,
      explain: "A bottleneck is an EVENT that shrinks the population. Inbreeding depression is an ongoing CONSEQUENCE of a small gene pool. Both end with less genetic diversity, which is why they get mixed up." },
    { id: "bd-q20", topic: "Resilience",
      q: "Ecosystem resilience is the ability of an ecosystem to:",
      choices: [
        "Return to normal after a disturbance",
        "Support only one dominant species",
        "Never be disturbed in the first place",
        "Grow larger every year"
      ],
      answer: 0,
      explain: "Resilience is bounce-back, not invincibility. A resilient ecosystem still gets hit by a fire or a storm, it just recovers to its normal state afterward." },
    { id: "bd-q21", topic: "Resilience",
      q: "Which ecosystem should recover fastest after a wildfire?",
      choices: [
        "One that has never burned before",
        "One with high species diversity",
        "One with a single dominant species",
        "One with low genetic diversity"
      ],
      answer: 1,
      explain: "High species diversity equals more ecosystem resilience. With many species, the jobs of the ones that died can be covered while the system rebuilds." },
    { id: "bd-q22", topic: "Resilience",
      q: "A farm grows one crop variety across every field. Compared with a diverse natural grassland, this farm is:",
      choices: [
        "More resilient, because it has higher richness",
        "More resilient, because all plants are the same",
        "Less resilient, because one pest or disease can take out everything",
        "Equally resilient"
      ],
      answer: 2,
      explain: "One variety means one set of weaknesses, the cloned-potato problem at farm scale. Low diversity equals low resilience." }
  ],
  cards: [
    { id: "bd-c1", topic: "Three kinds", front: "The three levels of biodiversity, biggest to smallest?", back: "ECOSYSTEM diversity (# different habitats) → SPECIES diversity (# different species) → GENETIC diversity (how different the genes are). Zoom in each time." },
    { id: "bd-c2", topic: "Big rule", front: "High biodiversity = ?", back: "High ecosystem HEALTH. More variety means more backup when something goes wrong." },
    { id: "bd-c3", topic: "Richness vs evenness", front: "Richness vs evenness?", back: "Richness = COUNT of different species. Evenness = how BALANCED their population sizes are. Hook: richness counts, evenness balances." },
    { id: "bd-c4", topic: "Richness", front: "Why is high richness good?", back: "More species means more resources are available and used, and more roles are filled." },
    { id: "bd-c5", topic: "Evenness", front: "25/25/25/25 vs 6/12/70/12. Same richness. Which is better off?", back: "The 25/25/25/25 community. Same 4 species, but evenly balanced, so it is more even and healthier. One species at 70 percent means low evenness." },
    { id: "bd-c6", topic: "Genetic diversity", front: "Two sources of genetic diversity?", back: "1. Random MUTATIONS in DNA. 2. RECOMBINATION of chromosomes during sexual reproduction." },
    { id: "bd-c7", topic: "Genetic diversity", front: "The potato blight story: what does it prove?", back: "Diverse potatoes: some survive the blight. Cloned potatoes: identical genes, so the whole field dies. Genetic diversity is insurance." },
    { id: "bd-c8", topic: "Bottleneck", front: "Bottleneck effect, in one line?", back: "An environmental disturbance drastically drops population size REGARDLESS of genome. The survivors are random, and genetic diversity is REDUCED." },
    { id: "bd-c9", topic: "Bottleneck", front: "Why is a bottleneck called genetic drift?", back: "Gene frequencies change by RANDOM chance, not by which traits are better. Being the fittest beetle does not save you from a bulldozer." },
    { id: "bd-c10", topic: "Inbreeding", front: "Inbreeding depression?", back: "Organisms mate with CLOSELY RELATED members, so harmful recessive mutations double up. Most likely in SMALL populations." },
    { id: "bd-c11", topic: "Compare", front: "Bottleneck vs inbreeding depression?", back: "Bottleneck = a sudden EVENT that crashes the population. Inbreeding = ongoing harm from a small mating pool. Both shrink genetic diversity." },
    { id: "bd-c12", topic: "Resilience", front: "Ecosystem resilience?", back: "The ability to RETURN TO NORMAL after a disturbance. Bounce-back, not bulletproof." },
    { id: "bd-c13", topic: "Resilience", front: "Finish the heart note: HIGH SPECIES DIVERSITY = ?", back: "MORE ECOSYSTEM RESILIENCE. More species means the jobs of the dead get covered while the system rebuilds." }
  ]
};

window.EXAM_DATA = window.EXAM_DATA || {};
window.EXAM_DATA.domains = window.EXAM_DATA.domains || {};
window.EXAM_DATA.domains["wshed"] = {
  id: "wshed",
  name: "Watersheds",
  short: "Watersheds",
  unit: 4,
  quiz: [
    { id: "ws-q1", topic: "Definition",
      q: "A watershed is:",
      choices: [
        "A storage shed where farmers keep water for their crops and animals",
        "All the land that drains into one body of water, like a river, lake, or bay",
        "Only the water stored underground in an aquifer below a river or lake",
        "Only the river itself, from where it starts to where it reaches the sea"
      ],
      answer: 1,
      explain: "A watershed is ALL the land whose rain and runoff end up in the same river, lake, or bay. Everything that happens on that land eventually reaches the water." },
    { id: "ws-q2", topic: "Definition",
      q: "What mainly determines the boundary of a watershed?",
      choices: ["State borders", "Slope of the land", "Soil color", "Air pressure"],
      answer: 1,
      explain: "Slope decides which way runoff flows. A ridge sends water different directions on each side, so ridges form the edges between watersheds." },
    { id: "ws-q3", topic: "How it drains",
      q: "How does more vegetation affect a watershed?",
      choices: [
        "More runoff and more soil erosion",
        "Faster flooding after heavy rain",
        "More infiltration and groundwater recharge",
        "Less water soaking into the soil"
      ],
      answer: 2,
      explain: "Plants slow the water down and their roots open the soil, so more rain soaks in (infiltration) and refills groundwater (recharge)." },
    { id: "ws-q4", topic: "How it drains",
      q: "A watershed with steep slopes will have:",
      choices: [
        "Faster runoff and more soil erosion",
        "Slower runoff and less erosion",
        "No runoff at all",
        "More groundwater recharge"
      ],
      answer: 0,
      explain: "More slope = water rushes downhill faster, carrying more soil with it, and less time to soak in." },
    { id: "ws-q5", topic: "How it drains",
      q: "A watershed sits on very sandy soil. Compared to clay soil, water will:",
      choices: [
        "Pool on the surface",
        "Drain into the ground more easily",
        "Not move at all",
        "Run off faster on top of the soil"
      ],
      answer: 1,
      explain: "Sand has high permeability, so water drains down into the ground more. Clay's low permeability makes more water run off the surface." },
    { id: "ws-q6", topic: "Chesapeake Bay",
      q: "The Chesapeake Bay watershed covers parts of six states. What makes the bay itself so productive?",
      choices: [
        "It is pure salt water with no rivers",
        "It has almost no nutrients in the water",
        "It mixes fresh water, salt water, and nutrients",
        "It stays frozen most of the year round"
      ],
      answer: 2,
      explain: "The bay is an estuary: rivers bring fresh water and nutrients, and the ocean brings salt water. That mix makes it HIGHLY productive." },
    { id: "ws-q7", topic: "Chesapeake Bay",
      q: "Which is an ecosystem service the Chesapeake Bay provides?",
      choices: [
        "Causing eutrophication",
        "Releasing ozone",
        "Creating rain shadows",
        "Flood control during storms"
      ],
      answer: 3,
      explain: "Your notes list tourism (money), flood control during storms, and water filtration. Eutrophication is a problem, not a service." },
    { id: "ws-q8", topic: "Eutrophication",
      q: "Eutrophication is caused by:",
      choices: [
        "Too little nitrogen and phosphorus in the water",
        "Too much salt washing in from the ocean tides",
        "Too much nitrogen and phosphorus (nutrient pollution)",
        "Cold water upwelling from the bottom of the bay"
      ],
      answer: 2,
      explain: "Eutrophication = TOO MUCH N and P. The extra nutrients feed an algae explosion." },
    { id: "ws-q9", topic: "Eutrophication",
      q: "Put the eutrophication chain in order.",
      choices: [
        "More N and P, more algae, sunlight blocked so plants die, oxygen drops, fish die",
        "Algae die, more N and P, fish die, sunlight blocked so plants grow, oxygen rises",
        "Fish die, more algae, more N and P, oxygen rises, sunlight blocked so plants die",
        "Oxygen rises, more N and P, plants grow, algae shrink, and the fish thrive"
      ],
      answer: 0,
      explain: "N and P up, algae up, algae block the Sun, underwater plants die, decomposers use up the oxygen breaking them down, fish die. Your notes chain it exactly that way." },
    { id: "ws-q10", topic: "Eutrophication",
      q: "In eutrophication, why does the dissolved oxygen in the water DROP?",
      choices: [
        "When plants and algae die, decomposers use up oxygen breaking them down",
        "Living algae breathe in all of the oxygen in the water at once",
        "Nitrogen from the fertilizer reacts with the oxygen and destroys it",
        "Sunlight heats the surface and evaporates the oxygen out of the water"
      ],
      answer: 0,
      explain: "It feels backward since algae make oxygen. But the huge mass of dead plants and algae feeds decomposers, and their respiration uses up the oxygen. Low O2 kills fish." },
    { id: "ws-q11", topic: "Eutrophication",
      q: "Which is a MAJOR source of nitrogen and phosphorus pollution in watersheds?",
      choices: [
        "Synthetic fertilizer",
        "Ozone in the stratosphere",
        "Volcanic ash",
        "Sand from beaches"
      ],
      answer: 0,
      explain: "Synthetic fertilizer and waste (animal waste and sewage treatment) are the major N and P sources in your notes." },
    { id: "ws-q12", topic: "Eutrophication",
      q: "A large cattle farm sits next to a stream. What is the main risk to the stream?",
      choices: [
        "Salt from the cattle feed washing in and raising salinity",
        "Animal waste runoff adding N and P, leading to eutrophication",
        "Cattle drinking so much that the stream dries up completely",
        "Dark manure lowering the albedo, so the stream heats up"
      ],
      answer: 1,
      explain: "Animal waste is loaded with N and P. When it washes into the stream, it fuels algae blooms and oxygen crashes." },
    { id: "ws-q13", topic: "Clearcutting",
      q: "How does clearcutting a forest near a stream increase soil erosion?",
      choices: [
        "Trees produce extra runoff",
        "Stumps release acid",
        "It makes the soil more compacted with roots",
        "No trees means no roots to hold and stabilize the soil"
      ],
      answer: 3,
      explain: "No trees = no roots! Without roots stabilizing the soil, runoff carries it away and deposits it into nearby water." },
    { id: "ws-q14", topic: "Clearcutting",
      q: "Why does clearcutting raise the temperature of the soil and the stream?",
      choices: [
        "Trees store heat in their trunks, and cutting them releases it all",
        "Sawdust from the logging floats on the stream and starts to burn",
        "Clearing the trees moves the watershed closer to the equator",
        "No trees means no shade, and bare soil has low albedo, so it absorbs sunlight"
      ],
      answer: 3,
      explain: "Without shade, sunlight hits the ground directly. Soil has LOW albedo, so it absorbs that light as heat. Warmer water also holds less oxygen." },
    { id: "ws-q15", topic: "Clearcutting",
      q: "Eroded soil washes into a stream after clearcutting. Which is a likely effect on the stream?",
      choices: [
        "Clearer water and more sunlight for plants",
        "Lower water temperature",
        "Cloudier water that blocks sunlight and buries habitat",
        "More dissolved oxygen"
      ],
      answer: 2,
      explain: "Sediment makes the water murky, so less light reaches aquatic plants, and it settles on the bottom, smothering habitat and fish eggs." },
    { id: "ws-q16", topic: "Solutions",
      q: "Planting a strip of trees and plants along a stream bank (a riparian buffer) helps because it:",
      choices: [
        "Adds extra fertilizer to the stream from fallen leaves",
        "Raises the stream temperature by trapping heat",
        "Speeds up runoff so the water reaches the stream sooner",
        "Absorbs runoff and nutrients and holds soil in place"
      ],
      answer: 3,
      explain: "More plants = more roots and more uptake. The buffer catches N, P, and soil before they reach the water, and it shades the stream." },
    { id: "ws-q17", topic: "Solutions",
      q: "Upgrading a sewage treatment plant to remove more nutrients mainly helps by:",
      choices: [
        "Increasing soil erosion along the riverbanks",
        "Controlling N and P levels entering the water",
        "Raising the albedo of the bay so it stays cool",
        "Adding salt to the bay to kill off the algae"
      ],
      answer: 1,
      explain: "Enhanced nutrient removal controls N and P levels at the source, which cuts eutrophication." },
    { id: "ws-q18", topic: "Solutions",
      q: "Which solution targets nutrient pollution from farms?",
      choices: [
        "Animal manure (waste) management and cover crops",
        "Clearcutting the forest",
        "Paving the farm with blacktop",
        "Spreading more synthetic fertilizer"
      ],
      answer: 0,
      explain: "Waste management keeps manure out of streams, and cover crops (more plants) hold soil and soak up extra nutrients." },
    { id: "ws-q19", topic: "Definition",
      q: "A factory dumps pollution into a small creek 100 miles from the Chesapeake Bay. Why could it still harm the bay?",
      choices: [
        "Pollution only travels through the air, so it would have to blow there",
        "It cannot harm the bay, because 100 miles is too far for water to travel",
        "The creek is in the bay's watershed, so its water drains to the bay",
        "Small creeks flow away from bays, so the pollution heads out to sea"
      ],
      answer: 2,
      explain: "Everything in a watershed eventually drains to the same body of water. Distance does not matter if it is downhill and connected." },
    { id: "ws-q20", topic: "Eutrophication",
      q: "Which is NOT a step in eutrophication?",
      choices: [
        "Algae bloom",
        "Sunlight blocked from underwater plants",
        "Fish die",
        "Dissolved oxygen increases"
      ],
      answer: 3,
      explain: "Oxygen DROPS in eutrophication, it does not increase. That low-oxygen water (hypoxia) is what kills the fish." }
  ],
  cards: [
    { id: "ws-c1", topic: "Definition", front: "Watershed?", back: "All the land that drains into one body of water (river, lake, bay). Edges are set by slope." },
    { id: "ws-c2", topic: "How it drains", front: "3 things that control how a watershed drains?", back: "Vegetation (more = more infiltration and groundwater recharge), slope (more = faster runoff and erosion), soil permeability (sand drains more than clay)." },
    { id: "ws-c3", topic: "Chesapeake Bay", front: "Chesapeake Bay watershed?", back: "Six-state region draining into the bay. Mix of fresh water, salt water, and nutrients = highly productive." },
    { id: "ws-c4", topic: "Chesapeake Bay", front: "Chesapeake Bay ecosystem services?", back: "Tourism (money), flood control during storms, water filtration." },
    { id: "ws-c5", topic: "Eutrophication", front: "Eutrophication?", back: "Too much N and P (nutrient pollution) in water, leading to algae blooms and oxygen loss." },
    { id: "ws-c6", topic: "Eutrophication", front: "Eutrophication chain?", back: "More N and P, more algae, sun blocked, plants die, decomposers use up O2, fish die." },
    { id: "ws-c7", topic: "Eutrophication", front: "Major sources of N and P?", back: "Synthetic fertilizer and waste (animal waste, sewage treatment)." },
    { id: "ws-c8", topic: "Clearcutting", front: "Clearcutting and soil erosion?", back: "No trees = no roots to stabilize soil. Runoff carries soil into nearby water." },
    { id: "ws-c9", topic: "Clearcutting", front: "Clearcutting and temperature?", back: "No trees = no shade. Soil has LOW albedo, absorbs sunlight, so soil and stream temps rise." },
    { id: "ws-c10", topic: "Solutions", front: "Solutions for watershed nutrient pollution?", back: "Waste (manure) management, more plants (cover crops, riparian buffers), enhanced nutrient removal at sewage plants. Goal: control N and P levels." }
  ]
};

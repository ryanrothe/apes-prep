window.EXAM_DATA = window.EXAM_DATA || {};
window.EXAM_DATA.domains = window.EXAM_DATA.domains || {};
window.EXAM_DATA.domains["enso"] = {
  id: "enso",
  name: "El Niño & La Niña",
  short: "El Niño",
  unit: 4,
  quiz: [
    { id: "el-q1", topic: "Gyres",
      q: "Gyres are:",
      choices: [
        "Deep cold currents driven only by salt",
        "Small whirlpools near the shore",
        "Large ocean circulation patterns driven by wind",
        "Underwater volcanoes"
      ],
      answer: 2,
      explain: "Gyres are LARGE ocean circulation patterns caused by wind. Trade winds push equatorial water east to west; westerlies push mid-latitude water west to east, closing the loop." },
    { id: "el-q2", topic: "Gyres",
      q: "Between 0 and 30 degrees, the trade winds push equatorial ocean currents:",
      choices: ["West to east", "East to west", "Straight north", "Down to the ocean floor"],
      answer: 1,
      explain: "Trade winds blow east to west, and they drag the surface water the same way." },
    { id: "el-q3", topic: "Upwelling",
      q: "Upwelling is:",
      choices: [
        "Warm water sinking to the ocean floor",
        "Rain falling on the windward side of a mountain",
        "Magma rising at a divergent boundary",
        "Where wind blows warm surface water away, so cold deep water rises up"
      ],
      answer: 3,
      explain: "Wind pushes the warm surface water away from a coast, and cold, nutrient-rich water from below rises to replace it." },
    { id: "el-q4", topic: "Upwelling",
      q: "Why are upwelling zones great for fishing?",
      choices: [
        "The rising water is warmer, and warm water holds more oxygen for fish to breathe",
        "Cold water rising up brings nutrients and holds more oxygen, so phytoplankton thrive and feed the food web",
        "Strong winds there scare away predators, so fish populations grow very large",
        "The rising water is saltier, which helps fish float and saves them energy"
      ],
      answer: 1,
      explain: "Rising cold water carries nutrients from the deep and holds more oxygen. Phytoplankton boom, and everything that eats them follows: productive fishing." },
    { id: "el-q5", topic: "Upwelling",
      q: "Which holds MORE dissolved oxygen?",
      choices: ["Warm water", "They hold the same", "Cold water", "Neither holds oxygen"],
      answer: 2,
      explain: "Cold water holds more oxygen. That is part of why cold upwelling water supports so much life (and why warm water stresses fish)." },
    { id: "el-q6", topic: "Thermohaline",
      q: "Thermohaline circulation is:",
      choices: [
        "An ocean circulation pattern that mixes surface water and deep water, connecting all the oceans",
        "A wind pattern between 30 and 60 degrees that pushes ocean water from west to east",
        "A layer of the atmosphere where warm, salty air rises and cools as it moves",
        "A deep soil horizon where salt and heat build up from the water above it"
      ],
      answer: 0,
      explain: "THERMO (temperature) + HALINE (salt). Differences in temperature and saltiness drive a global loop that mixes surface and deep water and connects all oceans." },
    { id: "el-q7", topic: "Thermohaline",
      q: "In thermohaline circulation, why does water near the poles SINK?",
      choices: [
        "It becomes warm and fresh, so it is lighter",
        "It becomes cold and salty, which makes it more dense",
        "Wind pushes it down",
        "Earthquakes pull it down"
      ],
      answer: 1,
      explain: "Salty + cold = more dense. Dense water sinks, which drives the deep part of the loop." },
    { id: "el-q8", topic: "Thermohaline",
      q: "Put the thermohaline steps in order.",
      choices: [
        "Cold water rises at the pole; it warms and sinks at the equator; it spreads along the surface; it evaporates at upwelling zones",
        "Warm, fresh water sinks in the Gulf of Mexico; it rises near the pole; it spreads along the surface; it sinks again at upwelling zones",
        "Cold water moves from the pole toward the Gulf of Mexico and warms; warm water sinks; it spreads along the deep ocean; it rises at the poles",
        "Warm water moves from the Gulf of Mexico toward the pole and cools; cold, salty water sinks; it spreads along the deep ocean; it rises back up at upwelling zones"
      ],
      answer: 3,
      explain: "1) Warm water from the Gulf of Mexico moves toward the pole, cooling as it goes. 2) Cold, salty, dense water sinks. 3) It spreads along the deep ocean. 4) It rises back up in warm ocean currents at upwelling zones." },
    { id: "el-q9", topic: "ENSO",
      q: "ENSO (El Niño Southern Oscillation) is:",
      choices: [
        "A pattern of shifting atmospheric pressure and ocean currents in the Pacific Ocean",
        "A ring of earthquakes and volcanoes around the edges of the Pacific plate",
        "A dry soil type that forms along the west coast of South America",
        "A layer of the atmosphere above the Pacific where hurricanes form"
      ],
      answer: 0,
      explain: "ENSO = a back-and-forth pattern of air pressure and ocean currents in the Pacific. El Niño and La Niña are its two extremes." },
    { id: "el-q10", topic: "Normal year",
      q: "In a NORMAL year, the trade winds blow Pacific surface water from:",
      choices: [
        "East to west, toward Southeast Asia and Australia",
        "West to east, toward South America",
        "North to south",
        "They do not blow at all"
      ],
      answer: 0,
      explain: "Normal: trade winds push warm surface water east to west. Warm water piles up near SE Asia and Australia, bringing heat and rain there." },
    { id: "el-q11", topic: "Normal year",
      q: "In a normal year, what happens off the west coast of South America?",
      choices: [
        "Warm water piles up and fishing collapses",
        "Hurricanes form every week",
        "The ocean freezes",
        "Cool water upwells, giving cool temperatures and good fishing"
      ],
      answer: 3,
      explain: "With warm water blown away to the west, cold water upwells off South America: cool temps and productive fishing." },
    { id: "el-q12", topic: "El Niño",
      q: "During El Niño, the trade winds:",
      choices: [
        "Weaken and can reverse, blowing west to east",
        "Get stronger than normal, blowing east to west",
        "Stay exactly the same as in a normal year",
        "Turn and blow from north to south instead"
      ],
      answer: 0,
      explain: "El Niño = WEAK winds. Trade winds weaken or reverse, so warm water sloshes back east toward the Americas." },
    { id: "el-q13", topic: "El Niño",
      q: "What happens to upwelling off South America during El Niño?",
      choices: [
        "It gets stronger, so more nutrients rise and fishing improves",
        "Nothing changes, because upwelling does not depend on wind",
        "It is suppressed, so fewer nutrients rise and fishing suffers",
        "It moves over to the Atlantic coast of South America instead"
      ],
      answer: 2,
      explain: "Warm water stays along the South American coast, which suppresses upwelling. Fewer nutrients, fewer fish." },
    { id: "el-q14", topic: "El Niño",
      q: "Which set of effects matches El Niño?",
      choices: [
        "Cool, dry west coast of the Americas; more monsoon rain in SE Asia",
        "Stronger upwelling and better fishing in Peru",
        "More Atlantic hurricanes and tornadoes",
        "More rain and flooding in the Americas; drought in SE Asia and Australia"
      ],
      answer: 3,
      explain: "El Niño brings heat and rain to the Americas (floods) while Australia and SE Asia turn cool and dry (drought)." },
    { id: "el-q15", topic: "El Niño",
      q: "During El Niño, what happens to Atlantic hurricanes and the Asian monsoon?",
      choices: [
        "More hurricanes and stronger monsoon",
        "Fewer hurricanes and weaker monsoon",
        "More hurricanes and weaker monsoon",
        "No effect on either"
      ],
      answer: 1,
      explain: "Your notes list 'less hurricane' and 'less monsoon' under El Niño. La Niña is the opposite: more of both." },
    { id: "el-q16", topic: "La Niña",
      q: "During La Niña, the trade winds are:",
      choices: [
        "Weaker than normal and reversed",
        "Gone completely",
        "Stronger than normal, blowing east to west",
        "Blowing north to south"
      ],
      answer: 2,
      explain: "La Niña = STRONG winds. Stronger-than-normal trade winds push even more warm water west." },
    { id: "el-q17", topic: "La Niña",
      q: "Which set of effects matches La Niña?",
      choices: [
        "Suppressed upwelling, warm water off Peru, and floods in South America",
        "Drought in SE Asia, a weaker monsoon, and fewer Atlantic hurricanes",
        "Extra upwelling, cooler than normal South American coast, warmer and rainier SE Asia",
        "Trade winds reverse and warm water piles up off the coast of Peru"
      ],
      answer: 2,
      explain: "La Niña is normal turned up: extra upwelling and cooler water off South America, extra warmth and rain in SE Asia, stronger monsoon, more Atlantic hurricanes." },
    { id: "el-q18", topic: "La Niña",
      q: "A fishing fleet off Peru has a record catch while Indonesia gets heavy monsoon rains. Which pattern is most likely happening?",
      choices: ["La Niña", "El Niño", "A transform fault", "A rain shadow"],
      answer: 0,
      explain: "Strong upwelling (great fishing) plus extra rain in SE Asia is La Niña. El Niño would mean poor fishing in Peru and drought in Indonesia." },
    { id: "el-q19", topic: "El Niño",
      q: "Peru's anchovy fishery collapses and coastal Ecuador floods, while Australia has a drought. What is most likely going on?",
      choices: ["La Niña", "A normal year", "Thermohaline circulation stopping", "El Niño"],
      answer: 3,
      explain: "Suppressed upwelling (fish crash), rain and flooding in the Americas, and drought in Australia are the El Niño signature." },
    { id: "el-q20", topic: "ENSO",
      q: "What is the key difference between El Niño and La Niña?",
      choices: [
        "El Niño happens in the Atlantic; La Niña in the Pacific",
        "El Niño has weak trade winds; La Niña has strong trade winds",
        "El Niño is about earthquakes; La Niña is about volcanoes",
        "There is no difference"
      ],
      answer: 1,
      explain: "It all starts with the wind. Weak trade winds = El Niño (warm water drifts east). Strong trade winds = La Niña (extra upwelling)." }
  ],
  cards: [
    { id: "el-c1", topic: "Gyres", front: "Gyres?", back: "Large ocean circulation patterns driven by wind. Clockwise in the north, counterclockwise in the south." },
    { id: "el-c2", topic: "Upwelling", front: "Upwelling?", back: "Wind blows warm surface water away; cold, nutrient-rich water rises up. Phytoplankton thrive: productive fishing." },
    { id: "el-c3", topic: "Upwelling", front: "Cold vs warm water: oxygen?", back: "Cold water holds MORE oxygen." },
    { id: "el-c4", topic: "Thermohaline", front: "Thermohaline circulation?", back: "Ocean loop that mixes surface and deep water and connects all the oceans. Driven by temperature (thermo) and salt (haline)." },
    { id: "el-c5", topic: "Thermohaline", front: "Thermohaline steps?", back: "1) Warm Gulf of Mexico water moves toward the pole, cools. 2) Cold + salty = dense, sinks. 3) Spreads along deep ocean. 4) Rises back up at upwelling zones." },
    { id: "el-c6", topic: "ENSO", front: "ENSO?", back: "El Niño Southern Oscillation: pattern of shifting air pressure and ocean currents in the Pacific." },
    { id: "el-c7", topic: "Normal year", front: "Normal year in the Pacific?", back: "Trade winds blow water E to W. Cool upwelling off South America (fishing). Warm current brings heat and rain to SE Asia and Australia." },
    { id: "el-c8", topic: "El Niño", front: "El Niño: winds and ocean?", back: "WEAK trade winds that may reverse (W to E). Warm water stays near the Americas; upwelling suppressed." },
    { id: "el-c9", topic: "El Niño", front: "El Niño effects?", back: "More rain and floods in the Americas. Drought, cool dry conditions in Australia and SE Asia. Fewer Atlantic hurricanes, weaker monsoon. Poor fishing off South America." },
    { id: "el-c10", topic: "La Niña", front: "La Niña: winds and ocean?", back: "STRONGER than normal trade winds, E to W. Extra upwelling; cooler than normal off South America." },
    { id: "el-c11", topic: "La Niña", front: "La Niña effects?", back: "Warmer and rainier SE Asia, stronger monsoon. More Atlantic hurricanes and US tornadoes. Cool and dry west coast of the Americas." },
    { id: "el-c12", topic: "ENSO", front: "El Niño vs La Niña, the short version?", back: "El Niño: weak winds, warm east. La Niña: strong winds, extra upwelling. Hook: La Niña is Normal turned up Loud." }
  ]
};

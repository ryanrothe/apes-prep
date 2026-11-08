window.EXAM_DATA = window.EXAM_DATA || {};
window.EXAM_DATA.domains = window.EXAM_DATA.domains || {};
window.EXAM_DATA.domains["clim"] = {
  id: "clim",
  name: "Earth's Geography & Climate",
  short: "Climate",
  unit: 4,
  quiz: [
    { id: "gc-q1", topic: "Weather vs climate",
      q: "Weather is:",
      choices: [
        "Short-term, daily atmospheric conditions",
        "Long-term averages of temperature and precipitation",
        "The same thing as climate",
        "Only the temperature, never the rain"
      ],
      answer: 0,
      explain: "Weather = SHORT term (today, this week). Climate = LONG term averages of patterns, mainly temperature and precipitation." },
    { id: "gc-q2", topic: "Weather vs climate",
      q: "\"Phoenix averages less than 10 inches of rain per year.\" This statement describes:",
      choices: ["Weather", "Climate", "Albedo", "Insolation"],
      answer: 1,
      explain: "A yearly AVERAGE is a long-term pattern, so it is climate. 'It is raining in Phoenix today' would be weather." },
    { id: "gc-q3", topic: "Weather vs climate",
      q: "Which statement describes WEATHER?",
      choices: [
        "A thunderstorm is expected tomorrow afternoon",
        "Seattle has cool, wet winters",
        "The Sahara gets very little rain each year",
        "The tropics are warm all year"
      ],
      answer: 0,
      explain: "Tomorrow's storm is a short-term condition. The other three are long-term patterns, which is climate." },
    { id: "gc-q4", topic: "Latitude",
      q: "Climate is largely determined by insolation. What climate do places near the equator tend to have?",
      choices: [
        "High temperatures and high precipitation",
        "Cold temperatures and very little rain",
        "Cold temperatures and heavy snowfall",
        "Mild temperatures with almost no rain"
      ],
      answer: 0,
      explain: "More intense insolation at the equator = high temperatures, and the rising Hadley cell air = high precipitation. Think rainforest." },
    { id: "gc-q5", topic: "Latitude",
      q: "Why are higher latitudes cooler?",
      choices: [
        "They have more volcanoes",
        "They are closer to ocean currents",
        "They have more blacktop",
        "They receive less insolation"
      ],
      answer: 3,
      explain: "Higher latitudes get less insolation (slanted rays, more atmosphere), so they are cooler." },
    { id: "gc-q6", topic: "Ocean currents",
      q: "How do ocean currents affect climate?",
      choices: [
        "They have no effect on land, since the heat stays out at sea",
        "They redistribute thermal energy: warm currents heat nearby coasts, cool currents cool them",
        "They only move water around the deep ocean floor, far from coasts",
        "They cause the earthquakes and tsunamis that shape coastal climates"
      ],
      answer: 1,
      explain: "Currents move heat around the planet. A warm current warms the coast next to it; a cool current cools it." },
    { id: "gc-q7", topic: "Ocean currents",
      q: "Western Europe is warmer than other places at the same latitude because a warm current flows nearby from the Gulf of Mexico. This shows that climate depends on:",
      choices: ["Soil horizons", "Ocean currents", "Plate boundaries", "Albedo of snow"],
      answer: 1,
      explain: "Warm currents heat adjacent coastal areas. Geography (where the currents run) matters, not just latitude." },
    { id: "gc-q8", topic: "Heat capacity",
      q: "Water has a high heat capacity. What does that mean?",
      choices: [
        "It warms and cools more slowly than land",
        "It heats up and cools down faster than land",
        "It cannot hold heat at all",
        "It reflects all sunlight"
      ],
      answer: 0,
      explain: "High heat capacity = it takes a lot of energy to change water's temperature, so it warms and cools slower than land. That steadies nearby temperatures." },
    { id: "gc-q9", topic: "Coastal vs inland",
      q: "A coastal (maritime) climate usually has:",
      choices: [
        "Wide swings between hot summers and very cold winters",
        "Moderate, mild temperatures with less seasonal variation",
        "No precipitation ever",
        "The hottest temperatures on Earth"
      ],
      answer: 1,
      explain: "The ocean's high heat capacity keeps coastal temperatures mild, with smaller seasonal swings." },
    { id: "gc-q10", topic: "Coastal vs inland",
      q: "An inland (continental) climate usually has:",
      choices: [
        "Almost no temperature variation",
        "Wider temperature variation",
        "Constant rain",
        "The same climate as the coast"
      ],
      answer: 1,
      explain: "Far from the ocean's buffering, land heats and cools quickly, so inland areas have wider temperature swings: hotter summers, colder winters." },
    { id: "gc-q11", topic: "Coastal vs inland",
      q: "San Francisco (on the coast) and Sacramento (inland) are at nearly the same latitude. Which is most likely true?",
      choices: [
        "San Francisco has much hotter summers because it is on the coast",
        "They have identical climates because they share the same latitude",
        "San Francisco has the more extreme winters because of ocean winds",
        "Sacramento has bigger temperature swings between summer and winter"
      ],
      answer: 3,
      explain: "Same latitude, different geography. The inland city lacks the ocean's moderating effect, so its temperatures swing wider." },
    { id: "gc-q12", topic: "Mountains",
      q: "Mountains affect climate by:",
      choices: [
        "Increasing insolation on both sides equally",
        "Creating ocean currents",
        "Lowering the albedo of nearby oceans",
        "Disrupting wind and producing a rain shadow effect"
      ],
      answer: 3,
      explain: "Mountains block and lift the wind, which creates a wet side and a dry side: the rain shadow effect." },
    { id: "gc-q13", topic: "Rain shadow",
      q: "On the windward side of a mountain:",
      choices: [
        "Warm, moist air from the ocean rises, cools, condenses, and drops rain",
        "Dry air sinks down the slope, so the land there is dry and arid",
        "The mountain blocks all wind, so the air there never moves at all",
        "Sinking air keeps the pressure high, so rain almost never falls"
      ],
      answer: 0,
      explain: "Windward = the side the wind hits first. Moist air is forced up, cools, and the vapor condenses into rain, so this side is lush with more vegetation." },
    { id: "gc-q14", topic: "Rain shadow",
      q: "On the leeward side of a mountain:",
      choices: [
        "Moist air rises up the slope, cools, and drops a lot of rain",
        "Ocean currents carry warm, wet air there, so rainforests grow",
        "Dry air descends down the mountain, leading to dry, arid conditions",
        "The wind hits this side first, so it gets the heaviest rain"
      ],
      answer: 2,
      explain: "The air already dropped its water on the windward side. It sinks down the leeward side dry (and warms as it sinks), so this side is a rain shadow." },
    { id: "gc-q15", topic: "Rain shadow",
      q: "In Washington State, the west side of the Cascade Range is green and rainy while the east side is dry. Winds come off the Pacific from the west. Which side is the rain shadow?",
      choices: ["The west side", "Both sides equally", "The east side", "Neither side"],
      answer: 2,
      explain: "Pacific winds hit the west (windward) side first and drop their rain. The east (leeward) side gets the dry, sinking air: the rain shadow." },
    { id: "gc-q16", topic: "Rain shadow",
      q: "Trade winds blow moist air from the Atlantic west across South America to the Andes. Which side of the Andes gets more rain?",
      choices: [
        "The west (leeward) side",
        "Both sides get the same",
        "The east (windward) side",
        "Neither side gets rain"
      ],
      answer: 2,
      explain: "Easterly trade winds hit the EAST side first, so that is windward and receives more rainfall. The west side, near Peru and Chile, is dry and arid." },
    { id: "gc-q17", topic: "Rain shadow",
      q: "The Atacama Desert in Chile is one of the driest places on Earth. Which TWO factors from your notes explain it?",
      choices: [
        "It is on the windward side of the Andes and near the equator, where rising air is moist",
        "It has high albedo snow cover and a warm ocean current flowing along its coast",
        "It is in the Andes' rain shadow and near 30 degrees, where the Hadley cell brings sinking, dry air",
        "It sits on a divergent plate boundary and has sandy soil with high permeability"
      ],
      answer: 2,
      explain: "Double whammy: leeward of the Andes (rain shadow) AND near 30 degrees, where Hadley cell air descends as high pressure and dry air." },
    { id: "gc-q18", topic: "Rain shadow",
      q: "Why does air drop its moisture as it rises up the windward side?",
      choices: [
        "Rising air warms up, and warm air squeezes the water out as rain",
        "The mountain rock absorbs the water vapor straight out of the air",
        "Ozone at the mountaintop pulls the water vapor out of the air",
        "Rising air cools, and cool air holds less water vapor, so it condenses into rain"
      ],
      answer: 3,
      explain: "Same rule from wind patterns: rising air cools and expands, cool air can hold less vapor, so the vapor condenses and falls as rain." }
  ],
  cards: [
    { id: "gc-c1", topic: "Weather vs climate", front: "Weather vs climate?", back: "Weather = short-term, daily atmospheric conditions. Climate = long-term averages of patterns (temperature and precipitation)." },
    { id: "gc-c2", topic: "Latitude", front: "Latitude and climate?", back: "Equator: more intense insolation, high temp and precipitation. Higher latitudes: less insolation, cooler." },
    { id: "gc-c3", topic: "Ocean currents", front: "Ocean currents and climate?", back: "Redistribute thermal energy. Warm currents heat nearby coasts; cool currents cool them." },
    { id: "gc-c4", topic: "Heat capacity", front: "Why does the ocean moderate climate?", back: "Water has HIGH heat capacity: it warms and cools slower than land." },
    { id: "gc-c5", topic: "Coastal vs inland", front: "Coastal (maritime) vs inland (continental) climate?", back: "Coastal: moderate, mild temps, small seasonal variation. Inland: wider temperature variation." },
    { id: "gc-c6", topic: "Mountains", front: "Mountains and climate?", back: "Disrupt wind and produce the rain shadow effect." },
    { id: "gc-c7", topic: "Rain shadow", front: "Windward side?", back: "Side facing the wind. Warm moist ocean air rises, cools, condenses: RAIN. Lush, more vegetation." },
    { id: "gc-c8", topic: "Rain shadow", front: "Leeward side?", back: "Side away from the wind. Dry air descends down the mountain: dry, arid. This is the rain shadow. Hook: Leeward = Left dry." },
    { id: "gc-c9", topic: "Rain shadow", front: "Andes example?", back: "Trade winds carry Atlantic moisture west. East (windward) side gets rain; west (leeward) side is dry and arid (Atacama Desert)." },
    { id: "gc-c10", topic: "Rain shadow", front: "Why is the Atacama so dry?", back: "Rain shadow of the Andes PLUS sinking, dry, high-pressure Hadley cell air at about 30 degrees." }
  ]
};

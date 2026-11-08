window.EXAM_DATA = window.EXAM_DATA || {};
window.EXAM_DATA.domains = window.EXAM_DATA.domains || {};
window.EXAM_DATA.domains["insol"] = {
  id: "insol",
  name: "Solar Radiation & Seasons",
  short: "Insolation",
  unit: 4,
  quiz: [
    { id: "si-q1", topic: "Insolation",
      q: "Insolation stands for:",
      choices: [
        "Insulated solution",
        "Inside solar layer",
        "Ionized solar nation",
        "Incoming solar radiation"
      ],
      answer: 3,
      explain: "IN-coming SOL-ar radi-ATION. It is the amount of solar radiation reaching an area." },
    { id: "si-q2", topic: "Insolation",
      q: "Insolation is measured in:",
      choices: [
        "Watts per square meter (W/m2)",
        "Degrees Fahrenheit",
        "Kilometers per hour",
        "Parts per million"
      ],
      answer: 0,
      explain: "Insolation is energy per area: watts per square meter. More W/m2 = more intense sunlight on that patch of ground." },
    { id: "si-q3", topic: "Intensity & latitude",
      q: "Which two things does your teacher say solar intensity depends on?",
      choices: [
        "The type of soil and the slope of the land the sunlight lands on",
        "The angle of the Sun's rays and the amount of atmosphere they pass through",
        "How salty the ocean is and how fast the wind is blowing that day",
        "The phase of the Moon and how dark the clouds are overhead"
      ],
      answer: 1,
      explain: "1) Angle: how directly the rays hit. 2) Atmosphere: how much air the light must travel through before reaching the ground." },
    { id: "si-q4", topic: "Intensity & latitude",
      q: "Where on Earth is insolation highest on average?",
      choices: ["The North Pole", "60 degrees latitude", "The equator", "The South Pole"],
      answer: 2,
      explain: "Equator = high insolation. Rays hit nearly straight on, so the energy is concentrated on a small area." },
    { id: "si-q5", topic: "Intensity & latitude",
      q: "Why do high latitudes (near the poles) get less intense sunlight?",
      choices: [
        "They are much farther from the Sun than the equator is, all year",
        "The poles have no atmosphere, so sunlight escapes back to space",
        "Rays hit at a low angle, spreading over a larger area and passing through more atmosphere",
        "Thick ice blocks the sunlight before it can reach the ground there"
      ],
      answer: 2,
      explain: "Think of a flashlight: aimed straight down, a small bright circle; tilted, a big dim oval. At high latitudes the same energy spreads over more ground and loses more in the thicker slice of atmosphere." },
    { id: "si-q6", topic: "Seasons",
      q: "What causes Earth's seasons?",
      choices: [
        "Earth moving closer to the Sun in summer and farther away in winter",
        "Earth's 23.5 degree tilt as it orbits the Sun, changing the angle of the Sun's rays",
        "The Moon blocking part of the sunlight during certain months",
        "The Sun burning hotter in summer and cooler during the winter"
      ],
      answer: 1,
      explain: "Seasons come from TILT, not distance. As Earth orbits, the tilt changes the angle of the rays and the length of the day in each hemisphere." },
    { id: "si-q7", topic: "Seasons",
      q: "Earth's tilt and orbit change the angle of the Sun's rays. Which of these do they cause to vary?",
      choices: [
        "Insolation, length of day, and seasons",
        "Plate movement and earthquakes",
        "Soil texture and pH",
        "The amount of argon in the air"
      ],
      answer: 0,
      explain: "Your notes list exactly three: varying insolation, length of day, and seasons." },
    { id: "si-q8", topic: "Seasons",
      q: "During the June solstice, the Northern Hemisphere is:",
      choices: [
        "Tilted the farthest away from the Sun (winter)",
        "Getting exactly 12 hours of daylight",
        "Tilted the most toward the Sun (summer, longest day)",
        "Closest to the Moon"
      ],
      answer: 2,
      explain: "June solstice: north is max tilted TOWARD the Sun. Summer and the longest day in the north; winter in the south." },
    { id: "si-q9", topic: "Seasons",
      q: "During the December solstice, which statement is true?",
      choices: [
        "The Southern Hemisphere is tilted toward the Sun and has summer",
        "The Northern Hemisphere has its longest day",
        "Every place gets 12 hours of daylight",
        "The Sun is directly over the North Pole"
      ],
      answer: 0,
      explain: "December: north is max tilted AWAY (winter, shortest day), south is max tilted TOWARD (summer). That is why Australia has summer at Christmas." },
    { id: "si-q10", topic: "Seasons",
      q: "At an equinox (March or September):",
      choices: [
        "The Northern Hemisphere is tilted fully toward the Sun and has its longest day",
        "The Southern Hemisphere is tilted away from the Sun and has its shortest day",
        "Earth stops tilting for one day, so the Sun sits directly over the North Pole",
        "The Sun is directly over the equator and both hemispheres get about 12 hours of daylight"
      ],
      answer: 3,
      explain: "Equinox = equal night. Neither hemisphere leans toward the Sun, so the rays hit the equator straight on and everyone gets about 12 hours of day and 12 of dark." },
    { id: "si-q11", topic: "Seasons",
      q: "It is summer in the United States. What season is it in Argentina (Southern Hemisphere)?",
      choices: ["Summer", "Winter", "Spring", "There are no seasons there"],
      answer: 1,
      explain: "When the north tilts toward the Sun, the south tilts away. Opposite hemispheres, opposite seasons." },
    { id: "si-q12", topic: "Albedo",
      q: "Albedo is:",
      choices: [
        "The amount of heat stored by the ocean",
        "The angle of the Sun's rays",
        "The amount of light reflected by a surface",
        "A layer of the atmosphere"
      ],
      answer: 2,
      explain: "Albedo = reflectivity. High albedo bounces light away; low albedo soaks it up as heat." },
    { id: "si-q13", topic: "Albedo",
      q: "Which surface has the HIGHEST albedo?",
      choices: ["Asphalt (blacktop)", "Forest", "Fresh snow", "Open ocean water"],
      answer: 2,
      explain: "Fresh snow reflects about 80 to 95% of sunlight. Asphalt reflects only about 5 to 10%." },
    { id: "si-q14", topic: "Albedo",
      q: "A surface with LOW albedo will:",
      choices: [
        "Reflect less light and absorb more heat",
        "Reflect more light and stay cool",
        "Reflect all light",
        "Have no effect on temperature"
      ],
      answer: 0,
      explain: "Low albedo = reflects less, absorbs more. Water and blacktop are classic low-albedo surfaces, so they heat up." },
    { id: "si-q15", topic: "Albedo",
      q: "Arctic sea ice melts and is replaced by dark open ocean. What happens next?",
      choices: [
        "Albedo rises, the ocean reflects more sunlight, and the area cools",
        "Nothing changes, because water and ice reflect the same amount",
        "Insolation stops reaching the Arctic once the ice is gone",
        "Albedo drops, the ocean absorbs more heat, and even more ice melts"
      ],
      answer: 3,
      explain: "Ice (high albedo) is replaced by water (low albedo). More heat is absorbed, which melts more ice. That loop makes warming speed up." },
    { id: "si-q16", topic: "Albedo",
      q: "How does albedo affect surface temperature?",
      choices: [
        "High albedo surfaces trap the reflected light, so they are always hotter",
        "Surfaces that absorb sunlight give off that energy as heat, so low albedo means hotter surfaces",
        "Albedo only changes the stratosphere, not the temperature at the surface",
        "Albedo has no effect, because temperature only depends on latitude"
      ],
      answer: 1,
      explain: "Absorbed sunlight is re-released as heat (infrared radiation). The more a surface absorbs (low albedo), the hotter it and the air around it get." },
    { id: "si-q17", topic: "Urban heat island",
      q: "Why are cities often hotter than the countryside around them (the urban heat island effect)?",
      choices: [
        "Tall buildings put cities closer to the Sun, so they get more insolation",
        "Cities have more trees, and their leaves trap heat close to the ground",
        "Cities get more rain, and wet pavement holds onto the day's heat",
        "Blacktop and dark roofs have low albedo, so they absorb and release more heat"
      ],
      answer: 3,
      explain: "Urban areas are hot due to the low albedo of blacktop. Less vegetation and lots of pavement mean more sunlight turned into heat." },
    { id: "si-q18", topic: "Urban heat island",
      q: "Which change would best REDUCE a city's urban heat island effect?",
      choices: [
        "Replace parks with parking lots",
        "Paint roofs black",
        "Remove all grass",
        "Use light colored roofs and plant more trees"
      ],
      answer: 3,
      explain: "Light roofs raise albedo (reflect more), and trees add shade. Both cut the heat that pavement would otherwise absorb." },
    { id: "si-q19", topic: "Seasons",
      q: "Earth's axis is tilted about:",
      choices: ["23.5 degrees", "5 degrees", "45 degrees", "90 degrees"],
      answer: 0,
      explain: "23.5 degrees. That tilt is what gives us seasons." },
    { id: "si-q20", topic: "Intensity & latitude",
      q: "Two solar panels get the same sunlight. One faces the Sun straight on; the other is tilted so the light hits at a low angle. Which gets more energy per square meter?",
      choices: [
        "The tilted one",
        "The one facing the Sun straight on",
        "They get exactly the same",
        "Neither gets any energy"
      ],
      answer: 1,
      explain: "Direct rays concentrate energy on a small area, giving more W/m2. A low angle spreads the same light over more area. Same reason the equator beats the poles." }
  ],
  cards: [
    { id: "si-c1", topic: "Insolation", front: "Insolation?", back: "INcoming SOLar radiATION: the amount of solar radiation reaching an area. Measured in W/m2." },
    { id: "si-c2", topic: "Intensity & latitude", front: "Solar intensity depends on?", back: "1) Angle of the rays (how direct). 2) Amount of atmosphere the light passes through." },
    { id: "si-c3", topic: "Intensity & latitude", front: "Equator vs poles: insolation?", back: "Equator = HIGH (direct rays, small area, less atmosphere). Poles = low (slanted rays spread out, more atmosphere)." },
    { id: "si-c4", topic: "Seasons", front: "What causes seasons?", back: "Earth's 23.5 degree TILT as it orbits. Changes the angle of rays, insolation, and day length. NOT distance from the Sun." },
    { id: "si-c5", topic: "Seasons", front: "June solstice?", back: "North tilted most TOWARD the Sun: northern summer, longest day. South: winter." },
    { id: "si-c6", topic: "Seasons", front: "December solstice?", back: "North tilted most AWAY: northern winter, shortest day. South tilted toward: summer." },
    { id: "si-c7", topic: "Seasons", front: "Equinox?", back: "March and September. Sun directly over the equator; both hemispheres equally facing the Sun, about 12 hours of day and night everywhere." },
    { id: "si-c8", topic: "Albedo", front: "Albedo?", back: "Amount of light reflected by a surface. High = reflect more, absorb less heat. Low = reflect less, absorb more heat." },
    { id: "si-c9", topic: "Albedo", front: "High vs low albedo examples?", back: "High: ice, snow (fresh snow 80 to 95%). Low: water, blacktop or asphalt (5 to 10%)." },
    { id: "si-c10", topic: "Urban heat island", front: "Urban heat island?", back: "Cities are hotter than surroundings due to the LOW albedo of blacktop and dark roofs." },
    { id: "si-c11", topic: "Albedo", front: "Why does melting sea ice speed up warming?", back: "High-albedo ice becomes low-albedo water, which absorbs more heat and melts more ice." }
  ]
};

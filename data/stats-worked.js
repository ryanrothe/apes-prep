/* Statistics · Unit 1 · Worked examples. Every problem is one from the retake study guide, solved step by step. */
window.EXAM_DATA = window.EXAM_DATA || {};
window.EXAM_DATA.worked = window.EXAM_DATA.worked || {};
window.EXAM_DATA.worked["stats"] = [
  { id: "w-fivenum", domain: "calc", title: "Five-number summary and IQR from the 12 test grades",
    prompt: "Test grades: 76, 100, 92, 78, 62, 100, 88, 73, 98, 89, 56, 92. Find the median, Q1, Q3, IQR, and range.",
    steps: [
      { h: "Order the data", t: "56, 62, 73, 76, 78, 88, 89, 92, 92, 98, 100, 100. That is 12 values (n = 12)." },
      { h: "Median", t: "Even n, so average the two middle values (6th and 7th): (88 + 89) / 2 = 88.5." },
      { h: "Q1", t: "Lower half: 56, 62, 73, 76, 78, 88. Its middle two are 73 and 76, so Q1 = (73 + 76) / 2 = 74.5." },
      { h: "Q3", t: "Upper half: 89, 92, 92, 98, 100, 100. Its middle two are 92 and 98, so Q3 = (92 + 98) / 2 = 95." },
      { h: "IQR", t: "Q3 - Q1 = 95 - 74.5 = 20.5. That is the width of the middle 50% of the grades." },
      { h: "Range", t: "Max - min = 100 - 56 = 44." }
    ],
    answer: "Five-number summary: 56, 74.5, 88.5, 95, 100. IQR = 20.5. Range = 44." },

  { id: "w-outlier", domain: "box", title: "Outlier check and box plot for the grades",
    prompt: "Using Q1 = 74.5, Q3 = 95, and IQR = 20.5, decide whether 56 or 100 is an outlier, then describe the box plot.",
    steps: [
      { h: "1.5 x IQR", t: "1.5 x 20.5 = 30.75." },
      { h: "Lower fence", t: "Q1 - 30.75 = 74.5 - 30.75 = 43.75." },
      { h: "Upper fence", t: "Q3 + 30.75 = 95 + 30.75 = 125.75." },
      { h: "Compare", t: "The min (56) is above 43.75 and the max (100) is below 125.75. Nothing is outside the fences, so outliers: none." },
      { h: "Draw", t: "Number line 40 to 100 by 10s. Box from 74.5 to 95, line at 88.5, whiskers out to 56 and 100." },
      { h: "Describe (SOCV)", t: "Shape: skewed left (long left whisker, and mean 83.67 is below median 88.5). Center: median 88.5. Variability: IQR 20.5. Outliers: none." }
    ],
    answer: "No outliers. Skewed left, so report the median (88.5) and IQR (20.5), not the mean and standard deviation." },

  { id: "w-sd", domain: "calc", title: "Mean and standard deviation by hand",
    prompt: "Find the mean and standard deviation of 2, 4, 4, 4, 5, 5, 7, 9.",
    steps: [
      { h: "Mean", t: "2 + 4 + 4 + 4 + 5 + 5 + 7 + 9 = 40. Mean = 40 / 8 = 5." },
      { h: "Deviations (value minus mean)", t: "-3, -1, -1, -1, 0, 0, 2, 4." },
      { h: "Square each deviation", t: "9, 1, 1, 1, 0, 0, 4, 16." },
      { h: "Add them up", t: "9 + 1 + 1 + 1 + 0 + 0 + 4 + 16 = 32." },
      { h: "Divide by n - 1", t: "n = 8, so divide by 7: 32 / 7 = 4.571. This number is the variance." },
      { h: "Square root", t: "The square root of 4.571 is about 2.14. That is the standard deviation." }
    ],
    answer: "Mean = 5, standard deviation = 2.14. In words: a typical value sits about 2.1 away from the mean. Your calculator's Sx does the same steps; for the 12 test grades it gives 14.66." },

  { id: "w-relfreq", domain: "freq", title: "Relative frequency from the home run table",
    prompt: "28 American League teams. Find the relative frequency of teams that hit between 50 and 62 home runs, more than 50, and fewer than 40.",
    steps: [
      { h: "Order the data", t: "29, 31, 35, 40, 42, 43, 46, 47, 48, 48, 49, 51, 53, 54, 55, 55, 55, 57, 58, 58, 63, 63, 64, 67, 68, 68, 75, 77. Total = 28." },
      { h: "Between 50 and 62", t: "51, 53, 54, 55, 55, 55, 57, 58, 58. That is 9 teams. 9 / 28 = 0.3214 = 32.14%." },
      { h: "More than 50", t: "Everything from 51 up: 17 teams. 17 / 28 = 0.6071 = 60.71%." },
      { h: "Fewer than 40", t: "29, 31, 35. The team at exactly 40 does NOT count. 3 / 28 = 0.1071 = 10.71%." },
      { h: "Check", t: "More than 50 (17) plus 50 or fewer (11) = 28. The pieces always add back to the total." }
    ],
    answer: "32.14%, 60.71%, and 10.71%. Every relative frequency is a count divided by 28." },

  { id: "w-socv", domain: "socv", title: "Describing the die dot plot with SOCV",
    prompt: "A dot plot shows 18 rolls of a die: two 1s, three 2s, five 3s, three 4s, three 5s, two 6s. Describe the distribution.",
    steps: [
      { h: "List the data in order", t: "1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6 (n = 18)." },
      { h: "Shape", t: "The tallest stack is at 3 and the values thin out toward 6, so the tail points right. Slightly skewed right. (Mean 3.44 > median 3 agrees.)" },
      { h: "Center", t: "Median = average of the 9th and 10th values = (3 + 3) / 2 = 3." },
      { h: "Variability", t: "Q1 = middle of the lower nine = 2. Q3 = middle of the upper nine = 5. IQR = 5 - 2 = 3. Range = 6 - 1 = 5." },
      { h: "Outliers", t: "Fences: 2 - 1.5(3) = -2.5 and 5 + 1.5(3) = 9.5. All rolls (1 to 6) are inside, so none." }
    ],
    answer: "S: skewed right (slightly). C: median of 3. V: IQR = 3. O: none. Four parts, each with a number where one exists." },

  { id: "w-bargraph", domain: "freq", title: "Building the majors bar graph",
    prompt: "Graduating seniors by major: Biomedical 380, Computer Science 126, Electrical 268, Engineering Technology 289, Mechanical 108. Draw the right graph.",
    steps: [
      { h: "Pick the graph", t: "Majors are categories, so this is a bar graph (gaps between bars), not a histogram." },
      { h: "Horizontal axis", t: "One label per major: Biomedical, Comp Sci, Electrical, Eng Tech, Mechanical." },
      { h: "Vertical axis", t: "Frequency (# of seniors), starting at 0 with an even scale: 0, 50, 100, ... 400. The tallest bar is 380, so 400 is enough." },
      { h: "Draw the bars", t: "Heights 380, 126, 268, 289, 108, each with a gap on both sides. Write the count above each bar." },
      { h: "Title", t: "Majors of UNT College of Engineering graduating seniors." },
      { h: "Check", t: "Tallest = Biomedical (380), shortest = Mechanical (108). Total 1,171, so Biomedical is 380 / 1171 = 32.5% of seniors." }
    ],
    answer: "A titled bar graph with gaps, categories along the bottom, and a 0-to-400 frequency scale up the side." }
];

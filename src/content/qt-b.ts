import type { Module } from "./types";

export const qtModulesB: Module[] = [
{
      "num": "2",
      "title": "Measures of Central Tendency and Dispersion",
      "examPattern": "EXAM PATTERN (QT): The real MG3CCRBCA200 paper pattern is UNKNOWN - no Honours model paper and no past BCA paper exists online (first exam 22-10-2025 was never published). Closest evidence: MGU B.Com 'Quantitative Techniques for Business' papers (same university, overlapping statistics syllabus) run 80 marks / 3 hours: Part A answer any 10 x 2 marks = 20 (short theory + one-line numericals), Part B answer any 6 x 5 marks = 30 (medium theory + numericals), Part C answer any 2 x 15 marks = 30 (long numericals: combined mean/SD/CV two-firm problem repeated 3x, Bayes theorem). QT is a 4-credit course, so the Honours paper may instead follow a 70-mark / 2-hour format (like DBMS) - this is NOT confirmed. Prepare every module: Part A 2-mark questions span all modules. ",
      "topics": [
        {
          "title": "Arithmetic Mean",
          "points": [
            "The arithmetic mean (average) is the sum of all values divided by the number of values. xbar = (sum of x) / N.",
            "Individual series: add all items and divide by N. Discrete series: xbar = (sum of f*x) / (sum of f).",
            "Continuous series: use the mid-point m of each class; xbar = (sum of f*m) / (sum of f).",
            "The mean uses every value, so very large or very small values pull it up or down.",
            "Merits: simple to calculate and understand, rigidly defined (two people get the same answer), uses every value, and is the most workable average for further maths like combined means and standard deviation.",
            "Demerits: extreme values spoil it (mean of 2, 3, 4, 5, 86 is 20, which describes nobody); it cannot be found if data is incomplete or has an open-ended class; it cannot be used for qualitative data.",
            "Corrected mean: when a value was wrongly entered, recompute the sum by subtracting the wrong value and adding the correct one, then divide by N again."
          ],
          "questions": [
            {
              "q": "Define arithmetic mean. How is it calculated for individual, discrete and continuous series?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The arithmetic mean is the most common average. It is the sum of all the values divided by the number of values.",
                "Formula: xbar = (sum of x) / N, where N is the total number of observations.",
                "Individual series: simply add all the items and divide by N.",
                "Example: mean of 4, 6, 8 = (4+6+8)/3 = 18/3 = 6.",
                "Discrete series: when each value x has a frequency f, use xbar = (sum of f*x) / (sum of f).",
                "Multiply each value by its frequency, add these products, and divide by the total frequency.",
                "Continuous series: find the mid-point m of each class interval first.",
                "Then use xbar = (sum of f*m) / (sum of f), where f is the class frequency.",
                "The mid-point is calculated as (lower limit + upper limit) / 2.",
                "Every value in the data is used in this average, so it represents the whole group.",
                "In short, the formula changes only in what we multiply: single values, values times frequency, or mid-points times frequency."
              ]
            },
            {
              "q": "Find the mean of 10, 12, 15, 18, 20.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The formula for an individual series is xbar = (sum of x) / N.",
                "Step 1: add all the values.",
                "sum of x = 10 + 12 + 15 + 18 + 20.",
                "= 22 + 15 + 18 + 20.",
                "= 37 + 18 + 20.",
                "= 55 + 20.",
                "= 75.",
                "Step 2: count the values. N = 5.",
                "Step 3: divide the sum by N.",
                "xbar = 75 / 5.",
                "= 15.",
                "Answer: mean = 15."
              ]
            },
            {
              "q": "What are the merits and demerits of the arithmetic mean?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The arithmetic mean is easy to calculate and simple to understand, even for a beginner.",
                "It uses every value in the data, so no information is wasted.",
                "It is rigidly defined, so two people always get the same answer from the same data.",
                "It is useful for further mathematical work like combined means and standard deviation.",
                "Merit summary: simple, stable, and mathematically the most workable average.",
                "The main demerit is that extreme values pull it up or down and spoil it.",
                "Example: mean of 2, 3, 4, 5, 86 is 20, which describes nobody in the group.",
                "It cannot be found if the data is incomplete or has an open-ended class.",
                "It cannot be used for qualitative data like favourite colour or honesty.",
                "So the mean is best when the data is numerical and free from extreme values."
              ]
            },
            {
              "q": "From the following data compute arithmetic mean by direct method: Marks 0-10: 5, 10-20: 10, 20-30: 25, 30-40: 30, 40-50: 20, 50-60: 10 students. (2019)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "For a continuous series the direct method uses class mid-points: Mean = sum(fx) / N.",
                "Mid-points x are 5, 15, 25, 35, 45, 55 for the six classes.",
                "Multiply each mid-point by its frequency: 5x5=25, 15x10=150, 25x25=625, 35x30=1050, 45x20=900, 55x10=550.",
                "Total frequency N = 5+10+25+30+20+10 = 100.",
                "Sum of fx = 25+150+625+1050+900+550 = 3300.",
                "Mean = 3300 / 100 = 33.",
                "Answer: the arithmetic mean is 33 marks."
              ]
            },
            {
              "q": "The mean of 20 values is 45. If one of these values is to be taken 64 instead of 46, find the corrected mean. (2024)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "hint": "This is a corrected-mean problem: one wrong value must be replaced by the correct one.",
              "a": [                "Sum of the 20 values as first computed = 20 x 45 = 900.",
                "Remove the wrong value 46 and add the correct value 64: corrected sum = 900 - 46 + 64 = 918.",
                "The correct value 64 is larger than the wrong value 46, so the mean rises slightly after correction.",
                "Corrected mean = 918 / 20 = 45.9.",
                "Answer: the corrected mean is 45.9."
              ]
            },
            {
              "q": "What is harmonic mean? Find the harmonic mean of 2, 3 and 4.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "hint": "This is a harmonic mean problem: flip each value, average, then flip back.",
              "a": [
                "Harmonic mean is the reciprocal of the arithmetic mean of the reciprocals; for 2, 3 and 4 it is 2.77.",
                "Definition: HM = n / (1/x1 + 1/x2 + ... + 1/xn).",
                "It is the right average for rates and speeds, where the simple mean gives a wrong answer.",
                "Worked: reciprocals are 1/2, 1/3 and 1/4; their sum is 6/12 + 4/12 + 3/12 = 13/12.",
                "HM = 3 / (13/12) = 36/13 = 2.77.",
                "Answer: the harmonic mean of 2, 3 and 4 is 2.77."
              ]
            },
            {
              "q": "A motor car travels 60 km at 30 km/h and returns the same 60 km at 20 km/h. Find the average speed.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "hint": "This is an average-speed problem: use the harmonic mean, not the simple average.",
              "a": [
                "The average speed is 24 km/h.",
                "Time for the forward trip = 60 / 30 = 2 hours; time for the return = 60 / 20 = 3 hours.",
                "Total distance = 60 + 60 = 120 km; total time = 2 + 3 = 5 hours.",
                "Average speed = total distance / total time = 120 / 5 = 24 km/h.",
                "Check with the harmonic mean formula: 2 / (1/30 + 1/20) = 2 / (5/60) = 24.",
                "Note: the simple average (30 + 20) / 2 = 25 is wrong, because more time is spent at the slower speed.",
                "Answer: 24 km/h."
              ]
            },
            {
              "q": "Find the geometric mean of 3, 6, 24 and 48.",
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "years": "P3 2019, P1 2024",
              "hint": "This is a geometric mean problem: multiply all values, then take the nth root.",
              "a": [
                "The geometric mean of 3, 6, 24 and 48 is 12.",
                "Definition: GM = nth root of the product of n values; it suits growth rates and ratios.",
                "Product = 3 x 6 x 24 x 48 = 20736.",
                "GM = 4th root of 20736.",
                "Since 12 x 12 x 12 x 12 = 20736, the 4th root is 12.",
                "Answer: 12."
              ]
            }
          ]
        },
        {
          "title": "Median",
          "points": [
            "The median is the middle value when data is arranged in order. Half the values lie below it, half above.",
            "Odd N: median = value at position (N+1)/2. Even N: average of values at N/2 and (N/2)+1.",
            "For grouped data: Median = l + ((N/2 - cf)/f) x h, where l is the lower limit of the median class (the first class whose cumulative frequency reaches N/2), cf the previous cumulative frequency, f the median-class frequency, and h the class width.",
            "If mid-values are given, first rebuild the classes from the gap between them (gap 10 gives classes 110-120, 120-130 and so on).",
            "The median is not affected by extreme values, so it suits skewed data like incomes."
          ],
          "questions": [
            {
              "q": "Compute median from the following data: Mid-values 115: 6, 125: 25, 135: 48, 145: 72, 155: 116, 165: 60, 175: 38, 185: 22, 195: 3. (2024, 2019)",
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "years": null,
              "a": [
                "When mid-values are given, first reconstruct the classes; the gap between mid-values is 10, so classes are 110-120, 120-130, up to 190-200.",
                "Total frequency N = 6+25+48+72+116+60+38+22+3 = 390, so N/2 = 195.",
                "Cumulative frequencies: 6, 31, 79, 151, 267, 327, 365, 387, 390.",
                "The median class is the first class whose cumulative frequency reaches 195, which is 140-150.",
                "Here l = 140, previous cf = 151, f = 116, class width h = 10.",
                "Median = l + ((N/2 - cf)/f) x h = 140 + ((195-151)/116) x 10 = 140 + 3.79 = 143.79.",
                "Answer: the median is 143.79."
              ]
            },
            {
              "q": "Define median. Find the median of 5, 8, 12, 15, 22.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The median is the middle value of a dataset when all values are arranged in ascending order.",
                "Half the observations lie below the median and half lie above it.",
                "Odd N: median = the value at position (N+1)/2.",
                "Even N: median = average of the values at positions N/2 and (N/2)+1.",
                "Now find the median of 5, 8, 12, 15, 22.",
                "The data is already arranged in order.",
                "N = 5, which is odd.",
                "Position of median = (5+1)/2 = 6/2 = 3rd value.",
                "The 3rd value in 5, 8, 12, 15, 22 is 12.",
                "Answer: median = 12."
              ]
            },
            {
              "q": "Find the median of 4, 8, 10, 14.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The data 4, 8, 10, 14 is already in ascending order.",
                "N = 4, which is even, so the median is the average of the two middle values.",
                "The two middle positions are N/2 = 2nd value and (N/2)+1 = 3rd value.",
                "2nd value = 8 and 3rd value = 10.",
                "Median = (8 + 10) / 2.",
                "= 18 / 2.",
                "= 9.",
                "Answer: median = 9."
              ]
            },
            {
              "q": "Why is the median preferred over the mean for income data?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Income data is highly skewed because a few people earn very high incomes.",
                "These few extreme incomes pull the arithmetic mean upward, far above what most people earn.",
                "The median is not affected by extreme values because it depends only on the middle position.",
                "So the median shows the income of the typical person much better than the mean.",
                "Example: incomes 10, 12, 15, 18, 200 (in thousands) give mean 51 but median 15.",
                "The median 15 clearly describes the common man, while the mean 51 misleads.",
                "That is why the median is the preferred average for income and wealth data."
              ]
            }
          ]
        },
        {
          "title": "Mode",
          "points": [
            "The mode is the value that occurs most often in the data.",
            "A dataset can have one mode, two modes (bimodal) or no mode at all.",
            "The mode is the only average that works for qualitative data like favourite colour; use it whenever the question is about the most frequent item.",
            "For grouped data: first convert any cumulative table to ordinary frequencies by subtraction; the modal class is the class with the highest frequency.",
            "Formula: Mode = l + ((f1-f0)/(2f1-f0-f2)) x h, where f1 is the modal-class frequency and f0, f2 are the frequencies of the previous and next classes."
          ],
          "questions": [
            {
              "q": "Define mode. Find the mode of 2, 3, 3, 5, 7, 3.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The mode is the value that occurs most frequently in a dataset.",
                "It is the value around which the maximum number of items cluster.",
                "A dataset may have one mode, more than one mode, or no mode at all.",
                "Now find the mode of 2, 3, 3, 5, 7, 3.",
                "Count how many times each value appears.",
                "2 appears once, 3 appears three times, 5 appears once, 7 appears once.",
                "The value with the highest frequency is 3.",
                "Answer: mode = 3."
              ]
            },
            {
              "q": "When is the mode the best average to use?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The mode is the best average when we want the most common or most popular value.",
                "It is the only average that can be used for qualitative data.",
                "Example: the most popular shirt size, the most liked colour, or the most common shoe size cannot be averaged by mean or median.",
                "It is also useful when we need a quick, rough average without calculation.",
                "Example: a shopkeeper wants to know which size sells most, so he uses the mode.",
                "So use the mode whenever the question is about the most frequent item."
              ]
            },
            {
              "q": "Calculate mode from the following: Marks (Above) 0: 122, 10: 118, 20: 112, 30: 92, 40: 60, 50: 27, 60: 10, 70: 2, 80: 0 students. (2024)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "hint": "This is a 'marks above' cumulative table; first convert it to ordinary frequencies by subtraction.",
              "a": [                "0-10: 122-118 = 4; 10-20: 118-112 = 6; 20-30: 112-92 = 20; 30-40: 92-60 = 32.",
                "40-50: 60-27 = 33; 50-60: 27-10 = 17; 60-70: 10-2 = 8; 70-80: 2-0 = 2.",
                "The modal class is 40-50 with the highest frequency 33.",
                "Mode = l + ((f1-f0)/(2f1-f0-f2)) x h = 40 + ((33-32)/(66-32-17)) x 10.",
                "This gives 40 + (1/17) x 10 = 40 + 0.59 = 40.59.",
                "Answer: the mode is 40.59 marks."
              ]
            }
          ]
        },
        {
          "title": "Empirical Relationship between Mean, Median and Mode",
          "points": [
            "For a moderately skewed distribution: Mode = 3*Median - 2*Mean.",
            "This lets you find any one of the three if the other two are known.",
            "It is called empirical because it comes from observation, not from a strict proof."
          ],
          "questions": [
            {
              "q": "State the empirical relationship between mean, median and mode.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "For a moderately skewed distribution, the three averages are connected by an empirical formula.",
                "Formula: Mode = 3*Median - 2*Mean.",
                "It is called empirical because it comes from observed data, not from a strict mathematical proof.",
                "It works only for moderately skewed distributions.",
                "If any two of the three are known, the third can be found using this relation.",
                "Example: if mean = 20 and median = 18, then mode = 3*18 - 2*20.",
                "= 54 - 40.",
                "= 14.",
                "So the mode is 14."
              ]
            },
            {
              "q": "If mean = 20 and median = 18, find the mode.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The empirical relationship is: Mode = 3*Median - 2*Mean.",
                "Given: mean = 20 and median = 18.",
                "Substitute the values.",
                "Mode = 3*18 - 2*20.",
                "Step 1: multiply. 3*18 = 54.",
                "Step 2: multiply. 2*20 = 40.",
                "Step 3: subtract. 54 - 40 = 14.",
                "Answer: mode = 14."
              ]
            }
          ]
        },
        {
          "title": "Graphical Location of Median and Mode",
          "points": [
            "The median is found graphically from ogives: draw less-than and more-than ogives; they cross at the median.",
            "The mode is found from a histogram: take the tallest bar and join its top corners to the neighbouring bars to locate the modal value.",
            "Graphical methods are useful when exact calculation is long."
          ],
          "questions": [
            {
              "q": "How do you locate the median graphically?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Draw the less-than ogive (cumulative frequency plotted against upper class limits).",
                "On the same graph, draw the more-than ogive (cumulative frequency against lower class limits).",
                "Find the point where the two ogives intersect each other.",
                "From that intersection point, drop a vertical line down to the x-axis.",
                "The value on the x-axis where this line touches is the median.",
                "This works because both ogives meet exactly at the N/2th value.",
                "Graphical median is useful when the data is grouped in classes."
              ]
            },
            {
              "q": "How do you locate the mode graphically?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "First draw the histogram of the frequency distribution.",
                "Find the tallest bar; it represents the modal class, where the mode lies.",
                "Join the top-left corner of this tallest bar to the top-left corner of the next bar.",
                "Join the top-right corner of the tallest bar to the top-right corner of the previous bar.",
                "The two lines cross at a point above the modal class.",
                "From this crossing point, drop a vertical line down to the x-axis.",
                "The value where the line meets the x-axis is the mode.",
                "This method is used when exact calculation is long."
              ]
            }
          ]
        },
        {
          "title": "Combined Mean and Weighted Mean",
          "points": [
            "Combined mean joins two or more groups: xbar12 = (n1*xbar1 + n2*xbar2) / (n1 + n2).",
            "The combined mean lies between the two group means, closer to the larger group's mean.",
            "A combined-mean problem can also be solved backwards: from the overall total subtract the known groups' totals to find the missing group's mean.",
            "Weighted mean gives some items more importance: xbar_w = (sum of w*x) / (sum of w).",
            "Use the weighted mean when items are not equally important, like exam marks with different weightage.",
            "Weights may first have to be derived from the data, e.g. number of workers = total working hours / average hours per worker."
          ],
          "questions": [
            {
              "q": "Find the weighted mean of prices 10, 20, 30 with weights 2, 3, 5. (2019, 2022)",
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "years": null,
              "a": [
                "The formula for weighted mean is xbar_w = (sum of w*x) / (sum of w).",
                "Given: prices x = 10, 20, 30 with weights w = 2, 3, 5.",
                "Step 1: multiply each price by its weight.",
                "10*2 = 20.",
                "20*3 = 60.",
                "30*5 = 150.",
                "Step 2: add the products. 20 + 60 + 150 = 230.",
                "Step 3: add the weights. 2 + 3 + 5 = 10.",
                "Step 4: divide. 230 / 10 = 23.",
                "Answer: weighted mean = 23."
              ]
            },
            {
              "q": "The following data gives the weekly wages of workers in a firm, their total working hours and the average working hours per worker. Calculate the average weekly wage per worker. Wages Rs 80-100: total hours 168, avg hours 12; 100-120: 170, 10; 120-140: 225, 9; 140-160: 272, 8.5; 160-180: 126, 7; 180-200: 91, 6.5. (2019, 2022)",
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "years": null,
              "hint": "This is a weighted-mean problem: first find the number of workers in each wage group.",
              "a": [                "Workers = total hours / average hours: 168/12 = 14, 170/10 = 17, 225/9 = 25, 272/8.5 = 32, 126/7 = 18, 91/6.5 = 14.",
                "Total workers = 14+17+25+32+18+14 = 120.",
                "Take wage mid-points 90, 110, 130, 150, 170, 190 as the values and worker counts as weights.",
                "Weighted total = 90x14 + 110x17 + 130x25 + 150x32 + 170x18 + 190x14 = 1260+1870+3250+4800+3060+2660 = 16900.",
                "Average weekly wage = 16900 / 120 = 140.83.",
                "Answer: the average weekly wage per worker is Rs. 140.83."
              ]
            },
            {
              "q": "Find the combined mean: group 1 has 30 students with mean 60, group 2 has 20 students with mean 70.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The combined mean merges two groups into one single average, giving each group's mean a weight equal to its size.",
                "Formula: xbar12 = (n1*xbar1 + n2*xbar2) / (n1 + n2), where n1 and n2 are the group sizes and xbar1, xbar2 are their means.",
                "Here n1 = 30, xbar1 = 60 for group 1, and n2 = 20, xbar2 = 70 for group 2.",
                "Substituting the values: xbar12 = (30*60 + 20*70) / (30 + 20).",
                "First multiply: 30*60 = 1800 and 20*70 = 1400.",
                "Then add: 1800 + 1400 = 3200, and total students = 30 + 20 = 50.",
                "So xbar12 = 3200 / 50 = 64.",
                "Answer: combined mean = 64.",
                "The combined mean lies between the two group means, closer to 60 because the larger group of 30 students carries more weight."
              ]
            },
            {
              "q": "Distinguish between combined mean and weighted mean.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The combined mean joins the means of two or more groups into one overall mean.",
                "The weighted mean joins values where each value is given an importance weight.",
                "In the combined mean, the group sizes n1, n2 act as the weights automatically.",
                "In the weighted mean, the weights are chosen by us to show importance.",
                "Formula for combined mean: xbar12 = (n1*xbar1 + n2*xbar2) / (n1 + n2).",
                "Formula for weighted mean: xbar_w = (sum of w*x) / (sum of w).",
                "Example of combined mean: average marks of two classes of different sizes.",
                "Example of weighted mean: exam subjects with different weightage, like 40% for internals and 60% for finals.",
                "So the combined mean merges groups, while the weighted mean stresses important items."
              ]
            },
            {
              "q": "The mean age of a group of 100 children was 9.35 years. The mean age of 25 of them was 8.75 years and that of another 65 was 10.51 years. What was the mean age for the remainder? (2024)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "hint": "This is a combined-mean problem solved backwards to find the missing group's mean.",
              "a": [                "Total age of all 100 children = 100 x 9.35 = 935 years.",
                "Total age of the 25 children = 25 x 8.75 = 218.75 years.",
                "Total age of the 65 children = 65 x 10.51 = 683.15 years.",
                "Number in the remainder group = 100 - 25 - 65 = 10 children.",
                "Their total age = 935 - 218.75 - 683.15 = 33.10 years.",
                "Mean age of the remainder = 33.10 / 10 = 3.31 years.",
                "Answer: the mean age of the remaining 10 children is 3.31 years."
              ]
            }
          ]
        },
        {
          "title": "Partition Values: Quartiles, Deciles, Percentiles",
          "points": [
            "Quartiles divide ordered data into 4 equal parts: Q1 (25%), Q2 = median (50%), Q3 (75%).",
            "Deciles divide data into 10 parts (D1 to D9); percentiles into 100 parts (P1 to P99).",
            "In ordered data, Q1 is the (N+1)/4th value and Q3 is the 3*(N+1)/4th value.",
            "Note: Q2 = D5 = P50 = median; all of them mark the middle of the data."
          ],
          "questions": [
            {
              "q": "Define quartiles, deciles and percentiles.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Quartiles divide the ordered data into 4 equal parts: Q1, Q2, Q3.",
                "Q1 is the first quartile; 25% of values lie below it and 75% above it.",
                "Q2 is the second quartile; it is exactly the median, with 50% on each side.",
                "Q3 is the third quartile; 75% of values lie below it and 25% above it.",
                "Deciles divide the ordered data into 10 equal parts, named D1 to D9.",
                "Example: D5 is the 5th decile, which is also the median.",
                "Percentiles divide the ordered data into 100 equal parts, named P1 to P99.",
                "Example: P50 is the 50th percentile, which is also the median.",
                "So Q2 = D5 = P50 = median, and all these values show how the data is spread."
              ]
            },
            {
              "q": "Find Q1 and Q3 of 3, 7, 8, 12, 15, 18, 21.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The data 3, 7, 8, 12, 15, 18, 21 is already in ascending order.",
                "N = 7.",
                "Formula: Q1 is the value at position (N+1)/4.",
                "Q1 position = (7+1)/4 = 8/4 = 2nd value.",
                "The 2nd value is 7.",
                "Formula: Q3 is the value at position 3*(N+1)/4.",
                "Q3 position = 3*(7+1)/4 = 3*8/4 = 24/4 = 6th value.",
                "The 6th value is 18.",
                "Answer: Q1 = 7 and Q3 = 18."
              ]
            }
          ]
        },
        {
          "title": "Range, Quartile Deviation and Mean Deviation",
          "points": [
            "Range = maximum value - minimum value. It is the simplest measure of dispersion.",
            "Quartile deviation (QD) = (Q3 - Q1) / 2. It covers the middle 50% of data and ignores extreme values.",
            "Mean deviation (MD) = (sum of |x - average|) / N, taken about the mean or median; the absolute bars mean we ignore the sign.",
            "For grouped data: first find the mean using class mid-points, then MD = sum(f x |x - mean|) / N.",
            "Relative versions (coefficient of range, QD, MD) let you compare datasets; coefficient of mean deviation = MD / mean."
          ],
          "questions": [
            {
              "q": "Find the range and quartile deviation of 3, 7, 8, 12, 15, 18, 21. (2024, 2022, 2019)",
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "years": null,
              "a": [
                "Range = maximum value - minimum value.",
                "Here, maximum = 21 and minimum = 3.",
                "Range = 21 - 3.",
                "= 18.",
                "Answer: range = 18.",
                "Quartile deviation formula: QD = (Q3 - Q1) / 2.",
                "For this data, Q1 = 7 and Q3 = 18 (found from the quartile positions).",
                "QD = (18 - 7) / 2.",
                "= 11 / 2.",
                "= 5.5.",
                "Answer: quartile deviation = 5.5."
              ]
            },
            {
              "q": "Define range, quartile deviation and mean deviation with formulas.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The range is the simplest measure of dispersion.",
                "Formula: Range = maximum value - minimum value.",
                "It shows the total spread of the data in one figure.",
                "The quartile deviation covers only the middle 50% of the data.",
                "Formula: QD = (Q3 - Q1) / 2.",
                "It is half of the inter-quartile range and ignores extreme values.",
                "The mean deviation is the average of the absolute deviations from an average.",
                "Formula: MD = (sum of |x - xbar|) / N, taken about the mean.",
                "Absolute bars mean we ignore the sign and only take the size of each deviation.",
                "Together, range gives total spread, QD gives middle spread, and MD gives average spread."
              ]
            },
            {
              "q": "Find the mean deviation about the mean for 4, 6, 8, 10, 12.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Mean deviation about the mean: MD = (sum of |x - xbar|) / N.",
                "Step 1: find the mean.",
                "xbar = (4 + 6 + 8 + 10 + 12) / 5.",
                "= 40 / 5.",
                "= 8.",
                "Step 2: find the absolute deviation of each value from 8.",
                "|4 - 8| = |-4| = 4.",
                "|6 - 8| = |-2| = 2.",
                "|8 - 8| = |0| = 0.",
                "|10 - 8| = |2| = 2.",
                "|12 - 8| = |4| = 4.",
                "Step 3: add the absolute deviations.",
                "4 + 2 + 0 + 2 + 4 = 12.",
                "Step 4: divide by N = 5.",
                "MD = 12 / 5.",
                "= 2.4.",
                "Answer: mean deviation about the mean = 2.4."
              ]
            },
            {
              "q": "Calculate mean deviation and its co-efficient: Marks 0-10: 4, 10-20: 6, 20-30: 10, 30-40: 20, 40-50: 10, 50-60: 6, 60-70: 4 students. (2022)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Mean deviation about the mean = sum(f x |x - mean|) / N; first find the mean using mid-points.",
                "Mid-points are 5, 15, 25, 35, 45, 55, 65 with frequencies 4, 6, 10, 20, 10, 6, 4; N = 60.",
                "fx values: 20, 90, 250, 700, 450, 330, 260; sum = 2100, so mean = 2100/60 = 35.",
                "Deviations |x-35| are 30, 20, 10, 0, 10, 20, 30.",
                "f|x-mean| values: 120, 120, 100, 0, 100, 120, 120; sum = 680.",
                "Mean deviation = 680/60 = 11.33.",
                "Co-efficient of mean deviation = MD / mean = 11.33/35 = 0.32.",
                "Answer: mean deviation = 11.33 and its co-efficient = 0.32."
              ]
            },
            {
              "q": "Calculate mean deviation from mean from the following data: Age 0-10: 6, 10-20: 5, 20-30: 8, 30-40: 15, 40-50: 7, 50-60: 6, 60-70: 3 persons. (2024)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "First find the mean with class mid-points 5, 15, 25, 35, 45, 55, 65 and frequencies 6, 5, 8, 15, 7, 6, 3; N = 50.",
                "fx values: 30, 75, 200, 525, 315, 330, 195; sum = 1670, so mean = 1670/50 = 33.4.",
                "Deviations |x-33.4| are 28.4, 18.4, 8.4, 1.6, 11.6, 21.6, 31.6.",
                "f|x-mean| values: 170.4, 92.0, 67.2, 24.0, 81.2, 129.6, 94.8; sum = 659.2.",
                "Mean deviation = 659.2/50 = 13.18.",
                "Answer: the mean deviation from mean is 13.18 years."
              ]
            },
            {
              "q": "Define dispersion.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Dispersion measures how spread out the data values are around the average.",
                "An average alone can mislead: two classes can have the same mean marks but very different spreads.",
                "Common measures of dispersion are range, quartile deviation, mean deviation and standard deviation.",
                "Low dispersion means the data is consistent; high dispersion means it varies widely."
              ]
            }
          ]
        },
        {
          "title": "Standard Deviation, Variance and Coefficient of Variation",
          "points": [
            "Standard deviation: SD = sqrt( sum((x - xbar)^2) / N ). It is the best and most used measure of dispersion.",
            "Variance = (SD)^2 = sum((x - xbar)^2) / N.",
            "When only totals are known: SD = sqrt[(sum x-square / n) - (sum x / n)^2].",
            "Coefficient of variation: CV = (SD / xbar) * 100. It compares the spread of two datasets; lower CV means more consistent.",
            "Combined mean of two groups: xbar12 = (n1*xbar1 + n2*xbar2) / (n1 + n2).",
            "Combined variance = [n1(SD1^2 + d1^2) + n2(SD2^2 + d2^2)] / (n1+n2), where d1, d2 are the deviations of each group's mean from the combined mean; combined SD = sqrt(combined variance).",
            "SD is in the same units as the data; variance is in squared units."
          ],
          "questions": [
            {
              "q": "An analysis of monthly wages paid to workers in two firms A and B gives: Firm A - 550 workers, average wage 50, SD 90; Firm B - 650 workers, average wage 45, SD 120. (1) Which firm pays larger total monthly wages? (2) Find the combined mean and combined SD. (3) In which firm is there greater variability? (2024, 2019, 2022)",
              "tags": [
                "SURE MARK"
              ],
              "tagBase": "SURE MARK",
              "years": null,
              "hint": "This is the most repeated QT numerical: combined mean, combined SD and coefficient of variation together.",
              "a": [                "(1) Total wages: Firm A = 550 x 50 = 27,500; Firm B = 650 x 45 = 29,250. So Firm B pays the larger total monthly wage.",
                "(2) Combined mean = (27500 + 29250) / 1200 = 56750/1200 = 47.29.",
                "For combined SD use: variance = [n1(SD1^2 + d1^2) + n2(SD2^2 + d2^2)] / (n1+n2), where d1, d2 are deviations of group means from the combined mean.",
                "d1 = 50 - 47.29 = 2.71 and d2 = 45 - 47.29 = -2.29.",
                "Numerator = 550 x (8100 + 7.34) + 650 x (14400 + 5.24) = 4459039 + 9363409 = 13822448.",
                "Combined variance = 13822448 / 1200 = 11518.71, so combined SD = sqrt(11518.71) = 107.33.",
                "(3) CV of A = (90/50) x 100 = 180%; CV of B = (120/45) x 100 = 266.67%. Greater variability is in Firm B.",
                "Answer: (1) Firm B; (2) combined mean 47.29, combined SD 107.33; (3) Firm B is more variable."
              ]
            },
            {
              "q": "What is the coefficient of variation? If SD = 4 and mean = 20, find CV. (2024, 2018)",
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "years": null,
              "a": [
                "The coefficient of variation is a relative measure of dispersion.",
                "Definition: it expresses the standard deviation as a percentage of the mean.",
                "Formula: CV = (SD / xbar) * 100.",
                "It has no units, so it can compare two datasets with different units or means.",
                "A lower CV means the data is more consistent; a higher CV means more variation.",
                "Now find CV when SD = 4 and mean = 20.",
                "CV = (4 / 20) * 100.",
                "= 0.2 * 100.",
                "= 20.",
                "Answer: CV = 20%."
              ]
            },
            {
              "q": "Define standard deviation and variance with formulas.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The standard deviation measures how far the values are spread from the mean.",
                "Definition: SD is the square root of the average of the squared deviations from the mean.",
                "Formula: SD = sqrt( sum((x - xbar)^2) / N ).",
                "It is the best and most widely used measure of dispersion.",
                "SD is measured in the same units as the original data.",
                "The variance is simply the square of the standard deviation.",
                "Formula: Variance = sum((x - xbar)^2) / N = (SD)^2.",
                "Variance is measured in squared units, like square rupees.",
                "So SD gives spread in original units, and variance gives spread in squared units."
              ]
            },
            {
              "q": "Find the SD and variance of 2, 4, 6, 8, 10.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Step 1: find the mean.",
                "xbar = (2 + 4 + 6 + 8 + 10) / 5.",
                "= 30 / 5.",
                "= 6.",
                "Step 2: find the squared deviation of each value from 6.",
                "(2 - 6)^2 = (-4)^2 = 16.",
                "(4 - 6)^2 = (-2)^2 = 4.",
                "(6 - 6)^2 = 0^2 = 0.",
                "(8 - 6)^2 = 2^2 = 4.",
                "(10 - 6)^2 = 4^2 = 16.",
                "Step 3: add the squared deviations.",
                "16 + 4 + 0 + 4 + 16 = 40.",
                "Step 4: variance = sum of squared deviations / N = 40 / 5 = 8.",
                "Step 5: SD = sqrt(variance) = sqrt(8).",
                "sqrt(8) = 2.83 approx.",
                "Answer: variance = 8 and SD = 2.83."
              ]
            },
            {
              "q": "Two factories have CV 12% and 18%. Which is more consistent?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The coefficient of variation measures consistency: lower CV means less variation and more consistency.",
                "Factory 1 has CV = 12%, factory 2 has CV = 18%.",
                "12% is smaller than 18%, so factory 1 has less relative variation.",
                "Less variation means the performance of factory 1 is more stable and uniform.",
                "Therefore the factory with CV 12% is more consistent.",
                "Answer: the factory with CV 12% is more consistent."
              ]
            },
            {
              "q": "If n = 10, sum x = 60, sum x-square = 1,000, calculate standard deviation. (2024)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "When only the sums are given, use the formula SD = sqrt[(sum x-square / n) - (sum x / n)^2].",
                "sum x-square / n = 1000/10 = 100.",
                "sum x / n = 60/10 = 6, and its square is 36.",
                "Variance = 100 - 36 = 64.",
                "SD = sqrt(64) = 8.",
                "Answer: the standard deviation is 8."
              ]
            }
          ]
        }
      ]
    },
{
      "num": "3",
      "title": "Correlation and Regression",
      "examPattern": "EXAM PATTERN (QT): The real MG3CCRBCA200 paper pattern is UNKNOWN - no Honours model paper and no past BCA paper exists online (first exam 22-10-2025 was never published). Closest evidence: MGU B.Com 'Quantitative Techniques for Business' papers (same university, overlapping statistics syllabus) run 80 marks / 3 hours: Part A answer any 10 x 2 marks = 20 (short theory + one-line numericals), Part B answer any 6 x 5 marks = 30 (medium theory + numericals), Part C answer any 2 x 15 marks = 30 (long numericals: combined mean/SD/CV two-firm problem repeated 3x, Bayes theorem). QT is a 4-credit course, so the Honours paper may instead follow a 70-mark / 2-hour format (like DBMS) - this is NOT confirmed. Prepare every module: Part A 2-mark questions span all modules. ",
      "topics": [
        {
          "title": "Correlation: Definition and Types",
          "points": [
            "Correlation measures how strongly two variables move together.",
            "Positive: both rise together, like height and weight. Negative: one rises while the other falls, like price and demand. Zero: no relation, like shoe size and marks.",
            "Linear correlation follows a straight-line pattern; non-linear follows a curve.",
            "Correlation lies between -1 and +1; its significance is that it lets us predict one variable from another and discover hidden relationships before taking decisions.",
            "Correlation does NOT imply cause and effect: two variables can move together because of a third common cause, e.g. ice-cream sales and drowning deaths both rise in summer.",
            "Such misleading cases are called spurious or nonsense correlation; a high correlation is a clue, not a proof, and causation needs separate controlled study."
          ],
          "questions": [
            {
              "q": "Define correlation and explain its types with examples.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Correlation is a statistical measure that shows how strongly two variables move together.",
                "It tells us whether a change in one variable is linked with a change in the other.",
                "Positive correlation: both variables increase together. Example: height and weight of students.",
                "Negative correlation: one variable increases while the other decreases. Example: price of a product and its demand.",
                "Zero correlation: there is no relationship between the two variables. Example: shoe size and exam marks.",
                "The value of correlation lies between -1 and +1.",
                "Correlation is a very useful tool in business, economics and science to find hidden relationships."
              ]
            },
            {
              "q": "Distinguish between linear and non-linear correlation.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Linear correlation exists when the two variables change in a constant ratio.",
                "In linear correlation the points on a scatter diagram lie close to a straight line.",
                "Example: if income rises by Rs. 1000 every year and savings rise by Rs. 200 every year, the relation is linear.",
                "Non-linear correlation exists when the ratio of change between the two variables is not constant.",
                "In non-linear correlation the points on a scatter diagram form a curve, not a straight line.",
                "Example: at first a small rise in advertising gives a big rise in sales, but later extra advertising gives very little extra sales.",
                "So the key difference is a straight-line pattern versus a curved pattern."
              ]
            },
            {
              "q": "Explain the meaning and significance of the concept of correlation. Does it always imply cause and effect? (2024)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Correlation measures the strength and direction of the linear relationship between two variables, with r lying between -1 and +1.",
                "It is significant because it lets us predict one variable from another, like estimating sales from advertising spend.",
                "It helps managers, scientists and economists discover hidden relationships in data before taking decisions.",
                "However, correlation does NOT always imply cause and effect.",
                "Two variables can move together because of a third common cause: ice-cream sales and drowning deaths both rise in summer, but one does not cause the other.",
                "Such misleading cases are called spurious or nonsense correlation.",
                "Therefore a high correlation is a clue, not a proof; causation needs controlled study.",
                "In short, correlation shows association between variables, but cause and effect must be established separately."
              ]
            }
          ]
        },
        {
          "title": "Scatter Diagram",
          "points": [
            "A scatter diagram plots each (x, y) pair as a dot on a graph.",
            "Dots rising left to right show positive correlation; falling dots show negative correlation.",
            "Tightly packed dots mean strong correlation; widely spread dots mean weak or no correlation.",
            "Merits: simple to draw and understand, shows the pattern and direction at a glance, odd values stand out clearly, needs no calculation; it is the best first step before calculating r.",
            "Limitations: only a rough idea with no exact number, two people may judge the same diagram differently, not useful when observations are very large."
          ],
          "questions": [
            {
              "q": "What is a scatter diagram? How do you read correlation from it?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "A scatter diagram is a graph on which each pair of (x, y) values is plotted as a dot.",
                "It is the simplest visual method to see the relationship between two variables.",
                "To read correlation from it, look at the direction and closeness of the dots.",
                "Dots rising from left to right show positive correlation.",
                "Dots falling from left to right show negative correlation.",
                "Dots scattered all over with no pattern show zero or no correlation.",
                "Tightly packed dots in a narrow band mean strong correlation; widely spread dots mean weak correlation."
              ]
            },
            {
              "q": "What are the merits and limitations of the scatter diagram?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Merits:",
                "A scatter diagram is very simple to draw and easy to understand.",
                "It shows the pattern and direction of the relationship at a glance.",
                "Odd or unusual values stand out clearly on the diagram.",
                "It needs no complicated calculation.",
                "Limitations:",
                "It gives only a rough idea and no exact numerical measure of correlation.",
                "Two people may judge the same diagram differently, so it is not fully objective.",
                "It is not useful when the number of observations is very large.",
                "Despite its limits, it is the best first step before calculating the correlation coefficient."
              ]
            }
          ]
        },
        {
          "title": "Karl Pearson's Coefficient of Correlation",
          "points": [
            "Karl Pearson's r = [N*sum(xy) - sum(x)*sum(y)] / sqrt([N*sum(x^2) - (sum(x))^2] * [N*sum(y^2) - (sum(y))^2]).",
            "r always lies between -1 and +1. +1 is perfect positive, -1 is perfect negative, 0 is no linear relation.",
            "It needs both variables in numbers and is affected by extreme values; it is a pure number with no unit and measures only linear relation.",
            "Shortcut: r = Cov(X,Y) / sqrt(VarX x VarY).",
            "With assumed means Ax, Ay: take dx = X - Ax and dy = Y - Ay, then use the same formula on dx, dy.",
            "Assumptions: the relation must be linear; both variables must be proper numerical data on an interval or ratio scale; observations must be meaningfully paired; data should be free from extreme values and roughly normal; if these fail, rank correlation is safer."
          ],
          "questions": [
            {
              "q": "Calculate the coefficient of correlation for x: 1,2,3,4,5 and y: 2,3,5,4,6. (2024, 2022)",
              "tags": [
                "SURE MARK"
              ],
              "tagBase": "SURE MARK",
              "years": null,
              "a": [
                "Formula: r = [N*sum(xy) - sum(x)*sum(y)] / sqrt([N*sum(x^2) - (sum(x))^2] * [N*sum(y^2) - (sum(y))^2])",
                "Here N = 5.",
                "sum(x) = 1+2+3+4+5 = 15.",
                "sum(y) = 2+3+5+4+6 = 20.",
                "sum(xy) = (1*2)+(2*3)+(3*5)+(4*4)+(5*6) = 2+6+15+16+30 = 69.",
                "sum(x^2) = 1+4+9+16+25 = 55.",
                "sum(y^2) = 4+9+25+16+36 = 90.",
                "Numerator = N*sum(xy) - sum(x)*sum(y) = 5*69 - 15*20 = 345 - 300 = 45.",
                "First term of denominator = N*sum(x^2) - (sum(x))^2 = 5*55 - 225 = 275 - 225 = 50.",
                "Second term of denominator = N*sum(y^2) - (sum(y))^2 = 5*90 - 400 = 450 - 400 = 50.",
                "Denominator = sqrt(50 * 50) = 50.",
                "r = 45 / 50 = 0.9.",
                "Answer: r = 0.9, which means strong positive correlation."
              ]
            },
            {
              "q": "State the formula of Karl Pearson's coefficient of correlation and its properties.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Karl Pearson's coefficient of correlation is denoted by r and its formula is:",
                "r = [N*sum(xy) - sum(x)*sum(y)] / sqrt([N*sum(x^2) - (sum(x))^2] * [N*sum(y^2) - (sum(y))^2])",
                "Properties:",
                "r always lies between -1 and +1.",
                "r = +1 means perfect positive correlation and r = -1 means perfect negative correlation.",
                "r = 0 means there is no linear relationship between the variables.",
                "r measures only linear relation; it cannot catch a curved relationship.",
                "It has no unit, because it is a pure number.",
                "It needs both variables to be in numerical form.",
                "It is affected by extreme values, so one odd value can change r a lot."
              ]
            },
            {
              "q": "Explain the underlying assumptions of Karl Pearson's co-efficient of correlation. (2024)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Karl Pearson's coefficient r is valid only when certain assumptions about the data hold.",
                "First, the relationship between the two variables must be linear; r cannot measure a curved relationship properly.",
                "Second, both variables must be measured on an interval or ratio scale, that is, proper numerical data.",
                "Third, the observations must be meaningfully paired, with a sensible link between each x and its y.",
                "Fourth, the data should be free from extreme values, because a single outlier can distort r heavily.",
                "Fifth, for full reliability the variables are assumed to follow roughly a normal distribution.",
                "If these assumptions fail, rank correlation or other non-parametric methods are safer.",
                "In short, Pearson's r assumes linear, numerical, outlier-free paired data."
              ]
            },
            {
              "q": "If the covariance between X and Y is 488 and variance of X and Y are 824 and 325 respectively, find out coefficient of correlation. (2022)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The shortcut formula is r = Cov(X,Y) / sqrt(VarX x VarY).",
                "Here Cov = 488, VarX = 824 and VarY = 325.",
                "Denominator = sqrt(824 x 325) = sqrt(267800) = 517.50.",
                "r = 488 / 517.50 = 0.94.",
                "The value is close to +1, showing a high degree of positive correlation between X and Y.",
                "Answer: the coefficient of correlation is 0.94."
              ]
            },
            {
              "q": "Compute Pearson's coefficient of correlation from the following data taking 60 and 70 as the assumed averages of X and Y respectively. Also see if it comes between 0.85 and 0.95. X: 45, 55, 56, 58, 60, 65, 68, 70, 75, 80, 85; Y: 56, 50, 48, 60, 62, 64, 65, 70, 74, 82, 90. (2022)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "With assumed means Ax = 60 and Ay = 70, take dx = X - 60 and dy = Y - 70 for the 11 pairs.",
                "Sums: sum dx = 57, sum dy = -49, sum dx-square = 1709, sum dy-square = 1865, sum dx.dy = 1148.",
                "r = [n.sum dx.dy - sum dx.sum dy] / sqrt[(n.sum dx-square - (sum dx)^2)(n.sum dy-square - (sum dy)^2)].",
                "Numerator = 11x1148 - 57x(-49) = 12628 + 2793 = 15421.",
                "Denominator = sqrt[(18799 - 3249)(20515 - 2401)] = sqrt(15550 x 18114) = 16783.2.",
                "r = 15421 / 16783.2 = 0.92.",
                "0.92 lies between 0.85 and 0.95, so the check is satisfied.",
                "Answer: r = 0.92, which is between 0.85 and 0.95."
              ]
            }
          ]
        },
        {
          "title": "Degree of Correlation, Probable Error and Coefficient of Determination",
          "points": [
            "Degree of correlation: |r| near 1 is high, near 0.5 is moderate, near 0 is low or none.",
            "Probable error: PE = 0.6745 * (1 - r^2) / sqrt(N). If r > 6*PE, the correlation is significant.",
            "Coefficient of determination = r^2. It tells what fraction of the variation in y is explained by x."
          ],
          "questions": [
            {
              "q": "What is probable error? How do you interpret correlation using it?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Probable error (PE) is a measure used to test whether an observed correlation is real or just accidental.",
                "Its formula is: PE = 0.6745 * (1 - r^2) / sqrt(N).",
                "Here r is the correlation coefficient and N is the number of pairs.",
                "Interpretation rules:",
                "If r is greater than 6 times PE, the correlation is significant and definitely exists.",
                "If r is less than PE, there is practically no correlation.",
                "If r lies between PE and 6 times PE, we cannot say anything surely; the data may be small.",
                "Probable error is useful because a high r from a small sample can still be doubtful."
              ]
            },
            {
              "q": "If r = 0.9 and N = 25, find the probable error and comment.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Formula: PE = 0.6745 * (1 - r^2) / sqrt(N).",
                "Given r = 0.9 and N = 25.",
                "r^2 = 0.9 * 0.9 = 0.81.",
                "1 - r^2 = 1 - 0.81 = 0.19.",
                "sqrt(N) = sqrt(25) = 5.",
                "PE = 0.6745 * 0.19 / 5.",
                "First multiply: 0.6745 * 0.19 = 0.128155.",
                "Then divide: 0.128155 / 5 = 0.025631.",
                "So PE = 0.0256 approx.",
                "6 * PE = 6 * 0.0256 = 0.1536.",
                "Since r = 0.9 is greater than 6*PE = 0.1536, the correlation is highly significant.",
                "Answer: PE = 0.0256; the correlation is significant."
              ]
            },
            {
              "q": "What is the coefficient of determination? If r = 0.8, interpret it.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The coefficient of determination is the square of the correlation coefficient, r^2.",
                "It tells what fraction of the variation in one variable is explained by the other variable.",
                "Its value lies between 0 and 1, and it is often written as a percentage.",
                "For r = 0.8:",
                "r^2 = 0.8 * 0.8 = 0.64.",
                "This means 64 percent of the variation in y is explained by the variation in x.",
                "The remaining 36 percent of the variation is due to other factors not included in the model.",
                "So a higher r^2 means a better and more useful relationship for prediction."
              ]
            }
          ]
        },
        {
          "title": "Spearman's Rank Correlation and Tie in Ranks",
          "points": [
            "Spearman's rank correlation is used when data is in ranks (1st, 2nd...) or not normally distributed.",
            "rho = 1 - [6 * sum(d^2)] / [n * (n^2 - 1)], where d is the difference of the two ranks.",
            "Tie in ranks: when values repeat, give the average rank and add (t^3 - t)/12 to sum(d^2) for each tie of size t."
          ],
          "questions": [
            {
              "q": "State Spearman's rank correlation formula. When is it used? (2024, 2022)",
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "years": null,
              "a": [
                "Spearman's rank correlation coefficient is denoted by rho and its formula is:",
                "rho = 1 - [6 * sum(d^2)] / [n * (n^2 - 1)]",
                "Here n is the number of pairs and d is the difference between the two ranks of each item.",
                "When it is used:",
                "It is used when data is given in the form of ranks, like 1st, 2nd, 3rd.",
                "It is used for qualitative data that can be ranked, like beauty, honesty or taste.",
                "It is also used when the data is not normally distributed or has extreme values.",
                "Example: to find the relationship between the ranks of students in Maths and in Statistics."
              ]
            },
            {
              "q": "Ranks in Maths: 1,2,3,4,5; ranks in Stats: 2,1,4,3,5. Find the rank correlation.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Formula: rho = 1 - [6 * sum(d^2)] / [n * (n^2 - 1)]",
                "Here n = 5.",
                "Find d = Maths rank minus Stats rank for each student:",
                "Student 1: d = 1 - 2 = -1, d^2 = 1.",
                "Student 2: d = 2 - 1 = 1, d^2 = 1.",
                "Student 3: d = 3 - 4 = -1, d^2 = 1.",
                "Student 4: d = 4 - 3 = 1, d^2 = 1.",
                "Student 5: d = 5 - 5 = 0, d^2 = 0.",
                "sum(d^2) = 1 + 1 + 1 + 1 + 0 = 4.",
                "Numerator = 6 * 4 = 24.",
                "Denominator = 5 * (25 - 1) = 5 * 24 = 120.",
                "rho = 1 - 24/120 = 1 - 0.2 = 0.8.",
                "Answer: rho = 0.8, which means strong positive rank correlation."
              ]
            },
            {
              "q": "What is a tie in ranks? How is it corrected?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "A tie in ranks happens when two or more items have the same value, so they share the same rank.",
                "Example: if two students tie for the 2nd and 3rd places, each is given the average rank 2.5.",
                "The average rank given to the tied items keeps the total of all ranks correct.",
                "Correction method:",
                "For every group of ties, add (t^3 - t)/12 to sum(d^2).",
                "Here t is the number of tied items in that group.",
                "If there are two tie groups, apply this correction for each group separately.",
                "The corrected sum(d^2) is then used in the formula rho = 1 - [6 * sum(d^2)] / [n * (n^2 - 1)]."
              ]
            },
            {
              "q": "Write down any three merits and demerits of Spearman's rank correlation co-efficient. (2024)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Merits: first, it is simple to understand and easy to calculate, simpler than Karl Pearson's method.",
                "Second, it can be used even when the data is qualitative, like ranks given for beauty, honesty or intelligence.",
                "Third, it is not affected much by extreme values, since only ranks matter, not actual magnitudes.",
                "Demerits: first, it cannot be applied to grouped frequency distributions.",
                "Second, it is less precise and less powerful than Pearson's coefficient for numerical data.",
                "Third, when the number of observations is large, ranking all of them becomes tedious.",
                "In short, rank correlation is simple and flexible, but it is less exact than Pearson's method."
              ]
            }
          ]
        },
        {
          "title": "Regression: Definition, Types and Regression Lines",
          "points": [
            "Regression studies how one variable depends on another; it is used for prediction.",
            "Types: linear vs non-linear; simple (one independent variable) vs multiple.",
            "Regression lines: y on x predicts y from x; x on y predicts x from y. They always cross at (xbar, ybar)."
          ],
          "questions": [
            {
              "q": "Define regression. Explain its types.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Regression is a statistical method that studies the average relationship between variables for estimation and prediction.",
                "While correlation only tells the strength of a relationship, regression gives an actual equation to predict one variable from another.",
                "Types of regression:",
                "Linear regression: the relationship is a straight line. Example: sales rise steadily with advertising.",
                "Non-linear regression: the relationship is a curve. Example: production rises fast at first and then slows down.",
                "Simple regression: there is one independent variable. Example: predicting marks (y) from study hours (x).",
                "Multiple regression: there are two or more independent variables. Example: predicting marks (y) from study hours (x1) and attendance (x2).",
                "Example: a shop uses regression to predict next month's sales (y) from this month's advertising spend (x)."
              ]
            },
            {
              "q": "What are regression lines? What is special about their intersection?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "There are two regression lines:",
                "The line of regression of y on x, which is used to predict y from a given x.",
                "The line of regression of x on y, which is used to predict x from a given y.",
                "Each line is the best fitting line for its own direction of prediction.",
                "Special point about their intersection:",
                "The two regression lines always cross each other at the point (xbar, ybar).",
                "This point is the average of x and the average of y taken together.",
                "If r = +1 or r = -1, that is perfect correlation, the two lines merge into a single line.",
                "The smaller the angle between the two lines, the higher the correlation."
              ]
            },
            {
              "q": "What is a line of best fit?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The line of best fit is the straight line that passes closest to all the points in a scatter diagram.",
                "It summarises the trend: a rising line means positive correlation, a falling line means negative correlation.",
                "It is drawn so that the total distance of all points from the line is as small as possible (the least-squares line).",
                "Its equation is the regression line, which is then used to predict one variable from another."
              ]
            },
            {
              "q": "The regression equation of rice yield (y) on rainfall (x) is y = 12 + 0.8x. Estimate the rice yield when rainfall is 29 cm.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "hint": "This is a regression estimate: put the given x into the regression equation to predict y.",
              "a": [
                "The estimated rice yield is 35.2 when rainfall is 29 cm.",
                "Substitute x = 29 into y = 12 + 0.8x.",
                "y = 12 + 0.8 x 29 = 12 + 23.2 = 35.2.",
                "This is a regression estimate: predicting y from a given x using the line of best fit.",
                "Answer: 35.2 (in the yield units)."
              ]
            }
          ]
        },
        {
          "title": "Regression Equations of y on x and x on y",
          "points": [
            "y on x: y - ybar = byx * (x - xbar), where byx = r * (SDy / SDx).",
            "x on y: x - xbar = bxy * (y - ybar), where bxy = r * (SDx / SDy).",
            "byx and bxy are the regression coefficients (the slopes of the lines); use the y-on-x line to predict y from x, and the x-on-y line to predict x from y.",
            "byx can also be computed directly as sum((x - xbar)(y - ybar)) / sum((x - xbar)^2).",
            "Both coefficients always carry the same sign as r; r = plus or minus sqrt(byx x bxy), taking the sign of the coefficients.",
            "If one regression coefficient is greater than 1, the other must be less than 1, because their product r-square cannot exceed 1; the coefficients are not symmetric, byx is generally not equal to bxy.",
            "Least square method: picks the line that makes the sum of the squared vertical distances of the points from the line as small as possible.",
            "For y = a + bx, minimising gives the normal equations: sum y = n.a + b.sum x and sum xy = a.sum x + b.sum x-square; solving gives a and b.",
            "The least-squares fitted line always passes through (xbar, ybar) and is the most scientific way of fitting a regression line."
          ],
          "questions": [
            {
              "q": "For x: 1,2,3,4,5 and y: 2,3,5,4,6, find the regression line of y on x. (2022)",
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "years": null,
              "a": [
                "Formula for the regression line of y on x: y - ybar = byx * (x - xbar).",
                "First find the means:",
                "xbar = (1+2+3+4+5)/5 = 15/5 = 3.",
                "ybar = (2+3+5+4+6)/5 = 20/5 = 4.",
                "Now find byx = sum((x - xbar)(y - ybar)) / sum((x - xbar)^2).",
                "Numerator terms (x - xbar)(y - ybar):",
                "(1-3)(2-4) = (-2)(-2) = 4.",
                "(2-3)(3-4) = (-1)(-1) = 1.",
                "(3-3)(5-4) = 0*1 = 0.",
                "(4-3)(4-4) = 1*0 = 0.",
                "(5-3)(6-4) = 2*2 = 4.",
                "Numerator = 4 + 1 + 0 + 0 + 4 = 9.",
                "Denominator terms (x - xbar)^2:",
                "(1-3)^2 = 4, (2-3)^2 = 1, (3-3)^2 = 0, (4-3)^2 = 1, (5-3)^2 = 4.",
                "Denominator = 4 + 1 + 0 + 1 + 4 = 10.",
                "byx = 9/10 = 0.9.",
                "Line: y - 4 = 0.9 * (x - 3).",
                "y = 0.9x - 2.7 + 4.",
                "y = 0.9x + 1.3.",
                "Answer: the regression line of y on x is y = 0.9x + 1.3."
              ]
            },
            {
              "q": "Write the two regression equations and define the regression coefficients.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The two regression equations are:",
                "Regression of y on x: y - ybar = byx * (x - xbar).",
                "Regression of x on y: x - xbar = bxy * (y - ybar).",
                "Here xbar and ybar are the means of x and y.",
                "Regression coefficients:",
                "byx is the regression coefficient of y on x. Its formula is byx = r * (SDy / SDx).",
                "It is the slope of the line of y on x and is used when predicting y.",
                "bxy is the regression coefficient of x on y. Its formula is bxy = r * (SDx / SDy).",
                "It is the slope of the line of x on y and is used when predicting x.",
                "Both coefficients always have the same sign as the correlation coefficient r."
              ]
            },
            {
              "q": "Write a note on least square method of computing regression equation. (2022)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The least square method finds the regression line that fits the observed data best.",
                "'Best' here means the line that makes the sum of the squared vertical distances of the points from the line as small as possible.",
                "For y on x, we choose y = a + bx so that sum(y - a - bx)^2 is minimum.",
                "Minimising gives the two normal equations: sum y = n.a + b.sum x and sum xy = a.sum x + b.sum x-square.",
                "Solving these two equations gives the constants a and b, and hence the regression line.",
                "The fitted line always passes through the point (mean of x, mean of y).",
                "It is the most scientific method of fitting a regression line.",
                "In short, least squares picks the line with the minimum total squared error."
              ]
            },
            {
              "q": "What are the features of regression coefficients? (2022)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The two regression coefficients byx and bxy have the following features.",
                "First, both coefficients always carry the same sign, which is the sign of the correlation coefficient r.",
                "Second, r is the geometric mean of the two coefficients: r = plus or minus sqrt(byx x bxy).",
                "Third, if one regression coefficient is greater than 1, the other must be less than 1, because their product r-square cannot exceed 1.",
                "Fourth, the coefficients are not symmetric: byx is generally not equal to bxy.",
                "Fifth, both regression lines intersect at the point (x-bar, y-bar), the means of the two variables.",
                "In short, the regression coefficients share the sign of r and are linked through r-square."
              ]
            },
            {
              "q": "Given the following data, what would be the possible yield of rice per acre when rainfall is 29 cm? Coefficient of correlation between rainfall and yield is 0.8. Rainfall: Mean 25, Variance 9; Yield: Mean 40, Variance 36. (2022)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Let x = rainfall and y = yield. SDx = sqrt(9) = 3 and SDy = sqrt(36) = 6.",
                "Regression coefficient of y on x: byx = r x (SDy/SDx) = 0.8 x (6/3) = 1.6.",
                "Since rainfall is the independent variable, use the regression line of y on x.",
                "Regression line of y on x: y - y-bar = byx(x - x-bar), so y - 40 = 1.6(x - 25).",
                "Put x = 29: y - 40 = 1.6 x 4 = 6.4, giving y = 46.4.",
                "This estimate is reliable because the correlation 0.8 is fairly high.",
                "Answer: the expected yield of rice is 46.4 per acre when rainfall is 29 cm."
              ]
            },
            {
              "q": "Following data relates to marks in Accounts and Statistics: Accounts - Mean 30, SD 10; Statistics - Mean 35, SD 7; Coefficient of correlation 0.8. Find two regression equations and calculate the expected marks in Accounts if marks secured by a student in Statistics are 40. (2022)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Let x = Accounts marks (mean 30, SD 10) and y = Statistics marks (mean 35, SD 7), with r = 0.8.",
                "byx = r x (SDy/SDx) = 0.8 x (7/10) = 0.56; regression of y on x: y - 35 = 0.56(x - 30).",
                "bxy = r x (SDx/SDy) = 0.8 x (10/7) = 1.143; regression of x on y: x - 30 = 1.143(y - 35).",
                "To estimate Accounts (x) from Statistics (y = 40), use the x-on-y line.",
                "x - 30 = 1.143 x (40 - 35) = 1.143 x 5 = 5.71, so x = 35.71.",
                "Answer: the two regression equations are y - 35 = 0.56(x - 30) and x - 30 = 1.143(y - 35); expected Accounts marks = 35.71."
              ]
            },
            {
              "q": "A panel of judges A and B graded seven debaters and independently awarded the following marks: A: 40, 34, 28, 30, 44, 38, 31; B: 32, 39, 26, 30, 38, 34, 28. An eighth debater was awarded 36 marks by Judge A while Judge B was not present. How many marks would you expect Judge B to award? (2022)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "hint": "This is a regression estimate: predict B's marks (y) from A's marks (x) using the y-on-x line.",
              "a": [                "Sums for n = 7: sum x = 245, sum y = 227, sum x-square = 8781, sum xy = 8066.",
                "byx = [n.sum xy - sum x.sum y] / [n.sum x-square - (sum x)^2] = [56462 - 55615] / [61467 - 60025] = 847/1442 = 0.587.",
                "Means: x-bar = 245/7 = 35, y-bar = 227/7 = 32.43.",
                "Regression line: y - 32.43 = 0.587(x - 35).",
                "For x = 36: y = 32.43 + 0.587 x 1 = 33.02.",
                "Answer: Judge B would be expected to award about 33 marks."
              ]
            }
          ]
        },
        {
          "title": "Relation between Correlation and Regression Coefficients",
          "points": [
            "r^2 = byx * bxy, so r = +sqrt(byx*bxy) or -sqrt(byx*bxy), taking the sign of the coefficients.",
            "Both regression coefficients always have the same sign as r.",
            "To identify the lines: the coefficient of x in the \"y on x\" equation is byx; the coefficient of y in the \"x on y\" equation is bxy."
          ],
          "questions": [
            {
              "q": "Show that r^2 = byx * bxy.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The two regression coefficients are defined as:",
                "byx = r * (SDy / SDx).",
                "bxy = r * (SDx / SDy).",
                "Multiply the two coefficients:",
                "byx * bxy = [r * (SDy / SDx)] * [r * (SDx / SDy)].",
                "Group the terms: = r * r * (SDy / SDx) * (SDx / SDy).",
                "The SD terms cancel: (SDy / SDx) * (SDx / SDy) = 1.",
                "So byx * bxy = r^2.",
                "This proves that the product of the two regression coefficients equals the square of the correlation coefficient.",
                "Taking the square root: r = +sqrt(byx * bxy) or -sqrt(byx * bxy), with the sign of the coefficients."
              ]
            },
            {
              "q": "If byx = 0.9 and bxy = 0.9, find r.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Formula: r^2 = byx * bxy.",
                "Substitute the values: r^2 = 0.9 * 0.9 = 0.81.",
                "Take the square root: r = +sqrt(0.81) or -sqrt(0.81).",
                "sqrt(0.81) = 0.9, so r = +0.9 or -0.9.",
                "Both regression coefficients are positive, so r must also be positive.",
                "Answer: r = 0.9."
              ]
            },
            {
              "q": "Given 2x - y = 5 and 3x - 2y = 4, identify the regression lines and find r.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "We must decide which line is y on x and which is x on y, because r^2 = byx * bxy must be between 0 and 1.",
                "First try: treat 2x - y = 5 as the line of y on x.",
                "Rewrite as y = 2x - 5, so byx = 2.",
                "Treat 3x - 2y = 4 as the line of x on y: 3x = 2y + 4, so x = (2/3)y + 4/3, giving bxy = 2/3.",
                "Then r^2 = 2 * (2/3) = 4/3 = 1.33.",
                "This is greater than 1, which is impossible, so this assignment is wrong.",
                "So swap the roles: treat 2x - y = 5 as the line of x on y.",
                "2x = y + 5, so x = 0.5y + 2.5, giving bxy = 0.5.",
                "Treat 3x - 2y = 4 as the line of y on x.",
                "2y = 3x - 4, so y = 1.5x - 2, giving byx = 1.5.",
                "Now r^2 = byx * bxy = 1.5 * 0.5 = 0.75.",
                "r = +sqrt(0.75) = 0.866 approx, positive because both coefficients are positive.",
                "Answer: 2x - y = 5 is the line of x on y, 3x - 2y = 4 is the line of y on x, and r = 0.866."
              ]
            }
          ]
        },
        {
          "title": "Comparison of Correlation and Regression",
          "points": [
            "Correlation measures strength and direction; regression gives the exact equation for prediction.",
            "Correlation is symmetric (r for x,y equals r for y,x); regression is not (y on x differs from x on y).",
            "Correlation needs both variables random; regression treats x as the fixed independent variable."
          ],
          "questions": [
            {
              "q": "Distinguish between correlation and regression.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Correlation measures the strength and direction of the relationship between two variables; regression gives the exact equation to predict one from the other.",
                "Correlation is symmetric: the r between x and y is the same as between y and x. Regression is not symmetric: the line of y on x is different from the line of x on y.",
                "Correlation lies between -1 and +1; regression coefficients can take any value and may exceed 1.",
                "Correlation does not say which variable is cause and which is effect; regression treats x as the fixed independent variable and y as the dependent variable.",
                "Correlation is not used for actual prediction, while regression is mainly used for estimation and forecasting.",
                "Example: r = 0.9 only says marks and study hours move together strongly, while the regression equation lets us predict marks for 5 study hours."
              ]
            }
          ]
        }
      ]
    },
];

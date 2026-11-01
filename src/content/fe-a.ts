import type { Module } from "./types";

export const feModulesA: Module[] = [
{
      "num": "1",
      "title": "Introduction and Preprocessing",
      "examPattern": "FE theory exam: 35 marks, 1 hour (MG3DSEBCA201 Honours model paper, mgu.ac.in Oct 2025).\nPrinted: 10 x Part A (2 marks) + 5 x Part B (5 marks) = 45 marks printed, so there IS choice.\nLikely: Part A all compulsory (20) + answer any 3 of 5 in Part B (15) = 35. Exact choice rule UNVERIFIED - confirm from the paper.\nPart A questions carry Bloom tags R/U/An and CO mappings in the paper.\nModule 1 (data types, missing data, cleaning, scaling) gave 6 of the 10 Part A questions in the model paper - it is the Part A bank.",
      "topics": [
        {
          "title": "Data and Features - Introduction",
          "points": [
            "Data is raw facts and figures collected from the real world, like student marks or house prices.",
            "A feature is one measurable property of the data, like age, height or marks.",
            "Each column in a dataset is usually one feature; each row is one record.",
            "Good features make a machine learning model learn faster and predict better."
          ],
          "questions": [
            {
              "q": "What is a feature in machine learning? Give examples.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Definition: A feature is a single measurable property of the data that is given as input to a machine learning model.",
                "In a dataset, each column is usually one feature and each row is one record or example.",
                "The model learns patterns only from the features it is given, so the choice of features decides what the model can learn.",
                "Examples: in a house-price dataset, area in square feet, number of bedrooms and location are features.",
                "In a student dataset, age, attendance percentage and marks are features.",
                "In a spam filter, features can be the number of links in the mail or the presence of words like lottery.",
                "Features can be numerical (age, salary) or categorical (city, gender).",
                "Raw columns are sometimes not enough, so new features are created from old ones; this is called feature engineering.",
                "Example: from a date of birth column we can create an age feature that the model understands better.",
                "In short, features are the language through which data speaks to the model, and good features lead to good predictions."
              ]
            },
            {
              "q": "What is data? How do features relate to a dataset?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Definition: Data is the raw collection of facts and figures gathered from the real world, like student marks or house prices.",
                "A dataset organises this data as a table: each row is one record and each column is one feature.",
                "So features are simply the columns of the dataset that describe each record.",
                "Example: a student table has rows for each student and columns like name, age and marks.",
                "Here age and marks are the features, because they are the measurable inputs the model will learn from.",
                "Name is also a column, but it is usually not a useful feature since it carries no pattern.",
                "The target column, like final result pass or fail, is what the model tries to predict and is not counted as a feature.",
                "In short, data is the whole table, and features are the meaningful columns of that table that drive learning."
              ]
            },
            {
              "q": "Differentiate between data and information.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Definition: Data is raw unprocessed facts and figures, while information is data that has been processed into something meaningful.",
                "Data on its own answers nothing: a list of marks 45, 67, 89 tells you nothing until you know whose marks they are.",
                "Information adds context and purpose: the class average is 67 and Arun scored 89, the highest in class.",
                "Data is the input; information is the output of processing, cleaning and analysing that data.",
                "Example: daily temperature readings for a year are data; the conclusion that July is the hottest month is information.",
                "In machine learning, raw datasets are data, and the patterns the model learns from them become information.",
                "One more difference: the same data can produce different information depending on the question asked.",
                "In short, data is raw material and information is the finished product made from it."
              ]
            }
          ]
        },
        {
          "title": "Importance of Features in Machine Learning",
          "points": [
            "Models learn only from features, so bad features give bad predictions.",
            "Good features improve accuracy without needing a bigger or costlier model.",
            "Fewer useful features mean faster training and less overfitting.",
            "In practice, feature engineering often matters more than the choice of algorithm."
          ],
          "questions": [
            {
              "q": "Why are features important in machine learning?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "A machine learning model sees only the features, so the quality of features decides the quality of learning.",
                "If the features are weak or irrelevant, even the best algorithm will give poor predictions.",
                "Example: predicting house price without the location feature gives bad results, because location strongly affects price.",
                "Good features improve accuracy without needing a bigger, slower or costlier model.",
                "They also reduce training time, because the model finds patterns faster in clean, meaningful inputs.",
                "Well-chosen features reduce overfitting, since the model does not get distracted by noise.",
                "In real projects, improving features usually gives a bigger accuracy jump than tuning the algorithm.",
                "Hence feature engineering is often called the most important step of the machine learning pipeline."
              ]
            },
            {
              "q": "'Feature engineering matters more than the algorithm.' Explain.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "This statement means that the information fed into a model matters more than the model itself.",
                "A simple model with great features often beats a complex model with poor features.",
                "Example: adding a days since last purchase feature improves a sales model more than switching algorithms.",
                "The algorithm can only combine and weight what it is given; it cannot invent missing information.",
                "If a key signal like customer location is absent, no algorithm can recover it.",
                "On the other hand, with the right features, even basic models like linear regression perform very well.",
                "That is why experienced data scientists spend most of their time on features, not on model tuning.",
                "In short, features decide the ceiling of performance, while the algorithm only decides how close we get to it."
              ]
            }
          ]
        },
        {
          "title": "Data Types and Features",
          "points": [
            "Numerical data is numbers. Discrete is countable (number of children); continuous is measurable (height).",
            "Categorical data is labels. Nominal has no order (colour); ordinal is ordered (grades A, B, C).",
            "Interval data has equal gaps but no true zero, like temperature in Celsius.",
            "Ratio data has a true zero, like weight or height; you can say twice as heavy."
          ],
          "questions": [
            {
              "q": "Distinguish between discrete and continuous data with examples.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Definition: Discrete data takes separate, countable values, while continuous data can take any value in a range.",
                "Discrete data is counted in whole numbers: number of students in a class, number of children in a family, number of cars sold.",
                "It has clear gaps between values; you cannot have 2.5 children.",
                "Continuous data is measured and can take decimal values: height 172.5 cm, weight 54.2 kg, time 9.58 seconds.",
                "Between any two continuous values there is always another possible value.",
                "Example: the number of books on a shelf is discrete, but the time taken to read one book is continuous.",
                "This difference matters because some models and plots suit one type better than the other.",
                "In short, countable values are discrete and measurable values are continuous."
              ]
            },
            {
              "q": "Explain nominal and ordinal data with examples.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Both nominal and ordinal are types of categorical (label) data, but they differ in order.",
                "Nominal data has categories with no natural order: gender, city, colour, blood group.",
                "You can count how many fall in each category, but you cannot rank them.",
                "Ordinal data has categories with a clear meaningful order: grades A, B, C, D or ranks 1st, 2nd, 3rd.",
                "Example: shirt sizes S, M, L and XL are ordinal because M is clearly larger than S.",
                "The order in ordinal data carries information, while in nominal data it does not.",
                "This matters in encoding: ordinal data can use label encoding that respects order, nominal data usually needs one-hot encoding.",
                "In short, nominal labels only name groups, while ordinal labels also rank them."
              ]
            },
            {
              "q": "What is the difference between interval and ratio data?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Both interval and ratio are numerical data types, and the difference lies in the meaning of zero.",
                "Interval data has equal gaps between values but no true zero: temperature in Celsius is the classic example.",
                "0 degree Celsius does not mean no heat, it is just a point on the scale.",
                "Ratio data has a true zero that means the complete absence of the quantity: weight, height, age, income.",
                "Because of the true zero, ratios are meaningful for ratio data: 20 kg is truly twice as heavy as 10 kg.",
                "But for interval data ratios mislead: 20 C is not twice as hot as 10 C.",
                "Both types support addition and subtraction, but only ratio data supports meaningful multiplication and division.",
                "In short, the true zero is what separates ratio data from interval data."
              ]
            },
            {
              "q": "Why must categorical data be converted before using ML models?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Machine learning models do mathematics, and mathematics needs numbers, not words.",
                "A model cannot multiply or compare the word Red, so every category must become a number first.",
                "Encoding methods like one-hot encoding and label encoding perform this conversion.",
                "Without conversion, most algorithms simply fail to run or silently misbehave on text columns.",
                "Even models that accept categories internally still convert them to numbers behind the scenes.",
                "The choice of encoding also matters: a wrong encoding can create false order between categories.",
                "Example: encoding cities as 1, 2, 3 may trick a linear model into thinking city 3 is greater than city 1.",
                "Hence converting categorical data correctly is a compulsory step before training."
              ]
            },
            {
              "q": "What is the significance of ordinal data in decision making?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Ordinal data is categorical data with a meaningful order, like grades A, B, C or satisfaction levels.",
                "Its significance is that the order itself carries information that pure labels do not.",
                "Example: knowing a customer rated service as Poor, Average or Excellent lets a manager rank and prioritise complaints.",
                "A decision maker can set thresholds on ordinal data: all feedback below Good needs attention.",
                "Unlike nominal data, ordinal data supports comparisons like better than or worse than.",
                "Unlike full numbers, it does not support exact maths: the gap between Good and Excellent is not measurable.",
                "In practice it is often converted to ordered numbers (1 to 5) for analysis, as long as the order is respected.",
                "In short, ordinal data matters because its built-in ranking directly guides prioritised decisions."
              ]
            }
          ]
        },
        {
          "title": "Handling Missing Data",
          "figures": [
            {
              "kind": "table",
              "caption": "Handling missing data: six options",
              "table": {
                "headers": [
                  "Method",
                  "What it does",
                  "When to use"
                ],
                "rows": [
                  [
                    "Mean imputation",
                    "Fill with the column mean",
                    "Normal numeric data"
                  ],
                  [
                    "Median imputation",
                    "Fill with the column median",
                    "Skewed numeric data"
                  ],
                  [
                    "Mode imputation",
                    "Fill with the most common value",
                    "Categorical data"
                  ],
                  [
                    "Sensible constant",
                    "Fill with 0 or 'Unknown'",
                    "Missingness itself means something"
                  ],
                  [
                    "Drop column",
                    "Delete the column",
                    "Mostly empty, over 50-60% missing"
                  ],
                  [
                    "Drop row",
                    "Delete the row",
                    "Rarely, only a few rows affected"
                  ]
                ],
                "note": "Dropping is the last resort, it throws away data."
              }
            }
          ],
          "points": [
            "Missing data means some values are absent, shown as NaN or blank cells.",
            "Small gaps can be filled; columns that are mostly empty may be dropped.",
            "Fill methods: mean, median, mode, or a fixed constant value.",
            "Missing data must never be ignored silently; it can bias the model."
          ],
          "questions": [
            {
              "q": "What is missing data? How is it handled?",
            "figure": {
              "kind": "table",
              "caption": "Handling missing data: six options",
              "table": {
                "headers": [
                  "Method",
                  "What it does",
                  "When to use"
                ],
                "rows": [
                  [
                    "Mean imputation",
                    "Fill with the column mean",
                    "Normal numeric data"
                  ],
                  [
                    "Median imputation",
                    "Fill with the column median",
                    "Skewed numeric data"
                  ],
                  [
                    "Mode imputation",
                    "Fill with the most common value",
                    "Categorical data"
                  ],
                  [
                    "Sensible constant",
                    "Fill with 0 or 'Unknown'",
                    "Missingness itself means something"
                  ],
                  [
                    "Drop column",
                    "Delete the column",
                    "Mostly empty, over 50-60% missing"
                  ],
                  [
                    "Drop row",
                    "Delete the row",
                    "Rarely, only a few rows affected"
                  ]
                ],
                "note": "Dropping is the last resort, it throws away data."
              }
            },
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Definition: Missing data means some values are absent in the dataset, shown as blank cells or NaN.",
                "It happens due to skipped survey answers, sensor failures or errors while merging files.",
                "Missing data must never be ignored silently, because most models cannot train on empty cells and the gaps can bias results.",
                "Handling method 1: fill small gaps using imputation, replacing blanks with the mean, median or mode of the column.",
                "Handling method 2: fill with a sensible constant, like 0 for number of children or Unknown for a city.",
                "Handling method 3: drop the row or column, but only when very little data is affected or the column is mostly empty.",
                "The right choice depends on how much is missing and why it is missing.",
                "In short, detect the gaps first, then fill them sensibly or drop them carefully, and always document what was done."
              ]
            },
            {
              "q": "Explain mean, median and mode imputation with examples.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Imputation means filling missing values with a sensible replacement instead of deleting the row.",
                "Mean imputation replaces blanks with the average of the column; it suits normal numeric data without outliers.",
                "Example: ages 20, 22, 24 with one missing become 20, 22, 24, 22, where 22 is the mean.",
                "Median imputation replaces blanks with the middle value; it suits skewed data because outliers do not pull it.",
                "Example: salaries 30000, 32000, 5000000 with one missing get the median 32000, not the distorted mean.",
                "Mode imputation replaces blanks with the most frequent value; it is used for categorical columns.",
                "Example: a city column missing in a few rows gets Mumbai if Mumbai appears most often.",
                "In short: mean for normal numbers, median for skewed numbers, mode for categories."
              ]
            },
            {
              "q": "When should a column with missing values be dropped instead of filled?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Filling is the default choice when only a small part of the column is missing, because the column still carries useful information.",
                "A column should be dropped when most of its values are missing, commonly more than 50 to 60 percent.",
                "Filling such a column would mean inventing more data than actually exists, which misleads the model.",
                "Example: a middle name column missing in 80 percent of rows is better dropped than filled.",
                "Similarly, drop a row only when it has too many missing values and very few rows are affected overall.",
                "Dropping too many rows shrinks the dataset and can remove valuable patterns.",
                "The decision should also consider importance: a highly predictive column deserves careful filling, not quick dropping.",
                "In short, fill small gaps, drop columns that are mostly empty, and never drop blindly."
              ]
            }
          ]
        },
        {
          "title": "Data Cleaning",
          "points": [
            "Data cleaning fixes errors so the model learns from correct data.",
            "Definition: data cleaning is the process of fixing errors and inconsistencies in raw data so the model learns from correct data.",
            "It is always the first step of any machine learning pipeline, because dirty data gives unreliable models.",
            "Common issues: duplicate rows, wrong formats, spelling mistakes, outliers.",
            "Steps: remove duplicates, fix data types, correct invalid entries, handle outliers.",
            "Step 1: remove duplicate rows, which would otherwise give extra weight to repeated records. Step 2: fix data types, converting values like text numbers into real numbers. Step 3: correct invalid entries, such as negative ages or impossible dates. Step 4: handle outliers, the extreme values that can distort the model. Step 5: standardise text, making entries like Male, male and M into one form.",
            "Data quality problems and their fixes: duplicate rows (the same record appears many times; fix by dropping duplicates); wrong data types (age stored as text; fix by converting to the correct type); outliers (impossible or extreme values like age 250; fix by removing or clipping them); inconsistent text (Male, male and M meaning the same thing; fix by converting to one standard form); missing values (blank cells; fix by imputation or careful dropping); spelling mistakes and extra spaces (fix with stripping and standardisation functions).",
            "Finding and fixing these issues is what data cleaning is all about.",
            "Clean data trains faster, gives higher accuracy and produces results that can be trusted.",
            "Cleaning is always the first step of any ML pipeline."
          ],
          "questions": [
            {
              "q": "What is data cleaning? Explain its steps.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Definition: Data cleaning is the process of fixing errors and inconsistencies in raw data so the model learns from correct data.",
                "It is always the first step of any machine learning pipeline, because dirty data gives unreliable models.",
                "Step 1: remove duplicate rows, which would otherwise give extra weight to repeated records.",
                "Step 2: fix data types, converting values like text numbers into real numbers.",
                "Step 3: correct invalid entries, such as negative ages or impossible dates.",
                "Step 4: handle outliers, the extreme values that can distort the model.",
                "Step 5: standardise text, making entries like Male, male and M into one form.",
                "Clean data trains faster, gives higher accuracy and produces results that can be trusted."
              ]
            },
            {
              "q": "List common data quality problems and how to fix them.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Data quality problems are the common defects found in raw real-world data, and each has a standard fix.",
                "Duplicate rows: the same record appears many times; fix by dropping duplicates.",
                "Wrong data types: age stored as text; fix by converting to the correct type.",
                "Outliers: impossible or extreme values like age 250; fix by removing or clipping them.",
                "Inconsistent text: Male, male and M meaning the same thing; fix by converting to one standard form.",
                "Missing values: blank cells; fix by imputation or careful dropping.",
                "Spelling mistakes and extra spaces: fix with stripping and standardisation functions.",
                "Finding and fixing these issues is what data cleaning is all about."
              ]
            }
          ]
        },
        {
          "title": "Feature Scaling",
          "points": [
            "Feature scaling brings all features into a similar range.",
            "Definition: feature scaling brings all features into a similar numeric range before training.",
            "It is needed because salary in lakhs and age in tens confuse distance-based models.",
            "Features often live on very different scales, like age 0 to 100 and salary 0 to 1000000.",
            "Distance-based models measure gaps between points, so the large-range feature dominates the distance completely. Example: in KNN, salary differences of lakhs would drown out age differences of tens, making age nearly useless.",
            "Gradient-based models also train slowly and unstably when features have very different scales.",
            "Scaling puts every feature on a similar scale, so each feature gets a fair weight in the model. In short, scaling stops big numbers from bullying small numbers inside the model.",
            "Two main methods: standardization (z-score) and normalization (min-max).",
            "The two standard methods are normalization (min-max to 0-1) and standardization (z-score).",
            "KNN, SVM and neural networks need scaling; tree models do not.",
            "Models that need scaling are those based on distances or gradients: KNN, K-means, SVM, neural networks and PCA. These models compare or combine feature values directly, so unequal ranges distort their maths. Example: K-means clustering on unscaled age and income would cluster almost entirely on income.",
            "Models that do not need scaling are tree-based: decision trees, random forests and gradient boosting. Reason: trees split one feature at a time using thresholds, so the range of other features never matters. A split like age greater than 30 works the same whether salary is in rupees or lakhs.",
            "Still, scaling tree models does no harm; it is simply unnecessary. In short, scale for distance and gradient models, skip it for trees."
          ],
          "questions": [
            {
              "q": "Why is feature scaling needed in machine learning?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Definition: Feature scaling brings all features into a similar numeric range before training.",
                "It is needed because features often live on very different scales, like age 0 to 100 and salary 0 to 1000000.",
                "Distance-based models measure gaps between points, so the large-range feature dominates the distance completely.",
                "Example: in KNN, salary differences of lakhs would drown out age differences of tens, making age nearly useless.",
                "Gradient-based models also train slowly and unstably when features have very different scales.",
                "Scaling puts every feature on a similar scale, so each feature gets a fair weight in the model.",
                "The two standard methods are normalization (min-max to 0-1) and standardization (z-score).",
                "In short, scaling stops big numbers from bullying small numbers inside the model."
              ]
            },
            {
              "q": "Which models need scaling and which do not? Why?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Models that need scaling are those based on distances or gradients: KNN, K-means, SVM, neural networks and PCA.",
                "These models compare or combine feature values directly, so unequal ranges distort their maths.",
                "Example: K-means clustering on unscaled age and income would cluster almost entirely on income.",
                "Models that do not need scaling are tree-based: decision trees, random forests and gradient boosting.",
                "Reason: trees split one feature at a time using thresholds, so the range of other features never matters.",
                "A split like age greater than 30 works the same whether salary is in rupees or lakhs.",
                "Still, scaling tree models does no harm; it is simply unnecessary.",
                "In short, scale for distance and gradient models, skip it for trees."
              ]
            }
          ]
        },
        {
          "title": "Normalization and Transformation",
          "points": [
            "Normalization (min-max scaling) squeezes values into the 0 to 1 range.",
            "Standardization converts values to z-scores with mean 0 and standard deviation 1.",
            "Transformation changes the shape of data, like log transform for skewed data.",
            "Use normalization for a fixed range; standardization when data is roughly normal."
          ],
          "questions": [
            {
              "q": "Distinguish between normalization and standardization.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Both are feature scaling methods, but they rescale data in different ways.",
                "Normalization, or min-max scaling, squeezes every value into a fixed range, usually 0 to 1.",
                "It is done by subtracting the minimum and dividing by the range, so the smallest value becomes 0 and the largest becomes 1.",
                "Standardization, or z-score scaling, centers values around mean 0 with standard deviation 1.",
                "It is done by subtracting the mean and dividing by the standard deviation, so values show how many deviations they sit from the mean.",
                "Normalization is bounded between 0 and 1, while standardization is unbounded and handles outliers more gracefully.",
                "Use normalization when you need a fixed range, like for neural networks; use standardization when data is roughly normal or has outliers.",
                "In short, normalization fixes the range, standardization fixes the distribution shape."
              ]
            },
            {
              "q": "What are the formulas for min-max normalization and z-score standardization?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Min-max normalization rescales a value x into the 0 to 1 range using the column minimum and maximum.",
                "Formula: x_new = (x - min) / (max - min).",
                "Example: a mark of 80 with min 0 and max 100 becomes (80 - 0) / (100 - 0) = 0.8.",
                "Every value in the column is transformed the same way, so order and relative gaps are preserved.",
                "Z-score standardization converts x into standard deviations away from the mean.",
                "Formula: z = (x - mean) / standard_deviation.",
                "Example: a value 70 with mean 60 and standard deviation 10 becomes (70 - 60) / 10 = 1.0, meaning one deviation above average.",
                "After standardization the column has mean 0 and standard deviation 1."
              ]
            },
            {
              "q": "What is data transformation? Give an example.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Definition: Data transformation changes the shape of a feature distribution to make it more suitable for modeling.",
                "It is used when data is skewed, meaning most values pile on one side with a long tail.",
                "The log transform is the most common example: it compresses large values more than small ones.",
                "Example: income data with a few very high earners becomes much more balanced after applying log.",
                "Other transforms include square root for mild skew and square for left-skewed data.",
                "Transformation helps models that assume roughly normal data, like linear regression.",
                "It is usually applied after checking a histogram of the feature.",
                "In short, transformation reshapes the data so the model sees a cleaner pattern."
              ]
            }
          ]
        }
      ]
    },
{
      "num": "2",
      "title": "Numerical, Categorical, Selection",
      "examPattern": "FE theory exam: 35 marks, 1 hour (MG3DSEBCA201 Honours model paper, mgu.ac.in Oct 2025).\nPrinted: 10 x Part A (2 marks) + 5 x Part B (5 marks) = 45 marks printed, so there IS choice.\nLikely: Part A all compulsory (20) + answer any 3 of 5 in Part B (15) = 35. Exact choice rule UNVERIFIED - confirm from the paper.\nModule 2 gave 4 of 10 Part A + 3 of 5 Part B (5-mark: RFE, extraction vs selection, interaction features) in the model paper.\nStrongest cross-paper repeats: feature selection methods (3x), dimensionality reduction (3x), PCA steps (2x), extraction vs selection (2x).",
      "topics": [
        {
          "title": "Binning and Discretization",
          "points": [
            "Binning groups continuous numbers into fixed intervals called bins.",
            "Example: ages 0-100 become groups like 0-18, 19-35, 36-60, 61+.",
            "It reduces noise and helps models find patterns inside ranges.",
            "Two ways: equal-width bins (same interval size) and equal-frequency bins (same count per bin)."
          ],
          "questions": [
            {
              "q": "What is binning? Explain with an example.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Definition: Binning is the process of grouping continuous numeric values into a small number of fixed intervals called bins.",
                "Each bin gets a label, turning numbers into categories the model can handle easily.",
                "Example: ages from 0 to 100 are grouped as 0-18 Child, 19-35 Youth, 36-60 Adult and 61+ Senior.",
                "A customer aged 25 falls in the Youth bin, and the model uses the bin label instead of the exact age.",
                "Binning reduces the effect of small noise, since ages 24 and 26 are treated the same.",
                "It also helps models find patterns inside ranges, like young customers buy more.",
                "The two main methods are equal-width bins with the same interval size and equal-frequency bins with the same record count.",
                "In short, binning trades fine detail for stable, meaningful groups."
              ]
            },
            {
              "q": "Distinguish between equal-width and equal-frequency binning.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Both are binning methods, but they divide the data using different rules.",
                "Equal-width binning splits the value range into bins of the same size, like 0-25, 25-50, 50-75 and 75-100.",
                "It is simple and keeps the ranges easy to explain, but skewed data can leave some bins nearly empty.",
                "Equal-frequency binning puts the same number of records in each bin, so bin ranges stretch where data is sparse.",
                "It handles skewed data better because every bin gets a fair share of records.",
                "Example: for income data, equal-width bins may pile everyone into the first bin, while equal-frequency bins spread them evenly.",
                "In pandas, cut() makes equal-width bins and qcut() makes equal-frequency bins.",
                "In short, use equal-width for simple even data and equal-frequency for skewed data."
              ]
            },
            {
              "q": "What is discretization? How is it related to binning?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Definition: Discretization is the general process of converting continuous data into discrete groups or categories.",
                "Continuous values like 72.4 marks become labels like First Class, which models handle more easily.",
                "Binning is the most common discretization method: it cuts the range into intervals called bins.",
                "So binning is one way of doing discretization, just as cut() is one way of binning in pandas.",
                "Other discretization ideas include grouping by business rules, like tax slabs defined by the government.",
                "The goal is always the same: reduce noise and make patterns clearer.",
                "Discretization is widely used before models that prefer categories, like decision trees and naive Bayes.",
                "In short, discretization is the concept and binning is its most popular technique."
              ]
            }
          ]
        },
        {
          "title": "Polynomial and Interaction Features",
          "points": [
            "Polynomial features add powers of a feature, like x squared, to catch curves.",
            "Definition: polynomial features are new columns made from powers of existing features, like x^2 and x^3.",
            "They are used because simple linear models can only draw straight lines, but real data often curves. Adding x^2 lets a linear model fit a curve while staying a linear model in the new features.",
            "They help simple linear models learn non-linear relationships.",
            "Example: house price may grow faster than size, so adding size-squared captures that curve. They are also useful when the true relationship is known to be curved, like projectile motion.",
            "In sklearn, PolynomialFeatures(degree=2) creates these columns automatically.",
            "Interaction features multiply two features, like area = length x breadth.",
            "Definition: an interaction feature combines two or more features, usually by multiplying them, to capture their joint effect. Some effects appear only when features act together, and single features miss them completely.",
            "Example: rooms x area captures house size better than rooms and area separately. A 3-room flat of 500 sq ft and a 3-room flat of 1500 sq ft are very different, and only the product shows it. Another example: in marketing, age group x income level can reveal that young high-earners behave uniquely.",
            "Interaction features are created manually by multiplication or automatically by PolynomialFeatures with interaction_only=True.",
            "Like polynomial features, they must be used carefully to avoid overfitting.",
            "Too many polynomial features can cause overfitting.",
            "The danger is overfitting: too many powers make the model memorise noise instead of the trend.",
            "Precautions: create them only when the relationship actually looks curved, since adding powers to straight-line data adds pure noise; keep the degree low, usually 2 or 3, because higher degrees overfit very fast; always scale features first, since x^2 of an unscaled large number explodes in size; watch the feature count, since degree 3 on 10 features creates hundreds of columns; use regularization like Ridge or Lasso to control the extra flexibility; validate on test data to confirm the curves reflect reality, not noise.",
            "In short, use low degrees, scale first, and always check against overfitting. Polynomial features give simple models the power to bend, and interaction features let the model see teamwork between columns."
          ],
          "questions": [
            {
              "q": "What are polynomial features? Why are they used?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Definition: Polynomial features are new columns made from powers of existing features, like x^2 and x^3.",
                "They are used because simple linear models can only draw straight lines, but real data often curves.",
                "Adding x^2 lets a linear model fit a curve while staying a linear model in the new features.",
                "Example: house price may grow faster than size, so adding size-squared captures that curve.",
                "In sklearn, PolynomialFeatures(degree=2) creates these columns automatically.",
                "They are also useful when the true relationship is known to be curved, like projectile motion.",
                "The danger is overfitting: too many powers make the model memorise noise instead of the trend.",
                "In short, polynomial features give simple models the power to bend."
              ]
            },
            {
              "q": "What is an interaction feature? Give an example.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Definition: An interaction feature combines two or more features, usually by multiplying them, to capture their joint effect.",
                "Some effects appear only when features act together, and single features miss them completely.",
                "Example: rooms x area captures house size better than rooms and area separately.",
                "A 3-room flat of 500 sq ft and a 3-room flat of 1500 sq ft are very different, and only the product shows it.",
                "Another example: in marketing, age group x income level can reveal that young high-earners behave uniquely.",
                "Interaction features are created manually by multiplication or automatically by PolynomialFeatures with interaction_only=True.",
                "Like polynomial features, they must be used carefully to avoid overfitting.",
                "In short, interaction features let the model see teamwork between columns."
              ]
            },
            {
              "q": "What precautions should be taken while creating polynomial features?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Polynomial features are powerful, but careless use quickly damages the model.",
                "Precaution 1: create them only when the relationship actually looks curved; adding powers to straight-line data adds pure noise.",
                "Precaution 2: keep the degree low, usually 2 or 3, because higher degrees overfit very fast.",
                "Precaution 3: always scale features first, since x^2 of an unscaled large number explodes in size.",
                "Precaution 4: watch the feature count; degree 3 on 10 features creates hundreds of columns.",
                "Precaution 5: use regularization like Ridge or Lasso to control the extra flexibility.",
                "Precaution 6: validate on test data to confirm the curves reflect reality, not noise.",
                "In short, use low degrees, scale first, and always check against overfitting."
              ]
            }
          ]
        },
        {
          "title": "One-Hot Encoding",
          "points": [
            "One-hot encoding turns each category into its own 0/1 column.",
            "Definition: one-hot encoding converts each category of a column into its own new column containing only 0 or 1. For every row, the column of its own category gets 1 and all other new columns get 0.",
            "Example: colour Red, Green, Blue becomes three columns with one 1 and rest 0.",
            "A Colour column with Red, Green, Blue becomes three columns: Colour_Red, Colour_Green, Colour_Blue. A red shirt becomes 1, 0, 0; a green shirt becomes 0, 1, 0; a blue shirt becomes 0, 0, 1. This is why it is called one-hot: exactly one column is hot (1) per row.",
            "Best for nominal data with few categories and no order.",
            "It is best for nominal data with few categories and no natural order, like gender or city. It avoids the false ordering problem of label encoding, since no category looks greater than another.",
            "Problem: too many categories create too many columns.",
            "The main disadvantage is the explosion of columns when a category has many unique values: a column with 1000 cities becomes 1000 new columns, most of them zeros. This wastes memory and slows down training considerably, and it makes the data very sparse, which weakens many models. This problem is known as the curse of dimensionality.",
            "One common fix is to drop one column to avoid the dummy variable trap in linear models. Better fixes for high-cardinality data are hashing or target encoding. In short, one-hot encoding is excellent for few categories but breaks down for many.",
            "Code in pandas and sklearn: one-hot encoding is a one-line operation in both. In pandas: df = pd.get_dummies(df, columns=[\"city\"]) replaces the city column with one 0/1 column per city. In sklearn: from sklearn.preprocessing import OneHotEncoder; enc = OneHotEncoder(sparse_output=False); X_new = enc.fit_transform(df[[\"city\"]]).",
            "The sklearn version remembers the categories, so it encodes new data consistently during prediction. Use pandas for quick analysis and sklearn when building a proper training pipeline."
          ],
          "questions": [
            {
              "q": "What is one-hot encoding? Explain with an example.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Definition: One-hot encoding converts each category of a column into its own new column containing only 0 or 1.",
                "For every row, the column of its own category gets 1 and all other new columns get 0.",
                "Example: a Colour column with Red, Green, Blue becomes three columns: Colour_Red, Colour_Green, Colour_Blue.",
                "A red shirt becomes 1, 0, 0; a green shirt becomes 0, 1, 0; a blue shirt becomes 0, 0, 1.",
                "This is why it is called one-hot: exactly one column is hot (1) per row.",
                "It is best for nominal data with few categories and no natural order, like gender or city.",
                "It avoids the false ordering problem of label encoding, since no category looks greater than another.",
                "The price is extra columns, so it suits columns with a small number of categories."
              ]
            },
            {
              "q": "What is the main disadvantage of one-hot encoding?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "The main disadvantage is the explosion of columns when a category has many unique values.",
                "A column with 1000 cities becomes 1000 new columns, most of them zeros.",
                "This wastes memory and slows down training considerably.",
                "It also makes the data very sparse, which weakens many models.",
                "This problem is known as the curse of dimensionality.",
                "One common fix is to drop one column to avoid the dummy variable trap in linear models.",
                "Better fixes for high-cardinality data are hashing or target encoding.",
                "In short, one-hot encoding is excellent for few categories but breaks down for many."
              ]
            },
            {
              "q": "Write code for one-hot encoding in pandas and sklearn.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "One-hot encoding is a one-line operation in both pandas and sklearn.",
                "In pandas, get_dummies() converts the chosen columns instantly:",
                "    df = pd.get_dummies(df, columns=[\"city\"])",
                "This replaces the city column with one 0/1 column per city.",
                "In sklearn, OneHotEncoder fits into ML pipelines:",
                "    from sklearn.preprocessing import OneHotEncoder",
                "    enc = OneHotEncoder(sparse_output=False)",
                "    X_new = enc.fit_transform(df[[\"city\"]])",
                "The sklearn version remembers the categories, so it encodes new data consistently during prediction.",
                "Use pandas for quick analysis and sklearn when building a proper training pipeline."
              ]
            }
          ]
        },
        {
          "title": "Label Encoding",
          "points": [
            "Label encoding gives each category a number: Red=0, Green=1, Blue=2.",
            "Definition: label encoding replaces each category with an integer label, keeping everything in a single column. Example: sizes S, M, L become 0, 1, 2.",
            "It is simple and keeps only one column.",
            "The sklearn code: from sklearn.preprocessing import LabelEncoder; le = LabelEncoder(); df[\"size\"] = le.fit_transform(df[\"size\"]).",
            "fit_transform learns the mapping on training data; transform() alone is used on new data. The original labels can be recovered with le.inverse_transform() when needed.",
            "Best for ordinal data where order matters, like Poor=0, Average=1, Good=2, where the numbers correctly reflect increasing quality.",
            "Tree-based models also tolerate label-encoded nominal data fairly well, since they split on thresholds.",
            "Danger: the model may wrongly think Blue(2) is greater than Red(0). Avoid label encoding for nominal data with linear models, because the numbers create a false order, like encoding cities as 1, 2, 3 and tricking a linear model into treating city 3 as greater than city 1.",
            "In such cases one-hot encoding is the safer choice. The decision always depends on both the data type and the model being used."
          ],
          "questions": [
            {
              "q": "What is label encoding? Write the sklearn code.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Definition: Label encoding replaces each category with an integer label, keeping everything in a single column.",
                "Example: sizes S, M, L become 0, 1, 2.",
                "It is simple, compact and needs no extra columns.",
                "The sklearn code is:",
                "    from sklearn.preprocessing import LabelEncoder",
                "    le = LabelEncoder()",
                "    df[\"size\"] = le.fit_transform(df[\"size\"])",
                "fit_transform learns the mapping on training data; transform() alone is used on new data.",
                "The original labels can be recovered with le.inverse_transform() when needed.",
                "In short, label encoding is the compact way to number categories."
              ]
            },
            {
              "q": "When should label encoding be used, and when avoided?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Use label encoding for ordinal data, where the order of categories is real and meaningful.",
                "Example: grades Poor=0, Average=1, Good=2, where the numbers correctly reflect increasing quality.",
                "Tree-based models also tolerate label-encoded nominal data fairly well, since they split on thresholds.",
                "Avoid it for nominal data with linear models, because the numbers create a false order.",
                "Example: encoding cities as 1, 2, 3 tricks a linear model into treating city 3 as greater than city 1.",
                "In such cases one-hot encoding is the safer choice.",
                "The decision always depends on both the data type and the model being used.",
                "In short, use label encoding when order is real, avoid it when order would be invented."
              ]
            }
          ]
        },
        {
          "title": "One-Hot vs Label Encoding",
          "figures": [
            {
              "kind": "table",
              "caption": "One-hot vs label encoding on a Colour column",
              "table": {
                "headers": [
                  "Colour",
                  "Colour_Red",
                  "Colour_Green",
                  "Colour_Blue",
                  "Label code"
                ],
                "rows": [
                  [
                    "Red",
                    "1",
                    "0",
                    "0",
                    "0"
                  ],
                  [
                    "Green",
                    "0",
                    "1",
                    "0",
                    "1"
                  ],
                  [
                    "Blue",
                    "0",
                    "0",
                    "1",
                    "2"
                  ]
                ],
                "note": "One-hot is safe but wide. Label encoding is compact but pretends an order (0 < 1 < 2) that colours do not have."
              }
            }
          ],
          "points": [
            "One-hot creates many 0/1 columns; label encoding creates one numbered column.",
            "Use one-hot for nominal data with few categories; label encoding for ordinal data.",
            "One-hot avoids false ordering; label encoding is compact and tree-friendly.",
            "For high-cardinality data like 500 cities, both struggle; hashing or target encoding is used."
          ],
          "questions": [
            {
              "q": "Compare one-hot encoding and label encoding.",
            "figure": {
              "kind": "table",
              "caption": "One-hot vs label encoding on a Colour column",
              "table": {
                "headers": [
                  "Colour",
                  "Colour_Red",
                  "Colour_Green",
                  "Colour_Blue",
                  "Label code"
                ],
                "rows": [
                  [
                    "Red",
                    "1",
                    "0",
                    "0",
                    "0"
                  ],
                  [
                    "Green",
                    "0",
                    "1",
                    "0",
                    "1"
                  ],
                  [
                    "Blue",
                    "0",
                    "0",
                    "1",
                    "2"
                  ]
                ],
                "note": "One-hot is safe but wide. Label encoding is compact but pretends an order (0 < 1 < 2) that colours do not have."
              }
            },
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Both convert categories to numbers, but they do it in opposite ways.",
                "One-hot encoding creates many columns with 0/1 values: one new column per category.",
                "Label encoding creates a single column with integer values, one number per category.",
                "One-hot avoids false ordering completely, since no category looks larger than another.",
                "Label encoding is compact and memory-friendly, and it preserves real order in ordinal data.",
                "Example: Gender M/F suits one-hot encoding; Grade A/B/C suits label encoding.",
                "One-hot struggles with many categories due to column explosion; label encoding struggles with nominal data due to false order.",
                "In short, one-hot is safe but wide, label encoding is compact but order-sensitive."
              ]
            },
            {
              "q": "A 'city' column has 500 cities. Which encoding would you choose and why?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "A city column with 500 unique values is called high-cardinality data, and it needs special care.",
                "One-hot encoding would create 500 new columns, which wastes memory and slows training badly.",
                "Label encoding keeps just one column, which is far more practical here.",
                "Tree-based models like random forests handle label-encoded cities reasonably well.",
                "For linear models, even better options are hashing encoding or target encoding, which compress the cities smartly.",
                "The choice also depends on the model: trees tolerate label encoding, linear models prefer smarter encodings.",
                "Blindly one-hot encoding 500 cities is one of the most common beginner mistakes.",
                "In short, avoid one-hot for 500 cities; use label encoding for trees or target/hashing encoding for linear models."
              ]
            }
          ]
        },
        {
          "title": "Feature Extraction vs Feature Selection",
          "figures": [
            {
              "kind": "table",
              "caption": "Feature extraction vs feature selection",
              "table": {
                "headers": [
                  "",
                  "Feature selection",
                  "Feature extraction"
                ],
                "rows": [
                  [
                    "What it does",
                    "Picks the best existing features",
                    "Invents new compact features"
                  ],
                  [
                    "Example",
                    "Keep age and income from 20 columns",
                    "PCA merges 20 columns into 3"
                  ],
                  [
                    "Keeps original meaning?",
                    "Yes",
                    "No, the new axes are blends"
                  ],
                  [
                    "Best for",
                    "Interpretability, fewer columns",
                    "Compression, killing redundancy"
                  ]
                ],
                "note": "Selection picks the best old features. Extraction invents new compact ones."
              }
            }
          ],
          "points": [
            "Feature selection picks the best existing features and drops the rest.",
            "Feature extraction creates new smaller features from old ones, like PCA.",
            "Selection keeps the original meaning; extraction loses it but compresses better.",
            "Both aim to reduce dimensions, speed up training and improve the model.",
            "Both reduce the number of features, but they do it in fundamentally different ways.",
            "Feature selection chooses a subset of the original features and drops the rest. Example: keeping only age and income from 20 columns and deleting the other 18.",
            "Feature extraction builds brand-new features by combining the old ones. Example: PCA merges 20 columns into 3 new components that capture most of the information.",
            "Selection keeps the original column names and meanings, so results stay easy to explain. Extraction usually compresses better when features are highly correlated, but the new features have no simple meaning.",
            "Prefer feature selection when interpretability matters, because the original column names are kept. Example: a bank must explain why a loan was rejected, so it needs real features like income and credit score, not PCA components. Selection is also simpler to implement and easier to debug, and it works well when a few features are clearly useful and the rest are noise.",
            "Prefer extraction when maximum compression is the goal and meaning does not matter. Example: compressing 1000 image pixels into 50 components for faster training. Extraction also helps when features are highly correlated and selection cannot separate them cleanly.",
            "In short, selection picks the best old features, extraction invents new compact ones. Choose selection for explainable results and extraction for maximum compression."
          ],
          "questions": [
            {
              "q": "Distinguish between feature extraction and feature selection. (FE model paper; MCA ML Oct 2025)",
            "figure": {
              "kind": "table",
              "caption": "Feature extraction vs feature selection",
              "table": {
                "headers": [
                  "",
                  "Feature selection",
                  "Feature extraction"
                ],
                "rows": [
                  [
                    "What it does",
                    "Picks the best existing features",
                    "Invents new compact features"
                  ],
                  [
                    "Example",
                    "Keep age and income from 20 columns",
                    "PCA merges 20 columns into 3"
                  ],
                  [
                    "Keeps original meaning?",
                    "Yes",
                    "No, the new axes are blends"
                  ],
                  [
                    "Best for",
                    "Interpretability, fewer columns",
                    "Compression, killing redundancy"
                  ]
                ],
                "note": "Selection picks the best old features. Extraction invents new compact ones."
              }
            },
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "kind": "theory",
              "marks": 5,
              "years": null,
              "a": [
                "Both reduce the number of features, but they do it in fundamentally different ways.",
                "Feature selection chooses a subset of the original features and drops the rest.",
                "Example: keeping only age and income from 20 columns and deleting the other 18.",
                "Feature extraction builds brand-new features by combining the old ones.",
                "Example: PCA merges 20 columns into 3 new components that capture most of the information.",
                "Selection keeps the original column names and meanings, so results stay easy to explain.",
                "Extraction usually compresses better when features are highly correlated, but the new features have no simple meaning.",
                "In short, selection picks the best old features, extraction invents new compact ones."
              ]
            },
            {
              "q": "When would you prefer feature selection over extraction?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Prefer feature selection when interpretability matters, because the original column names are kept.",
                "Example: a bank must explain why a loan was rejected, so it needs real features like income and credit score, not PCA components.",
                "Selection is also simpler to implement and easier to debug.",
                "It works well when a few features are clearly useful and the rest are noise.",
                "Prefer extraction when maximum compression is the goal and meaning does not matter.",
                "Example: compressing 1000 image pixels into 50 components for faster training.",
                "Extraction also helps when features are highly correlated and selection cannot separate them cleanly.",
                "In short, choose selection for explainable results and extraction for maximum compression."
              ]
            }
          ]
        },
        {
          "title": "Steps in Feature Selection",
          "points": [
            "Step 1: generate candidate feature subsets to try.",
            "Step 2: evaluate each subset with a scoring method or model accuracy.",
            "Step 3: stop when the score stops improving or a limit is reached.",
            "Step 4: validate the chosen subset on fresh test data.",
            "Feature selection follows a systematic search process in four stages.",
            "Stage 1, subset generation: create candidate feature subsets to try, like {age}, {age, income} and {age, income, city}.",
            "Stage 2, subset evaluation: score each subset using a statistical measure or the actual model accuracy.",
            "Stage 3, stopping criterion: halt the search when scores stop improving or a time limit is reached.",
            "Stage 4, validation: confirm the chosen subset performs well on fresh unseen test data.",
            "This process can be forward (adding features), backward (removing features) or exhaustive for small data. Skipping validation is dangerous, because a subset can look good on training data but fail on new data.",
            "The four standard stages are generation, evaluation, stopping and validation, and they apply whether the method is filter, wrapper or hybrid. Missing the stopping stage wastes time; missing validation risks overfitting.",
            "A stopping criterion tells the search when to halt, and without it the process has no natural end: with n features there are 2^n possible subsets, so an exhaustive search quickly becomes impossible. Example: 30 features give over a billion subsets, which no computer can try fully.",
            "A good stopping rule saves huge amounts of time by quitting once scores stop improving, for example stopping when accuracy does not improve for 3 rounds in a row. It also prevents overfitting, because endlessly chasing tiny training gains usually hurts new data. Common rules are a fixed number of features, a score threshold or a time budget.",
            "In short, generate, evaluate, stop sensibly and validate."
          ],
          "questions": [
            {
              "q": "Explain the steps involved in feature selection.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Feature selection follows a systematic search process in four stages.",
                "Stage 1, subset generation: create candidate feature subsets to try, like {age}, {age, income} and {age, income, city}.",
                "Stage 2, subset evaluation: score each subset using a statistical measure or the actual model accuracy.",
                "Stage 3, stopping criterion: halt the search when scores stop improving or a time limit is reached.",
                "Stage 4, validation: confirm the chosen subset performs well on fresh unseen test data.",
                "This process can be forward (adding features), backward (removing features) or exhaustive for small data.",
                "Skipping validation is dangerous, because a subset can look good on training data but fail on new data.",
                "In short, generate, evaluate, stop sensibly and validate."
              ]
            },
            {
              "q": "What are the four stages of the feature selection process?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "The four standard stages of feature selection are generation, evaluation, stopping and validation.",
                "Generation: create candidate subsets of features to examine.",
                "Evaluation: score each subset with a metric, a statistical test or model performance.",
                "Stopping: halt the search when the score stops improving, a target size is reached, or time runs out.",
                "Validation: test the final selected subset on unseen data to confirm it truly works.",
                "These stages apply whether the method is filter, wrapper or hybrid.",
                "Missing the stopping stage wastes time; missing validation risks overfitting.",
                "In short, the four stages are generate, evaluate, stop and validate."
              ]
            },
            {
              "q": "Why is a stopping criterion needed in feature selection?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "A stopping criterion tells the search when to halt, and without it the process has no natural end.",
                "With n features there are 2^n possible subsets, so an exhaustive search quickly becomes impossible.",
                "Example: 30 features give over a billion subsets, which no computer can try fully.",
                "A good stopping rule saves huge amounts of time by quitting once scores stop improving.",
                "Example: stop when accuracy does not improve for 3 rounds in a row.",
                "It also prevents overfitting, because endlessly chasing tiny training gains usually hurts new data.",
                "Common rules are a fixed number of features, a score threshold or a time budget.",
                "In short, the stopping criterion keeps the search fast, practical and safe."
              ]
            }
          ]
        },
        {
          "title": "Filter, Wrapper and Hybrid Methods",
          "figures": [
            {
              "kind": "table",
              "caption": "Filter vs wrapper vs hybrid feature selection",
              "table": {
                "headers": [
                  "",
                  "Filter",
                  "Wrapper",
                  "Hybrid (embedded)"
                ],
                "rows": [
                  [
                    "How features are judged",
                    "Statistics like correlation, chi-square",
                    "The real model scores each subset",
                    "Selection happens during training"
                  ],
                  [
                    "Example",
                    "Chi-square test",
                    "RFE (recursive feature elimination)",
                    "Lasso, tree feature importance"
                  ],
                  [
                    "Speed",
                    "Fast",
                    "Slow",
                    "Medium"
                  ],
                  [
                    "Accuracy",
                    "Good",
                    "Best",
                    "Good"
                  ],
                  [
                    "Best use",
                    "Large data, quick shortlist",
                    "Small data, final accuracy",
                    "When the model trains anyway"
                  ]
                ],
                "note": "RFE is the wrapper example the model paper asks about."
              }
            }
          ],
          "points": [
            "Filter methods score features with statistics like correlation or chi-square, without any model; they are fast.",
            "Wrapper methods try feature subsets with the actual model, like forward selection and RFE; accurate but slow.",
            "Hybrid (embedded) methods select features during training, like Lasso and tree feature importance.",
            "Use filter for speed on large data; wrapper for best accuracy on small data."
          ],
          "questions": [
            {
              "q": "Explain filter, wrapper and hybrid feature selection methods. (IMCA DS Dec 2025, asked twice; MCA ML Oct 2025)",
            "figure": {
              "kind": "table",
              "caption": "Filter vs wrapper vs hybrid feature selection",
              "table": {
                "headers": [
                  "",
                  "Filter",
                  "Wrapper",
                  "Hybrid (embedded)"
                ],
                "rows": [
                  [
                    "How features are judged",
                    "Statistics like correlation, chi-square",
                    "The real model scores each subset",
                    "Selection happens during training"
                  ],
                  [
                    "Example",
                    "Chi-square test",
                    "RFE (recursive feature elimination)",
                    "Lasso, tree feature importance"
                  ],
                  [
                    "Speed",
                    "Fast",
                    "Slow",
                    "Medium"
                  ],
                  [
                    "Accuracy",
                    "Good",
                    "Best",
                    "Good"
                  ],
                  [
                    "Best use",
                    "Large data, quick shortlist",
                    "Small data, final accuracy",
                    "When the model trains anyway"
                  ]
                ],
                "note": "RFE is the wrapper example the model paper asks about."
              }
            },
              "tags": [
                "SURE MARK"
              ],
              "tagBase": "SURE MARK",
              "kind": "theory",
              "marks": 15,
              "years": null,
              "a": [
                "These are the three families of feature selection, differing in how they judge features.",
                "Filter methods rank features using statistics alone, with no model involved.",
                "Example: keep features with high correlation to the target, or use the chi-square test for categories.",
                "They are very fast and work well on large data, but they may miss interactions between features.",
                "Wrapper methods train the actual model on many feature subsets and keep the best-scoring subset.",
                "Example: recursive feature elimination (RFE) repeatedly drops the weakest feature.",
                "They are accurate because they test with the real model, but they are slow on large data.",
                "Hybrid or embedded methods perform selection inside training itself; example: Lasso regression shrinks useless feature weights to zero, and random forests rank features by importance."
              ]
            },
            {
              "q": "Compare filter and wrapper methods with examples.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Filter and wrapper methods differ in speed, accuracy and how they use the model.",
                "Filter methods use only statistics, so they are fast and model-independent.",
                "Example: a chi-square filter quickly ranks 1000 gene columns without training anything.",
                "But filters judge features one by one and can miss useful combinations.",
                "Wrapper methods train the real model on each candidate subset, so they are highly accurate.",
                "Example: RFE with logistic regression on 20 columns finds the subset that truly performs best.",
                "The price is speed: wrappers are far too slow for thousands of features.",
                "In short, use filters for speed on big data and wrappers for accuracy on small data."
              ]
            },
            {
              "q": "What is forward selection and backward elimination?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Both are wrapper-style search strategies that build the feature set step by step.",
                "Forward selection starts with an empty set and adds the best feature one at a time.",
                "After each addition the model is scored, and the process stops when the score stops improving.",
                "Backward elimination works in reverse: it starts with all features and removes the weakest one at a time.",
                "It also stops when removing more features starts hurting the score.",
                "Forward selection is cheaper when the final set is small; backward elimination sees feature interactions better at the start.",
                "Both are greedy methods, meaning they never reconsider an earlier choice.",
                "In short, forward selection builds up and backward elimination trims down."
              ]
            },
            {
              "q": "What are embedded methods? Give examples.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Definition: Embedded methods perform feature selection as a natural part of model training.",
                "Unlike filters and wrappers, there is no separate selection step; the model selects while it learns.",
                "Example 1: Lasso regression adds a penalty that forces the weights of useless features to exactly zero.",
                "The surviving non-zero weights reveal the selected features automatically.",
                "Example 2: random forests rank features by importance during training, so the lowest-ranked ones can be dropped.",
                "Embedded methods are faster than wrappers because selection and training happen together.",
                "They are also more accurate than filters because the real model guides the choice.",
                "In short, embedded methods select features as a side effect of training."
              ]
            },
            {
              "q": "Explain how Recursive Feature Elimination (RFE) works as a wrapper method for feature selection.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Definition: RFE is a wrapper method that finds the best features by repeatedly training a model and dropping the weakest feature.",
                "It is called a wrapper because it wraps around an actual machine learning model to judge features.",
                "Step 1: train the model on all features and rank them by importance, like the weights in logistic regression.",
                "Step 2: remove the single weakest feature from the set.",
                "Step 3: retrain the model on the remaining features and rank again.",
                "These steps repeat until only the desired number of features is left.",
                "Example: from 20 columns, RFE with logistic regression can narrow down to the 5 columns that truly drive predictions.",
                "It is accurate because the real model judges every subset, but slow on large data since it retrains many times.",
                "In short, RFE eliminates features one by one until only the strongest survive."
              ]
            }
          ]
        },
        {
          "title": "PCA - Introduction and Application",
          "figures": [
            {
              "kind": "svg",
              "src": "/diagrams/fe-12-pca.svg",
              "caption": "PCA: the first principal component is the direction of maximum spread",
              "alt": "PCA maximum variance projection diagram"
            }
          ],
          "points": [
            "PCA (Principal Component Analysis) reduces dimensions by finding new axes called principal components.",
            "Dimensionality reduction is the process of reducing the number of features in a dataset while keeping as much information as possible.",
            "High-dimensional data, like images with thousands of pixels, is slow to process and hard to visualise.",
            "It is important first for speed: fewer features mean faster training and less memory. Second, it fights overfitting: extra useless dimensions give the model more noise to memorise. Third, it enables visualisation: reducing to 2 or 3 dimensions lets us actually plot and see the data.",
            "Two main routes exist: feature selection, which picks the best original features, and feature extraction like PCA, which builds new compact ones. Example: 100 correlated sensor readings compressed to 5 PCA components keep nearly all the useful signal.",
            "PCA is a feature extraction technique that reduces dimensions by finding new uncorrelated axes called principal components.",
            "The first component captures the maximum variance in the data.",
            "The first component captures the maximum variance (spread) in the data, the second captures the next most, and so on.",
            "Principal components are the new axes created by PCA from combinations of the original features. Each component is a weighted mix of all original features, pointing in a direction of high data spread. They are uncorrelated with each other, meaning each one captures fresh information the others missed.",
            "Components are ordered by their eigenvalues, which measure how much variance each one explains. Example: from height and weight, the first component might represent overall body size. We usually keep only the top few components and discard the rest as noise.",
            "Used for visualization, noise reduction and faster training.",
            "Three classic applications: visualization (reducing 100 features to 2 lets us plot and actually see clusters in the data); noise reduction and faster training (dropping low-variance components removes noise and shrinks the data models must process); compression (images, sensor readings and gene data are compressed into fewer components before modeling). It is also used for anomaly detection, since points far from the main components look suspicious.",
            "Steps: standardize data, compute covariance matrix, find eigenvectors, pick top components, project data.",
            "Step 1: standardize all features so that large-range features do not dominate. Step 2: compute the covariance matrix, which shows how features vary together. Step 3: find its eigenvectors and eigenvalues; the eigenvectors are the new axes and eigenvalues show their importance. Step 4: keep the top components that capture most of the variance and project the data onto them.",
            "Why standardization: PCA looks for the directions of maximum variance, so scale differences would hijack the result. A feature with a huge range, like salary in lakhs, has far more variance than age in tens, purely because of units; without standardization the first principal component would simply point along salary and ignore everything else. Standardization puts every feature on the same scale, with mean 0 and standard deviation 1, so variance truly reflects information content, not measurement units. This is why every PCA pipeline starts with StandardScaler.",
            "sklearn code with 2 components: from sklearn.preprocessing import StandardScaler; from sklearn.decomposition import PCA; X_scaled = StandardScaler().fit_transform(X); X_pca = PCA(n_components=2).fit_transform(X_scaled).",
            "StandardScaler gives every feature mean 0 and standard deviation 1; PCA(n_components=2) keeps the two most important components. The result X_pca has only 2 columns and can be plotted or fed into a model. Remember: fit the scaler and PCA on training data only, then transform test data with the same objects.",
            "In short, dimensionality reduction keeps the signal, drops the bulk, and makes models faster and clearer."
          ],
          "questions": [
            {
              "q": "What is dimensionality reduction? Why is it important? (IMCA DS Dec 2025; MCA ML Dec 2023, asked twice)",
              "tags": [
                "SURE MARK"
              ],
              "tagBase": "SURE MARK",
              "kind": "theory",
              "marks": 15,
              "years": null,
              "a": [
                "Definition: Dimensionality reduction is the process of reducing the number of features in a dataset while keeping as much information as possible.",
                "High-dimensional data, like images with thousands of pixels, is slow to process and hard to visualise.",
                "It is important first for speed: fewer features mean faster training and less memory.",
                "Second, it fights overfitting: extra useless dimensions give the model more noise to memorise.",
                "Third, it enables visualisation: reducing to 2 or 3 dimensions lets us actually plot and see the data.",
                "Two main routes exist: feature selection, which picks the best original features, and feature extraction like PCA, which builds new compact ones.",
                "Example: 100 correlated sensor readings compressed to 5 PCA components keep nearly all the useful signal.",
                "In short, dimensionality reduction keeps the signal, drops the bulk, and makes models faster and clearer."
              ]
            },
            {
              "q": "What is PCA? Explain its steps. (IMCA DS Dec 2025; MCA ML Oct 2025)",
            "figure": {
              "kind": "svg",
              "src": "/diagrams/fe-12-pca.svg",
              "caption": "PCA: the first principal component is the direction of maximum spread",
              "alt": "PCA maximum variance projection diagram"
            },
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "kind": "theory",
              "marks": 5,
              "years": null,
              "a": [
                "Definition: PCA (Principal Component Analysis) is a feature extraction technique that reduces dimensions by finding new uncorrelated axes called principal components.",
                "The first component captures the maximum variance (spread) in the data, the second captures the next most, and so on.",
                "It is used for visualization, noise reduction and faster model training.",
                "Step 1: standardize all features so that large-range features do not dominate.",
                "Step 2: compute the covariance matrix, which shows how features vary together.",
                "Step 3: find its eigenvectors and eigenvalues; the eigenvectors are the new axes and eigenvalues show their importance.",
                "Step 4: keep the top components that capture most of the variance and project the data onto them.",
                "Example: 100 correlated sensor readings can be compressed into 5 components with little information loss."
              ]
            },
            {
              "q": "Why is standardization needed before PCA?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "PCA looks for the directions of maximum variance, so scale differences would hijack the result.",
                "A feature with a huge range, like salary in lakhs, has far more variance than age in tens, purely because of units.",
                "Without standardization, the first principal component would simply point along salary and ignore everything else.",
                "Standardization puts every feature on the same scale, with mean 0 and standard deviation 1.",
                "After that, variance truly reflects information content, not measurement units.",
                "Example: without scaling, salary crushes age in the components; with scaling, both contribute fairly.",
                "This is why every PCA pipeline starts with StandardScaler.",
                "In short, standardization stops big units from bullying small units in PCA."
              ]
            },
            {
              "q": "What are principal components?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Definition: Principal components are the new axes created by PCA from combinations of the original features.",
                "Each component is a weighted mix of all original features, pointing in a direction of high data spread.",
                "They are uncorrelated with each other, meaning each one captures fresh information the others missed.",
                "The first component holds the maximum possible variance, the second holds the next most, and so on.",
                "Components are ordered by their eigenvalues, which measure how much variance each one explains.",
                "Example: from height and weight, the first component might represent overall body size.",
                "We usually keep only the top few components and discard the rest as noise.",
                "In short, principal components are new smarter axes ranked by importance."
              ]
            },
            {
              "q": "List three applications of PCA.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "PCA is used wherever high dimensions cause trouble, and three classic applications stand out.",
                "Application 1: visualization. Reducing 100 features to 2 lets us plot and actually see clusters in the data.",
                "Application 2: noise reduction and faster training. Dropping low-variance components removes noise and shrinks the data models must process.",
                "Application 3: compression. Images, sensor readings and gene data are compressed into fewer components before modeling.",
                "It is also used for anomaly detection, since points far from the main components look suspicious.",
                "In all cases the idea is the same: keep the signal, drop the excess dimensions.",
                "PCA is often the first step tried when a dataset feels too wide to handle.",
                "In short, PCA visualizes, denoises and compresses high-dimensional data."
              ]
            },
            {
              "q": "Write sklearn code for PCA with 2 components.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "PCA in sklearn takes just a few lines, but standardization must come first.",
                "Code:",
                "    from sklearn.preprocessing import StandardScaler",
                "    from sklearn.decomposition import PCA",
                "    X_scaled = StandardScaler().fit_transform(X)",
                "    X_pca = PCA(n_components=2).fit_transform(X_scaled)",
                "StandardScaler gives every feature mean 0 and standard deviation 1.",
                "PCA(n_components=2) keeps the two most important components.",
                "The result X_pca has only 2 columns and can be plotted or fed into a model.",
                "Remember: fit the scaler and PCA on training data only, then transform test data with the same objects.",
                "In short, scale first, then reduce to 2 components."
              ]
            }
          ]
        }
      ]
    },
];

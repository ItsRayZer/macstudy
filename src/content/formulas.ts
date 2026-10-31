// src/content/formulas.ts
// Formula charts: per-module formula sheets for the modules that have them
// (QT all 4, DAA all 3). Every formula is taken from the existing content
// points (content_*.py) and rendered in plain ASCII monospace, grouped by
// topic, each with a one-line label of what it computes. Nothing is
// invented: modules without formulas simply have no entry here, and the UI
// shows no Formulas link for them.

export interface FormulaEntry {
  /** One-line label: what this computes. */
  label: string;
  /** The formula in plain ASCII, rendered monospace. */
  formula: string;
}

export interface FormulaGroup {
  topic: string;
  items: FormulaEntry[];
}

export interface ModuleFormulas {
  subject: string;
  module: string;
  groups: FormulaGroup[];
}

export const FORMULAS: ModuleFormulas[] = [
  // ------------------------------------------------------- QT module 1 ---
  {
    subject: "QT",
    module: "1",
    groups: [
      {
        topic: "Diagrams and Graphs",
        items: [
          {
            label: "Pie diagram sector angle for one component",
            formula: "angle = 360 x (component value / total)",
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------- QT module 2 ---
  {
    subject: "QT",
    module: "2",
    groups: [
      {
        topic: "Arithmetic Mean",
        items: [
          {
            label: "Mean of individual series",
            formula: "xbar = (sum of x) / N",
          },
          {
            label: "Mean of discrete series",
            formula: "xbar = (sum of f*x) / (sum of f)",
          },
          {
            label: "Mean of continuous series (m = class mid-point)",
            formula: "xbar = (sum of f*m) / (sum of f)",
          },
        ],
      },
      {
        topic: "Median",
        items: [
          {
            label: "Median position, odd N",
            formula: "median = value at position (N+1)/2",
          },
          {
            label: "Median position, even N",
            formula: "median = average of values at N/2 and (N/2)+1",
          },
        ],
      },
      {
        topic: "Empirical Relationship between Mean, Median and Mode",
        items: [
          {
            label: "Mode from median and mean (moderately skewed data)",
            formula: "Mode = 3*Median - 2*Mean",
          },
        ],
      },
      {
        topic: "Combined Mean and Weighted Mean",
        items: [
          {
            label: "Combined mean of two groups",
            formula: "xbar12 = (n1*xbar1 + n2*xbar2) / (n1 + n2)",
          },
          {
            label: "Weighted mean",
            formula: "xbar_w = (sum of w*x) / (sum of w)",
          },
        ],
      },
      {
        topic: "Partition Values",
        items: [
          {
            label: "First quartile position in ordered data",
            formula: "Q1 = value at (N+1)/4",
          },
          {
            label: "Third quartile position in ordered data",
            formula: "Q3 = value at 3*(N+1)/4",
          },
        ],
      },
      {
        topic: "Range, Quartile Deviation and Mean Deviation",
        items: [
          { label: "Range", formula: "Range = maximum - minimum" },
          {
            label: "Quartile deviation",
            formula: "QD = (Q3 - Q1) / 2",
          },
          {
            label: "Mean deviation about the mean or median",
            formula: "MD = (sum of |x - average|) / N",
          },
        ],
      },
      {
        topic: "Standard Deviation, Variance and Coefficient of Variation",
        items: [
          {
            label: "Standard deviation",
            formula: "SD = sqrt( sum((x - xbar)^2) / N )",
          },
          {
            label: "Variance",
            formula: "Variance = (SD)^2 = sum((x - xbar)^2) / N",
          },
          {
            label: "Coefficient of variation (compare two datasets)",
            formula: "CV = (SD / xbar) * 100",
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------- QT module 3 ---
  {
    subject: "QT",
    module: "3",
    groups: [
      {
        topic: "Karl Pearson's Coefficient of Correlation",
        items: [
          {
            label: "Pearson's r (always between -1 and +1)",
            formula:
              "r = [N*sum(xy) - sum(x)*sum(y)] / sqrt([N*sum(x^2) - (sum(x))^2] * [N*sum(y^2) - (sum(y))^2])",
          },
        ],
      },
      {
        topic: "Probable Error and Coefficient of Determination",
        items: [
          {
            label: "Probable error of r (significant if r > 6*PE)",
            formula: "PE = 0.6745 * (1 - r^2) / sqrt(N)",
          },
          {
            label: "Coefficient of determination",
            formula: "R^2 = r^2",
          },
        ],
      },
      {
        topic: "Spearman's Rank Correlation",
        items: [
          {
            label: "Rank correlation (d = rank difference)",
            formula: "rho = 1 - [6 * sum(d^2)] / [n * (n^2 - 1)]",
          },
          {
            label: "Tie correction for a tie of size t",
            formula: "add (t^3 - t)/12 to sum(d^2)",
          },
        ],
      },
      {
        topic: "Regression Equations",
        items: [
          {
            label: "Regression line of y on x",
            formula: "y - ybar = byx * (x - xbar),  byx = r * (SDy / SDx)",
          },
          {
            label: "Regression line of x on y",
            formula: "x - xbar = bxy * (y - ybar),  bxy = r * (SDx / SDy)",
          },
        ],
      },
      {
        topic: "Relation between Correlation and Regression Coefficients",
        items: [
          {
            label: "r from the two regression coefficients",
            formula: "r^2 = byx * bxy",
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------- QT module 4 ---
  {
    subject: "QT",
    module: "4",
    groups: [
      {
        topic: "Definitions of Probability",
        items: [
          {
            label: "Classical probability",
            formula: "P(A) = favourable outcomes / total equally likely outcomes",
          },
          {
            label: "Empirical probability",
            formula: "P(A) = (times A occurred) / (total trials)",
          },
          {
            label: "Complement rule",
            formula: "P(A') = 1 - P(A)",
          },
        ],
      },
      {
        topic: "Addition Theorem",
        items: [
          {
            label: "Probability of A or B",
            formula: "P(A u B) = P(A) + P(B) - P(A int B)",
          },
          {
            label: "Mutually exclusive events",
            formula: "P(A u B) = P(A) + P(B)",
          },
        ],
      },
      {
        topic: "Conditional Probability",
        items: [
          {
            label: "Probability of A given B already happened",
            formula: "P(A|B) = P(A int B) / P(B)",
          },
        ],
      },
      {
        topic: "Multiplication Theorem",
        items: [
          {
            label: "Probability of A and B",
            formula: "P(A int B) = P(A) * P(B|A)",
          },
          {
            label: "Independent events",
            formula: "P(A int B) = P(A) * P(B)",
          },
        ],
      },
      {
        topic: "Bayes Theorem",
        items: [
          {
            label: "Reverse the condition: probable cause Ai given effect B",
            formula: "P(Ai|B) = [P(Ai)*P(B|Ai)] / [sum over j of P(Aj)*P(B|Aj)]",
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------ DAA module 1 ---
  {
    subject: "DAA",
    module: "1",
    groups: [
      {
        topic: "Asymptotic Notations",
        items: [
          {
            label: "Big-O, upper bound",
            formula: "f(n) = O(g(n)) if f(n) <= c*g(n) for n >= n0",
          },
          {
            label: "Omega, lower bound",
            formula: "f(n) = Omega(g(n)) if f(n) >= c*g(n) for n >= n0",
          },
          {
            label: "Theta, tight bound",
            formula: "f(n) = Theta(g(n)) if c1*g(n) <= f(n) <= c2*g(n)",
          },
        ],
      },
      {
        topic: "Recursion Analysis",
        items: [
          {
            label: "Factorial recurrence with base case",
            formula: "factorial(n) = n * factorial(n-1),  factorial(0) = 1",
          },
          {
            label: "Typical divide and conquer recurrence",
            formula: "T(n) = 2T(n/2) + n",
          },
          {
            label: "Master method form (compare f(n) with n^(log_b a))",
            formula: "T(n) = aT(n/b) + f(n)",
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------ DAA module 2 ---
  {
    subject: "DAA",
    module: "2",
    groups: [
      {
        topic: "Binary Search",
        items: [
          {
            label: "Recurrence and complexity (sorted array)",
            formula: "T(n) = T(n/2) + 1  =  O(log n)",
          },
        ],
      },
      {
        topic: "Finding Maximum and Minimum",
        items: [
          {
            label: "Divide and conquer comparison count",
            formula: "3n/2 - 2 comparisons (beats 2n - 2)",
          },
        ],
      },
      {
        topic: "Merge Sort",
        items: [
          {
            label: "Recurrence and complexity, all cases",
            formula: "T(n) = 2T(n/2) + n  =  O(n log n)",
          },
        ],
      },
      {
        topic: "Quick Sort",
        items: [
          {
            label: "Best and average case",
            formula: "T(n) = 2T(n/2) + n  =  O(n log n)",
          },
          {
            label: "Worst case (bad pivot every time)",
            formula: "T(n) = T(n-1) + n  =  O(n^2)",
          },
        ],
      },
      {
        topic: "Strassen's Matrix Multiplication",
        items: [
          {
            label: "Recurrence and complexity",
            formula: "T(n) = 7T(n/2) + O(n^2)  =  O(n^2.81)",
          },
        ],
      },
      {
        topic: "Knapsack Problem",
        items: [
          {
            label: "Fractional knapsack, greedy by profit/weight",
            formula: "sort by p/w ratio descending  =  O(n log n)",
          },
        ],
      },
      {
        topic: "Minimum Spanning Tree",
        items: [
          {
            label: "Prim's complexity",
            formula: "O(V^2) with array,  O(E log V) with heap",
          },
          {
            label: "Kruskal's complexity (sorting dominates)",
            formula: "O(E log E)",
          },
        ],
      },
      {
        topic: "Dijkstra's Shortest Path",
        items: [
          {
            label: "Edge relaxation step",
            formula: "if dist[u] + w(u,v) < dist[v], update dist[v]",
          },
          {
            label: "Complexity (non-negative weights only)",
            formula: "O(V^2) simple,  O(E log V) with heap",
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------ DAA module 3 ---
  {
    subject: "DAA",
    module: "3",
    groups: [
      {
        topic: "Dynamic Programming",
        items: [
          {
            label: "Fibonacci: naive recursion vs DP",
            formula: "naive O(2^n)  ->  DP O(n)",
          },
        ],
      },
      {
        topic: "Floyd Warshall Algorithm",
        items: [
          {
            label: "All-pairs shortest path recurrence",
            formula:
              "D[k][i][j] = min(D[k-1][i][j], D[k-1][i][k] + D[k-1][k][j])",
          },
          { label: "Time complexity", formula: "O(V^3)" },
        ],
      },
      {
        topic: "Graph Traversal",
        items: [
          { label: "BFS time (queue, level by level)", formula: "O(V + E)" },
          { label: "DFS time (stack/recursion)", formula: "O(V + E)" },
        ],
      },
    ],
  },
];

/** Formula chart for a module, or undefined when the module has none. */
export function getModuleFormulas(
  short: string,
  num: string,
): ModuleFormulas | undefined {
  return FORMULAS.find((f) => f.subject === short && f.module === num);
}

/** Every (subject, module) pair that has a formula chart. */
export function modulesWithFormulas(): { short: string; num: string }[] {
  return FORMULAS.map((f) => ({ short: f.subject, num: f.module }));
}

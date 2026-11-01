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
  /** Compact legend defining the symbols, shown as "where: ...". */
  where?: string;
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
            where: "component value = size of the slice, total = sum of all values",
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
            where: "x = each value, N = number of values",
          },
          {
            label: "Mean of discrete series",
            formula: "xbar = (sum of f*x) / (sum of f)",
            where: "f = frequency of each value, x = the value",
          },
          {
            label: "Mean of continuous series (m = class mid-point)",
            formula: "xbar = (sum of f*m) / (sum of f)",
            where: "m = mid-point of each class, f = frequency",
          },
        ],
      },
      {
        topic: "Median",
        items: [
          {
            label: "Median position, odd N",
            formula: "median = value at position (N+1)/2",
            where: "arrange data in ascending order first, N is odd",
          },
          {
            label: "Median position, even N",
            formula: "median = average of values at N/2 and (N/2)+1",
            where: "arrange data in ascending order first, N is even",
          },
        ],
      },
      {
        topic: "Empirical Relationship between Mean, Median and Mode",
        items: [
          {
            label: "Mode from median and mean (moderately skewed data)",
            formula: "Mode = 3*Median - 2*Mean",
            where: "use only when data is moderately skewed",
          },
        ],
      },
      {
        topic: "Combined Mean and Weighted Mean",
        items: [
          {
            label: "Combined mean of two groups",
            formula: "xbar12 = (n1*xbar1 + n2*xbar2) / (n1 + n2)",
            where: "n1, n2 = sizes of the two groups",
          },
          {
            label: "Weighted mean",
            formula: "xbar_w = (sum of w*x) / (sum of w)",
            where: "w = weight given to each value",
          },
        ],
      },
      {
        topic: "Partition Values",
        items: [
          {
            label: "First quartile position in ordered data",
            formula: "Q1 = value at (N+1)/4",
            where: "arrange data in ascending order first",
          },
          {
            label: "Third quartile position in ordered data",
            formula: "Q3 = value at 3*(N+1)/4",
            where: "arrange data in ascending order first",
          },
        ],
      },
      {
        topic: "Range, Quartile Deviation and Mean Deviation",
        items: [
          { label: "Range", formula: "Range = maximum - minimum", where: "maximum and minimum are the largest and smallest values" },
          {
            label: "Quartile deviation",
            formula: "QD = (Q3 - Q1) / 2",
            where: "Q1, Q3 = first and third quartiles",
          },
          {
            label: "Mean deviation about the mean or median",
            formula: "MD = (sum of |x - average|) / N",
            where: "average = mean or median, | | = ignore the sign",
          },
        ],
      },
      {
        topic: "Standard Deviation, Variance and Coefficient of Variation",
        items: [
          {
            label: "Standard deviation",
            formula: "SD = sqrt( sum((x - xbar)^2) / N )",
            where: "xbar = mean, N = number of values",
          },
          {
            label: "Variance",
            formula: "Variance = (SD)^2 = sum((x - xbar)^2) / N",
            where: "the square of the standard deviation",
          },
          {
            label: "Coefficient of variation (compare two datasets)",
            formula: "CV = (SD / xbar) * 100",
            where: "lower CV means more consistent data",
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
            where: "N = number of (x, y) pairs",
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
            where: "r counts as significant only when r is bigger than 6 times PE",
          },
          {
            label: "Coefficient of determination",
            formula: "R^2 = r^2",
            where: "fraction of the variation in y explained by x",
          },
        ],
      },
      {
        topic: "Spearman's Rank Correlation",
        items: [
          {
            label: "Rank correlation (d = rank difference)",
            formula: "rho = 1 - [6 * sum(d^2)] / [n * (n^2 - 1)]",
            where: "d = difference of the two ranks for each item, n = items",
          },
          {
            label: "Tie correction for a tie of size t",
            formula: "add (t^3 - t)/12 to sum(d^2)",
            where: "t = how many items share the tied rank; add once per tie",
          },
        ],
      },
      {
        topic: "Regression Equations",
        items: [
          {
            label: "Regression line of y on x",
            formula: "y - ybar = byx * (x - xbar),  byx = r * (SDy / SDx)",
            where: "byx = change in y for one unit change in x",
          },
          {
            label: "Regression line of x on y",
            formula: "x - xbar = bxy * (y - ybar),  bxy = r * (SDx / SDy)",
            where: "bxy = change in x for one unit change in y",
          },
        ],
      },
      {
        topic: "Relation between Correlation and Regression Coefficients",
        items: [
          {
            label: "r from the two regression coefficients",
            formula: "r^2 = byx * bxy",
            where: "r takes the sign of byx and bxy",
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
            where: "use when every outcome is equally likely",
          },
          {
            label: "Empirical probability",
            formula: "P(A) = (times A occurred) / (total trials)",
            where: "based on how often A happened in past trials",
          },
          {
            label: "Complement rule",
            formula: "P(A') = 1 - P(A)",
            where: "A' means A does not happen",
          },
        ],
      },
      {
        topic: "Addition Theorem",
        items: [
          {
            label: "Probability of A or B",
            formula: "P(A u B) = P(A) + P(B) - P(A int B)",
            where: "u = or, int = both happen together",
          },
          {
            label: "Mutually exclusive events",
            formula: "P(A u B) = P(A) + P(B)",
            where: "A and B can never happen together",
          },
        ],
      },
      {
        topic: "Conditional Probability",
        items: [
          {
            label: "Probability of A given B already happened",
            formula: "P(A|B) = P(A int B) / P(B)",
            where: "P(A|B) reads as probability of A given B",
          },
        ],
      },
      {
        topic: "Multiplication Theorem",
        items: [
          {
            label: "Probability of A and B",
            formula: "P(A int B) = P(A) * P(B|A)",
            where: "multiply along the branches",
          },
          {
            label: "Independent events",
            formula: "P(A int B) = P(A) * P(B)",
            where: "one event does not affect the other",
          },
        ],
      },
      {
        topic: "Bayes Theorem",
        items: [
          {
            label: "Reverse the condition: probable cause Ai given effect B",
            formula: "P(Ai|B) = [P(Ai)*P(B|Ai)] / [sum over j of P(Aj)*P(B|Aj)]",
            where: "Ai = one possible cause, B = the effect you saw",
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
            where: "c and n0 are positive constants; f grows at most like g",
          },
          {
            label: "Omega, lower bound",
            formula: "f(n) = Omega(g(n)) if f(n) >= c*g(n) for n >= n0",
            where: "c and n0 are positive constants; f grows at least like g",
          },
          {
            label: "Theta, tight bound",
            formula: "f(n) = Theta(g(n)) if c1*g(n) <= f(n) <= c2*g(n)",
            where: "c1, c2 and n0 are positive constants; f grows exactly like g",
          },
        ],
      },
      {
        topic: "Recursion Analysis",
        items: [
          {
            label: "Factorial recurrence with base case",
            formula: "factorial(n) = n * factorial(n-1),  factorial(0) = 1",
            where: "the base case factorial(0) = 1 stops the recursion",
          },
          {
            label: "Typical divide and conquer recurrence",
            formula: "T(n) = 2T(n/2) + n",
            where: "T(n) = running time for input size n",
          },
          {
            label: "Master method form (compare f(n) with n^(log_b a))",
            formula: "T(n) = aT(n/b) + f(n)",
            where: "a = subproblems, n/b = size of each subproblem",
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
            where: "halving the array each step gives log n",
          },
        ],
      },
      {
        topic: "Finding Maximum and Minimum",
        items: [
          {
            label: "Divide and conquer comparison count",
            formula: "3n/2 - 2 comparisons (beats 2n - 2)",
            where: "n = number of elements; beats the naive 2n - 2",
          },
        ],
      },
      {
        topic: "Merge Sort",
        items: [
          {
            label: "Recurrence and complexity, all cases",
            formula: "T(n) = 2T(n/2) + n  =  O(n log n)",
            where: "split in half, merge in linear time",
          },
        ],
      },
      {
        topic: "Quick Sort",
        items: [
          {
            label: "Best and average case",
            formula: "T(n) = 2T(n/2) + n  =  O(n log n)",
            where: "good pivot splits the array roughly in half",
          },
          {
            label: "Worst case (bad pivot every time)",
            formula: "T(n) = T(n-1) + n  =  O(n^2)",
            where: "bad pivot shrinks the array by only one element",
          },
        ],
      },
      {
        topic: "Strassen's Matrix Multiplication",
        items: [
          {
            label: "Recurrence and complexity",
            formula: "T(n) = 7T(n/2) + O(n^2)  =  O(n^2.81)",
            where: "7 subproblems instead of 8, so it beats n^3",
          },
        ],
      },
      {
        topic: "Knapsack Problem",
        items: [
          {
            label: "Fractional knapsack, greedy by profit/weight",
            formula: "sort by p/w ratio descending  =  O(n log n)",
            where: "p = profit, w = weight; take fractions when needed",
          },
        ],
      },
      {
        topic: "Minimum Spanning Tree",
        items: [
          {
            label: "Prim's complexity",
            formula: "O(V^2) with array,  O(E log V) with heap",
            where: "V = vertices, E = edges",
          },
          {
            label: "Kruskal's complexity (sorting dominates)",
            formula: "O(E log E)",
            where: "V = vertices, E = edges",
          },
        ],
      },
      {
        topic: "Dijkstra's Shortest Path",
        items: [
          {
            label: "Edge relaxation step",
            formula: "if dist[u] + w(u,v) < dist[v], update dist[v]",
            where: "dist = shortest known distance, w(u,v) = edge weight",
          },
          {
            label: "Complexity (non-negative weights only)",
            formula: "O(V^2) simple,  O(E log V) with heap",
            where: "V = vertices, E = edges; fails on negative weights",
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
            where: "DP computes each subproblem once and stores it",
          },
        ],
      },
      {
        topic: "Floyd Warshall Algorithm",
        items: [
          {
            label: "All-pairs shortest path recurrence",
            where: "k = intermediate vertices allowed so far",
            formula:
              "D[k][i][j] = min(D[k-1][i][j], D[k-1][i][k] + D[k-1][k][j])",
          },
          { label: "Time complexity", formula: "O(V^3)", where: "V = vertices" },
        ],
      },
      {
        topic: "Graph Traversal",
        items: [
          { label: "BFS time (queue, level by level)", formula: "O(V + E)", where: "visits every vertex and edge once" },
          { label: "DFS time (stack/recursion)", formula: "O(V + E)", where: "visits every vertex and edge once" },
        ],
      },
    ],
  },
  // ----------------------------------------------------- DBMS module 1 ---
  {
    subject: "DBMS",
    module: "1",
    groups: [
      {
        topic: "DBMS Basics",
        items: [
          { label: "ACID properties", formula: "Atomicity, Consistency, Isolation, Durability", where: "transaction guarantees" },
          { label: "Three-schema architecture", formula: "External -> Conceptual -> Internal", where: "view, logical, physical levels" },
          { label: "Data independence types", formula: "Logical + Physical", where: "change schema without affecting above" },
        ],
      },
    ],
  },
  // ----------------------------------------------------- DBMS module 2 ---
  {
    subject: "DBMS",
    module: "2",
    groups: [
      {
        topic: "ER Model",
        items: [
          { label: "Entity -> Table", formula: "Each entity set becomes a table", where: "ER to relational mapping" },
          { label: "1:N relationship", formula: "Foreign key on N side", where: "e.g. Dept (1) -> Emp (N)" },
          { label: "M:N relationship", formula: "Separate junction table", where: "with FKs to both sides" },
        ],
      },
      {
        topic: "SQL Patterns",
        items: [
          { label: "Basic select", formula: "SELECT cols FROM table WHERE cond", where: "cols=* for all" },
          { label: "Join", formula: "SELECT * FROM A JOIN B ON A.id = B.a_id", where: "inner join on FK" },
          { label: "Aggregate with filter", formula: "SELECT COUNT(*) FROM t WHERE x > 5", where: "COUNT, SUM, AVG, MIN, MAX" },
          { label: "Group by", formula: "SELECT dept, COUNT(*) FROM emp GROUP BY dept", where: "aggregate per group" },
        ],
      },
    ],
  },
  // ----------------------------------------------------- DBMS module 3 ---
  {
    subject: "DBMS",
    module: "3",
    groups: [
      {
        topic: "Normalization",
        items: [
          { label: "1NF", formula: "Atomic values only, no repeating groups", where: "first normal form" },
          { label: "2NF", formula: "1NF + no partial dependency", where: "non-key attrs depend on whole key" },
          { label: "3NF", formula: "2NF + no transitive dependency", where: "non-key attrs depend only on key" },
          { label: "BCNF", formula: "Every determinant is a candidate key", where: "stricter than 3NF" },
        ],
      },
    ],
  },
  // ----------------------------------------------------- DBMS module 4 ---
  {
    subject: "DBMS",
    module: "4",
    groups: [
      {
        topic: "Transactions",
        items: [
          { label: "Transaction states", formula: "Active -> Partially Committed -> Committed / Failed -> Aborted", where: "state diagram" },
          { label: "Serializability", formula: "Conflict-equivalent to a serial schedule", where: "correctness criterion" },
        ],
      },
    ],
  },
  // -------------------------------------------------------- SF module 1 ---
  {
    subject: "SF",
    module: "1",
    groups: [
      {
        topic: "Process Models",
        items: [
          { label: "Waterfall phases", formula: "Req -> Design -> Code -> Test -> Maintain", where: "linear sequential" },
          { label: "Spiral quadrants", formula: "Plan -> Risk -> Develop -> Evaluate", where: "iterative, risk-driven" },
        ],
      },
    ],
  },
  // -------------------------------------------------------- SF module 2 ---
  {
    subject: "SF",
    module: "2",
    groups: [
      {
        topic: "Testing & Metrics",
        items: [
          { label: "Cyclomatic complexity", formula: "V(G) = E - N + 2P", where: "E=edges, N=nodes, P=components" },
          { label: "Basis path testing", formula: "Test each independent path", where: "paths = V(G)" },
        ],
      },
    ],
  },
  // -------------------------------------------------------- SF module 3 ---
  {
    subject: "SF",
    module: "3",
    groups: [
      {
        topic: "Estimation",
        items: [
          { label: "COCOMO basic", formula: "Effort = a x (KLOC)^b", where: "a,b depend on project mode" },
          { label: "Function points", formula: "FP = UFC x TCF", where: "unadjusted x technical complexity" },
        ],
      },
    ],
  },
  // ---------------------------------------------------- Python module 1 ---
  {
    subject: "PYTHON",
    module: "1",
    groups: [
      {
        topic: "Core Syntax",
        items: [
          { label: "List slicing", formula: "a[start:stop:step]", where: "stop exclusive, step optional" },
          { label: "List comprehension", formula: "[x*2 for x in a if x > 0]", where: "compact loop+filter" },
          { label: "Dict access", formula: "d.get(key, default)", where: "safe, no KeyError" },
        ],
      },
    ],
  },
  // ---------------------------------------------------- Python module 2 ---
  {
    subject: "PYTHON",
    module: "2",
    groups: [
      {
        topic: "Functions & Files",
        items: [
          { label: "Function with defaults", formula: "def f(a, b=10, *args, **kw)", where: "*args tuple, **kw dict" },
          { label: "File read", formula: "with open(f) as fh: data = fh.read()", where: "auto-closes file" },
          { label: "Exception", formula: "try: ... except E as e: ... finally: ...", where: "finally always runs" },
        ],
      },
    ],
  },
  // ---------------------------------------------------- Python module 3 ---
  {
    subject: "PYTHON",
    module: "3",
    groups: [
      {
        topic: "OOP & Libraries",
        items: [
          { label: "Class basics", formula: "class A(B): def __init__(self): ...", where: "B is parent, self is instance" },
          { label: "NumPy array", formula: "np.array([1,2,3])", where: "vectorized ops" },
        ],
      },
    ],
  },
  // -------------------------------------------------------- FE module 1 ---
  {
    subject: "FE",
    module: "1",
    groups: [
      {
        topic: "Feature Basics",
        items: [
          { label: "Standardization", formula: "z = (x - mean) / std", where: "zero mean, unit variance" },
          { label: "Min-max scaling", formula: "x' = (x - min) / (max - min)", where: "range [0,1]" },
        ],
      },
    ],
  },
  // -------------------------------------------------------- FE module 2 ---
  {
    subject: "FE",
    module: "2",
    groups: [
      {
        topic: "Dimensionality",
        items: [
          { label: "PCA idea", formula: "Keep top-k eigenvectors of covariance", where: "max variance directions" },
          { label: "Explained variance", formula: "sum(top-k eigenvalues) / sum(all)", where: "fraction retained" },
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

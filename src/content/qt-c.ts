import type { Module } from "./types";

export const qtModulesC: Module[] = [
{
      "num": "4",
      "title": "Basic Concepts of Probability",
      "examPattern": "EXAM PATTERN (QT): The real MG3CCRBCA200 paper pattern is UNKNOWN - no Honours model paper and no past BCA paper exists online (first exam 22-10-2025 was never published). Closest evidence: MGU B.Com 'Quantitative Techniques for Business' papers (same university, overlapping statistics syllabus) run 80 marks / 3 hours: Part A answer any 10 x 2 marks = 20 (short theory + one-line numericals), Part B answer any 6 x 5 marks = 30 (medium theory + numericals), Part C answer any 2 x 15 marks = 30 (long numericals: combined mean/SD/CV two-firm problem repeated 3x, Bayes theorem). QT is a 4-credit course, so the Honours paper may instead follow a 70-mark / 2-hour format (like DBMS) - this is NOT confirmed. Prepare every module: Part A 2-mark questions span all modules. ",
      "topics": [
        {
          "title": "Random Experiment, Sample Space and Types of Events",
          "points": [
            "A random experiment is an act whose outcome cannot be predicted in advance, like tossing a coin.",
            "Sample space (S) is the set of all possible outcomes. For a coin: S = {H, T}.",
            "Events: simple (single outcome), compound (many outcomes), sure event (S), impossible event (empty set).",
            "Exhaustive events cover the whole sample space; mutually exclusive events cannot happen together."
          ],
          "questions": [
            {
              "q": "Define random experiment, sample space and event with examples.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "A random experiment is an experiment whose outcome cannot be predicted in advance, but the set of all possible outcomes is known.",
                "Example: tossing a coin is a random experiment because we cannot say whether Head or Tail will come, but we know the only possible outcomes are Head and Tail.",
                "Sample space is the set of all possible outcomes of a random experiment. It is denoted by S.",
                "Example: for tossing a coin, S = {H, T}. For throwing a die once, S = {1, 2, 3, 4, 5, 6}.",
                "An event is a subset of the sample space. It is a collection of one or more possible outcomes that we are interested in.",
                "Example: on a die, the event 'getting an even number' is {2, 4, 6}.",
                "A simple event has only one outcome, like {5}; a compound event has more than one outcome, like {2, 4, 6}.",
                "The sure event is the whole sample space S, and the impossible event is the empty set, which can never happen.",
                "In short, the random experiment is the act, the sample space lists everything that can happen, and the event is the part of it we are interested in."
              ]
            },
            {
              "q": "Explain mutually exclusive and exhaustive events with examples.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Mutually exclusive events are events that cannot happen at the same time in one trial of the experiment.",
                "In set language, A and B are mutually exclusive if A intersect B is the empty set, meaning they have no common outcome.",
                "Example: in one toss of a coin, getting Head and getting Tail are mutually exclusive, because both cannot appear in the same toss.",
                "Exhaustive events are events that together cover all the possible outcomes of the sample space.",
                "In set language, A and B are exhaustive if A union B = S, the whole sample space, so no outcome is left out.",
                "Example: for a die, 'getting an even number' {2, 4, 6} and 'getting an odd number' {1, 3, 5} are exhaustive because together they cover all six outcomes.",
                "These two events are also mutually exclusive, since no number is both even and odd at the same time.",
                "So mutually exclusive means 'no common outcome', and exhaustive means 'no outcome left out'.",
                "Two events can be both mutually exclusive and exhaustive, like Head and Tail, or neither, like {1, 2} and {2, 3} on a die."
              ]
            },
            {
              "q": "List the sample space in throwing 2 dice. (2022)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "When two dice are thrown together, each die shows 1 to 6, giving 6 x 6 = 36 equally likely outcomes.",
                "The sample space S is the set of all ordered pairs (first die, second die).",
                "It is: (1,1), (1,2), (1,3), (1,4), (1,5), (1,6), (2,1), (2,2), (2,3), (2,4), (2,5), (2,6),",
                "(3,1), (3,2), (3,3), (3,4), (3,5), (3,6), (4,1), (4,2), (4,3), (4,4), (4,5), (4,6),",
                "(5,1), (5,2), (5,3), (5,4), (5,5), (5,6), (6,1), (6,2), (6,3), (6,4), (6,5), (6,6).",
                "Every probability problem on two dice starts from this 36-point sample space.",
                "Answer: the sample space has 36 ordered pairs as listed above."
              ]
            }
          ]
        },
        {
          "title": "Operations with Events",
          "points": [
            "Union (A union B): A or B or both happen.",
            "Intersection (A intersect B): both A and B happen together.",
            "Complement (A prime): A does not happen. P(A prime) = 1 - P(A).",
            "De Morgan's laws help simplify combinations of events."
          ],
          "questions": [
            {
              "q": "Explain union, intersection and complement of events.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Union of events: A union B is the event that happens when at least one of A or B happens, that is A or B or both.",
                "Example: on a die, let A = {2, 4, 6} (even number) and B = {4, 5, 6} (number greater than 3). Then A union B = {2, 4, 5, 6}.",
                "Intersection of events: A intersect B is the event that happens only when both A and B happen together.",
                "Example: for the same A and B, A intersect B = {4, 6}, which are the outcomes common to both events.",
                "Complement of an event: A complement is the event that happens when A does not happen. It contains all outcomes of the sample space that are not in A.",
                "Example: if A = {2, 4, 6}, its complement is {1, 3, 5}.",
                "In probability: P(A union B) = P(A) + P(B) - P(A intersect B), and P(A complement) = 1 - P(A).",
                "Union, intersection and complement let us build complicated events from simple ones and compute their probabilities."
              ]
            },
            {
              "q": "Represent the following by means of a Venn Diagram: A union B, A intersection B and A-complement. (2024)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "A Venn diagram draws events as circles inside a rectangle that stands for the sample space.",
                "A union B is shown by shading the whole area covered by both circles, every outcome in A or B or both.",
                "A intersection B is shown by shading only the overlapping lens where the two circles cross, outcomes common to both.",
                "A-complement (A-bar) is shown by shading everything inside the rectangle except the A circle.",
                "These three shadings are the visual form of the addition rule: P(A union B) = P(A) + P(B) - P(A intersection B).",
                "In short, union shades both circles fully, intersection shades only the overlap, and complement shades outside A."
              ]
            }
          ]
        },
        {
          "title": "Definitions of Probability: Classical, Empirical, Axiomatic",
          "points": [
            "Classical: P(A) = (favourable outcomes) / (total equally likely outcomes).",
            "Empirical: P(A) = (times A occurred) / (total trials), based on actual observation.",
            "Axiomatic: P(S) = 1, P(A) >= 0, and probabilities of disjoint events add up.",
            "Counting with combinations: to draw 3 balls from 23, total ways = C(23,3); to choose required players from each category, find each C(n,k) and multiply, e.g. C(10,3) x C(5,3) x C(8,2) x C(2,1) = 67,200.",
            "'Stay together' arrangement trick: bind the group into one block, arrange the units, then arrange inside the block, e.g. 4 girls as one block with 3 boys: 5! x 4! = 2,880 ways."
          ],
          "questions": [
            {
              "q": "Define probability. Explain the classical, empirical and axiomatic definitions.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Probability is a number between 0 and 1 that measures how likely an event is to happen.",
                "A probability of 0 means the event is impossible; a probability of 1 means the event is certain.",
                "Classical definition: P(A) = number of favourable outcomes / total number of equally likely outcomes.",
                "It works when every outcome has the same chance, like a fair coin or a fair die.",
                "Example: P(getting a 6 on a die) = 1/6.",
                "Limitation: it cannot be used when outcomes are not equally likely, like a biased coin.",
                "Empirical definition: P(A) = number of times A occurred / total number of trials, based on actual experiments and observation.",
                "Example: if a coin tossed 1000 times gives 480 heads, the empirical probability of a head is 480/1000 = 0.48.",
                "Limitation: the answer changes with the number of trials, so it is only approximate.",
                "Axiomatic definition (given by Kolmogorov): probability is defined by three rules - (1) P(A) >= 0 for every event, (2) P(S) = 1 for the whole sample space, (3) if A and B are mutually exclusive then P(A union B) = P(A) + P(B).",
                "This definition accepts the classical and empirical ideas as special cases and is the basis of all advanced probability.",
                "In short: classical counts the outcomes, empirical observes the trials, and axiomatic lays down the rules."
              ]
            },
            {
              "q": "A die is tossed once. Find P(getting a number greater than 4).",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Formula: P(A) = number of favourable outcomes / total number of equally likely outcomes.",
                "The sample space for tossing a die once is S = {1, 2, 3, 4, 5, 6}.",
                "Total number of equally likely outcomes = 6.",
                "The numbers greater than 4 are 5 and 6.",
                "Number of favourable outcomes = 2.",
                "Substitute the values: P(getting a number greater than 4) = 2/6.",
                "Simplify the fraction: 2/6 = 1/3.",
                "Answer: P = 1/3."
              ]
            },
            {
              "q": "What is the probability that a card drawn from a pack of 52 cards is a card of King? (2024)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Use the classical definition: P(event) = favourable outcomes / total equally likely outcomes.",
                "Total outcomes when one card is drawn = 52.",
                "Favourable outcomes = 4 kings (one each of spades, hearts, diamonds, clubs).",
                "P(King) = 4/52 = 1/13.",
                "This is the simplest use of the classical definition: count the favourable cases over all equally likely cases.",
                "Answer: the probability is 1/13."
              ]
            },
            {
              "q": "A class consists of 4 girls and 3 boys to be arranged for a photograph in a single row. In how many ways can they be seated if all the girls sit together? (2024)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Treat the 4 girls as one single block, since they must stay together.",
                "Now we arrange 5 units: the girls-block plus the 3 boys, which can be done in 5! = 120 ways.",
                "Inside the block, the 4 girls can arrange themselves in 4! = 24 ways.",
                "By the multiplication rule, total arrangements = 120 x 24 = 2880.",
                "The block trick works for any 'stay together' seating problem: bind the group, arrange the units, then arrange inside.",
                "Answer: they can be seated in 2880 ways with all girls together."
              ]
            },
            {
              "q": "In how many ways can a cricket team be selected from 25 players consisting of 10 batsmen, 8 bowlers, 5 all-rounders and 2 wicketkeepers, if the team requires 3 batsmen, 3 all-rounders, 2 bowlers and 1 wicketkeeper? (2022)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "hint": "This is a combination problem: choose the required players from each category and multiply.",
              "a": [                "3 batsmen from 10: C(10,3) = 120 ways.",
                "3 all-rounders from 5: C(5,3) = 10 ways.",
                "2 bowlers from 8: C(8,2) = 28 ways.",
                "1 wicketkeeper from 2: C(2,1) = 2 ways.",
                "Total selections = 120 x 10 x 28 x 2 = 67,200.",
                "Answer: 67,200 ways for the specified 9 positions."
              ]
            }
          ]
        },
        {
          "title": "Addition Theorem (up to 3 events)",
          "points": [
            "Two events: P(A union B) = P(A) + P(B) - P(A intersect B).",
            "Mutually exclusive events: P(A union B) = P(A) + P(B).",
            "Three events: add the singles, subtract the pairwise intersections, add the triple intersection."
          ],
          "questions": [
            {
              "q": "State and prove the addition theorem for two events.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Statement: For any two events A and B, P(A union B) = P(A) + P(B) - P(A intersect B).",
                "For mutually exclusive events, where A intersect B is empty, the formula simplifies to P(A union B) = P(A) + P(B).",
                "Proof: Suppose the experiment has n(S) equally likely outcomes in the sample space S.",
                "Let n(A) be the number of outcomes in event A, and n(B) the number of outcomes in event B.",
                "Case 1 - mutually exclusive events: A and B have no common outcome, so the outcomes in A union B are simply n(A) + n(B).",
                "That is, n(A union B) = n(A) + n(B).",
                "Divide both sides by n(S): n(A union B)/n(S) = n(A)/n(S) + n(B)/n(S).",
                "By the classical definition of probability, this gives P(A union B) = P(A) + P(B).",
                "Case 2 - overlapping events: the common outcomes counted in n(A intersect B) are counted twice in n(A) + n(B), once in each event.",
                "So we subtract them once: n(A union B) = n(A) + n(B) - n(A intersect B).",
                "Dividing both sides by n(S) gives P(A union B) = P(A) + P(B) - P(A intersect B).",
                "This completes the proof of the addition theorem for two events."
              ]
            },
            {
              "q": "If P(A) = 0.4, P(B) = 0.5 and P(A intersect B) = 0.2, find P(A union B).",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Formula: P(A union B) = P(A) + P(B) - P(A intersect B).",
                "Given: P(A) = 0.4, P(B) = 0.5, P(A intersect B) = 0.2.",
                "Substitute the values: P(A union B) = 0.4 + 0.5 - 0.2.",
                "First add the first two terms: 0.4 + 0.5 = 0.9.",
                "Then subtract the overlap: 0.9 - 0.2 = 0.7.",
                "Answer: P(A union B) = 0.7."
              ]
            },
            {
              "q": "State the addition theorem for three events.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Statement: For any three events A, B and C, P(A union B union C) = P(A) + P(B) + P(C) - P(A intersect B) - P(B intersect C) - P(A intersect C) + P(A intersect B intersect C).",
                "Explanation: first add the probabilities of the three single events.",
                "Then subtract the three pairwise intersections, because every common outcome is counted twice when the singles are added.",
                "Finally add back the triple intersection, because those outcomes were subtracted too many times in the previous step.",
                "For three mutually exclusive events all the overlap terms are zero, so the formula simplifies to P(A union B union C) = P(A) + P(B) + P(C).",
                "Example: drawing one card from a pack, let A = king, B = queen, C = jack. Then P = 4/52 + 4/52 + 4/52 = 12/52 = 3/13.",
                "This theorem extends the two-event addition rule by carefully adjusting for every overlap."
              ]
            },
            {
              "q": "One number is drawn from numbers 1 to 100. Find the probability that it is either divisible by 3 or 5. (2022)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "hint": "This is a direct application of the addition theorem: P(A union B) = P(A) + P(B) - P(A intersection B).",
              "a": [                "Numbers from 1 to 100 divisible by 3: 33 numbers, so P(divisible by 3) = 33/100.",
                "Numbers divisible by 5: 20 numbers, so P(divisible by 5) = 20/100.",
                "Numbers divisible by both 3 and 5, that is by 15: 6 numbers, so P(both) = 6/100.",
                "P(either) = 33/100 + 20/100 - 6/100 = 47/100.",
                "Answer: the probability is 47/100 = 0.47."
              ]
            }
          ]
        },
        {
          "title": "Conditional Probability and Independence",
          "points": [
            "Conditional probability: P(A|B) = P(A intersect B) / P(B). It is the chance of A given that B already happened.",
            "Independent events: P(A|B) = P(A); knowing B tells nothing about A.",
            "Dependent events: the first outcome changes the second, like draws without replacement.",
            "For 'at least one' problems use the complement: P(at least one) = 1 - P(getting none).",
            "Counting draws: for 3 balls from 23 total, use C(23,3) = 1771 as total ways; for 'one of each colour' multiply the choices, e.g. 7 x 12 x 4."
          ],
          "questions": [
            {
              "q": "Define conditional probability. A bag has 3 red and 2 blue balls; two are drawn without replacement. Find P(both red).",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Definition: Conditional probability is the probability of an event A given that another event B has already happened. It is written P(A|B).",
                "Formula: P(A|B) = P(A intersect B) / P(B), where P(B) is greater than zero.",
                "It tells us the chance of A after B has reduced the sample space.",
                "The bag has 3 red and 2 blue balls, so there are 5 balls in total.",
                "Formula for successive draws: P(both red) = P(first red) * P(second red | first red).",
                "P(first red) = 3/5, because 3 of the 5 balls are red.",
                "After one red ball is drawn without replacement, 2 red balls and 4 balls in total remain.",
                "So P(second red | first red) = 2/4.",
                "Substitute the values: P(both red) = (3/5) * (2/4).",
                "Multiply the fractions: (3/5) * (2/4) = 6/20.",
                "Simplify: 6/20 = 3/10 = 0.3.",
                "Answer: P(both red) = 0.3."
              ]
            },
            {
              "q": "Define independent events. Give an example.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Definition: Two events A and B are independent if the happening of one does not affect the probability of the other.",
                "In symbols, A and B are independent if P(A|B) = P(A), which is the same as P(A intersect B) = P(A) * P(B).",
                "Knowing that B happened gives no information about whether A will happen.",
                "Example: toss a coin twice. Let A = 'head on the first toss' and B = 'head on the second toss'.",
                "The outcome of the first toss does not change the second toss, so P(B|A) = 0.5 = P(B).",
                "Hence A and B are independent, and P(A intersect B) = 0.5 * 0.5 = 0.25.",
                "In contrast, drawing two balls without replacement gives dependent events, because the first draw changes the chances for the second draw.",
                "So independence means the two events have no influence on each other."
              ]
            },
            {
              "q": "A bag contains 7 red, 12 white and 4 green balls. What is the probability that: (a) 3 balls drawn are all white and (b) 3 balls drawn are one of each colour? (2022)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Total balls = 7 + 12 + 4 = 23; the number of ways to draw 3 balls is C(23,3) = 1771.",
                "(a) Ways to draw 3 white balls from 12: C(12,3) = 220. So P(all white) = 220/1771.",
                "(b) One of each colour: choose 1 red AND 1 white AND 1 green = 7 x 12 x 4 = 336 ways by the multiplication rule.",
                "So P(one of each colour) = 336/1771.",
                "Both parts use the classical definition with combinations, since the balls of the same colour are identical for counting.",
                "Answer: (a) 220/1771 and (b) 336/1771."
              ]
            },
            {
              "q": "A candidate is selected for interview for three posts. For the first post there are three candidates, for the second there are four and for the third there are two. What are the chances of his getting at least one post? (2024)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "For 'at least one' problems, use the complement: P(at least one) = 1 - P(getting none).",
                "P(getting post 1) = 1/3, so P(missing it) = 2/3.",
                "P(getting post 2) = 1/4, so P(missing it) = 3/4.",
                "P(getting post 3) = 1/2, so P(missing it) = 1/2.",
                "Assuming the selections are independent, P(missing all three) = (2/3) x (3/4) x (1/2) = 6/24 = 1/4.",
                "P(at least one post) = 1 - 1/4 = 3/4.",
                "Answer: the chance of getting at least one post is 3/4 = 0.75."
              ]
            }
          ]
        },
        {
          "title": "Multiplication Theorem (up to 3 events)",
          "points": [
            "Two events: P(A intersect B) = P(A) * P(B|A) = P(B) * P(A|B).",
            "Independent events: P(A intersect B) = P(A) * P(B).",
            "Three events: P(A int B int C) = P(A) * P(B|A) * P(C | A int B)."
          ],
          "questions": [
            {
              "q": "State the multiplication theorem for two and three events.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "For two events: P(A intersect B) = P(A) * P(B|A).",
                "This follows from the conditional probability formula P(B|A) = P(A intersect B) / P(A), by multiplying both sides by P(A).",
                "It can also be written the other way round: P(A intersect B) = P(B) * P(A|B).",
                "For three events: P(A intersect B intersect C) = P(A) * P(B|A) * P(C | A intersect B).",
                "The idea is the same: the first event happens, then the second given the first, then the third given the first two together.",
                "For independent events the conditions drop out, so for two independent events P(A intersect B) = P(A) * P(B).",
                "For three independent events: P(A intersect B intersect C) = P(A) * P(B) * P(C).",
                "Example of the independent case: P(two heads in two tosses) = 0.5 * 0.5 = 0.25."
              ]
            },
            {
              "q": "A coin is tossed three times. Find P(getting three heads).",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "The three tosses are independent, and for each toss P(head) = 1/2.",
                "Formula for three independent events: P(A intersect B intersect C) = P(A) * P(B) * P(C).",
                "Substitute the values: P(three heads) = (1/2) * (1/2) * (1/2).",
                "Multiply the first two factors: (1/2) * (1/2) = 1/4.",
                "Multiply by the third factor: (1/4) * (1/2) = 1/8.",
                "Convert to decimal: 1/8 = 0.125.",
                "Answer: P(getting three heads) = 1/8 = 0.125."
              ]
            },
            {
              "q": "A University has to select an examiner from 50 persons: 20 women and 30 men; 10 knowing Hindi and 40 not; 15 teachers and 35 not. What is the probability of selecting a Hindi knowing woman teacher? (2022)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "This applies the multiplication theorem for three independent attributes.",
                "P(woman) = 20/50 = 0.4; P(knowing Hindi) = 10/50 = 0.2; P(teacher) = 15/50 = 0.3.",
                "Treating the three attributes as independent, multiply the probabilities.",
                "P(Hindi-knowing woman teacher) = 0.4 x 0.2 x 0.3 = 0.024.",
                "This works because the three attributes are treated as independent choices from the list of 50 persons.",
                "Answer: the probability is 0.024, that is 2.4%."
              ]
            }
          ]
        },
        {
          "title": "Bayes Theorem and Applications",
          "points": [
            "Bayes theorem reverses the condition: P(Ai|B) = [P(Ai)*P(B|Ai)] / [sum over j of P(Aj)*P(B|Aj)].",
            "Use it when we know the effect (B happened) and want the probable cause (which Ai).",
            "Applications: medical testing, spam filters, quality control in factories."
          ],
          "questions": [
            {
              "q": "A factory has Machine A making 60% of items (2% defective) and Machine B making 40% (5% defective). An item is defective; find P(it came from A). (Apr 2022, May 2022)",
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "years": null,
              "a": [
                "Let A = item came from Machine A, B = item came from Machine B, D = item is defective.",
                "Given: P(A) = 0.6, P(D|A) = 0.02; P(B) = 0.4, P(D|B) = 0.05.",
                "Formula (Bayes): P(A|D) = [P(A) * P(D|A)] / [P(A)*P(D|A) + P(B)*P(D|B)].",
                "Numerator: P(A) * P(D|A) = 0.6 * 0.02.",
                "Multiply: 0.6 * 0.02 = 0.012.",
                "Denominator second term: P(B) * P(D|B) = 0.4 * 0.05.",
                "Multiply: 0.4 * 0.05 = 0.020.",
                "Total probability of defective: P(D) = 0.012 + 0.020 = 0.032.",
                "Substitute into the formula: P(A|D) = 0.012 / 0.032.",
                "Divide: 0.012 / 0.032 = 0.375.",
                "Answer: P(it came from Machine A) = 0.375."
              ]
            },
            {
              "q": "State Bayes theorem.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Bayes theorem reverses the condition: it finds P(Ai|B) from P(B|Ai).",
                "Statement: If A1, A2, ..., An are mutually exclusive and exhaustive events (the possible causes) and B is any event, then P(Ai|B) = [P(Ai) * P(B|Ai)] / [P(A1)*P(B|A1) + P(A2)*P(B|A2) + ... + P(An)*P(B|An)].",
                "P(Ai) is the prior probability of cause Ai, and P(B|Ai) is the probability of the effect B if cause Ai is true.",
                "The numerator is the chance that cause Ai produced the observed effect B.",
                "The denominator is the total chance of B happening through any of the causes, found by the total probability rule.",
                "It is used when we see the effect (B has happened) and want to find the most probable cause.",
                "For two causes it simplifies to P(A1|B) = [P(A1)*P(B|A1)] / [P(A1)*P(B|A1) + P(A2)*P(B|A2)].",
                "In short, Bayes theorem turns 'probability of effect given cause' into 'probability of cause given effect'."
              ]
            },
            {
              "q": "Give two applications of Bayes theorem.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "a": [
                "Application 1: Medical diagnosis. A doctor knows the accuracy of a blood test and uses Bayes theorem to find the probability that a patient actually has the disease given that the test result is positive.",
                "The prior is how common the disease is in the population; the positive test result updates it to a posterior probability for that particular patient.",
                "Application 2: Spam filtering. An email program uses Bayes theorem to find the probability that a mail is spam given that certain words appear in it.",
                "From past data it learns how often each word appears in spam mails versus normal mails, and updates the probability as more words are found.",
                "A third example is quality control in factories, where a defective item found on the line is traced back to the machine that most likely made it.",
                "In all these cases Bayes theorem turns an observed effect into the most probable cause."
              ]
            },
            {
              "q": "Your officer is happy on 60% of your calls, so P(happy on visit) = 0.6. If he is happy he accedes to your request with probability 0.4, and if not happy with probability 0.1. You call one day and he accedes. What is the probability he was happy? (2022)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "years": null,
              "hint": "This is a Bayes theorem problem: turn the observed effect (he acceded) back into the probable cause (he was happy).",
              "a": [                "P(Happy) = 0.6 and P(Not happy) = 0.4.",
                "P(Accede | Happy) = 0.4 and P(Accede | Not happy) = 0.1.",
                "Total P(Accede) = 0.6x0.4 + 0.4x0.1 = 0.24 + 0.04 = 0.28.",
                "By Bayes: P(Happy | Accede) = (0.6 x 0.4) / 0.28 = 0.24/0.28 = 0.857.",
                "Answer: the probability he was happy is 0.86 (exactly 6/7)."
              ]
            },
            {
              "q": "In a bolt factory, machines M1, M2 and M3 manufacture 25%, 35% and 40% of the total output. Of their outputs, 5%, 4% and 2% respectively are defective. If a bolt drawn at random is defective, find the probability it was made by M1.",
              "tags": [
                "SURE MARK"
              ],
              "tagBase": "SURE MARK",
              "years": "P6 2022",
              "hint": "This is a Bayes theorem problem: work backwards from the defective bolt to the machine.",
              "a": [
                "The probability the defective bolt came from M1 is 0.362, about 36.2%.",
                "Let D mean defective. P(M1) = 0.25, P(M2) = 0.35, P(M3) = 0.40.",
                "P(D|M1) = 0.05, P(D|M2) = 0.04, P(D|M3) = 0.02.",
                "Total probability of a defective bolt: P(D) = 0.25 x 0.05 + 0.35 x 0.04 + 0.40 x 0.02.",
                "That is 0.0125 + 0.014 + 0.008 = 0.0345.",
                "Bayes theorem: P(M1|D) = P(D|M1) x P(M1) / P(D) = 0.0125 / 0.0345 = 0.362.",
                "Answer: about 0.36, so roughly a 36% chance the defective bolt was made by M1."
              ]
            }
          ]
        }
      ]
    },
];

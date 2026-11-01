import type { Module } from "./types";

export const sfModulesA: Module[] = [
{
      "num": "1",
      "title": "Process and Agile",
      "examPattern": "SF HONOURS EXAM PATTERN - 50 marks, 1.5 hours. Part A: 10 x 2 marks, all compulsory; Q1-Q4 come from this module (process and agile). Part B: 5 x 5 marks, answer any 3 of 5. Part C: 2 x 15 marks, answer any 1 of 2 (model paper essays: requirements elicitation, system testing). Old papers (May 2019 - Feb 2025) repeat SDLC questions verbatim: life-cycle activities 5x, waterfall 3x, Iterative-vs-RAD identical in Mar 2021 and Aug 2022. Attempt at least one question from each course outcome (CO1 = this module).",
      "topics": [
        {
          "title": "Evolving Role and Changing Nature of Software",
          "points": [
            "Software started as simple programs written by one person; now it runs banks, hospitals, phones and the whole internet.",
            "Software is the set of programs and data that tell a computer what to do, and its role in society has changed completely over time.",
            "Evolving role: in the early days software was small and written by one person for one task, like a simple calculation program used by its own writer. Then software became a product sold to many users, like operating systems and office tools. Later it moved to the internet as web applications that millions could use from anywhere. Then came mobile apps, which put software in the pocket of almost every person on earth.",
            "Today software runs banks, hospitals, transport, phones and the whole internet. Cloud systems let companies use powerful software without owning any hardware, and artificial intelligence systems now make decisions and create content like a human assistant.",
            "Software moved from custom-built programs to mass products, then to web apps, mobile apps and AI systems.",
            "Today software is the most important part of almost every business.",
            "Example: a bank today is really a software company, because every account and payment is handled by software.",
            "Changing nature: the nature of software means how it is built, who uses it and how it behaves. Old software was built for a single user and ran on one machine; modern software serves millions of users at the same time over the internet. Old software was updated rarely, maybe once a year; modern software is updated continuously, sometimes many times a day.",
            "Old software was a support tool that helped people do other work; today software is often the main product of the company itself, like a food delivery app or a video streaming service. Modern software connects to other software through the internet and shares data constantly, and it must handle security, speed and huge amounts of data, which old software never faced.",
            "Example: a simple calculator app of the past only added numbers, but a modern app like Google Pay moves real money safely for crores of users. So the nature of software has changed from simple standalone tools to large, connected, always-changing systems.",
            "Importance of software engineering: modern software is too large and complex to build by trial and error. Software engineering gives a disciplined, step-by-step method for delivering software on time and within budget; without it, projects suffer missed deadlines, crossed budgets and poor quality.",
            "It applies engineering ideas like planning, measurement and quality checks; it helps teams handle changing requirements without chaos; it reduces cost because finding and fixing an error early is far cheaper than fixing it after delivery; it improves quality through reviews, testing and defined processes; it makes maintenance easier, since well-documented software can be changed by people who did not write it.",
            "Example: a hospital management system built with proper requirements and testing will not lose patient records, while one built casually might. In short, software engineering turns software building from risky guesswork into a controlled, repeatable activity.",
            "Essential attributes of good software: maintainability (easy to change and fix when needs change); reliability (works correctly without frequent failures); efficiency (uses time and memory wisely); usability (easy to learn and pleasant to use); security (protects data from misuse and attacks); portability (runs on different machines with little change).",
            "These attributes often trade off against each other, so the team must balance them. Example: a banking app is good software only if it is reliable with money, secure against fraud, and simple enough for anyone to use. In short, good software is not just working code; it is maintainable, reliable, efficient, usable and secure.",
            "Generic vs customized products: generic products are built for a wide market of customers; customized products are built for one specific customer. For generic products the requirements are decided by the developers through market study, as with Microsoft Word; for customized products the requirements are given by the customer under a contract, as with a billing system for one hospital.",
            "Generic products are sold to many buyers and earn through volume sales; customized products are delivered to a single buyer and earn through the development contract and maintenance. Testing a generic product must cover many kinds of users and environments, while testing a customized product focuses on the one client's workflows.",
            "Example: Tally is a generic accounting product, while the railway reservation system is a customized product built for Indian Railways. In short, generic means made for the market, customized means made for one customer."
          ],
          "questions": [
            {
              "q": "Explain the evolving role of software.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Software is the set of programs and data that tell a computer what to do, and its role in society has changed completely over time.",
                "In the early days, software was small and written by one person for one task, like a simple calculation program used by its own writer.",
                "Then software became a product sold to many users, like operating systems and office tools.",
                "Later, software moved to the internet as web applications that millions of people could use from anywhere.",
                "Then came mobile apps, which put software in the pocket of almost every person on earth.",
                "Today software runs banks, hospitals, transport, phones and the whole internet.",
                "Cloud systems let companies use powerful software without owning any hardware.",
                "Artificial intelligence systems now make decisions and create content like a human assistant.",
                "So software changed from a small tool into the most important part of almost every business.",
                "Example: a bank today is really a software company, because every account and payment is handled by software.",
                "In short, software has grown from a helper program into the backbone of the modern world."
              ]
            },
            {
              "q": "Explain the changing nature of software.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "The nature of software means how it is built, who uses it and how it behaves, and this has changed a lot over time.",
                "Old software was built for a single user and ran on one machine.",
                "Modern software serves millions of users at the same time over the internet.",
                "Old software was updated rarely, maybe once a year with a new version.",
                "Modern software is updated continuously, sometimes many times a day.",
                "Old software was a support tool that helped people do other work.",
                "Today software is often the main product of the company itself, like a food delivery app or a video streaming service.",
                "Modern software connects to other software through the internet and shares data constantly.",
                "It must handle security, speed and huge amounts of data, which old software never faced.",
                "Example: a simple calculator app of the past only added numbers, but a modern app like Google Pay moves real money safely for crores of users.",
                "So the nature of software has changed from simple standalone tools to large, connected, always-changing systems."
              ]
            },
            {
              "q": "Explain the importance of software engineering.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Software engineering is important because modern software is too large and complex to build by trial and error.",
                "It gives a disciplined, step-by-step method for delivering software on time and within budget.",
                "Without it, projects suffer missed deadlines, crossed budgets and poor quality.",
                "It applies engineering ideas like planning, measurement and quality checks to software work.",
                "It helps teams handle changing requirements without falling into chaos.",
                "It reduces cost because finding and fixing an error early is far cheaper than fixing it after delivery.",
                "It improves quality through reviews, testing and clearly defined processes.",
                "It makes maintenance easier, since well-documented software can be changed by people who did not write it.",
                "Example: a hospital management system built with proper requirements and testing will not lose patient records, while one built casually might.",
                "In short, software engineering turns software building from risky guesswork into a controlled, repeatable activity."
              ]
            },
            {
              "q": "Describe the essential attributes of good software.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Good software has a set of essential attributes that make it useful and trustworthy.",
                "Maintainability: it should be easy to change and fix when needs change.",
                "Reliability: it should work correctly without frequent failures.",
                "Efficiency: it should use time and memory wisely instead of wasting resources.",
                "Usability: it should be easy to learn and pleasant to use.",
                "Security: it should protect data from misuse and attacks.",
                "Portability: it should run on different machines with little change.",
                "These attributes often trade off against each other, so the team must balance them for the situation.",
                "Example: a banking app is good software only if it is reliable with money, secure against fraud, and simple enough for anyone to use.",
                "In short, good software is not just working code; it is maintainable, reliable, efficient, usable and secure."
              ]
            },
            {
              "q": "Distinguish between generic software products and customized products.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Generic products are built for a wide market of customers; customized products are built for one specific customer.",
                "For generic products, the requirements are decided by the developers through market study, as with Microsoft Word.",
                "For customized products, the requirements are given by the customer under a contract, as with a billing system for one hospital.",
                "Generic products are sold to many buyers; customized products are delivered to a single buyer.",
                "Testing a generic product must cover many kinds of users and environments.",
                "Testing a customized product focuses on the one client's workflows.",
                "Generic products earn through volume sales; customized products earn through the development contract and maintenance.",
                "Example: Tally is a generic accounting product, while the railway reservation system is a customized product built for Indian Railways.",
                "In short, generic means made for the market, customized means made for one customer."
              ]
            }
          ]
        },
        {
          "title": "Layered Technology",
          "points": [
            "Software engineering is built in layers, like floors of a building.",
            "Bottom layer: tools (editors, compilers, testing tools).",
            "Middle layer: methods (how to plan, design, test).",
            "Top layer: process (the overall framework that holds everything).",
            "Quality focus sits at the base and supports all layers."
          ],
          "questions": [
            {
              "q": "Explain layered technology in software engineering.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Software engineering is built in layers, like the floors of a building, where each layer rests on the one below it.",
                "The top layer is the process layer, which defines the overall framework of activities used to build software.",
                "The middle layer is the methods layer, which gives the technical how-to for each activity, like how to design or test.",
                "The bottom layer is the tools layer, which gives automated support for the work, like editors, compilers and testing tools.",
                "Beneath all three layers sits the quality focus, which supports everything and makes sure quality is checked at every step.",
                "The layers depend on each other: a good process is useless without proper methods, and methods are slow without tools.",
                "Example: for a project, the process could be Scrum, the method could be use-case modeling for design, and the tool could be Git for version control.",
                "If any layer is weak, the whole building shakes, so all layers must be strong together.",
                "In short, layered technology organises software engineering into process, methods and tools, all standing on quality."
              ]
            },
            {
              "q": "What are the three layers of software engineering technology?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "The three layers are process, methods and tools, supported by a quality focus at the base.",
                "The process layer is the top layer; it defines the framework of activities, like communication, planning, modeling, construction and deployment.",
                "It organises all the work in the correct order from start to finish.",
                "The methods layer is the middle layer; it gives the technical how-to for each activity, like how to do analysis, design, coding or testing.",
                "Example: writing UML diagrams is a design method.",
                "The tools layer is the bottom working layer; it gives automated support, like IDEs, compilers, debuggers and test runners.",
                "Example: Visual Studio Code and Git are tools.",
                "The quality focus is not a fourth layer but the foundation that supports all three, keeping quality checks active everywhere.",
                "Together, process tells what to do and when, methods tell how to do it, and tools help do it faster and with fewer errors."
              ]
            }
          ]
        },
        {
          "title": "Process Framework",
          "figures": [
            {
              "kind": "table",
              "caption": "Framework activities vs umbrella activities",
              "table": {
                "headers": [
                  "Framework activity",
                  "Umbrella activity"
                ],
                "rows": [
                  [
                    "Communication",
                    "Project tracking and control"
                  ],
                  [
                    "Planning",
                    "Risk management"
                  ],
                  [
                    "Modeling",
                    "Quality assurance"
                  ],
                  [
                    "Construction",
                    "Configuration management"
                  ],
                  [
                    "Deployment",
                    "Runs across the whole process"
                  ]
                ],
                "note": "The five framework activities are the main phases. Umbrella activities run across all of them."
              }
            }
          ],
          "points": [
            "A process framework is the skeleton every software project follows.",
            "A process framework is the common skeleton of activities that every software project follows, whatever model it uses.",
            "It has framework activities: communication, planning, modeling, construction and deployment.",
            "The five framework activities: communication (talk to the customer and stakeholders to understand what they need); planning (decide the work to do, the schedule, the cost and the risks); modeling (create models of what to build and how it will work, like analysis and design models); construction (write the code and test it to find and fix errors); deployment (deliver the software to the customer and collect feedback for improvement).",
            "Each activity has actions and tasks; umbrella activities like quality assurance run through all of them.",
            "Alongside the framework activities, umbrella activities run through the whole project: project tracking, risk management, quality assurance and configuration management. Example: quality assurance is not a separate stage; it checks the work done in every activity, from planning to deployment.",
            "Different process models adapt this framework in different ways.",
            "Different process models like waterfall and agile adapt this same framework in their own way.",
            "Framework activities, actions and tasks are three levels of work, from big to small. Framework activities are the main stages of a project, like communication, planning, modeling, construction and deployment; they are the same for every project and give the big picture.",
            "Actions are smaller steps inside one framework activity; for example, inside the planning activity, actions include creating a project schedule and doing risk analysis. Tasks are the smallest units of work, usually done by one person in a short time; for example, writing the login screen test cases is a single task inside the testing action. So one framework activity contains many actions, and one action contains many tasks. This division helps managers plan and track work at the right level of detail.",
            "The software life cycle is the series of phases a product passes through from birth to retirement. The main life-cycle phases are requirements analysis (discovers what the customer actually needs), design (plans how the software will be built: structure, modules, screens), coding (writing the program from the design), testing (checks the software works correctly and meets the requirements), deployment (installs the software for real users), and maintenance (fixes problems and adds new features after delivery).",
            "Each phase ends with a review, so errors are caught before they flow into the next phase. Example: for a railway ticket app, the team first studies booking needs, then designs screens, codes the app, tests booking flows, releases it, and later adds seat-map features. In short, the life-cycle phases carry software from an idea to a working product and keep it alive afterwards.",
            "A software process is the set of related activities that leads to the production of a software product. It defines which activities are done, in what order, and who performs them; typical activities include specification, design and implementation, validation, and evolution. Every software project follows some process, whether written down or informal.",
            "A defined process makes the work predictable, repeatable and controllable; without a process, projects depend on individual heroics and frequently miss deadlines. Different projects need different processes: waterfall suits stable requirements, agile suits changing ones, and the choice depends on project size, team skill, risk and customer involvement. In short, the software process is the roadmap a team follows from an idea to working software.",
            "Product vs process: product is what is built; process is how it is built. The product is the final software delivered to the customer, like an app or a website; the process is the set of activities used to create that product, like design, coding and testing. Product quality is judged by the user; process quality is judged by how smoothly the work flows.",
            "A good process usually leads to a good product, but a good product can sometimes emerge from a weak process by luck. Products are measured by features, speed and reliability; processes are measured by cost, time and repeatability. Organisations improve the process so that every future product comes out better. Example: the banking app on your phone is the product; the Scrum sprints the team used to build it are the process. In short, the product is the destination and the process is the road taken to reach it."
          ],
          "questions": [
            {
              "q": "What are the life-cycle phases? Explain the life-cycle activities of software development.",
              "tags": [
                "SURE MARK"
              ],
              "tagBase": "SURE MARK",
              "kind": "theory",
              "marks": 15,
              "years": "May 2019, Mar 2021, Oct 2021, Aug 2022, Feb 2025",
              "a": [
                "The software life cycle is the series of phases a product passes through from birth to retirement.",
                "The main life-cycle phases are requirements analysis, design, coding, testing, deployment and maintenance.",
                "Requirements analysis discovers what the customer actually needs.",
                "Design plans how the software will be built: its structure, modules and screens.",
                "Coding is the actual writing of the program from the design.",
                "Testing checks that the software works correctly and meets the requirements.",
                "Deployment installs the software for real users.",
                "Maintenance fixes problems and adds new features after delivery.",
                "Each phase ends with a review, so errors are caught before they flow into the next phase.",
                "Example: for a railway ticket app, the team first studies booking needs, then designs screens, codes the app, tests booking flows, releases it, and later adds seat-map features.",
                "In short, the life-cycle phases carry software from an idea to a working product and keep it alive afterwards."
              ]
            },
            {
              "q": "Define software process.",
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "kind": "theory",
              "marks": 5,
              "years": "Aug 2022, Feb 2025",
              "a": [
                "A software process is the set of related activities that leads to the production of a software product.",
                "It defines which activities are done, in what order, and who performs them.",
                "Typical activities include specification, design and implementation, validation, and evolution.",
                "Every software project follows some process, whether it is written down or followed informally.",
                "A defined process makes the work predictable, repeatable and controllable.",
                "Without a process, projects depend on individual heroics and frequently miss deadlines.",
                "Different projects need different processes: waterfall suits stable requirements, agile suits changing ones.",
                "The choice depends on project size, team skill, risk and customer involvement.",
                "Example: a college building an admission portal with fixed requirements can safely use the waterfall process.",
                "In short, the software process is the roadmap a team follows from an idea to working software."
              ]
            },
            {
              "q": "What is a process framework? Explain its activities.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "A process framework is the common skeleton of activities that every software project follows, whatever model it uses.",
                "It defines five framework activities.",
                "Communication: talk to the customer and stakeholders to understand what they need.",
                "Planning: decide the work to do, the schedule, the cost and the risks.",
                "Modeling: create models of what to build and how it will work, like analysis and design models.",
                "Construction: write the code and test it to find and fix errors.",
                "Deployment: deliver the software to the customer and collect feedback for improvement.",
                "Alongside these, umbrella activities run through the whole project.",
                "Umbrella activities include project tracking, risk management, quality assurance and configuration management.",
                "Example: quality assurance is not a separate stage; it checks the work done in every activity, from planning to deployment.",
                "Different process models like waterfall and agile adapt this same framework in their own way."
              ]
            },
            {
              "q": "Distinguish between framework activities, actions and tasks.",
            "figure": {
              "kind": "table",
              "caption": "Framework activities vs umbrella activities",
              "table": {
                "headers": [
                  "Framework activity",
                  "Umbrella activity"
                ],
                "rows": [
                  [
                    "Communication",
                    "Project tracking and control"
                  ],
                  [
                    "Planning",
                    "Risk management"
                  ],
                  [
                    "Modeling",
                    "Quality assurance"
                  ],
                  [
                    "Construction",
                    "Configuration management"
                  ],
                  [
                    "Deployment",
                    "Runs across the whole process"
                  ]
                ],
                "note": "The five framework activities are the main phases. Umbrella activities run across all of them."
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
                "Framework activities, actions and tasks are three levels of work in a process framework, from big to small.",
                "Framework activities are the main stages of a project, like communication, planning, modeling, construction and deployment.",
                "They are the same for every project and give the big picture.",
                "Actions are smaller steps inside one framework activity.",
                "Example: inside the planning activity, actions include creating a project schedule and doing risk analysis.",
                "Tasks are the smallest units of work, usually done by one person in a short time.",
                "Example: writing the login screen test cases is a single task inside the testing action.",
                "So one framework activity contains many actions, and one action contains many tasks.",
                "This division helps managers plan and track work at the right level of detail."
              ]
            },
            {
              "q": "Differentiate product and process.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Product is what is built; process is how it is built.",
                "The product is the final software delivered to the customer, like an app or a website.",
                "The process is the set of activities used to create that product, like design, coding and testing.",
                "Product quality is judged by the user; process quality is judged by how smoothly the work flows.",
                "A good process usually leads to a good product, but a good product can sometimes emerge from a weak process by luck.",
                "Products are measured by features, speed and reliability; processes are measured by cost, time and repeatability.",
                "Organisations improve the process so that every future product comes out better.",
                "Example: the banking app on your phone is the product; the Scrum sprints the team used to build it are the process.",
                "In short, the product is the destination and the process is the road taken to reach it."
              ]
            }
          ]
        },
        {
          "title": "Waterfall Model",
          "figures": [
            {
              "kind": "svg",
              "src": "/diagrams/sf-1-waterfall.svg",
              "caption": "Waterfall model: six stages, each flowing into the next",
              "alt": "Waterfall model stage diagram with a costly rework arrow"
            }
          ],
          "points": [
            "Waterfall is the oldest model: work flows down in fixed stages, one after another.",
            "Stages: requirements, design, implementation, testing, deployment, maintenance.",
            "You finish one stage fully before the next starts; going back is difficult and costly.",
            "Best when requirements are clear and will not change.",
            "Stage detail: first requirements (gather and document everything the customer needs); second design (plan the software structure); third implementation (write the code); fourth testing (check for errors and fix them); fifth deployment (deliver the finished software); sixth maintenance (fix problems and make small improvements after delivery).",
            "Each stage must be fully finished before the next one starts, and going back is difficult and costly, so requirements must be clear from the beginning. Example: software for an ATM machine works well, because the rules for cash withdrawal are fixed and well known.",
            "Drawbacks: real projects rarely have fixed requirements at the start, and any change after a stage is done is very expensive; the customer sees working software only at the very end, so if the final product is wrong months of work may be wasted; there is no early feedback, so misunderstandings are found very late; the model does not handle risks well, because testing and integration happen only near the end; it also produces a lot of documents, which slows small fast-moving projects.",
            "Example: if a shopping app is built in waterfall and the customer wanted a different payment option, the team must redo design and code from scratch. So waterfall is risky whenever requirements are unclear or likely to change.",
            "Waterfall vs agile: waterfall moves in fixed stages in one direction, while agile works in small cycles called iterations or sprints, repeating planning, building and testing many times. In waterfall change is costly because a finished stage must be redone; in agile change is welcome even late, because only small pieces are rebuilt. In waterfall the customer sees working software only at the end; in agile the customer gets working software every few weeks and can give feedback early. Waterfall needs heavy documentation; agile keeps documentation light and focuses on working software.",
            "Example: a government tax system with fixed rules suits waterfall, while a new food delivery app with changing ideas suits agile. In short, waterfall fits stable requirements and agile fits changing requirements.",
            "When suitable: requirements are well understood and unlikely to change; small projects with fixed scope and clear goals; projects needing strict documentation, like banking or medical systems; familiar technology where the team knows exactly how to build it; and when the customer cannot give regular feedback. Example: software for a simple billing system with fixed tax rules is a perfect fit, while a startup building a new social app should avoid waterfall because its ideas will change often.",
            "How to select a life-cycle model: match the project's nature with each model's strengths. Check requirement stability (stable suits waterfall, changing suits agile or spiral); project size and risk (large, risky projects suit the spiral model, which handles risk in every loop); customer involvement (frequent review suits prototyping or agile); deadlines (tight deadlines with clear requirements suit RAD or incremental delivery); team skill (agile needs experienced, self-managing teams); how critical failure is (life-critical systems need the heavy verification of plan-driven models).",
            "Example: a fixed-requirement exam-result portal suits waterfall; a startup's experimental app suits Scrum; a satellite control system suits spiral because failure is not an option. In short, there is no best model for all projects.",
            "Project risks in selection: choosing the wrong life-cycle model is itself a major project risk. Unstable requirements plus waterfall means late changes become extremely expensive; an inexperienced team plus unguided agile means sprints drift without direction; unproven technology needs early prototypes or risk loops, such as the spiral model; schedule risks need models that deliver early usable versions, like incremental or RAD; an unavailable customer rules out models needing constant feedback, such as XP. So selection must start with a risk assessment, weighing requirement, technical, schedule and people risks before the project starts."
          ],
          "questions": [
            {
              "q": "What are the drawbacks of the waterfall model?",
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "kind": "theory",
              "marks": 5,
              "years": "Mar 2021, Feb 2025",
              "a": [
                "The biggest drawback of the waterfall model is that real projects rarely have fixed requirements at the start.",
                "Customers often change their minds, and in waterfall any change after a stage is done is very expensive.",
                "The customer sees working software only at the very end of the project.",
                "If the final product is wrong, months of work may be wasted.",
                "There is no early feedback, so misunderstandings are found very late.",
                "The model does not handle risks well during development, because testing and integration happen only near the end.",
                "It also produces a lot of documents, which slows down small and fast-moving projects.",
                "Example: if a shopping app is built in waterfall and the customer wanted a different payment option, the team must redo design and code from scratch.",
                "So waterfall is risky whenever requirements are unclear or likely to change."
              ]
            },
            {
              "q": "How do you select an appropriate life-cycle model for a project? Illustrate with examples.",
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "kind": "theory",
              "marks": 5,
              "years": "May 2019, Feb 2025",
              "a": [
                "The life-cycle model is selected by matching the project's nature with each model's strengths.",
                "First, check requirement stability: stable requirements suit waterfall; changing ones suit agile or spiral.",
                "Second, check project size and risk: large, risky projects suit the spiral model, which handles risk in every loop.",
                "Third, check customer involvement: if the customer can review often, prototyping or agile works well.",
                "Fourth, check deadlines: tight deadlines with clear requirements suit RAD or incremental delivery.",
                "Fifth, check team skill: agile needs experienced, self-managing teams.",
                "Sixth, check how critical failure is: life-critical systems need the heavy verification of plan-driven models.",
                "Example: a fixed-requirement exam-result portal suits waterfall; a startup's experimental app suits Scrum; a satellite control system suits spiral because failure is not an option.",
                "In short, there is no best model for all projects; the right model is the one that fits the project's requirements, risks and people."
              ]
            },
            {
              "q": "Explain the waterfall model with its stages.",
            "figure": {
              "kind": "svg",
              "src": "/diagrams/sf-1-waterfall.svg",
              "caption": "Waterfall model: six stages, each flowing into the next",
              "alt": "Waterfall model stage diagram with a costly rework arrow"
            },
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "The waterfall model is the oldest and simplest process model, where work flows down through fixed stages like water falling over steps.",
                "The first stage is requirements: gather and document everything the customer needs.",
                "The second stage is design: plan the software structure based on the requirements.",
                "The third stage is implementation: write the actual code.",
                "The fourth stage is testing: check the software for errors and fix them.",
                "The fifth stage is deployment: deliver the finished software to the customer.",
                "The sixth stage is maintenance: fix problems and make small improvements after delivery.",
                "Each stage must be fully finished before the next one starts.",
                "Going back to an earlier stage is difficult and costly, so requirements must be clear from the beginning.",
                "Example: building software for an ATM machine works well, because the rules for cash withdrawal are fixed and well known.",
                "In short, waterfall is simple and easy to manage, but only fits projects where requirements will not change."
              ]
            },
            {
              "q": "Compare waterfall model with agile development.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Waterfall and agile are opposite styles of building software.",
                "Waterfall moves in fixed stages in one direction: requirements, design, coding, testing and deployment.",
                "Agile works in small cycles called iterations or sprints, repeating planning, building and testing many times.",
                "In waterfall, change is costly because a finished stage must be redone.",
                "In agile, change is welcome even late in the project, because only small pieces are rebuilt.",
                "In waterfall the customer sees working software only at the end.",
                "In agile the customer gets working software every few weeks and can give feedback early.",
                "Waterfall needs heavy documentation; agile keeps documentation light and focuses on working software.",
                "Example: a government tax system with fixed rules suits waterfall, while a new food delivery app with changing ideas suits agile.",
                "In short, waterfall fits stable requirements and agile fits changing requirements."
              ]
            },
            {
              "q": "When is the waterfall model suitable?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "The waterfall model is suitable when the requirements are well understood and unlikely to change.",
                "It works best for small projects with a fixed scope and clear goals.",
                "It suits projects that need strict documentation, like banking or medical systems.",
                "It is good when the technology is familiar and the team knows exactly how to build it.",
                "It is also useful when the customer cannot give regular feedback, since the model does not depend on it.",
                "In such cases the simplicity of waterfall becomes a strength, because the plan can be followed step by step.",
                "Example: software for a simple billing system with fixed tax rules is a perfect fit.",
                "The opposite case is a startup building a new social app, which should avoid waterfall because its ideas will change often.",
                "So waterfall is suitable when the road is clear, fixed and well mapped in advance."
              ]
            },
            {
              "q": "Write the advantages and disadvantages of waterfall model.",
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "kind": "theory",
              "marks": 5,
              "years": "Feb 2025, Mar 2021, Aug 2022",
              "a": [
                "The waterfall model is simple and easy to manage when requirements are fixed, but it fails badly when requirements change.",
                "Advantage 1: simple and easy to understand, each stage flows naturally into the next.",
                "Advantage 2: easy to manage, because stages are fixed and progress is easy to track.",
                "Advantage 3: clear milestones and deliverables at the end of every stage.",
                "Advantage 4: good documentation, since every stage is fully documented before moving on.",
                "Advantage 5: works well for small projects with clear, stable requirements, like an ATM system.",
                "Disadvantage 1: real projects rarely have fixed requirements at the start.",
                "Disadvantage 2: any change after a stage is done is very expensive to make.",
                "Disadvantage 3: the customer sees working software only at the very end.",
                "Disadvantage 4: no early feedback, so misunderstandings are found very late.",
                "Disadvantage 5: testing happens only near the end, so risks pile up unseen.",
                "In short, waterfall suits stable requirements and fails wherever change is expected."
              ]
            },
            {
              "q": "Write a note on project risks in the selection of a life-cycle model.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Choosing the wrong life-cycle model is itself a major project risk.",
                "If requirements are unstable and waterfall is chosen, late changes become extremely expensive.",
                "If the team is inexperienced and agile is chosen without guidance, sprints can drift without direction.",
                "Technical risks, like unproven technology, need a model with early prototypes or risk loops, such as the spiral model.",
                "Schedule risks need models that deliver early usable versions, like incremental or RAD.",
                "Customer-related risks, like an unavailable customer, rule out models needing constant feedback, such as XP.",
                "The selection should therefore start with a risk assessment, not with habit or fashion.",
                "Example: picking waterfall for a hospital system whose rules keep changing risks delivering a system nobody wants.",
                "In short, model selection must weigh requirement, technical, schedule and people risks before the project starts."
              ]
            }
          ]
        },
        {
          "title": "Incremental Model",
          "points": [
            "Incremental model builds software in small pieces called increments.",
            "The first increment is a basic working version; later increments add more features.",
            "Each increment goes through requirements, design, coding and testing.",
            "The customer gets usable software early and gives feedback."
          ],
          "questions": [
            {
              "q": "What are the advantages of the incremental model?",
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "kind": "theory",
              "marks": 5,
              "years": "May 2019, Feb 2025",
              "a": [
                "The first advantage of the incremental model is early delivery: the customer gets working software quickly instead of waiting for the whole project.",
                "Early delivery means the customer can start getting value and testing the product sooner.",
                "The second advantage is feedback: comments on early increments improve the later ones.",
                "The third advantage is lower risk, because problems are found in small pieces instead of one big failure at the end.",
                "It is also easier to handle changes, since new requirements can be added to a future increment.",
                "Testing is simpler because each small increment is tested alone before joining the system.",
                "The team and customer both stay motivated, because progress is visible after every increment.",
                "Example: in a railway booking site, the ticket booking increment can go live while the refund increment is still being built.",
                "So the incremental model gives speed, flexibility and safety together."
              ]
            },
            {
              "q": "Explain the incremental process model.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "The incremental model builds software in small pieces called increments instead of all at once.",
                "The first increment is a basic working version with only the core features.",
                "Each later increment adds more features until the full system is complete.",
                "Every increment goes through the same mini-process: requirements, design, coding and testing.",
                "The customer gets usable software very early and can start using it.",
                "Feedback on early increments is used to improve the later ones.",
                "If one increment has a problem, it does not break the whole project, because the work is in small pieces.",
                "Example: a college portal can first release login and notices, then add fee payment in the second increment, and results in the third.",
                "In short, incremental delivery gives early value, early feedback and lower risk."
              ]
            }
          ]
        },
        {
          "title": "Evolutionary Models: Prototyping and Spiral",
          "figures": [
            {
              "kind": "svg",
              "src": "/diagrams/sf-2-spiral.svg",
              "caption": "Spiral model: four quadrants repeated in growing loops",
              "alt": "Spiral model quadrant diagram"
            }
          ],
          "points": [
            "Evolutionary models accept that software grows and changes over time.",
            "They build the software in versions that improve with customer feedback.",
            "Prototyping: build a quick rough version to understand unclear requirements, then build the real system.",
            "A prototype is a quick rough model of the software shown to the customer before the real system is built; it looks and partly works like the final product but is not the final product.",
            "Prototyping is used when the customer cannot explain clearly what they want, when requirements are confusing or new technology is involved, and when the user interface is important and must be approved early. The customer tries the prototype, gives feedback, and the requirements become clear.",
            "The prototype is usually thrown away after this, and the real system is built properly. This saves money, because fixing a misunderstanding in a rough prototype is far cheaper than fixing finished code.",
            "Example: for a hospital management app, a prototype can show the patient registration screen so doctors can say what they actually need; for a new online exam system, a prototype can show how the exam screen should look.",
            "Spiral model: work moves in loops; each loop plans, analyses risk, builds and reviews.",
            "The spiral model was proposed by Barry Boehm. Each loop passes through four parts: planning (decide the goals and limits for this loop); risk analysis (find the biggest risks and decide how to reduce them, the heart of the spiral model); engineering (build and test a part of the software); customer review (show the result to the customer and plan the next loop).",
            "The spiral model is risk-driven: high-risk parts are handled first.",
            "Advantages: risk handling (high-risk parts are faced first, so big failures are avoided) and early customer feedback in every loop. It suits large, complex and high-risk projects very well. The drawback is that it needs expert risk analysis, which makes it costly for small projects.",
            "Example: software for a satellite launch would use the spiral model because the risk of failure is huge; it can also manage the risk of handling thousands of students in an online exam system at once.",
            "Iterative vs RAD: both build software in repeated cycles, but they differ in goal and method. The iterative model adds new features to a growing product in each iteration, suits unknown requirements, manages risk by reviewing the growing product after every iteration, and needs strong customer feedback. RAD aims to deliver a complete working system fast using reusable components, suits well-understood requirements with speed as the priority, manages time with fixed short cycles and proven parts, and needs highly skilled developers plus a library of reusable components.",
            "Example: a new social media app fits the iterative model, while a standard company payroll system fits RAD. In short, the iterative model grows the product step by step, while RAD races to a finished system using ready parts.",
            "RAD stands for Rapid Application Development: it builds software very fast using reusable components, in short cycles of about 60 to 90 days. Its four phases are: business modeling (what information drives the business); data modeling (organise that information into data objects); process modeling (how the data is used to complete business tasks); application generation and testing (build with ready-made components and automated tools, then test). RAD needs a highly skilled team and works best when requirements are well understood; a standard inventory system for a shop chain suits it because requirements are clear and components can be reused.",
            "If requirements change frequently: select an agile or evolutionary model, never a rigid plan-driven one. Waterfall fails here because it freezes requirements early, making later changes very costly. Agile models like Scrum welcome changing requirements even late; they work in short sprints, so new requirements simply enter the next sprint backlog. Evolutionary models like prototyping fit because the customer sees working versions early and corrects course; the spiral model fits because each loop re-examines risks, including requirement change. The key test is: does the model expect change or punish it?"
          ],
          "questions": [
            {
              "q": "Compare the Iterative model with the RAD model.",
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "kind": "theory",
              "marks": 5,
              "years": "Mar 2021, Aug 2022",
              "a": [
                "Both build software in repeated cycles, but they differ in goal and method.",
                "Iterative model: each iteration adds new features to a growing product; the focus is gradual refinement.",
                "RAD: each cycle aims to deliver a complete working system fast, using reusable components.",
                "The iterative model suits projects where requirements are not fully known at the start.",
                "RAD suits projects where requirements are well understood and speed is the priority.",
                "The iterative model manages risk by reviewing the growing product after every iteration.",
                "RAD manages time by fixing short cycles and reusing proven parts.",
                "The iterative model needs strong customer feedback between iterations.",
                "RAD needs highly skilled developers and a library of reusable components.",
                "Example: a new social media app fits the iterative model, while a standard company payroll system fits RAD.",
                "In short, the iterative model grows the product step by step, while RAD races to a finished system using ready parts."
              ]
            },
            {
              "q": "What are evolutionary process models? Explain any two.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Evolutionary models accept that software grows and changes over time instead of being fixed at the start.",
                "They build the software in versions that improve with customer feedback.",
                "The first example is prototyping.",
                "In prototyping, a quick rough version of the software is built and shown to the customer.",
                "This helps everyone understand unclear requirements before the real system is built.",
                "The prototype is usually thrown away, and the final system is built after the requirements are clear.",
                "The second example is the spiral model.",
                "The spiral model works in repeated loops; each loop has planning, risk analysis, engineering and customer review.",
                "It is risk-driven, so the most dangerous and uncertain parts are handled first.",
                "Example: for a new online exam system, a prototype can show how the exam screen should look, and the spiral model can manage the risk of handling thousands of students at once.",
                "Both models use feedback and repetition to grow the software safely."
              ]
            },
            {
              "q": "What is prototyping? When is it used?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "A prototype is a quick rough model of the software that is shown to the customer before the real system is built.",
                "It looks and partly works like the final product, but it is not the final product.",
                "Prototyping is used when the customer cannot explain clearly what they want.",
                "It is used when requirements are confusing or new technology is involved.",
                "It is also used when the user interface is important and must be approved early.",
                "The customer tries the prototype, gives feedback, and the requirements become clear.",
                "The prototype is usually thrown away after this, and the real system is built properly.",
                "This saves money, because fixing a misunderstanding in a rough prototype is far cheaper than fixing finished code.",
                "Example: for a hospital management app, a prototype can show the patient registration screen so doctors can say what they actually need.",
                "In short, prototyping turns unclear ideas into clear requirements."
              ]
            },
            {
              "q": "Explain the spiral model and its advantages.",
            "figure": {
              "kind": "svg",
              "src": "/diagrams/sf-2-spiral.svg",
              "caption": "Spiral model: four quadrants repeated in growing loops",
              "alt": "Spiral model quadrant diagram"
            },
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "The spiral model was proposed by Barry Boehm and works in repeated loops called spirals.",
                "Each loop passes through four parts.",
                "Planning: decide the goals and limits for this loop.",
                "Risk analysis: find the biggest risks and decide how to reduce them; this is the heart of the spiral model.",
                "Engineering: build and test a part of the software.",
                "Customer review: show the result to the customer and plan the next loop.",
                "The main advantage is risk handling: high-risk parts are faced first, so big failures are avoided.",
                "Another advantage is early customer feedback in every loop.",
                "It suits large, complex and high-risk projects very well.",
                "The drawback is that it needs expert risk analysis, which makes it costly for small projects.",
                "Example: software for a satellite launch would use the spiral model because the risk of failure is huge.",
                "So the spiral model trades extra planning effort for safety on big risky projects."
              ]
            },
            {
              "q": "What is RAD? Explain the RAD model.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "RAD stands for Rapid Application Development, a model that builds software very fast using reusable components.",
                "It works in short cycles of about 60 to 90 days, delivering a working system quickly.",
                "RAD has four phases: business modeling, data modeling, process modeling, and application generation and testing.",
                "Business modeling studies what information drives the business.",
                "Data modeling organises that information into data objects.",
                "Process modeling describes how the data is used to complete business tasks.",
                "Application generation builds the system using ready-made components and automated tools, then tests it.",
                "RAD needs a highly skilled team and works best when requirements are well understood.",
                "Example: building a standard inventory system for a shop chain suits RAD because the requirements are clear and components can be reused.",
                "In short, RAD trades detailed upfront planning for speed by reusing components in short, sharp cycles."
              ]
            },
            {
              "q": "If requirements are frequently changing, which life-cycle model should be selected? Justify.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "When requirements change frequently, an agile or evolutionary model should be selected.",
                "The waterfall model fails here because it freezes requirements early, making later changes very costly.",
                "Agile models like Scrum welcome changing requirements even late in development.",
                "They work in short sprints, so new or changed requirements simply enter the next sprint backlog.",
                "Evolutionary models like prototyping also fit, because the customer sees working versions early and corrects course.",
                "The spiral model fits too, since each loop re-examines risks, including the risk of requirement change.",
                "The key test is: does the model expect change or punish it?",
                "Example: a startup building a food-delivery app with shifting ideas should use Scrum, adding new features sprint by sprint.",
                "In short, pick a model that expects change: agile or evolutionary, never a rigid plan-driven one."
              ]
            }
          ]
        },
        {
          "title": "Unified Process",
          "points": [
            "The Unified Process (UP) is an iterative model driven by use cases.",
            "It has four phases: inception, elaboration, construction, transition.",
            "Work is organised into workflows like requirements, analysis, design, implementation and test.",
            "It is architecture-focused and widely used for object-oriented projects."
          ],
          "questions": [
            {
              "q": "Explain the Unified Process with its phases.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "The Unified Process, or UP, is an iterative process model that is driven by use cases.",
                "Use cases describe how users interact with the system, and they guide all the work.",
                "UP is also architecture-focused, meaning the basic structure of the system is fixed early.",
                "It has four phases.",
                "Inception: understand the idea, define the scope, and get approval to continue.",
                "Elaboration: design the architecture, remove the major risks, and make a detailed plan.",
                "Construction: build the software in iterations until it is complete.",
                "Transition: deliver the software to users, train them and fix the first problems.",
                "Work is organised into workflows like requirements, analysis, design, implementation and test that run across the phases.",
                "UP suits large object-oriented projects that need a strong and stable architecture.",
                "Example: a bank building a new core banking system would use UP to keep the architecture solid from the start."
              ]
            },
            {
              "q": "What happens in each phase of the Unified Process?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Each phase of the Unified Process has a clear goal and a clear result.",
                "Inception: the team defines the project scope, lists the main use cases, checks if the project is possible, and gets approval.",
                "Its result is a yes-or-no decision to continue.",
                "Elaboration: the team designs the system architecture, builds a working skeleton, removes major technical risks and makes the full plan.",
                "Its result is a stable architecture everyone agrees on.",
                "Construction: the team builds the software in iterations, adding features and testing them each time.",
                "Its result is a complete and tested system.",
                "Transition: the team delivers the software to users, trains them, fixes early problems and hands over documentation.",
                "Its result is a live system running with real users.",
                "Example: in a railway reservation project, inception approves the idea, elaboration designs how booking works, construction builds it, and transition puts it in stations.",
                "So the four phases move the project safely from idea to live use."
              ]
            }
          ]
        },
        {
          "title": "Agility Principles and Agile Values",
          "points": [
            "Agility means the ability to respond quickly to change.",
            "Agility is the ability of a team to respond quickly and correctly when requirements change.",
            "Agile principles: satisfy the customer with early delivery, welcome changing requirements, deliver working software frequently.",
            "Full principles from the Agile Manifesto: satisfy the customer through early and continuous delivery of useful software; welcome changing requirements, even late in development, because change gives the customer an advantage; deliver working software frequently, in short periods of a few weeks; business people and developers must work together daily throughout the project; build projects around motivated people, give them support, and trust them; the most efficient communication is face-to-face conversation; working software is the main measure of progress; simplicity is essential, do the maximum work with the minimum effort; teams regularly reflect on how to improve and adjust their behaviour.",
            "Example: a startup that changes its app design after user feedback within one week is showing agility in action. In short, agility means fast delivery, easy change and close teamwork.",
            "People and interactions matter more than processes and tools.",
            "Working software matters more than heavy documentation.",
            "The four values of the Agile Manifesto: first, individuals and interactions over processes and tools (talented people talking to each other matter more than rigid rules and fancy software); second, working software over comprehensive documentation (a running product matters more than thick documents nobody reads); third, customer collaboration over contract negotiation (working with the customer daily is better than fighting over a fixed contract); fourth, responding to change over following a plan (adapting to new needs is better than blindly following an old plan).",
            "Note that the items on the right still have value, but the items on the left are valued more. Example: a team that quickly rebuilds a feature after customer feedback is following the fourth value. These four values are the heart of every agile method like Scrum and XP.",
            "Plan-driven vs agile: plan-driven and agile are two opposite ways of managing software projects. In plan-driven development the full plan is made first (requirements, design and schedule fixed before coding); in agile, planning adapts as work continues and only the near future is planned in detail. In plan-driven work change is costly because the plan must be redone; in agile change is welcome at any time because work is done in small pieces. Plan-driven projects produce heavy documentation at every stage; agile projects keep documentation light and focus on working software. The customer is involved mainly at the start and end in plan-driven work, but daily in agile work.",
            "Plan-driven suits fixed, critical systems like flight control software; agile suits fast-changing products like mobile apps and websites. Example: building a bridge follows a plan-driven style, while building a new food delivery app follows an agile style. In short, plan-driven trusts the plan, agile trusts the team and the feedback."
          ],
          "questions": [
            {
              "q": "Distinguish between plan-driven and agile development.",
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "kind": "theory",
              "marks": 5,
              "years": "Model paper",
              "a": [
                "Plan-driven and agile are two opposite ways of managing software projects.",
                "In plan-driven development, the full plan is made first: requirements, design and schedule are fixed before coding.",
                "In agile, planning adapts as work continues; only the near future is planned in detail.",
                "In plan-driven work, change is costly because the plan must be redone.",
                "In agile, change is welcome at any time because work is done in small pieces.",
                "Plan-driven projects produce heavy documentation at every stage.",
                "Agile projects keep documentation light and focus on working software.",
                "The customer is involved mainly at the start and end in plan-driven work, but daily in agile work.",
                "Plan-driven suits fixed, critical systems like flight control software.",
                "Agile suits fast-changing products like mobile apps and websites.",
                "Example: building a bridge follows a plan-driven style, while building a new food delivery app follows an agile style.",
                "In short, plan-driven trusts the plan, agile trusts the team and the feedback."
              ]
            },
            {
              "q": "Explain the principles of agility.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Agility is the ability of a team to respond quickly and correctly when requirements change.",
                "It is guided by several principles from the Agile Manifesto.",
                "Satisfy the customer through early and continuous delivery of useful software.",
                "Welcome changing requirements, even late in development, because change gives the customer an advantage.",
                "Deliver working software frequently, in short periods of a few weeks.",
                "Business people and developers must work together daily throughout the project.",
                "Build projects around motivated people, give them support, and trust them.",
                "The most efficient communication is face-to-face conversation.",
                "Working software is the main measure of progress.",
                "Simplicity is essential: do the maximum work with the minimum effort.",
                "Teams regularly reflect on how to improve and adjust their behaviour.",
                "Example: a startup that changes its app design after user feedback within one week is showing agility in action.",
                "In short, agility means fast delivery, easy change and close teamwork."
              ]
            },
            {
              "q": "State and explain the four values of the Agile Manifesto.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "The Agile Manifesto states four values that guide all agile work.",
                "First: individuals and interactions over processes and tools.",
                "This means talented people talking to each other matter more than rigid rules and fancy software.",
                "Second: working software over comprehensive documentation.",
                "This means a running product matters more than thick documents nobody reads.",
                "Third: customer collaboration over contract negotiation.",
                "This means working with the customer daily is better than fighting over a fixed contract.",
                "Fourth: responding to change over following a plan.",
                "This means adapting to new needs is better than blindly following an old plan.",
                "Note that the items on the right still have value, but the items on the left are valued more.",
                "Example: a team that quickly rebuilds a feature after customer feedback is following the fourth value.",
                "These four values are the heart of every agile method like Scrum and XP."
              ]
            }
          ]
        },
        {
          "title": "Agile Methods: XP and Scrum",
          "figures": [
            {
              "kind": "table",
              "caption": "Scrum vs XP: side-by-side comparison",
              "table": {
                "headers": [
                  "Aspect",
                  "Scrum",
                  "XP"
                ],
                "rows": [
                  [
                    "Process type",
                    "Sprint-based agile method",
                    "Disciplined, engineering-focused agile method"
                  ],
                  [
                    "Iterations",
                    "Fixed-length sprints",
                    "Very short cycles with continuous feedback"
                  ],
                  [
                    "Roles",
                    "Product Owner, Scrum Master, Development Team",
                    "Whole team: programmers, customer, testers"
                  ],
                  [
                    "Practices",
                    "Sprint planning, daily standup, review, retrospective",
                    "Pair programming, continuous testing, simple design"
                  ],
                  [
                    "Strengths",
                    "Clear roles and a steady sprint rhythm",
                    "Catches defects early through constant testing"
                  ]
                ]
              }
            }
          ],
          "points": [
            "Agile methods are practical ways of working in an agile style.",
            "Extreme Programming (XP): very short cycles, pair programming, continuous testing, simple design.",
            "Scrum: work divided into sprints; roles are Product Owner, Scrum Master and Development Team.",
            "Other methods: Kanban, Crystal, Feature-Driven Development."
          ],
          "questions": [
            {
              "q": "Explain Extreme Programming and its practices.",
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "kind": "theory",
              "marks": 5,
              "years": "Model paper",
              "a": [
                "Extreme Programming, or XP, is an agile method that takes good practices to an extreme level.",
                "It uses very short development cycles with constant feedback from the customer.",
                "Its key practices are the following.",
                "Pair programming: two developers work on one machine; one writes code while the other reviews it live.",
                "Test-driven development: write the test first, then write the code that passes the test.",
                "Continuous integration: merge and test all code many times a day so errors are found early.",
                "Simple design: keep the design as simple as possible and improve it later.",
                "Refactoring: regularly clean and improve the code without changing what it does.",
                "The customer is always available on site to answer questions quickly.",
                "XP suits small teams building software with changing requirements.",
                "Example: a team of five building a college event app can use pair programming and daily integration to stay fast and correct.",
                "So XP delivers quality software by pushing teamwork, testing and simplicity to the extreme."
              ]
            },
            {
              "q": "Compare Extreme Programming with Scrum.",
            "figure": {
              "kind": "table",
              "caption": "Scrum vs XP: side-by-side comparison",
              "table": {
                "headers": [
                  "Aspect",
                  "Scrum",
                  "XP"
                ],
                "rows": [
                  [
                    "Process type",
                    "Sprint-based agile method",
                    "Disciplined, engineering-focused agile method"
                  ],
                  [
                    "Iterations",
                    "Fixed-length sprints",
                    "Very short cycles with continuous feedback"
                  ],
                  [
                    "Roles",
                    "Product Owner, Scrum Master, Development Team",
                    "Whole team: programmers, customer, testers"
                  ],
                  [
                    "Practices",
                    "Sprint planning, daily standup, review, retrospective",
                    "Pair programming, continuous testing, simple design"
                  ],
                  [
                    "Strengths",
                    "Clear roles and a steady sprint rhythm",
                    "Catches defects early through constant testing"
                  ]
                ]
              }
            },
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "kind": "theory",
              "marks": 5,
              "years": "Model paper",
              "a": [
                "XP and Scrum are both agile methods, but they focus on different things.",
                "XP focuses on engineering practices: how the code is actually written.",
                "Its core is pair programming, test-driven development, continuous integration and simple design.",
                "Scrum focuses on project management: how the work is organised.",
                "Its core is roles, sprints and meetings like planning, standup, review and retrospective.",
                "XP says little about who manages the project; Scrum says little about how to write code.",
                "XP suits small technical teams that need coding discipline.",
                "Scrum suits teams of any size that need clear planning and tracking.",
                "Because they cover different gaps, many teams use both together.",
                "Example: a team can run Scrum sprints for planning and use XP's pair programming and test-first coding inside each sprint.",
                "In short, Scrum manages the work and XP builds the work, so they fit together well."
              ]
            },
            {
              "q": "Explain Scrum with its roles and meetings.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Scrum is the most popular agile method; it organises work into fixed-length cycles called sprints.",
                "A sprint is usually 2 to 4 weeks long and ends with working software.",
                "Scrum has three roles.",
                "Product Owner: decides what to build and sets the priority of features.",
                "Scrum Master: removes problems that block the team and protects the Scrum process.",
                "Development Team: the developers who build the software; they organise their own work.",
                "Scrum has four main meetings.",
                "Sprint planning: choose the work for the coming sprint.",
                "Daily standup: a 15-minute meeting on progress and blockers.",
                "Sprint review: demo the finished work to stakeholders.",
                "Retrospective: discuss what went well and what to improve.",
                "Example: a team building a cab booking app can deliver login in sprint one, booking in sprint two, and payment in sprint three.",
                "Scrum keeps the team focused, visible and improving every sprint."
              ]
            },
            {
              "q": "Explain the Scrum meetings in detail.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Scrum uses four meetings to keep the sprint on track.",
                "Sprint planning happens at the start of the sprint.",
                "The team picks items from the product backlog and decides what can be finished in this sprint.",
                "The result is the sprint backlog, the team's promise for the sprint.",
                "Daily standup is a short 15-minute meeting held every day at the same time.",
                "Each member answers three questions: what did I do yesterday, what will I do today, and what is blocking me.",
                "It is not a status report to a boss; it is the team helping each other.",
                "Sprint review happens at the end of the sprint.",
                "The team demos the working software to the product owner and stakeholders and collects feedback.",
                "Retrospective also happens at the end, after the review.",
                "The team honestly discusses what went well, what went wrong and what to change next sprint.",
                "Example: a retrospective may reveal that testing was rushed, so the next sprint adds more test time.",
                "These four meetings give Scrum its rhythm of plan, work, show and improve."
              ]
            },
            {
              "q": "What are product backlog, sprint backlog and increment in Scrum?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "These three are the main artefacts, or work products, of Scrum.",
                "The product backlog is the full ordered list of everything the product may ever need.",
                "It contains features, fixes and improvements, with the most important items on top.",
                "The Product Owner owns it and keeps it updated.",
                "The sprint backlog is the small list of items chosen for the current sprint.",
                "It is created in sprint planning and belongs to the Development Team.",
                "Nobody changes it during the sprint, so the team can focus.",
                "The increment is the working software produced at the end of the sprint.",
                "It must be potentially shippable, meaning it could be given to the customer.",
                "Each sprint's increment adds to all the previous ones, growing the product step by step.",
                "Example: for a food app, the product backlog has 50 features, the sprint backlog has 5 for this sprint, and the increment is the working login and menu screens.",
                "So the product backlog is the whole dream, the sprint backlog is this sprint's promise, and the increment is the finished result."
              ]
            }
          ]
        },
        {
          "title": "Agile Tool Set",
          "points": [
            "Agile tool set means the tools teams use to work in agile style.",
            "Boards (like Trello or Jira) track tasks moving from to-do to done.",
            "Version control (Git) lets many developers work on the same code.",
            "CI tools build and test code automatically on every change.",
            "Chat and video tools keep remote teams in daily contact."
          ],
          "questions": [
            {
              "q": "Explain the agile tool set with examples.",
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "kind": "theory",
              "marks": 5,
              "years": "Model paper",
              "a": [
                "The agile tool set is the collection of tools that help a team work in an agile style.",
                "Task boards track work visually: tools like Trello and Jira show tasks moving from to-do to doing to done.",
                "Version control tools like Git let many developers work on the same code safely.",
                "Every change is recorded, so mistakes can be undone and work can be merged.",
                "Continuous integration tools like Jenkins build and test the code automatically on every change.",
                "This finds errors within minutes instead of weeks.",
                "Communication tools like Slack and Zoom keep the team in daily contact.",
                "They support daily standups and quick discussions, especially for remote teams.",
                "Test automation tools run the test suite fast after every change.",
                "Example: a team pushes code to Git, Jenkins auto-builds and auto-tests it, and the board card moves to done automatically.",
                "Together these tools make agile speed and quality possible."
              ]
            },
            {
              "q": "What is a Kanban board? How does an agile team use it?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "A Kanban board is a visual board that shows the status of every task in the project.",
                "It has columns like To Do, Doing and Done.",
                "Each task is written on a card placed in the correct column.",
                "As work progresses, team members move their cards from left to right.",
                "The board can be physical, like a whiteboard with sticky notes, or digital, like Trello or Jira.",
                "Everyone can see the project status at a glance without calling a meeting.",
                "If too many cards pile up in the Doing column, the team knows work is stuck and helps out.",
                "This keeps the work flowing smoothly and stops people from starting too many tasks at once.",
                "Example: a student team building a website puts design, coding and testing cards on the board and moves them daily.",
                "So a Kanban board makes work visible, simple and easy to manage."
              ]
            }
          ]
        }
      ]
    },
];

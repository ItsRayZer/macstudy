import type { Module } from "./types";

export const dbmsModulesD: Module[] = [
{
      "num": "4",
      "title": "NoSQL Databases and Big Data",
      "examPattern": "MGU BCA Honours DBMS (MG3CCRBCA201): 70 marks, 2 hours. Part A: 5 x 2 marks, short questions from all modules. Part B: answer any 5 of 6-mark questions. Part C: answer any 2 of 15-mark essays. Old CBCS papers (2019-2021): 80 marks, 3 hours, any-10 x 2 + any-6 x 5 + any-2 x 15. Part C hotspots: COMPANY ER diagram, Normal Forms essay, anomalies.",
      "topics": [
        {
          "title": "Introduction to NoSQL",
          "points": [
            "NoSQL means \"Not only SQL\": databases built for huge, fast-changing data.",
            "Traditional SQL struggles with unstructured data like posts, videos and logs.",
            "NoSQL systems scale horizontally by adding more servers.",
            "They trade some strict consistency for speed and flexibility."
          ],
          "questions": [
            {
              "q": "What is NoSQL? Why was it introduced?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "NoSQL stands for Not Only SQL. It is a family of database systems built to handle very large, fast-changing and unstructured data that traditional relational databases struggle with.",
                "It was introduced because web and mobile apps like social media, e-commerce and streaming started generating data in volumes and forms (posts, videos, logs, clicks) that a single-server SQL database could not store or process fast enough.",
                "NoSQL databases scale horizontally, which means they add more cheap servers to share the load instead of buying one bigger server. This is called scaling out.",
                "They use flexible schemas, so documents or records can have different fields without redesigning tables first.",
                "To gain speed and availability they usually trade off the strict ACID consistency of SQL for a looser model called BASE.",
                "Common examples are MongoDB (documents), Cassandra (column families), Redis (key-value) and Neo4j (graph)."
              ]
            },
            {
              "q": "Give two differences between SQL and NoSQL databases.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "SQL and NoSQL databases differ in four main ways: data organisation, schema, scaling and consistency.",
                "First, data organisation: SQL stores data in fixed-schema tables of rows and columns, with relationships handled through joins, while NoSQL uses flexible models like documents, key-value pairs, column families or graphs.",
                "Second, schema: in SQL the schema must be defined upfront and changing it later with ALTER TABLE is costly, whereas NoSQL is schema-free so each record can carry its own fields and the structure evolves freely.",
                "Third, scaling: SQL scales vertically by moving to a bigger single server, which is expensive and has hard limits, while NoSQL scales horizontally by adding cheap servers, which handles massive data and traffic.",
                "Fourth, consistency: SQL guarantees ACID, so every transaction leaves the data fully correct at once, while NoSQL follows BASE and is eventually consistent, trading instant correctness for speed and availability.",
                "Fifth, query style: SQL uses the standard SQL language everywhere, while each NoSQL system has its own API suited to its data model.",
                "Example: use SQL for bank accounts where exact balances matter, and use NoSQL for a social media feed where speed and scale matter more than instant consistency.",
                "In short, choose SQL when correctness is non-negotiable and NoSQL when huge scale, flexibility and uptime come first."
              ]
            }
          ]
        },
        {
          "title": "NoSQL Data Models",
          "points": [
            "Document model: stores JSON-like documents, e.g. MongoDB.",
            "Key-value model: simple pairs of keys and values, e.g. Redis.",
            "Column-family model: data grouped into column families, e.g. Cassandra.",
            "Graph model: data as nodes and edges, e.g. Neo4j.",
            "Document model detail: each record is a flexible JSON-like document with its own fields, and related data can be nested inside one document. Example: a product document {name: 'shoe', price: 999, reviews: [...]}. MongoDB uses it for catalogs, profiles and content management.",
            "Key-value model detail: every key maps to exactly one value, like a giant dictionary, giving extremely fast lookups by key. Example: key 'session:1234' maps to a user's cart data. Redis uses it for caching, sessions and shopping carts.",
            "Column-family model detail: data is stored in rows made of grouped columns called column families, which is efficient for huge sparse tables where most cells are empty. Example: a user row with column families profile: and activity:. Cassandra uses it for time-series and sensor data.",
            "Graph model detail: data is stored as nodes and edges, so relationships are first-class citizens and traversals are fast. Example: node 'Arun' -FRIENDS_WITH-> node 'Ashwin'. Neo4j uses it for social networks and fraud detection.",
            "The rule for choosing: match the model to the shape of your data and the queries you will run most often.",
            "Graph vs document: choose a graph database when the relationships between items matter more than the items themselves, like 'friends of friends' or 'shortest path' in a social network, fraud detection tracing money paths, or recommendation engines. A document database is better when you mostly fetch whole self-contained records by key, like product catalogs, user profiles and blog posts.",
            "The practical difference: finding friends-of-friends in a graph is one fast traversal, while in a document store it needs multiple lookups or application-level joins, which gets slow as connections grow."
          ],
          "questions": [
            {
              "q": "Explain the four NoSQL data models with one example each. (Model paper)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "NoSQL systems organise data in four main models, and each model fits a different kind of problem.",
                "1. Document model: data is stored as flexible JSON-like documents, each with its own fields, and related data can be nested inside one document. Example: a product document {name: 'shoe', price: 999, reviews: [...]}. Used by MongoDB for catalogs, profiles and content management.",
                "2. Key-value model: every key maps to exactly one value, like a giant dictionary, giving extremely fast lookups by key. Example: key 'session:1234' maps to a user's cart data. Used by Redis for caching, sessions and shopping carts.",
                "3. Column-family model: data is stored in rows made of grouped columns called column families, which is efficient for huge sparse tables where most cells are empty. Example: a user row with column families profile: and activity:. Used by Cassandra for time-series and sensor data.",
                "4. Graph model: data is stored as nodes and edges, so relationships are first-class citizens and traversals are fast. Example: node 'Arun' -FRIENDS_WITH-> node 'Ashwin'. Used by Neo4j for social networks and fraud detection.",
                "The rule for choosing: match the model to the shape of your data and the queries you will run most often."
              ]
            },
            {
              "q": "When would you choose a graph database over a document database?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Choose a graph database over a document database when the relationships between items matter more than the items themselves.",
                "In a graph database, connections are stored directly as edges, so queries like 'friends of friends' or 'shortest path' are single fast traversals. Examples are social networks, fraud detection tracing suspicious money paths, and recommendation engines.",
                "In a document database, each record is self-contained and flexible, which is ideal when you mostly fetch whole records by key. Examples are product catalogs, user profiles and blog posts, where each record has different fields and nested data.",
                "The practical difference: finding friends-of-friends in a graph is one traversal, while in a document store it needs multiple lookups or application-level joins, which gets slow as connections grow.",
                "So the rule of thumb is: graphs for connected data and traversal queries, documents for independent flexible records."
              ]
            }
          ]
        },
        {
          "title": "Document Databases: Uses and Features",
          "points": [
            "Store data as flexible JSON-style documents; each document can have different fields.",
            "No fixed schema: new fields can be added without rebuilding tables.",
            "Good for catalogs, user profiles, blogs and content management.",
            "Documents can be nested, so related data stays together in one read."
          ],
          "questions": [
            {
              "q": "What are the features and uses of NoSQL document databases?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Document databases store data as flexible JSON-style documents grouped into collections, much like rows grouped into tables in SQL.",
                "Flexible schema: documents in one collection can have different fields, so you can add a new field to new documents without rebuilding anything.",
                "Nested data: related details can live inside one document, for example a product document that contains its reviews. This keeps related data together and removes the need for many joins.",
                "Horizontal scaling: document databases spread data across many servers, so they handle large applications and growing traffic well.",
                "Developer friendly: JSON matches the data formats used in web and mobile apps, so moving data between the app and the database is easy.",
                "Uses: product catalogs, user profiles, content management systems, blogging platforms and real-time analytics, anywhere records vary in shape and change often."
              ]
            },
            {
              "q": "Why are document databases a good fit for an online shopping site?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Document databases fit online shopping sites because a store's data is varied, nested and constantly changing.",
                "Products differ in attributes: a T-shirt has sizes and colours while a book has an author and page count. A document store lets each product keep its own fields with no rigid table schema forcing empty columns.",
                "Nested documents keep everything together: a product document can contain its reviews, images and stock details inside it, so one read loads the whole product page fast.",
                "Schema changes are painless: adding a new field like 'discount' to new products needs no table rebuild and does not disturb the millions of existing documents.",
                "Scaling out handles traffic: during festival sales, more servers are added to carry the load, which document stores like MongoDB are built for.",
                "JSON documents also match web and mobile apps naturally, since APIs already speak JSON, so less conversion code is needed.",
                "In short, a document database matches exactly how online stores evolve: varied products, fast page reads and constant change."
              ]
            }
          ]
        },
        {
          "title": "CAP Theorem",
          "points": [
            "CAP: Consistency, Availability, Partition tolerance; a distributed system can guarantee only two.",
            "Consistency: every read gets the latest write.",
            "Availability: every request gets a response, even during failures.",
            "Partition tolerance: the system keeps working despite network splits.",
            "Since partitions happen, designers choose CP or AP."
          ],
          "questions": [
            {
              "q": "Explain the CAP theorem.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "The CAP theorem states that a distributed database system can fully guarantee only two of three properties at the same time: Consistency, Availability and Partition tolerance.",
                "C, Consistency: every read receives the most recent write. All nodes see the same data at the same time.",
                "A, Availability: every request gets a response, even when some servers have failed. The system never refuses to answer.",
                "P, Partition tolerance: the system keeps working even when the network splits and servers cannot talk to each other. Partitions do happen in real networks.",
                "Since network failures are unavoidable, partition tolerance cannot really be given up, so designers choose between the remaining two.",
                "This gives two practical types: CP systems like HBase and MongoDB (when configured strictly) pick consistency over availability, and AP systems like Cassandra pick availability over strict consistency.",
                "Example: banks usually pick CP so balances are always exact, while social feeds pick AP so the feed always loads even if some updates arrive late."
              ]
            },
            {
              "q": "In the CAP theorem, why must partition tolerance be kept?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "In the CAP theorem, partition tolerance must be kept because network partitions, where some servers cannot reach others, are unavoidable in any real distributed system.",
                "Cables fail, routers crash, switches misbehave and whole cloud regions get isolated. No network is perfect, and designing as if partitions never happen is unrealistic.",
                "Giving up partition tolerance would mean the entire system stops working the moment any network split occurs, which is unacceptable for a service that must stay up.",
                "Therefore designers accept P as mandatory and make the real choice between consistency and availability.",
                "That choice is guided by the application: banking systems keep consistency (CP) because showing a wrong balance is costly, while social feeds keep availability (AP) because showing a slightly stale post is harmless.",
                "So partition tolerance is not a preference but a fact of distributed life, and the C-versus-A trade-off is where the real design decision lies."
              ]
            }
          ]
        },
        {
          "title": "BASE vs ACID",
          "points": [
            "BASE: Basically Available, Soft state, Eventually consistent.",
            "ACID prioritises correctness; BASE prioritises availability and speed.",
            "SQL databases follow ACID; most NoSQL databases follow BASE.",
            "Eventually consistent means all copies agree after some time, not instantly.",
            "ACID and BASE are two different philosophies for keeping data correct, used by SQL and NoSQL databases respectively.",
            "ACID stands for Atomicity, Consistency, Isolation and Durability. Atomicity means a transaction is all or nothing, never half done. Consistency means every transaction takes the database from one valid state to another. Isolation means concurrent transactions do not interfere with each other. Durability means once committed, data survives crashes.",
            "BASE stands for Basically Available, Soft state and Eventually consistent. Basically Available means the system keeps responding even during failures. Soft state means data may change over time without new input while copies converge. Eventually consistent means all copies will agree after some delay.",
            "Point by point: ACID demands instant consistency while BASE accepts temporary differences; ACID may refuse a write to stay correct while BASE accepts the write to stay available; ACID suits single strong servers while BASE suits huge distributed clusters.",
            "Use ACID where exact correctness is non-negotiable, like banking and ticket booking, and BASE where massive scale and uptime matter more, like feeds, carts and catalogs.",
            "Eventually consistent detail: in a distributed system the same data lives on many servers. A write reaches one server first and then spreads to the others through replication. During that short window, different users can see different values for the same item; this temporary disagreement is the 'soft state' in BASE.",
            "Example: you like a post on your phone and the count shows 101 immediately, while your friend on another server still sees 100 for a few seconds, and then both settle at 101.",
            "This trade-off is deliberate: it keeps huge systems fast and available instead of making every user wait for every copy to update. It is acceptable for feeds, likes and catalogs where a few seconds of staleness harms nobody, but not for banking where balances must be exact."
          ],
          "questions": [
            {
              "q": "Distinguish between ACID and BASE.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "ACID and BASE are two different philosophies for keeping data correct, used by SQL and NoSQL databases respectively.",
                "ACID stands for Atomicity, Consistency, Isolation and Durability. Atomicity means a transaction is all or nothing, never half done. Consistency means every transaction takes the database from one valid state to another. Isolation means concurrent transactions do not interfere with each other. Durability means once committed, data survives crashes.",
                "BASE stands for Basically Available, Soft state and Eventually consistent. Basically Available means the system keeps responding even during failures. Soft state means data may change over time without new input while copies converge. Eventually consistent means all copies will agree after some delay.",
                "Point by point: ACID demands instant consistency while BASE accepts temporary differences; ACID may refuse a write to stay correct while BASE accepts the write to stay available; ACID suits single strong servers while BASE suits huge distributed clusters.",
                "Use ACID where exact correctness is non-negotiable, like banking and ticket booking, and BASE where massive scale and uptime matter more, like feeds, carts and catalogs."
              ]
            },
            {
              "q": "What does \"eventually consistent\" mean? Give an example.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Eventually consistent means that after a write, all copies of the data will agree with each other after some delay, but not instantly.",
                "In a distributed system the same data lives on many servers. A write reaches one server first and then spreads to the others through replication.",
                "During that short window, different users can see different values for the same item. This temporary disagreement is the 'soft state' in BASE.",
                "Example: you like a post on your phone and the count shows 101 immediately, while your friend on another server still sees 100 for a few seconds, and then both settle at 101.",
                "This trade-off is deliberate: it keeps huge systems fast and available instead of making every user wait for every copy to update.",
                "It is acceptable for feeds, likes and catalogs where a few seconds of staleness harms nobody, but not for banking where balances must be exact."
              ]
            }
          ]
        },
        {
          "title": "CRUD Operations and MongoDB Operators",
          "points": [
            "CRUD: Create, Read, Update, Delete, the four basic data operations.",
            "CRUD stands for Create, Read, Update and Delete, the four basic operations every database supports; in MongoDB each is done with a simple command on a collection.",
            "MongoDB create: db.students.insertOne({name:\"Arun\", marks:85}).",
            "Create: add a new document to a collection. Example: db.students.insertOne({name: 'Arun', marks: 85}) creates one student document.",
            "MongoDB read: db.students.find({marks: {$gt: 80}}).",
            "Read: fetch documents that match a condition. Example: db.students.find({marks: {$gt: 80}}) returns all students whose marks are greater than 80, where $gt is the greater-than operator. find() searches the collection and returns every document matching the filter.",
            "MongoDB update: db.students.updateOne({name:\"Arun\"}, {$set:{marks:90}}).",
            "Update: change fields of matching documents. Example: db.students.updateOne({name: 'Arun'}, {$set: {marks: 90}}) sets Arun's marks to 90, where $set is the set-field operator.",
            "MongoDB delete: db.students.deleteOne({name:\"Arun\"}).",
            "Delete: remove matching documents. Example: db.students.deleteOne({name: 'Arun'}) removes Arun's document.",
            "Common operators: $gt, $lt, $eq, $in, $set.",
            "Range query: db.students.find({marks: {$gte: 60, $lte: 90}});. $gte keeps documents with marks 60 or above and $lte keeps marks 90 or below, so together they form the 60-to-90 range, both inside one document filter. Example: if Arun has 85 and Ashwin has 55, only Arun's document is returned. Change the two numbers for any range, and add .pretty() at the end for readable output.",
            "Update operators modify fields without rewriting the whole document: $set changes a field's value, e.g. db.students.updateOne({rollno: 101}, {$set: {marks: 95}}); $inc increments a number, e.g. {$inc: {marks: 5}}; $unset removes a field; $push appends a value to an array field. They are used with updateOne, updateMany or replaceOne, and they make MongoDB updates precise and fast."
          ],
          "questions": [
            {
              "q": "Explain CRUD operations in MongoDB with examples.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "CRUD stands for Create, Read, Update and Delete, the four basic operations every database supports. In MongoDB each is done with a simple command on a collection.",
                "Create: add a new document to a collection. Example: db.students.insertOne({name: 'Arun', marks: 85}) creates one student document.",
                "Read: fetch documents that match a condition. Example: db.students.find({marks: {$gt: 80}}) returns all students whose marks are greater than 80, where $gt is the greater-than operator.",
                "Update: change fields of matching documents. Example: db.students.updateOne({name: 'Arun'}, {$set: {marks: 90}}) sets Arun's marks to 90, where $set is the set-field operator.",
                "Delete: remove matching documents. Example: db.students.deleteOne({name: 'Arun'}) removes Arun's document.",
                "Other useful operators: $lt for less than, $eq for equal, $in to match any value in a list, and $gte/$lte for greater/less than or equal. Together CRUD and these operators cover nearly all everyday database work."
              ]
            },
            {
              "q": "Write a MongoDB query to find students with marks between 60 and 90.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "sql",
              "marks": 2,
              "years": null,
              "a": [
                "To find students with marks between 60 and 90, combine the $gte (greater than or equal) and $lte (less than or equal) operators in one find query.",
                "    db.students.find({marks: {$gte: 60, $lte: 90}});",
                "How it works: find() searches the students collection and returns every document matching the filter.",
                "$gte: 60 keeps only documents with marks 60 or above, and $lte: 90 keeps only documents with marks 90 or below, so together they form the 60-to-90 range.",
                "Both conditions apply to the same marks field inside one document filter, which is why they sit together in {marks: {...}}.",
                "Example result: if Arun has 85 and Ashwin has 55, only Arun's document is returned.",
                "Change the two numbers to get any range, and add .pretty() at the end for readable output."
              ]
            },
            {
              "q": "Write about update operators in MongoDB. (Model paper)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Update operators modify fields inside MongoDB documents without rewriting the whole document.",
                "$set changes a field's value:",
                "    db.students.updateOne({rollno: 101}, {$set: {marks: 95}});",
                "$inc increments a number:",
                "    db.students.updateOne({rollno: 101}, {$inc: {marks: 5}});",
                "$unset removes a field; $push appends a value to an array field.",
                "Update operators are used with updateOne, updateMany or replaceOne, and they make MongoDB updates precise and fast."
              ]
            }
          ]
        },
        {
          "title": "Big Data Technologies: Hadoop, MongoDB, Cassandra",
          "points": [
            "Hadoop: open-source platform that stores and processes huge data across clusters.",
            "HDFS spreads files over many machines; MapReduce processes them in parallel.",
            "MongoDB: document database used as a flexible store for big varied data.",
            "Cassandra: column-family store built for high availability and massive write loads."
          ],
          "questions": [
            {
              "q": "Write short notes on Hadoop, MongoDB and Cassandra.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Hadoop, MongoDB and Cassandra are three pillars of big data, each solving a different part of the problem.",
                "Hadoop is an open-source platform for storing and processing huge data across clusters of ordinary machines. HDFS (Hadoop Distributed File System) splits files into blocks spread over many machines with replication for safety, and MapReduce processes the blocks in parallel. Example: analysing one year of web server logs.",
                "MongoDB is a schema-free document database that stores big varied data as flexible JSON-like documents. Example: storing product catalogs or user profiles where every record has different fields.",
                "Cassandra is a distributed column-family database built for high availability and massive write loads, with no single point of failure. Example: storing sensor readings or chat message inboxes arriving thousands per second.",
                "Together they cover the three big-data needs: Hadoop for batch storage and analysis, MongoDB for flexible storage, and Cassandra for always-on heavy writes."
              ]
            },
            {
              "q": "A company gets one crore sensor readings a day. Which technology fits and why?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "For one crore sensor readings a day, Hadoop is the best fit for the storage and analysis part.",
                "HDFS stores the huge volume cheaply across many ordinary machines, and its replication keeps the data safe even when machines fail.",
                "MapReduce processes all the readings in parallel, so daily reports like average temperature per hour finish quickly instead of taking all day on one machine.",
                "If the company also needs instant lookups, Cassandra fits the live-serving part: it handles massive write loads and stays available, which suits dashboards and alerts on fresh readings.",
                "MongoDB is less ideal here because its strength is varied flexible documents, while sensor readings are uniform time-series data.",
                "So the practical answer is: Hadoop for batch storage and daily analysis of the one crore readings, plus Cassandra alongside it for the live serving layer."
              ]
            },
            {
              "q": "Define Big Data. (Model paper)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "Big Data means datasets so large, fast or varied that traditional databases cannot handle them.",
                "It is described by the 3 Vs: Volume (terabytes to petabytes), Velocity (streaming sensor and click data), Variety (text, images, video, logs).",
                "Example: one crore sensor readings a day, or every click on a shopping website.",
                "Such data needs distributed systems like Hadoop and NoSQL stores like MongoDB or Cassandra.",
                "Big Data problems appear when volume, velocity or variety breaks a single relational server.",
                "That is why the syllabus pairs it with Hadoop, MongoDB and Cassandra - the distributed answer."
              ]
            }
          ]
        }
      ]
    },
{
      "num": "5",
      "title": "Practical",
      "examPattern": "MGU BCA Honours DBMS (MG3CCRBCA201): 70 marks, 2 hours. Part A: 5 x 2 marks, short questions from all modules. Part B: answer any 5 of 6-mark questions. Part C: answer any 2 of 15-mark essays. Old CBCS papers (2019-2021): 80 marks, 3 hours, any-10 x 2 + any-6 x 5 + any-2 x 15. Part C hotspots: COMPANY ER diagram, Normal Forms essay, anomalies.",
      "topics": [
        {
          "title": "ER Diagram Practice",
          "points": [
            "Step 1: list the entities, e.g. Student, Course, Teacher.",
            "Step 2: list attributes for each and underline the key attributes.",
            "Step 3: find relationships, e.g. Student enrolls in Course, Teacher teaches Course.",
            "Step 4: draw rectangles, ellipses, diamonds and connect them with lines.",
            "Step 5: mark weak entities with double rectangles if any exist."
          ],
          "questions": [
            {
              "q": "Draw an ER diagram for a college database with Student, Course and Teacher. Describe it.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "This practical task is to draw an ER diagram for a college database with three entities: Student, Course and Teacher.",
                "Entities with their attributes (key attributes are underlined in the diagram):",
                "    Student(rollno, name) where rollno is the primary key.",
                "    Course(code, title) where code is the primary key.",
                "    Teacher(id, name) where id is the primary key.",
                "Relationships: Student enrolls in Course (many-to-many); Teacher teaches Course (one-to-many).",
                "Draw rectangles for the three entities Student, Course and Teacher.",
                "Draw diamonds for the relationships Enrolls and Teaches, and connect each diamond to its two entity rectangles with lines.",
                "Draw ellipses for attributes and connect them to the entity rectangles; underline the key attribute ellipse of each entity.",
                "Many-to-many Enrolls would become its own table with rollno and code as foreign keys, while the one-to-many Teaches is handled by a foreign key of Teacher in the Course table."
              ]
            },
            {
              "q": "How do you convert a many-to-many relationship into tables?",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "A many-to-many relationship cannot be stored in either entity table directly, so it is converted into its own table.",
                "Create a separate table for the relationship itself.",
                "    CREATE TABLE Enrolls (",
                "        rollno INT,",
                "        code VARCHAR(10),",
                "        grade CHAR(2),",
                "        PRIMARY KEY (rollno, code),",
                "        FOREIGN KEY (rollno) REFERENCES Student(rollno),",
                "        FOREIGN KEY (code) REFERENCES Course(code)",
                "    );",
                "Example: Enrolls(rollno, code) with both columns as foreign keys.",
                "The pair (rollno, code) together forms the composite primary key, so one student cannot be enrolled in the same course twice.",
                "Extra attributes of the relationship, like grade, go in this table too.",
                "This new table is called a junction table; it removes the many-to-many link and replaces it with two one-to-many links."
              ]
            }
          ]
        },
        {
          "title": "DDL and DML Practice",
          "points": [
            "CREATE TABLE defines columns, keys and constraints in one shot.",
            "INSERT adds rows; always list columns to stay safe.",
            "UPDATE changes rows matched by WHERE; DELETE removes them.",
            "Forgetting WHERE in UPDATE or DELETE changes every row, so double-check it.",
            "Create the Employee table: CREATE TABLE Employee (id INT PRIMARY KEY, name VARCHAR(50) NOT NULL, salary INT CHECK (salary > 0));.",
            "The PRIMARY KEY on id guarantees every employee row has a unique id; NOT NULL on name stops blank names; CHECK (salary > 0) rejects zero or negative salaries.",
            "Insert three rows: INSERT INTO Employee VALUES (1, 'Anu', 30000); INSERT INTO Employee VALUES (2, 'Ben', 45000); INSERT INTO Employee VALUES (3, 'Cia', 38000);. Each INSERT adds one complete row.",
            "Raise salary with UPDATE and WHERE: UPDATE Employee SET salary = salary + 5000 WHERE name = 'Ben';. The WHERE clause limits the change to only Ben's row, so other salaries stay untouched, and Ben's salary becomes 50000.",
            "Remove the row with DELETE and WHERE: DELETE FROM Employee WHERE name = 'Cia';. After this the table has only Anu and Ben left.",
            "Expected output checks: the table Employee with columns id, name, salary and three rows for Anu, Ben and Cia; after the update and delete, Ben has 50000 and Cia is gone."
          ],
          "questions": [
            {
              "q": "Write SQL to create an Employee table and insert three rows.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "sql",
              "marks": 2,
              "years": null,
              "a": [
                "This practical task is to create an Employee table with constraints using DDL and then add three rows using DML.",
                "Create the table:",
                "    CREATE TABLE Employee (",
                "        id INT PRIMARY KEY,",
                "        name VARCHAR(50) NOT NULL,",
                "        salary INT CHECK (salary > 0)",
                "    );",
                "Insert rows:",
                "    INSERT INTO Employee VALUES (1, 'Anu', 30000);",
                "    INSERT INTO Employee VALUES (2, 'Ben', 45000);",
                "    INSERT INTO Employee VALUES (3, 'Cia', 38000);",
                "The PRIMARY KEY on id guarantees every employee row has a unique id.",
                "NOT NULL on name stops blank names from being inserted, and CHECK (salary > 0) rejects zero or negative salaries.",
                "Each INSERT adds one complete row; after the three statements the table holds 3 employees.",
                "Expected output: the table Employee with columns id, name, salary and three rows for Anu, Ben and Cia."
              ]
            },
            {
              "q": "Write queries to give Ben a 5000 raise and to delete the employee named Cia. (Mar 2021)",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "sql",
              "marks": 2,
              "years": null,
              "a": [
                "This practical task is to modify an existing Employee table: raise the salary of Ben and remove the row of Cia.",
                "Raise salary with UPDATE and WHERE:",
                "    UPDATE Employee SET salary = salary + 5000 WHERE name = 'Ben';",
                "Remove the row with DELETE and WHERE:",
                "    DELETE FROM Employee WHERE name = 'Cia';",
                "The WHERE clause in the UPDATE limits the change to only the row where name is Ben, so other salaries stay untouched.",
                "Forgetting WHERE in UPDATE or DELETE would change or remove every row, so always double-check the condition first.",
                "Expected result: Ben's salary becomes 50000 and the table has only Anu and Ben left after Cia's row is deleted."
              ]
            }
          ]
        },
        {
          "title": "SQL Query Practice: Joins and Set Operators",
          "points": [
            "Set operators UNION, INTERSECT and EXCEPT combine results of two queries.",
            "UNION: students from section A plus section B, duplicates removed: SELECT name FROM SecA UNION SELECT name FROM SecB;.",
            "INTERSECT: names present in both sections: SELECT name FROM SecA INTERSECT SELECT name FROM SecB;.",
            "EXCEPT: names in A but not in B: SELECT name FROM SecA EXCEPT SELECT name FROM SecB;.",
            "Both queries must return the same number and type of columns.",
            "UNION removes duplicates; UNION ALL keeps them.",
            "Typical exam pattern: join two tables, filter with WHERE, group and filter groups with HAVING.",
            "Query with INNER JOIN to list student names with subject and mark: SELECT s.name, m.subject, m.mark FROM Student s INNER JOIN Marks m ON s.rollno = m.rollno;. INNER JOIN matches rows where the ON condition is true, so only students having marks rows appear in the result.",
            "The aliases s and m are shortcuts for the Student and Marks tables, making the query shorter and easier to read. Expected output: one row per student-mark pair showing name, subject and mark; a student with no marks row is left out.",
            "Query for departments with average marks above 70, sorted high to low: SELECT dept, AVG(marks) AS avg_marks FROM Student GROUP BY dept HAVING AVG(marks) > 70 ORDER BY avg_marks DESC;.",
            "GROUP BY dept collects the students of each department into groups, and AVG(marks) computes the average of each group. HAVING filters groups after grouping (WHERE filters single rows before grouping), keeping only departments with average above 70. ORDER BY avg_marks DESC sorts the surviving departments from the highest average to the lowest."
          ],
          "questions": [
            {
              "q": "Explain UNION, INTERSECT and EXCEPT with one example each. (Dec 2021, Mar 2021)",
              "tags": [
                "REPEATED"
              ],
              "tagBase": "REPEATED",
              "kind": "theory",
              "marks": 6,
              "years": null,
              "a": [
                "Set operators UNION, INTERSECT and EXCEPT combine the results of two queries into one result.",
                "UNION: students from section A plus section B, duplicates removed.",
                "    SELECT name FROM SecA UNION SELECT name FROM SecB;",
                "INTERSECT: names present in both sections.",
                "    SELECT name FROM SecA INTERSECT SELECT name FROM SecB;",
                "EXCEPT: names in A but not in B.",
                "    SELECT name FROM SecA EXCEPT SELECT name FROM SecB;",
                "Both queries must return the same number and type of columns, otherwise the operator gives an error.",
                "UNION removes duplicate rows; UNION ALL keeps the duplicates.",
                "Expected output: each query returns a single name column with the combined, common, or differing names of the two sections."
              ]
            },
            {
              "q": "Write a query to list student names with their subject and mark using INNER JOIN.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "sql",
              "marks": 2,
              "years": null,
              "a": [
                "This practical task is to combine data from two tables, Student and Marks, so that each student appears with his subject and mark.",
                "Join on the common rollno column:",
                "    SELECT s.name, m.subject, m.mark",
                "    FROM Student s INNER JOIN Marks m",
                "    ON s.rollno = m.rollno;",
                "INNER JOIN matches rows where the ON condition is true, so only students having marks rows appear in the result.",
                "The aliases s and m are shortcuts for the Student and Marks tables, making the query shorter and easier to read.",
                "Expected output: one row per student-mark pair showing name, subject and mark; a student with no marks row is left out."
              ]
            },
            {
              "q": "Write a query to find departments with average marks above 70, sorted high to low.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "sql",
              "marks": 2,
              "years": null,
              "a": [
                "This practical task is to find departments whose average marks are above 70 and list them from the highest average to the lowest.",
                "Group by department, filter groups with HAVING, sort with ORDER BY:",
                "    SELECT dept, AVG(marks) AS avg_marks",
                "    FROM Student GROUP BY dept",
                "    HAVING AVG(marks) > 70",
                "    ORDER BY avg_marks DESC;",
                "GROUP BY dept collects the students of each department into groups, and AVG(marks) computes the average of each group.",
                "HAVING filters groups after grouping (WHERE filters single rows before grouping), keeping only departments with average above 70.",
                "ORDER BY avg_marks DESC sorts the surviving departments from the highest average to the lowest.",
                "Expected output: one row per qualifying department with its dept name and avg_marks, highest first."
              ]
            }
          ]
        },
        {
          "title": "PL/SQL Basics",
          "points": [
            "PL/SQL adds programming to SQL: variables, conditions, loops and error handling.",
            "Block structure: DECLARE, BEGIN, EXCEPTION, END.",
            "DECLARE holds variables; BEGIN holds the logic; EXCEPTION handles errors.",
            "Used for triggers, procedures and batch jobs inside the database."
          ],
          "questions": [
            {
              "q": "What is PL/SQL? Show the structure of a PL/SQL block with an example.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "PL/SQL is Oracle procedural language that adds variables and logic to SQL.",
                "It is used for triggers, procedures and batch jobs inside the database.",
                "Basic block structure:",
                "    DECLARE",
                "        m NUMBER;",
                "    BEGIN",
                "        SELECT marks INTO m FROM Student WHERE rollno = 1;",
                "        DBMS_OUTPUT.PUT_LINE('Marks: ' || m);",
                "    EXCEPTION",
                "        WHEN NO_DATA_FOUND THEN",
                "            DBMS_OUTPUT.PUT_LINE('No student found');",
                "    END;",
                "    /",
                "DECLARE holds variables; BEGIN holds the logic; EXCEPTION handles errors.",
                "SELECT ... INTO m reads a value from the table into the variable m.",
                "The EXCEPTION part catches the NO_DATA_FOUND error when no student has rollno 1 and prints a friendly message instead of crashing."
              ]
            },
            {
              "q": "Write a PL/SQL block that prints \"Pass\" if marks are above 40, else \"Fail\".",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "sql",
              "marks": 2,
              "years": null,
              "a": [
                "This practical task is to write a PL/SQL block that prints \"Pass\" if marks are above 40, else prints \"Fail\".",
                "Use an IF condition inside the BEGIN block:",
                "    DECLARE",
                "        m NUMBER := 55;",
                "    BEGIN",
                "        IF m > 40 THEN",
                "            DBMS_OUTPUT.PUT_LINE('Pass');",
                "        ELSE",
                "            DBMS_OUTPUT.PUT_LINE('Fail');",
                "        END IF;",
                "    END;",
                "    /",
                "The variable m is given the value 55 in the DECLARE section, so the condition m > 40 is true.",
                "IF ... THEN ... ELSE ... END IF is the PL/SQL way of choosing between two actions.",
                "DBMS_OUTPUT.PUT_LINE prints the text to the output window.",
                "Expected output: Pass, because 55 is above 40; with m = 30 the output would be Fail."
              ]
            }
          ]
        },
        {
          "title": "MongoDB Query Practice",
          "points": [
            "use college switches to (or creates) a database.",
            "db.createCollection(\"students\") makes a collection.",
            "insertMany adds several documents at once.",
            "find with operators filters; updateMany and deleteMany act on many documents."
          ],
          "questions": [
            {
              "q": "Write MongoDB commands to create a students collection, insert two documents and find toppers.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "This practical task is to build a small students database in MongoDB: create a collection, insert two documents, and find the toppers.",
                "Switch database and create the collection:",
                "    use college;",
                "    db.createCollection(\"students\");",
                "Insert documents:",
                "    db.students.insertMany([",
                "        {name: \"Arun\", marks: 92},",
                "        {name: \"Ben\", marks: 74}",
                "    ]);",
                "Find students scoring above 85:",
                "    db.students.find({marks: {$gt: 85}});",
                "use college switches to the college database and creates it if it does not exist.",
                "insertMany adds both student documents in one call; MongoDB collections are flexible, so no fixed schema is needed.",
                "The $gt operator means greater than, so find returns only documents with marks above 85.",
                "Expected output: one document for Arun with marks 92; Ben with marks 74 is left out of the result."
              ]
            },
            {
              "q": "Write MongoDB commands to update marks and delete a student.",
              "tags": [
                "IMPORTANT"
              ],
              "tagBase": "IMPORTANT",
              "kind": "theory",
              "marks": 2,
              "years": null,
              "a": [
                "This practical task is to update several documents at once and then delete one specific document in MongoDB.",
                "Update matching documents:",
                "    db.students.updateMany({marks: {$lt: 40}}, {$set: {result: \"fail\"}});",
                "Delete one document:",
                "    db.students.deleteOne({name: \"Ben\"});",
                "updateMany finds every document whose marks are below 40 ($lt means less than) and adds a result field with value \"fail\" using $set.",
                "The $set operator changes only the listed fields and leaves the rest of the document untouched.",
                "deleteOne removes the first document matching the filter, here the student named Ben.",
                "Expected result: all students with marks below 40 get result: \"fail\", and Ben's document is gone from the collection."
              ]
            }
          ]
        }
      ]
    },
];

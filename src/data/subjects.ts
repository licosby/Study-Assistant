import { Subject, SubjectCategory } from '../types';

export const ALL_SUBJECTS: Subject[] = [
  // Histories
  {
    id: 'us-history-1',
    name: 'U.S. History I (Early to 1877)',
    category: 'Histories',
    textbook: 'OpenStax U.S. History',
    icon: 'Landmark',
    description: 'Indigenous America, colonial settlements, Revolution, Early Republic, Jacksonian democracy, Civil War, and Reconstruction.',
    chapters: [
      'Ch 1: The Americas, Europe, and Africa Before 1492',
      'Ch 3: Creating New Social Orders: Colonial Societies (1500–1700)',
      'Ch 6: America\'s War for Independence (1775–1783)',
      'Ch 7: Creating a New Nation: Constitution & Federalist Era',
      'Ch 11: A Nation on the Move: Westward Expansion',
      'Ch 14: The Civil War (1861–1865)',
      'Ch 16: The Era of Reconstruction (1865–1877)'
    ]
  },
  {
    id: 'us-history-2',
    name: 'U.S. History II (1877 to Present)',
    category: 'Histories',
    textbook: 'OpenStax U.S. History',
    icon: 'Clock',
    description: 'Industrialization, Gilded Age, Progressive Era, WWI, Great Depression, New Deal, WWII, Cold War, and Civil Rights.',
    chapters: [
      'Ch 18: Industrialization and the Rise of Big Business',
      'Ch 21: Leading the Way: The Progressive Movement (1890–1920)',
      'Ch 25: Brother, Can You Spare a Dime? The Great Depression',
      'Ch 26: Franklin Roosevelt and the New Deal',
      'Ch 27: Fighting the Good Fight in World War II',
      'Ch 28: Post-War Prosperity and Cold War Fears',
      'Ch 29: The Contested Sixties & The Civil Rights Movement'
    ]
  },
  {
    id: 'world-history',
    name: 'Western Civilization & World History',
    category: 'Histories',
    textbook: 'OpenStax World History',
    icon: 'Globe',
    description: 'Mesopotamia, Greco-Roman classical antiquity, feudal Europe, Renaissance, Reformation, Enlightenment, and revolutions.',
    chapters: [
      'Ch 2: Early River Valley Civilizations',
      'Ch 4: Classical Greece and Hellenistic World',
      'Ch 5: The Roman Republic and Empire',
      'Ch 12: The European Middle Ages and Feudalism',
      'Ch 15: Renaissance and Reformation',
      'Ch 18: The Enlightenment and Age of Reason',
      'Ch 19: The Industrial Revolution'
    ]
  },

  // Sciences
  {
    id: 'chemistry',
    name: 'General Chemistry',
    category: 'Sciences',
    textbook: 'OpenStax Chemistry 2e',
    icon: 'FlaskConical',
    description: 'Atomic structure, periodic trends, stoichiometry, thermochemistry, chemical equilibria, and acid-base kinetics.',
    chapters: [
      'Ch 2: Atoms, Molecules, and Ions',
      'Ch 3: Composition of Substances and Solutions',
      'Ch 4: Stoichiometry of Chemical Reactions',
      'Ch 5: Thermochemistry & Hess\'s Law',
      'Ch 7: Chemical Bonding and Molecular Geometry',
      'Ch 13: Fundamental Equilibrium Concepts',
      'Ch 14: Acid-Base Equilibria'
    ]
  },
  {
    id: 'biology',
    name: 'General Biology',
    category: 'Sciences',
    textbook: 'OpenStax Biology 2e',
    icon: 'Dna',
    description: 'Cell biology, cellular respiration, photosynthesis, molecular genetics, evolutionary mechanisms, and ecology.',
    chapters: [
      'Ch 4: Cell Structure and Organelles',
      'Ch 7: Cellular Respiration & ATP Synthesis',
      'Ch 8: Photosynthesis: Light & Dark Reactions',
      'Ch 12: Mendel\'s Experiments and Heredity',
      'Ch 14: DNA Structure, Replication, and Function',
      'Ch 15: Genes and Proteins (Transcription/Translation)',
      'Ch 18: Evolution and the Origin of Species'
    ]
  },
  {
    id: 'anatomy-physiology',
    name: 'Anatomy & Physiology (A&P)',
    category: 'Sciences',
    textbook: 'OpenStax Anatomy and Physiology 2e',
    icon: 'Activity',
    description: 'Homeostasis, integumentary, skeletal osteology, muscular sliding filament, nervous action potentials, and cardiovascular.',
    chapters: [
      'Ch 1: An Introduction to the Human Body & Homeostasis',
      'Ch 5: The Integumentary System',
      'Ch 6: Bone Tissue and the Skeletal System',
      'Ch 10: Muscle Tissue and Sliding Filament Theory',
      'Ch 12: Nervous Tissue and Action Potentials',
      'Ch 19: The Cardiovascular System: The Heart',
      'Ch 25: The Urinary System & Fluid Regulation'
    ]
  },
  {
    id: 'astronomy',
    name: 'Introductory Astronomy',
    category: 'Sciences',
    textbook: 'OpenStax Astronomy 2e',
    icon: 'Sparkles',
    description: 'Celestial mechanics, Kepler\'s laws, solar system planetary geology, stellar evolution, H-R diagram, and cosmology.',
    chapters: [
      'Ch 3: Orbits and Gravity (Kepler & Newton)',
      'Ch 7: An Introduction to the Solar System',
      'Ch 15: The Sun: A Nuclear Powerhouse',
      'Ch 18: The Stars: A Celestial Census (H-R Diagram)',
      'Ch 22: The Death of Stars: Supernovae & Black Holes',
      'Ch 26: Galaxies and Dark Matter',
      'Ch 29: The Big Bang and the Fate of the Universe'
    ]
  },
  {
    id: 'geology',
    name: 'Physical Geology & Earth Science',
    category: 'Sciences',
    textbook: 'Earth Science (OpenStax / USGS Standards)',
    icon: 'Mountain',
    description: 'Plate tectonics, mineralogy, igneous/sedimentary/metamorphic rocks, geologic time, earthquakes, and hydrogeology.',
    chapters: [
      'Ch 2: Minerals: Building Blocks of Rocks',
      'Ch 3: The Rock Cycle and Igneous Rocks',
      'Ch 5: Weathering, Soil, and Sedimentary Rocks',
      'Ch 7: Plate Tectonics: A Scientific Revolution',
      'Ch 8: Earthquakes and Earth\'s Interior',
      'Ch 10: Geologic Time & Relative/Radiometric Dating'
    ]
  },

  // Ethics & Philosophy
  {
    id: 'ethics',
    name: 'Ethics & Moral Philosophy',
    category: 'Ethics & Philosophy',
    textbook: 'OpenStax Introduction to Philosophy',
    icon: 'Scale',
    description: 'Normative ethics, utilitarianism, Kantian deontology, Aristotelian virtue ethics, social contract theory, and bioethics.',
    chapters: [
      'Ch 8: Normative Moral Theories: Utilitarianism',
      'Ch 9: Deontology and Kant\'s Categorical Imperative',
      'Ch 10: Virtue Ethics and Aristotelian Eudaimonia',
      'Ch 11: Social Contract Theory and Justice (Hobbes, Locke, Rawls)',
      'Ch 12: Applied Ethics, Bioethics, and Contemporary Dilemmas'
    ]
  },

  // Foreign Languages
  {
    id: 'spanish',
    name: 'Spanish (CLEP Spanish Language)',
    category: 'Foreign Languages',
    textbook: 'OpenStax Spanish / Modern States CLEP Spanish',
    icon: 'Languages',
    description: 'Listening comprehension dialogues, ser vs estar, preterite vs imperfect, subjunctive mood, and cultural reading.',
    chapters: [
      'Ch 1: Listening: Conversaciones Cotidianas y Rutinas',
      'Ch 2: Gramática: Ser vs Estar & Por vs Para',
      'Ch 3: Gramática: Pretérito vs Imperfecto',
      'Ch 4: Listening: En La Estación de Tren y Viajes',
      'Ch 5: Gramática: El Modo Subjuntivo (Deseos y Dudas)',
      'Ch 6: Listening: Citas Médicas y Emergencias'
    ]
  },
  {
    id: 'french',
    name: 'French (CLEP French Language)',
    category: 'Foreign Languages',
    textbook: 'Modern States CLEP French / University Core',
    icon: 'MessageSquare',
    description: 'Listening dialogues, passé composé vs imparfait, pronoun placement (y/en), conditional sentences, and liaison.',
    chapters: [
      'Ch 1: Listening: Au Café et Expressions Quotidiennes',
      'Ch 2: Grammaire: Passé Composé vs Imparfait',
      'Ch 3: Listening: Annonces de Train et Réservations',
      'Ch 4: Grammaire: Pronoms Compléments (COD, COI, Y, En)',
      'Ch 5: Listening: À l\'Hôtel et Demande d\'Itinéraire',
      'Ch 6: Grammaire: Le Subjonctif et l\'Hypothèse (Si clauses)'
    ]
  },
  {
    id: 'german',
    name: 'German (CLEP German Language)',
    category: 'Foreign Languages',
    textbook: 'Modern States CLEP German / University Core',
    icon: 'Radio',
    description: 'Listening comprehension, the four noun cases (Nom, Akk, Dat, Gen), subordinate clause verb-kicker order, and modal verbs.',
    chapters: [
      'Ch 1: Listening: Begrüßungen und Alltagsdialoge',
      'Ch 2: Grammatik: Die Vier Fälle (Nominativ, Akkusativ, Dativ, Genitiv)',
      'Ch 3: Listening: Am Bahnhof und Wegbeschreibung',
      'Ch 4: Grammatik: Nebensätze und Verbstellung (Weil, Dass, Wenn)',
      'Ch 5: Listening: Einkaufen und Arztbesuch',
      'Ch 6: Grammatik: Modalverben und Perfekt'
    ]
  },
  {
    id: 'sign-language',
    name: 'American Sign Language (ASL)',
    category: 'Foreign Languages',
    textbook: 'ASL University Core Standards & Deaf Studies',
    icon: 'Hand',
    description: 'Visual spatial grammar, 5 parameters of sign, facial non-manual markers (NMMs), fingerspelling, classifiers, and Deaf culture.',
    chapters: [
      'Ch 1: The 5 Parameters of ASL (HOLME)',
      'Ch 2: Non-Manual Markers (NMMs): Facial Grammar & Question Forms',
      'Ch 3: ASL Syntax: Topic-Comment & Time-First Order',
      'Ch 4: Fingerspelling Rules & Loan Signs',
      'Ch 5: Classifiers (CL:1, CL:3, CL:V, CL:B) and Spatial Mapping',
      'Ch 6: Deaf Culture, Heritage & Gallaudet University History'
    ]
  },

  // Mathematics
  {
    id: 'college-algebra',
    name: 'College Algebra',
    category: 'Mathematics',
    textbook: 'OpenStax College Algebra 2e',
    icon: 'Binary',
    description: 'Quadratic equations, polynomials, rational functions, exponential & logarithmic equations, systems, and matrices.',
    chapters: [
      'Ch 2: Linear and Quadratic Equations',
      'Ch 3: Functions and Function Notation',
      'Ch 5: Polynomial and Rational Functions',
      'Ch 6: Exponential and Logarithmic Functions',
      'Ch 7: Systems of Equations and Matrices'
    ]
  },
  {
    id: 'precalculus',
    name: 'Precalculus & Trigonometry',
    category: 'Mathematics',
    textbook: 'OpenStax Precalculus 2e',
    icon: 'Compass',
    description: 'Unit circle trigonometry, trigonometric identities, law of sines/cosines, polar coordinates, vectors, and limits preview.',
    chapters: [
      'Ch 5: Trigonometric Functions & Unit Circle',
      'Ch 6: Periodic Functions and Graphs',
      'Ch 7: Trigonometric Identities and Equations',
      'Ch 8: Further Applications of Trig (Law of Sines/Cosines, Vectors)',
      'Ch 10: Analytic Geometry and Polar Coordinates'
    ]
  },
  {
    id: 'calculus',
    name: 'Calculus I & II (Differential & Integral)',
    category: 'Mathematics',
    textbook: 'OpenStax Calculus Vol 1 & 2',
    icon: 'TrendingUp',
    description: 'Limits, continuity, product/chain rules, implicit differentiation, optimization, Riemann sums, Fundamental Theorem of Calculus.',
    chapters: [
      'Ch 2: Limits and Rates of Change',
      'Ch 3: Derivatives: Rules, Product, Quotient & Chain Rule',
      'Ch 4: Applications of Derivatives: Extrema and Optimization',
      'Ch 5: Integration and the Fundamental Theorem of Calculus',
      'Ch 6: Applications of Integration (Areas, Volumes)',
      'Vol 2 Ch 3: Techniques of Integration (Parts, Partial Fractions)'
    ]
  },
  {
    id: 'statistics',
    name: 'Introductory Statistics',
    category: 'Mathematics',
    textbook: 'OpenStax Introductory Statistics',
    icon: 'BarChart3',
    description: 'Descriptive statistics, empirical rule, probability rules, normal distribution, Central Limit Theorem, hypothesis testing, regression.',
    chapters: [
      'Ch 2: Descriptive Statistics (Mean, Median, Standard Deviation)',
      'Ch 3: Probability Topics (Multiplication & Addition Rules)',
      'Ch 6: The Normal Distribution & Empirical Rule (68-95-99.7)',
      'Ch 7: The Central Limit Theorem for Sample Means',
      'Ch 9: Hypothesis Testing with One Sample (z and t tests)',
      'Ch 12: Linear Regression and Correlation (r, r²)'
    ]
  },

  // Computer Science & Coding
  {
    id: 'python-coding',
    name: 'Python Programming',
    category: 'Computer Science & Coding',
    textbook: 'OpenStax / Python 3 Core Collegiate Standards',
    icon: 'Terminal',
    description: 'Data types, list comprehensions, dictionary operations, scopes (*args/**kwargs), OOP classes, exceptions, and file I/O.',
    chapters: [
      'Ch 1: Variables, Types, and Control Flow (if/elif/else, loops)',
      'Ch 2: Collections: Lists, Tuples, Sets, and Dictionaries',
      'Ch 3: List Comprehensions, Lambda Functions, and Generators',
      'Ch 4: Functions, Parameter Unpacking (*args, **kwargs) and Scopes',
      'Ch 5: Object-Oriented Programming (Classes, Inheritance, Dunder Methods)',
      'Ch 6: Error and Exception Handling (try/except/finally)'
    ]
  },
  {
    id: 'r-language',
    name: 'R Language for Data Analysis',
    category: 'Computer Science & Coding',
    textbook: 'R for Data Science / University Biostats Core',
    icon: 'LineChart',
    description: 'Vectors, matrices, data frames, factors, vectorized operations, apply/lapply family, tidyverse pipes (%>%), and ggplot2.',
    chapters: [
      'Ch 1: Vector Basics, Indexing, and Vectorized Operations',
      'Ch 2: Factors, Matrices, and Data Frames',
      'Ch 3: The Apply Family (apply, lapply, sapply, tapply)',
      'Ch 4: Data Manipulation with dplyr and Pipes (%>%)',
      'Ch 5: Data Visualization with ggplot2 Grammar of Graphics',
      'Ch 6: Statistical Modeling in R: lm() and summary()'
    ]
  },
  {
    id: 'web-dev',
    name: 'Web Dev: HTML5, CSS3, & Modern JS',
    category: 'Computer Science & Coding',
    textbook: 'W3C / MDN University Web Standards',
    icon: 'Code2',
    description: 'Semantic HTML5, CSS Box Model, Flexbox, Grid layout, JavaScript ES6+, arrow functions, DOM events, and Async/Await.',
    chapters: [
      'Ch 1: Semantic HTML5 Architecture and Accessibility',
      'Ch 2: CSS Box Model, Specificity, and Cascading Rules',
      'Ch 3: Modern Responsive Layouts: Flexbox and CSS Grid',
      'Ch 4: JavaScript ES6+ Features: Destructuring, Spread, and Arrow Functions',
      'Ch 5: Array Methods: map(), filter(), reduce()',
      'Ch 6: Asynchronous JavaScript: Promises, async/await, and Fetch API'
    ]
  },

  // Economics
  {
    id: 'microeconomics',
    name: 'Principles of Microeconomics',
    category: 'Economics',
    textbook: 'OpenStax Principles of Microeconomics 3e',
    icon: 'PieChart',
    description: 'Supply & demand curves, price elasticity, consumer choice, market structures (perfect competition, monopoly, oligopoly), externalities.',
    chapters: [
      'Ch 3: Demand and Supply Equilibrium',
      'Ch 5: Elasticity of Demand and Supply',
      'Ch 6: Consumer Choices and Marginal Utility',
      'Ch 8: Perfect Competition and Profit Maximization',
      'Ch 9: Monopoly, Barriers to Entry, and Deadweight Loss',
      'Ch 12: Environmental Protection and Negative Externalities'
    ]
  },
  {
    id: 'macroeconomics',
    name: 'Principles of Macroeconomics',
    category: 'Economics',
    textbook: 'OpenStax Principles of Macroeconomics 3e',
    icon: 'DollarSign',
    description: 'GDP calculation (C+I+G+NX), inflation CPI, unemployment types, aggregate demand/supply, fiscal policy, Federal Reserve monetary policy.',
    chapters: [
      'Ch 6: The Macroeconomic Perspective and GDP (C+I+G+NX)',
      'Ch 8: Unemployment: Frictional, Structural, Cyclical',
      'Ch 9: Inflation and the Consumer Price Index (CPI)',
      'Ch 11: The Aggregate Demand / Aggregate Supply Model',
      'Ch 14: Money, Banking, and the Federal Reserve System',
      'Ch 15: Monetary Policy and Bank Regulation',
      'Ch 17: Government Budgets and Fiscal Policy'
    ]
  },

  // Business & Accounting
  {
    id: 'accounting',
    name: 'Financial Accounting',
    category: 'Business & Accounting',
    textbook: 'OpenStax Principles of Accounting Vol 1: Financial',
    icon: 'Receipt',
    description: 'Accounting equation (A = L + E), debits and credits, accrual accounting, balance sheet, income statement, FIFO/LIFO, depreciation.',
    chapters: [
      'Ch 2: Analyzing and Recording Transactions (Debits & Credits)',
      'Ch 3: The Adjusting Process and Accrual vs Cash Basis',
      'Ch 4: Completing the Accounting Cycle & Financial Statements',
      'Ch 6: Merchandising Transactions and Inventory Costing (FIFO, LIFO)',
      'Ch 10: Long-Term Assets and Straight-Line Depreciation'
    ]
  },

  // Arts & Humanities
  {
    id: 'art-history',
    name: 'Art History I & II',
    category: 'Arts & Humanities',
    textbook: 'Gardner\'s Art Through the Ages / OpenStax',
    icon: 'Palette',
    description: 'Classical Greek contrapposto, Roman architecture, High Renaissance linear perspective, Baroque chiaroscuro, and Impressionism.',
    chapters: [
      'Ch 5: Ancient Greece: Archaic to Hellenistic Contrapposto',
      'Ch 7: The Roman Empire: Concrete, Arches, and the Pantheon',
      'Ch 21: High Renaissance and Mannerism: Da Vinci and Michelangelo',
      'Ch 23: Baroque Art: Dramatic Tenebrism and Caravaggio',
      'Ch 28: Impressionism, Post-Impressionism, and Modernism'
    ]
  },

  // Government
  {
    id: 'us-government',
    name: 'U.S. Federal Government',
    category: 'Government',
    textbook: 'OpenStax American Government 3e',
    icon: 'ShieldCheck',
    description: 'Constitutional principles, federalism, Bill of Rights civil liberties, Congress legislative process, presidency, and judicial review.',
    chapters: [
      'Ch 2: The Constitution and Its Origins',
      'Ch 3: American Federalism & Commerce Clause',
      'Ch 4: Civil Liberties & Incorporation Doctrine (14th Amendment)',
      'Ch 11: Congress: Committees, Filibuster, and Lawmaking',
      'Ch 12: The Presidency and Executive Powers',
      'Ch 13: The Courts: Judicial Review and Marbury v. Madison'
    ]
  },
  {
    id: 'tx-government',
    name: 'Texas State & Local Government',
    category: 'Government',
    textbook: 'Texas Government Core (OpenStax / Texas Standard)',
    icon: 'Award',
    description: 'Texas Constitution of 1876, plural executive branch, biennial 140-day legislature, dual high courts, and municipal home rule.',
    chapters: [
      'Ch 2: The Texas Constitution of 1876: Principles and Restraints',
      'Ch 3: The Texas Legislature: Biennial 140-Day Regular Sessions',
      'Ch 4: The Texas Plural Executive: Governor, Lt. Governor, Attorney General',
      'Ch 5: The Texas Judicial System: Dual Supreme Court Structure',
      'Ch 6: Local Government: Counties, Municipalities, Home Rule vs General Law'
    ]
  }
];

export const CATEGORIES: SubjectCategory[] = [
  'Histories',
  'Sciences',
  'Ethics & Philosophy',
  'Foreign Languages',
  'Mathematics',
  'Computer Science & Coding',
  'Economics',
  'Business & Accounting',
  'Arts & Humanities',
  'Government'
];

import { Question } from '../types';

export const INITIAL_QUESTION_BANK: Question[] = [
  // ==================== U.S. HISTORY I ====================
  {
    id: 'ush1-01',
    subjectId: 'us-history-1',
    chapter: 'Ch 7: Creating a New Nation: Constitution & Federalist Era',
    textbookRef: 'OpenStax U.S. History, Ch. 7.4: The Constitutional Convention',
    question: 'At the 1787 Constitutional Convention in Philadelphia, how did the "Great Compromise" (Connecticut Compromise) resolve the deadlock between the Virginia Plan and the New Jersey Plan regarding congressional representation?',
    options: [
      { id: 'a', text: 'It created a bicameral legislature with proportional representation in the House of Representatives and equal representation (two senators per state) in the Senate.' },
      { id: 'b', text: 'It established a unicameral legislature where each state received votes in direct proportion to its taxable property value.' },
      { id: 'c', text: 'It allowed the President to appoint half of the Senate while the House of Representatives was chosen solely by state governors.' },
      { id: 'd', text: 'It instituted a rotating representation scheme where small states held all legislative power during alternate biennial sessions.' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'The Connecticut Compromise (Great Compromise) of 1787 blended elements of both the Virginia Plan (proportional to population, favoring populous states) and the New Jersey Plan (equal representation, favoring small states).',
      textbookExcerpt: 'OpenStax U.S. History 7.4: "Roger Sherman of Connecticut proposed what became known as the Great Compromise. Congress would be bicameral: the House of Representatives would consist of members apportioned according to population, while the Senate would have two senators from each state regardless of size."',
      whyCorrect: 'Option A accurately defines the bicameral compromise: proportional representation in the lower house (House) and equal representation in the upper house (Senate).',
      distractorBreakdown: {
        b: 'Incorrect. The New Jersey plan advocated a unicameral house with equal votes, not property-weighted voting.',
        c: 'Incorrect. The original Constitution had state legislatures select senators (until the 17th Amendment in 1913), never presidential appointment.',
        d: 'Incorrect. A rotating legislative schedule was never implemented in the U.S. federal system.'
      },
      keyTakeaway: 'The Great Compromise established our modern bicameral Congress: House (population-based) and Senate (two per state).'
    },
    defaultMnemonic: {
      phrase: 'BIG HOUSE, EQUAL SENATE',
      acronymBreakdown: [
        'Big states wanted population weight (House)',
        'Equal states got 2 seats each (Senate)',
        'Connecticut Compromise welded them together'
      ],
      explanation: 'Remember: House reflects population size (big), Senate grants equal voice (2).'
    }
  },
  {
    id: 'ush1-02',
    subjectId: 'us-history-1',
    chapter: 'Ch 14: The Civil War (1861–1865)',
    textbookRef: 'OpenStax U.S. History, Ch. 14.3: 1863: The Turning Point of the Civil War',
    question: 'President Abraham Lincoln issued the Emancipation Proclamation following which pivotal 1862 battle, and what was its immediate legal scope?',
    options: [
      { id: 'a', text: 'Battle of Antietam; it declared free only enslaved individuals in states or territories actively in open rebellion against the Union.' },
      { id: 'b', text: 'Battle of Gettysburg; it immediately emancipated all enslaved persons across all border states and northern territories.' },
      { id: 'c', text: 'First Battle of Bull Run; it offered financial compensation to Southern slaveowners who agreed to surrender.' },
      { id: 'd', text: 'Battle of Vicksburg; it dissolved slavery throughout the entire Western Hemisphere.' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'Lincoln needed a strategic Union battlefield victory before announcing emancipation so it would not appear as an act of desperation. Antietam provided that platform. Crucially, as a war measure, it applied strictly to Confederate territory in active rebellion, not loyal border states.',
      textbookExcerpt: 'OpenStax U.S. History 14.3: "Following the Confederate retreat at Antietam in September 1862, Lincoln issued the preliminary Emancipation Proclamation... It applied only to states that had seceded, leaving slavery untouched in loyal border states like Maryland, Kentucky, and Missouri."',
      whyCorrect: 'Option A correctly identifies Antietam as the precipitating battle and the strategic limitation to Confederate states in rebellion.',
      distractorBreakdown: {
        b: 'Incorrect. Gettysburg took place in July 1863, months after the January 1, 1863 final Proclamation took effect. Border states were explicitly exempted.',
        c: 'Incorrect. Bull Run was a Union defeat in 1861, and the Proclamation did not compensate slaveowners.',
        d: 'Incorrect. Vicksburg fell in July 1863, and presidential authority could not extend beyond U.S. borders.'
      },
      keyTakeaway: 'The Emancipation Proclamation was issued post-Antietam and strategically freed slaves only in rebel-held Confederate territory.'
    },
    defaultMnemonic: {
      phrase: 'ANTIETAM ANNOUNCES, REBELS RELEASED',
      acronymBreakdown: [
        'A - Antietam provides strategic victory',
        'N - Not border states (spared to preserve loyalty)',
        'R - Rebels only targeted under wartime Commander-in-Chief powers'
      ],
      explanation: 'Link Antietam to the Emancipation Proclamation and remember Border States were excluded until the 13th Amendment.'
    }
  },

  // ==================== U.S. HISTORY II ====================
  {
    id: 'ush2-01',
    subjectId: 'us-history-2',
    chapter: 'Ch 26: Franklin Roosevelt and the New Deal',
    textbookRef: 'OpenStax U.S. History, Ch. 26.2: The First New Deal',
    question: 'Which piece of First New Deal legislation in 1933 established the Federal Deposit Insurance Corporation (FDIC) and separated commercial banking from investment banking?',
    options: [
      { id: 'a', text: 'The Glass-Steagall Banking Act of 1933' },
      { id: 'b', text: 'The National Industrial Recovery Act (NIRA)' },
      { id: 'c', text: 'The Agricultural Adjustment Act (AAA)' },
      { id: 'd', text: 'The Social Security Act of 1935' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'The Glass-Steagall Banking Act of 1933 restored public faith in the collapsed American banking sector by guaranteeing individual savings accounts via the FDIC and erecting a statutory wall between commercial and speculative investment banking.',
      textbookExcerpt: 'OpenStax U.S. History 26.2: "The Emergency Banking Act was followed by the Glass-Steagall Banking Act of 1933, which separated commercial banking from investment banking and created the Federal Deposit Insurance Corporation (FDIC) to insure personal bank deposits up to $2,500."',
      whyCorrect: 'Option A is the definitive statute that created the FDIC and enforced the commercial/investment banking separation.',
      distractorBreakdown: {
        b: 'Incorrect. NIRA established industrial codes of fair competition and the PWA, later struck down in Schechter Poultry.',
        c: 'Incorrect. The AAA provided government subsidies to farmers to reduce crop production and boost agricultural prices.',
        d: 'Incorrect. The Social Security Act was part of the Second New Deal in 1935 to provide old-age pensions and unemployment insurance.'
      },
      keyTakeaway: 'Glass-Steagall (1933) created the FDIC and barred commercial banks from investing depositors\' money in the stock market.'
    },
    defaultMnemonic: {
      phrase: 'GLASS WALLS KEEP DEPOSITS SAFE',
      acronymBreakdown: [
        'G - Glass-Steagall',
        'W - Wall between Wall Street (investment) and High Street (commercial)',
        'D - Deposits insured by FDIC'
      ],
      explanation: 'A glass wall separates investments from deposits, and FDIC seals the guarantee.'
    }
  },

  // ==================== WORLD HISTORY ====================
  {
    id: 'world-01',
    subjectId: 'world-history',
    chapter: 'Ch 18: The Enlightenment and Age of Reason',
    textbookRef: 'OpenStax World History, Ch. 18.2: Political Philosophies of the Enlightenment',
    question: 'In his landmark 1748 treatise "The Spirit of the Laws", which French political philosopher formulated the doctrine of the separation of governmental powers into legislative, executive, and judicial branches?',
    options: [
      { id: 'a', text: 'Baron de Montesquieu' },
      { id: 'b', text: 'Jean-Jacques Rousseau' },
      { id: 'c', text: 'Voltaire (François-Marie Arouet)' },
      { id: 'd', text: 'Thomas Hobbes' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'Montesquieu argued that political liberty could only be safeguarded against tyranny when legislative, executive, and judicial powers were divided among separate entities rather than concentrated in a single monarch or assembly.',
      textbookExcerpt: 'OpenStax World History 18.2: "Charles-Louis de Secondat, Baron de Montesquieu, published The Spirit of the Laws in 1748. He argued that constitutional government required a separation of powers into three distinct branches: executive, legislative, and judicial."',
      whyCorrect: 'Option A is correct; Montesquieu directly inspired the tripartite system in the United States Constitution.',
      distractorBreakdown: {
        b: 'Incorrect. Rousseau wrote The Social Contract emphasizing the "General Will" and direct democracy.',
        c: 'Incorrect. Voltaire championed freedom of speech, religious tolerance, and civil liberties, famously satirizing dogma in Candide.',
        d: 'Incorrect. Hobbes wrote Leviathan (1651), defending absolute sovereign authority to prevent the chaotic state of nature.'
      },
      keyTakeaway: 'Montesquieu = Separation of Powers into three independent branches with checks and balances.'
    },
    defaultMnemonic: {
      phrase: 'MON-TES-QUIEU = 3 SYLLABLES, 3 BRANCHES',
      acronymBreakdown: [
        'Mon (Executive)',
        'Tes (Legislative)',
        'Quieu (Judicial)'
      ],
      explanation: 'Montesquieu has three syllables, just like the three distinct branches of government he proposed.'
    }
  },

  // ==================== CHEMISTRY ====================
  {
    id: 'chem-01',
    subjectId: 'chemistry',
    chapter: 'Ch 4: Stoichiometry of Chemical Reactions',
    textbookRef: 'OpenStax Chemistry 2e, Ch. 4.4: Reaction Yields and Limiting Reactants',
    question: 'Consider the Haber-Bosch synthesis of ammonia: N₂(g) + 3H₂(g) → 2NH₃(g). If 2.0 moles of N₂ gas are reacted with 3.0 moles of H₂ gas, which reagent is the limiting reactant, and what is the theoretical yield of NH₃?',
    options: [
      { id: 'a', text: 'H₂ is the limiting reactant; theoretical yield is 2.0 moles of NH₃.' },
      { id: 'b', text: 'N₂ is the limiting reactant; theoretical yield is 4.0 moles of NH₃.' },
      { id: 'c', text: 'H₂ is the limiting reactant; theoretical yield is 3.0 moles of NH₃.' },
      { id: 'd', text: 'Neither reagent is limiting; both are in exact stoichiometric equivalence yielding 5.0 moles of NH₃.' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'The limiting reactant is completely consumed first and dictates the maximum amount of product formed. By comparing stoichiometric ratios: 2.0 mol N₂ requires (2.0 × 3) = 6.0 mol H₂. Because only 3.0 mol H₂ is available, H₂ runs out first.',
      textbookExcerpt: 'OpenStax Chemistry 2e 4.4: "To determine the limiting reactant, calculate the amount of product that could be formed by each reactant. The reactant producing the lesser amount of product is the limiting reactant."',
      whyCorrect: 'From 3.0 mol H₂: 3.0 mol H₂ × (2 mol NH₃ / 3 mol H₂) = 2.0 mol NH₃. Since 2.0 mol N₂ could produce 4.0 mol NH₃, H₂ limits the reaction to 2.0 mol NH₃.',
      distractorBreakdown: {
        b: 'Incorrect. N₂ would produce 4.0 moles only if sufficient H₂ (6.0 moles) were present, but only 3.0 moles exists.',
        c: 'Incorrect. Fails to account for the 2:3 stoichiometric coefficient ratio (2/3 of 3.0 is 2.0, not 3.0).',
        d: 'Incorrect. The stoichiometric requirement is 1:3, while the provided molar ratio is 2:3 (or 1:1.5).'
      },
      keyTakeaway: 'Always calculate product moles from each starting reactant. The lowest yield determines the limiting reactant and theoretical maximum yield.'
    },
    defaultMnemonic: {
      phrase: 'LEAST MAKES LIMIT',
      acronymBreakdown: [
        'Convert all reactants to product moles',
        'The reactant yielding the LEAST is the LIMITING reactant',
        'Excess reactants remain unreacted'
      ],
      explanation: 'Never guess based on initial mass or moles alone; stoichiometric product yield determines the limit.'
    }
  },
  {
    id: 'chem-02',
    subjectId: 'chemistry',
    chapter: 'Ch 14: Acid-Base Equilibria',
    textbookRef: 'OpenStax Chemistry 2e, Ch. 14.2: pH and pOH',
    question: 'A solution of hydrochloric acid (HCl), a strong monoprotic acid, has a hydronium ion concentration [H₃O⁺] of 1.0 × 10⁻⁴ M at 25°C. What is the pH and pOH of this solution?',
    options: [
      { id: 'a', text: 'pH = 4.00, pOH = 10.00' },
      { id: 'b', text: 'pH = 10.00, pOH = 4.00' },
      { id: 'c', text: 'pH = 4.00, pOH = 7.00' },
      { id: 'd', text: 'pH = 1.00, pOH = 13.00' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'pH = -log₁₀[H₃O⁺]. At 25°C, Kw = [H₃O⁺][OH⁻] = 1.0 × 10⁻¹⁴, which translates to pH + pOH = 14.00.',
      textbookExcerpt: 'OpenStax Chemistry 2e 14.2: "The pH of a solution is defined as pH = -log[H₃O⁺]... At 25°C, the ion-product of water mandates that pH + pOH = 14.00 for any aqueous solution."',
      whyCorrect: 'pH = -log(1.0 × 10⁻⁴) = 4.00. Since pH + pOH = 14.00, pOH = 14.00 - 4.00 = 10.00.',
      distractorBreakdown: {
        b: 'Incorrect. Reverses pH and pOH; an acidic solution with 10⁻⁴ M H⁺ has pH < 7.',
        c: 'Incorrect. pH and pOH must sum to 14.00, not 11.00.',
        d: 'Incorrect. Confuses the coefficient (1.0) with the negative exponent value.'
      },
      keyTakeaway: 'pH = -log[H⁺], and pH + pOH = 14.00 at standard 25°C.'
    },
    defaultMnemonic: {
      phrase: 'POWER OF HYDROGEN SUMS TO 14',
      acronymBreakdown: [
        'p = negative log exponent',
        'Acidic: pH < 7',
        'Neutral: pH = 7',
        'Basic: pH > 7',
        'Sum: pH + pOH = 14'
      ],
      explanation: 'Look at the exponent of 10⁻⁴; negative log gives 4, and 14 - 4 = 10.'
    }
  },

  // ==================== BIOLOGY ====================
  {
    id: 'bio-01',
    subjectId: 'biology',
    chapter: 'Ch 7: Cellular Respiration & ATP Synthesis',
    textbookRef: 'OpenStax Biology 2e, Ch. 7.4: Oxidative Phosphorylation',
    question: 'During eukaryotic cellular respiration, what is the immediate source of energy that directly drives the rotary catalysis of ATP synthase in the mitochondrial inner membrane?',
    options: [
      { id: 'a', text: 'The electrochemical proton gradient (proton-motive force) across the inner mitochondrial membrane.' },
      { id: 'b', text: 'The direct transfer of electrons from FADH₂ directly into the ATP active site.' },
      { id: 'c', text: 'The hydrolysis of glucose molecules inside the mitochondrial matrix.' },
      { id: 'd', text: 'The physical mechanical contraction of cristae membranes during cytoplasmic osmosis.' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'As electrons pass through Complexes I–IV of the electron transport chain, protons (H⁺) are pumped from the matrix into the intermembrane space. The resulting chemiosmotic gradient flows back through ATP synthase, turning its rotor to synthesize ATP from ADP and Pi.',
      textbookExcerpt: 'OpenStax Biology 2e 7.4: "The energy stored in the electrochemical gradient of hydrogen ions across the inner membrane—called the proton-motive force—powers the catalytic activity of ATP synthase via chemiosmosis."',
      whyCorrect: 'Option A accurately describes Peter Mitchell\'s chemiosmotic hypothesis: the proton-motive force drives ATP synthase.',
      distractorBreakdown: {
        b: 'Incorrect. FADH₂ donates electrons to Complex II of the electron transport chain, not directly to ATP synthase.',
        c: 'Incorrect. Glucose is split in the cytoplasm during glycolysis, not inside the mitochondrial matrix.',
        d: 'Incorrect. Membrane contraction is not a biochemical mechanism for ATP generation.'
      },
      keyTakeaway: 'ATP synthase is driven by the electrochemical proton gradient established across the inner mitochondrial membrane.'
    },
    defaultMnemonic: {
      phrase: 'PROTON DAM TURNS THE TURBINE',
      acronymBreakdown: [
        'Protons pumped behind the inner membrane "dam"',
        'Water flowing through turns the turbine (ATP Synthase)',
        'Electricity generated is ATP energy'
      ],
      explanation: 'Think of mitochondria as a hydroelectric dam: proton buildup behind the wall drives the rotary turbine.'
    }
  },

  // ==================== ANATOMY & PHYSIOLOGY ====================
  {
    id: 'ap-01',
    subjectId: 'anatomy-physiology',
    chapter: 'Ch 10: Muscle Tissue and Sliding Filament Theory',
    textbookRef: 'OpenStax Anatomy and Physiology 2e, Ch. 10.3: Muscle Fiber Contraction and Relaxation',
    question: 'According to the sliding filament model of skeletal muscle contraction, what regulatory event must occur before the myosin head can bind to actin and initiate the power stroke?',
    options: [
      { id: 'a', text: 'Calcium ions (Ca²⁺) bind to troponin, inducing a conformational shift that pulls tropomyosin away from actin\'s myosin-binding sites.' },
      { id: 'b', text: 'Potassium ions (K⁺) depolarize the Z-disc to physically uncouple titin filaments from actin.' },
      { id: 'c', text: 'ATP hydrolyzes into ADP, permanently crosslinking actin to the sarcolemma.' },
      { id: 'd', text: 'Acetylcholine directly enters the myofibril sarcoplasm and dissolves the dystrophin protein barrier.' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'In relaxed muscle, tropomyosin covers the myosin-binding sites on actin. Upon depolarization, the sarcoplasmic reticulum releases Ca²⁺, which binds to troponin C. This shifts tropomyosin off the binding sites, allowing myosin heads to cross-bridge and perform the power stroke.',
      textbookExcerpt: 'OpenStax Anatomy and Physiology 2e 10.3: "Calcium ions released from the sarcoplasmic reticulum bind to troponin. This binding causes troponin to change shape, pulling tropomyosin away from the active sites on actin strands, allowing cross-bridge formation."',
      whyCorrect: 'Option A details the exact molecular sequence of excitation-contraction coupling.',
      distractorBreakdown: {
        b: 'Incorrect. Potassium efflux mediates repolarization of the sarcolemma; it does not displace titin.',
        c: 'Incorrect. ATP hydrolysis primes the myosin head (cocked state), but crosslinking is transient, not permanent.',
        d: 'Incorrect. Acetylcholine binds to nicotinic receptors at the neuromuscular junction surface; it does not enter myofibrils.'
      },
      keyTakeaway: 'Ca²⁺ binds troponin → moves tropomyosin → uncovers actin active sites → myosin cross-bridges.'
    },
    defaultMnemonic: {
      phrase: 'C-T-T-M: CALCIUM TACKLES TROPONIN TO MOVE TROPOMYOSIN',
      acronymBreakdown: [
        'C - Calcium released',
        'T - Troponin bound',
        'T - Tropomyosin shifted away',
        'M - Myosin engages actin'
      ],
      explanation: 'Calcium unlocks Troponin, which drags the Tropomyosin shield out of the way so Myosin can strike.'
    }
  },

  // ==================== ASTRONOMY ====================
  {
    id: 'astro-01',
    subjectId: 'astronomy',
    chapter: 'Ch 18: The Stars: A Celestial Census (H-R Diagram)',
    textbookRef: 'OpenStax Astronomy 2e, Ch. 18.4: The H-R Diagram',
    question: 'On a standard Hertzsprung-Russell (H-R) diagram, what are the plotted axes, and where do Main Sequence stars like our Sun lie?',
    options: [
      { id: 'a', text: 'Y-axis: Luminosity (or Absolute Magnitude); X-axis: Surface Temperature (decreasing left-to-right); Main Sequence spans upper-left to lower-right.' },
      { id: 'b', text: 'Y-axis: Distance from Earth; X-axis: Age in billions of years; Main Sequence forms a vertical band on the far right.' },
      { id: 'c', text: 'Y-axis: Core temperature; X-axis: Orbital velocity; Main Sequence stars cluster solely in the lower-left corner.' },
      { id: 'd', text: 'Y-axis: Gravitational mass; X-axis: Planetary diameter; Main Sequence stars form a circular ring around the origin.' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'The H-R diagram plots stellar Luminosity (brightness) on the vertical axis against Surface Temperature (or Spectral Class OBAFGKM) on the horizontal axis. Crucially, temperature decreases from left (hot blue stars ~30,000K) to right (cool red stars ~3,000K). About 90% of stars lie along the diagonal Main Sequence fusing hydrogen into helium in their cores.',
      textbookExcerpt: 'OpenStax Astronomy 2e 18.4: "The Hertzsprung-Russell diagram plots luminosity on the vertical axis and surface temperature on the horizontal axis... Main sequence stars define a continuous band running from hot, luminous stars at the top left to cool, dim stars at the bottom right."',
      whyCorrect: 'Option A precisely defines the classical astronomical conventions of the H-R diagram.',
      distractorBreakdown: {
        b: 'Incorrect. Distance is excluded by using intrinsic luminosity or absolute magnitude rather than apparent magnitude.',
        c: 'Incorrect. Core temperature cannot be measured directly by spectrometry; surface temperature is plotted.',
        d: 'Incorrect. Planetary diameter and orbital velocities are characteristics of solar systems, not H-R stellar classification.'
      },
      keyTakeaway: 'H-R Diagram: Vertical = Luminosity, Horizontal = Decreasing Temperature (OBAFGKM: Hot Left, Cool Right).'
    },
    defaultMnemonic: {
      phrase: 'OH BE A FINE GUY/GIRL KISS ME (OBAFGKM)',
      acronymBreakdown: [
        'O - Hottest blue stars (>30,000 K)',
        'B, A, F - Intermediate white/yellow',
        'G - Our Sun (~5,800 K)',
        'K, M - Coolest red dwarfs (~3,000 K)'
      ],
      explanation: 'Spectral classes arranged hottest to coldest across the horizontal axis.'
    }
  },

  // ==================== GEOLOGY ====================
  {
    id: 'geo-01',
    subjectId: 'geology',
    chapter: 'Ch 7: Plate Tectonics: A Scientific Revolution',
    textbookRef: 'Physical Geology / OpenStax, Ch. 7.3: Plate Boundaries',
    question: 'The San Andreas Fault in California is a premier geologic example of which type of plate boundary, and what characteristic motion does it display?',
    options: [
      { id: 'a', text: 'Transform plate boundary; horizontal strike-slip motion where the Pacific Plate slides past the North American Plate.' },
      { id: 'b', text: 'Convergent subduction boundary; where oceanic crust dives beneath continental crust into an active trench.' },
      { id: 'c', text: 'Divergent spreading boundary; where new basaltic oceanic lithosphere is created at an upwelling magma ridge.' },
      { id: 'd', text: 'Continental collision suture; where two buoyant continental cratons buckle upward to form high mountain belts.' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'At transform boundaries, lithospheric plates slide horizontally past one another along strike-slip faults without the creation or destruction of crust. The San Andreas is a right-lateral transform fault separating the Pacific and North American plates.',
      textbookExcerpt: 'Physical Geology 7.3: "Transform faults connect other types of plate boundaries. The best-known continental example is California\'s San Andreas Fault, where the Pacific Plate moves northwestward relative to the North American Plate in a strike-slip fashion."',
      whyCorrect: 'Option A matches the tectonic mechanism and geographic location of the San Andreas Fault.',
      distractorBreakdown: {
        b: 'Incorrect. Cascadian subduction zone to the north displays subduction, but San Andreas is pure lateral shearing.',
        c: 'Incorrect. Divergent boundaries occur at mid-ocean ridges (like the Mid-Atlantic Ridge) or continental rifts (East Africa).',
        d: 'Incorrect. Continental-continental collision produces mountain chains like the Himalayas, not strike-slip shear faults.'
      },
      keyTakeaway: 'San Andreas Fault = Transform plate boundary (plates slide horizontally past one another).'
    },
    defaultMnemonic: {
      phrase: 'TRANSFORM: SLIDE PAST WITHOUT CRUSH OR TEAR',
      acronymBreakdown: [
        'Divergent = Divide (pull apart)',
        'Convergent = Crash (come together)',
        'Transform = Transit (slide past)'
      ],
      explanation: 'Transform faults move sideways like trains passing on parallel tracks.'
    }
  },

  // ==================== ETHICS & PHILOSOPHY ====================
  {
    id: 'eth-01',
    subjectId: 'ethics',
    chapter: 'Ch 9: Deontology and Kant\'s Categorical Imperative',
    textbookRef: 'OpenStax Introduction to Philosophy, Ch. 9.2: Kantian Deontology',
    question: 'According to Immanuel Kant\'s deontological ethics, what constitutes the "Categorical Imperative" (Universal Law formulation)?',
    options: [
      { id: 'a', text: 'Act only according to that maxim whereby you can at the same time will that it should become a universal law of nature.' },
      { id: 'b', text: 'Act in whatever manner produces the greatest net happiness for the largest number of sentient beings.' },
      { id: 'c', text: 'Act in accordance with the Golden Mean between the extremes of excess and deficiency in human virtue.' },
      { id: 'd', text: 'Act solely out of fear of divine retribution and civil punitive authority.' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'Kant formulated deontology based on duty (deon) rather than consequences. The Categorical Imperative is unconditional: an action is morally permissible if and only if its underlying maxim can be universalized without logical contradiction.',
      textbookExcerpt: 'OpenStax Introduction to Philosophy 9.2: "Kant\'s first formulation of the Categorical Imperative commands: \'Act only according to that maxim whereby you can at the same time will that it should become a universal law.\' If a maxim cannot be universalized without creating a contradiction, it fails the moral test."',
      whyCorrect: 'Option A is the exact translation of Kant\'s First Formulation from the Groundwork of the Metaphysics of Morals.',
      distractorBreakdown: {
        b: 'Incorrect. That is the utilitarian principle of utility articulated by Jeremy Bentham and John Stuart Mill.',
        c: 'Incorrect. The Golden Mean is Aristotle\'s virtue ethics from the Nicomachean Ethics.',
        d: 'Incorrect. Kant rejected heteronomous motivations (such as fear, desire, or external reward) as non-moral.'
      },
      keyTakeaway: 'Kant\'s Categorical Imperative: An action is moral only if its rule can be consistently applied to everyone everywhere.'
    },
    defaultMnemonic: {
      phrase: 'CAN IT BE A UNIVERSAL LAW?',
      acronymBreakdown: [
        'C - Categorical (applies always, no exceptions)',
        'I - Imperative (a binding command of reason)',
        'U - Universalize (what if everyone did it?)'
      ],
      explanation: 'Before acting, ask: "What if every person on Earth did this?" If society collapses (e.g. lying), it is immoral.'
    }
  },

  // ==================== SPANISH (WITH AUDIO COMPONENT) ====================
  {
    id: 'span-01',
    subjectId: 'spanish',
    chapter: 'Ch 4: Listening: En La Estación de Tren y Viajes',
    textbookRef: 'Modern States CLEP Spanish / OpenStax, Section 4: Comprensión Auditiva',
    question: 'Escucha el siguiente diálogo en la estación de tren de Madrid. ¿A qué hora sale el tren hacia Sevilla y qué debe hacer el pasajero antes de abordar?',
    audioDialogue: {
      language: 'es-ES',
      speakerText: 'Pasajero: Disculpe, señorita, ¿a qué hora sale el próximo tren de alta velocidad con destino a Sevilla? Empleada: El AVE número 2140 saldrá a las cuatro y media de la tarde por el andén número tres. Por favor, recuerde validar su billete en el lector digital antes de cruzar el control de seguridad.',
      englishTranslation: 'Passenger: Excuse me, miss, what time does the next high-speed train to Seville leave? Agent: AVE number 2140 will depart at four-thirty in the afternoon from platform number three. Please remember to validate your ticket at the digital reader before crossing security checkpoint.',
      speakers: [
        { name: 'Pasajero', line: 'Disculpe, señorita, ¿a qué hora sale el próximo tren con destino a Sevilla?' },
        { name: 'Empleada', line: 'El AVE saldrá a las cuatro y media de la tarde por el andén tres. Recuerde validar su billete antes del control.' }
      ]
    },
    options: [
      { id: 'a', text: 'Sale a las 4:30 PM por el andén 3; debe validar su billete antes de la seguridad.' },
      { id: 'b', text: 'Sale a las 3:15 PM por el andén 4; debe pagar una tarifa adicional en efectivo.' },
      { id: 'c', text: 'Sale a las 5:00 PM por el andén 2; debe registrar dos maletas en el mostrador.' },
      { id: 'd', text: 'El tren ha sido cancelado debido a una huelga laboral.' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'Comprensión auditiva en español (CLEP Listening Comprehension). Listening for specific details: time ("cuatro y media" = 4:30), platform ("andén número tres" = platform 3), and passenger action ("validar su billete" = validate ticket).',
      textbookExcerpt: 'Modern States CLEP Spanish Listening Prep: "Candidates must comprehend spoken Iberian and Latin American Spanish spoken at conversational tempo, identifying logistical instructions, numbers, and departure times."',
      whyCorrect: 'Option A matches all details stated by the ticket agent: 4:30 PM ("cuatro y media"), platform 3 ("andén tres"), and ticket validation ("validar su billete").',
      distractorBreakdown: {
        b: 'Incorrect. The departure is 4:30, not 3:15, and no cash fee is requested.',
        c: 'Incorrect. The departure is 4:30, not 5:00, and baggage check is not mentioned.',
        d: 'Incorrect. The dialog confirms active departure without cancellation.'
      },
      keyTakeaway: 'Focus on keywords: "cuatro y media" (4:30), "andén" (platform), and "validar" (validate).'
    },
    defaultMnemonic: {
      phrase: 'HORA Y ANDÉN',
      acronymBreakdown: [
        'Cuatro y media = 4:30',
        'Andén = Platform (like a train apron)',
        'Validar = Scan/Stamp before boarding'
      ],
      explanation: 'Train station CLEP prompts always test time expressions and track/platform vocabulary.'
    }
  },
  {
    id: 'span-02',
    subjectId: 'spanish',
    chapter: 'Ch 2: Gramática: Ser vs Estar & Por vs Para',
    textbookRef: 'OpenStax Spanish / CLEP Core, Ch. 2.3: Uses of Ser and Estar',
    question: 'Completa la frase con la forma correcta de los verbos ser o estar: "Aunque Juan _____ un médico muy inteligente, hoy _____ muy nervioso por la cirugía."',
    options: [
      { id: 'a', text: 'es / está' },
      { id: 'b', text: 'está / es' },
      { id: 'c', text: 'es / es' },
      { id: 'd', text: 'está / está' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'Ser is used for permanent characteristics, professions, identity, and essential traits (DOCTOR: Description, Occupation, Characteristic, Time, Origin, Relationship). Estar is used for temporary states, conditions, locations, and emotions (PLACE: Position, Location, Action, Condition, Emotion).',
      textbookExcerpt: 'OpenStax Spanish 2.3: "Use ser with professions and inherent traits (\'Juan es médico inteligente\'). Use estar for transient physical or emotional states (\'hoy está muy nervioso\')."',
      whyCorrect: 'Being a smart doctor is an occupation and inherent characteristic (es). Feeling nervous today is a temporary emotional state (está).',
      distractorBreakdown: {
        b: 'Incorrect. Reverses the rules; professions require ser, while temporary emotions require estar.',
        c: 'Incorrect. Nervousness is not a permanent intrinsic identity.',
        d: 'Incorrect. Profession takes ser, not estar.'
      },
      keyTakeaway: 'Ser = Occupation & Inherent Traits; Estar = Temporary emotional condition & Location.'
    },
    defaultMnemonic: {
      phrase: 'SER = DOCTOR, ESTAR = PLACE',
      acronymBreakdown: [
        'SER: Description, Occupation, Characteristic, Time, Origin, Relationship',
        'ESTAR: Position, Location, Action (progressive), Condition, Emotion'
      ],
      explanation: 'Use the standard DOCTOR vs PLACE rule to master 100% of ser vs estar questions.'
    }
  },

  // ==================== FRENCH (WITH AUDIO COMPONENT) ====================
  {
    id: 'fren-01',
    subjectId: 'french',
    chapter: 'Ch 1: Listening: Au Café et Expressions Quotidiennes',
    textbookRef: 'Modern States CLEP French / University Core, Section 1: Compréhension Orale',
    question: 'Écoutez le dialogue suivant enregistré dans un bistrot parisien. Que commande la cliente et quel problème signale-t-elle au serveur ?',
    audioDialogue: {
      language: 'fr-FR',
      speakerText: 'Serveur: Bonjour madame, vous avez choisi ? Cliente: Oui, je voudrais une salade niçoise et une carafe d\'eau fraîche, s\'il vous plaît. Par contre, excusez-moi, mais la table à côté est un peu trop bruyante; est-ce que je pourrais m\'installer près de la fenêtre ? Serveur: Bien sûr madame, suivez-moi.',
      englishTranslation: 'Waiter: Good day madam, have you chosen? Customer: Yes, I would like a Niçoise salad and a pitcher of cold tap water, please. However, excuse me, but the next table is a bit too loud; could I sit by the window? Waiter: Of course madam, follow me.',
      speakers: [
        { name: 'Serveur', line: 'Bonjour madame, vous avez choisi ?' },
        { name: 'Cliente', line: 'Une salade niçoise et une carafe d\'eau, s\'il vous plaît. Mais la table voisine est bruyante, puis-je aller près de la fenêtre ?' }
      ]
    },
    options: [
      { id: 'a', text: 'Elle commande une salade niçoise et de l\'eau; elle demande à changer de table en raison du bruit.' },
      { id: 'b', text: 'Elle commande un croissant et un café au lait; elle constate que l\'addition est erronée.' },
      { id: 'c', text: 'Elle demande un plat du jour chaud car le restaurant est trop froid.' },
      { id: 'd', text: 'Elle refuse de commander parce que le restaurant n\'accepte pas la carte bancaire.' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'CLEP French Listening Comprehension (Compréhension de l\'oral). Recognizing food vocabulary ("salade niçoise", "carafe d\'eau") and customer requests regarding ambient conditions ("bruyante" = noisy, "près de la fenêtre" = near the window).',
      textbookExcerpt: 'Modern States CLEP French Oral Prep: "Students must understand colloquial dining exchanges, polite request phrasing (\'je voudrais\', \'est-ce que je pourrais\'), and environmental adjectives."',
      whyCorrect: 'Option A matches the food order ("salade niçoise", "carafe d\'eau") and the request to move away from the loud adjacent table ("bruyante").',
      distractorBreakdown: {
        b: 'Incorrect. No coffee, croissant, or bill dispute occurred in the dialogue.',
        c: 'Incorrect. She asked to move near the window due to noise, not ambient room temperature.',
        d: 'Incorrect. Payment methods were not discussed.'
      },
      keyTakeaway: 'Key terms: "salade niçoise", "carafe d\'eau", "bruyante" (noisy), and "près de la fenêtre" (near window).'
    },
    defaultMnemonic: {
      phrase: 'BRUYT = NOISE, CARAFE = TAP WATER',
      acronymBreakdown: [
        'Bruit / Bruyant = Noise / Loud',
        'Une carafe d\'eau = Free pitcher of tap water (standard French dining)',
        'Voudrais = Polite conditional "I would like"'
      ],
      explanation: 'Notice "bruyante" sounds like brute or clamor. Carafe is always standard table water.'
    }
  },

  // ==================== GERMAN (WITH AUDIO COMPONENT) ====================
  {
    id: 'germ-01',
    subjectId: 'german',
    chapter: 'Ch 3: Listening: Am Bahnhof und Wegbeschreibung',
    textbookRef: 'Modern States CLEP German / University Core, Section 3: Hörverstehen',
    question: 'Hören Sie sich die Lautsprecherdurchsage am Münchner Hauptbahnhof an. Auf welchem Gleis fährt der ICE nach Berlin ab und welche Verspätung liegt vor?',
    audioDialogue: {
      language: 'de-DE',
      speakerText: 'Achtung an Gleis sieben! Der Intercity-Express 804 nach Berlin Hauptbahnhof über Nürnberg und Leipzig, planmäßige Abfahrt um vierzehn Uhr zwanzig, fährt heute mit einer Verspätung von etwa fünfzehn Minuten ein. Grund dafür ist eine technische Störung an der Strecke.',
      englishTranslation: 'Attention at platform seven! Intercity-Express 804 to Berlin Central Station via Nuremberg and Leipzig, scheduled departure at 14:20, will arrive today with a delay of approximately fifteen minutes. The reason is a technical disruption on the track.',
      speakers: [
        { name: 'Durchsage', line: 'Achtung an Gleis sieben! ICE 804 nach Berlin, Abfahrt 14:20 Uhr, hat circa 15 Minuten Verspätung wegen einer technischen Störung.' }
      ]
    },
    options: [
      { id: 'a', text: 'Gleis 7; planmäßig 14:20 Uhr; ca. 15 Minuten Verspätung.' },
      { id: 'b', text: 'Gleis 4; planmäßig 16:30 Uhr; pünktliche Abfahrt.' },
      { id: 'c', text: 'Gleis 15; planmäßig 12:00 Uhr; Zug fällt komplett aus.' },
      { id: 'd', text: 'Gleis 2; planmäßig 14:00 Uhr; 50 Minuten Verspätung.' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'CLEP German Listening Comprehension (Hörverstehen). Extracting numbers, times, and transit status: "Gleis sieben" = Track 7, "vierzehn Uhr zwanzig" = 14:20 (2:20 PM), "fünfzehn Minuten Verspätung" = 15 minutes delay.',
      textbookExcerpt: 'Modern States CLEP German: "Listening candidates must process public address announcements, recognizing 24-hour military clock time, platform designations (Gleis), and delay notifications (Verspätung)."',
      whyCorrect: 'Option A matches all spoken audio metrics: Gleis 7, 14:20, and 15 minutes delay.',
      distractorBreakdown: {
        b: 'Incorrect. The train is on Gleis 7 (not 4) and is delayed by 15 minutes (not on time).',
        c: 'Incorrect. 15 was the minutes of delay, not the track number, and the train was not cancelled.',
        d: 'Incorrect. The delay is 15 minutes ("fünfzehn"), not 50 minutes ("fünfzig").'
      },
      keyTakeaway: 'Distinguish "fünfzehn" (15) vs "fünfzig" (50) and remember "Gleis" means train track/platform.'
    },
    defaultMnemonic: {
      phrase: 'GLEIS = TRACK, VERSPÄTUNG = LATE',
      acronymBreakdown: [
        'Gleis = Railroad track/platform',
        'Vierzehn Uhr zwanzig = 14:20 (2:20 PM)',
        'Verspätung = Delay (late / spät)'
      ],
      explanation: 'Look for "spät" inside "Verspätung" — it literally means "belatedness".'
    }
  },

  // ==================== SIGN LANGUAGE (ASL) ====================
  {
    id: 'asl-01',
    subjectId: 'sign-language',
    chapter: 'Ch 1: The 5 Parameters of ASL (HOLME)',
    textbookRef: 'ASL University Core Standards, Unit 1: Phonological Parameters',
    question: 'In American Sign Language (ASL), what are the 5 universal parameters (HOLME) that form every individual sign, and what happens if even one parameter is altered?',
    aslNotation: {
      gloss: 'SUMMER vs UGLY vs DRY',
      parameters: {
        handshape: '1-to-X handshape (index bent into hook)',
        location: 'Forehead (SUMMER), Nose (UGLY), Chin (DRY)',
        movement: 'Horizontal pull across face while contracting into X',
        palmOrientation: 'Palm down towards face',
        nonManualMarkers: 'Neutral to furrowed depending on lexical context'
      },
      description: 'The minimal pair SUMMER, UGLY, and DRY share identical Handshape, Movement, and Palm Orientation, differing solely by Location (Forehead vs Nose vs Chin).'
    },
    options: [
      { id: 'a', text: 'Handshape, Palm Orientation, Location, Movement, and Non-Manual Markers (facial expressions); altering one changes the meaning or makes it nonsensical.' },
      { id: 'b', text: 'Volume, Pitch, Resonance, Throat Vibration, and Vocal Cadence; altering one changes the acoustic decibel rating.' },
      { id: 'c', text: 'English spelling, Latin root origin, Font style, Ink density, and Paper spacing.' },
      { id: 'd', text: 'Left hand dominance, Right foot balance, Eye blinking speed, Finger warmth, and Elbow flexion.' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'Like phonemes in spoken spoken languages, ASL signs are constructed from five core parameters: Handshape, Orientation of palm, Location, Movement, and Expression (Non-Manual Markers / Facial Grammar). Changing one parameter creates a "minimal pair" with a completely different meaning (e.g., SUMMER on the forehead vs UGLY on the nose vs DRY on the chin).',
      textbookExcerpt: 'ASL Linguistics Core: "William Stokoe proved ASL is a genuine rule-governed natural language with phonology. The 5 parameters (HOLME) are Handshape, Orientation, Location, Movement, and Non-Manual Signals."',
      whyCorrect: 'Option A correctly lists all five linguistic parameters of ASL phonology.',
      distractorBreakdown: {
        b: 'Incorrect. These are acoustic properties of spoken language, not visual-gestural parameters.',
        c: 'Incorrect. ASL is an independent language with its own syntax, not a code or font for written English.',
        d: 'Incorrect. Eye blinks and foot balance are not phonological parameters of ASL lexical signs.'
      },
      keyTakeaway: 'The 5 parameters of ASL: Handshape, Orientation, Location, Movement, Non-manual expression (HOLME).'
    },
    defaultMnemonic: {
      phrase: 'H - O - L - M - E',
      acronymBreakdown: [
        'H - Handshape',
        'O - Orientation of palm',
        'L - Location on body/space',
        'M - Movement path',
        'E - Expression (Non-manual markers)'
      ],
      explanation: 'Remember "HOLME" (Home): Every sign lives in a HOLME of five parameters.'
    }
  },

  // ==================== COLLEGE ALGEBRA ====================
  {
    id: 'alg-01',
    subjectId: 'college-algebra',
    chapter: 'Ch 2: Linear and Quadratic Equations',
    textbookRef: 'OpenStax College Algebra 2e, Ch. 2.5: Quadratic Equations',
    question: 'For the quadratic equation 2x² - 5x + 3 = 0, what are the solutions for x, and what does the value of its discriminant indicate about its roots?',
    options: [
      { id: 'a', text: 'x = 1 and x = 3/2; discriminant Δ = 1 > 0, indicating two distinct real rational roots.' },
      { id: 'b', text: 'x = -1 and x = -3/2; discriminant Δ = -23, indicating two complex conjugate roots.' },
      { id: 'c', text: 'x = 2 and x = 3; discriminant Δ = 0, indicating exactly one repeated real root.' },
      { id: 'd', text: 'x = 5/4 ± √7/4; discriminant Δ = 7, indicating two irrational roots.' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'For ax² + bx + c = 0, the discriminant is Δ = b² - 4ac. If Δ > 0 and a perfect square, there are two distinct rational roots. The roots are found via factoring or the quadratic formula: x = (-b ± √Δ) / 2a.',
      textbookExcerpt: 'OpenStax College Algebra 2e 2.5: "The discriminant b² - 4ac reveals the nature of the roots: if Δ > 0, there are two unequal real roots... Here a=2, b=-5, c=3: Δ = (-5)² - 4(2)(3) = 25 - 24 = 1."',
      whyCorrect: 'Δ = 25 - 24 = 1. Then x = (-(-5) ± √1) / (2 × 2) = (5 ± 1) / 4. Thus x = 6/4 = 3/2 and x = 4/4 = 1.',
      distractorBreakdown: {
        b: 'Incorrect. Signs are inverted, and discriminant calculation mistakenly subtracted rather than following b² - 4ac.',
        c: 'Incorrect. Discriminant is 1, not 0, so roots are distinct, not repeated.',
        d: 'Incorrect. The discriminant is 1, which has an integer square root (1), not 7.'
      },
      keyTakeaway: 'Discriminant Δ = b² - 4ac. When Δ = 1 (positive perfect square), roots are real, distinct, and rational.'
    },
    defaultMnemonic: {
      phrase: 'B SQUARED MINUS 4AC TELLS THE ROOTS',
      acronymBreakdown: [
        'Positive (>0): 2 real roots',
        'Zero (=0): 1 repeated root',
        'Negative (<0): 2 complex imaginary roots'
      ],
      explanation: 'Check the discriminant sign first to immediately eliminate impossible answer choices.'
    }
  },

  // ==================== CALCULUS ====================
  {
    id: 'calc-01',
    subjectId: 'calculus',
    chapter: 'Ch 3: Derivatives: Rules, Product, Quotient & Chain Rule',
    textbookRef: 'OpenStax Calculus Vol 1, Ch. 3.6: The Chain Rule',
    question: 'Find the first derivative f\'(x) of the function f(x) = ln(3x² + 4x + 1) with respect to x.',
    codeSnippet: 'f(x) = ln(3x² + 4x + 1)\nf\'(x) = ?',
    options: [
      { id: 'a', text: 'f\'(x) = (6x + 4) / (3x² + 4x + 1)' },
      { id: 'b', text: 'f\'(x) = 1 / (6x + 4)' },
      { id: 'c', text: 'f\'(x) = (6x + 4) · ln(3x² + 4x + 1)' },
      { id: 'd', text: 'f\'(x) = (3x² + 4x + 1) / (6x + 4)' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'By the Chain Rule, the derivative of the natural logarithm composite function d/dx[ln(u)] is u\' / u, where u = 3x² + 4x + 1 and u\' = d/dx[3x² + 4x + 1] = 6x + 4.',
      textbookExcerpt: 'OpenStax Calculus Vol 1 3.6: "If u is a differentiable function of x, then d/dx [ln u] = (1/u) · (du/dx) = u\' / u."',
      whyCorrect: 'Option A places the inner derivative (6x + 4) in the numerator over the original inner function (3x² + 4x + 1) in the denominator.',
      distractorBreakdown: {
        b: 'Incorrect. Took reciprocal of derivative rather than u\' / u.',
        c: 'Incorrect. Multiplied inner derivative by original log expression instead of applying reciprocal rule.',
        d: 'Incorrect. Inverted numerator and denominator.'
      },
      keyTakeaway: 'For any natural logarithm: d/dx [ln(u)] = u\' / u (derivative of the inside over the inside).'
    },
    defaultMnemonic: {
      phrase: 'DERIVATIVE OVER ORIGINAL (u\' over u)',
      acronymBreakdown: [
        'Top: Derivative of the inside',
        'Bottom: The original inside',
        'Log vanishes'
      ],
      explanation: 'Differentiating ln(u) always leaves a simple rational fraction: derivative inside / original inside.'
    }
  },

  // ==================== STATISTICS ====================
  {
    id: 'stat-01',
    subjectId: 'statistics',
    chapter: 'Ch 6: The Normal Distribution & Empirical Rule (68-95-99.7)',
    textbookRef: 'OpenStax Introductory Statistics, Ch. 6.1: The Standard Normal Distribution',
    question: 'A university statistics exam has scores normally distributed with a mean (μ) of 75 and a standard deviation (σ) of 5. By the Empirical Rule (68-95-99.7 Rule), approximately what percentage of students scored between 65 and 85?',
    options: [
      { id: 'a', text: 'Approximately 95%' },
      { id: 'b', text: 'Approximately 68%' },
      { id: 'c', text: 'Approximately 99.7%' },
      { id: 'd', text: 'Exactly 50%' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'The Empirical Rule dictates that for bell-shaped, normal distributions: ~68% of data falls within 1 standard deviation (μ ± 1σ), ~95% falls within 2 standard deviations (μ ± 2σ), and ~99.7% falls within 3 standard deviations (μ ± 3σ).',
      textbookExcerpt: 'OpenStax Introductory Statistics 6.1: "The Empirical Rule states that for data with a normal distribution: 68% within μ ± 1σ; 95% within μ ± 2σ; 99.7% within μ ± 3σ."',
      whyCorrect: 'Here μ = 75 and σ = 5. μ - 2σ = 75 - 10 = 65. μ + 2σ = 75 + 10 = 85. The interval [65, 85] represents exactly 2 standard deviations from the mean, which covers ~95% of observations.',
      distractorBreakdown: {
        b: 'Incorrect. 68% covers μ ± 1σ, which corresponds to the interval [70, 80].',
        c: 'Incorrect. 99.7% covers μ ± 3σ, which corresponds to the interval [60, 90].',
        d: 'Incorrect. 50% represents data on one side of the mean, not an interval symmetric about the center.'
      },
      keyTakeaway: 'Empirical Rule: 1σ = 68%, 2σ = 95%, 3σ = 99.7%.'
    },
    defaultMnemonic: {
      phrase: '68 - 95 - 99.7 (ONE, TWO, THREE)',
      acronymBreakdown: [
        '1 standard deviation = 68%',
        '2 standard deviations = 95%',
        '3 standard deviations = 99.7%'
      ],
      explanation: 'Count the steps from mean: 65 and 85 are 2 standard deviations (2 × 5 = 10) away, pointing directly to 95%.'
    }
  },

  // ==================== PYTHON CODING ====================
  {
    id: 'py-01',
    subjectId: 'python-coding',
    chapter: 'Ch 3: List Comprehensions, Lambda Functions, and Generators',
    textbookRef: 'Python 3 Collegiate Core Standards, Built-in Comprehensions',
    question: 'What is the exact output of evaluating the following Python list comprehension?',
    codeSnippet: 'nums = [1, 2, 3, 4, 5, 6]\nresult = [x**2 for x in nums if x % 2 == 0]\nprint(result)',
    options: [
      { id: 'a', text: '[4, 16, 36]' },
      { id: 'b', text: '[1, 9, 25]' },
      { id: 'c', text: '[2, 4, 6]' },
      { id: 'd', text: '[1, 4, 9, 16, 25, 36]' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'A list comprehension with a conditional `[expr for item in iterable if condition]` evaluates only items satisfying the boolean test. `x % 2 == 0` filters for even numbers: [2, 4, 6]. The expression `x**2` then squares each filtered number: 2²=4, 4²=16, 6²=36.',
      textbookExcerpt: 'Python Official Documentation & University Curriculum: "A list comprehension consists of brackets containing an expression followed by a for clause, then zero or more for or if clauses. The result will be a new list resulting from evaluating the expression in the context of the for and if clauses."',
      whyCorrect: 'Even numbers in nums are 2, 4, 6. Their squares are 4, 16, 36.',
      distractorBreakdown: {
        b: 'Incorrect. That squares the odd numbers ([1, 3, 5]), which would result from `if x % 2 != 0`.',
        c: 'Incorrect. Filtered even numbers without applying the squaring transformation `x**2`.',
        d: 'Incorrect. Squared all elements without applying the `if x % 2 == 0` filter.'
      },
      keyTakeaway: 'In `[expr for var in seq if cond]`, Python filters by `cond` first, then computes `expr` on the survivors.'
    },
    defaultMnemonic: {
      phrase: 'FILTER FIRST, TRANSFORM SECOND',
      acronymBreakdown: [
        '1. Iterable looped (for x in nums)',
        '2. Filter checked (if x % 2 == 0)',
        '3. Expression computed (x**2)'
      ],
      explanation: 'Read comprehensions right-to-left for logic flow: loop, filter condition, then evaluate output.'
    }
  },

  // ==================== R LANGUAGE ====================
  {
    id: 'r-01',
    subjectId: 'r-language',
    chapter: 'Ch 1: Vector Basics, Indexing, and Vectorized Operations',
    textbookRef: 'R for Data Science / University Core, Ch. 3: Vectors & Subsetting',
    question: 'In R, what is the resulting value of the vector operation executed below?',
    codeSnippet: 'x <- c(10, 20, 30, 40)\ny <- c(1, 2)\nz <- x + y\nz[3]',
    options: [
      { id: 'a', text: '31' },
      { id: 'b', text: '32' },
      { id: 'c', text: '11' },
      { id: 'd', text: 'NA (Out of bounds error)' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'R features vector recycling and 1-based indexing! When adding two vectors of unequal length, R recycles the shorter vector `y` to match `x`. `y` becomes c(1, 2, 1, 2). Thus x + y = c(10+1, 20+2, 30+1, 40+2) = c(11, 22, 31, 42). Since R uses 1-based indexing, z[3] refers to the 3rd element: 31.',
      textbookExcerpt: 'R Language Definition: "If two vectors are of unequal length, the elements of the shorter one are recycled to the length of the longer. In R, arrays and vectors are 1-indexed."',
      whyCorrect: 'z[3] is the 3rd element. x[3] is 30, and y recycles to element 1 (since 3 mod 2 = 1). 30 + 1 = 31.',
      distractorBreakdown: {
        b: 'Incorrect. Added 2 instead of recycling element 1.',
        c: 'Incorrect. 11 is z[1] (10 + 1), not z[3].',
        d: 'Incorrect. R allows indexing within length, and length of z is 4.'
      },
      keyTakeaway: 'R indices start at 1, and arithmetic on unequal vectors recycles the shorter vector.'
    },
    defaultMnemonic: {
      phrase: 'R STARTS AT 1, RECYCLES SHORT RUNS',
      acronymBreakdown: [
        'R index = 1-based (unlike Python 0-based)',
        'Recycling = Repeats shorter vector until equal'
      ],
      explanation: 'Never make the 0-index mistake in R: z[1] is the first element, z[3] is the third.'
    }
  },

  // ==================== WEB DEV: HTML/CSS/JS ====================
  {
    id: 'web-01',
    subjectId: 'web-dev',
    chapter: 'Ch 2: CSS Box Model, Specificity, and Cascading Rules',
    textbookRef: 'MDN Web Docs / W3C Core Standards, CSS Box Model',
    question: 'An HTML element has `box-sizing: content-box; width: 200px; padding: 20px; border: 5px solid black; margin: 15px;`. What is the total rendered width of this element in the browser viewport?',
    codeSnippet: '.box {\n  box-sizing: content-box;\n  width: 200px;\n  padding: 20px;\n  border: 5px solid black;\n  margin: 15px;\n}',
    options: [
      { id: 'a', text: '250px (content + padding left/right + border left/right)' },
      { id: 'b', text: '200px (padding and border are absorbed inside width)' },
      { id: 'c', text: '280px (margin is added into the element width calculation)' },
      { id: 'd', text: '225px (only one side of padding and border is counted)' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'Under the default CSS standard `box-sizing: content-box`, the specified `width` applies ONLY to the content area. Padding and border are added outside the width: Total Width = width (200) + padding-left (20) + padding-right (20) + border-left (5) + border-right (5) = 250px. Margins occupy space around the element, but do not contribute to the element\'s rendered box dimensions.',
      textbookExcerpt: 'MDN Web Docs: "With content-box, width gives you the width of the content box. Any padding and border are added to that width. Margin creates empty space outside the border."',
      whyCorrect: '200px + 20px + 20px + 5px + 5px = 250px.',
      distractorBreakdown: {
        b: 'Incorrect. That would be true under `box-sizing: border-box`, but this element explicitly has `content-box`.',
        c: 'Incorrect. Margin is external spacing; it is never included in the element box width.',
        d: 'Incorrect. Padding and borders exist on both left and right edges.'
      },
      keyTakeaway: 'content-box: Total width = width + 2(padding) + 2(border). border-box: Total width = width.'
    },
    defaultMnemonic: {
      phrase: 'CONTENT-BOX EXPANDS OUTWARD',
      acronymBreakdown: [
        'C - Content size given',
        'P - Padding pushed outside (+ left & right)',
        'B - Border pushed outside (+ left & right)',
        'Total = Content + Padding(x2) + Border(x2)'
      ],
      explanation: 'Content-box adds on top of width; border-box clamps everything inside width.'
    }
  },

  // ==================== MICROECONOMICS ====================
  {
    id: 'micro-01',
    subjectId: 'microeconomics',
    chapter: 'Ch 5: Elasticity of Demand and Supply',
    textbookRef: 'OpenStax Principles of Microeconomics 3e, Ch. 5.1: Price Elasticity of Demand',
    question: 'When the price of a textbook increases from $100 to $120, the quantity demanded drops from 1,000 units to 800 units. Using the Midpoint (Arc) Method for price elasticity of demand (Ed), what is the elasticity coefficient, and is demand elastic, inelastic, or unitary?',
    options: [
      { id: 'a', text: 'Ed ≈ 1.22; demand is price elastic (|Ed| > 1).' },
      { id: 'b', text: 'Ed ≈ 0.82; demand is price inelastic (|Ed| < 1).' },
      { id: 'c', text: 'Ed = 1.00; demand is unit elastic (|Ed| = 1).' },
      { id: 'd', text: 'Ed = 2.50; demand is perfectly elastic.' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'The Midpoint Method calculates percentage changes relative to the average: %ΔQ = (Q2 - Q1) / [(Q1 + Q2) / 2] = (800 - 1000) / 900 = -200 / 900 = -0.2222 (-22.2%). %ΔP = (P2 - P1) / [(P1 + P2) / 2] = (120 - 100) / 110 = 20 / 110 = 0.1818 (18.2%). Ed = | -0.2222 / 0.1818 | ≈ 1.22. Because |Ed| > 1, demand is elastic.',
      textbookExcerpt: 'OpenStax Principles of Microeconomics 3e 5.1: "The midpoint method calculates percentage change using the average of initial and final values as the base... If the absolute value of elasticity is greater than 1, demand is elastic, meaning consumers are relatively responsive to price changes."',
      whyCorrect: '22.22% / 18.18% ≈ 1.22, which is > 1 (elastic).',
      distractorBreakdown: {
        b: 'Incorrect. Inverted the ratio (%ΔP / %ΔQ instead of %ΔQ / %ΔP).',
        c: 'Incorrect. %ΔQ does not equal %ΔP.',
        d: 'Incorrect. Calculation error; does not match midpoint formulas.'
      },
      keyTakeaway: 'Midpoint Elasticity = (%ΔQ / %ΔP). If |Ed| > 1, demand is elastic (consumers respond strongly to price).'
    },
    defaultMnemonic: {
      phrase: 'Q OVER P, GREATER THAN ONE IS ELASTIC',
      acronymBreakdown: [
        'Quantity on top (ΔQ / Avg Q)',
        'Price on bottom (ΔP / Avg P)',
        '> 1 = Elastic (stretchy response)',
        '< 1 = Inelastic (rigid response)'
      ],
      explanation: 'Always put Quantity first (Q comes before P in alphabet, or "Quantity over Price").'
    }
  },

  // ==================== MACROECONOMICS ====================
  {
    id: 'macro-01',
    subjectId: 'macroeconomics',
    chapter: 'Ch 6: The Macroeconomic Perspective and GDP (C+I+G+NX)',
    textbookRef: 'OpenStax Principles of Macroeconomics 3e, Ch. 6.2: Measuring the Size of the Economy: Gross Domestic Product',
    question: 'In the national income expenditure approach, what are the four constituent components of a nation\'s Gross Domestic Product (GDP)?',
    options: [
      { id: 'a', text: 'GDP = C + I + G + (X - M) [Consumption + Investment + Government Spending + Net Exports]' },
      { id: 'b', text: 'GDP = Wages + Rent + Interest + Corporate Profits' },
      { id: 'c', text: 'GDP = Money Supply (M2) × Velocity of Money (V)' },
      { id: 'd', text: 'GDP = Taxes Collected - Government Entitlements - National Debt' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'The expenditure approach measures total spending on all final domestic goods and services: Consumption (C) by households, Investment (I) by businesses in capital/inventory/housing, Government purchases (G), and Net Exports (NX = Exports [X] minus Imports [M]).',
      textbookExcerpt: 'OpenStax Principles of Macroeconomics 3e 6.2: "GDP based on what is purchased can be measured as: GDP = Consumption + Investment + Government + Net Exports (X - M)."',
      whyCorrect: 'Option A is the canonical expenditure formula for national economic accounting.',
      distractorBreakdown: {
        b: 'Incorrect. That represents the Income Approach (GDI), not the primary expenditure model.',
        c: 'Incorrect. That is the Equation of Exchange (M × V = P × Q) from monetary theory.',
        d: 'Incorrect. This relates to fiscal budget balance, not gross economic output.'
      },
      keyTakeaway: 'GDP = C + I + G + NX (Consumption, Business Investment, Government Purchases, Net Exports).'
    },
    defaultMnemonic: {
      phrase: 'C + I + G + NX (CAN I GET NEXT?)',
      acronymBreakdown: [
        'C - Consumer spending (~70% of US GDP)',
        'I - Business investment',
        'G - Government expenditure',
        'NX - Net exports (Exports minus Imports)'
      ],
      explanation: 'Remember: "Can I Get Next?" = C + I + G + NX.'
    }
  },

  // ==================== FINANCIAL ACCOUNTING ====================
  {
    id: 'acc-01',
    subjectId: 'accounting',
    chapter: 'Ch 2: Analyzing and Recording Transactions (Debits & Credits)',
    textbookRef: 'OpenStax Principles of Accounting Vol 1, Ch. 2.2: The Accounting Equation and Debits/Credits',
    question: 'A corporation purchases $15,000 of office equipment on credit (promising to pay within 60 days). How does this transaction affect the fundamental accounting equation (Assets = Liabilities + Owner\'s Equity), and what is the proper journal entry?',
    options: [
      { id: 'a', text: 'Assets increase by $15,000 (Equipment); Liabilities increase by $15,000 (Accounts Payable). Debit: Equipment $15,000; Credit: Accounts Payable $15,000.' },
      { id: 'b', text: 'Assets decrease by $15,000 (Cash); Equity increases by $15,000 (Retained Earnings). Debit: Cash $15,000; Credit: Equity $15,000.' },
      { id: 'c', text: 'Liabilities increase by $15,000; Owner\'s Equity decreases by $15,000. Debit: Expense $15,000; Credit: Cash $15,000.' },
      { id: 'd', text: 'Assets increase by $15,000; Assets decrease by $15,000 with zero net change. Debit: Accounts Payable $15,000; Credit: Equipment $15,000.' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'Assets = Liabilities + Equity. Purchasing equipment (an asset) on credit creates an obligation (liability) known as Accounts Payable. Both sides of the equation increase by $15,000, maintaining balance. Assets have a normal debit balance (debited to increase), and liabilities have a normal credit balance (credited to increase).',
      textbookExcerpt: 'OpenStax Principles of Accounting Vol 1 2.2: "When an asset is acquired on account, the asset account increases with a debit, and the liability account (Accounts Payable) increases with a credit. The fundamental equation remains balanced: +$15,000 (Assets) = +$15,000 (Liabilities)."',
      whyCorrect: 'Debit increases Equipment (Asset), Credit increases Accounts Payable (Liability).',
      distractorBreakdown: {
        b: 'Incorrect. No cash changed hands (purchased on credit), and equipment is capitalized, not expensed to equity.',
        c: 'Incorrect. Equipment is an asset with multi-year useful life, not an immediate operating expense.',
        d: 'Incorrect. Reverses debits and credits and misstates accounts.'
      },
      keyTakeaway: 'Assets = Liabilities + Equity. Debit increases Assets and Expenses; Credit increases Liabilities, Equity, and Revenue.'
    },
    defaultMnemonic: {
      phrase: 'DEALER: DEBITS & CREDITS',
      acronymBreakdown: [
        'DEA (Debit to increase): Dividends, Expenses, Assets',
        'LER (Credit to increase): Liabilities, Equity, Revenue'
      ],
      explanation: 'Remember DEALER: The first three (D-E-A) increase with Debits; the last three (L-E-R) increase with Credits.'
    }
  },

  // ==================== ART HISTORY ====================
  {
    id: 'art-01',
    subjectId: 'art-history',
    chapter: 'Ch 23: Baroque Art: Dramatic Tenebrism and Caravaggio',
    textbookRef: 'Gardner\'s Art Through the Ages / OpenStax, Ch. 23: The Baroque Era in Italy',
    question: 'Which visual technique, characterized by violent, theatrical contrasts between pitch-black darks and blinding spotlights of light, was pioneered by Italian Baroque master Caravaggio in masterpieces like "The Calling of Saint Matthew"?',
    options: [
      { id: 'a', text: 'Tenebrism (from Italian \'tenebroso\', dark or shadowy)' },
      { id: 'b', text: 'Sfumato (smoky, imperceptible blending of tones without harsh outlines)' },
      { id: 'c', text: 'Impasto (thick, heavily textured layers of undiluted oil paint)' },
      { id: 'd', text: 'Fresco secco (painting onto dried lime plaster with tempera)' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'Caravaggio revolutionized Western painting during the Baroque era with tenebrism (extreme chiaroscuro), in which dramatic, theatrical shafts of direct light pierce pitch-black, shadowy backgrounds to heighten divine revelation and emotional intensity.',
      textbookExcerpt: 'Gardner\'s Art Through the Ages 23: "Caravaggio\'s use of tenebrism—the \'dark manner\'—plunged whole scenes into shadowy gloom, illuminated only by a single beam of dramatic raking light, creating profound emotional and psychological tension."',
      whyCorrect: 'Option A is the definitive art historical term for Caravaggio\'s trademark style.',
      distractorBreakdown: {
        b: 'Incorrect. Sfumato was Leonardo da Vinci\'s technique in the High Renaissance (e.g. Mona Lisa).',
        c: 'Incorrect. Impasto is thick paint application characteristic of Rembrandt or Van Gogh.',
        d: 'Incorrect. Fresco secco is a medium/surface application, not a lighting technique.'
      },
      keyTakeaway: 'Tenebrism = Extreme theatrical contrast between impenetrable shadows and bright spotlighting (Caravaggio).'
    },
    defaultMnemonic: {
      phrase: 'TENEBRISM = TOTAL THEATRICAL TERROR',
      acronymBreakdown: [
        'T - Tenebrism',
        'E - Extreme contrast',
        'N - Nighttime darkness surrounding the subject',
        'E - Emotional spotlight'
      ],
      explanation: 'Tenebrous means dark and shadowy, like darkness with a spotlight beamed onto the canvas.'
    }
  },

  // ==================== U.S. FEDERAL GOVERNMENT ====================
  {
    id: 'gov-01',
    subjectId: 'us-government',
    chapter: 'Ch 13: The Courts: Judicial Review and Marbury v. Madison',
    textbookRef: 'OpenStax American Government 3e, Ch. 13.1: The Judicial System and Judicial Review',
    question: 'In the landmark 1803 Supreme Court case Marbury v. Madison, what foundational constitutional doctrine did Chief Justice John Marshall establish for the judicial branch?',
    options: [
      { id: 'a', text: 'The power of Judicial Review: the authority of federal courts to declare legislative and executive acts unconstitutional.' },
      { id: 'b', text: 'The Incorporation Doctrine: applying the Bill of Rights to state governments through the 14th Amendment.' },
      { id: 'c', text: 'Executive Privilege: the right of the President to withhold military and diplomatic communications.' },
      { id: 'd', text: 'The Commerce Clause doctrine permitting federal regulation of purely intrastate manufacture.' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'Chief Justice John Marshall declared Section 13 of the Judiciary Act of 1789 unconstitutional, establishing the Supreme Court\'s authority as the ultimate arbiter of the Constitution with the power of judicial review.',
      textbookExcerpt: 'OpenStax American Government 3e 13.1: "In Marbury v. Madison (1803), Chief Justice John Marshall asserted the Supreme Court\'s power of judicial review—the power to declare laws passed by Congress unconstitutional. Marshall stated: \'It is emphatically the province and duty of the judicial department to say what the law is.\'"',
      whyCorrect: 'Option A is the historic constitutional holding of Marbury v. Madison.',
      distractorBreakdown: {
        b: 'Incorrect. The incorporation doctrine arose in the 20th century under the 14th Amendment\'s Due Process clause (e.g. Gitlow v. New York).',
        c: 'Incorrect. Executive privilege was clarified in U.S. v. Nixon (1974).',
        d: 'Incorrect. Commerce Clause expansion occurred in Gibbons v. Ogden (1824) and Wickard v. Filburn (1942).'
      },
      keyTakeaway: 'Marbury v. Madison (1803) = Established Judicial Review.'
    },
    defaultMnemonic: {
      phrase: 'MARBURY MAKES JUDGES MIGHTY',
      acronymBreakdown: [
        'M - Marbury v. Madison (1803)',
        'M - Marshall Chief Justice',
        'J - Judicial Review established'
      ],
      explanation: 'Marbury cemented the courts as equal co-stars: "say what the law is".'
    }
  },

  // ==================== TEXAS STATE & LOCAL GOVERNMENT ====================
  {
    id: 'tx-01',
    subjectId: 'tx-government',
    chapter: 'Ch 3: The Texas Legislature: Biennial 140-Day Regular Sessions',
    textbookRef: 'Texas Government Core Standards, Ch. 3: The Texas Legislative Branch',
    question: 'Unlike the United States Congress which meets in continuous annual sessions, how often and for how long does the Texas Legislature meet in regular session under the Texas Constitution of 1876?',
    options: [
      { id: 'a', text: 'Biennially (once every two years) in odd-numbered years, for a strict maximum of 140 calendar days.' },
      { id: 'b', text: 'Annually, meeting for 300 calendar days with automatic winter recesses.' },
      { id: 'c', text: 'Quarterly, meeting for two weeks every three months in Austin.' },
      { id: 'd', text: 'Continuously year-round as full-time professional salaried legislators.' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'Reflecting post-Reconstruction agrarian distrust of activist government, the Texas Constitution of 1876 created a "citizen legislature." It convenes on the second Tuesday in January of odd-numbered years for precisely 140 calendar days. Only the Governor can call special sessions, which are limited to 30 days and restricted to the Governor\'s agenda.',
      textbookExcerpt: 'Texas Government Standards: "The Texas Constitution mandates biennial regular sessions beginning in January of odd years, lasting no longer than 140 days. The part-time legislature reflects the state\'s traditionalistic-individualistic political culture and desire for limited government."',
      whyCorrect: 'Option A details the exact constitutional requirement: biennial, odd years, 140 days.',
      distractorBreakdown: {
        b: 'Incorrect. Texas does not meet annually for regular sessions.',
        c: 'Incorrect. Quarterly sessions are not used in Texas legislative governance.',
        d: 'Incorrect. Texas maintains a part-time citizen legislature with modest $7,200 annual constitutionally fixed pay.'
      },
      keyTakeaway: 'Texas Legislature = Biennial sessions in odd-numbered years, strictly 140 calendar days.'
    },
    defaultMnemonic: {
      phrase: '140 DAYS EVERY 2 YEARS (ODD YEARS ONLY)',
      acronymBreakdown: [
        'Biennial = 2 years',
        'Odd years (2025, 2027, etc.)',
        '140 days clock running from day one'
      ],
      explanation: 'Texans say: "The legislature should meet for 140 days every two years, and then go home!"'
    }
  },
  {
    id: 'tx-02',
    subjectId: 'tx-government',
    chapter: 'Ch 4: The Texas Plural Executive: Governor, Lt. Governor, Attorney General',
    textbookRef: 'Texas Government Core Standards, Ch. 4: The Plural Executive',
    question: 'How does the Texas "Plural Executive" system structurally limit the power of the Texas Governor compared to the U.S. President?',
    options: [
      { id: 'a', text: 'Major executive officers (Lieutenant Governor, Attorney General, Comptroller, Land Commissioner) are independently elected by voters, not appointed by or subservient to the Governor.' },
      { id: 'b', text: 'The Governor must obtain unanimous consent from the Texas Supreme Court before issuing any executive proclamations.' },
      { id: 'c', text: 'The Governor cannot veto any bill passed by a simple majority of the Legislature.' },
      { id: 'd', text: 'The office of Governor rotates alphabetically among all 254 county judges every six months.' }
    ],
    correctOptionId: 'a',
    explanation: {
      coreConcept: 'The 1876 Texas Constitution fragmented executive authority across independently elected officials to prevent a concentration of power (in reaction to Reconstruction Governor E.J. Davis). The Lieutenant Governor, Attorney General, Comptroller of Public Accounts, and Land Commissioner answer directly to voters, often belonging to rival factions or parties.',
      textbookExcerpt: 'Texas Government Standards: "The Texas Constitution disperses executive power among six independently elected statewide officers and one appointed Secretary of State. This plural executive intentionally weakens the Governor\'s administrative control."',
      whyCorrect: 'Option A accurately describes the constitutional architecture of the Texas Plural Executive.',
      distractorBreakdown: {
        b: 'Incorrect. Judicial consent is not required for gubernatorial proclamations.',
        c: 'Incorrect. The Texas Governor possesses a powerful regular veto and line-item veto on appropriations.',
        d: 'Incorrect. The Governor is elected statewide to a 4-year term without term limits.'
      },
      keyTakeaway: 'Texas Plural Executive: Key executive officials are independently elected by voters, dispersing power away from the Governor.'
    },
    defaultMnemonic: {
      phrase: 'PLURAL = POWER SHARED AT THE BALLOT BOX',
      acronymBreakdown: [
        'President appoints his cabinet (Unitary)',
        'Texas voters elect the cabinet (Plural)',
        'Governor cannot fire the AG or Lt. Governor'
      ],
      explanation: 'In Texas, executive power is split into pieces so no single official holds absolute sway.'
    }
  }
];

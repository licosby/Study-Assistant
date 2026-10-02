import React, { useState } from 'react';
import { 
  Dna, 
  Layers, 
  ZoomIn, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw,
  Scissors,
  Eye,
  Heart,
  Flower2,
  Activity,
  Microscope,
  BookOpen
} from 'lucide-react';

export type SpecimenId = 'animal-cell' | 'plant-cell' | 'bacterium' | 'mammalian-heart' | 'angiosperm-flower';

interface OrganelleOrOrgan {
  id: string;
  name: string;
  category: string;
  clepConcept: string;
  biochemicalFunction: string;
  openStaxCitation: string;
  color: string;
  highlightCoordinates: { cx: number; cy: number; r?: number; d?: string };
}

interface SpecimenData {
  id: SpecimenId;
  title: string;
  subtitle: string;
  category: 'Cell Biology' | 'Organ Dissection';
  modelType: 'cell' | 'dissection';
  magnifications?: string[];
  dissectionLayers?: string[];
  items: OrganelleOrOrgan[];
  quiz: {
    question: string;
    targetId: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

const SPECIMENS: Record<SpecimenId, SpecimenData> = {
  'animal-cell': {
    id: 'animal-cell',
    title: 'Eukaryotic Animal Cell (Ultrastructure)',
    subtitle: 'OpenStax Biology 2e, Ch. 4: Cell Structure and Function',
    category: 'Cell Biology',
    modelType: 'cell',
    magnifications: ['100x Cell Morphology', '400x Organelle View', '1000x TEM Ultrastructure'],
    items: [
      {
        id: 'nucleus',
        name: 'Nucleus & Nucleolus',
        category: 'Genetic Control',
        clepConcept: 'Double-membrane nuclear envelope with pores; site of DNA transcription and ribosome biogenesis in nucleolus.',
        biochemicalFunction: 'Stores genomic chromatin. Nucleolus synthesizes ribosomal RNA (rRNA) and assembles ribosomal subunits.',
        openStaxCitation: 'OpenStax Biology 4.3: "The nucleus houses the cell’s DNA in the form of chromatin and directs the synthesis of ribosomes and proteins."',
        color: '#4338CA',
        highlightCoordinates: { cx: 200, cy: 190, r: 46 }
      },
      {
        id: 'mitochondria',
        name: 'Mitochondria (Powerhouse)',
        category: 'Bioenergetics',
        clepConcept: 'Endosymbiotic origin (double membrane, circular mtDNA, 70S ribosomes). Primary site of Krebs cycle and oxidative phosphorylation.',
        biochemicalFunction: 'Generates ATP via chemiosmosis and the electrochemical proton gradient across cristae membranes.',
        openStaxCitation: 'OpenStax Biology 4.3: "Mitochondria are often called the ‘powerhouses’ of a cell because they are responsible for making adenosine triphosphate (ATP)."',
        color: '#DC2626',
        highlightCoordinates: { cx: 120, cy: 260, r: 26 }
      },
      {
        id: 'rough-er',
        name: 'Rough Endoplasmic Reticulum (RER)',
        category: 'Protein Synthesis',
        clepConcept: 'Studded with ribosomes. Synthesizes proteins destined for membranes, lysosomes, or extracellular export.',
        biochemicalFunction: 'Polypeptide folding, initial glycosylation, and vesicle packaging toward the Golgi apparatus.',
        openStaxCitation: 'OpenStax Biology 4.4: "Ribosomes attached to the cytoplasmic surface of the RER synthesize proteins into the lumen."',
        color: '#2563EB',
        highlightCoordinates: { cx: 270, cy: 170, r: 30 }
      },
      {
        id: 'golgi',
        name: 'Golgi Apparatus',
        category: 'Sorting & Packaging',
        clepConcept: 'Polarized cisternae (cis-face receiving from ER, trans-face dispatching secretory vesicles).',
        biochemicalFunction: 'Post-translational modification (glycosylation, phosphorylation) and molecular sorting with molecular tags.',
        openStaxCitation: 'OpenStax Biology 4.4: "Lipids and proteins in transport vesicles need to be sorted, packaged, and tagged so they get to the right place."',
        color: '#D97706',
        highlightCoordinates: { cx: 270, cy: 260, r: 28 }
      },
      {
        id: 'lysosome',
        name: 'Lysosome',
        category: 'Cellular Digestion',
        clepConcept: 'Membrane-bound organelle containing acid hydrolases (active at pH ~4.5–5.0).',
        biochemicalFunction: 'Autophagy of worn-out organelles and phagocytic degradation of ingested pathogens.',
        openStaxCitation: 'OpenStax Biology 4.4: "In animal cells, the lysosomes are the cell’s ‘garbage disposal’ using hydrolytic enzymes."',
        color: '#059669',
        highlightCoordinates: { cx: 110, cy: 140, r: 18 }
      },
      {
        id: 'plasma-membrane',
        name: 'Plasma Membrane',
        category: 'Boundary & Transport',
        clepConcept: 'Fluid Mosaic Model (phospholipid bilayer, cholesterol, integral/peripheral proteins, glycolipids).',
        biochemicalFunction: 'Selectively permeable barrier governing passive diffusion, active transport, and cell signaling.',
        openStaxCitation: 'OpenStax Biology 5.1: "The plasma membrane defines the cell boundary, managing what goes in and out."',
        color: '#4B5563',
        highlightCoordinates: { cx: 200, cy: 200, r: 140 }
      }
    ],
    quiz: {
      question: 'Which organelle contains its own circular DNA, replicates independently by binary fission, and was acquired via endosymbiosis?',
      targetId: 'mitochondria',
      options: ['Mitochondria', 'Golgi Apparatus', 'Lysosome', 'Rough Endoplasmic Reticulum'],
      correctIndex: 0,
      explanation: 'Mitochondria (and chloroplasts in plants) evolved from engulfed aerobic alphaproteobacteria, evidenced by circular DNA, 70S ribosomes, and double membranes.'
    }
  },
  'plant-cell': {
    id: 'plant-cell',
    title: 'Plant Eukaryotic Cell (Cellulose Wall & Plastids)',
    subtitle: 'OpenStax Biology 2e, Ch. 4.3: Plant Cell Anatomy',
    category: 'Cell Biology',
    modelType: 'cell',
    magnifications: ['100x Turgor State', '400x Chloroplast Flow', '1000x Thylakoid Stacks'],
    items: [
      {
        id: 'cell-wall',
        name: 'Cellulose Cell Wall',
        category: 'Structural Envelope',
        clepConcept: 'Rigid outer layer composed of cellulose microfibrils and pectin; prevents osmotic lysis.',
        biochemicalFunction: 'Maintains turgor pressure against internal hypotonic water potential and structural plant support.',
        openStaxCitation: 'OpenStax Biology 4.3: "The cell wall is a rigid covering that protects the cell, provides structural support, and gives shape to the cell."',
        color: '#15803D',
        highlightCoordinates: { cx: 200, cy: 200, r: 140 }
      },
      {
        id: 'chloroplast',
        name: 'Chloroplast (Plastid)',
        category: 'Photosynthesis',
        clepConcept: 'Double membrane plus internal thylakoids stacked into grana; contains chlorophyll pigments.',
        biochemicalFunction: 'Light reactions in thylakoid membrane (photophosphorylation); Calvin Cycle carbon fixation in stroma.',
        openStaxCitation: 'OpenStax Biology 4.3: "Like mitochondria, chloroplasts have outer and inner membranes, but within the space enclosed by a chloroplast’s inner membrane is a set of interconnected and stacked fluid-filled membrane sacs called thylakoids."',
        color: '#16A34A',
        highlightCoordinates: { cx: 120, cy: 130, r: 28 }
      },
      {
        id: 'central-vacuole',
        name: 'Central Vacuole & Tonoplast',
        category: 'Turgor & Storage',
        clepConcept: 'Occupies up to 90% of plant cell volume; bounded by the tonoplast membrane.',
        biochemicalFunction: 'Maintains hydrostatic turgor pressure; stores water, potassium, enzymes, and secondary metabolites.',
        openStaxCitation: 'OpenStax Biology 4.3: "The central vacuole plays a key role in regulating the cell’s concentration of water in changing environmental conditions."',
        color: '#0284C7',
        highlightCoordinates: { cx: 220, cy: 230, r: 52 }
      },
      {
        id: 'nucleus-plant',
        name: 'Nucleus (Plant)',
        category: 'Genetic Control',
        clepConcept: 'Displaced peripherally against the cell wall by the large central vacuole.',
        biochemicalFunction: 'Contains plant genome and regulates tissue differentiation and developmental signaling.',
        openStaxCitation: 'OpenStax Biology 4.3: "In plant cells, the large central vacuole often pushes the nucleus toward the periphery."',
        color: '#4338CA',
        highlightCoordinates: { cx: 120, cy: 250, r: 30 }
      }
    ],
    quiz: {
      question: 'When a plant wilts due to dehydration, which cellular compartment loses hydrostatic volume, causing loss of turgor pressure?',
      targetId: 'central-vacuole',
      options: ['Central Vacuole', 'Chloroplast', 'Cell Wall', 'Nucleolus'],
      correctIndex: 0,
      explanation: 'The central vacuole loses water to the hypertonic exterior via osmosis, causing plasmolysis and loss of structural turgor pressure.'
    }
  },
  'bacterium': {
    id: 'bacterium',
    title: 'Prokaryotic Bacterium (Ultrastructure)',
    subtitle: 'OpenStax Biology 2e, Ch. 4.2: Prokaryotic Cells',
    category: 'Cell Biology',
    modelType: 'cell',
    magnifications: ['400x Smear', '1000x Oil Immersion', '10000x SEM Surface'],
    items: [
      {
        id: 'nucleoid',
        name: 'Nucleoid Region (Genophore)',
        category: 'Genetic Material',
        clepConcept: 'Non-membrane-bound region containing single circular double-stranded bacterial chromosome.',
        biochemicalFunction: 'Houses essential genomic operons; replicates via Theta replication without histones or nuclear envelope.',
        openStaxCitation: 'OpenStax Biology 4.2: "Prokaryotes lack a nucleus; instead, their circular DNA is concentrated in a region called the nucleoid."',
        color: '#9333EA',
        highlightCoordinates: { cx: 200, cy: 200, r: 42 }
      },
      {
        id: 'plasmid',
        name: 'Plasmid (Extrachromosomal DNA)',
        category: 'Horizontal Gene Transfer',
        clepConcept: 'Small circular autonomously replicating DNA conferring antibiotic resistance (R-factors) or virulence.',
        biochemicalFunction: 'Transferred between bacteria via sex pilus during conjugation.',
        openStaxCitation: 'OpenStax Biology 22.1: "Plasmids carry beneficial accessory genes like antibiotic resistance."',
        color: '#E15B44',
        highlightCoordinates: { cx: 270, cy: 150, r: 14 }
      },
      {
        id: 'peptidoglycan-wall',
        name: 'Peptidoglycan Cell Wall',
        category: 'Cell Envelope',
        clepConcept: 'Repeating polymer of NAG and NAM cross-linked by transpeptidase peptides; Gram-positive (thick) vs Gram-negative (thin + LPS).',
        biochemicalFunction: 'Target of beta-lactam antibiotics (penicillin) which inhibit transpeptidase cross-linking.',
        openStaxCitation: 'OpenStax Biology 4.2: "The bacterial cell wall consists of peptidoglycan, composed of sugar polymers and polypeptide units."',
        color: '#B45309',
        highlightCoordinates: { cx: 200, cy: 200, r: 125 }
      },
      {
        id: 'flagellum',
        name: 'Bacterial Flagellum',
        category: 'Motility',
        clepConcept: 'Composed of flagellin protein; rotated by a rotary basal motor powered by proton-motive force (H⁺ or Na⁺ flux).',
        biochemicalFunction: 'Enables chemotaxis (tumbles vs runs toward chemical attractants).',
        openStaxCitation: 'OpenStax Biology 4.2: "Bacterial flagella act like propellers driven by a rotary proton motor at the cell membrane."',
        color: '#4B5563',
        highlightCoordinates: { cx: 70, cy: 200, r: 20 }
      }
    ],
    quiz: {
      question: 'Which bacterial structure consists of a circular DNA loop separate from the chromosome that can be transferred during bacterial conjugation?',
      targetId: 'plasmid',
      options: ['Plasmid', 'Nucleoid', 'Ribosome', 'Peptidoglycan'],
      correctIndex: 0,
      explanation: 'Plasmids are small, extrachromosomal DNA rings that replicate autonomously and pass antibiotic resistance genes through conjugation.'
    }
  },
  'mammalian-heart': {
    id: 'mammalian-heart',
    title: 'Mammalian Heart 4-Chamber Dissection',
    subtitle: 'OpenStax Anatomy and Physiology 2e, Ch. 19: The Cardiovascular System: The Heart',
    category: 'Organ Dissection',
    modelType: 'dissection',
    dissectionLayers: [
      'Layer 1: Pericardium & Coronary Sulcus (External Surface)',
      'Layer 2: Coronal Section — Right Atrium & Ventricle (Pulmonary Circuit)',
      'Layer 3: Internal Septum & Left Ventricle Myocardium (Systemic Circuit)'
    ],
    items: [
      {
        id: 'right-atrium',
        name: 'Right Atrium (Deoxygenated Input)',
        category: 'Pulmonary Circuit',
        clepConcept: 'Receives deoxygenated venous return from Superior Vena Cava, Inferior Vena Cava, and Coronary Sinus.',
        biochemicalFunction: 'Contains SA node (sinoatrial pacemaker); pumps blood past the tricuspid valve into the right ventricle.',
        openStaxCitation: 'OpenStax A&P 19.1: "The right atrium serves as the receiving chamber for blood returning to the heart from the systemic circulation."',
        color: '#0284C7',
        highlightCoordinates: { cx: 150, cy: 140, r: 35 }
      },
      {
        id: 'right-ventricle',
        name: 'Right Ventricle & Pulmonary Valve',
        category: 'Pulmonary Circuit',
        clepConcept: 'Pumps blood under lower pressure (~25 mmHg) to the lungs via the pulmonary trunk and arteries.',
        biochemicalFunction: 'Pumps deoxygenated blood to alveolar capillary beds for gas exchange.',
        openStaxCitation: 'OpenStax A&P 19.1: "The right ventricle contracts, pushing blood through the pulmonary semilunar valve into the pulmonary trunk."',
        color: '#0369A1',
        highlightCoordinates: { cx: 160, cy: 240, r: 40 }
      },
      {
        id: 'left-atrium',
        name: 'Left Atrium (Oxygenated Return)',
        category: 'Systemic Circuit',
        clepConcept: 'Receives oxygen-rich blood from the four pulmonary veins (2 left, 2 right).',
        biochemicalFunction: 'Passes oxygenated blood past the bicuspid (mitral) valve into the high-pressure left ventricle.',
        openStaxCitation: 'OpenStax A&P 19.1: "The left atrium receives oxygenated blood from the four pulmonary veins."',
        color: '#E11D48',
        highlightCoordinates: { cx: 250, cy: 140, r: 35 }
      },
      {
        id: 'left-ventricle',
        name: 'Left Ventricle (Thick Myocardium)',
        category: 'Systemic Circuit',
        clepConcept: 'Myocardial wall is 3× thicker than right ventricle to overcome systemic systemic vascular resistance (120 mmHg).',
        biochemicalFunction: 'Pumps oxygenated blood through aortic semilunar valve into the aorta to supply brain, kidneys, and systemic tissues.',
        openStaxCitation: 'OpenStax A&P 19.1: "The left ventricle must generate enough pressure to overcome resistance in the long systemic circuit, requiring a much thicker muscular wall."',
        color: '#BE123C',
        highlightCoordinates: { cx: 240, cy: 250, r: 48 }
      },
      {
        id: 'interventricular-septum',
        name: 'Interventricular Septum & Bundle of His',
        category: 'Conduction & Separation',
        clepConcept: 'Thick muscular partition separating oxygenated (left) from deoxygenated (right) ventricular chambers.',
        biochemicalFunction: 'Conducts electrical depolarization from AV node down left and right bundle branches to Purkinje fibers.',
        openStaxCitation: 'OpenStax A&P 19.2: "The interventricular septum separates the ventricles and carries the atrioventricular bundle."',
        color: '#4B5563',
        highlightCoordinates: { cx: 200, cy: 230, r: 24 }
      }
    ],
    quiz: {
      question: 'Why is the myocardial wall of the human left ventricle approximately three times thicker than that of the right ventricle?',
      targetId: 'left-ventricle',
      options: [
        'It must generate high hydrostatic pressure to overcome systemic vascular resistance throughout the entire body.',
        'It receives blood directly from the pulmonary trunk at elevated pulmonary pressure.',
        'It houses the sinoatrial (SA) pacemaker node which requires heavy insulation.',
        'It stores residual glycogen for cardiac anaerobic glycolysis.'
      ],
      correctIndex: 0,
      explanation: 'The right ventricle only pumps through the short, low-resistance pulmonary circuit (~25 mmHg), while the left ventricle must pump through systemic circulation (~120 mmHg).'
    }
  },
  'angiosperm-flower': {
    id: 'angiosperm-flower',
    title: 'Angiosperm Floral Dissection (Reproductive Anatomy)',
    subtitle: 'OpenStax Biology 2e, Ch. 32: Plant Reproduction',
    category: 'Organ Dissection',
    modelType: 'dissection',
    dissectionLayers: [
      'Layer 1: Perianth (Calyx / Sepals & Corolla / Petals)',
      'Layer 2: Androecium (Male: Stamen, Anther, Filament)',
      'Layer 3: Gynoecium / Pistil (Female: Stigma, Style, Ovary, Ovules)'
    ],
    items: [
      {
        id: 'anther',
        name: 'Stamen (Anther & Filament)',
        category: 'Male Reproductive (Androecium)',
        clepConcept: 'Microsporangia in the anther undergo meiosis to produce microspores, which develop into pollen grains (male gametophytes).',
        biochemicalFunction: 'Pollen generation and dispersal via wind, insects, or birds for cross-pollination.',
        openStaxCitation: 'OpenStax Biology 32.1: "The stamen consists of a two-lobed anther supported by a filament. Microspores produced in the anther develop into pollen grains."',
        color: '#EAB308',
        highlightCoordinates: { cx: 130, cy: 160, r: 24 }
      },
      {
        id: 'pistil-stigma',
        name: 'Carpel / Pistil (Stigma & Style)',
        category: 'Female Reproductive (Gynoecium)',
        clepConcept: 'Sticky stigma captures pollen; style provides conduit through which pollen tubes grow down to the ovary.',
        biochemicalFunction: 'Enables double fertilization (one sperm fuses with egg → 2n embryo; second sperm fuses with central cell → 3n endosperm).',
        openStaxCitation: 'OpenStax Biology 32.1: "The gynoecium contains the stigma, style, and ovary. Pollen lands on the sticky stigma."',
        color: '#10B981',
        highlightCoordinates: { cx: 200, cy: 130, r: 28 }
      },
      {
        id: 'ovary',
        name: 'Ovary & Ovules',
        category: 'Female Reproductive (Gynoecium)',
        clepConcept: 'Ovary encloses ovules. After double fertilization, ovules become seeds and the surrounding ovary wall develops into fruit.',
        biochemicalFunction: 'Megasporogenesis, female gametophyte (embryo sac) housing, and seed/fruit maturation.',
        openStaxCitation: 'OpenStax Biology 32.1: "The ovary houses ovules. Following fertilization, the ovary develops into fruit, while the fertilized ovules become seeds."',
        color: '#059669',
        highlightCoordinates: { cx: 200, cy: 220, r: 36 }
      },
      {
        id: 'petals',
        name: 'Petals (Corolla) & Sepals (Calyx)',
        category: 'Non-Reproductive Perianth',
        clepConcept: 'Petals attract biotic pollinators with pigmentation and nectar guides; sepals protect the developing floral bud.',
        biochemicalFunction: 'Pollinator visual attraction and mechanical bud protection.',
        openStaxCitation: 'OpenStax Biology 32.1: "Petals frequently display vivid coloration to attract pollinators, while sepals enclose and protect the unopened bud."',
        color: '#E15B44',
        highlightCoordinates: { cx: 280, cy: 170, r: 35 }
      }
    ],
    quiz: {
      question: 'Following double fertilization in angiosperms, what botanical structures do the ovule and the ovary wall develop into, respectively?',
      targetId: 'ovary',
      options: [
        'The ovule develops into the seed, and the ovary wall develops into the fruit.',
        'The ovule develops into the petal, and the ovary develops into the sepal.',
        'The ovule develops into pollen, and the ovary develops into the stamen.',
        'The ovule develops into the root, and the ovary develops into the cotyledon.'
      ],
      correctIndex: 0,
      explanation: 'In flowering plants, fertilized ovules mature into seeds containing the 2n embryo and 3n endosperm, while the surrounding ovary tissue ripens into fruit.'
    }
  }
};

interface DigitalCellDissectionLabProps {
  initialSpecimenId?: SpecimenId;
  focusOrganelleId?: string;
  className?: string;
  onExploreComplete?: () => void;
}

export const DigitalCellDissectionLab: React.FC<DigitalCellDissectionLabProps> = ({
  initialSpecimenId = 'animal-cell',
  focusOrganelleId,
  className = '',
  onExploreComplete,
}) => {
  const [selectedSpecimenId, setSelectedSpecimenId] = useState<SpecimenId>(initialSpecimenId);
  const [activeItemId, setActiveItemId] = useState<string>(
    focusOrganelleId || SPECIMENS[initialSpecimenId].items[0].id
  );
  const [currentLayerIdx, setCurrentLayerIdx] = useState(0);
  const [selectedQuizIdx, setSelectedQuizIdx] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [activeMagnificationIdx, setActiveMagnificationIdx] = useState(1);
  const [isXRayMode, setIsXRayMode] = useState(false);

  const specimen = SPECIMENS[selectedSpecimenId];
  const activeItem = specimen.items.find((i) => i.id === activeItemId) || specimen.items[0];

  const handleSelectSpecimen = (id: SpecimenId) => {
    setSelectedSpecimenId(id);
    setActiveItemId(SPECIMENS[id].items[0].id);
    setCurrentLayerIdx(0);
    setSelectedQuizIdx(null);
    setQuizSubmitted(false);
  };

  const handleNextLayer = () => {
    if (!specimen.dissectionLayers) return;
    setCurrentLayerIdx((prev) => (prev + 1) % specimen.dissectionLayers!.length);
  };

  return (
    <div className={`bg-white border-2 border-[#1B1B19] p-5 sm:p-7 shadow-sm text-[#1B1B19] font-['Inter'] relative ${className}`}>
      {/* Top Academic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-[rgba(27,27,25,0.12)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.15em] text-[#E15B44] font-bold flex items-center gap-1.5">
              <Microscope className="w-3.5 h-3.5 text-[#E15B44]" />
              <span>CLEP Natural Sciences & Biology Laboratory</span>
            </span>
            <span className="text-[#1B1B19]/30 font-['Space_Mono'] text-xs">/</span>
            <span className="font-['Space_Mono'] text-[10px] uppercase text-[#1B1B19]/60">{specimen.category}</span>
          </div>
          <h3 className="font-['Space_Mono'] text-base sm:text-xl font-bold uppercase tracking-tight text-[#1B1B19]">
            {specimen.title}
          </h3>
          <p className="text-xs text-[#1B1B19]/70 mt-0.5">
            {specimen.subtitle}
          </p>
        </div>

        {/* Specimen Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-['Space_Mono'] text-[10px] uppercase">
          <button
            type="button"
            onClick={() => handleSelectSpecimen('animal-cell')}
            className={`px-3 py-1.5 border transition-all cursor-pointer whitespace-nowrap ${
              selectedSpecimenId === 'animal-cell'
                ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:bg-[#EFECE6]'
            }`}
          >
            Animal Cell
          </button>
          <button
            type="button"
            onClick={() => handleSelectSpecimen('plant-cell')}
            className={`px-3 py-1.5 border transition-all cursor-pointer whitespace-nowrap ${
              selectedSpecimenId === 'plant-cell'
                ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:bg-[#EFECE6]'
            }`}
          >
            Plant Cell
          </button>
          <button
            type="button"
            onClick={() => handleSelectSpecimen('bacterium')}
            className={`px-3 py-1.5 border transition-all cursor-pointer whitespace-nowrap ${
              selectedSpecimenId === 'bacterium'
                ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:bg-[#EFECE6]'
            }`}
          >
            Bacterium
          </button>
          <button
            type="button"
            onClick={() => handleSelectSpecimen('mammalian-heart')}
            className={`px-3 py-1.5 border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              selectedSpecimenId === 'mammalian-heart'
                ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:bg-[#EFECE6]'
            }`}
          >
            <Heart className="w-3 h-3 text-[#E15B44]" />
            <span>Heart Dissection</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectSpecimen('angiosperm-flower')}
            className={`px-3 py-1.5 border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              selectedSpecimenId === 'angiosperm-flower'
                ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:bg-[#EFECE6]'
            }`}
          >
            <Flower2 className="w-3 h-3 text-[#E15B44]" />
            <span>Floral Anatomy</span>
          </button>
        </div>
      </div>

      {/* Dissection Layer Banner (For Dissection Models) */}
      {specimen.dissectionLayers && (
        <div className="mb-4 p-3 bg-[#1B1B19] text-white border border-[#1B1B19] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-[#E15B44]" />
            <span className="font-['Space_Mono'] text-xs font-bold uppercase tracking-wider">
              Dissection Stage: {specimen.dissectionLayers[currentLayerIdx]}
            </span>
          </div>

          <button
            type="button"
            onClick={handleNextLayer}
            className="font-['Space_Mono'] text-[10px] uppercase font-bold px-3 py-1 bg-white text-[#1B1B19] hover:bg-[#E15B44] hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
          >
            Next Incision Layer ➔
          </button>
        </div>
      )}

      {/* Main Split Workbench: Interactive Stage on Left (60%) + Concept Deck on Right (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 items-start mb-6">
        {/* Left: Interactive Diagram Stage */}
        <div className="border border-[rgba(27,27,25,0.15)] bg-[#F8F7F4] p-4 flex flex-col justify-between relative overflow-hidden">
          {/* Magnification Controls & Tool Strip */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(27,27,25,0.12)]">
            <div className="font-['Space_Mono'] text-[10px] uppercase font-bold text-[#1B1B19]/70 flex items-center gap-1.5">
              <ZoomIn className="w-3.5 h-3.5 text-[#E15B44]" />
              <span>Interactive Anatomy Viewport</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsXRayMode(!isXRayMode)}
                className={`font-['Space_Mono'] text-[9px] uppercase px-2 py-0.5 border transition-all cursor-pointer ${
                  isXRayMode
                    ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                    : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)]'
                }`}
              >
                {isXRayMode ? 'Contrast High' : 'Standard View'}
              </button>

              {specimen.magnifications && (
                <div className="flex items-center gap-1 font-['Space_Mono'] text-[9px]">
                  {specimen.magnifications.map((m, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveMagnificationIdx(idx)}
                      className={`px-1.5 py-0.5 border cursor-pointer ${
                        activeMagnificationIdx === idx
                          ? 'bg-[#E15B44] text-white border-[#E15B44] font-bold'
                          : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)]'
                      }`}
                    >
                      {m.split(' ')[0]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SVG Visual Stage Canvas */}
          <div className="relative w-full aspect-square max-w-[420px] mx-auto bg-white border border-[rgba(27,27,25,0.15)] p-2 shadow-inner flex items-center justify-center">
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full select-none cursor-crosshair"
            >
              {/* Background Reference Grid */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(27,27,25,0.04)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="400" height="400" fill="url(#grid)" />

              {/* SPECIMEN 1: ANIMAL CELL SVG */}
              {selectedSpecimenId === 'animal-cell' && (
                <g>
                  {/* Outer Plasma Membrane & Cytoplasm */}
                  <ellipse
                    cx="200"
                    cy="200"
                    rx="145"
                    ry="135"
                    fill={isXRayMode ? '#F1F5F9' : '#FEF3C7'}
                    stroke={activeItemId === 'plasma-membrane' ? '#E15B44' : '#1B1B19'}
                    strokeWidth={activeItemId === 'plasma-membrane' ? '4' : '2'}
                    className="transition-all cursor-pointer hover:opacity-90"
                    onClick={() => setActiveItemId('plasma-membrane')}
                  />
                  {/* Cytoskeleton Filaments (Subtle lines) */}
                  <path d="M 100 120 Q 200 160 300 130" stroke="rgba(27,27,25,0.15)" strokeWidth="1.5" fill="none" />
                  <path d="M 90 220 Q 180 270 290 250" stroke="rgba(27,27,25,0.15)" strokeWidth="1.5" fill="none" />

                  {/* Mitochondria 1 */}
                  <g
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => setActiveItemId('mitochondria')}
                  >
                    <ellipse
                      cx="120"
                      cy="260"
                      rx="32"
                      ry="20"
                      transform="rotate(-25 120 260)"
                      fill="#FCA5A5"
                      stroke={activeItemId === 'mitochondria' ? '#DC2626' : '#1B1B19'}
                      strokeWidth={activeItemId === 'mitochondria' ? '3' : '1.5'}
                    />
                    {/* Cristae foldings */}
                    <path d="M 105 260 C 115 250, 125 270, 135 260" stroke="#DC2626" strokeWidth="2" fill="none" />
                  </g>

                  {/* Mitochondria 2 (secondary) */}
                  <g
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => setActiveItemId('mitochondria')}
                  >
                    <ellipse
                      cx="280"
                      cy="120"
                      rx="24"
                      ry="15"
                      transform="rotate(35 280 120)"
                      fill="#FCA5A5"
                      stroke={activeItemId === 'mitochondria' ? '#DC2626' : '#1B1B19'}
                      strokeWidth={activeItemId === 'mitochondria' ? '3' : '1.5'}
                    />
                  </g>

                  {/* Lysosome */}
                  <circle
                    cx="110"
                    cy="140"
                    r="18"
                    fill="#6EE7B7"
                    stroke={activeItemId === 'lysosome' ? '#059669' : '#1B1B19'}
                    strokeWidth={activeItemId === 'lysosome' ? '3' : '1.5'}
                    className="cursor-pointer transition-all hover:scale-110"
                    onClick={() => setActiveItemId('lysosome')}
                  />

                  {/* Rough Endoplasmic Reticulum folds */}
                  <g
                    className="cursor-pointer transition-all"
                    onClick={() => setActiveItemId('rough-er')}
                  >
                    <path
                      d="M 235 150 C 275 140, 285 180, 255 190 C 290 190, 290 220, 245 220"
                      stroke={activeItemId === 'rough-er' ? '#2563EB' : '#1B1B19'}
                      strokeWidth={activeItemId === 'rough-er' ? '3' : '2'}
                      fill="none"
                    />
                    {/* Ribosome dots on RER */}
                    <circle cx="260" cy="155" r="2.5" fill="#1B1B19" />
                    <circle cx="272" cy="170" r="2.5" fill="#1B1B19" />
                    <circle cx="268" cy="195" r="2.5" fill="#1B1B19" />
                  </g>

                  {/* Golgi Apparatus cisternae */}
                  <g
                    className="cursor-pointer transition-all"
                    onClick={() => setActiveItemId('golgi')}
                  >
                    <path d="M 250 250 C 270 245, 290 248, 295 255" stroke={activeItemId === 'golgi' ? '#D97706' : '#1B1B19'} strokeWidth="3" fill="none" />
                    <path d="M 252 260 C 272 255, 292 258, 297 265" stroke={activeItemId === 'golgi' ? '#D97706' : '#1B1B19'} strokeWidth="3" fill="none" />
                    <path d="M 255 270 C 275 265, 295 268, 300 275" stroke={activeItemId === 'golgi' ? '#D97706' : '#1B1B19'} strokeWidth="3" fill="none" />
                  </g>

                  {/* Nucleus & Nucleolus */}
                  <g
                    className="cursor-pointer transition-all"
                    onClick={() => setActiveItemId('nucleus')}
                  >
                    <circle
                      cx="195"
                      cy="195"
                      r="46"
                      fill="#C7D2FE"
                      stroke={activeItemId === 'nucleus' ? '#4338CA' : '#1B1B19'}
                      strokeWidth={activeItemId === 'nucleus' ? '4' : '2'}
                    />
                    {/* Nuclear Pore notches */}
                    <circle cx="150" cy="195" r="2" fill="#1B1B19" />
                    <circle cx="240" cy="195" r="2" fill="#1B1B19" />
                    <circle cx="195" cy="150" r="2" fill="#1B1B19" />
                    {/* Dense Nucleolus */}
                    <circle
                      cx="190"
                      cy="190"
                      r="16"
                      fill="#4338CA"
                      stroke="#1B1B19"
                      strokeWidth="1.5"
                    />
                  </g>
                </g>
              )}

              {/* SPECIMEN 2: PLANT CELL SVG */}
              {selectedSpecimenId === 'plant-cell' && (
                <g>
                  {/* Outer Thick Rigid Cellulose Wall */}
                  <rect
                    x="50"
                    y="50"
                    width="300"
                    height="300"
                    rx="25"
                    fill="#DCFCE7"
                    stroke={activeItemId === 'cell-wall' ? '#15803D' : '#1B1B19'}
                    strokeWidth={activeItemId === 'cell-wall' ? '6' : '3'}
                    className="cursor-pointer"
                    onClick={() => setActiveItemId('cell-wall')}
                  />
                  {/* Inner Plasma Membrane */}
                  <rect
                    x="62"
                    y="62"
                    width="276"
                    height="276"
                    rx="18"
                    fill="none"
                    stroke="#15803D"
                    strokeWidth="1.5"
                  />

                  {/* Massive Central Vacuole */}
                  <ellipse
                    cx="220"
                    cy="220"
                    rx="95"
                    ry="80"
                    fill="#BAE6FD"
                    stroke={activeItemId === 'central-vacuole' ? '#0284C7' : '#1B1B19'}
                    strokeWidth={activeItemId === 'central-vacuole' ? '3' : '1.5'}
                    className="cursor-pointer hover:opacity-90"
                    onClick={() => setActiveItemId('central-vacuole')}
                  />
                  <text x="210" y="225" fontSize="10" fontFamily="Space Mono" fill="#0369A1" textAnchor="middle">
                    Central Vacuole (Turgor)
                  </text>

                  {/* Chloroplast 1 (Top Left) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setActiveItemId('chloroplast')}
                  >
                    <ellipse
                      cx="115"
                      cy="125"
                      rx="32"
                      ry="20"
                      transform="rotate(20 115 125)"
                      fill="#86EFAC"
                      stroke={activeItemId === 'chloroplast' ? '#16A34A' : '#1B1B19'}
                      strokeWidth={activeItemId === 'chloroplast' ? '3' : '1.5'}
                    />
                    {/* Thylakoid Grana Stacks */}
                    <line x1="100" y1="120" x2="112" y2="120" stroke="#166534" strokeWidth="2.5" />
                    <line x1="116" y1="124" x2="128" y2="124" stroke="#166534" strokeWidth="2.5" />
                  </g>

                  {/* Chloroplast 2 (Bottom Left) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setActiveItemId('chloroplast')}
                  >
                    <ellipse
                      cx="110"
                      cy="300"
                      rx="28"
                      ry="18"
                      transform="rotate(-15 110 300)"
                      fill="#86EFAC"
                      stroke={activeItemId === 'chloroplast' ? '#16A34A' : '#1B1B19'}
                      strokeWidth={activeItemId === 'chloroplast' ? '3' : '1.5'}
                    />
                  </g>

                  {/* Nucleus pressed against periphery */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setActiveItemId('nucleus-plant')}
                  >
                    <circle
                      cx="120"
                      cy="220"
                      r="32"
                      fill="#C7D2FE"
                      stroke={activeItemId === 'nucleus-plant' ? '#4338CA' : '#1B1B19'}
                      strokeWidth={activeItemId === 'nucleus-plant' ? '3' : '1.5'}
                    />
                    <circle cx="115" cy="215" r="10" fill="#4338CA" />
                  </g>
                </g>
              )}

              {/* SPECIMEN 3: PROKARYOTIC BACTERIUM SVG */}
              {selectedSpecimenId === 'bacterium' && (
                <g>
                  {/* Flagellum tail */}
                  <path
                    d="M 90 200 C 60 170, 40 230, 10 200"
                    stroke={activeItemId === 'flagellum' ? '#E15B44' : '#1B1B19'}
                    strokeWidth={activeItemId === 'flagellum' ? '4' : '2.5'}
                    fill="none"
                    className="cursor-pointer"
                    onClick={() => setActiveItemId('flagellum')}
                  />
                  {/* Capsule & Peptidoglycan Wall */}
                  <rect
                    x="95"
                    y="120"
                    width="220"
                    height="160"
                    rx="80"
                    fill="#FEF08A"
                    stroke={activeItemId === 'peptidoglycan-wall' ? '#B45309' : '#1B1B19'}
                    strokeWidth={activeItemId === 'peptidoglycan-wall' ? '4' : '2'}
                    className="cursor-pointer"
                    onClick={() => setActiveItemId('peptidoglycan-wall')}
                  />

                  {/* Nucleoid tangle */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setActiveItemId('nucleoid')}
                  >
                    <path
                      d="M 160 180 C 180 150, 220 160, 230 190 C 240 220, 200 240, 180 210 C 170 190, 210 190, 220 200"
                      stroke={activeItemId === 'nucleoid' ? '#9333EA' : '#7E22CE'}
                      strokeWidth={activeItemId === 'nucleoid' ? '4' : '2.5'}
                      fill="none"
                    />
                  </g>

                  {/* Plasmids */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setActiveItemId('plasmid')}
                  >
                    <circle cx="270" cy="155" r="10" fill="none" stroke={activeItemId === 'plasmid' ? '#E15B44' : '#DC2626'} strokeWidth="2.5" />
                    <circle cx="260" cy="245" r="7" fill="none" stroke={activeItemId === 'plasmid' ? '#E15B44' : '#DC2626'} strokeWidth="2" />
                  </g>

                  {/* Ribosomes scatter */}
                  <circle cx="130" cy="160" r="2" fill="#1B1B19" />
                  <circle cx="140" cy="230" r="2" fill="#1B1B19" />
                  <circle cx="280" cy="210" r="2" fill="#1B1B19" />
                </g>
              )}

              {/* SPECIMEN 4: MAMMALIAN HEART DISSECTION SVG */}
              {selectedSpecimenId === 'mammalian-heart' && (
                <g>
                  {/* Heart Muscle Body Silhouette */}
                  <path
                    d="M 200 340 C 120 280, 80 180, 120 120 C 160 70, 200 110, 200 130 C 200 110, 240 70, 280 120 C 320 180, 280 280, 200 340 Z"
                    fill="#FEE2E2"
                    stroke="#1B1B19"
                    strokeWidth="2"
                  />

                  {/* Right Atrium (Blue / Deoxygenated) */}
                  <path
                    d="M 120 120 C 140 100, 180 100, 190 140 C 170 170, 130 160, 120 120 Z"
                    fill={activeItemId === 'right-atrium' ? '#38BDF8' : '#BAE6FD'}
                    stroke={activeItemId === 'right-atrium' ? '#0284C7' : '#1B1B19'}
                    strokeWidth={activeItemId === 'right-atrium' ? '3' : '1.5'}
                    className="cursor-pointer"
                    onClick={() => setActiveItemId('right-atrium')}
                  />
                  <text x="150" y="135" fontSize="9" fontFamily="Space Mono" fill="#0369A1" textAnchor="middle">
                    R. Atrium
                  </text>

                  {/* Right Ventricle (Blue / Deoxygenated) */}
                  <path
                    d="M 130 170 C 170 170, 190 180, 190 270 C 150 280, 120 220, 130 170 Z"
                    fill={activeItemId === 'right-ventricle' ? '#0284C7' : '#7DD3FC'}
                    stroke={activeItemId === 'right-ventricle' ? '#0369A1' : '#1B1B19'}
                    strokeWidth={activeItemId === 'right-ventricle' ? '3' : '1.5'}
                    className="cursor-pointer"
                    onClick={() => setActiveItemId('right-ventricle')}
                  />
                  <text x="155" y="235" fontSize="9" fontFamily="Space Mono" fill="#082F49" textAnchor="middle">
                    R. Ventricle
                  </text>

                  {/* Interventricular Septum */}
                  <rect
                    x="192"
                    y="140"
                    width="16"
                    height="160"
                    fill={activeItemId === 'interventricular-septum' ? '#4B5563' : '#9CA3AF'}
                    stroke="#1B1B19"
                    strokeWidth="1.5"
                    className="cursor-pointer"
                    onClick={() => setActiveItemId('interventricular-septum')}
                  />

                  {/* Left Atrium (Red / Oxygenated) */}
                  <path
                    d="M 280 120 C 260 100, 220 100, 210 140 C 230 170, 270 160, 280 120 Z"
                    fill={activeItemId === 'left-atrium' ? '#FB7185' : '#FECDD3'}
                    stroke={activeItemId === 'left-atrium' ? '#E11D48' : '#1B1B19'}
                    strokeWidth={activeItemId === 'left-atrium' ? '3' : '1.5'}
                    className="cursor-pointer"
                    onClick={() => setActiveItemId('left-atrium')}
                  />
                  <text x="250" y="135" fontSize="9" fontFamily="Space Mono" fill="#881337" textAnchor="middle">
                    L. Atrium
                  </text>

                  {/* Left Ventricle (Thick Myocardium - Red) */}
                  <path
                    d="M 270 170 C 230 170, 210 180, 210 270 C 250 280, 280 220, 270 170 Z"
                    fill={activeItemId === 'left-ventricle' ? '#E11D48' : '#F43F5E'}
                    stroke={activeItemId === 'left-ventricle' ? '#9F1239' : '#1B1B19'}
                    strokeWidth={activeItemId === 'left-ventricle' ? '3' : '1.5'}
                    className="cursor-pointer"
                    onClick={() => setActiveItemId('left-ventricle')}
                  />
                  <text x="245" y="235" fontSize="9" fontFamily="Space Mono" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">
                    L. Ventricle
                  </text>
                </g>
              )}

              {/* SPECIMEN 5: ANGIOSPERM FLOWER DISSECTION SVG */}
              {selectedSpecimenId === 'angiosperm-flower' && (
                <g>
                  {/* Stem & Receptacle */}
                  <path d="M 200 270 L 200 370" stroke="#15803D" strokeWidth="8" fill="none" />
                  <ellipse cx="200" cy="270" rx="40" ry="15" fill="#16A34A" stroke="#1B1B19" strokeWidth="2" />

                  {/* Petals */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setActiveItemId('petals')}
                  >
                    <path d="M 120 240 C 70 170, 100 100, 170 180 Z" fill="#FDA4AF" stroke={activeItemId === 'petals' ? '#E15B44' : '#1B1B19'} strokeWidth="2" />
                    <path d="M 280 240 C 330 170, 300 100, 230 180 Z" fill="#FDA4AF" stroke={activeItemId === 'petals' ? '#E15B44' : '#1B1B19'} strokeWidth="2" />
                  </g>

                  {/* Ovary (Pistil Base) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setActiveItemId('ovary')}
                  >
                    <ellipse
                      cx="200"
                      cy="230"
                      rx="35"
                      ry="30"
                      fill="#86EFAC"
                      stroke={activeItemId === 'ovary' ? '#059669' : '#1B1B19'}
                      strokeWidth={activeItemId === 'ovary' ? '3' : '2'}
                    />
                    {/* Ovules inside ovary */}
                    <circle cx="190" cy="230" r="5" fill="#15803D" />
                    <circle cx="210" cy="230" r="5" fill="#15803D" />
                  </g>

                  {/* Style and Stigma */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setActiveItemId('pistil-stigma')}
                  >
                    <line x1="200" y1="200" x2="200" y2="130" stroke={activeItemId === 'pistil-stigma' ? '#10B981' : '#1B1B19'} strokeWidth="4" />
                    {/* Sticky Stigma head */}
                    <circle cx="200" cy="125" r="14" fill="#34D399" stroke={activeItemId === 'pistil-stigma' ? '#059669' : '#1B1B19'} strokeWidth="2" />
                  </g>

                  {/* Stamens (Filament & Anthers with pollen) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setActiveItemId('anther')}
                  >
                    {/* Left Stamen */}
                    <path d="M 180 240 Q 140 180 130 150" stroke="#1B1B19" strokeWidth="2" fill="none" />
                    <ellipse cx="128" cy="145" rx="10" ry="6" fill="#FACC15" stroke={activeItemId === 'anther' ? '#EAB308' : '#1B1B19'} strokeWidth="2" />
                    {/* Right Stamen */}
                    <path d="M 220 240 Q 260 180 270 150" stroke="#1B1B19" strokeWidth="2" fill="none" />
                    <ellipse cx="272" cy="145" rx="10" ry="6" fill="#FACC15" stroke={activeItemId === 'anther' ? '#EAB308' : '#1B1B19'} strokeWidth="2" />
                  </g>
                </g>
              )}
            </svg>

            {/* Targeted Structure Crosshair Tag */}
            <div className="absolute bottom-2 left-2 font-['Space_Mono'] text-[9px] uppercase px-2 py-0.5 border border-[#1B1B19] bg-white font-bold">
              Active Focus: {activeItem.name}
            </div>
          </div>

          {/* Quick Select Organelle Chips */}
          <div className="pt-3 mt-3 border-t border-[rgba(27,27,25,0.12)]">
            <span className="font-['Space_Mono'] text-[9px] uppercase tracking-wider text-[#1B1B19]/60 font-bold block mb-1.5">
              Click Structure to Inspect Physiology:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {specimen.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveItemId(item.id)}
                  className={`font-['Space_Mono'] text-[10px] uppercase font-bold px-2.5 py-1 border transition-all cursor-pointer ${
                    activeItemId === item.id
                      ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                      : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:bg-[#EFECE6]'
                  }`}
                >
                  {item.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Concept Deck & Biochemical Function Card */}
        <div className="space-y-4">
          {/* Active Organelle Physiology Card */}
          <div className="p-5 border-2 border-[#1B1B19] bg-white shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[rgba(27,27,25,0.12)]">
              <div>
                <span className="font-['Space_Mono'] text-[10px] uppercase font-bold text-[#E15B44] tracking-wider">
                  {activeItem.category}
                </span>
                <h4 className="font-['Space_Mono'] text-base sm:text-lg font-bold uppercase text-[#1B1B19]">
                  {activeItem.name}
                </h4>
              </div>
              <span className="font-['Space_Mono'] text-[9px] uppercase px-2 py-0.5 border border-[#1B1B19] bg-[#F8F7F4] font-bold">
                CLEP High-Yield
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-['Space_Mono'] text-[10px] uppercase font-bold text-[#1B1B19] block mb-0.5">
                  Biochemical Mechanism:
                </span>
                <p className="text-[#1B1B19]/90 leading-relaxed font-['Inter']">
                  {activeItem.biochemicalFunction}
                </p>
              </div>

              <div className="p-3 border-l-3 border-l-[#E15B44] bg-[#F8F7F4] border border-[rgba(27,27,25,0.08)]">
                <span className="font-['Space_Mono'] text-[10px] uppercase font-bold text-[#E15B44] block mb-0.5">
                  CLEP Exam Core Takeaway:
                </span>
                <p className="text-[#1B1B19]/80 italic">
                  {activeItem.clepConcept}
                </p>
              </div>

              <div className="pt-2 border-t border-[rgba(27,27,25,0.1)] text-[11px] text-[#1B1B19]/60">
                <span className="font-['Space_Mono'] text-[9px] uppercase font-bold block mb-0.5">
                  OpenStax Textbook Citation:
                </span>
                <p className="font-serif italic text-xs text-[#1B1B19]/80">
                  {activeItem.openStaxCitation}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Identification Check Quiz */}
          <div className="p-5 border border-[#1B1B19] bg-[#F8F7F4]">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[rgba(27,27,25,0.12)]">
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#E15B44]" />
                <span className="font-['Space_Mono'] text-xs font-bold uppercase text-[#1B1B19]">
                  Physiology Check Quiz
                </span>
              </div>
              <span className="font-['Space_Mono'] text-[9px] uppercase text-[#1B1B19]/60">
                80% Benchmark
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-[#1B1B19] mb-3 leading-snug">
              {specimen.quiz.question}
            </p>

            <div className="space-y-1.5 mb-3">
              {specimen.quiz.options.map((opt, idx) => {
                const isSelected = selectedQuizIdx === idx;
                const isRight = idx === specimen.quiz.correctIndex;

                let optClass = 'border-[rgba(27,27,25,0.15)] bg-white hover:border-[#1B1B19]';
                if (quizSubmitted) {
                  if (isRight) {
                    optClass = 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold';
                  } else if (isSelected && !isRight) {
                    optClass = 'border-[#E15B44] bg-rose-50 text-rose-950 font-bold';
                  }
                } else if (isSelected) {
                  optClass = 'border-[#1B1B19] bg-[#EFECE6] font-bold';
                }

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (!quizSubmitted) setSelectedQuizIdx(idx);
                    }}
                    className={`p-2.5 border text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors ${optClass}`}
                  >
                    <span>{opt}</span>
                    {quizSubmitted && isRight && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[rgba(27,27,25,0.1)]">
              {quizSubmitted ? (
                <div className="text-[11px] text-[#1B1B19]/80 italic">
                  {specimen.quiz.explanation}
                </div>
              ) : (
                <span className="text-[10px] text-[#1B1B19]/50">
                  Select answer & click Verify
                </span>
              )}

              <div className="flex items-center gap-2 shrink-0">
                {quizSubmitted ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuizSubmitted(false);
                      setSelectedQuizIdx(null);
                    }}
                    className="font-['Space_Mono'] text-[10px] uppercase px-3 py-1.5 border border-[#1B1B19] bg-white hover:bg-[#EFECE6] cursor-pointer"
                  >
                    Reset
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={selectedQuizIdx === null}
                    onClick={() => setQuizSubmitted(true)}
                    className="font-['Space_Mono'] text-[10px] uppercase font-bold px-4 py-1.5 bg-[#1B1B19] hover:bg-[#E15B44] text-white border border-[#1B1B19] cursor-pointer disabled:opacity-40"
                  >
                    Verify
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-[rgba(27,27,25,0.12)] flex flex-col sm:flex-row items-center justify-between text-[10px] font-['Space_Mono'] uppercase tracking-wider text-[#1B1B19]/60">
        <span>CLEP Natural Sciences & General Biology Cell/Dissection Workbench</span>
        <span>Grounded in OpenStax Biology 2e & Anatomy & Physiology 2e</span>
      </div>
    </div>
  );
};

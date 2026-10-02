export type SubjectCategory =
  | 'Histories'
  | 'Sciences'
  | 'Ethics & Philosophy'
  | 'Foreign Languages'
  | 'Mathematics'
  | 'Computer Science & Coding'
  | 'Economics'
  | 'Business & Accounting'
  | 'Arts & Humanities'
  | 'Government';

export interface Subject {
  id: string;
  name: string;
  category: SubjectCategory;
  textbook: string;
  icon: string;
  description: string;
  chapters: string[];
}

export interface Question {
  id: string;
  subjectId: string;
  chapter: string;
  textbookRef: string;
  question: string;
  codeSnippet?: string;
  audioDialogue?: {
    language: 'es-ES' | 'fr-FR' | 'de-DE';
    speakerText: string;
    englishTranslation?: string;
    speakers?: { name: string; line: string }[];
  };
  aslNotation?: {
    gloss: string;
    parameters: {
      handshape: string;
      location: string;
      movement: string;
      palmOrientation: string;
      nonManualMarkers: string;
    };
    description: string;
  };
  cellDissectionData?: {
    modelType: 'animal' | 'plant' | 'bacterium' | 'mammalian-heart' | 'flower-angiosperm';
    title: string;
    focusOrganelle?: string;
    specimenType: 'cell' | 'dissection';
  };
  options: {
    id: string;
    text: string;
    distractorReason?: string;
  }[];
  correctOptionId: string;
  explanation: {
    coreConcept: string;
    textbookExcerpt: string;
    whyCorrect: string;
    distractorBreakdown: Record<string, string>;
    keyTakeaway: string;
  };
  defaultMnemonic?: {
    phrase: string;
    acronymBreakdown: string[];
    explanation: string;
  };
}

export interface HistoryItem {
  id: string;
  questionId: string;
  subjectId: string;
  chapter: string;
  questionText: string;
  selectedOptionId: string;
  selectedOptionText: string;
  correctOptionId: string;
  correctOptionText: string;
  isCorrect: boolean;
  timestamp: number;
  mode: 'drill' | 'exam' | 'chapter';
  textbookRef: string;
}

export interface StudyNote {
  id: string;
  subjectId: string;
  chapter: string;
  title: string;
  summary: string;
  keyTakeaway: string;
  textbookRef: string;
  createdAt: number;
}

export interface MnemonicItem {
  id: string;
  subjectId: string;
  chapter: string;
  phrase: string;
  breakdown: string[];
  explanation: string;
  concept: string;
  createdAt: number;
}

export interface UserProfile {
  username: string;
  displayName: string;
  lastActive: number;
  totalAnswered: number;
  totalCorrect: number;
}

export interface ExamConfig {
  mode: 'diagnostic' | 'standard' | 'full';
  totalQuestions: number;
  timeLimitMinutes: number; // e.g. 120 for 2 hours
  selectedSubjectIds: string[];
  selectedChapters?: string[];
}

export interface ExamSession {
  id: string;
  startTime: number;
  timeLimitSeconds: number;
  timeRemainingSeconds: number;
  questions: Question[];
  userAnswers: Record<string, string>; // questionId -> optionId
  flaggedQuestionIds: string[];
  isCompleted: boolean;
  score?: {
    total: number;
    correct: number;
    percentage: number;
    likelyPassing: boolean; // >= 80%
    subjectBreakdown: Record<string, { total: number; correct: number }>;
  };
}

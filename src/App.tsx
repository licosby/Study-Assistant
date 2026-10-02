import React, { useState, useEffect } from 'react';
import { ALL_SUBJECTS } from './data/subjects';
import { INITIAL_QUESTION_BANK } from './data/questionBanks';
import { 
  Subject, 
  Question, 
  HistoryItem, 
  StudyNote, 
  MnemonicItem, 
  ExamSession 
} from './types';
import { 
  getStoredUserSession, 
  loginUser, 
  syncUserData, 
  UserSessionData,
  fetchAIQuestions 
} from './services/api';

import { Header } from './components/Header';
import { SubjectSelector } from './components/SubjectSelector';
import { QuizCard } from './components/QuizCard';
import { ExplainModal } from './components/ExplainModal';
import { ExamMode } from './components/ExamMode';
import { ExamResults } from './components/ExamResults';
import { HistoryTracker } from './components/HistoryTracker';
import { NotebookView } from './components/NotebookView';
import { MnemonicVault } from './components/MnemonicVault';
import { AuthModal } from './components/AuthModal';

// Initial preloaded collegiate mnemonics
const INITIAL_MNEMONICS: MnemonicItem[] = [
  {
    id: 'mnem-oilrig',
    subjectId: 'chemistry',
    chapter: 'Ch 4: Stoichiometry of Chemical Reactions',
    phrase: 'OIL RIG (Oxidation & Reduction)',
    breakdown: [
      'OIL = Oxidation Is Loss of electrons',
      'RIG = Reduction Is Gain of electrons'
    ],
    explanation: 'Whenever you see electron transfer, recall OIL RIG to immediately determine the cathode and anode.',
    concept: 'Redox Reactions and Electron Transfer',
    createdAt: Date.now() - 100000,
  },
  {
    id: 'mnem-dealer',
    subjectId: 'accounting',
    chapter: 'Ch 2: Analyzing and Recording Transactions (Debits & Credits)',
    phrase: 'D-E-A-L-E-R (Debits & Credits)',
    breakdown: [
      'DEA (Debited to increase): Dividends, Expenses, Assets',
      'LER (Credited to increase): Liabilities, Equity, Revenue'
    ],
    explanation: 'Split DEALER in half: the first three increase with Debits; the last three increase with Credits.',
    concept: 'Normal Balances in Double-Entry Accounting',
    createdAt: Date.now() - 90000,
  },
  {
    id: 'mnem-gdp',
    subjectId: 'macroeconomics',
    chapter: 'Ch 6: The Macroeconomic Perspective and GDP (C+I+G+NX)',
    phrase: 'C + I + G + NX (Can I Get Next?)',
    breakdown: [
      'C = Consumer Consumption spending',
      'I = Business Investment',
      'G = Government purchases',
      'NX = Net Exports (Exports minus Imports)'
    ],
    explanation: 'The four pillars of national GDP calculated via the expenditure method.',
    concept: 'GDP Expenditure Components',
    createdAt: Date.now() - 80000,
  },
  {
    id: 'mnem-asl',
    subjectId: 'sign-language',
    chapter: 'Ch 1: The 5 Parameters of ASL (HOLME)',
    phrase: 'H - O - L - M - E (Every Sign Has a Home)',
    breakdown: [
      'H = Handshape',
      'O = Orientation of Palm',
      'L = Location on body/space',
      'M = Movement',
      'E = Expression (Non-Manual Markers)'
    ],
    explanation: 'Change any one of these five parameters and you alter the entire lexical meaning in ASL.',
    concept: 'The 5 Linguistic Parameters of American Sign Language',
    createdAt: Date.now() - 70000,
  },
  {
    id: 'mnem-montesquieu',
    subjectId: 'world-history',
    chapter: 'Ch 18: The Enlightenment and Age of Reason',
    phrase: 'MON-TES-QUIEU = 3 SYLLABLES = 3 BRANCHES',
    breakdown: [
      'Mon = Executive branch',
      'Tes = Legislative branch',
      'Quieu = Judicial branch'
    ],
    explanation: 'Say Montesquieu out loud: 3 syllables match the tripartite separation of powers.',
    concept: 'Separation of Powers Doctrine',
    createdAt: Date.now() - 60000,
  },
  {
    id: 'mnem-stats',
    subjectId: 'statistics',
    chapter: 'Ch 6: The Normal Distribution & Empirical Rule (68-95-99.7)',
    phrase: '68 - 95 - 99.7 (ONE, TWO, THREE)',
    breakdown: [
      '1 Standard Deviation = 68% of data',
      '2 Standard Deviations = 95% of data',
      '3 Standard Deviations = 99.7% of data'
    ],
    explanation: 'The classic empirical rule for any symmetric bell-shaped normal curve.',
    concept: 'Empirical Rule for Normal Distribution',
    createdAt: Date.now() - 50000,
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'drill' | 'exam' | 'history' | 'notes' | 'mnemonics'>('drill');
  const [user, setUser] = useState<UserSessionData | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Question bank state (persisted + dynamically expandable)
  const [allQuestions, setAllQuestions] = useState<Question[]>(INITIAL_QUESTION_BANK);

  // Drill Mode State
  const [selectedSubject, setSelectedSubject] = useState<Subject>(ALL_SUBJECTS[0]);
  const [selectedChapters, setSelectedChapters] = useState<string[]>(ALL_SUBJECTS[0].chapters);
  const [isUnlimitedMode, setIsUnlimitedMode] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [drillIndex, setDrillIndex] = useState(0);

  // Explain This Modal State
  const [explainQuestion, setExplainQuestion] = useState<Question | null>(null);

  // Exam Mode State
  const [completedExamSession, setCompletedExamSession] = useState<ExamSession | null>(null);

  // Initialize or restore session
  useEffect(() => {
    const existing = getStoredUserSession();
    if (existing) {
      setUser(existing);
    } else {
      // Auto-initialize standard session
      const defaultUser: UserSessionData = {
        username: 'scholar_guest',
        displayName: 'College Scholar',
        history: [],
        notes: [],
        mnemonics: INITIAL_MNEMONICS,
        stats: { totalAnswered: 0, totalCorrect: 0, subjectStats: {} },
        lastActive: Date.now(),
      };
      setUser(defaultUser);
      syncUserData(defaultUser);
    }
  }, []);

  // Sync user state back to backend & localStorage whenever updated
  const updateUserState = (updater: (prev: UserSessionData) => UserSessionData) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = updater(prev);
      syncUserData(updated);
      return updated;
    });
  };

  // Switch subject & update available chapters
  const handleSelectSubject = (subj: Subject) => {
    setSelectedSubject(subj);
    setSelectedChapters(subj.chapters);
    // Filter questions
    const matching = allQuestions.filter(
      (q) => q.subjectId === subj.id && subj.chapters.includes(q.chapter)
    );
    if (matching.length > 0) {
      setActiveQuestion(matching[0]);
      setDrillIndex(0);
      setSelectedOptionId(null);
      setShowFeedback(false);
    }
  };

  const handleToggleChapter = (chapter: string) => {
    if (selectedChapters.includes(chapter)) {
      if (selectedChapters.length > 1) {
        setSelectedChapters(selectedChapters.filter((c) => c !== chapter));
      }
    } else {
      setSelectedChapters([...selectedChapters, chapter]);
    }
  };

  const handleSelectAllChapters = () => {
    setSelectedChapters(selectedSubject.chapters);
  };

  const handleClearChapters = () => {
    if (selectedSubject.chapters.length > 0) {
      setSelectedChapters([selectedSubject.chapters[0]]);
    }
  };

  // Start practice with selected subject & chapters
  const handleStartPractice = () => {
    const pool = allQuestions.filter(
      (q) => q.subjectId === selectedSubject.id && selectedChapters.includes(q.chapter)
    );
    if (pool.length > 0) {
      const randomQ = pool[Math.floor(Math.random() * pool.length)];
      setActiveQuestion(randomQ);
    } else {
      // Pick first matching
      const match = allQuestions.find((q) => q.subjectId === selectedSubject.id);
      if (match) setActiveQuestion(match);
    }
    setDrillIndex(1);
    setSelectedOptionId(null);
    setShowFeedback(false);
  };

  // Set initial drill question once subjects are loaded
  useEffect(() => {
    if (!activeQuestion) {
      handleStartPractice();
    }
  }, [allQuestions]);

  // Handle answering question in drill mode
  const handleSelectOption = (optionId: string) => {
    if (showFeedback || !activeQuestion || !user) return;
    setSelectedOptionId(optionId);
    setShowFeedback(true);

    const isCorrect = optionId === activeQuestion.correctOptionId;
    const selectedOpt = activeQuestion.options.find((o) => o.id === optionId);
    const correctOpt = activeQuestion.options.find((o) => o.id === activeQuestion.correctOptionId);

    const historyEntry: HistoryItem = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      questionId: activeQuestion.id,
      subjectId: activeQuestion.subjectId,
      chapter: activeQuestion.chapter,
      questionText: activeQuestion.question,
      selectedOptionId: optionId,
      selectedOptionText: selectedOpt?.text || '',
      correctOptionId: activeQuestion.correctOptionId,
      correctOptionText: correctOpt?.text || '',
      isCorrect,
      timestamp: Date.now(),
      mode: 'drill',
      textbookRef: activeQuestion.textbookRef,
    };

    updateUserState((prev) => {
      const currentSubjectStats = prev.stats.subjectStats[activeQuestion.subjectId] || {
        answered: 0,
        correct: 0,
      };

      return {
        ...prev,
        history: [historyEntry, ...prev.history],
        stats: {
          totalAnswered: prev.stats.totalAnswered + 1,
          totalCorrect: prev.stats.totalCorrect + (isCorrect ? 1 : 0),
          subjectStats: {
            ...prev.stats.subjectStats,
            [activeQuestion.subjectId]: {
              answered: currentSubjectStats.answered + 1,
              correct: currentSubjectStats.correct + (isCorrect ? 1 : 0),
            },
          },
        },
        lastActive: Date.now(),
      };
    });
  };

  // Advance to next question in drill mode
  const handleNextDrillQuestion = async () => {
    setSelectedOptionId(null);
    setShowFeedback(false);

    // Filter available pool
    const pool = allQuestions.filter(
      (q) => q.subjectId === selectedSubject.id && selectedChapters.includes(q.chapter)
    );

    // If unlimited mode is active and we want endless fresh questions
    if (isUnlimitedMode && Math.random() > 0.4) {
      const randomChapter = selectedChapters[Math.floor(Math.random() * selectedChapters.length)];
      const freshQuestions = await fetchAIQuestions(
        selectedSubject.name,
        randomChapter,
        selectedSubject.textbook,
        2
      );

      if (freshQuestions.length > 0) {
        setAllQuestions((prev) => [...prev, ...freshQuestions]);
        setActiveQuestion(freshQuestions[0]);
        setDrillIndex((prev) => prev + 1);
        return;
      }
    }

    // Pick a different question from current pool
    const remaining = pool.filter((q) => q.id !== activeQuestion?.id);
    if (remaining.length > 0) {
      const nextQ = remaining[Math.floor(Math.random() * remaining.length)];
      setActiveQuestion(nextQ);
    } else if (pool.length > 0) {
      setActiveQuestion(pool[0]);
    }
    setDrillIndex((prev) => prev + 1);
  };

  // Clip Note handler
  const handleClipToNotes = (noteData: Omit<StudyNote, 'id' | 'createdAt'>) => {
    const newNote: StudyNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      createdAt: Date.now(),
    };
    updateUserState((prev) => ({
      ...prev,
      notes: [newNote, ...prev.notes],
    }));
  };

  // Save Mnemonic handler
  const handleSaveMnemonic = (mnemonicData: Omit<MnemonicItem, 'id' | 'createdAt'>) => {
    const newMnemonic: MnemonicItem = {
      ...mnemonicData,
      id: `mnem-${Date.now()}`,
      createdAt: Date.now(),
    };
    updateUserState((prev) => ({
      ...prev,
      mnemonics: [newMnemonic, ...prev.mnemonics],
    }));
  };

  // Exam completion handler
  const handleFinishExam = (session: ExamSession) => {
    setCompletedExamSession(session);

    // Record every exam question attempt into student's history
    if (session.score) {
      const examHistoryItems: HistoryItem[] = session.questions.map((q) => {
        const userChoice = session.userAnswers[q.id];
        const isRight = userChoice === q.correctOptionId;
        const selectedOpt = q.options.find((o) => o.id === userChoice);
        const correctOpt = q.options.find((o) => o.id === q.correctOptionId);

        return {
          id: `hist-exam-${Date.now()}-${q.id}`,
          questionId: q.id,
          subjectId: q.subjectId,
          chapter: q.chapter,
          questionText: q.question,
          selectedOptionId: userChoice || 'none',
          selectedOptionText: selectedOpt?.text || 'Unanswered',
          correctOptionId: q.correctOptionId,
          correctOptionText: correctOpt?.text || '',
          isCorrect: isRight,
          timestamp: Date.now(),
          mode: 'exam',
          textbookRef: q.textbookRef,
        };
      });

      updateUserState((prev) => ({
        ...prev,
        history: [...examHistoryItems, ...prev.history],
        stats: {
          totalAnswered: prev.stats.totalAnswered + session.questions.length,
          totalCorrect: prev.stats.totalCorrect + (session.score?.correct || 0),
          subjectStats: prev.stats.subjectStats,
        },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-600 selection:text-white">
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'exam' && completedExamSession) {
            // Keep or reset as user prefers
          }
        }}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: Study & Drill Mode */}
        {activeTab === 'drill' && (
          <div className="space-y-6">
            {/* Subject and Chapter Selector */}
            <SubjectSelector
              selectedSubject={selectedSubject}
              onSelectSubject={handleSelectSubject}
              selectedChapters={selectedChapters}
              onToggleChapter={handleToggleChapter}
              onSelectAllChapters={handleSelectAllChapters}
              onClearChapters={handleClearChapters}
              isUnlimitedMode={isUnlimitedMode}
              onToggleUnlimitedMode={setIsUnlimitedMode}
              onStartPractice={handleStartPractice}
            />

            {/* Active Quiz Card */}
            {activeQuestion ? (
              <QuizCard
                question={activeQuestion}
                subjectName={selectedSubject.name}
                selectedOptionId={selectedOptionId}
                onSelectOption={handleSelectOption}
                showFeedback={showFeedback}
                onNext={handleNextDrillQuestion}
                onOpenExplain={() => setExplainQuestion(activeQuestion)}
                isUnlimitedMode={isUnlimitedMode}
                questionNumber={drillIndex || 1}
              />
            ) : (
              <div className="p-8 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
                Please select chapters from the panel above to begin studying.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CLEP Timed Mock Exam */}
        {activeTab === 'exam' && (
          <div>
            {completedExamSession ? (
              <ExamResults
                session={completedExamSession}
                onRetake={() => setCompletedExamSession(null)}
                onOpenExplain={(q) => setExplainQuestion(q)}
              />
            ) : (
              <ExamMode
                allQuestions={allQuestions}
                onFinishExam={handleFinishExam}
                onOpenExplainForQuestion={(q) => setExplainQuestion(q)}
              />
            )}
          </div>
        )}

        {/* TAB 3: Question History Tracker */}
        {activeTab === 'history' && (
          <HistoryTracker
            history={user?.history || []}
            allQuestions={allQuestions}
            onClearHistory={() =>
              updateUserState((prev) => ({
                ...prev,
                history: [],
                stats: { totalAnswered: 0, totalCorrect: 0, subjectStats: {} },
              }))
            }
            onOpenExplainForQuestion={(q) => setExplainQuestion(q)}
          />
        )}

        {/* TAB 4: Summarized Notebook */}
        {activeTab === 'notes' && (
          <NotebookView
            notes={user?.notes || []}
            onDeleteNote={(noteId) =>
              updateUserState((prev) => ({
                ...prev,
                notes: prev.notes.filter((n) => n.id !== noteId),
              }))
            }
            onClearNotes={() =>
              updateUserState((prev) => ({
                ...prev,
                notes: [],
              }))
            }
          />
        )}

        {/* TAB 5: Mnemonic Vault */}
        {activeTab === 'mnemonics' && (
          <MnemonicVault
            mnemonics={user?.mnemonics || INITIAL_MNEMONICS}
            onAddMnemonic={handleSaveMnemonic}
            onDeleteMnemonic={(mId) =>
              updateUserState((prev) => ({
                ...prev,
                mnemonics: prev.mnemonics.filter((m) => m.id !== mId),
              }))
            }
          />
        )}
      </main>

      {/* Global "Explain This" Mini-Lesson Modal */}
      <ExplainModal
        isOpen={!!explainQuestion}
        onClose={() => setExplainQuestion(null)}
        question={explainQuestion}
        subjectName={
          ALL_SUBJECTS.find((s) => s.id === explainQuestion?.subjectId)?.name || 'College Core'
        }
        onClipToNotes={handleClipToNotes}
        onSaveMnemonic={handleSaveMnemonic}
      />

      {/* 3-Device Sync & Student Sign-in Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
        onLogin={async (name, username, password) => {
          const loggedInUser = await loginUser(name, username, password);
          setUser(loggedInUser);
        }}
        onLogout={() => {
          const guest: UserSessionData = {
            username: 'scholar_guest',
            displayName: 'College Scholar',
            history: [],
            notes: [],
            mnemonics: INITIAL_MNEMONICS,
            stats: { totalAnswered: 0, totalCorrect: 0, subjectStats: {} },
            lastActive: Date.now(),
          };
          setUser(guest);
          syncUserData(guest);
        }}
      />
    </div>
  );
}

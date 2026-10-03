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
import { MnemonicGeneratorModal } from './components/MnemonicGeneratorModal';
import { AuthModal } from './components/AuthModal';
import { AudioListeningLab } from './components/AudioListeningLab';
import { DigitalCellDissectionLab, SpecimenId } from './components/DigitalCellDissectionLab';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { Target, AlertCircle, X } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'drill' | 'exam' | 'dashboard' | 'sciences' | 'audio' | 'history' | 'notes' | 'mnemonics'>('drill');
  const [user, setUser] = useState<UserSessionData | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [scienceModalSpecimen, setScienceModalSpecimen] = useState<SpecimenId | null>(null);

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

  // Mnemonic Generator Modal State
  const [mnemonicModalData, setMnemonicModalData] = useState<{
    concept: string;
    subjectName: string;
    subjectId: string;
    chapter: string;
  } | null>(null);

  // Weak Spots Mode State
  const [isWeakSpotsMode, setIsWeakSpotsMode] = useState(false);
  const [weakSpotsNotice, setWeakSpotsNotice] = useState<string | null>(null);

  // Compute question error frequencies from user history
  const incorrectCountByQuestionId = React.useMemo(() => {
    if (!user?.history) return {};
    const counts: Record<string, number> = {};
    for (const item of user.history) {
      if (!item.isCorrect) {
        counts[item.questionId] = (counts[item.questionId] || 0) + 1;
      }
    }
    return counts;
  }, [user?.history]);

  // Questions where the user answered incorrectly MORE than twice (> 2 times)
  const weakSpotQuestions = React.useMemo(() => {
    return allQuestions.filter((q) => (incorrectCountByQuestionId[q.id] || 0) > 2);
  }, [allQuestions, incorrectCountByQuestionId]);

  // Focus Weak Spots Handler
  const handleFocusWeakSpots = () => {
    if (weakSpotQuestions.length === 0) {
      setWeakSpotsNotice(
        "No questions have been answered incorrectly more than twice yet! As you practice, any questions you miss 3 or more times will automatically queue here for focused weak spot drills."
      );
      return;
    }

    setIsWeakSpotsMode(true);
    setWeakSpotsNotice(null);
    const firstWeak = weakSpotQuestions[0];
    const subj = ALL_SUBJECTS.find((s) => s.id === firstWeak.subjectId);
    if (subj) setSelectedSubject(subj);
    setActiveQuestion(firstWeak);
    setSelectedOptionId(null);
    setShowFeedback(false);
    setDrillIndex(1);
  };

  const handleExitWeakSpots = () => {
    setIsWeakSpotsMode(false);
    setWeakSpotsNotice(null);
    handleStartPractice();
  };

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
    setIsWeakSpotsMode(false);
    setWeakSpotsNotice(null);
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

    // If in Weak Spots Mode, rotate through weak spot questions
    if (isWeakSpotsMode) {
      const pool = weakSpotQuestions;
      if (pool.length > 0) {
        const remaining = pool.filter((q) => q.id !== activeQuestion?.id);
        const nextQ = remaining.length > 0
          ? remaining[Math.floor(Math.random() * remaining.length)]
          : pool[0];
        const subj = ALL_SUBJECTS.find((s) => s.id === nextQ.subjectId);
        if (subj) setSelectedSubject(subj);
        setActiveQuestion(nextQ);
        setDrillIndex((prev) => prev + 1);
        return;
      } else {
        // All weak spots mastered or empty
        setIsWeakSpotsMode(false);
      }
    }

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
    <div className="min-h-screen bg-[#F8F7F4] text-[#1B1B19] flex flex-col font-['Inter'] antialiased selection:bg-[#E15B44] selection:text-white">
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-[#F8F7F4]">
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
              weakSpotsCount={weakSpotQuestions.length}
              isWeakSpotsMode={isWeakSpotsMode}
              onFocusWeakSpots={handleFocusWeakSpots}
            />

            {/* Informational Notification if no questions missed >2x yet */}
            {weakSpotsNotice && (
              <div className="p-4 border border-[rgba(27,27,25,0.2)] bg-white text-[#1B1B19] flex items-start justify-between gap-3 shadow-2xs animate-fade-in">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#E15B44] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-['Space_Mono'] font-bold text-xs uppercase tracking-wider text-[#1B1B19]">Target Weak Spots Notice</h4>
                    <p className="text-xs text-[#1B1B19]/70 mt-1 leading-relaxed">
                      {weakSpotsNotice}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setWeakSpotsNotice(null)}
                  className="p-1 border border-[rgba(27,27,25,0.2)] text-[#1B1B19] hover:bg-[#EFECE6] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Active Targeted Weak Spots Mode Banner */}
            {isWeakSpotsMode && (
              <div className="p-4 sm:p-5 border-2 border-[#E15B44] bg-white text-[#1B1B19] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-9 h-9 border border-[#E15B44] bg-rose-50 flex items-center justify-center text-[#E15B44] shrink-0">
                    <Target className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-['Space_Mono'] font-bold text-xs sm:text-sm uppercase tracking-wider text-[#1B1B19]">
                        Focus Weak Spots Mode Active
                      </h3>
                      <span className="font-['Space_Mono'] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#E15B44] text-white">
                        {weakSpotQuestions.length} Question{weakSpotQuestions.length > 1 ? 's' : ''} Missed &gt; 2x
                      </span>
                    </div>
                    <p className="text-xs text-[#1B1B19]/70 mt-0.5">
                      Targeting recurring mistakes from your study history. Master repeat errors to lock in your 80% passing benchmark!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExitWeakSpots}
                  className="font-['Space_Mono'] px-3.5 py-2 bg-[#1B1B19] hover:bg-[#E15B44] text-white text-xs uppercase tracking-wider font-bold shrink-0 transition-colors cursor-pointer"
                >
                  Exit Weak Spots
                </button>
              </div>
            )}

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
                onOpenMnemonic={() => {
                  if (activeQuestion) {
                    setMnemonicModalData({
                      concept: activeQuestion.explanation.coreConcept || activeQuestion.question,
                      subjectName: selectedSubject.name,
                      subjectId: selectedSubject.id,
                      chapter: activeQuestion.chapter,
                    });
                  }
                }}
                onOpenScienceLab={(specimenId) => setScienceModalSpecimen(specimenId || 'animal-cell')}
                isUnlimitedMode={isUnlimitedMode}
                questionNumber={drillIndex || 1}
                incorrectCountInHistory={activeQuestion ? (incorrectCountByQuestionId[activeQuestion.id] || 0) : 0}
                isWeakSpotsMode={isWeakSpotsMode}
              />
            ) : (
              <div className="p-8 text-center text-[#1B1B19]/60 bg-white border border-[rgba(27,27,25,0.12)]">
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
                onViewPerformanceDashboard={() => setActiveTab('dashboard')}
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

        {/* TAB 3: Academic Performance Dashboard (Recharts Visualizations) */}
        {activeTab === 'dashboard' && (
          <PerformanceDashboard
            history={user?.history || []}
            allQuestions={allQuestions}
            onStartSubjectDrill={(subjectId) => {
              const targetSubj = ALL_SUBJECTS.find((s) => s.id === subjectId);
              if (targetSubj) {
                handleSelectSubject(targetSubj);
                setActiveTab('drill');
              }
            }}
            onOpenMockExam={() => setActiveTab('exam')}
          />
        )}

        {/* TAB 4: Digital Cells & Dissection Science Lab */}
        {activeTab === 'sciences' && (
          <DigitalCellDissectionLab />
        )}

        {/* TAB 5: CLEP Foreign Language Audio Listening Lab */}
        {activeTab === 'audio' && (
          <AudioListeningLab />
        )}

        {/* TAB 6: Question History Tracker */}
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
        onOpenMnemonicStudio={(concept) => {
          if (explainQuestion) {
            const subj = ALL_SUBJECTS.find((s) => s.id === explainQuestion.subjectId);
            setMnemonicModalData({
              concept: concept || explainQuestion.explanation.coreConcept,
              subjectName: subj?.name || 'College Core',
              subjectId: explainQuestion.subjectId,
              chapter: explainQuestion.chapter,
            });
          }
        }}
      />

      {/* Collegiate Mnemonic Generator Studio Modal */}
      <MnemonicGeneratorModal
        isOpen={!!mnemonicModalData}
        onClose={() => setMnemonicModalData(null)}
        defaultConcept={mnemonicModalData?.concept || ''}
        defaultSubjectName={mnemonicModalData?.subjectName || selectedSubject.name}
        defaultSubjectId={mnemonicModalData?.subjectId || selectedSubject.id}
        defaultChapter={mnemonicModalData?.chapter || selectedSubject.chapters[0]}
        onSaveMnemonic={handleSaveMnemonic}
        onClipToNotes={handleClipToNotes}
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

      {/* Digital Cells and Dissection Interactive Specimen Modal */}
      {scienceModalSpecimen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-5xl bg-white border-2 border-[#1B1B19] shadow-2xl max-h-[92vh] overflow-y-auto my-auto">
            <div className="sticky top-0 z-30 flex items-center justify-between p-3.5 bg-[#F8F7F4] border-b-2 border-[#1B1B19]">
              <div className="flex items-center gap-2">
                <span className="font-['Space_Mono'] text-xs uppercase font-bold tracking-wider text-[#1B1B19]">
                  🔬 Digital Cells & Dissection Specimen Lab
                </span>
              </div>
              <button
                type="button"
                onClick={() => setScienceModalSpecimen(null)}
                className="p-1 border border-[#1B1B19] text-[#1B1B19] hover:bg-[#EFECE6] cursor-pointer"
                title="Close Specimen Lab"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 sm:p-6">
              <DigitalCellDissectionLab
                initialSpecimenId={scienceModalSpecimen}
                onExploreComplete={() => setScienceModalSpecimen(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer matching Variation 1 */}
      <footer className="px-4 sm:px-8 py-5 border-t border-[rgba(27,27,25,0.12)] font-['Space_Mono'] text-[10px] sm:text-[11px] uppercase tracking-wider text-[#1B1B19]/60 flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto bg-[#F8F7F4]">
        <span>Grounded in OpenStax Textbooks · 80% Benchmark Standard</span>
        <span>© 2024 CLEP Scholar Engine · All Rights Reserved</span>
      </footer>
    </div>
  );
}

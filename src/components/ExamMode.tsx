import React, { useState, useEffect } from 'react';
import { 
  Timer, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Question, ExamSession, ExamConfig } from '../types';
import { ALL_SUBJECTS } from '../data/subjects';

interface ExamModeProps {
  allQuestions: Question[];
  onFinishExam: (session: ExamSession) => void;
  onOpenExplainForQuestion: (q: Question) => void;
}

export const ExamMode: React.FC<ExamModeProps> = ({
  allQuestions,
  onFinishExam,
  onOpenExplainForQuestion,
}) => {
  const [activeSession, setActiveSession] = useState<ExamSession | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [examConfig, setExamConfig] = useState<ExamConfig>({
    mode: 'full',
    totalQuestions: 200,
    timeLimitMinutes: 120, // 2 hours
    selectedSubjectIds: ALL_SUBJECTS.map((s) => s.id),
  });

  // Timer countdown
  useEffect(() => {
    if (!activeSession || activeSession.isCompleted) return;

    const timer = setInterval(() => {
      setActiveSession((prev) => {
        if (!prev) return null;
        if (prev.timeRemainingSeconds <= 1) {
          clearInterval(timer);
          completeExam(prev);
          return { ...prev, timeRemainingSeconds: 0, isCompleted: true };
        }
        return { ...prev, timeRemainingSeconds: prev.timeRemainingSeconds - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSession?.isCompleted]);

  // Start exam session
  const handleStartExam = () => {
    const eligiblePool = allQuestions.filter((q) =>
      examConfig.selectedSubjectIds.includes(q.subjectId)
    );

    const pool = eligiblePool.length > 0 ? eligiblePool : allQuestions;

    // Shuffle and pick desired count
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selectedQuestions: Question[] = [];
    while (selectedQuestions.length < examConfig.totalQuestions) {
      for (const q of shuffled) {
        if (selectedQuestions.length >= examConfig.totalQuestions) break;
        selectedQuestions.push(q);
      }
    }

    const session: ExamSession = {
      id: `exam-${Date.now()}`,
      startTime: Date.now(),
      timeLimitSeconds: examConfig.timeLimitMinutes * 60,
      timeRemainingSeconds: examConfig.timeLimitMinutes * 60,
      questions: selectedQuestions,
      userAnswers: {},
      flaggedQuestionIds: [],
      isCompleted: false,
    };

    setActiveSession(session);
    setCurrentIdx(0);
  };

  const handleSelectAnswer = (optionId: string) => {
    if (!activeSession || activeSession.isCompleted) return;
    const currentQ = activeSession.questions[currentIdx];
    setActiveSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        userAnswers: {
          ...prev.userAnswers,
          [currentQ.id]: optionId,
        },
      };
    });
  };

  const handleToggleFlag = (questionId: string) => {
    if (!activeSession) return;
    setActiveSession((prev) => {
      if (!prev) return null;
      const isFlagged = prev.flaggedQuestionIds.includes(questionId);
      return {
        ...prev,
        flaggedQuestionIds: isFlagged
          ? prev.flaggedQuestionIds.filter((id) => id !== questionId)
          : [...prev.flaggedQuestionIds, questionId],
      };
    });
  };

  const completeExam = (sessionToComplete?: ExamSession) => {
    const session = sessionToComplete || activeSession;
    if (!session) return;

    let correctCount = 0;
    const subjectBreakdown: Record<string, { total: number; correct: number }> = {};

    session.questions.forEach((q) => {
      const userAns = session.userAnswers[q.id];
      const isRight = userAns === q.correctOptionId;
      if (isRight) correctCount++;

      if (!subjectBreakdown[q.subjectId]) {
        subjectBreakdown[q.subjectId] = { total: 0, correct: 0 };
      }
      subjectBreakdown[q.subjectId].total += 1;
      if (isRight) {
        subjectBreakdown[q.subjectId].correct += 1;
      }
    });

    const percentage = Math.round((correctCount / session.questions.length) * 100);
    const isPassing = percentage >= 80;

    const completedSession: ExamSession = {
      ...session,
      isCompleted: true,
      score: {
        total: session.questions.length,
        correct: correctCount,
        percentage,
        likelyPassing: isPassing,
        subjectBreakdown,
      },
    };

    setActiveSession(completedSession);
    setShowSubmitConfirm(false);
    onFinishExam(completedSession);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Setup / Launcher Screen
  if (!activeSession) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in text-[#1B1B19] font-['Inter']">
        <div className="bg-white border border-[rgba(27,27,25,0.15)] p-6 sm:p-10 shadow-sm">
          <div className="flex items-start justify-between pb-5 mb-6 border-b border-[rgba(27,27,25,0.1)] gap-4">
            <div>
              <div className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.15em] text-[#E15B44] font-bold">
                Standardized Evaluation
              </div>
              <h2 className="font-['Space_Mono'] text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#1B1B19] flex items-center gap-2 mt-1">
                <Timer className="w-6 h-6 text-[#E15B44]" />
                <span>CLEP Timed Mock Examination Engine</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#1B1B19]/70 mt-1">
                Simulate official testing conditions. Questions are randomized across chosen OpenStax curricula with a rigorous <strong>80% passing benchmark</strong>.
              </p>
            </div>

            <div className="hidden sm:block text-right">
              <span className="font-['Space_Mono'] text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 border border-emerald-300 block">
                Benchmark: ≥80% Passing
              </span>
            </div>
          </div>

          {/* Preset Formats */}
          <div className="mb-6">
            <label className="block font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19] font-bold mb-2">
              Select Exam Format Preset:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() =>
                  setExamConfig({
                    ...examConfig,
                    mode: 'full',
                    totalQuestions: 200,
                    timeLimitMinutes: 120,
                  })
                }
                className={`p-4 border text-left transition-all cursor-pointer ${
                  examConfig.totalQuestions === 200
                    ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                    : 'bg-white border-[rgba(27,27,25,0.15)] hover:bg-[#EFECE6] text-[#1B1B19]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-['Space_Mono'] text-[10px] uppercase font-bold ${examConfig.totalQuestions === 200 ? 'text-[#E15B44]' : 'text-[#1B1B19]/60'}`}>
                    Marathon Mode
                  </span>
                  <span className={`font-['Space_Mono'] text-[9px] uppercase px-1.5 py-0.2 border ${examConfig.totalQuestions === 200 ? 'border-white/30 text-white' : 'border-[#1B1B19]/20'}`}>
                    CLEP Full
                  </span>
                </div>
                <div className="font-['Space_Mono'] text-lg font-bold mb-0.5">200 Questions</div>
                <div className={`text-xs ${examConfig.totalQuestions === 200 ? 'text-slate-300' : 'text-[#1B1B19]/60'}`}>
                  2 Hour Limit (120 min)
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setExamConfig({
                    ...examConfig,
                    mode: 'standard',
                    totalQuestions: 90,
                    timeLimitMinutes: 90,
                  })
                }
                className={`p-4 border text-left transition-all cursor-pointer ${
                  examConfig.totalQuestions === 90
                    ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                    : 'bg-white border-[rgba(27,27,25,0.15)] hover:bg-[#EFECE6] text-[#1B1B19]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-['Space_Mono'] text-[10px] uppercase font-bold ${examConfig.totalQuestions === 90 ? 'text-[#E15B44]' : 'text-[#1B1B19]/60'}`}>
                    Standard Exam
                  </span>
                  <span className={`font-['Space_Mono'] text-[9px] uppercase px-1.5 py-0.2 border ${examConfig.totalQuestions === 90 ? 'border-white/30 text-white' : 'border-[#1B1B19]/20'}`}>
                    Medium
                  </span>
                </div>
                <div className="font-['Space_Mono'] text-lg font-bold mb-0.5">90 Questions</div>
                <div className={`text-xs ${examConfig.totalQuestions === 90 ? 'text-slate-300' : 'text-[#1B1B19]/60'}`}>
                  90 Minute Limit
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setExamConfig({
                    ...examConfig,
                    mode: 'diagnostic',
                    totalQuestions: 25,
                    timeLimitMinutes: 25,
                  })
                }
                className={`p-4 border text-left transition-all cursor-pointer ${
                  examConfig.totalQuestions === 25
                    ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                    : 'bg-white border-[rgba(27,27,25,0.15)] hover:bg-[#EFECE6] text-[#1B1B19]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-['Space_Mono'] text-[10px] uppercase font-bold ${examConfig.totalQuestions === 25 ? 'text-[#E15B44]' : 'text-[#1B1B19]/60'}`}>
                    Sprint Diagnostic
                  </span>
                  <span className={`font-['Space_Mono'] text-[9px] uppercase px-1.5 py-0.2 border ${examConfig.totalQuestions === 25 ? 'border-white/30 text-white' : 'border-[#1B1B19]/20'}`}>
                    Fast Check
                  </span>
                </div>
                <div className="font-['Space_Mono'] text-lg font-bold mb-0.5">25 Questions</div>
                <div className={`text-xs ${examConfig.totalQuestions === 25 ? 'text-slate-300' : 'text-[#1B1B19]/60'}`}>
                  25 Minute Sprint
                </div>
              </button>
            </div>
          </div>

          {/* Subject Filter */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <label className="font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19] font-bold">
                Subjects Tested ({examConfig.selectedSubjectIds.length}/{ALL_SUBJECTS.length}):
              </label>
              <button
                type="button"
                onClick={() =>
                  setExamConfig({
                    ...examConfig,
                    selectedSubjectIds:
                      examConfig.selectedSubjectIds.length === ALL_SUBJECTS.length
                        ? [ALL_SUBJECTS[0].id]
                        : ALL_SUBJECTS.map((s) => s.id),
                  })
                }
                className="font-['Space_Mono'] text-[10px] uppercase text-[#1B1B19] underline hover:text-[#E15B44] cursor-pointer"
              >
                {examConfig.selectedSubjectIds.length === ALL_SUBJECTS.length
                  ? 'Deselect All'
                  : 'Select All Subjects'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {ALL_SUBJECTS.map((sub) => {
                const isChecked = examConfig.selectedSubjectIds.includes(sub.id);
                return (
                  <div
                    key={sub.id}
                    onClick={() => {
                      const updated = isChecked
                        ? examConfig.selectedSubjectIds.filter((id) => id !== sub.id)
                        : [...examConfig.selectedSubjectIds, sub.id];
                      if (updated.length > 0) {
                        setExamConfig({ ...examConfig, selectedSubjectIds: updated });
                      }
                    }}
                    className={`p-3 border text-xs cursor-pointer transition-colors flex items-center justify-between ${
                      isChecked
                        ? 'bg-white border-[#1B1B19] text-[#1B1B19] font-medium shadow-2xs'
                        : 'bg-[#F8F7F4] border-[rgba(27,27,25,0.12)] text-[#1B1B19]/60 hover:bg-[#EFECE6]'
                    }`}
                  >
                    <span className="truncate">{sub.name}</span>
                    <span className="font-['Space_Mono'] text-[10px] text-[#E15B44] font-bold">
                      {isChecked ? '✓' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Start Exam Button */}
          <button
            type="button"
            onClick={handleStartExam}
            className="w-full py-4 font-['Space_Mono'] bg-[#1B1B19] hover:bg-[#E15B44] text-white text-xs sm:text-sm font-bold uppercase tracking-wider border border-[#1B1B19] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Begin Official CLEP Mock Exam ({examConfig.totalQuestions} Questions • {examConfig.timeLimitMinutes} Mins)</span>
          </button>
        </div>
      </div>
    );
  }

  // Active Exam Interface
  const currentQ = activeSession.questions[currentIdx];
  const currentAnswer = activeSession.userAnswers[currentQ.id];
  const isFlagged = activeSession.flaggedQuestionIds.includes(currentQ.id);
  const answeredCount = Object.keys(activeSession.userAnswers).length;
  const isLowTime = activeSession.timeRemainingSeconds < 300;

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in text-[#1B1B19] font-['Inter']">
      {/* Exam Header & Live Countdown Timer */}
      <div className="bg-[#F8F7F4] border-2 border-[#1B1B19] p-4 flex flex-wrap items-center justify-between gap-4 sticky top-20 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="font-['Space_Mono'] text-xs uppercase tracking-wider text-[#1B1B19]/70">
            Question <strong className="text-[#1B1B19] text-sm">{currentIdx + 1}</strong> of {activeSession.questions.length}
          </div>
          <span className="text-[#1B1B19]/30">|</span>
          <div className="font-['Space_Mono'] text-xs uppercase tracking-wider text-[#1B1B19]/70">
            Answered: <strong className="text-emerald-700">{answeredCount}</strong> / {activeSession.questions.length}
          </div>
        </div>

        {/* Big Live Countdown Timer */}
        <div
          className={`flex items-center gap-2 px-4 py-1.5 font-['Space_Mono'] font-bold text-base border ${
            isLowTime
              ? 'bg-rose-50 border-[#E15B44] text-[#E15B44] animate-pulse'
              : 'bg-white border-[#1B1B19] text-[#1B1B19]'
          }`}
        >
          <Timer className="w-4 h-4" />
          <span>{formatTime(activeSession.timeRemainingSeconds)}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleToggleFlag(currentQ.id)}
            className={`font-['Space_Mono'] flex items-center gap-1.5 px-3 py-1.5 border text-xs uppercase tracking-wider transition-all cursor-pointer ${
              isFlagged
                ? 'bg-amber-100 border-amber-600 text-amber-950 font-bold'
                : 'bg-white border-[#1B1B19] text-[#1B1B19] hover:bg-[#EFECE6]'
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-600' : ''}`} />
            <span>{isFlagged ? 'Flagged' : 'Flag'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSubmitConfirm(true)}
            className="font-['Space_Mono'] px-4 py-1.5 bg-[#1B1B19] hover:bg-[#E15B44] text-white text-xs uppercase tracking-wider font-bold border border-[#1B1B19] transition-all cursor-pointer"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Main Exam Question Card */}
      <div className="bg-white border border-[rgba(27,27,25,0.15)] p-6 sm:p-10 shadow-sm relative">
        <div className="flex items-center justify-between gap-2 pb-3 mb-5 border-b border-[rgba(27,27,25,0.1)]">
          <div className="flex items-center gap-2">
            <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.15em] text-[#E15B44] font-bold">
              {currentQ.chapter}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenExplainForQuestion(currentQ)}
            className="font-['Space_Mono'] flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#1B1B19] hover:text-[#E15B44] underline"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Explain Concept</span>
          </button>
        </div>

        <h3 className="text-xl sm:text-2xl font-semibold text-[#1B1B19] leading-snug mb-6 tracking-tight">
          {currentQ.question}
        </h3>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {currentQ.options.map((opt) => {
            const isSelected = currentAnswer === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => handleSelectAnswer(opt.id)}
                className={`p-4 border cursor-pointer transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-[#EFECE6] border-[#1B1B19] text-[#1B1B19] font-medium'
                    : 'bg-white border-[rgba(27,27,25,0.15)] hover:border-[#1B1B19] hover:bg-[#EFECE6] text-[#1B1B19]'
                }`}
              >
                <span
                  className={`w-6 h-6 border flex items-center justify-center font-['Space_Mono'] text-xs font-bold shrink-0 uppercase ${
                    isSelected ? 'border-[#1B1B19] bg-[#1B1B19] text-white' : 'border-[#1B1B19] bg-white text-[#1B1B19]'
                  }`}
                >
                  {opt.id}
                </span>
                <span className="text-sm sm:text-base leading-relaxed pt-0.2">
                  {opt.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Stepper Navigation */}
        <div className="flex items-center justify-between pt-5 border-t border-[rgba(27,27,25,0.1)]">
          <button
            type="button"
            onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="font-['Space_Mono'] flex items-center gap-1.5 px-4 py-2 border border-[#1B1B19] bg-white hover:bg-[#EFECE6] text-xs uppercase tracking-wider text-[#1B1B19] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="font-['Space_Mono'] text-xs uppercase text-[#1B1B19]/60">
            {currentIdx + 1} / {activeSession.questions.length}
          </span>

          <button
            type="button"
            onClick={() => setCurrentIdx((prev) => Math.min(activeSession.questions.length - 1, prev + 1))}
            disabled={currentIdx === activeSession.questions.length - 1}
            className="font-['Space_Mono'] flex items-center gap-1.5 px-4 py-2 border border-[#1B1B19] bg-[#1B1B19] hover:bg-[#E15B44] text-xs uppercase tracking-wider text-white transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Navigator Drawer */}
      <div className="bg-white border border-[rgba(27,27,25,0.15)] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19] font-bold">
            Question Navigator ({answeredCount}/{activeSession.questions.length} Answered)
          </span>
          <div className="flex items-center gap-3 text-[10px] font-['Space_Mono'] uppercase">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#1B1B19] inline-block" /> Answered
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-amber-400 inline-block" /> Flagged
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#F8F7F4] border border-[#1B1B19] inline-block" /> Unanswered
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
          {activeSession.questions.map((q, idx) => {
            const hasAnswered = !!activeSession.userAnswers[q.id];
            const isFlag = activeSession.flaggedQuestionIds.includes(q.id);
            const isCur = idx === currentIdx;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`w-7 h-7 font-['Space_Mono'] text-[11px] font-bold border transition-all cursor-pointer flex items-center justify-center ${
                  isCur
                    ? 'ring-2 ring-[#E15B44] border-[#E15B44]'
                    : ''
                } ${
                  isFlag
                    ? 'bg-amber-100 border-amber-500 text-amber-950'
                    : hasAnswered
                    ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                    : 'bg-[#F8F7F4] border-[rgba(27,27,25,0.2)] text-[#1B1B19] hover:bg-[#EFECE6]'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border-2 border-[#1B1B19] max-w-md w-full p-6 shadow-2xl text-[#1B1B19]">
            <h3 className="font-['Space_Mono'] text-base font-bold uppercase tracking-tight text-[#1B1B19] mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#E15B44]" />
              <span>Confirm Exam Submission</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#1B1B19]/80 mb-4 leading-relaxed">
              You have answered <strong>{answeredCount}</strong> of <strong>{activeSession.questions.length}</strong> questions.
              {answeredCount < activeSession.questions.length && (
                <span className="block text-[#E15B44] font-semibold mt-1">
                  Warning: You have {activeSession.questions.length - answeredCount} unanswered questions remaining.
                </span>
              )}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="font-['Space_Mono'] px-4 py-2 border border-[rgba(27,27,25,0.2)] text-xs uppercase hover:bg-[#EFECE6] cursor-pointer"
              >
                Keep Reviewing
              </button>
              <button
                type="button"
                onClick={() => completeExam()}
                className="font-['Space_Mono'] px-5 py-2 bg-[#1B1B19] hover:bg-[#E15B44] text-white text-xs uppercase font-bold border border-[#1B1B19] transition-all cursor-pointer"
              >
                Confirm & Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
  HelpCircle,
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
        return {
          ...prev,
          timeRemainingSeconds: prev.timeRemainingSeconds - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSession?.isCompleted]);

  const handleStartExam = () => {
    // Filter questions matching selected subjects
    const pool = allQuestions.filter((q) =>
      examConfig.selectedSubjectIds.includes(q.subjectId)
    );

    // Shuffle pool and slice or repeat to match total questions requested (e.g. 200 questions)
    let selected: Question[] = [];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    if (shuffled.length >= examConfig.totalQuestions) {
      selected = shuffled.slice(0, examConfig.totalQuestions);
    } else {
      // Repeat questions with unique IDs if requested question count is higher
      selected = [...shuffled];
      let counter = 1;
      while (selected.length < examConfig.totalQuestions && shuffled.length > 0) {
        for (const q of shuffled) {
          if (selected.length >= examConfig.totalQuestions) break;
          selected.push({
            ...q,
            id: `${q.id}-dup-${counter++}`,
          });
        }
      }
    }

    const session: ExamSession = {
      id: `exam-${Date.now()}`,
      startTime: Date.now(),
      timeLimitSeconds: examConfig.timeLimitMinutes * 60,
      timeRemainingSeconds: examConfig.timeLimitMinutes * 60,
      questions: selected,
      userAnswers: {},
      flaggedQuestionIds: [],
      isCompleted: false,
    };

    setActiveSession(session);
    setCurrentIdx(0);
  };

  const handleSelectAnswer = (optionId: string) => {
    if (!activeSession) return;
    const qId = activeSession.questions[currentIdx].id;
    setActiveSession({
      ...activeSession,
      userAnswers: {
        ...activeSession.userAnswers,
        [qId]: optionId,
      },
    });
  };

  const handleToggleFlag = (qId: string) => {
    if (!activeSession) return;
    const isFlagged = activeSession.flaggedQuestionIds.includes(qId);
    setActiveSession({
      ...activeSession,
      flaggedQuestionIds: isFlagged
        ? activeSession.flaggedQuestionIds.filter((id) => id !== qId)
        : [...activeSession.flaggedQuestionIds, qId],
    });
  };

  const completeExam = (sessionToComplete = activeSession) => {
    if (!sessionToComplete) return;

    let correctCount = 0;
    const subjectBreakdown: Record<string, { total: number; correct: number }> = {};

    sessionToComplete.questions.forEach((q) => {
      const userAnswer = sessionToComplete.userAnswers[q.id];
      const isRight = userAnswer === q.correctOptionId;
      if (isRight) correctCount++;

      if (!subjectBreakdown[q.subjectId]) {
        subjectBreakdown[q.subjectId] = { total: 0, correct: 0 };
      }
      subjectBreakdown[q.subjectId].total++;
      if (isRight) subjectBreakdown[q.subjectId].correct++;
    });

    const total = sessionToComplete.questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    // User requested: "The 'likely passing' note is my estimate, set at 80% correct."
    const likelyPassing = percentage >= 80;

    const completedSession: ExamSession = {
      ...sessionToComplete,
      isCompleted: true,
      score: {
        total,
        correct: correctCount,
        percentage,
        likelyPassing,
        subjectBreakdown,
      },
    };

    setActiveSession(null);
    onFinishExam(completedSession);
  };

  // Format time remaining
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // If not started, show Exam Configuration Setup
  if (!activeSession) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Official CLEP University Mock Examination
              </h2>
              <p className="text-xs text-slate-400">
                Standard timed testing simulation modeled after official College Board CLEP test-out guidelines.
              </p>
            </div>
          </div>

          {/* Benchmark Warning Callout */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <strong className="text-amber-300 font-semibold block mb-0.5">
                Target Passing Score Benchmark: 80% Correct
              </strong>
              <span>
                CLEP test-out credit requires high accuracy. Our diagnostic algorithm benchmarks
                <strong> 80% or higher</strong> as "Likely Passing" for full college course credit.
              </span>
            </div>
          </div>

          {/* Preset Selection Buttons */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
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
                className={`p-4 rounded-xl border text-left transition-all ${
                  examConfig.totalQuestions === 200
                    ? 'bg-indigo-950/50 border-indigo-500 ring-1 ring-indigo-500 shadow-md'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-indigo-400">Standard Marathon</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    CLEP Full
                  </span>
                </div>
                <div className="text-lg font-bold text-white mb-0.5">200 Questions</div>
                <div className="text-xs text-slate-400">2 Hour Time Limit (120 min)</div>
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
                className={`p-4 rounded-xl border text-left transition-all ${
                  examConfig.totalQuestions === 90
                    ? 'bg-indigo-950/50 border-indigo-500 ring-1 ring-indigo-500 shadow-md'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-indigo-400">Subject CLEP</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                    Medium
                  </span>
                </div>
                <div className="text-lg font-bold text-white mb-0.5">90 Questions</div>
                <div className="text-xs text-slate-400">90 Minute Time Limit</div>
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
                className={`p-4 rounded-xl border text-left transition-all ${
                  examConfig.totalQuestions === 25
                    ? 'bg-indigo-950/50 border-indigo-500 ring-1 ring-indigo-500 shadow-md'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-indigo-400">Quick Diagnostic</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                    Speed
                  </span>
                </div>
                <div className="text-lg font-bold text-white mb-0.5">25 Questions</div>
                <div className="text-xs text-slate-400">25 Minute Sprint</div>
              </button>
            </div>
          </div>

          {/* Subject Filter for Exam */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Subjects Tested in this Mock Exam ({examConfig.selectedSubjectIds.length}/{ALL_SUBJECTS.length}):
              </label>
              <button
                onClick={() =>
                  setExamConfig({
                    ...examConfig,
                    selectedSubjectIds:
                      examConfig.selectedSubjectIds.length === ALL_SUBJECTS.length
                        ? [ALL_SUBJECTS[0].id]
                        : ALL_SUBJECTS.map((s) => s.id),
                  })
                }
                className="text-xs text-indigo-400 hover:underline"
              >
                {examConfig.selectedSubjectIds.length === ALL_SUBJECTS.length ? 'Clear to Single' : 'Select All 20'}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-950/60 rounded-xl border border-slate-800">
              {ALL_SUBJECTS.map((s) => {
                const isChecked = examConfig.selectedSubjectIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      const exists = examConfig.selectedSubjectIds.includes(s.id);
                      const updated = exists
                        ? examConfig.selectedSubjectIds.filter((id) => id !== s.id)
                        : [...examConfig.selectedSubjectIds, s.id];
                      if (updated.length > 0) {
                        setExamConfig({ ...examConfig, selectedSubjectIds: updated });
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      isChecked
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start Exam Button */}
          <button
            onClick={handleStartExam}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <Play className="w-5 h-5 fill-white" />
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
  const isLowTime = activeSession.timeRemainingSeconds < 300; // < 5 minutes

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
      {/* Exam Header & Live Countdown Timer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4 sticky top-16 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="font-mono text-xs text-slate-400">
            Question <strong className="text-white text-sm">{currentIdx + 1}</strong> of {activeSession.questions.length}
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-xs text-slate-400">
            Answered: <strong className="text-emerald-400">{answeredCount}</strong> / {activeSession.questions.length}
          </div>
        </div>

        {/* Big Live Countdown Timer */}
        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-mono font-bold text-base border shadow-inner ${
            isLowTime
              ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
              : 'bg-slate-950 border-slate-700 text-amber-300'
          }`}
        >
          <Timer className="w-4 h-4" />
          <span>{formatTime(activeSession.timeRemainingSeconds)}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleFlag(currentQ.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isFlagged
                ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-400' : ''}`} />
            <span>{isFlagged ? 'Flagged' : 'Flag Question'}</span>
          </button>

          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Main Exam Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between gap-2 pb-3 mb-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {currentQ.chapter}
            </span>
          </div>

          <button
            onClick={() => onOpenExplainForQuestion(currentQ)}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
            title="Open textbook breakdown"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Explain This Concept</span>
          </button>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed mb-6">
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
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500 text-white'
                    : 'bg-slate-800/40 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-200'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center shrink-0 uppercase font-bold ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {opt.id}
                </span>
                <span className="text-xs sm:text-sm leading-relaxed">{opt.text}</span>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => setCurrentIdx((prev) => Math.min(activeSession.questions.length - 1, prev + 1))}
            disabled={currentIdx === activeSession.questions.length - 1}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Grid Navigator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-semibold text-slate-300 uppercase tracking-wider">
            Quick Question Matrix Navigator ({activeSession.questions.length} Questions)
          </span>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Answered
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Flagged
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" /> Unanswered
            </span>
          </div>
        </div>

        <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-1.5 max-h-48 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
          {activeSession.questions.map((q, idx) => {
            const hasAnswer = !!activeSession.userAnswers[q.id];
            const flagged = activeSession.flaggedQuestionIds.includes(q.id);
            const isCurrent = idx === currentIdx;

            let bg = 'bg-slate-800 text-slate-400';
            if (hasAnswer) bg = 'bg-emerald-600/80 text-white font-semibold';
            if (flagged) bg = 'bg-amber-500 text-slate-950 font-bold';
            if (isCurrent) bg += ' ring-2 ring-indigo-400';

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(idx)}
                className={`h-7 rounded text-xs flex items-center justify-center transition-all ${bg}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal to Submit Exam */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Ready to submit exam?</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              You have answered <strong className="text-emerald-400">{answeredCount}</strong> of{' '}
              <strong>{activeSession.questions.length}</strong> questions.
              {answeredCount < activeSession.questions.length && (
                <span className="text-amber-400 block mt-1">
                  Warning: You have {activeSession.questions.length - answeredCount} unanswered questions remaining.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Return to Exam
              </button>
              <button
                onClick={() => completeExam()}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all"
              >
                Confirm & View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

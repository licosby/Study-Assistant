import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  BookOpen, 
  RotateCcw, 
  BarChart3, 
  HelpCircle,
  FileCheck2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ExamSession, Question } from '../types';
import { ALL_SUBJECTS } from '../data/subjects';

interface ExamResultsProps {
  session: ExamSession;
  onRetake: () => void;
  onOpenExplain: (q: Question) => void;
}

export const ExamResults: React.FC<ExamResultsProps> = ({
  session,
  onRetake,
  onOpenExplain,
}) => {
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  if (!session.score) return null;

  const { total, correct, percentage, likelyPassing, subjectBreakdown } = session.score;

  const filteredQuestions = session.questions.filter((q) => {
    const userAnswer = session.userAnswers[q.id];
    const isCorrect = userAnswer === q.correctOptionId;
    if (filter === 'incorrect') return !isCorrect;
    if (filter === 'correct') return isCorrect;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Primary Score Card & 80% Benchmark Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div
          className={`absolute top-0 left-0 right-0 h-2 ${
            likelyPassing
              ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500'
              : 'bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500'
          }`}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Official CLEP Mock Evaluation
              </span>
              <span className="text-xs text-slate-400">
                Completed on {new Date(session.startTime).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Official Diagnostic Score Report
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Grounded in OpenStax college textbook curricula across all evaluated chapters.
            </p>
          </div>

          {/* Big Score Radial/Box */}
          <div className="text-center sm:text-right">
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              {percentage}%
            </div>
            <div className="text-xs font-mono text-slate-400 mt-0.5">
              {correct} of {total} Questions Correct
            </div>
          </div>
        </div>

        {/* LIKELY PASSING NOTE - 80% ESTIMATE BENCHMARK */}
        <div className="pt-6">
          {likelyPassing ? (
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 shadow-lg flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Likely Passing (College Credit Benchmark Met!)
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Score: {percentage}% ≥ 80% Passing Threshold
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 leading-relaxed">
                  Congratulations! Your score meets or exceeds the 80% passing estimate standard.
                  You demonstrate comprehensive collegiate mastery of these subjects and are well-prepared to test out of your university course requirements via CLEP!
                </p>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/50 shadow-lg flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Needs Additional Chapter Review
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Target: 80% Benchmark (Current: {percentage}%)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-amber-200/90 mt-1 leading-relaxed">
                  Our passing estimate requires an 80% correct benchmark to ensure you comfortably test out of college course credits. Review the questions you missed below and use the "Explain This" mini-lessons and clipped notes to close knowledge gaps.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={onRetake}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Take Another Exam / Retake</span>
          </button>
        </div>
      </div>

      {/* Subject-by-Subject Mastery Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <span>Subject Competency Breakdown</span>
        </h3>

        <div className="space-y-3">
          {Object.entries(subjectBreakdown).map(([subId, stats]) => {
            const subject = ALL_SUBJECTS.find((s) => s.id === subId);
            const subPct = Math.round((stats.correct / stats.total) * 100);
            const isSubPassing = subPct >= 80;

            return (
              <div key={subId} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-white">
                    {subject ? subject.name : subId}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">
                      {stats.correct}/{stats.total} correct
                    </span>
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                        isSubPassing
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {subPct}% {isSubPassing ? '✓ Passing' : 'Review'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isSubPassing ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${subPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Question Review List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-indigo-400" />
              <span>Comprehensive Question Review ({filteredQuestions.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any question to view its verified textbook explanation and clip notes.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({session.questions.length})
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filter === 'incorrect'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Missed ({total - correct})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filter === 'correct'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Correct ({correct})
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-3">
          {filteredQuestions.map((q, idx) => {
            const userAnswer = session.userAnswers[q.id];
            const isRight = userAnswer === q.correctOptionId;
            const correctOpt = q.options.find((o) => o.id === q.correctOptionId);
            const userOpt = q.options.find((o) => o.id === userAnswer);

            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border transition-all ${
                  isRight
                    ? 'bg-slate-950/60 border-slate-800'
                    : 'bg-rose-950/20 border-rose-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {isRight ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Q{idx + 1} • {q.chapter}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenExplain(q)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Explain This</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-medium text-white mb-2">
                  {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Your Selected Answer:
                    </span>
                    <span className={isRight ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                      {userOpt ? `${userOpt.id.toUpperCase()}: ${userOpt.text}` : 'Unanswered'}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">
                      Correct Textbook Answer:
                    </span>
                    <span className="text-emerald-300 font-medium">
                      {correctOpt ? `${correctOpt.id.toUpperCase()}: ${correctOpt.text}` : ''}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

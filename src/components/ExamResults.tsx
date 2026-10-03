import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  BookOpen, 
  RotateCcw, 
  BarChart3 
} from 'lucide-react';
import { ExamSession, Question } from '../types';
import { ALL_SUBJECTS } from '../data/subjects';

interface ExamResultsProps {
  session: ExamSession;
  onRetake: () => void;
  onOpenExplain: (q: Question) => void;
  onViewPerformanceDashboard?: () => void;
}

export const ExamResults: React.FC<ExamResultsProps> = ({
  session,
  onRetake,
  onOpenExplain,
  onViewPerformanceDashboard,
}) => {
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct'>('all');

  if (!session.score) return null;

  const { total, correct, percentage, likelyPassing, subjectBreakdown } = session.score;

  const filteredQuestions = session.questions.filter((q) => {
    const userAnswer = session.userAnswers[q.id];
    const isRight = userAnswer === q.correctOptionId;
    if (filter === 'incorrect') return !isRight;
    if (filter === 'correct') return isRight;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in text-[#1B1B19] font-['Inter']">
      {/* Primary Score Card */}
      <div className="bg-white border-2 border-[#1B1B19] p-6 sm:p-10 shadow-sm relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[rgba(27,27,25,0.1)]">
          <div>
            <div className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.15em] text-[#E15B44] font-bold mb-1">
              Official CLEP Simulation Result
            </div>
            <h2 className="font-['Space_Mono'] text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#1B1B19]">
              Academic Performance Report
            </h2>
            <p className="text-xs text-[#1B1B19]/70 mt-1">
              Grounded in OpenStax textbook standards. Benchmark estimate set at <strong>80% correct</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {onViewPerformanceDashboard && (
              <button
                type="button"
                onClick={onViewPerformanceDashboard}
                className="font-['Space_Mono'] flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#EFECE6] text-[#1B1B19] text-xs uppercase tracking-wider font-bold border border-[#1B1B19] transition-all cursor-pointer"
              >
                <BarChart3 className="w-4 h-4 text-[#E15B44]" />
                <span>Score Trends (Charts)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onRetake}
              className="font-['Space_Mono'] flex items-center gap-2 px-5 py-2.5 bg-[#1B1B19] hover:bg-[#E15B44] text-white text-xs uppercase tracking-wider font-bold border border-[#1B1B19] transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Exam</span>
            </button>
          </div>
        </div>

        {/* Primary Numbers & 80% Benchmark */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-5 border border-[rgba(27,27,25,0.15)] bg-[#F8F7F4] flex flex-col justify-between">
            <span className="font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19]/60 font-bold block mb-1">
              Score Percentage
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-['Space_Mono'] text-4xl font-bold text-[#1B1B19]">{percentage}%</span>
              <span className="font-['Space_Mono'] text-xs text-[#1B1B19]/60">({correct}/{total})</span>
            </div>
          </div>

          <div
            className={`p-5 border flex flex-col justify-between ${
              likelyPassing
                ? 'bg-emerald-50 border-emerald-700 text-emerald-950'
                : 'bg-rose-50 border-[#E15B44] text-[#1B1B19]'
            }`}
          >
            <span className="font-['Space_Mono'] text-[10px] uppercase tracking-wider font-bold block mb-1">
              CLEP Credit Standard
            </span>
            <div>
              <div className="font-['Space_Mono'] text-base sm:text-lg font-bold uppercase">
                {likelyPassing ? 'Likely Passing' : 'Needs Review'}
              </div>
              <span className="text-xs opacity-80">
                {likelyPassing ? 'Meets or exceeds 80% benchmark' : 'Below 80% credit benchmark'}
              </span>
            </div>
          </div>

          <div className="p-5 border border-[rgba(27,27,25,0.15)] bg-[#F8F7F4] flex flex-col justify-between">
            <span className="font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19]/60 font-bold block mb-1">
              Passing Benchmark
            </span>
            <div>
              <div className="font-['Space_Mono'] text-xl font-bold text-[#1B1B19]">80% Standard</div>
              <span className="text-xs text-[#1B1B19]/60">Author's estimated passing grade</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Performance Breakdown */}
      {subjectBreakdown && Object.keys(subjectBreakdown).length > 0 && (
        <div className="bg-white border border-[rgba(27,27,25,0.15)] p-6 shadow-sm">
          <div className="font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19] font-bold mb-4 pb-2 border-b border-[rgba(27,27,25,0.1)]">
            Subject-by-Subject Mastery Breakdown
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(subjectBreakdown).map(([subId, stats]) => {
              const sub = ALL_SUBJECTS.find((s) => s.id === subId);
              const subPct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
              const subPass = subPct >= 80;

              return (
                <div key={subId} className="p-3.5 border border-[rgba(27,27,25,0.12)] bg-[#F8F7F4] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#1B1B19] mb-0.5">
                      {sub?.name || subId}
                    </h4>
                    <span className="font-['Space_Mono'] text-[10px] text-[#1B1B19]/60">
                      {stats.correct} / {stats.total} correct
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-['Space_Mono'] text-base font-bold text-[#1B1B19] block">
                      {subPct}%
                    </span>
                    <span className={`font-['Space_Mono'] text-[9px] uppercase font-bold px-1.5 py-0.2 border ${
                      subPass ? 'border-emerald-700 text-emerald-800' : 'border-[#E15B44] text-[#E15B44]'
                    }`}>
                      {subPass ? 'PASS' : 'REVIEW'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Question Review Section */}
      <div className="bg-white border border-[rgba(27,27,25,0.15)] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-[rgba(27,27,25,0.1)]">
          <h3 className="font-['Space_Mono'] text-sm font-bold uppercase tracking-wider text-[#1B1B19]">
            Detailed Question Audit ({filteredQuestions.length} Questions)
          </h3>

          <div className="flex items-center gap-1 bg-[#F8F7F4] p-1 border border-[rgba(27,27,25,0.15)] font-['Space_Mono'] text-[10px] uppercase">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 border transition-all ${
                filter === 'all'
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-transparent text-[#1B1B19] border-transparent'
              }`}
            >
              All ({session.questions.length})
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-3 py-1 border transition-all ${
                filter === 'incorrect'
                  ? 'bg-[#E15B44] text-white border-[#E15B44]'
                  : 'bg-transparent text-[#1B1B19] border-transparent'
              }`}
            >
              Missed ({total - correct})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1 border transition-all ${
                filter === 'correct'
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-transparent text-[#1B1B19] border-transparent'
              }`}
            >
              Correct ({correct})
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const userAnswerId = session.userAnswers[q.id];
            const isRight = userAnswerId === q.correctOptionId;
            const userOpt = q.options.find((o) => o.id === userAnswerId);
            const correctOpt = q.options.find((o) => o.id === q.correctOptionId);

            return (
              <div
                key={q.id}
                className="p-4 sm:p-5 border border-[rgba(27,27,25,0.12)] bg-[#F8F7F4]"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-['Space_Mono'] text-[9px] uppercase font-bold px-1.5 py-0.5 border ${
                      isRight
                        ? 'border-emerald-700 text-emerald-800 bg-emerald-50'
                        : 'border-[#E15B44] text-[#E15B44] bg-rose-50'
                    }`}>
                      {isRight ? '✓ Correct' : '✕ Missed'}
                    </span>
                    <span className="font-['Space_Mono'] text-[10px] uppercase font-bold text-[#E15B44]">
                      {q.chapter}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenExplain(q)}
                    className="font-['Space_Mono'] flex items-center gap-1 text-xs uppercase tracking-wider text-[#1B1B19] hover:text-[#E15B44] underline"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Explain Concept</span>
                  </button>
                </div>

                <h4 className="text-sm sm:text-base font-semibold text-[#1B1B19] mb-3 leading-snug">
                  {q.question}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                  <div className={`p-2.5 border bg-white ${isRight ? 'border-emerald-700' : 'border-[#E15B44]'}`}>
                    <span className="font-['Space_Mono'] text-[9px] uppercase tracking-wider text-[#1B1B19]/60 font-bold block mb-0.5">
                      Your Selected Option:
                    </span>
                    <span className="font-medium text-[#1B1B19]">
                      {userOpt ? `${userOpt.id.toUpperCase()}: ${userOpt.text}` : 'Unanswered'}
                    </span>
                  </div>

                  {!isRight && (
                    <div className="p-2.5 border border-emerald-700 bg-emerald-50/50">
                      <span className="font-['Space_Mono'] text-[9px] uppercase tracking-wider text-emerald-900 font-bold block mb-0.5">
                        Verified Correct Answer:
                      </span>
                      <span className="font-medium text-emerald-950">
                        {correctOpt ? `${correctOpt.id.toUpperCase()}: ${correctOpt.text}` : ''}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#1B1B19]/80 leading-relaxed italic">
                  Takeaway: {q.explanation.keyTakeaway}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

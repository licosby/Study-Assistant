import React, { useState } from 'react';
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Trash2, 
  BookOpen, 
  BarChart3, 
  Calendar, 
  AlertTriangle, 
  Award 
} from 'lucide-react';
import { HistoryItem, Question } from '../types';
import { ALL_SUBJECTS } from '../data/subjects';

interface HistoryTrackerProps {
  history: HistoryItem[];
  allQuestions: Question[];
  onClearHistory: () => void;
  onOpenExplainForQuestion: (q: Question) => void;
}

export const HistoryTracker: React.FC<HistoryTrackerProps> = ({
  history,
  allQuestions,
  onClearHistory,
  onOpenExplainForQuestion,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const totalAnswered = history.length;
  const totalCorrect = history.filter((h) => h.isCorrect).length;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const isLikelyPassing = accuracy >= 80;

  const filteredHistory = history.filter((item) => {
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'correct' && item.isCorrect) ||
      (filterStatus === 'incorrect' && !item.isCorrect);

    const matchesSubject =
      selectedSubjectId === 'all' || item.subjectId === selectedSubjectId;

    const matchesSearch =
      item.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.textbookRef.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSubject && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in text-[#1B1B19] font-['Inter']">
      {/* Top Overview & 80% Benchmark Metrics Bar */}
      <div className="bg-white border border-[rgba(27,27,25,0.15)] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[rgba(27,27,25,0.1)]">
          <div>
            <div className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.15em] text-[#E15B44] font-bold">
              Archived Telemetry
            </div>
            <h2 className="font-['Space_Mono'] text-lg sm:text-xl font-bold uppercase tracking-tight text-[#1B1B19]">
              Comprehensive Question History Tracker
            </h2>
            <p className="text-xs text-[#1B1B19]/70 mt-0.5">
              Verified record of all answered questions with pass/fail benchmarks and textbook explanations.
            </p>
          </div>

          {totalAnswered > 0 && (
            <button
              onClick={onClearHistory}
              className="font-['Space_Mono'] flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider text-[#E15B44] bg-white hover:bg-rose-50 border border-[#E15B44]/40 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
          <div className="p-4 border border-[rgba(27,27,25,0.12)] bg-[#F8F7F4] flex items-center justify-between">
            <div>
              <span className="font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19]/60 font-bold block">
                Total Attempts
              </span>
              <span className="font-['Space_Mono'] text-2xl font-bold text-[#1B1B19]">{totalAnswered}</span>
            </div>
            <BarChart3 className="w-8 h-8 text-[#1B1B19]/20" />
          </div>

          <div className="p-4 border border-[rgba(27,27,25,0.12)] bg-[#F8F7F4] flex items-center justify-between">
            <div>
              <span className="font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19]/60 font-bold block">
                Cumulative Accuracy
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-['Space_Mono'] text-2xl font-bold text-[#1B1B19]">{accuracy}%</span>
                <span className="font-['Space_Mono'] text-xs text-[#1B1B19]/60">({totalCorrect}/{totalAnswered})</span>
              </div>
            </div>
            <div className={`font-['Space_Mono'] px-2 py-1 text-xs font-bold border ${isLikelyPassing ? 'border-emerald-700 bg-emerald-100 text-emerald-900' : 'border-[#E15B44] bg-rose-50 text-[#E15B44]'}`}>
              {isLikelyPassing ? '≥80%' : '<80%'}
            </div>
          </div>

          {/* 80% Passing Indicator Card */}
          <div
            className={`p-4 border flex items-center justify-between ${
              isLikelyPassing
                ? 'bg-emerald-50 border-emerald-700 text-emerald-950'
                : 'bg-rose-50 border-[#E15B44] text-[#1B1B19]'
            }`}
          >
            <div>
              <span className="font-['Space_Mono'] text-[10px] uppercase tracking-wider block mb-0.5 font-bold">
                Credit Readiness
              </span>
              <span className="font-['Space_Mono'] text-xs sm:text-sm font-bold block uppercase">
                {isLikelyPassing ? 'Likely Passing (≥80%)' : 'Needs Review (<80%)'}
              </span>
              <span className="text-[11px] opacity-80">
                {isLikelyPassing ? 'Exceeds test-out standard' : 'Target 80% to earn CLEP credit'}
              </span>
            </div>
            {isLikelyPassing ? (
              <Award className="w-8 h-8 text-emerald-700 shrink-0" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-[#E15B44] shrink-0" />
            )}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-[rgba(27,27,25,0.15)] p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#1B1B19]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past questions or chapters..."
            className="w-full pl-9 pr-3 py-1.5 border border-[rgba(27,27,25,0.2)] bg-[#F8F7F4] text-xs text-[#1B1B19] placeholder-[#1B1B19]/40 focus:outline-none focus:border-[#1B1B19] focus:bg-white font-['Inter']"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[#F8F7F4] p-1 border border-[rgba(27,27,25,0.15)] font-['Space_Mono'] text-[10px] uppercase">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 border transition-all ${
                filterStatus === 'all'
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-transparent text-[#1B1B19] border-transparent hover:border-[rgba(27,27,25,0.2)]'
              }`}
            >
              All ({history.length})
            </button>
            <button
              onClick={() => setFilterStatus('correct')}
              className={`px-3 py-1 border transition-all ${
                filterStatus === 'correct'
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-transparent text-[#1B1B19] border-transparent hover:border-[rgba(27,27,25,0.2)]'
              }`}
            >
              Correct ({totalCorrect})
            </button>
            <button
              onClick={() => setFilterStatus('incorrect')}
              className={`px-3 py-1 border transition-all ${
                filterStatus === 'incorrect'
                  ? 'bg-[#E15B44] text-white border-[#E15B44]'
                  : 'bg-transparent text-[#1B1B19] border-transparent hover:border-[rgba(27,27,25,0.2)]'
              }`}
            >
              Missed ({totalAnswered - totalCorrect})
            </button>
          </div>

          {/* Subject Dropdown */}
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="px-3 py-1.5 border border-[rgba(27,27,25,0.2)] bg-[#F8F7F4] text-xs font-['Space_Mono'] uppercase text-[#1B1B19] focus:outline-none focus:border-[#1B1B19]"
          >
            <option value="all">All Subjects</option>
            {ALL_SUBJECTS.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="bg-white border border-[rgba(27,27,25,0.15)] p-12 text-center text-[#1B1B19]/60">
            <History className="w-10 h-10 mx-auto text-[#1B1B19]/30 mb-3" />
            <h4 className="font-['Space_Mono'] text-sm font-bold uppercase text-[#1B1B19] mb-1">No Practice History Recorded</h4>
            <p className="text-xs max-w-sm mx-auto">
              Start answering questions in Chapter Drill or CLEP Mock Exam mode. Every attempt will be recorded here with textbook citations.
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => {
            const subject = ALL_SUBJECTS.find((s) => s.id === item.subjectId);
            const originalQ = allQuestions.find((q) => q.id === item.questionId);

            return (
              <div
                key={item.id}
                className="bg-white border border-[rgba(27,27,25,0.15)] hover:border-[#1B1B19] p-4 sm:p-5 transition-all shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-['Space_Mono'] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${
                      item.isCorrect
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-rose-50 text-[#E15B44] border-rose-300'
                    }`}>
                      {item.isCorrect ? '✓ Correct' : '✕ Missed'}
                    </span>
                    <span className="font-['Space_Mono'] text-[10px] uppercase font-bold text-[#E15B44]">
                      {subject?.name || 'College Core'}
                    </span>
                    <span className="text-[#1B1B19]/30 font-['Space_Mono']">/</span>
                    <span className="font-['Space_Mono'] text-[10px] uppercase text-[#1B1B19]/60">{item.chapter}</span>
                    <span className="font-['Space_Mono'] text-[9px] uppercase px-1.5 py-0.2 bg-[#F8F7F4] border border-[rgba(27,27,25,0.15)] text-[#1B1B19]/70">
                      {item.mode === 'exam' ? 'Mock Exam' : 'Chapter Drill'}
                    </span>
                  </div>

                  <div className="font-['Space_Mono'] text-[10px] text-[#1B1B19]/50 flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                <h4 className="text-sm sm:text-base font-semibold text-[#1B1B19] mb-3 leading-snug">
                  {item.questionText}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                  <div className={`p-2.5 border ${item.isCorrect ? 'border-emerald-700 bg-emerald-50/50' : 'border-[#E15B44] bg-rose-50/50'}`}>
                    <span className="font-['Space_Mono'] text-[9px] uppercase tracking-wider text-[#1B1B19]/60 font-bold block mb-0.5">
                      Your Response:
                    </span>
                    <span className="font-medium text-[#1B1B19]">{item.selectedOptionText}</span>
                  </div>

                  {!item.isCorrect && (
                    <div className="p-2.5 border border-emerald-700 bg-emerald-50/50">
                      <span className="font-['Space_Mono'] text-[9px] uppercase tracking-wider text-emerald-900 font-bold block mb-0.5">
                        Verified Correct Answer:
                      </span>
                      <span className="font-medium text-emerald-950">{item.correctOptionText}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[rgba(27,27,25,0.08)]">
                  <span className="font-['Space_Mono'] text-[10px] uppercase text-[#1B1B19]/60">
                    Source: <span className="font-bold text-[#1B1B19]">{item.textbookRef}</span>
                  </span>

                  {originalQ && (
                    <button
                      type="button"
                      onClick={() => onOpenExplainForQuestion(originalQ)}
                      className="font-['Space_Mono'] self-start sm:self-auto flex items-center gap-1.5 px-3 py-1 border border-[#1B1B19] bg-white hover:bg-[#EFECE6] text-xs uppercase tracking-wider font-semibold text-[#1B1B19] transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Review Concept Breakdown</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Trash2, 
  BookOpen, 
  Filter,
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
  // User requested: "The 'likely passing' note is my estimate, set at 80% correct."
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
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Top Overview & 80% Benchmark Metrics Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <History className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">
                Comprehensive Question History Tracker
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Synchronized log of all answered questions with pass/fail tracking and full explanations.
            </p>
          </div>

          {totalAnswered > 0 && (
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Total Attempts
              </span>
              <span className="text-2xl font-black text-white">{totalAnswered}</span>
            </div>
            <BarChart3 className="w-8 h-8 text-indigo-400/40" />
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Cumulative Accuracy
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{accuracy}%</span>
                <span className="text-xs text-slate-400">({totalCorrect}/{totalAnswered})</span>
              </div>
            </div>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${isLikelyPassing ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
              80%
            </div>
          </div>

          {/* 80% Passing Indicator Card */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isLikelyPassing
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
            }`}
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider block mb-0.5">
                Credit Readiness
              </span>
              <span className="text-sm font-bold block">
                {isLikelyPassing ? 'Likely Passing (≥80%)' : 'Needs Review (<80%)'}
              </span>
              <span className="text-[11px] opacity-80">
                {isLikelyPassing ? 'Exceeds test-out benchmark' : 'Target 80% to earn CLEP credit'}
              </span>
            </div>
            {isLikelyPassing ? (
              <Award className="w-8 h-8 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
            )}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past questions or chapters..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({history.length})
            </button>
            <button
              onClick={() => setFilterStatus('correct')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterStatus === 'correct'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Correct ({totalCorrect})
            </button>
            <button
              onClick={() => setFilterStatus('incorrect')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterStatus === 'incorrect'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Missed ({totalAnswered - totalCorrect})
            </button>
          </div>

          {/* Subject Dropdown */}
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            <History className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <h4 className="text-base font-bold text-white mb-1">No Practice History Recorded</h4>
            <p className="text-xs max-w-sm mx-auto">
              Start answering questions in Chapter Drill or CLEP Mock Exam mode. Every response will be logged here with verified explanations.
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => {
            const subject = ALL_SUBJECTS.find((s) => s.id === item.subjectId);
            const originalQ = allQuestions.find((q) => q.id === item.questionId);

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  item.isCorrect
                    ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    : 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50'
                }`}
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${
                        item.isCorrect
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {item.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </>
                      )}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {subject ? subject.name : item.subjectId}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">{item.chapter}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {/* Explain That Feature Next to Each Question in History */}
                    {originalQ && (
                      <button
                        onClick={() => onOpenExplainForQuestion(originalQ)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Explain That</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Question */}
                <p className="text-xs sm:text-sm font-semibold text-white mb-3">
                  {item.questionText}
                </p>

                {/* Answer Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Your Answer:
                    </span>
                    <span className={item.isCorrect ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                      {item.selectedOptionId.toUpperCase()}: {item.selectedOptionText}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">
                      Correct Verified Answer:
                    </span>
                    <span className="text-emerald-300 font-medium">
                      {item.correctOptionId.toUpperCase()}: {item.correctOptionText}
                    </span>
                  </div>
                </div>

                <div className="pt-2 mt-2 text-[11px] text-slate-500 font-mono">
                  Reference: {item.textbookRef}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

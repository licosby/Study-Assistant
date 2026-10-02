import React, { useState } from 'react';
import { 
  Check, 
  Layers, 
  Search, 
  BookMarked, 
  Sparkles,
  CheckSquare,
  Square,
  Play
} from 'lucide-react';
import { ALL_SUBJECTS, CATEGORIES } from '../data/subjects';
import { Subject, SubjectCategory } from '../types';

interface SubjectSelectorProps {
  selectedSubject: Subject;
  onSelectSubject: (subject: Subject) => void;
  selectedChapters: string[];
  onToggleChapter: (chapter: string) => void;
  onSelectAllChapters: () => void;
  onClearChapters: () => void;
  isUnlimitedMode: boolean;
  onToggleUnlimitedMode: (unlimited: boolean) => void;
  onStartPractice: () => void;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  selectedSubject,
  onSelectSubject,
  selectedChapters,
  onToggleChapter,
  onSelectAllChapters,
  onClearChapters,
  isUnlimitedMode,
  onToggleUnlimitedMode,
  onStartPractice,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SubjectCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubjects = ALL_SUBJECTS.filter((sub) => {
    const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;
    const matchesSearch =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.textbook.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.chapters.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-thin">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            selectedCategory === 'All'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          All Subjects ({ALL_SUBJECTS.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative mb-5">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search subjects, OpenStax textbooks, or specific chapters..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Grid: Subject Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 max-h-72 overflow-y-auto pr-1">
        {filteredSubjects.map((sub) => {
          const isCurrent = sub.id === selectedSubject.id;
          return (
            <div
              key={sub.id}
              onClick={() => onSelectSubject(sub)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all text-left flex flex-col justify-between ${
                isCurrent
                  ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500 shadow-md'
                  : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                    {sub.category}
                  </span>
                  {isCurrent && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white mb-1 leading-snug">{sub.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">{sub.description}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium pt-2 border-t border-slate-800">
                <BookMarked className="w-3.5 h-3.5" />
                <span className="truncate">{sub.textbook}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Subject Chapters Configuration Panel */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">{selectedSubject.name}</h4>
              <span className="text-xs text-indigo-400 font-mono">({selectedChapters.length} / {selectedSubject.chapters.length} chapters selected)</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Source: <span className="text-slate-200 font-medium">{selectedSubject.textbook}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onSelectAllChapters}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Select All Chapters
            </button>
            <button
              onClick={onClearChapters}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Chapter Selection Pills / Multi-select */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 max-h-48 overflow-y-auto pr-1">
          {selectedSubject.chapters.map((ch) => {
            const isChecked = selectedChapters.includes(ch);
            return (
              <div
                key={ch}
                onClick={() => onToggleChapter(ch)}
                className={`flex items-start gap-2.5 p-2 rounded-lg text-xs cursor-pointer border transition-colors ${
                  isChecked
                    ? 'bg-indigo-950/50 border-indigo-500/60 text-slate-100 font-medium'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                )}
                <span>{ch}</span>
              </div>
            );
          })}
        </div>

        {/* Practice Options Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Unlimited questions toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleUnlimitedMode(!isUnlimitedMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                isUnlimitedMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unlimited Drill Mode</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isUnlimitedMode ? 'bg-amber-500/30 text-amber-200' : 'bg-slate-700 text-slate-400'}`}>
                {isUnlimitedMode ? 'ON' : 'OFF'}
              </span>
            </button>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              {isUnlimitedMode ? 'Endless questions on chosen chapters' : 'Standard question set'}
            </span>
          </div>

          {/* Start Drill Button */}
          <button
            onClick={onStartPractice}
            disabled={selectedChapters.length === 0}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Practice Drill</span>
          </button>
        </div>
      </div>
    </div>
  );
};

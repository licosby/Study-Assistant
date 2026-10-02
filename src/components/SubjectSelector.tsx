import React, { useState } from 'react';
import { 
  Check, 
  Search, 
  BookMarked, 
  Sparkles, 
  CheckSquare, 
  Square, 
  Play,
  Target
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
  weakSpotsCount: number;
  isWeakSpotsMode: boolean;
  onFocusWeakSpots: () => void;
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
  weakSpotsCount,
  isWeakSpotsMode,
  onFocusWeakSpots,
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
    <div className="bg-white border border-[rgba(27,27,25,0.12)] p-5 sm:p-6 shadow-sm text-[#1B1B19]">
      {/* Category Tabs & Label */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[rgba(27,27,25,0.1)]">
        <div>
          <div className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.15em] text-[#1B1B19]/60 font-bold">
            Curriculum & Subjects
          </div>
          <h3 className="font-['Space_Mono'] text-sm sm:text-base font-bold uppercase tracking-tight text-[#1B1B19]">
            Subject Selection
          </h3>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`font-['Space_Mono'] text-[10px] uppercase tracking-wider px-2.5 py-1 border transition-all ${
              selectedCategory === 'All'
                ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:bg-[#EFECE6]'
            }`}
          >
            All ({ALL_SUBJECTS.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`font-['Space_Mono'] text-[10px] uppercase tracking-wider px-2.5 py-1 border transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:bg-[#EFECE6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-5">
        <Search className="w-4 h-4 text-[#1B1B19]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by subject name, OpenStax textbook, or chapter..."
          className="w-full pl-10 pr-4 py-2 border border-[rgba(27,27,25,0.2)] bg-[#F8F7F4] text-xs sm:text-sm text-[#1B1B19] placeholder-[#1B1B19]/40 focus:outline-none focus:border-[#1B1B19] focus:bg-white transition-all font-['Inter']"
        />
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 max-h-72 overflow-y-auto pr-1">
        {filteredSubjects.map((sub) => {
          const isCurrent = sub.id === selectedSubject.id;
          return (
            <div
              key={sub.id}
              onClick={() => onSelectSubject(sub)}
              className={`p-4 border cursor-pointer transition-all text-left flex flex-col justify-between ${
                isCurrent
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-white hover:bg-[#EFECE6] border-[rgba(27,27,25,0.12)] text-[#1B1B19]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-['Space_Mono'] text-[10px] uppercase tracking-[0.15em] ${isCurrent ? 'text-[#E15B44] font-bold' : 'text-[#1B1B19]/60'}`}>
                    {isCurrent ? '● Active · ' : ''}{sub.category}
                  </span>
                  {isCurrent && (
                    <span className="font-['Space_Mono'] text-[9px] uppercase tracking-wider text-[#E15B44] border border-[#E15B44]/40 px-1.5 py-0.2">
                      Selected
                    </span>
                  )}
                </div>
                <h4 className="text-sm sm:text-base font-semibold mb-1 leading-snug">
                  {sub.name}
                </h4>
                <p className={`text-xs line-clamp-2 mb-2 ${isCurrent ? 'text-slate-300' : 'text-[#1B1B19]/70'}`}>
                  {sub.description}
                </p>
              </div>
              <div className={`flex items-center gap-1.5 font-['Space_Mono'] text-[10px] pt-2 border-t ${isCurrent ? 'border-white/20 text-[#E15B44]' : 'border-[rgba(27,27,25,0.1)] text-[#1B1B19]/60'}`}>
                <BookMarked className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{sub.textbook}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Subject Chapters Configuration Panel */}
      <div className="bg-[#F8F7F4] border border-[rgba(27,27,25,0.12)] p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-[rgba(27,27,25,0.1)]">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-['Space_Mono'] text-xs sm:text-sm font-bold uppercase tracking-tight text-[#1B1B19]">
                {selectedSubject.name} — Chapter Coverage
              </h4>
              <span className="font-['Space_Mono'] text-[11px] text-[#E15B44] font-bold">
                ({selectedChapters.length}/{selectedSubject.chapters.length})
              </span>
            </div>
            <p className="text-xs text-[#1B1B19]/70 mt-0.5">
              OpenStax Text: <span className="font-semibold text-[#1B1B19]">{selectedSubject.textbook}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onSelectAllChapters}
              className="font-['Space_Mono'] text-[10px] uppercase tracking-wider px-2.5 py-1 bg-white hover:bg-[#EFECE6] text-[#1B1B19] border border-[#1B1B19] transition-colors"
            >
              Select All
            </button>
            <button
              onClick={onClearChapters}
              className="font-['Space_Mono'] text-[10px] uppercase tracking-wider px-2.5 py-1 bg-white hover:bg-[#EFECE6] text-[#1B1B19]/70 border border-[rgba(27,27,25,0.2)] transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Chapter Multi-select List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 max-h-48 overflow-y-auto pr-1">
          {selectedSubject.chapters.map((ch) => {
            const isChecked = selectedChapters.includes(ch);
            return (
              <div
                key={ch}
                onClick={() => onToggleChapter(ch)}
                className={`flex items-start gap-2.5 p-2 text-xs cursor-pointer border transition-colors ${
                  isChecked
                    ? 'bg-white border-[#1B1B19] text-[#1B1B19] font-medium shadow-2xs'
                    : 'bg-[#F8F7F4] border-[rgba(27,27,25,0.12)] text-[#1B1B19]/70 hover:bg-white hover:text-[#1B1B19]'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-[#E15B44] shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-[#1B1B19]/40 shrink-0 mt-0.5" />
                )}
                <span className="leading-snug">{ch}</span>
              </div>
            );
          })}
        </div>

        {/* Practice Options Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[rgba(27,27,25,0.1)]">
          {/* Unlimited questions toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleUnlimitedMode(!isUnlimitedMode)}
              className={`font-['Space_Mono'] flex items-center gap-2 px-3 py-1.5 border text-xs font-semibold uppercase tracking-wider transition-all ${
                isUnlimitedMode
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-white text-[#1B1B19] border-[#1B1B19] hover:bg-[#EFECE6]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E15B44]" />
              <span>Unlimited Mode</span>
              <span className={`text-[9px] px-1 py-0.2 border ${isUnlimitedMode ? 'border-white text-white' : 'border-[#1B1B19] text-[#1B1B19]'}`}>
                {isUnlimitedMode ? 'ON' : 'OFF'}
              </span>
            </button>
            <span className="font-['Space_Mono'] text-[10px] text-[#1B1B19]/60 uppercase tracking-wider hidden sm:inline">
              {isUnlimitedMode ? 'Continuous generation' : 'Fixed chapter set'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap sm:flex-nowrap">
            {/* Focus Weak Spots Button */}
            <button
              type="button"
              onClick={onFocusWeakSpots}
              className={`font-['Space_Mono'] flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isWeakSpotsMode
                  ? 'bg-[#E15B44] text-white border-[#E15B44]'
                  : weakSpotsCount > 0
                  ? 'bg-white hover:bg-rose-50 text-[#E15B44] border-[#E15B44]'
                  : 'bg-white text-[#1B1B19]/60 border-[rgba(27,27,25,0.2)] hover:border-[#1B1B19]'
              }`}
              title={
                weakSpotsCount > 0
                  ? `Focus on ${weakSpotsCount} questions missed >2x in history`
                  : 'Questions answered incorrectly >2x will automatically appear here'
              }
            >
              <Target className={`w-3.5 h-3.5 ${isWeakSpotsMode ? 'animate-pulse' : ''}`} />
              <span>Focus Weak Spots</span>
              <span
                className={`text-[9px] px-1.5 py-0.5 border font-bold ${
                  isWeakSpotsMode
                    ? 'border-white text-white'
                    : weakSpotsCount > 0
                    ? 'border-[#E15B44] bg-[#E15B44] text-white'
                    : 'border-[rgba(27,27,25,0.2)] text-[#1B1B19]/60'
                }`}
              >
                {weakSpotsCount > 0 ? `${weakSpotsCount} >2X` : '0'}
              </span>
            </button>

            {/* Start Drill Button */}
            <button
              type="button"
              onClick={onStartPractice}
              disabled={selectedChapters.length === 0}
              className="font-['Space_Mono'] flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1B1B19] hover:bg-[#E15B44] hover:border-[#E15B44] text-white text-xs font-bold uppercase tracking-wider border border-[#1B1B19] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start Practice Drill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

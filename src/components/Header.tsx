import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Timer, 
  History, 
  Bookmark, 
  Lightbulb, 
  User as UserIcon,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { UserSessionData } from '../services/api';

interface HeaderProps {
  activeTab: 'drill' | 'exam' | 'history' | 'notes' | 'mnemonics';
  setActiveTab: (tab: 'drill' | 'exam' | 'history' | 'notes' | 'mnemonics') => void;
  user: UserSessionData | null;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
}) => {
  const totalAnswered = user?.stats?.totalAnswered || 0;
  const totalCorrect = user?.stats?.totalCorrect || 0;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const isPassing = accuracy >= 80;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('drill')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  CLEP Scholar
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  OpenStax Core
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                University Core & CLEP Test-Out Mastery Engine
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/50">
            <button
              onClick={() => setActiveTab('drill')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'drill'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Study & Drill
            </button>
            <button
              onClick={() => setActiveTab('exam')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'exam'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              CLEP Mock Exam
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              History ({user?.history?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'notes'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Notebook ({user?.notes?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('mnemonics')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'mnemonics'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              Mnemonics ({user?.mnemonics?.length || 0})
            </button>
          </nav>

          {/* User Account / Device Sync Status */}
          <div className="flex items-center gap-3">
            {totalAnswered > 0 && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
                <span className="text-slate-400">Score:</span>
                <span className="font-bold text-white">{accuracy}%</span>
                <span className="text-slate-500">({totalCorrect}/{totalAnswered})</span>
                {isPassing ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20" title="Estimate benchmark: 80% passing standard">
                    <CheckCircle2 className="w-3 h-3" /> Likely Passing (≥80%)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20" title="Target: 80% passing estimate">
                    <AlertTriangle className="w-3 h-3" /> Target: 80%
                  </span>
                )}
              </div>
            )}

            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
              <div className="text-left">
                <div className="text-white font-medium truncate max-w-[100px] sm:max-w-[120px]">
                  {user ? user.displayName : 'Sign In'}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  {user ? '✓ 3 Devices Synced' : 'Switch Device'}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Subnavigation */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-800 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('drill')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === 'drill' ? 'bg-indigo-600 text-white' : 'text-slate-300'
            }`}
          >
            Study & Drill
          </button>
          <button
            onClick={() => setActiveTab('exam')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === 'exam' ? 'bg-indigo-600 text-white' : 'text-slate-300'
            }`}
          >
            Timed Exam
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === 'history' ? 'bg-indigo-600 text-white' : 'text-slate-300'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === 'notes' ? 'bg-indigo-600 text-white' : 'text-slate-300'
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveTab('mnemonics')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === 'mnemonics' ? 'bg-indigo-600 text-white' : 'text-slate-300'
            }`}
          >
            Mnemonics
          </button>
        </div>
      </div>
    </header>
  );
};

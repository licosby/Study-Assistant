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
  AlertTriangle,
  Microscope,
  Headphones,
  TrendingUp
} from 'lucide-react';
import { UserSessionData } from '../services/api';

interface HeaderProps {
  activeTab: 'drill' | 'exam' | 'dashboard' | 'sciences' | 'audio' | 'history' | 'notes' | 'mnemonics';
  setActiveTab: (tab: 'drill' | 'exam' | 'dashboard' | 'sciences' | 'audio' | 'history' | 'notes' | 'mnemonics') => void;
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
    <header className="bg-[#F8F7F4] border-b-2 border-[#1B1B19] text-[#1B1B19] sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Identity matching Variation 1 */}
          <div className="cursor-pointer" onClick={() => setActiveTab('drill')}>
            <h1 className="font-['Space_Mono'] text-xl sm:text-2xl font-bold tracking-[-0.04em] text-[#1B1B19] uppercase m-0 leading-none">
              CLEP SCHOLAR
            </h1>
            <div className="font-['Space_Mono'] text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-[#1B1B19]/60 font-medium mt-1">
              v 1.2.0 — University Core Study Engine
            </div>
          </div>

          {/* Navigation Tabs - Editorial Monospace Buttons */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setActiveTab('drill')}
              className={`font-['Space_Mono'] text-[11px] uppercase tracking-wider px-3 py-2 border transition-all ${
                activeTab === 'drill'
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-transparent text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:border-[#1B1B19] hover:bg-[#EFECE6]'
              }`}
            >
              Study & Drill
            </button>
            <button
              onClick={() => setActiveTab('exam')}
              className={`font-['Space_Mono'] text-[11px] uppercase tracking-wider px-3 py-2 border transition-all ${
                activeTab === 'exam'
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-transparent text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:border-[#1B1B19] hover:bg-[#EFECE6]'
              }`}
            >
              Mock Exam
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`font-['Space_Mono'] text-[11px] uppercase tracking-wider px-3 py-2 border transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-transparent text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:border-[#1B1B19] hover:bg-[#EFECE6]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#E15B44]" />
              <span>Performance</span>
            </button>
            <button
              onClick={() => setActiveTab('sciences')}
              className={`font-['Space_Mono'] text-[11px] uppercase tracking-wider px-3 py-2 border transition-all flex items-center gap-1.5 ${
                activeTab === 'sciences'
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-transparent text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:border-[#1B1B19] hover:bg-[#EFECE6]'
              }`}
            >
              <Microscope className="w-3.5 h-3.5 text-[#E15B44]" />
              <span>Science Lab</span>
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`font-['Space_Mono'] text-[11px] uppercase tracking-wider px-3 py-2 border transition-all flex items-center gap-1.5 ${
                activeTab === 'audio'
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-transparent text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:border-[#1B1B19] hover:bg-[#EFECE6]'
              }`}
            >
              <Headphones className="w-3.5 h-3.5 text-[#E15B44]" />
              <span>Audio Lab</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`font-['Space_Mono'] text-[11px] uppercase tracking-wider px-3 py-2 border transition-all ${
                activeTab === 'history'
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-transparent text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:border-[#1B1B19] hover:bg-[#EFECE6]'
              }`}
            >
              History ({user?.history?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`font-['Space_Mono'] text-[11px] uppercase tracking-wider px-3 py-2 border transition-all ${
                activeTab === 'notes'
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-transparent text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:border-[#1B1B19] hover:bg-[#EFECE6]'
              }`}
            >
              Notebook ({user?.notes?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('mnemonics')}
              className={`font-['Space_Mono'] text-[11px] uppercase tracking-wider px-3 py-2 border transition-all ${
                activeTab === 'mnemonics'
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-transparent text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:border-[#1B1B19] hover:bg-[#EFECE6]'
              }`}
            >
              Mnemonics ({user?.mnemonics?.length || 0})
            </button>
          </nav>

          {/* User Account / Device Sync Status */}
          <div className="flex items-center gap-3">
            {totalAnswered > 0 && (
              <div 
                onClick={() => setActiveTab('dashboard')}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 border border-[rgba(27,27,25,0.15)] bg-white font-['Space_Mono'] text-xs cursor-pointer hover:border-[#1B1B19] transition-all"
                title="View Performance Dashboard Trends"
              >
                <span className="text-[#1B1B19]/60">Score:</span>
                <span className="font-bold text-[#1B1B19]">{accuracy}%</span>
                <span className="text-[#1B1B19]/50">({totalCorrect}/{totalAnswered})</span>
                {isPassing ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-300">
                    PASSING (≥80%)
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-[#E15B44] bg-rose-50 px-1.5 py-0.5 border border-rose-300">
                    TARGET: 80%
                  </span>
                )}
              </div>
            )}

            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3.5 py-2 border border-[#1B1B19] bg-white hover:bg-[#EFECE6] font-['Space_Mono'] text-xs transition-colors cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#E15B44]" />
              <div className="text-left leading-tight">
                <div className="text-[#1B1B19] font-bold truncate max-w-[110px]">
                  {user ? user.displayName : 'Sign In'}
                </div>
                <div className="text-[9px] text-emerald-700 tracking-wider">
                  {user ? '✓ 3 DEVICES SYNCED' : 'SWITCH DEVICE'}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Subnavigation */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-[rgba(27,27,25,0.1)] overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('drill')}
            className={`px-2.5 py-1 text-[11px] font-['Space_Mono'] uppercase border whitespace-nowrap ${
              activeTab === 'drill' ? 'bg-[#1B1B19] text-white border-[#1B1B19]' : 'border-transparent text-[#1B1B19]'
            }`}
          >
            Study & Drill
          </button>
          <button
            onClick={() => setActiveTab('exam')}
            className={`px-2.5 py-1 text-[11px] font-['Space_Mono'] uppercase border whitespace-nowrap ${
              activeTab === 'exam' ? 'bg-[#1B1B19] text-white border-[#1B1B19]' : 'border-transparent text-[#1B1B19]'
            }`}
          >
            Timed Exam
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1 text-[11px] font-['Space_Mono'] uppercase border whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-[#1B1B19] text-white border-[#1B1B19]' : 'border-transparent text-[#1B1B19]'
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setActiveTab('sciences')}
            className={`px-2.5 py-1 text-[11px] font-['Space_Mono'] uppercase border whitespace-nowrap ${
              activeTab === 'sciences' ? 'bg-[#1B1B19] text-white border-[#1B1B19]' : 'border-transparent text-[#1B1B19]'
            }`}
          >
            Science Lab
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-2.5 py-1 text-[11px] font-['Space_Mono'] uppercase border whitespace-nowrap ${
              activeTab === 'audio' ? 'bg-[#1B1B19] text-white border-[#1B1B19]' : 'border-transparent text-[#1B1B19]'
            }`}
          >
            Audio Lab
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-2.5 py-1 text-[11px] font-['Space_Mono'] uppercase border whitespace-nowrap ${
              activeTab === 'history' ? 'bg-[#1B1B19] text-white border-[#1B1B19]' : 'border-transparent text-[#1B1B19]'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-2.5 py-1 text-[11px] font-['Space_Mono'] uppercase border whitespace-nowrap ${
              activeTab === 'notes' ? 'bg-[#1B1B19] text-white border-[#1B1B19]' : 'border-transparent text-[#1B1B19]'
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveTab('mnemonics')}
            className={`px-2.5 py-1 text-[11px] font-['Space_Mono'] uppercase border whitespace-nowrap ${
              activeTab === 'mnemonics' ? 'bg-[#1B1B19] text-white border-[#1B1B19]' : 'border-transparent text-[#1B1B19]'
            }`}
          >
            Mnemonics
          </button>
        </div>
      </div>
    </header>
  );
};

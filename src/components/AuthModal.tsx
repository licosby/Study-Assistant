import React, { useState } from 'react';
import { X, Smartphone, Laptop, Tablet, CheckCircle, ShieldCheck } from 'lucide-react';
import { UserSessionData } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSessionData | null;
  onLogin: (name: string, username: string, password?: string) => Promise<void>;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [name, setName] = useState(currentUser?.displayName || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please provide a username.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onLogin(name, username, password);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border-2 border-[#1B1B19] max-w-md w-full p-6 sm:p-8 text-[#1B1B19] shadow-2xl relative overflow-hidden">
        <div className="flex items-start justify-between pb-3 mb-4 border-b border-[#1B1B19] gap-3">
          <div>
            <div className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.15em] text-[#E15B44] font-bold">
              Account Architecture
            </div>
            <h3 className="font-['Space_Mono'] text-base sm:text-lg font-bold uppercase tracking-tight text-[#1B1B19] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#E15B44]" />
              <span>Student Profile & 3-Device Sync</span>
            </h3>
            <p className="text-xs text-[#1B1B19]/70 mt-0.5 font-['Inter']">
              Seamlessly persist history, notes, and mnemonics across all 3 registered devices.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-[#1B1B19] text-[#1B1B19] hover:bg-[#EFECE6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Devices Visual Bar */}
        <div className="bg-[#F8F7F4] border border-[rgba(27,27,25,0.15)] p-3 mb-5 flex items-center justify-between text-xs font-['Space_Mono'] uppercase tracking-wider text-[#1B1B19]">
          <div className="flex items-center gap-1.5">
            <Laptop className="w-4 h-4 text-[#1B1B19]" />
            <span>Laptop</span>
          </div>
          <span className="text-[#E15B44] font-bold">⇄</span>
          <div className="flex items-center gap-1.5">
            <Tablet className="w-4 h-4 text-[#1B1B19]" />
            <span>Tablet</span>
          </div>
          <span className="text-[#E15B44] font-bold">⇄</span>
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-[#1B1B19]" />
            <span>Phone</span>
          </div>
        </div>

        {currentUser && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-600 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-950">
              <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Active: <strong>{currentUser.displayName}</strong> (@{currentUser.username})
              </span>
            </div>
            <button
              onClick={onLogout}
              className="font-['Space_Mono'] text-[10px] uppercase text-[#E15B44] hover:underline font-bold ml-2 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-[#E15B44] text-xs text-[#E15B44] font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-['Inter']">
          <div>
            <label className="block font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19] font-bold mb-1">
              Full Name / Academic Callout:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full px-3 py-2 border border-[rgba(27,27,25,0.2)] bg-[#F8F7F4] text-sm text-[#1B1B19] placeholder-[#1B1B19]/40 focus:outline-none focus:border-[#1B1B19] focus:bg-white transition-all font-['Inter']"
            />
          </div>

          <div>
            <label className="block font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19] font-bold mb-1">
              Username (Synchronized Identity):
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. scholar_alex"
              required
              className="w-full px-3 py-2 border border-[rgba(27,27,25,0.2)] bg-[#F8F7F4] text-sm text-[#1B1B19] placeholder-[#1B1B19]/40 focus:outline-none focus:border-[#1B1B19] focus:bg-white transition-all font-['Inter']"
            />
          </div>

          <div>
            <label className="block font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19] font-bold mb-1">
              Passkey / Pin (Optional for Guest Mode):
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-[rgba(27,27,25,0.2)] bg-[#F8F7F4] text-sm text-[#1B1B19] placeholder-[#1B1B19]/40 focus:outline-none focus:border-[#1B1B19] focus:bg-white transition-all font-['Inter']"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="font-['Space_Mono'] px-4 py-2 border border-[rgba(27,27,25,0.2)] text-xs uppercase tracking-wider hover:bg-[#EFECE6] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="font-['Space_Mono'] px-5 py-2 bg-[#1B1B19] hover:bg-[#E15B44] text-white text-xs uppercase tracking-wider font-bold border border-[#1B1B19] transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In & Sync'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

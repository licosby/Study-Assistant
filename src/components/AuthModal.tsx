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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500" />

        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              Student Profile & 3-Device Sync
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Sync your study history, scores, and notes seamlessly across devices.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Devices Visual Pill */}
        <div className="bg-slate-800/80 border border-indigo-500/20 rounded-xl p-3 mb-5 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-indigo-400" />
            <span>Laptop</span>
          </div>
          <span className="text-indigo-400 font-bold">⇄</span>
          <div className="flex items-center gap-2">
            <Tablet className="w-4 h-4 text-emerald-400" />
            <span>Tablet</span>
          </div>
          <span className="text-emerald-400 font-bold">⇄</span>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>Phone</span>
          </div>
        </div>

        {currentUser && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>
                Currently studying as <strong className="text-white">{currentUser.displayName}</strong> (@{currentUser.username})
              </span>
            </div>
            <button
              onClick={onLogout}
              className="text-xs text-rose-400 hover:text-rose-300 hover:underline ml-2"
            >
              Sign Out
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              What is your name?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Lee"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select a Username <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. jordan_clep2026"
              required
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Use this same username on your phone, tablet, and PC to pick up where you left off.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password or Device PIN <span className="text-slate-500 font-normal">(simple device lock)</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password or 4-digit PIN"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Connecting Device...' : 'Save & Sync Across All 3 Devices'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

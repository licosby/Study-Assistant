import React, { useState } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  Trash2, 
  Plus, 
  BrainCircuit, 
  Search, 
  BookOpen,
  Copy,
  Check
} from 'lucide-react';
import { MnemonicItem } from '../types';
import { ALL_SUBJECTS } from '../data/subjects';
import { generateAIMnemonic } from '../services/api';

interface MnemonicVaultProps {
  mnemonics: MnemonicItem[];
  onAddMnemonic: (item: Omit<MnemonicItem, 'id' | 'createdAt'>) => void;
  onDeleteMnemonic: (id: string) => void;
}

export const MnemonicVault: React.FC<MnemonicVaultProps> = ({
  mnemonics,
  onAddMnemonic,
  onDeleteMnemonic,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(ALL_SUBJECTS[0].id);
  const [conceptInput, setConceptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = mnemonics.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.phrase.toLowerCase().includes(q) ||
      m.explanation.toLowerCase().includes(q) ||
      m.concept.toLowerCase().includes(q) ||
      m.breakdown.some((b) => b.toLowerCase().includes(q))
    );
  });

  const handleGenerateAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conceptInput.trim()) return;

    setIsGenerating(true);
    const sub = ALL_SUBJECTS.find((s) => s.id === selectedSubjectId) || ALL_SUBJECTS[0];
    const generated = await generateAIMnemonic(conceptInput, sub.name, sub.chapters[0]);

    if (generated) {
      onAddMnemonic({
        subjectId: selectedSubjectId,
        chapter: sub.chapters[0],
        phrase: generated.phrase,
        breakdown: generated.breakdown || [],
        explanation: generated.explanation,
        concept: conceptInput,
      });
      setConceptInput('');
      setIsCreating(false);
    }
    setIsGenerating(false);
  };

  const handleCopy = (m: MnemonicItem) => {
    const text = `Mnemonic: ${m.phrase}\nConcept: ${m.concept}\n${m.breakdown.join('\n')}\nTip: ${m.explanation}`;
    navigator.clipboard.writeText(text);
    setCopiedId(m.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white">
                Collegiate Mnemonic Vault & Memory Hooks
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              High-yield acronyms, memory devices, and rhymes designed to lock core university concepts into long-term recall.
            </p>
          </div>

          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Mnemonic</span>
          </button>
        </div>

        {/* Creator Drawer */}
        {isCreating && (
          <form onSubmit={handleGenerateAndAdd} className="pt-5 border-b border-slate-800 pb-5 space-y-3 animate-fade-in">
            <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Collegiate Mnemonic Generator</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Subject</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {ALL_SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">What concept do you want a memory aid for?</label>
                <input
                  type="text"
                  value={conceptInput}
                  onChange={(e) => setConceptInput(e.target.value)}
                  placeholder="e.g. Krebs cycle intermediate steps, or Constitutional Articles I-VII, or Spanish Preterite triggers"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold disabled:opacity-50 transition-all"
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Synthesizing Memory Aid...' : 'Generate & Save Mnemonic'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Search */}
        <div className="pt-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mnemonics by phrase or concept..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Grid of Mnemonics */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <Lightbulb className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <h4 className="text-base font-bold text-white mb-1">No Mnemonics Found</h4>
          <p className="text-xs max-w-sm mx-auto">
            Click "Create New Mnemonic" or click "Save Mnemonic" inside any "Explain This" mini-lesson while studying.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const subject = ALL_SUBJECTS.find((s) => s.id === item.subjectId);
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-indigo-500/40 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {subject?.name || item.subjectId}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(item)}
                        className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                        title="Copy mnemonic"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => onDeleteMnemonic(item.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete mnemonic"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Catchy Mnemonic Phrase Banner */}
                  <div className="bg-indigo-950/50 border border-indigo-500/30 rounded-xl p-3 text-center my-3">
                    <span className="text-base font-black tracking-wide text-amber-300">
                      "{item.phrase}"
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-200 mb-2">
                    Concept: <span className="font-normal text-slate-300">{item.concept}</span>
                  </p>

                  {item.breakdown && item.breakdown.length > 0 && (
                    <ul className="text-xs text-slate-300 space-y-1 mb-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800 list-disc list-inside">
                      {item.breakdown.map((line, idx) => (
                        <li key={idx} className="leading-relaxed">{line}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
                  💡 Memory Trigger: {item.explanation}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

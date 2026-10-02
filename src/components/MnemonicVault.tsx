import React, { useState } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  Trash2, 
  Plus, 
  BrainCircuit, 
  Search, 
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
    const text = `MNEMONIC: "${m.phrase}"\nConcept: ${m.concept}\n\nBreakdown:\n${m.breakdown.join('\n')}\n\nMemory Trigger: ${m.explanation}`;
    navigator.clipboard.writeText(text);
    setCopiedId(m.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in text-[#1B1B19] font-['Inter']">
      {/* Header Card */}
      <div className="bg-white border border-[rgba(27,27,25,0.15)] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[rgba(27,27,25,0.1)]">
          <div>
            <div className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.15em] text-[#E15B44] font-bold">
              Cognitive Retention
            </div>
            <h2 className="font-['Space_Mono'] text-lg sm:text-xl font-bold uppercase tracking-tight text-[#1B1B19] flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-[#E15B44]" />
              <span>Collegiate Mnemonic Vault</span>
            </h2>
            <p className="text-xs text-[#1B1B19]/70 mt-0.5">
              High-yield acronyms, rhyming couplets, and memory cues for rapid recall under exam pressure.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreating(!isCreating)}
            className="font-['Space_Mono'] flex items-center gap-2 px-4 py-2 bg-[#1B1B19] hover:bg-[#E15B44] text-white text-xs uppercase tracking-wider font-bold border border-[#1B1B19] transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreating ? 'Cancel' : 'Generate New Mnemonic'}</span>
          </button>
        </div>

        {/* Create Mnemonic Form Drawer */}
        {isCreating && (
          <form onSubmit={handleGenerateAndAdd} className="pt-5 pb-2 space-y-4 border-b border-[rgba(27,27,25,0.1)] animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19] font-bold mb-1">
                  Target Subject Curriculum:
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3 py-2 border border-[rgba(27,27,25,0.2)] bg-[#F8F7F4] text-xs font-['Space_Mono'] uppercase text-[#1B1B19] focus:outline-none focus:border-[#1B1B19]"
                >
                  {ALL_SUBJECTS.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19] font-bold mb-1">
                  Concept / Rule to Memorize:
                </label>
                <input
                  type="text"
                  value={conceptInput}
                  onChange={(e) => setConceptInput(e.target.value)}
                  placeholder="e.g. Constitutional Article order (LEJSASR) or taxonomy ranks..."
                  required
                  className="w-full px-3 py-2 border border-[rgba(27,27,25,0.2)] bg-[#F8F7F4] text-xs text-[#1B1B19] placeholder-[#1B1B19]/40 focus:outline-none focus:border-[#1B1B19] focus:bg-white font-['Inter']"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isGenerating || !conceptInput.trim()}
                className="font-['Space_Mono'] flex items-center gap-2 px-5 py-2 bg-[#1B1B19] hover:bg-[#E15B44] text-white text-xs uppercase tracking-wider font-bold border border-[#1B1B19] transition-all cursor-pointer disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E15B44]" />
                <span>{isGenerating ? 'Synthesizing...' : 'Generate & Save to Vault'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Search */}
        <div className="pt-5">
          <div className="relative">
            <Search className="w-4 h-4 text-[#1B1B19]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mnemonics, phrases, or academic concepts..."
              className="w-full pl-10 pr-4 py-2 border border-[rgba(27,27,25,0.2)] bg-[#F8F7F4] text-xs sm:text-sm text-[#1B1B19] placeholder-[#1B1B19]/40 focus:outline-none focus:border-[#1B1B19] focus:bg-white font-['Inter']"
            />
          </div>
        </div>
      </div>

      {/* Mnemonics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 bg-white border border-[rgba(27,27,25,0.15)] p-12 text-center text-[#1B1B19]/60">
            <Lightbulb className="w-10 h-10 mx-auto text-[#1B1B19]/30 mb-3" />
            <h4 className="font-['Space_Mono'] text-sm font-bold uppercase text-[#1B1B19] mb-1">No Mnemonics Found</h4>
            <p className="text-xs max-w-sm mx-auto">
              Create a custom mnemonic memory aid above or click "Generate Mnemonic" while practicing any difficult question.
            </p>
          </div>
        ) : (
          filtered.map((m) => {
            const subject = ALL_SUBJECTS.find((s) => s.id === m.subjectId);
            const isCopied = copiedId === m.id;

            return (
              <div
                key={m.id}
                className="bg-white border border-[rgba(27,27,25,0.15)] hover:border-[#1B1B19] p-5 flex flex-col justify-between transition-all shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-['Space_Mono'] text-[10px] uppercase font-bold text-[#E15B44]">
                      {subject?.name || 'General Core'} · {m.chapter}
                    </span>
                    <span className="font-['Space_Mono'] text-[10px] text-[#1B1B19]/40">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Catchphrase Banner */}
                  <div className="bg-[#1B1B19] text-white border border-[#1B1B19] p-4 text-center mb-3">
                    <span className="font-['Space_Mono'] text-base sm:text-lg font-bold text-amber-300 tracking-wide block">
                      "{m.phrase}"
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[#1B1B19] mb-2 font-['Inter']">
                    Concept: {m.concept}
                  </p>

                  {/* Breakdown */}
                  {m.breakdown && m.breakdown.length > 0 && (
                    <div className="p-3 bg-[#F8F7F4] border border-[rgba(27,27,25,0.08)] mb-3">
                      <span className="font-['Space_Mono'] text-[9px] uppercase tracking-wider font-bold text-[#1B1B19]/60 block mb-1">
                        Breakdown:
                      </span>
                      <ul className="text-xs text-[#1B1B19] space-y-1 font-['Space_Mono']">
                        {m.breakdown.map((line, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#E15B44] font-bold">↳</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="text-[11px] text-[#1B1B19]/70 italic mb-2">
                    Tip: {m.explanation}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[rgba(27,27,25,0.08)]">
                  <span className="font-['Space_Mono'] text-[9px] uppercase text-[#1B1B19]/40">
                    Syncs to 3 Devices
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(m)}
                      className="font-['Space_Mono'] p-1.5 border border-[rgba(27,27,25,0.2)] text-[#1B1B19] hover:bg-[#EFECE6] text-xs transition-colors cursor-pointer"
                      title="Copy Mnemonic"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteMnemonic(m.id)}
                      className="font-['Space_Mono'] p-1.5 border border-rose-300 text-[#E15B44] hover:bg-rose-50 text-xs transition-colors cursor-pointer"
                      title="Delete Mnemonic"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

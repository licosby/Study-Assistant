import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lightbulb, 
  Sparkles, 
  BrainCircuit, 
  Bookmark, 
  Copy, 
  Check, 
  Zap
} from 'lucide-react';
import { MnemonicItem, StudyNote } from '../types';
import { generateAIMnemonic, GeneratedMnemonic } from '../services/api';

interface MnemonicGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultConcept?: string;
  defaultSubjectName?: string;
  defaultSubjectId?: string;
  defaultChapter?: string;
  onSaveMnemonic: (item: Omit<MnemonicItem, 'id' | 'createdAt'>) => void;
  onClipToNotes?: (note: Omit<StudyNote, 'id' | 'createdAt'>) => void;
}

export const MnemonicGeneratorModal: React.FC<MnemonicGeneratorModalProps> = ({
  isOpen,
  onClose,
  defaultConcept = '',
  defaultSubjectName = 'General College Core',
  defaultSubjectId = 'general',
  defaultChapter = 'General',
  onSaveMnemonic,
  onClipToNotes,
}) => {
  const [concept, setConcept] = useState(defaultConcept);
  const [style, setStyle] = useState<'acronym' | 'acrostic' | 'rhyme' | 'visual_hook'>('acronym');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<GeneratedMnemonic | null>(null);
  const [savedToVault, setSavedToVault] = useState(false);
  const [clippedToNotes, setClippedToNotes] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRecallAnswer, setShowRecallAnswer] = useState(false);
  const [activeRecallTest, setActiveRecallTest] = useState(false);

  useEffect(() => {
    if (defaultConcept) {
      setConcept(defaultConcept);
    }
  }, [defaultConcept, isOpen]);

  if (!isOpen) return null;

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!concept.trim()) return;

    setLoading(true);
    setSavedToVault(false);
    setClippedToNotes(false);
    setActiveRecallTest(false);
    setShowRecallAnswer(false);

    const result = await generateAIMnemonic(concept, defaultSubjectName, defaultChapter, style);
    if (result) {
      setGenerated(result);
    }
    setLoading(false);
  };

  const handleSaveToVault = () => {
    if (!generated) return;
    onSaveMnemonic({
      subjectId: defaultSubjectId,
      chapter: defaultChapter,
      phrase: generated.phrase,
      breakdown: generated.breakdown || [],
      explanation: generated.explanation,
      concept: concept,
    });
    setSavedToVault(true);
    setTimeout(() => setSavedToVault(false), 3000);
  };

  const handleClipToNotes = () => {
    if (!generated || !onClipToNotes) return;
    onClipToNotes({
      subjectId: defaultSubjectId,
      chapter: defaultChapter,
      title: `Mnemonic: ${generated.phrase}`,
      summary: `Concept: ${concept}\n\n${generated.breakdown.join('\n')}\n\nMemory Trigger: ${generated.explanation}`,
      keyTakeaway: generated.retrievalCue || generated.explanation,
      textbookRef: `${defaultSubjectName} - ${defaultChapter}`,
    });
    setClippedToNotes(true);
    setTimeout(() => setClippedToNotes(false), 3000);
  };

  const handleCopy = () => {
    if (!generated) return;
    const text = `MNEMONIC: "${generated.phrase}"\nConcept: ${concept}\n\n${generated.breakdown.join('\n')}\n\nTrigger: ${generated.explanation}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white border-2 border-[#1B1B19] max-w-2xl w-full p-6 sm:p-8 text-[#1B1B19] shadow-2xl relative max-h-[92vh] flex flex-col my-auto overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1B1B19] gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.15em] text-[#E15B44] font-bold">
                Memory Retention Engine
              </span>
              <span className="text-[#1B1B19]/40 font-['Space_Mono'] text-xs">/</span>
              <span className="font-['Space_Mono'] text-[10px] uppercase text-[#1B1B19]/60 truncate max-w-xs">{defaultChapter}</span>
            </div>
            <h3 className="font-['Space_Mono'] text-base sm:text-xl font-bold uppercase tracking-tight text-[#1B1B19]">
              Collegiate Mnemonic Phrase Generator
            </h3>
            <p className="text-xs text-[#1B1B19]/70 mt-0.5 font-['Inter']">
              Transform complex formulas, sequences, and textbook facts into memorable mental hooks.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border border-[#1B1B19] text-[#1B1B19] hover:bg-[#EFECE6] transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-1 py-4 space-y-4 flex-1 scrollbar-thin text-xs sm:text-sm font-['Inter']">
          {/* Concept Input Form */}
          <form onSubmit={handleGenerate} className="space-y-3">
            <div>
              <label className="block font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19] font-bold mb-1">
                Difficult Concept or Fact to Memorize:
              </label>
              <textarea
                rows={2}
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="e.g. 5 stages of mitosis (Prophase, Metaphase, Anaphase, Telophase, Cytokinesis)..."
                required
                className="w-full px-3 py-2 border border-[rgba(27,27,25,0.2)] bg-[#F8F7F4] text-xs sm:text-sm text-[#1B1B19] placeholder-[#1B1B19]/40 focus:outline-none focus:border-[#1B1B19] focus:bg-white transition-all font-['Inter']"
              />
            </div>

            {/* Mnemonic Style Selector Tabs */}
            <div>
              <label className="block font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19] font-bold mb-1.5">
                Choose Mnemonic Technique:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setStyle('acronym')}
                  className={`p-2.5 border text-center transition-all cursor-pointer ${
                    style === 'acronym'
                      ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                      : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.15)] hover:bg-[#EFECE6]'
                  }`}
                >
                  <div className="font-['Space_Mono'] text-xs font-bold uppercase">🔤 Acronym</div>
                  <div className={`text-[10px] font-normal ${style === 'acronym' ? 'text-slate-300' : 'text-[#1B1B19]/60'}`}>e.g. HOMES, OIL RIG</div>
                </button>

                <button
                  type="button"
                  onClick={() => setStyle('acrostic')}
                  className={`p-2.5 border text-center transition-all cursor-pointer ${
                    style === 'acrostic'
                      ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                      : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.15)] hover:bg-[#EFECE6]'
                  }`}
                >
                  <div className="font-['Space_Mono'] text-xs font-bold uppercase">✍️ Acrostic</div>
                  <div className={`text-[10px] font-normal ${style === 'acrostic' ? 'text-slate-300' : 'text-[#1B1B19]/60'}`}>Sequential sentence</div>
                </button>

                <button
                  type="button"
                  onClick={() => setStyle('rhyme')}
                  className={`p-2.5 border text-center transition-all cursor-pointer ${
                    style === 'rhyme'
                      ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                      : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.15)] hover:bg-[#EFECE6]'
                  }`}
                >
                  <div className="font-['Space_Mono'] text-xs font-bold uppercase">🎵 Rhyme</div>
                  <div className={`text-[10px] font-normal ${style === 'rhyme' ? 'text-slate-300' : 'text-[#1B1B19]/60'}`}>Auditory rhythm</div>
                </button>

                <button
                  type="button"
                  onClick={() => setStyle('visual_hook')}
                  className={`p-2.5 border text-center transition-all cursor-pointer ${
                    style === 'visual_hook'
                      ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                      : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.15)] hover:bg-[#EFECE6]'
                  }`}
                >
                  <div className="font-['Space_Mono'] text-xs font-bold uppercase">👁️ Visual</div>
                  <div className={`text-[10px] font-normal ${style === 'visual_hook' ? 'text-slate-300' : 'text-[#1B1B19]/60'}`}>Mental scene</div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !concept.trim()}
              className="w-full py-2.5 px-4 font-['Space_Mono'] bg-[#1B1B19] hover:bg-[#E15B44] text-white text-xs font-bold uppercase tracking-wider border border-[#1B1B19] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40"
            >
              <Sparkles className="w-4 h-4 text-[#E15B44]" />
              <span>{loading ? 'Synthesizing Memory Hook...' : 'Generate Custom Mnemonic'}</span>
            </button>
          </form>

          {/* Generated Result Display */}
          {generated && (
            <div className="space-y-3 pt-2 animate-fade-in">
              {/* Highlighted Banner Phrase */}
              <div className="bg-[#1B1B19] text-white border border-[#1B1B19] p-5 text-center relative">
                <span className="font-['Space_Mono'] text-[10px] uppercase font-bold text-[#E15B44] tracking-[0.15em] block mb-1">
                  Generated Memory Device ({generated.style})
                </span>
                <h4 className="font-['Space_Mono'] text-lg sm:text-2xl font-bold text-amber-300 tracking-wide leading-tight">
                  "{generated.phrase}"
                </h4>

                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 p-1.5 border border-white/30 text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Copy phrase"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Systematic Breakdown */}
              {generated.breakdown && generated.breakdown.length > 0 && (
                <div className="p-4 border border-[rgba(27,27,25,0.15)] bg-[#F8F7F4]">
                  <span className="font-['Space_Mono'] text-[10px] font-bold text-[#1B1B19] uppercase tracking-wider block mb-2">
                    Systematic Fact Mapping:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#1B1B19]">
                    {generated.breakdown.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-white p-2 border border-[rgba(27,27,25,0.08)]">
                        <span className="font-['Space_Mono'] text-xs font-bold text-[#E15B44] shrink-0">
                          [{idx + 1}]
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Memory Trigger & Retrieval Cue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 border border-[rgba(27,27,25,0.15)] bg-white">
                  <div className="flex items-center gap-1.5 text-[#1B1B19] font-['Space_Mono'] font-bold uppercase text-[10px] mb-1">
                    <Zap className="w-3.5 h-3.5 text-[#E15B44]" />
                    <span>Memory Trigger</span>
                  </div>
                  <p className="text-[#1B1B19]/80 leading-relaxed">{generated.explanation}</p>
                </div>

                {generated.retrievalCue && (
                  <div className="p-3.5 border border-[rgba(27,27,25,0.15)] bg-[#EFECE6]">
                    <div className="flex items-center gap-1.5 text-[#1B1B19] font-['Space_Mono'] font-bold uppercase text-[10px] mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#E15B44]" />
                      <span>Exam Recall Cue</span>
                    </div>
                    <p className="text-[#1B1B19]/80 leading-relaxed">{generated.retrievalCue}</p>
                  </div>
                )}
              </div>

              {/* Interactive Self-Test Flashcard */}
              {generated.recallQuestion && (
                <div className="p-4 border border-[rgba(27,27,25,0.15)] bg-[#F8F7F4]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-['Space_Mono'] text-[11px] font-bold uppercase tracking-wider text-[#1B1B19] flex items-center gap-1.5">
                      <BrainCircuit className="w-4 h-4 text-[#E15B44]" />
                      <span>Active Recall Self-Test</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveRecallTest(!activeRecallTest);
                        setShowRecallAnswer(false);
                      }}
                      className="font-['Space_Mono'] text-[10px] uppercase text-[#1B1B19] underline hover:text-[#E15B44]"
                    >
                      {activeRecallTest ? 'Hide Quiz' : 'Test Recall Now'}
                    </button>
                  </div>

                  {activeRecallTest && (
                    <div className="p-3 bg-white border border-[rgba(27,27,25,0.12)] mt-2 space-y-2 animate-fade-in">
                      <div className="text-xs text-[#1B1B19] font-medium">
                        ❓ {generated.recallQuestion}
                      </div>

                      {showRecallAnswer ? (
                        <div className="p-2.5 bg-emerald-50 border border-emerald-600 text-xs text-emerald-950 font-medium animate-fade-in">
                          <strong>Answer:</strong> {generated.recallAnswer}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowRecallAnswer(true)}
                          className="font-['Space_Mono'] px-3 py-1.5 border border-[#1B1B19] bg-[#1B1B19] text-white text-[10px] uppercase tracking-wider hover:bg-[#E15B44]"
                        >
                          Reveal Answer
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        {generated && (
          <div className="pt-4 border-t border-[#1B1B19] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="font-['Space_Mono'] text-[10px] uppercase text-[#1B1B19]/60 hidden sm:inline">
              Syncs to 3 registered devices
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSaveToVault}
                className={`font-['Space_Mono'] flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 border text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  savedToVault
                    ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                    : 'bg-[#1B1B19] text-white border-[#1B1B19] hover:bg-[#E15B44]'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{savedToVault ? '✓ Saved' : 'Save to Vault'}</span>
              </button>

              {onClipToNotes && (
                <button
                  type="button"
                  onClick={handleClipToNotes}
                  className={`font-['Space_Mono'] flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 border text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    clippedToNotes
                      ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                      : 'bg-white text-[#1B1B19] border-[#1B1B19] hover:bg-[#EFECE6]'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{clippedToNotes ? '✓ Clipped' : 'Clip to Notebook'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="font-['Space_Mono'] px-4 py-2 border border-[rgba(27,27,25,0.2)] bg-transparent hover:bg-[#EFECE6] text-[#1B1B19] text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

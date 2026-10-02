import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Bookmark, 
  Lightbulb, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  ExternalLink,
  BrainCircuit,
  BookmarkCheck
} from 'lucide-react';
import { Question, StudyNote, MnemonicItem } from '../types';
import { generateAIMnemonic } from '../services/api';

interface ExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null;
  subjectName: string;
  onClipToNotes: (note: Omit<StudyNote, 'id' | 'createdAt'>) => void;
  onSaveMnemonic: (mnemonic: Omit<MnemonicItem, 'id' | 'createdAt'>) => void;
  isNoteAlreadyClipped?: boolean;
  isMnemonicAlreadySaved?: boolean;
}

export const ExplainModal: React.FC<ExplainModalProps> = ({
  isOpen,
  onClose,
  question,
  subjectName,
  onClipToNotes,
  onSaveMnemonic,
  isNoteAlreadyClipped = false,
  isMnemonicAlreadySaved = false,
}) => {
  const [clipped, setClipped] = useState(isNoteAlreadyClipped);
  const [mnemonicSaved, setMnemonicSaved] = useState(isMnemonicAlreadySaved);
  const [customMnemonic, setCustomMnemonic] = useState<{
    phrase: string;
    breakdown: string[];
    explanation: string;
  } | null>(null);
  const [loadingMnemonic, setLoadingMnemonic] = useState(false);

  if (!isOpen || !question) return null;

  const handleClip = () => {
    onClipToNotes({
      subjectId: question.subjectId,
      chapter: question.chapter,
      title: question.explanation.coreConcept.slice(0, 80) + '...',
      summary: `${question.explanation.coreConcept}\n\nKey Takeaway: ${question.explanation.keyTakeaway}`,
      keyTakeaway: question.explanation.keyTakeaway,
      textbookRef: question.textbookRef,
    });
    setClipped(true);
    setTimeout(() => setClipped(false), 3000);
  };

  const handleGenerateMnemonic = async () => {
    setLoadingMnemonic(true);
    const result = await generateAIMnemonic(
      question.explanation.coreConcept,
      subjectName,
      question.chapter
    );
    if (result) {
      setCustomMnemonic(result);
    }
    setLoadingMnemonic(false);
  };

  const activeMnemonic = customMnemonic || question.defaultMnemonic;
  const breakdownList: string[] = activeMnemonic
    ? ('acronymBreakdown' in activeMnemonic
        ? activeMnemonic.acronymBreakdown
        : 'breakdown' in activeMnemonic
        ? (activeMnemonic as any).breakdown
        : [])
    : [];

  const handleSaveMnemonic = () => {
    if (!activeMnemonic) return;
    onSaveMnemonic({
      subjectId: question.subjectId,
      chapter: question.chapter,
      phrase: activeMnemonic.phrase,
      breakdown: breakdownList,
      explanation: activeMnemonic.explanation,
      concept: question.explanation.coreConcept,
    });
    setMnemonicSaved(true);
    setTimeout(() => setMnemonicSaved(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-5 sm:p-6 text-white shadow-2xl relative max-h-[90vh] flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Textbook Mini-Lesson
              </span>
              <span className="text-xs text-slate-400 truncate max-w-xs">{question.chapter}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
              In-Depth Concept Breakdown & Proof
            </h3>
            <p className="text-xs text-amber-400 font-mono mt-0.5">
              Verified Source: {question.textbookRef}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-1 py-4 space-y-4 flex-1 scrollbar-thin text-xs sm:text-sm">
          {/* Question Recap Box */}
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Question Under Review:
            </span>
            <p className="text-slate-200 font-medium">{question.question}</p>
          </div>

          {/* Core Concept Mini Lesson */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
            <div className="flex items-center gap-2 text-indigo-300 font-bold mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Core Academic Principle</span>
            </div>
            <p className="text-slate-200 leading-relaxed">
              {question.explanation.coreConcept}
            </p>
          </div>

          {/* Textbook Excerpt */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 border-l-4 border-l-amber-500">
            <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block mb-1">
              Textbook Grounding Excerpt:
            </span>
            <p className="text-slate-300 italic text-xs leading-relaxed">
              "{question.explanation.textbookExcerpt}"
            </p>
          </div>

          {/* Why Correct Rationale */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-300 font-bold mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Step-by-Step Proof: Why the Correct Answer is True</span>
            </div>
            <p className="text-slate-200 leading-relaxed">
              {question.explanation.whyCorrect}
            </p>
          </div>

          {/* Distractor Breakdown */}
          {question.explanation.distractorBreakdown && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2 text-slate-300 font-bold mb-2">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Distractor Analysis (Why the other choices are incorrect)</span>
              </div>
              <div className="space-y-2 mt-2">
                {Object.entries(question.explanation.distractorBreakdown).map(([optId, reason]) => (
                  <div key={optId} className="flex items-start gap-2 text-xs">
                    <span className="font-bold uppercase text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 shrink-0">
                      Option {optId}
                    </span>
                    <span className="text-slate-300">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* High Yield Key Takeaway */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 text-xs block">High-Yield CLEP Takeaway:</span>
              <p className="text-slate-200 text-xs mt-0.5">{question.explanation.keyTakeaway}</p>
            </div>
          </div>

          {/* Mnemonic Hook Section */}
          <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-indigo-300 font-bold">
                <BrainCircuit className="w-4 h-4 text-indigo-400" />
                <span>Collegiate Memory Mnemonic</span>
              </div>
              <button
                onClick={handleGenerateMnemonic}
                disabled={loadingMnemonic}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 hover:underline disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loadingMnemonic ? 'Generating...' : 'Regenerate Mnemonic'}</span>
              </button>
            </div>

            {activeMnemonic ? (
              <div>
                <div className="bg-indigo-950/60 border border-indigo-500/30 rounded-lg p-3 text-center mb-2">
                  <span className="text-sm font-extrabold tracking-wide text-amber-300">
                    "{activeMnemonic.phrase}"
                  </span>
                </div>
                {breakdownList.length > 0 && (
                  <ul className="text-xs text-slate-300 space-y-1 mb-2 list-disc list-inside">
                    {breakdownList.map((line: string, i: number) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                )}
                <p className="text-[11px] text-slate-400 italic">
                  Tip: {activeMnemonic.explanation}
                </p>

                <div className="pt-2">
                  <button
                    onClick={handleSaveMnemonic}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      mnemonicSaved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40'
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{mnemonicSaved ? '✓ Saved to Mnemonic Vault' : 'Save Mnemonic to Vault'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Click regenerate to build a custom mnemonic memory aid for this concept.
              </p>
            )}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            Grounded in university curriculum standards
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Clip to Notes Button */}
            <button
              onClick={handleClip}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all ${
                clipped
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
              }`}
            >
              {clipped ? (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Clipped to Notebook!</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Clip to Notes</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Bookmark, 
  Lightbulb, 
  Copy, 
  Check, 
  ExternalLink,
  BrainCircuit
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
  onOpenMnemonicStudio?: (concept: string) => void;
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
  onOpenMnemonicStudio,
}) => {
  const [clipped, setClipped] = useState(isNoteAlreadyClipped);
  const [mnemonicSaved, setMnemonicSaved] = useState(isMnemonicAlreadySaved);
  const [customMnemonic, setCustomMnemonic] = useState<{
    phrase: string;
    breakdown: string[];
    explanation: string;
  } | null>(null);
  const [loadingMnemonic, setLoadingMnemonic] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);

  if (!isOpen || !question) return null;

  const handleClip = () => {
    onClipToNotes({
      subjectId: question.subjectId,
      chapter: question.chapter,
      title: `Concept: ${question.question.slice(0, 50)}...`,
      summary: question.explanation.coreConcept,
      keyTakeaway: question.explanation.keyTakeaway,
      textbookRef: question.textbookRef,
    });
    setClipped(true);
    setTimeout(() => setClipped(false), 3000);
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(question.textbookRef);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white border-2 border-[#1B1B19] max-w-2xl w-full p-6 sm:p-8 text-[#1B1B19] shadow-2xl relative max-h-[92vh] flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1B1B19] gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.15em] text-[#E15B44] font-bold">
                Textbook Mini-Lesson · {subjectName}
              </span>
              <span className="text-[#1B1B19]/40 font-['Space_Mono'] text-xs">/</span>
              <span className="font-['Space_Mono'] text-[10px] uppercase text-[#1B1B19]/60 truncate max-w-xs">{question.chapter}</span>
            </div>
            <h3 className="font-['Space_Mono'] text-base sm:text-xl font-bold uppercase tracking-tight text-[#1B1B19] leading-tight">
              Concept Breakdown & Academic Proof
            </h3>
            <p className="font-['Space_Mono'] text-xs text-[#1B1B19]/70 mt-0.5">
              Verified Source: <span className="font-bold text-[#1B1B19]">{question.textbookRef}</span>
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
          {/* Question Recap Box */}
          <div className="p-4 border border-[rgba(27,27,25,0.15)] bg-[#F8F7F4]">
            <span className="font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19]/60 font-bold block mb-1">
              Question Under Review:
            </span>
            <p className="text-[#1B1B19] font-medium leading-relaxed">{question.question}</p>
          </div>

          {/* Core Concept Mini Lesson */}
          <div className="p-4 border border-[rgba(27,27,25,0.15)] bg-white">
            <div className="flex items-center gap-2 font-['Space_Mono'] text-xs uppercase tracking-wider text-[#1B1B19] font-bold mb-2">
              <BookOpen className="w-4 h-4 text-[#E15B44]" />
              <span>Core Academic Principle</span>
            </div>
            <p className="text-[#1B1B19]/90 leading-relaxed text-sm">
              {question.explanation.coreConcept}
            </p>
          </div>

          {/* Textbook Excerpt */}
          <div className="p-4 border-l-4 border-l-[#E15B44] border border-[rgba(27,27,25,0.12)] bg-[#F8F7F4]">
            <span className="font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#E15B44] font-bold block mb-1">
              OpenStax Textbook Grounding Excerpt:
            </span>
            <p className="italic text-xs sm:text-sm text-[#1B1B19]/80 leading-relaxed">
              "{question.explanation.textbookExcerpt}"
            </p>
          </div>

          {/* Why Correct Rationale */}
          <div className="p-4 border border-emerald-700 bg-emerald-50 text-emerald-950">
            <div className="flex items-center gap-2 font-['Space_Mono'] text-xs uppercase tracking-wider text-emerald-900 font-bold mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Step-by-Step Proof: Why the Correct Option Holds</span>
            </div>
            <p className="text-emerald-950/90 leading-relaxed text-sm">
              {question.explanation.whyCorrect}
            </p>
          </div>

          {/* Distractor Breakdown */}
          {question.explanation.distractorBreakdown && (
            <div className="p-4 border border-[rgba(27,27,25,0.15)] bg-white">
              <div className="flex items-center gap-2 font-['Space_Mono'] text-xs uppercase tracking-wider text-[#1B1B19] font-bold mb-3">
                <XCircle className="w-4 h-4 text-[#E15B44]" />
                <span>Distractor Analysis (Flaws in alternate choices)</span>
              </div>
              <div className="space-y-2">
                {Object.entries(question.explanation.distractorBreakdown).map(([optId, reason]) => (
                  <div key={optId} className="flex items-start gap-2.5 p-2 bg-[#F8F7F4] border border-[rgba(27,27,25,0.08)]">
                    <span className="font-['Space_Mono'] text-xs font-bold uppercase text-[#E15B44] border border-[#E15B44]/40 px-1.5 py-0.2 shrink-0">
                      Option {optId}
                    </span>
                    <span className="text-[#1B1B19]/80 text-xs leading-relaxed">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* High Yield Key Takeaway */}
          <div className="p-4 border border-[#1B1B19] bg-[#EFECE6] text-[#1B1B19]">
            <div className="flex items-center gap-2 font-['Space_Mono'] text-xs uppercase tracking-wider font-bold mb-1 text-[#1B1B19]">
              <Sparkles className="w-4 h-4 text-[#E15B44]" />
              <span>High-Yield CLEP Benchmark Takeaway</span>
            </div>
            <p className="text-xs sm:text-sm text-[#1B1B19]/90 leading-relaxed font-medium">
              {question.explanation.keyTakeaway}
            </p>
          </div>

          {/* Mnemonic Hook Section */}
          <div className="p-5 border-2 border-[#1B1B19] bg-white">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 font-['Space_Mono'] text-xs uppercase tracking-wider font-bold text-[#1B1B19]">
                <BrainCircuit className="w-4 h-4 text-[#E15B44]" />
                <span>Collegiate Memory Mnemonic</span>
              </div>
              <button
                type="button"
                onClick={handleGenerateMnemonic}
                disabled={loadingMnemonic}
                className="font-['Space_Mono'] text-[10px] uppercase tracking-wider px-2 py-1 border border-[#1B1B19] bg-[#F8F7F4] hover:bg-[#EFECE6] transition-colors cursor-pointer disabled:opacity-50"
              >
                {loadingMnemonic ? 'Generating...' : 'Regenerate'}
              </button>
            </div>

            {activeMnemonic ? (
              <div>
                <div className="border border-[#1B1B19] bg-[#1B1B19] text-white p-3 text-center mb-3">
                  <span className="font-['Space_Mono'] text-sm sm:text-base font-bold tracking-wide text-amber-300">
                    "{activeMnemonic.phrase}"
                  </span>
                </div>
                {breakdownList.length > 0 && (
                  <ul className="text-xs text-[#1B1B19] space-y-1 mb-3 font-['Space_Mono']">
                    {breakdownList.map((line: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#E15B44] font-bold">↳</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-[11px] text-[#1B1B19]/70 italic mb-3">
                  Memory Trigger: {activeMnemonic.explanation}
                </p>

                <div className="pt-2 flex items-center gap-2 flex-wrap border-t border-[rgba(27,27,25,0.1)]">
                  <button
                    type="button"
                    onClick={handleSaveMnemonic}
                    className={`font-['Space_Mono'] text-xs uppercase tracking-wider px-3.5 py-1.5 border transition-all cursor-pointer ${
                      mnemonicSaved
                        ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                        : 'bg-[#1B1B19] text-white border-[#1B1B19] hover:bg-[#E15B44]'
                    }`}
                  >
                    {mnemonicSaved ? '✓ Saved to Vault' : 'Save to Vault'}
                  </button>

                  {onOpenMnemonicStudio && (
                    <button
                      type="button"
                      onClick={() => onOpenMnemonicStudio(question.explanation.coreConcept)}
                      className="font-['Space_Mono'] text-xs uppercase tracking-wider px-3.5 py-1.5 border border-[#1B1B19] bg-white hover:bg-[#EFECE6] text-[#1B1B19] transition-all cursor-pointer"
                    >
                      Mnemonic Studio (Acronyms/Rhymes)
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#1B1B19]/60">
                Click regenerate to construct an associative mnemonic aid for this concept.
              </p>
            )}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="pt-4 border-t border-[#1B1B19] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-['Space_Mono'] text-[10px] uppercase text-[#1B1B19]/60">
            OpenStax College Core Framework
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Clip to Notes Button */}
            <button
              type="button"
              onClick={handleClip}
              className={`font-['Space_Mono'] flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 border text-xs uppercase tracking-wider transition-all cursor-pointer ${
                clipped
                  ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                  : 'bg-[#1B1B19] text-white border-[#1B1B19] hover:bg-[#E15B44]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{clipped ? '✓ Clipped' : 'Clip to Notebook'}</span>
            </button>

            {/* Citation Copy Button */}
            <button
              type="button"
              onClick={handleCopyCitation}
              className="font-['Space_Mono'] flex items-center gap-1.5 px-3 py-2 border border-[#1B1B19] bg-white hover:bg-[#EFECE6] text-[#1B1B19] text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              {copiedCitation ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCitation ? 'Copied' : 'Cite'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="font-['Space_Mono'] px-4 py-2 border border-[rgba(27,27,25,0.2)] bg-transparent hover:bg-[#EFECE6] text-[#1B1B19] text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

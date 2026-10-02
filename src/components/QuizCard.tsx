import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  BookOpen, 
  Code, 
  Radio, 
  Hand,
  Target,
  Lightbulb,
  Sparkles,
  Calculator,
  Microscope
} from 'lucide-react';
import { Question } from '../types';
import { ForeignLanguageAudioPlayer } from './ForeignLanguageAudioPlayer';
import { ScientificCalculator } from './ScientificCalculator';
import { SpecimenId } from './DigitalCellDissectionLab';

interface QuizCardProps {
  question: Question;
  subjectName: string;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  showFeedback: boolean;
  onNext: () => void;
  onOpenExplain: () => void;
  onOpenMnemonic?: () => void;
  onOpenScienceLab?: (specimenId?: SpecimenId) => void;
  isUnlimitedMode?: boolean;
  questionNumber?: number;
  totalQuestions?: number;
  incorrectCountInHistory?: number;
  isWeakSpotsMode?: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  subjectName,
  selectedOptionId,
  onSelectOption,
  showFeedback,
  onNext,
  onOpenExplain,
  onOpenMnemonic,
  onOpenScienceLab,
  isUnlimitedMode = false,
  questionNumber,
  totalQuestions,
  incorrectCountInHistory,
  isWeakSpotsMode = false,
}) => {
  const isCorrect = selectedOptionId === question.correctOptionId;
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Determine whether this is a math or quantitative calculation question
  const isMathQuestion = useMemo(() => {
    const sId = question.subjectId.toLowerCase();
    const sName = subjectName.toLowerCase();
    const qText = question.question.toLowerCase();

    const isMathSubject = 
      sId.includes('algebra') ||
      sId.includes('calculus') ||
      sId.includes('precalculus') ||
      sId.includes('stat') ||
      sId.includes('accounting') ||
      sId.includes('math') ||
      sName.includes('algebra') ||
      sName.includes('calculus') ||
      sName.includes('precalculus') ||
      sName.includes('statistics') ||
      sName.includes('mathematics') ||
      sName.includes('accounting');

    const hasMathKeywords = 
      /\b(solve|calculate|equation|integral|derivative|limit|matrix|matrices|variance|standard deviation|probability|log|ln|sin|cos|tan|percentage|depreciation|balance sheet|pv|fv|npv)\b/i.test(qText) ||
      /[\d\+\-\*\/=><%^√∫∑π]/.test(question.question);

    return isMathSubject || hasMathKeywords;
  }, [question.subjectId, subjectName, question.question]);

  // Determine whether this is a biological / physical sciences question
  const isScienceQuestion = useMemo(() => {
    const sId = question.subjectId.toLowerCase();
    const sName = subjectName.toLowerCase();
    const qText = question.question.toLowerCase();

    const isScienceSubject = 
      sId.includes('biology') ||
      sId.includes('anatomy') ||
      sId.includes('chemistry') ||
      sId.includes('science') ||
      sName.includes('biology') ||
      sName.includes('anatomy') ||
      sName.includes('chemistry') ||
      sName.includes('sciences');

    const hasScienceKeywords = 
      /\b(cell|organelle|nucleus|mitochondri|chloroplast|membrane|dissection|heart|atrium|ventricle|aorta|flower|stamen|angiosperm|carpel|ovary|bacteria|prokaryot|lysosome|ribosome|endoplasmic|turgor|cytoplasm)\b/i.test(qText);

    return isScienceSubject || hasScienceKeywords;
  }, [question.subjectId, subjectName, question.question]);

  // Specimen recommendation based on question keywords
  const recommendedSpecimen: SpecimenId = useMemo(() => {
    const qLower = (question.question + ' ' + (question.explanation?.coreConcept || '')).toLowerCase();
    if (qLower.includes('plant') || qLower.includes('chloroplast') || qLower.includes('vacuole') || qLower.includes('cell wall') || qLower.includes('photosynthesis')) {
      return 'plant-cell';
    }
    if (qLower.includes('bacteri') || qLower.includes('prokaryot') || qLower.includes('plasmid') || qLower.includes('peptidoglycan') || qLower.includes('flagell')) {
      return 'bacterium';
    }
    if (qLower.includes('heart') || qLower.includes('atrium') || qLower.includes('ventricle') || qLower.includes('aorta') || qLower.includes('cardio') || qLower.includes('valve') || qLower.includes('circulation')) {
      return 'mammalian-heart';
    }
    if (qLower.includes('flower') || qLower.includes('angiosperm') || qLower.includes('petal') || qLower.includes('stamen') || qLower.includes('carpel') || qLower.includes('ovary') || qLower.includes('pollen')) {
      return 'angiosperm-flower';
    }
    return 'animal-cell';
  }, [question.question, question.explanation]);

  // Keyboard shortcut listener: Alt+C toggles scientific calculator
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        setIsCalculatorOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bg-white border border-[rgba(27,27,25,0.15)] p-6 sm:p-10 shadow-sm relative text-[#1B1B19] transition-all">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[rgba(27,27,25,0.1)]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.15em] text-[#E15B44] font-bold">
            {subjectName}
          </span>
          <span className="text-[11px] text-[#1B1B19]/50 font-['Space_Mono']">/</span>
          <span className="font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19]/60 truncate max-w-xs">
            {question.chapter}
          </span>
          {incorrectCountInHistory !== undefined && incorrectCountInHistory > 2 && (
            <span className="flex items-center gap-1 font-['Space_Mono'] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-rose-50 text-[#E15B44] border border-[#E15B44]/40">
              <Target className="w-3 h-3 text-[#E15B44]" />
              <span>Missed {incorrectCountInHistory}x</span>
            </span>
          )}
        </div>

        {/* Action Tools in Meta Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Calculator Quick Toggle for Math Questions */}
          {isMathQuestion && (
            <button
              type="button"
              onClick={() => setIsCalculatorOpen((prev) => !prev)}
              className={`font-['Space_Mono'] text-[10px] uppercase tracking-wider px-2.5 py-1 border flex items-center gap-1.5 transition-colors cursor-pointer ${
                isCalculatorOpen
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-white hover:bg-[#EFECE6] text-[#1B1B19] border-[#1B1B19]'
              }`}
              title="Toggle CLEP Scientific Calculator (Alt+C)"
            >
              <Calculator className="w-3.5 h-3.5 text-[#E15B44]" />
              <span>{isCalculatorOpen ? 'Calc (Open)' : 'Calculator'}</span>
            </button>
          )}

          {/* Science Lab Quick Launch for Science Questions */}
          {isScienceQuestion && onOpenScienceLab && (
            <button
              type="button"
              onClick={() => onOpenScienceLab(recommendedSpecimen)}
              className="font-['Space_Mono'] text-[10px] uppercase tracking-wider px-2.5 py-1 border border-emerald-700 bg-white hover:bg-emerald-50 text-emerald-900 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Open Digital Cell & Dissection Lab"
            >
              <Microscope className="w-3.5 h-3.5 text-emerald-700" />
              <span>Bio Lab</span>
            </button>
          )}

          {questionNumber !== undefined && (
            <div className="font-['Space_Mono'] text-[11px] uppercase tracking-[0.15em] text-[#1B1B19]/70 font-bold bg-[#F8F7F4] px-2.5 py-1 border border-[rgba(27,27,25,0.12)]">
              Question {String(questionNumber).padStart(2, '0')} {totalQuestions ? `/ ${totalQuestions}` : '(Unlimited)'}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Helper Banner for Math Questions */}
      {isMathQuestion && (
        <div className="mb-5 p-3 sm:p-3.5 bg-[#F8F7F4] border border-[#1B1B19]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-fade-in">
          <div className="flex items-center gap-2.5 text-[#1B1B19]">
            <div className="w-6 h-6 border border-[#1B1B19] bg-white flex items-center justify-center shrink-0">
              <Calculator className="w-3.5 h-3.5 text-[#E15B44]" />
            </div>
            <div>
              <span className="font-['Space_Mono'] text-[11px] uppercase tracking-wider font-bold text-[#1B1B19] block">
                Official CLEP Scientific Calculator Permitted
              </span>
              <span className="text-[11px] text-[#1B1B19]/70">
                Full collegiate keypad: trig functions, logarithms, powers, and calculation tape.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCalculatorOpen((prev) => !prev)}
            className="font-['Space_Mono'] px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider bg-white border border-[#1B1B19] hover:bg-[#1B1B19] hover:text-white transition-colors cursor-pointer shrink-0"
          >
            {isCalculatorOpen ? 'Dock Calculator' : 'Launch Calculator (Alt+C)'}
          </button>
        </div>
      )}

      {/* Interactive Helper Banner for Science Questions */}
      {isScienceQuestion && onOpenScienceLab && (
        <div className="mb-5 p-3 sm:p-3.5 bg-emerald-50/60 border border-emerald-600/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-fade-in">
          <div className="flex items-center gap-2.5 text-emerald-950">
            <div className="w-6 h-6 border border-emerald-700 bg-white flex items-center justify-center shrink-0">
              <Microscope className="w-3.5 h-3.5 text-emerald-700" />
            </div>
            <div>
              <span className="font-['Space_Mono'] text-[11px] uppercase tracking-wider font-bold text-emerald-950 block">
                Digital Cells & Dissection Specimen Available
              </span>
              <span className="text-[11px] text-emerald-900/80">
                Inspect 3D ultrastructure, organelle functions, and anatomical dissection layers.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenScienceLab(recommendedSpecimen)}
            className="font-['Space_Mono'] px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider bg-white border border-emerald-700 text-emerald-900 hover:bg-emerald-700 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            Inspect Specimen
          </button>
        </div>
      )}

      {/* Foreign Language Audio Component */}
      {question.audioDialogue && (
        <div className="mb-6">
          <ForeignLanguageAudioPlayer
            dialogue={question.audioDialogue}
            subjectName={subjectName}
            chapter={question.chapter}
          />
        </div>
      )}

      {/* American Sign Language (ASL) Spatial & Parameter Visual Box */}
      {question.aslNotation && (
        <div className="mb-6 p-4 border border-[rgba(27,27,25,0.12)] bg-[#F8F7F4]">
          <div className="flex items-center gap-2 text-[#1B1B19] font-['Space_Mono'] text-xs uppercase tracking-wider font-bold mb-2">
            <Hand className="w-4 h-4 text-[#E15B44]" />
            <span>ASL 5-Parameter & Spatial Visual Notation</span>
          </div>
          <div className="bg-white p-3 border border-[rgba(27,27,25,0.12)] mb-2">
            <span className="font-['Space_Mono'] text-xs font-bold text-[#E15B44] block mb-1">
              Sign Gloss: {question.aslNotation.gloss}
            </span>
            <p className="text-xs text-[#1B1B19] mb-2">{question.aslNotation.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#1B1B19]/70 pt-2 border-t border-[rgba(27,27,25,0.1)]">
              <div><strong>Handshape:</strong> {question.aslNotation.parameters.handshape}</div>
              <div><strong>Location:</strong> {question.aslNotation.parameters.location}</div>
              <div><strong>Movement:</strong> {question.aslNotation.parameters.movement}</div>
              <div><strong>Palm:</strong> {question.aslNotation.parameters.palmOrientation}</div>
              <div className="sm:col-span-2"><strong>Non-Manual:</strong> {question.aslNotation.parameters.nonManualMarkers}</div>
            </div>
          </div>
        </div>
      )}

      {/* Primary Question Heading matching Variation 1 */}
      <div className="my-5 sm:my-7">
        <h2 className="text-xl sm:text-3xl font-medium sm:font-semibold tracking-[-0.03em] leading-tight text-[#1B1B19] m-0">
          {question.question}
        </h2>

        {/* Code Snippet Box (Python / R / HTML / Math) */}
        {question.codeSnippet && (
          <div className="mt-4 p-4 border border-[#1B1B19] bg-[#1B1B19] text-[#F8F7F4] font-['Space_Mono'] text-xs sm:text-sm overflow-x-auto">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/20 text-[10px] text-white/50 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-[#E15B44]" /> Terminal Snippet
              </span>
              <span>UTF-8 Collegiate</span>
            </div>
            <pre className="whitespace-pre">{question.codeSnippet}</pre>
          </div>
        )}
      </div>

      {/* Options List matching .option in Variation 1 */}
      <div className="space-y-3 mb-8">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isThisCorrect = option.id === question.correctOptionId;

          let optionBorder = 'border-[rgba(27,27,25,0.18)] hover:border-[#1B1B19] bg-white hover:bg-[#EFECE6] text-[#1B1B19]';
          let badgeBorder = 'border-[#1B1B19] bg-white text-[#1B1B19]';

          if (showFeedback) {
            if (isThisCorrect) {
              optionBorder = 'border-emerald-700 bg-emerald-50 text-emerald-950 font-medium';
              badgeBorder = 'border-emerald-700 bg-emerald-700 text-white font-bold';
            } else if (isSelected && !isThisCorrect) {
              optionBorder = 'border-[#E15B44] bg-rose-50 text-[#1B1B19] font-medium';
              badgeBorder = 'border-[#E15B44] bg-[#E15B44] text-white font-bold';
            } else {
              optionBorder = 'border-[rgba(27,27,25,0.08)] bg-white text-[#1B1B19]/40 opacity-60';
              badgeBorder = 'border-[rgba(27,27,25,0.2)] bg-white text-[#1B1B19]/40';
            }
          } else if (isSelected) {
            optionBorder = 'border-[#1B1B19] bg-[#EFECE6] text-[#1B1B19] font-medium';
            badgeBorder = 'border-[#1B1B19] bg-[#1B1B19] text-white font-bold';
          }

          return (
            <div
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              className={`p-3.5 sm:p-4 border transition-all flex items-start justify-between gap-3 cursor-pointer ${optionBorder}`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                {/* 20px letter indicator matching design specification */}
                <div
                  className={`w-6 h-6 border flex items-center justify-center font-['Space_Mono'] text-xs shrink-0 uppercase transition-colors ${badgeBorder}`}
                >
                  {option.id}
                </div>
                <div className="text-sm sm:text-base leading-relaxed pt-0.2 font-['Inter']">
                  {option.text}
                </div>
              </div>

              {/* Status Icons */}
              <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                {showFeedback && isThisCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                )}
                {showFeedback && isSelected && !isThisCorrect && (
                  <XCircle className="w-5 h-5 text-[#E15B44]" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Immediate Post-Answer Feedback Banner */}
      {showFeedback && (
        <div
          className={`p-4 border mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in ${
            isCorrect
              ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
              : 'bg-rose-50 border-[#E15B44] text-[#1B1B19]'
          }`}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-[#E15B44] shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-['Space_Mono'] font-bold text-xs uppercase tracking-wider text-[#1B1B19]">
                {isCorrect ? 'Correct — Verified by Textbook Standards' : 'Incorrect Response'}
              </div>
              <p className="text-xs sm:text-sm text-[#1B1B19]/80 mt-1 leading-relaxed">
                {question.explanation.whyCorrect}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenExplain}
            className="font-['Space_Mono'] shrink-0 px-3.5 py-1.5 border border-[#1B1B19] bg-white hover:bg-[#EFECE6] text-[#1B1B19] text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
          >
            Read Mini-Lesson
          </button>
        </div>
      )}

      {/* Bottom Action Footer matching Variation 1 buttons */}
      <div className="pt-6 border-t border-[rgba(27,27,25,0.12)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19]/60 text-center sm:text-left">
          Textbook Citation: <span className="text-[#1B1B19] font-bold">{question.textbookRef}</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          {/* Calculator Action Button on Math Questions */}
          {isMathQuestion && (
            <button
              type="button"
              onClick={() => setIsCalculatorOpen((prev) => !prev)}
              className="font-['Space_Mono'] flex items-center justify-center gap-1.5 flex-1 sm:flex-none px-3.5 py-2.5 bg-white hover:bg-[#1B1B19] hover:text-white text-[#1B1B19] border border-[#1B1B19] text-xs uppercase tracking-wider transition-all cursor-pointer"
              title="Toggle Scientific Calculator"
            >
              <Calculator className="w-3.5 h-3.5 text-[#E15B44]" />
              <span>Calculator</span>
            </button>
          )}

          {/* Science Lab Action Button on Science Questions */}
          {isScienceQuestion && onOpenScienceLab && (
            <button
              type="button"
              onClick={() => onOpenScienceLab(recommendedSpecimen)}
              className="font-['Space_Mono'] flex items-center justify-center gap-1.5 flex-1 sm:flex-none px-3.5 py-2.5 bg-white hover:bg-emerald-700 hover:text-white hover:border-emerald-700 text-emerald-950 border border-emerald-700 text-xs uppercase tracking-wider transition-all cursor-pointer"
              title="Open Digital Cell & Dissection Lab"
            >
              <Microscope className="w-3.5 h-3.5 text-emerald-700" />
              <span>Science Lab</span>
            </button>
          )}

          {/* Explain Concept Button */}
          <button
            type="button"
            onClick={onOpenExplain}
            className="font-['Space_Mono'] flex-1 sm:flex-none px-4 py-2.5 bg-transparent hover:bg-[#1B1B19] hover:text-white text-[#1B1B19] border border-[#1B1B19] text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Explain Concept
          </button>

          {/* Generate Mnemonic Button */}
          {onOpenMnemonic && (
            <button
              type="button"
              onClick={onOpenMnemonic}
              className="font-['Space_Mono'] flex-1 sm:flex-none px-4 py-2.5 bg-transparent hover:bg-[#E15B44] hover:text-white hover:border-[#E15B44] text-[#1B1B19] border border-[#1B1B19] text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Generate Mnemonic
            </button>
          )}

          {/* Continue / Next Button */}
          {showFeedback && (
            <button
              type="button"
              onClick={onNext}
              className="font-['Space_Mono'] flex-1 sm:flex-none px-6 py-2.5 bg-[#1B1B19] hover:bg-[#E15B44] hover:border-[#E15B44] text-white border border-[#1B1B19] text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isUnlimitedMode ? 'Next Question' : 'Continue Drill'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Collegiate Scientific Calculator */}
      <ScientificCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
};

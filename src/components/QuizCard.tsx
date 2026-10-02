import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  BookOpen,
  Code,
  Radio,
  FileQuestion,
  Hand
} from 'lucide-react';
import { Question } from '../types';
import { audioPlayer } from '../utils/audio';

interface QuizCardProps {
  question: Question;
  subjectName: string;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  showFeedback: boolean;
  onNext: () => void;
  onOpenExplain: () => void;
  isUnlimitedMode?: boolean;
  questionNumber?: number;
  totalQuestions?: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  subjectName,
  selectedOptionId,
  onSelectOption,
  showFeedback,
  onNext,
  onOpenExplain,
  isUnlimitedMode = false,
  questionNumber,
  totalQuestions,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((state) => {
      setIsPlayingAudio(state.isPlaying);
      setPlaybackRate(state.rate);
    });
    return () => {
      audioPlayer.stop();
    };
  }, [question.id]);

  const handlePlayAudio = () => {
    if (!question.audioDialogue) return;
    if (isPlayingAudio) {
      audioPlayer.stop();
    } else {
      audioPlayer.play(
        question.audioDialogue.speakerText,
        question.audioDialogue.language,
        () => setIsPlayingAudio(false)
      );
    }
  };

  const handleToggleRate = () => {
    const nextRate = playbackRate === 1.0 ? 0.75 : 1.0;
    audioPlayer.setRate(nextRate);
    setPlaybackRate(nextRate);
  };

  const isCorrect = selectedOptionId === question.correctOptionId;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl transition-all">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
            {subjectName}
          </span>
          <span className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-xs">
            {question.chapter}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {questionNumber !== undefined && (
            <span className="text-xs font-mono font-medium text-slate-400">
              Question {questionNumber}
              {totalQuestions ? ` of ${totalQuestions}` : ' (Unlimited)'}
            </span>
          )}

          {/* Top "Explain This" Button - Available Before or After Answer */}
          <button
            onClick={onOpenExplain}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 transition-all shadow-sm"
            title="Read in-depth textbook breakdown before or after answering"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Explain This</span>
          </button>
        </div>
      </div>

      {/* Foreign Language Audio Listening Player */}
      {question.audioDialogue && (
        <div className="mb-6 p-4 rounded-xl bg-slate-950/90 border border-indigo-500/30 shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs uppercase tracking-wider">
              <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>CLEP Listening Comprehension Audio</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleRate}
                className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-indigo-300 hover:bg-slate-700 transition-colors"
                title="Toggle playback speed"
              >
                Speed: {playbackRate}x
              </button>
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showTranscript ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-indigo-400" />}
                <span>{showTranscript ? 'Hide Script' : 'Show Script'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayAudio}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                isPlayingAudio
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'Stop Spoken Audio' : 'Play Spoken Dialogue'}</span>
            </button>
            <span className="text-xs text-slate-400 italic">
              {isPlayingAudio ? 'Speaking native dialogue...' : 'Click to listen to authentic collegiate dialogue'}
            </span>
          </div>

          {/* Transcript Drawer */}
          {showTranscript && (
            <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-1.5 animate-fade-in bg-slate-900/60 p-3 rounded-lg">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Spoken Transcript:
              </div>
              <p className="font-serif italic text-slate-200">
                "{question.audioDialogue.speakerText}"
              </p>
              {question.audioDialogue.englishTranslation && (
                <p className="text-slate-400 text-[11px]">
                  English Translation: {question.audioDialogue.englishTranslation}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* American Sign Language (ASL) Spatial & Parameter Visual Box */}
      {question.aslNotation && (
        <div className="mb-6 p-4 rounded-xl bg-slate-950/90 border border-emerald-500/30">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs uppercase tracking-wider mb-2">
            <Hand className="w-4 h-4 text-emerald-400" />
            <span>ASL 5-Parameter & Spatial Visual Notation</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 mb-2">
            <span className="text-xs font-mono font-bold text-amber-300 block mb-1">
              Sign Gloss: {question.aslNotation.gloss}
            </span>
            <p className="text-xs text-slate-300 mb-2">{question.aslNotation.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <div><strong className="text-slate-300">Handshape:</strong> {question.aslNotation.parameters.handshape}</div>
              <div><strong className="text-slate-300">Location:</strong> {question.aslNotation.parameters.location}</div>
              <div><strong className="text-slate-300">Movement:</strong> {question.aslNotation.parameters.movement}</div>
              <div><strong className="text-slate-300">Palm Orientation:</strong> {question.aslNotation.parameters.palmOrientation}</div>
              <div className="sm:col-span-2"><strong className="text-slate-300">Non-Manual Markers:</strong> {question.aslNotation.parameters.nonManualMarkers}</div>
            </div>
          </div>
        </div>
      )}

      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
          {question.question}
        </h3>

        {/* Code Snippet Box (Python / R / HTML / Math) */}
        {question.codeSnippet && (
          <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-500 uppercase font-sans">
              <span className="flex items-center gap-1">
                <Code className="w-3.5 h-3.5 text-indigo-400" /> Code Snippet
              </span>
              <span>UTF-8</span>
            </div>
            <pre className="whitespace-pre">{question.codeSnippet}</pre>
          </div>
        )}
      </div>

      {/* Options List */}
      <div className="space-y-3 mb-6">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isThisCorrect = option.id === question.correctOptionId;

          let optionStyle = 'bg-slate-800/40 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-200';
          let badgeStyle = 'bg-slate-700/60 text-slate-300';

          if (showFeedback) {
            if (isThisCorrect) {
              optionStyle = 'bg-emerald-950/40 border-emerald-500 text-white ring-1 ring-emerald-500/50';
              badgeStyle = 'bg-emerald-500 text-white font-bold';
            } else if (isSelected && !isThisCorrect) {
              optionStyle = 'bg-rose-950/40 border-rose-500 text-white ring-1 ring-rose-500/50';
              badgeStyle = 'bg-rose-500 text-white font-bold';
            } else {
              optionStyle = 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60';
            }
          } else if (isSelected) {
            optionStyle = 'bg-indigo-950/50 border-indigo-500 text-white ring-1 ring-indigo-500';
            badgeStyle = 'bg-indigo-600 text-white font-bold';
          }

          return (
            <div
              key={option.id}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${optionStyle}`}
            >
              <button
                type="button"
                onClick={() => onSelectOption(option.id)}
                className="flex-1 flex items-start gap-3.5 text-left focus:outline-none"
              >
                <span
                  className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center shrink-0 uppercase transition-colors ${badgeStyle}`}
                >
                  {option.id}
                </span>
                <span className="text-xs sm:text-sm leading-relaxed pt-0.5">
                  {option.text}
                </span>
              </button>

              {/* Explain That Feature Next to Each Option */}
              <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                {showFeedback && isThisCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
                {showFeedback && isSelected && !isThisCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
                <button
                  type="button"
                  onClick={onOpenExplain}
                  className="px-2 py-1 rounded text-[11px] font-medium text-slate-400 hover:text-indigo-300 hover:bg-slate-800/80 transition-colors"
                  title="Explain this specific concept"
                >
                  Explain That
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Immediate Post-Answer Feedback Banner */}
      {showFeedback && (
        <div
          className={`p-4 rounded-xl border mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in ${
            isCorrect
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-sm text-white">
                {isCorrect ? 'Correct! Verified by OpenStax Textbook.' : 'Incorrect Answer.'}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {question.explanation.whyCorrect}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenExplain}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Full Mini-Lesson</span>
          </button>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-400 text-center sm:text-left">
          Textbook Citation: <span className="text-slate-300 font-mono">{question.textbookRef}</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onOpenExplain}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>Explain This Question</span>
          </button>

          {showFeedback && (
            <button
              onClick={onNext}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>{isUnlimitedMode ? 'Next Question (Unlimited)' : 'Continue Drill'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

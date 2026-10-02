import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  Radio, 
  Languages, 
  Sparkles, 
  Settings2,
  Headphones,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { audioPlayer, AudioPlaybackState } from '../utils/audio';

export interface AudioDialogueData {
  language: 'es-ES' | 'fr-FR' | 'de-DE' | string;
  speakerText: string;
  englishTranslation?: string;
  speakers?: {
    name: string;
    line: string;
  }[];
}

interface ForeignLanguageAudioPlayerProps {
  dialogue: AudioDialogueData;
  subjectName?: string;
  chapter?: string;
  className?: string;
  onListeningComplete?: () => void;
}

export const ForeignLanguageAudioPlayer: React.FC<ForeignLanguageAudioPlayerProps> = ({
  dialogue,
  subjectName = 'Foreign Language',
  chapter = 'Listening Comprehension',
  className = '',
  onListeningComplete,
}) => {
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>(audioPlayer.getState());
  const [showTranscript, setShowTranscript] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isBlindMode, setIsBlindMode] = useState(true);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [hasListenedAtLeastOnce, setHasListenedAtLeastOnce] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Subscribe to audio player state
  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((state) => {
      setPlaybackState(state);
    });

    // Populate voices
    const updateVoices = () => {
      const voices = audioPlayer.getAvailableVoices(dialogue.language);
      setAvailableVoices(voices);
      if (voices.length > 0 && !selectedVoiceURI) {
        setSelectedVoiceURI(voices[0].voiceURI);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      unsubscribe();
      audioPlayer.stop();
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [dialogue.language, dialogue.speakerText]);

  // Audio Visualizer Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const renderWaveform = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const isPlaying = playbackState.isPlaying;
      const barCount = 36;
      const barWidth = Math.floor(width / barCount) - 2;

      for (let i = 0; i < barCount; i++) {
        let amplitude = 4; // idle baseline
        if (isPlaying) {
          const wave1 = Math.sin(phase + i * 0.35);
          const wave2 = Math.cos(phase * 0.7 + i * 0.2);
          const combined = Math.abs(wave1 * 0.6 + wave2 * 0.4);
          amplitude = Math.max(4, combined * (height * 0.75));
        }

        const x = i * (barWidth + 2);
        const y = (height - amplitude) / 2;

        // Visual design: crisp editorial ink bars with terracotta accent for peak frequencies
        if (isPlaying && (i % 5 === 0 || i % 7 === 0)) {
          ctx.fillStyle = '#E15B44';
        } else if (isPlaying) {
          ctx.fillStyle = '#1B1B19';
        } else {
          ctx.fillStyle = 'rgba(27, 27, 25, 0.2)';
        }

        ctx.fillRect(x, y, barWidth, amplitude);
      }

      if (isPlaying) {
        phase += 0.15 * playbackState.rate;
      }

      animFrameIdRef.current = requestAnimationFrame(renderWaveform);
    };

    renderWaveform();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [playbackState.isPlaying, playbackState.rate]);

  const handlePlayFull = () => {
    if (playbackState.isPlaying) {
      audioPlayer.pause();
    } else if (playbackState.isPaused) {
      audioPlayer.resume();
    } else {
      audioPlayer.play(dialogue.speakerText, dialogue.language, () => {
        setHasListenedAtLeastOnce(true);
        if (onListeningComplete) onListeningComplete();
      });
    }
  };

  const handleStop = () => {
    audioPlayer.stop();
  };

  const handleSpeedToggle = (rate: number) => {
    audioPlayer.setRate(rate);
  };

  const handlePlayLine = (lineText: string, index: number) => {
    audioPlayer.playLine(lineText, dialogue.language, index, () => {
      setHasListenedAtLeastOnce(true);
    });
  };

  const handleVoiceChange = (uri: string) => {
    setSelectedVoiceURI(uri);
    audioPlayer.setVoice(uri);
  };

  // Derive dialogue lines
  const lines = dialogue.speakers && dialogue.speakers.length > 0
    ? dialogue.speakers
    : dialogue.speakerText
        .split(/(?=[A-Z][a-záéíóúüñß]+:)/)
        .filter((s) => s.trim().length > 0)
        .map((chunk) => {
          const parts = chunk.split(':');
          if (parts.length > 1) {
            return { name: parts[0].trim(), line: parts.slice(1).join(':').trim() };
          }
          return { name: 'Locutor', line: chunk.trim() };
        });

  const languageLabel =
    dialogue.language.startsWith('es')
      ? 'Spanish (Castellano / Latinoamericano)'
      : dialogue.language.startsWith('fr')
      ? 'French (Français Métropolitain)'
      : dialogue.language.startsWith('de')
      ? 'German (Hochdeutsch)'
      : dialogue.language;

  return (
    <div className={`bg-white border-2 border-[#1B1B19] p-5 sm:p-6 shadow-sm relative text-[#1B1B19] font-['Inter'] ${className}`}>
      {/* Top Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[rgba(27,27,25,0.12)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.15em] text-[#E15B44] font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse text-[#E15B44]" />
              <span>CLEP Oral Listening Comprehension</span>
            </span>
            <span className="text-[#1B1B19]/30 font-['Space_Mono'] text-xs">/</span>
            <span className="font-['Space_Mono'] text-[10px] uppercase text-[#1B1B19]/60">{chapter}</span>
          </div>
          <h3 className="font-['Space_Mono'] text-sm sm:text-base font-bold uppercase tracking-tight text-[#1B1B19] flex items-center gap-2">
            <Languages className="w-4 h-4 text-[#1B1B19]" />
            <span>Acoustic Dialogue Track: {languageLabel}</span>
          </h3>
        </div>

        {/* Acoustic Diagnostics Badge */}
        <div className="flex items-center gap-2">
          {hasListenedAtLeastOnce && (
            <span className="font-['Space_Mono'] text-[9px] uppercase px-2 py-0.5 border border-emerald-600 bg-emerald-50 text-emerald-950 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
              <span>Track Evaluated</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className="font-['Space_Mono'] flex items-center gap-1 text-[10px] uppercase px-2.5 py-1 border border-[rgba(27,27,25,0.2)] hover:border-[#1B1B19] bg-[#F8F7F4] hover:bg-[#EFECE6] transition-colors cursor-pointer"
            title="Configure Native Speech Engine"
          >
            <Settings2 className="w-3.5 h-3.5 text-[#1B1B19]" />
            <span>Voice Voice/Engine</span>
          </button>
        </div>
      </div>

      {/* Voice Configuration Drawer (Collapsible) */}
      {showVoiceSettings && (
        <div className="p-3.5 mb-4 border border-[rgba(27,27,25,0.15)] bg-[#F8F7F4] text-xs space-y-2 animate-fade-in">
          <div className="flex items-center justify-between font-['Space_Mono'] text-[10px] uppercase font-bold text-[#1B1B19]">
            <span>Speech Synthesis Engine: Web Speech API</span>
            <span className="text-[#1B1B19]/60">Native Device Voice Pipeline</span>
          </div>

          <div>
            <label className="block font-['Space_Mono'] text-[10px] uppercase text-[#1B1B19]/70 mb-1">
              Select Synthesized Voice Profile ({availableVoices.length} installed):
            </label>
            {availableVoices.length > 0 ? (
              <select
                value={selectedVoiceURI}
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[rgba(27,27,25,0.2)] bg-white text-xs font-['Space_Mono'] text-[#1B1B19] focus:outline-none focus:border-[#1B1B19]"
              >
                {availableVoices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang}) {v.default ? '— Default' : ''}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-[11px] text-[#1B1B19]/60 italic">
                Using system fallback synthesized acoustic profile for {dialogue.language}.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Interactive Waveform Display Bar */}
      <div className="mb-5 p-3 border border-[rgba(27,27,25,0.12)] bg-[#F8F7F4] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Animated Canvas */}
        <div className="w-full sm:w-64 h-10 flex items-center justify-center bg-white border border-[rgba(27,27,25,0.15)] px-2">
          <canvas
            ref={canvasRef}
            width={240}
            height={36}
            className="w-full h-full block"
          />
        </div>

        {/* Live Word Boundary Feedback */}
        <div className="flex-1 text-center sm:text-left">
          <div className="font-['Space_Mono'] text-[9px] uppercase tracking-wider text-[#1B1B19]/60 font-bold">
            Real-Time Acoustic Tracking:
          </div>
          <div className="font-['Space_Mono'] text-xs font-bold text-[#1B1B19] truncate min-h-[1.2rem] mt-0.5">
            {playbackState.isPlaying
              ? `Spoken Cadence: "${playbackState.currentWord || '...'}"`
              : playbackState.isPaused
              ? '❚❚ Playback Paused'
              : 'Standby — Press Play to listen'}
          </div>
        </div>

        {/* Mode Indicator Stamp */}
        <div className="font-['Space_Mono'] text-[9px] uppercase tracking-wider px-2 py-1 border border-[#1B1B19] bg-white text-[#1B1B19] shrink-0 font-bold">
          Standard: 44.1 kHz
        </div>
      </div>

      {/* Primary Transport Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 border border-[#1B1B19] bg-[#1B1B19] text-white">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Main Play / Pause Button */}
          <button
            type="button"
            onClick={handlePlayFull}
            className="font-['Space_Mono'] flex items-center gap-2 px-5 py-2.5 bg-white text-[#1B1B19] hover:bg-[#E15B44] hover:text-white text-xs uppercase tracking-wider font-bold transition-all cursor-pointer shadow-sm"
          >
            {playbackState.isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{playbackState.isPaused ? 'Resume' : 'Play Dialogue'}</span>
              </>
            )}
          </button>

          {/* Stop / Reset Button */}
          <button
            type="button"
            onClick={handleStop}
            disabled={!playbackState.isPlaying && !playbackState.isPaused}
            className="font-['Space_Mono'] p-2.5 border border-white/20 hover:border-white text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title="Stop Playback"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>

          {/* Replay Track from Beginning */}
          <button
            type="button"
            onClick={() => {
              audioPlayer.stop();
              audioPlayer.play(dialogue.speakerText, dialogue.language);
            }}
            className="font-['Space_Mono'] flex items-center gap-1.5 px-3 py-2 border border-white/20 hover:border-white text-xs uppercase tracking-wider text-white transition-colors cursor-pointer"
            title="Replay entire dialogue"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
        </div>

        {/* Speed Adjustment Buttons */}
        <div className="flex items-center gap-1.5">
          <span className="font-['Space_Mono'] text-[9px] uppercase text-white/60 mr-1 hidden sm:inline">
            Speed:
          </span>
          {[0.5, 0.75, 1.0, 1.25].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSpeedToggle(s)}
              className={`font-['Space_Mono'] text-[10px] uppercase font-bold px-2 py-1 border transition-all cursor-pointer ${
                playbackState.rate === s
                  ? 'bg-[#E15B44] text-white border-[#E15B44]'
                  : 'bg-transparent text-white/80 border-white/20 hover:border-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Ear Training & Script Visibility Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 p-3 bg-[#F8F7F4] border border-[rgba(27,27,25,0.12)]">
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4 text-[#E15B44]" />
          <span className="font-['Space_Mono'] text-xs font-bold uppercase text-[#1B1B19]">
            Ear Training Discipline
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Blind Audio Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsBlindMode(!isBlindMode)}
            className={`font-['Space_Mono'] text-[10px] uppercase font-bold px-3 py-1.5 border transition-all cursor-pointer ${
              isBlindMode
                ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:bg-[#EFECE6]'
            }`}
          >
            {isBlindMode ? '✓ Blind Mode (Exam Sim)' : 'Text Revealed'}
          </button>

          {/* Toggle Full Script */}
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className="font-['Space_Mono'] flex items-center gap-1.5 text-[10px] uppercase px-3 py-1.5 border border-[#1B1B19] bg-white hover:bg-[#EFECE6] text-[#1B1B19] transition-colors cursor-pointer"
          >
            {showTranscript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showTranscript ? 'Hide Dialogue Text' : 'View Dialogue Text'}</span>
          </button>

          {/* Toggle English Translation */}
          {dialogue.englishTranslation && (
            <button
              type="button"
              onClick={() => setShowTranslation(!showTranslation)}
              className="font-['Space_Mono'] text-[10px] uppercase px-3 py-1.5 border border-[rgba(27,27,25,0.2)] hover:border-[#1B1B19] bg-white text-[#1B1B19] transition-colors cursor-pointer"
            >
              {showTranslation ? 'Hide English Gloss' : 'English Translation'}
            </button>
          )}
        </div>
      </div>

      {/* Blind Mode Notice Banner when Active */}
      {isBlindMode && !showTranscript && (
        <div className="p-4 border border-[rgba(27,27,25,0.15)] bg-white text-center text-xs text-[#1B1B19]/70 space-y-1">
          <p className="font-['Space_Mono'] font-bold text-[#1B1B19] uppercase text-[11px]">
            Blind Audio Mode Active — CLEP Listening Protocol
          </p>
          <p>
            Listen intently to the spoken dialogue without reading ahead. Test your comprehension by choosing your answer before revealing the text.
          </p>
        </div>
      )}

      {/* Speaker Dialogue Script Drawer */}
      {(!isBlindMode || showTranscript) && (
        <div className="space-y-2 mb-4 animate-fade-in">
          <div className="font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19]/60 font-bold mb-1">
            Native Speaker Dialogue Lines (Click any row to isolate speech):
          </div>

          <div className="space-y-2">
            {lines.map((item, idx) => {
              const isThisLineActive = playbackState.currentLineIndex === idx;

              return (
                <div
                  key={idx}
                  onClick={() => handlePlayLine(item.line, idx)}
                  className={`p-3.5 border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                    isThisLineActive
                      ? 'bg-[#EFECE6] border-[#1B1B19] ring-1 ring-[#1B1B19]'
                      : 'bg-white hover:bg-[#F8F7F4] border-[rgba(27,27,25,0.12)] hover:border-[#1B1B19]'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <span className="font-['Space_Mono'] text-[10px] uppercase font-bold text-white bg-[#1B1B19] px-2 py-0.5 shrink-0">
                      {item.name}
                    </span>
                    <p className="text-xs sm:text-sm text-[#1B1B19] leading-relaxed pt-0.5">
                      "{item.line}"
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayLine(item.line, idx);
                    }}
                    className="font-['Space_Mono'] text-[9px] uppercase px-2 py-1 border border-[#1B1B19] bg-white hover:bg-[#1B1B19] hover:text-white transition-colors shrink-0"
                    title="Speak this line only"
                  >
                    ▶ Speak
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bilingual English Translation Box */}
          {showTranslation && dialogue.englishTranslation && (
            <div className="mt-3 p-4 border border-[rgba(27,27,25,0.15)] bg-[#F8F7F4] animate-fade-in text-xs">
              <span className="font-['Space_Mono'] text-[10px] uppercase font-bold text-[#E15B44] block mb-1">
                English Reference Translation:
              </span>
              <p className="italic text-[#1B1B19]/90 leading-relaxed font-serif">
                "{dialogue.englishTranslation}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer Meta */}
      <div className="pt-3 border-t border-[rgba(27,27,25,0.08)] flex flex-col sm:flex-row items-center justify-between text-[10px] font-['Space_Mono'] uppercase tracking-wider text-[#1B1B19]/50">
        <span>CLEP Accredited Foreign Language Listening Module</span>
        <span>Acoustic Rate: {playbackState.rate}x · Native Speech API</span>
      </div>
    </div>
  );
};

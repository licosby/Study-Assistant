// Collegiate Audio Synthesis Player for Foreign Language Listening Comprehension (Spanish, French, German)

export interface AudioPlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  rate: number;
  currentLineIndex: number;
  currentWord: string;
  charIndex: number;
  volume: number;
}

class AudioPlayer {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;
  private isPaused = false;
  private rate = 1.0;
  private volume = 1.0;
  private currentLineIndex = -1;
  private currentWord = '';
  private charIndex = 0;
  private selectedVoiceURI: string | null = null;
  private listeners: Set<(state: AudioPlaybackState) => void> = new Set();
  private audioContext: AudioContext | null = null;

  public subscribe(callback: (state: AudioPlaybackState) => void) {
    this.listeners.add(callback);
    callback(this.getState());
    return () => {
      this.listeners.delete(callback);
    };
  }

  public getState(): AudioPlaybackState {
    return {
      isPlaying: this.isSpeaking,
      isPaused: this.isPaused,
      rate: this.rate,
      currentLineIndex: this.currentLineIndex,
      currentWord: this.currentWord,
      charIndex: this.charIndex,
      volume: this.volume,
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((cb) => cb(state));
  }

  public setRate(newRate: number) {
    this.rate = Math.max(0.5, Math.min(1.5, newRate));
    this.notify();
  }

  public getRate() {
    return this.rate;
  }

  public setVolume(newVolume: number) {
    this.volume = Math.max(0, Math.min(1, newVolume));
    if (this.currentUtterance) {
      this.currentUtterance.volume = this.volume;
    }
    this.notify();
  }

  public getVolume() {
    return this.volume;
  }

  public setVoice(voiceURI: string) {
    this.selectedVoiceURI = voiceURI;
  }

  public getAvailableVoices(langPrefix?: string): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    const all = window.speechSynthesis.getVoices();
    if (!langPrefix) return all;
    const prefix = langPrefix.slice(0, 2).toLowerCase();
    return all.filter((v) => v.lang.toLowerCase().startsWith(prefix));
  }

  /** Play a short harmonic audio tone cue to indicate audio start/ready */
  public playAcousticChime(frequency = 523.25, durationSeconds = 0.12) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioContext || this.audioContext.state === 'closed') {
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

      gain.gain.setValueAtTime(0.08 * this.volume, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + durationSeconds);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.start();
      osc.stop(this.audioContext.currentTime + durationSeconds);
    } catch {
      // AudioContext optional fallback
    }
  }

  /** Speak full text */
  public play(
    text: string, 
    lang: 'es-ES' | 'fr-FR' | 'de-DE' | string = 'es-ES', 
    onEnd?: () => void,
    onBoundary?: (word: string, charIndex: number) => void
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported on this browser/device');
      return;
    }

    this.stop();
    this.playAcousticChime(440, 0.08);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = this.rate;
    utterance.pitch = 1.0;
    utterance.volume = this.volume;

    const voices = window.speechSynthesis.getVoices();
    if (this.selectedVoiceURI) {
      const chosen = voices.find((v) => v.voiceURI === this.selectedVoiceURI);
      if (chosen) utterance.voice = chosen;
    } else {
      const matchingVoice = voices.find(
        (v) => v.lang.toLowerCase().startsWith(lang.toLowerCase().slice(0, 2))
      );
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
    }

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const word = text.slice(event.charIndex, event.charIndex + (event.charLength || 6));
        this.currentWord = word.trim();
        this.charIndex = event.charIndex;
        if (onBoundary) onBoundary(this.currentWord, event.charIndex);
        this.notify();
      }
    };

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      this.notify();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      this.currentWord = '';
      this.notify();
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      this.notify();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  /** Speak a single dialogue line */
  public playLine(
    lineText: string, 
    lang: string, 
    lineIndex: number, 
    onEnd?: () => void
  ) {
    this.currentLineIndex = lineIndex;
    this.play(lineText, lang, () => {
      this.currentLineIndex = -1;
      if (onEnd) onEnd();
    });
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.isSpeaking) {
      window.speechSynthesis.pause();
      this.isSpeaking = false;
      this.isPaused = true;
      this.notify();
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.isPaused) {
      window.speechSynthesis.resume();
      this.isSpeaking = true;
      this.isPaused = false;
      this.notify();
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      this.currentLineIndex = -1;
      this.currentWord = '';
      this.notify();
    }
  }

  public isCurrentlySpeaking() {
    return this.isSpeaking;
  }
}

export const audioPlayer = new AudioPlayer();

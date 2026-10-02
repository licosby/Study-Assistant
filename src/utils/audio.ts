// Web Speech API Voice Synthesis Player for Foreign Language Listening Comprehension

class AudioPlayer {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;
  private onStateChange: ((state: { isPlaying: boolean; rate: number }) => void) | null = null;
  private rate = 1.0;

  public subscribe(callback: (state: { isPlaying: boolean; rate: number }) => void) {
    this.onStateChange = callback;
    this.notify();
  }

  private notify() {
    if (this.onStateChange) {
      this.onStateChange({ isPlaying: this.isSpeaking, rate: this.rate });
    }
  }

  public setRate(newRate: number) {
    this.rate = Math.max(0.5, Math.min(1.5, newRate));
    this.notify();
  }

  public play(text: string, lang: 'es-ES' | 'fr-FR' | 'de-DE' = 'es-ES', onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported on this browser device');
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = this.rate;
    utterance.pitch = 1.0;

    // Pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(
      (v) => v.lang.toLowerCase().startsWith(lang.toLowerCase().slice(0, 2))
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.notify();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.notify();
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.notify();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public pause() {
    if ('speechSynthesis' in window && this.isSpeaking) {
      window.speechSynthesis.pause();
      this.isSpeaking = false;
      this.notify();
    }
  }

  public resume() {
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.isSpeaking = true;
      this.notify();
    }
  }

  public stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.notify();
    }
  }

  public getRate() {
    return this.rate;
  }
}

export const audioPlayer = new AudioPlayer();

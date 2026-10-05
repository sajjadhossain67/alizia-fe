export class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onTranscript: ((text: string) => void) | null = null;
  private onListeningState: ((active: boolean) => void) | null = null;
  private onSpeakingState: ((active: boolean) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis || null;
      this.initRecognition();
    }
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      return;
    }

    try {
      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.onListeningState?.(true);
      };

      this.recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim() && this.onTranscript) {
          this.onTranscript(transcript);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        this.stopListening();
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.onListeningState?.(false);
      };
    } catch (e) {
      console.error('Failed to init speech recognition:', e);
    }
  }

  setCallbacks(
    onTranscript: (text: string) => void,
    onListening: (active: boolean) => void,
    onSpeaking: (active: boolean) => void
  ) {
    this.onTranscript = onTranscript;
    this.onListeningState = onListening;
    this.onSpeakingState = onSpeaking;
  }

  toggleListening(): boolean {
    if (!this.recognition) {
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    } else {
      try {
        this.recognition.start();
      } catch (err) {
        console.warn('Recognition start exception:', err);
      }
    }
    return true;
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.onListeningState?.(false);
    }
  }

  speak(text: string, onToggle?: (speaking: boolean) => void) {
    if (!this.synth) return;

    if (this.synth.speaking) {
      this.synth.cancel();
      this.onSpeakingState?.(false);
      onToggle?.(false);
      return;
    }

    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Code block omitted.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_~#>]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const voices = this.synth.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google')));
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => {
      this.onSpeakingState?.(true);
      onToggle?.(true);
    };

    utterance.onend = () => {
      this.onSpeakingState?.(false);
      onToggle?.(false);
    };

    utterance.onerror = () => {
      this.onSpeakingState?.(false);
      onToggle?.(false);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
      this.onSpeakingState?.(false);
    }
  }
}

export const speechService = new SpeechService();

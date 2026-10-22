import { useState, useEffect, useCallback, useRef } from 'react';

// Web Speech API interface definitions
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    // Android Native Bridge callback from MahiVoiceInput
    onAndroidVoiceResult?: (result: string) => void;
  }
}

export interface VoiceLanguage {
  code: string;
  name: string;
  label: string;
}

export const SUPPORTED_VOICE_LANGS: VoiceLanguage[] = [
  { code: 'as-IN', name: 'Assamese', label: 'অসমীয়া (as-IN)' },
  { code: 'hi-IN', name: 'Hindi', label: 'हिन्दी (hi-IN)' },
  { code: 'bn-IN', name: 'Bengali', label: 'বাংলা (bn-IN)' },
  { code: 'ne-NP', name: 'Nepali', label: 'नेपाली (ne-NP)' },
  { code: 'en-IN', name: 'English (IN)', label: 'English (en-IN)' },
];

export function useVoiceSearch(onQueryChange: (query: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [activeLang, setActiveLang] = useState<string>('hi-IN');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Connect native Android MahiVoiceInput bridge if running inside Android WebView
  useEffect(() => {
    window.onAndroidVoiceResult = (text: string) => {
      setTranscript(text);
      onQueryChange(text);
      setIsListening(false);
    };

    return () => {
      delete window.onAndroidVoiceResult;
    };
  }, [onQueryChange]);

  const isSupported = typeof window !== 'undefined' &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback((langCode?: string) => {
    setError(null);
    const targetLang = langCode || activeLang;
    setActiveLang(targetLang);

    const SpeechRecClass = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecClass) {
      setError('Voice recognition is not supported in this browser. You can type to search.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecClass();
      recognition.lang = targetLang;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        if (currentTranscript.trim()) {
          onQueryChange(currentTranscript.trim());
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(`Voice error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch (err) {
      setError('Unable to activate microphone. Please check permissions.');
      setIsListening(false);
    }
  }, [activeLang, onQueryChange]);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    activeLang,
    setActiveLang,
    startListening,
    stopListening,
    supportedLanguages: SUPPORTED_VOICE_LANGS
  };
}

import { useState, useEffect, useCallback } from 'react';
import type { VoiceSettings } from '../types';

export const useVoiceDetection = (settings: VoiceSettings) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string>('');
  const [lastDetectedPhrase, setLastDetectedPhrase] = useState<string>('');
  const [recognition, setRecognition] = useState<any>(null);

  const startListening = useCallback(async () => {
    try {
      if (!('webkitSpeechRecognition' in window)) {
        throw new Error('Speech recognition is not supported in this browser');
      }

      const SpeechRecognition = window.webkitSpeechRecognition;
      const newRecognition = new SpeechRecognition();
      
      newRecognition.continuous = true;
      newRecognition.interimResults = true;
      newRecognition.lang = settings.language;

      newRecognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript.toLowerCase())
          .join(' ');

        const detectedPhrase = settings.triggerPhrases.find(phrase => 
          transcript.includes(phrase.toLowerCase())
        );

        if (detectedPhrase) {
          setLastDetectedPhrase(detectedPhrase);
          // Trigger SOS alert
          window.dispatchEvent(new CustomEvent('sos-triggered', { 
            detail: { trigger: 'voice', phrase: detectedPhrase } 
          }));
        }
      };

      newRecognition.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      newRecognition.onend = () => {
        if (isListening) {
          newRecognition.start();
        }
      };

      newRecognition.start();
      setRecognition(newRecognition);
      setIsListening(true);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start voice detection');
    }
  }, [settings]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  return { 
    isListening, 
    startListening, 
    stopListening, 
    error,
    lastDetectedPhrase 
  };
};
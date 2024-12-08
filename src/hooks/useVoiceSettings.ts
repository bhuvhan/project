import { useState, useEffect } from 'react';
import type { VoiceSettings, SupportedLanguage } from '../types';

const STORAGE_KEY = 'voice-settings';

const DEFAULT_SETTINGS: VoiceSettings = {
  triggerPhrases: ['help', 'emergency', 'save me', 'danger', 'sos'],
  sensitivity: 0.8,
  language: 'en-US',
};

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, string> = {
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'en-IN': 'English (India)',
  'hi-IN': 'Hindi',
};

export const useVoiceSettings = () => {
  const [settings, setSettings] = useState<VoiceSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<VoiceSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addTriggerPhrase = (phrase: string) => {
    if (!settings.triggerPhrases.includes(phrase)) {
      setSettings(prev => ({
        ...prev,
        triggerPhrases: [...prev.triggerPhrases, phrase],
      }));
    }
  };

  const removeTriggerPhrase = (phrase: string) => {
    setSettings(prev => ({
      ...prev,
      triggerPhrases: prev.triggerPhrases.filter(p => p !== phrase),
    }));
  };

  return {
    settings,
    updateSettings,
    addTriggerPhrase,
    removeTriggerPhrase,
  };
};
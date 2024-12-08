import React from 'react';
import { Settings, Plus, X } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../hooks/useVoiceSettings';
import type { VoiceSettings as VoiceSettingsType } from '../types';

interface VoiceSettingsProps {
  settings: VoiceSettingsType;
  onUpdateSettings: (settings: Partial<VoiceSettingsType>) => void;
  onAddPhrase: (phrase: string) => void;
  onRemovePhrase: (phrase: string) => void;
}

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  settings,
  onUpdateSettings,
  onAddPhrase,
  onRemovePhrase,
}) => {
  const [newPhrase, setNewPhrase] = React.useState('');

  const handleAddPhrase = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPhrase.trim()) {
      onAddPhrase(newPhrase.trim().toLowerCase());
      setNewPhrase('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold">Voice Detection Settings</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={settings.language}
            onChange={(e) => onUpdateSettings({ language: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sensitivity ({(settings.sensitivity * 100).toFixed(0)}%)
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.sensitivity}
            onChange={(e) => onUpdateSettings({ sensitivity: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trigger Phrases
          </label>
          <form onSubmit={handleAddPhrase} className="flex space-x-2 mb-2">
            <input
              type="text"
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              placeholder="Add new phrase..."
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>
          <div className="flex flex-wrap gap-2">
            {settings.triggerPhrases.map((phrase) => (
              <div
                key={phrase}
                className="flex items-center space-x-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full"
              >
                <span>{phrase}</span>
                <button
                  onClick={() => onRemovePhrase(phrase)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
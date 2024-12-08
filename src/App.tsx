import React, { useEffect } from 'react';
import { Shield, Mic, MicOff, LogOut } from 'lucide-react';
import { AddContactForm } from './components/AddContactForm';
import { ContactsList } from './components/ContactsList';
import { SOSButton } from './components/SOSButton';
import { LocationDisplay } from './components/LocationDisplay';
import { VoiceSettings } from './components/VoiceSettings';
import { EmergencyStatus } from './components/EmergencyStatus';
import { UserProfileForm } from './components/UserProfileForm';
import { AuthScreen } from './components/AuthScreen';
import { useLocation } from './hooks/useLocation';
import { useVoiceDetection } from './hooks/useVoiceDetection';
import { useVoiceSettings } from './hooks/useVoiceSettings';
import { useContacts } from './hooks/useContacts';
import { useEmergency } from './hooks/useEmergency';
import { useUserProfile } from './hooks/useUserProfile';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, login, signup, logout, isAuthenticated } = useAuth();
  const { contacts, addContact, deleteContact } = useContacts();
  const { settings, updateSettings, addTriggerPhrase, removeTriggerPhrase } = useVoiceSettings();
  const { location, error: locationError, isTracking, startTracking, stopTracking, activeGeofences } = useLocation();
  const { latestAlert } = useEmergency();
  const { profile, updateProfile } = useUserProfile();
  const { 
    isListening, 
    startListening, 
    stopListening, 
    error: voiceError,
    lastDetectedPhrase 
  } = useVoiceDetection(settings);

  const handleSOSActivate = () => {
    window.dispatchEvent(new CustomEvent('sos-triggered', { 
      detail: { trigger: 'button' } 
    }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      startTracking();
    }
  }, [isAuthenticated, startTracking]);

  if (!isAuthenticated) {
    return <AuthScreen onLogin={login} onSignup={signup} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-purple-600 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Women Safety App</h1>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-2 rounded-md bg-purple-700 hover:bg-purple-800"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          <UserProfileForm profile={profile} onUpdate={updateProfile} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Emergency Contacts</h2>
                <AddContactForm onAdd={addContact} />
                <div className="mt-6">
                  <ContactsList contacts={contacts} onDelete={deleteContact} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Safety Features</h2>
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                      isListening
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <Mic className="w-5 h-5" />
                        <span>Listening</span>
                      </>
                    ) : (
                      <>
                        <MicOff className="w-5 h-5" />
                        <span>Start Voice Detection</span>
                      </>
                    )}
                  </button>
                </div>

                {voiceError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                    {voiceError}
                  </div>
                )}

                {isListening && lastDetectedPhrase && (
                  <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-md">
                    Last detected phrase: "{lastDetectedPhrase}"
                  </div>
                )}

                <div className="flex flex-col items-center space-y-6">
                  <SOSButton onActivate={handleSOSActivate} isActive={latestAlert?.status === 'pending'} />
                  <LocationDisplay 
                    location={location} 
                    error={locationError}
                    isTracking={isTracking}
                    activeGeofences={activeGeofences}
                    onStartTracking={startTracking}
                    onStopTracking={stopTracking}
                  />
                </div>
              </div>

              <VoiceSettings
                settings={settings}
                onUpdateSettings={updateSettings}
                onAddPhrase={addTriggerPhrase}
                onRemovePhrase={removeTriggerPhrase}
              />
            </div>
          </div>
        </div>
      </main>

      <EmergencyStatus alert={latestAlert} />
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

interface AuthScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (email: string, password: string) => Promise<void>;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onSignup }) => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot-password'>('login');

  const renderView = () => {
    switch (view) {
      case 'signup':
        return <SignupForm onSignup={onSignup} onSwitchToLogin={() => setView('login')} />;
      case 'forgot-password':
        return <ForgotPasswordForm onBackToLogin={() => setView('login')} />;
      default:
        return (
          <LoginForm 
            onLogin={onLogin} 
            onSwitchToSignup={() => setView('signup')}
            onForgotPassword={() => setView('forgot-password')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 to-purple-700 flex items-center justify-center p-4">
      {renderView()}
    </div>
  );
};
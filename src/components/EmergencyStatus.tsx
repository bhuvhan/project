import React from 'react';
import { AlertCircle, CheckCircle2, Clock, Radio } from 'lucide-react';
import type { EmergencyAlert } from '../services/emergencyService';

interface EmergencyStatusProps {
  alert: EmergencyAlert | null;
}

export const EmergencyStatus: React.FC<EmergencyStatusProps> = ({ alert }) => {
  if (!alert) return null;

  const getStatusIcon = () => {
    switch (alert.status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'sent':
        return <Radio className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'delivered':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'acknowledged':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (alert.status) {
      case 'pending':
        return 'Preparing to send alert...';
      case 'sent':
        return 'Alert sent, waiting for delivery...';
      case 'delivered':
        return 'Alert delivered to emergency contacts';
      case 'acknowledged':
        return 'Emergency contacts have acknowledged';
      default:
        return 'Unknown status';
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 max-w-md w-full bg-white rounded-lg shadow-lg p-4 border-l-4 ${
      alert.status === 'acknowledged' ? 'border-green-500' : 'border-yellow-500'
    } animate-slide-in`}>
      <div className="flex items-start space-x-3">
        {getStatusIcon()}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">
            Emergency Alert {alert.type === 'voice' ? `(Triggered by "${alert.trigger}")` : ''}
          </h3>
          <p className="text-sm text-gray-600">{getStatusMessage()}</p>
          {alert.location && (
            <p className="text-xs text-gray-500 mt-1">
              Location: {alert.location.latitude.toFixed(6)}, {alert.location.longitude.toFixed(6)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
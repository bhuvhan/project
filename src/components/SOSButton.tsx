import React, { useState } from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';

interface SOSButtonProps {
  onActivate: () => void;
  isActive?: boolean;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ onActivate, isActive = false }) => {
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);

  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      setIsLongPressing(true);
      onActivate();
    }, 1500); // 1.5 seconds long press
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setIsLongPressing(false);
  };

  return (
    <div className="relative">
      <button
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all transform ${
          isLongPressing ? 'scale-95' : 'scale-100'
        } ${
          isActive
            ? 'bg-red-600 animate-pulse'
            : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        <div className="text-center">
          {isActive ? (
            <AlertTriangle className="w-12 h-12 text-white mb-2 mx-auto animate-pulse" />
          ) : (
            <AlertCircle className="w-12 h-12 text-white mb-2 mx-auto" />
          )}
          <span className="text-white font-bold">
            {isLongPressing ? 'Hold...' : 'SOS'}
          </span>
        </div>
      </button>
      {!isActive && (
        <p className="text-center text-sm text-gray-600 mt-2">
          Press and hold for 1.5 seconds to activate
        </p>
      )}
    </div>
  );
};
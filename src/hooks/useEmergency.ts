import { useState, useEffect } from 'react';
import { emergencyService, type EmergencyAlert } from '../services/emergencyService';

export const useEmergency = () => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(emergencyService.getAlerts());
  const [latestAlert, setLatestAlert] = useState<EmergencyAlert | null>(null);

  useEffect(() => {
    const unsubscribe = emergencyService.subscribe((alert) => {
      setAlerts(current => {
        const updated = current.map(a => 
          a.id === alert.id ? alert : a
        );
        if (!current.find(a => a.id === alert.id)) {
          updated.push(alert);
        }
        return updated;
      });
      setLatestAlert(alert);
    });

    return unsubscribe;
  }, []);

  return {
    alerts,
    latestAlert,
  };
};
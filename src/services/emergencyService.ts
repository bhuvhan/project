import type { Contact, Location } from '../types';

export interface EmergencyAlert {
  id: string;
  timestamp: number;
  location: Location | null;
  type: 'sos' | 'voice' | 'geofence';
  trigger?: string;
  contacts: Contact[];
  status: 'pending' | 'sent' | 'delivered' | 'acknowledged';
}

class EmergencyService {
  private static instance: EmergencyService;
  private alerts: EmergencyAlert[] = [];
  private listeners: Set<(alert: EmergencyAlert) => void> = new Set();

  private constructor() {
    // Initialize emergency service
    window.addEventListener('sos-triggered', this.handleSOS.bind(this));
    window.addEventListener('geofence-alert', this.handleGeofenceAlert.bind(this));
  }

  static getInstance(): EmergencyService {
    if (!EmergencyService.instance) {
      EmergencyService.instance = new EmergencyService();
    }
    return EmergencyService.instance;
  }

  private async handleSOS(event: CustomEvent) {
    const alert: EmergencyAlert = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      location: null, // Will be updated with current location
      type: event.detail.trigger === 'voice' ? 'voice' : 'sos',
      trigger: event.detail.phrase,
      contacts: [], // Will be filled with emergency contacts
      status: 'pending',
    };

    await this.sendEmergencyAlert(alert);
  }

  private async handleGeofenceAlert(event: CustomEvent) {
    const alert: EmergencyAlert = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      location: event.detail.location,
      type: 'geofence',
      trigger: event.detail.zone.name,
      contacts: [], // Will be filled with emergency contacts
      status: 'pending',
    };

    await this.sendEmergencyAlert(alert);
  }

  private async sendEmergencyAlert(alert: EmergencyAlert) {
    try {
      // Get current location if not provided
      if (!alert.location && 'geolocation' in navigator) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
        });

        alert.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
          accuracy: position.coords.accuracy,
        };
      }

      // In a real application, this would integrate with:
      // 1. SMS/messaging service
      // 2. Emergency services API
      // 3. Real-time notification system
      
      // For demo purposes, we'll simulate the alert flow
      alert.status = 'sent';
      this.alerts.push(alert);
      
      // Notify all listeners
      this.listeners.forEach(listener => listener(alert));

      // Simulate delivery acknowledgment
      setTimeout(() => {
        alert.status = 'delivered';
        this.notifyListeners(alert);
      }, 1000);

      // Simulate contact acknowledgment
      setTimeout(() => {
        alert.status = 'acknowledged';
        this.notifyListeners(alert);
      }, 3000);

    } catch (error) {
      console.error('Failed to send emergency alert:', error);
      throw error;
    }
  }

  private notifyListeners(alert: EmergencyAlert) {
    this.listeners.forEach(listener => listener(alert));
  }

  public subscribe(listener: (alert: EmergencyAlert) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getAlerts() {
    return [...this.alerts];
  }
}

export const emergencyService = EmergencyService.getInstance();
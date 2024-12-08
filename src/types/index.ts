export interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  altitude?: number;
  altitudeAccuracy?: number;
}

export interface LocationHistory {
  locations: Location[];
  lastUpdated: number;
}

export interface VoiceSettings {
  triggerPhrases: string[];
  sensitivity: number;
  language: string;
}

export interface GeofenceZone {
  id: string;
  name: string;
  center: [number, number];
  radius: number; // in meters
  type: 'safe' | 'danger';
}

export type SupportedLanguage = 'en-US' | 'en-GB' | 'en-IN' | 'hi-IN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyInfo: string;
  photoUrl?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  isVerified: boolean;
}
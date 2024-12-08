import { useState, useEffect } from 'react';
import type { UserProfile } from '../types';

const STORAGE_KEY = 'user-profile';

const defaultProfile: UserProfile = {
  id: crypto.randomUUID(),
  name: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  address: '',
  emergencyInfo: '',
  photoUrl: '',
};

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  return {
    profile,
    updateProfile,
  };
};
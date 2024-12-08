import { useState, useEffect, useCallback } from 'react';
import { calculateDistance } from '../utils/locationUtils';
import type { Location, GeofenceZone } from '../types';

const LOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000, // Increased timeout
  maximumAge: 0,
};

const LOCATION_STORAGE_KEY = 'last-known-location';
const PERMISSION_CHECK_INTERVAL = 30000; // Check permissions every 30 seconds

export const useLocation = (geofenceZones: GeofenceZone[] = []) => {
  const [location, setLocation] = useState<Location | null>(() => {
    const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [error, setError] = useState<string>('');
  const [isTracking, setIsTracking] = useState(false);
  const [locationHistory, setLocationHistory] = useState<Location[]>([]);
  const [activeGeofences, setActiveGeofences] = useState<GeofenceZone[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null);

  const checkGeofences = useCallback((currentLocation: Location) => {
    const triggeredZones = geofenceZones.filter(zone => {
      const distance = calculateDistance(
        [currentLocation.latitude, currentLocation.longitude],
        zone.center
      );
      return distance <= zone.radius;
    });

    setActiveGeofences(triggeredZones);

    triggeredZones.forEach(zone => {
      if (zone.type === 'danger') {
        window.dispatchEvent(new CustomEvent('geofence-alert', {
          detail: { zone, location: currentLocation }
        }));
      }
    });
  }, [geofenceZones]);

  const handleLocationUpdate = useCallback((position: GeolocationPosition) => {
    const newLocation: Location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      timestamp: position.timestamp,
      accuracy: position.coords.accuracy,
      speed: position.coords.speed || undefined,
      heading: position.coords.heading || undefined,
      altitude: position.coords.altitude || undefined,
      altitudeAccuracy: position.coords.altitudeAccuracy || undefined,
    };

    setLocation(newLocation);
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(newLocation));
    setLocationHistory(prev => [...prev, newLocation]);
    checkGeofences(newLocation);
    setError(''); // Clear any previous errors

    if (window.localStorage.getItem('emergency-mode') === 'active') {
      window.dispatchEvent(new CustomEvent('location-update', {
        detail: { location: newLocation }
      }));
    }
  }, [checkGeofences]);

  const handleLocationError = useCallback((error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setError('Location access denied. Please enable location services in your device settings.');
        break;
      case error.POSITION_UNAVAILABLE:
        setError('Location information is unavailable. Please check your device settings.');
        break;
      case error.TIMEOUT:
        setError('Location request timed out. Please try again.');
        break;
      default:
        setError('An unknown error occurred while getting location.');
    }
    setIsTracking(false);
  }, []);

  const checkPermissions = useCallback(async () => {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionStatus(result.state);
        
        if (result.state === 'denied') {
          setError('Location permission denied. Please enable location services.');
          setIsTracking(false);
        }

        result.addEventListener('change', () => {
          setPermissionStatus(result.state);
          if (result.state === 'granted' && !isTracking) {
            startTracking();
          } else if (result.state === 'denied') {
            setError('Location permission denied. Please enable location services.');
            setIsTracking(false);
          }
        });
      } catch (error) {
        console.error('Error checking permissions:', error);
      }
    }
  }, [isTracking]);

  const startTracking = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    await checkPermissions();
    
    if (permissionStatus === 'denied') {
      return;
    }

    setIsTracking(true);
    setError('');

    // Request high-accuracy position immediately
    navigator.geolocation.getCurrentPosition(
      handleLocationUpdate,
      handleLocationError,
      LOCATION_OPTIONS
    );
  }, [handleLocationUpdate, handleLocationError, checkPermissions, permissionStatus]);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
  }, []);

  useEffect(() => {
    let watchId: number;
    let permissionCheckInterval: NodeJS.Timeout;

    if (isTracking) {
      watchId = navigator.geolocation.watchPosition(
        handleLocationUpdate,
        handleLocationError,
        LOCATION_OPTIONS
      );

      // Periodically check permissions
      permissionCheckInterval = setInterval(checkPermissions, PERMISSION_CHECK_INTERVAL);
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (permissionCheckInterval) {
        clearInterval(permissionCheckInterval);
      }
    };
  }, [isTracking, handleLocationUpdate, handleLocationError, checkPermissions]);

  return {
    location,
    error,
    isTracking,
    locationHistory,
    activeGeofences,
    permissionStatus,
    startTracking,
    stopTracking,
  };
};
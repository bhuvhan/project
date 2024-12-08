import React, { useMemo } from 'react';
import { MapPin, Navigation, Share2, AlertTriangle, Settings } from 'lucide-react';
import type { Location, GeofenceZone } from '../types';
import { formatLocation, getLocationShareLink, isLocationStale } from '../utils/locationUtils';

interface LocationDisplayProps {
  location: Location | null;
  error?: string;
  isTracking: boolean;
  activeGeofences: GeofenceZone[];
  permissionStatus: PermissionState | null;
  onStartTracking: () => void;
  onStopTracking: () => void;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({
  location,
  error,
  isTracking,
  activeGeofences,
  permissionStatus,
  onStartTracking,
  onStopTracking,
}) => {
  const shareLocation = () => {
    if (location) {
      const shareLink = getLocationShareLink(location);
      if (navigator.share) {
        navigator.share({
          title: 'My Location',
          text: 'Here is my current location',
          url: shareLink,
        }).catch(console.error);
      } else {
        window.open(shareLink, '_blank');
      }
    }
  };

  const isStale = useMemo(() => 
    location ? isLocationStale(location) : false,
  [location]);

  const handlePermissionRequest = () => {
    if (permissionStatus === 'denied') {
      // Open device settings on mobile
      if (navigator.userAgent.toLowerCase().includes('mobile')) {
        window.location.href = 'app-settings:';
      } else {
        alert('Please enable location services in your browser settings.');
      }
    } else {
      onStartTracking();
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          <div>
            <p className="font-medium">{error}</p>
            {permissionStatus === 'denied' && (
              <button
                onClick={handlePermissionRequest}
                className="mt-2 text-sm bg-red-100 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
              >
                <Settings className="w-4 h-4 inline mr-1" />
                Open Settings
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-800">Location Tracking</h3>
        </div>
        <button
          onClick={isTracking ? onStopTracking : handlePermissionRequest}
          className={`px-4 py-2 rounded-md ${
            isTracking
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          } transition-colors`}
        >
          {isTracking ? 'Stop Tracking' : 'Start Tracking'}
        </button>
      </div>

      {location ? (
        <div className="space-y-3">
          <div className="space-y-1 text-sm text-gray-600">
            <p className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{formatLocation(location)}</span>
            </p>
            {location.speed && (
              <p className="flex items-center space-x-2">
                <Navigation className="w-4 h-4" />
                <span>{(location.speed * 3.6).toFixed(1)} km/h</span>
              </p>
            )}
            <p className="flex items-center space-x-2">
              <span>Accuracy: ±{location.accuracy?.toFixed(0)}m</span>
            </p>
            <p className={`text-xs ${isStale ? 'text-red-500' : 'text-gray-500'}`}>
              Last updated: {new Date(location.timestamp).toLocaleTimeString()}
              {isStale && ' (Stale)'}
            </p>
          </div>

          {activeGeofences.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Active Zones:</h4>
              <div className="flex flex-wrap gap-2">
                {activeGeofences.map(zone => (
                  <span
                    key={zone.id}
                    className={`px-2 py-1 rounded-full text-sm ${
                      zone.type === 'danger'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {zone.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={shareLocation}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 w-full justify-center transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Location</span>
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600">Waiting for location...</p>
        </div>
      )}
    </div>
  );
};
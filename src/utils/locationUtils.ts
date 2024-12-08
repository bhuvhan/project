import haversine from 'haversine-distance';
import type { Location } from '../types';

export const calculateDistance = (
  point1: [number, number],
  point2: [number, number]
): number => {
  return haversine(
    { latitude: point1[0], longitude: point1[1] },
    { latitude: point2[0], longitude: point2[1] }
  );
};

export const calculateSpeed = (
  location1: Location,
  location2: Location
): number => {
  const distance = calculateDistance(
    [location1.latitude, location1.longitude],
    [location2.latitude, location2.longitude]
  );
  const timeDiff = (location2.timestamp - location1.timestamp) / 1000; // Convert to seconds
  return distance / timeDiff; // meters per second
};

export const formatLocation = (location: Location): string => {
  return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
};

export const getLocationShareLink = (location: Location): string => {
  return `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
};

export const isLocationStale = (location: Location, maxAge: number = 30000): boolean => {
  return Date.now() - location.timestamp > maxAge;
};
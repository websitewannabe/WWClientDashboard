import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

// Types for tour definition
export interface TourStep {
  target: string;  // CSS selector for the target element
  title: string;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

export interface Tour {
  id: string;
  name: string;
  steps: TourStep[];
  route?: string; // Optional route this tour applies to
}

// Store tours in localStorage
const TOUR_STORAGE_KEY = 'client-portal-completed-tours';

const useGuidedTour = () => {
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const [completedTours, setCompletedTours] = useState<string[]>([]);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [location] = useLocation();

  // Load completed tours from localStorage
  useEffect(() => {
    const storedTours = localStorage.getItem(TOUR_STORAGE_KEY);
    if (storedTours) {
      try {
        setCompletedTours(JSON.parse(storedTours));
      } catch (error) {
        console.error('Error parsing completed tours from localStorage', error);
      }
    }
  }, []);

  // Save completed tours to localStorage
  const saveCompletedTours = (tourIds: string[]) => {
    setCompletedTours(tourIds);
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(tourIds));
  };

  // Start a tour
  const startTour = (tour: Tour) => {
    setActiveTour(tour);
    setIsTourOpen(true);
  };

  // Complete a tour
  const completeTour = () => {
    if (activeTour) {
      const newCompletedTours = [...completedTours, activeTour.id];
      saveCompletedTours(newCompletedTours);
    }
    setIsTourOpen(false);
    setActiveTour(null);
  };

  // Skip a tour
  const skipTour = () => {
    setIsTourOpen(false);
    setActiveTour(null);
  };

  // Check if a tour is completed
  const isTourCompleted = (tourId: string) => {
    return completedTours.includes(tourId);
  };

  // Reset all completed tours
  const resetAllTours = () => {
    saveCompletedTours([]);
  };

  // Reset a specific tour
  const resetTour = (tourId: string) => {
    const newCompletedTours = completedTours.filter(id => id !== tourId);
    saveCompletedTours(newCompletedTours);
  };

  return {
    activeTour,
    isTourOpen,
    startTour,
    completeTour,
    skipTour,
    isTourCompleted,
    resetAllTours,
    resetTour,
  };
};

export default useGuidedTour;
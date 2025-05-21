import React, { createContext, useContext, ReactNode } from 'react';
import useGuidedTour, { Tour } from '@/hooks/use-guided-tour';
import GuidedTour from '@/components/ui/guided-tour';

interface TourContextType {
  startTour: (tour: Tour) => void;
  isTourCompleted: (tourId: string) => boolean;
  resetTour: (tourId: string) => void;
  resetAllTours: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    activeTour,
    isTourOpen,
    startTour,
    completeTour,
    skipTour,
    isTourCompleted,
    resetAllTours,
    resetTour,
  } = useGuidedTour();

  return (
    <TourContext.Provider value={{ startTour, isTourCompleted, resetTour, resetAllTours }}>
      {children}
      {activeTour && (
        <GuidedTour
          steps={activeTour.steps}
          onComplete={completeTour}
          onSkip={skipTour}
          isOpen={isTourOpen}
        />
      )}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

// Define tours for different pages
export const tourDefinitions: Tour[] = [
  {
    id: 'invoices-tour',
    name: 'Invoices Page Tour',
    route: '/invoices',
    steps: [
      {
        target: '.search-invoices',
        title: 'Search Invoices',
        content: 'Quickly find invoices by typing keywords, invoice numbers, or amounts.',
        position: 'bottom'
      },
      {
        target: '.date-filter',
        title: 'Date Filter',
        content: 'Filter invoices by date range to see only the time period you need.',
        position: 'bottom'
      },
      {
        target: '.status-filters',
        title: 'Status Filters',
        content: 'Filter invoices by their status: All, Pending, Paid, or Overdue.',
        position: 'bottom'
      },
      {
        target: '.invoice-table',
        title: 'Invoice Details',
        content: 'View all your invoices with details like date, amount, and status.',
        position: 'top'
      },
      {
        target: '.invoice-actions',
        title: 'Actions',
        content: 'View invoice details or download a PDF copy for your records.',
        position: 'left'
      }
    ]
  },
  {
    id: 'dashboard-tour',
    name: 'Dashboard Tour',
    route: '/dashboard',
    steps: [
      {
        target: '.dashboard-stats',
        title: 'Overview Statistics',
        content: 'Get a quick overview of your account status including pending payments and open tickets.',
        position: 'bottom'
      },
      {
        target: '.recent-activity',
        title: 'Recent Activity',
        content: 'See your latest account activities including invoices, payments, and support tickets.',
        position: 'right'
      },
      {
        target: '.analytics-panel',
        title: 'Website Analytics',
        content: 'Monitor your website performance with visitor statistics and traffic trends.',
        position: 'left'
      }
    ]
  }
];
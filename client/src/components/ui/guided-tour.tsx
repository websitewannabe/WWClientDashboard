import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TourStep {
  target: string;  // CSS selector for the target element
  title: string;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

interface TourProps {
  steps: TourStep[];
  onComplete: () => void;
  onSkip: () => void;
  isOpen: boolean;
}

const GuidedTour: React.FC<TourProps> = ({ steps, onComplete, onSkip, isOpen }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isOpen) return;
    
    const updatePosition = () => {
      const currentTarget = steps[currentStep]?.target;
      if (!currentTarget) return;

      const element = document.querySelector(currentTarget);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      setTargetRect(rect);

      const position = steps[currentStep]?.position || 'bottom';
      
      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = rect.top - 10 - 150; // 150px is the approximate height of the tour card
          left = rect.left + rect.width / 2 - 150; // 150px is half the width of the tour card
          break;
        case 'right':
          top = rect.top + rect.height / 2 - 75;
          left = rect.right + 10;
          break;
        case 'bottom':
          top = rect.bottom + 10;
          left = rect.left + rect.width / 2 - 150;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - 75;
          left = rect.left - 10 - 300; // 300px is the approximate width of the tour card
          break;
      }

      // Ensure the card stays within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      if (left < 10) left = 10;
      if (left + 300 > viewportWidth - 10) left = viewportWidth - 300 - 10;
      if (top < 10) top = 10;
      if (top + 150 > viewportHeight - 10) top = viewportHeight - 150 - 10;

      setPosition({ top, left });
    };

    updatePosition();
    
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    
    // Highlight the target element
    const currentTarget = steps[currentStep]?.target;
    if (currentTarget) {
      const element = document.querySelector(currentTarget);
      if (element) {
        element.classList.add('tour-highlight');
      }
    }
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      
      // Remove highlight from the target element
      const currentTarget = steps[currentStep]?.target;
      if (currentTarget) {
        const element = document.querySelector(currentTarget);
        if (element) {
          element.classList.remove('tour-highlight');
        }
      }
    };
  }, [currentStep, isOpen, steps]);

  if (!isOpen || !steps.length) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTourStep = steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onSkip} />
      
      {/* Highlight target element */}
      {targetRect && (
        <div
          className="absolute z-50 border-2 border-primary rounded-md pointer-events-none"
          style={{
            top: targetRect.top + window.scrollY,
            left: targetRect.left + window.scrollX,
            width: targetRect.width,
            height: targetRect.height,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
          }}
        />
      )}
      
      {/* Tour card */}
      <Card
        className="fixed z-50 w-[300px] shadow-lg"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`
        }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">{currentTourStep.title}</h3>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm mb-4">{currentTourStep.content}</p>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-500">
                {currentStep + 1} of {steps.length}
              </span>
            </div>
            <div className="flex space-x-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={handlePrev}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              <Button size="sm" onClick={handleNext}>
                {currentStep < steps.length - 1 ? (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  'Finish'
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default GuidedTour;
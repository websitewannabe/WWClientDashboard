import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

// Define window.Intercom for TypeScript
declare global {
  interface Window {
    Intercom: any;
    intercomSettings: any;
  }
}

export function IntercomProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Load the Intercom script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://widget.intercom.io/widget/' + process.env.INTERCOM_APP_ID;
    document.head.appendChild(script);

    // Initialize Intercom
    window.intercomSettings = {
      app_id: process.env.INTERCOM_APP_ID,
      alignment: 'right',
      horizontal_padding: 20,
      vertical_padding: 20,
    };

    if (window.Intercom) {
      window.Intercom('boot', window.intercomSettings);
    }

    return () => {
      // Clean up
      if (window.Intercom) {
        window.Intercom('shutdown');
      }
      document.head.removeChild(script);
    };
  }, []);

  // Update user data when authentication state changes
  useEffect(() => {
    if (isAuthenticated && user && window.Intercom) {
      window.Intercom('update', {
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email,
        created_at: new Date().getTime() / 1000, // Convert to Unix timestamp
      });
    }
  }, [isAuthenticated, user]);

  return <>{children}</>;
}

export default IntercomProvider;
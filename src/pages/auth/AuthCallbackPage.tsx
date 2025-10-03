import { supabase } from '@/supabase/client';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current URL hash which contains the authentication data
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          navigate('/auth/signin?error=callback_failed');
          return;
        }

        if (data.session) {
          // User is authenticated, redirect to home
          console.log('Auth callback successful:', data.session.user);
          navigate('/');
        } else {
          // No session found, redirect to sign in
          navigate('/auth/signin');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/auth/signin?error=callback_failed');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}

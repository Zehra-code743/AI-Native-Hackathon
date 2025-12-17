import { useState, useEffect } from 'react';
import { authClient, User } from '@site/src/lib/better-auth/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

/**
 * Custom hook for authentication
 * Provides user state and authentication actions
 */
export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch session on mount
  useEffect(() => {
    refreshSession();
  }, []);

  const refreshSession = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await authClient.session.get();
      if (error) {
        console.error('Session fetch error:', error);
        setUser(null);
      } else {
        setUser(data?.user || null);
      }
    } catch (err) {
      console.error('Session fetch exception:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authClient.signIn.email(
        { email, password },
        {
          onSuccess: (ctx) => {
            setUser(ctx.data.user as User);
          },
          onError: (ctx) => {
            console.error('Sign in error:', ctx.error);
          },
        }
      );
      return result;
    } catch (error) {
      console.error('Sign in exception:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const result = await authClient.signUp.email(
        { email, password, name },
        {
          onSuccess: (ctx) => {
            setUser(ctx.data.user as User);
          },
          onError: (ctx) => {
            console.error('Sign up error:', ctx.error);
          },
        }
      );
      return result;
    } catch (error) {
      console.error('Sign up exception:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };
}

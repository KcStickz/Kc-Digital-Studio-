import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, PRIMARY_ADMIN_EMAIL } from './client';

interface SupabaseAuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  isAuthenticating: boolean;
  error: string | null;
  isConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const configured = useMemo(() => isSupabaseConfigured(), []);

  // Check if current user is the authorized administrator
  const isAdmin = useMemo(() => {
    if (!user || !user.email) return false;
    return user.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase();
  }, [user]);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    // Listen for auth state changes (Supabase SDK fires immediately on boot with INITIAL_SESSION)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [configured]);

  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    setIsAuthenticating(true);

    if (!configured) {
      const msg = 'Supabase publishable key is not yet configured. Please set VITE_SUPABASE_ANON_KEY in your environment.';
      setError(msg);
      setIsAuthenticating(false);
      return { success: false, error: msg };
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setIsAuthenticating(false);
        return { success: false, error: signInError.message };
      }

      const loggedInEmail = data.user?.email?.toLowerCase();
      if (loggedInEmail !== PRIMARY_ADMIN_EMAIL.toLowerCase()) {
        await supabase.auth.signOut();
        const unauthorizedMsg = `Access restricted. ${data.user?.email || 'This account'} is not authorized for the KC NEXUS Studio administration.`;
        setError(unauthorizedMsg);
        setIsAuthenticating(false);
        return { success: false, error: unauthorizedMsg };
      }

      setUser(data.user);
      setSession(data.session);
      setIsAuthenticating(false);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication request failed.';
      setError(msg);
      setIsAuthenticating(false);
      return { success: false, error: msg };
    }
  };

  const signOut = async () => {
    try {
      if (configured) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Supabase signOut warning:', e);
    } finally {
      setUser(null);
      setSession(null);
      setError(null);
    }
  };

  const clearError = () => setError(null);

  return (
    <SupabaseAuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        isAuthenticating,
        error,
        isConfigured: configured,
        signInWithEmail,
        signOut,
        clearError,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = (): SupabaseAuthContextType => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

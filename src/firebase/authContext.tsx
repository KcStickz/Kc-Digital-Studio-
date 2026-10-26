import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, ADMIN_EMAILS, PRIMARY_ADMIN_EMAIL } from './config';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  isAuthenticating: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<boolean>;
  loginAsLocalAdmin: () => void;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_ADMIN_USER = {
  uid: 'local-admin-uid',
  email: PRIMARY_ADMIN_EMAIL,
  displayName: 'Kelechi Salvation (Admin)',
  emailVerified: true,
  isAnonymous: false,
} as unknown as User;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localAdminActive, setLocalAdminActive] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('kcnexus_local_admin') === 'true';
  });
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('kcnexus_local_admin') === 'true') {
      return LOCAL_ADMIN_USER;
    }
    return null;
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('kcnexus_local_admin') === 'true';
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else if (localAdminActive) {
        setUser(LOCAL_ADMIN_USER);
      } else {
        setUser(null);
      }

      if (currentUser && currentUser.email) {
        const emailLower = currentUser.email.toLowerCase();
        const isWhitelisted = ADMIN_EMAILS.some((e) => e.toLowerCase() === emailLower);

        if (isWhitelisted) {
          setIsAdmin(true);
          // Sync admin record in Firestore
          try {
            const adminDocRef = doc(db, 'admins', currentUser.uid);
            const adminSnap = await getDoc(adminDocRef);
            if (!adminSnap.exists()) {
              await setDoc(adminDocRef, {
                email: currentUser.email,
                role: 'admin',
                createdAt: new Date().toISOString(),
              });
            }
          } catch (err) {
            console.warn('Could not sync admin document:', err);
          }
        } else {
          // Check if admin doc exists for this UID
          try {
            const adminDocRef = doc(db, 'admins', currentUser.uid);
            const adminSnap = await getDoc(adminDocRef);
            setIsAdmin(adminSnap.exists() || localAdminActive);
          } catch {
            setIsAdmin(localAdminActive);
          }
        }
      } else {
        setIsAdmin(localAdminActive);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [localAdminActive]);

  const loginAsLocalAdmin = () => {
    try {
      sessionStorage.setItem('kcnexus_local_admin', 'true');
    } catch {
      // storage unavailable
    }
    setLocalAdminActive(true);
    setIsAdmin(true);
    setUser(LOCAL_ADMIN_USER);
    setError(null);
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setError(null);
    setIsAuthenticating(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      // Attempt sign-in with automatic retry if transient network error occurs during origin validation
      let result;
      try {
        result = await signInWithPopup(auth, provider);
      } catch (firstErr: unknown) {
        const code = (firstErr as { code?: string })?.code;
        if (code === 'auth/network-request-failed') {
          console.warn('First sign-in attempt encountered network error, retrying in 600ms...');
          await new Promise((r) => setTimeout(r, 600));
          result = await signInWithPopup(auth, provider);
        } else {
          throw firstErr;
        }
      }

      const email = result.user.email?.toLowerCase();
      
      const isAuthorized = ADMIN_EMAILS.some((e) => e.toLowerCase() === email);
      if (!isAuthorized) {
        // Also check if admin record in Firestore
        const adminDocRef = doc(db, 'admins', result.user.uid);
        const adminSnap = await getDoc(adminDocRef);
        if (!adminSnap.exists()) {
          setError(
            `Access restricted. The account "${result.user.email}" is not registered as an authorized administrator for KC NEXUS. Only ${PRIMARY_ADMIN_EMAIL} is granted administrative privileges.`
          );
          setIsAdmin(false);
          return false;
        }
      }

      setIsAdmin(true);
      return true;
    } catch (err: unknown) {
      console.error('Google Sign-In Error:', err);
      let userFriendlyMessage = 'Authentication failed. Please try again.';

      if (err && typeof err === 'object') {
        const fbErr = err as { code?: string; message?: string };
        switch (fbErr.code) {
          case 'auth/network-request-failed':
            userFriendlyMessage =
              'Connection to Google Authentication services was interrupted or blocked. If you are using Brave Shields, uBlock Origin, or an ad-blocker, please allow popups / disable shields for this preview site and try again.';
            break;
          case 'auth/popup-blocked':
            userFriendlyMessage =
              'The Google Sign-In popup was blocked by your browser. Please allow popups for this site and click Sign In again.';
            break;
          case 'auth/popup-closed-by-user':
            userFriendlyMessage =
              'The sign-in window was closed before completing authentication. Please click the button to try again.';
            break;
          case 'auth/cancelled-popup-request':
            userFriendlyMessage =
              'Another sign-in window was already open. Please try again.';
            break;
          case 'auth/unauthorized-domain':
            userFriendlyMessage =
              'This application domain is not authorized in Firebase Authentication settings. Please verify authorized domains in the Firebase Console.';
            break;
          default:
            userFriendlyMessage = fbErr.message || 'Authentication failed. Please try again.';
        }
      }

      setError(userFriendlyMessage);
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    try {
      sessionStorage.removeItem('kcnexus_local_admin');
      await fbSignOut(auth);
      setUser(null);
      setLocalAdminActive(false);
      setIsAdmin(false);
      setError(null);
    } catch (err: unknown) {
      console.error('Sign out error:', err);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        isAuthenticating,
        error,
        loginWithGoogle,
        loginAsLocalAdmin,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, ArrowLeft, AlertTriangle, CheckCircle2, Key, Mail, Database } from 'lucide-react';
import Logo from '../../components/Logo';
import { useSupabaseAuth } from '../../supabase/authContext';
import { PRIMARY_ADMIN_EMAIL } from '../../supabase/client';
import { useAuth as useFirebaseAuth } from '../../firebase/authContext';

export const AdminLoginPage: React.FC = () => {
  const {
    user: supabaseUser,
    isAdmin: isSupabaseAdmin,
    loading: isSupabaseLoading,
    isAuthenticating,
    error: supabaseError,
    isConfigured,
    signInWithEmail,
    clearError,
  } = useSupabaseAuth();

  const { loginAsLocalAdmin, isAdmin: isLocalAdmin, loading: isFirebaseLoading } = useFirebaseAuth();
  const navigate = useNavigate();

  const isAuthLoading = isSupabaseLoading || isFirebaseLoading;

  const [email, setEmail] = useState<string>(PRIMARY_ADMIN_EMAIL);
  const [password, setPassword] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // If already logged in as administrator, redirect to dashboard
  useEffect(() => {
    if (!isAuthLoading && (isSupabaseAdmin || isLocalAdmin)) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isSupabaseAdmin, isLocalAdmin, isAuthLoading, navigate]);

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!email.trim()) {
      setFormError('Please enter your administrator email address.');
      return;
    }
    if (!password) {
      setFormError('Please enter your Supabase password.');
      return;
    }

    const res = await signInWithEmail(email, password);
    if (res.success) {
      navigate('/admin/dashboard', { replace: true });
    } else if (res.error) {
      setFormError(res.error);
    }
  };

  const handleBypass = () => {
    loginAsLocalAdmin();
    navigate('/admin/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#080A14] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6A00]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-6 border-b border-white/5 flex items-center justify-between relative z-10">
        <div className="inline-block transition-transform hover:scale-105">
          <Logo size={42} showText={true} />
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#FF6A00] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Website</span>
        </Link>
      </header>

      {/* Main card */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md bg-[#0F1424]/90 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          {/* Badge */}
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/25 text-[#FF6A00] text-xs font-semibold uppercase tracking-widest">
              <Shield className="w-3.5 h-3.5" />
              <span>Studio Administration</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              KC NEXUS Portal
            </h1>
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>Supabase Backend &bull; Project: kc-nexus</span>
            </p>
          </div>

          {/* Config notice if publishable key is not set yet */}
          {!isConfigured && (
            <div className="mb-6 p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs text-orange-200 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-[#FF6A00]">
                <Key className="w-4 h-4" />
                <span>Publishable Key Pending</span>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                Add <code className="text-orange-300 font-mono">VITE_SUPABASE_ANON_KEY</code> to your environment to activate live Supabase sign-in. You can also use the authorized studio bypass below during development.
              </p>
            </div>
          )}

          {/* Error message */}
          {(formError || supabaseError) && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-200 mb-0.5">Authentication Notice</p>
                  <p className="text-red-300/90 leading-relaxed">
                    {formError || supabaseError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Supabase Email/Password Form */}
          <form onSubmit={handleSupabaseLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#FF6A00]" />
                <span>Administrator Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="okoobenikelechisalvation@gmail.com"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6A00] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#FF6A00]" />
                <span>Supabase Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your administrator password"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6A00] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 px-4 rounded-xl bg-[#FF6A00] hover:bg-[#e65f00] text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-[#FF6A00]/20 cursor-pointer disabled:opacity-60"
            >
              {isAuthenticating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying with Supabase...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Sign In with Supabase</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-3 items-center my-2">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-3 text-[10px] text-gray-500 uppercase tracking-wider">
              or development access
            </span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* Direct Development Bypass Button */}
          <button
            type="button"
            onClick={handleBypass}
            className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer hover:border-[#FF6A00]/40"
          >
            <Shield className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>Enter Studio Dashboard ({PRIMARY_ADMIN_EMAIL})</span>
          </button>

          {/* Footer note */}
          <div className="pt-4 mt-4 border-t border-white/5 space-y-1.5 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>Restricted to Authorized Administrator</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              <span>Direct Supabase Storage &amp; Database Connected</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-white/5 text-center text-xs text-gray-500 relative z-10">
        &copy; {new Date().getFullYear()} KC NEXUS &bull; Directed by OKO-OBENI KELECHI SALVATION
      </footer>
    </div>
  );
};

export default AdminLoginPage;

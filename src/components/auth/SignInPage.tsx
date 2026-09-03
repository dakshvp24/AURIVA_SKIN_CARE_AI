import React, { useState } from 'react';
import { Mail, Lock, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { auth, isValidEmail, formatAuthError, signInWithEmailAndPassword } from '../../config/firebase';
import { UserProfile } from '../../types';

interface SignInPageProps {
  onSuccess: (user: UserProfile) => void;
  onNavigateToSignUp: () => void;
  onNavigateHome: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onSuccess,
  onNavigateToSignUp,
  onNavigateHome
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      if (!auth) {
        throw new Error('Firebase Authentication is not available. Please check network connection.');
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      if (userCredential.user) {
        const fbUser = userCredential.user;
        const userObj: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          email: fbUser.email || email.trim(),
          createdAt: fbUser.metadata?.creationTime || new Date().toISOString()
        };
        onSuccess(userObj);
      }
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div 
            onClick={onNavigateHome}
            className="w-12 h-12 rounded-xl bg-[#2D4A3E] text-white flex items-center justify-center mx-auto cursor-pointer shadow-xs hover:scale-105 transition-transform"
          >
            <Sparkles className="w-6 h-6 text-emerald-300" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2D4A3E]">AURIVA Platform</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111827]">Welcome Back</h1>
          <p className="text-xs sm:text-sm text-[#4B5563] font-medium">
            Sign in to access your Auriva skin profile & assessment history.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-xs text-red-700 flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#111827]">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#2D4A3E]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#111827]">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#2D4A3E]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#2D4A3E] text-white font-semibold text-sm hover:bg-[#233B31] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        <div className="pt-4 border-t border-[#E5E7EB] text-center">
          <p className="text-xs text-[#4B5563]">
            Don't have an Auriva account?{' '}
            <button
              onClick={onNavigateToSignUp}
              className="font-semibold text-[#2D4A3E] hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

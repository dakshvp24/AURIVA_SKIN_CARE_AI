import React, { useState } from 'react';
import { User, Mail, Lock, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { auth, isValidEmail, formatAuthError, createUserWithEmailAndPassword, updateProfile } from '../../config/firebase';
import { userService } from '../../services/userService';
import { UserProfile } from '../../types';

interface SignUpPageProps {
  onSuccess: (user: UserProfile) => void;
  onNavigateToSignIn: () => void;
  onNavigateHome: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onSuccess,
  onNavigateToSignIn,
  onNavigateHome
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('All fields are required. Please complete the form.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    setLoading(true);

    try {
      if (!auth) {
        throw new Error('Firebase Authentication is not available. Please check network connection.');
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      if (userCredential.user) {
        const fbUser = userCredential.user;
        try {
          await updateProfile(fbUser, {
            displayName: fullName.trim()
          });
        } catch (e) {}

        const userObj: UserProfile = {
          id: fbUser.uid,
          name: fullName.trim(),
          email: fbUser.email || email.trim(),
          createdAt: fbUser.metadata?.creationTime || new Date().toISOString()
        };

        // Initialize Firestore user document with UID as key
        await userService.initializeUserDocument(fbUser.uid, {
          email: userObj.email,
          name: userObj.name
        });

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
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111827]">Create Account</h1>
          <p className="text-xs sm:text-sm text-[#4B5563] font-medium">
            Join Auriva for personalized skin assessment and routine recommendations.
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
            <label className="text-xs font-semibold uppercase tracking-wider text-[#111827]">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Jane Doe"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#2D4A3E]"
              />
            </div>
          </div>

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
                placeholder="Minimum 6 characters"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#2D4A3E]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#111827]">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
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
              <span>Creating account...</span>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        <div className="pt-4 border-t border-[#E5E7EB] text-center">
          <p className="text-xs text-[#4B5563]">
            Already have an Auriva account?{' '}
            <button
              onClick={onNavigateToSignIn}
              className="font-semibold text-[#2D4A3E] hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

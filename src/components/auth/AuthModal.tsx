import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { auth, isValidEmail, formatAuthError, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from '../../config/firebase';
import { userService } from '../../services/userService';
import { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Common validations
    if (!email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.');
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
    }

    setLoading(true);

    try {
      if (!auth) {
        throw new Error('Firebase Authentication is not available. Please check network connection.');
      }

      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        if (userCredential.user) {
          const fbUser = userCredential.user;
          try {
            await updateProfile(fbUser, { displayName: name.trim() });
          } catch (e) {}
          const userObj: UserProfile = {
            id: fbUser.uid,
            name: name.trim(),
            email: fbUser.email || email.trim(),
            createdAt: fbUser.metadata?.creationTime || new Date().toISOString()
          };
          await userService.initializeUserDocument(fbUser.uid, {
            email: userObj.email,
            name: userObj.name
          });
          onSuccess(userObj);
          onClose();
        }
      } else {
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
          onClose();
        }
      }
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#FAFAF7] border border-[#E5DFD5] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#666666] hover:bg-[#EFECE6] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#4A5D4E] text-white flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F1F1F]">
            {mode === 'signin' ? 'Sign In to DermAI' : 'Create DermAI Account'}
          </h2>
          <p className="text-xs text-[#666666]">
            {mode === 'signin' 
              ? 'Enter your email and password to sign in.' 
              : 'Sign up to manage your skin profile and assessment history.'}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#EFECE6] rounded-full text-xs font-semibold">
          <button
            onClick={() => { setMode('signin'); setError(null); }}
            className={`py-2 rounded-full transition-all ${mode === 'signin' ? 'bg-[#4A5D4E] text-white shadow-sm' : 'text-[#666666]'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setError(null); }}
            className={`py-2 rounded-full transition-all ${mode === 'signup' ? 'bg-[#4A5D4E] text-white shadow-sm' : 'text-[#666666]'}`}
          >
            Sign Up
          </button>
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
          
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1F1F1F]">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#888888] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Jane Doe"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5DFD5] rounded-xl text-xs focus:outline-none focus:border-[#4A5D4E]"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1F1F1F]">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#888888] absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                disabled={loading}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5DFD5] rounded-xl text-xs focus:outline-none focus:border-[#4A5D4E]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1F1F1F]">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#888888] absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'Minimum 6 characters' : '••••••••'}
                disabled={loading}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5DFD5] rounded-xl text-xs focus:outline-none focus:border-[#4A5D4E]"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1F1F1F]">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#888888] absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5DFD5] rounded-xl text-xs focus:outline-none focus:border-[#4A5D4E]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#4A5D4E] text-white font-semibold text-xs hover:bg-[#3E4D3C] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>{mode === 'signin' ? 'Signing in...' : 'Creating account...'}</span>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};

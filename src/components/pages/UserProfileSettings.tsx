import React, { useState, useEffect, useRef } from 'react';
import { 
  User, LogOut, ShieldCheck, Mail, Calendar, MapPin, Sparkles, 
  Camera, Check, AlertCircle, Edit3, Lock, Bell, Sliders 
} from 'lucide-react';
import { UserProfile, SkinProfile } from '../../types';
import { userService } from '../../services/userService';

interface UserProfileSettingsProps {
  user: UserProfile | null;
  skinProfile: SkinProfile | null;
  onLogout: () => void;
  onNavigate: (tab: string) => void;
  onUpdateUser?: (updated: UserProfile) => void;
}

type SettingsTab = 'profile' | 'edit' | 'account' | 'preferences';

const SUPPORTED_SKIN_TYPES = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive'];

export const UserProfileSettings: React.FC<UserProfileSettingsProps> = ({
  user: initialUser,
  skinProfile,
  onLogout,
  onNavigate,
  onUpdateUser
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(initialUser);
  const [loading, setLoading] = useState(true);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<string>('');
  const [address, setAddress] = useState('');
  const [skinType, setSkinType] = useState('Combination');
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);

  // Status & Feedback States
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Preferences State
  const [dailyReminders, setDailyReminders] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load latest user profile on mount
  useEffect(() => {
    async function load() {
      if (initialUser) {
        setLoading(true);
        const loaded = await userService.getUserProfile(initialUser);
        setCurrentUser(loaded);
        populateForm(loaded);
        setLoading(false);
      }
    }
    load();
  }, [initialUser]);

  const populateForm = (profile: UserProfile) => {
    setFirstName(profile.firstName || profile.name.split(' ')[0] || '');
    setLastName(profile.lastName || profile.name.split(' ').slice(1).join(' ') || '');
    setEmail(profile.email || '');
    setAge(profile.age !== undefined && profile.age !== null ? String(profile.age) : '');
    setAddress(profile.address || '');
    setSkinType(profile.skinType || skinProfile?.skinType || 'Combination');
    setAvatarPreview(profile.avatarUrl);
  };

  // Handle Photo File Selection
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    const validFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validFormats.includes(file.type.toLowerCase())) {
      setFormError('Please select a valid image file (JPG, JPEG, PNG, or WEBP).');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size exceeds 5MB. Please select a smaller photo.');
      return;
    }

    setFormError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Form Submission
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    // Validation
    if (!firstName.trim()) {
      setFormError('Please enter your first name.');
      return;
    }

    let parsedAge: number | undefined = undefined;
    if (age.trim()) {
      parsedAge = Number(age);
      if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
        setFormError('Please enter a valid age (1-120).');
        return;
      }
    }

    if (!currentUser) return;

    setSaving(true);
    const updated: UserProfile = {
      ...currentUser,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age: parsedAge,
      address: address.trim(),
      skinType,
      avatarUrl: avatarPreview
    };

    const res = await userService.saveUserProfile(updated);
    setSaving(false);

    if (res.success) {
      setCurrentUser(res.profile);
      if (onUpdateUser) onUpdateUser(res.profile);
      setSuccessMsg('Profile updated successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
      setActiveTab('profile');
    } else {
      setFormError(res.error || 'Failed to update profile. Please try again.');
    }
  };

  const initials = userService.getUserInitials(currentUser);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 max-w-md w-full text-center space-y-3 shadow-xs">
          <User className="w-10 h-10 text-[#2D4A3E] animate-bounce mx-auto" />
          <h2 className="font-serif text-xl font-bold text-[#111827]">Loading Profile Settings...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in font-sans">
      
      {/* 1. HEADER BAR & SUB-SECTION NAVIGATION TABS */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-6">
          <div className="flex items-center gap-4">
            {/* Avatar Badge with Initials Fallback */}
            <div className="relative group shrink-0">
              {currentUser?.avatarUrl ? (
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#2D4A3E] shadow-xs"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#2D4A3E] text-white text-xl font-serif font-bold flex items-center justify-center shadow-xs">
                  {initials}
                </div>
              )}
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2D4A3E]">Auriva Profile</span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111827]">
                {currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : currentUser?.name || 'Auriva Member'}
              </h1>
              <span className="text-xs text-[#4B5563] font-medium">{currentUser?.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="derm-pill-secondary text-xs px-4 py-2 text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* SETTINGS NAVIGATION BAR */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => { setActiveTab('profile'); setFormError(null); setSuccessMsg(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-[#2D4A3E] text-white shadow-xs'
                : 'bg-[#FAFAF8] text-[#374151] border border-[#E5E7EB] hover:bg-[#F3F4F1]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => { setActiveTab('edit'); setFormError(null); setSuccessMsg(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'edit'
                ? 'bg-[#2D4A3E] text-white shadow-xs'
                : 'bg-[#FAFAF8] text-[#374151] border border-[#E5E7EB] hover:bg-[#F3F4F1]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => { setActiveTab('account'); setFormError(null); setSuccessMsg(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'account'
                ? 'bg-[#2D4A3E] text-white shadow-xs'
                : 'bg-[#FAFAF8] text-[#374151] border border-[#E5E7EB] hover:bg-[#F3F4F1]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Account</span>
          </button>

          <button
            onClick={() => { setActiveTab('preferences'); setFormError(null); setSuccessMsg(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'preferences'
                ? 'bg-[#2D4A3E] text-white shadow-xs'
                : 'bg-[#FAFAF8] text-[#374151] border border-[#E5E7EB] hover:bg-[#F3F4F1]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Preferences</span>
          </button>
        </div>
      </div>

      {/* TOAST SUCCESS BANNER */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2.5 animate-fade-in shadow-2xs">
          <Check className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ERROR BANNER */}
      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-900 font-semibold flex items-center gap-2.5 animate-fade-in shadow-2xs">
          <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* 2. TAB 1: PROFILE DISPLAY VIEW */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="derm-card p-6 sm:p-8 bg-white border border-[#E5E7EB] space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D4A3E]">Personal Details</span>
                <h2 className="font-serif text-xl font-bold text-[#111827]">User Profile Summary</h2>
              </div>

              <button
                onClick={() => setActiveTab('edit')}
                className="derm-pill-secondary text-xs px-4 py-2 flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#2D4A3E]" />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">First Name</span>
                <span className="font-serif text-base font-bold text-[#111827] block">{currentUser?.firstName || 'Not specified'}</span>
              </div>

              <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Last Name / Surname</span>
                <span className="font-serif text-base font-bold text-[#111827] block">{currentUser?.lastName || 'Not specified'}</span>
              </div>

              <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Email Address</span>
                <span className="font-serif text-base font-bold text-[#111827] block">{currentUser?.email || 'Authenticated Email'}</span>
              </div>

              <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Age</span>
                <span className="font-serif text-base font-bold text-[#111827] block">
                  {currentUser?.age !== undefined && currentUser.age !== null ? `${currentUser.age} years old` : 'Not specified'}
                </span>
              </div>

              <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Address</span>
                <span className="font-serif text-base font-bold text-[#111827] block">{currentUser?.address || 'No address saved.'}</span>
              </div>

              <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Profile Skin Type</span>
                <span className="font-serif text-base font-bold text-[#2D4A3E] block">{currentUser?.skinType || skinProfile?.skinType || 'Combination'}</span>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* 3. TAB 2: EDIT PROFILE FORM VIEW */}
      {activeTab === 'edit' && (
        <form onSubmit={handleSaveProfile} className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-xs">
          <div className="border-b border-[#E5E7EB] pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#111827]">Edit Profile Details</h2>
            <p className="text-xs text-[#4B5563]">Update your personal information, profile photo, and skin attributes.</p>
          </div>

          {/* PROFILE PHOTO UPLOAD SECTION */}
          <div className="p-5 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#111827] block">Profile Photo</span>
            
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative shrink-0">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Preview" 
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#2D4A3E] shadow-xs"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#2D4A3E] text-white text-2xl font-serif font-bold flex items-center justify-center shadow-xs">
                    {initials}
                  </div>
                )}
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoSelect} 
                  accept="image/jpeg,image/png,image/webp,image/jpg" 
                  className="hidden" 
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="derm-pill-btn text-xs px-4 py-2 flex items-center gap-1.5 mx-auto sm:mx-0"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Change Photo</span>
                </button>

                <p className="text-[11px] text-[#6B7280]">
                  Supported formats: JPG, JPEG, PNG, WEBP (Max size: 5MB).
                </p>
              </div>
            </div>
          </div>

          {/* FORM FIELDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            
            {/* FIRST NAME */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#111827] block">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Daksh"
                className="w-full px-4 py-3 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl text-xs text-[#111827] focus:outline-none focus:border-[#2D4A3E]"
              />
            </div>

            {/* LAST NAME */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#111827] block">
                Last Name / Surname
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Prajapati"
                className="w-full px-4 py-3 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl text-xs text-[#111827] focus:outline-none focus:border-[#2D4A3E]"
              />
            </div>

            {/* EMAIL (READ-ONLY) */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#111827] flex items-center gap-1">
                <span>Email Address</span>
                <Lock className="w-3 h-3 text-[#9CA3AF]" />
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-4 py-3 bg-[#F3F4F1] border border-[#E5E7EB] rounded-2xl text-xs text-[#6B7280] cursor-not-allowed"
              />
              <span className="text-[10px] text-[#6B7280]">Email address is managed securely by Firebase Auth.</span>
            </div>

            {/* AGE */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#111827] block">
                Age
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 24"
                className="w-full px-4 py-3 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl text-xs text-[#111827] focus:outline-none focus:border-[#2D4A3E]"
              />
            </div>

            {/* ADDRESS */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-[#111827] block">
                Address
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address..."
                className="w-full px-4 py-3 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl text-xs text-[#111827] focus:outline-none focus:border-[#2D4A3E]"
              />
            </div>

            {/* SKIN TYPE DROPDOWN */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-[#111827] block">
                Skin Type
              </label>
              <select
                value={skinType}
                onChange={(e) => setSkinType(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#2D4A3E]"
              >
                {SUPPORTED_SKIN_TYPES.map((st) => (
                  <option key={st} value={st}>
                    {st} Skin
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => { setActiveTab('profile'); setFormError(null); }}
              className="derm-pill-secondary text-xs px-5 py-2.5"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="derm-pill-btn text-xs px-6 py-2.5 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* 4. TAB 3: ACCOUNT SECURITY VIEW */}
      {activeTab === 'account' && (
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-xs">
          <div className="border-b border-[#E5E7EB] pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#111827]">Account Security</h2>
            <p className="text-xs text-[#4B5563]">Authentication details managed securely by Firebase Auth.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Authenticated User ID</span>
              <span className="font-mono text-xs font-bold text-[#111827] block truncate">{currentUser?.id}</span>
            </div>

            <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Authentication Provider</span>
              <span className="font-serif text-base font-bold text-[#2D4A3E] block">Firebase Auth</span>
            </div>
          </div>

          <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#111827]">Sign Out of Session</h3>
              <p className="text-xs text-[#6B7280]">Safely clear your authenticated session from this device.</p>
            </div>
            <button
              onClick={onLogout}
              className="derm-pill-secondary text-xs px-4 py-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* 5. TAB 4: PREFERENCES VIEW */}
      {activeTab === 'preferences' && (
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-xs">
          <div className="border-b border-[#E5E7EB] pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#111827]">Application Preferences</h2>
            <p className="text-xs text-[#4B5563]">Customize notifications, daily skincare consistency tracking, and privacy settings.</p>
          </div>

          <div className="space-y-4 text-xs">
            
            <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <strong className="text-sm font-bold text-[#111827] block">Daily Skincare Reminders</strong>
                <p className="text-[#6B7280]">Receive daily notifications to complete morning & evening routine steps.</p>
              </div>
              <input
                type="checkbox"
                checked={dailyReminders}
                onChange={(e) => setDailyReminders(e.target.checked)}
                className="w-4 h-4 rounded text-[#2D4A3E] focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="p-4 bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <strong className="text-sm font-bold text-[#111827] block">Email Updates</strong>
                <p className="text-[#6B7280]">Receive occasional clinical skincare tips and dataset updates.</p>
              </div>
              <input
                type="checkbox"
                checked={emailUpdates}
                onChange={(e) => setEmailUpdates(e.target.checked)}
                className="w-4 h-4 rounded text-[#2D4A3E] focus:ring-0 cursor-pointer"
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

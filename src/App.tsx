import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/pages/LandingPage';
import { Dashboard } from './components/pages/Dashboard';
import { SkinProfileWizard } from './components/features/SkinProfileWizard';
import { SkinAssessmentForm } from './components/pages/SkinAssessmentForm';
import { AssessmentResults } from './components/pages/AssessmentResults';
import { SkincareGuidance } from './components/pages/SkincareGuidance';
import { ProductCatalog } from './components/pages/ProductCatalog';
import { DermatologistDirectory } from './components/pages/DermatologistDirectory';
import { FloatingChatbot } from './components/features/FloatingChatbot';
import { AssessmentHistory } from './components/pages/AssessmentHistory';
import { UserProfileSettings } from './components/pages/UserProfileSettings';
import { DataQualityDashboard } from './components/pages/DataQualityDashboard';
import { ProductDetailPage } from './components/pages/ProductDetailPage';
import { SignInPage } from './components/auth/SignInPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { AISkinScan } from './components/features/AISkinScan';
import { UserProfile, SkinProfile, AssessmentResult } from './types';
import { auth, onAuthStateChanged, firebaseSignOut } from './config/firebase';
import { userService } from './services/userService';
import { assessmentService } from './services/assessmentService';
import { hydrateUserLogs } from './services/routineTrackerService';
import { Sparkles, Menu } from 'lucide-react';

const PROTECTED_TABS = ['dashboard', 'skin-profile', 'history', 'profile', 'skin-scan'];

export function App() {
  const isProductDetailView = window.location.search.includes('view=product-detail');

  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [skinProfile, setSkinProfile] = useState<SkinProfile | null>(null);
  const [latestAssessment, setLatestAssessment] = useState<AssessmentResult | null>(null);
  const [authInitializing, setAuthInitializing] = useState<boolean>(true);

  // Sidebar Layout States
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // 1. FIREBASE AUTH STATE LISTENER & FIRESTORE HYDRATION
  useEffect(() => {
    let unsubscribe = () => {};

    if (auth) {
      unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const baseUser: UserProfile = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            email: fbUser.email || '',
            createdAt: fbUser.metadata?.creationTime || new Date().toISOString()
          };

          // Fetch full profile and stored state from Firestore
          const profile = await userService.getUserProfile(baseUser);
          setUser(profile);

          const fullData = await userService.getUserFullData(fbUser.uid);
          if (fullData.routineLogs) {
            hydrateUserLogs(fbUser.uid, fullData.routineLogs);
          }
          if (fullData.skinProfile) {
            setSkinProfile(fullData.skinProfile);
          } else {
            const savedAssess = fullData.latestAssessment || await assessmentService.getUserAssessment(fbUser.uid);
            if (savedAssess) {
              setSkinProfile({
                skinType: savedAssess.request.skinType || 'Combination',
                oiliness: 'Moderate',
                dryness: 'Moderate',
                sensitivity: savedAssess.request.sensitivity || 'Moderate',
                allergies: [],
                mainConcerns: [savedAssess.possibleConcern || 'General Care'],
                profileCompleted: true,
                updatedAt: savedAssess.completedAt || new Date().toISOString()
              });
            }
          }

          if (fullData.latestAssessment) {
            setLatestAssessment(fullData.latestAssessment);
          } else {
            const savedAssess = await assessmentService.getUserAssessment(fbUser.uid);
            if (savedAssess) setLatestAssessment(savedAssess);
          }

          setCurrentTab((prev) => (prev === 'signin' || prev === 'signup' ? 'dashboard' : prev));
        } else {
          setUser(null);
          setSkinProfile(null);
          setLatestAssessment(null);
          setCurrentTab((prev) => (PROTECTED_TABS.includes(prev) ? 'signin' : prev));
        }
        setAuthInitializing(false);
      });
    } else {
      setUser(null);
      setAuthInitializing(false);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const handleNavigate = (tab: string) => {
    if (tab === 'assistant') {
      setCurrentTab(user ? 'dashboard' : 'landing');
      return;
    }
    if (PROTECTED_TABS.includes(tab) && !user) {
      setCurrentTab('signin');
      return;
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartAssessment = () => {
    setCurrentTab('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAssessmentComplete = (result: AssessmentResult) => {
    setLatestAssessment(result);
    setCurrentTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProfile = async (profile: SkinProfile) => {
    setSkinProfile(profile);
    if (user?.id) {
      await userService.saveSkinProfile(user.id, profile);
    }
    setCurrentTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    if (auth) {
      await firebaseSignOut(auth);
    }
    setUser(null);
    setSkinProfile(null);
    setLatestAssessment(null);
    setCurrentTab('signin');
  };

  if (authInitializing) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-[#2D4A3E] text-white flex items-center justify-center animate-bounce shadow-md">
          <Sparkles className="w-6 h-6 text-emerald-300" />
        </div>
        <span className="font-serif text-lg font-bold text-[#111827]">Initializing AURIVA Platform...</span>
      </div>
    );
  }

  if (isProductDetailView) {
    return <ProductDetailPage />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111827] flex flex-col md:flex-row relative">
      
      {/* 1. COLLAPSIBLE SIDEBAR NAVIGATION (Excludes AI Assistant) */}
      <Sidebar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        user={user}
        onSignOut={handleLogout}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* 2. GLOBAL FLOATING AI CHATBOT ASSISTANT (Bottom-Right) */}
      <FloatingChatbot latestAssessment={latestAssessment} />

      {/* 3. DYNAMIC CONTENT AREA */}
      <div 
        className={`flex-1 transition-all duration-300 min-w-0 ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        
        {/* MOBILE TOP BAR HEADER */}
        <header className="md:hidden sticky top-0 z-30 bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between shadow-2xs">
          <div 
            onClick={() => handleNavigate('landing')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2D4A3E] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </div>
            <span className="font-serif text-lg font-bold tracking-wider text-[#111827]">AURIVA</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl text-[#374151] hover:bg-[#F3F4F1] transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* MAIN BODY CONTAINER */}
        <main className="min-h-[calc(100vh-140px)]">
          {currentTab === 'landing' && (
            <LandingPage
              onStartAssessment={handleStartAssessment}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'signin' && (
            <SignInPage
              onSuccess={(u) => {
                setUser(u);
                setCurrentTab('dashboard');
              }}
              onNavigateToSignUp={() => setCurrentTab('signup')}
              onNavigateHome={() => setCurrentTab('landing')}
            />
          )}

          {currentTab === 'signup' && (
            <SignUpPage
              onSuccess={(u) => {
                setUser(u);
                setCurrentTab('dashboard');
              }}
              onNavigateToSignIn={() => setCurrentTab('signin')}
              onNavigateHome={() => setCurrentTab('landing')}
            />
          )}

          {currentTab === 'dashboard' && (
            <Dashboard
              user={user}
              skinProfile={skinProfile}
              latestAssessment={latestAssessment}
              onNavigate={handleNavigate}
              onStartAssessment={handleStartAssessment}
            />
          )}

          {currentTab === 'skin-scan' && (
            <AISkinScan
              user={user}
              skinProfile={skinProfile}
              latestAssessment={latestAssessment}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'skin-profile' && (
            <SkinProfileWizard
              initialProfile={skinProfile}
              onSave={handleSaveProfile}
              onCancel={() => setCurrentTab(user ? 'dashboard' : 'landing')}
            />
          )}

          {currentTab === 'assessment' && (
            <SkinAssessmentForm
              userId={user?.id}
              userSkinType={skinProfile?.skinType || 'Combination'}
              onComplete={handleAssessmentComplete}
              onCancel={() => setCurrentTab(user ? 'dashboard' : 'landing')}
            />
          )}

          {currentTab === 'results' && (
            <AssessmentResults
              result={latestAssessment}
              onNavigate={handleNavigate}
              onRetake={handleStartAssessment}
            />
          )}

          {currentTab === 'guidance' && (
            <SkincareGuidance
              latestAssessment={latestAssessment}
              skinProfile={skinProfile}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'products' && (
            <ProductCatalog onNavigate={handleNavigate} />
          )}

          {currentTab === 'doctors' && (
            <DermatologistDirectory onNavigate={handleNavigate} />
          )}

          {currentTab === 'data-quality' && (
            <DataQualityDashboard />
          )}

          {currentTab === 'history' && (
            <AssessmentHistory
              userId={user?.id}
              onSelectResult={(item) => {
                setLatestAssessment(item);
                setCurrentTab('results');
              }}
              onStartNew={handleStartAssessment}
            />
          )}

          {currentTab === 'profile' && (
            <UserProfileSettings
              user={user}
              skinProfile={skinProfile}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
              onUpdateUser={(updated) => setUser(updated)}
            />
          )}
        </main>

        {/* AURIVA FOOTER */}
        <footer className="bg-white border-t border-[#E5E7EB] py-8 px-4 sm:px-6 lg:px-8 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-[#111827] text-sm tracking-wider">AURIVA</span>
              <span>— Modern Dermatology & Skincare Intelligence Platform</span>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => handleNavigate('landing')} className="hover:text-[#111827] transition-colors">Home</button>
              <button onClick={() => handleNavigate('products')} className="hover:text-[#111827] transition-colors">Products</button>
              <button onClick={() => handleNavigate('doctors')} className="hover:text-[#111827] transition-colors">Dermatologists</button>
              <button onClick={() => handleNavigate('data-quality')} className="hover:text-[#111827] transition-colors">Data Quality</button>
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}

export default App;

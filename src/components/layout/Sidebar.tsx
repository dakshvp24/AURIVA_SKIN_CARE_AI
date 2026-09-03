import React, { useState } from 'react';
import { 
  Sparkles, LayoutDashboard, Stethoscope, Camera, UserCheck, Compass, 
  ShoppingBag, User, MessageSquare, Database, History, Settings, 
  LogOut, LogIn, UserPlus, ChevronLeft, ChevronRight, Menu, X, Shield 
} from 'lucide-react';
import { UserProfile } from '../../types';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  user: UserProfile | null;
  onSignOut: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  user,
  onSignOut,
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile
}) => {
  
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'skin-scan', label: 'AI Skin Scan', icon: Camera },
    { id: 'assessment', label: 'Skin Assessment', icon: Stethoscope },
    { id: 'skin-profile', label: 'My Skin Profile', icon: UserCheck },
    { id: 'guidance', label: 'Recommendations', icon: Compass },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'doctors', label: 'Dermatologists', icon: User },
    { id: 'data-quality', label: 'Data Quality', icon: Database },
  ];

  const personalNavItems = [
    { id: 'history', label: 'Assessment History', icon: History },
    { id: 'profile', label: 'Profile & Settings', icon: Settings },
  ];

  const handleNavClick = (tabId: string) => {
    onNavigate(tabId);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 bg-[#FFFFFF] border-r border-[#DED9D0] select-none">
      
      <div className="space-y-6">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-[#F2EDE3]">
          <div 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#3F5945] flex items-center justify-center text-white shadow-xs shrink-0 transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5 text-[#E8DED0]" />
            </div>

            {(!isCollapsed || mobileOpen) && (
              <div className="animate-fade-in overflow-hidden">
                <span className="font-serif text-xl font-bold tracking-wider text-[#26382C] block">AURIVA</span>
                <span className="block text-[10px] uppercase tracking-widest text-[#71836B] font-bold -mt-0.5">Dermatology Platform</span>
              </div>
            )}
          </div>

          {/* Desktop Toggle Button */}
          {!mobileOpen && (
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-[#62675F] hover:text-[#20251F] hover:bg-[#DDE4D8] transition-colors"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* MAIN NAVIGATION */}
        <div className="space-y-1">
          {(!isCollapsed || mobileOpen) && (
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#8A8D86] block mb-2">
              Main
            </span>
          )}

          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#3F5945] text-white shadow-xs font-semibold'
                      : 'text-[#3F5945] hover:text-[#26382C] hover:bg-[#DDE4D8]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#71836B]'}`} />
                  {(!isCollapsed || mobileOpen) && (
                    <span className="truncate">{item.label}</span>
                  )}
                </button>

                {/* Desktop Collapsed Tooltip */}
                {isCollapsed && !mobileOpen && (
                  <div className="sidebar-tooltip">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* PERSONAL NAVIGATION */}
        <div className="space-y-1 pt-2 border-t border-[#F2EDE3]">
          {(!isCollapsed || mobileOpen) && (
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#8A8D86] block mb-2">
              Personal
            </span>
          )}

          {personalNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#3F5945] text-white shadow-xs font-semibold'
                      : 'text-[#3F5945] hover:text-[#26382C] hover:bg-[#DDE4D8]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#71836B]'}`} />
                  {(!isCollapsed || mobileOpen) && (
                    <span className="truncate">{item.label}</span>
                  )}
                </button>

                {/* Desktop Collapsed Tooltip */}
                {isCollapsed && !mobileOpen && (
                  <div className="sidebar-tooltip">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* ACCOUNT / FOOTER SECTION */}
      <div className="pt-4 border-t border-[#F2EDE3] space-y-2">
        {user ? (
          <div className="space-y-2">
            
            {/* User Profile Pill */}
            {(!isCollapsed || mobileOpen) && (
              <div className="flex items-center gap-3 px-3 py-2 bg-[#F8F5EF] border border-[#DED9D0] rounded-xl">
                <div className="w-7 h-7 rounded-full bg-[#3F5945] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-semibold text-[#20251F] block truncate">{user.name}</span>
                  <span className="text-[10px] text-[#62675F] block truncate">{user.email}</span>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <div className="relative group">
              <button
                onClick={() => {
                  onSignOut();
                  onCloseMobile();
                }}
                className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                {(!isCollapsed || mobileOpen) && (
                  <span>Sign Out</span>
                )}
              </button>

              {isCollapsed && !mobileOpen && (
                <div className="sidebar-tooltip">
                  Sign Out
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="relative group">
              <button
                onClick={() => handleNavClick('signin')}
                className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#111827] bg-[#F3F4F1] hover:bg-[#E5E7EB] transition-all"
              >
                <LogIn className="w-4 h-4 shrink-0 text-[#2D4A3E]" />
                {(!isCollapsed || mobileOpen) && (
                  <span>Sign In</span>
                )}
              </button>

              {isCollapsed && !mobileOpen && (
                <div className="sidebar-tooltip">
                  Sign In
                </div>
              )}
            </div>

            <div className="relative group">
              <button
                onClick={() => handleNavClick('signup')}
                className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#2D4A3E] hover:bg-[#233B31] transition-all shadow-sm"
              >
                <UserPlus className="w-4 h-4 shrink-0" />
                {(!isCollapsed || mobileOpen) && (
                  <span>Sign Up</span>
                )}
              </button>

              {isCollapsed && !mobileOpen && (
                <div className="sidebar-tooltip">
                  Create Account
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );

  return (
    <>
      {/* DESKTOP FIXED SIDEBAR */}
      <aside 
        className={`hidden md:block fixed top-0 left-0 bottom-0 z-40 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* MOBILE OFF-CANVAS DRAWER */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div 
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
          />

          {/* Off-canvas Sidebar Panel */}
          <div className="relative z-10 w-72 h-full bg-white shadow-2xl animate-fade-in">
            <button
              onClick={onCloseMobile}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#6B7280] hover:bg-[#F3F4F1] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

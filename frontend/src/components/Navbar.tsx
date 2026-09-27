import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  CheckCircle2, 
  Globe,
  HelpCircle,
  Building2,
  Lock,
  LogOut,
  Sliders,
  Shield
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentUser: UserProfile;
  onOpenAuthModal: () => void;
  onSearch?: (query: string) => void;
  activeView: string;
  onNavigate: (view: string) => void;
  language: 'en' | 'hi' | 'mr';
  onLanguageChange: (lang: 'en' | 'hi' | 'mr') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuthModal,
  activeView,
  onNavigate,
  language,
  onLanguageChange
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const languages = [
    { id: 'en' as const, label: 'English', native: 'English' },
    { id: 'hi' as const, label: 'Hindi', native: 'हिन्दी' },
    { id: 'mr' as const, label: 'Marathi', native: 'मराठी' }
  ];

  const searchPlaceholders = {
    en: 'Search Indian Standards & Regulations (e.g. "IS 13252", "solar street lighting", "power supply")',
    hi: 'भारतीय मानक एवं विनियम खोजें (उदा. "IS 13252", "सोलर स्ट्रीट लाइट")',
    mr: 'भारतीय मानके आणि नियम शोधा (उदा. "IS 13252", "सोलर स्ट्रीट लाईट")'
  };

  const notifications = [
    { 
      title: 'New procurement specification received', 
      time: '10 mins ago', 
      desc: 'Solar_Street_Light_Tender.pdf received for standards review.',
      targetView: 'procurement-intake'
    },
    { 
      title: 'Standard edition review required', 
      time: '25 mins ago', 
      desc: 'Tender references older standard IS 16046:2015 instead of current 2018 edition.',
      targetView: 'review-queue'
    },
    { 
      title: 'Quality Control Order notification alert', 
      time: '1 hour ago', 
      desc: 'MeitY Compulsory Registration Scheme applies to network switch equipment.',
      targetView: 'qco-certification'
    },
    { 
      title: 'Report dossier ready for technical review', 
      time: '2 hours ago', 
      desc: 'Dossier BS-2026-000128 submitted for Competent Authority approval.',
      targetView: 'reports'
    }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('standards');
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Subtle National Accent Bar */}
      <div className="h-1 w-full flex">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-white border-y border-slate-100"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-10 h-10 rounded-lg bg-gov-950 flex items-center justify-center text-white shadow-xs border border-gov-800">
            <ShieldCheck className="w-6 h-6 text-saffron-500" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-gov-950 font-serif">BHARATSPEC</span>
              <span className="hidden md:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-gov-100 text-gov-800 border border-gov-200 rounded">
                Standards Intelligence
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Indian Standards & Procurement Intelligence
            </p>
          </div>
        </div>

        {/* Natural Language Query Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center flex-1 max-w-lg mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={searchPlaceholders[language]}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-16 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-700 focus:bg-white text-slate-800 placeholder-slate-400 transition-all font-sans"
            />
            <button 
              type="submit"
              className="absolute right-1.5 top-1 px-2 py-0.5 bg-gov-800 hover:bg-gov-900 text-white rounded text-[10px] font-semibold transition"
            >
              Search
            </button>
          </div>
        </form>

        {/* Right Actions: Multilingual, Authenticated Officer Card, Notifications */}
        <div className="flex items-center space-x-2.5">
          {/* Multilingual Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200 transition"
              title="Select Interface Language"
            >
              <Globe className="w-3.5 h-3.5 text-gov-700" />
              <span>{languages.find(l => l.id === language)?.native}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in">
                {languages.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      onLanguageChange(l.id);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gov-50 flex items-center justify-between ${
                      language === l.id ? 'font-bold text-gov-800 bg-gov-50' : 'text-slate-700'
                    }`}
                  >
                    <span>{l.native}</span>
                    <span className="text-[10px] text-slate-400">{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Knowledge Base Live Indicator */}
          <div 
            onClick={() => onNavigate('knowledge-base')}
            className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700 cursor-pointer hover:bg-slate-200 transition"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>KB v2.6 (2,450 Standards)</span>
          </div>

          {/* Authenticated Officer Identity Card */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-xs"
            >
              <div className="w-6 h-6 rounded-full bg-gov-100 text-gov-900 flex items-center justify-center font-bold text-[11px]">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <span className="text-[10px] text-slate-400 block -mb-0.5">{currentUser.role_display}</span>
                <span className="font-semibold text-slate-900 truncate max-w-[130px] block">{currentUser.name}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in">
                <div className="px-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gov-800 text-white flex items-center justify-center font-bold text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{currentUser.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">{currentUser.email}</p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                    <div><strong className="text-slate-700">Role:</strong> {currentUser.role_display}</div>
                    <div><strong className="text-slate-700">Department:</strong> {currentUser.department}</div>
                    <div><strong className="text-slate-700">Organization:</strong> {currentUser.organization}</div>
                    {currentUser.division && (
                      <div><strong className="text-slate-700">Division:</strong> {currentUser.division}</div>
                    )}
                  </div>
                </div>

                <div className="px-4 py-2 bg-slate-50 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>RBAC Permissions: {currentUser.permissions.length}</span>
                  <span className="text-emerald-700 font-bold">Active Session</span>
                </div>

                <div className="pt-2 px-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenAuthModal();
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-gov-800 hover:bg-gov-50 rounded-lg font-semibold flex items-center space-x-2 transition"
                  >
                    <User className="w-3.5 h-3.5 text-gov-700" />
                    <span>Switch Authorized Officer Account</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('admin');
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg flex items-center space-x-2 transition"
                  >
                    <Sliders className="w-3.5 h-3.5 text-slate-500" />
                    <span>Organization & Workflow Settings</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-saffron-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">Procurement Alerts</span>
                  <span className="text-[10px] bg-gov-100 text-gov-800 px-1.5 py-0.5 rounded font-semibold">4 Updates</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {notifications.map((n, i) => (
                    <div 
                      key={i} 
                      onClick={() => {
                        onNavigate(n.targetView);
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-gov-50 cursor-pointer transition text-xs group"
                    >
                      <div className="font-semibold text-slate-900 group-hover:text-gov-950 flex justify-between">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{n.desc}</p>
                      <div className="mt-1 text-[10px] text-gov-800 font-bold group-hover:underline">
                        Open Action →
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

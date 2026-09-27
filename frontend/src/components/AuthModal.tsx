import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Building2, 
  CheckCircle2, 
  X, 
  Lock, 
  ArrowRight, 
  Briefcase, 
  FileCheck, 
  CheckSquare, 
  Shield, 
  Eye
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { SYSTEM_USERS, authService } from '../services/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange
}) => {
  const [selectedEmail, setSelectedEmail] = useState<string>(currentUser.email);
  const [password, setPassword] = useState('••••••••••••');

  if (!isOpen) return null;

  const handleSignIn = (user: UserProfile) => {
    authService.setCurrentUser(user);
    onUserChange(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gov-950 px-6 py-4 text-white flex items-center justify-between border-b border-gov-900">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gov-800 flex items-center justify-center text-saffron-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif">
                Authorized Government Officer Authentication
              </h3>
              <p className="text-xs text-slate-300">
                BHARATSPEC — Role-Based Procurement & Compliance Access
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-gov-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start space-x-2.5">
            <Lock className="w-4 h-4 text-gov-800 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Role-Based Access Control Enforced</span>
              <span>
                In accordance with government procurement governance, user permissions, approval delegations, and review controls are strictly determined by the authenticated officer account.
              </span>
            </div>
          </div>

          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-1">
            Select Configured Officer Account:
          </h4>

          {/* User Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
            {SYSTEM_USERS.map((user) => {
              const isSelected = user.id === currentUser.id;
              
              let roleBadgeColor = "bg-blue-50 text-blue-800 border-blue-200";
              if (user.role === 'technical_expert') roleBadgeColor = "bg-purple-50 text-purple-800 border-purple-200";
              if (user.role === 'compliance_reviewer') roleBadgeColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
              if (user.role === 'competent_authority') roleBadgeColor = "bg-amber-50 text-amber-800 border-amber-200";
              if (user.role === 'system_administrator') roleBadgeColor = "bg-rose-50 text-rose-800 border-rose-200";
              if (user.role === 'auditor') roleBadgeColor = "bg-slate-100 text-slate-800 border-slate-300";

              return (
                <div
                  key={user.id}
                  onClick={() => handleSignIn(user)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition text-left relative flex flex-col justify-between ${
                    isSelected 
                      ? 'border-gov-800 bg-gov-50/50 shadow-xs ring-1 ring-gov-800' 
                      : 'border-slate-200 hover:border-gov-700 bg-white hover:bg-slate-50/50'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 flex items-center space-x-1 text-[10px] font-bold text-gov-800 bg-gov-100 px-1.5 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3 text-gov-800" />
                      <span>Current</span>
                    </span>
                  )}
                  <div>
                    <div className="flex items-center space-x-2 mb-1.5">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${roleBadgeColor}`}>
                        {user.role_display}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-900">{user.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{user.email}</div>
                    <div className="text-xs text-slate-600 mt-1 font-medium">{user.department}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{user.organization}</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{user.permissions.length} Permissions</span>
                    <span className="text-gov-800 font-bold flex items-center">
                      Authenticate →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Active Identity: <strong>{currentUser.name}</strong> ({currentUser.role_display})</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

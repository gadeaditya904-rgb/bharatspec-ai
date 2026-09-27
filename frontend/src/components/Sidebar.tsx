import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Briefcase, 
  AlertTriangle, 
  FileText, 
  SearchCode, 
  Sparkles, 
  Network, 
  History, 
  Scale, 
  ClipboardCheck, 
  SlidersHorizontal, 
  ShieldCheck, 
  Database, 
  Settings,
  GitCompare,
  CheckSquare,
  Package,
  TableProperties
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  hasActiveAnalysis: boolean;
  currentUser: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  hasActiveAnalysis,
  currentUser
}) => {
  const role = currentUser.role;

  // 1. WORKSPACE
  const workspaceItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['procurement_officer', 'technical_expert', 'compliance_reviewer', 'competent_authority', 'system_administrator', 'auditor'] },
    { id: 'procurement-intake', label: 'New Analysis', icon: Sparkles, highlight: true, roles: ['procurement_officer', 'system_administrator'] },
    { id: 'my-analyses', label: 'My Analyses', icon: Briefcase, roles: ['procurement_officer', 'technical_expert', 'compliance_reviewer', 'competent_authority', 'system_administrator', 'auditor'] },
    { id: 'review-queue', label: 'Review Queue', icon: AlertTriangle, badge: '5 Pending', roles: ['technical_expert', 'compliance_reviewer', 'competent_authority', 'system_administrator'] },
    { id: 'reports', label: 'Reports', icon: FileText, roles: ['procurement_officer', 'technical_expert', 'compliance_reviewer', 'competent_authority', 'system_administrator', 'auditor'] },
  ];

  // 2. STANDARDS INTELLIGENCE
  const standardsItems = [
    { id: 'standards', label: 'Standards Explorer', icon: SearchCode, count: '2,450', roles: ['procurement_officer', 'technical_expert', 'compliance_reviewer', 'competent_authority', 'system_administrator', 'auditor'] },
    { id: 'recommendations', label: 'Recommendations', icon: Sparkles, roles: ['procurement_officer', 'technical_expert', 'compliance_reviewer', 'competent_authority', 'system_administrator', 'auditor'] },
    { id: 'relationship-explorer', label: 'Standards Network', icon: Network, roles: ['procurement_officer', 'technical_expert', 'compliance_reviewer', 'competent_authority', 'system_administrator', 'auditor'] },
    { id: 'version-intelligence', label: 'Version & Amendments', icon: History, roles: ['procurement_officer', 'technical_expert', 'compliance_reviewer', 'competent_authority', 'system_administrator', 'auditor'] },
    { id: 'bundling', label: 'Multi-Standard Bundling', icon: Package, roles: ['procurement_officer', 'technical_expert', 'compliance_reviewer', 'competent_authority', 'system_administrator', 'auditor'] },
  ];

  // 3. SPECIFICATION REVIEW
  const reviewItems = [
    { id: 'gaps', label: 'Specification Gaps', icon: AlertTriangle, count: '4', roles: ['procurement_officer', 'technical_expert', 'compliance_reviewer', 'competent_authority', 'system_administrator', 'auditor'] },
    { id: 'conflicts-redundancies', label: 'Conflicts & Redundancies', icon: GitCompare, count: '2', roles: ['procurement_officer', 'technical_expert', 'compliance_reviewer', 'competent_authority', 'system_administrator', 'auditor'] },
    { id: 'traceability', label: 'Traceability Matrix', icon: TableProperties, roles: ['procurement_officer', 'technical_expert', 'compliance_reviewer', 'competent_authority', 'system_administrator', 'auditor'] },
    { id: 'version-diff', label: 'Tender Version Diff', icon: GitCompare, roles: ['procurement_officer', 'technical_expert', 'competent_authority', 'system_administrator'] },
    { id: 'readiness', label: 'Tender Readiness', icon: ShieldCheck, roles: ['procurement_officer', 'technical_expert', 'compliance_reviewer', 'competent_authority', 'system_administrator', 'auditor'] },
  ];

  // 4. REGULATORY
  const regulatoryItems = [
    { id: 'qco-certification', label: 'Certification & Regulatory Review', icon: Scale, count: '26', roles: ['compliance_reviewer', 'competent_authority', 'system_administrator', 'auditor'] },
    { id: 'evidence', label: 'Evidence', icon: ClipboardCheck, roles: ['procurement_officer', 'technical_expert', 'compliance_reviewer', 'competent_authority', 'system_administrator', 'auditor'] },
  ];

  // 5. GOVERNANCE
  const governanceItems = [
    { id: 'audit-trail', label: 'Audit Trail', icon: ShieldCheck, roles: ['competent_authority', 'system_administrator', 'auditor'] },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: Database, roles: ['compliance_reviewer', 'system_administrator', 'auditor'] },
    { id: 'admin', label: 'Administration', icon: Settings, roles: ['system_administrator'] },
  ];

  // Filter based on active role
  const allowedWorkspace = workspaceItems.filter(i => i.roles.includes(role));
  const allowedStandards = standardsItems.filter(i => i.roles.includes(role));
  const allowedReview = reviewItems.filter(i => i.roles.includes(role));
  const allowedRegulatory = regulatoryItems.filter(i => i.roles.includes(role));
  const allowedGovernance = governanceItems.filter(i => i.roles.includes(role));

  return (
    <aside className="w-64 bg-gov-950 text-slate-300 flex-shrink-0 flex flex-col h-[calc(100vh-4.25rem)] border-r border-gov-900 select-none">
      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        
        {/* SECTION 1: WORKSPACE */}
        {allowedWorkspace.length > 0 && (
          <div>
            <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-saffron-400">
              WORKSPACE
            </div>
            <nav className="space-y-0.5">
              {allowedWorkspace.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id || 
                  (item.id === 'procurement-intake' && (activeView === 'procurement-specs' || activeView === 'new-analysis')) ||
                  (item.id === 'my-analyses' && (activeView === 'standards-intelligence' || activeView === 'analysis-overview'));
                
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                      item.highlight && (activeView === 'procurement-intake' || activeView === 'new-analysis')
                        ? 'bg-saffron-500 hover:bg-saffron-600 text-slate-950 font-bold shadow-xs'
                        : isActive 
                          ? 'bg-gov-800 text-white font-semibold border-l-4 border-saffron-500 pl-2'
                          : 'text-slate-300 hover:bg-gov-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-saffron-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* SECTION 2: STANDARDS INTELLIGENCE */}
        {allowedStandards.length > 0 && (
          <div>
            <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              STANDARDS INTELLIGENCE
            </div>
            <nav className="space-y-0.5">
              {allowedStandards.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id ||
                  (item.id === 'recommendations' && (activeView === 'recommendations' || activeView === 'standards-intelligence'));
                
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                      isActive 
                        ? 'bg-gov-800 text-white font-semibold border-l-4 border-saffron-500 pl-2' 
                        : 'text-slate-300 hover:bg-gov-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-saffron-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.count && (
                      <span className="text-[10px] bg-gov-900 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* SECTION 3: SPECIFICATION REVIEW */}
        {allowedReview.length > 0 && (
          <div>
            <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
              SPECIFICATION REVIEW
            </div>
            <nav className="space-y-0.5">
              {allowedReview.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                      isActive 
                        ? 'bg-gov-800 text-white font-semibold border-l-4 border-saffron-500 pl-2' 
                        : 'text-slate-300 hover:bg-gov-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-saffron-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.count && (
                      <span className="text-[10px] bg-gov-900 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* SECTION 4: REGULATORY */}
        {allowedRegulatory.length > 0 && (
          <div>
            <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
              REGULATORY & CONFORMITY
            </div>
            <nav className="space-y-0.5">
              {allowedRegulatory.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                      isActive 
                        ? 'bg-gov-800 text-white font-semibold border-l-4 border-saffron-500 pl-2' 
                        : 'text-slate-300 hover:bg-gov-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-saffron-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.count && (
                      <span className="text-[10px] bg-gov-900 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* SECTION 5: GOVERNANCE */}
        {allowedGovernance.length > 0 && (
          <div>
            <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-400">
              GOVERNANCE & AUDIT
            </div>
            <nav className="space-y-0.5">
              {allowedGovernance.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                      isActive 
                        ? 'bg-gov-800 text-white font-semibold border-l-4 border-saffron-500 pl-2' 
                        : 'text-slate-300 hover:bg-gov-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-saffron-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

      </div>

      {/* Officer Footer Badge */}
      <div className="p-3 bg-gov-900/80 border-t border-gov-900 text-xs">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
          <span>Logged In As:</span>
          <span className="text-emerald-400 font-bold text-[10px] flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
            RBAC Active
          </span>
        </div>
        <div className="font-bold text-white truncate">{currentUser.name}</div>
        <div className="text-[10px] text-saffron-400 font-medium truncate">{currentUser.role_display}</div>
        <div className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser.department}</div>
      </div>
    </aside>
  );
};

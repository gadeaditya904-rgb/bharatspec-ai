import React from 'react';
import { 
  FileText, 
  Upload, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  History, 
  Inbox, 
  Award, 
  Search, 
  ChevronRight, 
  Camera, 
  Mail, 
  Globe, 
  ClipboardCheck, 
  AlertCircle, 
  FileCheck2, 
  Scale, 
  Sparkles, 
  GitCompare, 
  ShieldCheck, 
  Building2, 
  UserCheck,
  Network,
  Package,
  TableProperties,
  Sliders
} from 'lucide-react';
import { DemoSpecification, UserProfile } from '../types';

interface DashboardProps {
  currentUser: UserProfile;
  onNavigate: (view: string) => void;
  onSelectDemo: (demoId: string) => void;
  onStartAnalysis?: (text: string, filename: string) => void;
  demoSpecs: DemoSpecification[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  onNavigate,
  onSelectDemo,
  onStartAnalysis,
  demoSpecs
}) => {
  // My Work Queue Counts
  const myWorkQueues = [
    { id: 'drafts', label: 'Draft Analyses', count: 2, status: 'Drafting', icon: FileText, color: 'text-slate-700 bg-slate-100', view: 'my-analyses' },
    { id: 'awaiting-tech', label: 'Awaiting Technical Review', count: 3, status: 'Technical Review', icon: AlertTriangle, color: 'text-purple-800 bg-purple-50 border-purple-200', view: 'review-queue' },
    { id: 'awaiting-comp', label: 'Awaiting Compliance Review', count: 2, status: 'Compliance Review', icon: Scale, color: 'text-blue-800 bg-blue-50 border-blue-200', view: 'review-queue' },
    { id: 'returned', label: 'Returned for Correction', count: 1, status: 'Needs Clarification', icon: AlertCircle, color: 'text-rose-800 bg-rose-50 border-rose-200', view: 'my-analyses' },
    { id: 'awaiting-auth', label: 'Awaiting Authority Decision', count: 2, status: 'Final Sanction', icon: UserCheck, color: 'text-amber-800 bg-amber-50 border-amber-200', view: 'review-queue' },
    { id: 'completed', label: 'Completed Records', count: 14, status: 'Archived Dossiers', icon: CheckCircle2, color: 'text-emerald-800 bg-emerald-50 border-emerald-200', view: 'reports' },
  ];

  // Standards Intelligence Telemetry
  const standardsIntelligenceStats = [
    { id: 'recommended', label: 'Standards Recommended', value: '42', desc: 'Mapped to procurement scope', icon: Award, color: 'text-gov-800' },
    { id: 'verification-req', label: 'Verification Required', value: '5', desc: 'Human confirmation pending', icon: AlertTriangle, color: 'text-amber-700' },
    { id: 'amendment-alerts', label: 'Amendment Alerts', value: '3', desc: 'Superseded editions or gazette revisions', icon: History, color: 'text-rose-700' },
    { id: 'conflicts', label: 'Specification Conflicts', value: '2', desc: 'Contradictory parameters detected', icon: GitCompare, color: 'text-purple-700' },
    { id: 'gaps', label: 'Specification Gaps', value: '4', desc: 'Missing test or safety parameters', icon: ClipboardCheck, color: 'text-blue-700' },
  ];

  // Active Procurement Analyses Table
  const activeProcurements = [
    {
      id: 'demo-solar-001',
      procurement_id: 'PROC-2026-000092',
      title: 'Solar Street Lighting Systems (Standalone 40W LED)',
      department: 'Ministry of New & Renewable Energy / Municipal Body',
      status: 'AWAITING TECHNICAL REVIEW',
      statusColor: 'bg-purple-100 text-purple-800',
      standards_count: 8,
      requirements_count: 28,
      coverage: 88,
      date: '26 Sep 2026'
    },
    {
      id: 'demo-ps-007',
      procurement_id: 'PROC-2026-000128',
      title: 'Programmable Laboratory DC Bench Power Supplies (0-60V, 30A)',
      department: 'Defence Research & Electronics Testing Laboratory',
      status: 'AWAITING COMPLIANCE REVIEW',
      statusColor: 'bg-blue-100 text-blue-800',
      standards_count: 6,
      requirements_count: 25,
      coverage: 92,
      date: '26 Sep 2026'
    },
    {
      id: 'demo-pc-002',
      procurement_id: 'PROC-2026-000094',
      title: '24-Port Managed Layer 2/3 Gigabit Ethernet Switch Network Core',
      department: 'Ministry of Electronics & Information Technology (MeitY) / NIC',
      status: 'AWAITING AUTHORITY DECISION',
      statusColor: 'bg-amber-100 text-amber-800',
      standards_count: 7,
      requirements_count: 22,
      coverage: 91,
      date: '25 Sep 2026'
    },
    {
      id: 'demo-med-002',
      procurement_id: 'PROC-2026-000088',
      title: 'Motorized ICU Hospital Beds with 4-Motor Linear Actuator',
      department: 'AIIMS Central Hospital Procurement Board',
      status: 'RETURNED FOR CORRECTION',
      statusColor: 'bg-rose-100 text-rose-800',
      standards_count: 5,
      requirements_count: 24,
      coverage: 85,
      date: '25 Sep 2026'
    }
  ];

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* =========================================================
          SECTION 1: GOVERNMENT IDENTITY & OFFICER WORKSPACE HEADER
         ========================================================= */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-gov-800 font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-gov-700" />
              <span>BHARATSPEC — Indian Standards & Procurement Intelligence</span>
            </div>
            <h1 className="text-2xl font-bold font-serif text-slate-950">
              {currentUser.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-1">
              <div>
                <span className="text-slate-400">Role:</span>{' '}
                <strong className="text-slate-900 font-semibold">{currentUser.role_display}</strong>
              </div>
              <div>•</div>
              <div>
                <span className="text-slate-400">Department:</span>{' '}
                <strong className="text-slate-900 font-semibold">{currentUser.department}</strong>
              </div>
              <div>•</div>
              <div>
                <span className="text-slate-400">Organization:</span>{' '}
                <strong className="text-slate-900 font-semibold">{currentUser.organization}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onNavigate('procurement-intake')}
              className="px-4 py-2 bg-gov-900 hover:bg-gov-800 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center space-x-2"
            >
              <Upload className="w-3.5 h-3.5 text-saffron-400" />
              <span>Start New Procurement Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          SECTION 2: START NEW PROCUREMENT ANALYSIS
         ========================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            START NEW PROCUREMENT ANALYSIS
          </h2>
          <span className="text-[11px] text-slate-400">Multi-Channel Ingestion Gateways</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Upload Document */}
          <button
            type="button"
            onClick={() => onNavigate('procurement-intake')}
            className="p-3.5 bg-white border border-slate-200 hover:border-gov-800 rounded-xl text-left transition shadow-xs group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-lg bg-gov-50 text-gov-800 flex items-center justify-center mb-2 group-hover:bg-gov-800 group-hover:text-white transition">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Upload Document</div>
              <div className="text-[10px] text-slate-500 mt-0.5">PDF, DOCX, TXT</div>
            </div>
          </button>

          {/* 2. Enter Requirements */}
          <button
            type="button"
            onClick={() => onNavigate('procurement-intake')}
            className="p-3.5 bg-white border border-slate-200 hover:border-gov-800 rounded-xl text-left transition shadow-xs group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-lg bg-gov-50 text-gov-800 flex items-center justify-center mb-2 group-hover:bg-gov-800 group-hover:text-white transition">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Enter Requirements</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Clause-by-clause editor</div>
            </div>
          </button>

          {/* 3. Capture Image / OCR */}
          <button
            type="button"
            onClick={() => onNavigate('procurement-intake')}
            className="p-3.5 bg-white border border-slate-200 hover:border-gov-800 rounded-xl text-left transition shadow-xs group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-lg bg-gov-50 text-gov-800 flex items-center justify-center mb-2 group-hover:bg-gov-800 group-hover:text-white transition">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Capture Image (OCR)</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Scanned tender pages</div>
            </div>
          </button>

          {/* 4. Paste Text */}
          <button
            type="button"
            onClick={() => onNavigate('procurement-intake')}
            className="p-3.5 bg-white border border-slate-200 hover:border-gov-800 rounded-xl text-left transition shadow-xs group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-lg bg-gov-50 text-gov-800 flex items-center justify-center mb-2 group-hover:bg-gov-800 group-hover:text-white transition">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Paste Text</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Technical summaries</div>
            </div>
          </button>

          {/* 5. Email Intake */}
          <button
            type="button"
            onClick={() => onNavigate('procurement-intake')}
            className="p-3.5 bg-white border border-slate-200 hover:border-gov-800 rounded-xl text-left transition shadow-xs group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-lg bg-gov-50 text-gov-800 flex items-center justify-center mb-2 group-hover:bg-gov-800 group-hover:text-white transition">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Email Intake</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Mailbox connector</div>
            </div>
          </button>

          {/* 6. Portal / API Intake */}
          <button
            type="button"
            onClick={() => onNavigate('procurement-intake')}
            className="p-3.5 bg-white border border-slate-200 hover:border-gov-800 rounded-xl text-left transition shadow-xs group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-lg bg-gov-50 text-gov-800 flex items-center justify-center mb-2 group-hover:bg-gov-800 group-hover:text-white transition">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Portal / API Intake</div>
              <div className="text-[10px] text-slate-500 mt-0.5">e-Procurement API</div>
            </div>
          </button>
        </div>
      </div>

      {/* =========================================================
          SECTION 3: MY WORK QUEUES
         ========================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            MY WORK
          </h2>
          <span className="text-[11px] text-slate-400">Assigned Procurement Records By Stage</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {myWorkQueues.map((queue) => {
            const Icon = queue.icon;
            return (
              <div
                key={queue.id}
                onClick={() => onNavigate(queue.view)}
                className="p-4 bg-white border border-slate-200 rounded-xl hover:border-gov-700 cursor-pointer transition shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${queue.color}`}>
                      {queue.count}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {queue.label}
                  </h4>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>{queue.status}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          SECTION 4: STANDARDS INTELLIGENCE TELEMETRY
         ========================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            STANDARDS INTELLIGENCE
          </h2>
          <span className="text-[11px] text-slate-400">Knowledge Base & Verification Telemetry</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {standardsIntelligenceStats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (item.id === 'recommended') onNavigate('recommendations');
                  else if (item.id === 'verification-req') onNavigate('review-queue');
                  else if (item.id === 'amendment-alerts') onNavigate('version-intelligence');
                  else onNavigate('standards-intelligence');
                }}
                className="p-4 bg-white border border-slate-200 rounded-xl hover:border-gov-700 cursor-pointer transition shadow-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800">{item.label}</span>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className={`text-2xl font-black font-mono ${item.color}`}>
                  {item.value}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {item.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          SECTION 5: STANDARDS INTELLIGENCE & EVALUATION SUITE (Section 22)
         ========================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              STANDARDS INTELLIGENCE & EVALUATION SUITE
            </h2>
            <p className="text-[11px] text-slate-400">Core analytical modules for tender review and standards compliance</p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-gov-100 text-gov-800 px-2 py-0.5 rounded">
            10 Functional Engines
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              id: 'matching',
              title: 'Smart Standards Matching',
              desc: 'Derives applicable Indian Standards semantically from verified BIS catalog.',
              icon: Award,
              color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
              view: 'recommendations'
            },
            {
              id: 'network',
              title: 'Standards Network',
              desc: 'Interactive relationship graph connecting primary, testing, and companion standards.',
              icon: Network,
              color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
              view: 'relationship-explorer'
            },
            {
              id: 'drift',
              title: 'Version & Amendment Drift',
              desc: 'Monitors superseded editions, gazette notifications, and latest revisions.',
              icon: History,
              color: 'text-amber-700 bg-amber-50 border-amber-200',
              view: 'version-intelligence'
            },
            {
              id: 'validation',
              title: 'Smart Validation',
              desc: 'Six-pillar evaluation of technical completeness, safety, and testing coverage.',
              icon: ShieldCheck,
              color: 'text-gov-800 bg-gov-50 border-gov-200',
              view: 'readiness'
            },
            {
              id: 'bundling',
              title: 'Multi-Standard Bundling',
              desc: 'Hierarchical clustering for complete packages (luminaires, drivers, enclosures).',
              icon: Package,
              color: 'text-purple-700 bg-purple-50 border-purple-200',
              view: 'bundling'
            },
            {
              id: 'gaps',
              title: 'Specification Gap Analyzer',
              desc: 'Flags missing test parameters, omitted safety clauses, and underspecified limits.',
              icon: AlertTriangle,
              color: 'text-rose-700 bg-rose-50 border-rose-200',
              view: 'gaps'
            },
            {
              id: 'traceability',
              title: 'Clause-Level Traceability',
              desc: 'Direct line-by-line provenance linking tender text to normative standards.',
              icon: TableProperties,
              color: 'text-slate-800 bg-slate-50 border-slate-200',
              view: 'traceability'
            },
            {
              id: 'redundancy',
              title: 'Redundancy Detector',
              desc: 'Identifies duplicated and semantically overlapping requirements across schedules.',
              icon: Sliders,
              color: 'text-blue-700 bg-blue-50 border-blue-200',
              view: 'conflicts-redundancies'
            },
            {
              id: 'conflicts',
              title: 'Specification Conflict Detector',
              desc: 'Pinpoints contradictory numerical ratings, voltage bands, and temperature bounds.',
              icon: GitCompare,
              color: 'text-rose-800 bg-rose-50 border-rose-200',
              view: 'conflicts-redundancies'
            },
            {
              id: 'diff',
              title: 'Tender Version Diff',
              desc: 'Side-by-side comparison of specification addenda, amendments, and revisions.',
              icon: FileCheck2,
              color: 'text-teal-700 bg-teal-50 border-teal-200',
              view: 'version-diff'
            }
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigate(card.view)}
                className="p-4 bg-white border border-slate-200 hover:border-gov-800 rounded-xl cursor-pointer transition-all shadow-xs hover:shadow-sm flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg border ${card.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition transform group-hover:translate-x-0.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-gov-900 transition leading-snug">
                    {card.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    {card.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-gov-800">
                  <span>Launch Tool</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          SECTION 6: ACTIVE PROCUREMENT DOSSIERS TABLE
         ========================================================= */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Active Procurement Analysis Records
            </h3>
            <p className="text-xs text-slate-500">
              Review progress, standards alignment, and workflow status for assigned procurements.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('my-analyses')}
            className="text-xs font-semibold text-gov-800 hover:text-gov-950 flex items-center space-x-1"
          >
            <span>View All Analyses</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-4">Procurement ID & Title</th>
                <th className="py-2.5 px-3">Procuring Department</th>
                <th className="py-2.5 px-3">Workflow Status</th>
                <th className="py-2.5 px-3">Standards Mapped</th>
                <th className="py-2.5 px-3">Coverage</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeProcurements.map((proc) => (
                <tr key={proc.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4">
                    <div className="font-mono text-[11px] font-bold text-slate-500">{proc.procurement_id}</div>
                    <div className="font-semibold text-slate-900 text-xs mt-0.5">{proc.title}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                    {proc.department}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${proc.statusColor}`}>
                      {proc.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                    {proc.standards_count} Standards ({proc.requirements_count} Clauses)
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-gov-800 h-full rounded-full" 
                          style={{ width: `${proc.coverage}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-800">{proc.coverage}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectDemo(proc.id)}
                      className="px-2.5 py-1 bg-gov-900 hover:bg-gov-800 text-white rounded text-xs font-semibold shadow-xs transition"
                    >
                      Open Analysis →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

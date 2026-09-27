import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  SearchCode, 
  Network, 
  TableProperties, 
  Scale, 
  History, 
  Sparkles, 
  FileText, 
  CheckCircle2,
  ChevronRight,
  Database,
  Building2,
  Cpu
} from 'lucide-react';

interface LandingPageProps {
  onAnalyzeClick: () => void;
  onExploreClick: () => void;
  onSelectDemo: (demoId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onAnalyzeClick,
  onExploreClick,
  onSelectDemo
}) => {
  return (
    <div className="space-y-12 max-w-6xl mx-auto py-4">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4">
        {/* Subtle Government Tag */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gov-50 border border-gov-200 text-gov-800 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Government Procurement Intelligence Platform</span>
          <span className="text-slate-300">•</span>
          <span className="text-gov-700">Enterprise Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-serif tracking-tight text-gov-950 max-w-4xl mx-auto leading-tight">
          From Procurement Specifications to <span className="text-gov-700">Standards Intelligence</span>.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Automated standards identification, relationship mapping, version intelligence and traceability for Indian Standards.
        </p>

        {/* Hero Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onAnalyzeClick}
            className="px-6 py-3 bg-gov-900 hover:bg-gov-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center space-x-2 hover:scale-105"
          >
            <span>Analyze Procurement Specification</span>
            <ArrowRight className="w-4 h-4 text-saffron-400" />
          </button>
          <button
            onClick={onExploreClick}
            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl border border-slate-300 shadow-sm transition-all flex items-center space-x-2"
          >
            <SearchCode className="w-4 h-4 text-gov-700" />
            <span>Explore 2,450 Indian Standards</span>
          </button>
        </div>

        {/* Signature Callout Statement */}
        <div className="pt-2">
          <p className="text-xs sm:text-sm font-serif italic text-slate-500">
            “Don’t just find a standard. Understand the standards ecosystem behind the specification.”
          </p>
        </div>
      </section>

      {/* Hero Visual: Animated Procurement Intelligence Diagram */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-6">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Core Workflow
          </span>
          <h3 className="text-sm font-bold font-serif text-slate-900 mt-0.5">
            The BHARATSPEC End-to-End Standards Intelligence Pipeline
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
          {[
            { step: 'Tender Document', desc: 'Raw PDF/DOCX Spec', icon: FileText, color: 'border-slate-300' },
            { step: 'Requirement Extraction', desc: 'Parameters & Limits', icon: Cpu, color: 'border-gov-400' },
            { step: 'Indian Standards', desc: '2,450 Catalog Records', icon: Database, color: 'border-emerald-400' },
            { step: 'Relationship Graph', desc: 'Normative & Allied Map', icon: Network, color: 'border-indigo-400' },
            { step: 'Traceability Matrix', desc: 'Clause-by-Clause Verification', icon: TableProperties, color: 'border-amber-400' },
            { step: 'Intelligence Report', desc: 'Auditable Executive Output', icon: ShieldCheck, color: 'border-rose-400' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className={`p-4 rounded-xl border-2 ${item.color} bg-slate-50/50 flex flex-col items-center justify-between space-y-2 hover:bg-white transition`}>
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gov-900 border border-slate-200">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{item.step}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Signature Differentiators Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
            <Network className="w-5 h-5" />
          </div>
          <h4 className="font-serif font-bold text-sm text-slate-900">
            Standards Relationship Graph
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Move beyond isolated IS numbers. Map normative references, testing methods, safety standards, installation guidelines, and superseded versions in one interactive topological graph.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <Scale className="w-5 h-5" />
          </div>
          <h4 className="font-serif font-bold text-sm text-slate-900">
            Regulatory & QCO Distinction
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Distinguishes voluntary technical recommendations from statutory Quality Control Orders (QCOs) published in Gazette notifications by DPIIT, MNRE, and MeitY.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
            <History className="w-5 h-5" />
          </div>
          <h4 className="font-serif font-bold text-sm text-slate-900">
            Version & Amendment Alerts
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Detects outdated references (e.g. IS 16046:2015 vs 2018) and published amendments before tenders are released to prevent post-tender disputes and bid litigations.
          </p>
        </div>
      </section>

      {/* Quick Launch Pre-set Tenders */}
      <section className="bg-gov-950 rounded-2xl p-6 sm:p-8 text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gov-800 pb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-saffron-400 tracking-wider">
              Benchmark Specifications
            </span>
            <h3 className="text-lg font-bold font-serif text-white mt-0.5">
              Explore Active Benchmark Procurement Cases
            </h3>
          </div>
          <span className="text-xs text-slate-400">Authoritative published public tender specifications</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {[
            { id: 'demo-solar-001', title: 'Solar Street Lighting System', meta: '28 Reqs • 8 Standards • 82% Coverage' },
            { id: 'demo-med-002', title: 'Motorized ICU Hospital Bed', meta: '24 Reqs • 6 Standards • 88% Coverage' },
            { id: 'demo-trans-003', title: '250 kVA Distribution Transformer', meta: '25 Reqs • 7 Standards • 92% Coverage' }
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectDemo(item.id)}
              className="bg-gov-900 hover:bg-gov-800 border border-gov-700 p-4 rounded-xl cursor-pointer transition flex flex-col justify-between group"
            >
              <div>
                <h5 className="font-bold text-xs text-white group-hover:text-saffron-400 transition">
                  {item.title}
                </h5>
                <p className="text-[11px] text-slate-400 mt-1">{item.meta}</p>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-saffron-400 font-semibold pt-2 border-t border-gov-800">
                <span>Run Intelligence Pipeline</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

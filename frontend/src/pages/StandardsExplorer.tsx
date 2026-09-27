import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  BookOpen, 
  X, 
  ShieldCheck, 
  FileCheck2, 
  SlidersHorizontal,
  Layers,
  ChevronRight,
  Network,
  History,
  ClipboardCheck,
  FileText
} from 'lucide-react';
import { Standard } from '../types';
import { StandardsRelationshipGraph } from '../components/StandardsRelationshipGraph';
import { SOLAR_STREET_LIGHT_RELATIONSHIPS } from '../services/demoData';

interface StandardsExplorerProps {
  standards: Standard[];
  initialSearch?: string;
}

export const StandardsExplorer: React.FC<StandardsExplorerProps> = ({ 
  standards, 
  initialSearch = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeStandard, setActiveStandard] = useState<Standard | null>(null);
  const [drawerTab, setDrawerTab] = useState<'overview' | 'requirements' | 'relationships' | 'versions' | 'amendments' | 'evidence' | 'sources'>('overview');

  const categories = [
    'All',
    'Solar & Renewable Energy',
    'Lighting & Luminaires',
    'Electrical & Power Transmission',
    'Medical Devices & Healthcare Equipment',
    'Electronics & IT Equipment',
    'Water Purification & Treatment',
    'Construction & Civil Infrastructure',
    'Safety, PPE & Fire Protection'
  ];

  const filtered = standards.filter(s => {
    if (selectedCategory !== 'All' && !s.category.toLowerCase().includes(selectedCategory.toLowerCase().split(' ')[0])) {
      return false;
    }
    if (selectedStatus !== 'All' && s.status !== selectedStatus) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNumber = s.is_number.toLowerCase().includes(q);
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchKw = s.keywords.some(k => k.toLowerCase().includes(q));
      const matchProd = s.applicable_products.some(p => p.toLowerCase().includes(q));
      if (!matchNumber && !matchTitle && !matchKw && !matchProd) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gov-800 font-bold text-xs uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4 text-gov-700" />
            <span>Bureau of Indian Standards Knowledge Base</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">
            Indian Standards Explorer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Search, filter, and inspect technical scopes, test methods, amendments, and QCO linkages for Indian Standards.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-mono font-medium border border-slate-200">
            Showing {filtered.length} of {standards.length} Standards
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by IS number (e.g. IS 10322, IS 16221, IS 16046), title, product, or parameter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-700 focus:bg-white text-slate-900 placeholder-slate-400"
          />
        </div>

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none"
        >
          {categories.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        {/* Status Dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Current">Current</option>
          <option value="Amendment Available">Amendment Available</option>
          <option value="Superseded">Superseded</option>
        </select>
      </div>

      {/* Grid of Standards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((std) => (
          <div
            key={std.id}
            onClick={() => {
              setActiveStandard(std);
              setDrawerTab('overview');
            }}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-gov-700 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gov-100 text-gov-800">
                  {std.category}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                  std.status === 'Current' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  std.status === 'Amendment Available' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                  'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {std.status}
                </span>
              </div>

              <h3 className="font-mono font-bold text-sm text-slate-900 group-hover:text-gov-950">
                {std.is_number}
              </h3>
              <p className="text-xs font-semibold text-slate-800 line-clamp-2 mt-1">
                {std.title}
              </p>
              <p className="text-xs text-slate-500 line-clamp-3 mt-2 leading-relaxed">
                {std.short_description || std.scope}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-mono">Edition: {std.current_edition}</span>
              <span className="text-gov-800 font-bold flex items-center space-x-1 group-hover:translate-x-1 transition">
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Standard Details Slide-over Modal with Tabs (Section 7) */}
      {activeStandard && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right">
            
            {/* Drawer Header */}
            <div className="px-6 py-4 bg-gov-950 text-white flex items-center justify-between border-b border-gov-900">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-bold text-saffron-400 tracking-wider">
                    Indian Standard Details
                  </span>
                  <span className="text-[10px] px-2 py-0.2 rounded bg-gov-800 text-slate-300 font-mono">
                    Edition: {activeStandard.current_edition}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-mono text-white mt-0.5">{activeStandard.is_number}</h3>
                <p className="text-xs text-slate-300 line-clamp-1">{activeStandard.title}</p>
              </div>
              <button
                onClick={() => setActiveStandard(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-gov-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Standard Details Tabs (Section 7) */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4 overflow-x-auto text-xs font-semibold">
              {[
                { id: 'overview', label: 'Overview', icon: BookOpen },
                { id: 'requirements', label: 'Requirements', icon: Layers },
                { id: 'relationships', label: 'Relationships', icon: Network, highlight: true },
                { id: 'versions', label: 'Versions', icon: History },
                { id: 'amendments', label: 'Amendments', icon: FileText },
                { id: 'evidence', label: 'Evidence', icon: ClipboardCheck },
                { id: 'sources', label: 'Sources', icon: ExternalLink },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = drawerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setDrawerTab(tab.id as any)}
                    className={`py-3 px-3.5 flex items-center space-x-1.5 border-b-2 whitespace-nowrap transition ${
                      isActive 
                        ? 'border-gov-900 text-gov-950 font-bold bg-white' 
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-gov-800' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs text-slate-700">
              
              {/* TAB 1: OVERVIEW */}
              {drawerTab === 'overview' && (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Full Title</span>
                    <h4 className="font-semibold text-sm text-slate-900 mt-0.5">{activeStandard.title}</h4>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-mono text-slate-700">
                        Current Edition: {activeStandard.current_edition}
                      </span>
                      <span className="px-2 py-0.5 bg-gov-100 text-gov-800 rounded text-[11px] font-semibold">
                        {activeStandard.category}
                      </span>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-3.5 space-y-1 bg-slate-50/50">
                    <span className="text-[10px] font-bold uppercase text-gov-800 tracking-wider">Technical Scope</span>
                    <p className="text-slate-700 leading-relaxed text-xs">{activeStandard.scope}</p>
                  </div>

                  {activeStandard.testing_information && (
                    <div className="border border-slate-200 rounded-lg p-3.5 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-gov-800 tracking-wider">Testing & Verification Protocol</span>
                      <p className="text-slate-600 leading-relaxed text-xs">{activeStandard.testing_information}</p>
                    </div>
                  )}

                  {activeStandard.safety_information && (
                    <div className="border border-slate-200 rounded-lg p-3.5 space-y-1 bg-rose-50/40 border-rose-200">
                      <span className="text-[10px] font-bold uppercase text-rose-800 tracking-wider">Safety Specifications</span>
                      <p className="text-slate-700 leading-relaxed text-xs">{activeStandard.safety_information}</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: REQUIREMENTS */}
              {drawerTab === 'requirements' && (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block">
                    Parameters & Requirements Covered
                  </span>
                  {activeStandard.requirements_covered.length > 0 ? (
                    <div className="space-y-1.5">
                      {activeStandard.requirements_covered.map((r, i) => (
                        <div key={i} className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-800">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span className="font-medium">{r}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">No explicit parameters cataloged for this standard.</p>
                  )}
                </div>
              )}

              {/* TAB 3: RELATIONSHIPS (EMBEDDED RELATIONSHIP GRAPH - SECTION 7) */}
              {drawerTab === 'relationships' && (
                <div className="space-y-3">
                  <StandardsRelationshipGraph
                    relationships={SOLAR_STREET_LIGHT_RELATIONSHIPS}
                    primaryStandardNumber={activeStandard.is_number}
                  />
                </div>
              )}

              {/* TAB 4: VERSIONS */}
              {drawerTab === 'versions' && (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Version History</span>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex justify-between font-mono font-bold text-slate-900">
                      <span>{activeStandard.current_edition}</span>
                      <span className="text-emerald-700 font-normal">Active Edition</span>
                    </div>
                    {activeStandard.supersedes && (
                      <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                        <span>Supersedes earlier edition: </span>
                        <strong className="font-mono text-slate-800">{activeStandard.supersedes}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: AMENDMENTS */}
              {drawerTab === 'amendments' && (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Gazette Amendments</span>
                  {activeStandard.amendment_information ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-amber-900 tracking-wider">Gazette Notification</span>
                      <p className="text-amber-800 text-xs">{activeStandard.amendment_information}</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-500">
                      No pending gazette amendments recorded for this edition.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: EVIDENCE */}
              {drawerTab === 'evidence' && (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Required Conformity Evidence</span>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                    <div>• Valid BIS Standard Mark (ISI) or Compulsory Registration Scheme (CRS) license certificate.</div>
                    <div>• NABL-accredited test reports for type tests and routine tests.</div>
                    <div>• OEM Declaration of Conformity with serial number tracing.</div>
                  </div>
                </div>
              )}

              {/* TAB 7: SOURCES */}
              {drawerTab === 'sources' && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Authoritative Source:</span>
                    <span className="font-semibold text-slate-800">{activeStandard.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Document Reference:</span>
                    <span className="font-mono text-slate-800">{activeStandard.document_reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Portal Link:</span>
                    <span className="text-gov-800 font-mono underline cursor-pointer">{activeStandard.source_url}</span>
                  </div>
                </div>
              )}

            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-400 text-[11px]">Bureau of Indian Standards Knowledge Base</span>
              <button
                onClick={() => setActiveStandard(null)}
                className="px-4 py-1.5 bg-gov-900 hover:bg-gov-800 text-white rounded-lg font-semibold transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

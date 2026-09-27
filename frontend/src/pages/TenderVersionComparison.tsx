import React, { useState } from 'react';
import { 
  GitCompare, 
  Upload, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  PlusCircle, 
  MinusCircle, 
  RefreshCw, 
  ChevronRight, 
  Eye, 
  Layers, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { ExtractedRequirement } from '../types';

interface DiffItem {
  id: string;
  type: 'ADDED' | 'MODIFIED' | 'REMOVED';
  clause: string;
  parameter: string;
  previous_text?: string;
  new_text?: string;
  source_page: string;
  impact: string;
  affected_standard: string;
  reviewer_status: 'Needs Re-Review' | 'Standards Re-Mapped' | 'Verified Compliant';
}

export const TenderVersionComparison: React.FC = () => {
  const [version1Name, setVersion1Name] = useState('Solar_Street_Lighting_NIT_Rev01.pdf');
  const [version2Name, setVersion2Name] = useState('Solar_Street_Lighting_NIT_Rev02_Addendum.pdf');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ADDED' | 'MODIFIED' | 'REMOVED'>('ALL');
  const [selectedItem, setSelectedItem] = useState<DiffItem | null>(null);

  // Detailed realistic diff dataset
  const diffItems: DiffItem[] = [
    {
      id: 'DIFF-001',
      type: 'MODIFIED',
      clause: 'Clause 4.2',
      parameter: 'Battery Cell Standard Citation',
      previous_text: 'The battery pack shall comprise Lithium Ferro Phosphate (LiFePO4) cells conforming to IS 16046:2015.',
      new_text: 'The battery pack shall comprise Lithium Ferro Phosphate (LiFePO4) cells conforming to latest Gazette notification IS 16046 (Part 2):2018 with active cell balancing.',
      source_page: 'Page 5, Section 4.2',
      impact: 'Superseded 2015 standard updated to current 2018 mandatory Gazette edition. Bidders must submit updated BIS CRS certificate.',
      affected_standard: 'IS 16046 (Part 2) : 2018',
      reviewer_status: 'Standards Re-Mapped'
    },
    {
      id: 'DIFF-002',
      type: 'MODIFIED',
      clause: 'Clause 3.1',
      parameter: 'Luminaire System Efficacy',
      previous_text: 'Luminaire minimum luminous efficacy shall be 120 Lumens / Watt.',
      new_text: 'Luminaire minimum luminous efficacy shall be 140 Lumens / Watt with LM-79 and LM-80 test reports from NABL accredited laboratory.',
      source_page: 'Page 4, Section 3.1',
      impact: 'Efficacy threshold increased by 16.6%. Testing requirements expanded to mandate formal NABL LM-79 report.',
      affected_standard: 'IS 10322 (Part 5/Sec 3)',
      reviewer_status: 'Needs Re-Review'
    },
    {
      id: 'DIFF-003',
      type: 'ADDED',
      clause: 'Clause 3.9',
      parameter: 'Surge Protection Device (SPD)',
      previous_text: '',
      new_text: 'The luminaire shall be equipped with an integrated 10 kV / 10 kA external Surge Protection Device conforming to IS/IEC 61643-11.',
      source_page: 'Page 6, Section 3.9',
      impact: 'New electrical safety requirement introduced. Mandates compliance verification against IS/IEC 61643-11.',
      affected_standard: 'IS/IEC 61643-11 : 2011',
      reviewer_status: 'Needs Re-Review'
    },
    {
      id: 'DIFF-004',
      type: 'ADDED',
      clause: 'Clause 6.3',
      parameter: 'Ingress Protection Enclosure Rating',
      previous_text: '',
      new_text: 'The luminaire housing and battery compartment shall have IP66 ingress protection tested per IS/IEC 60529 with optical chamber sealed.',
      source_page: 'Page 8, Section 6.3',
      impact: 'Replaces generic weatherproof wording with strict IP66 certification requirement.',
      affected_standard: 'IS/IEC 60529 : 2001',
      reviewer_status: 'Needs Re-Review'
    },
    {
      id: 'DIFF-005',
      type: 'ADDED',
      clause: 'Clause 7.1',
      parameter: 'NABL Accredited Laboratory Test Validity',
      previous_text: '',
      new_text: 'All type test certificates submitted by bidders must be dated within 3 years prior to the bid closing date from an ILAC/NABL accredited laboratory.',
      source_page: 'Page 9, Section 7.1',
      impact: 'Establishes 3-year test report validity window for technical evaluation compliance.',
      affected_standard: 'ISO/IEC 17025 Accreditation Guidelines',
      reviewer_status: 'Verified Compliant'
    },
    {
      id: 'DIFF-006',
      type: 'MODIFIED',
      clause: 'Clause 2.4',
      parameter: 'PV Module Mechanical Load Resistance',
      previous_text: 'Solar PV modules shall withstand 2400 Pascal wind load.',
      new_text: 'Solar PV modules shall withstand 2400 Pascal wind load and 5400 Pascal heavy mechanical snow/cyclonic load per IS 14286.',
      source_page: 'Page 3, Section 2.4',
      impact: 'Mechanical load test criteria elevated from 2400 Pa to 5400 Pa. Affects mounting hardware validation.',
      affected_standard: 'IS 14286 : 2010',
      reviewer_status: 'Standards Re-Mapped'
    },
    {
      id: 'DIFF-007',
      type: 'MODIFIED',
      clause: 'Clause 5.2',
      parameter: 'MPPT Charge Controller Efficiency',
      previous_text: 'Charge controller shall have efficiency greater than 90%.',
      new_text: 'Microcontroller MPPT charge controller shall have peak tracking efficiency >= 98% and conversion efficiency >= 95% conforming to IS 16221.',
      source_page: 'Page 7, Section 5.2',
      impact: 'Clarified dual efficiency parameters (tracking vs conversion). Benchmarked against IS 16221.',
      affected_standard: 'IS 16221 (Part 2) : 2015',
      reviewer_status: 'Standards Re-Mapped'
    },
    {
      id: 'DIFF-008',
      type: 'MODIFIED',
      clause: 'Clause 8.4',
      parameter: 'Hardware Warranty SLA & Replacement Period',
      previous_text: 'Comprehensive 5-year replacement warranty on all components.',
      new_text: 'Comprehensive 5-year on-site replacement warranty with maximum 48-hour hardware replacement turnaround SLA.',
      source_page: 'Page 11, Section 8.4',
      impact: 'Contractual SLA parameter tightened with liquidated damages penalty clause.',
      affected_standard: 'General Financial Rules (GFR) Guidelines',
      reviewer_status: 'Verified Compliant'
    },
    {
      id: 'DIFF-009',
      type: 'REMOVED',
      clause: 'Clause 1.4',
      parameter: 'Proprietary Brand Benchmark Mention',
      previous_text: 'The pole powder coating shall be CorroShield brand or equivalent.',
      new_text: '',
      source_page: 'Page 2, Section 1.4',
      impact: 'Proprietary brand name removed to satisfy CVC procurement neutrality guidelines. Replaced by objective standard IS 2062 / IS 4759.',
      affected_standard: 'CVC Neutrality Guidelines / IS 4759',
      reviewer_status: 'Verified Compliant'
    }
  ];

  const filteredItems = diffItems.filter(item => {
    if (activeFilter === 'ALL') return true;
    return item.type === activeFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-2 text-gov-800 font-bold text-xs uppercase tracking-wider mb-1">
          <GitCompare className="w-4 h-4 text-gov-700" />
          <span>Tender Version & Addendum Intelligence</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-slate-900">
              Tender Version Comparison & Diff Engine
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare base tender specifications against corrigenda, addenda, or revised schedules to track parameter changes, affected standards, and re-review requirements.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono bg-white border border-slate-300 rounded-lg px-3 py-1.5 shadow-xs">
            <span className="text-slate-500">Comparing:</span>
            <strong className="text-gov-900">Rev 01 vs Rev 02</strong>
          </div>
        </div>
      </div>

      {/* Version Selector Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Version 1 */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Base Document (Version 1)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-200 text-slate-700 rounded font-semibold">
              Original Tender
            </span>
          </div>
          <div className="flex items-center space-x-2.5">
            <FileText className="w-5 h-5 text-gov-800 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">{version1Name}</h4>
              <p className="text-[10px] text-slate-500">Published: 10 Sep 2026 • 24 Clauses Identified</p>
            </div>
          </div>
        </div>

        {/* Version 2 */}
        <div className="p-4 rounded-xl border border-gov-300 bg-gov-50/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gov-800">
              Revised Document (Version 2)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-gov-100 text-gov-900 rounded font-bold">
              Addendum / Corrigendum
            </span>
          </div>
          <div className="flex items-center space-x-2.5">
            <FileText className="w-5 h-5 text-gov-800 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">{version2Name}</h4>
              <p className="text-[10px] text-slate-500">Published: 26 Sep 2026 • 26 Clauses Identified</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Summary (Section 17) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Added */}
        <div 
          onClick={() => setActiveFilter('ADDED')}
          className={`p-4 bg-white border rounded-xl cursor-pointer transition shadow-xs ${
            activeFilter === 'ADDED' ? 'border-emerald-600 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 mb-1">
            <span>ADDED</span>
            <PlusCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700">3</div>
          <div className="text-[11px] text-slate-500 mt-0.5">requirements added</div>
        </div>

        {/* Modified */}
        <div 
          onClick={() => setActiveFilter('MODIFIED')}
          className={`p-4 bg-white border rounded-xl cursor-pointer transition shadow-xs ${
            activeFilter === 'MODIFIED' ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-blue-800 mb-1">
            <span>MODIFIED</span>
            <RefreshCw className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black font-mono text-blue-700">5</div>
          <div className="text-[11px] text-slate-500 mt-0.5">requirements updated</div>
        </div>

        {/* Removed */}
        <div 
          onClick={() => setActiveFilter('REMOVED')}
          className={`p-4 bg-white border rounded-xl cursor-pointer transition shadow-xs ${
            activeFilter === 'REMOVED' ? 'border-rose-600 ring-2 ring-rose-100' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-rose-800 mb-1">
            <span>REMOVED</span>
            <MinusCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-700">1</div>
          <div className="text-[11px] text-slate-500 mt-0.5">requirement deleted</div>
        </div>

        {/* Affected Standards */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-gov-800 mb-1">
            <span>AFFECTED STANDARDS</span>
            <ShieldCheck className="w-4 h-4 text-gov-700" />
          </div>
          <div className="text-2xl font-black font-mono text-gov-900">2</div>
          <div className="text-[11px] text-slate-500 mt-0.5">standards re-mapped</div>
        </div>

        {/* Affected Reviews */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800 mb-1">
            <span>AFFECTED REVIEWS</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-700">3</div>
          <div className="text-[11px] text-slate-500 mt-0.5">pending technical re-review</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeFilter === 'ALL' ? 'bg-gov-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Detected Changes ({diffItems.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('ADDED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeFilter === 'ADDED' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Added Requirements (3)
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('MODIFIED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeFilter === 'MODIFIED' ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Modified Requirements (5)
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('REMOVED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeFilter === 'REMOVED' ? 'bg-rose-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Removed Requirements (1)
        </button>
      </div>

      {/* Detailed Diff Cards List */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          let badgeColor = "bg-blue-100 text-blue-900 border-blue-200";
          if (item.type === 'ADDED') badgeColor = "bg-emerald-100 text-emerald-900 border-emerald-200";
          if (item.type === 'REMOVED') badgeColor = "bg-rose-100 text-rose-900 border-rose-200";

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-gov-700 cursor-pointer transition shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeColor}`}>
                    {item.type}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-500">{item.clause}</span>
                  <span className="font-bold text-xs text-slate-900">{item.parameter}</span>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="font-mono text-[11px] text-slate-500">{item.source_page}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    {item.reviewer_status}
                  </span>
                </div>
              </div>

              {/* Comparison Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                {item.previous_text ? (
                  <div className="p-2.5 rounded-lg bg-rose-50/50 border border-rose-100 text-slate-700">
                    <span className="text-[10px] font-bold text-rose-800 uppercase block mb-0.5">Previous Text (Version 1):</span>
                    <span className="font-mono text-[11px]">{item.previous_text}</span>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 italic text-[11px]">
                    Not present in Version 1 (Newly added clause)
                  </div>
                )}

                {item.new_text ? (
                  <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-slate-800">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-0.5">New Text (Version 2):</span>
                    <span className="font-mono text-[11px]">{item.new_text}</span>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 italic text-[11px]">
                    Deleted in Version 2 (Removed from schedule)
                  </div>
                )}
              </div>

              {/* Impact & Standard Alignment */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="text-slate-600">
                  <strong className="text-slate-800">Technical Impact:</strong> {item.impact}
                </div>
                <div className="font-mono text-[11px] text-gov-800 font-bold flex-shrink-0">
                  Standard: {item.affected_standard}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

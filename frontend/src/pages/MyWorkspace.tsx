import React, { useState } from 'react';
import { 
  Briefcase, 
  Clock, 
  FileText, 
  AlertTriangle, 
  Bookmark, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  BookOpen,
  Plus
} from 'lucide-react';
import { DemoSpecification, GeneratedReport, ReviewItem } from '../types';
import { DEMO_SPECIFICATIONS, GENERATED_REPORTS_LIST, REVIEW_QUEUE_ITEMS, STANDARDS_DATABASE } from '../services/demoData';

interface MyWorkspaceProps {
  onOpenAnalysis: (id?: string) => void;
  onOpenReport: (reportId: string) => void;
  onOpenReviewQueue: () => void;
  onOpenStandards: (searchQuery?: string) => void;
  onNewAnalysis: () => void;
}

export const MyWorkspace: React.FC<MyWorkspaceProps> = ({
  onOpenAnalysis,
  onOpenReport,
  onOpenReviewQueue,
  onOpenStandards,
  onNewAnalysis
}) => {
  const recentSearches = [
    "Solar Street Lighting LiFePO4",
    "IS 16046 Part 2 battery testing",
    "LED luminaire road lighting IS 10322",
    "CPRI short circuit test transformer",
    "RO plant drinking water IS 10500"
  ];

  const savedStandards = [
    { is: "IS 16221 (Part 2) : 2015", title: "Safety of Power Converters for Photovoltaic Power Systems" },
    { is: "IS 16046 (Part 2) : 2018", title: "Secondary Lithium Cells and Batteries Safety Requirements" },
    { is: "IS 10322 (Part 5/Sec 3) : 2012", title: "Luminaires for Road and Street Lighting" },
    { is: "IS 14286 : 2010", title: "Crystalline Silicon Terrestrial Photovoltaic (PV) Modules" }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2 text-gov-800 font-bold text-xs uppercase tracking-wider mb-1">
          <Briefcase className="w-4 h-4 text-gov-700" />
          <span>Officer Workspace</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-slate-900">
              My Workspace
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Personalized dashboard for your assigned procurement specifications, pending reviews, saved standards, and recent dossiers.
            </p>
          </div>
          <button
            onClick={onNewAnalysis}
            className="px-4 py-2.5 bg-gov-900 hover:bg-gov-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-2"
          >
            <Plus className="w-4 h-4 text-saffron-400" />
            <span>+ New Specification Analysis</span>
          </button>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Analyses & Pending Reviews (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active / Recent Procurement Analyses */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gov-800" />
                <h3 className="font-bold text-sm font-serif text-slate-900">Recent Procurement Analyses</h3>
              </div>
              <span className="text-xs text-slate-400">Assigned to You</span>
            </div>

            <div className="space-y-3">
              {DEMO_SPECIFICATIONS.slice(0, 3).map((spec) => (
                <div 
                  key={spec.id}
                  onClick={() => onOpenAnalysis(spec.id)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-gov-800 hover:bg-gov-50/20 cursor-pointer transition flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gov-100 text-gov-800">
                        {spec.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-700">
                        {spec.stats.coverage_indicator}% Coverage
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-gov-950">
                      {spec.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{spec.summary}</p>
                  </div>
                  <div className="pl-4 flex-shrink-0">
                    <span className="text-xs font-bold text-gov-800 group-hover:translate-x-1 transition inline-flex items-center">
                      Open →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Review Queue Preview */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-sm font-serif text-slate-900">Needs Review: Action Items</h3>
              </div>
              <button 
                onClick={onOpenReviewQueue}
                className="text-xs text-gov-800 hover:text-gov-900 font-semibold"
              >
                View All Queue ({REVIEW_QUEUE_ITEMS.length}) →
              </button>
            </div>

            <div className="space-y-2.5">
              {REVIEW_QUEUE_ITEMS.slice(0, 3).map((rev) => (
                <div key={rev.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">
                        {rev.priority}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-800">{rev.title}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1">{rev.description}</p>
                  </div>
                  <button
                    onClick={onOpenReviewQueue}
                    className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded text-xs font-medium flex-shrink-0"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Reports Ready, Saved Standards & Searches (1 Col) */}
        <div className="space-y-6">
          
          {/* Reports Ready */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gov-800" />
                <h3 className="font-bold text-xs font-serif text-slate-900">Ready Dossiers</h3>
              </div>
              <span className="text-[11px] text-emerald-700 font-mono font-bold">3 Ready</span>
            </div>

            <div className="space-y-2">
              {GENERATED_REPORTS_LIST.map((r) => (
                <div 
                  key={r.report_id}
                  onClick={() => onOpenReport(r.report_id)}
                  className="p-2.5 bg-slate-50 hover:bg-gov-50 rounded-lg border border-slate-200 cursor-pointer transition"
                >
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span className="font-bold text-slate-700">{r.report_id}</span>
                    <span>{r.coverage_score}% Coverage</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 truncate mt-0.5">
                    {r.procurement_title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Standards */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
              <Bookmark className="w-4 h-4 text-gov-800" />
              <h3 className="font-bold text-xs font-serif text-slate-900">Pinned Indian Standards</h3>
            </div>

            <div className="space-y-2">
              {savedStandards.map((std) => (
                <div 
                  key={std.is}
                  onClick={() => onOpenStandards(std.is)}
                  className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition"
                >
                  <div className="text-xs font-mono font-bold text-gov-900">{std.is}</div>
                  <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{std.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
              <Search className="w-4 h-4 text-gov-800" />
              <h3 className="font-bold text-xs font-serif text-slate-900">Recent Searches</h3>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {recentSearches.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => onOpenStandards(s)}
                  className="text-[11px] bg-slate-100 hover:bg-gov-100 text-slate-700 hover:text-gov-900 px-2.5 py-1 rounded-md transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

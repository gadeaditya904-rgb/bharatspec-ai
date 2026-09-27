import React from 'react';
import { History, AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, Calendar, FileText } from 'lucide-react';
import { StandardVersionInfo } from '../types';

interface VersionIntelligenceViewProps {
  versionData: StandardVersionInfo[];
}

export const VersionIntelligenceView: React.FC<VersionIntelligenceViewProps> = ({ versionData }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2 text-gov-800 font-bold text-xs uppercase tracking-wider mb-1">
          <History className="w-4 h-4 text-gov-700" />
          <span>Mandatory Core Feature</span>
        </div>
        <h2 className="text-xl font-bold font-serif text-slate-900">
          Standards Version & Amendment Intelligence
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Proactively identifies outdated standard references, recent Gazette amendments, and superseded editions across tender clauses.
        </p>
      </div>

      {/* Outdated Reference Warning Alert Box */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>Outdated Reference & Gazette Amendment Advisory</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          Public procurement specifications must reference the latest published editions and amendments notified by the Bureau of Indian Standards (BIS). Referencing withdrawn or superseded standards can lead to vendor bid disputes and technical rejections during tender evaluation.
        </p>
      </div>

      {/* Version Intelligence Cards */}
      <div className="space-y-4">
        {versionData.map((item, idx) => {
          const isOutdated = item.status === 'OUTDATED_REFERENCE';
          const hasAmendments = item.status === 'AMENDMENT_AVAILABLE';

          return (
            <div 
              key={idx} 
              className={`bg-white rounded-xl border p-5 shadow-sm transition space-y-3 ${
                isOutdated 
                  ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/20' 
                  : hasAmendments 
                    ? 'border-amber-300 bg-amber-50/20' 
                    : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-serif font-bold text-base text-gov-950">{item.is_number}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isOutdated ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                      hasAmendments ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-700">{item.title}</h4>
                </div>

                <div className="text-right text-[11px] font-mono text-slate-500">
                  <span>Current Edition: <strong className="text-slate-900">{item.current_edition}</strong></span>
                </div>
              </div>

              {/* Tender Match vs Action Required */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Tender Reference Status</span>
                  <p className="text-slate-800 font-medium text-[11px]">{item.tender_reference_match}</p>
                </div>

                <div className="bg-gov-50/60 p-3 rounded-lg border border-gov-200">
                  <span className="text-[10px] uppercase font-bold text-gov-800 block mb-0.5">Recommended Procurement Action</span>
                  <p className="text-gov-950 font-medium text-[11px]">{item.action_required}</p>
                </div>
              </div>

              {/* Published Amendments List */}
              {item.amendments.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Published Gazette Amendments ({item.amendments.length})
                  </span>
                  {item.amendments.map((amd, i) => (
                    <div key={i} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200 text-[11px]">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{amd.num}</span>
                        <span className="text-slate-500">• {amd.description}</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[10px]">{amd.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

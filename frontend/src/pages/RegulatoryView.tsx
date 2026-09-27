import React, { useState } from 'react';
import { Scale, Search, ShieldAlert, ExternalLink, Calendar, Building2, CheckCircle2 } from 'lucide-react';
import { RegulatoryRequirement } from '../types';

interface RegulatoryViewProps {
  regulations: RegulatoryRequirement[];
}

export const RegulatoryView: React.FC<RegulatoryViewProps> = ({ regulations }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filtered = regulations.filter(r => {
    if (filterType !== 'All' && r.regulation_type !== filterType) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.title.toLowerCase().includes(q) ||
        (r.applicable_product ? r.applicable_product.toLowerCase().includes(q) : false) ||
        r.applicable_standard.toLowerCase().includes(q) ||
        r.issuing_authority.toLowerCase().includes(q) ||
        (r.qco_number ? r.qco_number.toLowerCase().includes(q) : false);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4 text-rose-700" />
            <span>Statutory Conformity & Quality Control Orders</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">
            Regulatory Intelligence & QCO Database
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central Government Gazette notifications, mandatory conformity orders, and issuing ministry frameworks.
          </p>
        </div>
      </div>

      {/* Critical Guidance Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Important Distinguishing Principle:</strong>
          <span>
            Indian Standards are voluntary consensus specifications by default unless formally notified under a statutory Quality Control Order (QCO) or Technical Regulation by the concerned Administrative Ministry (e.g. DPIIT, MNRE, MeitY, MoS). Always verify the active Gazette notification.
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by QCO number, product, standard, or ministry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-700 focus:bg-white text-slate-900 placeholder-slate-400"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none"
        >
          <option value="All">All Regulation Types</option>
          <option value="Quality Control Order">Quality Control Order (QCO)</option>
          <option value="Technical Regulation">Technical Regulation</option>
          <option value="Government Notification">Government Notification</option>
          <option value="Mandatory Conformity Requirement">Mandatory Conformity Requirement</option>
        </select>
      </div>

      {/* Regulations List */}
      <div className="space-y-4">
        {filtered.map((reg) => (
          <div key={reg.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                    {reg.regulation_type}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Status: {reg.mandatory_status}
                  </span>
                  <span className="text-xs font-mono text-slate-500 font-semibold">
                    {reg.qco_number || reg.notification_number}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 font-serif">{reg.title}</h3>
              </div>

              <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                Effective: {reg.effective_date}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
              {reg.summary}
            </p>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Issuing Authority</span>
                <span className="font-semibold text-slate-900">{reg.issuing_authority}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Applicable Standard(s)</span>
                <span className="font-mono font-bold text-gov-900">{reg.applicable_standard}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Authoritative Gazette Reference</span>
                <span className="text-[11px] text-slate-500 truncate block">{reg.source}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

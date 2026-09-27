import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  RefreshCw, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  User
} from 'lucide-react';
import { GeneratedReport, AnalysisResponse } from '../types';
import { GENERATED_REPORTS_LIST } from '../services/demoData';

interface ReportCenterProps {
  onOpenReport: (reportId: string) => void;
  onOpenGenerateModal: () => void;
  analysis?: AnalysisResponse;
}

export const ReportCenter: React.FC<ReportCenterProps> = ({
  onOpenReport,
  onOpenGenerateModal,
  analysis
}) => {
  const [reports, setReports] = useState<GeneratedReport[]>(GENERATED_REPORTS_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredReports = reports.filter(r => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchQuery && 
        !r.procurement_title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !r.report_id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !r.document_name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handlePrint = (reportId: string) => {
    onOpenReport(reportId);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2 text-gov-800 font-bold text-xs uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4 text-gov-700" />
          <span>Auditable Procurement Dossiers</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-slate-900">
              Procurement Report Center
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Access, compile, download, and audit verified Standards Intelligence & Traceability Reports for tender files.
            </p>
          </div>
          <button
            onClick={onOpenGenerateModal}
            className="px-4 py-2.5 bg-gov-900 hover:bg-gov-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-2"
          >
            <Plus className="w-4 h-4 text-saffron-400" />
            <span>Generate New Report</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Total Generated Reports</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">{reports.length} Reports</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gov-50 text-gov-800 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Technical Reviews Completed</span>
            <div className="text-xl font-bold font-mono text-emerald-700 mt-0.5">3 Dossiers</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Active Specification Dossier</span>
            <div className="text-xs font-bold text-slate-800 truncate max-w-[180px] mt-0.5">
              {analysis?.product_name || "Solar Street Lighting System"}
            </div>
            <span className="text-[10px] text-emerald-600 font-mono font-semibold">
              {analysis?.coverage_indicator || 82}% Coverage
            </span>
          </div>
          <button
            onClick={() => onOpenReport('BS-2026-79950')}
            className="px-2.5 py-1.5 bg-gov-100 hover:bg-gov-200 text-gov-900 rounded-lg text-xs font-semibold transition"
          >
            Open →
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Report ID, procurement title, or document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-700"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-gov-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="Technical Review Required">Technical Review Required</option>
            <option value="Ready">Ready</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-3">Procurement Title & Document</th>
                <th className="py-3 px-3">Generated Date</th>
                <th className="py-3 px-3">Version</th>
                <th className="py-3 px-3">Review Status</th>
                <th className="py-3 px-3">Coverage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredReports.map((r) => (
                <tr key={r.report_id} className="hover:bg-slate-50/80 transition group">
                  <td className="py-3.5 px-4 font-mono font-bold text-gov-950">
                    <div className="flex items-center space-x-1.5">
                      <FileText className="w-4 h-4 text-slate-400 group-hover:text-gov-800" />
                      <span>{r.report_id}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-900">{r.procurement_title}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{r.document_name}</div>
                  </td>

                  <td className="py-3.5 px-3 text-slate-600 font-mono text-[11px]">
                    <div>{r.generated_date}</div>
                    <div className="text-[10px] text-slate-400">{r.generated_by}</div>
                  </td>

                  <td className="py-3.5 px-3 font-mono font-bold text-slate-700">
                    {r.version}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.status === 'Technical Review Required' 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {r.status === 'Technical Review Required' ? (
                        <Clock className="w-3 h-3 text-amber-700" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      )}
                      <span>{r.status}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-mono font-bold text-emerald-700">
                    {r.coverage_score}%
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => onOpenReport(r.report_id)}
                      className="px-2.5 py-1 bg-gov-900 hover:bg-gov-800 text-white rounded text-xs font-semibold shadow-xs transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handlePrint(r.report_id)}
                      className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold shadow-xs transition"
                      title="Download PDF / Print"
                    >
                      Download
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

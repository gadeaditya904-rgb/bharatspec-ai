import React, { useState } from 'react';
import { 
  Database, 
  Settings, 
  RefreshCw, 
  Plus, 
  ShieldCheck, 
  History, 
  Server, 
  CheckCircle2, 
  Layers,
  FileSpreadsheet
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [reindexing, setReindexing] = useState(false);
  const [reindexedSuccess, setReindexedSuccess] = useState(false);

  const handleReindex = () => {
    setReindexing(true);
    setReindexedSuccess(false);
    setTimeout(() => {
      setReindexing(false);
      setReindexedSuccess(true);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2 text-gov-800 font-bold text-xs uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4 text-gov-700" />
          <span>System Administration & Knowledge Base Governance</span>
        </div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">
          Knowledge Base Management & Admin Controls
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage standards metadata, sync Gazette QCO records, trigger semantic vector indexing, and inspect platform health.
        </p>
      </div>

      {/* KB Version & Health Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Active Production Knowledge Base
            </span>
            <h3 className="text-lg font-bold font-serif text-slate-900 mt-1">
              BharatSpec Knowledge Base Version 2.6
            </h3>
            <p className="text-xs text-slate-500">
              Last Full Re-index: 25 Sep 2026, 11:30 PM IST • Source: BIS Official Portal & Gazette of India
            </p>
          </div>

          <button
            onClick={handleReindex}
            disabled={reindexing}
            className="px-4 py-2 bg-gov-800 hover:bg-gov-900 text-white font-semibold text-xs rounded-lg transition shadow-sm flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reindexing ? 'animate-spin' : ''}`} />
            <span>{reindexing ? 'Re-Indexing Vectors...' : 'Trigger Semantic Re-Index'}</span>
          </button>
        </div>

        {reindexedSuccess && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Semantic vector embeddings successfully recalculated for 2,450 standards and 320 regulatory records.</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Total Standards</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">2,450</div>
            <span className="text-[10px] text-slate-400">10 Technical Domains</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Gazette QCOs</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">320</div>
            <span className="text-[10px] text-slate-400">DPIIT, MNRE, MeitY, MoS</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Vector Dimension</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">768-D</div>
            <span className="text-[10px] text-slate-400">Dense Semantic Index</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Data Integrity</span>
            <div className="text-xl font-bold font-mono text-emerald-600 mt-0.5">99.8%</div>
            <span className="text-[10px] text-slate-400">0 Broken References</span>
          </div>
        </div>
      </div>

      {/* Admin Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Standards Management */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-sm text-slate-900 flex items-center space-x-2">
              <Database className="w-4 h-4 text-gov-700" />
              <span>Standards Catalogue Ingestion</span>
            </h4>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
              ETD / LITD / MED
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Import new Bureau of Indian Standards specifications, amendments, and revisions into the relational schema.
          </p>
          <div className="pt-2 flex space-x-2">
            <button className="px-3 py-1.5 bg-gov-50 hover:bg-gov-100 text-gov-800 border border-gov-300 rounded text-xs font-semibold flex items-center space-x-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Standard</span>
            </button>
            <button className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold flex items-center space-x-1">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Bulk CSV Ingest</span>
            </button>
          </div>
        </div>

        {/* Regulatory & QCO Management */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-sm text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-rose-700" />
              <span>Quality Control Order Mapping</span>
            </h4>
            <span className="text-[10px] bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded font-semibold">
              Statutory
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Link newly published Central Ministry Gazette notifications and QCO numbers to corresponding Indian Standards.
          </p>
          <div className="pt-2 flex space-x-2">
            <button className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 rounded text-xs font-semibold flex items-center space-x-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Register New QCO</span>
            </button>
            <button className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold">
              <span>View Gazette Audit Log</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  FileText, 
  CheckSquare, 
  Square, 
  CheckCircle2, 
  Download, 
  Printer, 
  ExternalLink, 
  X, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { AnalysisResponse, GeneratedReport, MultiProcurementSession } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisResponse;
  multiSession?: MultiProcurementSession | null;
  onViewReport: (reportId: string, isConsolidated?: boolean) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  analysis,
  multiSession,
  onViewReport
}) => {
  const [reportType, setReportType] = useState<'single' | 'consolidated'>('single');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [reportId, setReportId] = useState('BS-2026-79950');

  const generationSteps = [
    "Requirements processed",
    "Standards recommendations compiled",
    "Related standards mapped",
    "Version information compiled",
    "Certification review compiled",
    "Traceability generated",
    "Human review decisions included"
  ];

  const defaultSections = [
    { id: 'exec', label: 'Executive Summary', checked: true },
    { id: 'details', label: 'Procurement Document Details', checked: true },
    { id: 'reqs', label: 'Extracted Requirements', checked: true },
    { id: 'recs', label: 'Recommended Indian Standards', checked: true },
    { id: 'why', label: 'Why Standards Were Recommended', checked: true },
    { id: 'related', label: 'Related Standards (Normative, Safety, Test)', checked: true },
    { id: 'versions', label: 'Version & Amendment Status', checked: true },
    { id: 'qco', label: 'Certification & QCO Review', checked: true },
    { id: 'trace', label: 'Requirement-to-Standard Traceability', checked: true },
    { id: 'gaps', label: 'Specification Gaps & Ambiguities', checked: true },
    { id: 'evidence', label: 'Evidence Checklist', checked: true },
    { id: 'review', label: 'Human Review Decisions & Notes', checked: true },
    { id: 'audit', label: 'Audit Trail & Compliance Log', checked: true },
    { id: 'sources', label: 'Sources & Verification Status', checked: true },
  ];

  const [sections, setSections] = useState(defaultSections);
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi' | 'mr'>('en');

  if (!isOpen) return null;

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationStep(0);

    const stepInterval = setInterval(() => {
      setGenerationStep(prev => {
        if (prev < generationSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setTimeout(() => {
            setIsGenerating(false);
            setIsReady(true);
            const rep = reportType === 'consolidated' 
              ? (multiSession?.session_id || 'PKG-2026-00010X') 
              : (analysis.analysis_id || 'BS-2026-79950');
            setReportId(rep);
          }, 300);
          return prev;
        }
      });
    }, 200);
  };

  const handleDownloadPDF = () => {
    onViewReport(reportId, reportType === 'consolidated');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `BharatSpec_Report_${reportId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="bg-gov-950 px-6 py-4 text-white flex items-center justify-between border-b border-gov-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gov-800 flex items-center justify-center text-saffron-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif">
                {isReady ? 'Report Generated & Ready' : 'Generate Procurement Intelligence Report'}
              </h3>
              <p className="text-xs text-slate-300">
                {analysis.product_name} • Coverage: {analysis.coverage_indicator}%
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-gov-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {isGenerating ? (
            <div className="space-y-6 py-4 animate-in fade-in">
              <div className="text-center">
                <Loader2 className="w-10 h-10 text-gov-800 animate-spin mx-auto mb-3" />
                <h4 className="text-base font-bold font-serif text-slate-900">
                  Generating Procurement Intelligence Report...
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Compiling verified standards, regulatory clauses, and reviewer decisions
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5 max-w-md mx-auto text-xs">
                {generationSteps.map((step, idx) => {
                  const isDone = idx < generationStep;
                  const isCurrent = idx === generationStep;
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-center space-x-2.5 transition-all ${
                        isDone ? 'text-emerald-800 font-medium' : isCurrent ? 'text-gov-900 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-gov-700 animate-spin flex-shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
                      )}
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : !isReady ? (
            <div className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Select the modular intelligence sections to include in the official procurement standards dossier. The generated document reflects live technical reviewer notes and accepted mappings.
                </p>
              </div>

              {/* Report Scope Selector (Single Item vs Consolidated Package) */}
              {multiSession && multiSession.items && multiSession.items.length > 1 && (
                <div className="p-3.5 bg-gov-50/70 border border-gov-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold text-gov-900 tracking-wider">
                      Report Scope & Dossier Coverage
                    </label>
                    <span className="text-[10px] font-mono font-bold text-gov-700">
                      Package: {multiSession.total_items} Items
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setReportType('single')}
                      className={`p-2.5 rounded-lg border text-left text-xs transition ${
                        reportType === 'single'
                          ? 'bg-white border-gov-800 shadow-xs ring-1 ring-gov-800'
                          : 'bg-transparent border-slate-200 hover:bg-white text-slate-600'
                      }`}
                    >
                      <div className="font-bold text-slate-900 truncate">1. Single Item Report</div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">Active: {analysis.product_name}</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReportType('consolidated')}
                      className={`p-2.5 rounded-lg border text-left text-xs transition ${
                        reportType === 'consolidated'
                          ? 'bg-white border-gov-800 shadow-xs ring-1 ring-gov-800'
                          : 'bg-transparent border-slate-200 hover:bg-white text-slate-600'
                      }`}
                    >
                      <div className="font-bold text-slate-900 flex items-center space-x-1">
                        <span>2. Consolidated Dossier</span>
                        <span className="px-1.5 py-0.2 bg-saffron-100 text-saffron-900 text-[9px] rounded font-bold">Recommended</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">All {multiSession.total_items} Identified Items Package</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Report Language Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                  Report Language / भाषा
                </label>
                <div className="flex items-center space-x-2">
                  {[
                    { id: 'en', label: 'English (Official)' },
                    { id: 'hi', label: 'हिन्दी (Hindi)' },
                    { id: 'mr', label: 'मराठी (Marathi)' }
                  ].map(l => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setSelectedLang(l.id as any)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                        selectedLang === l.id 
                          ? 'bg-gov-800 text-white border-gov-800' 
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Standard numbers (IS 13252, etc.), test thresholds, and numerical metrics are strictly preserved.
                </p>
              </div>

              {/* Sections Checklist */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  Report Dossier Sections
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {sections.map(sec => (
                    <div 
                      key={sec.id}
                      onClick={() => toggleSection(sec.id)}
                      className={`flex items-center space-x-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition select-none ${
                        sec.checked 
                          ? 'bg-gov-50/60 border-gov-300 text-gov-950 font-semibold' 
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {sec.checked ? (
                        <CheckSquare className="w-4 h-4 text-gov-800 flex-shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                      <span className="truncate">{sec.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata note */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Knowledge Base: {analysis.knowledge_base_version}</span>
                <span>Format: Official Formatted Dossier</span>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="px-5 py-2.5 bg-gov-900 hover:bg-gov-800 text-white rounded-lg text-xs font-bold shadow-md transition flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-saffron-400" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>
          ) : (
            /* Report Ready State */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  REPORT READY
                </span>
                <h4 className="text-xl font-bold font-serif text-slate-900 mt-2">
                  Procurement Intelligence Report
                </h4>
                <div className="flex items-center justify-center space-x-3 mt-1 text-xs text-slate-500 font-mono">
                  <span>Report ID: <strong className="text-slate-800">{reportId}</strong></span>
                  <span>•</span>
                  <span>Generated: 26 Sep 2026</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-1.5 max-w-md mx-auto">
                <div className="flex justify-between text-slate-600">
                  <span>Specification:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[200px]">{analysis.product_name}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Coverage Indicator:</span>
                  <span className="font-bold text-emerald-700">{analysis.coverage_indicator}% Specification Coverage</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Sections Compiled:</span>
                  <span className="font-medium text-slate-800">{sections.filter(s => s.checked).length} of 10</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onViewReport(reportId, reportType === 'consolidated');
                    onClose();
                  }}
                  className="px-5 py-2.5 bg-gov-900 hover:bg-gov-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4 text-saffron-400" />
                  <span>View Report</span>
                </button>

                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold shadow-sm transition flex items-center space-x-2"
                >
                  <Download className="w-4 h-4 text-gov-700" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold shadow-sm transition flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

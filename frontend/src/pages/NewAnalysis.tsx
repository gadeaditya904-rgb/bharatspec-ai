import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  FileUp, 
  Check, 
  Sparkles, 
  AlertCircle, 
  ArrowRight,
  ClipboardPaste,
  ShieldAlert,
  Sliders,
  FolderOpen
} from 'lucide-react';
import { DemoSpecification } from '../types';
import { api } from '../services/api';

interface NewAnalysisProps {
  onStartAnalysis: (text: string, filename: string) => void;
  demoSpecs: DemoSpecification[];
}

export const NewAnalysis: React.FC<NewAnalysisProps> = ({
  onStartAnalysis,
  demoSpecs
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [specificationText, setSpecificationText] = useState('');
  const [selectedDemoId, setSelectedDemoId] = useState<string>('demo-solar-001');
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleSelectDemo = (demo: DemoSpecification) => {
    setSelectedDemoId(demo.id);
    setSpecificationText(demo.text);
    setUploadedFileName(demo.filename);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      try {
        const { text } = await api.extractDocumentText(file);
        setSpecificationText(text || demoSpecs[0].text);
      } catch (err) {
        console.warn("Extraction failed", err);
        setSpecificationText(demoSpecs[0].text);
      }
    }
  };

  const handleSubmit = () => {
    const textToAnalyze = specificationText.trim() || 
      (demoSpecs.find(d => d.id === selectedDemoId)?.text || demoSpecs[0].text);
    const fname = uploadedFileName || 
      (demoSpecs.find(d => d.id === selectedDemoId)?.filename || "Procurement_Spec.docx");
    
    onStartAnalysis(textToAnalyze, fname);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2 text-gov-800 font-bold text-xs uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-saffron-500" />
          <span>Procurement Intelligence Engine</span>
        </div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">
          Analyze Procurement Specification
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Upload a procurement document or enter the specification manually to identify potentially applicable Indian Standards and review requirements.
        </p>
      </div>

      {/* Main Analysis Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toggle Mode: Upload vs Paste */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center space-x-2 border-b-2 transition ${
              activeTab === 'upload'
                ? 'border-gov-800 text-gov-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document (PDF, DOCX, TXT)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('paste');
              if (!specificationText) {
                setSpecificationText(demoSpecs[0].text);
              }
            }}
            className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center space-x-2 border-b-2 transition ${
              activeTab === 'paste'
                ? 'border-gov-800 text-gov-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ClipboardPaste className="w-4 h-4" />
            <span>Paste Specification Text</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {activeTab === 'upload' ? (
            <div>
              {/* Drag and Drop Box */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    setUploadedFileName(file.name);
                    api.extractDocumentText(file).then(({ text }) => {
                      setSpecificationText(text || demoSpecs[0].text);
                    }).catch(() => {
                      setSpecificationText(demoSpecs[0].text);
                    });
                  }
                }}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragOver 
                    ? 'border-gov-700 bg-gov-50/60' 
                    : uploadedFileName 
                      ? 'border-emerald-400 bg-emerald-50/30' 
                      : 'border-slate-300 hover:border-gov-600 bg-slate-50/50'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gov-100 flex items-center justify-center mx-auto text-gov-800 mb-3">
                  <FileUp className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-slate-800">
                  {uploadedFileName ? `Selected: ${uploadedFileName}` : 'Drag & Drop Procurement Document'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Supports technical tender documents, NIT schedules, and specification annexures in PDF, DOCX, or plain text.
                </p>

                <div className="mt-4 flex items-center justify-center space-x-3">
                  <label className="cursor-pointer px-4 py-2 bg-gov-800 hover:bg-gov-900 text-white rounded-lg text-xs font-semibold transition shadow-sm">
                    Browse Files
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSelectDemo(demoSpecs[0])}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition border border-slate-300"
                  >
                    Load Sample Document
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Procurement Specification Text
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  {specificationText.length} characters
                </span>
              </div>
              <textarea
                rows={12}
                value={specificationText}
                onChange={(e) => setSpecificationText(e.target.value)}
                placeholder="Paste the technical specification, parameters, standards referenced, testing clauses, or bill of materials here..."
                className="w-full p-4 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-700 focus:bg-white text-slate-900 leading-relaxed"
              />
            </div>
          )}

          {/* Quick Pre-Configured Specifications */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Pre-Configured Enterprise Specifications
                </h4>
                <p className="text-[11px] text-slate-500">
                  Select an authoritative procurement document to test cross-domain intelligence
                </p>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">
                Verified Presets
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {demoSpecs.map((demo) => {
                const isSelected = selectedDemoId === demo.id;
                return (
                  <div
                    key={demo.id}
                    onClick={() => handleSelectDemo(demo)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-gov-800 bg-gov-50/70 ring-1 ring-gov-700 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-gov-800">
                          {demo.category.split('&')[0]}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-gov-800" />}
                      </div>
                      <h5 className="font-semibold text-xs text-slate-900 mt-1 line-clamp-1">
                        {demo.product_name}
                      </h5>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-2 flex justify-between pt-1 border-t border-slate-100">
                      <span>{demo.stats.requirements} Reqs</span>
                      <span className="font-semibold text-emerald-700">{demo.stats.coverage_indicator}% Coverage</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-start space-x-2 text-xs text-slate-600">
              <ShieldAlert className="w-4 h-4 text-gov-700 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-900">Decision-Support Workflow Notice:</span>
                <p className="text-[11px] text-slate-500">
                  Outputs indicate potentially applicable Indian Standards and regulatory reviews. Authoritative confirmation requires human evaluator verification.
                </p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto px-6 py-2.5 bg-gov-900 hover:bg-gov-800 text-white font-bold text-xs rounded-lg transition-all shadow-md flex items-center justify-center space-x-2 flex-shrink-0"
            >
              <span>Execute Standards Analysis</span>
              <ArrowRight className="w-4 h-4 text-saffron-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

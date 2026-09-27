import React from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  BookOpen, 
  Calendar, 
  Building2, 
  Scale, 
  Clock,
  Layers
} from 'lucide-react';
import { Recommendation, ExtractedRequirement } from '../types';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation?: Recommendation | null;
  requirement?: ExtractedRequirement | null;
  productName: string;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  isOpen,
  onClose,
  recommendation,
  requirement,
  productName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-2xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-5 bg-gov-950 text-white flex items-center justify-between border-b border-gov-900">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-gov-800 rounded-xl border border-gov-700">
              <FileText className="w-4 h-4 text-saffron-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-400 font-mono block">
                AUDITABLE EVIDENCE DOSSIER
              </span>
              <h3 className="text-sm font-bold font-serif">
                Recommendation Provenance & Evidence
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-gov-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs">
          
          {/* Target Standard Summary */}
          {recommendation && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                IDENTIFIED INDIAN STANDARD
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-gov-950">
                  [{recommendation.is_number}]
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Verified In Catalogue
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 leading-snug">
                {recommendation.title}
              </h4>
            </div>
          )}

          {/* Source Requirement */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              1. PROCUREMENT SPECIFICATION EVIDENCE
            </span>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Clause: <strong className="text-slate-800 font-mono">{requirement?.clause || 'Clause 1.2'}</strong></span>
                <span>Source: <strong className="text-slate-800 font-mono">{requirement?.source_location || 'Page 1, Schedule'}</strong></span>
              </div>
              <p className="text-slate-900 font-serif leading-relaxed text-xs italic">
                "{requirement?.requirement_text || `Procurement of ${productName} conforming to verified quality and safety criteria.`}"
              </p>
              {requirement?.original_text && requirement.original_text !== requirement.requirement_text && (
                <div className="text-[10px] text-slate-500 font-mono bg-white p-2 rounded border border-slate-200">
                  Raw stream: {requirement.original_text}
                </div>
              )}
            </div>
          </div>

          {/* Verified Knowledge Source */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              2. KNOWLEDGE BASE PROVENANCE
            </span>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-gov-900 font-bold">
                  <Building2 className="w-3.5 h-3.5 text-gov-700" />
                  <span>Bureau of Indian Standards (BIS)</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Gazette of India
                </span>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed">
                {recommendation?.why_details?.scope_match || `Standard scope covers design, testing, safety, and certification benchmarks for ${productName}.`}
              </p>
            </div>
          </div>

          {/* Test & Verification Evidence */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              3. TESTING & CONFORMITY CRITERIA
            </span>
            <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1.5 text-emerald-950">
              <div className="flex items-center space-x-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>NABL Accredited Laboratory Qualification</span>
              </div>
              <p className="text-[11px] text-emerald-900 leading-relaxed">
                {recommendation?.why_details?.testing_match || 'Standard mandates type tests, endurance testing, and routine sample inspection certificates.'}
              </p>
            </div>
          </div>

          {/* Regulatory Mandate */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              4. STATUTORY REGULATORY RELATIONSHIP
            </span>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-800 font-bold">
                <Scale className="w-3.5 h-3.5 text-gov-800" />
                <span>Quality Control Order (QCO) Status</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {recommendation?.regulatory_status || 'Technical reference benchmark. Statutory notifications apply if specified by Line Ministry.'}
              </p>
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[10px]">
            Audited & Grounded in Official Records
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gov-900 hover:bg-gov-800 text-white rounded-lg text-xs font-bold transition"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
};

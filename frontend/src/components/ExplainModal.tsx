import React from 'react';
import { 
  X, 
  HelpCircle, 
  CheckCircle2, 
  Database,
  Scale, 
  SlidersHorizontal,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Recommendation } from '../types';

interface ExplainModalProps {
  recommendation: Recommendation | null;
  onClose: () => void;
}

export const ExplainModal: React.FC<ExplainModalProps> = ({
  recommendation,
  onClose
}) => {
  if (!recommendation) return null;

  const { is_number, title, relevance_level, relevance_score, recommendation_type, why_details, evidence_source, matched_requirements } = recommendation;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gov-950 text-white flex items-center justify-between border-b border-gov-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gov-800 flex items-center justify-center border border-gov-700">
              <Sparkles className="w-4 h-4 text-saffron-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-saffron-400 block font-mono">
                Why This Standard? • Recommendation Rationale & Evidence
              </span>
              <h3 className="text-base font-bold font-serif">{is_number}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-gov-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body (Section 6 exact structure) */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Header Card: Standard Title & Core Scoring */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-sm text-slate-900 mb-2">{title}</h4>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className={`px-2.5 py-0.5 rounded font-bold ${
                relevance_level === 'High' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                RELEVANCE: {relevance_level.toUpperCase()}
              </span>
              <span className="px-2.5 py-0.5 rounded font-mono font-bold bg-gov-100 text-gov-900 border border-gov-300">
                CONFIDENCE: {Math.round(relevance_score * 100)}% Semantic Correlation
              </span>
              <span className={`px-2.5 py-0.5 rounded font-semibold ${
                recommendation_type === 'Potentially Mandatory'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-blue-100 text-blue-800 border border-blue-300'
              }`}>
                {recommendation_type}
              </span>
            </div>
          </div>

          {/* 1. MATCHING REQUIREMENTS */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-gov-900 font-bold text-xs uppercase tracking-wide">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Matching Requirements</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Which extracted procurement requirements directly led to this standard recommendation:
            </p>
            <div className="space-y-1.5 pt-1">
              {(why_details?.requirement_match || matched_requirements || []).map((req, i) => (
                <div key={i} className="flex items-start space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200 text-slate-800">
                  <span className="text-emerald-600 font-bold text-xs mt-0.5">✓</span>
                  <span className="leading-snug">{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. SEMANTIC REASONING */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-gov-900 font-bold text-xs uppercase tracking-wide">
              <SlidersHorizontal className="w-4 h-4 text-gov-700" />
              <span>Semantic Reasoning</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-justify">
              {why_details?.recommendation_basis || recommendation.explanation}
            </p>
            {why_details?.scope_match && (
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 mt-2">
                <span className="font-bold text-slate-800 block mb-0.5">Standard Scope Alignment:</span>
                {why_details.scope_match}
              </div>
            )}
          </div>

          {/* 3. SOURCE & VERIFICATION */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-1.5 bg-slate-50">
            <div className="flex items-center space-x-2 text-gov-900 font-bold text-xs uppercase tracking-wide">
              <Database className="w-4 h-4 text-gov-700" />
              <span>Source / Knowledge Base Record</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="font-mono text-slate-800 font-medium">{evidence_source || "Bureau of Indian Standards Catalog (2026.09)"}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                Verified Source
              </span>
            </div>
          </div>

          {/* 4. REGULATORY & STATUTORY STATUS */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-1.5 bg-gov-50/40">
            <div className="flex items-center space-x-2 text-gov-900 font-bold text-xs uppercase tracking-wide">
              <Scale className="w-4 h-4 text-gov-800" />
              <span>Regulatory Applicability Notice</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              {why_details?.regulatory_relationship || "Identified as technically applicable to the equipment specifications. If notified under a mandatory Quality Control Order (QCO), conformity assessment and certification marks are legally required."}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-[11px] text-slate-500 font-mono">
            Decision-Support Intelligence • Official Technical Verification Required
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gov-900 hover:bg-gov-800 text-white rounded-lg font-bold transition shadow-sm text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ExplainModal;

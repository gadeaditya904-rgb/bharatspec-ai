import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Check, 
  XCircle, 
  HelpCircle, 
  MessageSquare, 
  Award, 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  Building2,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { ExtractedRequirement, Recommendation } from '../types';

interface ClauseDrilldownModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: ExtractedRequirement | null;
  recommendation?: Recommendation | null;
  onSaveDecision?: (reqId: string, decision: 'Accepted' | 'Edited' | 'Rejected', note?: string) => void;
}

export const ClauseDrilldownModal: React.FC<ClauseDrilldownModalProps> = ({
  isOpen,
  onClose,
  requirement,
  recommendation,
  onSaveDecision
}) => {
  const [currentDecision, setCurrentDecision] = useState<'Accepted' | 'Edited' | 'Rejected'>(
    (requirement?.decision as any) || 'Accepted'
  );
  const [noteText, setNoteText] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);

  if (!isOpen || !requirement) return null;

  const handleDecision = (decision: 'Accepted' | 'Edited' | 'Rejected') => {
    setCurrentDecision(decision);
    if (onSaveDecision) {
      onSaveDecision(requirement.id, decision, noteText);
    }
  };

  const handleSaveNote = () => {
    setIsEditingNote(false);
    if (onSaveDecision) {
      onSaveDecision(requirement.id, currentDecision, noteText);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-2xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col justify-between max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-gov-950 text-white flex items-center justify-between border-b border-gov-900">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-gov-800 rounded-xl border border-gov-700">
              <FileText className="w-4 h-4 text-saffron-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-400 font-mono block">
                CLAUSE-LEVEL TRACEABILITY INSPECTOR
              </span>
              <h3 className="text-base font-bold font-serif">
                {requirement.clause || 'Clause Details'} • {requirement.parameter}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-gov-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Source Location Coordinates */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500">Source Location:</span>
            <span className="px-2 py-0.5 bg-white rounded font-mono font-bold text-gov-900 border border-slate-200">
              {requirement.source_location || (requirement.page_number ? `Page ${requirement.page_number}` : 'Tender Schedule')}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] uppercase font-bold text-slate-500">Method:</span>
            <span className="px-2 py-0.5 bg-white rounded font-sans text-slate-700 border border-slate-200">
              {requirement.extraction_method || 'Native PDF Text'}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] uppercase font-bold text-slate-500">Category:</span>
            <span className="px-2 py-0.5 bg-gov-100 rounded font-semibold text-gov-900">
              {requirement.category}
            </span>
          </div>

          {/* Original Specification Text */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              ORIGINAL SPECIFICATION CLAUSE
            </span>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <p className="text-slate-900 font-serif leading-relaxed text-sm">
                "{requirement.requirement_text}"
              </p>
              {requirement.original_text && requirement.original_text !== requirement.requirement_text && (
                <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200">
                  Raw stream: {requirement.original_text}
                </div>
              )}
            </div>
          </div>

          {/* Normalized Technical Parameter */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">PARAMETER</span>
              <strong className="text-xs text-slate-900 font-bold">{requirement.parameter}</strong>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">EXTRACTED VALUE</span>
              <strong className="text-xs text-gov-950 font-mono font-bold">{requirement.value}</strong>
            </div>
          </div>

          {/* Mapped Indian Standard */}
          {recommendation && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                MAPPED INDIAN STANDARD BENCHMARK
              </span>
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-gov-950">
                    [{recommendation.is_number}]
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Verified Match
                  </span>
                </div>
                <p className="text-xs text-emerald-950 font-bold">
                  {recommendation.title}
                </p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-emerald-100 leading-relaxed">
                  <strong>Rationale:</strong> {recommendation.explanation}
                </div>
              </div>
            </div>
          )}

          {/* Human Review Decision Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                EVALUATOR DECISION & VERIFICATION
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Active Decision: <strong className="text-slate-800">{currentDecision}</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDecision('Accepted')}
                className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                  currentDecision === 'Accepted'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept Clause</span>
              </button>

              <button
                type="button"
                onClick={() => handleDecision('Edited')}
                className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                  currentDecision === 'Edited'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Request Verification</span>
              </button>

              <button
                type="button"
                onClick={() => handleDecision('Rejected')}
                className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                  currentDecision === 'Rejected'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject Clause</span>
              </button>
            </div>

            {/* Note Area */}
            <div className="pt-2">
              {isEditingNote ? (
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Enter technical comments or audit remarks..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-700 focus:outline-none"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setIsEditingNote(false)}
                      className="px-2.5 py-1 text-slate-600 text-xs font-semibold hover:bg-slate-100 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNote}
                      className="px-3 py-1 bg-gov-900 text-white text-xs font-bold rounded"
                    >
                      Save Remark
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingNote(true)}
                  className="text-xs text-gov-800 hover:text-gov-950 font-semibold flex items-center space-x-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{noteText ? `Remark: "${noteText}" (Edit)` : '+ Add Technical Audit Remark'}</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-[10px] text-slate-400 font-mono">
            Recorded in Dossier Audit Trail
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gov-900 hover:bg-gov-800 text-white rounded-lg text-xs font-bold transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

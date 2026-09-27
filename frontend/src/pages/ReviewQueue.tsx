import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  MessageSquare, 
  Clock, 
  Filter, 
  Search, 
  ArrowRight,
  ShieldAlert,
  Save,
  Check,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  FileCheck2,
  AlertCircle,
  Building2,
  Lock
} from 'lucide-react';
import { ReviewItem, UserProfile, AuthorityDecision } from '../types';
import { REVIEW_QUEUE_ITEMS } from '../services/demoData';

interface ReviewQueueProps {
  currentUser: UserProfile;
  onOpenAnalysisTab: (tab: string) => void;
  onAuthorityDecisionRecorded?: (decision: AuthorityDecision) => void;
}

export const ReviewQueue: React.FC<ReviewQueueProps> = ({
  currentUser,
  onOpenAnalysisTab,
  onAuthorityDecisionRecorded
}) => {
  const [items, setItems] = useState<ReviewItem[]>(REVIEW_QUEUE_ITEMS);
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [reviewerNote, setReviewerNote] = useState('');

  // Authority Approval Gate State
  const [authorityDecision, setAuthorityDecision] = useState<'APPROVED' | 'RETURNED' | 'ADDITIONAL_REVIEW_REQUIRED'>('APPROVED');
  const [authorityRemarks, setAuthorityRemarks] = useState(
    "Technical parameters and recommended Indian Standards verified per Delegation of Financial Powers and Procurement Manual rules."
  );
  const [isDecisionRecorded, setIsDecisionRecorded] = useState(false);
  const [recordedDecisionDetails, setRecordedDecisionDetails] = useState<AuthorityDecision | null>(null);

  const isAuthority = currentUser.role === 'competent_authority' || currentUser.role === 'system_administrator';

  const handleReviewAction = (
    id: string, 
    newStatus: 'Accepted' | 'Review' | 'Rejected', 
    noteText?: string
  ) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { 
          ...item, 
          status: newStatus,
          reviewer_note: noteText || reviewerNote || item.reviewer_note 
        };
      }
      return item;
    }));
    setActiveReviewId(null);
    setReviewerNote('');
  };

  const handleRecordAuthorityDecision = () => {
    const decisionObj: AuthorityDecision = {
      decision: authorityDecision,
      officer_name: currentUser.name,
      role: currentUser.role_display,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      remarks: authorityRemarks,
      record_id: 'PROC-2026-000092'
    };
    setRecordedDecisionDetails(decisionObj);
    setIsDecisionRecorded(true);
    if (onAuthorityDecisionRecorded) {
      onAuthorityDecisionRecorded(decisionObj);
    }
  };

  const filteredItems = items.filter(item => {
    if (priorityFilter !== 'ALL' && item.priority !== priorityFilter) return false;
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    return true;
  });

  const pendingCount = items.filter(i => i.status === 'Pending').length;
  const resolvedCount = items.filter(i => i.status !== 'Pending').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2 text-gov-800 font-bold text-xs uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4 text-gov-700" />
          <span>Technical Review & Governance Queue</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-slate-900">
              Procurement Review & Verification Queue
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review flagged items requiring human evaluation: standard editions, unmapped clauses, specification ambiguities, and competent authority approval.
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold font-mono">
              {pendingCount} Pending Review
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono">
              {resolvedCount} Decisions Recorded
            </span>
          </div>
        </div>
      </div>

      {/* Competent Authority Review & Sanction Card (Section 4 & 21) */}
      {isAuthority && (
        <div className="bg-gradient-to-r from-gov-950 to-slate-900 text-white p-5 rounded-2xl shadow-md border border-gov-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gov-800 flex items-center justify-center text-saffron-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-400">
                  Competent Authority Review & Sanction Gate
                </span>
                <h3 className="text-base font-bold font-serif text-white">
                  Final Procurement Standards Sanction (PROC-2026-000092)
                </h3>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-gov-800 text-slate-300 rounded border border-gov-700">
              Delegation SoPP Level-1
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-gov-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Executive Sanction Decision:
              </label>
              <select
                value={authorityDecision}
                onChange={(e) => setAuthorityDecision(e.target.value as any)}
                className="w-full p-2 rounded-lg bg-gov-900 border border-gov-700 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-saffron-400"
              >
                <option value="APPROVED">APPROVE Specification & Standards Alignment</option>
                <option value="RETURNED">RETURN for Technical Correction</option>
                <option value="ADDITIONAL_REVIEW_REQUIRED">Request Additional Committee Review</option>
              </select>

              <div className="mt-2 text-[11px] text-slate-400">
                Authorized Officer: <strong>{currentUser.name}</strong> ({currentUser.role_display})
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Authority Remarks & Decision Audit Log:
              </label>
              <textarea
                rows={2}
                value={authorityRemarks}
                onChange={(e) => setAuthorityRemarks(e.target.value)}
                placeholder="Enter mandatory approval remarks..."
                className="w-full p-2 rounded-lg bg-gov-900 border border-gov-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-saffron-400"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gov-800/60 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Immutable record will be logged with timestamp and officer designation.
            </span>
            <button
              type="button"
              onClick={handleRecordAuthorityDecision}
              className="px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-2 shadow-xs transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Record & Log Executive Decision</span>
            </button>
          </div>

          {isDecisionRecorded && recordedDecisionDetails && (
            <div className="mt-3 p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  Decision <strong>{recordedDecisionDetails.decision}</strong> recorded by {recordedDecisionDetails.officer_name} at {recordedDecisionDetails.timestamp}.
                </span>
              </div>
              <span className="font-mono text-[10px] text-emerald-300">Logged to Audit Trail</span>
            </div>
          )}
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-gov-700"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH PRIORITY">High Priority</option>
            <option value="MEDIUM PRIORITY">Medium Priority</option>
            <option value="LOW PRIORITY">Low Priority</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-gov-700"
          >
            <option value="ALL">All Categories</option>
            <option value="Outdated Standard">Outdated Standard</option>
            <option value="Unmapped Requirement">Unmapped Requirement</option>
            <option value="Potential Conflict">Potential Conflict</option>
            <option value="Certification Review">Certification Review</option>
            <option value="Ambiguous Specification">Ambiguous Specification</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-gov-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Accepted">Accepted</option>
            <option value="Review">Verification Required</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button
          onClick={() => { setPriorityFilter('ALL'); setCategoryFilter('ALL'); setStatusFilter('ALL'); }}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Review Queue Items */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-base font-bold font-serif text-slate-900">No items currently require review</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              All identified standards, requirements, and compliance parameters have been verified by technical officers.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isHigh = item.priority === 'HIGH PRIORITY';
            const isMedium = item.priority === 'MEDIUM PRIORITY';
            const isPending = item.status === 'Pending';
            const isAccepted = item.status === 'Accepted';
            const isReview = item.status === 'Review';
            const isRejected = item.status === 'Rejected';

            return (
              <div 
                key={item.id} 
                className={`bg-white rounded-xl border p-5 transition shadow-xs ${
                  isPending 
                    ? isHigh ? 'border-amber-300 bg-amber-50/10' : 'border-slate-200' 
                    : 'border-slate-200 bg-slate-50/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isHigh ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        isMedium ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {item.priority}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        ID: {item.id}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isAccepted && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ACCEPTED</span>
                      </span>
                    )}
                    {isReview && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-100 text-amber-800 font-bold text-xs">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>VERIFICATION REQ.</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-rose-100 text-rose-800 font-bold text-xs">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>REJECTED</span>
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-bold text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>PENDING REVIEW</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Related Metadata */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {item.related_standard && (
                    <div className="flex items-center space-x-1.5 text-slate-600">
                      <span className="text-slate-400 font-medium">Standard Reference:</span>
                      <strong className="text-gov-900 font-mono">{item.related_standard}</strong>
                    </div>
                  )}
                  {item.related_requirement && (
                    <div className="flex items-center space-x-1.5 text-slate-600">
                      <span className="text-slate-400 font-medium">Specification Clause:</span>
                      <strong className="text-slate-800">{item.related_requirement}</strong>
                    </div>
                  )}
                </div>

                {/* Reviewer Note if present */}
                {item.reviewer_note && (
                  <div className="mt-3 p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                      Reviewer Technical Note:
                    </span>
                    <span>{item.reviewer_note}</span>
                  </div>
                )}

                {/* Reviewer Action Buttons (Section 21) */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-500">
                    Reviewing as: <strong>{currentUser.name}</strong> ({currentUser.role_display})
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleReviewAction(item.id, 'Accepted', 'Verified compliant against technical parameters and Gazette notification.')}
                      className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs"
                    >
                      <Check className="w-3 h-3" />
                      <span>Accept</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReviewAction(item.id, 'Review', 'Marked for additional technical verification by domain committee.')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>Request Verification</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReviewAction(item.id, 'Rejected', 'Rejected by technical review committee.')}
                      className="px-3 py-1.5 bg-rose-800 hover:bg-rose-900 text-white rounded text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs"
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

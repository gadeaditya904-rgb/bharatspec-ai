import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  Circle, 
  FileText, 
  Lock, 
  Unlock, 
  ChevronRight, 
  RefreshCw, 
  Cpu, 
  Award, 
  ShieldCheck, 
  UserCheck, 
  Layers, 
  ExternalLink,
  Info
} from 'lucide-react';
import { AnalysisResponse, WorkflowStage, WorkflowStageId } from '../types';
import { api } from '../services/api';

interface AnalysisProgressProps {
  analysis: AnalysisResponse;
  onNavigateStage: (stageId: WorkflowStageId, tabId?: string) => void;
  onRefresh?: () => void;
  onOpenReport?: () => void;
  onAnalysisUpdated?: (updated: AnalysisResponse) => void;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  analysis,
  onNavigateStage,
  onRefresh,
  onOpenReport,
  onAnalysisUpdated
}) => {
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Compute stage states from live analysis stages or compute dynamically
  const stagesMap = (analysis.stages || []).reduce<Record<string, WorkflowStage>>((acc, s) => {
    acc[s.stage_id] = s;
    return acc;
  }, {});

  const reqCount = analysis.extracted_requirements?.length || 0;
  const stdCount = analysis.recommendations?.length || 0;
  const mandatoryCount = analysis.potential_mandatory_count || 0;
  const conflictsCount = analysis.conflicts?.length || 0;
  const gapsCount = analysis.specification_gaps?.length || 0;
  const coverageScore = analysis.coverage_indicator ?? 86;

  const reviews = analysis.human_reviews || [];
  const pendingReviewsCount = reviews.filter(
    (hr: any) => !hr.decision || hr.decision === 'Pending' || hr.decision === 'Needs Review' || hr.decision === 'Review'
  ).length;

  const isFinalized = analysis.workflow_status === 'FINALIZED' || 
    Boolean(analysis.report) || 
    stagesMap['FINALIZATION']?.status === 'COMPLETED';

  const isHumanReviewComplete = stagesMap['HUMAN_REVIEW']?.status === 'COMPLETED' || 
    (reviews.length > 0 && pendingReviewsCount === 0) || 
    isFinalized;

  const isValidationComplete = stagesMap['VALIDATION']?.status === 'COMPLETED' || 
    (analysis.traceability_matrix?.length || 0) > 0;

  const isStandardsComplete = stagesMap['STANDARDS']?.status === 'COMPLETED' || stdCount > 0;
  const isRequirementsComplete = stagesMap['REQUIREMENTS']?.status === 'COMPLETED' || reqCount > 0;
  const isExtractionComplete = stagesMap['EXTRACTION']?.status === 'COMPLETED' || 
    Boolean(analysis.extracted_text || reqCount > 0);

  // Gate readiness check
  const isGateUnlocked = isRequirementsComplete && isStandardsComplete && isValidationComplete && isHumanReviewComplete;

  const handleResolveReviews = async (decision: 'Accepted' | 'Rejected') => {
    try {
      setIsProcessingAction(true);
      setActionError(null);
      const updated = await api.completeReviewsStage(analysis.analysis_id, analysis, decision);
      if (onAnalysisUpdated) onAnalysisUpdated(updated);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setActionError(err.message || "Failed to resolve reviews stage");
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleFinalizeReport = async () => {
    try {
      setIsProcessingAction(true);
      setActionError(null);
      let targetAnalysis = analysis;
      if (!isHumanReviewComplete && pendingReviewsCount > 0) {
        targetAnalysis = await api.completeReviewsStage(analysis.analysis_id, analysis, 'Accepted');
        if (onAnalysisUpdated) onAnalysisUpdated(targetAnalysis);
      }
      const res = await api.finalizeReportStage(analysis.analysis_id, undefined, targetAnalysis);
      if (res && res.analysis && onAnalysisUpdated) {
        onAnalysisUpdated(res.analysis);
      }
      if (onRefresh) onRefresh();
      if (onOpenReport) onOpenReport();
    } catch (err: any) {
      setActionError(err.message || "Failed to finalize report");
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Stage definition array for rendering
  const STAGE_CONFIGS: Array<{
    id: WorkflowStageId;
    label: string;
    targetTab: string;
    isCompleted: boolean;
    isProcessing: boolean;
    isFailed: boolean;
    hasData: boolean;
    subtext: string;
    icon: React.ElementType;
  }> = [
    {
      id: 'EXTRACTION',
      label: 'Extraction',
      targetTab: 'ai-understanding',
      isCompleted: isExtractionComplete,
      isProcessing: stagesMap['EXTRACTION']?.status === 'PROCESSING',
      isFailed: stagesMap['EXTRACTION']?.status === 'FAILED',
      hasData: Boolean(analysis.extracted_text || reqCount > 0),
      subtext: `${(analysis.sourceDocument?.page_count || 1)} pages • ${analysis.extraction_method || 'Native PDF'}`,
      icon: Cpu
    },
    {
      id: 'REQUIREMENTS',
      label: 'Requirements',
      targetTab: 'ai-understanding',
      isCompleted: isRequirementsComplete,
      isProcessing: stagesMap['REQUIREMENTS']?.status === 'PROCESSING',
      isFailed: stagesMap['REQUIREMENTS']?.status === 'FAILED',
      hasData: reqCount > 0,
      subtext: `${reqCount} requirements identified`,
      icon: Layers
    },
    {
      id: 'STANDARDS',
      label: 'Standards',
      targetTab: 'recommendations',
      isCompleted: isStandardsComplete,
      isProcessing: stagesMap['STANDARDS']?.status === 'PROCESSING',
      isFailed: stagesMap['STANDARDS']?.status === 'FAILED',
      hasData: stdCount > 0,
      subtext: `${stdCount} standards (${mandatoryCount} mandatory)`,
      icon: Award
    },
    {
      id: 'VALIDATION',
      label: 'Validation',
      targetTab: 'conflicts-redundancies',
      isCompleted: isValidationComplete,
      isProcessing: stagesMap['VALIDATION']?.status === 'PROCESSING',
      isFailed: stagesMap['VALIDATION']?.status === 'FAILED',
      hasData: (analysis.traceability_matrix?.length || 0) > 0,
      subtext: `${coverageScore}% score • ${conflictsCount} conflicts, ${gapsCount} gaps`,
      icon: ShieldCheck
    },
    {
      id: 'HUMAN_REVIEW',
      label: 'Human Review',
      targetTab: 'human-review',
      isCompleted: isHumanReviewComplete,
      isProcessing: stagesMap['HUMAN_REVIEW']?.status === 'PROCESSING' || (!isHumanReviewComplete && pendingReviewsCount > 0),
      isFailed: stagesMap['HUMAN_REVIEW']?.status === 'FAILED',
      hasData: reviews.length > 0,
      subtext: pendingReviewsCount > 0 ? `${pendingReviewsCount} pending decisions` : 'All decisions reviewed',
      icon: UserCheck
    },
    {
      id: 'FINALIZATION',
      label: 'Finalization',
      targetTab: 'report',
      isCompleted: isFinalized,
      isProcessing: stagesMap['FINALIZATION']?.status === 'PROCESSING',
      isFailed: stagesMap['FINALIZATION']?.status === 'FAILED',
      hasData: isFinalized,
      subtext: isFinalized ? 'Dossier generated' : 'Report not generated',
      icon: FileText
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
      
      {/* Top Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gov-900 text-saffron-400 flex items-center justify-center font-bold text-xs shadow-xs">
            ⚙
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-serif">
                Analysis Workflow Pipeline
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                isFinalized 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : isHumanReviewComplete
                    ? 'bg-sky-100 text-sky-800 border border-sky-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {analysis.workflow_status || (isFinalized ? 'FINALIZED' : 'IN PROGRESS')}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Analysis ID: <strong className="text-slate-800">{analysis.analysis_id}</strong> • Single Source of Truth
            </p>
          </div>
        </div>

        {/* Report Gate Status Badge */}
        <div className="flex items-center space-x-2 self-start sm:self-center">
          {isGateUnlocked ? (
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Report Gate Unlocked</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold" title={`Requires: ${pendingReviewsCount} human reviews to be completed`}>
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Gate Locked ({pendingReviewsCount} reviews pending)</span>
            </div>
          )}
        </div>
      </div>

      {/* 6-Stage Interactive State Machine Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
        {STAGE_CONFIGS.map((stage, idx) => {
          const Icon = stage.icon;
          const isClickable = stage.hasData;

          let statusBadge = (
            <span className="flex items-center space-x-1 text-slate-400">
              <Circle className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-[10px] font-mono">○ Pending</span>
            </span>
          );

          if (stage.isFailed) {
            statusBadge = (
              <span className="flex items-center space-x-1 text-rose-600 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span className="text-[10px] font-mono">⚠ Failed</span>
              </span>
            );
          } else if (stage.isProcessing) {
            statusBadge = (
              <span className="flex items-center space-x-1 text-amber-700 font-semibold">
                <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                <span className="text-[10px] font-mono">● Active</span>
              </span>
            );
          } else if (stage.isCompleted) {
            statusBadge = (
              <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[10px] font-mono">✓ Verified</span>
              </span>
            );
          }

          return (
            <button
              key={stage.id}
              type="button"
              disabled={!isClickable}
              onClick={() => {
                if (stage.id === 'FINALIZATION' && onOpenReport) {
                  onOpenReport();
                } else {
                  onNavigateStage(stage.id, stage.targetTab);
                }
              }}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                stage.isCompleted
                  ? 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300'
                  : stage.isProcessing
                    ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-200/50'
                    : isClickable
                      ? 'bg-slate-50/80 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      : 'bg-slate-50/40 border-slate-100 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  0{idx + 1}
                </span>
                {statusBadge}
              </div>

              <div>
                <div className="flex items-center space-x-1.5">
                  <Icon className={`w-3.5 h-3.5 ${
                    stage.isCompleted ? 'text-emerald-700' : stage.isProcessing ? 'text-amber-700' : 'text-slate-400'
                  }`} />
                  <span className={`text-xs font-bold ${
                    stage.isCompleted ? 'text-slate-900' : stage.isProcessing ? 'text-amber-900' : 'text-slate-600'
                  }`}>
                    {stage.label}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                  {stage.subtext}
                </p>
              </div>

              {stage.id === 'HUMAN_REVIEW' && !isHumanReviewComplete && pendingReviewsCount > 0 ? (
                <div className="pt-1.5 border-t border-amber-200/80 flex items-center justify-between gap-1 text-[10px]" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    disabled={isProcessingAction}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResolveReviews('Accepted');
                    }}
                    className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold transition flex items-center space-x-0.5 cursor-pointer shadow-xs disabled:opacity-50"
                    title="Quickly accept all pending review decisions and unlock report"
                  >
                    <span>✓ Accept</span>
                  </button>
                  <button
                    type="button"
                    disabled={isProcessingAction}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResolveReviews('Rejected');
                    }}
                    className="px-2 py-0.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded font-bold transition flex items-center space-x-0.5 cursor-pointer shadow-xs disabled:opacity-50"
                    title="Reject pending review decisions and unlock report"
                  >
                    <span>✕ Reject</span>
                  </button>
                  <div 
                    onClick={() => onNavigateStage(stage.id, stage.targetTab)}
                    className="text-gov-800 font-semibold ml-auto flex items-center cursor-pointer hover:underline"
                  >
                    <span>Queue</span>
                    <ChevronRight className="w-2.5 h-2.5 ml-0.5" />
                  </div>
                </div>
              ) : isClickable ? (
                <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-gov-800 font-semibold">
                  <span>View Details</span>
                  <ChevronRight className="w-3 h-3 text-gov-600" />
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Action / Gate Resolution Ribbon */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-gov-700 flex-shrink-0" />
          <span className="text-slate-700">
            {isFinalized ? (
              <span>Official Procurement Dossier is generated and finalized.</span>
            ) : isGateUnlocked ? (
              <span className="text-emerald-800 font-semibold">All prior stages and reviews are complete. Report generation is unlocked.</span>
            ) : (
              <span>
                Human review decisions required before final report generation. (<strong>{pendingReviewsCount}</strong> pending items).
              </span>
            )}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
          {!isHumanReviewComplete && pendingReviewsCount > 0 && (
            <>
              <button
                type="button"
                disabled={isProcessingAction}
                onClick={() => handleResolveReviews('Accepted')}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                title="Immediately accept all pending human review items and unlock report generation"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                <span>Accept All & Unlock Report</span>
              </button>

              <button
                type="button"
                disabled={isProcessingAction}
                onClick={() => handleResolveReviews('Rejected')}
                className="px-3 py-1.5 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-300 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                title="Reject pending review items with note and unlock report generation"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                <span>Reject All</span>
              </button>
            </>
          )}

          <button
            type="button"
            disabled={isProcessingAction}
            onClick={handleFinalizeReport}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow-xs ${
              isGateUnlocked || (!isHumanReviewComplete && pendingReviewsCount > 0)
                ? 'bg-saffron-500 hover:bg-saffron-600 text-slate-950 cursor-pointer shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            }`}
            title={isGateUnlocked ? "Finalize procurement intelligence report" : "Click to auto-resolve pending reviews and generate final dossier"}
          >
            {isGateUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{isFinalized ? 'Open Final Dossier' : 'Finalize & Generate Report'}</span>
          </button>
        </div>
      </div>

      {actionError && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}
    </div>
  );
};

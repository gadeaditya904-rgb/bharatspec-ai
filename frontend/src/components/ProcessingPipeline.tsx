import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, ShieldCheck, Database, Cpu } from 'lucide-react';

interface ProcessingPipelineProps {
  onComplete: () => void;
  documentName: string;
}

const PIPELINE_STEPS = [
  "Document uploaded & decoded",
  "Text extracted & parsed",
  "Procurement requirements identified",
  "Product & category detected",
  "Technical parameters extracted",
  "Standards knowledge base searched (2,450 records)",
  "Candidate standards ranked via semantic similarity",
  "Regulatory & QCO information reviewed",
  "Traceability matrix generated",
  "Specification gaps & conflicts identified",
  "Evidence checklist compiled"
];

export const ProcessingPipeline: React.FC<ProcessingPipelineProps> = ({
  onComplete,
  documentName
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < PIPELINE_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(onComplete, 600);
          return prev;
        }
      });
    }, 280);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="max-w-2xl mx-auto my-12 bg-white rounded-xl shadow-xl border border-slate-200 p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gov-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gov-200">
          <Cpu className="w-8 h-8 text-gov-700 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold font-serif text-slate-900">
          Executing Procurement Intelligence Pipeline
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Analyzing <span className="font-semibold text-slate-800">{documentName}</span> against Indian Standards Knowledge Base
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 mb-8 overflow-hidden">
        <div 
          className="bg-gov-700 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${((currentStepIndex + 1) / PIPELINE_STEPS.length) * 100}%` }}
        ></div>
      </div>

      {/* Step List */}
      <div className="space-y-3">
        {PIPELINE_STEPS.map((step, index) => {
          const isDone = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div 
              key={index} 
              className={`flex items-center justify-between p-3 rounded-lg border text-xs transition-all ${
                isDone 
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
                  : isCurrent 
                    ? 'bg-gov-50 border-gov-300 text-gov-900 shadow-sm' 
                    : 'bg-slate-50/50 border-slate-100 text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                {isCurrent && <Loader2 className="w-4 h-4 text-gov-700 animate-spin flex-shrink-0" />}
                {isPending && <span className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0"></span>}
                <span className={`font-medium ${isCurrent ? 'font-semibold' : ''}`}>{step}</span>
              </div>
              <span className="text-[10px] font-mono uppercase">
                {isDone ? 'Completed' : isCurrent ? 'Processing...' : 'Pending'}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Knowledge Base: BIS / DPIIT / MNRE / MeitY</span>
        <span className="font-mono">Engine: BharatSpec Vector & Rule Engine</span>
      </div>
    </div>
  );
};

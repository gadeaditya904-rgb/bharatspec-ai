import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  HelpCircle, 
  ChevronRight, 
  Sparkles, 
  FileText, 
  ShieldAlert, 
  Scale, 
  CheckCircle2 
} from 'lucide-react';
import { AnalysisResponse } from '../types';

interface ContextualAssistantProps {
  analysis: AnalysisResponse | null;
  onExplainStandard?: (isNumber: string) => void;
}

export const ContextualAssistant: React.FC<ContextualAssistantProps> = ({
  analysis,
  onExplainStandard
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; action?: string }>>([
    {
      sender: 'assistant',
      text: 'Namaste! I am your BharatSpec Standards Knowledge Assistant. I am grounded specifically in this procurement specification and active Indian Standards. How may I assist your review?'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  const samplePrompts = [
    "Why was IS 10322 recommended?",
    "Which requirements are currently unmapped?",
    "What evidence should be reviewed?",
    "Show me all regulatory review items",
    "Are there any conflicting parameters?"
  ];

  const handleSend = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg = { sender: 'user' as const, text: queryText };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Generate grounded contextual response
    setTimeout(() => {
      let reply = "";
      const q = queryText.toLowerCase();

      if (q.includes("why was") || q.includes("is 10322") || q.includes("is 16221") || q.includes("is 1180") || q.includes("is 13450")) {
        const found = analysis?.recommendations.find(r => q.includes(r.is_number.split(':')[0].trim().toLowerCase()) || q.includes("10322") || q.includes("16221"));
        if (found) {
          reply = `Standard ${found.is_number} was recommended because:
1. Product Category Match: It governs ${found.why_details.product_match}
2. Requirements Covered: Overlaps with ${found.matched_requirements.join(', ')}
3. Match Relevance Score: ${found.relevance_score} (${found.relevance_level} relevance)
4. Regulatory Status: ${found.regulatory_status}`;
        } else {
          reply = "The standard was recommended based on semantic matching of your technical clauses against the Bureau of Indian Standards catalogue and applicable QCOs.";
        }
      } else if (q.includes("unmapped")) {
        const unmapped = analysis?.traceability_matrix.filter(t => t.review_status === "Unmapped") || [];
        reply = `There are currently ${unmapped.length} unmapped procurement requirements:
${unmapped.map((u, i) => `• ${u.requirement} (Category: ${u.category})`).join('\n')}

Recommendation: Conduct evaluator review or inspect Standards Explorer to identify custom specifications.`;
      } else if (q.includes("evidence")) {
        const evi = analysis?.evidence_checklist || [];
        reply = `The knowledge base identifies ${evi.length} key evidence documents for review:
${evi.slice(0, 4).map(e => `• [${e.status}] ${e.evidence_type} (for ${e.related_standard})`).join('\n')}

Verification against current BIS portal or NABL portal is recommended.`;
      } else if (q.includes("regulatory") || q.includes("qco")) {
        reply = `Regulatory Review Summary:
• Potential Mandatory Items: ${analysis?.potential_mandatory_count || 3}
• Relevant Authorities: DPIIT, Ministry of New & Renewable Energy, MeitY
• Notice: Standards marked 'Potentially Mandatory' have active Gazette Quality Control Orders. Verify the effective date before issuing the tender.`;
      } else if (q.includes("conflict") || q.includes("ambiguity")) {
        const conf = analysis?.conflicts || [];
        if (conf.length > 0) {
          reply = `Potential Conflict Detected:
${conf.map(c => `• ${c.description}\nRecommended Action: ${c.recommendation}`).join('\n')}`;
        } else {
          reply = "No direct numerical conflicts or unit contradictions were detected in this specification draft.";
        }
      } else {
        reply = `Based on the active analysis of '${analysis?.product_name || "the specification"}':
• Specification Coverage: ${analysis?.coverage_indicator || 86}%
• Recommended Standards: ${analysis?.recommendations.length || 8}
• Unmapped Parameters: ${analysis?.unmapped_requirements || 4}
• Gaps Detected: ${analysis?.specification_gaps.length || 3}

Please select a specific question above or ask about any standard number.`;
      }

      setMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
    }, 400);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gov-900 hover:bg-gov-800 text-white p-3.5 rounded-full shadow-2xl flex items-center space-x-2 border-2 border-saffron-500 hover:scale-105 transition-all"
        title="Open Standards Knowledge Advisor"
      >
        <Bot className="w-5 h-5 text-saffron-400" />
        <span className="text-xs font-semibold pr-1 hidden sm:inline">Standards Advisor</span>
      </button>

      {/* Docked Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[560px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="px-4 py-3 bg-gov-950 text-white flex items-center justify-between border-b border-gov-800">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-gov-800 flex items-center justify-center">
                <Bot className="w-4 h-4 text-saffron-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight font-serif">Standards Review Assistant</h4>
                <p className="text-[10px] text-slate-400">Grounded in Active Procurement Spec</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Context Header */}
          <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 text-[10px] text-slate-600 flex items-center justify-between">
            <span className="truncate font-medium">Context: {analysis?.product_name || "No analysis loaded"}</span>
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-mono">
              {analysis?.coverage_indicator || 86}% Coverage
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 leading-relaxed whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-gov-800 text-white'
                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-slate-50 border-t border-slate-200">
            <p className="text-[10px] text-slate-500 mb-1 px-1 font-semibold uppercase tracking-wider">Suggested Inquiries:</p>
            <div className="flex flex-wrap gap-1">
              {samplePrompts.slice(0, 3).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="text-[10px] bg-white hover:bg-gov-50 text-slate-700 hover:text-gov-900 border border-slate-200 rounded px-2 py-0.5 text-left transition truncate max-w-full"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-2.5 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask about standards, unmapped requirements, QCOs..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend(inputQuery);
              }}
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gov-700 text-slate-900 placeholder-slate-400"
            />
            <button
              onClick={() => handleSend(inputQuery)}
              className="p-2 bg-gov-800 hover:bg-gov-900 text-white rounded-lg transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

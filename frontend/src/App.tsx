import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ExplainModal } from './components/ExplainModal';
import { ReportModal } from './components/ReportModal';
import { ContextualAssistant } from './components/ContextualAssistant';
import { ProcessingPipeline } from './components/ProcessingPipeline';

import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { ProcurementIntake } from './pages/ProcurementIntake';
import { MyWorkspace } from './pages/MyWorkspace';
import { ReviewQueue } from './pages/ReviewQueue';
import { ReportCenter } from './pages/ReportCenter';
import { RelationshipExplorer } from './pages/RelationshipExplorer';
import { NewAnalysis } from './pages/NewAnalysis';
import { AnalysisDetail } from './pages/AnalysisDetail';
import { StandardsExplorer } from './pages/StandardsExplorer';
import { RegulatoryView } from './pages/RegulatoryView';
import { BidderModule } from './pages/BidderModule';
import { ReportView } from './pages/ReportView';
import { AdminPanel } from './pages/AdminPanel';
import { TenderVersionComparison } from './pages/TenderVersionComparison';
import { AuthModal } from './components/AuthModal';
import { authService } from './services/auth';

import { api, analyzeDocumentOffline } from './services/api';
import { STANDARDS_DATABASE, REGULATIONS_DATABASE, DEMO_SPECIFICATIONS } from './services/demoData';
import { AnalysisResponse, Recommendation, Standard, RegulatoryRequirement, DemoSpecification, ExtractedRequirement, UserProfile, DetectedProcurementItem, MultiProcurementSession } from './types';

export function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => authService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(currentUser.role_display);
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('en');
  const [activeView, setActiveView] = useState('dashboard');
  const [standards, setStandards] = useState<Standard[]>(STANDARDS_DATABASE);
  const [regulations, setRegulations] = useState<RegulatoryRequirement[]>(REGULATIONS_DATABASE);
  const [demoSpecs, setDemoSpecs] = useState<DemoSpecification[]>(DEMO_SPECIFICATIONS);
  
  // Multi-Procurement Package Session State
  const [multiSession, setMultiSession] = useState<MultiProcurementSession | null>(() => {
    try {
      const saved = localStorage.getItem('bharatspec_multi_session');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });
  const [pendingMultiItems, setPendingMultiItems] = useState<DetectedProcurementItem[] | null>(null);
  const [isConsolidatedReport, setIsConsolidatedReport] = useState<boolean>(false);

  // Initialize with persisted analysis or default Solar Street Light analysis
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResponse>(() => {
    try {
      const saved = localStorage.getItem('bharatspec_active_analysis');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // ignore
    }
    return analyzeDocumentOffline(DEMO_SPECIFICATIONS[0].text, DEMO_SPECIFICATIONS[0].filename);
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingDocName, setProcessingDocName] = useState('Procurement_Spec.docx');
  const [pendingText, setPendingText] = useState('');
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);
  const [pendingInputType, setPendingInputType] = useState<string>('text');
  const [pendingLanguage, setPendingLanguage] = useState<string>('auto');
  const [pendingVerifiedRequirements, setPendingVerifiedRequirements] = useState<ExtractedRequirement[] | undefined>(undefined);
  const [explainRecommendation, setExplainRecommendation] = useState<Recommendation | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState('BS-2026-79950');

  // Sync with backend if available & rehydrate active analysis
  useEffect(() => {
    async function loadData() {
      try {
        const [stds, regs, demos] = await Promise.all([
          api.getStandards(),
          api.getRegulations(),
          api.getDemoSpecs()
        ]);
        if (stds.length > 0) setStandards(stds);
        if (regs.length > 0) setRegulations(regs);
        if (demos.length > 0) setDemoSpecs(demos);

        // Rehydrate active analysis from backend if available to preserve workflow state across reloads
        if (activeAnalysis?.analysis_id) {
          try {
            const live = await api.getAnalysis(activeAnalysis.analysis_id);
            if (live && live.analysis_id) {
              setActiveAnalysis(live);
              try {
                localStorage.setItem('bharatspec_active_analysis', JSON.stringify(live));
              } catch (e) {}
            }
          } catch (e) {
            // retain cached analysis
          }
        }
      } catch (err) {
        console.log("Operating in offline demo mode with local knowledge base.");
      }
    }
    loadData();
  }, []);

  const handleStartAnalysis = (
    fileOrTextOrPayload: File | string | any, 
    filename?: string,
    inputType: string = 'text',
    lang: string = 'auto',
    verifiedReqs?: ExtractedRequirement[]
  ) => {
    // Check if payload object was passed
    if (typeof fileOrTextOrPayload === 'object' && !(fileOrTextOrPayload instanceof File)) {
      const payload = fileOrTextOrPayload;
      if (payload.analysisResult) {
        setPendingMultiItems(null);
        setPendingUploadFile(null);
        setActiveAnalysis(payload.analysisResult);
        try {
          localStorage.setItem('bharatspec_active_analysis', JSON.stringify(payload.analysisResult));
        } catch (e) {}
        setActiveView('standards-intelligence');
        return;
      }
      if (payload.isMultiItem && payload.detectedItems && payload.detectedItems.length > 0) {
        setPendingMultiItems(payload.detectedItems);
        setPendingUploadFile(null);
        setPendingText('');
        setProcessingDocName(payload.filename || 'Multi_Product_Procurement_Package.txt');
        setPendingInputType(payload.inputType || 'text');
        setPendingLanguage(payload.language || 'auto');
        setIsProcessing(true);
        return;
      } else if (payload.forcedItem) {
        setPendingMultiItems(null);
        setPendingUploadFile(null);
        setPendingText(payload.text || payload.forcedItem.raw_text);
        setProcessingDocName(payload.filename || `${payload.forcedItem.title.replace(/\s+/g, '_')}.txt`);
        setPendingInputType(payload.inputType || 'text');
        setPendingLanguage(payload.language || 'auto');
        setPendingVerifiedRequirements(payload.verifiedRequirements);
        setIsProcessing(true);
        return;
      } else if (payload.file instanceof File) {
        setPendingMultiItems(null);
        setPendingUploadFile(payload.file);
        setPendingText(payload.text || '');
        setProcessingDocName(payload.filename || payload.file.name);
      } else {
        setPendingMultiItems(null);
        setPendingUploadFile(null);
        setPendingText(payload.text || '');
        setProcessingDocName(payload.filename || 'Procurement_Specification.txt');
      }
      setPendingInputType(payload.inputType || 'text');
      setPendingLanguage(payload.language || 'auto');
      setPendingVerifiedRequirements(payload.verifiedRequirements);
    } else if (fileOrTextOrPayload instanceof File) {
      setPendingMultiItems(null);
      setPendingUploadFile(fileOrTextOrPayload);
      setPendingText('');
      setProcessingDocName(fileOrTextOrPayload.name || filename || 'Procurement_Document.pdf');
      setPendingInputType(inputType || 'upload');
      setPendingLanguage(lang || 'auto');
      setPendingVerifiedRequirements(verifiedReqs);
    } else {
      setPendingMultiItems(null);
      setPendingUploadFile(null);
      setPendingText(fileOrTextOrPayload || '');
      setProcessingDocName(filename || 'Procurement_Specification.txt');
      setPendingInputType(inputType || 'text');
      setPendingLanguage(lang || 'auto');
      setPendingVerifiedRequirements(verifiedReqs);
    }
    setIsProcessing(true);
  };

  const handlePipelineComplete = async () => {
    setIsProcessing(false);

    // 1. Multi-Item Package Processing
    if (pendingMultiItems && pendingMultiItems.length > 0) {
      const itemAnalyses: Record<string, AnalysisResponse> = {};
      for (const item of pendingMultiItems) {
        itemAnalyses[item.id] = analyzeDocumentOffline(
          item.raw_text, 
          `${item.title.replace(/\s+/g, '_')}.txt`, 
          pendingInputType, 
          pendingLanguage, 
          undefined, 
          item
        );
      }
      const session: MultiProcurementSession = {
        session_id: `PKG-2026-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toISOString(),
        total_items: pendingMultiItems.length,
        items: pendingMultiItems,
        item_analyses: itemAnalyses,
        active_item_id: pendingMultiItems[0].id
      };
      setMultiSession(session);
      try {
        localStorage.setItem('bharatspec_multi_session', JSON.stringify(session));
      } catch (e) {}
      const firstAnalysis = itemAnalyses[session.active_item_id];
      setActiveAnalysis(firstAnalysis);
      try {
        localStorage.setItem('bharatspec_active_analysis', JSON.stringify(firstAnalysis));
      } catch (e) {}
      setPendingMultiItems(null);
      setActiveView('standards-intelligence');
      return;
    }

    let result: AnalysisResponse;
    if (pendingUploadFile) {
      try {
        result = await api.uploadDocument(pendingUploadFile);
      } catch (err) {
        console.warn("Upload failed, falling back to local analysis", err);
        result = await api.analyze(
          pendingText || pendingUploadFile.name, 
          processingDocName,
          pendingInputType,
          pendingLanguage,
          pendingVerifiedRequirements
        );
      }
    } else {
      result = await api.analyze(
        pendingText, 
        processingDocName, 
        pendingInputType, 
        pendingLanguage, 
        pendingVerifiedRequirements
      );
    }
    setActiveAnalysis(result);
    try {
      localStorage.setItem('bharatspec_active_analysis', JSON.stringify(result));
    } catch (e) {
      // ignore
    }
    setActiveView('standards-intelligence');
  };

  const handleSelectMultiItem = (itemId: string) => {
    if (!multiSession || !multiSession.item_analyses[itemId]) return;
    const updatedSession = { ...multiSession, active_item_id: itemId };
    setMultiSession(updatedSession);
    const targetAnalysis = multiSession.item_analyses[itemId];
    setActiveAnalysis(targetAnalysis);
    try {
      localStorage.setItem('bharatspec_multi_session', JSON.stringify(updatedSession));
      localStorage.setItem('bharatspec_active_analysis', JSON.stringify(targetAnalysis));
    } catch (e) {}
  };

  const handleSelectDemo = async (demoId: string) => {
    const demo = demoSpecs.find(d => d.id === demoId) || demoSpecs[0];
    setPendingUploadFile(null);
    setPendingText(demo.text);
    setProcessingDocName(demo.filename);
    setIsProcessing(true);
  };

  // Map views to AnalysisDetail sub-tabs
  const analysisTabMap: Record<string, string> = {
    'standards-intelligence': 'ai-understanding',
    'analysis-overview': 'ai-understanding',
    'ai-understanding': 'ai-understanding',
    'recommendations': 'recommendations',
    'bundling': 'bundling',
    'related-standards': 'related-standards',
    'relationship-graph': 'relationship-graph',
    'version-intelligence': 'version-intelligence',
    'conflicts-redundancies': 'conflicts-redundancies',
    'conflicts': 'conflicts-redundancies',
    'redundancies': 'conflicts-redundancies',
    'readiness': 'readiness',
    'tender-readiness': 'readiness',
    'traceability': 'traceability',
    'compliance': 'compliance',
    'qco-certification': 'compliance',
    'gaps': 'gaps',
    'evidence': 'evidence',
    'neutrality': 'conflicts-redundancies',
    'human-review': 'human-review',
    'audit-trail': 'audit-trail'
  };

  const isAnalysisView = activeView in analysisTabMap;

  /* ====================================================
     STANDALONE REPORT VIEW:
     When activeView === 'report', render ONLY the standalone
     report document with its minimal document toolbar.
     NO sidebar, NO navbar, NO floating AI assistant,
     NO application footer, NO dashboard controls.
     ==================================================== */
  if (activeView === 'report' && activeAnalysis) {
    return (
      <ReportView
        analysis={activeAnalysis}
        reportId={selectedReportId || 'BS-2026-79950'}
        onClose={() => setActiveView('reports')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        activeView={activeView}
        onNavigate={setActiveView}
        language={language}
        onLanguageChange={setLanguage}
        onSearch={(query) => {
          setActiveView('standards');
        }}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeView={activeView}
          onNavigate={setActiveView}
          hasActiveAnalysis={!!activeAnalysis}
          currentUser={currentUser}
        />

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {isProcessing ? (
            <ProcessingPipeline
              documentName={processingDocName}
              onComplete={handlePipelineComplete}
            />
          ) : (
            <>
              {/* Landing Page Overview */}
              {activeView === 'landing' && (
                <LandingPage
                  onAnalyzeClick={() => setActiveView('procurement-intake')}
                  onExploreClick={() => setActiveView('standards')}
                  onSelectDemo={handleSelectDemo}
                />
              )}

              {/* 1. Dashboard */}
              {activeView === 'dashboard' && (
                <Dashboard
                  currentUser={currentUser}
                  onNavigate={setActiveView}
                  onSelectDemo={handleSelectDemo}
                  onStartAnalysis={handleStartAnalysis}
                  demoSpecs={demoSpecs}
                />
              )}

              {/* 2. Procurement Intake & Ingestion Center */}
              {(activeView === 'procurement-intake' || activeView === 'new-analysis') && (
                <ProcurementIntake
                  onStartUpload={handleStartAnalysis}
                  onOpenAnalysis={(docId) => {
                    if (docId) handleSelectDemo(docId);
                    else setActiveView('standards-intelligence');
                  }}
                  onOpenReviewQueue={() => setActiveView('review-queue')}
                />
              )}

              {/* 3. My Analyses / Officer Workspace */}
              {activeView === 'my-analyses' && (
                <MyWorkspace
                  onOpenAnalysis={(id) => {
                    if (id) handleSelectDemo(id);
                    else setActiveView('standards-intelligence');
                  }}
                  onOpenReport={(reportId) => {
                    setSelectedReportId(reportId);
                    setActiveView('report');
                  }}
                  onOpenReviewQueue={() => setActiveView('review-queue')}
                  onOpenStandards={() => setActiveView('standards')}
                  onNewAnalysis={() => setActiveView('procurement-intake')}
                />
              )}

              {/* 4. Review Queue */}
              {activeView === 'review-queue' && (
                <ReviewQueue
                  currentUser={currentUser}
                  onOpenAnalysisTab={(tab) => setActiveView(tab)}
                />
              )}

              {/* 5. Report Center */}
              {activeView === 'reports' && (
                <ReportCenter
                  onOpenReport={(reportId) => {
                    setSelectedReportId(reportId);
                    setActiveView('report');
                  }}
                  onOpenGenerateModal={() => setIsReportModalOpen(true)}
                  analysis={activeAnalysis}
                />
              )}

              {/* Specifications Repository */}
              {activeView === 'procurement-specs' && (
                <div className="space-y-6 max-w-6xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gov-100 text-gov-800">
                        Specification Repository
                      </span>
                      <h2 className="text-2xl font-bold font-serif text-slate-900 mt-1">
                        Procurement Specifications & Tender Catalog
                      </h2>
                      <p className="text-xs text-slate-500">
                        Choose a pre-loaded tender specification across key procurement domains, or submit a new document.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveView('procurement-intake')}
                      className="px-4 py-2 bg-gov-900 hover:bg-gov-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                    >
                      + Submit New Specification
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {demoSpecs.map(d => (
                      <div 
                        key={d.id} 
                        onClick={() => handleSelectDemo(d.id)}
                        className="bg-white p-5 rounded-xl border border-slate-200 hover:border-gov-700 cursor-pointer shadow-sm hover:shadow transition flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] uppercase font-bold bg-gov-100 text-gov-800 px-2 py-0.5 rounded">
                              {d.category}
                            </span>
                            <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {d.stats.coverage_indicator}% Coverage
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 mt-1">{d.title}</h4>
                          <p className="text-xs text-slate-600 line-clamp-3 mt-2">{d.summary}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500">
                          <span>{d.stats.requirements} Requirements</span>
                          <span className="text-gov-800 font-bold flex items-center space-x-1">
                            <span>Analyze Spec</span>
                            <span>→</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dedicated Relationship Explorer Page (Section 23) */}
              {activeView === 'relationship-explorer' && (
                <RelationshipExplorer
                  standards={standards}
                  onNavigateToStandard={() => setActiveView('standards')}
                  onNavigateToTraceability={() => setActiveView('traceability')}
                />
              )}

              {/* Standards Intelligence & Analysis Detail Tabs */}
              {isAnalysisView && activeAnalysis && (
                <AnalysisDetail
                  analysis={activeAnalysis}
                  activeTab={analysisTabMap[activeView]}
                  onTabChange={(tab) => setActiveView(tab)}
                  onExplainStandard={(rec) => setExplainRecommendation(rec)}
                  onNavigateToReport={() => {
                    setSelectedReportId(activeAnalysis?.analysis_id || 'BS-2026-000128');
                    setActiveView('report');
                  }}
                  onOpenReportModal={() => setIsReportModalOpen(true)}
                  onNavigateToIntake={() => setActiveView('procurement-intake')}
                  onNavigateToDiff={() => setActiveView('version-diff')}
                  multiSession={multiSession}
                  onSelectMultiItem={handleSelectMultiItem}
                  currentUser={currentUser}
                  onAnalysisUpdated={(updated) => {
                    setActiveAnalysis(updated);
                    try {
                      localStorage.setItem('bharatspec_active_analysis', JSON.stringify(updated));
                    } catch (e) {}
                  }}
                />
              )}

              {/* Standards Explorer */}
              {activeView === 'standards' && (
                <StandardsExplorer standards={standards} />
              )}

              {/* QCO & Regulatory View */}
              {(activeView === 'qco-certification' || activeView === 'regulations') && (
                <RegulatoryView regulations={regulations} />
              )}

              {/* Bidder Verification */}
              {activeView === 'bidder-verification' && (
                <BidderModule />
              )}

              {/* Tender Version Comparison Engine */}
              {activeView === 'version-diff' && (
                <TenderVersionComparison />
              )}

              {/* Knowledge Base & Administration */}
              {(activeView === 'knowledge-base' || activeView === 'admin') && (
                <AdminPanel />
              )}
            </>
          )}
        </main>
      </div>

      {/* Explainable AI Modal */}
      <ExplainModal
        recommendation={explainRecommendation}
        onClose={() => setExplainRecommendation(null)}
      />

      {/* Prominent Report Generation Modal (Section 5) */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        analysis={activeAnalysis}
        onViewReport={(repId) => {
          setSelectedReportId(repId);
          setActiveView('report');
        }}
      />

      {/* Docked Contextual AI Assistant */}
      <ContextualAssistant
        analysis={activeAnalysis}
      />

      {/* Real Government Officer Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUserChange={(newUser) => {
          authService.setCurrentUser(newUser);
          setCurrentUser(newUser);
          setCurrentRole(newUser.role_display);
        }}
      />
    </div>
  );
}

export default App;

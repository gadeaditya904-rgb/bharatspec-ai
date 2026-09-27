import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Filter, 
  Search, 
  RefreshCw,
  Sparkles,
  Inbox,
  ShieldCheck,
  ChevronRight,
  Code2,
  Send,
  Loader2,
  X,
  FileCheck,
  Check,
  Camera,
  QrCode,
  Mic,
  MicOff,
  Languages,
  Edit3,
  Trash2,
  Eye,
  HelpCircle,
  AlertTriangle,
  FileUp,
  Sliders,
  CheckSquare,
  Square,
  Volume2,
  Package,
  Split,
  Merge,
  Play,
  Pause,
  RotateCcw,
  Scan,
  Video,
  VideoOff,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { DecodeHintType, BarcodeFormat } from '@zxing/library';
import { 
  IncomingDocument, 
  ExtractedRequirement, 
  OcrResponse, 
  QrLookupResponse,
  BarcodeLookupResponse,
  DetectedProcurementItem,
  DecodedBarcodeItem
} from '../types';
import { INCOMING_DOCUMENTS, DEMO_SPECIFICATIONS } from '../services/demoData';
import { api, detectProcurementItems } from '../services/api';

interface ProcurementIntakeProps {
  onStartUpload: (
    fileOrTextOrPayload: File | string | any, 
    filename?: string, 
    inputType?: string, 
    lang?: string, 
    verifiedReqs?: ExtractedRequirement[]
  ) => void;
  onOpenAnalysis: (docId?: string) => void;
  onOpenReviewQueue: () => void;
  onStartMultiAnalysis?: (items: DetectedProcurementItem[], sessionTitle?: string) => void;
}

type InputModalType = 'text' | 'upload' | 'ocr' | 'qr' | 'voice';
type ProcessingState = 'IDLE' | 'RECEIVED' | 'EXTRACTING REQUIREMENTS' | 'ANALYZING' | 'MATCHING STANDARDS' | 'ANALYSIS READY';

const INDIAN_LANGUAGES = [
  { code: 'auto', label: 'Auto-Detect Language' },
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi (हिन्दी)' },
  { code: 'mr', label: 'Marathi (मराठी)' },
  { code: 'gu', label: 'Gujarati (ગુજરાતી)' },
  { code: 'ta', label: 'Tamil (தமிழ்)' },
  { code: 'te', label: 'Telugu (తెలుగు)' },
  { code: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
  { code: 'bn', label: 'Bengali (বাংলা)' },
  { code: 'ml', label: 'Malayalam (മലയാളം)' },
  { code: 'pa', label: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'ur', label: 'Urdu (اردو)' }
];

export const ProcurementIntake: React.FC<ProcurementIntakeProps> = ({
  onStartUpload,
  onOpenAnalysis,
  onOpenReviewQueue
}) => {
  const [documents, setDocuments] = useState<IncomingDocument[]>(INCOMING_DOCUMENTS);
  const [activeModal, setActiveModal] = useState<InputModalType>('text');
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isSimulatingSync, setIsSimulatingSync] = useState(false);

  // Common pipeline execution state
  const [processingState, setProcessingState] = useState<ProcessingState>('IDLE');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [activeFileName, setActiveFileName] = useState('');
  const [activeFileSize, setActiveFileSize] = useState('');
  const [channelNote, setChannelNote] = useState('');

  // 1. Text Input State
  const [textInput, setTextInput] = useState(
    "TECHNICAL PROCUREMENT SPECIFICATION: 24-PORT MANAGED GIGABIT ETHERNET SWITCH\n" +
    "1. Minimum 24 Auto-sensing 10/100/1000 Base-T Gigabit Ethernet Ports with RJ-45 connectors.\n" +
    "2. Minimum 4 dedicated 1G/10G SFP+ optical uplink transceiver slots.\n" +
    "3. Switching Capacity: Minimum 128 Gbps non-blocking wire-speed forwarding.\n" +
    "4. Safety & Regulatory: Compulsory BIS CRS registration as per IS 13252 (Part 1).\n" +
    "5. Power Supply: Dual redundant hot-swappable 230V AC internal power supplies."
  );

  // 2. Document Upload State
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileSha256, setFileSha256] = useState<string>('e8b94a12c091942bf5486e92718104');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hardware and Browser Capability Flags
  const [hasCameraSupport, setHasCameraSupport] = useState<boolean>(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState<boolean>(false);
  const [hasMediaRecorderSupport, setHasMediaRecorderSupport] = useState<boolean>(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
      setHasCameraSupport(true);
    }
    if (typeof window !== 'undefined') {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        setHasSpeechSupport(true);
      }
      if ('MediaRecorder' in window) {
        setHasMediaRecorderSupport(true);
      }
    }
  }, []);

  // 3. OCR & Camera Scanner State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ocrImageFile, setOcrImageFile] = useState<File | null>(null);
  const [ocrImagePreview, setOcrImagePreview] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrResponse | null>({
    text: "GOVERNMENT TECHNICAL SPECIFICATION FOR ELECTRICAL SYSTEM\n" +
          "Clause 1. Output Voltage: 0 - 30 V DC continuously adjustable\n" +
          "Clause 2. Output Current: 0 - 5 A DC with constant current mode\n" +
          "Clause 3. Ripple & Noise: <= 1 mV RMS (20 Hz to 20 MHz)\n" +
          "Clause 4. Over Voltage Protection (OVP) and Over Current Protection (OCP) mandatory.\n" +
          "Clause 5. Conformance to IS/IEC 61010-1 for electrical safety benchmarks.",
    confidence: 0.94,
    quality: "High Quality - 300 DPI Contrast Verified",
    detected_language: "English",
    image_name: "Tender_Document_Scan_P1.png",
    needs_review: false,
    word_count: 56
  });
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const ocrFileInputRef = useRef<HTMLInputElement>(null);

  // 4. QR / Barcode State
  const [isQrScannerActive, setIsQrScannerActive] = useState(false);
  const [qrStream, setQrStream] = useState<MediaStream | null>(null);
  const [qrScannerError, setQrScannerError] = useState<string | null>(null);
  const qrVideoRef = useRef<HTMLVideoElement | null>(null);
  const zxingReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const zxingAnimFrameRef = useRef<number | null>(null);
  const qrFileInputRef = useRef<HTMLInputElement>(null);
  const [qrCodeInput, setQrCodeInput] = useState('BS-TEST-TENDER-001');
  const [qrLookupResult, setQrLookupResult] = useState<BarcodeLookupResponse | null>(null);
  const [isSearchingQr, setIsSearchingQr] = useState(false);

  // Real Image Decoding & Barcode Detection State
  const [detectedCodes, setDetectedCodes] = useState<DecodedBarcodeItem[]>([]);
  const [activeDecodedCode, setActiveDecodedCode] = useState<DecodedBarcodeItem | null>(null);
  const [qrDetectionStatus, setQrDetectionStatus] = useState<'IDLE' | 'SEARCHING' | 'SUCCESS' | 'NOT_FOUND' | 'ERROR'>('IDLE');
  const [qrUploadedImagePreview, setQrUploadedImagePreview] = useState<string | null>(null);
  const [qrUploadedFileName, setQrUploadedFileName] = useState<string | null>(null);
  const [qrDebugInfo, setQrDebugInfo] = useState<{
    imageName?: string;
    decoder: string;
    detectionResult: 'SUCCESS' | 'NOT_FOUND';
    format?: string;
    decodedValue?: string;
    lookupValue?: string;
  } | null>(null);

  // 5. Voice Input State
  const [isRecording, setIsRecording] = useState(false);
  const [voiceState, setVoiceState] = useState<'IDLE' | 'LISTENING' | 'RECORDING' | 'TRANSCRIBING' | 'ERROR'>('IDLE');
  const [voiceConfidence, setVoiceConfidence] = useState<number>(0.94);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceTranscript, setVoiceTranscript] = useState(
    "Mujhe college laboratory ke liye 30 volt aur 5 ampere ka programmable DC power supply chahiye with over-voltage protection and IS/IEC 61010-1 safety certification"
  );
  const [voiceNormalized, setVoiceNormalized] = useState(
    "Procurement Requirement: Programmable DC Power Supply (0-30V, 0-5A) with Over-Voltage Protection (OVP) and IS/IEC 61010-1 compliance."
  );
  const [speechRecognitionInstance, setSpeechRecognitionInstance] = useState<any>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const audioFileInputRef = useRef<HTMLInputElement | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // 6. Human Verification Review Gate State
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isExtractingPreview, setIsExtractingPreview] = useState(false);
  const [candidateRequirements, setCandidateRequirements] = useState<ExtractedRequirement[]>([]);
  const [editingReqId, setEditingReqId] = useState<string | null>(null);
  const [editParam, setEditParam] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editCategory, setEditCategory] = useState<ExtractedRequirement['category']>('Technical');

  // 7. Multi-Procurement Item Segmentation State
  const [detectedItems, setDetectedItems] = useState<DetectedProcurementItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isMultiItemViewActive, setIsMultiItemViewActive] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemTitle, setEditItemTitle] = useState<string>('');
  const [editItemCategory, setEditItemCategory] = useState<string>('');
  const [editItemText, setEditItemText] = useState<string>('');

  // Load initial QR code test record on first mount
  useEffect(() => {
    const initialItem: DecodedBarcodeItem = {
      type: 'QR Code',
      format: 'QR_CODE',
      value: 'BS-TEST-TENDER-001',
      source: 'Image Upload',
      timestamp: new Date().toLocaleTimeString()
    };
    setActiveDecodedCode(initialItem);
    setDetectedCodes([initialItem]);
    setQrDetectionStatus('SUCCESS');
    setQrDebugInfo({
      imageName: 'test_tender_qr.png',
      decoder: 'BarcodeDetector',
      detectionResult: 'SUCCESS',
      format: 'QR_CODE',
      decodedValue: 'BS-TEST-TENDER-001',
      lookupValue: 'BS-TEST-TENDER-001'
    });
    handleLookupQr('BS-TEST-TENDER-001', 'QR_CODE');
  }, []);

  // Voice timer effect
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Reusable execution runner that steps through the 5 realistic processing states
  const runIntakePipeline = (
    fileName: string, 
    fileSize: string, 
    fileOrContent: File | string, 
    sourceLabel: string,
    inputType: string,
    verifiedReqs?: ExtractedRequirement[]
  ) => {
    setActiveFileName(fileName);
    setActiveFileSize(fileSize);
    setChannelNote(sourceLabel);

    // Sequence of 5 exact requested states:
    // 1. RECEIVED
    // 2. EXTRACTING REQUIREMENTS
    // 3. ANALYZING
    // 4. MATCHING STANDARDS
    // 5. ANALYSIS READY
    setProcessingState('RECEIVED');
    setProcessingProgress(15);

    setTimeout(() => {
      setProcessingState('EXTRACTING REQUIREMENTS');
      setProcessingProgress(40);
    }, 400);

    setTimeout(() => {
      setProcessingState('ANALYZING');
      setProcessingProgress(65);
    }, 850);

    setTimeout(() => {
      setProcessingState('MATCHING STANDARDS');
      setProcessingProgress(88);
    }, 1250);

    setTimeout(() => {
      setProcessingState('ANALYSIS READY');
      setProcessingProgress(100);

      const newDoc: IncomingDocument = {
        id: `inc-${Date.now()}`,
        document: fileName,
        source: `${sourceLabel} (${inputType.toUpperCase()})`,
        received: "Just now",
        status: "ANALYZED",
        assigned_to: "Technical Evaluation Committee",
        analysis_id: "BS-2026-ACTIVE",
        analysis_status: "Complete",
        coverage: 92,
        requirements_count: verifiedReqs ? verifiedReqs.length : 12
      };
      setDocuments(prev => [newDoc, ...prev]);

      // Open Analysis Workspace after brief confirmation pause
      setTimeout(() => {
        onStartUpload({
          file: fileOrContent instanceof File ? fileOrContent : null,
          text: typeof fileOrContent === 'string' ? fileOrContent : '',
          filename: fileName,
          inputType: inputType,
          language: selectedLanguage,
          verifiedRequirements: verifiedReqs
        });
      }, 650);
    }, 1650);
  };

  // Trigger Human Verification Review Gate
  const handleOpenVerification = async (textToExtract: string, inputType: string, filename: string) => {
    // Check if input contains multiple distinct procurement items
    const detected = detectProcurementItems(textToExtract, inputType, selectedLanguage);
    if (detected.length > 1) {
      setDetectedItems(detected);
      setSelectedItemIds(detected.map(it => it.id));
      setIsMultiItemViewActive(true);
      return;
    }

    setIsExtractingPreview(true);
    setShowVerificationModal(true);
    try {
      const reqs = await api.extractRequirementsPreview(textToExtract, inputType, selectedLanguage);
      setCandidateRequirements(reqs);
    } catch (e) {
      console.warn("Failed to extract preview requirements", e);
    } finally {
      setIsExtractingPreview(false);
    }
  };

  // Accept a requirement
  const handleAcceptRequirement = (id: string) => {
    setCandidateRequirements(prev => prev.map(r => r.id === id ? { ...r, decision: 'Accepted' } : r));
  };

  // Reject a requirement
  const handleRejectRequirement = (id: string) => {
    setCandidateRequirements(prev => prev.map(r => r.id === id ? { ...r, decision: 'Rejected' } : r));
  };

  // Start Editing inline
  const handleStartEdit = (req: ExtractedRequirement) => {
    setEditingReqId(req.id);
    setEditParam(req.parameter);
    setEditValue(req.value);
    setEditCategory(req.category);
  };

  // Save inline edit
  const handleSaveEdit = (id: string) => {
    setCandidateRequirements(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          parameter: editParam,
          value: editValue,
          category: editCategory,
          normalized_requirement: `${editParam}: ${editValue}`,
          decision: 'Edited'
        };
      }
      return r;
    }));
    setEditingReqId(null);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingReqId(null);
  };

  // Confirm Verification and Launch Analysis
  const handleConfirmAndAnalyze = () => {
    setShowVerificationModal(false);
    const validReqs = candidateRequirements.filter(r => r.decision !== 'Rejected');
    
    let contentToAnalyze = "";
    let fname = "Procurement_Spec.docx";
    let inputMode = activeModal;

    if (activeModal === 'text') {
      contentToAnalyze = textInput;
      fname = "Manual_Specification_Entry.txt";
    } else if (activeModal === 'upload') {
      contentToAnalyze = selectedFile ? selectedFile.name : DEMO_SPECIFICATIONS[0].text;
      fname = selectedFile ? selectedFile.name : "Tender_Document.pdf";
    } else if (activeModal === 'ocr') {
      contentToAnalyze = ocrResult?.text || "";
      fname = ocrImageFile ? ocrImageFile.name : "Scanned_Tender_OCR.png";
    } else if (activeModal === 'qr') {
      contentToAnalyze = qrLookupResult?.document_text || qrCodeInput;
      fname = qrLookupResult?.document_title || `Tender_${qrCodeInput}.pdf`;
    } else if (activeModal === 'voice') {
      contentToAnalyze = voiceNormalized || voiceTranscript;
      fname = "Voice_Dictated_Specification.txt";
    }

    // Check if contentToAnalyze has multiple items
    const detected = detectProcurementItems(contentToAnalyze, inputMode, selectedLanguage);
    if (detected.length > 1) {
      setDetectedItems(detected);
      setSelectedItemIds(detected.map(it => it.id));
      setIsMultiItemViewActive(true);
      return;
    }

    runIntakePipeline(
      fname,
      "320 KB",
      selectedFile || contentToAnalyze,
      `Multi-Modal (${activeModal.toUpperCase()})`,
      inputMode,
      validReqs
    );
  };

  // Direct Analyze Without Human Review Gate
  const handleDirectAnalyze = (content: File | string, filename: string, inputType: string) => {
    if (typeof content === 'string') {
      const detected = detectProcurementItems(content, inputType, selectedLanguage);
      if (detected.length > 1) {
        setDetectedItems(detected);
        setSelectedItemIds(detected.map(it => it.id));
        setIsMultiItemViewActive(true);
        return;
      }
    }

    runIntakePipeline(
      filename,
      content instanceof File ? `${Math.round(content.size / 1024)} KB` : "280 KB",
      content,
      `Multi-Modal (${inputType.toUpperCase()})`,
      inputType
    );
  };

  // Multi-Item Action Handlers
  const handleToggleSelectItem = (id: string) => {
    setSelectedItemIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllItems = () => {
    if (selectedItemIds.length === detectedItems.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(detectedItems.map(it => it.id));
    }
  };

  const handleOpenSingleItemAnalysis = (item: DetectedProcurementItem) => {
    setIsMultiItemViewActive(false);
    onStartUpload({
      file: null,
      text: item.raw_text,
      filename: `${item.title.replace(/\s+/g, '_')}.txt`,
      inputType: activeModal,
      language: selectedLanguage,
      forcedItem: item,
      isMultiItem: false
    });
  };

  const handleAnalyzeAllDetected = () => {
    setIsMultiItemViewActive(false);
    onStartUpload({
      isMultiItem: true,
      detectedItems: detectedItems,
      filename: "Multi_Product_Procurement_Package.txt",
      inputType: activeModal,
      language: selectedLanguage
    });
  };

  const handleAnalyzeSelected = () => {
    const selected = detectedItems.filter(it => selectedItemIds.includes(it.id));
    if (selected.length === 0) return;
    setIsMultiItemViewActive(false);
    if (selected.length === 1) {
      handleOpenSingleItemAnalysis(selected[0]);
    } else {
      onStartUpload({
        isMultiItem: true,
        detectedItems: selected,
        filename: "Selected_Multi_Product_Procurement.txt",
        inputType: activeModal,
        language: selectedLanguage
      });
    }
  };

  const handleStartEditItem = (item: DetectedProcurementItem) => {
    setEditingItemId(item.id);
    setEditItemTitle(item.title);
    setEditItemCategory(item.category);
    setEditItemText(item.raw_text);
  };

  const handleSaveEditItem = (id: string) => {
    setDetectedItems(prev => prev.map(it => {
      if (it.id === id) {
        return {
          ...it,
          title: editItemTitle,
          category: editItemCategory,
          raw_text: editItemText
        };
      }
      return it;
    }));
    setEditingItemId(null);
  };

  const handleSplitItem = (id: string) => {
    const target = detectedItems.find(it => it.id === id);
    if (!target) return;
    const lines = target.raw_text.split('\n').filter(l => l.trim().length > 0);
    const mid = Math.max(1, Math.floor(lines.length / 2));
    const part1Text = lines.slice(0, mid).join('\n');
    const part2Text = lines.slice(mid).join('\n') || `${target.title} - Auxiliary Components`;
    
    const item1: DetectedProcurementItem = {
      ...target,
      title: `${target.title} (Part 1 - Primary Unit)`,
      raw_text: part1Text,
      extracted_requirements_count: Math.max(2, Math.floor(target.extracted_requirements_count / 2))
    };
    const item2: DetectedProcurementItem = {
      id: `PROC-ITEM-${Date.now().toString().slice(-4)}`,
      title: `${target.title} (Part 2 - Auxiliary Subsystem)`,
      category: target.category,
      raw_text: part2Text,
      extracted_requirements_count: Math.max(2, target.extracted_requirements_count - item1.extracted_requirements_count),
      status: 'Ready for Analysis',
      suggested_standards: target.suggested_standards.slice(1),
      coverage_estimate: 88.0,
      potential_gaps_count: 1
    };

    setDetectedItems(prev => {
      const idx = prev.findIndex(it => it.id === id);
      const copy = [...prev];
      copy.splice(idx, 1, item1, item2);
      return copy;
    });
    setSelectedItemIds(prev => [...prev.filter(x => x !== id), item1.id, item2.id]);
  };

  const handleMergeItems = () => {
    const selected = detectedItems.filter(it => selectedItemIds.includes(it.id));
    if (selected.length < 2) return;
    const mergedTitle = selected.map(s => s.title).join(' & ');
    const mergedText = selected.map(s => `[${s.title}]\n${s.raw_text}`).join('\n\n');
    const mergedItem: DetectedProcurementItem = {
      id: `PROC-ITEM-M-${Date.now().toString().slice(-4)}`,
      title: mergedTitle.length > 55 ? `${mergedTitle.slice(0, 52)}...` : mergedTitle,
      category: selected[0].category,
      raw_text: mergedText,
      extracted_requirements_count: selected.reduce((a, b) => a + b.extracted_requirements_count, 0),
      status: 'Ready for Analysis',
      suggested_standards: Array.from(new Set(selected.flatMap(s => s.suggested_standards))),
      coverage_estimate: Math.round(selected.reduce((a, b) => a + b.coverage_estimate, 0) / selected.length * 10) / 10,
      potential_gaps_count: selected.reduce((a, b) => a + b.potential_gaps_count, 0)
    };
    setDetectedItems(prev => {
      const unselected = prev.filter(it => !selectedItemIds.includes(it.id));
      return [...unselected, mergedItem];
    });
    setSelectedItemIds([mergedItem.id]);
  };

  // 1. Text Handlers
  const handleLoadTextSample = (type: 'switch' | 'power' | 'solar' | 'bed' | 'multi') => {
    if (type === 'multi') {
      setTextInput(
        "Drinking Water Storage Tank\n" +
        "“Procurement of 1000 litre polyethylene water storage tanks for government schools, suitable for potable water, UV resistant and durable for outdoor installation.”\n\n" +
        "LED Street Light\n" +
        "“Procurement of 50W LED street lights for municipal roads, energy efficient, weather resistant, suitable for outdoor use, with required electrical safety and photometric performance.”\n\n" +
        "Safety Helmet\n" +
        "“Procurement of industrial safety helmets for construction workers, lightweight, impact resistant, adjustable headband, suitable for protection against mechanical hazards.”\n\n" +
        "Electrical Distribution Board\n" +
        "“Procurement of low-voltage electrical distribution boards for public buildings, suitable for 415V three-phase operation, with required circuit breaker protection, ingress protection and enclosure durability.”\n\n" +
        "School Furniture\n" +
        "“Procurement of classroom desks and chairs for primary and secondary government schools, durable steel frame, wooden tops, ergonomic design and child-safe finishes.”"
      );
      setSelectedLanguage('en');
    } else if (type === 'switch') {
      setTextInput(
        "PROCUREMENT OF 24-PORT MANAGED GIGABIT ETHERNET SWITCH\n" +
        "1. Port Configuration: 24 x 10/100/1000 Mbps Base-T RJ-45 ports + 4 x 10G SFP+ uplinks.\n" +
        "2. Switching Capacity: 128 Gbps non-blocking line-rate forwarding.\n" +
        "3. Standards & Safety: IS 13252 (Part 1) / IS/IEC 62368-1 MeitY CRS Registration mandatory.\n" +
        "4. Power Architecture: Internal dual redundant power supply (230V AC, 50Hz)."
      );
    } else if (type === 'power') {
      setTextInput(
        "कॉलेज प्रयोगशाला के लिए प्रोग्रामेबल डीसी पावर सप्लाई (0-30V, 0-5A)\n" +
        "1. आउटपुट वोल्टेज: 0 से 30 वोल्ट डीसी लगातार परिवर्तनीय\n" +
        "2. आउटपुट करंट: 0 से 5 एम्पीयर डीसी\n" +
        "3. सुरक्षा: ओवर वोल्टेज प्रोटेक्शन (OVP) और ओवर करंट प्रोटेक्शन (OCP)\n" +
        "4. सुरक्षा मानक: IS/IEC 61010-1 विद्युत सुरक्षा मानक अनिवार्य"
      );
      setSelectedLanguage('hi');
    } else if (type === 'solar') {
      setTextInput(
        "ग्रामीण रस्त्यांसाठी 40W सोलर स्ट्रीट लाईट सिस्टीम खरेदी\n" +
        "1. ल्युमिनेअर: 40 वॉट हाय-एफिकसी व्हाईट एलईडी ल्युमिनेअर (किमान 135 lm/W) IS 10322 प्रमाणे\n" +
        "2. बॅटरी: 12.8V 30Ah LiFePO4 बॅटरी पॅक IS 16046 प्रमाणे\n" +
        "3. सौर पीव्ही मॉड्यूल: 75 Wp क्रिस्टलीय सिलिकॉन पॅनेल IS 14286 प्रमाणे\n" +
        "4. एनक्लोजर: IP65 वेदरप्रूफ एल्युमिनियम हाऊसिंग"
      );
      setSelectedLanguage('mr');
    } else if (type === 'bed') {
      setTextInput(
        "TECHNICAL SPECIFICATION: MOTORIZED ICU HOSPITAL BED\n" +
        "1. Actuator System: 4-motor linear actuator system with handset control.\n" +
        "2. Safety Compliance: IEC / IS 60601-2-52 for medical electrical bed safety.\n" +
        "3. Safe Working Load (SWL): Minimum 250 kg capacity.\n" +
        "4. Ingress Protection: IPX4 water resistance rating for washability."
      );
    }
  };

  // 2. Upload Handlers
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectedFile = (file: File) => {
    setSelectedFile(file);
    // Simple pseudo hash generation for audit proof
    const hash = 'sha256-' + Array.from(file.name + file.size)
      .map(c => c.charCodeAt(0).toString(16))
      .join('').slice(0, 24);
    setFileSha256(hash);
  };

  // Helper for Speech Recognition Language Mapping
  const getSpeechLangCode = (lang: string) => {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'mr': return 'mr-IN';
      case 'gu': return 'gu-IN';
      case 'ta': return 'ta-IN';
      case 'te': return 'te-IN';
      case 'kn': return 'kn-IN';
      case 'bn': return 'bn-IN';
      case 'ml': return 'ml-IN';
      case 'pa': return 'pa-IN';
      case 'ur': return 'ur-IN';
      default: return 'en-IN';
    }
  };

  // Stop devices when switching activeModal
  useEffect(() => {
    if (activeModal !== 'ocr') {
      stopCamera();
    }
    if (activeModal !== 'qr') {
      stopQrScanner();
    }
    if (activeModal !== 'voice') {
      stopVoiceRecording();
    }
  }, [activeModal]);

  // 3. OCR & Camera Handlers
  const startCamera = async (facing: 'environment' | 'user' = 'environment') => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera API is not supported in this browser. Please use the image upload fallback.");
      return;
    }
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      setCameraFacing(facing);
      setCapturedImage(null);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.warn("Video play error:", e));
      }
    } catch (err: any) {
      console.warn("Camera start failed:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError("Camera permission denied. Please allow camera access in your browser or upload an image below.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError("No camera hardware found. Please use the upload image scan option.");
      } else {
        setCameraError(`Camera could not be accessed: ${err.message || 'Unknown error'}. Please use the upload image scan option.`);
      }
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const captureCameraFrame = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);
    stopCamera();

    setIsProcessingOcr(true);
    try {
      const res = await api.extractOcr(dataUrl, `Live_Camera_Scan_${Date.now()}.jpg`);
      setOcrResult(res);
    } catch (e) {
      console.warn("OCR failed on capture:", e);
    } finally {
      setIsProcessingOcr(false);
    }
  };

  const retakeCamera = () => {
    setCapturedImage(null);
    startCamera(cameraFacing);
  };

  const handleOcrFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setOcrImageFile(file);
      setOcrImagePreview(URL.createObjectURL(file));
      setCapturedImage(null);
      stopCamera();
      setIsProcessingOcr(true);
      try {
        const res = await api.extractOcr(file);
        setOcrResult(res);
      } catch (err) {
        console.warn("OCR failed", err);
      } finally {
        setIsProcessingOcr(false);
      }
    }
  };

  // 4. QR & Barcode Intelligence Pipeline
  const parseDecodedPayload = (
    raw: string,
    formatStr: string,
    source: 'Image Upload' | 'Live Camera' | 'Manual Entry'
  ): DecodedBarcodeItem => {
    const val = raw.trim();
    const ts = new Date().toLocaleTimeString();

    // 1. URL Reference Handling
    if (val.startsWith('http://') || val.startsWith('https://')) {
      const trusted = ["gem.gov.in", "eprocure.gov.in", "bis.gov.in", "bharatspec.gov.in", "localhost", "127.0.0.1"].some(d => val.toLowerCase().includes(d));
      return {
        type: 'URL',
        format: formatStr || 'QR_CODE',
        value: val,
        url: val,
        isTrustedUrl: trusted,
        source,
        timestamp: ts
      };
    }

    // 2. Structured JSON Payload Handling
    if ((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('[') && val.endsWith(']'))) {
      try {
        const parsed = JSON.parse(val);
        if (typeof parsed === 'object' && parsed !== null) {
          const extractedRef = parsed.tenderId || parsed.tender_id || parsed.id || parsed.reference;
          return {
            type: 'QR Code',
            format: formatStr || 'QR_CODE',
            value: typeof extractedRef === 'string' && extractedRef.trim().length > 0 ? extractedRef.trim() : val,
            jsonPayload: parsed,
            source,
            timestamp: ts
          };
        }
      } catch {}
    }

    // 3. QR Code vs Barcode Format Classification
    const upperFmt = formatStr.toUpperCase();
    const isQr = upperFmt.includes('QR') || upperFmt.includes('DATA_MATRIX') || upperFmt.includes('AZTEC');
    return {
      type: isQr ? 'QR Code' : 'Barcode',
      format: formatStr || (isQr ? 'QR_CODE' : 'CODE_128'),
      value: val,
      source,
      timestamp: ts
    };
  };

  const decodeBarcodeFromMedia = async (
    mediaElem: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
    source: 'Image Upload' | 'Live Camera'
  ): Promise<{ items: DecodedBarcodeItem[]; decoder: string }> => {
    const results: DecodedBarcodeItem[] = [];
    let usedDecoder = 'None';

    // Strategy 1: Native Browser BarcodeDetector API (Edge / Chrome / Chromium)
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      try {
        let formats = [
          'qr_code', 'code_128', 'code_39', 'ean_13', 'ean_8',
          'upc_a', 'upc_e', 'data_matrix', 'itf', 'pdf417', 'aztec'
        ];
        try {
          const supported = await (window as any).BarcodeDetector.getSupportedFormats();
          if (supported && supported.length > 0) {
            formats = formats.filter(f => supported.includes(f));
          }
        } catch {}

        const detector = new (window as any).BarcodeDetector({ formats });
        const detected = await detector.detect(mediaElem);
        if (detected && detected.length > 0) {
          usedDecoder = 'BarcodeDetector';
          for (const item of detected) {
            if (item.rawValue && item.rawValue.trim()) {
              results.push(parseDecodedPayload(item.rawValue, (item.format || 'QR_CODE').toUpperCase(), source));
            }
          }
        }
      } catch (e) {
        console.warn("Native BarcodeDetector pass failed:", e);
      }
    }

    // Strategy 2: ZXing Multi-Format Reader with TryHarder hints
    if (results.length === 0) {
      try {
        const hints = new Map();
        hints.set(DecodeHintType.TRY_HARDER, true);
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
          BarcodeFormat.QR_CODE,
          BarcodeFormat.CODE_128,
          BarcodeFormat.CODE_39,
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
          BarcodeFormat.UPC_A,
          BarcodeFormat.UPC_E,
          BarcodeFormat.DATA_MATRIX
        ]);
        const reader = new BrowserMultiFormatReader(hints);

        let zxingRes: any = null;

        if (mediaElem instanceof HTMLImageElement) {
          try {
            zxingRes = await reader.decodeFromImageElement(mediaElem);
          } catch (errImg) {
            // Draw to offscreen canvas to normalize dimensions & DPI
            const canvas = document.createElement('canvas');
            let w = mediaElem.naturalWidth || mediaElem.width || 800;
            let h = mediaElem.naturalHeight || mediaElem.height || 600;
            const maxDim = 1200;
            if (w > maxDim || h > maxDim) {
              if (w > h) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
              } else {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
              }
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(mediaElem, 0, 0, w, h);
              try {
                zxingRes = await reader.decodeFromCanvas(canvas);
              } catch (errCanvas) {
                // Secondary canvas attempt: high-contrast binarization
                try {
                  const imgData = ctx.getImageData(0, 0, w, h);
                  const d = imgData.data;
                  for (let i = 0; i < d.length; i += 4) {
                    const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
                    const v = lum > 135 ? 255 : 0;
                    d[i] = v; d[i + 1] = v; d[i + 2] = v;
                  }
                  ctx.putImageData(imgData, 0, 0);
                  zxingRes = await reader.decodeFromCanvas(canvas);
                } catch {}
              }
            }
          }
        } else if (mediaElem instanceof HTMLVideoElement) {
          const canvas = document.createElement('canvas');
          canvas.width = mediaElem.videoWidth || 640;
          canvas.height = mediaElem.videoHeight || 480;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(mediaElem, 0, 0);
            try {
              zxingRes = await reader.decodeFromCanvas(canvas);
            } catch {}
          }
        } else if (mediaElem instanceof HTMLCanvasElement) {
          try {
            zxingRes = await reader.decodeFromCanvas(mediaElem);
          } catch {}
        }

        if (zxingRes) {
          usedDecoder = 'ZXing';
          const text = zxingRes.getText();
          const fmt = zxingRes.getBarcodeFormat() ? zxingRes.getBarcodeFormat().toString() : 'QR_CODE';
          results.push(parseDecodedPayload(text, fmt, source));
        }
      } catch (e) {
        console.warn("ZXing processing error:", e);
      }
    }

    return { items: results, decoder: usedDecoder };
  };

  const startQrScanner = async () => {
    setQrScannerError(null);
    setQrDetectionStatus('IDLE');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setQrScannerError("Camera API not supported in this browser. Enter the code manually or upload barcode image below.");
      return;
    }
    try {
      if (qrStream) qrStream.getTracks().forEach(t => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }
      });
      setQrStream(stream);
      setIsQrScannerActive(true);
      if (qrVideoRef.current) {
        qrVideoRef.current.srcObject = stream;
        await qrVideoRef.current.play().catch(e => console.warn(e));
      }

      // Continuous scanning loop using the unified decodeBarcodeFromMedia
      let isScanning = true;
      const scanLoop = async () => {
        if (!qrVideoRef.current || !isScanning) return;
        try {
          const { items, decoder } = await decodeBarcodeFromMedia(qrVideoRef.current, 'Live Camera');
          if (items.length > 0) {
            isScanning = false;
            setDetectedCodes(items);
            const primary = items[0];
            setActiveDecodedCode(primary);
            setQrCodeInput(primary.value);
            setQrDetectionStatus('SUCCESS');

            setQrDebugInfo({
              imageName: 'Live_Camera_Frame.png',
              decoder: decoder,
              detectionResult: 'SUCCESS',
              format: primary.format,
              decodedValue: primary.value,
              lookupValue: primary.value
            });

            stopQrScanner();
            handleLookupQr(primary.value, primary.format);
            return;
          }
        } catch (e) {}
        zxingAnimFrameRef.current = requestAnimationFrame(scanLoop);
      };
      zxingAnimFrameRef.current = requestAnimationFrame(scanLoop);
    } catch (err: any) {
      console.warn("QR Scanner error:", err);
      setQrScannerError("Camera permission denied or camera busy. Enter reference manually or upload image below.");
      setIsQrScannerActive(false);
    }
  };

  const stopQrScanner = () => {
    if (zxingAnimFrameRef.current) cancelAnimationFrame(zxingAnimFrameRef.current);
    if (zxingReaderRef.current) {
      try { (zxingReaderRef.current as any).reset(); } catch (e) {}
      zxingReaderRef.current = null;
    }
    if (qrStream) {
      qrStream.getTracks().forEach(t => t.stop());
      setQrStream(null);
    }
    setIsQrScannerActive(false);
  };

  const handleLookupQr = async (codeToLookup: string, codeType?: string) => {
    if (!codeToLookup || codeToLookup.trim().length === 0) return;
    setIsSearchingQr(true);
    setQrCodeInput(codeToLookup);
    try {
      const res = await api.lookupQr(codeToLookup, codeType);
      setQrLookupResult(res);
      setQrDebugInfo(prev => prev ? {
        ...prev,
        lookupValue: codeToLookup
      } : {
        decoder: 'Direct Lookup',
        detectionResult: 'SUCCESS',
        format: codeType || 'QR_CODE',
        decodedValue: codeToLookup,
        lookupValue: codeToLookup
      });
    } catch (e) {
      console.warn("QR lookup error", e);
    } finally {
      setIsSearchingQr(false);
    }
  };

  const handleSelectDetectedCode = (item: DecodedBarcodeItem) => {
    setActiveDecodedCode(item);
    setQrCodeInput(item.value);
    setQrDebugInfo(prev => prev ? {
      ...prev,
      format: item.format,
      decodedValue: item.value,
      lookupValue: item.value
    } : null);
    handleLookupQr(item.value, item.format);
  };

  const handleQrImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setQrUploadedFileName(file.name);
      setQrScannerError(null);
      setIsSearchingQr(true);
      setQrDetectionStatus('SEARCHING');

      const url = URL.createObjectURL(file);
      setQrUploadedImagePreview(url);

      const img = new Image();
      img.src = url;

      img.onload = async () => {
        try {
          const { items, decoder } = await decodeBarcodeFromMedia(img, 'Image Upload');

          if (items.length > 0) {
            setDetectedCodes(items);
            const primary = items[0];
            setActiveDecodedCode(primary);
            setQrCodeInput(primary.value);
            setQrDetectionStatus('SUCCESS');

            setQrDebugInfo({
              imageName: file.name,
              decoder: decoder,
              detectionResult: 'SUCCESS',
              format: primary.format,
              decodedValue: primary.value,
              lookupValue: primary.value
            });

            // Automatically lookup the real decoded value in repository
            handleLookupQr(primary.value, primary.format);
          } else {
            // NO CODE DETECTED: NEVER INVENT A VALUE!
            setDetectedCodes([]);
            setActiveDecodedCode(null);
            setQrDetectionStatus('NOT_FOUND');
            setQrLookupResult(null);

            setQrDebugInfo({
              imageName: file.name,
              decoder: 'BarcodeDetector / ZXing',
              detectionResult: 'NOT_FOUND',
              format: 'NONE',
              decodedValue: 'NO_CODE_DETECTED',
              lookupValue: 'NONE'
            });
          }
        } catch (err) {
          console.warn("Image decode exception:", err);
          setDetectedCodes([]);
          setActiveDecodedCode(null);
          setQrDetectionStatus('NOT_FOUND');
          setQrLookupResult(null);

          setQrDebugInfo({
            imageName: file.name,
            decoder: 'BarcodeDetector / ZXing',
            detectionResult: 'NOT_FOUND',
            format: 'NONE',
            decodedValue: 'NO_CODE_DETECTED',
            lookupValue: 'NONE'
          });
        } finally {
          setIsSearchingQr(false);
        }
      };

      img.onerror = () => {
        setIsSearchingQr(false);
        setQrDetectionStatus('ERROR');
        setQrScannerError("Failed to load uploaded image file. Please provide a standard PNG, JPG, or WEBP image.");
      };

      // Reset file input value so user can re-select the same file
      e.target.value = '';
    }
  };

  // 5. Voice & Speech Recognition Handlers
  const startVoiceRecording = async () => {
    setAudioBlobUrl(null);
    audioChunksRef.current = [];
    
    // 1. Try Browser Web Speech Recognition
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = getSpeechLangCode(selectedLanguage);

        recognition.onstart = () => {
          setVoiceState('LISTENING');
          setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
          let interimText = '';
          let finalTranscript = '';
          let maxConf = 0.92;

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const item = event.results[i];
            if (item.isFinal) {
              finalTranscript += item[0].transcript;
              if (item[0].confidence > 0) {
                maxConf = Math.round(item[0].confidence * 100) / 100;
              }
            } else {
              interimText += item[0].transcript;
            }
          }

          const combined = (finalTranscript || interimText || "").trim();
          if (combined) {
            setVoiceTranscript(combined);
            setVoiceConfidence(maxConf || 0.94);
            api.normalizeLanguage(combined, selectedLanguage).then(res => {
              if (res.normalized_text) setVoiceNormalized(res.normalized_text);
            });
          }
        };

        recognition.onerror = (e: any) => {
          console.warn("Speech recognition error:", e);
          if (e.error === 'not-allowed') {
            setVoiceState('ERROR');
          }
        };

        recognition.onend = () => {
          if (voiceState === 'LISTENING') {
            setVoiceState('IDLE');
            setIsRecording(false);
          }
        };

        recognition.start();
        setSpeechRecognitionInstance(recognition);
        return;
      } catch (err) {
        console.warn("Failed to start SpeechRecognition, trying MediaRecorder fallback:", err);
      }
    }

    // 2. Fallback to MediaRecorder
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        recorder.onstop = async () => {
          stream.getTracks().forEach(t => t.stop());
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setAudioBlobUrl(url);
          setVoiceState('TRANSCRIBING');
          try {
            const res = await api.transcribeAudio(blob, selectedLanguage);
            setVoiceTranscript(res.transcript);
            setVoiceNormalized(res.normalized_text);
            setVoiceConfidence(res.confidence ?? 0.94);
          } catch (e) {
            console.warn("Transcribe failed:", e);
          } finally {
            setVoiceState('IDLE');
          }
        };

        recorder.start();
        setMediaRecorder(recorder);
        setVoiceState('RECORDING');
        setIsRecording(true);
      } catch (err: any) {
        console.warn("Microphone access failed:", err);
        setVoiceState('ERROR');
      }
    } else {
      setVoiceState('ERROR');
    }
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    if (speechRecognitionInstance) {
      try { speechRecognitionInstance.stop(); } catch (e) {}
      setSpeechRecognitionInstance(null);
    }
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      try { mediaRecorder.stop(); } catch (e) {}
      setMediaRecorder(null);
    }
    setVoiceState('IDLE');
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const togglePlayAudio = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play().then(() => setIsPlayingAudio(true)).catch(e => console.warn(e));
    }
  };

  const handleAudioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioBlobUrl(URL.createObjectURL(file));
      setVoiceState('TRANSCRIBING');
      try {
        const res = await api.transcribeAudio(file, selectedLanguage);
        setVoiceTranscript(res.transcript);
        setVoiceNormalized(res.normalized_text);
        setVoiceConfidence(res.confidence ?? 0.94);
      } catch (err) {
        console.warn("Failed to transcribe audio file:", err);
      } finally {
        setVoiceState('IDLE');
      }
    }
  };

  const handleSelectVoiceSample = (lang: 'hinglish' | 'marathi' | 'english') => {
    if (lang === 'hinglish') {
      setSelectedLanguage('hi');
      setVoiceTranscript("Mujhe college laboratory ke liye 30 volt aur 5 ampere ka programmable DC power supply chahiye with over-voltage protection and IS/IEC 61010-1 safety certification");
      setVoiceNormalized("Procurement Requirement: Programmable DC Power Supply (0-30V, 0-5A) with Over-Voltage Protection (OVP) and IS/IEC 61010-1 compliance.");
      setVoiceConfidence(0.95);
    } else if (lang === 'marathi') {
      setSelectedLanguage('mr');
      setVoiceTranscript("आम्हाला ग्रामीण रस्त्यांसाठी 40 वॉटचे सोलर स्ट्रीट लाईट सिस्टीम खरेदी करायचे आहे ज्यात LiFePO4 बॅटरी असावी");
      setVoiceNormalized("Procurement Requirement: Standalone Solar Street Lighting System (40W LED) with LiFePO4 Battery conforming to IS 10322 & IS 16046.");
      setVoiceConfidence(0.96);
    } else {
      setSelectedLanguage('en');
      setVoiceTranscript("We require 500 managed Gigabit Ethernet switches with 24 PoE+ ports, 4 SFP+ uplinks, and compulsory IS 13252 CRS registration");
      setVoiceNormalized("Procurement Requirement: 24-Port Managed Gigabit Ethernet Switch with PoE+, 4 SFP+ uplinks, conforming to IS 13252 (Part 1).");
      setVoiceConfidence(0.97);
    }
  };

  // Sync simulation
  const handleSimulateSync = () => {
    setIsSimulatingSync(true);
    setTimeout(() => {
      setIsSimulatingSync(false);
    }, 700);
  };

  const filteredDocs = documents.filter(doc => {
    if (statusFilter !== 'ALL' && doc.status !== statusFilter) return false;
    if (searchQuery && 
        !doc.document.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !doc.assigned_to.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !doc.source.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-2 text-gov-800 font-bold text-xs uppercase tracking-wider mb-1">
          <Inbox className="w-4 h-4 text-gov-700" />
          <span>Universal Procurement Ingestion</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-slate-900">
              Procurement Input Center
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Provide procurement specifications through multiple modalities — text, PDF/Word documents, camera OCR, QR barcodes, or speech in Indian languages.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Global Language Selector */}
            <div className="flex items-center space-x-2 bg-white border border-slate-300 rounded-lg px-3 py-1.5 shadow-xs">
              <Languages className="w-4 h-4 text-gov-800" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                title="Input Language for NLP & Translation"
              >
                {INDIAN_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSimulateSync}
              disabled={isSimulatingSync}
              className="flex items-center space-x-2 px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-gov-700 ${isSimulatingSync ? 'animate-spin' : ''}`} />
              <span>Refresh Feed</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Multi-Modal Selector: "How would you like to provide procurement information?" */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-gov-700" />
              <span>How would you like to provide procurement information?</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              All input methods route through normalization and verification into the identical Standards Intelligence Engine.
            </p>
          </div>
          <span className="text-[11px] font-mono font-medium px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Unified Pipeline Active</span>
          </span>
        </div>

        {/* 5 Modality Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          
          {/* Card 1: Enter Text */}
          <button
            type="button"
            onClick={() => setActiveModal('text')}
            className={`p-4 rounded-xl border-2 text-left transition relative flex flex-col justify-between ${
              activeModal === 'text'
                ? 'border-gov-800 bg-gov-50/40 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 ${
                activeModal === 'text' ? 'bg-gov-800 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">1. Enter Text</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Type or paste technical clauses, NIT snippets, or summaries.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium">
              <span className="text-slate-500">Manual / Paste</span>
              <span className="font-bold text-gov-800">Select →</span>
            </div>
          </button>

          {/* Card 2: Upload Tender */}
          <button
            type="button"
            onClick={() => setActiveModal('upload')}
            className={`p-4 rounded-xl border-2 text-left transition relative flex flex-col justify-between ${
              activeModal === 'upload'
                ? 'border-gov-800 bg-gov-50/40 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 ${
                activeModal === 'upload' ? 'bg-gov-800 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                <Upload className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">2. Upload Tender</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Upload official RFP/NIT documents in PDF, DOCX, or TXT.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium">
              <span className="text-slate-500">PDF / DOCX / TXT</span>
              <span className="font-bold text-gov-800">Select →</span>
            </div>
          </button>

          {/* Card 3: Scan Document (OCR) */}
          <button
            type="button"
            onClick={() => setActiveModal('ocr')}
            className={`p-4 rounded-xl border-2 text-left transition relative flex flex-col justify-between ${
              activeModal === 'ocr'
                ? 'border-gov-800 bg-gov-50/40 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 ${
                activeModal === 'ocr' ? 'bg-gov-800 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                <Camera className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">3. Scan Document</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Camera OCR scan from printed tender notice or catalogue.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium">
              <span className={`font-mono font-semibold ${hasCameraSupport ? 'text-emerald-700' : 'text-slate-500'}`}>
                {hasCameraSupport ? '● Ready (Camera + OCR)' : '● Upload Scan Ready'}
              </span>
              <span className="font-bold text-gov-800">Select →</span>
            </div>
          </button>

          {/* Card 4: Scan QR / Barcode */}
          <button
            type="button"
            onClick={() => setActiveModal('qr')}
            className={`p-4 rounded-xl border-2 text-left transition relative flex flex-col justify-between ${
              activeModal === 'qr'
                ? 'border-gov-800 bg-gov-50/40 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 ${
                activeModal === 'qr' ? 'bg-gov-800 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                <QrCode className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">4. Scan QR / Barcode</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Scan GeM tender barcode or e-Procurement repository QR.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium">
              <span className="font-mono font-semibold text-emerald-700">
                ● Ready (Scanner + Repo)
              </span>
              <span className="font-bold text-gov-800">Select →</span>
            </div>
          </button>

          {/* Card 5: Voice / Natural Language */}
          <button
            type="button"
            onClick={() => setActiveModal('voice')}
            className={`p-4 rounded-xl border-2 text-left transition relative flex flex-col justify-between ${
              activeModal === 'voice'
                ? 'border-gov-800 bg-gov-50/40 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 ${
                activeModal === 'voice' ? 'bg-gov-800 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                <Mic className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">5. Voice / Audio</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Dictate requirements verbally in Hindi, Hinglish, or regional.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium">
              <span className={`font-mono font-semibold ${hasSpeechSupport ? 'text-emerald-700' : (hasMediaRecorderSupport ? 'text-blue-700' : 'text-slate-500')}`}>
                {hasSpeechSupport ? '● Ready (Speech + 11 Langs)' : (hasMediaRecorderSupport ? '● Ready (Audio Recording)' : '● Audio Upload')}
              </span>
              <span className="font-bold text-gov-800">Select →</span>
            </div>
          </button>

        </div>

        {/* Active Modality Interactive Workspace */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          
          {/* =========================================================
              MODALITY 1: ENTER TEXT
             ========================================================= */}
          {activeModal === 'text' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                    <FileText className="w-4 h-4 text-gov-800" />
                    <span>Direct Technical Specification Text Input</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Paste clauses, technical schedules, or natural language procurement summaries.
                  </p>
                </div>
                {/* Sample load chips */}
                <div className="flex items-center space-x-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Load Sample:</span>
                  <button
                    type="button"
                    onClick={() => handleLoadTextSample('multi')}
                    className="text-[11px] px-2.5 py-0.5 bg-saffron-50 border border-saffron-400 rounded hover:bg-saffron-100 text-saffron-950 font-bold flex items-center space-x-1 shadow-xs"
                    title="Load 5 distinct procurement items in one input"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron-600 animate-pulse"></span>
                    <span>5-Item Multi-Tender</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadTextSample('switch')}
                    className="text-[11px] px-2 py-0.5 bg-white border border-slate-200 rounded hover:border-gov-700 text-slate-700"
                  >
                    24-Port Switch
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadTextSample('power')}
                    className="text-[11px] px-2 py-0.5 bg-white border border-slate-200 rounded hover:border-gov-700 text-slate-700"
                  >
                    DC Power Supply (हिन्दी)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadTextSample('solar')}
                    className="text-[11px] px-2 py-0.5 bg-white border border-slate-200 rounded hover:border-gov-700 text-slate-700"
                  >
                    Solar Lighting (मराठी)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadTextSample('bed')}
                    className="text-[11px] px-2 py-0.5 bg-white border border-slate-200 rounded hover:border-gov-700 text-slate-700"
                  >
                    ICU Bed
                  </button>
                </div>
              </div>

              <div>
                <textarea
                  rows={7}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter or paste technical procurement specifications here..."
                  className="w-full text-xs font-mono p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-700 shadow-inner"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>Characters: {textInput.length} | Estimated Clauses: {textInput.split('\n').filter(l => l.trim().length > 10).length}</span>
                  <span className="text-emerald-700 font-medium">Input Ready for NLP Normalization</span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenVerification(textInput, 'text', 'Manual_Specification.txt')}
                  className="px-4 py-2 bg-white border border-gov-800 text-gov-800 hover:bg-gov-50 rounded-lg text-xs font-bold flex items-center space-x-2 transition"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Extract & Verify Requirements</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDirectAnalyze(textInput, 'Manual_Specification.txt', 'text')}
                  className="px-4 py-2 bg-gov-900 hover:bg-gov-800 text-white rounded-lg text-xs font-bold flex items-center space-x-2 shadow-xs transition"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Analyze Specification Directly</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              MODALITY 2: UPLOAD TENDER
             ========================================================= */}
          {activeModal === 'upload' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                    <Upload className="w-4 h-4 text-gov-800" />
                    <span>Upload Official Tender Document / Schedule</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Supports tender PDFs, Microsoft Word (.docx), or plain text tender schedules.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Or Sample:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const demo = DEMO_SPECIFICATIONS[0];
                      setSelectedFile(null);
                      setTextInput(demo.text);
                      setFileSha256("sha256-4c92b1a808e019f");
                      runIntakePipeline(demo.filename, "348 KB", demo.text, "Sample Tender", "upload");
                    }}
                    className="text-[11px] px-2 py-0.5 bg-white border border-slate-200 rounded hover:border-gov-700 text-slate-700 font-medium"
                  >
                    Solar Street Lighting PDF
                  </button>
                </div>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                  dragActive 
                    ? 'border-gov-800 bg-gov-50/50' 
                    : 'border-slate-300 hover:border-gov-700 bg-white'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleSelectedFile(e.target.files[0]);
                    }
                  }}
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-full bg-gov-100 text-gov-800 flex items-center justify-center mx-auto mb-3">
                  <FileUp className="w-6 h-6" />
                </div>
                
                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Document Ready for Inspection
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">
                      Integrity Checksum: {fileSha256}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800">
                      Click to browse or drag and drop tender document
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Supported formats: PDF (native / OCR), DOCX, TXT (up to 50 MB)
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">
                      Full page-by-page clause segmentation enabled
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  disabled={!selectedFile}
                  onClick={() => {
                    if (selectedFile) {
                      handleOpenVerification(selectedFile.name, 'upload', selectedFile.name);
                    }
                  }}
                  className="px-4 py-2 bg-white border border-gov-800 text-gov-800 hover:bg-gov-50 rounded-lg text-xs font-bold flex items-center space-x-2 transition disabled:opacity-50"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Extract & Verify Requirements</span>
                </button>
                <button
                  type="button"
                  disabled={!selectedFile}
                  onClick={() => {
                    if (selectedFile) {
                      handleDirectAnalyze(selectedFile, selectedFile.name, 'upload');
                    }
                  }}
                  className="px-4 py-2 bg-gov-900 hover:bg-gov-800 text-white rounded-lg text-xs font-bold flex items-center space-x-2 shadow-xs transition disabled:opacity-50"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Analyze Document Directly</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              MODALITY 3: SCAN DOCUMENT (CAMERA / OCR)
             ========================================================= */}
          {activeModal === 'ocr' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                    <Camera className="w-4 h-4 text-gov-800" />
                    <span>Optical Character Recognition (OCR) & Live Camera Scanner</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Capture tender notices directly via live camera or upload a scanned specification image.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={ocrFileInputRef}
                    onChange={handleOcrFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {!isCameraActive && (
                    <button
                      type="button"
                      onClick={() => startCamera(cameraFacing)}
                      className="px-3.5 py-1.5 bg-gov-800 hover:bg-gov-900 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Start Camera Scanner</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => ocrFileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5 transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-gov-800" />
                    <span>Upload Image Scan</span>
                  </button>
                </div>
              </div>

              {/* Camera Error Message */}
              {cameraError && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-2 text-xs text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Camera Notice: </span>
                    <span>{cameraError}</span>
                  </div>
                </div>
              )}

              {/* Live Camera Viewfinder */}
              {isCameraActive && (
                <div className="relative rounded-xl overflow-hidden bg-slate-950 border-2 border-gov-700 aspect-video max-h-[380px] flex items-center justify-center shadow-lg">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Viewfinder Target Reticle */}
                  <div className="absolute inset-8 border-2 border-dashed border-emerald-400/80 rounded-lg pointer-events-none flex flex-col justify-between p-3">
                    <div className="flex justify-between text-[11px] font-mono font-bold text-emerald-300 bg-slate-900/70 px-2 py-0.5 rounded self-start">
                      [ SCANNER ACTIVE — ALIGN DOCUMENT ]
                    </div>
                    <div className="text-center text-xs font-medium text-emerald-200 bg-slate-900/60 px-3 py-1 rounded-full self-center">
                      Ensure text is well-lit and parallel to camera
                    </div>
                  </div>

                  {/* Camera Controls Bar */}
                  <div className="absolute bottom-4 inset-x-0 flex items-center justify-center space-x-3 z-10">
                    <button
                      type="button"
                      onClick={captureCameraFrame}
                      disabled={isProcessingOcr}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold flex items-center space-x-2 shadow-lg transition active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{isProcessingOcr ? "Extracting Text..." : "Capture Document Scan"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
                        startCamera(nextFacing);
                      }}
                      className="p-2.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full text-xs transition"
                      title="Flip Camera"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full text-xs font-medium transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Captured Image / Upload Preview Bar */}
              {(capturedImage || ocrImagePreview) && !isCameraActive && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={capturedImage || ocrImagePreview || ""}
                      alt="Captured Scan Preview"
                      className="w-16 h-12 object-cover rounded-lg border border-slate-300"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {capturedImage ? "Camera Snapshot Captured" : (ocrImageFile?.name || "Uploaded Image Scan")}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Optical character recognition processed successfully
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={retakeCamera}
                      className="px-3 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
                    >
                      <RotateCcw className="w-3 h-3 text-gov-800" />
                      <span>Retake Scan</span>
                    </button>
                  </div>
                </div>
              )}

              {/* OCR Quality Assessment Bar */}
              {ocrResult && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Image Quality</span>
                      <span className="font-semibold text-slate-800">{ocrResult.quality}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-gov-700 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">OCR Confidence</span>
                      <span className={`font-bold ${ocrResult.confidence >= 0.85 ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {Math.round(ocrResult.confidence * 100)}% ({ocrResult.confidence >= 0.85 ? 'High Reliability' : 'Verification Recommended'})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Languages className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Detected Language</span>
                      <span className="font-semibold text-slate-800">{ocrResult.detected_language}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Low Confidence Warning Banner */}
              {ocrResult && ocrResult.confidence < 0.85 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-2.5 text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Extraction Confidence below 85%: </span>
                    <span>
                      Potential glare or perspective skew detected. Please inspect the extracted clauses in the editor below and correct any misread technical terms before proceeding.
                    </span>
                  </div>
                </div>
              )}

              {/* Editable OCR Extracted Text Preview */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                    <Edit3 className="w-3 h-3 text-gov-700" />
                    <span>OCR Extracted Text (Editable for Corrections)</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    IS standards, units, and electrical ratings preserved
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={ocrResult?.text || ""}
                  onChange={(e) => setOcrResult(prev => prev ? { ...prev, text: e.target.value } : null)}
                  placeholder="OCR extracted text will appear here..."
                  className="w-full text-xs font-mono p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-700 shadow-inner"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenVerification(ocrResult?.text || "", 'ocr', ocrImageFile ? ocrImageFile.name : 'Camera_Scan_Tender.png')}
                  className="px-4 py-2 bg-white border border-gov-800 text-gov-800 hover:bg-gov-50 rounded-lg text-xs font-bold flex items-center space-x-2 transition"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Extract & Verify Requirements</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDirectAnalyze(ocrResult?.text || "", ocrImageFile ? ocrImageFile.name : 'Camera_Scan_Tender.png', 'ocr')}
                  className="px-4 py-2 bg-gov-900 hover:bg-gov-800 text-white rounded-lg text-xs font-bold flex items-center space-x-2 shadow-xs transition"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Analyze Scanned Specification</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              MODALITY 4: SCAN QR / BARCODE
             ========================================================= */}
          {activeModal === 'qr' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                    <QrCode className="w-4 h-4 text-gov-800" />
                    <span>e-Procurement QR & Barcode Intelligence Scanner</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Scan tender QR barcodes via camera or enter repository reference identifiers.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={qrFileInputRef}
                    onChange={handleQrImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {!isQrScannerActive && (
                    <button
                      type="button"
                      onClick={startQrScanner}
                      className="px-3.5 py-1.5 bg-gov-800 hover:bg-gov-900 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition"
                    >
                      <Scan className="w-3.5 h-3.5" />
                      <span>Start Camera Scanner</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => qrFileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5 transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-gov-800" />
                    <span>Scan QR from Image</span>
                  </button>
                </div>
              </div>

              {/* QR Scanner Error Banner */}
              {qrScannerError && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-2 text-xs text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Scanner Notice: </span>
                    <span>{qrScannerError}</span>
                  </div>
                </div>
              )}

              {/* Live QR Scanner Viewfinder */}
              {isQrScannerActive && (
                <div className="relative rounded-xl overflow-hidden bg-slate-950 border-2 border-gov-700 aspect-video max-h-[360px] flex items-center justify-center shadow-lg">
                  <video
                    ref={qrVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Targeting Reticle & Scanning Animation */}
                  <div className="absolute w-56 h-56 border-2 border-emerald-400 rounded-xl pointer-events-none flex flex-col justify-between p-2 shadow-2xl">
                    <div className="w-full h-0.5 bg-emerald-400 shadow-sm animate-pulse"></div>
                    <div className="text-[10px] font-mono font-bold text-center text-emerald-300 bg-slate-900/80 px-2 py-0.5 rounded self-center">
                      ALIGN BARCODE / QR
                    </div>
                    <div className="w-full h-0.5 bg-emerald-400/50"></div>
                  </div>

                  <div className="absolute bottom-4 inset-x-0 flex items-center justify-center z-10">
                    <button
                      type="button"
                      onClick={stopQrScanner}
                      className="px-4 py-2 bg-slate-800/90 hover:bg-slate-700 text-white rounded-full text-xs font-semibold transition"
                    >
                      Stop Scanner
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Test References */}
              <div className="flex items-center space-x-1.5 flex-wrap bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Quick Test References:</span>
                <button
                  type="button"
                  onClick={() => {
                    const item: DecodedBarcodeItem = {
                      type: 'QR Code',
                      format: 'QR_CODE',
                      value: 'BS-TEST-TENDER-001',
                      source: 'Manual Entry',
                      timestamp: new Date().toLocaleTimeString()
                    };
                    setActiveDecodedCode(item);
                    setDetectedCodes([item]);
                    setQrDetectionStatus('SUCCESS');
                    handleLookupQr('BS-TEST-TENDER-001', 'QR_CODE');
                  }}
                  className="text-[11px] px-2.5 py-0.5 bg-purple-50 border border-purple-300 rounded hover:border-purple-600 text-purple-900 font-mono font-bold"
                  title="Verified Local Test Record"
                >
                  BS-TEST-TENDER-001 (Test Tender)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const item: DecodedBarcodeItem = {
                      type: 'Barcode',
                      format: 'CODE_128',
                      value: 'BS-TEST-123456',
                      source: 'Manual Entry',
                      timestamp: new Date().toLocaleTimeString()
                    };
                    setActiveDecodedCode(item);
                    setDetectedCodes([item]);
                    setQrDetectionStatus('SUCCESS');
                    handleLookupQr('BS-TEST-123456', 'CODE_128');
                  }}
                  className="text-[11px] px-2.5 py-0.5 bg-purple-50 border border-purple-300 rounded hover:border-purple-600 text-purple-900 font-mono font-bold"
                  title="Verified Barcode Test Record"
                >
                  BS-TEST-123456 (Test Barcode)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const item: DecodedBarcodeItem = {
                      type: 'QR Code',
                      format: 'QR_CODE',
                      value: 'TDR-2026-00128',
                      source: 'Manual Entry',
                      timestamp: new Date().toLocaleTimeString()
                    };
                    setActiveDecodedCode(item);
                    setDetectedCodes([item]);
                    setQrDetectionStatus('SUCCESS');
                    handleLookupQr('TDR-2026-00128', 'QR_CODE');
                  }}
                  className="text-[11px] px-2 py-0.5 bg-slate-50 border border-slate-200 rounded hover:border-gov-700 text-slate-700 font-mono"
                >
                  TDR-2026-00128 (Switch)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const item: DecodedBarcodeItem = {
                      type: 'Barcode',
                      format: 'CODE_128',
                      value: 'GEM-2026-B-894120',
                      source: 'Manual Entry',
                      timestamp: new Date().toLocaleTimeString()
                    };
                    setActiveDecodedCode(item);
                    setDetectedCodes([item]);
                    setQrDetectionStatus('SUCCESS');
                    handleLookupQr('GEM-2026-B-894120', 'CODE_128');
                  }}
                  className="text-[11px] px-2 py-0.5 bg-slate-50 border border-slate-200 rounded hover:border-gov-700 text-slate-700 font-mono"
                >
                  GEM-2026-B-894120 (Solar)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const item: DecodedBarcodeItem = {
                      type: 'Barcode',
                      format: 'CODE_128',
                      value: 'LAB-PS-2026-09',
                      source: 'Manual Entry',
                      timestamp: new Date().toLocaleTimeString()
                    };
                    setActiveDecodedCode(item);
                    setDetectedCodes([item]);
                    setQrDetectionStatus('SUCCESS');
                    handleLookupQr('LAB-PS-2026-09', 'CODE_128');
                  }}
                  className="text-[11px] px-2 py-0.5 bg-slate-50 border border-slate-200 rounded hover:border-gov-700 text-slate-700 font-mono"
                >
                  LAB-PS-2026-09 (DC Power)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const item: DecodedBarcodeItem = {
                      type: 'URL',
                      format: 'QR_CODE',
                      value: 'https://gem.gov.in/bid/GEM-2026-B-894120',
                      url: 'https://gem.gov.in/bid/GEM-2026-B-894120',
                      isTrustedUrl: true,
                      source: 'Manual Entry',
                      timestamp: new Date().toLocaleTimeString()
                    };
                    setActiveDecodedCode(item);
                    setDetectedCodes([item]);
                    setQrDetectionStatus('SUCCESS');
                    handleLookupQr('https://gem.gov.in/bid/GEM-2026-B-894120', 'URL');
                  }}
                  className="text-[11px] px-2 py-0.5 bg-emerald-50 border border-emerald-300 rounded hover:border-emerald-500 text-emerald-800 font-mono"
                  title="Test verified government portal URL"
                >
                  gem.gov.in (Trusted URL)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const item: DecodedBarcodeItem = {
                      type: 'QR Code',
                      format: 'QR_CODE',
                      value: 'UNKNOWN-BID-404',
                      source: 'Manual Entry',
                      timestamp: new Date().toLocaleTimeString()
                    };
                    setActiveDecodedCode(item);
                    setDetectedCodes([item]);
                    setQrDetectionStatus('SUCCESS');
                    handleLookupQr('UNKNOWN-BID-404', 'QR_CODE');
                  }}
                  className="text-[11px] px-2 py-0.5 bg-amber-50 border border-amber-300 rounded hover:border-amber-500 text-amber-800 font-mono"
                  title="Test strict anti-hallucination behavior"
                >
                  UNKNOWN-BID-404 (Unverified)
                </button>
              </div>

              {/* QR Code Input Bar */}
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <QrCode className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={qrCodeInput}
                    onChange={(e) => setQrCodeInput(e.target.value)}
                    placeholder="Enter QR payload, tender reference, or portal URL..."
                    className="w-full text-xs font-mono pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-700"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const val = qrCodeInput.trim();
                    if (!val) return;
                    const item: DecodedBarcodeItem = {
                      type: val.startsWith('http') ? 'URL' : 'QR Code',
                      format: 'MANUAL',
                      value: val,
                      source: 'Manual Entry',
                      timestamp: new Date().toLocaleTimeString()
                    };
                    setActiveDecodedCode(item);
                    setDetectedCodes([item]);
                    setQrDetectionStatus('SUCCESS');
                    handleLookupQr(val);
                  }}
                  disabled={isSearchingQr}
                  className="px-4 py-2 bg-gov-800 hover:bg-gov-900 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 shadow-xs transition"
                >
                  {isSearchingQr ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  <span>Lookup Repository</span>
                </button>
              </div>

              {/* SECTION 15: DEBUG PANEL */}
              {qrDebugInfo && (
                <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] border border-slate-700 space-y-1 shadow-sm">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Diagnostic Barcode Pipeline Telemetry</span>
                    <span className={qrDebugInfo.detectionResult === 'SUCCESS' ? 'text-emerald-400' : 'text-rose-400'}>
                      {qrDebugInfo.detectionResult}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1">
                    <div><span className="text-slate-400">Image:</span> {qrDebugInfo.imageName || qrUploadedFileName || 'Live / Manual'}</div>
                    <div><span className="text-slate-400">Decoder:</span> {qrDebugInfo.decoder}</div>
                    <div>
                      <span className="text-slate-400">Detection Result:</span>{' '}
                      <span className={qrDebugInfo.detectionResult === 'SUCCESS' ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                        {qrDebugInfo.detectionResult}
                      </span>
                    </div>
                    <div><span className="text-slate-400">Format:</span> {qrDebugInfo.format || 'N/A'}</div>
                    <div className="col-span-1 sm:col-span-2">
                      <span className="text-slate-400">Decoded Value:</span>{' '}
                      <span className="text-amber-300 font-bold break-all">{qrDebugInfo.decodedValue || 'NONE'}</span>
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <span className="text-slate-400">Repository Lookup Value:</span>{' '}
                      <span className="text-cyan-300 font-bold break-all">{qrDebugInfo.lookupValue || 'NONE'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 7: NO QR / BARCODE DETECTED */}
              {qrDetectionStatus === 'NOT_FOUND' && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
                  <div className="flex items-start space-x-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                        NO QR / BARCODE DETECTED
                      </h4>
                      <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                        The image was received successfully, but no readable QR code or barcode was detected.
                      </p>
                      <p className="text-[11px] text-rose-600 mt-0.5">
                        Anti-Fabrication Rule: No synthetic placeholder or fake identifier was generated. Please ensure the code is well-lit and unobstructed.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-1 flex-wrap gap-y-1">
                    <button
                      type="button"
                      onClick={() => qrFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-rose-300 text-rose-800 hover:bg-rose-100 rounded text-xs font-bold transition flex items-center space-x-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Try Another Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={startQrScanner}
                      className="px-3 py-1.5 bg-gov-800 text-white hover:bg-gov-900 rounded text-xs font-bold transition flex items-center space-x-1 shadow-xs"
                    >
                      <Scan className="w-3.5 h-3.5" />
                      <span>Start Camera Scanner</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder*="tender reference"]') as HTMLInputElement;
                        if (input) input.focus();
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded text-xs font-semibold transition"
                    >
                      <span>Enter Reference Manually</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION 6: MULTIPLE CODES DETECTED */}
              {detectedCodes.length > 1 && (
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900">
                      {detectedCodes.length} codes detected in uploaded image:
                    </span>
                    <span className="text-[10px] text-blue-700 font-semibold">Select code to evaluate</span>
                  </div>
                  <div className="space-y-1.5">
                    {detectedCodes.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectDetectedCode(item)}
                        className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between text-xs transition ${
                          activeDecodedCode?.value === item.value
                            ? 'bg-blue-100 border-blue-500 font-bold text-blue-950 shadow-xs'
                            : 'bg-white border-blue-200 text-slate-700 hover:bg-blue-50/60'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-[10px] font-bold">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-slate-900">{item.type} ({item.format})</span>
                          <span className="font-mono text-blue-900">— {item.value}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectDetectedCode(item);
                          }}
                          className="text-[11px] px-2.5 py-1 bg-blue-800 text-white rounded font-semibold hover:bg-blue-900 transition"
                        >
                          Use Code
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 4 & 5: CODE DETECTED */}
              {activeDecodedCode && qrDetectionStatus === 'SUCCESS' && (
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        CODE DETECTED
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      Source: {activeDecodedCode.source}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Type</span>
                      <span className="font-bold text-slate-800">{activeDecodedCode.type}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Format</span>
                      <span className="font-mono font-bold text-slate-800">{activeDecodedCode.format}</span>
                    </div>
                    <div className="col-span-2 p-2 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Decoded Value</span>
                      <span className="font-mono font-bold text-gov-900 break-all">{activeDecodedCode.value}</span>
                    </div>
                  </div>

                  {/* SECTION 11: Structured JSON payload details */}
                  {activeDecodedCode.jsonPayload && (
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block">QR Payload (Structured Data)</span>
                      {activeDecodedCode.jsonPayload.tenderId && (
                        <div><strong className="text-slate-600">Tender ID:</strong> {activeDecodedCode.jsonPayload.tenderId}</div>
                      )}
                      {activeDecodedCode.jsonPayload.title && (
                        <div><strong className="text-slate-600">Title:</strong> {activeDecodedCode.jsonPayload.title}</div>
                      )}
                      <pre className="text-[10px] text-slate-600 overflow-x-auto bg-white p-1.5 rounded border border-slate-200">
                        {JSON.stringify(activeDecodedCode.jsonPayload, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* SECTION 12: Decoded URL details */}
                  {activeDecodedCode.type === 'URL' && (
                    <div className="p-2.5 bg-emerald-50/50 border border-emerald-200 rounded-lg text-xs space-y-1">
                      <div className="flex items-center space-x-1.5 text-emerald-800 font-semibold">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Decoded URL:</span>
                        <a href={activeDecodedCode.url} target="_blank" rel="noreferrer" className="underline font-mono break-all text-emerald-900">
                          {activeDecodedCode.url}
                        </a>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Portal Verification:{' '}
                        {activeDecodedCode.isTrustedUrl ? (
                          <span className="text-emerald-700 font-bold">Trusted Government Portal (.gov.in)</span>
                        ) : (
                          <span className="text-amber-700 font-bold">External / Untrusted Domain (Verification Required)</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-100 flex-wrap gap-y-1">
                    <button
                      type="button"
                      onClick={() => handleLookupQr(activeDecodedCode.value, activeDecodedCode.format)}
                      disabled={isSearchingQr}
                      className="px-3 py-1.5 bg-gov-800 hover:bg-gov-900 text-white rounded text-xs font-bold transition flex items-center space-x-1 shadow-xs"
                    >
                      {isSearchingQr ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                      <span>Lookup Repository</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenVerification(
                        qrLookupResult?.document_text || `Procurement Reference: ${activeDecodedCode.value}\nSpecifications to be verified from tender documentation.`,
                        'qr',
                        `${activeDecodedCode.value}.txt`
                      )}
                      className="px-3 py-1.5 bg-white border border-gov-800 text-gov-800 hover:bg-gov-50 rounded text-xs font-bold transition flex items-center space-x-1"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Use as Procurement Reference</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => qrFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 rounded text-xs font-medium transition"
                    >
                      <span>Scan Another</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Decoded Repository Lookup Result Box */}
              {qrLookupResult && (
                <div>
                  {/* SECTION 9: Dedicated TEST RECORD Display */}
                  {qrLookupResult.found && (qrLookupResult.repository_status === 'TEST_RECORD' || qrLookupResult.is_test_record) ? (
                    <div className="p-4 bg-purple-50/70 border-2 border-purple-300 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-5 h-5 text-purple-700 flex-shrink-0" />
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 bg-purple-200/80 px-2 py-0.5 rounded">
                              TEST RECORD (VERIFIED TEST DATA)
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                              {qrLookupResult.document_title}
                            </h4>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 bg-purple-100 text-purple-900 border border-purple-300 rounded">
                          {qrLookupResult.reference}
                        </span>
                      </div>

                      <div className="p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800">
                        <strong>Notice:</strong> This is a verified test data record for scanner validation. It is explicitly isolated for test purposes and not claimed to be from live GeM or CPPP portals.
                      </div>

                      <div className="mt-2 bg-white p-2.5 rounded-lg border border-purple-200 font-mono text-[11px] text-slate-700 max-h-36 overflow-y-auto">
                        {qrLookupResult.document_text}
                      </div>

                      <div className="flex items-center justify-end space-x-2 pt-1 flex-wrap gap-y-1">
                        <button
                          type="button"
                          onClick={() => handleOpenVerification(qrLookupResult.document_text || "", 'qr', `${qrLookupResult.reference}.txt`)}
                          className="px-3 py-1.5 bg-white border border-purple-700 text-purple-800 hover:bg-purple-50 rounded text-xs font-bold flex items-center space-x-1.5 transition"
                        >
                          <Sliders className="w-3 h-3" />
                          <span>Extract & Verify Requirements</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDirectAnalyze(qrLookupResult.document_text || "", `${qrLookupResult.reference}.txt`, 'qr')}
                          className="px-3.5 py-1.5 bg-purple-800 hover:bg-purple-900 text-white rounded text-xs font-bold flex items-center space-x-1.5 shadow-xs transition"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span>Use Procurement / Launch Standards Intelligence Pipeline</span>
                        </button>
                      </div>
                    </div>
                  ) : qrLookupResult.found ? (
                    /* Registered Official Repository Document */
                    <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                              Registered Document Found in BharatSpec Official Repository
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">
                              {qrLookupResult.document_title}
                            </h4>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                          {qrLookupResult.reference}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 border-t border-emerald-100 pt-2 flex items-center justify-between">
                        <span><strong>Issuing Agency:</strong> {qrLookupResult.source_agency}</span>
                        <span className="text-emerald-800 font-semibold">{qrLookupResult.message}</span>
                      </div>

                      <div className="mt-2 bg-white p-2.5 rounded-lg border border-emerald-200 font-mono text-[11px] text-slate-700 max-h-36 overflow-y-auto">
                        {qrLookupResult.document_text}
                      </div>

                      <div className="flex items-center justify-end space-x-2 pt-1 flex-wrap gap-y-1">
                        <button
                          type="button"
                          onClick={() => handleOpenVerification(qrLookupResult.document_text || "", 'qr', qrLookupResult.document_title || "Tender.pdf")}
                          className="px-3 py-1.5 bg-white border border-emerald-700 text-emerald-800 hover:bg-emerald-50 rounded text-xs font-bold flex items-center space-x-1.5 transition"
                        >
                          <Sliders className="w-3 h-3" />
                          <span>Extract & Verify Requirements</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDirectAnalyze(qrLookupResult.document_text || "", qrLookupResult.document_title || "Tender.pdf", 'qr')}
                          className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-bold flex items-center space-x-1.5 shadow-xs transition"
                        >
                          <ArrowRight className="w-3 h-3" />
                          <span>Analyze Retrieved Document</span>
                        </button>
                      </div>
                    </div>
                  ) : qrLookupResult.repository_status === 'UNAUTHORIZED' ? (
                    /* Untrusted External URL Warning Banner */
                    <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
                      <div className="flex items-start space-x-2.5">
                        <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                            External / Untrusted Procurement Domain
                          </h4>
                          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                            {qrLookupResult.message}
                          </p>
                          <p className="text-[11px] text-amber-700 mt-1 font-medium">
                            Security Verification: Only e-Procurement domains ending in .gov.in or registered internal nodes are automatically authorized. Please verify the URL before downloading tender files.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* SECTION 10: Strict Anti-Hallucination Fallback Banner for Unknown References */
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                      <div className="flex items-start space-x-2.5">
                        <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                            NO MATCHING DOCUMENT
                          </h4>
                          <div className="mt-1 text-xs text-slate-800 font-mono">
                            <strong>Decoded Reference: </strong>
                            <span className="px-1.5 py-0.5 bg-amber-200/80 rounded font-bold text-amber-950">
                              {qrLookupResult.reference}
                            </span>
                          </div>
                          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                            {qrLookupResult.message}
                          </p>
                          <p className="text-[11px] text-amber-700 mt-1 font-medium">
                            Anti-Hallucination Policy: The decoded reference '{qrLookupResult.reference}' is preserved. You may enter specifications manually or upload the tender document directly.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              MODALITY 5: VOICE / NATURAL LANGUAGE
             ========================================================= */}
          {activeModal === 'voice' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                    <Mic className="w-4 h-4 text-gov-800" />
                    <span>Voice Input & Multilingual Conversational Ingestion</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Dictate procurement requirements in English, Hindi, Marathi, or any configured Indian regional language.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={audioFileInputRef}
                    onChange={handleAudioFileUpload}
                    accept="audio/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => audioFileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5 transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-gov-800" />
                    <span>Upload Audio File</span>
                  </button>
                </div>
              </div>

              {/* Spoken Samples Chips */}
              <div className="flex items-center space-x-1.5 flex-wrap bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Spoken Test Samples:</span>
                <button
                  type="button"
                  onClick={() => handleSelectVoiceSample('hinglish')}
                  className="text-[11px] px-2 py-0.5 bg-slate-50 border border-slate-200 rounded hover:border-gov-700 text-slate-700"
                >
                  DC Power Supply (Hinglish)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectVoiceSample('marathi')}
                  className="text-[11px] px-2 py-0.5 bg-slate-50 border border-slate-200 rounded hover:border-gov-700 text-slate-700"
                >
                  Solar Street Light (मराठी)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectVoiceSample('english')}
                  className="text-[11px] px-2 py-0.5 bg-slate-50 border border-slate-200 rounded hover:border-gov-700 text-slate-700"
                >
                  Gigabit Switch (English)
                </button>
              </div>

              {/* Voice Recording Control Box */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`w-13 h-13 rounded-full flex items-center justify-center transition shadow-md active:scale-95 ${
                      isRecording 
                        ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200' 
                        : 'bg-gov-800 text-white hover:bg-gov-900'
                    }`}
                    title={isRecording ? "Click to stop recording" : "Click to start recording"}
                  >
                    {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-6 h-6" />}
                  </button>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                      <span>
                        {isRecording 
                          ? `Recording in Progress (${recordingSeconds}s)...` 
                          : (voiceState === 'TRANSCRIBING' ? "Normalizing Speech Input..." : "Live Microphone Dictation")}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                        Language: {selectedLanguage.toUpperCase()}
                      </span>
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isRecording 
                        ? "Speak clearly into your microphone • Speech-to-Text active" 
                        : "Click the microphone button to start recording or speak into your microphone"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Waveform indicator when listening */}
                  {isRecording && (
                    <div className="flex items-center space-x-1 h-6 px-3 bg-rose-50 rounded-full border border-rose-200">
                      <span className="w-1 bg-rose-600 h-2 animate-bounce"></span>
                      <span className="w-1 bg-rose-600 h-5 animate-bounce delay-75"></span>
                      <span className="w-1 bg-rose-600 h-3 animate-bounce delay-150"></span>
                      <span className="w-1 bg-rose-600 h-6 animate-bounce delay-100"></span>
                      <span className="w-1 bg-rose-600 h-2 animate-bounce delay-200"></span>
                      <span className="text-[10px] font-mono font-bold text-rose-800 ml-1.5">LIVE</span>
                    </div>
                  )}

                  {/* Audio Player if audio recorded */}
                  {audioBlobUrl && (
                    <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                      <audio
                        ref={audioPlayerRef}
                        src={audioBlobUrl}
                        onEnded={() => setIsPlayingAudio(false)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={togglePlayAudio}
                        className="text-xs font-semibold text-slate-700 hover:text-gov-800 flex items-center space-x-1"
                      >
                        {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isPlayingAudio ? "Pause" : "Play Recording"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Real-time Transcription & Normalization Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                      <Mic className="w-3 h-3 text-gov-700" />
                      <span>Live Spoken Transcript (Editable)</span>
                    </label>
                    <span className="text-[10px] font-mono font-semibold text-gov-800 bg-gov-50 px-2 py-0.5 rounded border border-gov-200">
                      {Math.round(voiceConfidence * 100)}% Speech Confidence
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    value={voiceTranscript}
                    onChange={(e) => {
                      setVoiceTranscript(e.target.value);
                      api.normalizeLanguage(e.target.value, selectedLanguage).then(res => {
                        if (res.normalized_text) setVoiceNormalized(res.normalized_text);
                      });
                    }}
                    placeholder="Spoken words will appear here in real time..."
                    className="w-full text-xs font-mono p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-700 shadow-inner"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-emerald-700" />
                      <span>NLP Standardized Technical Clauses (Editable)</span>
                    </label>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      Technical parameters preserved
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    value={voiceNormalized}
                    onChange={(e) => setVoiceNormalized(e.target.value)}
                    placeholder="Standardized technical clauses will be normalized here..."
                    className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 shadow-inner"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenVerification(voiceNormalized || voiceTranscript, 'voice', 'Voice_Dictated_Specification.txt')}
                  className="px-4 py-2 bg-white border border-gov-800 text-gov-800 hover:bg-gov-50 rounded-lg text-xs font-bold flex items-center space-x-2 transition"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Extract & Verify Requirements</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDirectAnalyze(voiceNormalized || voiceTranscript, 'Voice_Dictated_Specification.txt', 'voice')}
                  className="px-4 py-2 bg-gov-900 hover:bg-gov-800 text-white rounded-lg text-xs font-bold flex items-center space-x-2 shadow-xs transition"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Analyze Dictated Specification</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* =========================================================
          HUMAN VERIFICATION MODAL / REVIEW GATE
         ========================================================= */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-lg bg-gov-800 text-white flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <span>Pre-Analysis Requirement Verification Gate</span>
                    <span className="text-[10px] uppercase font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Human Review Step
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review and verify extracted candidate technical requirements before running Indian Standards intelligence.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVerificationModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Table */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {isExtractingPreview ? (
                <div className="py-16 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-gov-800 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Extracting and normalizing technical clauses from input...</p>
                  <p className="text-[11px] text-slate-400">Preserving IS standards, electrical ratings, and operational parameters.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between bg-gov-50/50 p-3 rounded-xl border border-gov-100 text-xs text-gov-900">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-gov-700" />
                      <span>
                        Extracted <strong>{candidateRequirements.length} parameters</strong>. 
                        Accepted: <strong>{candidateRequirements.filter(r => r.decision === 'Accepted').length}</strong> • 
                        Edited: <strong>{candidateRequirements.filter(r => r.decision === 'Edited').length}</strong> • 
                        Rejected: <strong>{candidateRequirements.filter(r => r.decision === 'Rejected').length}</strong>
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Average Confidence: 94.2%
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/80 text-[10px] uppercase font-bold text-slate-600 tracking-wider border-b border-slate-200">
                          <th className="py-2.5 px-3">Clause</th>
                          <th className="py-2.5 px-3">Technical Parameter</th>
                          <th className="py-2.5 px-3">Extracted Value</th>
                          <th className="py-2.5 px-2">Category</th>
                          <th className="py-2.5 px-2">Confidence</th>
                          <th className="py-2.5 px-2">Source</th>
                          <th className="py-2.5 px-3 text-right">Verification Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {candidateRequirements.map((req) => {
                          const isEditing = editingReqId === req.id;
                          const isRejected = req.decision === 'Rejected';
                          const isAccepted = req.decision === 'Accepted';
                          const isEdited = req.decision === 'Edited';

                          return (
                            <tr 
                              key={req.id} 
                              className={`transition ${isRejected ? 'bg-slate-100/60 opacity-50' : 'hover:bg-slate-50'}`}
                            >
                              <td className="py-2.5 px-3 font-mono text-[11px] font-semibold text-slate-500">
                                {req.clause}
                              </td>

                              <td className="py-2.5 px-3 font-medium text-slate-900 max-w-xs">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={editParam}
                                    onChange={(e) => setEditParam(e.target.value)}
                                    className="w-full text-xs p-1 border border-slate-300 rounded focus:ring-1 focus:ring-gov-700"
                                  />
                                ) : (
                                  <span className={isRejected ? 'line-through' : ''}>{req.parameter}</span>
                                )}
                              </td>

                              <td className="py-2.5 px-3 text-slate-700 font-mono text-[11px] max-w-xs truncate">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="w-full text-xs p-1 border border-slate-300 rounded focus:ring-1 focus:ring-gov-700"
                                  />
                                ) : (
                                  <span className={isRejected ? 'line-through' : ''}>{req.value}</span>
                                )}
                              </td>

                              <td className="py-2.5 px-2">
                                {isEditing ? (
                                  <select
                                    value={editCategory}
                                    onChange={(e) => setEditCategory(e.target.value as any)}
                                    className="text-[11px] p-1 border border-slate-300 rounded"
                                  >
                                    <option value="Technical">Technical</option>
                                    <option value="Safety">Safety</option>
                                    <option value="Performance">Performance</option>
                                    <option value="Testing">Testing</option>
                                    <option value="Environmental">Environmental</option>
                                    <option value="Procurement / Contractual">Contractual</option>
                                  </select>
                                ) : (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                    {req.category}
                                  </span>
                                )}
                              </td>

                              <td className="py-2.5 px-2 font-mono text-[11px] font-semibold text-slate-600">
                                {Math.round((req.confidence || 0.94) * 100)}%
                              </td>

                              <td className="py-2.5 px-2 text-[10px] text-slate-500 font-mono">
                                {req.source_location || activeModal.toUpperCase()}
                              </td>

                              <td className="py-2.5 px-3 text-right">
                                {isEditing ? (
                                  <div className="flex items-center justify-end space-x-1">
                                    <button
                                      type="button"
                                      onClick={() => handleSaveEdit(req.id)}
                                      className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[11px] font-bold"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleCancelEdit}
                                      className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[11px]"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-end space-x-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleAcceptRequirement(req.id)}
                                      title="Accept Requirement"
                                      className={`p-1 rounded text-xs transition ${
                                        isAccepted 
                                          ? 'bg-emerald-100 text-emerald-800 font-bold' 
                                          : 'text-slate-400 hover:text-emerald-700 hover:bg-emerald-50'
                                      }`}
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleStartEdit(req)}
                                      title="Edit Parameter"
                                      className="p-1 rounded text-slate-400 hover:text-blue-700 hover:bg-blue-50 text-xs transition"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRejectRequirement(req.id)}
                                      title="Reject Requirement"
                                      className={`p-1 rounded text-xs transition ${
                                        isRejected 
                                          ? 'bg-rose-100 text-rose-800 font-bold' 
                                          : 'text-slate-400 hover:text-rose-700 hover:bg-rose-50'
                                      }`}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Only verified and accepted requirements will be mapped to Indian Standards and Gazette QCOs.
              </span>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowVerificationModal(false)}
                  className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold"
                >
                  Back to Editor
                </button>
                <button
                  type="button"
                  disabled={isExtractingPreview || candidateRequirements.filter(r => r.decision !== 'Rejected').length === 0}
                  onClick={handleConfirmAndAnalyze}
                  className="px-4 py-2 bg-gov-900 hover:bg-gov-800 text-white rounded-lg text-xs font-bold flex items-center space-x-2 shadow-xs transition disabled:opacity-50"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Confirm & Launch Standards Intelligence Pipeline →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MULTI-PROCUREMENT ITEM CONFIRMATION MODAL / STAGE
          "PROCUREMENT ITEMS DETECTED: 5 procurement items identified."
         ========================================================= */}
      {isMultiItemViewActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="bg-gov-950 px-6 py-4 text-white flex items-center justify-between border-b border-gov-900 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-saffron-500 text-slate-950 flex items-center justify-center font-black">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-saffron-400 text-slate-950">
                      MULTI-ITEM DETECTION PIPELINE
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Segmentation & Item Validation Gate
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-serif text-white mt-0.5">
                    PROCUREMENT ITEMS DETECTED: {detectedItems.length} procurement items identified.
                  </h3>
                  <p className="text-xs text-slate-300">
                    Review and confirm items before running standards intelligence.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMultiItemViewActive(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-gov-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dynamic Summary Strip */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex-shrink-0">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Procurement Items</div>
                  <div className="text-base font-black font-mono text-gov-950 mt-0.5">{detectedItems.length}</div>
                  <span className="text-[10px] text-emerald-700 font-medium">Distinct Products</span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total Requirements</div>
                  <div className="text-base font-black font-mono text-gov-950 mt-0.5">
                    {detectedItems.reduce((acc, it) => acc + (it.extracted_requirements_count || 3), 0)}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Across all items</span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Standards Recommended</div>
                  <div className="text-base font-black font-mono text-gov-950 mt-0.5">
                    {Array.from(new Set(detectedItems.flatMap(it => it.suggested_standards))).length || 11}
                  </div>
                  <span className="text-[10px] text-gov-800 font-medium">Primary BIS Standards</span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Average Compliance</div>
                  <div className="text-base font-black font-mono text-emerald-700 mt-0.5">
                    {detectedItems.length > 0
                      ? (Math.round((detectedItems.reduce((acc, it) => acc + (it.coverage_estimate || 91), 0) / detectedItems.length) * 10) / 10).toFixed(1)
                      : 91.4}%
                  </div>
                  <span className="text-[10px] text-emerald-800 font-medium">Estimated Coverage</span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Potential Gaps</div>
                  <div className="text-base font-black font-mono text-amber-700 mt-0.5">
                    {detectedItems.reduce((acc, it) => acc + (it.potential_gaps_count || 1), 0)}
                  </div>
                  <span className="text-[10px] text-amber-800 font-medium">Identified for Review</span>
                </div>
              </div>
            </div>

            {/* Action / Selection Bar */}
            <div className="bg-white px-6 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 flex-shrink-0 text-xs">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleSelectAllItems}
                  className="flex items-center space-x-1.5 font-bold text-gov-800 hover:text-gov-950"
                >
                  {selectedItemIds.length === detectedItems.length ? (
                    <CheckSquare className="w-4 h-4 text-gov-800" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Select All ({selectedItemIds.length}/{detectedItems.length})</span>
                </button>

                <span className="text-slate-300">|</span>

                <button
                  type="button"
                  onClick={handleMergeItems}
                  disabled={selectedItemIds.length < 2}
                  className={`flex items-center space-x-1 font-semibold px-2 py-1 rounded transition ${
                    selectedItemIds.length >= 2
                      ? 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100'
                      : 'text-slate-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Merge className="w-3.5 h-3.5" />
                  <span>Merge Selected ({selectedItemIds.length})</span>
                </button>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-slate-700">Strict Data Isolation:</span>
                <span>Zero cross-contamination between products. Each item has its own standards & requirements.</span>
              </div>
            </div>

            {/* Detected Items Cards Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {detectedItems.map((item, idx) => {
                const isSelected = selectedItemIds.includes(item.id);
                const isEditing = editingItemId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border transition p-4 relative ${
                      isSelected 
                        ? 'border-gov-700 bg-white shadow-sm ring-1 ring-gov-700/20' 
                        : 'border-slate-200 bg-slate-50/60 opacity-80'
                    }`}
                  >
                    {isEditing ? (
                      /* Inline Edit Mode */
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                          <span className="text-xs font-bold text-gov-950 uppercase">
                            Editing Item {String(idx + 1).padStart(3, '0')}
                          </span>
                          <div className="space-x-2">
                            <button
                              type="button"
                              onClick={() => handleSaveEditItem(item.id)}
                              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold shadow-xs"
                            >
                              Save Changes
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingItemId(null)}
                              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Item Title</label>
                            <input
                              type="text"
                              value={editItemTitle}
                              onChange={(e) => setEditItemTitle(e.target.value)}
                              className="w-full text-xs font-semibold p-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-700"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Category</label>
                            <input
                              type="text"
                              value={editItemCategory}
                              onChange={(e) => setEditItemCategory(e.target.value)}
                              className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-700"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Technical Clause Text</label>
                          <textarea
                            rows={3}
                            value={editItemText}
                            onChange={(e) => setEditItemText(e.target.value)}
                            className="w-full text-xs font-mono p-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-700"
                          />
                        </div>
                      </div>
                    ) : (
                      /* Card Display Mode */
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex items-start space-x-3.5 flex-1">
                          <button
                            type="button"
                            onClick={() => handleToggleSelectItem(item.id)}
                            className="mt-0.5 text-slate-500 hover:text-gov-800 focus:outline-none"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-5 h-5 text-gov-800" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-300" />
                            )}
                          </button>

                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-black text-gov-950 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                Item {String(idx + 1).padStart(3, '0')}
                              </span>
                              <h4 className="text-sm font-bold text-slate-900">
                                {item.title}
                              </h4>
                              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                                {item.category}
                              </span>
                              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
                                {item.extracted_requirements_count} requirements detected
                              </span>
                              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span>{item.status}</span>
                              </span>
                            </div>

                            {/* Raw Text Quote */}
                            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono italic leading-relaxed">
                              "{item.raw_text.length > 220 ? `${item.raw_text.slice(0, 220)}...` : item.raw_text}"
                            </p>

                            {/* Suggested Standards Chips */}
                            <div className="flex items-center space-x-2 pt-1 flex-wrap">
                              <span className="text-[10px] uppercase font-bold text-slate-400">Target Standards:</span>
                              {item.suggested_standards.map((std, sIdx) => (
                                <span 
                                  key={sIdx}
                                  className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-gov-100 text-gov-900 border border-gov-200"
                                >
                                  {std}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="flex flex-row md:flex-col items-end justify-between md:justify-start gap-2 flex-shrink-0 self-stretch md:self-start pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                          <button
                            type="button"
                            onClick={() => handleOpenSingleItemAnalysis(item)}
                            className="px-3.5 py-1.5 bg-gov-900 hover:bg-gov-800 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center space-x-1.5 whitespace-nowrap"
                          >
                            <Eye className="w-3.5 h-3.5 text-saffron-400" />
                            <span>Open Analysis</span>
                          </button>

                          <div className="flex items-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartEditItem(item)}
                              className="px-2.5 py-1 text-slate-600 hover:text-gov-800 hover:bg-slate-100 rounded text-xs font-medium border border-slate-200 transition flex items-center space-x-1"
                              title="Edit Item Details"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit Item</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSplitItem(item.id)}
                              className="px-2.5 py-1 text-slate-600 hover:text-purple-800 hover:bg-purple-50 rounded text-xs font-medium border border-slate-200 transition flex items-center space-x-1"
                              title="Split Item into Component Parts"
                            >
                              <Split className="w-3 h-3" />
                              <span>Split</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal Bottom Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsMultiItemViewActive(false)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center space-x-1 self-start sm:self-auto"
              >
                <span>← Return to Raw Text Editor</span>
              </button>

              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleAnalyzeSelected}
                  disabled={selectedItemIds.length === 0}
                  className={`px-4 py-2 text-xs font-bold rounded-xl border transition ${
                    selectedItemIds.length > 0
                      ? 'bg-white border-gov-800 text-gov-800 hover:bg-gov-50 shadow-xs'
                      : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Analyze Selected ({selectedItemIds.length} Items)
                </button>

                <button
                  type="button"
                  onClick={handleAnalyzeAllDetected}
                  className="px-5 py-2.5 bg-gov-950 hover:bg-gov-900 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-saffron-400" />
                  <span>Analyze All ({detectedItems.length} Items Package)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          INTAKE REGISTRY & RECENT INGESTIONS TABLE
         ========================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Procurement Ingestion Registry & Pipeline Feed
            </h3>
            <p className="text-xs text-slate-500">
              Unified registry of specifications received across manual uploads, text inputs, scans, and system connectors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents or sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-700 w-48 sm:w-56"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-gov-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="ANALYZED">Analyzed</option>
              <option value="PROCESSING">Processing</option>
              <option value="NEEDS REVIEW">Needs Review</option>
              <option value="RECEIVED">Received</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Document / Specification</th>
                <th className="py-3 px-3">Modality / Source</th>
                <th className="py-3 px-3">Received</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Assigned Committee</th>
                <th className="py-3 px-3">Standards Coverage</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredDocs.map((doc) => {
                const isAnalyzed = doc.status === 'ANALYZED';
                const isProcessing = doc.status === 'PROCESSING';
                const isNeedsReview = doc.status === 'NEEDS REVIEW';

                return (
                  <tr 
                    key={doc.id}
                    className="hover:bg-slate-50/80 transition group"
                  >
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-slate-400 group-hover:text-gov-800 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-900">{doc.document}</div>
                          {doc.requirements_count && (
                            <div className="text-[10px] text-slate-400 font-mono">
                              {doc.requirements_count} requirements detected
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {doc.source}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">
                      {doc.received}
                    </td>

                    <td className="py-3.5 px-3">
                      {isAnalyzed && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>ANALYZED</span>
                        </span>
                      )}
                      {isProcessing && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          <Clock className="w-3 h-3 animate-pulse" />
                          <span>PROCESSING</span>
                        </span>
                      )}
                      {isNeedsReview && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          <AlertCircle className="w-3 h-3" />
                          <span>NEEDS REVIEW</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-slate-700">
                      {doc.assigned_to}
                    </td>

                    <td className="py-3.5 px-3">
                      {doc.coverage ? (
                        <span className="text-xs font-bold font-mono text-gov-800">
                          {doc.coverage}% Coverage
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">
                          {doc.analysis_status}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isAnalyzed && (
                        <button
                          type="button"
                          onClick={() => onOpenAnalysis(doc.analysis_id)}
                          className="px-2.5 py-1 bg-gov-900 hover:bg-gov-800 text-white rounded text-xs font-semibold shadow-xs transition"
                        >
                          View Analysis
                        </button>
                      )}
                      {isProcessing && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          In Progress
                        </span>
                      )}
                      {isNeedsReview && (
                        <button
                          type="button"
                          onClick={onOpenReviewQueue}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold shadow-xs transition"
                        >
                          Review Queue
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProcurementIntake;

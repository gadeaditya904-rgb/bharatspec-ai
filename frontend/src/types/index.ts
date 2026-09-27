export interface Standard {
  id: string;
  is_number: string;
  title: string;
  short_description: string;
  scope: string;
  category: string;
  subcategory: string;
  keywords: string[];
  technical_domains: string[];
  applicable_products: string[];
  requirements_covered: string[];
  testing_information: string;
  safety_information: string;
  certification_information: string;
  publication_date: string;
  revision_date?: string | null;
  status: 'Current' | 'Revised' | 'Superseded' | 'Withdrawn' | 'Amendment Available' | 'Historical';
  current_edition: string;
  supersedes?: string | null;
  superseded_by?: string | null;
  amendment_information?: string | null;
  source: string;
  source_url: string;
  document_reference: string;
}

export type RelationshipType = 
  | 'NORMATIVE_REFERENCE'
  | 'TEST_METHOD'
  | 'TERMINOLOGY'
  | 'SAFETY'
  | 'INSTALLATION'
  | 'RELATED_PRODUCT'
  | 'ASSOCIATED_STANDARD'
  | 'SUPERSEDES'
  | 'SUPERSEDED_BY'
  | 'AMENDMENT';

export interface StandardRelationship {
  id: string;
  source_standard_id: string;
  source_is_number: string;
  target_standard_id: string;
  target_is_number: string;
  target_title: string;
  relationship_type: RelationshipType;
  description: string;
  source_reference: string;
  confidence: number;
  verified_date: string;
  status: string;
  target_standard?: string;
}

export interface StandardVersionInfo {
  is_number: string;
  title: string;
  current_edition: string;
  current_year: string;
  previous_edition?: string;
  amendment_count: number;
  amendments: Array<{ num: string; date: string; description: string }>;
  status: 'CURRENT' | 'OUTDATED_REFERENCE' | 'SUPERSEDED' | 'AMENDMENT_AVAILABLE';
  superseded_by?: string;
  tender_reference_match?: string;
  action_required?: string;
  transition_period?: string;
  risk_level?: string;
}

export type RegulatoryStatus = 
  | 'ACTIVE'
  | 'ACTIVE_NO_EXPIRY'
  | 'FUTURE_EFFECTIVE'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'SUPERSEDED'
  | 'AMENDED'
  | 'CONSOLIDATED'
  | 'REPEALED'
  | 'WITHDRAWN'
  | 'UNDER_REVIEW'
  | 'DRAFT'
  | 'STATUS_UNKNOWN'
  | 'VERIFICATION_REQUIRED';

export type RegulatoryApplicability =
  | 'Mandatory'
  | 'Potentially Applicable'
  | 'Advisory / Non-Mandatory'
  | 'Inapplicable';

export interface TimelineEvent {
  event_type: 'ISSUED' | 'EFFECTIVE' | 'AMENDED' | 'CONSOLIDATED' | 'CURRENT_STATUS' | 'SUPERSEDED' | 'EXPIRED' | 'REVIEWED';
  date: string;
  description: string;
  reference?: string;
  actor?: string;
}

export interface RegulatoryRequirement {
  id: string;
  regulation_id?: string;
  analysis_id?: string;
  title: string;
  issuing_authority: string;
  regulation_type: string;
  reference_number: string;
  qco_number?: string;
  notification_number?: string;
  applicable_product?: string;
  applicable_standard: string;
  mandatory_status?: string;
  applicability: RegulatoryApplicability;
  issue_date?: string;
  effective_date: string;
  expiry_date?: string;
  status: RegulatoryStatus;
  superseded_by?: string | null;
  amended_by?: Array<{ notification: string; date: string; summary: string }> | null;
  consolidated_version?: string | null;
  source_reference: string;
  source?: string;
  source_url?: string;
  source_last_verified_at: string;
  last_verified?: string;
  verification_status: 'Official Gazette Verified' | 'Verification Required' | 'Officer Verified' | 'Pending Verification';
  verification_reason?: string;
  evidence: string;
  summary?: string;
  timeline_events: TimelineEvent[];
  reviewer_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

export interface RegulationReviewRequest {
  action: 'VERIFY' | 'MARK_CURRENT' | 'MARK_SUPERSEDED' | 'MARK_EXPIRED' | 'ADD_EVIDENCE';
  target_status?: RegulatoryStatus;
  notes?: string;
  reviewer?: string;
  reviewer_role?: string;
  evidence_reference?: string;
  superseded_by?: string;
}

export interface ExtractedRequirement {
  id: string;
  clause: string;
  requirement_text: string;
  normalized_requirement: string;
  category: 'Performance' | 'Technical' | 'Safety' | 'Environmental' | 'Quality' | 'Testing' | 'Electrical' | 'Mechanical' | 'Material' | 'Installation' | 'Procurement / Contractual' | 'Regulatory';
  parameter: string;
  value: string;
  unit?: string;
  priority: 'High' | 'Medium' | 'Low';
  source_location: string;
  status: 'Mapped' | 'Partially Mapped' | 'Unmapped' | 'Needs Review';
  confidence?: number;
  normalized_text?: string;
  source_type?: string;
  decision?: 'Accepted' | 'Edited' | 'Rejected' | 'Pending';
  original_text?: string;
  page_number?: number;
  extraction_method?: string;
}

export interface ExplainabilityDetails {
  product_match: string;
  requirement_match: string[];
  scope_match: string;
  testing_match: string;
  regulatory_relationship: string;
  recommendation_basis: string;
}

export interface Recommendation {
  id: string;
  standard_id: string;
  is_number: string;
  title: string;
  relevance_level: 'High' | 'Medium' | 'Low';
  relevance_score: number;
  recommendation_type: 'Potentially Mandatory' | 'Technically Applicable' | 'Recommended for Consideration' | 'Related';
  explanation: string;
  matched_requirements: string[];
  regulatory_status: string;
  evidence_source: string;
  is_mandatory?: boolean;
  why_details: ExplainabilityDetails;
  related_standards_count?: number;
  match_score?: number;
  clauses_mapped?: string[];
  reviewer_decision?: 'Accepted' | 'Review' | 'Rejected';
  reviewer_note?: string;
}

export interface TraceabilityMatrixItem {
  id: string;
  clause: string;
  requirement: string;
  category: string;
  applicable_standard: string;
  evidence_reference: string;
  ai_relevance: 'High' | 'Medium' | 'Low';
  review_status: 'Mapped' | 'Partially Mapped' | 'Unmapped' | 'Needs Review';
  reviewer_comment?: string;
}

export interface SpecificationGap {
  id: string;
  requirement_area: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  recommendation: string;
  status: 'Unresolved' | 'Resolved' | 'Under Review';
}

export interface PotentialConflict {
  id: string;
  conflict_type: string;
  description?: string;
  related_requirements?: string[];
  severity: 'High' | 'Medium' | 'Low';
  recommendation?: string;
  status?: 'Open' | 'Resolved' | 'Clarified';
  parameter_name?: string;
  clause_a_number?: string;
  clause_a_text?: string;
  clause_b_number?: string;
  clause_b_text?: string;
  technical_explanation?: string;
  recommended_resolution?: string;
}

export interface NeutralityFlag {
  id: string;
  detected_phrase: string;
  flag_type: string;
  reasoning: string;
  suggested_neutral_alternative: string;
  status: string;
}

export interface EvidenceItem {
  id: string;
  evidence_type: string;
  related_requirement: string;
  related_standard: string;
  status: 'Not Provided' | 'Provided' | 'Under Review' | 'Accepted' | 'Needs Clarification';
  reviewer: string;
  notes?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user_name: string;
  user_role: string;
  action: string;
  entity_type: string;
  details: string;
  user?: string;
}

export interface ExtractionQuality {
  score: number;
  readable_percentage: number;
  replacement_characters: number;
  pdf_artifacts_detected: number;
  status: 'VERIFIED' | 'NEEDS_REVIEW' | 'FAILED';
  method: string;
  error_message?: string;
  page_count?: number;
}

export interface AnalysisResponse {
  analysis_id: string;
  procurement_item_id?: string;
  filename?: string;
  document_name?: string;
  status?: string;
  product_name: string;
  category: string;
  summary: string;
  knowledge_base_version: string;
  coverage_indicator: number;
  requirements_identified: number;
  requirements_mapped: number;
  unmapped_requirements: number;
  potential_mandatory_count: number;
  evidence_items_count: number;
  human_review_required_count: number;
  input_type?: string;
  source_document?: string;
  detected_language?: string;
  extraction_confidence?: number;
  extracted_text?: string;
  extraction_quality?: ExtractionQuality;
  extraction_method?: string;
  extracted_requirements: ExtractedRequirement[];
  recommendations: Recommendation[];
  related_standards?: any[];
  traceability_matrix: TraceabilityMatrixItem[];
  traceability?: TraceabilityMatrixItem[];
  specification_gaps: SpecificationGap[];
  conflicts: PotentialConflict[];
  neutrality_flags: NeutralityFlag[];
  evidence_checklist: EvidenceItem[];
  regulatory_items: RegulatoryRequirement[];
  relationships: StandardRelationship[];
  version_intelligence: StandardVersionInfo[];
  version_amendments?: StandardVersionInfo[];
  certification_reviews?: any[];
  human_reviews?: any[];
  report?: any;
  audit_trail: AuditLogItem[];
  original_text?: string;
  verified_text?: string;
  created_at?: string;
  created_by?: string;
  // Shared Analysis Workflow Object Fields
  id?: string;
  workflow_status?: WorkflowOverallStatus;
  stages?: WorkflowStage[];
  procurement?: Record<string, any>;
  sourceDocument?: Record<string, any>;
  extraction?: Record<string, any>;
  requirements?: any[];
  standards?: any[];
  validation?: Record<string, any>;
  humanReview?: Record<string, any>;
  finalization?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export type WorkflowStageId = 
  | 'EXTRACTION' 
  | 'REQUIREMENTS' 
  | 'STANDARDS' 
  | 'VALIDATION' 
  | 'HUMAN_REVIEW' 
  | 'FINALIZATION';

export type WorkflowStageStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type WorkflowOverallStatus = 
  | 'CREATED'
  | 'EXTRACTING'
  | 'EXTRACTED'
  | 'REQUIREMENTS_PROCESSING'
  | 'REQUIREMENTS_READY'
  | 'STANDARDS_PROCESSING'
  | 'STANDARDS_READY'
  | 'VALIDATION_PROCESSING'
  | 'VALIDATION_READY'
  | 'HUMAN_REVIEW_PENDING'
  | 'HUMAN_REVIEW_IN_PROGRESS'
  | 'HUMAN_REVIEW_COMPLETE'
  | 'FINALIZING'
  | 'FINALIZED'
  | 'FAILED';

export interface WorkflowStage {
  stage_id: WorkflowStageId;
  name: string;
  status: WorkflowStageStatus;
  start_time?: string | null;
  completion_time?: string | null;
  result?: Record<string, any> | null;
  errors?: string[];
  dependencies: string[];
  analysis_id: string;
  metadata?: Record<string, any>;
}

export interface OcrResponse {
  text: string;
  confidence: number;
  quality: string;
  detected_language: string;
  image_name: string;
  needs_review: boolean;
  word_count: number;
  error?: string;
}

export interface QrLookupResponse {
  found: boolean;
  reference: string;
  code_type?: string;
  value_type?: string;
  url?: string;
  is_trusted_url?: boolean;
  document_id?: string;
  document_title?: string;
  document_text?: string;
  source_agency?: string;
  repository_status?: string;
  status_label?: string;
  is_test_record?: boolean;
  json_payload?: Record<string, any> | null;
  message: string;
}

export type BarcodeLookupResponse = QrLookupResponse;

export interface DecodedBarcodeItem {
  type: 'QR Code' | 'Barcode' | 'URL';
  format: string;
  value: string;
  source: 'Image Upload' | 'Live Camera' | 'Manual Entry';
  timestamp: string;
  jsonPayload?: Record<string, any> | null;
  url?: string;
  isTrustedUrl?: boolean;
}

export interface AudioTranscribeResponse {
  transcript: string;
  detected_language: string;
  confidence?: number;
  confidence_display?: string;
  source: string;
  original_text: string;
  normalized_text: string;
  audio_duration_seconds?: number;
  status: string;
}

export interface ProcurementIntakePayload {
  analysis_id?: string;
  analysisId?: string;
  input_type?: string;
  inputType?: string;
  source?: string;
  source_document?: string;
  sourceDocument?: string;
  original_text?: string;
  originalText?: string;
  verified_text?: string;
  verifiedText?: string;
  language?: string;
  confidence?: number;
  metadata?: Record<string, any>;
  verified_requirements?: ExtractedRequirement[];
  verifiedRequirements?: ExtractedRequirement[];
}

export interface LanguageNormalizeResponse {
  original_text: string;
  detected_language: string;
  normalized_text: string;
  extracted_parameters: Array<{ parameter: string; value: string }>;
  preserved_identifiers: string[];
}

export interface DemoSpecification {
  id: string;
  title: string;
  product_name: string;
  category: string;
  subcategory: string;
  filename: string;
  department: string;
  summary: string;
  text: string;
  stats: {
    requirements: number;
    applicable_standards: number;
    high_relevance: number;
    medium_relevance: number;
    regulatory_review: number;
    unmapped: number;
    potential_gaps: number;
    conflicts: number;
    evidence_items: number;
    coverage_indicator: number;
  };
}

export interface IncomingDocument {
  id: string;
  document: string;
  source: 'Upload' | 'Email' | 'Portal API' | 'Watched Folder' | string;
  received: string;
  status: 'RECEIVED' | 'PROCESSING' | 'ANALYZED' | 'NEEDS REVIEW' | 'FAILED' | 'ARCHIVED';
  assigned_to: string;
  analysis_status: 'Completed' | 'In Progress' | 'Review' | 'Pending' | string;
  analysis_id?: string;
  requirements_count?: number;
  coverage?: number;
}

export interface ReviewItem {
  id: string;
  priority: 'HIGH PRIORITY' | 'MEDIUM PRIORITY' | 'LOW PRIORITY';
  category: 'Outdated Standard' | 'Unmapped Requirement' | 'Potential Conflict' | 'Certification Review' | 'Ambiguous Specification' | 'Relationship Verification';
  title: string;
  description: string;
  related_standard?: string;
  related_requirement?: string;
  action_label: string;
  status: 'Pending' | 'Accepted' | 'Review' | 'Rejected';
  reviewer_note?: string;
}

export interface GeneratedReport {
  report_id: string;
  analysis_id: string;
  procurement_title: string;
  document_name: string;
  generated_date: string;
  generated_by: string;
  version: string;
  last_reviewed: string;
  status: 'Draft' | 'Reviewed' | 'Ready' | 'Archived' | 'Technical Review Required';
  sections_included: string[];
  coverage_score: number;
  standards_count: number;
  requirements_count: number;
}

export type UserRole = 
  | 'procurement_officer'
  | 'technical_expert'
  | 'compliance_reviewer'
  | 'competent_authority'
  | 'tender_committee'
  | 'system_administrator'
  | 'auditor';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  role_display: string;
  department: string;
  organization: string;
  division?: string;
  assigned_procurements?: string[];
  permissions: string[];
}

export type ProcurementWorkflowStage =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'DOCUMENT_PROCESSING'
  | 'REQUIREMENT_EXTRACTION'
  | 'STANDARDS_ANALYSIS'
  | 'TECHNICAL_REVIEW'
  | 'COMPLIANCE_REVIEW'
  | 'AUTHORITY_REVIEW'
  | 'APPROVED'
  | 'RETURNED'
  | 'COMPLETED';

export interface AuthorityDecision {
  decision: 'APPROVED' | 'RETURNED' | 'ADDITIONAL_REVIEW_REQUIRED';
  officer_name: string;
  role: string;
  timestamp: string;
  remarks: string;
  record_id: string;
}

export interface TenderVersionDiff {
  version1_id: string;
  version2_id: string;
  version1_name: string;
  version2_name: string;
  added_requirements: ExtractedRequirement[];
  modified_requirements: Array<{
    previous: ExtractedRequirement;
    current: ExtractedRequirement;
    change_summary: string;
    impact: string;
    review_status: string;
  }>;
  removed_requirements: ExtractedRequirement[];
  affected_standards: string[];
  affected_reviews: string[];
}

export interface DepartmentConfig {
  id: string;
  organization: string;
  department_name: string;
  division: string;
  procurement_categories: string[];
  approval_workflow: WorkflowStage[];
  authorized_reviewers: string[];
  competent_authorities: string[];
  data_sources: string[];
  retention_policy: string;
}

export interface DetectedProcurementItem {
  id: string; // e.g. "ITEM-001"
  item_number?: number;
  procurement_id?: string;
  title: string;
  category: string;
  original_text?: string;
  raw_text: string;
  source_location?: string;
  requirements_count?: number;
  extracted_requirements_count: number;
  detected_requirements?: ExtractedRequirement[];
  selected?: boolean;
  status: 'Detected' | 'Analyzing' | 'Analysis Ready' | 'Needs Review' | 'Ready for Analysis';
  analysis_id?: string;
  analysis?: AnalysisResponse;
  suggested_standards: string[];
  coverage_estimate: number;
  potential_gaps_count: number;
}

export interface MultiProcurementSession {
  id?: string;
  session_id: string;
  source_name?: string;
  source_type?: string;
  submitted_by?: string;
  submitted_at?: string;
  timestamp?: string;
  status?: 'Items Detected' | 'Analyzing' | 'Completed' | string;
  items: DetectedProcurementItem[];
  total_items: number;
  analyzed_items?: number;
  total_requirements?: number;
  total_standards?: number;
  verification_required_count?: number;
  total_gaps?: number;
  item_analyses: Record<string, AnalysisResponse>;
  active_item_id: string;
}


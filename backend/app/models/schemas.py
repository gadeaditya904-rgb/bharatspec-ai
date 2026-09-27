from typing import List, Optional, Dict, Any, Tuple
from pydantic import BaseModel, Field

class Standard(BaseModel):
    id: str
    is_number: str
    title: str
    short_description: str
    scope: str
    category: str
    subcategory: str
    keywords: List[str] = []
    technical_domains: List[str] = []
    applicable_products: List[str] = []
    requirements_covered: List[str] = []
    testing_information: str = ""
    safety_information: str = ""
    certification_information: str = ""
    publication_date: str = "2020"
    revision_date: Optional[str] = None
    status: str = "Current"  # Current, Revised, Superseded, Withdrawn, Amendment Available
    current_edition: str = "Third Edition"
    supersedes: Optional[str] = None
    superseded_by: Optional[str] = None
    amendment_information: Optional[str] = None
    source: str = "Bureau of Indian Standards (BIS)"
    source_url: str = "https://www.services.bis.gov.in"
    document_reference: str = "BIS Catalogue"

class TimelineEvent(BaseModel):
    event_type: str  # ISSUED, EFFECTIVE, AMENDED, CONSOLIDATED, CURRENT_STATUS, SUPERSEDED, EXPIRED, REVIEWED
    date: str
    description: str
    reference: Optional[str] = None
    actor: Optional[str] = None

class RegulatoryRequirement(BaseModel):
    id: str
    regulation_id: Optional[str] = None
    analysis_id: Optional[str] = None
    title: str
    issuing_authority: str
    regulation_type: str = "Quality Control Order"  # Quality Control Order, Technical Regulation, Government Notification, Mandatory Conformity Requirement
    reference_number: Optional[str] = "REF-QCO-ACTIVE"
    qco_number: Optional[str] = None
    notification_number: Optional[str] = None
    applicable_product: Optional[str] = None
    applicable_standard: str
    mandatory_status: str = "Mandatory"  # Mandatory, Potentially Mandatory, Technical Reference Only
    applicability: str = "Mandatory"  # Mandatory, Potentially Applicable, Advisory / Non-Mandatory, Inapplicable
    issue_date: Optional[str] = "No issue date recorded"
    effective_date: str
    expiry_date: Optional[str] = "No expiry date recorded"
    status: str = "ACTIVE"  # ACTIVE, ACTIVE_NO_EXPIRY, FUTURE_EFFECTIVE, EXPIRING_SOON, EXPIRED, SUPERSEDED, AMENDED, CONSOLIDATED, REPEALED, WITHDRAWN, UNDER_REVIEW, DRAFT, STATUS_UNKNOWN, VERIFICATION_REQUIRED
    superseded_by: Optional[str] = None
    amended_by: Optional[List[Dict[str, str]]] = None
    consolidated_version: Optional[str] = None
    source_reference: str = "The Gazette of India"
    source: Optional[str] = "The Gazette of India"
    source_url: Optional[str] = "https://egazette.gov.in"
    source_last_verified_at: str = "2026-08-20"
    last_verified: Optional[str] = "2026-08-20"
    verification_status: str = "Official Gazette Verified"  # Official Gazette Verified, Verification Required, Officer Verified, Pending Verification
    verification_reason: Optional[str] = None
    evidence: str = "Gazette Extraordinary Notification published under statutory authority."
    summary: Optional[str] = None
    timeline_events: List[TimelineEvent] = []
    reviewer_notes: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[str] = None

class RegulationReviewRequest(BaseModel):
    action: str  # VERIFY, MARK_CURRENT, MARK_SUPERSEDED, MARK_EXPIRED, ADD_EVIDENCE
    target_status: Optional[str] = None
    notes: Optional[str] = None
    reviewer: Optional[str] = "Aditya Gade (Procurement Officer)"
    reviewer_role: Optional[str] = "Procurement Officer"
    evidence_reference: Optional[str] = None
    superseded_by: Optional[str] = None

class ExtractedRequirement(BaseModel):
    id: str
    requirement_text: str
    category: str  # Technical, Performance, Safety, Quality, Environmental, Testing, Certification, Documentation, Procurement/Contractual
    parameter: str
    value: str
    unit: Optional[str] = None
    priority: str = "High"  # High, Medium, Low
    source_location: str = "Section 3.2"
    status: str = "Mapped"  # Mapped, Partially Mapped, Unmapped, Needs Review
    confidence: Optional[float] = 0.94
    normalized_text: Optional[str] = None
    source_type: Optional[str] = "DOCUMENT"  # TEXT, DOCUMENT, OCR, QR, VOICE
    decision: Optional[str] = "Accepted"  # Accepted, Edited, Rejected, Pending
    clause: Optional[str] = "1.1"
    original_text: Optional[str] = None
    page_number: Optional[int] = 1
    extraction_method: Optional[str] = "Native PDF Text"
    analysis_id: Optional[str] = None

class ExplainabilityDetails(BaseModel):
    product_match: str
    requirement_match: List[str]
    scope_match: str
    testing_match: str
    regulatory_relationship: str
    recommendation_basis: str

class Recommendation(BaseModel):
    id: str
    standard_id: str
    is_number: str
    title: str
    relevance_level: str  # High, Medium, Low (AI Relevance)
    relevance_score: float  # e.g. 0.94
    recommendation_type: str  # Potentially Mandatory, Technically Applicable, Recommended for Consideration, Related
    explanation: str
    matched_requirements: List[str]
    regulatory_status: str  # e.g. "Potential regulatory relevance", "Technical relevance"
    evidence_source: str
    why_details: ExplainabilityDetails
    analysis_id: Optional[str] = None

class StandardRelationship(BaseModel):
    id: str
    source_standard_id: str
    source_is_number: str
    target_standard_id: str
    target_is_number: str
    target_title: str
    relationship_type: str  # NORMATIVE_REFERENCE, TEST_METHOD, TERMINOLOGY, SAFETY, INSTALLATION, RELATED_PRODUCT, ASSOCIATED_STANDARD, SUPERSEDES, SUPERSEDED_BY, AMENDMENT
    description: str
    source_reference: str
    confidence: float = 0.95
    verified_date: str = "2026-08-15"
    status: str = "Verified"
    analysis_id: Optional[str] = None

class StandardVersionInfo(BaseModel):
    is_number: str
    title: str
    current_edition: str
    current_year: str
    previous_edition: Optional[str] = None
    amendment_count: int = 0
    amendments: List[Dict[str, str]] = []
    status: str = "CURRENT"  # CURRENT, AMENDMENT AVAILABLE, OUTDATED REFERENCE, VERIFICATION REQUIRED
    superseded_by: Optional[str] = None
    tender_reference_match: Optional[str] = None
    action_required: Optional[str] = None
    transition_period: Optional[str] = None
    risk_level: Optional[str] = None
    source: str = "Bureau of Indian Standards"
    verification_status: str = "Official Gazette Verified"
    analysis_id: Optional[str] = None
    standard_id: Optional[str] = None
    publication_date: Optional[str] = None
    verified_date: Optional[str] = "2026-08-15"

class CertificationReviewItem(BaseModel):
    id: str
    standard_or_product: str
    potential_certification: str  # e.g., BIS Product Certification (ISI Scheme I), Compulsory Registration Scheme (CRS Scheme II)
    reason: str
    applicability: str = "Potentially Applicable"  # Potentially Applicable, Review Required, Verification Required
    evidence: str
    verification_status: str = "Verification Required"
    issuing_authority: str
    qco_number: Optional[str] = None
    analysis_id: Optional[str] = None
    requirement_id: Optional[str] = None
    item_id: Optional[str] = None
    regulatory_order: Optional[str] = None
    mandated_standard: Optional[str] = None
    scheme_type: Optional[str] = None
    compliance_requirement: Optional[str] = None
    applicability_status: Optional[str] = None
    source: Optional[str] = "Official Gazette of India"

class HumanReviewItem(BaseModel):
    id: str
    item_type: str = "standard"  # standard, requirement, gap, version, certification
    title: str
    description: str
    related_standard: Optional[str] = None
    related_requirement: Optional[str] = None
    priority: str = "HIGH PRIORITY"  # HIGH PRIORITY, MEDIUM PRIORITY, LOW PRIORITY
    category: str = "Outdated Standard"  # Outdated Standard, Unmapped Requirement, Potential Conflict, Certification Review, Ambiguous Specification, Relationship Verification
    decision: str = "Pending"  # Pending, Accepted, Review, Rejected
    reviewer_note: Optional[str] = None
    reviewer: Optional[str] = None
    timestamp: Optional[str] = None
    analysis_id: Optional[str] = None
    requirement_id: Optional[str] = None
    standard_id: Optional[str] = None
    reviewer_id: Optional[str] = None
    reviewer_role: Optional[str] = None
    note: Optional[str] = None

class GeneratedReport(BaseModel):
    report_id: str
    analysis_id: str
    procurement_title: str
    document_name: str
    generated_date: str
    generated_by: str = "Technical Procurement Evaluator"
    version: str = "v2.6"
    last_reviewed: str = "26 Sep 2026"
    status: str = "Technical Review Required"
    sections_included: List[str] = []
    coverage_score: int = 82
    standards_count: int = 0
    requirements_count: int = 0
    sections_data: Optional[Dict[str, Any]] = None

class ReviewDecisionRequest(BaseModel):
    decision: str  # Accepted, Review, Rejected
    note: Optional[str] = None
    reviewer: Optional[str] = "Technical Evaluator"

class GenerateReportRequest(BaseModel):
    sections_included: Optional[List[str]] = None
    generated_by: Optional[str] = "Technical Procurement Officer"

class TraceabilityMatrixItem(BaseModel):
    id: str
    clause: Optional[str] = "Clause 1.0"
    requirement: str
    category: str
    applicable_standard: str
    evidence_reference: str
    ai_relevance: str  # High, Medium, Low
    review_status: str  # Mapped, Partially Mapped, Unmapped, Needs Review, Human Review Required
    reviewer_comment: Optional[str] = None
    analysis_id: Optional[str] = None
    requirement_id: Optional[str] = None
    standard_id: Optional[str] = None
    standard_title: Optional[str] = None
    relationship_type: Optional[str] = None
    evidence: Optional[str] = None
    source_page: Optional[str] = None
    coverage_status: Optional[str] = None
    confidence: Optional[float] = None

class SpecificationGap(BaseModel):
    id: str
    requirement_area: str  # Testing, Environmental, Safety, Quality, Certification, Documentation, Warranty, Inspection
    description: str
    severity: str  # High, Medium, Low
    recommendation: str
    issue: Optional[str] = None
    reason: Optional[str] = None
    suggested_review_action: Optional[str] = None
    status: str = "Unresolved"
    analysis_id: Optional[str] = None
    requirement_id: Optional[str] = None
    evidence: Optional[str] = None
    recommended_remediation: Optional[str] = None

class PotentialConflict(BaseModel):
    id: str
    conflict_type: str  # Contradictory numerical requirements, Inconsistent units, Unclear terminology, Over-specification
    description: str
    related_requirements: List[str]
    severity: str  # High, Medium, Low
    recommendation: str
    status: str = "Open"
    analysis_id: Optional[str] = None
    parameter_name: Optional[str] = None
    clause_a_number: Optional[str] = None
    clause_a_text: Optional[str] = None
    clause_b_number: Optional[str] = None
    clause_b_text: Optional[str] = None
    technical_explanation: Optional[str] = None
    recommended_resolution: Optional[str] = None

class NeutralityFlag(BaseModel):
    id: str
    detected_phrase: str
    flag_type: str  # Brand Reference, Proprietary Architecture, Overly Restrictive Dimension
    reasoning: str
    suggested_neutral_alternative: str
    status: str = "Review Suggested"
    analysis_id: Optional[str] = None

class EvidenceItem(BaseModel):
    id: str
    evidence_type: str  # BIS Licence / CRS, Test Report, Certificate of Conformity, Datasheet, Warranty Deed
    related_requirement: str
    related_standard: str
    status: str = "Not Provided"  # Not Provided, Provided, Under Review, Accepted, Needs Clarification
    reviewer: str = "Unassigned"
    notes: Optional[str] = None
    analysis_id: Optional[str] = None
    requirement_id: Optional[str] = None
    evidence_description: Optional[str] = None
    applicable_standard: Optional[str] = None
    verification_status: Optional[str] = None
    source: Optional[str] = None

class BidderVerificationItem(BaseModel):
    id: str
    tender_requirement: str
    standard_requirement: str
    bidder_claim: str
    submitted_evidence: str
    ai_status: str  # Matched, Partial Match, Discrepancy Detected, Missing Evidence
    human_status: str  # Pending Verification, Verified Compliant, Clarification Required
    reviewer_comment: Optional[str] = None
    analysis_id: Optional[str] = None

class AuditLogItem(BaseModel):
    id: str
    timestamp: str
    user_name: str
    user_role: str
    action: str
    entity_type: str
    details: str
    user: Optional[str] = None
    analysis_id: Optional[str] = None
    actor_id: Optional[str] = None
    actor_role: Optional[str] = None
    source: Optional[str] = None

class WorkflowStage(BaseModel):
    stage_id: str  # EXTRACTION, REQUIREMENTS, STANDARDS, VALIDATION, HUMAN_REVIEW, FINALIZATION
    name: str
    status: str = "PENDING"  # PENDING, PROCESSING, COMPLETED, FAILED
    start_time: Optional[str] = None
    completion_time: Optional[str] = None
    result: Optional[Dict[str, Any]] = None
    errors: List[str] = []
    dependencies: List[str] = []
    analysis_id: str
    metadata: Dict[str, Any] = {}

class RequirementsProcessRequest(BaseModel):
    verified_requirements: Optional[List[ExtractedRequirement]] = None

class RequirementsProcessResponse(BaseModel):
    analysis_id: str
    stage: WorkflowStage
    workflow_status: str
    requirements: List[ExtractedRequirement]
    count: int

class StandardsProcessResponse(BaseModel):
    analysis_id: str
    stage: WorkflowStage
    workflow_status: str
    recommendations: List[Recommendation]
    standards_count: int
    potential_mandatory_count: int

class ValidationProcessResponse(BaseModel):
    analysis_id: str
    stage: WorkflowStage
    workflow_status: str
    coverage_score: int
    conflicts_count: int
    gaps_count: int
    traceability_count: int
    traceability: List[TraceabilityMatrixItem]
    conflicts: List[PotentialConflict]
    gaps: List[SpecificationGap]

class ReviewDecisionItemRequest(BaseModel):
    decision: str = "Accepted"  # Accepted, Review, Rejected
    note: Optional[str] = None
    reviewer: Optional[str] = "Technical Procurement Evaluator"

class FinalizeReportRequest(BaseModel):
    sections_included: Optional[List[str]] = None
    generated_by: Optional[str] = "Technical Procurement Evaluator"

class AnalysisRequest(BaseModel):
    title: Optional[str] = None
    specification_text: str
    product_category_hint: Optional[str] = None
    document_name: Optional[str] = "Procurement_Spec.docx"
    input_type: Optional[str] = "TEXT"  # TEXT, DOCUMENT, IMAGE_OCR, QR_BARCODE, VOICE
    source_type: Optional[str] = "Direct Input"
    language: Optional[str] = "English"
    verified_requirements: Optional[List[ExtractedRequirement]] = None

class AnalysisResponse(BaseModel):
    analysis_id: str
    product_name: str
    category: str
    summary: str
    document_name: Optional[str] = "Procurement_Spec.docx"
    filename: Optional[str] = "Procurement_Spec.docx"
    status: str = "Ready"
    knowledge_base_version: str = "v2.6-Sept2026 (2,450 Standards, 320 Regulations)"
    coverage_indicator: int  # e.g. 86%
    requirements_identified: int
    requirements_mapped: int
    unmapped_requirements: int
    potential_mandatory_count: int
    evidence_items_count: int
    human_review_required_count: int
    input_type: Optional[str] = "DOCUMENT"  # TEXT, DOCUMENT, IMAGE_OCR, QR_BARCODE, VOICE
    source_document: Optional[str] = None
    detected_language: Optional[str] = "English"
    extraction_confidence: Optional[float] = 0.95
    extracted_text: Optional[str] = None
    extraction_quality: Optional[Dict[str, Any]] = None
    extraction_method: Optional[str] = "Native PDF Text"
    extracted_requirements: List[ExtractedRequirement]
    recommendations: List[Recommendation]
    related_standards: List[Dict[str, Any]] = []
    relationships: List[StandardRelationship] = []
    version_amendments: List[StandardVersionInfo] = []
    version_intelligence: List[StandardVersionInfo] = []
    certification_reviews: List[CertificationReviewItem] = []
    traceability_matrix: List[TraceabilityMatrixItem] = []
    traceability: List[TraceabilityMatrixItem] = []
    specification_gaps: List[SpecificationGap] = []
    human_reviews: List[HumanReviewItem] = []
    conflicts: List[PotentialConflict] = []
    neutrality_flags: List[NeutralityFlag] = []
    evidence_checklist: List[EvidenceItem] = []
    regulatory_items: List[RegulatoryRequirement] = []
    audit_trail: List[AuditLogItem] = []
    original_text: Optional[str] = None
    verified_text: Optional[str] = None
    created_at: Optional[str] = None
    created_by: Optional[str] = None
    report: Optional[GeneratedReport] = None
    # Shared Analysis Workflow Object Fields
    id: Optional[str] = None
    workflow_status: str = "CREATED"
    stages: List[WorkflowStage] = []
    procurement: Optional[Dict[str, Any]] = None
    sourceDocument: Optional[Dict[str, Any]] = None
    extraction: Optional[Dict[str, Any]] = None
    requirements: Optional[List[Any]] = None
    standards: Optional[List[Any]] = None
    validation: Optional[Dict[str, Any]] = None
    humanReview: Optional[Dict[str, Any]] = None
    finalization: Optional[Dict[str, Any]] = None
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None

class ProcurementIntakeRequest(BaseModel):
    analysis_id: Optional[str] = None
    input_type: str = "TEXT"  # CAMERA_OCR, QR_BARCODE, VOICE, DOCUMENT, TEXT
    source: Optional[str] = "Unified Intake Pipeline"
    source_document: Optional[str] = None
    original_text: Optional[str] = None
    text: Optional[str] = None
    verified_text: Optional[str] = None
    language: Optional[str] = "English"
    confidence: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None
    verified_requirements: Optional[List[ExtractedRequirement]] = None

class OcrResponse(BaseModel):
    text: str
    confidence: float
    quality: str
    detected_language: str
    image_name: str
    needs_review: bool
    word_count: int = 0
    error: Optional[str] = None

class QrLookupRequest(BaseModel):
    code: str

class BarcodeLookupRequest(BaseModel):
    code: str
    type: Optional[str] = "QR_CODE"

class BarcodeLookupResponse(BaseModel):
    found: bool
    reference: str
    code_type: str = "QR_CODE"
    value_type: str = "Procurement Reference"  # URL, Document ID, Procurement Reference, Product Identifier, Repository Reference, Unknown
    url: Optional[str] = None
    is_trusted_url: bool = False
    document_id: Optional[str] = None
    document_title: Optional[str] = None
    document_text: Optional[str] = None
    source_agency: Optional[str] = None
    repository_status: str = "NOT_FOUND"  # SUCCESS, NOT_FOUND, UNAUTHORIZED, UNAVAILABLE, UNSUPPORTED, VERIFICATION_REQUIRED, TEST_RECORD
    status_label: Optional[str] = None
    is_test_record: bool = False
    json_payload: Optional[Dict[str, Any]] = None
    message: str

class AudioTranscribeResponse(BaseModel):
    transcript: str
    detected_language: str
    confidence: Optional[float] = None
    confidence_display: str = "Confidence not provided by transcription engine"
    source: str = "Voice Input"
    original_text: str
    normalized_text: str
    audio_duration_seconds: Optional[float] = None
    status: str = "SUCCESS"

class QrLookupResponse(BaseModel):
    found: bool
    reference: str
    document_id: Optional[str] = None
    document_title: Optional[str] = None
    document_text: Optional[str] = None
    source_agency: Optional[str] = None
    message: str

class LanguageNormalizeRequest(BaseModel):
    text: str
    language: Optional[str] = "auto"

class LanguageNormalizeResponse(BaseModel):
    original_text: str
    detected_language: str
    normalized_text: str
    extracted_parameters: List[Dict[str, Any]] = []
    preserved_identifiers: List[str] = []

def validate_report_consistency(analysis: AnalysisResponse) -> Tuple[bool, str]:
    """Validates that all child items in an AnalysisResponse strictly belong to analysis.analysis_id.
    Prevents cross-analysis contamination before report generation."""
    aid = analysis.analysis_id
    if not aid:
        return False, "Report validation failed: missing analysisId."
    
    # Check requirements
    for r in analysis.extracted_requirements:
        if r.analysis_id and r.analysis_id != aid:
            return False, f"Report validation failed: cross-analysis data detected in requirement {r.id} (expected {aid}, got {r.analysis_id})."
            
    # Check recommendations
    for rec in analysis.recommendations:
        if rec.analysis_id and rec.analysis_id != aid:
            return False, f"Report validation failed: cross-analysis data detected in recommendation {rec.id} (expected {aid}, got {rec.analysis_id})."
            
    # Check relationships
    for rel in analysis.relationships:
        if rel.analysis_id and rel.analysis_id != aid:
            return False, f"Report validation failed: cross-analysis data detected in relationship {rel.id}."
            
    # Check version amendments
    for v in (analysis.version_amendments or analysis.version_intelligence or []):
        if v.analysis_id and v.analysis_id != aid:
            return False, f"Report validation failed: cross-analysis data detected in version info for {v.is_number}."
            
    # Check certification reviews
    for cert in analysis.certification_reviews:
        if cert.analysis_id and cert.analysis_id != aid:
            return False, f"Report validation failed: cross-analysis data detected in certification review {cert.id}."
            
    # Check traceability
    for trc in (analysis.traceability_matrix or analysis.traceability or []):
        if trc.analysis_id and trc.analysis_id != aid:
            return False, f"Report validation failed: cross-analysis data detected in traceability row {trc.id}."
            
    # Check specification gaps
    for gap in analysis.specification_gaps:
        if gap.analysis_id and gap.analysis_id != aid:
            return False, f"Report validation failed: cross-analysis data detected in specification gap {gap.id}."
            
    # Check evidence checklist
    for evi in analysis.evidence_checklist:
        if evi.analysis_id and evi.analysis_id != aid:
            return False, f"Report validation failed: cross-analysis data detected in evidence item {evi.id}."
            
    # Check human reviews
    for rev in analysis.human_reviews:
        if rev.analysis_id and rev.analysis_id != aid:
            return False, f"Report validation failed: cross-analysis data detected in human review {rev.id}."
            
    # Check regulatory items
    for reg in (analysis.regulatory_items or []):
        if reg.analysis_id and reg.analysis_id != aid:
            return False, f"Report validation failed: cross-analysis data detected in regulatory item {reg.id} (expected {aid}, got {reg.analysis_id})."

    return True, "Consistent"


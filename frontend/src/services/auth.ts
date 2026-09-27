import { UserProfile, UserRole } from '../types';

export const SYSTEM_USERS: UserProfile[] = [
  {
    id: "usr-001",
    name: "Aditya Gade",
    email: "aditya.gade@procurement.gov.in",
    role: "procurement_officer",
    role_display: "Procurement Officer",
    department: "Department of Procurement & Contracts",
    organization: "Central Procurement Directorate",
    division: "IT & Electronics Procurement Wing",
    assigned_procurements: ["PROC-2026-000092", "PROC-2026-000128", "PROC-2026-000342"],
    permissions: [
      "create_procurement",
      "upload_specifications",
      "enter_requirements",
      "submit_for_review",
      "view_recommendations",
      "view_traceability",
      "generate_reports",
      "respond_to_reviews"
    ]
  },
  {
    id: "usr-002",
    name: "Siddhi Mhatre",
    email: "siddhi.mhatre@technical.gov.in",
    role: "technical_expert",
    role_display: "Technical / Domain Expert",
    department: "Directorate of Technical Evaluation",
    organization: "Central Quality & Technical Assessment Directorate",
    division: "Electrical & Instrumentation Evaluation Cell",
    assigned_procurements: ["PROC-2026-000092", "PROC-2026-000128"],
    permissions: [
      "review_technical_requirements",
      "review_standards",
      "review_why_standard",
      "verify_relationships",
      "accept_reject_reviews",
      "add_technical_notes",
      "review_conflicts",
      "review_gaps"
    ]
  },
  {
    id: "usr-003",
    name: "Tejas Ghorpade",
    email: "tejas.ghorpade@standards.gov.in",
    role: "compliance_reviewer",
    role_display: "Standards / Compliance Reviewer",
    department: "Standards & Regulatory Compliance Cell",
    organization: "National Procurement Standards Directorate",
    division: "BIS & Quality Control Order Oversight",
    assigned_procurements: ["PROC-2026-000092", "PROC-2026-000342"],
    permissions: [
      "review_standard_versions",
      "review_amendments",
      "review_certification",
      "review_qco_evidence",
      "verify_sources",
      "add_compliance_notes",
      "flag_verification_required"
    ]
  },
  {
    id: "usr-004",
    name: "Pradnya Shinde",
    email: "pradnya.shinde@ministry.gov.in",
    role: "competent_authority",
    role_display: "Joint Secretary / Competent Authority",
    department: "Ministry Central Procurement Board",
    organization: "Ministry Procurement & Financial Oversight",
    division: "Executive Sanctions & Procurement Approval",
    assigned_procurements: ["PROC-2026-000092"],
    permissions: [
      "review_final_analysis",
      "review_reviewer_decisions",
      "record_authority_decision",
      "approve_procurement",
      "return_for_correction",
      "request_additional_review",
      "sign_final_dossier"
    ]
  },
  {
    id: "usr-005",
    name: "Hardik Nalavade",
    email: "hardik.nalavade@bharatspec.gov.in",
    role: "system_administrator",
    role_display: "System Administrator",
    department: "Systems, Security & Governance Wing",
    organization: "Central Digital Infrastructure Directorate",
    division: "Platform Operations & KB Maintenance",
    permissions: [
      "manage_users",
      "manage_roles",
      "configure_departments",
      "configure_workflows",
      "manage_settings",
      "manage_approved_sources",
      "manage_knowledge_base",
      "manage_integrations"
    ]
  },
  {
    id: "usr-006",
    name: "Atharva Pandey",
    email: "atharva.pandey@audit.gov.in",
    role: "auditor",
    role_display: "Internal Auditor / Read-Only",
    department: "Internal Audit & Compliance Oversight Wing",
    organization: "Comptroller & Internal Audit Directorate",
    division: "Statutory Procurement Compliance Cell",
    permissions: [
      "view_finalized_records",
      "view_reports",
      "view_evidence",
      "view_audit_history",
      "export_compliance_dossier"
    ]
  }
];

const STORAGE_KEY = 'bharatspec_auth_user';

export const authService = {
  getCurrentUser(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const matched = SYSTEM_USERS.find(u => u.id === parsed.id || u.role === parsed.role);
        if (matched) {
          return matched;
        }
        return parsed;
      }
    } catch (e) {
      // ignore
    }
    // Default logged in user: Aditya Gade (Procurement Officer)
    return SYSTEM_USERS[0];
  },

  setCurrentUser(user: UserProfile) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },

  login(email: string): UserProfile {
    const user = SYSTEM_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      this.setCurrentUser(user);
      return user;
    }
    throw new Error("Invalid authorized credentials");
  },

  logout(): UserProfile {
    const defaultUser = SYSTEM_USERS[0];
    this.setCurrentUser(defaultUser);
    return defaultUser;
  },

  hasPermission(user: UserProfile, permission: string): boolean {
    return user.permissions.includes(permission);
  },

  getAllUsers(): UserProfile[] {
    return SYSTEM_USERS;
  }
};

# BharatSpec AI

### AI-Powered Indian Standards & Procurement Intelligence Platform
> **“From Procurement Specifications to Standards, Compliance Intelligence and Traceability.”**

Developed as a prototype for the **Smart India Hackathon (SIH)** problem statement:
*“AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Procurement Specifications.”*

---

## 1. Executive Summary & Product Positioning

**BharatSpec AI** is a decision-support and procurement review platform built for government ministries, Public Sector Undertakings (PSUs), state development agencies, healthcare institutions, and public procurement bodies.

Unlike generic AI chatbots or basic search boxes that merely return standard numbers, BharatSpec AI executes an end-to-end audit pipeline:
```
Procurement Specification
       ↓
AI Understanding & Parameter Extraction
       ↓
Product & Category Classification
       ↓
Semantic Standards Retrieval (2,450 Standards)
       ↓
AI Re-Ranking (High / Medium / Low)
       ↓
Explainable Recommendation (Product, Scope, Testing, Regulatory Match)
       ↓
Regulatory & Quality Control Order (QCO) Awareness (Mandatory vs Technical)
       ↓
Requirement-to-Standard Traceability Matrix
       ↓
Specification Gap Detection (Testing, Environmental, SLAs)
       ↓
Potential Conflict & Ambiguity Detection
       ↓
Procurement Neutrality Review (Brand-neutral Make-in-India compliance)
       ↓
Evidence & Documentation Checklist
       ↓
Bidder Technical Submission Verification (Phase 2 Preview)
       ↓
Executive Procurement Intelligence Report
       ↓
Chronological Audit Trail
```

### Critical Legal & Compliance Positioning
* **Decision Support System**: The platform serves evaluators and technical committees; it does **not** claim to provide autonomous legal certification.
* **Specification Coverage Indicator**: Displays percentage coverage of mapped requirements (e.g. 86%) rather than claiming "100% legally compliant".
* **Statutory QCO Distinction**: Indian Standards are voluntary technical benchmarks by default unless explicitly notified under a statutory Quality Control Order (QCO) by an Administrative Ministry (e.g., DPIIT, MNRE, MeitY, Ministry of Steel).

---

## 2. Key Modules & Differentiators

| Feature Module | Purpose |
| :--- | :--- |
| **Explainable AI Recommendations** | Every recommendation provides a **"Why This Standard?"** breakdown detailing product category alignment, requirement overlap, scope overlap, testing protocols, and regulatory status. |
| **Traceability Matrix** | Maps every single requirement clause to governing Indian Standards, evidence references, AI relevance, and review statuses (*Mapped*, *Needs Review*, *Unmapped*). |
| **Regulatory & QCO Database** | Tracks Gazette notifications, S.O. orders, issuing authorities (DPIIT, MNRE, MeitY, MoHFW), and effective dates. |
| **Specification Gap Detection** | Identifies missing testing criteria, unstated environmental conditions (temperature/humidity ranges), and omitted maintenance SLAs. |
| **Conflict & Ambiguity Detection** | Highlights contradictory numerical clauses (e.g. -10°C to 50°C vs 0°C to 45°C) and vague equivalency wording. |
| **Procurement Neutrality Review** | Flags brand-specific or restrictive vendor locks (e.g. Philips Lumileds, Linak, Intel) to support Make-in-India (PPP-MII) and CVC fairness rules. |
| **Evidence & Documentation Checklist** | Compiles required proof items (BIS Licences, NABL Type Test Reports, CPRI certificates, local content auditor certificates). |
| **Bidder Technical Verification** | Advanced Phase 2 module comparing bidder claims and uploaded test reports against tender requirements. |
| **Contextual AI Assistant** | Grounded floating helper answering specific queries without acting as an unrestricted generic chatbot. |
| **Executive Procurement Report** | Official printable / PDF report formatted for government tender committees. |
| **Knowledge Base Administration** | Tracks KB versioning (v2.6 Live), metadata health, and semantic vector re-indexing. |

---

## 3. Technology Stack & Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend API**: Python FastAPI, Pydantic, Uvicorn (REST API)
- **Knowledge Base**: Relational Schema + Dense Vector Embeddings abstraction (supporting 2,450 Indian Standards and 320 QCO records)
- **Zero-Dependency Offline Demo Mode**: Client-side mirror engine ensures the complete 12-stage workflow operates 100% offline without external API keys or server failures.

---

## 4. Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Python (3.9+)

### Installation & Launch

#### Option A: One-Click Launch (Windows)
Double-click `run_app.bat` or run in terminal:
```bash
run_app.bat
```

#### Option B: Manual Launch
1. **Start Backend**:
   ```bash
   cd backend
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open browser at: **`http://localhost:5173`**
4. Backend Swagger API documentation: **`http://127.0.0.1:8000/docs`**

---

## 5. 5–7 Minute SIH Demonstration Storyline

1. **Step 1 — Dashboard Overview**:
   - Open Dashboard (`http://localhost:5173`).
   - Showcase top metrics: 128 Analyses, 2,450 Standards in KB, 17 Regulatory QCO items requiring review.
   - Explain the 4 user personas using the Role Switcher (Procurement Officer, Technical Evaluator, Compliance Reviewer, Administrator).
2. **Step 2 — New Analysis**:
   - Navigate to **New Analysis**.
   - Select the **Solar Street Lighting System (90W LiFePO4)** demo specification (or drop a custom PDF/DOCX).
   - Click **Execute AI Analysis**.
3. **Step 3 — Animated Processing Pipeline**:
   - Observe the live 11-step intelligence pipeline as requirements are parsed, categories detected, and standards retrieved.
4. **Step 4 — Summary & Extracted Requirements**:
   - Inspect the 27 extracted requirements categorized into Technical, Environmental, Safety, Quality, and Procurement.
5. **Step 5 — Recommended Standards & Explainability**:
   - View recommended standards ranked by AI Relevance (e.g. *IS 16221 Part 2*, *IS 10322 Part 5/Sec 3*, *IS 16046 Part 2*).
   - Click **"Why This Standard?"** on IS 10322 to inspect the 6-layer explainable audit breakdown.
6. **Step 6 — Specification Traceability Matrix**:
   - Open **Traceability Matrix**. Filter by *Unmapped* (4 items) and *Needs Review*.
   - Edit an evaluator comment inline and save.
7. **Step 7 — Compliance Intelligence & QCO Awareness**:
   - Open **Compliance & QCOs**. Review the Central Ministry Quality Control Orders and mandatory standard marks.
8. **Step 8 — Gaps, Conflicts & Neutrality**:
   - Showcase detected gaps in testing criteria and the temperature range conflict (-10°C to 50°C vs 0°C to 45°C).
   - Inspect the **Neutrality Review** tab flagging the "Philips Lumileds / Osram" brand reference.
9. **Step 9 — Bidder Verification**:
   - Open the **Bidder Verification** module to show how a bidder's claim is matched against the tender requirement and submitted CPRI test report.
10. **Step 10 — Executive Procurement Report**:
    - Click **Executive Report**. Review the official printable document and click **Print / Save as PDF**.
11. **Step 11 — Contextual AI Assistant**:
    - Click the floating **AI Review Assistant** button and ask: *"Which requirements are currently unmapped?"* or *"Why was IS 10322 recommended?"*.

---

## 6. Authoritative Data Grounding
Standards data references the Bureau of Indian Standards (BIS) catalogue (divisions ETD, LITD, MHD, CED, MED, PCD, FAD). Regulatory records ground in Gazette of India notifications from DPIIT, MNRE, MeitY, and CDSCO.

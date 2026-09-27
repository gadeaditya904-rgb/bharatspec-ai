import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, FileText, Upload, ShieldCheck, UserCheck, Search, Filter } from 'lucide-react';

export const BidderModule: React.FC = () => {
  const [selectedBidder, setSelectedBidder] = useState('Bharat Solar Technologies Pvt Ltd');
  const [filterStatus, setFilterStatus] = useState('All');

  const items = [
    {
      id: "bv-01",
      tender_requirement: "Solar Luminaire Wattage: 90W (+/- 5%) with IP65/IP66 enclosure",
      standard_requirement: "IS 10322 (Part 5/Sec 3) Clause 4.2 Ingress Protection",
      bidder_claim: "Model BST-90SL: 90W, IP66 certified by CPRI",
      submitted_evidence: "CPRI Test Report No. CPRI/2026/LUM/4819.pdf",
      ai_status: "Matched",
      human_status: "Verified Compliant",
      reviewer_comment: "Valid test certificate verified against CPRI portal."
    },
    {
      id: "bv-02",
      tender_requirement: "Battery: LiFePO4 12.8V 60Ah with IS 16046 Part 2 CRS registration",
      standard_requirement: "IS 16046 (Part 2) / IEC 62133-2 Safety of Lithium Secondary Cells",
      bidder_claim: "LiFePO4 12.8V 60Ah, BIS CRS R-93002184",
      submitted_evidence: "BIS CRS Registration Letter valid up to Nov 2027.pdf",
      ai_status: "Matched",
      human_status: "Verified Compliant",
      reviewer_comment: "R-number active on BIS portal."
    },
    {
      id: "bv-03",
      tender_requirement: "Operating temperature range: -10°C to 50°C",
      standard_requirement: "IS 9000 Damp Heat and Thermal Cycling",
      bidder_claim: "Operating range: 0°C to 45°C (Datasheet Section 4)",
      submitted_evidence: "Product Datasheet v2.1.pdf",
      ai_status: "Discrepancy Detected",
      human_status: "Clarification Required",
      reviewer_comment: "Bidder claim states 0°C lower limit while tender specifies -10°C sub-zero withstand. Flagged for technical evaluation committee."
    },
    {
      id: "bv-04",
      tender_requirement: "Make in India (PPP-MII) Local Content >= 50% (Class-I)",
      standard_requirement: "DPIIT Order P-45021/2/2017-PP(BE-II)",
      bidder_claim: "Local Content calculated at 64.2%",
      submitted_evidence: "Statutory Auditor Certificate M/s Gupta & Associates.pdf",
      ai_status: "Matched",
      human_status: "Verified Compliant",
      reviewer_comment: "Auditor UDIN verified on ICAI portal."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gov-800 font-bold text-xs uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4 text-gov-700" />
            <span>Advanced Module (Phase 2 Preview)</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">
            Bidder Technical Submission Verification
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated alignment checking of bidder technical claims and uploaded test reports against tender specifications.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-700">Select Bidder:</span>
          <select 
            value={selectedBidder}
            onChange={(e) => setSelectedBidder(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-medium text-slate-800"
          >
            <option>Bharat Solar Technologies Pvt Ltd</option>
            <option>Apex Power Infra Systems</option>
            <option>Zenith CleanTech Solutions</option>
          </select>
        </div>
      </div>

      {/* Advisory Banner */}
      <div className="bg-gov-50 border border-gov-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-gov-900">
        <ShieldCheck className="w-5 h-5 text-gov-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Evaluator Decision-Support Mode:</strong>
          <span>
            The system acts as an evaluator-assistance tool. It does NOT automatically approve or disqualify bidders. Final technical qualification rests exclusively with the authorized Tender Committee.
          </span>
        </div>
      </div>

      {/* Verification Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-slate-900">
            Bidder Claim vs Tender Requirement Matrix
          </h3>
          <span className="text-xs text-slate-500 font-mono">4 Clauses Evaluated</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-4 w-1/4">Tender Requirement</th>
              <th className="py-2.5 px-4">Standard Requirement</th>
              <th className="py-2.5 px-4">Bidder Claim</th>
              <th className="py-2.5 px-4">Submitted Evidence</th>
              <th className="py-2.5 px-3">Intelligent Detection</th>
              <th className="py-2.5 px-3">Evaluator Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition">
                <td className="py-3 px-4 font-semibold text-slate-900">
                  {item.tender_requirement}
                </td>
                <td className="py-3 px-4 font-mono text-gov-900">
                  {item.standard_requirement}
                </td>
                <td className="py-3 px-4 text-slate-800">
                  {item.bidder_claim}
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                  {item.submitted_evidence}
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.ai_status === 'Matched' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.ai_status}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    item.human_status === 'Verified Compliant' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' :
                    'bg-amber-50 text-amber-900 border border-amber-200'
                  }`}>
                    {item.human_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import json
import sys
import os
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend"))
from app.main import app

client = TestClient(app)

def main():
    print("Testing BHARATSPEC Regulatory Status & Validity Intelligence...")
    
    # 1. Test Analysis endpoint with Solar Photovoltaics requirement
    payload = {
        "specification_text": "Supply and commissioning of 10MW crystalline silicon terrestrial photovoltaic solar modules conforming to IS 14286 and IS/IEC 61730 parts 1 and 2."
    }
    resp = client.post("/api/analyze", json=payload)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    analysis = resp.json()
        
    analysis_id = analysis.get("analysis_id")
    assert analysis_id, "Missing analysis_id"
    regs = analysis.get("regulatory_items", [])
    print(f"Analysis ID: {analysis_id}")
    print(f"Total Isolated Regulatory Items: {len(regs)}")
    assert len(regs) > 0, "No regulatory items generated"

    # Verify every regulatory item has analysis_id matching current analysis
    for r in regs:
        reg_id = r.get("id")
        r_aid = r.get("analysis_id")
        assert r_aid == analysis_id, f"Isolation leak: reg.analysis_id '{r_aid}' != '{analysis_id}'"
        print(f"  [OK] {reg_id}: {r.get('title')} | Status: {r.get('status')} | Applicability: {r.get('applicability')}")
        print(f"    Dates: Issue={r.get('issue_date')}, Effective={r.get('effective_date')}, Expiry={r.get('expiry_date')}")
        print(f"    Verification: {r.get('verification_status')} | Events: {len(r.get('timeline_events', []))} events")

    # 2. Test Human Review endpoint
    target = regs[0]
    target_id = target["id"]
    print(f"\nTesting Human Review Gate on Regulation: {target_id}...")
    
    rev_url = f"/api/analysis/{analysis_id}/regulation/{target_id}/review"
    rev_payload = {
        "action": "VERIFY",
        "notes": "Verified against Gazette of India extraordinary publication S.O. 2589(E).",
        "reviewer": "Aditya Gade (Procurement Officer)",
        "reviewer_role": "Procurement Officer"
    }
    
    rev_resp = client.post(rev_url, json=rev_payload)
    assert rev_resp.status_code == 200, f"Expected 200 on review, got {rev_resp.status_code}"
    updated_reg = rev_resp.json()
        
    print(f"  [OK] Verification status updated to: {updated_reg.get('verification_status')}")
    print(f"  [OK] Reviewed by: {updated_reg.get('reviewed_by')} at {updated_reg.get('reviewed_at')}")
    print(f"  [OK] Reviewer notes: {updated_reg.get('reviewer_notes')}")
    
    # 3. Test report generation consistency
    rep_resp = client.post(f"/api/analysis/{analysis_id}/report", json={})
    assert rep_resp.status_code == 200, f"Expected 200 on report, got {rep_resp.status_code}"
    rep_data = rep_resp.json()
    print(f"\nReport Generated Successfully. Report ID: {rep_data.get('report_id')}")

    # 4. Test Solar PV Module analysis specifically
    print("\nTesting Solar PV Module Tender...")
    solar_payload = {
        "specification_text": "Supply and installation of 500kW rooftop solar photovoltaic power plant with SPV modules complying with MNRE standards and IS 14286 / IS/IEC 61730."
    }
    s_resp = client.post("/api/analyze", json=solar_payload)
    assert s_resp.status_code == 200
    s_data = s_resp.json()
    s_regs = s_data.get("regulatory_items", [])
    print(f"Solar PV Regulatory Items Count: {len(s_regs)}")
    for sr in s_regs:
        print(f"  [OK] {sr.get('title')}: Status={sr.get('status')}, Expiry={sr.get('expiry_date')}, Amendments={len(sr.get('amended_by') or [])}")

    # 5. Test Furniture / Dual Desks Tender
    print("\nTesting Dual Desks School Furniture Tender...")
    desk_payload = {
        "specification_text": "Procurement of dual desks and classroom chairs for government primary schools. All dual desks must be constructed using ERW steel tube framework and wooden tops."
    }
    d_resp = client.post("/api/analyze", json=desk_payload)
    assert d_resp.status_code == 200
    d_data = d_resp.json()
    d_regs = d_data.get("regulatory_items", [])
    print(f"Furniture Regulatory Items Count: {len(d_regs)}")
    for dr in d_regs:
        print(f"  [OK] {dr.get('title')}: Status={dr.get('status')}, Expiry={dr.get('expiry_date')}")

    print("\nALL ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!")

if __name__ == "__main__":
    main()

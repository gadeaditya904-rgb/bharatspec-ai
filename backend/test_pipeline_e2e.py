import json
import os
import sys
from fastapi.testclient import TestClient

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app.main import app

client = TestClient(app)

def test_health():
    print("Testing /api/health...")
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    print("Health response:", data)
    assert data["status"] == "Online"
    assert data["platform"] == "BHARATSPEC"

def test_multi_item():
    print("\nTesting /api/procurement/multi-item-analysis...")
    raw_text = """Drinking Water Storage Tank
Procurement of 1000 litre polyethylene water storage tanks for government schools, suitable for potable water, UV resistant and durable for outdoor installation.

LED Street Light
Procurement of 50W LED street lights for municipal roads, energy efficient, weather resistant, suitable for outdoor use, with required electrical safety and photometric performance.

Safety Helmet
Procurement of industrial safety helmets for construction workers, lightweight, impact resistant, adjustable headband, suitable for protection against mechanical hazards.

Electrical Distribution Board
Procurement of low-voltage distribution boards with MCCB and MCB protection, IP42 rating, suitable for commercial power distribution.

School Furniture
Procurement of dual desks and classroom chairs for higher secondary schools, ergonomic design, steel tubular frame and wooden top."""

    resp = client.post("/api/procurement/multi-item-analysis", json={"text": raw_text})
    assert resp.status_code == 200
    res = resp.json()
    
    items = res.get("items", [])
    print(f"Detected {len(items)} procurement items:")
    for it in items:
        item_id = it.get("id")
        title = it.get("title")
        analysis = res.get("item_analyses", {}).get(item_id, {})
        recs = [r.get("is_number") for r in analysis.get("recommendations", [])]
        reqs = analysis.get("extracted_requirements", [])
        quality = analysis.get("extraction_quality", {})
        
        print(f"  [{it.get('item_index')}] {title}")
        print(f"      Mapped Standards: {recs[:3]}")
        print(f"      Requirements: {len(reqs)}")
        print(f"      Quality Score: {quality.get('score')}% (Status: {quality.get('status')})")
        
        # Verify no corruption or garbage
        for r in reqs:
            t = r.get("requirement_text", "")
            orig = r.get("original_text", "")
            norm = r.get("normalized_requirement", "")
            assert "/Filter" not in t, f"Found /Filter in requirement {t}"
            assert "/FlateDecode" not in t, f"Found /FlateDecode in requirement {t}"
            assert "\ufffd" not in t, f"Found replacement char in requirement {t}"
            assert "/Filter" not in orig, f"Found /Filter in original {orig}"
            assert "/FlateDecode" not in orig, f"Found /FlateDecode in original {orig}"
    
    assert len(items) == 5, f"Expected 5 items, got {len(items)}"
    print("PASS: Multi-item separation and Unicode requirement integrity verified.")

def test_document_extract_sample():
    print("\nTesting /api/documents/extract with sample PDF...")
    import mimetypes
    
    pdf_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "sample_tenders", "Sample_Water_Storage_Tank_Tender.pdf"))
    if not os.path.exists(pdf_path):
        print(f"Sample PDF {pdf_path} not found, skipping file upload test")
        return
        
    with open(pdf_path, "rb") as f:
        file_bytes = f.read()

    resp = client.post(
        "/api/documents/extract",
        files={"file": ("Sample_Water_Storage_Tank_Tender.pdf", file_bytes, "application/pdf")}
    )
    assert resp.status_code == 200
    res = resp.json()
    
    print("Extract result status:", res.get("status"))
    print("Quality:", res.get("quality"))
    print("Extracted text preview:", res.get("text", "")[:150].replace("\n", " "))
    
    assert res.get("status") == "EXTRACTION_VERIFIED"
    assert "/Filter" not in res.get("text", "")
    assert "/FlateDecode" not in res.get("text", "")
    assert res.get("quality", {}).get("pdf_artifacts_detected") == 0
    print("PASS: Universal document extractor successfully extracted clean PDF text.")

def test_tender_isolation_and_reports():
    print("\n--- Testing Strict 3-Tender Isolation & Visual Report Generation ---")
    
    # 1. Tender A: Solar Street Lighting System
    solar_text = """GOVERNMENT PROCUREMENT SPECIFICATION FOR SOLAR STREET LIGHTING SYSTEM
Tender Reference ID: GEM-2026-B-894120
Clause 1.1 All-in-One Solar Street Light with high-efficiency monocrystalline PV module >= 90Wp
Clause 1.2 Luminaires: Minimum 40W outdoor LED Luminaire with efficacy >= 130 lm/W
Clause 1.3 Energy Storage: Lithium Iron Phosphate (LiFePO4) Battery Pack 12.8V, 36Ah
Clause 1.4 Charge Controller: MPPT charge controller with peak efficiency >= 95%
Clause 1.5 Compliance: Conforming to IS 10322 (Part 5/Sec 3) and IS 16221 (Part 2) safety"""

    resp_a = client.post("/api/procurement/intake", json={
        "text": solar_text,
        "input_type": "TEXT",
        "document_name": "Solar_Street_Light_Tender.pdf"
    })
    assert resp_a.status_code == 200
    data_a = resp_a.json()
    id_a = data_a["analysis_id"]
    assert "Solar" in data_a["product_name"]
    # Check primary standards contain IS 16221 or IS 10322
    stds_a = [r["is_number"] for r in data_a["recommendations"]]
    assert any("16221" in s or "10322" in s for s in stds_a)
    assert not any("13252" in s or "61010" in s for s in stds_a)  # No IT or Lab power standards!

    # 2. Tender B: Programmable DC Power Supply
    power_text = """DEFENCE RESEARCH LAB PROCUREMENT SPECIFICATION: PROGRAMMABLE DC POWER SUPPLY
Tender Reference ID: DRDO-RCI-2026-00451
Clause 1.1 Output Voltage: 0 to 60 V DC continuously adjustable with 1 mV resolution
Clause 1.2 Output Current: 0 to 30 A continuously adjustable with 1 mA resolution
Clause 1.3 Programming Accuracy: Voltage <= 0.05% + 5mV; Current <= 0.1% + 10mA
Clause 1.4 Ripple and Noise: <= 2 mVrms, <= 30 mVp-p (20 Hz to 20 MHz)
Clause 1.5 Safety Compliance: IS/IEC 61010-1 (Electrical Equipment for Measurement and Lab Use)
Clause 1.6 EMC Compliance: IS/IEC 61326-1 Class A emissions and industrial immunity"""

    resp_b = client.post("/api/procurement/intake", json={
        "text": power_text,
        "input_type": "TEXT",
        "document_name": "DC_Power_Supply_Tender.docx"
    })
    assert resp_b.status_code == 200
    data_b = resp_b.json()
    id_b = data_b["analysis_id"]
    assert "Power Supply" in data_b["product_name"]
    stds_b = [r["is_number"] for r in data_b["recommendations"]]
    assert any("61010" in s or "61326" in s for s in stds_b)
    assert not any("16221" in s or "10322" in s for s in stds_b)  # No Solar standards!

    # 3. Tender C: 24-Port Managed Gigabit Ethernet Switch
    switch_text = """GOVERNMENT TECHNICAL PROCUREMENT SPECIFICATION: 24-PORT MANAGED GIGABIT ETHERNET SWITCH
Tender Reference ID: TDR-2026-00128
Clause 1.1 Minimum 24 Auto-sensing 10/100/1000 Base-T RJ-45 Gigabit Ethernet Ports
Clause 1.2 Minimum 4 dedicated 1G/10G SFP+ optical uplink transceiver slots
Clause 1.3 Switching Capacity: 128 Gbps non-blocking wire-speed forwarding
Clause 1.4 Packet Forwarding Rate: Minimum 95 Mpps
Clause 1.5 Mandatory BIS Registration under MeitY CRS: IS 13252 (Part 1) / IS/IEC 62368-1"""

    resp_c = client.post("/api/procurement/intake", json={
        "text": switch_text,
        "input_type": "TEXT",
        "document_name": "Gigabit_Ethernet_Switch.pdf"
    })
    assert resp_c.status_code == 200
    data_c = resp_c.json()
    id_c = data_c["analysis_id"]
    assert "Switch" in data_c["product_name"]
    stds_c = [r["is_number"] for r in data_c["recommendations"]]
    assert any("13252" in s or "62368" in s for s in stds_c)
    assert not any("16221" in s or "61010" in s for s in stds_c)  # No Solar or Lab Power standards!

    # Strict ID Isolation
    assert id_a != id_b
    assert id_b != id_c
    assert id_a != id_c

    # Report Generation Isolation
    rep_a = client.post(f"/api/analysis/{id_a}/report").json()
    rep_b = client.post(f"/api/analysis/{id_b}/report").json()
    rep_c = client.post(f"/api/analysis/{id_c}/report").json()

    assert rep_a["report_id"] != rep_b["report_id"]
    assert rep_b["report_id"] != rep_c["report_id"]
    assert "Solar" in rep_a["procurement_title"]
    assert "Power Supply" in rep_b["procurement_title"]
    assert "Switch" in rep_c["procurement_title"]

    # Verify 404 on nonexistent analysis
    resp_404 = client.get("/api/analysis/NON-EXISTENT-ID/relationships")
    assert resp_404.status_code == 404

    print("PASS: Verified 100% domain isolation and report integrity across 3 tenders.")

def test_admin_endpoints():
    print("\n--- Testing Administration Endpoints ---")
    
    # 1. Add standard
    new_std = {
        "is_number": "IS 99999",
        "title": "Autonomous Robotics Testing Code",
        "category": "Robotics"
    }
    resp = client.post("/api/standards", json=new_std)
    assert resp.status_code == 200
    assert resp.json()["status"] == "SUCCESS"

    # 2. Add regulation
    new_reg = {
        "title": "Robotics Safety Quality Control Order 2026",
        "issuing_authority": "Ministry of Heavy Industries",
        "applicable_standard": "IS 99999",
        "qco_number": "S.O. 9988(E)"
    }
    resp = client.post("/api/regulations", json=new_reg)
    assert resp.status_code == 200
    assert resp.json()["status"] == "SUCCESS"

    # 3. Trigger reindex
    resp = client.post("/api/admin/reindex")
    assert resp.status_code == 200
    assert resp.json()["status"] == "SUCCESS"

    # 4. Gazette log
    resp = client.get("/api/admin/gazette-log")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)

    print("PASS: All administrative management endpoints verified.")

if __name__ == "__main__":
    test_health()
    test_multi_item()
    test_document_extract_sample()
    test_tender_isolation_and_reports()
    test_admin_endpoints()
    print("\nALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!")


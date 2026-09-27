"""
BharatSpec AI - Realistic Sample Procurement Specifications
Contains 6 comprehensive procurement documents across diverse engineering domains.
"""

from typing import List, Dict, Any

DEMO_SPECS: List[Dict[str, Any]] = [
    {
        "id": "demo-solar-001",
        "title": "Solar Street Lighting System (All-in-One / Split Type)",
        "product_name": "Solar Street Lighting System",
        "category": "Solar & Renewable Energy",
        "subcategory": "Street & Outdoor Lighting",
        "filename": "Tender_NIT_MNRE_SolarStreetLight_90W.docx",
        "department": "State Renewable Energy Development Agency (SREDA)",
        "summary": "Technical procurement specification for supply, installation, and 5-year comprehensive maintenance of 90W LED Solar Street Lighting Systems equipped with Lithium Ferro Phosphate (LiFePO4) battery and intelligent dusk-to-dawn charge controller.",
        "text": """GOVERNMENT OF INDIA - STATE RENEWABLE ENERGY DEVELOPMENT AGENCY
NOTICE INVITING TENDER (NIT): SREDA/SOLAR-SL/2026/04

SECTION 3: TECHNICAL SPECIFICATIONS FOR 90W SOLAR STREET LIGHTING SYSTEM

1. SCOPE OF WORK:
Supply, testing at manufacturer works, installation, commissioning, and 5 years comprehensive warranty maintenance of integrated 90W Solar LED Street Lighting Systems for urban and rural arterial roadways.

2. SOLAR PHOTOVOLTAIC (PV) MODULE:
2.1 The PV module shall be Mono-crystalline or Poly-crystalline silicon type with minimum peak capacity of 180 Wp at Standard Test Conditions (STC: 1000 W/m2, 25°C, AM 1.5).
2.2 The module efficiency shall not be less than 18.5% with fill factor greater than 72%.
2.3 The module must withstand mechanical surface wind pressure loads of up to 2400 Pa and snow loads of 5400 Pa.
2.4 Terminal junction box shall have minimum IP65 weather protection and bypass diodes to minimize shading hotspots.
2.5 PV module must comply with design qualification and type approval standards.

3. LED LUMINAIRE & OPTICS:
3.1 The luminaire wattage shall be 90W with high-power white LEDs (Philips Lumileds / Osram or equivalent).
3.2 Luminaire system efficacy shall be minimum 130 Lumens per Watt.
3.3 Correlated Color Temperature (CCT) shall be 5700K (+/- 300K) cool white with Color Rendering Index (CRI) not less than 70.
3.4 The luminaire housing shall be pressure die-cast aluminium with high-grade thermal dissipation fins and corrosion-resistant powder coating.
3.5 Ingress Protection rating of the complete optical and electronic compartment shall be minimum IP65, preferably IP66.
3.6 Impact resistance rating of the optical lens diffuser shall be minimum IK08.
3.7 Optical distribution shall be bat-wing batwing type suitable for road illumination with uniformity ratio > 0.4.

4. BATTERY & ENERGY STORAGE:
4.1 The battery shall be Lithium Ferro Phosphate (LiFePO4) chemistry with minimum nominal capacity of 12.8V, 60Ah (768 Watt-hours).
4.2 Battery shall deliver minimum 2500 cycles at 80% Depth of Discharge (DoD) at 25°C.
4.3 The battery pack shall incorporate a smart Battery Management System (BMS) with overcharge, deep discharge, overcurrent, cell balancing, and short-circuit protection.
4.4 Operating temperature for battery charging and discharging is specified as -10°C to 50°C. Note: Section 7 states ambient storage range as 0°C to 45°C.
4.5 Battery pack housing must be flame-retardant and sealed against moisture ingress.

5. CHARGE CONTROLLER & DRIVER ELECTRONICS:
5.1 Charge controller shall be MPPT (Maximum Power Point Tracking) type with tracking efficiency >= 98%.
5.2 Microcontroller-based automatic dusk-to-dawn sensor operation with dimming profile (first 4 hours 100%, next 4 hours 50%, remaining duration until dawn 100%).
5.3 Built-in electronic surge protection device capable of withstanding voltage surges up to 4kV / 10kV line-to-earth.
5.4 Total Harmonic Distortion (THD) of control gear shall be less than 10%, and power factor shall be greater than 0.95.

6. MECHANICAL MOUNTING & POLE:
6.1 Octagonal hot-dip galvanized steel pole of height 7 meters with minimum 3 mm wall thickness.
6.2 Zinc coating mass shall be minimum 400 g/m2 per standard hot-dip galvanizing specifications.
6.3 The pole structure must withstand gust wind speeds up to 150 km/h.
6.4 High-tensile anchor foundation bolts with civil foundation M20 concrete footing.

7. WARRANTY & DOCUMENTATION:
7.1 5 years comprehensive on-site warranty for entire system including luminaire, electronics, and battery; 10 years for PV module.
7.2 Bidder must submit BIS certification test reports, manufacturer test certificates, and warranty bond.
""",
        "stats": {
            "requirements": 27,
            "applicable_standards": 8,
            "high_relevance": 5,
            "medium_relevance": 3,
            "regulatory_review": 3,
            "unmapped": 4,
            "potential_gaps": 3,
            "conflicts": 1,
            "evidence_items": 9,
            "coverage_indicator": 86
        }
    },
    {
        "id": "demo-med-002",
        "title": "Motorized ICU Hospital Bed with Emergency CPR Release",
        "product_name": "Motorized ICU Hospital Bed",
        "category": "Medical Devices & Healthcare Equipment",
        "subcategory": "Hospital Furniture & Beds",
        "filename": "Tender_AIIMS_ICU_MotorizedBed_Spec.pdf",
        "department": "All India Institute of Medical Sciences (AIIMS) Procurement Cell",
        "summary": "Procurement specification for electrically operated multi-function Intensive Care Unit (ICU) hospital beds with Nurse Control Panel, CPR quick mechanical release, Trendelenburg positions, and integrated central brake castor system.",
        "text": """ALL INDIA INSTITUTE OF MEDICAL SCIENCES (AIIMS)
CENTRAL MEDICAL PROCUREMENT DIVISION
NIT NO: AIIMS/ENG/MED-BED/2026/12

TECHNICAL SPECIFICATION FOR MOTORIZED ICU HOSPITAL BED

1. GENERAL INTENDED USE:
High-dependency Intensive Care Unit (ICU) motorized bed suitable for adult critical care patients, providing electrically adjustable backrest, knee-rest, height elevation, Trendelenburg and Reverse Trendelenburg tilt.

2. DIMENSIONS & STRUCTURAL INTEGRITY:
2.1 Overall length shall be 2150 mm to 2250 mm; overall width 980 mm to 1050 mm.
2.2 Safe Working Load (SWL) capacity shall be not less than 250 kg (patient weight rating minimum 185 kg plus mattress and accessories).
2.3 Mattress platform shall be 4-section detachable perforated ABS or epoxy-coated steel sheet allowing easy disinfection and radiolucency for X-ray cassette insertion.
2.4 Frame fabricated from high-grade ERW mild steel tubular sections pre-treated and coated with antimicrobial epoxy polyester powder coating (dry film thickness >= 70 microns).
2.5 Dual-sided instantaneous manual emergency CPR release handle located near headrest for mechanical flattening of backrest in under 3 seconds during cardiac arrest.

3. MOTORS & ELECTRICAL SAFETY:
3.1 Linear actuator motors (Linak / Dewert or equivalent) operating on 230V AC, 50 Hz mains with built-in rechargeable backup battery providing at least 25 full cycles upon mains failure.
3.2 Electrical protection Class I with Type B or BF applied part classification in compliance with electromedical equipment safety.
3.3 Earth leakage current under normal operating conditions shall not exceed 500 microamperes (uA).
3.4 Handset for patient control and lockable Nurse Control Panel (ACP) integrated at footboard with one-button cardiac chair position.
3.5 Ingress Protection rating for all electrical actuators and control boxes shall be minimum IPX4 (fluid splash-proof).

4. SAFETY SIDE RAILS & CASTOR WHEELS:
4.1 Four-piece foldable tuck-away split polymer side rails with gas-spring damper mechanism.
4.2 Gap between side rails and between side rail and head/foot boards shall strictly comply with entrapment prevention safety probes to prevent patient head or limb entrapment.
4.3 Castor wheels: Four heavy-duty 125 mm or 150 mm diameter anti-static polyurethane castors with central braking mechanism and steering direction lock pedal accessible from both sides.

5. MATTRESS & BIOCOMPATIBILITY:
5.1 High-density medical grade polyurethane foam mattress (minimum density 40 kg/m3) with thickness 100 mm to 125 mm.
5.2 Mattress cover shall be antimicrobial, waterproof, breathable, biocompatible (non-cytotoxic and skin non-irritant), fire retardant, and resistant to hospital hospital-grade chemical disinfectants (sodium hypochlorite, isopropyl alcohol).

6. REGULATORY & QUALITY STANDARDS:
6.1 Bed must be certified under relevant electromedical safety standards and medical bed particular standards.
6.2 Manufacturer must hold valid ISO 13485 (Medical Devices Quality Management System) and CE / CDSCO medical device registration.
""",
        "stats": {
            "requirements": 24,
            "applicable_standards": 6,
            "high_relevance": 4,
            "medium_relevance": 2,
            "regulatory_review": 3,
            "unmapped": 3,
            "potential_gaps": 2,
            "conflicts": 0,
            "evidence_items": 8,
            "coverage_indicator": 88
        }
    },
    {
        "id": "demo-trans-003",
        "title": "11kV/433V 250 kVA Oil-Immersed Distribution Transformer",
        "product_name": "Electrical Distribution Transformer",
        "category": "Electrical & Power Transmission",
        "subcategory": "Distribution Transformers",
        "filename": "DISCOM_Power_Transformer_250kVA_Tender.docx",
        "department": "State Power Distribution Corporation Limited (DISCOM)",
        "summary": "Technical procurement specification for 250 kVA, 11/0.433 kV, 3-Phase, 50 Hz, outdoor type, oil-immersed natural cooled (ONAN) copper wound distribution transformers conforming to Energy Efficiency Level 2 / BEE 3-Star.",
        "text": """STATE POWER DISTRIBUTION CORPORATION LIMITED (DISCOM)
NIT NO: DISCOM/PROC/DT-250KVA/2026/08

TECHNICAL SPECIFICATION FOR 250 KVA 11/0.433 KV DISTRIBUTION TRANSFORMERS

1. SCOPE:
Design, engineering, manufacturing, assembly, shop testing, supply, and delivery of 250 kVA, 11 kV/433 V outdoor type, mineral oil-immersed, naturally cooled (ONAN), step-down distribution transformers.

2. SERVICE CONDITIONS:
2.1 Peak ambient temperature: 50°C; Maximum daily average: 40°C; Minimum ambient temperature: -5°C.
2.2 Altitude: Not exceeding 1000 meters above Mean Sea Level. Relative humidity: up to 100%.

3. PRINCIPAL PARAMETERS:
3.1 Continuous Rated Capacity: 250 kVA.
3.2 Voltage Ratio: Nominal 11,000 Volts Primary / 433-250 Volts Secondary at no load.
3.3 Number of Phases: 3 Phase, Frequency: 50 Hz (+/- 3%).
3.4 Vector Group: Dyn11 (Delta high voltage / Star low voltage with neutral brought out).
3.5 Winding Material: Electrolytic Grade Copper with double paper covering (DPC). Aluminium windings strictly prohibited.

4. ENERGY LOSSES & EFFICIENCY (ENERGY EFFICIENCY LEVEL 2 / BEE 3-STAR):
4.1 Maximum total losses at 50% loading at 75°C shall not exceed 920 Watts.
4.2 Maximum total losses at 100% loading at 75°C shall not exceed 2700 Watts.
4.3 Percentage impedance at 75°C and reference frequency: 4.5% (+/- tolerance as per standard).

5. TEMPERATURE RISE LIMITS:
5.1 Temperature rise of top oil measured by thermometer shall not exceed 40°C over maximum ambient temperature.
5.2 Temperature rise of winding measured by resistance shall not exceed 45°C over maximum ambient temperature.

6. INSULATING OIL:
6.1 Transformer shall be supplied filled with first charge of virgin mineral insulating oil.
6.2 Oil breakdown voltage (BDV) shall be minimum 60 kV (RMS) before commissioning.
6.3 Moisture content shall not exceed 25 ppm; dielectric dissipation factor (tan delta) <= 0.005 at 90°C.

7. TANK CONSTRUCTION & FITTINGS:
7.1 Tank fabricated from robust mild steel plates with continuous welded cooling radiator fins.
7.2 Tank shall withstand pressure test of 80 kPa for 30 minutes and vacuum test of 50 kPa.
7.3 Fittings shall include: Dehydrating silica gel breather, prismatic oil level gauge, explosion vent / pressure relief device, bi-directional roller wheels, rating & diagram plate, and two dedicated independent earthing terminals with M12 bolts.

8. TESTING & QUALITY ASSURANCE:
8.1 Mandatory Type Test Certificate for Short-Circuit Withstand Capability and Lightning Impulse Withstand (75 kV peak) from CPRI or ERDA conducted within the last 5 years.
8.2 Routine testing including winding resistance, ratio, polarity, no-load loss, and load loss at manufacturer works.
""",
        "stats": {
            "requirements": 25,
            "applicable_standards": 7,
            "high_relevance": 5,
            "medium_relevance": 2,
            "regulatory_review": 3,
            "unmapped": 2,
            "potential_gaps": 2,
            "conflicts": 0,
            "evidence_items": 10,
            "coverage_indicator": 92
        }
    },
    {
        "id": "demo-led-004",
        "title": "Commercial 120W LED Street Light Luminaire",
        "product_name": "LED Street Light Luminaire",
        "category": "Lighting & Luminaires",
        "subcategory": "Street & Outdoor Lighting",
        "filename": "Municipal_Corp_SmartCity_LED120W_Tender.pdf",
        "department": "Smart City Development Corporation Ltd.",
        "summary": "Technical specification for procurement and smart-city retrofitting of 120W energy-efficient pressure die-cast LED street lights with 10kV surge protection, 440V high-voltage endurance, and NEMA/Zhaga smart receptacle.",
        "text": """MUNICIPAL SMART CITY DEVELOPMENT CORPORATION
TENDER SPECIFICATION: SMART-LED-STREETLIGHT-120W-2026

1. INTENDED APPLICATION:
Public roadway and expressway illumination under smart municipal lighting modernization programme.

2. TECHNICAL SPECIFICATIONS:
2.1 System Wattage: 120 Watts (+/- 5%).
2.2 Luminous Efficacy: Not less than 135 Lumens/Watt at system level.
2.3 Color Temperature (CCT): 5700K (Daylight White); Color Rendering Index (CRI): >= 70.
2.4 Housing: High-pressure die-cast aluminium alloy (LM6 or equivalent) with aerodynamic profile and polyester powder coating tested for 1000 hours salt spray resistance.
2.5 Ingress Protection: IP66 for complete luminaire (both optical and driver compartments).
2.6 Impact Resistance: IK08 toughened glass cover.

3. ELECTRICAL & DRIVER REQUIREMENTS:
3.1 Operating input voltage: 140V to 277V AC, 50 Hz.
3.2 High voltage protection: Driver must withstand 440V AC phase-to-phase overvoltage for minimum 4 hours without failure.
3.3 Built-in Surge Protection: Minimum 10 kV / 10 kA SPD (Line-Earth, Line-Line).
3.4 Power Factor: >= 0.98 at full load; Total Harmonic Distortion (THD): < 10%.
3.5 Driver efficiency: Greater than 90%.

4. SMART CONTROLS & COMPLIANCE:
4.1 7-pin ANSI C136.41 NEMA or Zhaga Book 18 receptacle on top of luminaire for smart IoT photocell / sensor integration.
4.2 BIS certification under Luminaires Quality Control Order mandatory.
4.3 LM-79 and LM-80 test reports from NABL accredited laboratory showing LED life > 50,000 hours with L70 lumen maintenance.
""",
        "stats": {
            "requirements": 21,
            "applicable_standards": 5,
            "high_relevance": 4,
            "medium_relevance": 1,
            "regulatory_review": 2,
            "unmapped": 2,
            "potential_gaps": 2,
            "conflicts": 0,
            "evidence_items": 7,
            "coverage_indicator": 90
        }
    },
    {
        "id": "demo-it-005",
        "title": "Enterprise Desktop Workstation & IT Computing Equipment",
        "product_name": "Enterprise Desktop Workstation",
        "category": "Electronics & IT Equipment",
        "subcategory": "IT Hardware Safety",
        "filename": "GeM_Custom_Bid_Enterprise_Workstation.txt",
        "department": "National Informatics Centre / PSU IT Procurement",
        "summary": "Procurement of commercial desktop computers and workstations with TPM 2.0 security, energy efficiency, MeitY CRO registration, and 3-year OEM on-site warranty.",
        "text": """NATIONAL IT INFRASTRUCTURE DEVELOPMENT CORPORATION
TECHNICAL SPECIFICATIONS FOR DESKTOP WORKSTATIONS (HIGH-END)

1. PROCESSOR & CHIPSET:
1.1 Latest Generation 14-Core / 20-Thread x86-64 processor with minimum base clock 2.5 GHz and turbo boost up to 4.8 GHz (Intel Core i7-14700 / AMD Ryzen 7 or equivalent).
1.2 Motherboard with enterprise commercial chipset supporting PCIe 4.0/5.0 and hardware virtualization.

2. MEMORY & STORAGE:
2.1 32 GB DDR5 RAM operating at 4800 MHz or higher, expandable to 128 GB.
2.2 1 TB NVMe M.2 PCIe Gen 4 SSD with sequential read speeds >= 5000 MB/s.

3. SECURITY & MANAGEMENT:
3.1 Discrete TPM 2.0 (Trusted Platform Module) microchip onboard for hardware-based cryptographic key storage and Windows 11 / Linux secure boot.
3.2 Chassis intrusion sensor with BIOS event logging and Kensington physical security lock slot.

4. POWER SUPPLY & ENERGY EFFICIENCY:
4.1 Internal Power Supply Unit (SMPS) with minimum 300W continuous output and 80 PLUS Platinum certification (efficiency >= 92% at 50% load).
4.2 Compliance with Energy Star 8.0 and RoHS environmental guidelines.

5. SAFETY, COMPLIANCE & WARRANTY:
5.1 Mandatory BIS Compulsory Registration Scheme (CRS) certificate under MeitY Electronics and IT Goods Order.
5.2 Compliance with Indian Standard for IT equipment safety.
5.3 3 Years Comprehensive Next Business Day (NBD) OEM on-site warranty.
""",
        "stats": {
            "requirements": 20,
            "applicable_standards": 4,
            "high_relevance": 3,
            "medium_relevance": 1,
            "regulatory_review": 1,
            "unmapped": 3,
            "potential_gaps": 2,
            "conflicts": 0,
            "evidence_items": 6,
            "coverage_indicator": 85
        }
    },
    {
        "id": "demo-switch-006",
        "title": "24-Port Managed Gigabit Ethernet L2/L3 Network Switch",
        "product_name": "Managed Gigabit Ethernet Network Switch",
        "category": "Electronics & IT Equipment",
        "subcategory": "Networking Equipment",
        "filename": "Managed_Gigabit_Ethernet_Network_Switch_Tender.docx",
        "department": "National Informatics Division / Central IT Procurement",
        "summary": "Technical procurement specification for 24-Port Managed Gigabit Ethernet L2/L3 Network Switches with 4 SFP+ uplinks, wire-speed 128 Gbps switching capacity, IEEE 802.1Q VLAN, and MeitY CRS compliance.",
        "text": """CENTRAL IT PROCUREMENT CELL - NATIONAL INFORMATICS DIVISION
NOTICE INVITING TENDER: NID/IT-NET/2026/09
TENDER FOR: Procurement of 24-Port Managed Gigabit Ethernet L2/L3 Network Switches

SECTION 2: TECHNICAL SPECIFICATIONS FOR MANAGED NETWORK SWITCHES
1. PORT DENSITY & INTERFACES:
1.1 Minimum 24 auto-sensing 10/100/1000 Base-T RJ-45 Gigabit Ethernet ports.
1.2 Minimum 4 dedicated 1G/10G SFP+ optical uplink transceiver slots.
1.3 Dedicated out-of-band Gigabit Ethernet management port and RJ-45/USB Type-C console interface.
2. PERFORMANCE & SWITCHING FABRIC:
2.1 Switching capacity shall be minimum 128 Gbps non-blocking wire-speed fabric.
2.2 Packet forwarding rate shall be not less than 95 Mpps (Million packets per second).
2.3 Packet buffer memory shall be minimum 4 MB dynamically shared across all ports.
2.4 MAC address table capacity: Minimum 16,000 MAC address entries.
3. LAYER-2 & LAYER-3 FEATURES:
3.1 IEEE 802.1Q VLAN tagging with support for minimum 4094 active VLAN IDs.
3.2 Support for Port-based VLAN, MAC-based VLAN, Protocol-based VLAN, and Voice VLAN.
3.3 Spanning Tree Protocols: Conformance to IEEE 802.1D STP, IEEE 802.1w Rapid Spanning Tree (RSTP), and IEEE 802.1s Multiple Spanning Tree (MSTP).
3.4 Quality of Service (QoS): IEEE 802.1p CoS with minimum 8 hardware priority queues per port, Weighted Round Robin (WRR) and Strict Priority (SP) scheduling.
3.5 Link Aggregation: IEEE 802.3ad LACP supporting up to 8 link aggregation groups.
4. SECURITY & ACCESS CONTROL:
4.1 IEEE 802.1X Port-Based Network Access Control with RADIUS and TACACS+ centralized authentication.
4.2 Port Security, DHCP Snooping, Dynamic ARP Inspection (DAI), and IP Source Guard.
4.3 Hardware Access Control Lists (ACLs) supporting IPv4 and IPv6 packet filtering based on Layer 2/3/4 headers.
5. NETWORK MANAGEMENT & MONITORING:
5.1 Secure Web GUI (HTTPS), Command Line Interface (CLI) over SSHv2, and Telnet.
5.2 SNMPv1, SNMPv2c, and SNMPv3 support with RMON groups 1, 2, 3, and 9.
5.3 Full dual-stack IPv4 and IPv6 management and routing capabilities.
6. POWER SUPPLY & MECHANICAL:
6.1 Dual redundant hot-swappable internal power supplies operating on 100-240V AC, 50/60 Hz.
6.2 Standard 19-inch 1U rack-mountable sheet steel chassis including complete mounting brackets.
6.3 Enclosure protection rating shall be minimum IP20.
6.4 Operating temperature: 0°C to 50°C, Operating humidity: 10% to 90% non-condensing.
7. COMPLIANCE & STANDARDS:
7.1 Mandatory BIS Compulsory Registration Scheme (CRS) certificate under MeitY Electronics and IT Goods Order per IS 13252 (Part 1) or IS/IEC 62368-1.
7.2 Electromagnetic Compatibility (EMC): Conformance to IS/IEC 61000-4-2 (Electrostatic Discharge), IS/IEC 61000-4-3 (Radiated RF), and IS/IEC 61000-4-5 (Surge Immunity).
7.3 3 Years Comprehensive 24x7 OEM on-site warranty with advance hardware replacement SLA.
""",
        "stats": {
            "requirements": 26,
            "applicable_standards": 8,
            "high_relevance": 5,
            "medium_relevance": 3,
            "regulatory_review": 2,
            "unmapped": 2,
            "potential_gaps": 2,
            "conflicts": 0,
            "evidence_items": 7,
            "coverage_indicator": 92
        }
    },
    {
        "id": "demo-ps-007",
        "title": "Programmable Laboratory DC Power Supply (0-60V, 0-30A, 900W)",
        "product_name": "Programmable Laboratory DC Power Supply",
        "category": "Electrical & Electronic Test Equipment",
        "subcategory": "Test & Measurement Instruments",
        "filename": "Programmable_DC_Power_Supply_Tender.docx",
        "department": "Defence Research & Electronics Testing Laboratory",
        "summary": "Technical procurement specification for high-precision 900W autoranging programmable laboratory DC power supplies with SCPI digital control, low ripple (< 2 mVrms), CV/CC crossover, and NABL calibration.",
        "text": """DEFENCE RESEARCH & ELECTRONICS TESTING LABORATORY
NOTICE INVITING TENDER: DETL/PROC/LAB-PS/2026/15
TENDER FOR: Supply of High-Precision Programmable Laboratory DC Power Supplies (0-60V, 0-30A, 900W)

SECTION 3: TECHNICAL SPECIFICATIONS FOR LABORATORY DC POWER SUPPLY
1. OUTPUT RATINGS & PERFORMANCE:
1.1 Output Voltage: Continuously programmable from 0 to 60 Volts DC.
1.2 Output Current: Continuously programmable from 0 to 30 Amperes DC.
1.3 Output Power: Total continuous output power shall be minimum 900 Watts with autoranging V/I envelope.
1.4 Line Regulation: <= 0.01% + 2 mV for voltage; <= 0.01% + 250 uA for current.
1.5 Load Regulation: <= 0.01% + 2 mV for voltage; <= 0.01% + 250 uA for current.
1.6 Voltage Ripple and Noise (20 Hz to 20 MHz): Not exceeding 2 mVrms / 20 mV peak-to-peak.
1.7 Current Ripple: Less than 5 mArms.
2. ACCURACY & PROGRAMMING RESOLUTION:
2.1 Programming Resolution: Voltage resolution <= 1 mV; Current resolution <= 1 mA.
2.2 Readback Accuracy: Voltage +/- (0.05% + 10 mV); Current +/- (0.1% + 10 mA).
2.3 Transient Response Time: Less than 50 microseconds for output recovery to within 15 mV following a 50% to 100% load step.
3. OPERATING MODES & PROTECTIONS:
3.1 Seamless automatic crossover between Constant Voltage (CV) and Constant Current (CC) modes.
3.2 Comprehensive hardware and software protection: Over Voltage Protection (OVP), Over Current Protection (OCP), Over Temperature Protection (OTP), and Reverse Voltage Polarity Protection.
3.3 Output enable/disable electronic soft switch with isolated floating output terminals.
4. USER INTERFACE & REMOTE CONNECTIVITY:
4.1 Minimum 4.3-inch high-resolution color TFT display showing simultaneous real-time voltage, current, power, and operational mode.
4.2 Standard remote programming interfaces: USB (USBTMC), RS-232, and LAN (LXI Core 2011 compliant) with SCPI command set.
4.3 Analog programming and monitoring interface (0-5V / 0-10V control inputs).
5. ELECTRICAL & ENVIRONMENTAL SPECIFICATIONS:
5.1 Universal AC input: 100V to 240V AC (+/- 10%), single phase, 47-63 Hz with active Power Factor Correction (PFC >= 0.98).
5.2 Operating temperature: 0°C to 40°C, Relative humidity: up to 80% non-condensing.
5.3 Cooling: Forced air cooling with low-noise temperature-controlled smart fan.
5.4 Chassis earthing terminal complying with IS 3043 Code of Practice for Earthing.
6. SAFETY & QUALITY STANDARDS:
6.1 Safety conformity: Conformance to IS/IEC 61010-1 Safety Requirements for Electrical Equipment for Measurement, Control, and Laboratory Use.
6.2 Electromagnetic Compatibility (EMC): Conformance to IS/IEC 61326-1 for laboratory equipment and IS/IEC 61000-3-2 for AC harmonic emissions.
6.3 Calibration: Valid calibration certificate from an NABL accredited laboratory (ISO/IEC 17025) with reported measurement uncertainties.
6.4 3 Years Comprehensive OEM warranty including parts and calibration support.
""",
        "stats": {
            "requirements": 25,
            "applicable_standards": 6,
            "high_relevance": 4,
            "medium_relevance": 2,
            "regulatory_review": 1,
            "unmapped": 2,
            "potential_gaps": 2,
            "conflicts": 0,
            "evidence_items": 7,
            "coverage_indicator": 92
        }
    }
]

-- ==========================================================
-- MediCare Database Seed Migration V2__seed_data.sql
-- Matches the Stitch Design Data & Entities
-- ==========================================================

-- 1. Seed Users (Demo Patient & Doctor & Admin)
-- Password for all demo accounts: Password123!
-- BCrypt Hash: $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a (or $2a$10$e7xG7g4Z3Dq7vPq1G6.8OOG4Fw8K6u5Qv8dG6j9W8L8l4K3N2m1O.)
-- Using standard BCrypt hash for "Password123!"
INSERT INTO users (username, email, password_hash, full_name, phone, role, email_verified)
VALUES 
('johnathan_vance', 'j.vance@vancetech.io', '$2a$10$wT0XkO057wJvT6uI3dM7ceC7vHj2u5iT6u7M6K1Jg2aN2cRjT2K4e', 'Johnathan Vance', '+1 (555) 234-8901', 'ROLE_PATIENT', 1),
('dr_michael_collins', 'm.collins@medicare.health', '$2a$10$wT0XkO057wJvT6uI3dM7ceC7vHj2u5iT6u7M6K1Jg2aN2cRjT2K4e', 'Dr. Michael Collins', '+1 (800) 555-0199', 'ROLE_DOCTOR', 1),
('admin', 'admin@medicare.health', '$2a$10$wT0XkO057wJvT6uI3dM7ceC7vHj2u5iT6u7M6K1Jg2aN2cRjT2K4e', 'System Administrator', '+1 (800) 555-0100', 'ROLE_ADMIN', 1);

-- 2. Seed Patient Profile for Johnathan Vance
INSERT INTO patients (user_id, date_of_birth, gender, blood_group, height, weight, address, emergency_contact_name, emergency_contact_phone, allergies, chronic_conditions)
VALUES (
    1,
    '11/18/1981',
    'Male (He/Him)',
    'O+ Rh Positive',
    '6''1" (185 cm)',
    '178 lbs (23.5 BMI)',
    '742 Evergreen Terrace, Pavilion B, San Francisco, CA',
    'Eleanor Vance',
    '+1 (555) 234-8902',
    'Penicillin (High Risk Anaphylaxis Alert), Sulfa Drugs',
    'Mild Hypertension, Seasonal Rhinitis'
);

-- 3. Seed Hospitals
INSERT INTO hospitals (name, tagline, description, address, city, state, zip_code, phone, email, rating, review_count, accreditation, trauma_level, image_url, emergency_open_247, inpatient_suites, icu_beds, robotic_or_suites, daily_capacity)
VALUES 
(
    'Aurora Medical Center & Research Institute',
    'Center of Clinical Excellence & Biophilic Healthcare',
    'Aurora Medical Center stands at the forefront of contemporary interventional care, integrating biophilic architecture with next-generation robotic surgery, artificial intelligence-assisted diagnostics, and personalized clinical protocols. Recognized as Metro Central premier tertiary referral center, Aurora serves over 140,000 ambulatory and acute inpatients each year with exemplary safety records.',
    '450 Health Sciences Blvd',
    'Metro Central',
    'NY',
    '10021',
    '+1 (800) 555-0199',
    'aurora@medicare.health',
    4.90,
    1840,
    'JCI Accredited',
    'Level 1 Trauma Center',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAN3SKuIUs3XTkdnVutvGVRQkTwgnnknqiPex5hGVmjeyqUYRWMUifiUaBQxO6dibq1FTRCnNzS1BK4cz9y_kvd-FJsSkZJAZmKsKzmEe0qoHbCkpigOZXeXtO-yl7zwUrak7j3e3GYJne93z0i01eoT38hmSAQqVuz1quD9JT3NSMWH1qrhqeiqeyDbwEV7cDU9tn_M1WjOYe-7sG3PutGhX-FEJpZkoTZr7uaCwMXFhwhHUgQEejP',
    1,
    420,
    64,
    18,
    1500
),
(
    'Metro West Emergency & Trauma Pavilion',
    'Rapid Surgical Interventions & Acute Care',
    'Comprehensive regional acute hospital equipped with helipad, 24-suite surgical triage wings, and specialized vascular surgery centers.',
    '820 Hudson Parkway',
    'Metro West',
    'NY',
    '10028',
    '+1 (800) 555-0240',
    'metrowest@medicare.health',
    4.85,
    920,
    'JCI Accredited',
    'Level 1 Trauma Center',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAN3SKuIUs3XTkdnVutvGVRQkTwgnnknqiPex5hGVmjeyqUYRWMUifiUaBQxO6dibq1FTRCnNzS1BK4cz9y_kvd-FJsSkZJAZmKsKzmEe0qoHbCkpigOZXeXtO-yl7zwUrak7j3e3GYJne93z0i01eoT38hmSAQqVuz1quD9JT3NSMWH1qrhqeiqeyDbwEV7cDU9tn_M1WjOYe-7sG3PutGhX-FEJpZkoTZr7uaCwMXFhwhHUgQEejP',
    1,
    280,
    48,
    12,
    900
);

-- 4. Seed Departments for Aurora Medical Center (Hospital ID = 1)
INSERT INTO departments (hospital_id, name, description, icon_name, head_doctor_name)
VALUES 
(1, 'Cardiovascular Medicine & Electrophysiology', 'Tertiary cardiovascular interventions, robotic valve repair, and complex electrophysiology mapping.', 'cardiology', 'Dr. Michael Collins, MD'),
(1, 'Neurology & Cognitive Research Institute', 'Advanced clinical neurology, comprehensive stroke management, and neurodegenerative therapeutics.', 'neurology', 'Dr. Sarah Wilson, MD'),
(1, 'Robotic Orthopedics & Joint Reconstruction', 'Computer-navigated arthroplasty, sports surgery, and accelerated physical rehabilitation.', 'orthopedics', 'Dr. Aarav Sharma, MD'),
(1, 'Precision Oncology & Cellular Therapeutics', 'Targeted immunotherapies, genomic tumor board coordination, and cellular infusion therapies.', 'oncology', 'Dr. Emily Johnson, MD');

-- 5. Seed Doctors
INSERT INTO doctors (hospital_id, department_id, name, title, specialty, license_number, experience_years, languages, rating, review_count, consultation_fee, room_suite, bio, education, avatar_url, available_this_week)
VALUES 
(
    1,
    1,
    'Dr. Michael Collins',
    'MD, FACC',
    'Senior Consultant Cardiologist & Electrophysiologist',
    'NY-884210',
    14,
    'English, Spanish',
    4.95,
    380,
    250.00,
    'Pavilion Suite 420-B',
    'Dr. Michael Collins is a board-certified interventional cardiologist and cardiac electrophysiologist with extensive experience in rhythm disorders, pacemaker implantations, and catheter ablations. He completed his clinical training at Johns Hopkins Medicine and Harvard Medical School.',
    'MD - Johns Hopkins School of Medicine | Fellowship - Harvard Cardiology Program | Board Certified in Cardiovascular Diseases & Cardiac Electrophysiology',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCobnWtP2WoFHBd1hGTiKWhxEEeSupZTLzUxDsyR_3VKgUifYnjjteJ6W36wKUPoTnLY90qH4t8RWdPEqYohUECJ4qfuM27t2CgRMWwozefJAlJzzl3pZpq_as5v9YJBa9C20hL905M7DTcC_lElglDIl9Th2FmG7lGWly4CHq6rOwv3UHIF2R4TSKPV0n5V7EVjhbCnXzJdrw_l2PrO-OHFrQ2ZjWOfw4TV7g2PWZm9OGaVFldUrxX',
    1
),
(
    1,
    2,
    'Dr. Sarah Wilson',
    'MD, PhD',
    'Chief of Neurosciences & Stroke Management',
    'NY-772194',
    18,
    'English, French',
    4.98,
    510,
    280.00,
    'Neuro Pavilion Suite 302',
    'Dr. Sarah Wilson specializes in acute interventional stroke therapy, cerebrovascular disorders, and translational neuro-rehabilitation protocols.',
    'MD/PhD - Columbia University College of Physicians and Surgeons | Residency - Mayo Clinic Neurology',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCobnWtP2WoFHBd1hGTiKWhxEEeSupZTLzUxDsyR_3VKgUifYnjjteJ6W36wKUPoTnLY90qH4t8RWdPEqYohUECJ4qfuM27t2CgRMWwozefJAlJzzl3pZpq_as5v9YJBa9C20hL905M7DTcC_lElglDIl9Th2FmG7lGWly4CHq6rOwv3UHIF2R4TSKPV0n5V7EVjhbCnXzJdrw_l2PrO-OHFrQ2ZjWOfw4TV7g2PWZm9OGaVFldUrxX',
    1
),
(
    1,
    3,
    'Dr. Aarav Sharma',
    'MS, FRCS',
    'Senior Orthopedic Surgeon & Sports Medicine Director',
    'NY-664019',
    12,
    'English, Hindi',
    4.92,
    290,
    230.00,
    'East Surgical Wing 110',
    'Dr. Aarav Sharma has performed over 3,000 minimally invasive robotic arthroplasties and reconstructive knee and shoulder surgeries for professional athletes.',
    'MS Orthopedics - AIIMS New Delhi | Fellowship in Adult Reconstruction - Stanford University',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCobnWtP2WoFHBd1hGTiKWhxEEeSupZTLzUxDsyR_3VKgUifYnjjteJ6W36wKUPoTnLY90qH4t8RWdPEqYohUECJ4qfuM27t2CgRMWwozefJAlJzzl3pZpq_as5v9YJBa9C20hL905M7DTcC_lElglDIl9Th2FmG7lGWly4CHq6rOwv3UHIF2R4TSKPV0n5V7EVjhbCnXzJdrw_l2PrO-OHFrQ2ZjWOfw4TV7g2PWZm9OGaVFldUrxX',
    1
),
(
    1,
    4,
    'Dr. Emily Johnson',
    'MD',
    'Director of Hematologic & Cellular Oncology',
    'NY-991204',
    16,
    'English, German',
    4.96,
    440,
    300.00,
    'Oncology Tower Suite 501',
    'Dr. Emily Johnson leads integrative clinical trials focusing on targeted biotherapies and compassionate care protocols.',
    'MD - UCSF School of Medicine | Fellowship in Medical Oncology - Memorial Sloan Kettering Cancer Center',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCobnWtP2WoFHBd1hGTiKWhxEEeSupZTLzUxDsyR_3VKgUifYnjjteJ6W36wKUPoTnLY90qH4t8RWdPEqYohUECJ4qfuM27t2CgRMWwozefJAlJzzl3pZpq_as5v9YJBa9C20hL905M7DTcC_lElglDIl9Th2FmG7lGWly4CHq6rOwv3UHIF2R4TSKPV0n5V7EVjhbCnXzJdrw_l2PrO-OHFrQ2ZjWOfw4TV7g2PWZm9OGaVFldUrxX',
    1
);

-- 6. Seed Doctor Schedules (For Dr. Michael Collins - Doctor ID = 1)
INSERT INTO doctor_schedules (doctor_id, available_date, time_slot, is_booked)
VALUES 
(1, '2024-10-14', '09:00 AM', 0),
(1, '2024-10-14', '09:45 AM', 1), -- Currently booked by Johnathan Vance (#MC-94021)
(1, '2024-10-14', '11:15 AM', 0),
(1, '2024-10-14', '02:30 PM', 0),
(1, '2024-10-14', '04:15 PM', 0),
(1, '2024-10-15', '10:00 AM', 0),
(1, '2024-10-15', '01:30 PM', 0),
(1, '2024-10-15', '03:45 PM', 0),
(1, '2024-10-16', '09:30 AM', 0),
(1, '2024-10-16', '11:00 AM', 0),
(1, '2024-10-16', '03:00 PM', 0);

-- 7. Seed Appointments (Johnathan Vance's confirmed consultation #MC-94021)
INSERT INTO appointments (booking_reference, patient_id, doctor_id, hospital_id, appointment_date, time_slot, status, consultation_type, primary_reason, clinical_notes, insurance_provider, policy_id, copay_amount, total_fee, patient_full_name, patient_phone, patient_email)
VALUES 
(
    'MC-94021',
    1,
    1,
    1,
    'Mon, Oct 14, 2024',
    '09:45 AM EDT',
    'CONFIRMED',
    'IN_CLINIC',
    'Chest Discomfort / Mild Exertion Palpitations',
    'Occasional tightness in the central chest area when exercising or climbing long staircases over the past 3 weeks. No fainting, but feeling brief flutter sensations.',
    'Blue Cross Blue Shield (PPO Premium)',
    'BCBS-8894102-01',
    30.00,
    250.00,
    'Johnathan Vance',
    '+1 (555) 234-8901',
    'j.vance@vancetech.io'
),
(
    'MC-88102',
    1,
    2,
    1,
    'Wed, Nov 06, 2024',
    '02:00 PM EDT',
    'CONFIRMED',
    'TELEHEALTH',
    'Routine Cognitive Assessment',
    'Annual wellness checkup and sleep quality review.',
    'Blue Cross Blue Shield (PPO Premium)',
    'BCBS-8894102-01',
    30.00,
    280.00,
    'Johnathan Vance',
    '+1 (555) 234-8901',
    'j.vance@vancetech.io'
);

-- 8. Seed Medical Records for Johnathan Vance
INSERT INTO medical_records (patient_id, record_type, title, file_url, file_size, record_date, notes)
VALUES 
(1, 'LAB_REPORT', 'Complete Metabolic Panel & Lipid Profile', 'https://example.com/records/lipid-panel-2024.pdf', '2.1 MB', 'Sep 28, 2024', 'Normal fasting glucose, mildly elevated LDL cholesterol (128 mg/dL).'),
(1, 'DIAGNOSTIC', 'Prior Exercise Treadmill Stress Test Report', 'https://example.com/records/cardiac-stress-test.pdf', '4.6 MB', 'Aug 14, 2023', 'Normal Bruce protocol to 10.2 METs. No ischemic ST depression observed.'),
(1, 'IMAGING', '12-Lead Electrocardiogram (Resting ECG)', 'https://example.com/records/ecg-report.pdf', '1.8 MB', 'Jul 10, 2023', 'Normal sinus rhythm at 68 bpm. PR and QTc intervals within normal limits.');

-- 9. Seed Emergency Requests (Simulated Metro Grid)
INSERT INTO emergency_requests (request_code, patient_name, patient_phone, incident_location, emergency_type, severity, status, eta_minutes, ambulance_unit)
VALUES 
('EMG-7021', 'Johnathan Vance', '+1 (555) 234-8901', '742 Evergreen Terrace, Pavilion B', 'Chest Pain / Cardiac Episode', 'CRITICAL', 'DISPATCHED', 6, 'Medic Unit 4'),
('EMG-6980', 'Sarah Connor', '+1 (555) 902-1100', '120 Market Street, 4th Fl', 'Accident / Severe Trauma', 'URGENT', 'EN_ROUTE', 4, 'Medic Unit 9');

-- 10. Seed Reviews for Dr. Michael Collins
INSERT INTO doctor_reviews (doctor_id, patient_name, rating, review_date, comment)
VALUES 
(1, 'Arthur Pendelton', 5.0, 'Sep 12, 2024', 'Dr. Collins was exceptionally meticulous in reviewing my Holter monitor results and explaining the treatment options with warmth and clarity.'),
(1, 'Helena Rostova', 5.0, 'Aug 29, 2024', 'Truly world-class bedside manner. The clinical nursing staff at Aurora Pavilion was also superb during my post-procedure recovery.');

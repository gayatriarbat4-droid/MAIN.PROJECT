-- ==========================================================
-- MediCare Database Schema Migration V1__init_schema.sql
-- Target Database: Microsoft SQL Server (MSSQL)
-- ==========================================================

-- 1. Users Table (Authentication & Accounts)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' and xtype='U')
BEGIN
    CREATE TABLE users (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(100) NOT NULL UNIQUE,
        email NVARCHAR(150) NOT NULL UNIQUE,
        password_hash NVARCHAR(255) NOT NULL,
        full_name NVARCHAR(150) NOT NULL,
        phone NVARCHAR(50),
        role NVARCHAR(50) NOT NULL DEFAULT 'ROLE_PATIENT',
        email_verified BIT NOT NULL DEFAULT 0,
        verification_token NVARCHAR(100) NULL,
        verification_otp NVARCHAR(10) NULL,
        verification_expires_at DATETIME2 NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );
    CREATE INDEX idx_users_username ON users(username);
    CREATE INDEX idx_users_email ON users(email);
    CREATE INDEX idx_users_verification_token ON users(verification_token);
END;

-- 2. Patients Table (Demographics & Medical Profile)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='patients' and xtype='U')
BEGIN
    CREATE TABLE patients (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        user_id BIGINT NULL,
        date_of_birth NVARCHAR(50),
        gender NVARCHAR(50),
        blood_group NVARCHAR(20),
        height NVARCHAR(50),
        weight NVARCHAR(50),
        address NVARCHAR(255),
        emergency_contact_name NVARCHAR(150),
        emergency_contact_phone NVARCHAR(50),
        allergies NVARCHAR(MAX),
        chronic_conditions NVARCHAR(MAX),
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT fk_patients_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
    CREATE INDEX idx_patients_user_id ON patients(user_id);
END;

-- 3. Hospitals Table (Healthcare Facilities)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='hospitals' and xtype='U')
BEGIN
    CREATE TABLE hospitals (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(200) NOT NULL,
        tagline NVARCHAR(255),
        description NVARCHAR(MAX),
        address NVARCHAR(255) NOT NULL,
        city NVARCHAR(100) NOT NULL,
        state NVARCHAR(100),
        zip_code NVARCHAR(50),
        phone NVARCHAR(50),
        email NVARCHAR(100),
        rating DECIMAL(3,2) DEFAULT 4.90,
        review_count INT DEFAULT 0,
        accreditation NVARCHAR(100) DEFAULT 'JCI Accredited',
        trauma_level NVARCHAR(100) DEFAULT 'Level 1 Trauma Center',
        image_url NVARCHAR(500),
        emergency_open_247 BIT DEFAULT 1,
        inpatient_suites INT DEFAULT 420,
        icu_beds INT DEFAULT 64,
        robotic_or_suites INT DEFAULT 18,
        daily_capacity INT DEFAULT 1500,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;

-- 4. Departments Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='departments' and xtype='U')
BEGIN
    CREATE TABLE departments (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        hospital_id BIGINT NOT NULL,
        name NVARCHAR(150) NOT NULL,
        description NVARCHAR(MAX),
        icon_name NVARCHAR(100) DEFAULT 'local_hospital',
        head_doctor_name NVARCHAR(150),
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT fk_departments_hospital FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
    );
    CREATE INDEX idx_departments_hospital_id ON departments(hospital_id);
END;

-- 5. Doctors Table (Medical Specialists)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='doctors' and xtype='U')
BEGIN
    CREATE TABLE doctors (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        hospital_id BIGINT NOT NULL,
        department_id BIGINT NULL,
        name NVARCHAR(150) NOT NULL,
        title NVARCHAR(150) NOT NULL,
        specialty NVARCHAR(150) NOT NULL,
        license_number NVARCHAR(100),
        experience_years INT DEFAULT 10,
        languages NVARCHAR(255) DEFAULT 'English',
        rating DECIMAL(3,2) DEFAULT 4.95,
        review_count INT DEFAULT 0,
        consultation_fee DECIMAL(10,2) DEFAULT 250.00,
        room_suite NVARCHAR(100),
        bio NVARCHAR(MAX),
        education NVARCHAR(MAX),
        avatar_url NVARCHAR(500),
        available_this_week BIT DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT fk_doctors_hospital FOREIGN KEY (hospital_id) REFERENCES hospitals(id),
        CONSTRAINT fk_doctors_department FOREIGN KEY (department_id) REFERENCES departments(id)
    );
    CREATE INDEX idx_doctors_hospital ON doctors(hospital_id);
    CREATE INDEX idx_doctors_department ON doctors(department_id);
END;

-- 6. Doctor Schedules / Time Slots
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='doctor_schedules' and xtype='U')
BEGIN
    CREATE TABLE doctor_schedules (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        doctor_id BIGINT NOT NULL,
        available_date NVARCHAR(50) NOT NULL,
        time_slot NVARCHAR(50) NOT NULL,
        is_booked BIT DEFAULT 0,
        CONSTRAINT fk_schedules_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
    );
    CREATE INDEX idx_schedules_doctor_date ON doctor_schedules(doctor_id, available_date);
END;

-- 7. Appointments Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='appointments' and xtype='U')
BEGIN
    CREATE TABLE appointments (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        booking_reference NVARCHAR(50) NOT NULL UNIQUE,
        patient_id BIGINT NOT NULL,
        doctor_id BIGINT NOT NULL,
        hospital_id BIGINT NOT NULL,
        appointment_date NVARCHAR(50) NOT NULL,
        time_slot NVARCHAR(50) NOT NULL,
        status NVARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
        consultation_type NVARCHAR(50) NOT NULL DEFAULT 'IN_CLINIC',
        primary_reason NVARCHAR(255),
        clinical_notes NVARCHAR(MAX),
        insurance_provider NVARCHAR(150),
        policy_id NVARCHAR(100),
        copay_amount DECIMAL(10,2) DEFAULT 30.00,
        total_fee DECIMAL(10,2) DEFAULT 250.00,
        patient_full_name NVARCHAR(150),
        patient_phone NVARCHAR(50),
        patient_email NVARCHAR(150),
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT fk_appointments_patient FOREIGN KEY (patient_id) REFERENCES patients(id),
        CONSTRAINT fk_appointments_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id),
        CONSTRAINT fk_appointments_hospital FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
    );
    CREATE INDEX idx_appointments_patient ON appointments(patient_id);
    CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
    CREATE INDEX idx_appointments_reference ON appointments(booking_reference);
END;

-- 8. Medical Records & Diagnostic Reports
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='medical_records' and xtype='U')
BEGIN
    CREATE TABLE medical_records (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        patient_id BIGINT NOT NULL,
        record_type NVARCHAR(100) NOT NULL,
        title NVARCHAR(255) NOT NULL,
        file_url NVARCHAR(500),
        file_size NVARCHAR(50),
        record_date NVARCHAR(50),
        notes NVARCHAR(MAX),
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT fk_records_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );
    CREATE INDEX idx_records_patient ON medical_records(patient_id);
END;

-- 9. Emergency Triage Requests
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='emergency_requests' and xtype='U')
BEGIN
    CREATE TABLE emergency_requests (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        request_code NVARCHAR(50) NOT NULL UNIQUE,
        patient_name NVARCHAR(150) NOT NULL,
        patient_phone NVARCHAR(50) NOT NULL,
        incident_location NVARCHAR(255) NOT NULL,
        emergency_type NVARCHAR(100) NOT NULL,
        severity NVARCHAR(50) DEFAULT 'CRITICAL',
        status NVARCHAR(50) NOT NULL DEFAULT 'DISPATCHED',
        eta_minutes INT DEFAULT 7,
        ambulance_unit NVARCHAR(50) DEFAULT 'Medic Unit 4',
        created_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );
    CREATE INDEX idx_emergency_status ON emergency_requests(status);
END;

-- 10. Doctor Reviews
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='doctor_reviews' and xtype='U')
BEGIN
    CREATE TABLE doctor_reviews (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        doctor_id BIGINT NOT NULL,
        patient_name NVARCHAR(150) NOT NULL,
        rating DECIMAL(2,1) NOT NULL DEFAULT 5.0,
        review_date NVARCHAR(50),
        comment NVARCHAR(MAX),
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT fk_reviews_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
    );
    CREATE INDEX idx_reviews_doctor ON doctor_reviews(doctor_id);
END;

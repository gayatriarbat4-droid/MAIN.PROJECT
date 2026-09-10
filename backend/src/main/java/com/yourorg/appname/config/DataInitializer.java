package com.yourorg.appname.config;

import com.yourorg.appname.entity.*;
import com.yourorg.appname.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final HospitalRepository hospitalRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final EmergencyRequestRepository emergencyRequestRepository;
    private final DoctorReviewRepository doctorReviewRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            PatientRepository patientRepository,
            HospitalRepository hospitalRepository,
            DepartmentRepository departmentRepository,
            DoctorRepository doctorRepository,
            DoctorScheduleRepository doctorScheduleRepository,
            AppointmentRepository appointmentRepository,
            MedicalRecordRepository medicalRecordRepository,
            EmergencyRequestRepository emergencyRequestRepository,
            DoctorReviewRepository doctorReviewRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.hospitalRepository = hospitalRepository;
        this.departmentRepository = departmentRepository;
        this.doctorRepository = doctorRepository;
        this.doctorScheduleRepository = doctorScheduleRepository;
        this.appointmentRepository = appointmentRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.emergencyRequestRepository = emergencyRequestRepository;
        this.doctorReviewRepository = doctorReviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Always ensure all existing demo accounts have emailVerified = true and password = Password123!
        userRepository.findAll().forEach(u -> {
            if (!u.isEmailVerified()) {
                u.setEmailVerified(true);
                userRepository.save(u);
            }
        });
        java.util.List.of("narkhade", "mansinarkhade", "johnathan_vance", "dr_collins", "admin_sarah").forEach(uname -> {
            userRepository.findByUsername(uname).ifPresent(u -> {
                u.setPasswordHash(passwordEncoder.encode("Password123!"));
                u.setEmailVerified(true);
                userRepository.save(u);
            });
        });

        // Ensure narkhade, mansinarkhade, dr_collins, admin_sarah, and arbat always exist with verified status
        if (!userRepository.existsByUsername("narkhade")) {
            userRepository.save(User.builder()
                    .username("narkhade")
                    .email("mansi12345@gmail.com")
                    .passwordHash(passwordEncoder.encode("Password123!"))
                    .fullName("Mansi Narkhade")
                    .phone("6565131218")
                    .role("ROLE_PATIENT")
                    .emailVerified(true)
                    .build());
        }
        if (!userRepository.existsByUsername("mansinarkhade")) {
            userRepository.save(User.builder()
                    .username("mansinarkhade")
                    .email("manshi12345@gmail.com")
                    .passwordHash(passwordEncoder.encode("Password123!"))
                    .fullName("Mansi Narkhade")
                    .phone("9373188800")
                    .role("ROLE_PATIENT")
                    .emailVerified(true)
                    .build());
        }
        if (!userRepository.existsByUsername("dr_collins")) {
            userRepository.save(User.builder()
                    .username("dr_collins")
                    .email("dr.collins@medicare.health")
                    .passwordHash(passwordEncoder.encode("Password123!"))
                    .fullName("Dr. Michael Collins")
                    .phone("+1 (800) 555-0199")
                    .role("ROLE_DOCTOR")
                    .emailVerified(true)
                    .build());
        }
        if (!userRepository.existsByUsername("admin_sarah")) {
            userRepository.save(User.builder()
                    .username("admin_sarah")
                    .email("admin.sarah@medicare.health")
                    .passwordHash(passwordEncoder.encode("Password123!"))
                    .fullName("Sarah Wilson (Admin)")
                    .phone("+1 (800) 555-0100")
                    .role("ROLE_ADMIN")
                    .emailVerified(true)
                    .build());
        }
        if (!userRepository.existsByUsername("arbat")) {
            userRepository.save(User.builder()
                    .username("arbat")
                    .email("gayatri12345@gmail.com")
                    .passwordHash(passwordEncoder.encode("gayatri28"))
                    .fullName("Gayatri Arbat")
                    .phone("9373188800")
                    .role("ROLE_PATIENT")
                    .emailVerified(true)
                    .build());
        }

        if (hospitalRepository.count() > 0) {
            return;
        }

        System.out.println(">> Seeding MediCare Demo Database...");

        // 1. Seed Users
        User johnathan = userRepository.save(User.builder()
                .username("johnathan_vance")
                .email("j.vance@vancetech.io")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .fullName("Johnathan Vance")
                .phone("+1 (555) 234-8901")
                .role("ROLE_PATIENT")
                .emailVerified(true)
                .build());

        User admin = userRepository.save(User.builder()
                .username("admin_sarah")
                .email("s.jenkins@auroramed.org")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .fullName("Sarah Jenkins, MHA")
                .phone("+1 (555) 019-2831")
                .role("ROLE_ADMIN")
                .emailVerified(true)
                .build());

        User drCollinsUser = userRepository.save(User.builder()
                .username("dr_collins")
                .email("m.collins@auroramed.org")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .fullName("Dr. Michael Collins, MD, FACC")
                .phone("+1 (555) 883-9021")
                .role("ROLE_DOCTOR")
                .emailVerified(true)
                .build());

        User mansiUser = userRepository.save(User.builder()
                .username("narkhade")
                .email("mansi12345@gmail.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .fullName("Mansi Narkhade")
                .phone("6565131218")
                .role("ROLE_PATIENT")
                .emailVerified(true)
                .build());

        User mansiUser2 = userRepository.save(User.builder()
                .username("mansinarkhade")
                .email("manshi12345@gmail.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .fullName("Mansi Narkhade")
                .phone("9373188800")
                .role("ROLE_PATIENT")
                .emailVerified(true)
                .build());

        // 2. Seed Patient Profile
        Patient patient = patientRepository.save(Patient.builder()
                .user(johnathan)
                .dateOfBirth("1984-06-12")
                .gender("Male")
                .bloodGroup("O+")
                .height("6'1\" (185 cm)")
                .weight("182 lbs (82.5 kg)")
                .address("742 Evergreen Terrace, Pavilion B, Seattle, WA 98101")
                .emergencyContactName("Eleanor Vance (Spouse)")
                .emergencyContactPhone("+1 (555) 902-3344")
                .allergies("Penicillin (Mild urticaria / hives), Sulfa drugs")
                .chronicConditions("Essential Hypertension (Stage 1), Mild Hyperlipidemia")
                .build());

        patientRepository.save(Patient.builder()
                .user(mansiUser)
                .dateOfBirth("1996-08-15")
                .gender("Female")
                .bloodGroup("B+")
                .height("5'6\" (168 cm)")
                .weight("130 lbs (59 kg)")
                .address("Metro City Central, Suite 402")
                .emergencyContactName("Family Contact")
                .emergencyContactPhone("+1 (555) 937-3188")
                .allergies("None documented")
                .chronicConditions("None")
                .build());

        // 3. Seed Hospitals
        Hospital aurora = hospitalRepository.save(Hospital.builder()
                .name("Aurora Medical Center")
                .tagline("Excellence in Academic Medicine & Comprehensive Tertiary Care")
                .description("Aurora Medical Center is an internationally accredited 650-bed academic health powerhouse integrating next-generation robotic surgery suites, 24/7 Level I trauma emergency triage, and renowned cardiovascular institutes.")
                .address("1000 Health Sciences Drive, Tower C")
                .city("Metro City")
                .state("WA")
                .zipCode("98104")
                .phone("+1 (555) 440-1000")
                .email("info@auroramed.org")
                .rating(new BigDecimal("4.92"))
                .reviewCount(1240)
                .accreditation("JCI Accredited, Magnet Recognized")
                .traumaLevel("Level I Adult & Pediatric Trauma")
                .imageUrl("/assets/aurora-hospital.jpg")
                .emergencyOpen247(true)
                .inpatientSuites(650)
                .icuBeds(128)
                .roboticOrSuites(14)
                .dailyCapacity(450)
                .build());

        Hospital stJude = hospitalRepository.save(Hospital.builder()
                .name("St. Jude Children's & Research Pavilion")
                .tagline("Pioneering Pediatric Discoveries & Compassionate Care")
                .description("A premier national specialty destination offering specialized neonatal intensive care, innovative pediatric oncology protocols, and family-centered wellness environments.")
                .address("262 Danny Thomas Place")
                .city("Metro City")
                .state("WA")
                .zipCode("98105")
                .phone("+1 (555) 822-6300")
                .email("contact@stjudepavilion.org")
                .rating(new BigDecimal("4.98"))
                .reviewCount(2150)
                .accreditation("JCI Gold Seal of Approval")
                .traumaLevel("Level II Regional Pediatric Emergency")
                .imageUrl("/assets/st-jude-hospital.jpg")
                .emergencyOpen247(true)
                .inpatientSuites(320)
                .icuBeds(80)
                .roboticOrSuites(6)
                .dailyCapacity(220)
                .build());

        // 4. Seed Departments
        Department cardiology = departmentRepository.save(Department.builder()
                .hospital(aurora)
                .name("Cardiology & Vascular Center")
                .description("Advanced catheterization laboratories, cardiac MRI, non-invasive imaging, and structural heart interventional care.")
                .iconName("favorite")
                .headDoctorName("Dr. Michael Collins, MD, FACC")
                .build());

        Department neurology = departmentRepository.save(Department.builder()
                .hospital(aurora)
                .name("Comprehensive Neurology & Stroke Center")
                .description("Dedicated neuro-intensive care, acute thrombectomy protocols, and cognitive disorder specialist clinics.")
                .iconName("psychology")
                .headDoctorName("Dr. Sarah Wilson, MD, PhD")
                .build());

        Department pediatrics = departmentRepository.save(Department.builder()
                .hospital(stJude)
                .name("Neonatal & Advanced Pediatrics")
                .description("Level IV neonatal intensive care unit and multi-disciplinary pediatric surgical teams.")
                .iconName("child_care")
                .headDoctorName("Dr. Elena Rostova, MD")
                .build());

        Department orthopedics = departmentRepository.save(Department.builder()
                .hospital(aurora)
                .name("Orthopedics & Joint Replacement")
                .description("Mako robotic-assisted arthroplasty, complex spinal reconstructions, and sports medicine rehabilitation.")
                .iconName("accessibility_new")
                .headDoctorName("Dr. Marcus Vance, MD")
                .build());

        // 5. Seed Doctors
        Doctor doc1 = doctorRepository.save(Doctor.builder()
                .hospital(aurora)
                .department(cardiology)
                .name("Dr. Michael Collins")
                .title("Chief of Interventional Cardiology")
                .specialty("Cardiology")
                .licenseNumber("MD-WA-78219")
                .experienceYears(18)
                .languages("English, Spanish")
                .rating(new BigDecimal("4.95"))
                .reviewCount(142)
                .consultationFee(new BigDecimal("250.00"))
                .roomSuite("Pavilion B, Suite 410")
                .bio("Dr. Collins completed fellowship training at Johns Hopkins Medicine. He specializes in minimally invasive structural heart valve repairs, complex coronary angioplasty, and cardiac rehabilitation.")
                .education("MD: Johns Hopkins University School of Medicine | Fellowship: Brigham and Women's Hospital")
                .avatarUrl("/assets/doctor-collins.jpg")
                .availableThisWeek(true)
                .build());

        Doctor doc2 = doctorRepository.save(Doctor.builder()
                .hospital(aurora)
                .department(neurology)
                .name("Dr. Sarah Wilson")
                .title("Director of Neurovascular Therapeutics")
                .specialty("Neurology")
                .licenseNumber("MD-WA-65412")
                .experienceYears(14)
                .languages("English, French")
                .rating(new BigDecimal("4.92"))
                .reviewCount(98)
                .consultationFee(new BigDecimal("280.00"))
                .roomSuite("Tower A, Suite 305")
                .bio("Dr. Wilson is a dual-trained neurologist and clinical neuroscientist specializing in stroke recovery, severe migraine therapies, and movement disorders.")
                .education("MD, PhD: Stanford University | Residency: UCSF Medical Center")
                .avatarUrl("/assets/doctor-wilson.jpg")
                .availableThisWeek(true)
                .build());

        Doctor doc3 = doctorRepository.save(Doctor.builder()
                .hospital(stJude)
                .department(pediatrics)
                .name("Dr. Elena Rostova")
                .title("Pediatric Pulmonology Specialist")
                .specialty("Pediatrics")
                .licenseNumber("MD-WA-90123")
                .experienceYears(11)
                .languages("English, Russian")
                .rating(new BigDecimal("4.97"))
                .reviewCount(184)
                .consultationFee(new BigDecimal("210.00"))
                .roomSuite("Children's Wing, Suite 102")
                .bio("Specializing in pediatric respiratory illnesses, cystic fibrosis clinics, and early childhood developmental screenings.")
                .education("MD: University of Pennsylvania Perelman School of Medicine")
                .avatarUrl("/assets/doctor-rostova.jpg")
                .availableThisWeek(true)
                .build());

        Doctor doc4 = doctorRepository.save(Doctor.builder()
                .hospital(aurora)
                .department(orthopedics)
                .name("Dr. Marcus Vance")
                .title("Orthopedic Spine & Joint Reconstruction")
                .specialty("Orthopedics")
                .licenseNumber("MD-WA-43219")
                .experienceYears(16)
                .languages("English")
                .rating(new BigDecimal("4.88"))
                .reviewCount(115)
                .consultationFee(new BigDecimal("270.00"))
                .roomSuite("West Pavilion, Suite 520")
                .bio("Board-certified orthopedic surgeon pioneer in muscle-sparing anterior hip replacement and endoscopic spinal disc decompressive surgeries.")
                .education("MD: Harvard Medical School | Fellowship: Hospital for Special Surgery")
                .avatarUrl("/assets/doctor-vance.jpg")
                .availableThisWeek(true)
                .build());

        // 6. Seed Schedules
        String[] slots = {"09:00 AM", "09:45 AM", "11:15 AM", "02:30 PM", "04:15 PM"};
        for (String slot : slots) {
            doctorScheduleRepository.save(DoctorSchedule.builder()
                    .doctor(doc1)
                    .availableDate("2024-10-14")
                    .timeSlot(slot)
                    .isBooked(slot.equals("09:45 AM"))
                    .build());
            doctorScheduleRepository.save(DoctorSchedule.builder()
                    .doctor(doc2)
                    .availableDate("2024-10-14")
                    .timeSlot(slot)
                    .isBooked(false)
                    .build());
        }

        // 7. Seed Appointments
        appointmentRepository.save(Appointment.builder()
                .bookingReference("MC-94021")
                .patient(patient)
                .doctor(doc1)
                .hospital(aurora)
                .appointmentDate("Mon, Oct 14, 2024")
                .timeSlot("09:45 AM EDT")
                .status("CONFIRMED")
                .consultationType("IN_CLINIC")
                .primaryReason("Chest Discomfort / Mild Exertion Palpitations")
                .clinicalNotes("Occasional tightness in the central chest area when exercising or climbing long staircases over the past 3 weeks. No fainting, but feeling brief flutter sensations.")
                .insuranceProvider("Blue Cross Blue Shield (PPO Premium)")
                .policyId("BCBS-8894102-01")
                .copayAmount(new BigDecimal("30.00"))
                .totalFee(new BigDecimal("250.00"))
                .patientFullName("Johnathan Vance")
                .patientPhone("+1 (555) 234-8901")
                .patientEmail("j.vance@vancetech.io")
                .build());

        appointmentRepository.save(Appointment.builder()
                .bookingReference("MC-88102")
                .patient(patient)
                .doctor(doc2)
                .hospital(aurora)
                .appointmentDate("Wed, Nov 06, 2024")
                .timeSlot("02:00 PM EDT")
                .status("CONFIRMED")
                .consultationType("TELEHEALTH")
                .primaryReason("Routine Cognitive Assessment")
                .clinicalNotes("Annual wellness checkup and sleep quality review.")
                .insuranceProvider("Blue Cross Blue Shield (PPO Premium)")
                .policyId("BCBS-8894102-01")
                .copayAmount(new BigDecimal("30.00"))
                .totalFee(new BigDecimal("280.00"))
                .patientFullName("Johnathan Vance")
                .patientPhone("+1 (555) 234-8901")
                .patientEmail("j.vance@vancetech.io")
                .build());

        // 8. Seed Medical Records
        medicalRecordRepository.save(MedicalRecord.builder()
                .patient(patient)
                .recordType("LAB_REPORT")
                .title("Complete Metabolic Panel & Lipid Profile")
                .fileUrl("https://example.com/records/lipid-panel-2024.pdf")
                .fileSize("2.1 MB")
                .recordDate("Sep 28, 2024")
                .notes("Normal fasting glucose, mildly elevated LDL cholesterol (128 mg/dL).")
                .build());

        medicalRecordRepository.save(MedicalRecord.builder()
                .patient(patient)
                .recordType("DIAGNOSTIC")
                .title("Prior Exercise Treadmill Stress Test Report")
                .fileUrl("https://example.com/records/cardiac-stress-test.pdf")
                .fileSize("4.6 MB")
                .recordDate("Aug 14, 2023")
                .notes("Normal Bruce protocol to 10.2 METs. No ischemic ST depression observed.")
                .build());

        medicalRecordRepository.save(MedicalRecord.builder()
                .patient(patient)
                .recordType("IMAGING")
                .title("12-Lead Electrocardiogram (Resting ECG)")
                .fileUrl("https://example.com/records/ecg-report.pdf")
                .fileSize("1.8 MB")
                .recordDate("Jul 10, 2023")
                .notes("Normal sinus rhythm at 68 bpm. PR and QTc intervals within normal limits.")
                .build());

        // 9. Seed Emergency Requests
        emergencyRequestRepository.save(EmergencyRequest.builder()
                .requestCode("EMG-7021")
                .patientName("Johnathan Vance")
                .patientPhone("+1 (555) 234-8901")
                .incidentLocation("742 Evergreen Terrace, Pavilion B")
                .emergencyType("Chest Pain / Cardiac Episode")
                .severity("CRITICAL")
                .status("DISPATCHED")
                .etaMinutes(6)
                .ambulanceUnit("Medic Unit 4")
                .build());

        emergencyRequestRepository.save(EmergencyRequest.builder()
                .requestCode("EMG-6980")
                .patientName("Sarah Connor")
                .patientPhone("+1 (555) 902-1100")
                .incidentLocation("120 Market Street, 4th Fl")
                .emergencyType("Accident / Severe Trauma")
                .severity("URGENT")
                .status("EN_ROUTE")
                .etaMinutes(4)
                .ambulanceUnit("Medic Unit 9")
                .build());

        // 10. Seed Reviews
        doctorReviewRepository.save(DoctorReview.builder()
                .doctor(doc1)
                .patientName("Arthur Pendelton")
                .rating(new BigDecimal("5.0"))
                .reviewDate("2 weeks ago")
                .comment("Dr. Collins is extraordinary. Took the time to walk through my angiogram in detail, explaining every single risk factor with exceptional clarity and calm.")
                .build());

        doctorReviewRepository.save(DoctorReview.builder()
                .doctor(doc1)
                .patientName("Maria Gutierrez")
                .rating(new BigDecimal("4.9"))
                .reviewDate("1 month ago")
                .comment("Incredible bedside manner. The entire cardiology team at Aurora operates like clockwork. Felt genuinely safe and listened to.")
                .build());

        System.out.println(">> MediCare Demo Database successfully seeded!");
    }
}

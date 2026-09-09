import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { hospitalService } from '../../services/hospitalService';
import { doctorService } from '../../services/doctorService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FALLBACK_DOCTORS } from '../../constants/doctorsData';
import { handleImageError } from '../../utils/imageUtils';

const FALLBACK_HOSPITAL = {
  id: 1,
  name: 'Aurora Medical Center',
  tagline: 'Leading Advanced Academic Clinical Excellence & Surgical Innovations',
  description: 'A distinguished quaternary medical center equipped with ultra-modern robotic surgical suites, hybrid catheterization theaters, and dedicated patient-recovery pavilions.',
  address: '1248 Medical Parkway',
  city: 'Metro City',
  state: 'WA',
  zipCode: '98104',
  phone: '+1 (555) 440-1000',
  email: 'info@auroramed.org',
  rating: '4.92',
  reviewCount: 1240,
  accreditation: 'JCI Accredited, Magnet Recognized',
  traumaLevel: 'Level I Adult & Pediatric Trauma',
  imageUrl: '/assets/aurora-hospital.jpg',
  emergencyOpen247: true,
  inpatientSuites: 650,
  icuBeds: 128,
  roboticOrSuites: 14,
  dailyCapacity: 450,
};

export const HospitalsPage = () => {
  const { id } = useParams();
  const hospitalId = id || 1;

  const [hospital, setHospital] = useState(FALLBACK_HOSPITAL);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState(FALLBACK_DOCTORS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const [hospRes, deptRes, docRes] = await Promise.all([
          hospitalService.getHospitalById(hospitalId),
          hospitalService.getDepartments(hospitalId),
          doctorService.getAllDoctors({ hospitalId }),
        ]);

        if (hospRes?.success && hospRes.data) setHospital(hospRes.data);
        if (deptRes?.success && deptRes.data?.length > 0) setDepartments(deptRes.data);
        if (docRes?.success && docRes.data?.length > 0) setDoctors(docRes.data);
      } catch (err) {
        console.warn('Error loading hospital details, using fallback data', err);
      }
    };

    fetchHospitalData();
  }, [hospitalId]);

  return (
    <div className="flex flex-col w-full">
      {/* Immersive Hospital Hero Section with Scrim */}
      <section className="relative w-full overflow-hidden bg-surface-container-high">
        <div className="relative w-full h-[460px] lg:h-[520px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${hospital?.imageUrl || '/assets/aurora-hospital.jpg'}')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-on-surface/50 to-on-surface/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-on-surface/40 to-transparent"></div>

          {/* Hero Content Anchor */}
          <div className="relative max-w-[84rem] h-full mx-auto px-margin-mobile lg:px-margin-desktop flex flex-col justify-end pb-space-2xl">
            {/* Badges & Accreditations Pill Bar */}
            <div className="flex flex-wrap items-center gap-space-xs mb-space-sm">
              <span className="inline-flex items-center gap-space-xxs px-space-sm py-space-xxs rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider shadow-sm font-bold">
                <span className="material-symbols-outlined text-sm font-semibold">verified</span>
                {hospital?.accreditation || 'JCI Accredited'}
              </span>
              <span className="inline-flex items-center gap-space-xxs px-space-sm py-space-xxs rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-sm text-label-sm uppercase tracking-wider shadow-sm font-bold">
                <span className="material-symbols-outlined text-sm font-semibold">emergency</span>
                {hospital?.traumaLevel || 'Level 1 Trauma Center'}
              </span>
              <span className="inline-flex items-center gap-space-xxs px-space-sm py-space-xxs rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-sm text-label-sm shadow-sm font-bold">
                <span className="material-symbols-outlined text-sm text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="font-bold text-on-surface">{hospital?.rating || '4.90'}</span>
                <span className="text-secondary font-normal">({hospital?.reviewCount || 1840} Reviews)</span>
              </span>
            </div>

            <h1 className="font-display-lg text-display-lg-mobile lg:text-display-lg text-surface-container-lowest tracking-tight max-w-4xl font-headline-xl">
              {hospital?.name || 'Aurora Medical Center & Research Institute'}
            </h1>

            {/* Quick Meta & Communication Bar */}
            <div className="mt-space-md flex flex-wrap items-center gap-y-space-xs gap-x-space-lg text-surface-variant font-body-md text-body-md">
              <div className="flex items-center gap-space-xxs">
                <span className="material-symbols-outlined text-primary-fixed text-lg">location_on</span>
                <span className="text-surface-container-lowest font-medium">
                  {hospital?.address}, {hospital?.city} {hospital?.state}
                </span>
              </div>
              <div className="flex items-center gap-space-xxs text-surface-container-lowest">
                <span className="material-symbols-outlined text-primary-fixed text-lg">call</span>
                <a className="hover:underline font-medium" href={`tel:${hospital?.phone || '+18005550199'}`}>
                  {hospital?.phone || '+1 (800) 555-0199'}
                </a>
              </div>
              <div className="flex items-center gap-space-xxs text-surface-container-lowest">
                <span className="material-symbols-outlined text-primary-fixed text-lg">mail</span>
                <span>{hospital?.email || 'aurora@medicare.health'}</span>
              </div>
              <div className="flex items-center gap-space-xxs px-space-xs py-0.5 rounded-full bg-surface-container-lowest/20 backdrop-blur-md text-surface-container-lowest text-label-sm font-label-sm">
                <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse"></span>
                <span>Open 24/7 Acute Care</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Workspace: 12-Column Responsive Grid */}
      <div className="w-full max-w-[84rem] mx-auto px-margin-mobile lg:px-margin-desktop py-space-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* LEFT COLUMN: Clinical Story, Facilities, Doctors, & Maps (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-space-2xl">
            {/* 1. Clinical Overview & Metrics Bento */}
            <div className="bg-surface-container-lowest rounded-[20px] p-space-xl shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between gap-space-md mb-space-md">
                <div>
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest block mb-space-xxs font-bold">
                    Center of Excellence
                  </span>
                  <h2 className="font-headline-md text-headline-md text-on-surface">
                    Pioneering Integrative &amp; Robotic Medicine
                  </h2>
                </div>
                <span className="hidden sm:inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-low text-primary">
                  <span className="material-symbols-outlined text-2xl">local_hospital</span>
                </span>
              </div>

              <p className="font-body-md text-body-md text-secondary leading-relaxed mb-space-lg">
                {hospital?.description ||
                  'Aurora Medical Center stands at the forefront of contemporary interventional care, integrating biophilic architecture with next-generation robotic surgery, artificial intelligence-assisted diagnostics, and personalized clinical protocols.'}
              </p>

              {/* Clinical Vital Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md pt-space-md border-t border-outline-variant/20">
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col">
                  <span className="font-headline-md text-headline-md text-primary font-bold">
                    {hospital?.inpatientSuites || 420}+
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-1">
                    Inpatient Suites
                  </span>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col">
                  <span className="font-headline-md text-headline-md text-primary font-bold">
                    {hospital?.icuBeds || 64}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-1">
                    Critical ICU Beds
                  </span>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col">
                  <span className="font-headline-md text-headline-md text-primary font-bold">
                    {hospital?.roboticOrSuites || 18}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-1">
                    Robotic OR Wings
                  </span>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col">
                  <span className="font-headline-md text-headline-md text-primary font-bold">
                    {hospital?.dailyCapacity || 1500}+
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-1">
                    Daily Capacity
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Specialized Clinical Departments Bento */}
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold">
                    Core Units
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">
                    Departments &amp; Surgical Institutes
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-xl">{dept.iconName || 'medical_services'}</span>
                      </div>
                      <h3 className="font-headline-sm text-base text-on-surface font-semibold">
                        {dept.name}
                      </h3>
                      <p className="font-body-sm text-body-sm text-secondary mt-1 leading-relaxed">
                        {dept.description}
                      </p>
                    </div>
                    {dept.headDoctorName && (
                      <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center gap-2">
                        <span className="text-xs text-secondary">Department Head:</span>
                        <span className="text-xs font-semibold text-primary">{dept.headDoctorName}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Attending Specialists Grid */}
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold">
                    Medical Faculty
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">
                    Attending Specialists at this Facility
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex items-center gap-4 hover:shadow-md transition-all"
                  >
                    <img
                      src={doctor.avatarUrl || '/assets/doctor-collins.jpg'}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-xl object-cover"
                      onError={(e) => handleImageError(e, '/assets/doctor-collins.jpg')}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-headline-sm text-base font-semibold text-on-surface truncate">
                        {doctor.name}
                      </h3>
                      <p className="text-xs text-primary font-medium truncate">{doctor.specialty}</p>
                      <p className="text-xs text-secondary mt-0.5">{doctor.roomSuite}</p>
                    </div>
                    <Link
                      to={`/doctors/${doctor.id}`}
                      className="px-space-sm py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-all"
                    >
                      Profile
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Fast Action Booking & Location Card (4 Cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-space-lg">
            <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-lg border border-outline-variant/30 flex flex-col gap-space-md">
              <div className="flex items-center gap-space-xs text-primary font-label-sm uppercase tracking-wider font-bold">
                <span className="material-symbols-outlined text-base">calendar_month</span>
                <span>Fast-Track Reservation</span>
              </div>

              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Book Care at Aurora Center
              </h3>
              <p className="font-body-sm text-body-sm text-secondary">
                Direct access to outpatient clinics, comprehensive imaging appointments, and robotic surgical consults.
              </p>

              <div className="space-y-space-xs pt-space-xs">
                <div className="flex items-center gap-space-xs text-body-sm text-secondary">
                  <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                  <span>Direct insurance verification accepted</span>
                </div>
                <div className="flex items-center gap-space-xs text-body-sm text-secondary">
                  <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                  <span>Instant digital pass &amp; instructions</span>
                </div>
                <div className="flex items-center gap-space-xs text-body-sm text-secondary">
                  <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                  <span>Complimentary valet &amp; concierge parking</span>
                </div>
              </div>

              <Link
                to={`/book-appointment?hospitalId=${hospital?.id || 1}`}
                className="w-full py-space-sm rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold text-center shadow-md transition-all mt-space-sm"
              >
                Schedule Appointment
              </Link>

              <Link
                to="/emergency"
                className="w-full py-space-sm rounded-xl bg-error-container text-on-error-container font-label-md text-label-md font-semibold text-center hover:brightness-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">emergency</span>
                <span>Emergency Triage</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalsPage;

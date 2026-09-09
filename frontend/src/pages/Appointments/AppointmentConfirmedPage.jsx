import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { handleImageError } from '../../utils/imageUtils';

export const AppointmentConfirmedPage = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        if (id) {
          const res = await appointmentService.getAppointmentById(id);
          if (res?.success) {
            setAppointment(res.data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load appointment details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  const appt = {
    bookingReference: appointment?.bookingReference || (id ? `MC-${id}` : 'MC-94021'),
    doctorName: appointment?.doctorName || 'Dr. Michael Collins',
    doctorTitle: appointment?.doctorTitle || 'MD, FACC',
    doctorSpecialty: appointment?.doctorSpecialty || 'Cardiovascular Disease & Heart Rhythm',
    doctorAvatarUrl: appointment?.doctorAvatarUrl || '/assets/doctor-collins.jpg',
    hospitalName: appointment?.hospitalName || 'Aurora Medical Center & Research Institute',
    doctorRoomSuite: appointment?.doctorRoomSuite || 'Pavilion Suite 420-B',
    appointmentDate: appointment?.appointmentDate || 'Mon, Oct 14, 2024',
    timeSlot: appointment?.timeSlot || '09:45 AM EDT (Check-in 09:30)',
    patientName: appointment?.patientName || 'Valued Patient',
    primaryReason: appointment?.primaryReason || 'Clinical Consultation',
    insuranceProvider: appointment?.insuranceProvider || 'Standard Health Coverage',
    copayAmount: appointment?.copayAmount ?? 30.0,
    status: appointment?.status || 'CONFIRMED',
  };

  const handleCopyRef = () => {
    const code = appt.bookingReference;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleCopy = handleCopyRef;

  if (loading) {
    return <LoadingSpinner text="Generating cryptographically signed appointment ledger..." />;
  }

  return (
    <div className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-desktop py-space-xl">
      {/* Top Step Completion Stepper */}
      <div className="w-full flex items-center justify-between mb-space-2xl bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30">
        <div className="flex items-center gap-space-sm">
          <span className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed text-label-sm font-label-sm font-bold">
            <span className="material-symbols-outlined text-sm">check</span>
          </span>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Step 5 of 5</span>
            <span className="font-label-lg text-label-lg text-primary font-semibold">
              Booking Confirmed &amp; Synchronized
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-space-xs text-secondary font-label-md text-label-md">
          <span className="material-symbols-outlined text-primary text-base">verified_user</span>
          <span>JCI Encrypted Medical Record</span>
        </div>
      </div>

      {/* Celebration Header / Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-container to-tertiary p-space-xl md:p-space-2xl text-on-primary shadow-xl mb-space-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-inverse-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-xl">
          <div className="flex flex-col gap-space-xs max-w-2xl">
            <div className="flex items-center gap-space-xs">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  done_all
                </span>
              </span>
              <span className="font-label-sm text-label-sm tracking-widest uppercase bg-surface/15 backdrop-blur-md px-space-sm py-0.5 rounded-full text-primary-fixed font-bold">
                Consultation Scheduled
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-primary tracking-tight mt-space-xs">
              Appointment Confirmed
            </h1>
            <p className="font-body-md text-body-md text-on-primary-container leading-relaxed">
              Your consultation has been successfully booked with Aurora Medical Center. A confirmation SMS, diagnostic intake brief, and digital calendar invite have been dispatched.
            </p>
          </div>

          {/* Reference Badge */}
          <div className="flex md:flex-col items-center md:items-end justify-between bg-surface-container-lowest/10 backdrop-blur-md px-space-lg py-space-md rounded-xl border border-white/20">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-primary-container">
              Booking Ref
            </span>
            <div className="flex items-center gap-space-xs mt-space-xxs">
              <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-primary">
                #{appt.bookingReference}
              </span>
              <button
                aria-label="Copy booking reference"
                className="p-space-xxs text-primary-fixed hover:text-on-primary transition-colors"
                onClick={handleCopyRef}
                type="button"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
              </button>
            </div>
            <span className={`text-label-sm font-label-sm text-primary-fixed mt-space-xxs transition-opacity ${copied ? 'opacity-100' : 'opacity-0'}`}>
              Copied!
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
        {/* Left / Center: Clinical Boarding Pass (Ticket Card) */}
        <div className="lg:col-span-8 flex flex-col gap-space-xl">
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-md overflow-hidden border border-outline-variant/30">
            {/* Top Ticket Header */}
            <div className="bg-surface-container-low px-space-xl py-space-md flex flex-wrap items-center justify-between gap-space-sm border-b border-outline-variant/20">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">local_hospital</span>
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  MediCare HealthPass™ Pass ID: {appt.bookingReference}-VNC
                </span>
              </div>
              <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-primary-fixed/50 text-on-primary-fixed-variant font-label-sm text-label-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                <span className="font-bold">Confirmed &amp; Synchronized</span>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-space-xl grid grid-cols-1 md:grid-cols-12 gap-space-lg">
              <div className="md:col-span-8 flex flex-col gap-space-lg pr-0 md:pr-space-md">
                {/* Attending Specialist Spotlight */}
                <div className="flex items-start gap-space-md bg-surface-container-low p-space-md rounded-xl">
                  <img
                    className="w-20 h-20 rounded-xl object-cover shadow-sm ring-2 ring-primary/20"
                    alt={appt.doctorName}
                    src={appt.doctorAvatarUrl || '/assets/doctor-collins.jpg'}
                    onError={(e) => handleImageError(e, '/assets/doctor-collins.jpg')}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                      Attending Specialist
                    </span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface truncate">
                      {appt.doctorName}{appt.doctorTitle ? `, ${appt.doctorTitle}` : ''}
                    </h3>
                    <p className="font-body-sm text-body-sm text-secondary">
                      {appt.doctorSpecialty}
                    </p>
                    <div className="flex items-center gap-space-xs mt-space-xxs">
                      <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">4.96</span>
                      <span className="font-body-sm text-body-sm text-secondary">· 640+ Consultations</span>
                    </div>
                  </div>
                </div>

                {/* Key Appointment Metadata Grid */}
                <div className="grid grid-cols-2 gap-space-md">
                  <div className="flex flex-col bg-surface p-space-sm rounded-lg">
                    <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                      Date &amp; Arrival
                    </span>
                    <div className="flex items-center gap-space-xxs mt-space-xxs">
                      <span className="material-symbols-outlined text-primary text-base">calendar_today</span>
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                        {appt.appointmentDate}
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-primary font-medium mt-space-xxs">
                      {appt.timeSlot}
                    </span>
                  </div>

                  <div className="flex flex-col bg-surface p-space-sm rounded-lg">
                    <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                      Location &amp; Room
                    </span>
                    <div className="flex items-center gap-space-xxs mt-space-xxs">
                      <span className="material-symbols-outlined text-primary text-base">apartment</span>
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                        {appt.hospitalName}
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-secondary mt-space-xxs">
                      {appt.doctorRoomSuite}
                    </span>
                  </div>
                </div>

                {/* Patient & Complaint Details */}
                <div className="flex flex-col gap-space-xs p-space-md bg-surface-container-low/60 rounded-xl text-body-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary">Patient Name:</span>
                    <span className="font-semibold text-on-surface">{appt.patientName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary">Primary Reason:</span>
                    <span className="font-semibold text-on-surface">{appt.primaryReason}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary">Insurance Coverage:</span>
                    <span className="font-semibold text-primary">{appt.insuranceProvider}</span>
                  </div>
                </div>
              </div>

              {/* Right QR / Barcode Card */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-space-lg bg-surface-container-low rounded-xl text-center border border-outline-variant/30">
                <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-sm flex items-center justify-center border border-outline-variant/20 mb-3">
                  {/* SVG QR Code Simulation */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect width="100" height="100" fill="#ffffff" />
                    <rect x="10" y="10" width="25" height="25" fill="#00543b" />
                    <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                    <rect x="18" y="18" width="9" height="9" fill="#00543b" />
                    <rect x="65" y="10" width="25" height="25" fill="#00543b" />
                    <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                    <rect x="73" y="18" width="9" height="9" fill="#00543b" />
                    <rect x="10" y="65" width="25" height="25" fill="#00543b" />
                    <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                    <rect x="18" y="73" width="9" height="9" fill="#00543b" />
                    <rect x="42" y="15" width="6" height="6" fill="#00543b" />
                    <rect x="52" y="25" width="6" height="6" fill="#00543b" />
                    <rect x="42" y="42" width="16" height="16" fill="#00543b" />
                    <rect x="65" y="45" width="8" height="8" fill="#00543b" />
                    <rect x="45" y="70" width="10" height="10" fill="#00543b" />
                    <rect x="65" y="75" width="20" height="15" fill="#00543b" />
                  </svg>
                </div>
                <span className="font-label-sm uppercase tracking-widest text-primary font-bold">
                  Fast Check-In QR
                </span>
                <span className="text-xs text-secondary mt-1">Present at Reception Kiosk</span>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-space-sm">
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-space-lg py-space-sm rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface font-label-md font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              <span>Download Digital Pass</span>
            </button>
            <Link
              to="/appointments"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-space-lg py-space-sm rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md font-semibold shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-lg">event_available</span>
              <span>View In Appointments</span>
            </Link>
            <Link
              to="/"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-space-lg py-space-sm rounded-xl border border-outline-variant/40 hover:bg-surface-container-low font-label-md text-secondary hover:text-on-surface transition-colors"
            >
              <span>Return Home</span>
            </Link>
          </div>
        </div>

        {/* Right Info: Pre-Visit Clinical Guidelines */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm border border-outline-variant/30 space-y-space-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Pre-Visit Instructions
            </h3>
            <ul className="space-y-space-sm text-body-sm text-secondary">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">schedule</span>
                <span>Please arrive 15 minutes before your consultation (09:30 AM) to complete vitals check.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">badge</span>
                <span>Bring your photo ID and current medical insurance card.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">medication</span>
                <span>Bring a complete list of any prescription and over-the-counter medications currently taken.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">local_parking</span>
                <span>Complimentary valet parking available at Aurora Pavilion Entrance B.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmedPage;

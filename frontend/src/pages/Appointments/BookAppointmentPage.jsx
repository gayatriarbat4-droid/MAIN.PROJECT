import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FALLBACK_DOCTORS } from '../../constants/doctorsData';
import { handleImageError } from '../../utils/imageUtils';

export const BookAppointmentPage = () => {
  const [searchParams] = useSearchParams();
  const doctorIdParam = searchParams.get('doctorId') || '1';
  const initialDate = searchParams.get('date') || 'Mon, Oct 14, 2024';
  const initialSlot = searchParams.get('slot') || '09:45 AM EDT';
  const initialMode = searchParams.get('mode') || 'IN_CLINIC';

  const { user } = useAuth();
  const navigate = useNavigate();

  const fallbackDoc = FALLBACK_DOCTORS.find((d) => d.id === Number(doctorIdParam)) || FALLBACK_DOCTORS[0];
  const [doctor, setDoctor] = useState(fallbackDoc);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [isSelf, setIsSelf] = useState(true);
  const [familyFullName, setFamilyFullName] = useState('');
  const [familyPhone, setFamilyPhone] = useState('');
  const [familyEmail, setFamilyEmail] = useState('');

  const [primaryReason, setPrimaryReason] = useState('Chest Discomfort / Mild Exertion Palpitations');
  const [clinicalNotes, setClinicalNotes] = useState(
    'Occasional tightness in the central chest area when exercising or climbing long staircases over the past 3 weeks. No fainting, but feeling brief flutter sensations.'
  );
  const [insuranceProvider, setInsuranceProvider] = useState('Blue Cross Blue Shield (PPO Premium)');
  const [policyId, setPolicyId] = useState('BCBS-8894102-01');

  // Selected schedule
  const [appointmentDate, setAppointmentDate] = useState(initialDate);
  const [timeSlot, setTimeSlot] = useState(initialSlot);
  const [consultationType, setConsultationType] = useState(initialMode);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await doctorService.getDoctorById(doctorIdParam);
        if (res?.success) {
          setDoctor(res.data);
        }
      } catch (err) {
        console.error('Failed to load doctor for booking', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorIdParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        doctorId: doctor?.id || 1,
        hospitalId: doctor?.hospitalId || 1,
        appointmentDate,
        timeSlot,
        consultationType,
        primaryReason,
        clinicalNotes,
        insuranceProvider,
        policyId,
        copayAmount: 30.0,
        totalFee: doctor?.consultationFee || 250.0,
        isBookingForSelf: isSelf,
        patientFullName: isSelf ? (user?.fullName || 'Johnathan Vance') : familyFullName,
        patientPhone: isSelf ? (user?.phone || '+1 (555) 234-8901') : familyPhone,
        patientEmail: isSelf ? (user?.email || 'j.vance@vancetech.io') : familyEmail,
      };

      const res = await appointmentService.createAppointment(payload);
      if (res?.success && res?.data) {
        navigate(`/appointment-confirmed/${res.data.id}`);
      } else {
        setErrorMsg(res?.message || 'Unable to confirm appointment.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error occurred while scheduling appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Preparing clinical reservation suite..." />;
  }

  return (
    <div className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-desktop py-space-xl">
      {/* Top Flow Breadcrumb & Step Tracker */}
      <div className="mb-space-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-lg">
          <div>
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-surface-container text-primary font-label-sm text-label-sm uppercase tracking-widest mb-space-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              Direct Cardiology Intake
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
              Clinical Consultation Reservation
            </h1>
            <p className="font-body-md text-body-md text-secondary mt-space-xxs">
              Verify patient identification and attach diagnostic background prior to surgical or clinical triage.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-space-md text-on-surface-variant font-label-md text-label-md">
            <span className="flex items-center gap-space-xxs text-primary font-semibold">
              <span className="material-symbols-outlined text-lg">lock</span>
              HIPAA Vault Encrypted
            </span>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <span>Session Ref: #MC-INLINE</span>
          </div>
        </div>

        {/* 5-Step Editorial Stepper */}
        <div className="relative bg-surface-container-lowest p-space-md md:p-space-lg rounded-2xl shadow-sm border border-outline-variant/30">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-space-sm md:gap-space-md relative z-10">
            {/* Step 1 */}
            <div className="flex items-center gap-space-sm group">
              <div className="w-9 h-9 shrink-0 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-label-md text-label-md font-bold shadow-sm">
                <span className="material-symbols-outlined text-lg">check</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm uppercase text-secondary">Step 01</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate">Select Doctor</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-space-sm group">
              <div className="w-9 h-9 shrink-0 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-label-md text-label-md font-bold shadow-sm">
                <span className="material-symbols-outlined text-lg">check</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm uppercase text-secondary">Step 02</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate">Select Date</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-space-sm group">
              <div className="w-9 h-9 shrink-0 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-label-md text-label-md font-bold shadow-sm">
                <span className="material-symbols-outlined text-lg">check</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm uppercase text-secondary">Step 03</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate">Time Slot</span>
              </div>
            </div>

            {/* Step 4: Active */}
            <div className="flex items-center gap-space-sm col-span-2 md:col-span-1 bg-surface-container-low md:bg-transparent p-space-xs md:p-0 rounded-xl">
              <div className="w-9 h-9 shrink-0 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md font-bold shadow-md shadow-primary/20">
                <span className="material-symbols-outlined text-lg">clinical_notes</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm uppercase text-primary font-bold">Step 04 • Active</span>
                <span className="font-label-md text-label-md text-on-surface font-bold truncate">Intake Details</span>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex items-center gap-space-sm opacity-60">
              <div className="w-9 h-9 shrink-0 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-label-md text-label-md font-semibold">
                5
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm uppercase text-secondary">Step 05</span>
                <span className="font-label-md text-label-md text-secondary truncate">Confirmation</span>
              </div>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="mt-space-md w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-700 w-[78%]"></div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container font-body-md flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        {/* Left Column: Form & Clinical Notes (7 of 12 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-space-xl">
          {/* Patient Selection & Persona Banner */}
          <section className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
              <div>
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Section 4.1</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface mt-space-xxs">
                  Patient Identification
                </h2>
              </div>

              {/* Toggle: Myself vs Family */}
              <div className="inline-flex p-space-xxs bg-surface-container-low rounded-xl">
                <button
                  className={`px-space-md py-space-xs rounded-lg font-label-md text-label-md transition-all ${
                    isSelf ? 'bg-surface-container-lowest text-primary shadow-sm font-bold' : 'text-secondary hover:text-on-surface'
                  }`}
                  onClick={() => setIsSelf(true)}
                  type="button"
                >
                  Booking for Myself
                </button>
                <button
                  className={`px-space-md py-space-xs rounded-lg font-label-md text-label-md transition-all ${
                    !isSelf ? 'bg-surface-container-lowest text-primary shadow-sm font-bold' : 'text-secondary hover:text-on-surface'
                  }`}
                  onClick={() => setIsSelf(false)}
                  type="button"
                >
                  Family Member
                </button>
              </div>
            </div>

            {isSelf ? (
              /* Auto-filled Patient Metadata Card */
              <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-md">
                  <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-md text-headline-md font-medium shadow-sm">
                    {user?.fullName?.substring(0, 2).toUpperCase() || 'JV'}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        {user?.fullName || 'Johnathan Vance'}
                      </span>
                      <span className="inline-flex items-center px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-label-sm font-bold">
                        Primary Insured
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-space-md gap-y-space-xxs text-secondary font-body-sm text-body-sm mt-space-xxs">
                      <span>Age 42</span>
                      <span>•</span>
                      <span>Male (He/Him)</span>
                      <span>•</span>
                      <span>DOB: 11/18/1981</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end text-body-sm font-body-sm text-on-surface-variant">
                  <span className="font-semibold text-on-surface">{user?.phone || '+1 (555) 234-8901'}</span>
                  <span className="text-secondary">{user?.email || 'j.vance@vancetech.io'}</span>
                </div>
              </div>
            ) : (
              /* Family Member Input Fields */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md p-space-md bg-surface-container-low rounded-xl">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-secondary">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={familyFullName}
                    onChange={(e) => setFamilyFullName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="h-10 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-sm focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-secondary">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={familyPhone}
                    onChange={(e) => setFamilyPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="h-10 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-sm focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-secondary">Email Address</label>
                  <input
                    type="email"
                    value={familyEmail}
                    onChange={(e) => setFamilyEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="h-10 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-sm focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-space-xs text-secondary text-body-sm font-body-sm">
              <span className="material-symbols-outlined text-base text-primary">verified_user</span>
              <span>Identity synced with verified MediCare Master Patient Index (MPI #0921-98).</span>
            </div>
          </section>

          {/* Visit Clinical Specifications */}
          <section className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-lg">
            <div>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Section 4.2</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface mt-space-xxs">
                Clinical Context &amp; Complaint
              </h2>
              <p className="font-body-sm text-body-sm text-secondary mt-space-xxs">
                Provide specific symptoms to help Dr. {doctor?.name || 'Michael Collins'} prepare the diagnostic suite prior to your arrival.
              </p>
            </div>

            {/* Dropdown: Reason for visit */}
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-md text-label-md text-on-surface flex items-center justify-between" htmlFor="chief-complaint">
                <span>Primary Reason for Consultation <span className="text-error">*</span></span>
                <span className="text-secondary font-body-sm">Select most accurate</span>
              </label>
              <div className="relative">
                <select
                  value={primaryReason}
                  onChange={(e) => setPrimaryReason(e.target.value)}
                  className="w-full h-12 px-space-md appearance-none bg-surface-container-low text-on-surface rounded-xl font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer border border-outline-variant/30"
                  id="chief-complaint"
                >
                  <option value="Routine Heart Checkup & Preventive Assessment">Routine Heart Checkup &amp; Preventive Assessment</option>
                  <option value="Chest Discomfort / Mild Exertion Palpitations">Chest Discomfort / Mild Exertion Palpitations</option>
                  <option value="Cardiovascular Post-Operative Follow-up">Cardiovascular Post-Operative Follow-up</option>
                  <option value="Diagnostic Echo & Holter Review">Diagnostic Echo &amp; Holter Review</option>
                  <option value="Second Opinion / Other Consultation">Second Opinion / Other Consultation</option>
                </select>
                <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                  expand_more
                </span>
              </div>
            </div>

            {/* Textarea: Symptoms & Medical Notes */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="clinical-notes">
                  Detailed Symptoms &amp; Medical Notes
                </label>
                <span className="font-body-sm text-body-sm text-secondary">
                  {clinicalNotes.length} / 500 characters
                </span>
              </div>
              <textarea
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                maxLength={500}
                rows={4}
                className="w-full p-space-md bg-surface-container-low text-on-surface placeholder:text-outline rounded-xl font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all resize-none border border-outline-variant/30"
                id="clinical-notes"
                placeholder="Describe onset, triggers (e.g., stairs, caffeine), duration, and current medications..."
              />
              <span className="font-body-sm text-body-sm text-secondary flex items-center gap-space-xxs">
                <span className="material-symbols-outlined text-sm text-primary">info</span>
                This note is forwarded directly into the encrypted clinical chart for review.
              </span>
            </div>

            {/* Document Upload Simulation */}
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-md text-label-md text-on-surface">Diagnostic Records &amp; Past Reports (Optional)</label>
              <div className="group relative flex flex-col items-center justify-center p-space-xl bg-surface-container-low rounded-2xl hover:bg-surface-container-high transition-colors text-center border-2 border-dashed border-outline-variant/40 cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform mb-space-sm">
                  <span className="material-symbols-outlined text-2xl">upload_file</span>
                </div>
                <p className="font-label-lg text-label-lg text-on-surface">
                  Drag and drop your clinical files or <span className="text-primary underline">Browse Computer</span>
                </p>
                <p className="font-body-sm text-body-sm text-secondary mt-space-xxs">
                  Supports DICOM, PDF, JPG, PNG up to 50MB each.
                </p>
              </div>

              {/* Attached Item preview */}
              <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-xl mt-2 border border-outline-variant/20">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-xl">picture_as_pdf</span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Prior_Cardiac_StressTest_2023.pdf</span>
                    <span className="font-body-sm text-body-sm text-secondary">2.4 MB • Uploaded &amp; Encrypted</span>
                  </div>
                </div>
                <span className="text-xs text-primary font-semibold">Attached</span>
              </div>
            </div>
          </section>

          {/* Insurance Information Section */}
          <section className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-lg">
            <div>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Section 4.3</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface mt-space-xxs">
                Insurance &amp; Billing Coverage
              </h2>
              <p className="font-body-sm text-body-sm text-secondary mt-space-xxs">
                Real-time insurance pre-authorization and tier verification.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface">Coverage Provider *</label>
                <div className="relative">
                  <select
                    value={insuranceProvider}
                    onChange={(e) => setInsuranceProvider(e.target.value)}
                    className="w-full h-12 px-space-md appearance-none bg-surface-container-low text-on-surface rounded-xl font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer border border-outline-variant/30"
                  >
                    <option value="Blue Cross Blue Shield (PPO Premium)">Blue Cross Blue Shield (PPO Premium)</option>
                    <option value="Aetna Open Access Elite">Aetna Open Access Elite</option>
                    <option value="Medicare Part B Advantage">Medicare Part B Advantage</option>
                    <option value="UnitedHealthcare Choice Plus">UnitedHealthcare Choice Plus</option>
                    <option value="Direct Concierge / Private Self-Pay">Direct Concierge / Private Self-Pay</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface">Member / Policy ID *</label>
                <input
                  type="text"
                  required
                  value={policyId}
                  onChange={(e) => setPolicyId(e.target.value)}
                  className="w-full h-12 px-space-md bg-surface-container-low text-on-surface rounded-xl font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all border border-outline-variant/30"
                />
              </div>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-xs text-primary font-label-md text-label-md">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span>Eligibility Verified: Tier 1 Specialist in-network coverage</span>
              </div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Group: NY-88301-MED
              </span>
            </div>
          </section>
        </div>

        {/* Right Column: Live Sticky Summary Card (5 of 12 Cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col gap-space-lg">
          <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-xl border border-outline-variant/30 flex flex-col gap-space-lg">
            <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                Booking Summary
              </span>
              <span className="font-label-sm text-label-sm text-secondary">Step 4 of 5</span>
            </div>

            {/* Doctor Card */}
            <div className="flex items-start gap-space-md">
              <img
                src={doctor?.avatarUrl || '/assets/doctor-collins.jpg'}
                alt={doctor?.name}
                className="w-16 h-16 rounded-xl object-cover ring-2 ring-primary/20 shadow-sm"
                onError={(e) => handleImageError(e, '/assets/doctor-collins.jpg')}
              />
              <div className="flex flex-col min-w-0">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">
                  {doctor?.name}, {doctor?.title}
                </h3>
                <p className="font-body-sm text-body-sm text-primary font-medium">{doctor?.specialty}</p>
                <p className="font-body-sm text-body-sm text-secondary mt-0.5">{doctor?.hospitalName}</p>
              </div>
            </div>

            {/* Slot & Location Info */}
            <div className="space-y-space-xs p-space-md rounded-xl bg-surface-container-low text-body-sm text-secondary">
              <div className="flex items-center justify-between">
                <span>Date &amp; Time:</span>
                <span className="font-semibold text-on-surface">{appointmentDate} · {timeSlot}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Consultation Mode:</span>
                <span className="font-semibold text-on-surface">
                  {consultationType === 'IN_CLINIC' ? 'In-Clinic Suite' : 'Telehealth HD'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Campus Location:</span>
                <span className="font-semibold text-on-surface">{doctor?.roomSuite || 'Suite 420-B'}</span>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="space-y-space-xs pt-space-xs border-t border-outline-variant/20 text-body-sm">
              <div className="flex items-center justify-between text-secondary">
                <span>Specialist Consultation Fee</span>
                <span className="text-on-surface font-medium">${doctor?.consultationFee || '250.00'}</span>
              </div>
              <div className="flex items-center justify-between text-secondary">
                <span>In-Network Insurance Co-Pay</span>
                <span className="text-primary font-medium">-$220.00</span>
              </div>
              <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/20 text-on-surface font-bold text-base">
                <span>Estimated Total Due</span>
                <span className="text-primary text-xl">$30.00</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-space-md rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-space-xs disabled:opacity-70 cursor-pointer"
            >
              {submitting ? (
                <span>Confirming...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">event_available</span>
                  <span>Confirm &amp; Schedule Appointment</span>
                </>
              )}
            </button>

            <p className="text-xs text-center text-secondary">
              By confirming, you agree to the MediCare clinical attendance policy. No charge for cancellations up to 24h prior.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookAppointmentPage;

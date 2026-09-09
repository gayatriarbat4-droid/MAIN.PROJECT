import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FALLBACK_DOCTORS } from '../../constants/doctorsData';
import { handleImageError } from '../../utils/imageUtils';

export const DoctorProfilePage = () => {
  const { id } = useParams();
  const doctorId = id || 1;
  const navigate = useNavigate();

  const fallbackDoc = FALLBACK_DOCTORS.find((d) => d.id === Number(doctorId)) || FALLBACK_DOCTORS[0];

  const [doctor, setDoctor] = useState(fallbackDoc);
  const [schedules, setSchedules] = useState([
    { id: 1, availableDate: '2024-10-14', timeSlot: '09:00 AM', isBooked: false },
    { id: 2, availableDate: '2024-10-14', timeSlot: '09:45 AM', isBooked: false },
    { id: 3, availableDate: '2024-10-14', timeSlot: '11:15 AM', isBooked: false },
    { id: 4, availableDate: '2024-10-14', timeSlot: '02:30 PM', isBooked: false },
    { id: 5, availableDate: '2024-10-15', timeSlot: '10:00 AM', isBooked: false },
  ]);
  const [reviews, setReviews] = useState([]);
  const [selectedDate, setSelectedDate] = useState('2024-10-14');
  const [selectedSlot, setSelectedSlot] = useState('09:45 AM');
  const [consultationMode, setConsultationMode] = useState('IN_CLINIC');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const [docRes, schedRes, revRes] = await Promise.all([
          doctorService.getDoctorById(doctorId),
          doctorService.getDoctorSchedules(doctorId),
          doctorService.getDoctorReviews(doctorId),
        ]);

        if (docRes?.success && docRes.data) {
          setDoctor(docRes.data);
        } else {
          setDoctor(fallbackDoc);
        }
        if (schedRes?.success && schedRes.data?.length > 0) {
          setSchedules(schedRes.data);
          setSelectedDate(schedRes.data[0].availableDate);
          const available = schedRes.data.filter((s) => !s.isBooked);
          if (available.length > 0) {
            setSelectedSlot(available[0].timeSlot);
          }
        }
        if (revRes?.success && revRes.data?.length > 0) {
          setReviews(revRes.data);
        }
      } catch (err) {
        console.warn('Using fallback clinician data', err);
        setDoctor(fallbackDoc);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const handleProceedToBooking = () => {
    navigate(
      `/book-appointment?doctorId=${doctor.id}&date=${encodeURIComponent(selectedDate)}&slot=${encodeURIComponent(selectedSlot)}&mode=${consultationMode}`
    );
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving clinician credentials..." />;
  }

  if (!doctor) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-headline-md text-on-surface">Physician not found</h2>
        <Link to="/doctors" className="text-primary mt-4 inline-block font-semibold">
          Return to Doctors Directory
        </Link>
      </div>
    );
  }

  const uniqueDates = Array.from(new Set(schedules.map((s) => s.availableDate)));
  const slotsForDate = schedules.filter((s) => s.availableDate === selectedDate);

  return (
    <div className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-desktop py-space-xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-space-xs text-secondary font-label-md text-label-md mb-space-lg">
        <Link className="hover:text-primary transition-colors" to="/hospitals">
          {doctor.departmentName || 'Cardiology Department'}
        </Link>
        <span className="material-symbols-outlined text-sm text-outline-variant">chevron_right</span>
        <Link className="hover:text-primary transition-colors" to="/hospitals">
          {doctor.hospitalName || 'Aurora Medical Center'}
        </Link>
        <span className="material-symbols-outlined text-sm text-outline-variant">chevron_right</span>
        <span className="text-on-surface font-semibold">{doctor.name}, {doctor.title}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
        {/* Left Column: Doctor Profile Bio & Reviews (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-xl">
          {/* Doctor Header Banner Card */}
          <div className="relative bg-surface-container-lowest rounded-2xl p-space-lg md:p-space-xl shadow-[0_1px_3px_rgba(7,59,58,0.04),0_6px_16px_-4px_rgba(7,59,58,0.06)] overflow-hidden border border-outline-variant/30">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex flex-col md:flex-row gap-space-lg items-start relative z-10">
              <div className="relative flex-shrink-0 group">
                <img
                  alt={doctor.name}
                  className="w-36 h-36 md:w-44 md:h-44 object-cover object-top rounded-2xl shadow-[0_4px_12px_rgba(7,59,58,0.08)]"
                  src={doctor.avatarUrl || '/assets/doctor-collins.jpg'}
                  onError={(e) => handleImageError(e, '/assets/doctor-collins.jpg')}
                />
                <span
                  className="absolute -bottom-2 -right-2 flex items-center justify-center w-8 h-8 bg-primary text-on-primary rounded-full shadow-md"
                  title="JCI Accredited Clinician"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </span>
              </div>

              <div className="flex flex-col gap-space-xs flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-space-xs">
                  <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-primary-fixed/60 text-on-primary-fixed-variant font-label-sm text-label-sm font-bold">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                    Available This Week
                  </span>
                  <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-surface-container-high text-secondary font-label-sm text-label-sm font-medium">
                    <span className="material-symbols-outlined text-xs">verified_user</span>
                    License #{doctor.licenseNumber || 'NY-884210'}
                  </span>
                </div>

                <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-space-xxs">
                  {doctor.name},{' '}
                  <span className="font-headline-md text-headline-md text-secondary font-normal">
                    {doctor.title}
                  </span>
                </h1>

                <p className="font-body-md text-body-md text-primary font-semibold">
                  {doctor.specialty}
                </p>

                <div className="flex items-center gap-space-xs text-secondary font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-base text-primary">apartment</span>
                  <span>{doctor.hospitalName || 'Aurora Medical Center'} • {doctor.roomSuite}</span>
                </div>

                <div className="flex flex-wrap items-center gap-space-lg pt-space-xs text-secondary font-label-md text-label-md">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="font-bold text-on-surface">{doctor.rating}</span>
                    <span className="text-on-surface-variant font-normal">({doctor.reviewCount}+ Reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base text-primary">history_edu</span>
                    <span className="font-bold text-on-surface">{doctor.experienceYears}+</span>
                    <span className="text-on-surface-variant font-normal">Years Exp.</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base text-primary">translate</span>
                    <span className="text-on-surface">{doctor.languages}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Bio & Philosophy */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm border border-outline-variant/30 space-y-space-md">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                About the Physician
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface mt-1">
                Clinical Focus &amp; Philosophy
              </h2>
            </div>
            <p className="font-body-md text-body-md text-secondary leading-relaxed">
              {doctor.bio}
            </p>
          </div>

          {/* Education & Fellowships */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm border border-outline-variant/30 space-y-space-md">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Credentials &amp; Academic Heritage
            </h2>
            <div className="p-space-md rounded-xl bg-surface-container-low text-secondary font-body-sm leading-relaxed">
              {doctor.education}
            </div>
          </div>

          {/* Patient Reviews Section */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm border border-outline-variant/30 space-y-space-lg">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                  Verified Patient Testimonials
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface mt-1">
                  Clinical Experiences ({reviews.length})
                </h2>
              </div>
              <div className="flex items-center gap-1 text-on-surface">
                <span className="material-symbols-outlined text-amber-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="font-bold text-lg">{doctor.rating}</span>
                <span className="text-secondary text-sm">/ 5.0</span>
              </div>
            </div>

            <div className="space-y-space-md">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-semibold text-on-surface">
                      {rev.patientName}
                    </span>
                    <span className="text-xs text-secondary">{rev.reviewDate}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(Math.floor(rev.rating))].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                    ))}
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Column: Consultation Booking Card (4 Cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-space-lg">
          <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-xl border border-outline-variant/30 flex flex-col gap-space-md">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                Consultation Fee
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-xl text-headline-xl font-bold text-on-surface">
                  ${doctor.consultationFee}
                </span>
                <span className="font-body-sm text-secondary">/ comprehensive session</span>
              </div>
            </div>

            {/* Consultation Mode Toggle */}
            <div className="flex flex-col gap-space-xxs">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Visit Format
              </label>
              <div className="grid grid-cols-2 gap-space-xs p-1 bg-surface-container-low rounded-xl">
                <button
                  type="button"
                  onClick={() => setConsultationMode('IN_CLINIC')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                    consultationMode === 'IN_CLINIC'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">apartment</span>
                  In-Clinic Suite
                </button>
                <button
                  type="button"
                  onClick={() => setConsultationMode('TELEHEALTH')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                    consultationMode === 'TELEHEALTH'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">videocam</span>
                  Telehealth HD
                </button>
              </div>
            </div>

            {/* Date Picker Chips */}
            <div className="flex flex-col gap-space-xxs">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Select Date
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {uniqueDates.length > 0 ? (
                  uniqueDates.map((dt) => (
                    <button
                      key={dt}
                      type="button"
                      onClick={() => setSelectedDate(dt)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedDate === dt
                          ? 'bg-primary text-on-primary shadow-md'
                          : 'bg-surface-container-low text-secondary hover:bg-surface-container'
                      }`}
                    >
                      {dt}
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-secondary">No immediate dates</span>
                )}
              </div>
            </div>

            {/* Time Slot Chips */}
            <div className="flex flex-col gap-space-xxs">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Available Time Slots
              </label>
              <div className="grid grid-cols-2 gap-2">
                {slotsForDate.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={slot.isBooked}
                    onClick={() => setSelectedSlot(slot.timeSlot)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                      slot.isBooked
                        ? 'bg-surface-container-high/50 text-outline border-transparent cursor-not-allowed line-through'
                        : selectedSlot === slot.timeSlot
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface border-transparent hover:border-primary/30'
                    }`}
                  >
                    {slot.timeSlot}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceedToBooking}
              className="w-full py-space-sm rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold text-center shadow-md hover:shadow-lg transition-all mt-space-sm"
            >
              Reserve Consultation
            </button>

            <p className="text-xs text-center text-secondary">
              Direct insurance billing eligible. No pre-payment required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;

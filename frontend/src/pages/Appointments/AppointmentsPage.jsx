import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import ToastNotification from '../../components/common/ToastNotification';
import { handleImageError } from '../../utils/imageUtils';

export const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isFastTrackOpen, setIsFastTrackOpen] = useState(false);
  const [rescheduleAppt, setRescheduleAppt] = useState(null);
  const [newDate, setNewDate] = useState('Mon, Oct 21, 2024');
  const [newSlot, setNewSlot] = useState('11:00 AM EDT');

  // Fast track booking state
  const [fastDepartment, setFastDepartment] = useState('Cardiovascular Medicine');
  const [fastCampus, setFastCampus] = useState('Aurora Pavilion');
  const [fastFormat, setFastFormat] = useState('IN_CLINIC');

  // Toast
  const [toast, setToast] = useState({ show: false, title: '', message: '' });

  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const res = await appointmentService.getMyAppointments();
      if (res?.success) {
        setAppointments(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleAppt) return;
    try {
      const res = await appointmentService.rescheduleAppointment(
        rescheduleAppt.id,
        newDate,
        newSlot
      );
      if (res?.success) {
        setToast({
          show: true,
          title: 'Appointment Rescheduled',
          message: `Consultation moved to ${newDate} at ${newSlot}.`,
        });
        setRescheduleAppt(null);
        fetchAppointments();
      }
    } catch (err) {
      console.error('Reschedule failed', err);
    }
  };

  const handleCancelAppointment = async (apptId) => {
    if (!window.confirm('Are you sure you wish to cancel this scheduled consultation?')) return;
    try {
      const res = await appointmentService.cancelAppointment(apptId);
      if (res?.success) {
        setToast({
          show: true,
          title: 'Appointment Cancelled',
          message: 'The appointment has been marked as cancelled.',
        });
        fetchAppointments();
      }
    } catch (err) {
      console.error('Cancel failed', err);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchesSearch =
      a.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.bookingReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.doctorSpecialty?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'upcoming') {
      return a.status === 'CONFIRMED' || a.status === 'RESCHEDULED';
    } else if (activeTab === 'past') {
      return a.status === 'COMPLETED';
    } else {
      return a.status === 'CANCELLED';
    }
  });

  const nextAppt = appointments.find((a) => a.status === 'CONFIRMED' || a.status === 'RESCHEDULED');

  return (
    <div className="w-full max-w-[84rem] mx-auto px-margin-mobile lg:px-margin-desktop py-space-xl lg:py-space-2xl space-y-space-xl">
      {/* Toast Notification */}
      <ToastNotification
        show={toast.show}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast({ show: false, title: '', message: '' })}
      />

      {/* Editorial Header & Actions */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
        <div className="space-y-space-xxs max-w-2xl">
          <div className="flex items-center gap-space-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
              Clinical Care Management
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
            My Health Appointments
          </h1>
          <p className="font-body-md text-body-md text-secondary">
            Manage your scheduled consultations, review diagnostic orders, and coordinate specialized outpatient clinical procedures with your dedicated physician care team.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          {nextAppt && (
            <div className="hidden sm:flex items-center gap-space-xs px-space-md py-space-sm bg-surface-container-lowest rounded-lg shadow-sm text-secondary font-label-md text-label-md border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
              <span>
                Next: {nextAppt.appointmentDate?.split(',')[1]?.trim() || nextAppt.appointmentDate} • {nextAppt.timeSlot}
              </span>
            </div>
          )}
          <button
            className="flex items-center gap-space-xs px-space-lg py-space-sm bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] font-semibold cursor-pointer"
            onClick={() => setIsFastTrackOpen(true)}
            type="button"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span>Book New Appointment</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs & Dynamic Filter Bar */}
      <div className="space-y-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
          {/* Tabs */}
          <nav className="flex items-center gap-space-xs p-space-xxs bg-surface-container-low rounded-xl">
            <button
              className={`flex items-center gap-space-xs px-space-md py-space-xs rounded-lg font-label-md text-label-md transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                  : 'text-secondary hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('upcoming')}
              type="button"
            >
              <span>Upcoming</span>
              <span className="px-1.5 py-0.2 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold">
                {appointments.filter((a) => a.status === 'CONFIRMED' || a.status === 'RESCHEDULED').length}
              </span>
            </button>

            <button
              className={`flex items-center gap-space-xs px-space-md py-space-xs rounded-lg font-label-md text-label-md transition-all ${
                activeTab === 'past'
                  ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                  : 'text-secondary hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('past')}
              type="button"
            >
              <span>Past Visits</span>
            </button>

            <button
              className={`flex items-center gap-space-xs px-space-md py-space-xs rounded-lg font-label-md text-label-md transition-all ${
                activeTab === 'cancelled'
                  ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                  : 'text-secondary hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('cancelled')}
              type="button"
            >
              <span>Cancelled</span>
              <span className="px-1.5 py-0.2 rounded-full bg-surface-container-high text-secondary text-xs">
                {appointments.filter((a) => a.status === 'CANCELLED').length}
              </span>
            </button>
          </nav>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-secondary text-base">
              search
            </span>
          </div>
        </div>

        {/* Appointments List */}
        {loading ? (
          <LoadingSpinner text="Retrieving patient consultations..." />
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
            <span className="material-symbols-outlined text-4xl text-secondary mb-2">event_busy</span>
            <h3 className="font-headline-sm text-on-surface">No {activeTab} appointments found</h3>
            <p className="text-secondary text-body-sm mt-1">You have no scheduled consultations in this category.</p>
            <button
              onClick={() => setIsFastTrackOpen(true)}
              className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:bg-primary-container transition-all inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Book Consultation Now
            </button>
          </div>
        ) : (
          <div className="space-y-space-md">
            {filteredAppointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-all border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-space-md"
              >
                {/* Doctor & Info */}
                <div className="flex items-start gap-space-md">
                  <img
                    src={appt.doctorAvatarUrl || '/assets/doctor-collins.jpg'}
                    alt={appt.doctorName}
                    className="w-16 h-16 rounded-xl object-cover ring-2 ring-primary/20 shrink-0"
                    onError={(e) => handleImageError(e, '/assets/doctor-collins.jpg')}
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">
                        {appt.doctorName}, {appt.doctorTitle}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          appt.status === 'CONFIRMED'
                            ? 'bg-primary-fixed text-on-primary-fixed'
                            : appt.status === 'RESCHEDULED'
                            ? 'bg-secondary-fixed text-on-secondary-fixed'
                            : 'bg-error-container text-on-error-container'
                        }`}
                      >
                        {appt.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-secondary text-xs font-semibold">
                        {appt.consultationType === 'IN_CLINIC' ? 'In-Clinic' : 'Telehealth'}
                      </span>
                    </div>

                    <p className="text-xs text-primary font-medium mt-0.5">{appt.doctorSpecialty}</p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary mt-2">
                      <span className="flex items-center gap-1 font-semibold text-on-surface">
                        <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
                        {appt.appointmentDate} · {appt.timeSlot}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                        {appt.hospitalName} • {appt.doctorRoomSuite}
                      </span>
                      <span className="text-secondary font-mono">Ref: #{appt.bookingReference}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  <Link
                    to={`/appointment-confirmed/${appt.id}`}
                    className="px-space-md py-2 text-xs font-semibold rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    View Pass
                  </Link>

                  {appt.status !== 'CANCELLED' && (
                    <>
                      <button
                        onClick={() => {
                          setRescheduleAppt(appt);
                          setNewDate(appt.appointmentDate);
                          setNewSlot(appt.timeSlot);
                        }}
                        className="px-space-md py-2 text-xs font-semibold rounded-xl bg-surface-container-high text-primary hover:bg-surface-container transition-colors"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancelAppointment(appt.id)}
                        className="p-2 text-xs font-semibold rounded-xl text-error hover:bg-error-container/30 transition-colors"
                        title="Cancel appointment"
                      >
                        <span className="material-symbols-outlined text-lg">cancel</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fast-Track Access Modal */}
      <Modal
        isOpen={isFastTrackOpen}
        onClose={() => setIsFastTrackOpen(false)}
        subtitle="Fast-Track Access"
        title="Book New Consultation"
      >
        <div className="space-y-space-md">
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-space-xxs">
              Specialty Department
            </label>
            <div className="relative">
              <select
                value={fastDepartment}
                onChange={(e) => setFastDepartment(e.target.value)}
                className="w-full h-12 px-space-md bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface appearance-none cursor-pointer focus:outline-none focus:bg-surface-container-low shadow-sm border border-outline-variant/30"
              >
                <option value="Cardiovascular Medicine">Cardiovascular Medicine &amp; Heart Health</option>
                <option value="Neurology">Neurology &amp; Cognitive Research</option>
                <option value="Orthopedics">Orthopedic Surgery &amp; Sports Medicine</option>
                <option value="Oncology">Endocrinology &amp; Metabolic Health</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-3.5 text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-space-xxs">
              Preferred Medical Campus
            </label>
            <div className="grid grid-cols-2 gap-space-xs">
              <label
                className={`flex items-center gap-space-xs p-space-sm rounded-lg cursor-pointer transition-colors border ${
                  fastCampus === 'Aurora Pavilion'
                    ? 'bg-surface-container-lowest border-primary'
                    : 'bg-surface-container-low border-transparent'
                }`}
              >
                <input
                  type="radio"
                  name="campus"
                  checked={fastCampus === 'Aurora Pavilion'}
                  onChange={() => setFastCampus('Aurora Pavilion')}
                  className="accent-primary w-4 h-4"
                />
                <span className="font-body-sm text-body-sm text-on-surface">Aurora Pavilion</span>
              </label>
              <label
                className={`flex items-center gap-space-xs p-space-sm rounded-lg cursor-pointer transition-colors border ${
                  fastCampus === 'West Wing Surgery'
                    ? 'bg-surface-container-lowest border-primary'
                    : 'bg-surface-container-low border-transparent'
                }`}
              >
                <input
                  type="radio"
                  name="campus"
                  checked={fastCampus === 'West Wing Surgery'}
                  onChange={() => setFastCampus('West Wing Surgery')}
                  className="accent-primary w-4 h-4"
                />
                <span className="font-body-sm text-body-sm text-on-surface">West Wing Surgery</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-space-xxs">
              Consultation Format
            </label>
            <div className="grid grid-cols-2 gap-space-xs">
              <button
                type="button"
                onClick={() => setFastFormat('IN_CLINIC')}
                className={`flex items-center justify-center gap-space-xs py-space-sm rounded-lg font-label-md text-label-md transition-all ${
                  fastFormat === 'IN_CLINIC'
                    ? 'bg-primary text-on-primary shadow-sm font-bold'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-sm">apartment</span>
                In-Clinic Suite
              </button>
              <button
                type="button"
                onClick={() => setFastFormat('TELEHEALTH')}
                className={`flex items-center justify-center gap-space-xs py-space-sm rounded-lg font-label-md text-label-md transition-all ${
                  fastFormat === 'TELEHEALTH'
                    ? 'bg-primary text-on-primary shadow-sm font-bold'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-sm">videocam</span>
                Telehealth HD
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-outline-variant/20 mt-4">
            <button
              className="px-space-md py-space-sm font-label-md text-label-md text-secondary hover:text-on-surface transition-colors"
              onClick={() => setIsFastTrackOpen(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="px-space-lg py-space-sm bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md rounded-lg shadow-md transition-all font-semibold"
              onClick={() => {
                setIsFastTrackOpen(false);
                navigate(`/book-appointment?doctorId=1&mode=${fastFormat}`);
              }}
              type="button"
            >
              Proceed to Schedule
            </button>
          </div>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        isOpen={!!rescheduleAppt}
        onClose={() => setRescheduleAppt(null)}
        subtitle="Schedule Adjustment"
        title="Reschedule Consultation"
      >
        <form onSubmit={handleRescheduleSubmit} className="space-y-4">
          <p className="text-body-sm text-secondary">
            Select a new date and time slot for your consultation with{' '}
            <strong className="text-on-surface">{rescheduleAppt?.doctorName}</strong>.
          </p>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-secondary uppercase">New Date</label>
            <input
              type="text"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              placeholder="e.g. Mon, Oct 21, 2024"
              className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-secondary uppercase">New Time Slot</label>
            <select
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none"
            >
              <option value="09:00 AM EDT">09:00 AM EDT</option>
              <option value="09:45 AM EDT">09:45 AM EDT</option>
              <option value="11:00 AM EDT">11:00 AM EDT</option>
              <option value="02:30 PM EDT">02:30 PM EDT</option>
              <option value="04:15 PM EDT">04:15 PM EDT</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={() => setRescheduleAppt(null)}
              className="px-4 py-2 text-xs font-semibold text-secondary hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-semibold shadow-md hover:bg-primary-container"
            >
              Confirm Reschedule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AppointmentsPage;

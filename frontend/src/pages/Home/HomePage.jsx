import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { hospitalService } from '../../services/hospitalService';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';
import { FALLBACK_DOCTORS } from '../../constants/doctorsData';
import { handleImageError } from '../../utils/imageUtils';

export const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [searchDepartment, setSearchDepartment] = useState('');
  const [searchDoctor, setSearchDoctor] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [doctors, setDoctors] = useState(FALLBACK_DOCTORS);
  const [hospitals, setHospitals] = useState([]);
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [docRes, hospRes] = await Promise.all([
          doctorService.getAllDoctors(),
          hospitalService.getAllHospitals(),
        ]);
        if (docRes?.success && docRes.data?.length > 0) setDoctors(docRes.data);
        if (hospRes?.success) setHospitals(hospRes.data || []);

        if (isAuthenticated) {
          try {
            const apptRes = await appointmentService.getMyAppointments();
            if (apptRes?.success && apptRes.data?.length > 0) {
              setUpcomingAppointment(apptRes.data[0]);
            }
          } catch {
            // Non-blocking if unauthenticated
          }
        }
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, [isAuthenticated]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchDoctor || searchDepartment || searchLocation;
    navigate(`/doctors?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Immersive Architectural Hero Section with Floating Search */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-background pt-space-xl pb-space-3xl">
        <div className="absolute -top-24 right-0 w-[42rem] h-[42rem] rounded-full bg-primary/5 blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute top-1/2 -left-20 w-[30rem] h-[30rem] rounded-full bg-tertiary-fixed-dim/10 blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center mb-space-2xl">
            {/* Hero Copy & Narrative */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant w-fit shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider">
                  Pioneering Editorial Healthcare Architecture
                </span>
              </div>
              <h1 className="font-headline-xl lg:font-display-lg text-headline-xl lg:text-display-lg text-on-surface tracking-tight leading-none text-balance">
                Exceptional Care, <br className="hidden sm:inline" />
                <span className="italic text-primary">Seamlessly</span> Scheduled
              </h1>
              <p className="font-body-xl text-body-xl text-secondary max-w-xl text-pretty">
                Connect with world-class specialists, explore premier hospital campuses, and manage your health appointments with uncompromising confidence and clinical discretion.
              </p>

              {/* Quick Metrics Ribbon */}
              <div className="grid grid-cols-3 gap-space-md pt-space-xs max-w-lg">
                <div className="flex flex-col">
                  <span className="font-headline-md text-headline-md text-primary font-bold">45+</span>
                  <span className="font-label-md text-label-md text-secondary">Accredited Centers</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-md text-headline-md text-primary font-bold">1,200+</span>
                  <span className="font-label-md text-label-md text-secondary">Renowned Doctors</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-md text-headline-md text-primary font-bold">99.4%</span>
                  <span className="font-label-md text-label-md text-secondary">Patient Satisfaction</span>
                </div>
              </div>
            </div>

            {/* Floating Live Patient Card & Campus Preview */}
            <div className="lg:col-span-5 flex flex-col gap-space-md relative">
              {/* Upcoming Visit Widget */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xl shadow-primary/5 transition-all hover:shadow-2xl hover:shadow-primary/10">
                <div className="flex items-center justify-between pb-space-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-xl">event_available</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                      Upcoming Consultation
                    </span>
                  </div>
                  <span className="px-space-xs py-space-xxs bg-primary-fixed/50 text-on-primary-fixed-variant rounded-full font-label-sm text-label-sm">
                    {upcomingAppointment ? upcomingAppointment.status : 'Confirmed'}
                  </span>
                </div>

                <div className="flex items-start gap-space-md pt-space-xs">
                  <img
                    alt={upcomingAppointment?.doctorName || 'Dr. Michael Collins'}
                    className="w-14 h-14 rounded-full object-cover shadow-sm"
                    src={upcomingAppointment?.doctorAvatarUrl || '/assets/doctor-collins.jpg'}
                    onError={(e) => handleImageError(e, '/assets/doctor-collins.jpg')}
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">
                      {upcomingAppointment?.doctorName || 'Dr. Michael Collins'}
                    </h2>
                    <p className="font-body-sm text-body-sm text-secondary truncate">
                      {upcomingAppointment?.doctorSpecialty || 'Senior Cardiologist · Pavilion Suite 4B'}
                    </p>
                    <div className="flex items-center gap-space-xs mt-space-xxs text-primary font-label-md text-label-md">
                      <span className="material-symbols-outlined text-base">schedule</span>
                      <span>
                        {upcomingAppointment?.appointmentDate || 'Mon, Oct 14'} · {upcomingAppointment?.timeSlot || '09:45 AM EDT'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-space-xs pt-space-md mt-space-sm">
                  <Link
                    to="/appointments"
                    className="py-space-xs px-space-sm rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-colors text-center"
                  >
                    Reschedule
                  </Link>
                  <Link
                    to={upcomingAppointment ? `/appointment-confirmed/${upcomingAppointment.id}` : '/appointments'}
                    className="py-space-xs px-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md shadow-sm transition-all text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {/* Direct Triage / Instant Care Banner */}
              <div className="bg-surface-container-high/70 backdrop-blur-md rounded-xl p-space-md flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <Link to="/emergency" className="cursor-pointer transition-transform hover:scale-105 inline-block">
                    <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl">emergency</span>
                    </div>
                  </Link>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      Immediate Emergency Intake
                    </span>
                    <span className="font-body-sm text-body-sm text-secondary">
                      Level 1 Trauma · Priority Dispatch
                    </span>
                  </div>
                </div>
                <Link
                  to="/emergency"
                  className="font-label-md text-label-md text-primary hover:underline font-bold flex items-center gap-space-xxs"
                >
                  Dispatch <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>

          {/* High-Contrast Floating Pill Search Engine Bar */}
          <div className="w-full bg-surface-container-lowest rounded-2xl shadow-xl shadow-primary/5 p-space-sm md:p-space-md transition-all">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center">
              {/* Field 1: Department */}
              <div className="md:col-span-4 flex items-center gap-space-sm px-space-md py-space-xs rounded-xl bg-surface-container-low/70 focus-within:bg-surface-container-lowest focus-within:shadow-md transition-all">
                <span className="material-symbols-outlined text-primary text-xl">local_hospital</span>
                <div className="flex flex-col flex-1">
                  <label className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                    Department or Hospital
                  </label>
                  <input
                    value={searchDepartment}
                    onChange={(e) => setSearchDepartment(e.target.value)}
                    className="bg-transparent text-on-surface font-label-lg text-label-lg placeholder:text-outline focus:outline-none w-full"
                    placeholder="e.g. Cardiology, Aurora Medical"
                    type="text"
                  />
                </div>
              </div>

              {/* Field 2: Doctor Name */}
              <div className="md:col-span-3 flex items-center gap-space-sm px-space-md py-space-xs rounded-xl bg-surface-container-low/70 focus-within:bg-surface-container-lowest focus-within:shadow-md transition-all">
                <span className="material-symbols-outlined text-primary text-xl">person_search</span>
                <div className="flex flex-col flex-1">
                  <label className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                    Physician Specialist
                  </label>
                  <input
                    value={searchDoctor}
                    onChange={(e) => setSearchDoctor(e.target.value)}
                    className="bg-transparent text-on-surface font-label-lg text-label-lg placeholder:text-outline focus:outline-none w-full"
                    placeholder="e.g. Dr. Collins"
                    type="text"
                  />
                </div>
              </div>

              {/* Field 3: Location / Region */}
              <div className="md:col-span-3 flex items-center gap-space-sm px-space-md py-space-xs rounded-xl bg-surface-container-low/70 focus-within:bg-surface-container-lowest focus-within:shadow-md transition-all">
                <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                <div className="flex flex-col flex-1">
                  <label className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                    Campus / City
                  </label>
                  <input
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="bg-transparent text-on-surface font-label-lg text-label-lg placeholder:text-outline focus:outline-none w-full"
                    placeholder="Metro Central"
                    type="text"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="md:col-span-2">
                <button
                  className="w-full h-14 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-xs shadow-md shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-lg">calendar_today</span>
                  <span>Search &amp; Book</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Popular Clinical Departments */}
      <section className="w-full py-space-3xl bg-surface">
        <div className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-desktop flex flex-col gap-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                Clinical Specialties
              </span>
              <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-space-xxs">
                Comprehensive Medical Departments
              </h2>
            </div>
            <p className="font-body-md text-body-md text-secondary max-w-md">
              World-recognized diagnostic units and surgical teams collaborating across multidisciplinary suites.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-md">
            {[
              { name: 'Cardiology', desc: 'Heart & Vascular Care', icon: 'cardiology', count: '28 Doctors' },
              { name: 'Neurology', desc: 'Brain & Nervous System', icon: 'neurology', count: '19 Doctors' },
              { name: 'Pediatrics', desc: 'Infant to Adolescent Care', icon: 'child_care', count: '24 Doctors' },
              { name: 'Orthopedics', desc: 'Musculoskeletal Health', icon: 'orthopedics', count: '22 Doctors' },
              { name: 'Oncology', desc: 'Targeted Therapy & Cure', icon: 'radiology', count: '17 Doctors' },
              { name: 'Dermatology', desc: 'Advanced Skin Wellness', icon: 'dermatology', count: '15 Doctors' },
            ].map((dept, idx) => (
              <Link
                key={idx}
                to={`/doctors?department=${encodeURIComponent(dept.name)}`}
                className="group flex flex-col items-center text-center p-space-lg rounded-2xl bg-surface-container-low hover:bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-fixed/50 group-hover:bg-primary group-hover:text-on-primary text-primary flex items-center justify-center mb-space-md transition-colors">
                  <span className="material-symbols-outlined text-3xl">{dept.icon}</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                  {dept.name}
                </h3>
                <p className="font-body-sm text-body-sm text-secondary mt-space-xxs">{dept.desc}</p>
                <span className="mt-space-sm font-label-sm text-label-sm text-primary font-semibold flex items-center gap-space-xxs group-hover:translate-x-0.5 transition-transform">
                  {dept.count} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hospital Campus Showcase (Aurora Medical Center) */}
      <section className="w-full py-space-3xl bg-surface-container-low">
        <div className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-desktop flex flex-col gap-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                Flagship Network Campus
              </span>
              <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-space-xxs">
                Aurora Medical Center &amp; Research Hub
              </h2>
            </div>
            <Link
              to="/hospitals"
              className="font-label-lg text-label-lg text-primary hover:text-primary-container font-semibold flex items-center gap-space-xs"
            >
              Explore All Hospitals <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden bg-surface-container-lowest shadow-xl">
            <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[480px]">
              <img
                className="w-full h-full object-cover"
                alt="Aurora Medical Center"
                src="/assets/aurora-hospital.jpg"
                onError={(e) => handleImageError(e, '/assets/aurora-hospital.jpg')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-space-lg left-space-lg right-space-lg flex flex-wrap items-center justify-between gap-space-sm text-on-primary">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary-fixed">verified</span>
                  <span className="font-label-md text-label-md">JCI International Gold Seal of Approval</span>
                </div>
                <div className="flex items-center gap-space-xs bg-surface-container-lowest/20 backdrop-blur-md px-space-sm py-space-xxs rounded-full">
                  <span className="material-symbols-outlined text-tertiary-fixed text-base">star</span>
                  <span className="font-label-md text-label-md font-bold">4.9 / 5.0</span>
                  <span className="text-xs opacity-80">(1,840 clinical reviews)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-space-xl flex flex-col justify-between bg-surface-container-lowest">
              <div className="flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <span className="px-space-sm py-space-xxs rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                    Tier-1 Academic Hospital
                  </span>
                  <div className="flex items-center gap-space-xxs text-primary font-label-sm text-label-sm">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span>Open 24 Hours</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-medium">
                    Aurora Campus &amp; Surgical Pavilions
                  </h3>
                  <p className="font-body-md text-body-md text-secondary mt-space-xs leading-relaxed">
                    Designed around biophilic principles to promote clinical healing. Houses 420 inpatient suites, 18 robotic surgical operating theaters, and 24/7 level 1 trauma suites.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
                  <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">420+</span>
                    <span className="font-label-sm text-label-sm text-secondary">Private Inpatient Suites</span>
                  </div>
                  <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">18</span>
                    <span className="font-label-sm text-label-sm text-secondary">Robotic OR Theaters</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-space-sm pt-space-lg border-t border-outline-variant/30 mt-space-md">
                <Link
                  to="/hospitals/1"
                  className="flex-1 py-space-sm px-space-md rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md text-center shadow-md transition-all font-semibold"
                >
                  View Facility Details
                </Link>
                <Link
                  to="/book-appointment?hospitalId=1"
                  className="py-space-sm px-space-md rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors"
                >
                  Book at Campus
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Specialists Section */}
      <section className="w-full py-space-3xl bg-surface">
        <div className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-desktop flex flex-col gap-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                Distinguished Clinicians
              </span>
              <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-space-xxs">
                Top Rated Specialist Faculty
              </h2>
            </div>
            <Link
              to="/doctors"
              className="font-label-lg text-label-lg text-primary hover:text-primary-container font-semibold flex items-center gap-space-xs"
            >
              Explore All Specialists <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-outline-variant/30"
              >
                <div className="flex flex-col gap-space-md">
                  <div className="relative">
                    <img
                      src={doctor.avatarUrl || '/assets/doctor-collins.jpg'}
                      alt={doctor.name}
                      className="w-full h-48 rounded-xl object-cover object-top"
                      onError={(e) => handleImageError(e, '/assets/doctor-collins.jpg')}
                    />
                    <div className="absolute top-2 right-2 bg-surface-container-lowest/90 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 text-label-sm text-on-surface shadow-sm">
                      <span className="material-symbols-outlined text-amber-500 text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="font-bold">{doctor.rating}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      {doctor.name}, <span className="text-secondary text-base font-normal">{doctor.title}</span>
                    </h3>
                    <p className="font-body-sm text-body-sm text-primary font-medium mt-0.5">
                      {doctor.specialty}
                    </p>
                    <p className="font-body-sm text-body-sm text-secondary mt-1">
                      {doctor.hospitalName || 'Aurora Medical Center'}
                    </p>
                  </div>
                </div>

                <div className="pt-space-md mt-space-sm border-t border-outline-variant/20 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-secondary block">Consultation</span>
                    <span className="font-label-md text-label-md font-bold text-on-surface">
                      ${doctor.consultationFee}
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <Link
                      to={`/doctors/${doctor.id}`}
                      className="p-space-xs rounded-lg text-secondary hover:text-primary hover:bg-surface-container-low transition-colors"
                      title="View Profile"
                    >
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </Link>
                    <Link
                      to={`/book-appointment?doctorId=${doctor.id}`}
                      className="px-space-md py-space-xs rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold transition-all shadow-sm"
                    >
                      Book Slot
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

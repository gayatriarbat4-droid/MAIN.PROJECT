import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { handleImageError } from '../../utils/imageUtils';

const FALLBACK_DOCTORS = [
  {
    id: 1,
    hospitalId: 1,
    hospitalName: 'Aurora Medical Center',
    departmentId: 1,
    departmentName: 'Cardiology & Vascular Center',
    name: 'Dr. Michael Collins',
    title: 'Chief of Interventional Cardiology',
    specialty: 'Cardiology',
    licenseNumber: 'MD-WA-78219',
    experienceYears: 18,
    languages: 'English, Spanish',
    rating: 4.95,
    reviewCount: 142,
    consultationFee: 250.00,
    roomSuite: 'Pavilion B, Suite 410',
    bio: 'Fellowship-trained at Johns Hopkins Medicine. Specializes in minimally invasive structural heart valve repairs, complex coronary angioplasty, and cardiac rehabilitation.',
    avatarUrl: '/assets/doctor-collins.jpg',
    availableThisWeek: true,
  },
  {
    id: 2,
    hospitalId: 1,
    hospitalName: 'Aurora Medical Center',
    departmentId: 2,
    departmentName: 'Comprehensive Neurology & Stroke Center',
    name: 'Dr. Sarah Wilson',
    title: 'Director of Neurovascular Therapeutics',
    specialty: 'Neurology',
    licenseNumber: 'MD-WA-65412',
    experienceYears: 14,
    languages: 'English, French',
    rating: 4.92,
    reviewCount: 98,
    consultationFee: 280.00,
    roomSuite: 'Tower A, Suite 305',
    bio: 'Dual-trained neurologist and clinical neuroscientist specializing in stroke recovery, acute migraine therapies, and movement disorders.',
    avatarUrl: '/assets/doctor-wilson.jpg',
    availableThisWeek: true,
  },
  {
    id: 3,
    hospitalId: 2,
    hospitalName: "St. Jude Children's & Research Pavilion",
    departmentId: 3,
    departmentName: 'Neonatal & Advanced Pediatrics',
    name: 'Dr. Elena Rostova',
    title: 'Pediatric Pulmonology Specialist',
    specialty: 'Pediatrics',
    licenseNumber: 'MD-WA-90123',
    experienceYears: 11,
    languages: 'English, Russian',
    rating: 4.97,
    reviewCount: 184,
    consultationFee: 210.00,
    roomSuite: "Children's Wing, Suite 102",
    bio: 'Specializing in pediatric respiratory illnesses, cystic fibrosis clinics, and early childhood developmental screenings.',
    avatarUrl: '/assets/doctor-rostova.jpg',
    availableThisWeek: true,
  },
  {
    id: 4,
    hospitalId: 1,
    hospitalName: 'Aurora Medical Center',
    departmentId: 4,
    departmentName: 'Orthopedics & Joint Replacement',
    name: 'Dr. Marcus Vance',
    title: 'Orthopedic Spine & Joint Reconstruction',
    specialty: 'Orthopedics',
    licenseNumber: 'MD-WA-43219',
    experienceYears: 16,
    languages: 'English',
    rating: 4.88,
    reviewCount: 115,
    consultationFee: 270.00,
    roomSuite: 'West Pavilion, Suite 520',
    bio: 'Board-certified orthopedic surgeon pioneer in muscle-sparing anterior hip replacement and endoscopic spinal disc decompressive surgeries.',
    avatarUrl: '/assets/doctor-vance.jpg',
    availableThisWeek: true,
  },
];

const SPECIALTY_OPTIONS = [
  { label: 'All Specialties', value: '' },
  { label: 'Cardiology', value: 'Cardiology' },
  { label: 'Neurology', value: 'Neurology' },
  { label: 'Pediatrics', value: 'Pediatrics' },
  { label: 'Orthopedics', value: 'Orthopedics' },
];

export const DoctorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInitial = searchParams.get('search') || '';
  const departmentInitial = searchParams.get('department') || '';

  const [allDoctors, setAllDoctors] = useState(FALLBACK_DOCTORS);
  const [searchTerm, setSearchTerm] = useState(searchInitial);
  const [selectedSpecialty, setSelectedSpecialty] = useState(departmentInitial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await doctorService.getAllDoctors();
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          setAllDoctors(res.data);
        }
      } catch (err) {
        console.warn('Using seeded fallback doctors list', err);
      }
    };

    fetchDoctors();
  }, []);

  // Update query params when filters change
  const handleSpecialtyChange = (spec) => {
    setSelectedSpecialty(spec);
    const newParams = new URLSearchParams(searchParams);
    if (spec) {
      newParams.set('department', spec);
    } else {
      newParams.delete('department');
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('');
    setSearchParams({});
  };

  // Filter doctors with robust fuzzy matching
  const filteredDoctors = useMemo(() => {
    return allDoctors.filter((doc) => {
      const term = (searchTerm || '').trim().toLowerCase();
      const spec = (selectedSpecialty || '').trim().toLowerCase();

      // Specialty match
      let matchesSpec = true;
      if (spec) {
        const docSpec = (doc.specialty || '').toLowerCase();
        const docDept = (doc.departmentName || '').toLowerCase();
        matchesSpec =
          docSpec.includes(spec) ||
          spec.includes(docSpec) ||
          docDept.includes(spec) ||
          (spec.includes('cardio') && docSpec.includes('cardio')) ||
          (spec.includes('neuro') && docSpec.includes('neuro')) ||
          (spec.includes('pediatr') && docSpec.includes('pediatr')) ||
          (spec.includes('ortho') && docSpec.includes('ortho'));
      }

      // Search term match
      let matchesSearch = true;
      if (term) {
        const docName = (doc.name || '').toLowerCase();
        const docTitle = (doc.title || '').toLowerCase();
        const docSpec = (doc.specialty || '').toLowerCase();
        const docHosp = (doc.hospitalName || '').toLowerCase();
        const docBio = (doc.bio || '').toLowerCase();

        matchesSearch =
          docName.includes(term) ||
          docTitle.includes(term) ||
          docSpec.includes(term) ||
          docHosp.includes(term) ||
          docBio.includes(term);
      }

      return matchesSpec && matchesSearch;
    });
  }, [allDoctors, searchTerm, selectedSpecialty]);

  return (
    <div className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-desktop py-space-xl space-y-space-xl">
      {/* Header & Controls */}
      <div className="flex flex-col gap-space-md">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div>
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant text-label-sm font-bold uppercase tracking-wider mb-space-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Specialist Directory
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
              Distinguished Faculty &amp; Specialists
            </h1>
            <p className="font-body-md text-secondary mt-1 max-w-2xl">
              Book in-person consultations or high-definition telehealth sessions with board-certified attending physicians.
            </p>
          </div>

          {/* Search Box & Specialty Select */}
          <div className="flex flex-col sm:flex-row items-center gap-space-sm w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search by physician name, condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-9 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-lg">
                search
              </span>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-secondary hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-base">cancel</span>
                </button>
              )}
            </div>

            <select
              value={selectedSpecialty}
              onChange={(e) => handleSpecialtyChange(e.target.value)}
              className="w-full sm:w-48 h-11 px-3 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-body-md text-on-surface focus:outline-none cursor-pointer shadow-sm"
            >
              {SPECIALTY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filter Specialty Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {SPECIALTY_OPTIONS.map((opt) => {
            const isActive = selectedSpecialty.toLowerCase() === opt.value.toLowerCase();
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSpecialtyChange(opt.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-secondary hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
          {(searchTerm || selectedSpecialty) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-1.5 text-xs text-primary hover:underline font-semibold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">restart_alt</span>
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Specialist Cards Grid */}
      {loading ? (
        <LoadingSpinner text="Searching specialists..." />
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mx-auto text-secondary">
            <span className="material-symbols-outlined text-3xl">person_search</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface">No specialists matched your filter</h3>
            <p className="text-secondary text-body-sm mt-1 max-w-md mx-auto">
              We couldn't find any physicians matching{' '}
              <span className="font-semibold text-on-surface">"{searchTerm || selectedSpecialty}"</span>.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold shadow-sm hover:bg-primary-container transition-all"
          >
            Show All Distinguished Specialists
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-outline-variant/30 flex flex-col justify-between group"
            >
              <div className="flex flex-col gap-space-sm">
                {/* Doctor Photo & Rating */}
                <div className="relative">
                  <img
                    src={doctor.avatarUrl || '/assets/doctor-collins.jpg'}
                    alt={doctor.name}
                    className="w-full h-52 rounded-xl object-cover object-top ring-1 ring-outline-variant/20 shadow-sm"
                    onError={(e) => handleImageError(e, '/assets/doctor-collins.jpg')}
                  />
                  <div className="absolute top-2 right-2 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-xs text-on-surface shadow-sm">
                    <span
                      className="material-symbols-outlined text-amber-500 text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="font-bold">{doctor.rating}</span>
                    <span className="text-secondary text-[11px]">({doctor.reviewCount})</span>
                  </div>

                  {doctor.availableThisWeek && (
                    <div className="absolute bottom-2 left-2 bg-primary/90 text-on-primary backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      Available This Week
                    </div>
                  )}
                </div>

                {/* Doctor Details */}
                <div>
                  <h3 className="font-headline-sm text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-xs text-secondary mt-0.5 line-clamp-1">{doctor.title}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-md bg-primary-fixed/40 text-on-primary-fixed-variant text-[11px] font-bold">
                      {doctor.specialty}
                    </span>
                    <span className="text-xs text-secondary">
                      {doctor.experienceYears}+ yrs exp
                    </span>
                  </div>

                  <p className="text-xs text-secondary mt-2 line-clamp-2 leading-relaxed">
                    {doctor.bio}
                  </p>
                </div>
              </div>

              {/* Footer & Actions */}
              <div className="pt-space-md mt-space-md border-t border-outline-variant/20">
                <div className="flex items-center justify-between text-xs text-secondary mb-3">
                  <span className="truncate max-w-[140px]">{doctor.roomSuite}</span>
                  <div className="text-right">
                    <span className="text-[10px] text-secondary block">Consultation</span>
                    <span className="font-bold text-on-surface text-sm">${doctor.consultationFee}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={`/doctors/${doctor.id}`}
                    className="py-2 text-center text-xs font-semibold rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    to={`/book-appointment?doctorId=${doctor.id}`}
                    className="py-2 text-center text-xs font-semibold rounded-xl bg-primary text-on-primary hover:bg-primary-container shadow-sm transition-all"
                  >
                    Book Slot
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;


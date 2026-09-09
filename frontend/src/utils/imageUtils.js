export const DEFAULT_DOCTOR_AVATAR = '/assets/doctor-collins.jpg';
export const DEFAULT_HOSPITAL_IMAGE = '/assets/aurora-hospital.jpg';
export const DEFAULT_PATIENT_AVATAR = '/assets/doctor-wilson.jpg';

export const handleImageError = (e, fallback = DEFAULT_DOCTOR_AVATAR) => {
  if (e && e.currentTarget) {
    e.currentTarget.onerror = null; // prevent infinite loops
    e.currentTarget.src = fallback;
  }
};

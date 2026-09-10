export const TOKEN_KEY = 'medicare_jwt_token';
export const USER_KEY = 'medicare_user_data';
// Determine API base URL dynamically based on environment
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl || !envUrl.trim()) {
    return '/api';
  }
  let cleanUrl = envUrl.trim().replace(/\/+$/, '');

  // If provided as a domain without protocol (e.g. from Render Blueprint property: host), prepend https://
  if (!cleanUrl.startsWith('/') && !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = `https://${cleanUrl}`;
  }

  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

export const API_BASE_URL = getApiBaseUrl();

export const APPOINTMENT_STATUS = {
  CONFIRMED: 'CONFIRMED',
  RESCHEDULED: 'RESCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const CONSULTATION_TYPES = {
  IN_CLINIC: 'IN_CLINIC',
  TELEHEALTH: 'TELEHEALTH',
};

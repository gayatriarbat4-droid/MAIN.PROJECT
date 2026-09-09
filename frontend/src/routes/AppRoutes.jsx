import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import HomePage from '../pages/Home/HomePage';
import HospitalsPage from '../pages/Hospitals/HospitalsPage';
import DoctorsPage from '../pages/Doctors/DoctorsPage';
import DoctorProfilePage from '../pages/Doctors/DoctorProfilePage';
import BookAppointmentPage from '../pages/Appointments/BookAppointmentPage';
import AppointmentConfirmedPage from '../pages/Appointments/AppointmentConfirmedPage';
import AppointmentsPage from '../pages/Appointments/AppointmentsPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import EmergencyPage from '../pages/Emergency/EmergencyPage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import VerifyEmailPage from '../pages/Auth/VerifyEmailPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/hospitals" element={<HospitalsPage />} />
        <Route path="/hospitals/:id" element={<HospitalsPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/doctors/:id" element={<DoctorProfilePage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected Patient Routes */}
        <Route
          path="/book-appointment"
          element={
            <ProtectedRoute>
              <BookAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointment-confirmed/:id"
          element={
            <ProtectedRoute>
              <AppointmentConfirmedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <AppointmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

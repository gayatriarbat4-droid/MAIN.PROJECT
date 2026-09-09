import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { handleImageError } from '../../utils/imageUtils';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const navClass = ({ isActive }) =>
    isActive
      ? 'px-space-md py-space-xs transition-colors bg-surface-container-high text-primary font-semibold rounded-lg'
      : 'px-space-md py-space-xs font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-desktop flex items-center justify-between gap-space-lg">
        {/* Brand Logo & Nav Links */}
        <div className="flex items-center gap-space-xl">
          <Link to="/" className="flex items-center gap-space-sm group">
            <img
              alt="MediCare Logo"
              className="h-8 w-auto object-contain"
              src="/assets/logo.svg"
              onError={(e) => {
                // Fallback to remote if local fails
                e.target.src = 'https://lh3.googleusercontent.com/aida/AEtjO1XKocFiHy3FKkDgptVRrMWJZyGPu0AhN7hHvl0Q2v7p7kB0mfpnXR6MCvE0Y8SvodWfnp34uecwImwy2gX5p6JDbII43lPRUdLP6n9UUyc6bfv-w_3jwezfVrTQQtqjpJH3OADgMRG1zXgBoxLop8RQhsI_f9miCg8_JcQJdkmp9jAwjxlA9CMQKxIZSPWcflnOwZ6TqelELrlmHOkAH8CWQk6l6V7nlcZDvX7D7vj2gVB26odZfky7Iw';
              }}
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight leading-none group-hover:text-primary-container transition-colors">
                MediCare
              </span>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mt-space-xxs">
                Healthcare System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-space-xs p-space-xxs bg-surface-container-lowest/60 rounded-xl">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/hospitals" className={navClass}>
              Hospitals
            </NavLink>
            <NavLink to="/doctors" className={navClass}>
              Doctors
            </NavLink>
            <NavLink to="/appointments" className={navClass}>
              Appointments
            </NavLink>
            <NavLink to="/emergency" className={navClass}>
              Emergency
            </NavLink>
            <NavLink to="/profile" className={navClass}>
              Profile
            </NavLink>
          </nav>
        </div>

        {/* Right CTA / Helpline & User Profile */}
        <div className="flex items-center gap-space-md">
          <Link
            to="/emergency"
            className="cursor-pointer transition-transform hover:scale-105 inline-block"
          >
            <div className="hidden xl:flex items-center gap-space-xs px-space-md py-space-xs bg-error-container text-on-error-container rounded-full shadow-[0_1px_3px_rgba(7,59,58,0.04)]">
              <span className="material-symbols-outlined text-base animate-pulse">
                e911_emergency
              </span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
                24/7 Helpline:
              </span>
              <span className="font-label-md text-label-md font-bold">1-800-MEDICARE</span>
            </div>
          </Link>

          <div className="flex items-center gap-space-xs">
            <button
              aria-label="Notifications"
              className="relative p-space-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-full transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></span>
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <div
                  className="flex items-center gap-space-xs pl-space-xs cursor-pointer group"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="relative">
                    <img
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary transition-all"
                      src={user?.avatarUrl || '/assets/doctor-wilson.jpg'}
                      onError={(e) => handleImageError(e, '/assets/doctor-wilson.jpg')}
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-surface"></span>
                  </div>
                  <span className="hidden md:inline font-label-md text-label-md font-semibold text-on-surface">
                    {user?.fullName || user?.username}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface transition-colors text-lg">
                    expand_more
                  </span>
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-2 z-50">
                    <div className="px-4 py-2 border-b border-outline-variant/20">
                      <p className="font-label-md text-on-surface font-semibold truncate">
                        {user?.fullName || user?.username}
                      </p>
                      <p className="font-body-sm text-secondary truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 font-label-md text-on-surface hover:bg-surface-container-low transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-primary">person</span>
                      Medical Profile
                    </Link>
                    <Link
                      to="/appointments"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 font-label-md text-on-surface hover:bg-surface-container-low transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-primary">event_available</span>
                      My Consultations
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 font-label-md text-error hover:bg-error-container/30 transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-base">logout</span>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-space-xs">
                <Link
                  to="/login"
                  className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-primary hover:bg-surface-container-high transition-colors font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-space-md py-space-xs rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:bg-primary-container shadow-sm transition-all font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

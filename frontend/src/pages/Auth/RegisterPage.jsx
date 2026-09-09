import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Post-registration verification step
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resendMsg, setResendMsg] = useState('');

  const { register, verifyEmail, resendVerification } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const cleanData = {
      username: (formData.username || '').trim(),
      email: (formData.email || '').trim(),
      fullName: (formData.fullName || '').trim(),
      phone: (formData.phone || '').trim(),
      password: (formData.password || '').trim(),
    };

    try {
      const res = await register(cleanData);
      if (res?.success) {
        if (res?.data?.requiresVerification) {
          setRegisteredEmail(cleanData.email);
        } else {
          navigate('/');
        }
      } else {
        setErrorMsg(res?.message || 'Registration failed');
      }
    } catch (err) {
      if (!err.response) {
        setErrorMsg('Unable to connect to backend server (port 8081). Please verify Spring Boot is running.');
      } else {
        const serverMsg = err.response?.data?.message || err.response?.data?.error;
        let fieldErrors = '';
        if (err.response?.data?.data && typeof err.response.data.data === 'object') {
          fieldErrors = Object.entries(err.response.data.data)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(' | ');
        }
        setErrorMsg(fieldErrors || serverMsg || 'Registration failed. Please verify your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setOtpLoading(true);
    setOtpError('');
    try {
      const res = await verifyEmail({ otp: otp.trim(), email: registeredEmail });
      if (res?.success) {
        navigate('/');
      } else {
        setOtpError(res?.message || 'Invalid or expired 6-digit code');
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Verification failed. Please check the code.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMsg('');
    try {
      await resendVerification(registeredEmail);
      setResendMsg('A fresh verification code has been dispatched.');
    } catch (err) {
      setResendMsg(err.response?.data?.message || 'Could not resend verification code.');
    }
  };

  // If user registered, show the Verification Pending screen with OTP input
  if (registeredEmail) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center py-12 px-margin-mobile">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-xl border border-outline-variant/30 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">mark_email_read</span>
            </div>
            <h1 className="font-headline-xl text-2xl font-bold text-on-surface">
              Check Your Inbox
            </h1>
            <p className="font-body-sm text-secondary">
              We sent an activation link and 6-digit security code to:
            </p>
            <p className="font-mono text-sm font-semibold text-primary bg-primary/5 py-1 px-3 rounded-lg inline-block">
              {registeredEmail}
            </p>
          </div>

          {otpError && (
            <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              <span>{otpError}</span>
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider text-center block">
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full h-14 text-center tracking-[0.4em] font-mono text-2xl font-bold rounded-xl bg-surface-container-low border border-outline-variant/30 text-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
              <p className="text-[11px] text-secondary text-center">
                Check your email inbox or backend console log for your code
              </p>
            </div>

            <button
              type="submit"
              disabled={otpLoading || otp.length < 6}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold shadow-md hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {otpLoading ? <span>Verifying...</span> : (
                <>
                  <span>Activate Account</span>
                  <span className="material-symbols-outlined text-lg">verified</span>
                </>
              )}
            </button>
          </form>

          <div className="p-3.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/20 space-y-2 text-center">
            <p className="text-xs text-secondary">Didn't receive an email?</p>
            <button
              type="button"
              onClick={handleResend}
              className="text-xs font-bold text-primary hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Resend Verification Code
            </button>
            {resendMsg && (
              <p className="text-xs text-primary font-medium">{resendMsg}</p>
            )}
          </div>

          <div className="text-center pt-2 border-t border-outline-variant/20 text-xs text-secondary">
            Already verified?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-margin-mobile">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-xl border border-outline-variant/30 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Patient Onboarding
          </div>
          <h1 className="font-headline-xl text-3xl text-on-surface font-semibold tracking-tight">
            Create HealthPass™ Account
          </h1>
          <p className="font-body-sm text-secondary">
            Join the MediCare Sanctuary network for instant online reservations and medical history vaulting.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider">Full Legal Name *</label>
            <input
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Johnathan Vance"
              className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider">Username *</label>
            <input
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. jvance"
              className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider">Email Address *</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@domain.com"
              className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider">Mobile Number</label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider">Password (min. 6 chars) *</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full h-11 pl-3 pr-10 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-secondary hover:text-on-surface transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined text-lg">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-bold shadow-md hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-outline-variant/20 text-xs text-secondary">
          Already registered with MediCare?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

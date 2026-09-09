import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
  const [username, setUsername] = useState('johnathan_vance');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendStatus, setResendStatus] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const { login, resendVerification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const redirectPath = query.get('redirect') || '/';
  const sessionExpired = query.get('expired') === 'true';

  const isUnverified = errorMsg && errorMsg.toLowerCase().includes('not verified');

  const setDemoAccount = (u, p) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg('');
    setResendStatus('');
  };

  const handleResend = async () => {
    const cleanUsername = (username || '').trim();
    if (!cleanUsername) return;
    setResendLoading(true);
    setResendStatus('');
    try {
      await resendVerification(cleanUsername);
      setResendStatus('A fresh verification code and link have been dispatched.');
    } catch (err) {
      setResendStatus(err.response?.data?.message || 'Could not resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setResendStatus('');

    const cleanUsername = (username || '').trim();
    const cleanPassword = (password || '').trim();

    try {
      const res = await login(cleanUsername, cleanPassword);
      if (res?.success) {
        navigate(redirectPath, { replace: true });
      } else {
        setErrorMsg(res?.message || 'Invalid username or password');
      }
    } catch (err) {
      if (!err.response) {
        setErrorMsg('Unable to connect to the backend server (port 8081). Please ensure Spring Boot is running.');
      } else {
        setErrorMsg(
          err.response?.data?.message ||
            'Authentication failed. Please verify your credentials or click a demo account below.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-margin-mobile">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-xl border border-outline-variant/30 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Patient &amp; Staff Portal
          </div>
          <h1 className="font-headline-xl text-3xl text-on-surface font-semibold tracking-tight">
            Sign In to MediCare
          </h1>
          <p className="font-body-sm text-secondary">
            Access encrypted medical records, consultation schedules, and telehealth visits.
          </p>
        </div>

        {sessionExpired && (
          <div className="p-3 rounded-xl bg-amber-100 text-amber-900 text-xs font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-base">info</span>
            <span>Your session has expired. Please sign in again.</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-error-container text-on-error-container text-xs font-medium space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              <span>{errorMsg}</span>
            </div>
            {isUnverified && (
              <div className="pt-2 border-t border-on-error-container/20 flex flex-col gap-2">
                <div className="flex gap-2">
                  <Link
                    to={`/verify-email?email=${encodeURIComponent(username)}`}
                    className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-center hover:opacity-90 transition-opacity"
                  >
                    Enter 6-Digit Code
                  </Link>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-bold border border-outline-variant/30 hover:bg-surface-container-low transition-colors disabled:opacity-50"
                  >
                    {resendLoading ? 'Sending...' : 'Resend Code'}
                  </button>
                </div>
                {resendStatus && (
                  <p className="text-[11px] text-primary font-semibold">{resendStatus}</p>
                )}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider" htmlFor="username">
              Username or Email
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. johnathan_vance"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              <span className="material-symbols-outlined absolute left-3 top-3 text-secondary text-lg">
                person
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <a href="#" className="text-xs text-primary font-semibold hover:underline">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 pl-10 pr-10 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              <span className="material-symbols-outlined absolute left-3 top-3 text-secondary text-lg">
                lock
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-secondary hover:text-on-surface"
                tabIndex={-1}
              >
                <span className="material-symbols-outlined text-lg">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Demo Credentials Autofill */}
          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-2">
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
              Quick 1-Click Demo Accounts:
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => setDemoAccount('narkhade', 'Password123!')}
                className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                  username === 'narkhade'
                    ? 'bg-primary text-on-primary border-primary shadow-xs'
                    : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:bg-surface-container-high'
                }`}
              >
                👤 Mansi
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('johnathan_vance', 'Password123!')}
                className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                  username === 'johnathan_vance'
                    ? 'bg-primary text-on-primary border-primary shadow-xs'
                    : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:bg-surface-container-high'
                }`}
              >
                👤 Vance
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('dr_collins', 'Password123!')}
                className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                  username === 'dr_collins'
                    ? 'bg-primary text-on-primary border-primary shadow-xs'
                    : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:bg-surface-container-high'
                }`}
              >
                🩺 Doctor
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('admin_sarah', 'Password123!')}
                className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                  username === 'admin_sarah'
                    ? 'bg-primary text-on-primary border-primary shadow-xs'
                    : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:bg-surface-container-high'
                }`}
              >
                🛡️ Admin
              </button>
            </div>
            <div className="text-[11px] text-secondary text-center pt-0.5">
              Username: <code className="font-mono text-primary font-bold">{username}</code> · Password: <code className="font-mono text-primary font-bold">Password123!</code>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-bold shadow-md hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-outline-variant/20 text-xs text-secondary">
          Don't have a patient account yet?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Register for Care
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

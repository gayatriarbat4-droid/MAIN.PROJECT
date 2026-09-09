import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token');
  const emailFromUrl = searchParams.get('email') || '';

  const { verifyEmail, resendVerification } = useAuth();
  const navigate = useNavigate();

  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState(emailFromUrl);
  const [status, setStatus] = useState('idle'); // 'idle' | 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const [resendStatus, setResendStatus] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  // Auto-verify if ?token=... is present in URL
  useEffect(() => {
    if (tokenFromUrl) {
      handleAutoVerify(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const handleAutoVerify = async (token) => {
    setStatus('verifying');
    setMessage('Verifying your email token with MediCare security services...');
    try {
      const res = await verifyEmail({ token });
      if (res?.success) {
        setStatus('success');
        setMessage('Your email has been verified successfully! Your HealthPass™ is now active.');
      } else {
        setStatus('error');
        setMessage(res?.message || 'Verification token is invalid or has expired.');
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Verification token is invalid or has expired. Please enter your 6-digit code or request a new link.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setStatus('verifying');
    setMessage('Validating your 6-digit verification code...');

    try {
      const res = await verifyEmail({ otp: otp.trim(), email: email.trim() || undefined });
      if (res?.success) {
        setStatus('success');
        setMessage('Your email has been verified successfully! Your HealthPass™ is now active.');
      } else {
        setStatus('error');
        setMessage(res?.message || 'Invalid or expired 6-digit code.');
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Invalid or expired code. Please verify the code or request a new one.');
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setResendStatus('Please provide your email address or username to resend.');
      return;
    }

    setResendLoading(true);
    setResendStatus('');
    try {
      const res = await resendVerification(email.trim());
      setResendStatus('A fresh verification code and link have been dispatched to your email.');
    } catch (err) {
      setResendStatus(err.response?.data?.message || 'Failed to resend verification. Please check the email address.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-margin-mobile">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-xl border border-outline-variant/30 space-y-6">
        
        {/* Header Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Identity Verification
          </div>
          <h1 className="font-headline-xl text-3xl text-on-surface font-semibold tracking-tight">
            Verify Email Address
          </h1>
          <p className="font-body-sm text-secondary">
            Confirm your identity to activate your MediCare HealthPass™ patient portal and confidential health records.
          </p>
        </div>

        {/* Verifying State Spinner */}
        {status === 'verifying' && (
          <div className="py-8 text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="font-body-sm text-secondary">{message}</p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="py-6 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <div className="space-y-2">
              <h2 className="font-headline-sm text-xl font-bold text-on-surface">Verification Complete!</h2>
              <p className="font-body-sm text-secondary">{message}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Go to Health Sanctuary</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        )}

        {/* Error or Idle State: Show Manual OTP Input Form */}
        {status !== 'success' && status !== 'verifying' && (
          <div className="space-y-6">
            {status === 'error' && (
              <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-base shrink-0">error</span>
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider">
                  6-Digit Security Code
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
                  Enter the 6-digit OTP from your verification email or console log
                </p>
              </div>

              {!tokenFromUrl && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider">
                    Email / Username (Optional)
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com or username"
                    className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={otp.length < 6}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold shadow-md hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Verify Code</span>
                <span className="material-symbols-outlined text-lg">verified</span>
              </button>
            </form>

            {/* Resend Section */}
            <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-outline-variant/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface">Didn't receive a code?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer disabled:opacity-50 flex items-center gap-1"
                >
                  {resendLoading ? 'Sending...' : 'Resend Email'}
                  <span className="material-symbols-outlined text-sm">refresh</span>
                </button>
              </div>

              {resendStatus && (
                <p className={`text-xs ${resendStatus.includes('fresh') ? 'text-primary' : 'text-error'}`}>
                  {resendStatus}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="text-center pt-2 border-t border-outline-variant/20 text-xs text-secondary">
          Ready to log in?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Sign In with HealthPass™
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

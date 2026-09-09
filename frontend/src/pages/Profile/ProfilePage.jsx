import React, { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import ToastNotification from '../../components/common/ToastNotification';
import { handleImageError } from '../../utils/imageUtils';

export const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    height: '',
    weight: '',
    address: '',
    allergies: '',
    chronicConditions: '',
  });

  const [toast, setToast] = useState({ show: false, title: '', message: '' });

  const fetchProfileData = async () => {
    try {
      const [profRes, recRes] = await Promise.all([
        patientService.getMyProfile(),
        patientService.getMyRecords(),
      ]);

      if (profRes?.success) {
        setProfile(profRes.data);
        setEditForm({
          fullName: profRes.data.fullName || '',
          phone: profRes.data.phone || '',
          dateOfBirth: profRes.data.dateOfBirth || '11/18/1981',
          gender: profRes.data.gender || 'Male (He/Him)',
          bloodGroup: profRes.data.bloodGroup || 'O+ Rh Positive',
          height: profRes.data.height || "6'1\" (185 cm)",
          weight: profRes.data.weight || '178 lbs (23.5 BMI)',
          address: profRes.data.address || '742 Evergreen Terrace, Pavilion B, San Francisco, CA',
          allergies: profRes.data.allergies || 'Penicillin Allergy (High Risk Anaphylaxis Alert)',
          chronicConditions: profRes.data.chronicConditions || 'Mild Hypertension, Seasonal Rhinitis',
        });
      }
      if (recRes?.success) setRecords(recRes.data || []);
    } catch (err) {
      console.error('Failed to load profile data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await patientService.updateProfile(editForm);
      if (res?.success) {
        setProfile(res.data);
        setIsEditOpen(false);
        setToast({
          show: true,
          title: 'Demographics Updated',
          message: 'Your health profile has been synchronized with the master index.',
        });
      }
    } catch (err) {
      console.error('Update profile error', err);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Accessing verified patient registry..." />;
  }

  const p = profile || {
    fullName: 'Johnathan Vance',
    phone: '+1 (555) 234-8901',
    email: 'j.vance@vancetech.io',
    address: 'San Francisco, CA',
    dateOfBirth: '11/18/1981',
    gender: 'Male (He/Him)',
    bloodGroup: 'O+ Rh Positive',
    height: "6'1\" (185 cm)",
    weight: '178 lbs (23.5 BMI)',
    allergies: 'Penicillin (High Risk Anaphylaxis Alert)',
    chronicConditions: 'Mild Hypertension',
  };

  return (
    <div className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-desktop py-space-xl">
      <ToastNotification
        show={toast.show}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast({ show: false, title: '', message: '' })}
      />

      {/* Main Profile Header Card */}
      <section className="relative w-full rounded-2xl bg-surface-container-lowest shadow-md overflow-hidden p-space-lg md:p-space-2xl mb-space-xl border border-outline-variant/30">
        <div className="absolute -right-16 -bottom-16 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/4 -top-20 w-72 h-72 bg-secondary-fixed/30 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-lg">
            <div className="relative shrink-0">
              <img
                className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover shadow-sm ring-2 ring-primary/20"
                alt={p.fullName}
                src={p.avatarUrl || '/assets/doctor-wilson.jpg'}
                onError={(e) => handleImageError(e, '/assets/doctor-wilson.jpg')}
              />
              <div className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-primary text-on-primary px-2 py-0.5 rounded-full shadow-md">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">Verified</span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs flex-wrap">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                  Patient Registry • Medical ID #MC-77409-JV
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                  Tier 1 Active Care
                </span>
              </div>

              <h1 className="font-headline-xl text-headline-xl text-on-surface mt-1 mb-2">
                {p.fullName}
              </h1>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-space-md text-secondary font-body-sm text-body-sm">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">call</span>
                  {p.phone}
                </span>
                <span className="text-outline-variant">•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">mail</span>
                  {p.email}
                </span>
                <span className="text-outline-variant">•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  {p.address}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-space-sm w-full sm:w-auto self-stretch sm:self-auto">
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-colors font-label-md text-label-md"
              type="button"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              <span>Export Summary</span>
            </button>
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all shadow-md hover:shadow-lg font-label-md text-label-md font-semibold cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-lg">manage_accounts</span>
              <span>Edit Demographics</span>
            </button>
          </div>
        </div>

        {/* Vital Metrics Bento Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-space-sm mt-space-xl pt-space-lg bg-surface-container-low/70 rounded-xl p-space-md">
          <div className="flex flex-col gap-0.5 px-space-sm py-space-xs rounded-lg bg-surface-container-lowest shadow-sm">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Age</span>
            <span className="font-headline-sm text-headline-sm text-on-surface">
              42 <span className="font-body-sm text-body-sm text-secondary font-normal">yrs</span>
            </span>
          </div>
          <div className="flex flex-col gap-0.5 px-space-sm py-space-xs rounded-lg bg-surface-container-lowest shadow-sm">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Gender Identity</span>
            <span className="font-headline-sm text-headline-sm text-on-surface">
              {p.gender?.split(' ')[0] || 'Male'}{' '}
              <span className="font-body-sm text-body-sm text-secondary font-normal">(He/Him)</span>
            </span>
          </div>
          <div className="flex flex-col gap-0.5 px-space-sm py-space-xs rounded-lg bg-surface-container-lowest shadow-sm">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Blood Group</span>
            <span className="font-headline-sm text-headline-sm text-primary font-bold">
              {p.bloodGroup || 'O+ Rh Positive'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 px-space-sm py-space-xs rounded-lg bg-surface-container-lowest shadow-sm">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Height</span>
            <span className="font-headline-sm text-headline-sm text-on-surface">
              {p.height || "6'1\" (185 cm)"}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-0.5 px-space-sm py-space-xs rounded-lg bg-surface-container-lowest shadow-sm">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Weight / BMI</span>
            <span className="font-headline-sm text-headline-sm text-on-surface">
              {p.weight || '178 lbs (23.5 BMI)'}
            </span>
          </div>
        </div>
      </section>

      {/* Two Column Layout: Clinical Alerts & Records */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
        <div className="lg:col-span-8 flex flex-col gap-space-xl">
          {/* Current Conditions & Clinical Allergies */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm border border-outline-variant/30 relative overflow-hidden">
            <div className="flex items-center justify-between pb-space-md">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-2xl">vital_signs</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Current Conditions &amp; Clinical Allergies
                </h2>
              </div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Active Records
              </span>
            </div>

            <p className="font-body-sm text-body-sm text-secondary mb-space-lg">
              Critical flags automatically cross-referenced against electronic medication ordering and emergency triage protocols.
            </p>

            <div className="flex flex-wrap gap-space-sm mb-space-lg">
              <div className="flex items-center gap-space-sm px-space-md py-space-xs rounded-xl bg-error-container text-on-error-container shadow-sm">
                <span className="material-symbols-outlined text-xl animate-pulse">warning</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md font-bold">Penicillin Allergy</span>
                  <span className="font-label-sm text-label-sm">High Risk • Anaphylaxis Alert</span>
                </div>
              </div>

              <div className="flex items-center gap-space-sm px-space-md py-space-xs rounded-xl bg-surface-container-high text-on-surface">
                <span className="material-symbols-outlined text-secondary text-xl">favorite</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md font-bold">Mild Hypertension</span>
                  <span className="font-label-sm text-label-sm text-secondary">Managed • Low-Sodium Diet</span>
                </div>
              </div>

              <div className="flex items-center gap-space-sm px-space-md py-space-xs rounded-xl bg-surface-container-high text-on-surface">
                <span className="material-symbols-outlined text-secondary text-xl">air</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md font-bold">Seasonal Rhinitis</span>
                  <span className="font-label-sm text-label-sm text-secondary">Mild • Intermittent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Records & Lab Reports */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm border border-outline-variant/30 space-y-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                  Diagnostic Vault
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface mt-1">
                  Lab Test Reports &amp; Diagnostic Records
                </h2>
              </div>
              <span className="text-xs text-secondary">{records.length} Documents</span>
            </div>

            <div className="space-y-space-sm">
              {records.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center justify-between p-space-md bg-surface-container-low rounded-xl border border-outline-variant/20 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-space-md">
                    <span className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                      <span className="material-symbols-outlined text-xl">
                        {rec.recordType === 'LAB_REPORT'
                          ? 'biotech'
                          : rec.recordType === 'IMAGING'
                          ? 'radiology'
                          : 'description'}
                      </span>
                    </span>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                        {rec.title}
                      </span>
                      <span className="font-body-sm text-body-sm text-secondary">
                        {rec.recordDate} • {rec.fileSize} • {rec.notes}
                      </span>
                    </div>
                  </div>

                  <a
                    href={rec.fileUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg text-primary hover:bg-surface-container-lowest transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <span className="material-symbols-outlined text-lg">download</span>
                    <span>Download</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Insurance & Primary Contact Card */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm border border-outline-variant/30 space-y-space-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Insurance Card
            </h3>
            <div className="p-space-lg rounded-xl bg-gradient-to-tr from-primary via-primary-container to-secondary text-on-primary shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-on-primary-container font-bold">
                  HealthPass™ Card
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">Active</span>
              </div>
              <div>
                <p className="text-xs opacity-80 uppercase">Insured Patient</p>
                <p className="font-headline-sm text-lg font-bold">{p.fullName}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/20">
                <div>
                  <span className="opacity-80 block">Member ID:</span>
                  <span className="font-mono font-bold">BCBS-8894102-01</span>
                </div>
                <div>
                  <span className="opacity-80 block">Plan:</span>
                  <span className="font-bold">PPO Platinum Care</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Demographics Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        subtitle="Patient Demographics"
        title="Edit Health Profile"
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-secondary uppercase">Full Legal Name</label>
            <input
              type="text"
              required
              value={editForm.fullName}
              onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
              className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-secondary uppercase">Phone</label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-secondary uppercase">Blood Group</label>
              <input
                type="text"
                value={editForm.bloodGroup}
                onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-secondary uppercase">Height</label>
              <input
                type="text"
                value={editForm.height}
                onChange={(e) => setEditForm({ ...editForm, height: e.target.value })}
                className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-secondary uppercase">Weight</label>
              <input
                type="text"
                value={editForm.weight}
                onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-secondary uppercase">Residential Address</label>
            <input
              type="text"
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-secondary uppercase">Documented Allergies</label>
            <input
              type="text"
              value={editForm.allergies}
              onChange={(e) => setEditForm({ ...editForm, allergies: e.target.value })}
              className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-secondary hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-semibold shadow-md hover:bg-primary-container"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;

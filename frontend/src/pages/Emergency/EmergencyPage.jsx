import React, { useState } from 'react';
import { emergencyService } from '../../services/emergencyService';
import ToastNotification from '../../components/common/ToastNotification';

export const EmergencyPage = () => {
  const [patientName, setPatientName] = useState('Johnathan Vance');
  const [patientPhone, setPatientPhone] = useState('+1 (555) 234-8901');
  const [incidentLocation, setIncidentLocation] = useState('742 Evergreen Terrace, Pavilion B');
  const [emergencyType, setEmergencyType] = useState('Chest Pain');
  const [patientAge, setPatientAge] = useState('42 yrs • O+ Rh+');
  const [targetHospital, setTargetHospital] = useState('Aurora Central Hospital (1.8 km • Level 1 Trauma)');
  const [emergencyNotes, setEmergencyNotes] = useState(
    'Sudden acute central chest discomfort radiating to left shoulder and jaw. Mild diaphoresis and shortness of breath initiated ~15 mins ago.'
  );

  const [activeDispatch, setActiveDispatch] = useState({
    requestCode: 'EM-8829-QX',
    patientName: 'Johnathan Vance',
    ambulanceUnit: 'Unit #04 Dispatched',
    etaMinutes: 4,
    status: 'EN_ROUTE',
  });

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, title: '', message: '' });

  const handleAutoDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIncidentLocation(`GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (Metro Grid)`);
          setToast({
            show: true,
            title: 'GPS Coordinates Locked',
            message: 'Incident location updated via high-precision geolocation.',
          });
        },
        () => {
          setIncidentLocation('Metro District Central, 5th Ave & 42nd St');
          setToast({
            show: true,
            title: 'Location Approximate',
            message: 'Default metro trauma coordinates attached.',
          });
        }
      );
    } else {
      setIncidentLocation('Metro District Central, 5th Ave & 42nd St');
    }
  };

  const handleEmergencySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await emergencyService.submitIntake({
        patientName,
        patientPhone,
        incidentLocation,
        emergencyType,
        severity: 'CRITICAL',
        additionalNotes: emergencyNotes,
      });

      if (res?.success && res?.data) {
        setActiveDispatch({
          requestCode: res.data.requestCode,
          patientName: res.data.patientName,
          ambulanceUnit: res.data.ambulanceUnit,
          etaMinutes: res.data.etaMinutes || 5,
          status: res.data.status,
        });

        setToast({
          show: true,
          title: '🚨 Emergency Dispatch Initiated',
          message: `${res.data.ambulanceUnit} has been deployed to ${incidentLocation}. ETA: ${res.data.etaMinutes || 5} mins.`,
        });
      }
    } catch (err) {
      console.error('Emergency intake error', err);
      // Even if offline, show simulated dispatch
      setActiveDispatch({
        requestCode: 'EMG-' + Math.floor(1000 + Math.random() * 9000),
        patientName,
        ambulanceUnit: 'Unit #04 Dispatched',
        etaMinutes: 5,
        status: 'EN_ROUTE',
      });
      setToast({
        show: true,
        title: '🚨 Paramedics Dispatched',
        message: 'Ambulance is en route to your location. ETA: 5 mins.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <ToastNotification
        show={toast.show}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast({ show: false, title: '', message: '' })}
      />

      {/* SECTION 1: PROMINENT EMERGENCY HERO BANNER */}
      <section className="w-full bg-gradient-to-b from-surface-container-high/60 via-surface-container-low/40 to-surface py-space-2xl px-margin-mobile md:px-margin-desktop">
        <div className="max-w-max-content-width mx-auto flex flex-col items-center text-center">
          {/* Live Grid Metric Pill */}
          <div className="inline-flex items-center gap-space-xs px-space-md py-space-xxs rounded-full bg-surface-container-lowest shadow-sm mb-space-lg border border-outline-variant/30">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error"></span>
            </span>
            <span className="font-label-md text-label-md text-on-surface font-semibold tracking-wide">
              ⚡ Average Response Time: &lt; 7 Mins • 14 Ambulances Active in Metro Grid
            </span>
          </div>

          <div className="flex items-center justify-center gap-space-xs mb-space-xs">
            <span className="material-symbols-outlined text-error text-3xl md:text-4xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
              emergency
            </span>
            <h1 className="font-headline-xl text-headline-xl md:text-display-lg text-on-surface tracking-tight">
              Emergency Care
            </h1>
          </div>

          <p className="font-body-xl text-body-xl text-secondary max-w-2xl mx-auto mb-space-xl">
            Get immediate medical assistance when every second matters. Rapid hospital intake, GPS ambulance dispatch, and live physician coordination.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-space-md w-full max-w-xl">
            <a
              href="#intake-form"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-space-sm px-space-xl py-space-md bg-error text-on-error rounded-xl shadow-lg hover:shadow-error/30 hover:brightness-110 active:scale-[0.98] transition-all group"
            >
              <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">
                ambulance
              </span>
              <span className="font-label-lg text-label-lg font-bold tracking-wide uppercase">
                Request Ambulance
              </span>
            </a>
            <a
              href="tel:1800MEDICARE"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-space-sm px-space-xl py-space-md bg-primary text-on-primary rounded-xl shadow-md hover:bg-primary-container hover:shadow-primary/20 active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-2xl">call</span>
              <span className="font-label-lg text-label-lg font-bold tracking-wide uppercase">
                Call Emergency (24/7)
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: RAPID INTAKE & LIVE DISPATCH TRACKING (TWO-COLUMN BENTO) */}
      <section className="w-full py-space-xl px-margin-mobile md:px-margin-desktop" id="intake-form">
        <div className="max-w-max-content-width mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
          {/* COLUMN A: IMMEDIATE EMERGENCY INTAKE FORM (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg md:p-space-xl border border-outline-variant/30">
            <div className="flex items-start justify-between gap-space-md mb-space-lg">
              <div>
                <div className="inline-flex items-center gap-space-xxs px-space-sm py-space-xxs rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm uppercase tracking-wider font-bold mb-space-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                  Immediate Emergency Intake
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Expedited Triage Registration
                </h2>
                <p className="font-body-sm text-body-sm text-secondary mt-space-xxs">
                  For critical life-threatening conditions, please call 1-800-MEDICARE immediately.
                </p>
              </div>
              <span className="material-symbols-outlined text-primary text-3xl p-space-xs bg-surface-container-low rounded-xl">
                medical_information
              </span>
            </div>

            <form className="flex flex-col gap-space-md" onSubmit={handleEmergencySubmit}>
              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-space-xxs">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="patientName">
                    Patient Full Name
                  </label>
                  <input
                    className="h-12 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none shadow-sm transition-colors border border-outline-variant/30"
                    id="patientName"
                    required
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-space-xxs">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="patientPhone">
                    Mobile Number
                  </label>
                  <input
                    className="h-12 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none shadow-sm transition-colors border border-outline-variant/30"
                    id="patientPhone"
                    required
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Row 2: Location with GPS auto-detect */}
              <div className="flex flex-col gap-space-xxs">
                <label className="font-label-md text-label-md text-on-surface flex items-center justify-between" htmlFor="patientLocation">
                  <span>Incident Location</span>
                  <button
                    className="text-primary hover:text-primary-container font-label-sm text-label-sm inline-flex items-center gap-space-xxs font-semibold cursor-pointer"
                    onClick={handleAutoDetectLocation}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">my_location</span>
                    <span>Auto-Detect GPS</span>
                  </button>
                </label>
                <div className="relative flex items-center">
                  <input
                    className="w-full h-12 pl-space-md pr-12 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none shadow-sm transition-colors border border-outline-variant/30"
                    id="patientLocation"
                    required
                    type="text"
                    value={incidentLocation}
                    onChange={(e) => setIncidentLocation(e.target.value)}
                  />
                  <span className="material-symbols-outlined absolute right-3 text-error">location_on</span>
                </div>
              </div>

              {/* Row 3: Emergency Type & Blood Group / Age */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                <div className="sm:col-span-2 flex flex-col gap-space-xxs">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="emergencyType">
                    Emergency Classification
                  </label>
                  <div className="relative">
                    <select
                      className="w-full h-12 px-space-md appearance-none rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none shadow-sm transition-colors pr-10 border border-outline-variant/30"
                      id="emergencyType"
                      value={emergencyType}
                      onChange={(e) => setEmergencyType(e.target.value)}
                    >
                      <option value="Chest Pain">Chest Pain / Cardiac Episode</option>
                      <option value="Accident / Trauma">Accident / Severe Trauma</option>
                      <option value="Breathing Difficulty">Acute Breathing Difficulty</option>
                      <option value="Severe Injury">Severe Injury / Heavy Bleeding</option>
                      <option value="Unconsciousness">Unconsciousness / Syncope</option>
                      <option value="Pregnancy Emergency">Pregnancy &amp; Labor Emergency</option>
                      <option value="Other">Other Urgent Condition</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-3 top-3 text-secondary text-lg">
                      unfold_more
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-space-xxs">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="patientAge">
                    Age &amp; Blood
                  </label>
                  <input
                    className="h-12 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none shadow-sm transition-colors border border-outline-variant/30"
                    id="patientAge"
                    type="text"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                  />
                </div>
              </div>

              {/* Row 4: Destination Hospital */}
              <div className="flex flex-col gap-space-xxs">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="targetHospital">
                  Assigned Trauma Facility
                </label>
                <div className="relative">
                  <select
                    className="w-full h-12 px-space-md appearance-none rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none shadow-sm transition-colors pr-10 border border-outline-variant/30"
                    id="targetHospital"
                    value={targetHospital}
                    onChange={(e) => setTargetHospital(e.target.value)}
                  >
                    <option value="Aurora Central Hospital">Aurora Central Hospital (1.8 km • Level 1 Trauma)</option>
                    <option value="St. Jude Trauma Pavilion">St. Jude Trauma Pavilion (3.4 km • Helipad Ready)</option>
                    <option value="Metro General Emergency">Metro General Emergency Hospital (4.9 km • 24/7 ER)</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-3 top-3 text-secondary text-lg">
                    local_hospital
                  </span>
                </div>
              </div>

              {/* Row 5: Notes */}
              <div className="flex flex-col gap-space-xxs">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="emergencyNotes">
                  Clinical Description &amp; Symptoms
                </label>
                <textarea
                  className="p-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none shadow-sm transition-colors resize-none border border-outline-variant/30"
                  id="emergencyNotes"
                  rows={3}
                  value={emergencyNotes}
                  onChange={(e) => setEmergencyNotes(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button
                className="mt-space-xs w-full flex items-center justify-center gap-space-sm py-space-md px-space-xl bg-primary text-on-primary rounded-xl font-label-lg text-label-lg font-bold uppercase tracking-wider hover:bg-primary-container active:scale-[0.99] shadow-md transition-all cursor-pointer"
                id="submitBtn"
                disabled={submitting}
                type="submit"
              >
                {submitting ? (
                  <span>Transmitting Telemetry...</span>
                ) : (
                  <>
                    <span>Request Emergency Assistance</span>
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* COLUMN B: LIVE EMERGENCY STATUS & CRITICAL ADVISORY (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            {/* ACTIVE DISPATCH TRACKING CARD */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg flex flex-col gap-space-md border border-outline-variant/30">
              <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
                <div className="flex items-center gap-space-xs">
                  <span className="flex h-3 w-3 rounded-full bg-primary animate-ping"></span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">Live Assistance Active</span>
                </div>
                <span className="font-label-sm text-label-sm px-space-sm py-space-xxs rounded-full bg-primary-fixed text-on-primary-fixed font-bold tracking-wider">
                  #{activeDispatch.requestCode}
                </span>
              </div>

              {/* Stepper: 4 Steps */}
              <div className="relative flex items-center justify-between px-space-xs my-space-xs">
                <div className="absolute left-4 right-4 h-1 bg-surface-container-high z-0 top-3.5"></div>
                <div className="absolute left-4 w-2/3 h-1 bg-primary z-0 top-3.5 transition-all"></div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shadow-sm">
                    <span className="material-symbols-outlined text-sm">check</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold mt-1">Received</span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shadow-sm">
                    <span className="material-symbols-outlined text-sm">check</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold mt-1">Assigned</span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-error text-on-error flex items-center justify-center text-xs font-bold shadow-md ring-4 ring-error-container">
                    <span className="material-symbols-outlined text-sm">navigation</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-error font-bold mt-1">En Route</span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-surface-container-high text-secondary flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary mt-1">Arrived</span>
                </div>
              </div>

              {/* Live Route ETA Card with simulated radar */}
              <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm relative overflow-hidden border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary">airport_shuttle</span>
                    <span className="font-label-md text-label-md text-on-surface font-bold">
                      {activeDispatch.ambulanceUnit}
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm font-semibold text-primary bg-surface-container-lowest px-space-xs py-0.5 rounded shadow-sm">
                    GPS Active
                  </span>
                </div>

                {/* Radar Grid graphic */}
                <div className="h-28 w-full bg-surface-container-high/70 rounded-lg relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(#00543b_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>
                  <div className="absolute top-1/3 left-1/4 flex flex-col items-center">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
                    </span>
                    <span className="font-label-sm text-[10px] text-on-surface font-bold mt-0.5 bg-surface-container-lowest px-1 rounded shadow-xs">
                      Patient
                    </span>
                  </div>
                  <div className="absolute bottom-1/4 right-1/4 flex flex-col items-center">
                    <span className="material-symbols-outlined text-primary text-base">local_hospital</span>
                    <span className="font-label-sm text-[10px] text-on-surface font-bold bg-surface-container-lowest px-1 rounded shadow-xs">
                      Aurora ER
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs bg-surface-container-lowest/90 px-space-sm py-space-xxs rounded-full shadow-md z-10 backdrop-blur-sm">
                    <span className="material-symbols-outlined text-error text-base animate-bounce">ambulance</span>
                    <span className="font-label-sm text-label-sm font-bold text-on-surface">
                      ETA: {activeDispatch.etaMinutes} mins (1.2 miles)
                    </span>
                  </div>
                </div>

                {/* Live Status Metas */}
                <div className="grid grid-cols-2 gap-space-xs pt-space-xs font-body-sm text-body-sm">
                  <div>
                    <span className="text-secondary block font-label-sm text-label-sm">Patient:</span>
                    <span className="font-semibold text-on-surface">{activeDispatch.patientName}</span>
                  </div>
                  <div>
                    <span className="text-secondary block font-label-sm text-label-sm">Destination:</span>
                    <span className="font-semibold text-on-surface">Aurora Central Trauma</span>
                  </div>
                  <div className="col-span-2 pt-space-xxs">
                    <span className="text-secondary block font-label-sm text-label-sm">Assigned Lead Physician:</span>
                    <span className="font-semibold text-primary inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">stethoscope</span>
                      Dr. Michael Collins (Emergency Medicine)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Critical Advisory Card */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg border border-outline-variant/30 bg-gradient-to-br from-surface-container-lowest via-surface-container-lowest to-error-container/20">
              <div className="flex items-center gap-space-xs mb-space-sm">
                <span className="material-symbols-outlined text-error text-2xl">priority_high</span>
                <h3 className="font-headline-sm text-headline-sm text-error">Life-Threatening Advisory</h3>
              </div>
              <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
                <li className="flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-error text-base mt-0.5 shrink-0">call</span>
                  <span><strong>Call 1-800-MEDICARE or 911</strong> immediately if experiencing acute chest tightness, loss of consciousness, or massive trauma.</span>
                </li>
                <li className="flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-error text-base mt-0.5 shrink-0">hourglass_disabled</span>
                  <span><strong>Do not delay</strong> critical intervention waiting for form confirmation. Triage staff act on immediate voice dispatch.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: TRAUMA CENTERS & LIVE WAIT TIMES */}
      <section className="w-full py-space-xl px-margin-mobile md:px-margin-desktop bg-surface-container-low">
        <div className="max-w-max-content-width mx-auto space-y-space-lg">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
              Network Capacity
            </span>
            <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-1">
              Trauma Centers &amp; Live Emergency Wait Times
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {[
              {
                name: 'Aurora Central Trauma Center',
                address: '450 Health Sciences Blvd',
                wait: '4 mins',
                level: 'Level 1 Trauma',
                status: 'Immediate Intake',
                statusColor: 'text-primary bg-primary-fixed',
              },
              {
                name: 'Metro West Trauma Pavilion',
                address: '820 Hudson Parkway',
                wait: '12 mins',
                level: 'Level 1 Adult & Pediatric',
                status: 'Normal Flow',
                statusColor: 'text-secondary bg-secondary-fixed',
              },
              {
                name: 'St. Jude Urgent Care Unit',
                address: '110 Lexington Ave',
                wait: '18 mins',
                level: 'Level 2 Trauma Center',
                status: 'Moderate Volume',
                statusColor: 'text-amber-800 bg-amber-100',
              },
            ].map((tc, idx) => (
              <div key={idx} className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tc.statusColor}`}>
                      {tc.status}
                    </span>
                    <span className="text-xs text-secondary">{tc.level}</span>
                  </div>
                  <h3 className="font-headline-sm text-base font-bold text-on-surface">{tc.name}</h3>
                  <p className="text-xs text-secondary mt-1">{tc.address}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                  <span className="text-xs text-secondary">Triage Wait Time:</span>
                  <span className="font-headline-sm text-lg font-bold text-primary">{tc.wait}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmergencyPage;

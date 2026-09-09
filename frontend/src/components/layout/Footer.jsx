import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 py-space-2xl text-on-surface">
      <div className="max-w-[84rem] mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-xl pb-space-xl border-b border-outline-variant/20">
          <div className="flex flex-col gap-space-sm md:col-span-1">
            <div className="flex items-center gap-space-sm">
              <img
                alt="MediCare Logo"
                className="h-8 w-auto object-contain"
                src="/assets/logo.svg"
                onError={(e) => {
                  e.target.src = 'https://lh3.googleusercontent.com/aida/AEtjO1XKocFiHy3FKkDgptVRrMWJZyGPu0AhN7hHvl0Q2v7p7kB0mfpnXR6MCvE0Y8SvodWfnp34uecwImwy2gX5p6JDbII43lPRUdLP6n9UUyc6bfv-w_3jwezfVrTQQtqjpJH3OADgMRG1zXgBoxLop8RQhsI_f9miCg8_JcQJdkmp9jAwjxlA9CMQKxIZSPWcflnOwZ6TqelELrlmHOkAH8CWQk6l6V7nlcZDvX7D7vj2gVB26odZfky7Iw';
                }}
              />
              <span className="font-headline-sm text-headline-sm text-primary font-bold">MediCare</span>
            </div>
            <p className="font-body-sm text-body-sm text-secondary leading-relaxed">
              Elevated private-hospital editorial healthcare platform. Uncompromising clinical competence, discretion, and biological serenity.
            </p>
          </div>

          <div>
            <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold mb-space-sm">
              Clinical Hubs
            </h4>
            <ul className="flex flex-col gap-space-xs font-body-sm text-secondary">
              <li><Link to="/hospitals" className="hover:text-primary transition-colors">Aurora Medical Center</Link></li>
              <li><Link to="/hospitals" className="hover:text-primary transition-colors">Metro West Pavilion</Link></li>
              <li><Link to="/hospitals" className="hover:text-primary transition-colors">Cardiovascular Institute</Link></li>
              <li><Link to="/hospitals" className="hover:text-primary transition-colors">Robotic Surgery Suites</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold mb-space-sm">
              Patient Care
            </h4>
            <ul className="flex flex-col gap-space-xs font-body-sm text-secondary">
              <li><Link to="/doctors" className="hover:text-primary transition-colors">Find a Specialist</Link></li>
              <li><Link to="/book-appointment" className="hover:text-primary transition-colors">Book Consultation</Link></li>
              <li><Link to="/appointments" className="hover:text-primary transition-colors">Manage Appointments</Link></li>
              <li><Link to="/emergency" className="hover:text-primary transition-colors">Emergency Dispatch 24/7</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold mb-space-sm">
              Accreditation
            </h4>
            <div className="flex flex-col gap-space-xs font-body-sm text-secondary">
              <span className="inline-flex items-center gap-1 text-on-surface font-semibold">
                <span className="material-symbols-outlined text-primary text-base">verified</span>
                JCI Gold Seal of Approval
              </span>
              <span>Level 1 Adult & Pediatric Trauma</span>
              <span>HIPAA Compliant Data Sanctuary</span>
              <span className="font-semibold text-primary mt-1">24/7 Dispatch: 1-800-MEDICARE</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-space-lg gap-space-sm text-secondary font-body-sm">
          <p>© {new Date().getFullYear()} MediCare Healthcare System. All rights reserved.</p>
          <div className="flex items-center gap-space-md font-label-md">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Clinical Terms</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Patient Rights</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState } from 'react';
import { 
  Globe, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Shirt,
  Trees,
  Briefcase,
  Lock
} from 'lucide-react';
import { NavTab, Language } from '../types';

interface FooterProps {
  language: Language;
  onSelectTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onSelectTab }) => {
  const isNp = language === 'np';
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleLinkClick = (type: string) => {
    if (type === 'contact') {
      onSelectTab('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveModal(type);
    }
  };

  return (
    <>
      <footer
        id="main-footer"
        className="w-full bg-[#111c2d] text-white pt-10 pb-8 px-4 sm:px-6 border-t border-[#1d2b42]"
      >
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pb-8 border-b border-white/10">
            {/* Column 1: Brand & Registration */}
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  onSelectTab('impact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 font-bold text-lg text-white hover:opacity-90 transition-opacity text-left"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <div className="w-7 h-7 bg-[#003c90] flex items-center justify-center text-white">
                  <Globe className="w-4 h-4" />
                </div>
                <span>Genzicon Foundation</span>
              </button>
              <p className="text-xs text-white/70 leading-relaxed">
                {isNp
                  ? 'कपडा बैंक नेपाल, सफा तथा हरित नेपाल वृक्षारोपण, र महिला तथा युवा सीप एवं उद्यमशीलता प्रवर्द्धनमा समर्पित गैरसरकारी संस्था।'
                  : 'A registered non-profit NGO operating Clothes Bank Nepal, reforestation campaigns, and vocational training across 77 districts.'}
              </p>
              <div className="text-[10px] text-emerald-400 bg-white/5 p-2 border border-white/10 space-y-0.5 font-mono">
                <div>SWC Affiliation: <strong>No. 54128</strong></div>
                <div>PAN: <strong>609823451</strong></div>
              </div>
            </div>

            {/* Column 2: 3 Foundational Pillars */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-3">
                {isNp ? 'हाम्रा ३ स्तम्भहरू' : 'Our 3 Pillars'}
              </h4>
              <ul className="space-y-2 text-xs text-white/70">
                <li>
                  <button 
                    onClick={() => {
                      onSelectTab('clothes-bank');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-semibold text-white"
                  >
                    <Shirt className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isNp ? 'कपडा बैंक नेपाल' : 'Clothes Bank Nepal'}</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      onSelectTab('initiatives');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    <Trees className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isNp ? 'सफा नेपाल, हरित नेपाल' : 'Clean Nepal, Green Nepal'}</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      onSelectTab('initiatives');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isNp ? 'दक्षता तथा उद्यमशीलता' : 'Skills & Business'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick Navigation */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-3">
                {isNp ? 'सहकार्य तथा सेवा' : 'Quick Navigation'}
              </h4>
              <ul className="space-y-2 text-xs text-white/70">
                <li>
                  <button onClick={() => { onSelectTab('clothes-bank'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                    {isNp ? 'कपडा बैंक नेपाल' : 'Clothes Bank Portal'}
                  </button>
                </li>
                <li>
                  <button onClick={() => { onSelectTab('volunteer'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                    {isNp ? 'स्वयंसेवक दर्ता' : 'Volunteer Registration'}
                  </button>
                </li>
                <li>
                  <button onClick={() => { onSelectTab('donate'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors text-emerald-400 font-bold">
                    {isNp ? 'अनलाइन सहयोग (eSewa / Fonepay)' : 'Donate Online'}
                  </button>
                </li>
                <li>
                  <button onClick={() => { onSelectTab('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                    {isNp ? 'सम्पर्क ठेगाना' : 'Contact Us'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Locations */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-3">
                {isNp ? 'सम्पर्क तथा कार्यालय' : 'Offices & Support'}
              </h4>
              <div className="space-y-2 text-xs text-white/70">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Putalisadak, Kathmandu & Station Rd, Janakpur</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>+977 1-4240000 / 9823000000</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>info@genzicon.org</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/60">
            <div>
              © {new Date().getFullYear()} Genzicon Foundation Nepal. Non-Profit Grassroots NGO.
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px]">
              <button
                onClick={() => handleLinkClick('privacy')}
                className="hover:text-white transition-colors"
              >
                {isNp ? 'गोपनीयता नीति' : 'Privacy Policy'}
              </button>
              <span>•</span>
              <button
                onClick={() => handleLinkClick('terms')}
                className="hover:text-white transition-colors"
              >
                {isNp ? 'सर्तहरू' : 'Terms of Governance'}
              </button>
              <span>•</span>
              <button
                onClick={() => { onSelectTab('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-white transition-colors"
              >
                {isNp ? 'सम्पर्क' : 'Contact'}
              </button>
              <span>•</span>
              <button
                id="footer-admin-portal-link"
                onClick={() => { 
                  onSelectTab('admin'); 
                  window.location.hash = 'admin';
                  window.scrollTo({ top: 0, behavior: 'smooth' }); 
                }}
                className="text-white/40 hover:text-emerald-400 transition-colors flex items-center gap-1 font-mono tracking-tight"
                title="Staff & Volunteer Management Portal"
              >
                <Lock className="w-3 h-3 text-white/40" />
                <span>{isNp ? 'प्रशासक पोर्टल (Admin Portal)' : 'Admin Portal'}</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Compliance / Policy Simple Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#111c2d] max-w-lg w-full p-6 shadow-xl border border-[#d8e3fb] animate-scale-up">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#d8e3fb]">
              <h3 className="font-bold text-sm text-[#111c2d] uppercase tracking-wider font-heading">
                {activeModal === 'privacy' && (isNp ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy')}
                {activeModal === 'terms' && (isNp ? 'सर्तहरू तथा वैधानिकता (Terms)' : 'Terms of Governance')}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 hover:bg-[#f0f3ff] transition-colors"
              >
                <X className="w-4 h-4 text-[#434653]" />
              </button>
            </div>
            <div className="text-xs text-[#434653] space-y-2 leading-relaxed max-h-[60vh] overflow-y-auto">
              {activeModal === 'privacy' && (
                <>
                  <p>
                    Genzicon Foundation respects the privacy of all donors, volunteers, and beneficiary families. Any personal identification, phone numbers, and pickup addresses provided for the Clothes Bank are kept strictly confidential.
                  </p>
                  <p>
                    We never sell, rent, or trade donor contact data with third-party advertising companies.
                  </p>
                </>
              )}
              {activeModal === 'terms' && (
                <>
                  <p>
                    Genzicon Foundation operates as an affiliated non-profit entity under the Social Welfare Council Act of Nepal (Affiliation No. 54128, PAN: 609823451).
                  </p>
                  <p>
                    All public financial contributions are acknowledged with verifiable digital donation receipts and audited annually.
                  </p>
                </>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-[#d8e3fb] text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#003c90] text-white text-xs font-bold uppercase tracking-wider"
              >
                {isNp ? 'बुझेँ (Close)' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

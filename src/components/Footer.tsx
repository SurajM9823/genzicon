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
import { NavTab, Language, SiteSettingsConfig } from '../types';

interface FooterProps {
  language: Language;
  onSelectTab: (tab: NavTab) => void;
  siteSettings?: SiteSettingsConfig;
}

export const Footer: React.FC<FooterProps> = ({ language, onSelectTab, siteSettings }) => {
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

  const officesText = isNp 
    ? (siteSettings?.footerOfficesSummaryNp || siteSettings?.footerOfficesSummary || 'पुतलीसडक, काठमाडौँ र स्टेशन रोड, जनकपुर')
    : (siteSettings?.footerOfficesSummary || 'Putalisadak, Kathmandu & Station Rd, Janakpur');
  const phoneText = siteSettings?.headOfficePhone || '+977 1-4240000 / 9823000000';
  const emailText = siteSettings?.headOfficeEmail || 'info@genzicon.org';
  const orgName = isNp ? (siteSettings?.orgNameNp || 'जेन्जिकन फाउन्डेशन') : (siteSettings?.orgName || 'Genzicon Foundation');
  const aboutText = isNp
    ? (siteSettings?.aboutTextNp || 'कपडा बैंक नेपाल, सफा तथा हरित नेपाल वृक्षारोपण, र महिला तथा युवा सीप एवं उद्यमशीलता प्रवर्द्धनमा समर्पित गैरसरकारी संस्था।')
    : (siteSettings?.aboutText || 'A registered non-profit NGO operating Clothes Bank Nepal, reforestation campaigns, and vocational training across 77 districts.');

  return (
    <>
      <footer
        id="main-footer"
        className="w-full bg-[#111c2d] text-white pt-10 pb-8 px-4 sm:px-6 border-t border-[#1d2b42]"
      >
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pb-8 border-b border-white/10">
            {/* Column 1: Brand & About */}
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  onSelectTab('impact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2.5 font-bold text-lg text-white hover:opacity-90 transition-opacity text-left"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {siteSettings?.logoUrl ? (
                  <img
                    src={siteSettings.logoUrl}
                    alt={orgName}
                    className="h-8 max-h-9 w-auto max-w-[140px] object-contain rounded-xs bg-white/10 p-1"
                  />
                ) : (
                  <div className="w-7 h-7 bg-[#003c90] flex items-center justify-center text-white">
                    <Globe className="w-4 h-4" />
                  </div>
                )}
                <span>{orgName}</span>
              </button>
              <p className="text-xs text-white/70 leading-relaxed">
                {aboutText}
              </p>
              {/* Quick Social Links in Footer */}
              <div className="flex items-center gap-3 pt-1">
                {siteSettings?.facebookUrl && (
                  <a
                    href={siteSettings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Facebook"
                    className="text-white/70 hover:text-[#1877F2] transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                {siteSettings?.whatsappNumber && (
                  <a
                    href={`https://wa.me/${(siteSettings.whatsappNumber || '').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="WhatsApp"
                    className="text-white/70 hover:text-[#25D366] transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                )}
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

            {/* Column 4: Contact & Locations (Dynamic) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-3">
                {isNp ? 'सम्पर्क तथा कार्यालय' : 'Offices & Support'}
              </h4>
              <div className="space-y-2 text-xs text-white/70">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{officesText}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a href={`tel:${phoneText.split('/')[0].trim()}`} className="hover:text-white transition-colors">
                    {phoneText}
                  </a>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a href={`mailto:${emailText}`} className="hover:text-white transition-colors">
                    {emailText}
                  </a>
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
                    Genzicon Foundation operates as a non-profit non-governmental organization dedicated to community service, youth empowerment, and grassroots disaster relief in Nepal.
                  </p>
                  <p>
                    All public financial contributions are acknowledged with verifiable digital donation records and audited annually for complete transparency.
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

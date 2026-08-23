import React, { useState } from 'react';
import { 
  Globe, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
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
    if (type === 'annual-reports') {
      onSelectTab('transparency');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (type === 'contact') {
      onSelectTab('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (type === 'team') {
      onSelectTab('team');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (type === 'gallery') {
      onSelectTab('gallery');
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 pb-8 border-b border-white/10">
            {/* Column 1: Brand & SWC */}
            <div className="lg:col-span-2 space-y-2.5">
              <button
                onClick={() => {
                  onSelectTab('impact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 font-bold text-lg text-white hover:opacity-90 transition-opacity text-left"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <div className="w-7 h-7 rounded-none bg-[#003c90] flex items-center justify-center text-white">
                  <Globe className="w-4 h-4" />
                </div>
                <span>Genzicon Foundation</span>
              </button>
              <p className="text-xs text-white/70 leading-relaxed max-w-sm">
                {isNp
                  ? 'नेपालका ग्रामीण क्षेत्रमा खानेपानी, सौर्य उर्जा र शिक्षामा कार्यरत युवा नेतृत्वको गैरसरकारी संस्था।'
                  : 'A youth-led NGO in Nepal delivering sustainable clean water, solar electricity, and disaster relief with 100% public financial accountability.'}
              </p>
              <div className="text-[10px] text-emerald-400 bg-white/5 p-2.5 rounded-none border border-white/10 space-y-0.5">
                <div>• SWC Affiliation No.: <strong>54128</strong></div>
                <div>• NGO Reg No.: <strong>842/075</strong> (Govt. of Nepal)</div>
                <div>• Permanent PAN: <strong>609823451</strong></div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-3">
                {isNp ? 'प्रमुख पृष्ठहरू' : 'Navigation'}
              </h4>
              <ul className="space-y-1.5 text-xs text-white/70">
                <li>
                  <button onClick={() => onSelectTab('impact')} className="hover:text-white transition-colors">
                    {isNp ? 'गृहपृष्ठ' : 'Home'}
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectTab('projects')} className="hover:text-white transition-colors">
                    {isNp ? 'परियोजनाहरू' : 'Projects'}
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectTab('about')} className="hover:text-white transition-colors">
                    {isNp ? 'हाम्रोबारे' : 'About'}
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectTab('team')} className="hover:text-white transition-colors">
                    {isNp ? 'टिम' : 'Team'}
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectTab('gallery')} className="hover:text-white transition-colors">
                    {isNp ? 'ग्यालरी' : 'Gallery'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Accountability & Join */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-3">
                {isNp ? 'पारदर्शिता' : 'Accountability'}
              </h4>
              <ul className="space-y-1.5 text-xs text-white/70">
                <li>
                  <button onClick={() => onSelectTab('transparency')} className="hover:text-white transition-colors">
                    {isNp ? 'सार्वजनिक अडिट' : 'Annual Audits'}
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectTab('volunteer')} className="hover:text-white transition-colors">
                    {isNp ? 'स्वयंसेवक' : 'Volunteer'}
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectTab('donate')} className="hover:text-white transition-colors text-emerald-400 font-bold">
                    {isNp ? 'सहयोग (eSewa / Card)' : 'Donate Online'}
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectTab('news')} className="hover:text-white transition-colors">
                    {isNp ? 'समाचार' : 'News'}
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectTab('admin')} className="hover:text-white transition-colors flex items-center gap-1 text-[11px] text-white/50">
                    <Lock className="w-3 h-3" />
                    <span>Portal Login</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-3">
                {isNp ? 'सम्पर्क' : 'Contact'}
              </h4>
              <div className="space-y-2 text-xs text-white/70">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#00743a] shrink-0 mt-0.5" />
                  <span>Putalisadak, Kathmandu, Nepal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#00743a] shrink-0" />
                  <span>+977 1-4240000</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#00743a] shrink-0" />
                  <span>info@genzicon.org</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Legal bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/60">
            <div>
              © {new Date().getFullYear()} Genzicon Foundation Nepal. All rights reserved.
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => handleLinkClick('privacy')} className="hover:text-white transition-colors">
                Privacy Policy
              </button>
              <span>•</span>
              <button onClick={() => handleLinkClick('terms')} className="hover:text-white transition-colors">
                Terms of Use
              </button>
              <span>•</span>
              <button onClick={() => handleLinkClick('financial')} className="hover:text-white transition-colors">
                Tax Compliance
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal & Policy Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-none sm:rounded-xs max-w-lg w-full p-5 text-[#111c2d] border border-[#d8e3fb] max-h-[85vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-[#f0f3ff] mb-3">
              <h3 className="text-sm font-bold capitalize">
                {activeModal.replace('-', ' ')} Policy
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-6 h-6 rounded-none bg-[#f0f3ff] text-[#434653] flex items-center justify-center hover:bg-[#e7eeff] font-bold text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-xs text-[#434653] space-y-2 leading-relaxed">
              <p>
                Genzicon Foundation operates in full compliance with the Social Welfare Council Act 2049 and Directives of the Government of Nepal.
              </p>
              <p>
                All donor contributions, volunteer enrollments, and vendor procurement contracts are audited annually by certified independent Chartered Accountants and submitted to the SWC and Inland Revenue Department.
              </p>
            </div>

            <div className="mt-4 pt-2 border-t border-[#f0f3ff] flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 bg-[#003c90] text-white text-xs font-bold uppercase tracking-wider rounded-none sm:rounded-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

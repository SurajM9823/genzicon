import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Heart, 
  Menu, 
  X, 
  Languages, 
  Lock, 
  Users, 
  Image as ImageIcon, 
  PhoneCall, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import { NavTab, Language } from '../types';

interface NavbarProps {
  currentTab: NavTab;
  language: Language;
  onSelectTab: (tab: NavTab) => void;
  onOpenDonate: () => void;
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  language,
  onSelectTab,
  onOpenDonate,
  onToggleLanguage
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isNp = language === 'np';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { id: NavTab; labelEn: string; labelNp: string }[] = [
    { id: 'impact', labelEn: 'Home', labelNp: 'गृहपृष्ठ' },
    { id: 'projects', labelEn: 'Projects', labelNp: 'परियोजनाहरू' },
    { id: 'about', labelEn: 'About Us', labelNp: 'हाम्रोबारे' },
    { id: 'team', labelEn: 'Our Team', labelNp: 'हाम्रो टिम' },
    { id: 'gallery', labelEn: 'Field Media', labelNp: 'फिल्ड तस्बिरहरू' },
    { id: 'volunteer', labelEn: 'Volunteer', labelNp: 'स्वयंसेवक' },
    { id: 'transparency', labelEn: 'Audits', labelNp: 'पारदर्शिता' },
    { id: 'news', labelEn: 'News', labelNp: 'समाचार' },
    { id: 'contact', labelEn: 'Contact', labelNp: 'सम्पर्क' }
  ];

  const handleLinkClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-150 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs py-2'
          : 'bg-white/95 backdrop-blur-sm py-2.5'
      } border-b border-[#d8e3fb]`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="brand-logo-btn"
          onClick={() => handleLinkClick('impact')}
          className="flex items-center gap-2 text-left focus:outline-none group"
        >
          <div className="w-8 h-8 rounded-none sm:rounded-xs bg-[#003c90] flex items-center justify-center text-white shadow-xs group-hover:bg-[#002660] transition-colors">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <div>
            <span
              className="font-bold text-base sm:text-lg text-[#003c90] tracking-tight block leading-none"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Genzicon
            </span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#00743a] block leading-tight">
              {isNp ? 'नेपाल फाउन्डेशन' : 'Foundation Nepal'}
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-4">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => handleLinkClick(link.id)}
                className={`text-[11px] uppercase tracking-wider py-1 font-bold transition-all duration-150 ${
                  isActive
                    ? 'text-[#003c90] border-b-2 border-[#003c90]'
                    : 'text-[#434653] hover:text-[#003c90]'
                }`}
              >
                {isNp ? link.labelNp : link.labelEn}
              </button>
            );
          })}
        </div>

        {/* Action Controls & Language */}
        <div className="flex items-center gap-2">
          {/* Language Toggle Button */}
          <button
            onClick={onToggleLanguage}
            title="Toggle Language / भाषा बदल्नुहोस्"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-none sm:rounded-xs bg-[#f0f3ff] hover:bg-[#e7eeff] text-[#003c90] text-[11px] font-bold transition-colors border border-[#d8e3fb]"
          >
            <Languages className="w-3 h-3" />
            <span>{isNp ? 'नेपाली' : 'EN'}</span>
          </button>

          {/* Admin Portal Shortcut */}
          <button
            onClick={() => handleLinkClick('admin')}
            title="Admin Portal / CMS"
            className={`p-1.5 rounded-none sm:rounded-xs transition-colors border ${
              currentTab === 'admin'
                ? 'bg-[#003c90] text-white border-[#003c90]'
                : 'bg-white text-[#737784] border-[#d8e3fb] hover:text-[#003c90]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
          </button>

          {/* Donate CTA */}
          <button
            id="nav-donate-btn"
            onClick={onOpenDonate}
            className="bg-[#00743a] hover:bg-[#005227] text-white text-[11px] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-none sm:rounded-xs transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>{isNp ? 'दान' : 'Donate'}</span>
            <Heart className="w-3 h-3 fill-white text-white" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#003c90] hover:bg-[#f0f3ff] rounded-none border border-[#d8e3fb] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Full Menu Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="lg:hidden bg-white border-b border-[#d8e3fb] px-4 py-3 space-y-2 shadow-lg animate-fade-in max-h-[85vh] overflow-y-auto"
        >
          <div className="grid grid-cols-2 gap-1.5 pb-2 mb-2 border-b border-[#f0f3ff]">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left py-2 px-2.5 rounded-none text-xs font-bold transition-colors ${
                  currentTab === link.id
                    ? 'bg-[#003c90] text-white'
                    : 'text-[#434653] bg-[#f9f9ff] hover:bg-[#f0f3ff] border border-[#e7eeff]'
                }`}
              >
                {isNp ? link.labelNp : link.labelEn}
              </button>
            ))}
          </div>

          <div className="pt-1 flex flex-col gap-1.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonate();
              }}
              className="w-full bg-[#00743a] text-white py-2.5 rounded-none text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{isNp ? 'सहयोग गर्नुहोस् (eSewa / Fonepay)' : 'Donate Online (eSewa / Card)'}</span>
              <Heart className="w-3.5 h-3.5 fill-white text-white" />
            </button>

            <button
              onClick={() => handleLinkClick('admin')}
              className="w-full bg-[#f0f3ff] text-[#003c90] py-2 rounded-none text-xs font-bold flex items-center justify-center gap-1.5 border border-[#d8e3fb]"
            >
              <Lock className="w-3 h-3" />
              <span>{isNp ? 'प्रशासक लगइन (Admin CMS)' : 'Admin CMS Portal'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

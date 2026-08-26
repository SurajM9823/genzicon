import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Heart, 
  Menu, 
  X, 
  Shirt
} from 'lucide-react';
import { NavTab, Language } from '../types';

interface NavbarProps {
  currentTab: NavTab;
  language: Language;
  onSelectTab: (tab: NavTab) => void;
  onOpenDonate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  language,
  onSelectTab,
  onOpenDonate
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

  const navLinks: { id: NavTab; labelEn: string; labelNp: string; isPill?: boolean; icon?: any }[] = [
    { id: 'impact', labelEn: 'Home', labelNp: 'गृहपृष्ठ' },
    { id: 'clothes-bank', labelEn: 'Clothes Bank', labelNp: 'कपडा बैंक', isPill: true, icon: Shirt },
    { id: 'initiatives', labelEn: '3 Pillars', labelNp: '३ स्तम्भ' },
    { id: 'volunteer', labelEn: 'Volunteer', labelNp: 'स्वयंसेवक' },
    { id: 'donate', labelEn: 'Donate', labelNp: 'सहयोग' },
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
          <div className="w-8 h-8 bg-[#003c90] flex items-center justify-center text-white shadow-xs group-hover:bg-[#002660] transition-colors">
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
        <div className="hidden lg:flex items-center gap-5">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id || (link.id === 'contact' && currentTab === 'about');
            const Icon = link.icon;
            
            if (link.isPill) {
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-[11px] uppercase tracking-wider px-2.5 py-1 font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#003c90] text-white'
                      : 'bg-[#e7eeff] text-[#003c90] hover:bg-[#d8e3fb]'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{isNp ? link.labelNp : link.labelEn}</span>
                </button>
              );
            }

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

        {/* Action Controls - Donate Only (No admin icon, no language toggle) */}
        <div className="flex items-center gap-2">
          {/* Donate CTA */}
          <button
            id="nav-donate-btn"
            onClick={onOpenDonate}
            className="bg-[#00743a] hover:bg-[#005227] text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>{isNp ? 'सहयोग' : 'Donate'}</span>
            <Heart className="w-3 h-3 fill-white text-white" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#003c90] hover:bg-[#f0f3ff] border border-[#d8e3fb] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
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
                className={`text-left py-2 px-2.5 text-xs font-bold transition-colors ${
                  currentTab === link.id || (link.id === 'contact' && currentTab === 'about')
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
                handleLinkClick('clothes-bank');
              }}
              className="w-full bg-[#003c90] text-white py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs"
            >
              <Shirt className="w-4 h-4 text-emerald-400" />
              <span>{isNp ? 'कपडा बैंक (दान / माग)' : 'Clothes Bank Portal'}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonate();
              }}
              className="w-full bg-[#00743a] text-white py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{isNp ? 'सहयोग गर्नुहोस् (eSewa / Fonepay)' : 'Donate Online'}</span>
              <Heart className="w-3.5 h-3.5 fill-white text-white" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

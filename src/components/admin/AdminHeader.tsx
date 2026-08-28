import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  FolderKanban, 
  Shirt, 
  Users, 
  HeartHandshake, 
  Mail, 
  QrCode, 
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { Language } from '../../types';

export type AdminTabType = 
  | 'overview' 
  | 'content' 
  | 'projects' 
  | 'clothes' 
  | 'volunteers' 
  | 'donations' 
  | 'contacts' 
  | 'settings';

interface AdminHeaderProps {
  language: Language;
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
  onLogout: () => void;
  onViewPublicSite?: () => void;
  pendingClothesCount: number;
  pendingVolunteersCount: number;
  pendingDonationsCount: number;
  newContactsCount: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  language,
  activeTab,
  setActiveTab,
  onLogout,
  onViewPublicSite,
  pendingClothesCount,
  pendingVolunteersCount,
  pendingDonationsCount,
  newContactsCount
}) => {
  const isNp = language === 'np';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navTabs: { id: AdminTabType; label: string; icon: React.ComponentType<{ className?: string }>; badgeCount?: number }[] = [
    { id: 'overview', label: isNp ? 'ड्यासबोर्ड' : 'Overview', icon: LayoutDashboard },
    { id: 'content', label: isNp ? 'वेबसाइट सामग्री' : 'Hero & CMS', icon: ImageIcon },
    { id: 'projects', label: isNp ? 'फिल्ड कार्यक्रम' : 'Ground Programs', icon: FolderKanban },
    { id: 'clothes', label: isNp ? 'कपडा बैंक' : 'Clothes Pickup', icon: Shirt, badgeCount: pendingClothesCount },
    { id: 'volunteers', label: isNp ? 'स्वयंसेवक' : 'Volunteers', icon: Users, badgeCount: pendingVolunteersCount },
    { id: 'donations', label: isNp ? 'दान विवरण' : 'Donations & QR', icon: HeartHandshake, badgeCount: pendingDonationsCount },
    { id: 'contacts', label: isNp ? 'सम्पर्क सन्देश' : 'Inquiries', icon: Mail, badgeCount: newContactsCount },
    { id: 'settings', label: isNp ? 'बैंक तथा QR' : 'Bank Setup', icon: QrCode },
  ];

  const currentTabObj = navTabs.find(t => t.id === activeTab) || navTabs[0];
  const CurrentIcon = currentTabObj.icon;

  const handleSelectTab = (tabId: AdminTabType) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-white border border-[#d8e3fb] mb-4 sm:mb-6 shadow-xs">
      {/* Top Banner */}
      <div className="px-3.5 sm:px-6 py-2.5 border-b border-[#d8e3fb] flex items-center justify-between gap-2 bg-[#fcfdff]">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-7 h-7 bg-[#003c90] text-white flex items-center justify-center font-bold text-xs shrink-0">
            G
          </div>
          <div className="min-w-0 flex items-center gap-2">
            <h1 className="text-xs sm:text-sm font-bold text-[#111c2d] tracking-tight truncate">
              Genzicon Admin
            </h1>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
              <ShieldCheck className="w-2.5 h-2.5" />
              <span>Live CMS</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onViewPublicSite && (
            <button
              onClick={onViewPublicSite}
              className="px-2.5 py-1.5 bg-[#f0f3ff] hover:bg-[#e0e8ff] text-[#003c90] text-[11px] font-semibold transition-colors flex items-center gap-1 min-h-[32px]"
              title="Return to Public Website"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden xs:inline">{isNp ? 'वेबसाइट' : 'Public Site'}</span>
            </button>
          )}

          <button
            onClick={onLogout}
            className="px-2.5 py-1.5 bg-[#fff0f0] hover:bg-[#ffe0e0] text-red-700 text-[11px] font-semibold transition-colors flex items-center gap-1 border border-red-100 min-h-[32px]"
            title="Sign out of Admin Session"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden xs:inline">{isNp ? 'लगआउट' : 'Sign Out'}</span>
          </button>

          {/* Mobile Menu Dropdown Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 bg-[#f0f4ff] border border-[#d8e3fb] text-[#003c90] min-h-[32px] min-w-[32px] flex items-center justify-center"
            aria-label="Toggle Admin Navigation"
          >
            {mobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Current Tab Bar */}
      <div className="md:hidden px-3 py-2 bg-[#f0f4ff] border-b border-[#d8e3fb] flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 text-xs font-bold text-[#003c90] w-full text-left"
        >
          <CurrentIcon className="w-4 h-4 shrink-0" />
          <span className="truncate">Section: {currentTabObj.label}</span>
          {currentTabObj.badgeCount !== undefined && currentTabObj.badgeCount > 0 && (
            <span className="px-1.5 py-0.2 text-[9px] font-bold bg-[#003c90] text-white rounded-full">
              {currentTabObj.badgeCount}
            </span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 ml-auto transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Mobile Accordion Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#d8e3fb] bg-white divide-y divide-[#f0f3ff] p-2 space-y-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`w-full px-3 py-2.5 text-xs font-bold text-left flex items-center justify-between min-h-[44px] ${
                  isActive ? 'bg-[#003c90] text-white' : 'text-[#434653] hover:bg-[#f9f9ff]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#737784]'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive ? 'bg-white text-[#003c90]' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {tab.badgeCount} pending
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Desktop Navigation Tabs Bar (with horizontal touch swipe support) */}
      <div className="hidden md:flex px-2 sm:px-4 items-center gap-1 overflow-x-auto scrollbar-none py-1.5 bg-white">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 min-h-[40px] ${
                isActive
                  ? 'border-[#003c90] text-[#003c90] bg-[#f0f4ff]'
                  : 'border-transparent text-[#434653] hover:text-[#003c90] hover:bg-[#f9f9ff]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#003c90]' : 'text-[#737784]'}`} />
              <span>{tab.label}</span>
              {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                  isActive ? 'bg-[#003c90] text-white' : 'bg-amber-100 text-amber-900'
                }`}>
                  {tab.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

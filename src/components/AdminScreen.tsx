import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  LogIn, 
  ArrowLeft,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { 
  Project, 
  VolunteerRecord, 
  DonationRecord, 
  ClothesDonationRequest, 
  ClothesAssistanceRequest,
  ContactMessage,
  SiteContentConfig,
  BankAndQrConfig,
  Language 
} from '../types';
import { 
  DEFAULT_SITE_CONTENT, 
  DEFAULT_BANK_QR_CONFIG, 
  PROJECTS_DATA, 
  INITIAL_VOLUNTEER_RECORDS, 
  INITIAL_DONATION_RECORDS, 
  SAMPLE_CLOTHES_DONATION_REQUESTS, 
  SAMPLE_CLOTHES_ASSISTANCE_REQUESTS,
  INITIAL_CONTACT_MESSAGES
} from '../data/mockData';
import {
  apiAdminLogin,
  apiAdminLogout,
  apiGetSiteContent,
  apiUpdateSiteContent,
  apiSaveImpactStats,
  apiGetProjects,
  apiCreateProject,
  apiGetClothesDonations,
  apiGetVolunteers,
  apiGetDonations,
  apiGetContacts
} from '../services/api';
import { AdminHeader, AdminTabType } from './admin/AdminHeader';
import { AdminOverviewTab } from './admin/AdminOverviewTab';
import { AdminContentTab } from './admin/AdminContentTab';
import { AdminProjectsTab } from './admin/AdminProjectsTab';
import { AdminClothesTab } from './admin/AdminClothesTab';
import { AdminVolunteersTab } from './admin/AdminVolunteersTab';
import { AdminDonationsTab } from './admin/AdminDonationsTab';
import { AdminContactsTab } from './admin/AdminContactsTab';
import { AdminSettingsTab } from './admin/AdminSettingsTab';

interface AdminScreenProps {
  language: Language;
  onNavigateHome?: () => void;
  onViewPublicSite?: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  language,
  onNavigateHome,
  onViewPublicSite
}) => {
  const isNp = language === 'np';

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('genzicon_admin_auth') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTabType>('overview');

  // Ground Program Modal quick-opener
  const [openAddProjectModal, setOpenAddProjectModal] = useState(false);

  // 1. Site Content (Hero, Carousel, Impact Stats)
  const [siteContent, setSiteContent] = useState<SiteContentConfig>(() => {
    try {
      const saved = localStorage.getItem('genzicon_site_content');
      return saved ? JSON.parse(saved) : DEFAULT_SITE_CONTENT;
    } catch {
      return DEFAULT_SITE_CONTENT;
    }
  });

  // 2. Bank & QR Configuration
  const [bankQrConfig, setBankQrConfig] = useState<BankAndQrConfig>(() => {
    try {
      const saved = localStorage.getItem('genzicon_bank_qr_config');
      return saved ? JSON.parse(saved) : DEFAULT_BANK_QR_CONFIG;
    } catch {
      return DEFAULT_BANK_QR_CONFIG;
    }
  });

  // 3. Ground Programs
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('genzicon_admin_projects');
      return saved ? JSON.parse(saved) : PROJECTS_DATA;
    } catch {
      return PROJECTS_DATA;
    }
  });

  // 4. Clothes Donations & Assistance
  const [clothesDonations, setClothesDonations] = useState<ClothesDonationRequest[]>(() => {
    try {
      const saved = localStorage.getItem('genzicon_clothes_donations');
      return saved ? JSON.parse(saved) : SAMPLE_CLOTHES_DONATION_REQUESTS;
    } catch {
      return SAMPLE_CLOTHES_DONATION_REQUESTS;
    }
  });

  const [clothesAssistance, setClothesAssistance] = useState<ClothesAssistanceRequest[]>(() => {
    try {
      const saved = localStorage.getItem('genzicon_clothes_assistance');
      return saved ? JSON.parse(saved) : SAMPLE_CLOTHES_ASSISTANCE_REQUESTS;
    } catch {
      return SAMPLE_CLOTHES_ASSISTANCE_REQUESTS;
    }
  });

  // 5. Volunteers
  const [volunteers, setVolunteers] = useState<VolunteerRecord[]>(() => {
    try {
      const saved = localStorage.getItem('genzicon_admin_volunteers');
      return saved ? JSON.parse(saved) : INITIAL_VOLUNTEER_RECORDS;
    } catch {
      return INITIAL_VOLUNTEER_RECORDS;
    }
  });

  // 6. Donations
  const [donations, setDonations] = useState<DonationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('genzicon_admin_donations');
      return saved ? JSON.parse(saved) : INITIAL_DONATION_RECORDS;
    } catch {
      return INITIAL_DONATION_RECORDS;
    }
  });

  // 7. Contact Messages
  const [contacts, setContacts] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem('genzicon_contacts');
      return saved ? JSON.parse(saved) : INITIAL_CONTACT_MESSAGES;
    } catch {
      return INITIAL_CONTACT_MESSAGES;
    }
  });

  // Synchronize state changes to localStorage and backend API
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadBackendData = async () => {
      try {
        const [
          liveContent,
          liveProjects,
          liveClothes,
          liveVolunteers,
          liveDonations,
          liveContacts
        ] = await Promise.all([
          apiGetSiteContent(),
          apiGetProjects(),
          apiGetClothesDonations(),
          apiGetVolunteers(),
          apiGetDonations(),
          apiGetContacts(),
        ]);

        if (liveContent) setSiteContent(prev => ({ ...prev, ...liveContent }));
        if (liveProjects && liveProjects.length > 0) setProjects(liveProjects);
        if (liveClothes && liveClothes.length > 0) setClothesDonations(liveClothes);
        if (liveVolunteers && liveVolunteers.length > 0) setVolunteers(liveVolunteers);
        if (liveDonations && liveDonations.length > 0) setDonations(liveDonations);
        if (liveContacts && liveContacts.length > 0) setContacts(liveContacts);
      } catch (err) {
        console.warn('Backend sync in Admin:', err);
      }
    };

    loadBackendData();
  }, [isAuthenticated]);

  const handleSaveSiteContent = async (newContent: SiteContentConfig) => {
    setSiteContent(newContent);
    localStorage.setItem('genzicon_site_content', JSON.stringify(newContent));
    try {
      await apiUpdateSiteContent(1, newContent);
      if (newContent.impactStats && newContent.impactStats.length > 0) {
        await apiSaveImpactStats(newContent.impactStats);
      }
    } catch (e) {
      console.warn('Backend sync in handleSaveSiteContent:', e);
    }
    // Trigger custom window event so other open pages can re-render if active
    window.dispatchEvent(new Event('genzicon_content_updated'));
  };

  const handleSaveBankQrConfig = (newConfig: BankAndQrConfig) => {
    setBankQrConfig(newConfig);
    localStorage.setItem('genzicon_bank_qr_config', JSON.stringify(newConfig));
    window.dispatchEvent(new Event('genzicon_bank_qr_updated'));
  };

  const handleSaveProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('genzicon_admin_projects', JSON.stringify(updatedProjects));
  };

  const handleSaveClothesDonations = (updated: ClothesDonationRequest[]) => {
    setClothesDonations(updated);
    localStorage.setItem('genzicon_clothes_donations', JSON.stringify(updated));
  };

  const handleSaveClothesAssistance = (updated: ClothesAssistanceRequest[]) => {
    setClothesAssistance(updated);
    localStorage.setItem('genzicon_clothes_assistance', JSON.stringify(updated));
  };

  const handleSaveVolunteers = (updatedVolunteers: VolunteerRecord[]) => {
    setVolunteers(updatedVolunteers);
    localStorage.setItem('genzicon_admin_volunteers', JSON.stringify(updatedVolunteers));
  };

  const handleSaveDonations = (updatedDonations: DonationRecord[]) => {
    setDonations(updatedDonations);
    localStorage.setItem('genzicon_admin_donations', JSON.stringify(updatedDonations));
  };

  const handleSaveContacts = (updatedContacts: ContactMessage[]) => {
    setContacts(updatedContacts);
    localStorage.setItem('genzicon_contacts', JSON.stringify(updatedContacts));
  };

  // Auth Handling
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      // 1. Attempt DRF backend login
      await apiAdminLogin(loginEmail, loginPassword);
      setIsAuthenticated(true);
      return;
    } catch (err: any) {
      console.warn('DRF live login attempt:', err.message);
    }

    // 2. Fallback to local administrative credentials
    if (
      (loginEmail.trim().toLowerCase() === 'admin@genzicon.org' || loginEmail.trim().toLowerCase() === 'admin' || loginEmail.trim().toLowerCase() === 'admin@genzicon.com') &&
      loginPassword === 'admin123'
    ) {
      setIsAuthenticated(true);
      localStorage.setItem('genzicon_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Please enter admin@genzicon.org and admin123');
    }
  };

  const handleLogout = () => {
    apiAdminLogout();
    setIsAuthenticated(false);
  };

  // Pending counts for badges
  const pendingClothesCount = clothesDonations.filter(c => c.status === 'Pending' || c.status === 'Scheduled').length;
  const pendingVolunteersCount = volunteers.filter(v => v.status === 'Pending').length;
  const pendingDonationsCount = donations.filter(d => d.status === 'Pending').length;
  const newContactsCount = contacts.filter(c => c.status === 'New').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f4f7fc] flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white border border-[#d8e3fb] p-6 shadow-sm">
          <div className="text-center mb-5">
            <div className="w-10 h-10 bg-[#003c90] text-white mx-auto flex items-center justify-center font-bold text-base mb-2.5">
              G
            </div>
            <h2 className="text-base font-bold text-[#111c2d]">
              Admin Portal Sign In
            </h2>
            <p className="text-xs text-[#737784] mt-0.5">
              Genzicon Foundation Nepal
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-[#434653] uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="text"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@genzicon.org"
                className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#434653] uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737784] hover:text-[#111c2d]"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#003c90] hover:bg-[#002660] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-4 pt-3 border-t border-[#f0f3ff] flex items-center justify-between text-[11px] text-[#737784]">
            <div className="flex items-center gap-1 font-mono text-[10px]">
              <KeyRound className="w-3 h-3 text-[#003c90]" />
              <span>admin@genzicon.org / admin123</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoginEmail('admin@genzicon.org');
                setLoginPassword('admin123');
              }}
              className="px-2 py-0.5 bg-[#f0f4ff] hover:bg-[#e0e8ff] text-[#003c90] text-[10px] font-bold"
            >
              Auto-Fill
            </button>
          </div>

          {onNavigateHome && (
            <div className="mt-4 text-center">
              <button
                onClick={onNavigateHome}
                className="text-xs text-[#737784] hover:text-[#003c90] inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Return to Public Site</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fc] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        {/* Header with Navigation Tabs */}
        <AdminHeader
          language={language}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          onViewPublicSite={onViewPublicSite || onNavigateHome}
          pendingClothesCount={pendingClothesCount}
          pendingVolunteersCount={pendingVolunteersCount}
          pendingDonationsCount={pendingDonationsCount}
          newContactsCount={newContactsCount}
        />

        {/* Tab Content Router */}
        {activeTab === 'overview' && (
          <AdminOverviewTab
            language={language}
            siteContent={siteContent}
            projects={projects}
            clothesDonations={clothesDonations}
            volunteers={volunteers}
            donations={donations}
            contacts={contacts}
            setActiveTab={setActiveTab}
            onOpenAddProjectModal={() => {
              setActiveTab('projects');
              setOpenAddProjectModal(true);
            }}
          />
        )}

        {activeTab === 'content' && (
          <AdminContentTab
            language={language}
            siteContent={siteContent}
            onSaveContent={handleSaveSiteContent}
          />
        )}

        {activeTab === 'projects' && (
          <AdminProjectsTab
            language={language}
            projects={projects}
            onSaveProjects={handleSaveProjects}
            showAddModalDirectly={openAddProjectModal}
            onCloseAddModalDirectly={() => setOpenAddProjectModal(false)}
          />
        )}

        {activeTab === 'clothes' && (
          <AdminClothesTab
            language={language}
            clothesDonations={clothesDonations}
            onSaveClothesDonations={handleSaveClothesDonations}
          />
        )}

        {activeTab === 'volunteers' && (
          <AdminVolunteersTab
            language={language}
            volunteers={volunteers}
            onSaveVolunteers={handleSaveVolunteers}
          />
        )}

        {activeTab === 'donations' && (
          <AdminDonationsTab
            language={language}
            donations={donations}
            onSaveDonations={handleSaveDonations}
          />
        )}

        {activeTab === 'contacts' && (
          <AdminContactsTab
            language={language}
            contacts={contacts}
            onSaveContacts={handleSaveContacts}
          />
        )}

        {activeTab === 'settings' && (
          <AdminSettingsTab
            language={language}
            bankQrConfig={bankQrConfig}
            onSaveBankQrConfig={handleSaveBankQrConfig}
          />
        )}
      </div>
    </div>
  );
};

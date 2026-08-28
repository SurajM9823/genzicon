import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { ClothesBankScreen } from './components/ClothesBankScreen';
import { PillarsScreen } from './components/PillarsScreen';
import { VolunteerScreen } from './components/VolunteerScreen';
import { DonateScreen } from './components/DonateScreen';
import { ContactScreen } from './components/ContactScreen';
import { AdminScreen } from './components/AdminScreen';
import { FloatingSocialSidebar } from './components/FloatingSocialSidebar';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { DonationReceiptModal } from './components/DonationReceiptModal';
import { VolunteerSuccessModal } from './components/VolunteerSuccessModal';
import { NavTab, Project, DonationSubmission, VolunteerFormData, Language } from './types';

// Helper to parse path from pathname or legacy hash
function getTabFromUrl(): NavTab {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (path === 'admin' || path === 'login') return 'admin';
  if (path === 'donate') return 'donate';
  if (path === 'volunteer') return 'volunteer';
  if (path === 'clothes-bank' || path === 'clothes') return 'clothes-bank';
  if (path === 'initiatives' || path === 'projects') return 'initiatives';
  if (path === 'contact' || path === 'about') return 'contact';

  // Fallback check for any legacy hash in URL
  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (hash === 'admin' || hash === 'login') return 'admin';
  if (hash === 'donate') return 'donate';
  if (hash === 'volunteer') return 'volunteer';
  if (hash === 'clothes-bank' || hash === 'clothes') return 'clothes-bank';
  if (hash === 'initiatives' || hash === 'projects') return 'initiatives';
  if (hash === 'contact' || hash === 'about') return 'contact';

  return 'impact';
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>(getTabFromUrl);

  const [language, setLanguage] = useState<Language>('en');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeProjectDetail, setActiveProjectDetail] = useState<Project | null>(null);
  const [lastDonation, setLastDonation] = useState<DonationSubmission | null>(null);
  const [volunteerSuccessData, setVolunteerSuccessData] = useState<VolunteerFormData | null>(null);

  // Sync with browser back/forward buttons (popstate) and hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentTab(getTabFromUrl());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    const targetPath = tab === 'impact' ? '/' : `/${tab}`;
    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDonate = (project?: Project) => {
    if (project) {
      setSelectedProject(project);
    } else {
      setSelectedProject(null);
    }
    handleSelectTab('donate');
  };

  const handleOpenProjectDetail = (project: Project) => {
    setActiveProjectDetail(project);
  };

  const handleDonateComplete = (submission: DonationSubmission) => {
    setLastDonation(submission);
  };

  const handleVolunteerSuccess = (data: VolunteerFormData) => {
    setVolunteerSuccessData(data);
  };

  const isAdmin = currentTab === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff] text-[#111c2d] relative">
      {/* Floating Left-Side WhatsApp & Facebook NGO Quick Connect Dock (Public site only) */}
      {!isAdmin && <FloatingSocialSidebar />}

      {/* Fixed Sticky Header Navigation (Public site only) */}
      {!isAdmin && (
        <Navbar
          currentTab={currentTab}
          language={language}
          onSelectTab={handleSelectTab}
          onOpenDonate={() => handleOpenDonate()}
        />
      )}

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full">
        {currentTab === 'impact' && (
          <HomeScreen
            language={language}
            onSelectTab={handleSelectTab}
            onOpenProjectDetail={handleOpenProjectDetail}
            onQuickDonateProject={handleOpenDonate}
          />
        )}

        {currentTab === 'clothes-bank' && (
          <ClothesBankScreen
            language={language}
            onOpenDonateModal={() => handleOpenDonate()}
            onNavigateToVolunteer={() => handleSelectTab('volunteer')}
          />
        )}

        {(currentTab === 'initiatives' || currentTab === 'projects') && (
          <PillarsScreen
            language={language}
            onNavigateToClothesBank={() => handleSelectTab('clothes-bank')}
            onOpenDonateModal={() => handleOpenDonate()}
            onNavigateToVolunteer={() => handleSelectTab('volunteer')}
          />
        )}

        {(currentTab === 'contact' || currentTab === 'about') && (
          <ContactScreen
            language={language}
            onSelectTab={handleSelectTab}
          />
        )}

        {currentTab === 'volunteer' && (
          <VolunteerScreen
            language={language}
            onSuccess={handleVolunteerSuccess}
          />
        )}

        {currentTab === 'donate' && (
          <DonateScreen
            language={language}
            selectedProject={selectedProject}
            onDonateComplete={handleDonateComplete}
          />
        )}

        {currentTab === 'admin' && (
          <AdminScreen
            language={language}
            onNavigateHome={() => handleSelectTab('impact')}
            onViewPublicSite={() => handleSelectTab('impact')}
          />
        )}
      </main>

      {/* Footer (Public site only) */}
      {!isAdmin && (
        <Footer
          language={language}
          onSelectTab={handleSelectTab}
        />
      )}

      {/* Interactive Modals */}
      <ProjectDetailModal
        project={activeProjectDetail}
        language={language}
        onClose={() => setActiveProjectDetail(null)}
        onDonate={(p) => {
          setActiveProjectDetail(null);
          handleOpenDonate(p);
        }}
      />

      <DonationReceiptModal
        donation={lastDonation}
        language={language}
        onClose={() => setLastDonation(null)}
      />

      <VolunteerSuccessModal
        data={volunteerSuccessData}
        language={language}
        onClose={() => setVolunteerSuccessData(null)}
      />
    </div>
  );
}

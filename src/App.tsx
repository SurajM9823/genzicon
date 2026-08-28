import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { ClothesBankScreen } from './components/ClothesBankScreen';
import { ProgramsScreen } from './components/ProgramsScreen';
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
function parseUrlState(): { tab: NavTab; slug: string | null } {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  
  if (path === 'admin' || path === 'login') return { tab: 'admin', slug: null };
  if (path === 'donate') return { tab: 'donate', slug: null };
  if (path === 'volunteer') return { tab: 'volunteer', slug: null };
  if (path === 'clothes-bank' || path === 'clothes') return { tab: 'clothes-bank', slug: null };
  
  if (path.startsWith('programs/') || path.startsWith('projects/') || path.startsWith('initiatives/')) {
    const parts = path.split('/');
    return { tab: 'programs', slug: parts[1] || null };
  }

  if (path === 'programs' || path === 'initiatives' || path === 'projects') {
    return { tab: 'programs', slug: null };
  }

  if (path === 'contact' || path === 'about') return { tab: 'contact', slug: null };

  // Fallback check for any legacy hash in URL
  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (hash === 'admin' || hash === 'login') return { tab: 'admin', slug: null };
  if (hash === 'donate') return { tab: 'donate', slug: null };
  if (hash === 'volunteer') return { tab: 'volunteer', slug: null };
  if (hash === 'clothes-bank' || hash === 'clothes') return { tab: 'clothes-bank', slug: null };
  if (hash === 'programs' || hash === 'initiatives' || hash === 'projects') return { tab: 'programs', slug: null };
  if (hash === 'contact' || hash === 'about') return { tab: 'contact', slug: null };

  return { tab: 'impact', slug: null };
}

export default function App() {
  const [urlState, setUrlState] = useState<{ tab: NavTab; slug: string | null }>(parseUrlState);
  const currentTab = urlState.tab;
  const selectedSlug = urlState.slug;

  const [language, setLanguage] = useState<Language>('en');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeProjectDetail, setActiveProjectDetail] = useState<Project | null>(null);
  const [lastDonation, setLastDonation] = useState<DonationSubmission | null>(null);
  const [volunteerSuccessData, setVolunteerSuccessData] = useState<VolunteerFormData | null>(null);

  // Sync with browser back/forward buttons (popstate) and hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      setUrlState(parseUrlState());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleSelectTab = (tab: NavTab) => {
    setUrlState({ tab, slug: null });
    const targetPath = tab === 'impact' ? '/' : `/${tab}`;
    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProgramSlug = (project: Project) => {
    const slug = project.slug || project.id || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setUrlState({ tab: 'programs', slug });
    window.history.pushState(null, '', `/programs/${slug}`);
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
    handleOpenProgramSlug(project);
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
            onOpenProjectDetail={handleOpenProgramSlug}
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

        {(currentTab === 'initiatives' || currentTab === 'projects' || currentTab === 'programs') && (
          <ProgramsScreen
            language={language}
            selectedSlug={selectedSlug}
            onSelectProgram={(proj) => setSelectedProject(proj)}
            onOpenDonateModal={(proj) => handleOpenDonate(proj)}
            onNavigateToVolunteer={() => handleSelectTab('volunteer')}
            onNavigateToClothesBank={() => handleSelectTab('clothes-bank')}
            onBackToProgramsList={() => setUrlState({ tab: 'programs', slug: null })}
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

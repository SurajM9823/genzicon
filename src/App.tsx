import React, { useState } from 'react';
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

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('impact');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeProjectDetail, setActiveProjectDetail] = useState<Project | null>(null);
  const [lastDonation, setLastDonation] = useState<DonationSubmission | null>(null);
  const [volunteerSuccessData, setVolunteerSuccessData] = useState<VolunteerFormData | null>(null);

  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDonate = (project?: Project) => {
    if (project) {
      setSelectedProject(project);
    } else {
      setSelectedProject(null);
    }
    setCurrentTab('donate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff] text-[#111c2d] relative">
      {/* Floating Left-Side WhatsApp & Facebook NGO Quick Connect Dock */}
      <FloatingSocialSidebar />

      {/* Fixed Sticky Header Navigation */}
      <Navbar
        currentTab={currentTab}
        language={language}
        onSelectTab={handleSelectTab}
        onOpenDonate={() => handleOpenDonate()}
      />

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
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onSelectTab={handleSelectTab}
      />

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

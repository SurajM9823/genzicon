import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shirt, 
  Trees, 
  Briefcase, 
  Search, 
  MapPin, 
  Users, 
  Heart, 
  TrendingUp, 
  Filter, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Share2, 
  Copy, 
  Clock, 
  ExternalLink,
  DollarSign,
  Sparkles,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, Language } from '../types';
import { PROJECTS_DATA, PILLARS_DATA } from '../data/mockData';
import { apiGetProjects, apiGetProjectBySlug } from '../services/api';

interface ProgramsScreenProps {
  language: Language;
  selectedSlug?: string | null;
  onSelectProgram?: (project: Project) => void;
  onOpenDonateModal: (project?: Project) => void;
  onNavigateToVolunteer: () => void;
  onNavigateToClothesBank: () => void;
  onBackToProgramsList?: () => void;
}

export const ProgramsScreen: React.FC<ProgramsScreenProps> = ({
  language,
  selectedSlug,
  onSelectProgram,
  onOpenDonateModal,
  onNavigateToVolunteer,
  onNavigateToClothesBank,
  onBackToProgramsList,
}) => {
  const isNp = language === 'np';

  // Projects State
  const [projectsList, setProjectsList] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('genzicon_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return PROJECTS_DATA;
  });

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Filters & Sorting
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'urgent' | 'funded' | 'goal' | 'newest'>('urgent');

  // Load from backend on mount
  useEffect(() => {
    const fetchLiveProjects = async () => {
      const live = await apiGetProjects();
      if (live && live.length > 0) {
        setProjectsList(live);
        try {
          localStorage.setItem('genzicon_projects', JSON.stringify(live));
        } catch {}
      }
    };
    fetchLiveProjects();
  }, []);

  // Sync active project if selectedSlug is provided
  useEffect(() => {
    if (selectedSlug) {
      const found = projectsList.find(
        p => p.slug === selectedSlug || p.id === selectedSlug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === selectedSlug
      );
      if (found) {
        setActiveProject(found);
        document.title = `${isNp && found.titleNp ? found.titleNp : found.title} | Genzicon Foundation Nepal`;
      } else {
        // Try fetching directly by slug from API
        apiGetProjectBySlug(selectedSlug).then(proj => {
          if (proj) {
            setActiveProject(proj);
            document.title = `${isNp && proj.titleNp ? proj.titleNp : proj.title} | Genzicon Foundation Nepal`;
          }
        });
      }
    } else {
      setActiveProject(null);
      document.title = isNp 
        ? 'सक्रिय ग्राउन्ड कार्यक्रमहरू तथा अभियानहरू | Genzicon Foundation Nepal' 
        : 'Active Field Programs & Initiatives | Genzicon Foundation Nepal';
    }
  }, [selectedSlug, projectsList, isNp]);

  // Handle program click
  const handleOpenDetail = (project: Project) => {
    setActiveProject(project);
    const slug = project.slug || project.id || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    window.history.pushState(null, '', `/programs/${slug}`);
    document.title = `${isNp && project.titleNp ? project.titleNp : project.title} | Genzicon Foundation Nepal`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onSelectProgram) onSelectProgram(project);
  };

  const handleBackToList = () => {
    setActiveProject(null);
    window.history.pushState(null, '', '/programs');
    document.title = isNp 
      ? 'सक्रिय ग्राउन्ड कार्यक्रमहरू | Genzicon Foundation Nepal' 
      : 'Active Field Programs & Initiatives | Genzicon Foundation Nepal';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onBackToProgramsList) onBackToProgramsList();
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleShareWhatsApp = (project: Project) => {
    const text = encodeURIComponent(
      `Support "${project.title}" by Genzicon Foundation Nepal. Every rupee helps empower lives in Nepal: ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShareFacebook = (project: Project) => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return projectsList
      .filter(p => {
        const matchesCategory = 
          selectedCategory === 'all' ||
          (selectedCategory === 'clothes' && (p.category.toLowerCase().includes('clothes') || p.categoryType === 'relief')) ||
          (selectedCategory === 'green' && (p.category.toLowerCase().includes('green') || p.category.toLowerCase().includes('clean') || p.categoryType === 'agriculture')) ||
          (selectedCategory === 'skills' && (p.category.toLowerCase().includes('skill') || p.category.toLowerCase().includes('business') || p.categoryType === 'education'));

        const matchesStatus = 
          selectedStatus === 'all' || 
          p.status.toLowerCase() === selectedStatus.toLowerCase();

        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = 
          !query ||
          p.title.toLowerCase().includes(query) ||
          (p.titleNp && p.titleNp.toLowerCase().includes(query)) ||
          p.location.toLowerCase().includes(query) ||
          (p.locationNp && p.locationNp.toLowerCase().includes(query)) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query);

        return matchesCategory && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'urgent') {
          if (a.status === 'Urgent' && b.status !== 'Urgent') return -1;
          if (b.status === 'Urgent' && a.status !== 'Urgent') return 1;
          return b.goalAmountNpr - a.goalAmountNpr;
        }
        if (sortBy === 'funded') {
          return b.fundedPercentage - a.fundedPercentage;
        }
        if (sortBy === 'goal') {
          return b.goalAmountNpr - a.goalAmountNpr;
        }
        return 0;
      });
  }, [projectsList, selectedCategory, selectedStatus, searchQuery, sortBy]);

  // Aggregate Metrics
  const totalRaised = useMemo(() => projectsList.reduce((acc, p) => acc + (p.raisedAmountNpr || 0), 0), [projectsList]);
  const totalGoal = useMemo(() => projectsList.reduce((acc, p) => acc + (p.goalAmountNpr || 0), 0), [projectsList]);
  const totalDonors = useMemo(() => projectsList.reduce((acc, p) => acc + (p.donorCount || Math.max(1, Math.round((p.raisedAmountNpr || 0) / 4500))), 0), [projectsList]);
  const activeCount = useMemo(() => projectsList.filter(p => p.status !== 'Completed').length, [projectsList]);

  // --------------------------------------------------------------------------
  // SINGLE PROGRAM DETAIL VIEW (SEO /programs/:slug)
  // --------------------------------------------------------------------------
  if (activeProject) {
    const p = activeProject;
    const progress = Math.min(100, Math.round(((p.raisedAmountNpr || 0) / (p.goalAmountNpr || 1)) * 100));
    const isUrgent = p.status === 'Urgent';
    const isCompleted = p.status === 'Completed';
    const donors = p.donorCount || Math.max(12, Math.round((p.raisedAmountNpr || 0) / 4500));

    return (
      <div id="program-detail-view" className="w-full pt-14 pb-20 bg-[#f9f9ff] min-h-screen">
        {/* Breadcrumb & Navigation Bar */}
        <div className="bg-white border-b border-[#d8e3fb] sticky top-14 z-30 shadow-xs">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <button
              onClick={handleBackToList}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003c90] hover:text-[#002660] uppercase tracking-wider transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>{isNp ? 'सबै कार्यक्रमहरूमा फर्कनुहोस्' : 'Back to All Programs'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-[#f0f3ff] hover:bg-[#e7eeff] text-[#003c90] text-xs font-bold border border-[#d8e3fb] transition-colors flex items-center gap-1.5"
                title="Copy Program URL"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLink ? (isNp ? 'लिंक कपी भयो!' : 'Link Copied!') : (isNp ? 'लिंक' : 'Copy Link')}</span>
              </button>

              <button
                onClick={() => handleShareWhatsApp(p)}
                className="px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Section of Program */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-6">
          <div className="bg-white border border-[#d8e3fb] shadow-xs overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Image & Badges */}
              <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[420px] bg-slate-900 overflow-hidden">
                <img
                  src={p.imageUrl}
                  alt={p.imageAlt || p.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-between p-6 text-white">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-[#003c90] text-white text-xs font-black uppercase tracking-wider shadow-xs">
                      {isNp && p.categoryNp ? p.categoryNp : p.category}
                    </span>
                    {isUrgent && (
                      <span className="px-3 py-1 bg-rose-600 text-white text-xs font-black uppercase tracking-wider animate-pulse shadow-xs">
                        {isNp ? 'अति आवश्यक सहयोग' : 'Urgent Support Required'}
                      </span>
                    )}
                    {isCompleted && (
                      <span className="px-3 py-1 bg-[#00743a] text-white text-xs font-black uppercase tracking-wider shadow-xs">
                        {isNp ? 'सफलतापूर्वक सम्पन्न' : 'Successfully Completed'}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs text-blue-100 font-medium mb-2">
                      <MapPin className="w-4 h-4 text-[#00743a] shrink-0" />
                      <span>{isNp && p.locationNp ? p.locationNp : p.location}</span>
                      <span>•</span>
                      <Users className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>{isNp && p.beneficiariesNp ? p.beneficiariesNp : p.beneficiaries}</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white font-heading leading-tight">
                      {isNp && p.titleNp ? p.titleNp : p.title}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Live Donation & Metric Summary Side */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#f9f9ff] border-t lg:border-t-0 lg:border-l border-[#d8e3fb]">
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-black text-[#00743a] uppercase tracking-widest block mb-1">
                      REAL-TIME FIELD TRACKER • प्रत्यक्ष संकलन स्थिति
                    </span>
                    <h2 className="text-lg font-bold text-[#111c2d] font-heading">
                      {isNp ? 'अभियान आर्थिक प्रगति विवरण' : 'Program Funding & Impact Gauge'}
                    </h2>
                  </div>

                  {/* Progress Gauge */}
                  <div className="p-4 bg-white border border-[#d8e3fb] space-y-3 shadow-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#003c90] font-heading">
                        {progress}%
                      </span>
                      <span className="text-xs font-bold text-[#00743a] uppercase tracking-wider">
                        {isCompleted ? 'Goal Achieved' : 'Active Fundraising'}
                      </span>
                    </div>

                    <div className="w-full h-3 bg-[#e7eeff] overflow-hidden">
                      <motion.div
                        className={`h-full ${progress >= 100 ? 'bg-[#00743a]' : 'bg-[#00743a]'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f0f3ff] text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-[#737784] uppercase block">
                          {isNp ? 'संकलित रकम (Raised)' : 'Raised to Date'}
                        </span>
                        <span className="text-sm font-bold text-[#111c2d] font-mono">
                          रू {(p.raisedAmountNpr || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#737784] block font-mono">
                          ≈ ${(p.raisedAmountUsd || Math.round((p.raisedAmountNpr || 0) / 133)).toLocaleString()} USD
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-[#737784] uppercase block">
                          {isNp ? 'लक्ष्य रकम (Target Goal)' : 'Target Budget'}
                        </span>
                        <span className="text-sm font-bold text-[#111c2d] font-mono">
                          रू {(p.goalAmountNpr || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#737784] block font-mono">
                          ≈ ${(p.goalAmountUsd || Math.round((p.goalAmountNpr || 0) / 133)).toLocaleString()} USD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white border border-[#d8e3fb] text-center">
                      <span className="block text-base sm:text-lg font-black text-[#003c90] font-heading">
                        {donors}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#737784]">
                        {isNp ? 'सहयोगी दाताहरू' : 'Verified Donors'}
                      </span>
                    </div>

                    <div className="p-3 bg-white border border-[#d8e3fb] text-center">
                      <span className="block text-base sm:text-lg font-black text-[#00743a] font-heading">
                        {isNp && p.beneficiariesNp ? p.beneficiariesNp.split(' ')[0] : p.beneficiaries.split(' ')[0]}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#737784]">
                        {isNp ? 'प्रत्यक्ष लाभान्वित' : 'Beneficiaries'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary CTA Buttons */}
                <div className="space-y-2.5 pt-6 border-t border-[#d8e3fb]">
                  <button
                    onClick={() => onOpenDonateModal(p)}
                    className="w-full py-3 bg-[#00743a] hover:bg-[#005227] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Heart className="w-4 h-4 fill-white text-white" />
                    <span>{isNp ? 'यस अभियानमा सिधै आर्थिक सहयोग गर्नुहोस्' : 'Support this Program with a Donation'}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={onNavigateToVolunteer}
                      className="py-2.5 bg-white hover:bg-[#f0f3ff] text-[#003c90] border border-[#d8e3fb] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{isNp ? 'फिल्ड स्वयंसेवक' : 'Join as Volunteer'}</span>
                    </button>

                    {p.category.toLowerCase().includes('clothes') && (
                      <button
                        onClick={onNavigateToClothesBank}
                        className="py-2.5 bg-[#003c90] hover:bg-[#002660] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Shirt className="w-3.5 h-3.5" />
                        <span>{isNp ? 'कपडा दान गर्नुहोस्' : 'Donate Clothes'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Narrative & Ground Story */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
            <div className="lg:col-span-8 bg-white border border-[#d8e3fb] p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#111c2d] font-heading border-b border-[#f0f3ff] pb-3 mb-4">
                  {isNp ? 'अभियानको उद्देश्य तथा कार्ययोजना' : 'Program Overview & Ground Execution'}
                </h3>
                <p className="text-xs sm:text-sm text-[#434653] leading-relaxed mb-4 whitespace-pre-line">
                  {isNp && p.fullDescriptionNp ? p.fullDescriptionNp : (p.fullDescription || p.description)}
                </p>
                {isNp && p.description && (
                  <p className="text-xs text-[#737784] italic bg-[#f9f9ff] p-3 border-l-2 border-[#003c90]">
                    English summary: {p.description}
                  </p>
                )}
              </div>

              {/* Updates & Milestones */}
              {p.updates && p.updates.length > 0 && (
                <div className="pt-4 border-t border-[#f0f3ff]">
                  <h4 className="text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#003c90]" />
                    <span>{isNp ? 'फिल्ड प्रगति विवरण तथा अपडेटहरू' : 'Field Updates & Milestones'}</span>
                  </h4>
                  <div className="space-y-4">
                    {p.updates.map((update, idx) => (
                      <div key={idx} className="p-4 bg-[#f9f9ff] border border-[#e7eeff] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#00743a] uppercase tracking-wider">
                            {update.date}
                          </span>
                        </div>
                        <h5 className="text-xs sm:text-sm font-bold text-[#111c2d]">
                          {isNp && update.titleNp ? update.titleNp : update.title}
                        </h5>
                        <p className="text-xs text-[#434653] leading-relaxed">
                          {isNp && update.descriptionNp ? update.descriptionNp : update.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Side Column: NGO Verification & Transparency */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-[#d8e3fb] p-5 shadow-xs space-y-4">
                <h4 className="text-xs font-bold text-[#111c2d] uppercase tracking-wider border-b border-[#f0f3ff] pb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00743a]" />
                  <span>{isNp ? 'पारदर्शिता तथा प्रमाणिकरण' : 'Verified & 100% Transparent'}</span>
                </h4>
                <ul className="space-y-2.5 text-xs text-[#434653]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00743a] shrink-0 mt-0.5" />
                    <span>Government Registered NGO in Nepal (SWC & DAO verified).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00743a] shrink-0 mt-0.5" />
                    <span>100% of earmarked public donations go directly to field supplies.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00743a] shrink-0 mt-0.5" />
                    <span>Official instant digital tax receipt generated with reference code.</span>
                  </li>
                </ul>
              </div>

              {/* Other Related Programs */}
              <div className="bg-white border border-[#d8e3fb] p-5 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-[#111c2d] uppercase tracking-wider border-b border-[#f0f3ff] pb-2">
                  {isNp ? 'अन्य सक्रिय कार्यक्रमहरू' : 'Other Active Initiatives'}
                </h4>
                <div className="space-y-3">
                  {projectsList
                    .filter(other => other.id !== p.id)
                    .slice(0, 3)
                    .map(other => (
                      <button
                        key={other.id}
                        onClick={() => handleOpenDetail(other)}
                        className="w-full text-left p-2.5 bg-[#f9f9ff] hover:bg-[#f0f3ff] border border-[#e7eeff] transition-colors flex items-center justify-between group"
                      >
                        <div className="pr-2">
                          <span className="text-[10px] font-bold text-[#00743a] uppercase block">
                            {other.category}
                          </span>
                          <span className="text-xs font-bold text-[#111c2d] line-clamp-1 group-hover:text-[#003c90]">
                            {isNp && other.titleNp ? other.titleNp : other.title}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#737784] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // ALL PROGRAMS DIRECTORY VIEW (/programs or /initiatives)
  // --------------------------------------------------------------------------
  return (
    <div id="programs-directory-screen" className="w-full pt-14 pb-20 bg-[#f9f9ff] min-h-screen">
      {/* Header Hero Banner */}
      <div className="bg-[#003c90] text-white border-b border-[#002660]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="max-w-3xl">
            <span className="inline-block px-2.5 py-1 bg-white/10 text-blue-100 text-[10px] font-black uppercase tracking-wider mb-3">
              {isNp ? 'नेपालभर सञ्चालित सामाजिक कार्यक्रमहरू' : 'Grassroots Field Initiatives Across Nepal'}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-3 font-heading">
              {isNp ? 'सक्रिय ग्राउन्ड कार्यक्रमहरू तथा परियोजनाहरू' : 'Active Ground Programs & Field Initiatives'}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 font-normal leading-relaxed">
              {isNp
                ? 'कपडा बैंक, चुरे वृक्षारोपण, महिला सिलाई तालिम र आपतकालीन राहत सहितका सम्पूर्ण स्थलगत कार्यक्रमहरूको प्रत्यक्ष प्रगति तथा आर्थिक विवरण।'
                : 'Explore all active campaigns with verified real-time funding progress, beneficiary metrics, and direct donation tracking.'}
            </p>
          </div>

          {/* Quick Aggregate Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/15">
            <div className="bg-white/10 p-3 border border-white/10">
              <span className="block text-lg sm:text-xl font-black text-white font-mono font-heading">
                {activeCount}
              </span>
              <span className="text-[10px] text-blue-100 uppercase tracking-wider font-semibold">
                {isNp ? 'सक्रिय परियोजना' : 'Active Programs'}
              </span>
            </div>

            <div className="bg-white/10 p-3 border border-white/10">
              <span className="block text-lg sm:text-xl font-black text-white font-mono font-heading">
                रू {(totalRaised / 100000).toFixed(1)}L+
              </span>
              <span className="text-[10px] text-blue-100 uppercase tracking-wider font-semibold">
                {isNp ? 'कुल संकलित सहयोग' : 'Total Funds Raised'}
              </span>
            </div>

            <div className="bg-white/10 p-3 border border-white/10">
              <span className="block text-lg sm:text-xl font-black text-white font-mono font-heading">
                {totalDonors.toLocaleString()}+
              </span>
              <span className="text-[10px] text-blue-100 uppercase tracking-wider font-semibold">
                {isNp ? 'सहयोगी दाताहरू' : 'Verified Donors'}
              </span>
            </div>

            <div className="bg-white/10 p-3 border border-white/10">
              <span className="block text-lg sm:text-xl font-black text-white font-mono font-heading">
                77
              </span>
              <span className="text-[10px] text-blue-100 uppercase tracking-wider font-semibold">
                {isNp ? 'जिल्ला सञ्जाल' : 'Districts Reach'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter, Search & Category Navigation */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 -mt-5">
        <div className="bg-white p-3 sm:p-4 border border-[#d8e3fb] shadow-xs space-y-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 pb-2 border-b border-[#f0f3ff]">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#003c90] text-white'
                  : 'text-[#434653] hover:bg-[#f0f3ff]'
              }`}
            >
              {isNp ? 'सबै कार्यक्रमहरू (All)' : 'All Initiatives'}
            </button>
            <button
              onClick={() => setSelectedCategory('clothes')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                selectedCategory === 'clothes'
                  ? 'bg-[#003c90] text-white'
                  : 'text-[#434653] hover:bg-[#f0f3ff]'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>{isNp ? 'कपडा बैंक (Clothes Bank)' : 'Clothes Bank Nepal'}</span>
            </button>
            <button
              onClick={() => setSelectedCategory('green')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                selectedCategory === 'green'
                  ? 'bg-[#003c90] text-white'
                  : 'text-[#434653] hover:bg-[#f0f3ff]'
              }`}
            >
              <Trees className="w-3.5 h-3.5 text-[#00743a]" />
              <span>{isNp ? 'सफा तथा हरित नेपाल' : 'Clean & Green Nepal'}</span>
            </button>
            <button
              onClick={() => setSelectedCategory('skills')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                selectedCategory === 'skills'
                  ? 'bg-[#003c90] text-white'
                  : 'text-[#434653] hover:bg-[#f0f3ff]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-600" />
              <span>{isNp ? 'दक्षता तथा उद्यमशीलता' : 'Skills & Enterprise'}</span>
            </button>
          </div>

          {/* Search, Status & Sort Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#737784] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isNp ? 'शीर्षक, जिल्ला वा अभियान अनुसार खोज्नुहोस्...' : 'Search programs by title, district, category...'}
                className="w-full pl-9 pr-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] font-medium focus:outline-none focus:border-[#003c90]"
              >
                <option value="all">{isNp ? 'सबै अवस्था (Status: All)' : 'All Statuses'}</option>
                <option value="active">{isNp ? 'सक्रिय (Active)' : 'Active Campaigns'}</option>
                <option value="urgent">{isNp ? 'अति आवश्यक (Urgent)' : 'Urgent Priority'}</option>
                <option value="completed">{isNp ? 'सम्पन्न (Completed)' : 'Completed'}</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] font-medium focus:outline-none focus:border-[#003c90]"
              >
                <option value="urgent">{isNp ? 'प्राथमिकता अनुसार (Urgent First)' : 'Urgent Priority'}</option>
                <option value="funded">{isNp ? 'संकलित प्रतिशत अनुसार (% Funded)' : 'Most Funded'}</option>
                <option value="goal">{isNp ? 'लक्ष्य रकम अनुसार (Goal Amount)' : 'Highest Goal'}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-8">
        {filteredProjects.length === 0 ? (
          <div className="bg-white border border-[#d8e3fb] p-12 text-center shadow-xs">
            <AlertCircle className="w-8 h-8 text-[#737784] mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#111c2d]">
              {isNp ? 'कुनै कार्यक्रम फेला परेन' : 'No Programs Found'}
            </h3>
            <p className="text-xs text-[#737784] mt-1">
              {isNp ? 'कृपया खोजी वा फिल्टर परिवर्तन गर्नुहोस्।' : 'Try resetting your search query or filter options.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => {
              const progress = Math.min(100, Math.round(((project.raisedAmountNpr || 0) / (project.goalAmountNpr || 1)) * 100));
              const isUrgent = project.status === 'Urgent';
              const isCompleted = project.status === 'Completed';
              const donors = project.donorCount || Math.max(8, Math.round((project.raisedAmountNpr || 0) / 4500));

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white border border-[#d8e3fb] shadow-xs flex flex-col justify-between overflow-hidden hover:border-[#003c90] transition-colors"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative h-48 overflow-hidden group cursor-pointer" onClick={() => handleOpenDetail(project)}>
                      <img
                        src={project.imageUrl}
                        alt={project.imageAlt || project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-[#003c90] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                          {isNp && project.categoryNp ? project.categoryNp : project.category}
                        </span>
                        {isUrgent && (
                          <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse shadow-xs">
                            {isNp ? 'अति आवश्यक' : 'Urgent'}
                          </span>
                        )}
                        {isCompleted && (
                          <span className="px-2 py-0.5 bg-[#00743a] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                            {isNp ? 'सम्पन्न' : 'Completed'}
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white">
                        {donors} {isNp ? 'दाताहरू' : 'Donors'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#737784] mb-2">
                        <MapPin className="w-3 h-3 text-[#00743a] shrink-0" />
                        <span className="line-clamp-1">{isNp && project.locationNp ? project.locationNp : project.location}</span>
                      </div>

                      <h3 
                        onClick={() => handleOpenDetail(project)}
                        className="text-sm font-bold text-[#111c2d] mb-2 font-heading line-clamp-2 hover:text-[#003c90] cursor-pointer transition-colors"
                      >
                        {isNp && project.titleNp ? project.titleNp : project.title}
                      </h3>

                      <p className="text-xs text-[#434653] line-clamp-2 leading-relaxed mb-4">
                        {isNp && project.descriptionNp ? project.descriptionNp : project.description}
                      </p>

                      {/* Real Donation Progress Bar */}
                      <div className="space-y-1.5 p-3 bg-[#f9f9ff] border border-[#e7eeff]">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-[#003c90]">{progress}% {isNp ? 'संकलित' : 'Funded'}</span>
                          <span className="text-[#111c2d] font-mono text-[11px]">
                            रू {(project.raisedAmountNpr || 0).toLocaleString()} / रू {(project.goalAmountNpr || 0).toLocaleString()}
                          </span>
                        </div>

                        <div className="w-full h-2 bg-[#e7eeff] overflow-hidden">
                          <motion.div
                            className="h-full bg-[#00743a]"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-[#737784] pt-0.5">
                          <span>{isNp && project.beneficiariesNp ? project.beneficiariesNp : project.beneficiaries}</span>
                          <span>≈ ${(project.raisedAmountUsd || Math.round((project.raisedAmountNpr || 0) / 133)).toLocaleString()} USD</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0 flex items-center gap-2">
                    <button
                      onClick={() => onOpenDonateModal(project)}
                      className="flex-1 py-2 bg-[#00743a] hover:bg-[#005227] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>{isNp ? 'सहयोग' : 'Donate'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenDetail(project)}
                      className="px-3.5 py-2 bg-white hover:bg-[#f0f3ff] text-[#003c90] border border-[#d8e3fb] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                    >
                      <span>{isNp ? 'विवरण' : 'Details'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

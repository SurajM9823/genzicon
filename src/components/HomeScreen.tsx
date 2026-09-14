import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { 
  Shirt, 
  Trees, 
  Briefcase, 
  Heart, 
  ShieldCheck, 
  MapPin, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { IMPACT_STATS, PROJECTS_DATA, DEFAULT_SITE_CONTENT } from '../data/mockData';
import { Project, NavTab, Language, SiteContentConfig } from '../types';
import { apiGetSiteContent, apiGetProjects } from '../services/api';
import { HeroMediaRenderer } from './HeroMediaRenderer';
import { FilmstripGallery } from './FilmstripGallery';

interface HomeScreenProps {
  language: Language;
  onSelectTab: (tab: NavTab) => void;
  onOpenProjectDetail: (project: Project) => void;
  onQuickDonateProject: (project: Project) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  onSelectTab,
  onOpenProjectDetail,
  onQuickDonateProject
}) => {
  const isNp = language === 'np';

  // Dynamic Site Content & Projects from Admin CMS
  const [siteContent, setSiteContent] = useState<SiteContentConfig>(() => {
    try {
      const saved = localStorage.getItem('genzicon_site_content');
      return saved ? JSON.parse(saved) : DEFAULT_SITE_CONTENT;
    } catch {
      return DEFAULT_SITE_CONTENT;
    }
  });

  const [projectsList, setProjectsList] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('genzicon_admin_projects');
      return saved ? JSON.parse(saved) : PROJECTS_DATA;
    } catch {
      return PROJECTS_DATA;
    }
  });

  // Carousel Slides & Image Index
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const activeSlides = siteContent.heroSlides && siteContent.heroSlides.length > 0
    ? siteContent.heroSlides
    : (siteContent.heroImages && siteContent.heroImages.length > 0
        ? siteContent.heroImages.map((img, idx) => ({
            id: `slide-${idx}`,
            title: siteContent.heroTitle,
            titleNp: siteContent.heroTitleNp,
            subtitle: siteContent.heroSubtitle,
            subtitleNp: siteContent.heroSubtitleNp,
            tag: siteContent.heroBannerTag,
            tagNp: siteContent.heroBannerTagNp,
            imageUrl: img,
          }))
        : [{
            id: 'slide-0',
            title: siteContent.heroTitle,
            titleNp: siteContent.heroTitleNp,
            subtitle: siteContent.heroSubtitle,
            subtitleNp: siteContent.heroSubtitleNp,
            tag: siteContent.heroBannerTag,
            tagNp: siteContent.heroBannerTagNp,
            imageUrl: siteContent.heroImageUrl || 'https://genzicon.com/media/hero_slides/ChatGPT_Image_Sep_7_2026_10_26_42_PM_xY6nbh0.avif',
          }]
      );

  const currentSlide = activeSlides[activeSlideIndex] || activeSlides[0];

  useEffect(() => {
    // Initial fetch from live backend API
    const loadFromApi = async () => {
      try {
        const [liveContent, liveProjects] = await Promise.all([
          apiGetSiteContent(),
          apiGetProjects(),
        ]);
        if (liveContent) {
          const mergedStats = (liveContent.impactStats && liveContent.impactStats.length > 0) 
            ? liveContent.impactStats 
            : DEFAULT_SITE_CONTENT.impactStats;

          const mergedContent = {
            ...DEFAULT_SITE_CONTENT,
            ...liveContent,
            heroSlides: liveContent.heroSlides,
            heroImages: liveContent.heroImages,
            impactStats: mergedStats,
          };

          setSiteContent(mergedContent);
          try {
            localStorage.setItem('genzicon_site_content', JSON.stringify(mergedContent));
          } catch {}
        }
        if (liveProjects && liveProjects.length > 0) {
          setProjectsList(liveProjects);
        }
      } catch (e) {
        console.warn('API fetch fallback in HomeScreen:', e);
      }
    };

    loadFromApi();

    const handleContentUpdate = () => {
      try {
        const saved = localStorage.getItem('genzicon_site_content');
        if (saved) setSiteContent(JSON.parse(saved));
        const savedProj = localStorage.getItem('genzicon_admin_projects');
        if (savedProj) setProjectsList(JSON.parse(savedProj));
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('genzicon_content_updated', handleContentUpdate);
    window.addEventListener('storage', handleContentUpdate);
    return () => {
      window.removeEventListener('genzicon_content_updated', handleContentUpdate);
      window.removeEventListener('storage', handleContentUpdate);
    };
  }, []);

  // Automatic Carousel rotation if multiple slides exist
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlideIndex(prev => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const featuredProjects = projectsList.slice(0, 3);
  
  // Hero Parallax Scroll Effect
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });
  const bgScale = useTransform(smoothProgress, [0, 1], [1, 1.05]);
  const bgY = useTransform(smoothProgress, [0, 1], [0, 60]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(smoothProgress, [0, 0.8], [0, 45]);
  const heroRotateX = useTransform(smoothProgress, [0, 0.8], [0, 8]);

  const DEFAULT_HERO_IMAGE = 'https://genzicon.com/media/hero_slides/ChatGPT_Image_Sep_7_2026_10_26_42_PM_xY6nbh0.avif';
  const rawHeroImg = currentSlide?.imageUrl || siteContent.heroImageUrl;
  const activeHeroImg = (!rawHeroImg || rawHeroImg.includes('photo-1544717305-2782549b5136'))
    ? DEFAULT_HERO_IMAGE
    : rawHeroImg;
  const activeFitMode = siteContent.heroImageFit || 'cover';

  return (
    <div id="home-screen" className="w-full bg-[#f9f9ff] overflow-x-hidden">
      {/* Hero Section with Generous Height & 3D Parallax */}
      <section 
        ref={heroRef}
        className="relative h-[78vh] min-h-[500px] lg:h-[84vh] max-h-[820px] w-full flex items-center justify-center overflow-hidden border-b border-[#d8e3fb] [perspective:1200px]"
      >
        {/* Parallax Background Image / Rive Animation with 3D Depth & Carousel Transition */}
        <motion.div 
          className="absolute inset-0 z-0 will-change-transform"
          style={{ scale: bgScale, y: bgY }}
        >
          <div key={activeHeroImg} className="w-full h-full transition-all duration-1000 ease-in-out">
            <HeroMediaRenderer
              mediaUrl={activeHeroImg}
              alt="Genzicon Foundation Community Work Nepal"
              className="w-full h-full"
              fitMode={activeFitMode}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/55 pointer-events-none" />
        </motion.div>

        {/* Carousel Indicators & Controls if multiple slides */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-4 z-20 flex items-center gap-1.5">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlideIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  activeSlideIndex === idx ? 'w-6 bg-emerald-400' : 'w-2 bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}

        {/* Hero Content - Clean, Minimal & Direct Action */}
        <motion.div 
          className="relative z-10 text-center px-4 sm:px-6 max-w-2xl mx-auto flex flex-col items-center justify-center pt-2 will-change-transform [transform-style:preserve-3d]"
          style={{
            opacity: heroOpacity,
            y: heroY,
            rotateX: heroRotateX
          }}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge Tag */}
          {(currentSlide.tag || siteContent.heroBannerTag) && (
            <motion.div
              key={`tag-${activeSlideIndex}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 mb-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/15 text-emerald-300 border border-white/20 backdrop-blur-md"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>
                {isNp
                  ? (currentSlide.tagNp || siteContent.heroBannerTagNp || currentSlide.tag || siteContent.heroBannerTag)
                  : (currentSlide.tag || siteContent.heroBannerTag)}
              </span>
            </motion.div>
          )}

          {/* Action-Oriented Hero Title */}
          <motion.h1
            key={`title-${activeSlideIndex}`}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight font-heading"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isNp ? (currentSlide.titleNp || currentSlide.title || siteContent.heroTitleNp || siteContent.heroTitle) : (currentSlide.title || siteContent.heroTitle)}
          </motion.h1>

          <motion.p 
            key={`subtitle-${activeSlideIndex}`}
            className="text-xs sm:text-sm text-white/90 mb-6 max-w-lg font-normal leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {isNp
              ? (currentSlide.subtitleNp || currentSlide.subtitle || siteContent.heroSubtitleNp || siteContent.heroSubtitle)
              : (currentSlide.subtitle || siteContent.heroSubtitle)}
          </motion.p>

          {/* Action CTAs with subtle 3D lift */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <motion.button
              id="hero-clothes-bank-btn"
              onClick={() => onSelectTab('clothes-bank')}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ y: 0, scale: 0.98 }}
              className="bg-[#003c90] hover:bg-[#002660] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 transition-colors shadow-md flex items-center justify-center gap-2 border border-blue-400/40"
            >
              <Shirt className="w-4 h-4 text-emerald-400" />
              <span>{isNp ? 'कपडा बैंक पोर्टल' : 'Clothes Bank Portal'}</span>
            </motion.button>

            <motion.button
              id="hero-donate-btn"
              onClick={() => onSelectTab('donate')}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ y: 0, scale: 0.98 }}
              className="bg-[#00743a] hover:bg-[#005227] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 transition-colors shadow-md flex items-center justify-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-white text-white" />
              <span>{isNp ? 'सहयोग गर्नुहोस्' : 'Donate Funds'}</span>
            </motion.button>

            <motion.button
              id="hero-volunteer-btn"
              onClick={() => onSelectTab('volunteer')}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ y: 0, scale: 0.98 }}
              className="bg-white hover:bg-slate-100 text-[#003c90] text-xs font-bold uppercase tracking-wider px-5 py-3 transition-colors shadow-md flex items-center justify-center gap-1.5"
            >
              <span>{isNp ? 'स्वयंसेवक' : 'Join Volunteer'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Streamlined Impact Counters: Sleek, Modern 3D Cards */}
      <section className="py-10 bg-white px-4 sm:px-6 border-b border-[#d8e3fb] [perspective:1000px]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {(siteContent.impactStats || IMPACT_STATS).map((stat, index) => {
            const getIcon = () => {
              switch (stat.id) {
                case 'clothes':
                  return <Shirt className="w-4 h-4 text-[#003c90]" />;
                case 'green':
                  return <Trees className="w-4 h-4 text-[#00743a]" />;
                case 'skills':
                  return <Briefcase className="w-4 h-4 text-amber-600" />;
                default:
                  return <Heart className="w-4 h-4 text-[#003c90]" />;
              }
            };

            const getAccentBg = () => {
              switch (stat.id) {
                case 'clothes':
                  return 'bg-[#e7eeff] border-blue-200';
                case 'green':
                  return 'bg-emerald-50 border-emerald-200';
                case 'skills':
                  return 'bg-amber-50 border-amber-200';
                default:
                  return 'bg-indigo-50 border-indigo-200';
              }
            };

            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30, rotateX: 16 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ 
                  y: -6, 
                  rotateX: 3, 
                  rotateY: -1,
                  boxShadow: "0 16px 30px -10px rgba(0, 60, 144, 0.12)",
                  transition: { duration: 0.2 } 
                }}
                className="relative p-5 bg-[#f9f9ff] border border-[#d8e3fb] hover:border-[#003c90] flex flex-col justify-center transition-all transform-gpu shadow-xs"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 flex items-center justify-center border ${getAccentBg()}`}>
                    {getIcon()}
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-[#737784]">
                    Verified Impact
                  </span>
                </div>

                <div
                  className={`text-2xl sm:text-3xl font-black mb-1 tracking-tight ${
                    stat.color === 'primary' ? 'text-[#003c90]' : 'text-[#00743a]'
                  }`}
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {stat.number}
                </div>

                <div className="text-xs font-bold tracking-wide uppercase text-[#111c2d]">
                  {isNp && stat.labelNp ? stat.labelNp : stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Cinematic Filmstrip Gallery: Moments from the Ground & Achievements */}
      <FilmstripGallery language={language} scenes={siteContent.filmstripScenes} />

      {/* 3 Core Pillars: Clean Modern Hexagons */}
      <section id="pillars-summary-section" className="py-8 sm:py-12 px-4 sm:px-6 bg-[#f9f9ff] border-b border-[#d8e3fb]">
        <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          
          {/* Hexagon 1: Clothes Bank Nepal */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            whileHover={{ y: -6, scale: 1.03 }}
            onClick={() => onSelectTab('clothes-bank')}
            className="group relative w-52 h-60 sm:w-60 sm:h-68 flex items-center justify-center cursor-pointer select-none drop-shadow-sm hover:drop-shadow-xl transition-all duration-300"
          >
            <svg 
              viewBox="0 0 200 230" 
              className="absolute inset-0 w-full h-full filter transition-all duration-300"
            >
              <polygon 
                points="100,4 196,59 196,171 100,226 4,171 4,59"
                className="fill-white stroke-[#d8e3fb] group-hover:stroke-[#003c90] group-hover:fill-blue-50/30 transition-all duration-300"
                strokeWidth="2.5"
              />
            </svg>

            <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#e7eeff] text-[#003c90] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-xs border border-blue-200/50">
                <Shirt className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#111c2d] font-heading tracking-tight group-hover:text-[#003c90] transition-colors max-w-[140px] sm:max-w-[160px] leading-snug">
                {isNp ? 'कपडा बैंक नेपाल' : 'Clothes Bank Nepal'}
              </h3>
            </div>
          </motion.div>

          {/* Hexagon 2: Clean Nepal, Green Nepal */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ y: -6, scale: 1.03 }}
            onClick={() => onSelectTab('initiatives')}
            className="group relative w-52 h-60 sm:w-60 sm:h-68 flex items-center justify-center cursor-pointer select-none drop-shadow-sm hover:drop-shadow-xl transition-all duration-300"
          >
            <svg 
              viewBox="0 0 200 230" 
              className="absolute inset-0 w-full h-full filter transition-all duration-300"
            >
              <polygon 
                points="100,4 196,59 196,171 100,226 4,171 4,59"
                className="fill-white stroke-[#d8e3fb] group-hover:stroke-[#00743a] group-hover:fill-emerald-50/30 transition-all duration-300"
                strokeWidth="2.5"
              />
            </svg>

            <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-50 text-[#00743a] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-xs border border-emerald-200/50">
                <Trees className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#111c2d] font-heading tracking-tight group-hover:text-[#00743a] transition-colors max-w-[140px] sm:max-w-[160px] leading-snug">
                {isNp ? 'सफा नेपाल, हरित नेपाल' : 'Clean Nepal, Green Nepal'}
              </h3>
            </div>
          </motion.div>

          {/* Hexagon 3: Skills & Micro-Enterprise */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            whileHover={{ y: -6, scale: 1.03 }}
            onClick={() => onSelectTab('initiatives')}
            className="group relative w-52 h-60 sm:w-60 sm:h-68 flex items-center justify-center cursor-pointer select-none drop-shadow-sm hover:drop-shadow-xl transition-all duration-300"
          >
            <svg 
              viewBox="0 0 200 230" 
              className="absolute inset-0 w-full h-full filter transition-all duration-300"
            >
              <polygon 
                points="100,4 196,59 196,171 100,226 4,171 4,59"
                className="fill-white stroke-[#d8e3fb] group-hover:stroke-amber-600 group-hover:fill-amber-50/30 transition-all duration-300"
                strokeWidth="2.5"
              />
            </svg>

            <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-xs border border-amber-200/50">
                <Briefcase className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#111c2d] font-heading tracking-tight group-hover:text-amber-700 transition-colors max-w-[140px] sm:max-w-[160px] leading-snug">
                {isNp ? 'दक्षता तथा उद्यमशीलता' : 'Skills & Micro-Enterprise'}
              </h3>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Featured Active Projects Grid with 3D Staggered Motion */}
      <section className="py-12 px-4 sm:px-6 bg-white border-b border-[#d8e3fb] [perspective:1200px]">
        <div className="max-w-[1280px] mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ 
                  y: -7, 
                  rotateX: 3,
                  boxShadow: "0 18px 28px -10px rgba(0, 60, 144, 0.14)",
                  transition: { duration: 0.25 }
                }}
                className="bg-[#f9f9ff] border border-[#d8e3fb] flex flex-col justify-between overflow-hidden shadow-xs hover:border-[#003c90] transition-all transform-gpu"
              >
                <div>
                  <div className="relative h-44 overflow-hidden group">
                    <img
                      src={project.imageUrl}
                      alt={project.imageAlt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 bg-[#003c90] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                        {isNp && project.categoryNp ? project.categoryNp : project.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#737784] mb-1.5">
                      <MapPin className="w-3 h-3 text-[#00743a] shrink-0" />
                      <span>{isNp && project.locationNp ? project.locationNp : project.location}</span>
                    </div>

                    <h3 className="text-sm font-bold text-[#111c2d] mb-1.5 font-heading line-clamp-2">
                      {isNp && project.titleNp ? project.titleNp : project.title}
                    </h3>

                    <p className="text-xs text-[#434653] line-clamp-2 leading-relaxed mb-3">
                      {isNp && project.descriptionNp ? project.descriptionNp : project.description}
                    </p>

                    {/* Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-[#003c90]">{project.fundedPercentage}% Funded</span>
                        <span className="text-[#737784]">रू {project.raisedAmountNpr.toLocaleString()} / रू {project.goalAmountNpr.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#e7eeff]">
                        <motion.div
                          className="h-full bg-[#00743a]"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${Math.min(project.fundedPercentage, 100)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => onQuickDonateProject(project)}
                    className="flex-1 py-2 bg-[#00743a] hover:bg-[#005227] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 shadow-xs"
                  >
                    <Heart className="w-3 h-3 fill-white" />
                    <span>{isNp ? 'सहयोग' : 'Donate'}</span>
                  </button>

                  <button
                    onClick={() => onOpenProjectDetail(project)}
                    className="px-3 py-2 bg-white text-[#003c90] border border-[#d8e3fb] hover:bg-[#f0f3ff] text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    {isNp ? 'विवरण' : 'Details'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

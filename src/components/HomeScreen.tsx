import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { 
  Shirt, 
  Trees, 
  Briefcase, 
  Heart, 
  ShieldCheck, 
  MapPin, 
  ArrowRight,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { IMPACT_STATS, PROJECTS_DATA, DEFAULT_SITE_CONTENT } from '../data/mockData';
import { Project, NavTab, Language, SiteContentConfig } from '../types';

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

  // Carousel Image Index
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const carouselImages = siteContent.heroCarouselImages && siteContent.heroCarouselImages.length > 0
    ? siteContent.heroCarouselImages
    : [siteContent.heroImageUrl];

  useEffect(() => {
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

  // Automatic Carousel rotation if multiple images exist
  useEffect(() => {
    if (carouselImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlideIndex(prev => (prev + 1) % carouselImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const featuredProjects = projectsList.slice(0, 3);
  
  // Hero Parallax Scroll Effect
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });
  const bgScale = useTransform(smoothProgress, [0, 1], [1, 1.18]);
  const bgY = useTransform(smoothProgress, [0, 1], [0, 90]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(smoothProgress, [0, 0.8], [0, 60]);
  const heroRotateX = useTransform(smoothProgress, [0, 0.8], [0, 12]);

  const activeHeroImg = carouselImages[activeSlideIndex] || siteContent.heroImageUrl;

  return (
    <div id="home-screen" className="w-full bg-[#f9f9ff] overflow-x-hidden">
      {/* Hero Section with 3D Parallax & Depth */}
      <section 
        ref={heroRef}
        className="relative h-[72vh] min-h-[440px] max-h-[660px] w-full flex items-center justify-center overflow-hidden border-b border-[#d8e3fb] [perspective:1200px]"
      >
        {/* Parallax Background Image with 3D Depth & Carousel Transition */}
        <motion.div 
          className="absolute inset-0 z-0 will-change-transform"
          style={{ scale: bgScale, y: bgY }}
        >
          <img
            key={activeHeroImg}
            src={activeHeroImg}
            alt="Genzicon Foundation Community Work Nepal"
            className="w-full h-full object-cover object-center transition-all duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/60" />
        </motion.div>

        {/* Carousel Indicators & Controls if multiple images */}
        {carouselImages.length > 1 && (
          <div className="absolute bottom-4 z-20 flex items-center gap-1.5">
            {carouselImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlideIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 transition-all duration-300 ${
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
          {/* Action-Oriented Hero Title */}
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight font-heading"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            {isNp ? (siteContent.heroTitleNp || siteContent.heroTitle) : siteContent.heroTitle}
          </motion.h1>

          <motion.p 
            className="text-xs sm:text-sm text-white/90 mb-6 max-w-lg font-normal leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {isNp
              ? (siteContent.heroSubtitleNp || siteContent.heroSubtitle)
              : siteContent.heroSubtitle}
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
          {siteContent.impactStats.map((stat, index) => {
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
                className="relative p-5 bg-[#f9f9ff] border border-[#d8e3fb] hover:border-[#003c90] flex flex-col justify-between transition-all transform-gpu shadow-xs"
              >
                <div>
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

                  <div className="text-xs font-bold tracking-wide uppercase text-[#111c2d] mb-2">
                    {isNp && stat.labelNp ? stat.labelNp : stat.label}
                  </div>
                </div>

                <p className="text-[11px] text-[#434653] leading-relaxed pt-2 border-t border-[#d8e3fb]/60">
                  {isNp && stat.descriptionNp ? stat.descriptionNp : stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3 Foundational Pillars: Refined Header & 3D Perspective Cards */}
      <section id="pillars-summary-section" className="py-12 px-4 sm:px-6 bg-[#f9f9ff] border-b border-[#d8e3fb] [perspective:1200px]">
        <div className="max-w-[1280px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00743a] block mb-1">
                {isNp ? 'मुख्य आधारस्तम्भ' : 'Core Focus Areas'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111c2d] font-heading">
                {isNp ? 'हाम्रा ३ मुख्य स्तम्भहरू' : 'Our Three Core Pillars'}
              </h2>
            </div>
            <button
              onClick={() => onSelectTab('initiatives')}
              className="text-xs font-bold text-[#003c90] hover:text-[#002660] flex items-center gap-1 uppercase tracking-wider self-start sm:self-auto group"
            >
              <span>{isNp ? 'विस्तृत विवरण' : 'Explore All Pillars'}</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: Clothes Bank */}
            <motion.div 
              initial={{ opacity: 0, y: 45, rotateX: 18 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ 
                y: -8, 
                rotateX: 4, 
                rotateY: -3,
                boxShadow: "0 20px 30px -12px rgba(0, 60, 144, 0.15)",
                transition: { duration: 0.25 } 
              }}
              className="bg-white border border-[#d8e3fb] p-6 shadow-xs flex flex-col justify-between hover:border-[#003c90] transition-colors transform-gpu"
            >
              <div>
                <div className="w-10 h-10 bg-[#e7eeff] text-[#003c90] flex items-center justify-center mb-3">
                  <Shirt className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black text-[#003c90] uppercase tracking-wider block mb-1">
                  {isNp ? 'स्तम्भ १: जनसेवा' : 'Pillar 01: People'}
                </span>
                <h3 className="text-base font-bold text-[#111c2d] mb-1 font-heading">
                  {isNp ? 'कपडा बैंक नेपाल' : 'Clothes Bank Nepal'}
                </h3>
                <p className="text-xs text-[#434653] leading-relaxed mb-5">
                  {isNp
                    ? 'पुराना तथा प्रयोगयोग्य कपडा संकलन गरी धोइपखाली तराईका शीतलहर पीडित र मुसहर बस्तीमा निःशुल्क वितरण।'
                    : 'Collecting and sanitizing wearable pre-loved clothes for free distribution to cold-wave victims and remote villages.'}
                </p>
              </div>
              <button
                onClick={() => onSelectTab('clothes-bank')}
                className="w-full py-2 bg-[#003c90] hover:bg-[#002660] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 shadow-xs"
              >
                <span>{isNp ? 'कपडा बैंक पोर्टल' : 'Open Clothes Portal'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* Pillar 2: Nature */}
            <motion.div 
              initial={{ opacity: 0, y: 45, rotateX: 18 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ 
                y: -8, 
                rotateX: 4, 
                rotateY: 0,
                boxShadow: "0 20px 30px -12px rgba(0, 116, 58, 0.15)",
                transition: { duration: 0.25 } 
              }}
              className="bg-white border border-[#d8e3fb] p-6 shadow-xs flex flex-col justify-between hover:border-[#00743a] transition-colors transform-gpu"
            >
              <div>
                <div className="w-10 h-10 bg-emerald-50 text-[#00743a] flex items-center justify-center mb-3">
                  <Trees className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black text-[#00743a] uppercase tracking-wider block mb-1">
                  {isNp ? 'स्तम्भ २: प्रकृति' : 'Pillar 02: Nature'}
                </span>
                <h3 className="text-base font-bold text-[#111c2d] mb-1 font-heading">
                  {isNp ? 'सफा नेपाल, हरित नेपाल' : 'Clean Nepal, Green Nepal'}
                </h3>
                <p className="text-xs text-[#434653] leading-relaxed mb-5">
                  {isNp
                    ? 'चुरे तथा नदी किनारहरूमा १ लाखभन्दा बढी फलफूलका बिरुवा रोपण, प्लास्टिक न्यूनीकरण र नदी सरसफाइ अभियान।'
                    : '100K native sapling plantation across Chure foothills, bi-weekly river cleanups, and youth eco-clubs.'}
                </p>
              </div>
              <button
                onClick={() => onSelectTab('initiatives')}
                className="w-full py-2 bg-[#00743a] hover:bg-[#005227] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 shadow-xs"
              >
                <span>{isNp ? 'हरित अभियान' : 'Explore Green Drives'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* Pillar 3: Sustainable Growth */}
            <motion.div 
              initial={{ opacity: 0, y: 45, rotateX: 18 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.65, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ 
                y: -8, 
                rotateX: 4, 
                rotateY: 3,
                boxShadow: "0 20px 30px -12px rgba(217, 119, 6, 0.15)",
                transition: { duration: 0.25 } 
              }}
              className="bg-white border border-[#d8e3fb] p-6 shadow-xs flex flex-col justify-between hover:border-amber-600 transition-colors transform-gpu"
            >
              <div>
                <div className="w-10 h-10 bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider block mb-1">
                  {isNp ? 'स्तम्भ ३: आत्मनिर्भरता' : 'Pillar 03: Sustainable'}
                </span>
                <h3 className="text-base font-bold text-[#111c2d] mb-1 font-heading">
                  {isNp ? 'दक्षता तथा उद्यमशीलता' : 'Skills & Micro-Enterprise'}
                </h3>
                <p className="text-xs text-[#434653] leading-relaxed mb-5">
                  {isNp
                    ? 'विपन्न महिलाहरूलाई निःशुल्क सिलाई तालिम र सिलाई मेसिन अनुदान, तथा युवाहरूलाई प्राविधिक सीप।'
                    : 'Free 3-month certified tailoring courses & sewing machines for women, plus youth digital and IT skills.'}
                </p>
              </div>
              <button
                onClick={() => onSelectTab('initiatives')}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 shadow-xs"
              >
                <span>{isNp ? 'सीप कार्यक्रम' : 'Explore Skill Hubs'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Active Projects Grid with 3D Staggered Motion */}
      <section className="py-12 px-4 sm:px-6 bg-white border-b border-[#d8e3fb] [perspective:1200px]">
        <div className="max-w-[1280px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8"
          >
            <div>
              <span className="text-[10px] text-[#00743a] uppercase font-bold tracking-wider block mb-1">
                {isNp ? 'फिल्ड अभियान' : 'Field Initiatives'}
              </span>
              <h2
                className="text-xl sm:text-2xl font-bold text-[#111c2d] font-heading"
              >
                {isNp ? 'हाल सञ्चालित मुख्य कार्यक्रमहरू' : 'Active Ground Programs'}
              </h2>
            </div>
            <button
              onClick={() => onSelectTab('initiatives')}
              className="text-xs font-bold text-[#003c90] hover:text-[#002660] flex items-center gap-1 uppercase tracking-wider group self-start sm:self-auto"
            >
              <span>{isNp ? 'सबै हेर्नुहोस्' : 'View All Programs'}</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

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

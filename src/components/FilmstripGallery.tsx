import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Maximize2, 
  X, 
  Sparkles, 
  Calendar,
  Layers,
  Pause,
  Play
} from 'lucide-react';
import { Language, FilmstripScene } from '../types';
import { apiGetFilmstripScenes } from '../services/api';

export { type FilmstripScene };


export const DEFAULT_FILMSTRIP_SCENES: FilmstripScene[] = [
  {
    id: 'scene-01',
    sceneNumber: 'SCENE 01',
    frameCode: '13',
    title: 'Warm Clothes Sorting & Sanitization Drive',
    titleNp: 'कपडा संकलन तथा निःशुल्क वितरण तयारी',
    category: 'Clothes Bank Nepal',
    categoryNp: 'कपडा बैंक नेपाल',
    location: 'Central Hub, Kathmandu',
    locationNp: 'केन्द्रीय संकलन केन्द्र, काठमाडौँ',
    date: 'Autumn 2024',
    dateNp: 'शरद ऋतु २०८१',
    description: 'Volunteers meticulously sorting, washing, and packaging thousands of pre-loved wearable garments for cold-wave vulnerable settlements.',
    descriptionNp: 'तराईका शीतलहर पीडित परिवारका लागि संकलित कपडाहरू स्वयंसेवकद्वारा धोइपखाली, वर्गीकरण र प्याकेजिङ गरिँदै।',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1400&q=85',
    quote: 'Dignity through warmth for every vulnerable family in Nepal.',
    quoteNp: 'प्रत्येक विपन्न परिवारका लागि न्यानोपन र सम्मान।'
  },
  {
    id: 'scene-02',
    sceneNumber: 'SCENE 02',
    frameCode: '14',
    title: 'School Uniforms & Learning Kits Distribution',
    titleNp: 'विद्यालय पोशाक तथा शैक्षिक सामग्री सहयोग',
    category: 'Education Support',
    categoryNp: 'शिक्षा सहयोग',
    location: 'Rural Community School, Janakpur',
    locationNp: 'ग्रामीण सामुदायिक विद्यालय, जनकपुर',
    date: 'September 2024',
    dateNp: 'असोज २०८१',
    description: 'Equipping young primary students with tailored clean school uniforms, backpacks, and essential textbooks to encourage attendance.',
    descriptionNp: 'नियमित विद्यालय जान प्रोत्साहन गर्न बालबालिकाहरूलाई नयाँ विद्यालय पोशाक, झोला र पाठ्यपुस्तक वितरण।',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1400&q=85',
    quote: 'Every child deserves the confidence of a uniform and a notebook.',
    quoteNp: 'हरेक बालबालिकालाई शिक्षा र आत्मविश्वासको समान अवसर।'
  },
  {
    id: 'scene-03',
    sceneNumber: 'SCENE 03',
    frameCode: '15',
    title: 'Classroom Dreams & Rural Learning Hubs',
    titleNp: 'कक्षाकोठामा भविष्य कोर्दै ग्रामीण बालबालिकाहरू',
    category: 'Child Education',
    categoryNp: 'बाल शिक्षा',
    location: 'Hansapur Primary Hub, Dhanusha',
    locationNp: 'हंसपुर प्राथमिक केन्द्र, धनुषा',
    date: 'August 2024',
    dateNp: 'भदौ २०८१',
    description: 'Students engaged in classroom learning at freshly refurbished community school desks supported by Genzicon education drive.',
    descriptionNp: 'जेन्जिकन शिक्षा अभियानद्वारा मर्मत तथा व्यवस्थापन गरिएका डेस्क-बेन्चमा अध्ययनरत विद्यार्थीहरू।',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=85',
    quote: 'Building brighter futures one classroom at a time.',
    quoteNp: 'कक्षाकोठाबाटै समृद्ध नेपालको भविष्य निर्माण।'
  },
  {
    id: 'scene-04',
    sceneNumber: 'SCENE 04',
    frameCode: '16',
    title: 'Youth Mentorship & Interactive Study Circles',
    titleNp: 'युवा परामर्श तथा अन्तरक्रियात्मक अध्ययन सत्र',
    category: 'Youth Leadership',
    categoryNp: 'युवा नेतृत्व',
    location: 'Morang Youth Center, Koshi',
    locationNp: 'मोरङ युवा केन्द्र, कोशी प्रदेश',
    date: 'July 2024',
    dateNp: 'साउन २०८१',
    description: 'Young school leaders and adolescent girls participating in interactive leadership, digital literacy, and health awareness sessions.',
    descriptionNp: 'अन्तरक्रियात्मक नेतृत्व विकास, डिजिटल साक्षरता र स्वास्थ्य सचेतनामा सहभागी किशोरीहरू।',
    imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1400&q=85',
    quote: 'Guiding today’s adolescents into tomorrow’s changemakers.',
    quoteNp: 'आजका किशोरीहरूलाई भोलिका समाज सुधारक बनाउने दिशा।'
  },
  {
    id: 'scene-05',
    sceneNumber: 'SCENE 05',
    frameCode: '17',
    title: 'Chure Hills Mass Reforestation Drive',
    titleNp: 'चुरे क्षेत्रमा वृहत् फलफूल वृक्षारोपण',
    category: 'Green Nepal',
    categoryNp: 'हरित नेपाल',
    location: 'Mithila Chure Ridge, Madhesh',
    locationNp: 'मिथिला चुरे क्षेत्र, मधेश प्रदेश',
    date: 'Monsoon 2024',
    dateNp: 'वर्षायाम २०८१',
    description: 'Planting over 100,000 indigenous fruit-bearing and soil-binding trees along fragile Chure slopes to stop flash floods.',
    descriptionNp: 'चुरे संरक्षण तथा बाढी-पहिरो नियन्त्रणका लागि १ लाखभन्दा बढी फलफूलका बिरुवा रोपण।',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1400&q=85',
    quote: 'Restoring Nepal’s green canopy for generations ahead.',
    quoteNp: 'भावी पुस्ताका लागि नेपालको हरित सम्पदाको संरक्षण।'
  },
  {
    id: 'scene-06',
    sceneNumber: 'SCENE 06',
    frameCode: '18',
    title: 'Women Micro-Enterprise & Tailoring Training',
    titleNp: 'महिला आत्मनिर्भरता सिलाई-कटाई तालिम',
    category: 'Livelihood Skills',
    categoryNp: 'जीविकोपार्जन सीप',
    location: 'Tinkune Skill Hub, Kathmandu',
    locationNp: 'तीनकुने सीप केन्द्र, काठमाडौँ',
    date: 'June 2024',
    dateNp: 'असार २०८१',
    description: 'Certified 3-month garment craftsmanship and business training empowering single mothers to run self-reliant micro enterprises.',
    descriptionNp: 'विपन्न तथा एकल महिलाहरूलाई ३ महिने निःशुल्क सिलाई तालिम र मेसिन हस्तान्तरण।',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=85',
    quote: 'Economic independence is the most enduring form of empowerment.',
    quoteNp: 'आर्थिक आत्मनिर्भरता नै महिला सशक्तीकरणको स्थायी आधार हो।'
  }
];

interface FilmstripGalleryProps {
  language: Language;
  scenes?: FilmstripScene[];
}

export const FilmstripGallery: React.FC<FilmstripGalleryProps> = ({
  language,
  scenes
}) => {
  const isNp = language === 'np';

  const [liveScenes, setLiveScenes] = useState<FilmstripScene[]>(() => {
    if (scenes && scenes.length > 0) return scenes;
    try {
      const saved = localStorage.getItem('genzicon_filmstrip_scenes');
      return saved ? JSON.parse(saved) : DEFAULT_FILMSTRIP_SCENES;
    } catch {
      return DEFAULT_FILMSTRIP_SCENES;
    }
  });

  useEffect(() => {
    if (scenes && scenes.length > 0) {
      setLiveScenes(scenes);
    }
  }, [scenes]);

  useEffect(() => {
    apiGetFilmstripScenes().then((data) => {
      if (data && data.length > 0) {
        setLiveScenes(data);
        try {
          localStorage.setItem('genzicon_filmstrip_scenes', JSON.stringify(data));
        } catch {}
      }
    });

    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('genzicon_filmstrip_scenes');
        if (saved) setLiveScenes(JSON.parse(saved));
      } catch {}
    };

    window.addEventListener('genzicon_filmstrip_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('genzicon_filmstrip_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const activeScenes = liveScenes && liveScenes.length > 0 ? liveScenes : DEFAULT_FILMSTRIP_SCENES;
  const total = activeScenes.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Keep index within bounds if list shrinks
  const safeIndex = (currentIndex >= 0 && currentIndex < total) ? currentIndex : 0;
  const currentScene = activeScenes[safeIndex] || activeScenes[0];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % total);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [total]);

  // Optional gentle auto-play
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying, currentIndex, total]);

  // Touch Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) handleNext();
    if (diff < -40) handlePrev();
    touchStartX.current = null;
  };

  // Compute 3 visible slots: prev, current, next
  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;

  return (
    <section 
      id="filmstrip-gallery-section" 
      className="relative w-full bg-[#090d16] text-white py-12 sm:py-16 overflow-hidden border-b border-[#1b253b] selection:bg-amber-500 selection:text-black"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-blue-900/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[250px] bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header with Line Divider & Monospace Tag */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-2.5">
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] uppercase text-amber-400/90 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {isNp ? 'हाम्रा उपलब्धि तथा फिल्ड क्षणहरू' : 'OUR ACHIEVEMENTS & MOMENTS'}
            </span>
            <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-amber-400/60 to-transparent" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white uppercase font-heading mb-3">
            {isNp ? 'समुदायमा प्रत्यक्ष प्रभाव तथा फिल्ड झलक' : 'SHOWCASING OUR GROUND WORK & IMPACT'}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-400 max-w-2xl font-normal leading-relaxed italic">
            “{isNp 
              ? 'जेन्जिकन फाउन्डेसन — गाउँ-बस्तीमा न्यानो कपडा, हरियाली संरक्षण, र युवा-महिलालाई सीपमार्फत आत्मनिर्भर बनाउँदै।' 
              : 'Genzicon Foundation — creating lasting grassroots transformation across Nepal through clothes banking, green reforestation, and youth empowerment.'}”
          </p>
        </div>

        {/* Cinematic Film Reel Frame */}
        <div 
          className="relative w-full bg-[#05070d] rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Film Sprocket Strip */}
          <div className="w-full bg-[#0b0f19] border-b border-white/10 px-2 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between overflow-hidden select-none">
            <div className="flex items-center gap-4 sm:gap-6 w-full justify-around opacity-85">
              {[12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map((num) => (
                <div key={`sprocket-top-${num}`} className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-3.5 h-4 sm:w-4 sm:h-5 rounded-[2px] bg-white/90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]" />
                  <span className="font-mono text-[9px] sm:text-[10px] font-bold text-amber-400/80">
                    {num === 16 ? <span className="text-amber-300 font-extrabold">{num}</span> : num}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Film Frames Carousel */}
          <div className="relative w-full py-4 sm:py-6 px-2 sm:px-4 flex items-center justify-center min-h-[320px] sm:min-h-[440px] md:min-h-[490px] overflow-hidden">
            
            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              aria-label="Previous Scene"
              className="absolute left-3 sm:left-6 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition-all transform hover:scale-110 active:scale-95 shadow-xl group"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next Scene"
              className="absolute right-3 sm:right-6 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition-all transform hover:scale-110 active:scale-95 shadow-xl group"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* 3-Frame Reel Viewport */}
            <div className="w-full flex items-center justify-center gap-3 sm:gap-5 md:gap-6">
              
              {/* Left Frame (Previous) */}
              <div 
                onClick={handlePrev}
                className="hidden md:block w-1/4 h-[280px] lg:h-[350px] relative rounded-lg overflow-hidden cursor-pointer group opacity-40 hover:opacity-70 transition-all duration-300 border border-white/10"
              >
                <img 
                  src={activeScenes[prevIndex].imageUrl} 
                  alt={activeScenes[prevIndex].title}
                  className="w-full h-full object-cover filter grayscale contrast-125 brightness-75 group-hover:filter-none transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute top-3 left-3 bg-black/75 px-2 py-0.5 rounded text-[10px] font-mono text-white/70 border border-white/15">
                  {activeScenes[prevIndex].sceneNumber}
                </div>
              </div>

              {/* Center Active Frame */}
              <motion.div 
                key={currentScene.id}
                initial={{ opacity: 0.5, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="w-full sm:w-[82%] md:w-[50%] lg:w-[46%] h-[270px] sm:h-[360px] md:h-[400px] lg:h-[430px] relative rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.9)] border-2 border-white/30 bg-black group select-none"
              >
                <img 
                  src={currentScene.imageUrl} 
                  alt={currentScene.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />

                {/* Top Overlay: Scene Badge & Lightbox Zoom Button */}
                <div className="absolute top-3 sm:top-4 inset-x-3 sm:inset-x-4 flex items-center justify-between z-10">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono text-xs font-bold tracking-wider shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>{currentScene.sceneNumber}</span>
                  </div>

                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="p-2 rounded-md bg-black/70 hover:bg-black text-white/90 hover:text-white border border-white/20 backdrop-blur-md transition-all shadow-md active:scale-95"
                    title={isNp ? 'ठूलो आकारमा हेर्नुहोस्' : 'Expand High-Resolution'}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Overlay: Title & Category on the Photo */}
                <div className="absolute bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-4 z-10 pointer-events-none">
                  <div className="inline-block px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-black mb-1.5 shadow-sm">
                    {isNp ? currentScene.categoryNp : currentScene.category}
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white font-heading leading-snug drop-shadow-md">
                    {isNp ? currentScene.titleNp : currentScene.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-white/85 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{isNp ? currentScene.locationNp : currentScene.location}</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Frame (Next) */}
              <div 
                onClick={handleNext}
                className="hidden md:block w-1/4 h-[280px] lg:h-[350px] relative rounded-lg overflow-hidden cursor-pointer group opacity-40 hover:opacity-70 transition-all duration-300 border border-white/10"
              >
                <img 
                  src={activeScenes[nextIndex].imageUrl} 
                  alt={activeScenes[nextIndex].title}
                  className="w-full h-full object-cover filter grayscale contrast-125 brightness-75 group-hover:filter-none transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute top-3 left-3 bg-black/75 px-2 py-0.5 rounded text-[10px] font-mono text-white/70 border border-white/15">
                  {activeScenes[nextIndex].sceneNumber}
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Film Sprocket Strip */}
          <div className="w-full bg-[#0b0f19] border-t border-white/10 px-2 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between overflow-hidden select-none">
            <div className="flex items-center gap-4 sm:gap-6 w-full justify-around opacity-85">
              {[12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map((num) => (
                <div key={`sprocket-bottom-${num}`} className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-3.5 h-4 sm:w-4 sm:h-5 rounded-[2px] bg-white/90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]" />
                  <span className="font-mono text-[9px] sm:text-[10px] font-bold text-amber-400/80">
                    {num === 16 ? <span className="text-amber-300 font-extrabold">{num}</span> : num}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scene Info Panel & Navigation Controls */}
        <div className="mt-6 sm:mt-8 bg-[#0f1523] border border-white/10 rounded-xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-400 font-mono">
              <span className="text-amber-400 font-bold">{currentScene.sceneNumber}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {isNp ? currentScene.locationNp : currentScene.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-blue-400" />
                {isNp ? currentScene.dateNp : currentScene.date}
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {isNp ? currentScene.descriptionNp : currentScene.description}
            </p>
          </div>

          {/* Interactive Controls & Frame Indicators */}
          <div className="flex items-center gap-3 self-end md:self-center shrink-0">
            {/* Auto Play Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium flex items-center gap-1.5 transition-colors ${
                isPlaying 
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                  : 'bg-white/5 border-white/15 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isPlaying ? (isNp ? 'रोक्नुहोस्' : 'Pause') : (isNp ? 'स्वतः चलाउनुहोस्' : 'Auto Play')}</span>
            </button>

            {/* Frame Dots */}
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-2 rounded-lg border border-white/10">
              {activeScenes.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Jump to scene ${idx + 1}`}
                  className={`h-2 transition-all duration-300 rounded-full ${
                    currentIndex === idx 
                      ? 'w-6 bg-amber-400' 
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            {/* Counter */}
            <div className="font-mono text-xs font-bold text-slate-400">
              <span className="text-white">{String(currentIndex + 1).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
            </div>
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              aria-label="Close Lightbox"
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors hidden sm:block"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors hidden sm:block"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div 
              className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center bg-[#070b14] border border-white/15 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-h-[68vh] overflow-hidden bg-black flex items-center justify-center">
                <img 
                  src={currentScene.imageUrl} 
                  alt={currentScene.title}
                  className="w-full h-full object-contain max-h-[68vh]"
                />
              </div>

              <div className="w-full p-5 sm:p-6 bg-[#0c1220] border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-black font-mono text-[11px] font-bold">
                      {currentScene.sceneNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {isNp ? currentScene.categoryNp : currentScene.category}
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-white font-heading">
                    {isNp ? currentScene.titleNp : currentScene.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                    {isNp ? currentScene.descriptionNp : currentScene.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{isNp ? currentScene.locationNp : currentScene.location}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

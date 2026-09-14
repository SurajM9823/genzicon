import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X,
  MapPin
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
    description: 'Volunteers sorting, cleaning, and packaging thousands of wearable garments for cold-wave vulnerable settlements.',
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
    description: 'Equipping primary students with tailored clean school uniforms, backpacks, and essential textbooks.',
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
    description: 'Students engaged in classroom learning at freshly refurbished community school desks.',
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
    description: 'Young school leaders participating in interactive leadership, digital literacy, and health awareness sessions.',
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
    description: 'Planting over 100,000 indigenous fruit-bearing and soil-binding trees along fragile Chure slopes.',
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
    description: 'Certified garment craftsmanship and business training empowering single mothers to run self-reliant micro enterprises.',
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

  // Live Scenes State from API or Props
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
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const safeIndex = (currentIndex >= 0 && currentIndex < total) ? currentIndex : 0;
  const currentScene = activeScenes[safeIndex] || activeScenes[0];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % total);
  };

  // Auto Sliding: runs automatically every 3.5s, pauses on mouse hover or touch
  useEffect(() => {
    if (isHovered || lightboxOpen || total <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % total);
    }, 3500);
    return () => clearInterval(interval);
  }, [isHovered, lightboxOpen, total]);

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

  // 3 visible slots: prev, current, next
  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;

  const prevScene = activeScenes[prevIndex];
  const nextScene = activeScenes[nextIndex];

  return (
    <section 
      id="filmstrip-gallery-section" 
      className="w-full bg-white py-4 sm:py-6 px-3 sm:px-6 border-b border-[#d8e3fb]"
    >
      <div className="max-w-[1280px] mx-auto">
        
        {/* Compact 35mm Film Reel Ribbon Container - Sharp Straight Edges */}
        <div 
          className="relative w-full bg-[#0b0f19] border border-slate-700/60 shadow-md overflow-hidden select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          
          {/* Top Film Sprocket Strip with Amber Frame Numbers */}
          <div className="w-full bg-[#050811] border-b border-white/10 px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between overflow-hidden">
            <div className="flex items-center w-full justify-around opacity-90">
              {/* Left frame number */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3.5 sm:w-3.5 sm:h-4 bg-white/85" />
                <span className="font-mono text-[9px] sm:text-[10px] font-bold text-amber-400/80">
                  {prevScene.frameCode || '15'}
                </span>
                <div className="w-3 h-3.5 sm:w-3.5 sm:h-4 bg-white/85" />
              </div>

              {/* Center frame numbers */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-3 h-3.5 sm:w-3.5 sm:h-4 bg-white/85" />
                <span className="font-mono text-[10px] sm:text-xs font-black text-amber-400">
                  {currentScene.frameCode || '16'}
                </span>
                <div className="w-3 h-3.5 sm:w-3.5 sm:h-4 bg-white/85" />
              </div>

              {/* Right frame number */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3.5 sm:w-3.5 sm:h-4 bg-white/85" />
                <span className="font-mono text-[9px] sm:text-[10px] font-bold text-amber-400/80">
                  {nextScene.frameCode || '17'}
                </span>
                <div className="w-3 h-3.5 sm:w-3.5 sm:h-4 bg-white/85" />
              </div>
            </div>
          </div>

          {/* Film Frames Carousel - Compact Height & All Images Sharp & Visible */}
          <div className="relative w-full py-2 sm:py-3 px-2 sm:px-3 flex items-center justify-center min-h-[160px] sm:min-h-[200px] md:min-h-[230px] lg:min-h-[250px] overflow-hidden bg-black">
            
            {/* Left Circular Navigation Arrow */}
            <button
              onClick={handlePrev}
              aria-label="Previous Scene"
              className="absolute left-2 sm:left-4 z-30 w-8 h-8 sm:w-9 sm:h-9 bg-black/65 hover:bg-black/90 text-white border border-white/30 flex items-center justify-center backdrop-blur-sm transition-all transform hover:scale-105 active:scale-95 shadow-md"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>

            {/* Right Circular Navigation Arrow */}
            <button
              onClick={handleNext}
              aria-label="Next Scene"
              className="absolute right-2 sm:right-4 z-30 w-8 h-8 sm:w-9 sm:h-9 bg-black/65 hover:bg-black/90 text-white border border-white/30 flex items-center justify-center backdrop-blur-sm transition-all transform hover:scale-105 active:scale-95 shadow-md"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>

            {/* 3 Continuous Film Frames: Sharp, Clean Rectangular Edges */}
            <div className="w-full flex items-center justify-center gap-1.5 sm:gap-3">
              
              {/* Left Frame (Previous) - Sharp Rectangular Frame */}
              <div 
                onClick={handlePrev}
                className="w-[28%] sm:w-[30%] h-[140px] sm:h-[180px] md:h-[210px] lg:h-[230px] relative overflow-hidden cursor-pointer group border border-white/15 bg-slate-900"
              >
                <img 
                  src={prevScene.imageUrl} 
                  alt={prevScene.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Scene Badge */}
                <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs px-1.5 py-0.5 text-[9px] sm:text-[10px] font-mono text-white/90 border border-white/20">
                  {prevScene.sceneNumber}
                </div>
              </div>

              {/* Center Active Frame - Sharp Rectangular Frame */}
              <motion.div 
                key={currentScene.id}
                initial={{ opacity: 0.85, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-[44%] sm:w-[40%] h-[155px] sm:h-[195px] md:h-[225px] lg:h-[245px] relative overflow-hidden border-2 border-white/40 shadow-lg bg-black group"
              >
                <img 
                  src={currentScene.imageUrl} 
                  alt={currentScene.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Top-Left Scene Badge */}
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs px-2 py-0.5 text-[10px] sm:text-xs font-mono font-bold text-white border border-white/30 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{currentScene.sceneNumber}</span>
                </div>

                {/* Top-Right Expand Icon Button */}
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white/90 hover:text-white border border-white/25 transition-all shadow-sm active:scale-95"
                  title={isNp ? 'ठूलो आकारमा हेर्नुहोस्' : 'Expand Photo'}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>

              {/* Right Frame (Next) - Sharp Rectangular Frame */}
              <div 
                onClick={handleNext}
                className="w-[28%] sm:w-[30%] h-[140px] sm:h-[180px] md:h-[210px] lg:h-[230px] relative overflow-hidden cursor-pointer group border border-white/15 bg-slate-900"
              >
                <img 
                  src={nextScene.imageUrl} 
                  alt={nextScene.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Scene Badge */}
                <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs px-1.5 py-0.5 text-[9px] sm:text-[10px] font-mono text-white/90 border border-white/20">
                  {nextScene.sceneNumber}
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Film Sprocket Strip with Amber Frame Numbers */}
          <div className="w-full bg-[#050811] border-t border-white/10 px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between overflow-hidden">
            <div className="flex items-center w-full justify-around opacity-90">
              {/* Left frame number */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3.5 sm:w-3.5 sm:h-4 bg-white/85" />
                <span className="font-mono text-[9px] sm:text-[10px] font-bold text-amber-400/80">
                  {prevScene.frameCode || '15'}
                </span>
                <div className="w-3 h-3.5 sm:w-3.5 sm:h-4 bg-white/85" />
              </div>

              {/* Center frame numbers */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-3 h-3.5 sm:w-3.5 sm:h-4 bg-white/85" />
                <span className="font-mono text-[10px] sm:text-xs font-black text-amber-400">
                  {currentScene.frameCode || '16'}
                </span>
                <div className="w-3 h-3.5 sm:w-3.5 sm:h-4 bg-white/85" />
              </div>

              {/* Right frame number */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3.5 sm:w-3.5 sm:h-4 bg-white/85" />
                <span className="font-mono text-[9px] sm:text-[10px] font-bold text-amber-400/80">
                  {nextScene.frameCode || '17'}
                </span>
                <div className="w-3 h-3.5 sm:w-3.5 sm:h-4 bg-white/85" />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* High-Resolution Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 z-50 p-2 bg-white/15 hover:bg-white/25 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2.5 bg-white/15 hover:bg-white/30 text-white transition-colors hidden sm:block"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2.5 bg-white/15 hover:bg-white/30 text-white transition-colors hidden sm:block"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div 
              className="max-w-4xl w-full bg-[#0b0f19] border border-white/20 overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-h-[75vh] bg-black flex items-center justify-center overflow-hidden">
                <img 
                  src={currentScene.imageUrl} 
                  alt={currentScene.title}
                  className="w-full h-full object-contain max-h-[75vh]"
                />
              </div>
              <div className="p-4 bg-[#0f1523] border-t border-white/10 flex items-center justify-between text-white">
                <div>
                  <span className="font-mono text-xs font-bold text-amber-400 mr-2">{currentScene.sceneNumber}</span>
                  <span className="text-sm font-semibold">{isNp ? currentScene.titleNp : currentScene.title}</span>
                </div>
                {currentScene.location && (
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isNp ? currentScene.locationNp : currentScene.location}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

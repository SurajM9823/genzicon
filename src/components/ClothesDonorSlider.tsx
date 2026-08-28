import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shirt, 
  MapPin, 
  Heart, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Quote, 
  Calendar,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { ClothesDonor, Language } from '../types';
import { SAMPLE_CLOTHES_DONORS } from '../data/mockData';
import { apiGetClothesDonors } from '../services/api';

interface ClothesDonorSliderProps {
  language: Language;
  onDonateClick?: () => void;
}

export const ClothesDonorSlider: React.FC<ClothesDonorSliderProps> = ({
  language,
  onDonateClick
}) => {
  const isNp = language === 'np';
  const [donors, setDonors] = useState<ClothesDonor[]>(() => {
    const cached = localStorage.getItem('genzicon_clothes_donors');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Error parsing cached donors', e);
      }
    }
    return SAMPLE_CLOTHES_DONORS;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);
  const touchStartX = useRef<number | null>(null);

  // Fetch live donors from backend API on mount
  useEffect(() => {
    let isMounted = true;
    apiGetClothesDonors().then(liveDonors => {
      if (isMounted && liveDonors && liveDonors.length > 0) {
        setDonors(liveDonors);
        localStorage.setItem('genzicon_clothes_donors', JSON.stringify(liveDonors));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalDonors = donors.length;
  const maxIndex = Math.max(0, totalDonors - itemsPerView);

  // Auto slide
  useEffect(() => {
    if (isPaused || totalDonors <= itemsPerView) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, maxIndex, totalDonors, itemsPerView]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const totalItemsCount = donors.reduce((acc, curr) => acc + (curr.itemsCount || 0), 0);

  return (
    <div 
      id="clothes-donors-wall"
      className="bg-white border border-[#d8e3fb] shadow-sm overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header bar */}
      <div className="p-3 sm:p-4 bg-gradient-to-r from-[#f0f4fc] via-[#f7faff] to-[#eaf0fc] border-b border-[#d8e3fb] flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#003c90] text-white text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-emerald-300" />
            {isNp ? 'कपडा बैंक दाताहरूको सूची' : 'Honored Clothes Donors Wall'}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-900 text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {donors.length} {isNp ? 'प्रमाणित दाताहरू' : 'Verified Contributors'}
          </span>
        </div>

        {/* Action and Navigation Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-white border border-[#d8e3fb] p-1 shadow-xs">
            <button
              onClick={handlePrev}
              aria-label="Previous donor"
              className="p-1.5 hover:bg-[#e7eeff] text-[#003c90] transition-colors rounded-none disabled:opacity-30"
              disabled={totalDonors <= itemsPerView}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-bold text-[#434653] px-2 select-none">
              {currentIndex + 1} / {Math.max(1, maxIndex + 1)}
            </span>
            <button
              onClick={handleNext}
              aria-label="Next donor"
              className="p-1.5 hover:bg-[#e7eeff] text-[#003c90] transition-colors rounded-none disabled:opacity-30"
              disabled={totalDonors <= itemsPerView}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {onDonateClick && (
            <button
              onClick={onDonateClick}
              className="px-3.5 py-2 bg-[#00743a] hover:bg-[#00542a] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>{isNp ? 'म पनि कपडा दान गर्छु' : 'Add My Donation'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Slider Viewport */}
      <div 
        className="p-4 sm:p-6 overflow-hidden relative"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (diff > 50) handleNext();
          if (diff < -50) handlePrev();
          touchStartX.current = null;
        }}
      >
        <motion.div 
          className="flex gap-4"
          animate={{ x: `-${currentIndex * (100 / itemsPerView + (itemsPerView > 1 ? 1.5 : 0))}%` }}
          transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
          style={{ width: `${(totalDonors / itemsPerView) * 100}%` }}
        >
          {donors.map((donor, idx) => {
            const donorImage = donor.imageUrl || `https://images.unsplash.com/photo-${1500000000000 + (idx * 372183) % 1000000000}?auto=format&fit=crop&w=400&q=80`;
            const donorName = isNp && donor.nameNp ? donor.nameNp : donor.name;
            const donorLocation = isNp && donor.locationNp ? donor.locationNp : donor.location;
            const clothesType = isNp && donor.clothesTypeNp ? donor.clothesTypeNp : donor.clothesType;
            const noteText = isNp && donor.noteNp ? donor.noteNp : donor.note;

            return (
              <div
                key={donor.id || `donor-${idx}`}
                className="w-full bg-[#fbfdff] border border-[#d8e3fb] hover:border-[#003c90] transition-all p-4 sm:p-5 flex flex-col justify-between group shadow-xs hover:shadow-md relative"
                style={{ flex: `0 0 calc(${100 / totalDonors}% - 12px)` }}
              >
                {/* Top Badge & Donor Meta */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={donorImage}
                          alt={donorName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#003c90]/20 group-hover:border-[#003c90] transition-colors"
                          onError={(e) => {
                            // Fallback to initial avatar
                            (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(donorName)}&background=003c90&color=fff&bold=true`;
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px] shadow-xs" title="Verified Donor">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-[#111c2d] font-heading group-hover:text-[#003c90] transition-colors">
                          {donorName}
                        </h4>
                        <p className="text-[11px] text-[#434653] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#00743a] shrink-0" />
                          <span>{donorLocation}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 bg-[#e7eeff] text-[#003c90] font-black text-xs">
                        {donor.itemsCount} {isNp ? 'थान' : 'Pieces'}
                      </span>
                      <span className="block text-[10px] text-[#737784] mt-0.5 font-medium">
                        {donor.date}
                      </span>
                    </div>
                  </div>

                  {/* Garment category pill */}
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold">
                      <Shirt className="w-3 h-3 text-[#003c90]" />
                      <span>{clothesType}</span>
                    </span>
                  </div>

                  {/* Donor message / Quote */}
                  {noteText ? (
                    <div className="p-3 bg-white border border-[#e5edfa] text-xs text-[#333a48] italic relative leading-relaxed">
                      <Quote className="w-3.5 h-3.5 text-[#003c90]/30 absolute top-1.5 right-1.5" />
                      "{noteText}"
                    </div>
                  ) : (
                    <p className="text-xs text-[#737784] italic">
                      {isNp ? 'नेपालका शीतलहर तथा विपद् प्रभावितहरूलाई न्यानो कपडा सहयोग।' : 'Donated warm clothing to support vulnerable families in cold wave relief.'}
                    </p>
                  )}
                </div>

                {/* Footer status */}
                <div className="mt-4 pt-3 border-t border-[#f0f3ff] flex items-center justify-between text-[10px] text-[#737784]">
                  <span className="flex items-center gap-1 text-[#00743a] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{isNp ? 'गुणस्तर प्रमाणित र वितरण' : 'Inspected & Distributed'}</span>
                  </span>
                  <span className="text-slate-400 font-mono">
                    ID: #{donor.id?.replace(/[^0-9]/g, '').slice(-4) || `${idx + 101}`}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Slider Indicators & Live Counter */}
      <div className="p-3 bg-[#f8faff] border-t border-[#d8e3fb] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentIndex(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`h-2 transition-all rounded-full ${
                currentIndex === dotIdx ? 'w-6 bg-[#003c90]' : 'w-2 bg-[#b9cffb] hover:bg-[#003c90]/50'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-4 text-[11px] text-[#434653] font-medium">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>{isNp ? `कुल संकलित: ${totalItemsCount.toLocaleString()} थान` : `Total Contributed: ${totalItemsCount.toLocaleString()}+ Garments`}</span>
          </span>
          <span className="hidden sm:inline-block text-[#737784]">
            {isNp ? '• हरेक कपडा सरसफाइ गरी गरिब बस्तीमा पुर्याइन्छ' : '• Cleaned, sanitized and handed over with dignity'}
          </span>
        </div>
      </div>
    </div>
  );
};

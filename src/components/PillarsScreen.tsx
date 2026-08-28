import React, { useState } from 'react';
import { 
  Shirt, 
  Trees, 
  Sparkles, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  Heart, 
  Users, 
  MapPin, 
  Phone,
  Layers,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Language, NavTab } from '../types';
import { PILLARS_DATA, PROJECTS_DATA } from '../data/mockData';

interface PillarsScreenProps {
  language: Language;
  onNavigateToClothesBank: () => void;
  onOpenDonateModal: () => void;
  onNavigateToVolunteer: () => void;
}

export const PillarsScreen: React.FC<PillarsScreenProps> = ({
  language,
  onNavigateToClothesBank,
  onOpenDonateModal,
  onNavigateToVolunteer
}) => {
  const isNp = language === 'np';
  const [selectedPillarId, setSelectedPillarId] = useState<'all' | 'clothes-bank' | 'clean-green-nepal' | 'skills-development'>('all');

  const filteredPillars = selectedPillarId === 'all'
    ? PILLARS_DATA
    : PILLARS_DATA.filter(p => p.id === selectedPillarId);

  return (
    <div id="pillars-screen" className="w-full pt-16 pb-16 bg-[#f9f9ff] min-h-screen">
      {/* Header Banner with Rich Photographic Background & Gradient Overlay */}
      <div className="relative bg-[#002660] text-white border-b border-[#001d4a] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1920&q=80"
            alt="Genzicon Foundation Pillars Nepal"
            className="w-full h-full object-cover object-center transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001d4a]/95 via-[#003c90]/88 to-[#001d4a]/90 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-3xl">
            <span className="inline-block px-2.5 py-1 bg-white/15 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-3 border border-white/20 backdrop-blur-xs">
              {isNp ? 'हाम्रा मुख्य कार्यक्षेत्र' : 'Our Core Focus Areas'}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-3 font-heading text-white drop-shadow-xs">
              {isNp ? 'हाम्रा तीन आधारस्तम्भ' : 'Our Three Core Pillars'}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 font-normal leading-relaxed max-w-2xl">
              {isNp
                ? 'हाम्रो सम्पूर्ण सामाजिक कार्य ३ वटा मुख्य स्तम्भमा केन्द्रित छ: जनसेवा (कपडा बैंक), प्रकृति संरक्षण (सफा तथा हरित नेपाल), र आत्मनिर्भरता (दक्षता तथा उद्यमशीलता विकास)।'
                : 'Empowering Nepal through three interconnected pillars: People (Clothes Bank), Nature (Clean & Green Nepal), and Sustainable Livelihoods (Skills & Enterprise).'}
            </p>
          </div>
        </div>
      </div>

      {/* Pillar Filter Tabs */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 -mt-4">
        <div className="bg-white p-2 border border-[#d8e3fb] shadow-xs flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedPillarId('all')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              selectedPillarId === 'all'
                ? 'bg-[#003c90] text-white'
                : 'text-[#434653] hover:bg-[#f0f3ff]'
            }`}
          >
            {isNp ? 'सबै ३ स्तम्भ (All 3 Pillars)' : 'All 3 Pillars'}
          </button>
          <button
            onClick={() => setSelectedPillarId('clothes-bank')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              selectedPillarId === 'clothes-bank'
                ? 'bg-[#003c90] text-white'
                : 'text-[#434653] hover:bg-[#f0f3ff]'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>{isNp ? '१. कपडा बैंक नेपाल' : '1. Clothes Bank Nepal'}</span>
          </button>
          <button
            onClick={() => setSelectedPillarId('clean-green-nepal')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              selectedPillarId === 'clean-green-nepal'
                ? 'bg-[#003c90] text-white'
                : 'text-[#434653] hover:bg-[#f0f3ff]'
            }`}
          >
            <Trees className="w-3.5 h-3.5 text-[#00743a]" />
            <span>{isNp ? '२. सफा नेपाल, हरित नेपाल' : '2. Clean Nepal, Green Nepal'}</span>
          </button>
          <button
            onClick={() => setSelectedPillarId('skills-development')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              selectedPillarId === 'skills-development'
                ? 'bg-[#003c90] text-white'
                : 'text-[#434653] hover:bg-[#f0f3ff]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-600" />
            <span>{isNp ? '३. दक्षता तथा उद्यमशीलता' : '3. Skills & Business'}</span>
          </button>
        </div>
      </div>

      {/* Pillars Detailed Grid */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-8 space-y-8">
        {filteredPillars.map((pillar, idx) => {
          const isClothes = pillar.id === 'clothes-bank';
          const isNature = pillar.id === 'clean-green-nepal';
          const isSkills = pillar.id === 'skills-development';

          return (
            <div
              key={pillar.id}
              id={`pillar-${pillar.id}`}
              className="bg-white border border-[#d8e3fb] shadow-xs overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Visual Image Side */}
                <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
                  <img
                    src={pillar.imageUrl}
                    alt={pillar.title}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="inline-block px-2.5 py-1 bg-[#003c90] text-white text-[10px] font-black uppercase tracking-wider w-fit mb-2">
                      {isNp ? pillar.badgeNp : pillar.badge}
                    </span>
                    <h3 className="text-xl font-bold font-heading">
                      {isNp ? pillar.titleNp : pillar.title}
                    </h3>
                    <p className="text-xs text-blue-100 font-medium">
                      {isNp ? pillar.subtitleNp : pillar.subtitle}
                    </p>
                  </div>
                </div>

                {/* Content Side */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-[#f0f3ff] pb-3 mb-4">
                      <div>
                        <span className="text-[10px] font-black text-[#00743a] uppercase tracking-widest block">
                          {isClothes ? 'GENZICON FOR PEOPLE' : isNature ? 'GENZICON FOR NATURE' : 'GENZICON FOR SUSTAINABILITY'}
                        </span>
                        <h2 className="text-lg sm:text-xl font-bold text-[#111c2d] font-heading">
                          {isNp ? pillar.titleNp : pillar.title}
                        </h2>
                      </div>
                      <div className="w-10 h-10 bg-[#e7eeff] text-[#003c90] flex items-center justify-center shrink-0">
                        {isClothes && <Shirt className="w-5 h-5" />}
                        {isNature && <Trees className="w-5 h-5 text-[#00743a]" />}
                        {isSkills && <Briefcase className="w-5 h-5 text-amber-600" />}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#434653] leading-relaxed mb-5">
                      {isNp ? pillar.descriptionNp : pillar.description}
                    </p>

                    {/* Highlights List */}
                    <div className="space-y-2 mb-6">
                      <h4 className="text-xs font-bold text-[#111c2d] uppercase tracking-wider">
                        {isNp ? 'मुख्य विशेषता तथा कार्यविधि:' : 'Key Operational Highlights:'}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(isNp ? pillar.highlightsNp : pillar.highlights).map((hl, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-[#434653] bg-[#f9f9ff] p-2.5 border border-[#eef2fc]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00743a] shrink-0 mt-0.5" />
                            <span className="leading-snug">{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metrics Bar */}
                    <div className="grid grid-cols-3 gap-2 p-3 bg-[#f0f3ff] border border-[#d8e3fb]">
                      {pillar.metrics.map((m, mi) => (
                        <div key={mi} className="text-center">
                          <span className="block text-sm sm:text-base font-black text-[#003c90] font-heading">
                            {m.value}
                          </span>
                          <span className="text-[10px] text-[#737784] font-medium block">
                            {isNp ? m.labelNp : m.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions for this pillar */}
                  <div className="pt-4 border-t border-[#f0f3ff] flex flex-wrap items-center gap-3">
                    {isClothes && (
                      <button
                        onClick={onNavigateToClothesBank}
                        className="px-4 py-2.5 bg-[#003c90] hover:bg-[#002660] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
                      >
                        <Shirt className="w-3.5 h-3.5" />
                        <span>{isNp ? 'कपडा बैंक पोर्टल खोल्नुहोस्' : 'Open Clothes Bank Portal'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={onOpenDonateModal}
                      className="px-4 py-2.5 bg-[#00743a] hover:bg-[#005227] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white text-white" />
                      <span>{isNp ? 'यस स्तम्भमा आर्थिक सहयोग' : 'Support this Initiative'}</span>
                    </button>

                    <button
                      onClick={onNavigateToVolunteer}
                      className="px-3.5 py-2.5 bg-[#f0f3ff] hover:bg-[#e7eeff] text-[#003c90] text-xs font-bold uppercase tracking-wider transition-colors border border-[#d8e3fb]"
                    >
                      {isNp ? 'स्वयंसेवक बन्नुहोस्' : 'Join as Volunteer'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

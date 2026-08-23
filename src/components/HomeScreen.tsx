import React from 'react';
import { 
  ArrowRight, 
  Eye, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Quote
} from 'lucide-react';
import { IMPACT_STATS, PROJECTS_DATA, TESTIMONIALS_DATA } from '../data/mockData';
import { Project, NavTab, Language } from '../types';

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
  const featuredProjects = PROJECTS_DATA.slice(0, 3);

  return (
    <div id="home-screen" className="w-full bg-[#f9f9ff]">
      {/* Hero Section: 85% Viewport Height, Responsive Mobile & Laptop */}
      <section className="relative h-[85vh] min-h-[520px] max-h-[840px] w-full flex items-center justify-center overflow-hidden border-b border-[#d8e3fb]">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK_JNqqjvLNwXyVnYx0OswqmXHhcIPs7qHZ53p786M0yp2k8-8Iq4BGTWjdjOeelfNZA1DTbA6gohW6u6GK8N4G6My3t1gxJEKf_iLDe5ZXd1L_r7756Cj_IO_rGntA0th_nrPzSd9thtz_aGLvcVcw4sCgtxk5uqgWhPYdLAax_SHFUTsqD94dhlnVfbP1Do-RfPBItVpLt2CoxtdBJ6mm6btZfdDe5lEkGcOu4U0uLjH7_ADtvP_"
            alt="Grassroots community volunteers and field initiatives across rural Nepal"
            className="w-full h-full object-cover object-center"
          />
          {/* High-legibility crisp overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/60" />
        </div>

        {/* Hero Content - Centered, Responsive, Sharp Minimalist Style */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto flex flex-col items-center justify-center pt-8">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4 rounded-none sm:rounded-xs shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isNp ? 'नेपाल समाज कल्याण परिषद् आबद्ध नं. ५४१२८ • प्यान: ६०९८२३४५१' : 'SWC Affiliation No. 54128 • PAN 609823451 • Nepal NGO'}</span>
          </div>

          <h1
            className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight leading-tight"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {isNp ? (
              <>
                पारदर्शी सामाजिक कार्य <span className="text-emerald-400">र दिगो विकास</span>
              </>
            ) : (
              <>
                Transparent Action for <span className="text-emerald-400">Sustainable Nepal</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-white/90 mb-6 max-w-2xl font-normal leading-relaxed">
            {isNp
              ? 'कर्णाली र मधेसका गाउँहरूमा सौर्य ऊर्जा, शुद्ध खानेपानी बोरिङ, स्वास्थ्य शिविर र आकस्मिक राहतका लागि युवाहरूको पारदर्शी अभियान।'
              : 'Youth-led grassroots initiatives bringing solar classrooms, deep-well clean water, mobile medical camps, and rapid disaster relief across Nepal.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto justify-center">
            <button
              id="hero-donate-btn"
              onClick={() => onSelectTab('donate')}
              className="bg-[#00743a] hover:bg-[#005227] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-none sm:rounded-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>{isNp ? 'सहयोग गर्नुहोस् (eSewa / Fonepay)' : 'Donate Online (eSewa / Card)'}</span>
              <Heart className="w-3.5 h-3.5 fill-white text-white" />
            </button>

            <button
              id="hero-join-mission-btn"
              onClick={() => onSelectTab('volunteer')}
              className="bg-white hover:bg-slate-100 text-[#003c90] text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-none sm:rounded-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>{isNp ? 'स्वयंसेवक बन्नुहोस्' : 'Join as Volunteer'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Impact Counters: Compact Minimal Grid */}
      <section className="py-8 bg-white px-4 sm:px-6 border-b border-[#d8e3fb]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {IMPACT_STATS.map((stat) => (
            <div
              key={stat.id}
              className="p-4 sm:p-5 bg-[#f9f9ff] border border-[#d8e3fb] rounded-none sm:rounded-xs text-left"
            >
              <div
                className={`text-xl sm:text-2xl md:text-3xl font-bold mb-1 ${
                  stat.color === 'primary' ? 'text-[#003c90]' : 'text-[#00743a]'
                }`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {stat.number}
              </div>
              <div className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#111c2d] mb-0.5">
                {isNp && stat.labelNp ? stat.labelNp : stat.label}
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#737784] line-clamp-1">
                {isNp && stat.descriptionNp ? stat.descriptionNp : stat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Accountability Summary: Minimal */}
      <section id="mission-section" className="py-10 px-4 sm:px-6 bg-white border-b border-[#d8e3fb]">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#003c90] mb-1 block">
            {isNp ? '८८% बजेट प्रत्यक्ष फिल्डमा' : '88% Direct Program Allocation'}
          </span>
          <h2
            className="text-xl sm:text-2xl font-bold text-[#111c2d] mb-2"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {isNp ? 'पारदर्शी प्रभाव, सार्वजनिक हिसाबकिताब' : 'Grassroots Accountability & Real Change'}
          </h2>
          <p className="text-xs sm:text-sm text-[#434653] leading-relaxed">
            {isNp
              ? 'जेन्जिकन फाउन्डेशनमा प्रत्येक अनुदानको पूरा विवरण, स्थानीय खरिद बिल र स्वतन्त्र सीए अडिट प्रतिवेदन वेबसाइटमा सार्वजनिक गरिन्छ।'
              : 'Every donation is tied to clear deliverables. We publish itemized vendor invoices, village council signatures, and statutory annual audit reports.'}
          </p>
        </div>
      </section>

      {/* Featured Initiatives: Clean Sharp Cards, Low Gaps */}
      <section className="py-10 px-4 sm:px-6 bg-[#f9f9ff]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-row justify-between items-end mb-6">
            <div>
              <span className="text-[10px] sm:text-[11px] text-[#00743a] uppercase font-bold tracking-wider block">
                {isNp ? 'सक्रिय कार्यक्रमहरू' : 'Field Initiatives'}
              </span>
              <h2
                className="text-lg sm:text-2xl font-bold text-[#111c2d]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {isNp ? 'प्रमुख परियोजनाहरू' : 'Active Projects in Nepal'}
              </h2>
            </div>

            <button
              onClick={() => onSelectTab('projects')}
              className="text-[#003c90] font-bold text-xs uppercase tracking-wider flex items-center gap-1 hover:text-[#002660] transition-colors"
            >
              <span>{isNp ? 'सबै हेर्नुहोस्' : 'View All'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onOpenProjectDetail(project)}
                className="bg-white border border-[#d8e3fb] rounded-none sm:rounded-xs overflow-hidden flex flex-col group cursor-pointer hover:border-[#003c90] transition-colors"
              >
                <div className="h-44 overflow-hidden relative bg-slate-100">
                  <img
                    src={project.imageUrl}
                    alt={project.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-none flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{isNp && project.locationNp ? project.locationNp : project.location}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white text-[#003c90] text-[10px] font-bold px-2 py-0.5 rounded-none shadow-xs">
                    {project.status}
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#003c90] block mb-1">
                      {isNp && project.categoryNp ? project.categoryNp : project.category}
                    </span>
                    <h3
                      className="text-sm sm:text-base font-bold text-[#111c2d] mb-1.5 line-clamp-1 group-hover:text-[#003c90] transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {isNp && project.titleNp ? project.titleNp : project.title}
                    </h3>
                    <p className="text-xs text-[#434653] mb-4 line-clamp-2 leading-relaxed">
                      {isNp && project.descriptionNp ? project.descriptionNp : project.description}
                    </p>
                  </div>

                  {/* Impact & Funding Bar */}
                  <div className="pt-3 border-t border-[#f0f3ff]">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-[#434653] mb-1.5">
                      <span>{isNp ? 'प्रगति' : 'Funded'}</span>
                      <span className="text-[#00743a] font-bold">{project.fundedPercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#e7eeff] rounded-none overflow-hidden mb-2.5">
                      <div
                        className="h-full bg-[#00743a] transition-all duration-500"
                        style={{ width: `${project.fundedPercentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111c2d]">
                        रू {project.raisedAmountNpr.toLocaleString()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickDonateProject(project);
                        }}
                        className="text-xs font-bold text-[#00743a] hover:text-[#005227] hover:underline"
                      >
                        {isNp ? 'सहयोग गर्नुहोस् →' : 'Donate →'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Testimonials: Clean Minimal Grid */}
      <section className="py-10 px-4 sm:px-6 bg-white border-t border-[#d8e3fb]">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00743a] block">
              {isNp ? 'प्रत्यक्ष लाभान्वित' : 'Field Feedback'}
            </span>
            <h2
              className="text-lg sm:text-2xl font-bold text-[#111c2d]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {isNp ? 'समुदायको अनुभव र भनाइ' : 'Community Voices & Field Reports'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS_DATA.map((t, idx) => (
              <div
                key={idx}
                className="bg-[#f9f9ff] p-4 sm:p-5 border border-[#d8e3fb] rounded-none sm:rounded-xs flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-5 h-5 text-[#003c90]/30 mb-2" />
                  <p className="text-xs text-[#434653] leading-relaxed italic mb-4">
                    "{isNp && t.quoteNp ? t.quoteNp : t.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-2.5 pt-3 border-t border-[#e7eeff]">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-9 h-9 rounded-none object-cover border border-[#d8e3fb]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#111c2d]">
                      {isNp && t.authorNp ? t.authorNp : t.author}
                    </h4>
                    <p className="text-[10px] text-[#737784]">
                      {isNp && t.titleNp ? t.titleNp : t.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action Banner: Sharp Rectangular Framing */}
      <section className="py-8 px-4 sm:px-6 bg-[#f9f9ff]">
        <div className="max-w-[1280px] mx-auto">
          <div className="bg-[#003c90] p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-4 border border-[#002e70] rounded-none sm:rounded-xs shadow-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block mb-1">
                {isNp ? 'नेपालको विकासमा सहकार्य' : 'Support Grassroots Nepal'}
              </span>
              <h2 className="text-lg sm:text-xl font-bold mb-1">
                {isNp ? 'सानो सहयोग, दिगो र प्रमाणित परिवर्तन।' : 'Transparent donations for real community impact.'}
              </h2>
              <p className="text-white/80 text-xs max-w-xl">
                {isNp
                  ? 'खानेपानी, सौर्य ऊर्जा र आकस्मिक राहत कार्यक्रममा प्रत्यक्ष सहकार्य गर्नुहोस्।'
                  : 'Join hundreds of donors and volunteers powering transparent solutions across rural Nepal.'}
              </p>
            </div>
            <div className="flex flex-row gap-2 w-full md:w-auto shrink-0">
              <button
                onClick={() => onSelectTab('donate')}
                className="px-5 py-2.5 bg-[#00743a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#005227] transition-colors rounded-none sm:rounded-xs"
              >
                {isNp ? 'दान गर्नुहोस्' : 'Donate Now'}
              </button>
              <button
                onClick={() => onSelectTab('volunteer')}
                className="px-5 py-2.5 bg-white text-[#003c90] text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors rounded-none sm:rounded-xs"
              >
                {isNp ? 'स्वयंसेवक' : 'Volunteer'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

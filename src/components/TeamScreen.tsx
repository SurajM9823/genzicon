import React, { useState } from 'react';
import { Mail, Linkedin, Facebook, MapPin, Users } from 'lucide-react';
import { TEAM_MEMBERS } from '../data/mockData';
import { Language, NavTab } from '../types';

interface TeamScreenProps {
  language: Language;
  onSelectTab: (tab: NavTab) => void;
}

export const TeamScreen: React.FC<TeamScreenProps> = ({ language, onSelectTab }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'advisor' | 'volunteer'>('all');

  const filteredMembers = activeCategory === 'all'
    ? TEAM_MEMBERS
    : TEAM_MEMBERS.filter(m => m.category === activeCategory);

  const isNp = language === 'np';

  return (
    <div id="team-screen" className="w-full pt-16 pb-12 bg-[#f9f9ff]">
      {/* Header */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-6">
        <div className="border-b border-[#d8e3fb] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#003c90] block mb-0.5">
                {isNp ? 'हाम्रो टोली' : 'Our Team & Leadership'}
              </span>
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111c2d]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {isNp ? 'सामुदायिक सेवामा समर्पित नेतृत्व' : 'People Behind the Mission'}
              </h1>
            </div>
            <p className="text-xs text-[#434653] max-w-md">
              {isNp
                ? 'इन्जिनियर, डाक्टर, सामाजिक कार्यकर्ता तथा युवा स्वयंसेवकहरूको समर्पित टोली।'
                : 'Engineers, doctors, educators, and youth coordinators working across 7 provinces.'}
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {[
            { id: 'all', label: isNp ? 'सबै' : 'All Members' },
            { id: 'core', label: isNp ? 'कार्यकारी' : 'Core Team' },
            { id: 'advisor', label: isNp ? 'सल्लाहकार' : 'Advisors' },
            { id: 'volunteer', label: isNp ? 'संयोजकहरू' : 'Field Leads' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-3 py-1.5 rounded-none sm:rounded-xs text-xs font-semibold transition-colors ${
                activeCategory === tab.id
                  ? 'bg-[#003c90] text-white'
                  : 'bg-white text-[#434653] border border-[#d8e3fb] hover:border-[#003c90]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Team Grid */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-none sm:rounded-xs border border-[#d8e3fb] overflow-hidden flex flex-col group hover:border-[#003c90] transition-colors"
            >
              {/* Photo */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider ${
                    member.category === 'core'
                      ? 'bg-[#003c90] text-white'
                      : member.category === 'advisor'
                      ? 'bg-[#475569] text-white'
                      : 'bg-[#00743a] text-white'
                  }`}>
                    {member.category === 'core' 
                      ? (isNp ? 'कार्यकारी' : 'Core')
                      : member.category === 'advisor'
                      ? (isNp ? 'सल्लाहकार' : 'Advisor')
                      : (isNp ? 'संयोजक' : 'Field Lead')}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#111c2d] mb-0.5 group-hover:text-[#003c90] transition-colors">
                    {isNp && member.nameNp ? member.nameNp : member.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#00743a] mb-1">
                    {isNp && member.roleNp ? member.roleNp : member.role}
                  </p>
                  <p className="text-[11px] text-[#737784] flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3 text-[#003c90]" />
                    <span>{member.location}</span>
                  </p>
                  <p className="text-xs text-[#434653] leading-relaxed line-clamp-2 mb-3">
                    {isNp && member.bioNp ? member.bioNp : member.bio}
                  </p>
                </div>

                {/* Social links */}
                <div className="pt-2.5 border-t border-[#f0f3ff] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="w-6 h-6 rounded-none bg-[#f0f3ff] text-[#003c90] hover:bg-[#003c90] hover:text-white flex items-center justify-center transition-colors text-xs"
                        title={member.email}
                      >
                        <Mail className="w-3 h-3" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="w-6 h-6 rounded-none bg-[#f0f3ff] text-[#003c90] hover:bg-[#003c90] hover:text-white flex items-center justify-center transition-colors text-xs"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-3 h-3" />
                      </a>
                    )}
                    {member.facebook && (
                      <a
                        href={member.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="w-6 h-6 rounded-none bg-[#f0f3ff] text-[#003c90] hover:bg-[#003c90] hover:text-white flex items-center justify-center transition-colors text-xs"
                        title="Facebook"
                      >
                        <Facebook className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

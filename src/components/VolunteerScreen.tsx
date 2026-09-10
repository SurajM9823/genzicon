import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  HeartHandshake, 
  ShieldCheck, 
  Send, 
  Shirt, 
  Trees, 
  Briefcase, 
  MapPin,
  Search,
  Filter,
  Sparkles,
  Calendar,
  Clock,
  Award
} from 'lucide-react';
import { Language, VolunteerFormData, VolunteerRecord } from '../types';
import { apiSubmitVolunteer, apiGetVolunteers } from '../services/api';
import { INITIAL_VOLUNTEERS } from '../data/mockData';

interface VolunteerScreenProps {
  language: Language;
  onSuccess: (data: VolunteerFormData) => void;
}

export const VolunteerScreen: React.FC<VolunteerScreenProps> = ({
  language,
  onSuccess
}) => {
  const isNp = language === 'np';
  const [formData, setFormData] = useState<VolunteerFormData>({
    fullName: '',
    email: '',
    phone: '',
    province: 'Bagmati Province',
    district: 'Kathmandu',
    interest: 'Clothes Bank Nepal (Collection, Sorting & Distribution)',
    availability: 'Weekends (Saturday/Sunday)',
    reason: '',
    experience: '',
    agreeTerms: true
  });

  const [loading, setLoading] = useState(false);

  // Active Approved Volunteers State
  const [volunteers, setVolunteers] = useState<VolunteerRecord[]>(() => {
    try {
      const saved = localStorage.getItem('genzicon_admin_volunteers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_VOLUNTEERS;
    } catch {
      return INITIAL_VOLUNTEERS;
    }
  });

  // Directory Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvince, setFilterProvince] = useState('all');
  const [filterTrack, setFilterTrack] = useState('all');

  useEffect(() => {
    // Fetch live volunteers from backend
    apiGetVolunteers().then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        setVolunteers(data);
        localStorage.setItem('genzicon_admin_volunteers', JSON.stringify(data));
      }
    });

    const handleSync = () => {
      try {
        const saved = localStorage.getItem('genzicon_admin_volunteers');
        if (saved) {
          setVolunteers(JSON.parse(saved));
        }
      } catch (e) {
        console.warn(e);
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('genzicon_volunteers_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('genzicon_volunteers_updated', handleSync);
    };
  }, []);

  const nepalProvinces = [
    'Bagmati Province',
    'Madhesh Province',
    'Gandaki Province',
    'Koshi Province',
    'Lumbini Province',
    'Karnali Province',
    'Sudurpashchim Province',
    'International / Remote'
  ];

  const interestAreas = [
    'Clothes Bank Nepal (Collection, Sorting & Quality Inspection)',
    'Clothes Bank Nepal (Field Distribution & Cold Wave Relief)',
    'Clean Nepal, Green Nepal (100K Tree Plantation & Chure Reforestation)',
    'Clean Nepal, Green Nepal (Bagmati River Cleanups & Plastic Reduction)',
    'Skills & Business (Women Tailoring & Garment Making Trainer)',
    'Skills & Business (Youth Digital IT, Computer & Mobile Repair Trainer)',
    'Logistics, Warehousing & Vehicle Transportation'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiSubmitVolunteer({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        province: formData.province,
        district: formData.district,
        interest: formData.interest,
        availability: formData.availability,
        skills: `${formData.reason} | ${formData.experience || ''}`,
      });

      // Save to local cache with status = Pending
      const existing: VolunteerRecord[] = JSON.parse(localStorage.getItem('genzicon_admin_volunteers') || '[]');
      const newRec: VolunteerRecord = {
        ...formData,
        id: String(res?.id || `VOL-${Date.now()}`),
        volunteerId: res?.volunteer_id || `VOL-${Math.floor(1000 + Math.random() * 9000)}`,
        submittedAt: new Date().toISOString().split('T')[0],
        status: 'Pending' // Explicitly Pending until approved by admin
      };
      localStorage.setItem('genzicon_admin_volunteers', JSON.stringify([newRec, ...existing.filter(v => v.id !== newRec.id)]));
      window.dispatchEvent(new Event('genzicon_volunteers_updated'));
    } catch (err) {
      console.warn('Volunteer API submit fallback:', err);
    } finally {
      setLoading(false);
      onSuccess(formData);
    }
  };

  // Only display Approved and Contacted volunteers on the public wall
  const approvedVolunteers = volunteers.filter(v => v.status === 'Approved' || v.status === 'Contacted');

  const filteredVolunteers = approvedVolunteers.filter(v => {
    const matchesSearch = v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.volunteerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.interest.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = filterProvince === 'all' || v.province === filterProvince;
    const matchesTrack = filterTrack === 'all' || v.interest.toLowerCase().includes(filterTrack.toLowerCase());
    return matchesSearch && matchesProvince && matchesTrack;
  });

  const getPillarColor = (interest: string) => {
    const lower = interest.toLowerCase();
    if (lower.includes('clothes')) return { bg: 'bg-blue-50', text: 'text-[#003c90]', border: 'border-blue-200' };
    if (lower.includes('clean') || lower.includes('green') || lower.includes('tree')) return { bg: 'bg-emerald-50', text: 'text-[#00743a]', border: 'border-emerald-200' };
    if (lower.includes('skills') || lower.includes('tailoring') || lower.includes('digital')) return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
    return { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' };
  };

  return (
    <div id="volunteer-screen" className="w-full pt-16 pb-16 bg-[#f4f7fc]">
      {/* Header */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-6">
        <div className="border-b border-[#d8e3fb] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#003c90] block mb-0.5">
                {isNp ? 'युवा स्वयंसेवक सञ्जाल' : 'Youth Volunteer Taskforce'}
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111c2d] font-heading">
                {isNp ? 'स्वयंसेवक दर्ता तथा सक्रिय सदस्य सूची' : 'Join Our Volunteer Network & Active Directory'}
              </h1>
            </div>
            <p className="text-xs text-[#434653] max-w-md">
              {isNp
                ? 'कपडा बैंक, चुरे वृक्षारोपण र महिला सिलाई तालिममा आफ्नो सीप र समय योगदान गर्नुहोस्।'
                : 'Serve in Clothes Bank sorting hubs, plant trees in Chure, or train women in sewing and youth in tech.'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-10">
        {/* Row 1: Volunteer Registration Form + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Volunteer Form (Left 7 Cols) */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-6 border border-[#d8e3fb] shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#f0f3ff]">
              <Sparkles className="w-4 h-4 text-[#003c90]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                {isNp ? '१. स्वयंसेवक आवेदन फारम (Application Form)' : '1. Volunteer Registration Form'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'पूरा नाम *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={isNp ? 'तपाईंको पूरा नाम' : 'e.g. Suman Yadav'}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'इमेल ठेगाना *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'सम्पर्क फोन *' : 'Mobile Phone *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="98XXXXXXXX"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'प्रदेश' : 'Province'}
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  >
                    {nepalProvinces.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'जिल्ला / सहर' : 'District / City'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="Kathmandu / Janakpur"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                  {isNp ? 'तपाईंको रुचिको मुख्य क्षेत्र *' : 'Primary Area of Interest (3 Pillars) *'}
                </label>
                <select
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                >
                  {interestAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                  {isNp ? 'उपलब्धता / समय' : 'Availability / Time Commitment'}
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                >
                  <option value="Weekends (Saturday/Sunday)">Weekends (Saturday / Sunday)</option>
                  <option value="Part-time (5-10 hours/week)">Part-time (5-10 hours/week)</option>
                  <option value="Full-time Field Volunteer">Full-time Field Volunteer</option>
                  <option value="Emergency Disaster Callout">On-call Emergency & Disaster Callout</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                  {isNp ? 'स्वयंसेवक बन्न चाहनुको कारण र अनुभव' : 'Why do you want to volunteer? & Prior Experience'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder={isNp ? 'तपाईं कसरी सहयोग गर्न सक्नुहुन्छ...' : 'Tell us about your background, skills, or why you want to serve...'}
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#003c90] hover:bg-[#002660] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{isNp ? 'दर्ता पेश गर्नुहोस् (Submit Application)' : 'Submit Volunteer Application'}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-[#737784] text-center pt-1">
                {isNp
                  ? 'ℹ️ वेबसाइटबाट पेश गरिएको आवेदन फिल्ड टोलीबाट प्रमाणीकरण भएपछि स्वतः सक्रिय स्वयंसेवक सूचीमा प्रकाशित हुनेछ।'
                  : 'ℹ️ Submissions from the website are marked for verification. Once approved by our team, your profile appears on the Active Volunteers Directory below.'}
              </p>
            </form>
          </div>

          {/* Right Information Sidebar (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs">
              <h3 className="text-xs font-bold text-[#003c90] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#00743a]" />
                <span>{isNp ? 'स्वयंसेवकका मुख्य अवसरहरू' : 'Volunteer Tracks across 3 Pillars'}</span>
              </h3>

              <div className="space-y-3 text-xs text-[#434653]">
                <div className="p-3 bg-[#f9f9ff] border-l-2 border-[#003c90]">
                  <div className="font-bold text-[#111c2d] flex items-center gap-1">
                    <Shirt className="w-3.5 h-3.5 text-[#003c90]" />
                    <span>Clothes Bank Operations</span>
                  </div>
                  <p className="text-[11px] text-[#737784] mt-0.5">
                    {isNp ? 'कपडा छनोट, सफाइ, प्याकिङ र फिल्ड वितरण व्यवस्थापन।' : 'Sorting pre-loved clothes at city hubs, quality checks, and cold-wave distributions.'}
                  </p>
                </div>

                <div className="p-3 bg-[#f9f9ff] border-l-2 border-[#00743a]">
                  <div className="font-bold text-[#111c2d] flex items-center gap-1">
                    <Trees className="w-3.5 h-3.5 text-[#00743a]" />
                    <span>Clean & Green Eco-Brigade</span>
                  </div>
                  <p className="text-[11px] text-[#737784] mt-0.5">
                    {isNp ? 'चुरे क्षेत्रमा वृक्षारोपण र बागमती नदी सरसफाइ।' : 'Planting fruit trees, monitoring survival rates, and leading river plastic cleanups.'}
                  </p>
                </div>

                <div className="p-3 bg-[#f9f9ff] border-l-2 border-amber-600">
                  <div className="font-bold text-[#111c2d] flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-amber-700" />
                    <span>Skills & Entrepreneurship Mentor</span>
                  </div>
                  <p className="text-[11px] text-[#737784] mt-0.5">
                    {isNp ? 'महिलाहरूलाई सिलाई र युवालाई कम्प्युटर/मोबाइल तालिम।' : 'Teaching tailoring, bookkeeping, computer literacy, and business planning.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#003c90] text-white p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>{isNp ? 'स्वयंसेवक प्रमाण-पत्र र आईडी' : 'Official Certificate & ID Pass'}</span>
              </h4>
              <p className="text-xs text-blue-100 leading-relaxed mb-3">
                {isNp
                  ? '५० घण्टाभन्दा बढी सामाजिक कार्यमा खटिएका स्वयंसेवकहरूलाई आधिकारिक अनुभव प्रमाण-पत्र र डिजिटल स्वयंसेवक परिचयपत्र प्रदान गरिन्छ।'
                  : 'Volunteers completing over 50 field hours receive an official verified certificate, digital volunteer pass, and career recommendation letter.'}
              </p>
              <div className="text-[11px] font-mono text-emerald-300 font-bold">
                • 5,800+ Active Youth Volunteers across 77 Districts
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: ACTIVE VOLUNTEERS DIRECTORY (Below Form) */}
        <div className="bg-white p-5 sm:p-7 border border-[#d8e3fb] shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#f0f3ff] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-emerald-100 text-[#00743a] flex items-center justify-center font-bold shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#111c2d] font-heading">
                    {isNp ? 'हाम्रा सक्रिय युवा स्वयंसेवकहरू' : 'Our Active Youth Volunteers Directory'}
                  </h2>
                  <span className="px-2 py-0.5 bg-emerald-100 text-[#00743a] text-[10px] font-bold rounded-full">
                    {approvedVolunteers.length} {isNp ? 'प्रमाणित सदस्य' : 'Verified Active'}
                  </span>
                </div>
                <p className="text-xs text-[#737784]">
                  {isNp
                    ? 'नेपालका विभिन्न जिल्लामा प्रत्यक्ष फिल्डमा खटिएका प्रमाणित स्वयंसेवकहरू'
                    : 'Verified civic leaders and grassroots taskforce active across 77 districts of Nepal'}
                </p>
              </div>
            </div>

            {/* Quick stats badge */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <div className="px-3 py-1.5 bg-[#f0f4fc] border border-[#d8e3fb] text-xs font-bold text-[#003c90] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isNp ? '१००% पारदर्शी दर्ता' : 'Verified Taskforce'}</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-[#737784] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isNp ? 'नाम, जिल्ला वा ID बाट खोज्नुहोस्...' : 'Search by name, district, or volunteer ID...'}
                className="w-full pl-9 pr-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
              />
            </div>

            <div>
              <select
                value={filterProvince}
                onChange={(e) => setFilterProvince(e.target.value)}
                className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
              >
                <option value="all">{isNp ? 'सबै प्रदेश (All Provinces)' : 'All Provinces'}</option>
                {nepalProvinces.map((prov) => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filterTrack}
                onChange={(e) => setFilterTrack(e.target.value)}
                className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
              >
                <option value="all">{isNp ? 'सबै क्षेत्रहरू (All Tracks)' : 'All Service Tracks'}</option>
                <option value="clothes">{isNp ? 'कपडा बैंक (Clothes Bank)' : 'Clothes Bank Nepal'}</option>
                <option value="clean">{isNp ? 'सरसफाइ तथा वृक्षारोपण (Green Nepal)' : 'Clean & Green Eco-Brigade'}</option>
                <option value="skills">{isNp ? 'सिलाई तथा सीप तालिम (Skills)' : 'Skills & Tailoring Mentorship'}</option>
                <option value="logistics">{isNp ? 'ढुवानी तथा भण्डारण (Logistics)' : 'Logistics & Warehouse'}</option>
              </select>
            </div>
          </div>

          {/* Volunteer Cards Grid */}
          {filteredVolunteers.length === 0 ? (
            <div className="py-12 text-center text-[#737784] bg-[#f9f9ff] border border-dashed border-[#d8e3fb]">
              <Users className="w-8 h-8 mx-auto mb-2 text-[#737784]/50" />
              <p className="text-xs font-bold">{isNp ? 'कुनै स्वयंसेवक फेला परेन।' : 'No active volunteers found matching filters.'}</p>
              <p className="text-[11px] mt-0.5">{isNp ? 'कृपया खोज वा फिल्टर परिवर्तन गर्नुहोस्।' : 'Try adjusting your search criteria or province filter.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVolunteers.map((vol) => {
                const color = getPillarColor(vol.interest);
                return (
                  <div 
                    key={vol.id || vol.volunteerId} 
                    className="bg-white border border-[#d8e3fb] p-4 hover:border-[#003c90] transition-all hover:shadow-md flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Top Bar: ID and Status */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-bold text-[#003c90] bg-[#f0f4fc] px-2 py-0.5 border border-blue-100">
                          {vol.volunteerId || 'VOL-2026'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{isNp ? 'सक्रिय सदस्य' : 'Active'}</span>
                        </span>
                      </div>

                      {/* Name & Location */}
                      <div>
                        <h4 className="text-sm font-bold text-[#111c2d] font-heading">
                          {vol.fullName}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-[#434653] font-medium mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{vol.district}, {vol.province}</span>
                        </div>
                      </div>

                      {/* Track badge */}
                      <div className={`p-2 border text-[11px] font-semibold leading-snug ${color.bg} ${color.text} ${color.border}`}>
                        {vol.interest}
                      </div>

                      {/* Experience snippet / Reason */}
                      {vol.reason && (
                        <p className="text-[11px] text-[#737784] line-clamp-2 italic">
                          "{vol.reason}"
                        </p>
                      )}
                    </div>

                    {/* Footer with Commitment */}
                    <div className="pt-3 mt-3 border-t border-[#f0f3ff] flex items-center justify-between text-[10px] text-[#737784]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#003c90]" />
                        <span>{vol.availability}</span>
                      </div>
                      <span className="text-[9px] font-mono">{vol.submittedAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


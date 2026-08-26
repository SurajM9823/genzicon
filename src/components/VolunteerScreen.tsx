import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  HeartHandshake, 
  ShieldCheck,
  Send,
  Shirt,
  Trees,
  Briefcase,
  MapPin
} from 'lucide-react';
import { Language, VolunteerFormData } from '../types';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onSuccess(formData);
    }, 400);
  };

  return (
    <div id="volunteer-screen" className="w-full pt-16 pb-12 bg-[#f9f9ff]">
      {/* Header */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-6">
        <div className="border-b border-[#d8e3fb] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#003c90] block mb-0.5">
                {isNp ? 'स्वयंसेवक सञ्जाल' : 'Volunteer Taskforce'}
              </span>
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111c2d] font-heading"
              >
                {isNp ? 'स्वयंसेवक दर्ता फारम' : 'Join Our Volunteer Network'}
              </h1>
            </div>
            <p className="text-xs text-[#434653] max-w-md">
              {isNp
                ? 'कपडा बैंक, वृक्षारोपण र महिला सिलाई तालिममा आफ्नो सीप र समय योगदान गर्नुहोस्।'
                : 'Serve in Clothes Bank sorting hubs, plant trees in Chure, or train women in sewing and youth in tech.'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Volunteer Form (Left) */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-none sm:rounded-xs border border-[#d8e3fb]">
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
                    className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
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
                    className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
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
                    className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'प्रदेश' : 'Province'}
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
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
                    className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
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
                  className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
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
                  className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
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
                  className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#003c90] hover:bg-[#002660] text-white rounded-none sm:rounded-xs text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{isNp ? 'दर्ता पेश गर्नुहोस् (Submit Registration)' : 'Submit Volunteer Application'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Information Sidebar */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-none sm:rounded-xs border border-[#d8e3fb] shadow-xs">
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

            <div className="bg-[#003c90] text-white p-5 rounded-none sm:rounded-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2">
                {isNp ? 'स्वयंसेवक प्रमाण-पत्र र आईडी' : 'Official Certificate & ID Pass'}
              </h4>
              <p className="text-xs text-blue-100 leading-relaxed mb-3">
                {isNp
                  ? '५० घण्टाभन्दा बढी सामाजिक कार्यमा खटिएका स्वयंसेवकहरूलाई आधिकारिक अनुभव प्रमाण-पत्र र सिफारिस पत्र प्रदान गरिन्छ।'
                  : 'Volunteers completing over 50 field hours receive an official verified certificate, digital volunteer pass, and career recommendation letter.'}
              </p>
              <div className="text-[11px] font-mono text-emerald-300 font-bold">
                • 5,800+ Active Youth Volunteers across 77 Districts
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

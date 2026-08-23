import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  HeartHandshake, 
  ShieldCheck,
  Send
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
    province: 'Madhesh Province',
    district: 'Dhanusha',
    interest: 'Clean Water & Field Engineering',
    availability: 'Weekends (8-10 hours/week)',
    reason: '',
    experience: '',
    agreeTerms: true
  });

  const [loading, setLoading] = useState(false);

  const nepalProvinces = [
    'Madhesh Province',
    'Bagmati Province',
    'Karnali Province',
    'Gandaki Province',
    'Koshi Province',
    'Lumbini Province',
    'Sudurpashchim Province',
    'International / Remote'
  ];

  const interestAreas = [
    'Clean Water & Field Engineering',
    'Solar Electricity & Mountain Classrooms',
    'Rural Health & Medical Camps',
    'Girls in Tech & Computer Literacy',
    'Monsoon Flood & Disaster Relief',
    'Chure Range Agroforestry & Tree Plantation',
    'Photography, Video & Social Media'
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
                {isNp ? 'युवा स्वयंसेवक सञ्जाल' : 'Youth Volunteer Taskforce'}
              </span>
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111c2d]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {isNp ? 'स्वयंसेवक दर्ता फारम' : 'Join Our Volunteer Network'}
              </h1>
            </div>
            <p className="text-xs text-[#434653] max-w-md">
              {isNp
                ? 'खानेपानी, सौर्य ऊर्जा र स्वास्थ्य शिविरमा प्रत्यक्ष योगदान गर्नुहोस्। दर्तापश्चात डिजिटल पास प्राप्त हुन्छ।'
                : 'Connect with local field coordinators across all 7 provinces. Receive an official digital volunteer ID pass.'}
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
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'फोन / ह्वाट्सएप *' : 'Phone / WhatsApp *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="98XXXXXXXX"
                    className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'प्रदेश *' : 'Province *'}
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  >
                    {nepalProvinces.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'जिल्ला वा ठेगाना *' : 'District *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. Dhanusha / Jumla"
                    className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'रुचि भएको क्षेत्र *' : 'Interest Area *'}
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  >
                    {interestAreas.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'उपलब्धता *' : 'Availability *'}
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  >
                    <option value="Weekends (8-10 hours/week)">Weekends (8-10 hrs/week)</option>
                    <option value="Full-Time Field Deployment (2-4 weeks)">Full-Time Deployment (2-4 wks)</option>
                    <option value="Flexible Remote Online">Flexible Online</option>
                    <option value="On-Call Emergency Flood/Earthquake">Emergency Relief Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                  {isNp ? 'छोटो विवरण वा अनुभव (वैकल्पिक)' : 'Skills / Experience (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder={isNp ? 'तपाईंको अनुभव वा सीप...' : 'Tell us about your background...'}
                  className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="w-3.5 h-3.5 text-[#003c90] border-[#d8e3fb] rounded-none focus:ring-0"
                />
                <label htmlFor="agreeTerms" className="text-[11px] text-[#434653]">
                  {isNp ? 'म जेन्जिकन फाउन्डेशनको स्वयंसेवक आचारसंहिता पालना गर्न सहमत छु।' : 'I agree to the Genzicon Volunteer Code of Conduct.'}
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.agreeTerms}
                className="w-full py-2.5 bg-[#003c90] hover:bg-[#002660] disabled:bg-[#737784] text-white rounded-none sm:rounded-xs text-xs font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <span>{loading ? (isNp ? 'दर्ता हुँदैछ...' : 'Registering...') : (isNp ? 'आवेदन दर्ता गर्नुहोस्' : 'Submit Registration')}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Volunteer Benefits Sidebar (Right) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-4 sm:p-5 rounded-none sm:rounded-xs border border-[#d8e3fb]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00743a] block mb-1">
                {isNp ? 'स्वयंसेवक सुविधाहरू' : 'Volunteer Perks'}
              </span>
              <h3 className="text-sm font-bold text-[#111c2d] mb-3">
                {isNp ? 'हामीसँग जोडिएपछि के पाउनुहुन्छ?' : 'Official Field Accreditation'}
              </h3>

              <div className="space-y-2.5 text-xs text-[#434653]">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00743a] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#111c2d] block text-xs">Official Digital Volunteer ID:</strong>
                    <span>Instant verifiable pass with SWC registration affiliation.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00743a] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#111c2d] block text-xs">Certificate of Service:</strong>
                    <span>Signed credential useful for academic and fellowship applications.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00743a] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#111c2d] block text-xs">Field Travel & Food Stipend:</strong>
                    <span>Covered during rural deployments and medical eye camps.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#003c90] text-white p-4 sm:p-5 rounded-none sm:rounded-xs">
              <div className="flex items-center gap-2 mb-2">
                <HeartHandshake className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-xs">Direct WhatsApp Support</h4>
              </div>
              <p className="text-[11px] text-white/80 mb-3">
                Have questions regarding upcoming camps? Talk directly to our volunteer coordinator.
              </p>
              <a
                href="https://wa.me/9779823000000"
                target="_blank"
                rel="noreferrer"
                className="inline-block px-3 py-1.5 bg-white text-[#003c90] text-[11px] font-bold uppercase tracking-wider rounded-none hover:bg-slate-100 transition-colors"
              >
                Chat on WhatsApp (+977-9823000000)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

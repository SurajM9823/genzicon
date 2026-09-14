import React, { useState, useEffect } from 'react';
import { 
  Building,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2
} from 'lucide-react';
import { NavTab, Language, ContactMessage, SiteSettingsConfig, BoardMember } from '../types';
import { DEFAULT_BOARD_MEMBERS } from '../data/mockData';
import { apiSubmitContact, apiGetBoardMembers } from '../services/api';

interface ContactScreenProps {
  language: Language;
  onSelectTab: (tab: NavTab) => void;
  siteSettings?: SiteSettingsConfig;
}

export const ContactScreen: React.FC<ContactScreenProps> = ({ language, onSelectTab, siteSettings }) => {
  const isNp = language === 'np';

  // Board Members state (dynamic from backend with default fallback)
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>(() => {
    try {
      const cached = localStorage.getItem('genzicon_board_members');
      return cached ? JSON.parse(cached) : DEFAULT_BOARD_MEMBERS;
    } catch {
      return DEFAULT_BOARD_MEMBERS;
    }
  });

  useEffect(() => {
    let isMounted = true;
    const loadMembers = async () => {
      const data = await apiGetBoardMembers();
      if (data && data.length > 0 && isMounted) {
        setBoardMembers(data);
        try {
          localStorage.setItem('genzicon_board_members', JSON.stringify(data));
        } catch {}
      }
    };
    loadMembers();

    const handleUpdate = () => {
      loadMembers();
    };
    window.addEventListener('genzicon_board_members_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('genzicon_board_members_updated', handleUpdate);
    };
  }, []);

  // Dynamic Contact info
  const headTitle = isNp ? (siteSettings?.headOfficeTitleNp || 'केन्द्रीय कार्यालय (काठमाडौँ)') : (siteSettings?.headOfficeTitle || 'Central Head Office (Kathmandu)');
  const headSub = isNp ? (siteSettings?.headOfficeSubtitleNp || 'Genzicon Foundation Central HQ') : (siteSettings?.headOfficeSubtitle || 'Genzicon Foundation Central HQ');
  const headAddr = isNp ? (siteSettings?.headOfficeAddressNp || siteSettings?.headOfficeAddress || 'Putalisadak, Ward No. 28, Kathmandu 44600, Nepal') : (siteSettings?.headOfficeAddress || 'Putalisadak, Ward No. 28, Kathmandu 44600, Nepal');
  const headPhone = siteSettings?.headOfficePhone || '+977 1-4240000 / 9823000000';
  const headEmail = siteSettings?.headOfficeEmail || 'info@genzicon.org';
  const headHours = isNp ? (siteSettings?.headOfficeHoursNp || 'आइत - शुक्र: बिहान ९:३० देखि साँझ ५:३० सम्म') : (siteSettings?.headOfficeHours || 'Sun - Fri: 9:30 AM – 5:30 PM (NPT)');

  const regTitle = isNp ? (siteSettings?.regionalOfficeTitleNp || 'मधेस प्रदेश क्षेत्रीय कार्यालय (जनकपुर)') : (siteSettings?.regionalOfficeTitle || 'Madhesh Regional Office (Janakpur)');
  const regSub = isNp ? (siteSettings?.regionalOfficeSubtitleNp || 'Field & Clothes Bank Operations') : (siteSettings?.regionalOfficeSubtitle || 'Field & Clothes Bank Operations');
  const regAddr = isNp ? (siteSettings?.regionalOfficeAddressNp || siteSettings?.regionalOfficeAddress || 'Station Road, Ward No. 4, Janakpurdham, Dhanusha') : (siteSettings?.regionalOfficeAddress || 'Station Road, Ward No. 4, Janakpurdham, Dhanusha');
  const regPhone = siteSettings?.regionalOfficePhone || '+977 41-520000';
  const regEmail = siteSettings?.regionalOfficeEmail || 'janakpur@genzicon.org';

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiSubmitContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      const existing: ContactMessage[] = JSON.parse(localStorage.getItem('genzicon_contacts') || '[]');
      const newMsg: ContactMessage = {
        id: String(res?.id || `msg-${Date.now()}`),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        date: new Date().toISOString().split('T')[0],
        status: 'New'
      };
      localStorage.setItem('genzicon_contacts', JSON.stringify([newMsg, ...existing]));
    } catch (err) {
      console.warn('Contact API submission fallback:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div id="contact-screen" className="w-full pt-16 pb-12 bg-[#f9f9ff]">
      {/* Clean Header */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-6">
        <div className="border-b border-[#d8e3fb] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#003c90] block mb-0.5">
                {isNp ? 'सम्पर्क ठेगाना तथा सोधपुछ' : 'Contact & Inquiries'}
              </span>
            
            </div>
          </div>
        </div>
      </div>

      {/* Main Contact Grid */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Official Office Locations */}
          <div className="lg:col-span-5 space-y-4">
            {/* Kathmandu Central Head Office */}
            <div className="bg-white p-4 sm:p-5 border border-[#d8e3fb] shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#003c90]/10 text-[#003c90] flex items-center justify-center">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#111c2d]">
                    {headTitle}
                  </h3>
                  <span className="text-[10px] text-[#00743a] font-semibold">{headSub}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#434653]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#003c90] shrink-0 mt-0.5" />
                  <span>{headAddr}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#003c90] shrink-0" />
                  <a href={`tel:${headPhone.split('/')[0].trim()}`} className="hover:text-[#003c90] font-medium">{headPhone}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#003c90] shrink-0" />
                  <a href={`mailto:${headEmail}`} className="hover:text-[#003c90] font-medium">{headEmail}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#003c90] shrink-0" />
                  <span>{headHours}</span>
                </div>
              </div>
            </div>

            {/* Janakpur Field Office */}
            <div className="bg-white p-4 sm:p-5 border border-[#d8e3fb] shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#00743a]/10 text-[#00743a] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#111c2d]">
                    {regTitle}
                  </h3>
                  <span className="text-[10px] text-[#003c90] font-semibold">{regSub}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#434653]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#00743a] shrink-0 mt-0.5" />
                  <span>{regAddr}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#00743a] shrink-0" />
                  <a href={`tel:${regPhone.split('/')[0].trim()}`} className="hover:text-[#00743a] font-medium">{regPhone}</a>
                </div>
                {regEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#00743a] shrink-0" />
                    <a href={`mailto:${regEmail}`} className="hover:text-[#00743a] font-medium">{regEmail}</a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-6 border border-[#d8e3fb] shadow-xs">
            {submitted ? (
              <div className="p-6 text-center space-y-3 bg-[#f0f3ff] border border-[#003c90]/20">
                <CheckCircle2 className="w-10 h-10 text-[#00743a] mx-auto" />
                <h3 className="text-base font-bold text-[#111c2d]">
                  {isNp ? 'सन्देश सफलतापूर्वक प्राप्त भयो!' : 'Message Received!'}
                </h3>
                <p className="text-xs text-[#434653] max-w-md mx-auto">
                  {isNp
                    ? 'हाम्रो टोलीले २४ घण्टाभित्र तपाईंलाई फोन वा इमेलमार्फत जानकारी गराउनेछ।'
                    : 'Thank you for contacting Genzicon Foundation. Our coordination team will respond within 24 business hours.'}
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="px-4 py-2 bg-[#003c90] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#002660] transition-colors"
                >
                  {isNp ? 'अर्को सन्देश पठाउनुहोस्' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <h3 className="text-sm sm:text-base font-bold text-[#111c2d] font-heading">
                    {isNp ? 'हामीलाई सन्देश पठाउनुहोस्' : 'Send Us a Direct Message'}
                  </h3>
                  <p className="text-xs text-[#737784]">
                    {isNp
                      ? 'सहयोग, सहकार्य, कपडा दान वा संस्थागत सोधपुछका लागि फारम भर्नुहोस्।'
                      : 'Fill in the form below for partnership, donations, clothes queries, or field support.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#111c2d] mb-1">
                        {isNp ? 'पूरा नाम *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Suraj Mahato"
                        className="w-full px-3 py-2 text-xs border border-[#d8e3fb] focus:outline-hidden focus:border-[#003c90]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#111c2d] mb-1">
                        {isNp ? 'इमेल ठेगाना *' : 'Email Address *'}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full px-3 py-2 text-xs border border-[#d8e3fb] focus:outline-hidden focus:border-[#003c90]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#111c2d] mb-1">
                        {isNp ? 'सम्पर्क फोन नम्बर' : 'Phone / Mobile'}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 9823000000"
                        className="w-full px-3 py-2 text-xs border border-[#d8e3fb] focus:outline-hidden focus:border-[#003c90]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#111c2d] mb-1">
                        {isNp ? 'विषय / सन्दर्भ' : 'Subject / Topic'}
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-[#d8e3fb] focus:outline-hidden focus:border-[#003c90] bg-white"
                      >
                        <option value="Clothes Bank Inquiry">Clothes Bank Inquiry</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Corporate CSR Partnership">Corporate CSR Partnership</option>
                        <option value="Volunteer Opportunity">Volunteer Opportunity</option>
                        <option value="Disaster Relief Coordination">Disaster Relief Coordination</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111c2d] mb-1">
                      {isNp ? 'तपाईंको सन्देश वा जिज्ञासा *' : 'Your Message / Inquiry Details *'}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={isNp ? 'कृपया आफ्नो जिज्ञासा वा सुझाव लेख्नुहोस्...' : 'Describe how we can assist you or collaborate...'}
                      className="w-full px-3 py-2 text-xs border border-[#d8e3fb] focus:outline-hidden focus:border-[#003c90]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-[#003c90] hover:bg-[#002660] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? (isNp ? 'पठाउँदै...' : 'Sending...') : (isNp ? 'सन्देश पठाउनुहोस्' : 'Send Message')}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Board Members Section: Clean, small circular image with name and position below */}
        <div className="mt-12 sm:mt-14 pt-8 border-t border-[#d8e3fb]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 justify-items-center">
            {boardMembers.filter(m => m.isActive !== false).map((member) => (
              <div 
                key={member.id} 
                className="group flex flex-col items-center text-center w-full max-w-[150px]"
              >
                {/* Small circular profile image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-[#d8e3fb] group-hover:ring-[#003c90] transition-all duration-300 transform group-hover:scale-105 bg-[#e7eeff] mb-2.5 shrink-0">
                  <img 
                    src={member.imageUrl || member.final_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Name below */}
                <h3 className="text-xs sm:text-sm font-bold text-[#111c2d] group-hover:text-[#003c90] transition-colors leading-snug">
                  {isNp && member.nameNp ? member.nameNp : member.name}
                </h3>

                {/* Position below */}
                <p className="text-[11px] text-[#00743a] font-semibold mt-0.5 leading-snug">
                  {isNp && member.positionNp ? member.positionNp : member.position}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Building,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { NavTab, Language, ContactMessage } from '../types';

interface ContactScreenProps {
  language: Language;
  onSelectTab: (tab: NavTab) => void;
}

export const ContactScreen: React.FC<ContactScreenProps> = ({ language, onSelectTab }) => {
  const isNp = language === 'np';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      const existing = JSON.parse(localStorage.getItem('genzicon_contacts') || '[]');
      const newMsg: ContactMessage = {
        id: `msg-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        date: new Date().toISOString().split('T')[0],
        status: 'New'
      };
      localStorage.setItem('genzicon_contacts', JSON.stringify([newMsg, ...existing]));
    }, 400);
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
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111c2d]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {isNp ? 'सम्पर्क गर्नुहोस्' : 'Contact Genzicon'}
              </h1>
            </div>
            <p className="text-xs text-[#434653] max-w-md">
              {isNp
                ? 'काठमाडौँ तथा जनकपुर कार्यालय वा सिधै अनलाइन फारममार्फत हामीलाई सम्पर्क गर्नुहोस्।'
                : 'Reach out to our offices in Kathmandu and Janakpurdham, or send us a direct message below.'}
            </p>
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
                    {isNp ? 'केन्द्रीय कार्यालय (काठमाडौँ)' : 'Central Head Office (Kathmandu)'}
                  </h3>
                  <span className="text-[10px] text-[#00743a] font-semibold">SWC Affiliation No. 54128</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#434653]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#003c90] shrink-0 mt-0.5" />
                  <span>Putalisadak, Ward No. 28, Kathmandu 44600, Nepal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#003c90] shrink-0" />
                  <a href="tel:+97714240000" className="hover:text-[#003c90] font-medium">+977 1-4240000 / 9823000000</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#003c90] shrink-0" />
                  <a href="mailto:info@genzicon.org" className="hover:text-[#003c90] font-medium">info@genzicon.org</a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#003c90] shrink-0" />
                  <span>Sun - Fri: 9:30 AM – 5:30 PM (NPT)</span>
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
                    {isNp ? 'मधेस प्रदेश क्षेत्रीय कार्यालय (जनकपुर)' : 'Madhesh Regional Office (Janakpur)'}
                  </h3>
                  <span className="text-[10px] text-[#003c90] font-semibold">Field & Clothes Bank Operations</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#434653]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#00743a] shrink-0 mt-0.5" />
                  <span>Station Road, Ward No. 4, Janakpurdham, Dhanusha</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#00743a] shrink-0" />
                  <a href="tel:+97741520000" className="hover:text-[#00743a] font-medium">+977 41-520000</a>
                </div>
              </div>
            </div>

            {/* Direct Support Notice */}
            <div className="bg-[#e7eeff] p-4 border border-[#d8e3fb]">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-[#003c90]" />
                <span className="text-xs font-bold text-[#003c90]">
                  {isNp ? 'तत्काल कपडा दान तथा सोधपुछ' : 'Direct Clothes Donation Help'}
                </span>
              </div>
              <p className="text-[11px] text-[#434653] leading-relaxed">
                {isNp
                  ? 'कपडा दान संकलन वा वितरण सहायताका लागि हाम्रो हटलाइन ९८२३०००००० मा सिधै सम्पर्क गर्न सक्नुहुन्छ।'
                  : 'For urgent clothes pickup or emergency cold-wave support, call our hotline at 9823000000 or chat on WhatsApp.'}
              </p>
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
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Building
} from 'lucide-react';
import { Language, ContactMessage } from '../types';

interface ContactScreenProps {
  language: Language;
}

export const ContactScreen: React.FC<ContactScreenProps> = ({ language }) => {
  const isNp = language === 'np';

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
      {/* Header */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-6">
        <div className="border-b border-[#d8e3fb] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#003c90] block mb-0.5">
                {isNp ? 'सम्पर्क तथा कार्यालय ठेगाना' : 'Contact & Offices'}
              </span>
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111c2d]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {isNp ? 'हामीसँग सम्पर्क गर्नुहोस्' : 'Get in Touch with Genzicon'}
              </h1>
            </div>
            <p className="text-xs text-[#434653] max-w-md">
              {isNp
                ? 'काठमाडौँ तथा जनकपुर कार्यालय वा सिधै अनलाइन फारममार्फत सम्पर्क गर्नुहोस्।'
                : 'Offices in Kathmandu & Janakpurdham. We respond within 24 hours.'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Office details & Direct Channels */}
          <div className="lg:col-span-5 space-y-4">
            {/* Kathmandu Head Office */}
            <div className="bg-white p-4 sm:p-5 rounded-none sm:rounded-xs border border-[#d8e3fb]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-none bg-[#003c90]/10 text-[#003c90] flex items-center justify-center">
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
                  <a href="tel:+97714240000" className="hover:text-[#003c90]">+977 1-4240000 / 9823000000</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#003c90] shrink-0" />
                  <a href="mailto:info@genzicon.org" className="hover:text-[#003c90]">info@genzicon.org</a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#003c90] shrink-0" />
                  <span>Sun - Fri: 9:30 AM – 5:30 PM (NPT)</span>
                </div>
              </div>
            </div>

            {/* Janakpur Field Office */}
            <div className="bg-white p-4 sm:p-5 rounded-none sm:rounded-xs border border-[#d8e3fb]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-none bg-[#00743a]/10 text-[#00743a] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#111c2d]">
                    {isNp ? 'मधेस प्रदेश फिल्ड कार्यालय (जनकपुर)' : 'Madhesh Regional Office (Janakpur)'}
                  </h3>
                  <span className="text-[10px] text-[#003c90] font-semibold">Operations & Relief Center</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#434653]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#00743a] shrink-0 mt-0.5" />
                  <span>Station Road, Ward No. 4, Janakpurdham, Dhanusha</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#00743a] shrink-0" />
                  <span>+977 41-520000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-none sm:rounded-xs border border-[#d8e3fb]">
            {submitted ? (
              <div className="p-6 text-center space-y-3 bg-[#f0f3ff] rounded-none sm:rounded-xs border border-[#003c90]/20">
                <CheckCircle2 className="w-10 h-10 text-[#00743a] mx-auto" />
                <h3 className="text-base font-bold text-[#111c2d]">
                  {isNp ? 'सन्देश सफलतापूर्वक प्राप्त भयो!' : 'Message Received!'}
                </h3>
                <p className="text-xs text-[#434653] max-w-md mx-auto">
                  {isNp
                    ? 'धन्यवाद! हाम्रो टिमले २४ घण्टाभित्र सम्पर्क गर्नेछ।'
                    : 'Thank you for reaching out. Our team will review your inquiry and respond shortly.'}
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="px-4 py-1.5 bg-[#003c90] text-white text-xs font-bold uppercase tracking-wider rounded-none sm:rounded-xs"
                >
                  {isNp ? 'अर्को सन्देश पठाउनुहोस्' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'तपाईंको नाम *' : 'Your Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isNp ? 'पूरा नाम' : 'e.g. Ramesh Thapa'}
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
                      placeholder="you@domain.com"
                      className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'फोन / ह्वाट्सएप' : 'Phone / WhatsApp'}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="98XXXXXXXX"
                      className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'विषय *' : 'Subject *'}
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Project Sponsorship">Project Sponsorship</option>
                      <option value="Volunteering">Volunteering Opportunity</option>
                      <option value="Media & Press">Media & Press</option>
                      <option value="Audit & Verification">Audit & Verification</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'सन्देश विवरण *' : 'Message Details *'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={isNp ? 'कृपया आफ्नो सन्देश यहाँ लेख्नुहोस्...' : 'How can we collaborate?'}
                    className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#003c90] hover:bg-[#002660] text-white rounded-none sm:rounded-xs text-xs font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <span>{loading ? (isNp ? 'पठाउँदै...' : 'Sending...') : (isNp ? 'सन्देश पठाउनुहोस्' : 'Send Message')}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

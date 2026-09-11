import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Send, 
  MapPin, 
  Search, 
  Sparkles, 
  Clock, 
  Upload, 
  X, 
  UserCheck, 
  AlertCircle 
} from 'lucide-react';
import { Language, VolunteerFormData, VolunteerRecord } from '../types';
import { apiSubmitVolunteer, apiGetVolunteers } from '../services/api';
import { compressImage } from '../utils/imageCompress';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    agreeTerms: true,
    photoFile: null,
    imageUrl: '',
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
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
    'Clothes Bank Nepal (Collection, Sorting & Distribution)',
    'Clothes Bank Nepal (Field Distribution & Cold Wave Relief)',
    'Clean Nepal, Green Nepal (Tree Plantation & Chure Reforestation)',
    'Clean Nepal, Green Nepal (River Cleanups & Plastic Reduction)',
    'Skills & Business (Women Tailoring & Garment Training)',
    'Skills & Business (Youth IT, Computer & Tech Training)',
    'Logistics, Warehousing & Vehicle Transportation'
  ];

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Auto compress photo to 800px max JPEG
      const compressed = await compressImage(file, 800, 0.85);
      setFormData(prev => ({ ...prev, photoFile: compressed }));
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setFormData(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(compressed);
    } catch {
      setFormData(prev => ({ ...prev, photoFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setFormData(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setPhotoError(null);
    setFormData(prev => ({ ...prev, photoFile: null, imageUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setLoading(true);

    try {
      let finalPhoto = formData.photoFile;
      if (finalPhoto) {
        finalPhoto = await compressImage(finalPhoto, 800, 0.85);
      }

      const res = await apiSubmitVolunteer({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        province: formData.province,
        district: formData.district.trim(),
        interest: formData.interest,
        availability: formData.availability,
        skills: formData.reason || formData.experience || '',
        photoFile: finalPhoto,
        imageUrl: (formData.imageUrl && !formData.imageUrl.startsWith('data:')) ? formData.imageUrl : undefined,
      });

      if (!res.success) {
        setFormError(res.error || (isNp ? 'स्वयंसेवक दर्ता गर्दा त्रुटि भयो। कृपया फेरि प्रयास गर्नुहोस्।' : 'Failed to submit volunteer application. Please check your details and try again.'));
        setLoading(false);
        return;
      }

      const serverData = res.data || {};

      // Save to local cache with status = Pending
      const existing: VolunteerRecord[] = JSON.parse(localStorage.getItem('genzicon_admin_volunteers') || '[]');
      const newRec: VolunteerRecord = {
        ...formData,
        id: String(serverData.id || `VOL-${Date.now()}`),
        volunteerId: serverData.volunteer_id || `VOL-${Math.floor(1000 + Math.random() * 9000)}`,
        imageUrl: serverData.final_image_url || serverData.photo || formData.imageUrl || '',
        submittedAt: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };
      localStorage.setItem('genzicon_admin_volunteers', JSON.stringify([newRec, ...existing.filter(v => v.id !== newRec.id)]));
      window.dispatchEvent(new Event('genzicon_volunteers_updated'));

      onSuccess(formData);
    } catch (err: any) {
      console.warn('Volunteer API submit error:', err);
      setFormError(err?.message || (isNp ? 'अनपेक्षित त्रुटि भयो।' : 'An unexpected error occurred.'));
    } finally {
      setLoading(false);
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
    if (lower.includes('skills') || lower.includes('tailoring') || lower.includes('tech') || lower.includes('it')) return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
    return { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' };
  };

  return (
    <div id="volunteer-screen" className="w-full pt-14 pb-16 bg-[#f4f7fc]">
      {/* Compact Top Header */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-[#d8e3fb] pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#003c90] block">
              {isNp ? 'युवा स्वयंसेवक सञ्जाल' : 'Youth Volunteer Taskforce'}
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-[#111c2d] font-heading">
              {isNp ? 'स्वयंसेवक दर्ता तथा सक्रिय सदस्य सूची' : 'Volunteer Registration & Directory'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00743a] bg-emerald-50 border border-emerald-200 px-2.5 py-1">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{approvedVolunteers.length} {isNp ? 'प्रमाणित सक्रिय' : 'Active Members'}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-6">
        {/* Full-Width Compact Registration Form (5 columns per row) */}
        <div className="bg-white p-4 sm:p-5 border border-[#d8e3fb] shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#f0f3ff]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#003c90]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                {isNp ? 'स्वयंसेवक दर्ता फारम (Registration Form)' : 'Volunteer Registration Form'}
              </h2>
            </div>
            <span className="text-[10px] text-[#737784]">
              {isNp ? 'फोटो: २०० KB सम्म' : 'Photo: Under 200 KB'}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2.5">
            {formError && (
              <div className="p-2.5 bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold block">{isNp ? 'त्रुटि (Error):' : 'Application Error:'}</span>
                  <span className="text-[11px]">{formError}</span>
                </div>
              </div>
            )}
            {/* Row 1: 5 Columns (Full Name, Phone, Email, Province, District) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-[#111c2d] uppercase tracking-wider mb-0.5">
                  {isNp ? 'पूरा नाम *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={isNp ? 'तपाईंको नाम' : 'Full Name'}
                  className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#111c2d] uppercase tracking-wider mb-0.5">
                  {isNp ? 'फोन नम्बर *' : 'Phone Number *'}
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="98XXXXXXXX"
                  className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#111c2d] uppercase tracking-wider mb-0.5">
                  {isNp ? 'इमेल *' : 'Email Address *'}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#111c2d] uppercase tracking-wider mb-0.5">
                  {isNp ? 'प्रदेश *' : 'Province *'}
                </label>
                <select
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full px-2 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                >
                  {nepalProvinces.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#111c2d] uppercase tracking-wider mb-0.5">
                  {isNp ? 'जिल्ला / सहर *' : 'District / City *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder={isNp ? 'जिल्ला' : 'District'}
                  className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                />
              </div>
            </div>

            {/* Row 2: 5 Columns (Pillar Track, Availability, Skills/Reason, Photo Upload, Submit) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 items-end">
              <div>
                <label className="block text-[10px] font-bold text-[#111c2d] uppercase tracking-wider mb-0.5">
                  {isNp ? 'सेवा क्षेत्र (Track) *' : 'Pillar Track *'}
                </label>
                <select
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full px-2 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                >
                  {interestAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#111c2d] uppercase tracking-wider mb-0.5">
                  {isNp ? 'समय उपलब्धता *' : 'Availability *'}
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full px-2 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                >
                  <option value="Weekends (Saturday/Sunday)">Weekends (Saturday / Sunday)</option>
                  <option value="Part-time (5-10 hours/week)">Part-time (5-10 hrs/week)</option>
                  <option value="Full-time Field Volunteer">Full-time Field</option>
                  <option value="Emergency Disaster Callout">Emergency Callout</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#111c2d] uppercase tracking-wider mb-0.5">
                  {isNp ? 'सीप / अनुभव *' : 'Skills & Experience *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder={isNp ? 'तपाईंको सीप वा अनुभव...' : 'Brief skills, role or background'}
                  className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                />
              </div>

              {/* Photo Upload Cell */}
              <div>
                <label className="block text-[10px] font-bold text-[#111c2d] uppercase tracking-wider mb-0.5">
                  {isNp ? 'फोटो (≤ २०० KB)' : 'Photo (≤ 200 KB)'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="volunteer-photo-input"
                  />
                  {!photoPreview ? (
                    <label
                      htmlFor="volunteer-photo-input"
                      className="w-full py-1.5 px-2 border border-dashed border-[#003c90]/40 hover:border-[#003c90] bg-[#f9f9ff] hover:bg-blue-50/50 cursor-pointer flex items-center justify-center gap-1 text-[11px] font-semibold text-[#003c90] transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isNp ? 'फोटो छान्नुहोस्' : 'Upload Photo'}</span>
                    </label>
                  ) : (
                    <div className="w-full flex items-center justify-between px-2 py-1 bg-blue-50 border border-blue-200">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-6 h-6 object-cover rounded-xs border border-blue-300 shrink-0"
                        />
                        <span className="text-[10px] font-semibold text-[#003c90] truncate">
                          {formData.photoFile?.name || 'Photo'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="p-0.5 text-rose-600 hover:text-rose-800"
                        title="Remove Photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                {photoError && (
                  <span className="text-[9px] text-rose-600 flex items-center gap-0.5 mt-0.5 font-bold">
                    <AlertCircle className="w-3 h-3" />
                    {photoError}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-1.5 px-3 bg-[#003c90] hover:bg-[#002660] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 shadow-xs disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{isNp ? 'दर्ता पेश गर्नुहोस्' : 'Submit Application'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-[10px] text-[#737784] pt-1">
              {isNp
                ? 'ℹ️ अनलाइन दर्ता स्वतः समीक्षामा जानेछ र फिल्ड संयोजकबाट स्वीकृत भएपछि सक्रिय सूचीमा देखिनेछ।'
                : 'ℹ️ Website applications are placed in review and automatically published to the active directory once verified.'}
            </p>
          </form>
        </div>

        {/* ACTIVE VOLUNTEERS DIRECTORY */}
        <div className="bg-white p-4 sm:p-5 border border-[#d8e3fb] shadow-xs space-y-4">
          {/* Section Header & Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#f0f3ff] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-emerald-100 text-[#00743a] flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#111c2d] font-heading">
                    {isNp ? 'सक्रिय स्वयंसेवक सूची' : 'Active Volunteers'}
                  </h3>
                  <span className="px-2 py-0.2 bg-emerald-100 text-[#00743a] text-[10px] font-bold rounded-full">
                    {approvedVolunteers.length} {isNp ? 'प्रमाणित' : 'Verified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs w-full md:w-auto md:min-w-[550px]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#737784] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isNp ? 'नाम वा जिल्ला खोज्नुहोस्...' : 'Search name or district...'}
                  className="w-full pl-8 pr-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>

              <div>
                <select
                  value={filterProvince}
                  onChange={(e) => setFilterProvince(e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                >
                  <option value="all">{isNp ? 'सबै प्रदेश' : 'All Provinces'}</option>
                  {nepalProvinces.map((prov) => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={filterTrack}
                  onChange={(e) => setFilterTrack(e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                >
                  <option value="all">{isNp ? 'सबै क्षेत्रहरू' : 'All Tracks'}</option>
                  <option value="clothes">{isNp ? 'कपडा बैंक' : 'Clothes Bank'}</option>
                  <option value="clean">{isNp ? 'सरसफाइ तथा वृक्षारोपण' : 'Green Nepal'}</option>
                  <option value="skills">{isNp ? 'सिलाई तथा सीप' : 'Skills & IT'}</option>
                  <option value="logistics">{isNp ? 'ढुवानी तथा भण्डारण' : 'Logistics'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Compact Volunteer Cards Grid */}
          {filteredVolunteers.length === 0 ? (
            <div className="py-8 text-center text-[#737784] bg-[#f9f9ff] border border-dashed border-[#d8e3fb]">
              <Users className="w-6 h-6 mx-auto mb-1 text-[#737784]/50" />
              <p className="text-xs font-bold">{isNp ? 'कुनै स्वयंसेवक फेला परेन।' : 'No active volunteers found.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {filteredVolunteers.map((vol) => {
                const color = getPillarColor(vol.interest);
                const initials = vol.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <div 
                    key={vol.id || vol.volunteerId} 
                    className="bg-white border border-[#d8e3fb] p-3 hover:border-[#003c90] transition-all hover:shadow-xs flex flex-col justify-between space-y-2"
                  >
                    {/* Header: Photo + Name + ID */}
                    <div className="flex items-start gap-2.5">
                      {vol.imageUrl ? (
                        <img
                          src={vol.imageUrl}
                          alt={vol.fullName}
                          className="w-10 h-10 rounded-xs object-cover border border-[#d8e3fb] shrink-0 bg-gray-100"
                          onError={(e) => {
                            // Fallback to initial badge if image fails to load
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xs bg-[#003c90]/10 text-[#003c90] flex items-center justify-center font-bold text-xs shrink-0 border border-[#003c90]/20 font-mono">
                          {initials}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-[9px] font-bold text-[#003c90] bg-[#f0f4fc] px-1.5 py-0.2 border border-blue-100 truncate">
                            {vol.volunteerId || 'VOL-2026'}
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            <span>{isNp ? 'सक्रिय' : 'Active'}</span>
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#111c2d] truncate mt-0.5">
                          {vol.fullName}
                        </h4>
                        <div className="flex items-center gap-0.5 text-[10px] text-[#434653] truncate">
                          <MapPin className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                          <span className="truncate">{vol.district}, {vol.province}</span>
                        </div>
                      </div>
                    </div>

                    {/* Track tag */}
                    <div className={`p-1.5 text-[10px] font-semibold leading-tight line-clamp-2 border ${color.bg} ${color.text} ${color.border}`}>
                      {vol.interest}
                    </div>

                    {/* Experience snippet */}
                    {vol.reason && (
                      <p className="text-[10px] text-[#737784] line-clamp-2 italic leading-snug">
                        "{vol.reason}"
                      </p>
                    )}

                    {/* Footer with Commitment */}
                    <div className="pt-2 border-t border-[#f0f3ff] flex items-center justify-between text-[9px] text-[#737784]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-[#003c90]" />
                        <span className="truncate max-w-[120px]">{vol.availability}</span>
                      </div>
                      <span className="font-mono text-[8px]">{vol.submittedAt}</span>
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

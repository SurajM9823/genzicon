import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shirt, 
  Heart, 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Clock, 
  Building2, 
  PackageCheck,
  AlertCircle,
  Share2,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Navigation,
  Send,
  PackageOpen,
  Info
} from 'lucide-react';
import { Language, ClothesDonationRequest } from '../types';
import { apiSubmitClothesDonation } from '../services/api';
import { ClothesDonorSlider } from './ClothesDonorSlider';

interface ClothesBankScreenProps {
  language: Language;
  onOpenDonateModal: () => void;
  onNavigateToVolunteer: () => void;
}

export const ClothesBankScreen: React.FC<ClothesBankScreenProps> = ({
  language,
  onOpenDonateModal,
  onNavigateToVolunteer
}) => {
  const isNp = language === 'np';

  // Clothes Donation Form State
  const [donorName, setDonorName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [province, setProvince] = useState('Bagmati Province');
  const [district, setDistrict] = useState('Kathmandu');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [clothesType, setClothesType] = useState<'winter' | 'summer' | 'kids' | 'blankets' | 'mixed'>('winter');
  const [approxItemsCount, setApproxItemsCount] = useState<number>(25);
  const [donationMode, setDonationMode] = useState<'self_dropoff' | 'courier_parcel' | 'pathao_rider' | 'doorstep_pickup'>('self_dropoff');
  const [courierName, setCourierName] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationSuccessId, setDonationSuccessId] = useState<string | null>(null);

  const handleClothesDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !phone.trim() || !address.trim()) {
      alert(isNp ? 'कृपया आफ्नो नाम, फोन नम्बर र ठेगाना भर्नुहोस्।' : 'Please fill in your name, phone number, and address.');
      return;
    }

    setIsSubmitting(true);
    const fallbackId = `CBN-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      const res = await apiSubmitClothesDonation({
        donorName,
        phone,
        email,
        province,
        district,
        city,
        address,
        clothesType,
        approxItemsCount,
        donationMode,
        pickupDate: deliveryDate,
        dropoffHub: 'Genzicon Central Clothes Hub, Kathmandu',
        notes: courierName ? `[Delivery via: ${courierName}] ${notes}` : notes,
      });

      const assignedId = res?.ref_id || fallbackId;
      setDonationSuccessId(assignedId);

      // Also persist to local storage list
      const currentList: ClothesDonationRequest[] = JSON.parse(localStorage.getItem('genzicon_clothes_donations') || '[]');
      const newEntry: ClothesDonationRequest = {
        id: String(res?.id || fallbackId),
        donorName,
        phone,
        email,
        province,
        district,
        city,
        address,
        clothesType,
        approxItemsCount,
        donationMode,
        dropoffHub: 'Genzicon Central Clothes Hub, Kathmandu',
        pickupDate: deliveryDate,
        notes: courierName ? `[Delivery via: ${courierName}] ${notes}` : notes,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
      };
      localStorage.setItem('genzicon_clothes_donations', JSON.stringify([newEntry, ...currentList]));
    } catch (err) {
      console.warn('Error submitting to API:', err);
      setDonationSuccessId(fallbackId);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById('clothes-donation-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fc] pb-16">
      {/* Hero Banner with Nepal Context */}
      <div className="bg-[#002660] text-white pt-8 pb-12 relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }} 
        />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200 mb-3">
              <Shirt className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isNp ? 'जेन्जिकन कपडा बैंक नेपाल' : 'Genzicon Clothes Bank Nepal'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
              {isNp ? 'कपडा बैंक नेपाल: प्रयोगमा नआएका कपडाको सदुपयोग' : 'Clothes Bank Nepal — Dignified Clothing for Every Life'}
            </h1>
          </div>
        </div>
      </div>

      {/* Dynamic Sliding Clothes Donors Wall */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 -mt-6 relative z-20">
        <ClothesDonorSlider 
          language={language}
          onDonateClick={scrollToForm}
        />
      </div>

      {/* Main Area: Donation Form + Central Location Map */}
      <div id="clothes-donation-form-section" className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Cols: Clothes Donation Submission Form */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-8 border border-[#d8e3fb] shadow-sm">
            {donationSuccessId ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-950 font-heading">
                    {isNp ? 'कपडा दान सफलतापूर्वक दर्ता भयो!' : 'Clothes Donation Registered Successfully!'}
                  </h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto mt-1">
                    {isNp
                      ? `तपाईंको दर्ता नम्बर: ${donationSuccessId} हो। हाम्रो टोलीले तपाईंको कपडा प्राप्त हुनासाथ प्रमाणीकरण गरी दाता सूचीमा समावेश गर्नेछ।`
                      : `Your tracking reference ID is ${donationSuccessId}. Once your clothes arrive at our Kathmandu hub, we will inspect and list you on our Donors Wall.`}
                  </p>
                </div>

                <div className="p-4 bg-white border border-emerald-200 text-left text-xs space-y-1.5 max-w-md mx-auto">
                  <p className="font-bold text-[#111c2d]">
                    {isNp ? '📦 कपडा पठाउने ठेगाना:' : '📦 Dispatch Address for Delivery:'}
                  </p>
                  <p className="text-[#434653]">
                    <strong>Genzicon Foundation Central Clothes Hub</strong><br />
                    Tinkune / New Baneshwor, Kathmandu, Nepal<br />
                    Phone: <strong>9823000000 / 01-4240000</strong>
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setDonationSuccessId(null);
                      setDonorName('');
                      setPhone('');
                      setAddress('');
                      setNotes('');
                      setCourierName('');
                    }}
                    className="px-5 py-2.5 bg-[#003c90] hover:bg-[#002660] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    {isNp ? 'अर्को कपडा दान दर्ता गर्नुहोस्' : 'Submit Another Donation'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleClothesDonationSubmit} className="space-y-4">
                {/* 4 Delivery Mode Selector in Same Line Small */}
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setDonationMode('self_dropoff')}
                      className={`p-2.5 text-left border transition-all flex items-center gap-2 ${
                        donationMode === 'self_dropoff'
                          ? 'bg-[#e7eeff] border-[#003c90] text-[#003c90] font-bold shadow-xs'
                          : 'bg-[#f9f9ff] border-[#d8e3fb] text-[#434653] hover:bg-[#f0f4fc]'
                      }`}
                    >
                      <Building2 className="w-4 h-4 shrink-0 text-[#003c90]" />
                      <div className="min-w-0">
                        <span className="block text-xs truncate">
                          {isNp ? '१. आफै बुझाउने' : '1. Self Drop-off'}
                        </span>
                        <span className="text-[10px] text-[#737784] font-normal block truncate">
                          {isNp ? 'तीनकुने केन्द्र' : 'Tinkune Hub'}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDonationMode('courier_parcel')}
                      className={`p-2.5 text-left border transition-all flex items-center gap-2 ${
                        donationMode === 'courier_parcel'
                          ? 'bg-[#e7eeff] border-[#003c90] text-[#003c90] font-bold shadow-xs'
                          : 'bg-[#f9f9ff] border-[#d8e3fb] text-[#434653] hover:bg-[#f0f4fc]'
                      }`}
                    >
                      <Truck className="w-4 h-4 shrink-0 text-[#00743a]" />
                      <div className="min-w-0">
                        <span className="block text-xs truncate">
                          {isNp ? '२. कुरियर/पार्सल' : '2. Courier / Cargo'}
                        </span>
                        <span className="text-[10px] text-[#737784] font-normal block truncate">
                          {isNp ? 'उपत्यका बाहिर' : 'Any District'}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDonationMode('pathao_rider')}
                      className={`p-2.5 text-left border transition-all flex items-center gap-2 ${
                        donationMode === 'pathao_rider'
                          ? 'bg-[#e7eeff] border-[#003c90] text-[#003c90] font-bold shadow-xs'
                          : 'bg-[#f9f9ff] border-[#d8e3fb] text-[#434653] hover:bg-[#f0f4fc]'
                      }`}
                    >
                      <Send className="w-4 h-4 shrink-0 text-amber-600" />
                      <div className="min-w-0">
                        <span className="block text-xs truncate">
                          {isNp ? '३. पठाओ/राइडर' : '3. Rider Parcel'}
                        </span>
                        <span className="text-[10px] text-[#737784] font-normal block truncate">
                          {isNp ? 'उपत्यकाभित्र' : 'Kathmandu Valley'}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDonationMode('doorstep_pickup')}
                      className={`p-2.5 text-left border transition-all flex items-center gap-2 ${
                        donationMode === 'doorstep_pickup'
                          ? 'bg-[#e7eeff] border-[#003c90] text-[#003c90] font-bold shadow-xs'
                          : 'bg-[#f9f9ff] border-[#d8e3fb] text-[#434653] hover:bg-[#f0f4fc]'
                      }`}
                    >
                      <PackageOpen className="w-4 h-4 shrink-0 text-indigo-600" />
                      <div className="min-w-0">
                        <span className="block text-xs truncate">
                          {isNp ? '४. ठूलो परिमाण' : '4. Bulk Pickup'}
                        </span>
                        <span className="text-[10px] text-[#737784] font-normal block truncate">
                          {isNp ? '५०+ थान' : '50+ Garments'}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Donor Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'तपाईंको पूरा नाम *' : 'Your Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="e.g. Suman Thapa"
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'सम्पर्क फोन नम्बर *' : 'Phone / Mobile Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'प्रदेश' : 'Province'}
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    >
                      <option value="Bagmati Province">Bagmati Province (बागमती)</option>
                      <option value="Madhesh Province">Madhesh Province (मधेस)</option>
                      <option value="Gandaki Province">Gandaki Province (गण्डकी)</option>
                      <option value="Koshi Province">Koshi Province (कोशी)</option>
                      <option value="Lumbini Province">Lumbini Province (लुम्बिनी)</option>
                      <option value="Karnali Province">Karnali Province (कर्णाली)</option>
                      <option value="Sudurpashchim">Sudurpashchim (सुदूरपश्चिम)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'जिल्ला' : 'District'}
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Kathmandu / Kaski"
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'सहर / टोल' : 'City / Tole'}
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Baneshwor / Pokhara"
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'तपाईंको ठेगाना (दाताको स्थान) *' : 'Your Address / Location Details *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. New Baneshwor, Kathmandu / Lakeside, Pokhara"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  />
                </div>

                {/* Clothes Category & Count */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'कपडाको प्रकार' : 'Clothes Category'}
                    </label>
                    <select
                      value={clothesType}
                      onChange={(e) => setClothesType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    >
                      <option value="winter">{isNp ? 'जाडोका न्यानो कपडा (Jackets, Sweaters)' : 'Winter Jackets & Sweaters (High Priority)'}</option>
                      <option value="blankets">{isNp ? 'कम्बल तथा सिरक (Blankets & Quilts)' : 'Blankets, Quilts & Warm Shawls'}</option>
                      <option value="kids">{isNp ? 'बालबालिकाका कपडा (Kids Wear)' : 'Kids Wear & School Uniforms'}</option>
                      <option value="summer">{isNp ? 'गर्मीका कपडा (Shirts, Pants)' : 'Summer Everyday Wear'}</option>
                      <option value="mixed">{isNp ? 'मिश्रित पारिवारिक कपडा (Mixed Lot)' : 'Mixed Family Collection'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'अनुमानित संख्या (थान / जोडी)' : 'Approx. Garments Count (Pieces)'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={approxItemsCount}
                      onChange={(e) => setApproxItemsCount(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    />
                  </div>
                </div>

                {/* Dynamic fields based on mode */}
                {donationMode === 'courier_parcel' && (
                  <div>
                    <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'कुरियर / कार्गो / बस कम्पनीको नाम र बिल्टी नं.' : 'Courier Service Name & Bill/Tracking Number'}
                    </label>
                    <input
                      type="text"
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      placeholder={isNp ? 'जस्तै: सुन्दर कार्गो, बिल्टी नं. १२३४५ वा नेपाल पोस्ट' : 'e.g. Sundar Transport / Nepal Post Parcel Tracking #'}
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'दाताको सन्देश / थप कैफियत (वैकल्पिक)' : 'Heartfelt Note for Beneficiaries / Special Instructions'}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={isNp ? 'जस्तै: शीतलहर पीडित परिवारलाई न्यानो शुभकामना! कपडाहरू सफा र धोएर बक्समा प्याक गरिएको छ।' : 'e.g. Wishing warmth to cold-wave survivors! Clothes are neatly washed and ironed.'}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#00743a] hover:bg-[#00542a] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <Shirt className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? (isNp ? 'दर्ता हुँदैछ...' : 'Submitting...')
                        : (isNp ? 'कपडा पठाउने विवरण पेश गर्नुहोस्' : 'Confirm & Register Clothes Dispatch')}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right 5 Cols: Central Location Map & Sending Instructions */}
          <div className="lg:col-span-5 space-y-4">
            {/* Map & Central Hub Details Card */}
            <div className="bg-white border border-[#d8e3fb] overflow-hidden shadow-sm">
              <div className="p-4 bg-[#003c90] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    {isNp ? 'काठमाडौँ मुख्य संकलन केन्द्र (Map)' : 'Kathmandu Central Hub Location'}
                  </h4>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold">
                  Open Daily
                </span>
              </div>

              {/* Map View Frame */}
              <div className="relative w-full h-48 bg-slate-100 border-b border-[#d8e3fb] overflow-hidden">
                <iframe
                  title="Genzicon Clothes Bank Central Hub Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14130.857353982845!2d85.3400!3d27.6890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1997d4a46083%3A0x6b4502d99d14631e!2sTinkune%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full"
                />
              </div>

              <div className="p-4 sm:p-5 space-y-3">
                <div>
                  <h5 className="text-xs font-bold text-[#111c2d] uppercase tracking-wider">
                    {isNp ? 'केन्द्रको आधिकारिक ठेगाना:' : 'Official Receiving Station:'}
                  </h5>
                  <p className="text-xs text-[#434653] font-medium mt-0.5">
                    <strong>Genzicon Clothes Bank Nepal</strong><br />
                    Tinkune / New Baneshwor (Near Ring Road), Kathmandu 44600<br />
                    {isNp ? 'समय: बिहान ८:०० देखि साँझ ६:०० सम्म (शनिबार पनि खुला)' : 'Hours: 8:00 AM – 6:00 PM Daily (Open Saturdays)'}
                  </p>
                </div>

                <div className="p-3 bg-[#f0f4fc] border border-[#d8e3fb] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#003c90]">
                    <Phone className="w-3.5 h-3.5 text-[#00743a]" />
                    <span>9823000000 / 01-4240000</span>
                  </div>
                  <p className="text-[11px] text-[#737784]">
                    {isNp ? 'पठाओ राइडर वा गाडी आइपुग्दा माथिको फोनमा सम्पर्क गर्न भन्नुहोला।' : 'Direct phone contact for rider delivery & parcel coordination.'}
                  </p>
                </div>

                <a
                  href="https://maps.google.com/?q=Tinkune,Kathmandu,Nepal"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-[#003c90] hover:bg-[#002660] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isNp ? 'गुगल म्यापमा बाटो हेर्नुहोस्' : 'Get Google Maps Directions'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

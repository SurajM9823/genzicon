import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shirt, 
  Heart, 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  Calendar, 
  Clock, 
  Building2, 
  HelpCircle,
  PackageCheck,
  AlertCircle,
  Share2,
  ChevronRight,
  ShieldCheck,
  Box,
  Plus,
  RotateCcw
} from 'lucide-react';
import { Language, ClothesDonationRequest, ClothesAssistanceRequest, DropoffHub } from '../types';
import { DROPOFF_HUBS_DATA, SAMPLE_CLOTHES_DONATION_REQUESTS, SAMPLE_CLOTHES_ASSISTANCE_REQUESTS } from '../data/mockData';
import { apiSubmitClothesDonation } from '../services/api';

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
  const [activeTab, setActiveTab] = useState<'donate' | 'request' | 'hubs' | 'impact'>('donate');
  
  // Donate Clothes Form State
  const [donorName, setDonorName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [province, setProvince] = useState('Bagmati Province');
  const [district, setDistrict] = useState('Kathmandu');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [clothesType, setClothesType] = useState<'winter' | 'summer' | 'kids' | 'blankets' | 'mixed'>('winter');
  const [approxItemsCount, setApproxItemsCount] = useState<number>(25);
  const [donationMode, setDonationMode] = useState<'doorstep_pickup' | 'dropoff_center'>('doorstep_pickup');
  const [dropoffHub, setDropoffHub] = useState('Kathmandu Central Hub');
  const [pickupDate, setPickupDate] = useState('');
  const [notes, setNotes] = useState('');
  const [donationSuccessId, setDonationSuccessId] = useState<string | null>(null);

  // Request Clothes Form State
  const [applicantName, setApplicantName] = useState('');
  const [organization, setOrganization] = useState('');
  const [reqPhone, setReqPhone] = useState('');
  const [reqProvince, setReqProvince] = useState('Madhesh Province');
  const [reqDistrict, setReqDistrict] = useState('Dhanusha');
  const [locationDetails, setLocationDetails] = useState('');
  const [beneficiaryCount, setBeneficiaryCount] = useState<number>(100);
  const [urgencyReason, setUrgencyReason] = useState<'winter_cold_wave' | 'flood_disaster' | 'orphanage_elderly' | 'marginalized_community' | 'remote_school'>('winter_cold_wave');
  const [selectedClothesNeeds, setSelectedClothesNeeds] = useState<string[]>(['Winter Jackets & Sweaters', 'Blankets']);
  const [reqNotes, setReqNotes] = useState('');
  const [requestSuccessId, setRequestSuccessId] = useState<string | null>(null);

  // Filter Hubs State
  const [selectedHubCity, setSelectedHubCity] = useState<string>('all');

  const handleClothesDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !phone.trim() || !address.trim()) {
      alert(isNp ? 'कृपया आफ्नो नाम, फोन नम्बर र ठेगाना भर्नुहोस्।' : 'Please fill in your name, phone number, and address.');
      return;
    }

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
        pickupDate,
        dropoffHub: donationMode === 'dropoff_center' ? dropoffHub : undefined,
        notes,
      });

      const assignedId = res?.ref_id || fallbackId;
      setDonationSuccessId(assignedId);

      // Also persist to local list for seamless fallback
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
        dropoffHub: donationMode === 'dropoff_center' ? dropoffHub : undefined,
        pickupDate,
        notes,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
      };
      localStorage.setItem('genzicon_clothes_donations', JSON.stringify([newEntry, ...currentList]));
    } catch (err) {
      console.warn('Error submitting to API:', err);
      setDonationSuccessId(fallbackId);
    }
  };

  const handleClothesAssistanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !reqPhone.trim() || !locationDetails.trim()) {
      alert(isNp ? 'कृपया सबै आवश्यक विवरण भर्नुहोस्।' : 'Please fill in all required fields.');
      return;
    }

    const generatedId = `REQ-CBN-${Math.floor(1000 + Math.random() * 9000)}`;
    setRequestSuccessId(generatedId);
  };

  const filteredHubs = selectedHubCity === 'all' 
    ? DROPOFF_HUBS_DATA 
    : DROPOFF_HUBS_DATA.filter(h => h.city.toLowerCase().includes(selectedHubCity.toLowerCase()));

  // Interactive 3D Donation Parcel Simulator state
  const [simulatorItems, setSimulatorItems] = useState<{ [key: string]: number }>({
    jackets: 2,
    blankets: 1,
    kids: 3,
    sweaters: 2
  });

  const totalSimulatorItems = Object.values(simulatorItems).reduce((a: number, b: number) => a + b, 0);

  const toggleSimulatorItem = (key: string) => {
    setSimulatorItems(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + 1
    }));
  };

  const resetSimulator = () => {
    setSimulatorItems({
      jackets: 1,
      blankets: 1,
      kids: 2,
      sweaters: 1
    });
  };

  return (
    <div id="clothes-bank-screen" className="w-full pt-16 pb-16 bg-[#f9f9ff] min-h-screen">
      {/* Real Photography Hero Header with 3D Depth */}
      <div className="relative bg-[#001838] text-white border-b border-[#002660] overflow-hidden">
        {/* Authentic Background Image of Clothes Relief Drive */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80"
            alt="Clothes Bank Nepal Volunteers and Warmth Distribution"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001c44] via-[#002b66]/90 to-[#001530]/95" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/30 to-black/60" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Header Description */}
            <motion.div 
              className="lg:col-span-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-3">
                <Shirt className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isNp ? 'कपडा बैंक नेपाल • निःशुल्क सेवा' : 'Clothes Bank Nepal • Free Community Initiative'}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 font-heading text-white">
                {isNp ? 'कपडा बैंक नेपाल' : 'Clothes Bank Nepal'}
              </h1>

              <p className="text-xs sm:text-sm text-blue-100/90 font-normal leading-relaxed mb-6 max-w-xl">
                {isNp
                  ? 'तपाईंको प्रयोगमा नआएका तर सफा कपडाहरू हामी संकलन गर्छौँ। गुणस्तर जाँच, सरसफाइ र मर्मतपछि तराईका शीतलहर प्रभावित, हिमाली विकट बस्ती तथा विपन्न परिवारलाई निःशुल्क र सम्मानपूर्वक वितरण गर्दछौँ।'
                  : 'Connecting generous citizens with underprivileged families across Nepal. We collect wearable pre-loved clothes from households and offices, sanitize and pack them, and deliver them directly to cold-wave victims, remote schools, and marginalized communities.'}
              </p>

              {/* 3D Impact Counter Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-white/15 [perspective:800px]">
                <motion.div 
                  whileHover={{ y: -3, rotateX: 5 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/10 p-3 transform-gpu"
                >
                  <span className="block text-lg sm:text-2xl font-black text-white font-heading">142,500+</span>
                  <span className="text-[11px] text-blue-200 font-medium">{isNp ? 'वितरित कपडा' : 'Garments Donated'}</span>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -3, rotateX: 5 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/10 p-3 transform-gpu"
                >
                  <span className="block text-lg sm:text-2xl font-black text-white font-heading">28,400+</span>
                  <span className="text-[11px] text-blue-200 font-medium">{isNp ? 'लाभान्वित परिवार' : 'Families Clothed'}</span>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -3, rotateX: 5 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/10 p-3 transform-gpu"
                >
                  <span className="block text-lg sm:text-2xl font-black text-white font-heading">34 Hubs</span>
                  <span className="text-[11px] text-blue-200 font-medium">{isNp ? 'संकलन केन्द्रहरू' : 'Collection Hubs'}</span>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -3, rotateX: 5 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/10 p-3 transform-gpu"
                >
                  <span className="block text-lg sm:text-2xl font-black text-emerald-400 font-heading">100% Free</span>
                  <span className="text-[11px] text-blue-200 font-medium">{isNp ? 'निःशुल्क सेवा' : 'Non-Profit Relief'}</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Special 3D Interactive Clothes Donation Box Simulator */}
            <motion.div 
              className="lg:col-span-5 [perspective:1200px]"
              initial={{ opacity: 0, y: 30, rotateX: 15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div 
                whileHover={{ 
                  rotateY: -3, 
                  rotateX: 4, 
                  y: -5,
                  boxShadow: "0 25px 40px -15px rgba(0, 0, 0, 0.5)"
                }}
                className="bg-white text-[#111c2d] p-5 border-2 border-white/30 shadow-2xl transform-gpu relative transition-all duration-300"
              >
                {/* 3D Box Header */}
                <div className="flex items-center justify-between mb-3 border-b border-[#d8e3fb] pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#e7eeff] text-[#003c90] flex items-center justify-center">
                      <Box className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#003c90]">
                        {isNp ? '३D कपडा दान प्याक सिमुलेटर' : '3D Clothes Donation Pack'}
                      </h3>
                      <span className="text-[10px] text-[#737784]">
                        {isNp ? 'दान गर्ने कपडा थिचेर बक्समा हाल्नुहोस्' : 'Click garments to fill your donation bag'}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={resetSimulator}
                    title="Reset Simulator"
                    className="text-[#737784] hover:text-[#003c90] p-1 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3D Garment Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <motion.button
                    type="button"
                    onClick={() => toggleSimulatorItem('jackets')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="p-2.5 bg-[#f9f9ff] border border-[#d8e3fb] hover:border-[#003c90] text-left flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-1.5">
                      <Shirt className="w-3.5 h-3.5 text-[#003c90]" />
                      <span className="text-[11px] font-bold text-[#111c2d]">
                        {isNp ? 'जाडोको ज्याकेट' : 'Warm Jacket'}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 bg-[#e7eeff] text-[#003c90] text-[10px] font-extrabold group-hover:bg-[#003c90] group-hover:text-white transition-colors">
                      +{simulatorItems.jackets || 0}
                    </span>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => toggleSimulatorItem('blankets')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="p-2.5 bg-[#f9f9ff] border border-[#d8e3fb] hover:border-[#00743a] text-left flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#00743a]" />
                      <span className="text-[11px] font-bold text-[#111c2d]">
                        {isNp ? 'कम्बल / सिरक' : 'Blanket / Quilt'}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-[#00743a] text-[10px] font-extrabold group-hover:bg-[#00743a] group-hover:text-white transition-colors">
                      +{simulatorItems.blankets || 0}
                    </span>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => toggleSimulatorItem('kids')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="p-2.5 bg-[#f9f9ff] border border-[#d8e3fb] hover:border-amber-600 text-left flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-[11px] font-bold text-[#111c2d]">
                        {isNp ? 'बच्चाको कपडा' : 'Kids / School'}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      +{simulatorItems.kids || 0}
                    </span>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => toggleSimulatorItem('sweaters')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="p-2.5 bg-[#f9f9ff] border border-[#d8e3fb] hover:border-blue-600 text-left flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-[11px] font-bold text-[#111c2d]">
                        {isNp ? 'स्वेटर / इनर' : 'Sweater / Wear'}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      +{simulatorItems.sweaters || 0}
                    </span>
                  </motion.button>
                </div>

                {/* Total Box Summary & Direct CTA */}
                <div className="p-3 bg-[#e7eeff] border border-[#b9cffb] flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#003c90] block">
                      {isNp ? 'तपाईंको दान बक्स स्थिति' : 'Ready Donation Parcel'}
                    </span>
                    <span className="text-xs font-black text-[#111c2d]">
                      {totalSimulatorItems} {isNp ? 'वटा कपडाहरू प्याक गरियो' : 'Garments Selected'}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#00743a] text-white text-[10px] font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Free Pickup</span>
                  </span>
                </div>

                <motion.button
                  type="button"
                  onClick={() => {
                    setActiveTab('donate');
                    const formElement = document.getElementById('clothes-bank-form-area');
                    if (formElement) {
                      formElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 bg-[#003c90] hover:bg-[#002660] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Shirt className="w-4 h-4 text-emerald-400" />
                  <span>{isNp ? 'यो कपडा दान दर्ता गर्नुहोस्' : 'Schedule Pickup For This Bag'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 4-Step How It Works Bar with 3D Perspective Cards */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 -mt-5 relative z-20 [perspective:1000px]">
        <div className="bg-white p-5 sm:p-6 border border-[#d8e3fb] shadow-md">
          <div className="text-xs font-bold text-[#003c90] uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            <span>{isNp ? 'कपडा बैंक कार्यप्रणाली (४ सरल चरण)' : 'How Clothes Bank Nepal Works (4-Step Cycle)'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div 
              whileHover={{ y: -5, rotateX: 4, rotateY: -2, boxShadow: "0 12px 20px -8px rgba(0, 60, 144, 0.15)" }}
              className="p-3.5 bg-[#f9f9ff] border-l-3 border-[#003c90] border-t border-r border-b border-[#d8e3fb] transition-all transform-gpu"
            >
              <span className="text-[10px] font-black text-[#003c90] uppercase tracking-wider">01. {isNp ? 'संकलन' : 'Collection'}</span>
              <h4 className="text-xs font-bold text-[#111c2d] mt-1">{isNp ? 'घरमै पिकअप वा ड्रप-अफ' : 'Pickup or Drop-off'}</h4>
              <p className="text-[11px] text-[#737784] mt-1 leading-relaxed">
                {isNp ? 'घरमै निःशुल्क गाडी पठाएर वा नजिकको केन्द्रमा कपडा बुझाउनुहोस्।' : 'Schedule a doorstep collection or drop off at one of our 34 verified centers.'}
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, rotateX: 4, rotateY: -1, boxShadow: "0 12px 20px -8px rgba(0, 116, 58, 0.15)" }}
              className="p-3.5 bg-[#f9f9ff] border-l-3 border-[#00743a] border-t border-r border-b border-[#d8e3fb] transition-all transform-gpu"
            >
              <span className="text-[10px] font-black text-[#00743a] uppercase tracking-wider">02. {isNp ? 'सफाइ र छनोट' : 'Quality Check'}</span>
              <h4 className="text-xs font-bold text-[#111c2d] mt-1">{isNp ? 'गुणस्तर जाँच र मर्मत' : 'Sanitization & Repair'}</h4>
              <p className="text-[11px] text-[#737784] mt-1 leading-relaxed">
                {isNp ? 'हाम्रा स्वयंसेवकले कपडाको सरसफाइ, सामान्य सिलाई र वर्गीकरण गर्छन्।' : 'Every garment is inspected, hygienically washed, repaired, and ironed.'}
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, rotateX: 4, rotateY: 1, boxShadow: "0 12px 20px -8px rgba(0, 60, 144, 0.15)" }}
              className="p-3.5 bg-[#f9f9ff] border-l-3 border-[#003c90] border-t border-r border-b border-[#d8e3fb] transition-all transform-gpu"
            >
              <span className="text-[10px] font-black text-[#003c90] uppercase tracking-wider">03. {isNp ? 'प्याकिङ' : 'Categorization'}</span>
              <h4 className="text-xs font-bold text-[#111c2d] mt-1">{isNp ? 'मौसम र उमेर अनुसार बक्सिङ' : 'Sorted by Size & Season'}</h4>
              <p className="text-[11px] text-[#737784] mt-1 leading-relaxed">
                {isNp ? 'जाडो, गर्मी, बालबालिका, महिला, पुरुष र कम्बलको अलग-अलग बक्स।' : 'Packaged systematically into winter jackets, baby wear, blankets, and adult wear.'}
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, rotateX: 4, rotateY: 2, boxShadow: "0 12px 20px -8px rgba(0, 116, 58, 0.15)" }}
              className="p-3.5 bg-[#f9f9ff] border-l-3 border-[#00743a] border-t border-r border-b border-[#d8e3fb] transition-all transform-gpu"
            >
              <span className="text-[10px] font-black text-[#00743a] uppercase tracking-wider">04. {isNp ? 'प्रत्यक्ष वितरण' : 'Direct Giving'}</span>
              <h4 className="text-xs font-bold text-[#111c2d] mt-1">{isNp ? 'सम्मानपूर्वक हस्तान्तरण' : 'Dignified Free Distribution'}</h4>
              <p className="text-[11px] text-[#737784] mt-1 leading-relaxed">
                {isNp ? 'शीतलहर, बाढी प्रभावित र विकट हिमाली विद्यालयमा निःशुल्क पुर्याइन्छ।' : 'Delivered directly to Terai Musahar bastis, Karnali schools, and relief shelters.'}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area with Navigation Tabs */}
      <div id="clothes-bank-form-area" className="max-w-[1280px] mx-auto px-4 sm:px-6 mt-8">
        {/* Sub Navigation Bar */}
        <div className="flex flex-wrap items-center gap-1 border-b border-[#d8e3fb] mb-6 bg-white p-1">
          <button
            onClick={() => setActiveTab('donate')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${
              activeTab === 'donate'
                ? 'bg-[#003c90] text-white'
                : 'text-[#434653] hover:bg-[#f0f3ff]'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>{isNp ? '१. कपडा दान गर्नुहोस्' : '1. Donate Clothes'}</span>
          </button>

          <button
            onClick={() => setActiveTab('request')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${
              activeTab === 'request'
                ? 'bg-[#003c90] text-white'
                : 'text-[#434653] hover:bg-[#f0f3ff]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isNp ? '२. कपडा माग फारम (समुदायका लागि)' : '2. Request Clothes for Community'}</span>
          </button>

          <button
            onClick={() => setActiveTab('hubs')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${
              activeTab === 'hubs'
                ? 'bg-[#003c90] text-white'
                : 'text-[#434653] hover:bg-[#f0f3ff]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{isNp ? '३. संकलन केन्द्रहरू (Drop-off Hubs)' : '3. Collection Centers'}</span>
          </button>

          <button
            onClick={() => setActiveTab('impact')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${
              activeTab === 'impact'
                ? 'bg-[#003c90] text-white'
                : 'text-[#434653] hover:bg-[#f0f3ff]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{isNp ? '४. हालैका वितरण तस्बिरहरू' : '4. Distribution Stories'}</span>
          </button>
        </div>

        {/* TAB 1: DONATE CLOTHES FORM */}
        {activeTab === 'donate' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white p-5 sm:p-8 border border-[#d8e3fb] shadow-xs">
              {donationSuccessId ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-600 text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950 font-heading">
                    {isNp ? 'कपडा दान फारम सफलतापूर्वक दर्ता भयो!' : 'Clothes Donation Request Registered!'}
                  </h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    {isNp
                      ? `तपाईंको दर्ता नम्बर: ${donationSuccessId} हो। हाम्रा संकलन स्वयंसेवकले २४ घण्टाभित्र फोन गरी पिकअप समय मिलाउनेछन्।`
                      : `Your tracking reference ID is ${donationSuccessId}. Our volunteer team will contact you shortly to schedule pickup or verify drop-off.`}
                  </p>
                  <div className="pt-3">
                    <button
                      onClick={() => {
                        setDonationSuccessId(null);
                        setDonorName('');
                        setPhone('');
                        setAddress('');
                        setNotes('');
                      }}
                      className="px-4 py-2 bg-[#003c90] text-white text-xs font-bold uppercase tracking-wider"
                    >
                      {isNp ? 'अर्को कपडा दान गर्नुहोस्' : 'Submit Another Donation'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleClothesDonationSubmit} className="space-y-4">
                  <div className="border-b border-[#f0f3ff] pb-3">
                    <h3 className="text-base font-bold text-[#111c2d] font-heading">
                      {isNp ? 'पुराना तथा उपयोगी कपडा संकलन फारम' : 'Schedule Clothes Donation / Doorstep Pickup'}
                    </h3>
                    <p className="text-xs text-[#737784] mt-0.5">
                      {isNp ? 'कृपया सफा, नच्यातिएका र लगाउन मिल्ने कपडाहरू मात्र दान गर्नुहोस्।' : 'Please ensure clothes are in wearable, clean condition with no heavy tears.'}
                    </p>
                  </div>

                  {/* Mode Selector */}
                  <div>
                    <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-2">
                      {isNp ? 'दान गर्ने माध्यम छान्नुहोस्' : 'Select Donation Mode'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDonationMode('doorstep_pickup')}
                        className={`p-3 text-left border transition-all flex items-start gap-2.5 ${
                          donationMode === 'doorstep_pickup'
                            ? 'bg-[#e7eeff] border-[#003c90] text-[#003c90]'
                            : 'bg-[#f9f9ff] border-[#d8e3fb] text-[#434653]'
                        }`}
                      >
                        <Truck className="w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                          <span className="block text-xs font-bold">
                            {isNp ? 'घरमै निःशुल्क संकलन (Doorstep Pickup)' : 'Doorstep Pickup (We Collect)'}
                          </span>
                          <span className="text-[11px] text-[#737784]">
                            {isNp ? 'हाम्रो भ्यान तपाईंको घरमै आउँछ' : 'Our team collects from your home/office'}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDonationMode('dropoff_center')}
                        className={`p-3 text-left border transition-all flex items-start gap-2.5 ${
                          donationMode === 'dropoff_center'
                            ? 'bg-[#e7eeff] border-[#003c90] text-[#003c90]'
                            : 'bg-[#f9f9ff] border-[#d8e3fb] text-[#434653]'
                        }`}
                      >
                        <Building2 className="w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                          <span className="block text-xs font-bold">
                            {isNp ? 'केन्द्रमा आफै पुर्याउने (Drop-off Center)' : 'Self Drop-off at Hub'}
                          </span>
                          <span className="text-[11px] text-[#737784]">
                            {isNp ? 'नजिकको संकलन केन्द्रमा बुझाउनुहोस्' : 'Hand over at verified city hub'}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Personal Contact Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                        {isNp ? 'तपाईंको पूरा नाम *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="e.g. Ramesh Karki"
                        className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                        {isNp ? 'सम्पर्क फोन नम्बर *' : 'Phone Number *'}
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
                        placeholder="e.g. Kathmandu / Dhanusha"
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
                        placeholder="e.g. Baneshwor / Janakpur"
                        className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'घरको पूरा ठेगाना / ल्यान्डमार्क *' : 'Detailed Address & Landmark *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. House No. 45, Near Everest Bank, New Baneshwor"
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    />
                  </div>

                  {/* Clothes Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                        {isNp ? 'कपडाको मुख्य प्रकार' : 'Primary Clothes Category'}
                      </label>
                      <select
                        value={clothesType}
                        onChange={(e) => setClothesType(e.target.value as any)}
                        className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                      >
                        <option value="winter">{isNp ? 'जाडोका न्यानो कपडा (Jackets, Sweaters, Thermals)' : 'Winter Warm Wear (Jackets, Sweaters, Hoodies)'}</option>
                        <option value="blankets">{isNp ? 'कम्बल तथा सिरक (Blankets & Quilts)' : 'Blankets, Quilts & Shawls'}</option>
                        <option value="kids">{isNp ? 'बालबालिकाका कपडा (Kids & School Uniforms)' : 'Kids Wear & School Uniforms'}</option>
                        <option value="summer">{isNp ? 'गर्मीका कपडा (Shirts, Pants, T-Shirts)' : 'Summer Everyday Wear'}</option>
                        <option value="mixed">{isNp ? 'मिश्रित कपडा (Mixed Lot)' : 'Mixed Family Collection'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                        {isNp ? 'अनुमानित संख्या (थान / जोडी)' : 'Approx. Number of Pieces'}
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="500"
                        value={approxItemsCount}
                        onChange={(e) => setApproxItemsCount(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                      />
                    </div>
                  </div>

                  {donationMode === 'doorstep_pickup' ? (
                    <div>
                      <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                        {isNp ? 'पिकअपका लागि उपयुक्त मिति' : 'Preferred Pickup Date'}
                      </label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                        {isNp ? 'तपाईंले बुझाउने संकलन केन्द्र' : 'Select Collection Center'}
                      </label>
                      <select
                        value={dropoffHub}
                        onChange={(e) => setDropoffHub(e.target.value)}
                        className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                      >
                        {DROPOFF_HUBS_DATA.map(hub => (
                          <option key={hub.id} value={hub.name}>
                            {isNp ? hub.nameNp : hub.name} ({hub.city})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'थप जानकारी / कैफियत (वैकल्पिक)' : 'Special Notes / Specifics (Optional)'}
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={isNp ? 'जस्तै: बक्समा प्याक गरिएको छ, शनिबार बिहान १० बजे पछि फोन गर्नुहोला...' : 'e.g. Packed in 2 cartons, best to call Saturday morning...'}
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#00743a] hover:bg-[#005227] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Shirt className="w-4 h-4" />
                      <span>{isNp ? 'कपडा संकलन अनुरोध दर्ता गर्नुहोस्' : 'Confirm & Schedule Clothes Donation'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Donation Guidelines Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs">
                <h4 className="text-xs font-bold text-[#003c90] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00743a]" />
                  <span>{isNp ? 'दान गर्दा ध्यान दिनुपर्ने कुरा' : 'Clothes Donation Guidelines'}</span>
                </h4>
                <ul className="space-y-2 text-xs text-[#434653]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00743a] shrink-0 mt-0.5" />
                    <span><strong>{isNp ? 'सफा र धुइएका:' : 'Clean & Washed:'}</strong> {isNp ? 'कृपया कपडा धोएर मात्र दिनुहोस्।' : 'Please donate only clean, dry garments.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00743a] shrink-0 mt-0.5" />
                    <span><strong>{isNp ? 'च्यातिएका नहुने:' : 'Wearable condition:'}</strong> {isNp ? 'धेरै च्यातिएका वा काम नलाग्ने कपडा नदिनुहोला।' : 'Avoid heavily torn, stained or unusable items.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00743a] shrink-0 mt-0.5" />
                    <span><strong>{isNp ? 'उच्च प्राथमिकता:' : 'High Priority:'}</strong> {isNp ? 'जाडोका ज्याकेट, स्विटर, टोपी, बालबालिकाको पोशाक र कम्बल।' : 'Winter jackets, sweaters, children wear & blankets.'}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#003c90] text-white p-5 border border-[#002660]">
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2">
                  {isNp ? 'कपडा बैंक हटलाइन' : 'Clothes Bank Helpline'}
                </h4>
                <p className="text-xs text-blue-100 mb-3">
                  {isNp ? 'कुनै जिज्ञासा वा ठूलो परिमाणमा कपडा दान गर्न सिधै सम्पर्क गर्नुहोस्:' : 'For bulk clothes collection from colleges, corporate offices or clubs:'}
                </p>
                <div className="space-y-1.5 text-xs font-mono font-bold text-white">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#00e676]" />
                    <span>9823000000 / 01-4240000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#00e676]" />
                    <span>clothesbank@genzicon.org</span>
                  </div>
                </div>
              </div>

              {/* Financial Support for Logistics */}
              <div className="bg-white p-5 border border-[#d8e3fb]">
                <h4 className="text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1.5">
                  {isNp ? 'ढुवानी र सफाइमा सहयोग गर्न चाहनुहुन्छ?' : 'Support Logistics & Packaging?'}
                </h4>
                <p className="text-xs text-[#737784] mb-3">
                  {isNp ? 'संकलित कपडा तराई र कर्णाली पुर्याउन प्रति बक्स रू ५०० लाग्छ।' : 'Each carton costs ~Rs 500 in cleaning, repair, and mountain transportation.'}
                </p>
                <button
                  onClick={onOpenDonateModal}
                  className="w-full py-2 bg-[#003c90] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#002660]"
                >
                  {isNp ? 'ढुवानी कोषमा सहयोग गर्नुहोस्' : 'Contribute Transport Fund'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REQUEST CLOTHES FOR COMMUNITY */}
        {activeTab === 'request' && (
          <div className="bg-white p-5 sm:p-8 border border-[#d8e3fb] shadow-xs max-w-3xl mx-auto">
            {requestSuccessId ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-emerald-950 font-heading">
                  {isNp ? 'कपडा सहयोग माग फारम दर्ता भयो!' : 'Community Clothes Request Submitted!'}
                </h3>
                <p className="text-xs text-emerald-800">
                  {isNp
                    ? `तपाईंको अनुरोध दर्ता नम्बर: ${requestSuccessId} हो। हाम्रो राहत समन्वय समितिले विवरण प्रमाणीकरण गरी चाँडै सम्पर्क गर्नेछ।`
                    : `Your request reference ID is ${requestSuccessId}. Our relief taskforce will verify the location need and dispatch supplies.`}
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => {
                      setRequestSuccessId(null);
                      setApplicantName('');
                      setOrganization('');
                      setLocationDetails('');
                    }}
                    className="px-4 py-2 bg-[#003c90] text-white text-xs font-bold uppercase tracking-wider"
                  >
                    {isNp ? 'नयाँ माग फारम खोल्नुहोस्' : 'Submit Another Request'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleClothesAssistanceSubmit} className="space-y-4">
                <div className="border-b border-[#f0f3ff] pb-3">
                  <h3 className="text-base font-bold text-[#111c2d] font-heading">
                    {isNp ? 'समुदाय, विद्यालय वा विपद् क्षेत्रका लागि कपडा माग फारम' : 'Request Clothes Assistance for Vulnerable Communities'}
                  </h3>
                  <p className="text-xs text-[#737784] mt-0.5">
                    {isNp 
                      ? 'स्थानीय जनप्रतिनिधि, शिक्षक, सामाजिक संस्था वा स्वयंसेवकले विपन्न बस्तीका लागि कपडा माग गर्न सक्नुहुन्छ।' 
                      : 'School headmasters, local ward representatives, orphanages, or local social leaders can request bulk clothes for free distribution.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'निवेदकको नाम *' : 'Applicant / Coordinator Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Ram Kumar Chaudhary (Ward Member)"
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'संस्था / विद्यालय / वडा कार्यालय' : 'Organization / School / Ward'}
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Shree Himalaya Basic School"
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'सम्पर्क फोन नम्बर *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={reqPhone}
                      onChange={(e) => setReqPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'आवश्यकताको मुख्य कारण' : 'Urgency Reason'}
                    </label>
                    <select
                      value={urgencyReason}
                      onChange={(e) => setUrgencyReason(e.target.value as any)}
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    >
                      <option value="winter_cold_wave">{isNp ? 'शीतलहर राहत (Winter Cold Wave Relief)' : 'Terai Winter Cold Wave'}</option>
                      <option value="remote_school">{isNp ? 'दुर्गम हिमाली विद्यालयका बालबालिका' : 'Remote Himalayan School Kids'}</option>
                      <option value="marginalized_community">{isNp ? 'विपन्न मुसहर/डोम/दलित बस्ती' : 'Underprivileged Community'}</option>
                      <option value="flood_disaster">{isNp ? 'बाढी/पहिरो विपद् पीडित' : 'Flood/Landslide Disaster Relief'}</option>
                      <option value="orphanage_elderly">{isNp ? 'अनाथालय वा वृद्धाश्रम' : 'Orphanage or Elder Care Center'}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'प्रदेश तथा जिल्ला' : 'Province & District'}
                    </label>
                    <input
                      type="text"
                      value={`${reqProvince}, ${reqDistrict}`}
                      onChange={(e) => setReqDistrict(e.target.value)}
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                      {isNp ? 'लाभान्वित हुने व्यक्ति/परिवार संख्या' : 'Beneficiary Count (Est. People)'}
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="5000"
                      value={beneficiaryCount}
                      onChange={(e) => setBeneficiaryCount(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111c2d] uppercase tracking-wider mb-1">
                    {isNp ? 'बस्तीको विस्तृत ठेगाना र अवस्था *' : 'Location Details & Ground Situation *'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={locationDetails}
                    onChange={(e) => setLocationDetails(e.target.value)}
                    placeholder={isNp ? 'जस्तै: धनुषा हंशपुर वडा ३ मुसहर बस्ती (८० परिवारका बालबालिकालाई न्यानो ज्याकेट र कम्बल आवश्यक)...' : 'Describe the village situation, specific age groups needing warmth, and nearest highway access...'}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#003c90] hover:bg-[#002660] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>{isNp ? 'कपडा माग पेश गर्नुहोस्' : 'Submit Assistance Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: DROPOFF HUBS */}
        {activeTab === 'hubs' && (
          <div className="space-y-6">
            <div className="bg-white p-4 border border-[#d8e3fb] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[#111c2d] font-heading">
                  {isNp ? 'नेपालभरिका आधिकारिक कपडा संकलन केन्द्रहरू' : 'Verified Clothes Drop-off Hubs in Nepal'}
                </h3>
                <p className="text-xs text-[#737784]">
                  {isNp ? 'तपाईं आफै गएर जुनसुकै समयमा कपडा बुझाउन सक्नुहुन्छ।' : 'Drop off your pre-loved clothes in person at any of these permanent stations.'}
                </p>
              </div>

              {/* City Filter */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <span className="text-xs font-bold text-[#737784] uppercase">{isNp ? 'सहर:' : 'City:'}</span>
                <select
                  value={selectedHubCity}
                  onChange={(e) => setSelectedHubCity(e.target.value)}
                  className="px-3 py-1.5 border border-[#d8e3fb] text-xs font-bold bg-[#f9f9ff] text-[#003c90] focus:outline-none"
                >
                  <option value="all">{isNp ? 'सबै सहरहरू (All Cities)' : 'All Cities'}</option>
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                  <option value="Janakpur">Janakpurdham</option>
                  <option value="Pokhara">Pokhara</option>
                  <option value="Bharatpur">Chitwan / Bharatpur</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredHubs.map(hub => (
                <div key={hub.id} className="bg-white p-5 border border-[#d8e3fb] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="inline-block px-2 py-0.5 bg-[#e7eeff] text-[#003c90] text-[10px] font-bold uppercase tracking-wider mb-2">
                      {hub.city} Hub
                    </div>
                    <h4 className="text-sm font-bold text-[#111c2d] mb-1 font-heading">
                      {isNp ? hub.nameNp : hub.name}
                    </h4>
                    <p className="text-xs text-[#434653] flex items-start gap-1.5 mb-2.5">
                      <MapPin className="w-3.5 h-3.5 text-[#00743a] shrink-0 mt-0.5" />
                      <span>{isNp ? hub.addressNp : hub.address}</span>
                    </p>
                    <p className="text-xs text-[#737784] flex items-center gap-1.5 mb-3">
                      <Clock className="w-3.5 h-3.5 text-[#003c90] shrink-0" />
                      <span>{isNp ? hub.timingNp : hub.timing}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#f0f3ff] flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#003c90] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#00743a]" />
                      {hub.phone.split('/')[0]}
                    </span>
                    <a
                      href={`tel:${hub.phone.split('/')[0].trim()}`}
                      className="px-2.5 py-1 bg-[#f0f3ff] hover:bg-[#003c90] hover:text-white text-[#003c90] text-[11px] font-bold transition-colors"
                    >
                      {isNp ? 'कल गर्नुहोस्' : 'Call Center'}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RECENT DISTRIBUTION STORIES */}
        {activeTab === 'impact' && (
          <div className="space-y-6">
            <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs">
              <h3 className="text-base font-bold text-[#111c2d] font-heading mb-1">
                {isNp ? 'फिल्ड वितरणका वास्तविक तस्बिर तथा प्रतिवेदनहरू' : 'Recent Ground Distribution Stories & Verified Relief'}
              </h3>
              <p className="text-xs text-[#737784]">
                {isNp ? '१००% पारदर्शी रूपमा संकलित कपडा गरिब तथा विपन्न नागरिकसम्म पुर्याइएको प्रमाण।' : 'Every piece of donated clothing is tracked and handed over directly with dignity.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-[#d8e3fb] overflow-hidden shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80"
                  alt="Dhanusha cold wave clothes distribution"
                  className="w-full h-44 object-cover"
                />
                <div className="p-4">
                  <span className="text-[10px] font-extrabold uppercase text-[#00743a] bg-emerald-50 px-2 py-0.5">
                    Dhanusha & Mahottari
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#111c2d] mt-2 mb-1.5 font-heading">
                    {isNp ? '६,२०० ज्याकेट तथा कम्बल मुसहर बस्तीमा वितरण' : '6,200 Winter Jackets & Blankets Distributed in Musahar Toles'}
                  </h4>
                  <p className="text-xs text-[#737784] line-clamp-3">
                    {isNp ? 'शीतलहरमा कठ्यांग्रिएका १,४०० परिवारलाई काठमाडौँ र पोखराबाट संकलित न्यानो कपडा सेट हस्तान्तरण गरिएको छ।' : 'Reached 1,400 marginalized families across 8 rural wards during severe winter cold wave.'}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-[#d8e3fb] overflow-hidden shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80"
                  alt="Himalayan students warm wear"
                  className="w-full h-44 object-cover"
                />
                <div className="p-4">
                  <span className="text-[10px] font-extrabold uppercase text-[#003c90] bg-blue-50 px-2 py-0.5">
                    Humla & Dolpa (Karnali)
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#111c2d] mt-2 mb-1.5 font-heading">
                    {isNp ? '३,८०० हिमाली विद्यार्थीलाई न्यानो पोशाक र जुत्ता' : '3,800 Himalayan Students Provided Thermal Sets & Shoes'}
                  </h4>
                  <p className="text-xs text-[#737784] line-clamp-3">
                    {isNp ? 'माइनस १० डिग्री चिसोमा पढ्न आउने विद्यार्थीहरूलाई न्यानो स्विटर, टोपी, मोजा र जुत्ता वितरण।' : 'Equipped 18 remote mountain schools with thick windproof jackets and insulated socks.'}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-[#d8e3fb] overflow-hidden shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80"
                  alt="Flood relief clothes kits"
                  className="w-full h-44 object-cover"
                />
                <div className="p-4">
                  <span className="text-[10px] font-extrabold uppercase text-[#00743a] bg-emerald-50 px-2 py-0.5">
                    Rautahat & Sarlahi
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#111c2d] mt-2 mb-1.5 font-heading">
                    {isNp ? 'बाढी विस्थापित परिवारलाई आपतकालीन कपडा किट' : 'Emergency Clothes & Hygiene Kits for Flood Survivors'}
                  </h4>
                  <p className="text-xs text-[#737784] line-clamp-3">
                    {isNp ? 'बाढीले घरबार बगाएका परिवारलाई सुख्खा लत्ताकपडा, साडी र बालबालिकाको सेट वितरण।' : 'Dispatched dry clothing boxes to 850 families displaced by monsoon river overflows.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

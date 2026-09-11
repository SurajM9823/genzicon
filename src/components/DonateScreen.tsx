import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Smartphone, 
  Copy, 
  CheckCircle2, 
  Upload, 
  X, 
  Send, 
  MapPin, 
  Heart, 
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  Users
} from 'lucide-react';
import { DEFAULT_BANK_QR_CONFIG } from '../data/mockData';
import { Project, DonationSubmission, Language, BankAndQrConfig, DonationRecord } from '../types';
import { apiSubmitDonation, apiGetDonations } from '../services/api';
import { compressImage } from '../utils/imageCompress';

interface DonateScreenProps {
  language: Language;
  selectedProject?: Project | null;
  onDonateComplete?: (submission: DonationSubmission) => void;
}

export const DonateScreen: React.FC<DonateScreenProps> = ({
  language,
  selectedProject,
  onDonateComplete
}) => {
  const isNp = language === 'np';
  const photoInputRef = useRef<HTMLInputElement>(null);
  const slipInputRef = useRef<HTMLInputElement>(null);

  // Bank & QR config from admin/CMS
  const [bankConfig, setBankConfig] = useState<BankAndQrConfig>(() => {
    try {
      const saved = localStorage.getItem('genzicon_bank_qr_config');
      return saved ? JSON.parse(saved) : DEFAULT_BANK_QR_CONFIG;
    } catch {
      return DEFAULT_BANK_QR_CONFIG;
    }
  });

  const [activeTab, setActiveTab] = useState<'bank' | 'esewa' | 'khalti'>('bank');
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  // Donor Submission Form State
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorAddress, setDonorAddress] = useState('Kathmandu');
  const [amount, setAmount] = useState<number | ''>(5000);
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'esewa' | 'khalti'>('bank');
  const [projectName, setProjectName] = useState(
    selectedProject ? selectedProject.title : 'General Fund (Where Needed Most)'
  );
  const [note, setNote] = useState('');

  // File Uploads & Compression
  const [donorPhotoFile, setDonorPhotoFile] = useState<File | null>(null);
  const [donorPhotoPreview, setDonorPhotoPreview] = useState<string | null>(null);
  const [donorPhotoError, setDonorPhotoError] = useState<string | null>(null);

  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [slipError, setSlipError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedModal, setSubmittedModal] = useState<DonationSubmission | null>(null);

  // Verified Donors List State
  const [approvedDonors, setApprovedDonors] = useState<DonationRecord[]>([]);

  useEffect(() => {
    // Fetch live donations from backend
    apiGetDonations().then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        setApprovedDonors(data);
        localStorage.setItem('genzicon_admin_donations', JSON.stringify(data));
      }
    });

    const handleSync = () => {
      try {
        const saved = localStorage.getItem('genzicon_admin_donations');
        if (saved) setApprovedDonors(JSON.parse(saved));
      } catch (e) {
        console.warn(e);
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('genzicon_donations_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('genzicon_donations_updated', handleSync);
    };
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setDonorPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Auto compress avatar image
      const compressed = await compressImage(file, 800, 0.85);
      setDonorPhotoFile(compressed);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDonorPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(compressed);
    } catch {
      setDonorPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDonorPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDonorPhoto = () => {
    setDonorPhotoFile(null);
    setDonorPhotoPreview(null);
    setDonorPhotoError(null);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const handleSlipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlipError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Auto compress payment voucher slip to avoid HTTP 413
      const compressed = await compressImage(file, 1600, 0.82);
      setSlipFile(compressed);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipPreview(reader.result as string);
      };
      reader.readAsDataURL(compressed);
    } catch {
      setSlipFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSlip = () => {
    setSlipFile(null);
    setSlipPreview(null);
    setSlipError(null);
    if (slipInputRef.current) slipInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const finalAmount = Number(amount) || 0;
    if (finalAmount <= 0) {
      setFormError(isNp ? 'कृपया मान्य रकम प्रविष्ट गर्नुहोस्।' : 'Please enter a valid donation amount.');
      return;
    }

    setSubmitting(true);

    try {
      // Ensure images are compressed before sending
      let finalPhoto = donorPhotoFile;
      if (donorPhotoFile) {
        finalPhoto = await compressImage(donorPhotoFile, 800, 0.85);
      }
      let finalSlip = slipFile;
      if (slipFile) {
        finalSlip = await compressImage(slipFile, 1600, 0.82);
      }

      const res = await apiSubmitDonation({
        donorName: donorName.trim() || (isNp ? 'शुभचिन्तक दाता' : 'Generous Donor'),
        donorPhone: donorPhone.trim(),
        donorEmail: donorEmail.trim(),
        donorAddress: donorAddress.trim(),
        amount: finalAmount,
        currency: 'NPR',
        paymentMethod: paymentMethod,
        projectName: projectName,
        note: note.trim(),
        donorPhotoFile: finalPhoto,
        paymentSlipFile: finalSlip,
      });

      if (!res.success) {
        setFormError(res.error || (isNp ? 'रसिद पेश गर्दा त्रुटि भयो। कृपया फेरि प्रयास गर्नुहोस्।' : 'Failed to submit donation record to server. Please try again.'));
        setSubmitting(false);
        return;
      }

      const serverData = res.data || {};
      const assignedReceipt = serverData.receipt_number || `REC-GZ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const submission: DonationSubmission = {
        donorName: donorName.trim() || (isNp ? 'शुभचिन्तक दाता' : 'Generous Donor'),
        donorPhone: donorPhone.trim(),
        donorEmail: donorEmail.trim(),
        donorAddress: donorAddress.trim(),
        amount: finalAmount,
        currency: 'NPR',
        paymentMethod: paymentMethod,
        projectName: projectName,
        receiptNumber: assignedReceipt,
        note: note.trim(),
        donorPhotoUrl: serverData.final_donor_photo_url || donorPhotoPreview || '',
        paymentSlipUrl: serverData.final_payment_slip_url || slipPreview || '',
        date: new Date().toISOString().split('T')[0],
      };

      // Store in local cache with Pending status
      const existing: DonationRecord[] = JSON.parse(localStorage.getItem('genzicon_admin_donations') || '[]');
      const newRec: DonationRecord = {
        id: String(serverData.id || `don-${Date.now()}`),
        receiptNumber: assignedReceipt,
        donorName: submission.donorName,
        donorPhone: donorPhone.trim(),
        donorEmail: donorEmail.trim(),
        donorAddress: donorAddress.trim(),
        amount: finalAmount,
        currency: 'NPR',
        paymentMethod: paymentMethod,
        projectName: projectName,
        note: note.trim(),
        donorPhotoUrl: serverData.final_donor_photo_url || donorPhotoPreview || '',
        paymentSlipUrl: serverData.final_payment_slip_url || slipPreview || '',
        date: submission.date || '',
        status: 'Pending',
        isPublic: true,
      };

      localStorage.setItem('genzicon_admin_donations', JSON.stringify([newRec, ...existing.filter(d => d.id !== newRec.id)]));
      window.dispatchEvent(new Event('genzicon_donations_updated'));

      setSubmittedModal(submission);

      // Reset form
      setDonorName('');
      setDonorPhone('');
      setDonorEmail('');
      setAmount(5000);
      setNote('');
      removeDonorPhoto();
      removeSlip();
    } catch (err: any) {
      console.warn('Donation submit error:', err);
      setFormError(err?.message || (isNp ? 'अनपेक्षित त्रुटि भयो।' : 'An unexpected error occurred during submission.'));
    } finally {
      setSubmitting(false);
    }
  };

  // Only display Approved and Verified donors on the public directory
  const verifiedDonorsList = approvedDonors.filter(d => d.status === 'Verified' || d.status === 'Approved');

  return (
    <div id="donate-screen" className="w-full pt-14 pb-16 bg-[#f4f7fc]">
      {/* Compact Top Header */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-[#d8e3fb] pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00743a] block">
              {isNp ? 'पारदर्शी सेवा कोष' : 'Direct Giving & Verification'}
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-[#111c2d] font-heading">
              {isNp ? 'आधिकारिक भुक्तानी तथा रसिद दर्ता' : 'Official Payment Accounts & Donation Slip'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00743a] bg-emerald-50 border border-emerald-200 px-2.5 py-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{verifiedDonorsList.length} {isNp ? 'प्रमाणित दाताहरू' : 'Verified Donors'}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-6">
        {/* Main 2-Column Section: Left = Payment Methods & QR, Right = Slip Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* Left Column (5 Cols): Payment Tabs (Bank, eSewa, Khalti) */}
          <div className="lg:col-span-5 bg-white p-4 sm:p-5 border border-[#d8e3fb] shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#f0f3ff] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                {isNp ? '१. भुक्तानी माध्यम छान्नुहोस्' : '1. Payment Accounts & QR'}
              </h2>
              <span className="text-[10px] font-bold text-[#00743a] bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                100% Direct & Transparent
              </span>
            </div>

            {/* 3 Payment Tabs: Bank, eSewa, Khalti */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('bank');
                  setPaymentMethod('bank');
                }}
                className={`py-2 px-1 text-center border text-xs font-bold transition-colors flex flex-col items-center justify-center gap-0.5 ${
                  activeTab === 'bank'
                    ? 'border-[#003c90] bg-[#003c90] text-white shadow-xs'
                    : 'border-[#d8e3fb] bg-[#f9f9ff] text-[#434653] hover:border-[#003c90]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="text-[11px]">Bank Transfer</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('esewa');
                  setPaymentMethod('esewa');
                }}
                className={`py-2 px-1 text-center border text-xs font-bold transition-colors flex flex-col items-center justify-center gap-0.5 ${
                  activeTab === 'esewa'
                    ? 'border-emerald-700 bg-[#00743a] text-white shadow-xs'
                    : 'border-[#d8e3fb] bg-[#f9f9ff] text-[#434653] hover:border-emerald-600'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-[11px]">eSewa</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('khalti');
                  setPaymentMethod('khalti');
                }}
                className={`py-2 px-1 text-center border text-xs font-bold transition-colors flex flex-col items-center justify-center gap-0.5 ${
                  activeTab === 'khalti'
                    ? 'border-purple-800 bg-purple-700 text-white shadow-xs'
                    : 'border-[#d8e3fb] bg-[#f9f9ff] text-[#434653] hover:border-purple-600'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-[11px]">Khalti</span>
              </button>
            </div>

            {/* TAB CONTENT: Bank Transfer */}
            {activeTab === 'bank' && (
              <div className="space-y-3 pt-1">
                <div className="p-3 bg-[#f9f9ff] border border-[#d8e3fb] space-y-1.5 text-xs">
                  <div className="flex justify-between items-center border-b border-[#e7eeff] pb-1">
                    <span className="font-bold text-[#003c90] text-xs">{bankConfig.bankName || 'Global IME Bank Ltd.'}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankConfig.accountNumber || '01201010009823', 'bank_ac')}
                      className="text-[10px] text-[#003c90] font-bold flex items-center gap-1 hover:underline"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedLabel === 'bank_ac' ? 'Copied!' : 'Copy A/C'}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[#434653]">
                    <div>
                      <span className="text-[9px] text-[#737784] uppercase font-bold block">Account Name:</span>
                      <strong>{bankConfig.accountName || 'GENZICON FOUNDATION NEPAL'}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#737784] uppercase font-bold block">A/C Number:</span>
                      <strong className="font-mono text-[#003c90]">{bankConfig.accountNumber || '01201010009823'}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#737784] uppercase font-bold block">Branch:</span>
                      <span>{bankConfig.branch || 'Putalisadak Central Branch'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#737784] uppercase font-bold block">SWIFT Code:</span>
                      <span className="font-mono">{bankConfig.swiftCode || 'GLBBNPKA'}</span>
                    </div>
                  </div>
                </div>

                {/* Bank / Fonepay QR */}
                <div className="flex items-center gap-3 p-2.5 bg-white border border-[#d8e3fb]">
                  <img
                    src={bankConfig.fonepayQrImage}
                    alt="Bank Fonepay QR"
                    className="w-24 h-24 object-contain border border-[#d8e3fb] shrink-0 p-1 bg-white"
                  />
                  <div className="text-[11px] text-[#434653] space-y-1">
                    <span className="text-[10px] font-bold text-[#003c90] uppercase block">
                      Fonepay / Mobile Banking QR
                    </span>
                    <p className="text-[10px] text-[#737784] leading-snug">
                      {isNp ? 'Global IME, Nabil, NIC Asia, Prabhu लगायत सबै बैंक एपबाट स्क्यान गर्न सकिन्छ।' : 'Scan directly with any Nepal mobile banking app.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: eSewa */}
            {activeTab === 'esewa' && (
              <div className="space-y-3 pt-1">
                <div className="p-3 bg-[#f9f9ff] border border-emerald-200 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center border-b border-emerald-100 pb-1">
                    <span className="font-bold text-[#00743a] text-xs">eSewa Direct Wallet</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankConfig.esewaId || '9823000000', 'esewa_id')}
                      className="text-[10px] text-[#00743a] font-bold flex items-center gap-1 hover:underline"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedLabel === 'esewa_id' ? 'Copied!' : 'Copy ID'}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[#434653]">
                    <div>
                      <span className="text-[9px] text-[#737784] uppercase font-bold block">Registered Name:</span>
                      <strong>{bankConfig.accountName || 'Genzicon Foundation Nepal'}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#737784] uppercase font-bold block">eSewa ID:</span>
                      <strong className="font-mono text-[#00743a]">{bankConfig.esewaId || '9823000000 / genzicon.esewa'}</strong>
                    </div>
                  </div>
                </div>

                {/* eSewa QR */}
                <div className="flex items-center gap-3 p-2.5 bg-white border border-[#d8e3fb]">
                  <img
                    src={bankConfig.esewaQrImage || bankConfig.fonepayQrImage}
                    alt="eSewa QR"
                    className="w-24 h-24 object-contain border border-emerald-200 shrink-0 p-1 bg-white"
                  />
                  <div className="text-[11px] text-[#434653] space-y-1">
                    <span className="text-[10px] font-bold text-[#00743a] uppercase block">
                      eSewa QR Code
                    </span>
                    <p className="text-[10px] text-[#737784] leading-snug">
                      {isNp ? 'eSewa एपमार्फत सिधै रकम पठाउनुहोस् र रसिदको स्क्रिनसट फारममा अपलोड गर्नुहोस्।' : 'Scan in eSewa App, send amount, and upload the transaction screenshot.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Khalti */}
            {activeTab === 'khalti' && (
              <div className="space-y-3 pt-1">
                <div className="p-3 bg-[#f9f9ff] border border-purple-200 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center border-b border-purple-100 pb-1">
                    <span className="font-bold text-purple-800 text-xs">Khalti Wallet Transfer</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankConfig.khaltiId || '9823000000', 'khalti_id')}
                      className="text-[10px] text-purple-800 font-bold flex items-center gap-1 hover:underline"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedLabel === 'khalti_id' ? 'Copied!' : 'Copy ID'}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[#434653]">
                    <div>
                      <span className="text-[9px] text-[#737784] uppercase font-bold block">Registered Name:</span>
                      <strong>{bankConfig.accountName || 'Genzicon Foundation Nepal'}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#737784] uppercase font-bold block">Khalti ID:</span>
                      <strong className="font-mono text-purple-800">{bankConfig.khaltiId || '9823000000'}</strong>
                    </div>
                  </div>
                </div>

                {/* Khalti QR */}
                <div className="flex items-center gap-3 p-2.5 bg-white border border-[#d8e3fb]">
                  <img
                    src={bankConfig.khaltiQrImage || bankConfig.fonepayQrImage}
                    alt="Khalti QR"
                    className="w-24 h-24 object-contain border border-purple-200 shrink-0 p-1 bg-white"
                  />
                  <div className="text-[11px] text-[#434653] space-y-1">
                    <span className="text-[10px] font-bold text-purple-800 uppercase block">
                      Khalti QR Code
                    </span>
                    <p className="text-[10px] text-[#737784] leading-snug">
                      {isNp ? 'Khalti एपबाट स्क्यान गरी भुक्तानी गर्नुहोस् र रसिद पेश गर्नुहोस्।' : 'Scan via Khalti App and upload the payment slip.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (7 Cols): Donor & Payment Slip Submission Form */}
          <div className="lg:col-span-7 bg-white p-4 sm:p-5 border border-[#d8e3fb] shadow-xs">
            <div className="flex items-center justify-between border-b border-[#f0f3ff] pb-2 mb-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00743a]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                  {isNp ? '२. सहयोग रसिद तथा दाता विवरण फारम' : '2. Submit Donation Slip & Donor Details'}
                </h2>
              </div>
              <span className="text-[10px] text-[#737784]">
                {isNp ? 'प्रमाणीकरणपछि सूचीमा प्रकाशित हुनेछ' : 'Published upon verification'}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2.5">
              {formError && (
                <div className="p-2.5 bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold block">{isNp ? 'त्रुटि (Error):' : 'Submission Error:'}</span>
                    <span className="text-[11px]">{formError}</span>
                  </div>
                </div>
              )}
              {/* Row 1: Donor Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#111c2d] uppercase tracking-wider mb-0.5">
                    {isNp ? 'दाताको पूरा नाम *' : 'Donor Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder={isNp ? 'तपाईंको नाम' : 'e.g. Rameshwor Adhikari'}
                    className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#111c2d] uppercase tracking-wider mb-0.5">
                    {isNp ? 'सम्पर्क फोन / ह्वाट्सएप *' : 'Phone / WhatsApp *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>
              </div>

              {/* Row 2: Email, Address, Donated Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#111c2d] uppercase tracking-wider mb-0.5">
                    {isNp ? 'इमेल ठेगाना' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="donor@example.com"
                    className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#111c2d] uppercase tracking-wider mb-0.5">
                    {isNp ? 'ठेगाना / सहर *' : 'Address / City *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={donorAddress}
                    onChange={(e) => setDonorAddress(e.target.value)}
                    placeholder="Kathmandu / Pokhara"
                    className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#111c2d] uppercase tracking-wider mb-0.5">
                    {isNp ? 'सहयोग रकम (रू) *' : 'Amount Donated (NPR) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="5000"
                    className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-bold text-[#00743a] focus:outline-none focus:border-[#00743a] focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* Row 3: Payment Method Used & Program Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#111c2d] uppercase tracking-wider mb-0.5">
                    {isNp ? 'प्रयोग गरिएको माध्यम *' : 'Payment Method Used *'}
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-2 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  >
                    <option value="bank">Global IME Bank Transfer</option>
                    <option value="esewa">eSewa Direct Transfer</option>
                    <option value="khalti">Khalti Wallet Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#111c2d] uppercase tracking-wider mb-0.5">
                    {isNp ? 'परियोजना / क्षेत्र' : 'Target Initiative / Fund'}
                  </label>
                  <select
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-2 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  >
                    <option value="General Fund (Where Needed Most)">General Fund (Where Needed Most)</option>
                    <option value="Clothes Bank Nepal (Collection & Distribution)">Clothes Bank Nepal</option>
                    <option value="Clean Nepal, Green Nepal (100K Reforestation)">Clean Nepal, Green Nepal</option>
                    <option value="Women Tailoring & Youth Digital Skills">Skills & Business Mentorship</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Uploads - Donor Photo (<= 200KB) & Payment Slip File */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Donor Photo Upload */}
                <div>
                  <label className="block text-[10px] font-bold text-[#111c2d] uppercase tracking-wider mb-0.5">
                    {isNp ? 'दाताको फोटो (≤ २०० KB)' : 'Donor Photo (≤ 200 KB)'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="donor-photo-input"
                    />
                    {!donorPhotoPreview ? (
                      <label
                        htmlFor="donor-photo-input"
                        className="w-full py-1.5 px-2 border border-dashed border-[#003c90]/40 hover:border-[#003c90] bg-[#f9f9ff] hover:bg-blue-50/50 cursor-pointer flex items-center justify-center gap-1 text-[11px] font-semibold text-[#003c90] transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isNp ? 'फोटो छान्नुहोस्' : 'Upload Avatar'}</span>
                      </label>
                    ) : (
                      <div className="w-full flex items-center justify-between px-2 py-1 bg-blue-50 border border-blue-200">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <img
                            src={donorPhotoPreview}
                            alt="Donor"
                            className="w-6 h-6 object-cover rounded-xs border border-blue-300 shrink-0"
                          />
                          <span className="text-[10px] font-semibold text-[#003c90] truncate">
                            {donorPhotoFile?.name || 'Photo'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={removeDonorPhoto}
                          className="p-0.5 text-rose-600 hover:text-rose-800"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  {donorPhotoError && (
                    <span className="text-[9px] text-rose-600 flex items-center gap-0.5 mt-0.5 font-bold">
                      <AlertCircle className="w-3 h-3" />
                      {donorPhotoError}
                    </span>
                  )}
                </div>

                {/* Paid Payment Slip Upload */}
                <div>
                  <label className="block text-[10px] font-bold text-[#111c2d] uppercase tracking-wider mb-0.5">
                    {isNp ? 'भुक्तानी रसिद / भौचर (Slip) *' : 'Payment Slip / Voucher *'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      ref={slipInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleSlipUpload}
                      className="hidden"
                      id="payment-slip-input"
                    />
                    {!slipPreview ? (
                      <label
                        htmlFor="payment-slip-input"
                        className="w-full py-1.5 px-2 border border-dashed border-emerald-600/40 hover:border-emerald-700 bg-emerald-50/40 hover:bg-emerald-50 cursor-pointer flex items-center justify-center gap-1 text-[11px] font-semibold text-[#00743a] transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isNp ? 'रसिद अपलोड गर्नुहोस्' : 'Upload Paid Slip'}</span>
                      </label>
                    ) : (
                      <div className="w-full flex items-center justify-between px-2 py-1 bg-emerald-50 border border-emerald-300">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <img
                            src={slipPreview}
                            alt="Slip Preview"
                            className="w-6 h-6 object-cover rounded-xs border border-emerald-400 shrink-0"
                          />
                          <span className="text-[10px] font-semibold text-emerald-800 truncate">
                            {slipFile?.name || 'Slip.jpg'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={removeSlip}
                          className="p-0.5 text-rose-600 hover:text-rose-800"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  {slipError && (
                    <span className="text-[9px] text-rose-600 flex items-center gap-0.5 mt-0.5 font-bold">
                      <AlertCircle className="w-3 h-3" />
                      {slipError}
                    </span>
                  )}
                </div>
              </div>

              {/* Note / Message */}
              <div>
                <label className="block text-[10px] font-bold text-[#111c2d] uppercase tracking-wider mb-0.5">
                  {isNp ? 'सन्देश वा शुभकामना (ऐच्छिक)' : 'Message / Dedication Note (Optional)'}
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={isNp ? 'सहयोग सम्बन्धी केही सन्देश...' : 'e.g. Dedicated in honor of our community...'}
                  className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-3 bg-[#00743a] hover:bg-[#005227] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting Slip...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{isNp ? 'रसिद पेश गर्नुहोस्' : 'Submit Donation Slip & Verify'}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[9px] text-[#737784] text-center pt-0.5">
                {isNp
                  ? 'ℹ️ बैंक रसिद लेखा टोलीबाट पुष्टि भएपछि आधिकारिक कर छुट रसिद जारी हुनेछ र दाता सूचीमा देखिनेछ।'
                  : 'ℹ️ Bank slips are verified by our finance team before listing on the public wall of generous donors.'}
              </p>
            </form>
          </div>
        </div>

        {/* VERIFIED GENEROUS DONORS DIRECTORY (Public Wall of Donors) */}
        <div className="bg-white p-4 sm:p-5 border border-[#d8e3fb] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0f3ff] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-emerald-100 text-[#00743a] flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#111c2d] font-heading">
                    {isNp ? 'हाम्रा आदरणीय सहयोगी दाताहरू' : 'Our Generous Donors Directory'}
                  </h3>
                  <span className="px-2 py-0.2 bg-emerald-100 text-[#00743a] text-[10px] font-bold rounded-full">
                    {verifiedDonorsList.length} {isNp ? 'प्रमाणित' : 'Verified'}
                  </span>
                </div>
              </div>
            </div>

            <span className="text-[10px] text-[#737784]">
              {isNp ? '१००% पारदर्शी वित्तीय लेखा' : '100% Transparent Financial Ledger'}
            </span>
          </div>

          {verifiedDonorsList.length === 0 ? (
            <div className="py-8 text-center text-[#737784] bg-[#f9f9ff] border border-dashed border-[#d8e3fb]">
              <Heart className="w-6 h-6 mx-auto mb-1 text-[#737784]/50" />
              <p className="text-xs font-bold">{isNp ? 'कुनै दाता फेला परेन।' : 'No verified donors listed yet.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {verifiedDonorsList.map((donor) => {
                const initials = donor.donorName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={donor.id || donor.receiptNumber}
                    className="bg-white border border-[#d8e3fb] p-3 hover:border-[#00743a] transition-all hover:shadow-xs flex flex-col justify-between space-y-2"
                  >
                    {/* Header: Photo + Name + Amount */}
                    <div className="flex items-start gap-2.5">
                      {donor.donorPhotoUrl ? (
                        <img
                          src={donor.donorPhotoUrl}
                          alt={donor.donorName}
                          className="w-10 h-10 rounded-xs object-cover border border-[#d8e3fb] shrink-0 bg-gray-100"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xs bg-[#00743a]/10 text-[#00743a] flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200 font-mono">
                          {initials}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-[9px] font-bold text-[#003c90] bg-[#f0f4fc] px-1.5 py-0.2 border border-blue-100 truncate">
                            {donor.receiptNumber || 'REC-2026'}
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            <span>{isNp ? 'प्रमाणित' : 'Verified'}</span>
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#111c2d] truncate mt-0.5">
                          {donor.donorName}
                        </h4>
                        <div className="flex items-center gap-0.5 text-[10px] text-[#434653] truncate">
                          <MapPin className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                          <span className="truncate">{donor.donorAddress || 'Nepal'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Method Badge */}
                    <div className="p-2 bg-[#f0f9f4] border border-emerald-200 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-[#737784] uppercase font-bold block">Contributed:</span>
                        <span className="font-mono font-bold text-xs text-[#00743a]">
                          रू {Number(donor.amount).toLocaleString()}
                        </span>
                      </div>
                      <span className="px-1.5 py-0.5 bg-white text-[#003c90] text-[9px] font-bold uppercase border border-blue-200">
                        {donor.paymentMethod ? donor.paymentMethod.replace('_', ' ') : 'Bank'}
                      </span>
                    </div>

                    {/* Project & Note */}
                    {donor.note ? (
                      <p className="text-[10px] text-[#737784] line-clamp-2 italic leading-snug">
                        "{donor.note}"
                      </p>
                    ) : (
                      <p className="text-[10px] text-[#434653] truncate font-medium">
                        {donor.projectName}
                      </p>
                    )}

                    {/* Footer Date */}
                    <div className="pt-2 border-t border-[#f0f3ff] flex items-center justify-between text-[9px] text-[#737784]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5 text-[#00743a]" />
                        <span>{donor.date}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Submission Success Modal */}
      {submittedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-5 border border-[#d8e3fb] shadow-xl text-center space-y-3">
            <div className="w-10 h-10 bg-emerald-100 text-[#00743a] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-[#111c2d] font-heading">
              {isNp ? 'रसिद सफलतापूर्वक पेश भयो!' : 'Donation Slip Submitted!'}
            </h3>

            <p className="text-xs text-[#434653] leading-relaxed">
              {isNp
                ? `हार्दिक धन्यवाद, ${submittedModal.donorName}! तपाईंको रू ${submittedModal.amount.toLocaleString()} को भुक्तानी रसिद लेखा टोलीबाट प्रमाणीकरण हुँदैछ। प्रमाणीकरणपछि तपाईंको नाम र फोटो दाता सूचीमा प्रकाशित हुनेछ।`
                : `Thank you, ${submittedModal.donorName}! Your payment slip for NPR ${submittedModal.amount.toLocaleString()} has been recorded in Pending verification status. Once verified by our finance team, your profile will appear on the Generous Donors Wall.`}
            </p>

            <div className="p-3 bg-[#f9f9ff] border border-[#d8e3fb] text-left text-xs space-y-1">
              <div className="flex justify-between font-mono">
                <span className="text-[#737784]">Receipt Track ID:</span>
                <span className="font-bold text-[#003c90]">{submittedModal.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737784]">Method:</span>
                <span className="font-bold uppercase text-[#111c2d]">{submittedModal.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737784]">Location:</span>
                <span className="font-bold text-[#111c2d]">{submittedModal.donorAddress || 'Nepal'}</span>
              </div>
            </div>

            <button
              onClick={() => setSubmittedModal(null)}
              className="w-full py-2 bg-[#00743a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#005227] transition-colors"
            >
              {isNp ? 'सम्पन्न' : 'Done'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  CreditCard, 
  Building2, 
  QrCode, 
  Copy, 
  Smartphone
} from 'lucide-react';
import { FINANCIAL_ALLOCATION_DATA } from '../data/mockData';
import { Project, DonationSubmission, Language, Currency } from '../types';

interface DonateScreenProps {
  language: Language;
  selectedProject?: Project | null;
  onDonateComplete: (submission: DonationSubmission) => void;
}

export const DonateScreen: React.FC<DonateScreenProps> = ({
  language,
  selectedProject,
  onDonateComplete
}) => {
  const isNp = language === 'np';
  const [currency, setCurrency] = useState<Currency>('NPR');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [selectedAmount, setSelectedAmount] = useState<number>(1500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'khalti' | 'fonepay' | 'bank' | 'card'>('fonepay');

  // Donor form
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  const nprAmounts = [500, 1500, 5000, 10000];
  const usdAmounts = [15, 50, 100, 250];

  const currentAmounts = currency === 'NPR' ? nprAmounts : usdAmounts;

  const handleAmountClick = (amt: number) => {
    setSelectedAmount(amt);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(0);
  };

  const effectiveAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(label);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveAmount <= 0) return;

    const receiptNumber = `REC-GZ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const submission: DonationSubmission = {
      amount: effectiveAmount,
      currency: currency,
      customAmount: customAmount,
      frequency: frequency,
      paymentMethod: paymentMethod,
      donorName: donorName || (isNp ? 'शुभचिन्तक दाता' : 'Generous Donor'),
      donorEmail: donorEmail || 'donor@genzicon.org',
      donorPhone: donorPhone,
      projectName: selectedProject ? selectedProject.title : (isNp ? 'सामान्य कोष (जहाँ सबैभन्दा आवश्यक छ)' : 'General Fund (Highest Impact Need)'),
      receiptNumber: receiptNumber,
      date: new Date().toISOString().split('T')[0]
    };

    onDonateComplete(submission);
  };

  return (
    <div id="donate-screen" className="w-full pt-16 pb-12 bg-[#f9f9ff]">
      {/* Header */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-6">
        <div className="border-b border-[#d8e3fb] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#00743a] block mb-0.5">
                {isNp ? 'प्रत्यक्ष तथा पारदर्शी सहयोग' : 'Direct & Transparent Giving'}
              </span>
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111c2d]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {isNp ? 'अनलाइन सहयोग पोर्टल' : 'Official Donation Portal'}
              </h1>
            </div>
            <p className="text-xs text-[#434653] max-w-md">
              {isNp
                ? 'eSewa, Fonepay QR वा कार्डमार्फत सहयोग गर्नुहोस्। ८८% बजेट प्रत्यक्ष फिल्डमा खर्च हुन्छ।'
                : 'Support grassroot initiatives via Fonepay QR, eSewa, Bank Transfer, or Card with instant official receipt.'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main Donation Form (Left/Center) */}
          <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-none sm:rounded-xs border border-[#d8e3fb]">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Target Project banner if selected */}
              {selectedProject && (
                <div className="p-3 bg-[#e7eeff] border border-[#003c90]/20 rounded-none sm:rounded-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#003c90] uppercase tracking-wider block">
                      {isNp ? 'छानिएको परियोजना' : 'Selected Project'}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#111c2d]">
                      {isNp && selectedProject.titleNp ? selectedProject.titleNp : selectedProject.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-[#00743a] bg-white px-2.5 py-1 rounded-none">
                    {selectedProject.location}
                  </span>
                </div>
              )}

              {/* Currency & Frequency Switchers */}
              <div className="flex flex-row items-center justify-between gap-2 pb-4 border-b border-[#f0f3ff]">
                {/* Frequency */}
                <div className="inline-flex bg-[#f0f3ff] border border-[#d8e3fb] rounded-none sm:rounded-xs">
                  <button
                    type="button"
                    onClick={() => setFrequency('one-time')}
                    className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                      frequency === 'one-time'
                        ? 'bg-[#003c90] text-white'
                        : 'text-[#434653] hover:text-[#003c90]'
                    }`}
                  >
                    {isNp ? 'एकपटक (One-Time)' : 'One-Time'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('monthly')}
                    className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                      frequency === 'monthly'
                        ? 'bg-[#003c90] text-white'
                        : 'text-[#434653] hover:text-[#003c90]'
                    }`}
                  >
                    {isNp ? 'मासिक (Monthly)' : 'Monthly'}
                  </button>
                </div>

                {/* Currency */}
                <div className="inline-flex bg-[#f0f3ff] border border-[#d8e3fb] rounded-none sm:rounded-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrency('NPR');
                      setSelectedAmount(1500);
                      setCustomAmount('');
                    }}
                    className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                      currency === 'NPR' ? 'bg-[#00743a] text-white' : 'text-[#434653]'
                    }`}
                  >
                    NPR (रू)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrency('USD');
                      setSelectedAmount(50);
                      setCustomAmount('');
                    }}
                    className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                      currency === 'USD' ? 'bg-[#00743a] text-white' : 'text-[#434653]'
                    }`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              {/* Amount Selection Grid */}
              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-2">
                  {isNp ? 'सहयोग रकम छान्नुहोस्' : 'Select Amount'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2.5">
                  {currentAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleAmountClick(amt)}
                      className={`py-2.5 px-3 rounded-none sm:rounded-xs text-sm font-bold transition-colors border ${
                        selectedAmount === amt && !customAmount
                          ? 'border-[#003c90] bg-[#003c90] text-white'
                          : 'border-[#d8e3fb] bg-[#f9f9ff] text-[#111c2d] hover:border-[#003c90]'
                      }`}
                    >
                      {currency === 'NPR' ? `रू ${amt.toLocaleString()}` : `$${amt}`}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#737784]">
                    {currency === 'NPR' ? 'रू' : '$'}
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={customAmount}
                    onChange={handleCustomChange}
                    placeholder={isNp ? 'वा इच्छा अनुसार रकम...' : 'Or enter custom amount...'}
                    className="w-full pl-8 pr-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-bold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>
              </div>

              {/* Payment Methods Selection: Crisp rectangular tiles */}
              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-2">
                  {isNp ? 'भुक्तानी माध्यम छान्नुहोस्' : 'Payment Method'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('fonepay')}
                    className={`p-2.5 rounded-none sm:rounded-xs border text-center transition-colors flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'fonepay'
                        ? 'border-[#00743a] bg-emerald-50 text-[#00743a] font-bold'
                        : 'border-[#d8e3fb] bg-[#f9f9ff] text-[#434653] hover:border-[#00743a]'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-[#00743a]" />
                    <span className="text-[11px]">Fonepay QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('esewa')}
                    className={`p-2.5 rounded-none sm:rounded-xs border text-center transition-colors flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'esewa'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                        : 'border-[#d8e3fb] bg-[#f9f9ff] text-[#434653] hover:border-emerald-600'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px]">eSewa ID</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('khalti')}
                    className={`p-2.5 rounded-none sm:rounded-xs border text-center transition-colors flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'khalti'
                        ? 'border-purple-600 bg-purple-50 text-purple-800 font-bold'
                        : 'border-[#d8e3fb] bg-[#f9f9ff] text-[#434653] hover:border-purple-600'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-purple-600" />
                    <span className="text-[11px]">Khalti</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-2.5 rounded-none sm:rounded-xs border text-center transition-colors flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'bank'
                        ? 'border-[#003c90] bg-[#f0f3ff] text-[#003c90] font-bold'
                        : 'border-[#d8e3fb] bg-[#f9f9ff] text-[#434653] hover:border-[#003c90]'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-[#003c90]" />
                    <span className="text-[11px]">Bank Transfer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-none sm:rounded-xs border text-center transition-colors flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'card'
                        ? 'border-[#003c90] bg-[#f0f3ff] text-[#003c90] font-bold'
                        : 'border-[#d8e3fb] bg-[#f9f9ff] text-[#434653] hover:border-[#003c90]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#003c90]" />
                    <span className="text-[11px]">Visa / Card</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Payment Method Details Container */}
              <div className="p-4 rounded-none sm:rounded-xs bg-[#f9f9ff] border border-[#d8e3fb]">
                {/* FONEPAY / QR METHOD */}
                {paymentMethod === 'fonepay' && (
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    <div className="p-2.5 bg-white rounded-none border border-[#d8e3fb] shadow-xs shrink-0">
                      <div className="w-32 h-32 bg-[#111c2d] rounded-none flex flex-col items-center justify-center text-white p-2 relative overflow-hidden">
                        <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-white rounded-none">
                          {Array.from({ length: 36 }).map((_, i) => (
                            <div
                              key={i}
                              className={`rounded-none ${
                                (i % 2 === 0 || i % 7 === 0 || i < 6 || i > 30) ? 'bg-[#111c2d]' : 'bg-white'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="px-1.5 py-0.5 bg-[#00743a] text-white text-[9px] font-bold">
                            fonepay
                          </span>
                        </div>
                      </div>
                      <div className="text-[9px] text-center font-bold text-[#737784] mt-1">
                        ALL NEPAL MOBILE BANKING APPS
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#434653]">
                      <h4 className="font-bold text-xs text-[#111c2d]">
                        {isNp ? 'Fonepay QR कोड स्क्यान गर्नुहोस्' : 'Scan With Any Nepal Banking App'}
                      </h4>
                      <p className="text-[11px]">
                        {isNp
                          ? 'Global IME, Nabil, NIC Asia, Prabhu, eSewa वा Khalti बाट सिधै भुक्तानी गर्नुहोस्।'
                          : 'Compatible with all Nepali banking apps and digital wallets.'}
                      </p>
                      <div className="pt-1">
                        <span className="text-[10px] font-bold text-[#003c90] bg-[#e7eeff] px-2.5 py-1 rounded-none inline-block">
                          Account: GENZICON FOUNDATION NEPAL
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ESEWA METHOD */}
                {paymentMethod === 'esewa' && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-[#111c2d]">eSewa Direct Transfer</h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-none">Verified NGO</span>
                    </div>
                    <div className="p-3 bg-white rounded-none border border-[#d8e3fb] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#737784] block">eSewa ID / Registered Mobile:</span>
                        <span className="text-xs font-bold text-[#111c2d]">9823000000 / genzicon.esewa</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('9823000000', 'esewa')}
                        className="px-2.5 py-1 text-[#003c90] hover:bg-[#f0f3ff] rounded-none border border-[#d8e3fb] transition-colors flex items-center gap-1 text-[11px] font-bold"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedBank === 'esewa' ? 'Copied!' : 'Copy ID'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* KHALTI METHOD */}
                {paymentMethod === 'khalti' && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-[#111c2d]">Khalti Wallet Transfer</h4>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-none">Verified</span>
                    </div>
                    <div className="p-3 bg-white rounded-none border border-[#d8e3fb] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#737784] block">Khalti ID:</span>
                        <span className="text-xs font-bold text-[#111c2d]">9801234567</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('9801234567', 'khalti')}
                        className="px-2.5 py-1 text-[#003c90] hover:bg-[#f0f3ff] rounded-none border border-[#d8e3fb] transition-colors flex items-center gap-1 text-[11px] font-bold"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedBank === 'khalti' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* BANK TRANSFER METHOD */}
                {paymentMethod === 'bank' && (
                  <div className="space-y-2 text-xs">
                    <h4 className="font-bold text-xs text-[#111c2d]">
                      {isNp ? 'आधिकारिक बैंक खाता' : 'Official Bank Accounts in Nepal'}
                    </h4>

                    {/* Bank 1 */}
                    <div className="p-3 bg-white rounded-none border border-[#d8e3fb] space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#003c90] text-xs">Global IME Bank Limited</span>
                        <button
                          type="button"
                          onClick={() => handleCopy('01010100234567', 'global')}
                          className="text-[10px] text-[#003c90] font-bold flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedBank === 'global' ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px] text-[#434653]">
                        <div>Account Name: <strong>GENZICON FOUNDATION</strong></div>
                        <div>A/C Number: <strong>01010100234567</strong></div>
                        <div>Branch: <strong>Putalisadak, Kathmandu</strong></div>
                        <div>SWIFT: <strong>GLBLNPKA</strong></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* CARD METHOD */}
                {paymentMethod === 'card' && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-[#111c2d]">International Credit / Debit Card</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-[#737784] uppercase mb-0.5">Card Number</label>
                        <input
                          type="text"
                          placeholder="4111 2222 3333 4444"
                          className="w-full px-3 py-1.5 rounded-none border border-[#d8e3fb] bg-white text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-[#737784] uppercase mb-0.5">Expiry</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-3 py-1.5 rounded-none border border-[#d8e3fb] bg-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#737784] uppercase mb-0.5">CVC</label>
                          <input
                            type="password"
                            placeholder="123"
                            maxLength={4}
                            className="w-full px-3 py-1.5 rounded-none border border-[#d8e3fb] bg-white text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Donor Contact Information */}
              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-2">
                  {isNp ? 'दाता विवरण (रसिदका लागि)' : 'Donor Details (For Official Tax Receipt)'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder={isNp ? 'तपाईंको पूरा नाम *' : 'Full Name *'}
                      className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder={isNp ? 'इमेल ठेगाना *' : 'Email Address *'}
                      className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder={isNp ? 'फोन / ह्वाट्सएप' : 'Phone Number'}
                      className="w-full px-3 py-2 rounded-none sm:rounded-xs border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button: Crisp Rectangular Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#00743a] hover:bg-[#005227] text-white rounded-none sm:rounded-xs text-xs font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <span>
                  {isNp
                    ? `दान सम्पन्न गर्नुहोस् (${currency === 'NPR' ? 'रू ' + effectiveAmount.toLocaleString() : '$' + effectiveAmount})`
                    : `Confirm & Generate Official Receipt (${currency === 'NPR' ? 'रू ' + effectiveAmount.toLocaleString() : '$' + effectiveAmount})`}
                </span>
                <Heart className="w-3.5 h-3.5 fill-white text-white" />
              </button>
            </form>
          </div>

          {/* Right Sidebar: Transparency & Allocation Breakdown */}
          <div className="lg:col-span-4 space-y-4">
            {/* Allocation Box */}
            <div className="bg-white p-4 sm:p-5 rounded-none sm:rounded-xs border border-[#d8e3fb]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00743a] mb-1 block">
                {isNp ? 'वित्तीय पारदर्शिता' : 'Fund Allocation'}
              </span>
              <h3 className="text-sm font-bold text-[#111c2d] mb-3">
                {isNp ? '८८% प्रत्यक्ष फिल्ड खर्च' : '88% Direct Program Allocation'}
              </h3>

              <div className="space-y-3">
                {FINANCIAL_ALLOCATION_DATA.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#111c2d]">{isNp ? item.labelNp : item.label}</span>
                      <span style={{ color: item.color }}>{item.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-none bg-[#f0f3ff] overflow-hidden">
                      <div
                        className="h-full rounded-none"
                        style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                      />
                    </div>
                    <p className="text-[10px] text-[#737784] leading-tight">
                      {isNp ? item.descriptionNp : item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax Exemption & SWC Trust Badge */}
            <div className="bg-white p-4 sm:p-5 rounded-none sm:rounded-xs border border-[#d8e3fb] space-y-2 text-xs text-[#434653]">
              <div className="flex items-center gap-2 text-[#003c90] font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-[#00743a]" />
                <span>{isNp ? 'कर छुट तथा वैधानिक दर्ता' : 'SWC Reg & Tax Exemption'}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {isNp
                  ? 'जेन्जिकन फाउन्डेशन समाज कल्याण परिषद् (सम्बन्धन नं. ५४१२८) र आन्तरिक राजस्व विभाग (PAN: ६०९८२३४५१) मा दर्ता भएको संस्था हो।'
                  : 'Certified by the Social Welfare Council of Nepal (Affiliation No. 54128) and registered under PAN: 609823451.'}
              </p>
              <div className="pt-2 border-t border-[#f0f3ff] flex items-center justify-between text-[10px] font-semibold text-[#737784]">
                <span>Statutory Audit: Certified</span>
                <span className="text-[#00743a]">100% Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

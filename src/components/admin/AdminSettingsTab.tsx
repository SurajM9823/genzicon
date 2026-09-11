import React, { useState, useRef } from 'react';
import { 
  Building2, 
  QrCode, 
  Save, 
  CheckCircle2, 
  RotateCcw, 
  Phone, 
  Mail, 
  ExternalLink,
  MapPin,
  Globe,
  Upload,
  Image as ImageIcon,
  Trash2,
  Clock,
  MessageSquare,
  Share2,
  Sparkles
} from 'lucide-react';
import { BankAndQrConfig, SiteSettingsConfig, Language } from '../../types';
import { DEFAULT_BANK_QR_CONFIG, DEFAULT_SITE_SETTINGS } from '../../data/mockData';
import { compressImage } from '../../utils/imageCompress';

interface AdminSettingsTabProps {
  language: Language;
  siteSettings: SiteSettingsConfig;
  onSaveSiteSettings: (settings: SiteSettingsConfig, logoFile?: File | null) => Promise<boolean | void>;
  bankQrConfig: BankAndQrConfig;
  onSaveBankQrConfig: (config: BankAndQrConfig) => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  language,
  siteSettings,
  onSaveSiteSettings,
  bankQrConfig,
  onSaveBankQrConfig
}) => {
  const isNp = language === 'np';
  const [subTab, setSubTab] = useState<'branding' | 'offices' | 'bank'>('branding');

  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettingsConfig>(siteSettings);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(siteSettings.logoUrl || null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Bank & QR Form State
  const [bankForm, setBankForm] = useState<BankAndQrConfig>(bankQrConfig);

  const [saving, setSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Sync if prop updates
  React.useEffect(() => {
    setSettingsForm(siteSettings);
    if (!logoFile) {
      setLogoPreview(siteSettings.logoUrl || null);
    }
  }, [siteSettings]);

  React.useEffect(() => {
    setBankForm(bankQrConfig);
  }, [bankQrConfig]);

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 800, 0.9);
      setLogoFile(compressed);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(compressed);
    } catch {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setSettingsForm(prev => ({ ...prev, logoUrl: '' }));
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSaveSiteSettings(settingsForm, logoFile);
      onSaveBankQrConfig(bankForm);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3500);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all site settings, offices, social links, and bank details to system defaults?')) {
      setSettingsForm(DEFAULT_SITE_SETTINGS);
      setBankForm(DEFAULT_BANK_QR_CONFIG);
      setLogoFile(null);
      setLogoPreview(null);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Top Header Card */}
      <div className="bg-white p-4 sm:p-5 border border-[#d8e3fb] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#111c2d] font-heading flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#003c90]" />
            <span>Site Identity, Office Locations, Social Links & Banking</span>
          </h2>
          <p className="text-xs text-[#737784]">
            Manage live organization branding, official logo, WhatsApp hotline, Facebook profile, Kathmandu & Janakpur offices, and donation bank details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveToast && (
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200 animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Published Live!</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 bg-[#f9f9ff] hover:bg-[#f0f3ff] text-[#434653] text-xs font-bold border border-[#d8e3fb] flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-[#00743a] hover:bg-[#005227] text-white text-xs font-bold uppercase tracking-wider shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Switcher */}
      <div className="flex items-center gap-1 bg-[#e7eeff] p-1 border border-[#d8e3fb]">
        <button
          type="button"
          onClick={() => setSubTab('branding')}
          className={`px-3 sm:px-4 py-2 text-xs font-bold flex items-center gap-1.5 transition-all ${
            subTab === 'branding'
              ? 'bg-[#003c90] text-white shadow-xs'
              : 'text-[#003c90] hover:bg-white/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Branding, Logo & Socials</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('offices')}
          className={`px-3 sm:px-4 py-2 text-xs font-bold flex items-center gap-1.5 transition-all ${
            subTab === 'offices'
              ? 'bg-[#003c90] text-white shadow-xs'
              : 'text-[#003c90] hover:bg-white/60'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Office Locations & Hotline</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('bank')}
          className={`px-3 sm:px-4 py-2 text-xs font-bold flex items-center gap-1.5 transition-all ${
            subTab === 'bank'
              ? 'bg-[#003c90] text-white shadow-xs'
              : 'text-[#003c90] hover:bg-white/60'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Bank Account & QR Codes</span>
        </button>
      </div>

      {/* SUB-TAB 1: Branding, Official Logo & Social Links */}
      {subTab === 'branding' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 space-y-5">
            {/* Logo Upload Card */}
            <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0f3ff]">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#003c90]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                    1. Official Genzicon Logo (Navbar & Footer)
                  </h3>
                </div>
                <span className="text-[10px] text-[#00743a] font-semibold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  Live in Header & Footer
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Upload Logo Image (PNG, SVG, or JPG)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    className="hidden"
                    id="admin-logo-upload-input"
                  />
                  <label
                    htmlFor="admin-logo-upload-input"
                    className="cursor-pointer px-3 py-2 bg-[#f0f3ff] hover:bg-[#d8e3fb] text-[#003c90] text-xs font-bold border border-[#003c90]/30 flex items-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose Logo File...</span>
                  </label>

                  {logoPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="px-2.5 py-2 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Logo</span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Or External Logo URL
                </label>
                <input
                  type="url"
                  value={settingsForm.logoUrl || ''}
                  onChange={(e) => {
                    setSettingsForm({ ...settingsForm, logoUrl: e.target.value });
                    if (!logoFile) setLogoPreview(e.target.value || null);
                  }}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>

              {/* Logo Preview Box */}
              <div className="p-3 bg-[#111c2d] text-white rounded-xs border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-white/60 block uppercase font-mono mb-1">Dark Navbar & Footer Preview</span>
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-9 max-w-[180px] object-contain bg-white/5 p-1 rounded-xs"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-bold text-white/80">
                      <div className="w-7 h-7 bg-[#003c90] flex items-center justify-center text-white">
                        <Globe className="w-4 h-4" />
                      </div>
                      <span>Default Globe Icon</span>
                    </div>
                  )}
                </div>
                <div className="bg-white p-2 rounded-xs">
                  <span className="text-[10px] text-[#737784] block uppercase font-mono mb-1">Light Navbar</span>
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview light"
                      className="h-8 max-w-[140px] object-contain"
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#003c90]">Genzicon</span>
                  )}
                </div>
              </div>
            </div>

            {/* Organization Names & Tagline */}
            <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0f3ff]">
                <Globe className="w-4 h-4 text-[#003c90]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                  2. Organization Identity & About Summary
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Organization Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.orgName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, orgName: e.target.value })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Organization Name (नेपाली)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.orgNameNp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, orgNameNp: e.target.value })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Tagline (English)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Tagline (नेपाली)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.taglineNp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, taglineNp: e.target.value })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  About / Mission Summary (Footer English)
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.aboutText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  About / Mission Summary (Footer नेपाली)
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.aboutTextNp}
                  onChange={(e) => setSettingsForm({ ...settingsForm, aboutTextNp: e.target.value })}
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Right Column: WhatsApp & Socials */}
          <div className="lg:col-span-5 space-y-5">
            {/* WhatsApp Quick Connect Card */}
            <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0f3ff]">
                <div className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                  <Phone className="w-3 h-3" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                  3. Floating WhatsApp Hotline Button
                </h3>
              </div>
              <p className="text-[11px] text-[#737784]">
                This number is used by the floating green WhatsApp button on the left edge of every page.
              </p>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  WhatsApp Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.whatsappNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                  placeholder="e.g. +977 9823000000 or 9823000000"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-bold text-emerald-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Default Pre-filled WhatsApp Chat Message
                </label>
                <input
                  type="text"
                  value={settingsForm.whatsappMessage || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappMessage: e.target.value })}
                  placeholder="e.g. Namaste Genzicon Foundation, I would like to connect."
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${(settingsForm.whatsappNumber || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settingsForm.whatsappMessage || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#25D366] hover:underline font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test WhatsApp Quick Link</span>
                </a>
              </div>
            </div>

            {/* Facebook & Social Media Links */}
            <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0f3ff]">
                <Share2 className="w-4 h-4 text-[#1877F2]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                  4. Facebook Page & Social Media Links
                </h3>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Official Facebook Page Link * (Floating Button)
                </label>
                <input
                  type="url"
                  required
                  value={settingsForm.facebookUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/genzicon"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#1877F2] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Instagram Profile Link
                </label>
                <input
                  type="url"
                  value={settingsForm.instagramUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/genzicon"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  YouTube Channel Link
                </label>
                <input
                  type="url"
                  value={settingsForm.youtubeUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })}
                  placeholder="https://youtube.com/@genzicon"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  LinkedIn Company Page
                </label>
                <input
                  type="url"
                  value={settingsForm.linkedinUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/company/genzicon"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Office Locations & Hotline */}
      {subTab === 'offices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Central Head Office (Kathmandu) */}
          <div className="lg:col-span-6 bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#f0f3ff]">
              <Building2 className="w-4 h-4 text-[#003c90]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                1. Central Head Office (Kathmandu HQ)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Office Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.headOfficeTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, headOfficeTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Office Title (नेपाली)
                </label>
                <input
                  type="text"
                  value={settingsForm.headOfficeTitleNp}
                  onChange={(e) => setSettingsForm({ ...settingsForm, headOfficeTitleNp: e.target.value })}
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Subtitle (English)
                </label>
                <input
                  type="text"
                  value={settingsForm.headOfficeSubtitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, headOfficeSubtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Subtitle (नेपाली)
                </label>
                <input
                  type="text"
                  value={settingsForm.headOfficeSubtitleNp}
                  onChange={(e) => setSettingsForm({ ...settingsForm, headOfficeSubtitleNp: e.target.value })}
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                Full Address (English) *
              </label>
              <input
                type="text"
                required
                value={settingsForm.headOfficeAddress}
                onChange={(e) => setSettingsForm({ ...settingsForm, headOfficeAddress: e.target.value })}
                className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                Full Address (नेपाली)
              </label>
              <input
                type="text"
                value={settingsForm.headOfficeAddressNp}
                onChange={(e) => setSettingsForm({ ...settingsForm, headOfficeAddressNp: e.target.value })}
                className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Phone Number(s) *
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.headOfficePhone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, headOfficePhone: e.target.value })}
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={settingsForm.headOfficeEmail}
                  onChange={(e) => setSettingsForm({ ...settingsForm, headOfficeEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Operating Hours (English)
                </label>
                <input
                  type="text"
                  value={settingsForm.headOfficeHours}
                  onChange={(e) => setSettingsForm({ ...settingsForm, headOfficeHours: e.target.value })}
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Operating Hours (नेपाली)
                </label>
                <input
                  type="text"
                  value={settingsForm.headOfficeHoursNp}
                  onChange={(e) => setSettingsForm({ ...settingsForm, headOfficeHoursNp: e.target.value })}
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Madhesh Regional Office & Hotline */}
          <div className="lg:col-span-6 space-y-5">
            {/* Madhesh Regional Office */}
            <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0f3ff]">
                <MapPin className="w-4 h-4 text-[#00743a]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                  2. Madhesh Regional Office (Janakpur)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Regional Office Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.regionalOfficeTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, regionalOfficeTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#00743a] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Regional Office Title (नेपाली)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.regionalOfficeTitleNp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, regionalOfficeTitleNp: e.target.value })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#00743a] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Subtitle (English)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.regionalOfficeSubtitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, regionalOfficeSubtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#00743a] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Subtitle (नेपाली)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.regionalOfficeSubtitleNp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, regionalOfficeSubtitleNp: e.target.value })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#00743a] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Address (English) *
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.regionalOfficeAddress}
                  onChange={(e) => setSettingsForm({ ...settingsForm, regionalOfficeAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#00743a] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.regionalOfficePhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, regionalOfficePhone: e.target.value })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#00743a] focus:bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={settingsForm.regionalOfficeEmail || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, regionalOfficeEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#00743a] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Direct Clothes Donation Hotline Notice */}
            <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0f3ff]">
                <MessageSquare className="w-4 h-4 text-[#003c90]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                  3. Direct Clothes Donation Help & Notice
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Hotline Notice Title (English)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.hotlineTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hotlineTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Hotline Phone
                  </label>
                  <input
                    type="text"
                    value={settingsForm.hotlinePhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hotlinePhone: e.target.value })}
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Hotline Text Notice (English)
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.hotlineText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, hotlineText: e.target.value })}
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Footer Offices Summary (One-liner displayed in Footer)
                </label>
                <input
                  type="text"
                  value={settingsForm.footerOfficesSummary}
                  onChange={(e) => setSettingsForm({ ...settingsForm, footerOfficesSummary: e.target.value })}
                  placeholder="e.g. Putalisadak, Kathmandu & Station Rd, Janakpur"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Bank Account & QR Codes */}
      {subTab === 'bank' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input Form for Bank and QR settings */}
          <div className="lg:col-span-7 space-y-5">
            {/* Section 1: Official Bank Details */}
            <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0f3ff]">
                <Building2 className="w-4 h-4 text-[#003c90]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                  1. Official Commercial Bank Details (Direct Wire / Cheque)
                </h3>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Bank Name *
                </label>
                <input
                  type="text"
                  required
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                  placeholder="e.g. Global IME Bank Ltd."
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Account Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bankForm.accountName}
                    onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
                    placeholder="e.g. GENZICON FOUNDATION NEPAL"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={bankForm.accountNumber}
                    onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                    placeholder="e.g. 01201010009823"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-mono font-bold text-[#003c90] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Branch Name & City
                  </label>
                  <input
                    type="text"
                    value={bankForm.branch}
                    onChange={(e) => setBankForm({ ...bankForm, branch: e.target.value })}
                    placeholder="e.g. Putalisadak Central Branch, Kathmandu"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    SWIFT Code (for International Wire)
                  </label>
                  <input
                    type="text"
                    value={bankForm.swiftCode || ''}
                    onChange={(e) => setBankForm({ ...bankForm, swiftCode: e.target.value })}
                    placeholder="e.g. GLBBNPKA"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-mono text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Fonepay QR & Mobile Wallets */}
            <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0f3ff]">
                <QrCode className="w-4 h-4 text-[#00743a]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                  2. Fonepay QR Merchant & Mobile Wallet Display
                </h3>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Fonepay Merchant Name
                </label>
                <input
                  type="text"
                  value={bankForm.fonepayMerchantName}
                  onChange={(e) => setBankForm({ ...bankForm, fonepayMerchantName: e.target.value })}
                  placeholder="e.g. GENZICON FOUNDATION NEPAL"
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                  Fonepay QR Image URL
                </label>
                <input
                  type="text"
                  value={bankForm.fonepayQrImage}
                  onChange={(e) => setBankForm({ ...bankForm, fonepayQrImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    eSewa ID / Mobile Number
                  </label>
                  <input
                    type="text"
                    value={bankForm.esewaId}
                    onChange={(e) => setBankForm({ ...bankForm, esewaId: e.target.value })}
                    placeholder="9823000000"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Khalti ID / Mobile Number
                  </label>
                  <input
                    type="text"
                    value={bankForm.khaltiId}
                    onChange={(e) => setBankForm({ ...bankForm, khaltiId: e.target.value })}
                    placeholder="9823000000"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Preview Box for Bank Details */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d] mb-3 flex items-center gap-1.5 pb-2 border-b border-[#f0f3ff]">
                <span>Donate Page Bank Display Preview</span>
              </h3>

              <div className="bg-[#f0f3ff] p-4 border border-[#003c90]/20 space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#003c90]" />
                  <div>
                    <h4 className="font-bold text-sm text-[#111c2d]">{bankForm.bankName}</h4>
                    <p className="text-[11px] text-[#00743a] font-semibold">{bankForm.branch || 'Central Branch'}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#434653] pt-2 border-t border-[#003c90]/10">
                  <div>
                    <span className="text-[10px] uppercase text-[#737784] block">Account Name</span>
                    <strong className="text-[#111c2d]">{bankForm.accountName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#737784] block">Account Number</span>
                    <strong className="font-mono text-sm text-[#003c90]">{bankForm.accountNumber}</strong>
                  </div>
                  {bankForm.swiftCode && (
                    <div>
                      <span className="text-[10px] uppercase text-[#737784] block">SWIFT Code</span>
                      <span className="font-mono">{bankForm.swiftCode}</span>
                    </div>
                  )}
                </div>
              </div>

              {bankForm.fonepayQrImage && (
                <div className="mt-4 text-center p-3 bg-[#f9f9ff] border border-[#d8e3fb]">
                  <span className="text-[11px] font-bold text-[#111c2d] block mb-2">Fonepay QR Merchant</span>
                  <img
                    src={bankForm.fonepayQrImage}
                    alt="Fonepay QR"
                    className="w-36 h-36 mx-auto object-contain border border-white shadow-xs"
                  />
                  <span className="text-[10px] text-[#737784] block mt-1">{bankForm.fonepayMerchantName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

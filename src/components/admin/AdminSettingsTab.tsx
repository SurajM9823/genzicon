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
  Sparkles,
  Smartphone
} from 'lucide-react';
import { BankAndQrConfig, SiteSettingsConfig, Language } from '../../types';
import { DEFAULT_BANK_QR_CONFIG, DEFAULT_SITE_SETTINGS } from '../../data/mockData';
import { compressImage } from '../../utils/imageCompress';

interface AdminSettingsTabProps {
  language: Language;
  siteSettings: SiteSettingsConfig;
  onSaveSiteSettings: (settings: SiteSettingsConfig, logoFile?: File | null) => Promise<boolean | void>;
  bankQrConfig: BankAndQrConfig;
  onSaveBankQrConfig: (
    config: BankAndQrConfig,
    qrFiles?: {
      fonepayQrFile?: File | null;
      esewaQrFile?: File | null;
      khaltiQrFile?: File | null;
    }
  ) => Promise<void> | void;
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
  const [fonepayQrFile, setFonepayQrFile] = useState<File | null>(null);
  const [fonepayQrPreview, setFonepayQrPreview] = useState<string | null>(bankQrConfig.fonepayQrImage || null);
  const fonepayQrInputRef = useRef<HTMLInputElement>(null);

  const [esewaQrFile, setEsewaQrFile] = useState<File | null>(null);
  const [esewaQrPreview, setEsewaQrPreview] = useState<string | null>(bankQrConfig.esewaQrImage || null);
  const esewaQrInputRef = useRef<HTMLInputElement>(null);

  const [khaltiQrFile, setKhaltiQrFile] = useState<File | null>(null);
  const [khaltiQrPreview, setKhaltiQrPreview] = useState<string | null>(bankQrConfig.khaltiQrImage || null);
  const khaltiQrInputRef = useRef<HTMLInputElement>(null);

  const [previewTab, setPreviewTab] = useState<'bank' | 'esewa' | 'khalti'>('bank');

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
    if (!fonepayQrFile) setFonepayQrPreview(bankQrConfig.fonepayQrImage || null);
    if (!esewaQrFile) setEsewaQrPreview(bankQrConfig.esewaQrImage || null);
    if (!khaltiQrFile) setKhaltiQrPreview(bankQrConfig.khaltiQrImage || null);
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

  const handleFonepayQrFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 0.9);
      setFonepayQrFile(compressed);
      const reader = new FileReader();
      reader.onloadend = () => setFonepayQrPreview(reader.result as string);
      reader.readAsDataURL(compressed);
    } catch {
      setFonepayQrFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFonepayQrPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEsewaQrFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 0.9);
      setEsewaQrFile(compressed);
      const reader = new FileReader();
      reader.onloadend = () => setEsewaQrPreview(reader.result as string);
      reader.readAsDataURL(compressed);
    } catch {
      setEsewaQrFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setEsewaQrPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleKhaltiQrFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 0.9);
      setKhaltiQrFile(compressed);
      const reader = new FileReader();
      reader.onloadend = () => setKhaltiQrPreview(reader.result as string);
      reader.readAsDataURL(compressed);
    } catch {
      setKhaltiQrFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setKhaltiQrPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSaveSiteSettings(settingsForm, logoFile);
      await onSaveBankQrConfig(bankForm, {
        fonepayQrFile,
        esewaQrFile,
        khaltiQrFile,
      });
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
      setFonepayQrFile(null);
      setFonepayQrPreview(null);
      setEsewaQrFile(null);
      setEsewaQrPreview(null);
      setKhaltiQrFile(null);
      setKhaltiQrPreview(null);
      if (logoInputRef.current) logoInputRef.current.value = '';
      if (fonepayQrInputRef.current) fonepayQrInputRef.current.value = '';
      if (esewaQrInputRef.current) esewaQrInputRef.current.value = '';
      if (khaltiQrInputRef.current) khaltiQrInputRef.current.value = '';
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
                  className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white font-medium"
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

            {/* Section 2: Fonepay & Bank QR */}
            <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0f3ff]">
                <QrCode className="w-4 h-4 text-[#003c90]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                  2. Fonepay & Bank QR Code
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

              {/* Fonepay QR File Picker + URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Choose Fonepay QR (File)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fonepayQrInputRef}
                      onChange={handleFonepayQrFileChange}
                      accept="image/*"
                      className="hidden"
                      id="fonepay-qr-file-input"
                    />
                    <label
                      htmlFor="fonepay-qr-file-input"
                      className="cursor-pointer px-3 py-1.5 bg-[#e7eeff] hover:bg-[#d8e3fb] text-[#003c90] text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{fonepayQrFile ? 'Change File' : 'Choose Image'}</span>
                    </label>
                    {fonepayQrFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setFonepayQrFile(null);
                          setFonepayQrPreview(bankForm.fonepayQrImage || null);
                          if (fonepayQrInputRef.current) fonepayQrInputRef.current.value = '';
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {fonepayQrFile && (
                    <span className="text-[10px] text-[#00743a] font-medium block mt-1">
                      Selected: {fonepayQrFile.name} ({(fonepayQrFile.size / 1024).toFixed(0)} KB)
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Or Fonepay QR URL
                  </label>
                  <input
                    type="text"
                    value={bankForm.fonepayQrImage}
                    onChange={(e) => {
                      setBankForm({ ...bankForm, fonepayQrImage: e.target.value });
                      if (!fonepayQrFile) setFonepayQrPreview(e.target.value || null);
                    }}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: eSewa Gateway */}
            <div className="bg-white p-5 border border-emerald-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-emerald-100">
                <Smartphone className="w-4 h-4 text-[#00743a]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#00743a]">
                  3. eSewa Direct Wallet Details & QR Code
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    eSewa Registered Name
                  </label>
                  <input
                    type="text"
                    value={bankForm.esewaRegisteredName || bankForm.accountName}
                    onChange={(e) => setBankForm({ ...bankForm, esewaRegisteredName: e.target.value })}
                    placeholder="e.g. Genzicon Foundation Nepal"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#00743a] focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    eSewa ID / Mobile Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={bankForm.esewaId}
                    onChange={(e) => setBankForm({ ...bankForm, esewaId: e.target.value })}
                    placeholder="9823000000 / genzicon.esewa"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-mono font-bold text-[#00743a] focus:outline-none focus:border-[#00743a] focus:bg-white"
                  />
                </div>
              </div>

              {/* eSewa QR File Picker + URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Choose eSewa QR (File)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={esewaQrInputRef}
                      onChange={handleEsewaQrFileChange}
                      accept="image/*"
                      className="hidden"
                      id="esewa-qr-file-input"
                    />
                    <label
                      htmlFor="esewa-qr-file-input"
                      className="cursor-pointer px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#00743a] text-xs font-bold inline-flex items-center gap-1.5 transition-colors border border-emerald-200"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{esewaQrFile ? 'Change File' : 'Choose Image'}</span>
                    </label>
                    {esewaQrFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setEsewaQrFile(null);
                          setEsewaQrPreview(bankForm.esewaQrImage || null);
                          if (esewaQrInputRef.current) esewaQrInputRef.current.value = '';
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {esewaQrFile && (
                    <span className="text-[10px] text-[#00743a] font-medium block mt-1">
                      Selected: {esewaQrFile.name} ({(esewaQrFile.size / 1024).toFixed(0)} KB)
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Or eSewa QR URL
                  </label>
                  <input
                    type="text"
                    value={bankForm.esewaQrImage}
                    onChange={(e) => {
                      setBankForm({ ...bankForm, esewaQrImage: e.target.value });
                      if (!esewaQrFile) setEsewaQrPreview(e.target.value || null);
                    }}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#00743a] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Khalti Gateway */}
            <div className="bg-white p-5 border border-purple-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-purple-100">
                <Smartphone className="w-4 h-4 text-purple-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-800">
                  4. Khalti Wallet Details & QR Code
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Khalti Registered Name
                  </label>
                  <input
                    type="text"
                    value={bankForm.khaltiRegisteredName || bankForm.accountName}
                    onChange={(e) => setBankForm({ ...bankForm, khaltiRegisteredName: e.target.value })}
                    placeholder="e.g. Genzicon Foundation Nepal"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-purple-600 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Khalti ID / Mobile Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={bankForm.khaltiId}
                    onChange={(e) => setBankForm({ ...bankForm, khaltiId: e.target.value })}
                    placeholder="9823000000"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-mono font-bold text-purple-800 focus:outline-none focus:border-purple-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Khalti QR File Picker + URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Choose Khalti QR (File)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={khaltiQrInputRef}
                      onChange={handleKhaltiQrFileChange}
                      accept="image/*"
                      className="hidden"
                      id="khalti-qr-file-input"
                    />
                    <label
                      htmlFor="khalti-qr-file-input"
                      className="cursor-pointer px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors border border-purple-200"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{khaltiQrFile ? 'Change File' : 'Choose Image'}</span>
                    </label>
                    {khaltiQrFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setKhaltiQrFile(null);
                          setKhaltiQrPreview(bankForm.khaltiQrImage || null);
                          if (khaltiQrInputRef.current) khaltiQrInputRef.current.value = '';
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {khaltiQrFile && (
                    <span className="text-[10px] text-purple-700 font-medium block mt-1">
                      Selected: {khaltiQrFile.name} ({(khaltiQrFile.size / 1024).toFixed(0)} KB)
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Or Khalti QR URL
                  </label>
                  <input
                    type="text"
                    value={bankForm.khaltiQrImage}
                    onChange={(e) => {
                      setBankForm({ ...bankForm, khaltiQrImage: e.target.value });
                      if (!khaltiQrFile) setKhaltiQrPreview(e.target.value || null);
                    }}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-purple-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Donation Hotline */}
            <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0f3ff]">
                <Phone className="w-4 h-4 text-[#003c90]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                  5. Donation & Finance Hotline
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Hotline Phone
                  </label>
                  <input
                    type="text"
                    value={bankForm.hotlinePhone}
                    onChange={(e) => setBankForm({ ...bankForm, hotlinePhone: e.target.value })}
                    placeholder="+977 1-4240000 / 9823000000"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111c2d] uppercase mb-1">
                    Hotline Email
                  </label>
                  <input
                    type="email"
                    value={bankForm.hotlineEmail}
                    onChange={(e) => setBankForm({ ...bankForm, hotlineEmail: e.target.value })}
                    placeholder="donate@genzicon.org"
                    className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Preview Box for Donate Screen */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs sticky top-20">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d] mb-3 flex items-center justify-between pb-2 border-b border-[#f0f3ff]">
                <span>Donate Page Preview</span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200">Live Mirror</span>
              </h3>

              {/* Preview Tabs */}
              <div className="flex border border-[#d8e3fb] p-0.5 bg-[#f0f3ff] mb-4">
                <button
                  type="button"
                  onClick={() => setPreviewTab('bank')}
                  className={`flex-1 py-1.5 text-[11px] font-bold transition-all ${
                    previewTab === 'bank' ? 'bg-[#003c90] text-white shadow-xs' : 'text-[#434653] hover:text-[#003c90]'
                  }`}
                >
                  Bank Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('esewa')}
                  className={`flex-1 py-1.5 text-[11px] font-bold transition-all ${
                    previewTab === 'esewa' ? 'bg-[#00743a] text-white shadow-xs' : 'text-[#434653] hover:text-[#00743a]'
                  }`}
                >
                  eSewa
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('khalti')}
                  className={`flex-1 py-1.5 text-[11px] font-bold transition-all ${
                    previewTab === 'khalti' ? 'bg-purple-800 text-white shadow-xs' : 'text-[#434653] hover:text-purple-800'
                  }`}
                >
                  Khalti
                </button>
              </div>

              {/* PREVIEW: Bank Transfer */}
              {previewTab === 'bank' && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="bg-[#f0f3ff] p-3.5 border border-[#003c90]/20 space-y-2.5">
                    <div className="flex items-center gap-2 border-b border-[#003c90]/10 pb-2">
                      <Building2 className="w-4 h-4 text-[#003c90]" />
                      <div>
                        <h4 className="font-bold text-xs text-[#111c2d]">{bankForm.bankName || 'Bank Name'}</h4>
                        <p className="text-[10px] text-[#00743a] font-semibold">{bankForm.branch || 'Branch'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-[#434653]">
                      <div>
                        <span className="text-[9px] uppercase text-[#737784] block font-bold">Account Name</span>
                        <strong className="text-[#111c2d] text-[11px]">{bankForm.accountName}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-[#737784] block font-bold">Account Number</span>
                        <strong className="font-mono text-xs text-[#003c90]">{bankForm.accountNumber}</strong>
                      </div>
                      {bankForm.swiftCode && (
                        <div>
                          <span className="text-[9px] uppercase text-[#737784] block font-bold">SWIFT Code</span>
                          <span className="font-mono text-[11px]">{bankForm.swiftCode}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center p-3 bg-white border border-[#d8e3fb]">
                    <span className="text-[11px] font-bold text-[#003c90] block mb-2">Fonepay / Banking QR</span>
                    {fonepayQrPreview ? (
                      <img
                        src={fonepayQrPreview}
                        alt="Fonepay QR"
                        className="w-32 h-32 mx-auto object-contain border border-[#d8e3fb] p-1 bg-white"
                      />
                    ) : (
                      <div className="w-32 h-32 mx-auto bg-gray-100 flex items-center justify-center border border-dashed border-gray-300 text-gray-400 text-xs">
                        No QR Image
                      </div>
                    )}
                    <span className="text-[10px] text-[#737784] block mt-1">{bankForm.fonepayMerchantName}</span>
                  </div>
                </div>
              )}

              {/* PREVIEW: eSewa */}
              {previewTab === 'esewa' && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="bg-emerald-50/70 p-3.5 border border-emerald-200 space-y-2.5">
                    <div className="flex items-center gap-2 border-b border-emerald-100 pb-2">
                      <Smartphone className="w-4 h-4 text-[#00743a]" />
                      <h4 className="font-bold text-xs text-[#00743a]">eSewa Direct Wallet</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-[#434653]">
                      <div>
                        <span className="text-[9px] uppercase text-[#737784] block font-bold">Registered Name</span>
                        <strong className="text-[#111c2d] text-[11px]">{bankForm.esewaRegisteredName || bankForm.accountName}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-[#737784] block font-bold">eSewa ID</span>
                        <strong className="font-mono text-xs text-[#00743a]">{bankForm.esewaId}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-center p-3 bg-white border border-emerald-200">
                    <span className="text-[11px] font-bold text-[#00743a] block mb-2">eSewa Scan & Pay QR</span>
                    {esewaQrPreview ? (
                      <img
                        src={esewaQrPreview}
                        alt="eSewa QR"
                        className="w-32 h-32 mx-auto object-contain border border-emerald-200 p-1 bg-white"
                      />
                    ) : (
                      <div className="w-32 h-32 mx-auto bg-gray-100 flex items-center justify-center border border-dashed border-gray-300 text-gray-400 text-xs">
                        No QR Image
                      </div>
                    )}
                    <span className="text-[10px] text-[#737784] block mt-1">{bankForm.esewaRegisteredName || bankForm.accountName}</span>
                  </div>
                </div>
              )}

              {/* PREVIEW: Khalti */}
              {previewTab === 'khalti' && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="bg-purple-50/70 p-3.5 border border-purple-200 space-y-2.5">
                    <div className="flex items-center gap-2 border-b border-purple-100 pb-2">
                      <Smartphone className="w-4 h-4 text-purple-700" />
                      <h4 className="font-bold text-xs text-purple-800">Khalti Wallet Transfer</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-[#434653]">
                      <div>
                        <span className="text-[9px] uppercase text-[#737784] block font-bold">Registered Name</span>
                        <strong className="text-[#111c2d] text-[11px]">{bankForm.khaltiRegisteredName || bankForm.accountName}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-[#737784] block font-bold">Khalti ID</span>
                        <strong className="font-mono text-xs text-purple-800">{bankForm.khaltiId}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-center p-3 bg-white border border-purple-200">
                    <span className="text-[11px] font-bold text-purple-800 block mb-2">Khalti Scan & Pay QR</span>
                    {khaltiQrPreview ? (
                      <img
                        src={khaltiQrPreview}
                        alt="Khalti QR"
                        className="w-32 h-32 mx-auto object-contain border border-purple-200 p-1 bg-white"
                      />
                    ) : (
                      <div className="w-32 h-32 mx-auto bg-gray-100 flex items-center justify-center border border-dashed border-gray-300 text-gray-400 text-xs">
                        No QR Image
                      </div>
                    )}
                    <span className="text-[10px] text-[#737784] block mt-1">{bankForm.khaltiRegisteredName || bankForm.accountName}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw,
  Eye,
  Layers,
  Upload,
  Play,
  Film,
  Compass
} from 'lucide-react';
import { SiteContentConfig, Language, StatMetric } from '../../types';
import { DEFAULT_SITE_CONTENT } from '../../data/mockData';
import { HeroMediaRenderer, isRiveMedia } from '../HeroMediaRenderer';

interface AdminContentTabProps {
  language: Language;
  siteContent: SiteContentConfig;
  onSaveContent: (newContent: SiteContentConfig) => void;
}

export const AdminContentTab: React.FC<AdminContentTabProps> = ({
  language,
  siteContent,
  onSaveContent
}) => {
  const isNp = language === 'np';
  const [formData, setFormData] = useState<SiteContentConfig>(() => ({
    ...DEFAULT_SITE_CONTENT,
    ...siteContent,
    heroCarouselImages: siteContent.heroCarouselImages || siteContent.heroImages || DEFAULT_SITE_CONTENT.heroCarouselImages || [],
    impactStats: siteContent.impactStats || DEFAULT_SITE_CONTENT.impactStats || [],
  }));
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      ...DEFAULT_SITE_CONTENT,
      ...prev,
      ...siteContent,
      heroCarouselImages: siteContent.heroCarouselImages || siteContent.heroImages || prev.heroCarouselImages || DEFAULT_SITE_CONTENT.heroCarouselImages || [],
      impactStats: siteContent.impactStats || prev.impactStats || DEFAULT_SITE_CONTENT.impactStats || [],
    }));
  }, [siteContent]);

  // Curated Nepali NGO imagery and interactive Rive animation presets
  const presetMedia = [
    {
      title: 'Clothes Distribution in Village',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80'
    },
    {
      title: 'Chure Reforestation & Green Nepal',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80'
    },
    {
      title: 'Youth & Children Education',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80'
    },
    {
      title: 'Women Sewing & Livelihood Training',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80'
    },
    {
      title: 'Himalayan Mountain Community Support',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=80'
    },
    {
      title: '✨ Rive Community Interactive Animation',
      type: 'rive',
      url: 'https://rive.app/s/eA3509dM50mYp49u_2gZ_A/embed'
    }
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleStatChange = (index: number, field: keyof StatMetric, value: string) => {
    const updatedStats = [...formData.impactStats];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: value
    };
    setFormData({ ...formData, impactStats: updatedStats });
  };

  const handleAddCarouselImage = () => {
    if (!customImageUrl.trim()) return;
    const cleanUrl = customImageUrl.trim();
    if (formData.heroCarouselImages.includes(cleanUrl)) return;
    
    setFormData({
      ...formData,
      heroCarouselImages: [...formData.heroCarouselImages, cleanUrl],
      heroImageUrl: cleanUrl
    });
    setCustomImageUrl('');
  };

  /**
   * Smart client-side photo upload & compression:
   * Downscales large smartphone/DSLR photos (e.g. 10MB-30MB) using HTML5 canvas
   * to high-quality ~1600px JPEG (~250KB) so it never triggers "413 Request Entity Too Large"
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1600;
        const maxHeight = 1000;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setFormData(prev => ({
            ...prev,
            heroCarouselImages: [...(prev.heroCarouselImages || []), compressedDataUrl],
            heroImageUrl: compressedDataUrl
          }));
        }
        setIsUploading(false);
      };

      img.onerror = () => {
        setIsUploading(false);
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveCarouselImage = (indexToRemove: number) => {
    const updated = formData.heroCarouselImages.filter((_, idx) => idx !== indexToRemove);
    // If the active hero image was removed, fallback to first available
    let newHero = formData.heroImageUrl;
    if (formData.heroImageUrl === formData.heroCarouselImages[indexToRemove]) {
      newHero = updated[0] || DEFAULT_SITE_CONTENT.heroImageUrl;
    }
    setFormData({
      ...formData,
      heroCarouselImages: updated,
      heroImageUrl: newHero
    });
  };

  const handleSelectActiveHero = (url: string) => {
    setFormData({
      ...formData,
      heroImageUrl: url
    });
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all hero and impact stat values back to standard defaults?')) {
      setFormData(DEFAULT_SITE_CONTENT);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveContent(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Action Header with Save Status */}
      <div className="bg-white p-4 sm:p-5 border border-[#d8e3fb] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#111c2d] font-heading">
            {isNp ? 'गृहपृष्ठ सामग्री तथा ब्यानर व्यवस्थापन' : 'Hero Carousel & Static Content CMS'}
          </h2>
          <p className="text-xs text-[#737784]">
            Update homepage carousel images, Rive interactive animations, hero titles, descriptions, and verified impact stat counters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveToast && (
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved Live to Website!</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-2 bg-[#f9f9ff] hover:bg-[#f0f3ff] text-[#434653] text-xs font-bold transition-colors border border-[#d8e3fb] flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-[#00743a] hover:bg-[#005227] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Publish Live</span>
          </button>
        </div>
      </div>

      {/* Section 1: Hero / Carousel Images & Rive Animations */}
      <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#f0f3ff] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#003c90] text-white flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                1. Hero Background & Carousel Media (Photos & Rive Animations)
              </h3>
              <p className="text-[11px] text-[#737784]">
                Choose the primary hero banner, upload photos directly from your device, or embed interactive 60fps Rive animations.
              </p>
            </div>
          </div>
        </div>

        {/* Current Active Hero Preview */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider">
              Active Display Hero Banner Preview
            </label>
            
            {/* Image Framing & Fit Mode Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-[#737784] uppercase">Framing Mode:</span>
              <select
                value={formData.heroImageFit || 'cover'}
                onChange={(e) => setFormData({ ...formData, heroImageFit: e.target.value as any })}
                className="text-[11px] font-bold px-2.5 py-1 border border-[#003c90] bg-white text-[#003c90] rounded-none focus:outline-none shadow-xs"
              >
                <option value="cover">📐 Smart Top-Center Fill (Standard)</option>
                <option value="top">👤 Focus Top (Keep Heads & Faces in View)</option>
                <option value="ambient">✨ Smart Ambient Frame (100% Full Photo - No Crop)</option>
                <option value="contain">🖼️ Fit Inside Banner (Contain)</option>
                <option value="bottom">⚓ Focus Bottom</option>
              </select>
            </div>
          </div>

          <div className="relative h-64 w-full border-2 border-[#003c90] overflow-hidden group bg-slate-900">
            <HeroMediaRenderer
              mediaUrl={formData.heroImageUrl}
              alt="Active Hero Preview"
              className="w-full h-full"
              fitMode={formData.heroImageFit || 'cover'}
              interactive={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 p-4 flex flex-col justify-end text-white pointer-events-none">
              <div className="flex items-center gap-2 mb-1">
                <div className="inline-block px-2 py-0.5 bg-[#00743a] text-[10px] font-bold uppercase tracking-wider w-fit">
                  Active Live Hero Media
                </div>
                <div className="inline-block px-2 py-0.5 bg-black/60 backdrop-blur-sm text-[10px] font-mono text-white/90">
                  Fit: {formData.heroImageFit || 'cover'}
                </div>
              </div>
              <h3 className="text-base font-bold font-heading">{formData.heroTitle}</h3>
              <p className="text-xs text-white/80 line-clamp-1">{formData.heroSubtitle}</p>
            </div>
          </div>
        </div>

        {/* Image Pool / Carousel Thumbnails */}
        <div>
          <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-2">
            Carousel Media Pool ({formData.heroCarouselImages?.length || 0} Items) - Click to set as Active Banner
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(formData.heroCarouselImages || []).map((imgUrl, index) => {
              const isSelected = formData.heroImageUrl === imgUrl;
              const isRive = isRiveMedia(imgUrl);
              return (
                <div 
                  key={index}
                  className={`relative border-2 rounded-none overflow-hidden group transition-all bg-slate-900 ${
                    isSelected ? 'border-[#003c90] ring-2 ring-blue-200' : 'border-[#d8e3fb] hover:border-[#737784]'
                  }`}
                >
                  <div 
                    className="w-full h-24 overflow-hidden cursor-pointer relative"
                    onClick={() => handleSelectActiveHero(imgUrl)}
                  >
                    <HeroMediaRenderer
                      mediaUrl={imgUrl}
                      alt={`Carousel media ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                    {isRive && (
                      <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-purple-600 text-white text-[9px] font-bold shadow-xs">
                        RIVE
                      </span>
                    )}
                  </div>
                  <div className="p-1.5 bg-[#f9f9ff] flex items-center justify-between text-[10px]">
                    <button
                      type="button"
                      onClick={() => handleSelectActiveHero(imgUrl)}
                      className={`font-bold ${isSelected ? 'text-[#003c90]' : 'text-[#737784] hover:text-[#003c90]'}`}
                    >
                      {isSelected ? '✓ Active Hero' : 'Select Hero'}
                    </button>
                    {(formData.heroCarouselImages || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCarouselImage(index)}
                        className="text-red-600 hover:text-red-800 p-0.5"
                        title="Remove from Carousel"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add New Custom Image URL, Photo Upload & Rive Presets */}
        <div className="pt-3 border-t border-[#f0f3ff] space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider">
              Add Photo File or Rive / Media URL
            </label>
            <span className="text-[10px] text-[#737784]">
              Supports: Direct Photo Upload, Rive URLs (<code className="font-mono bg-slate-100 px-1">rive.app/s/...</code>), and Image CDN links.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {/* Direct Device Upload with auto-optimization */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-[#00743a] hover:bg-[#005227] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Optimizing...' : 'Upload Photo from Device'}</span>
            </button>

            {/* Custom URL Input */}
            <div className="flex flex-1 gap-2">
              <input
                type="text"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="Paste Image URL or Rive Share Link (e.g. https://rive.app/s/...)"
                className="flex-1 px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white font-mono"
              />
              <button
                type="button"
                onClick={handleAddCarouselImage}
                className="px-4 py-2 bg-[#003c90] hover:bg-[#002660] text-white text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Media</span>
              </button>
            </div>
          </div>

          {/* Quick Presets Picker */}
          <div>
            <span className="text-[10px] font-bold text-[#737784] uppercase tracking-wider block mb-1.5">
              Or pick from curated Nepal NGO stock photos & Rive animations:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presetMedia.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (!formData.heroCarouselImages.includes(preset.url)) {
                      setFormData({
                        ...formData,
                        heroCarouselImages: [...formData.heroCarouselImages, preset.url],
                        heroImageUrl: preset.url
                      });
                    } else {
                      handleSelectActiveHero(preset.url);
                    }
                  }}
                  className={`px-2.5 py-1 text-[11px] font-semibold border transition-colors ${
                    preset.type === 'rive'
                      ? 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'
                      : 'bg-[#f0f3ff] hover:bg-[#d8e3fb] text-[#003c90] border-blue-200'
                  }`}
                >
                  + {preset.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Hero Titles & Descriptions (EN & NP) */}
      <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-4">
        <div className="border-b border-[#f0f3ff] pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
            2. Hero Headline, Subtitle & Badge Copy
          </h3>
          <p className="text-[11px] text-[#737784]">
            Manage the primary headline and short mission summary displayed directly above the action buttons.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
              Hero Title (English)
            </label>
            <input
              type="text"
              required
              value={formData.heroTitle}
              onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-bold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
              Hero Title (नेपाली)
            </label>
            <input
              type="text"
              required
              value={formData.heroTitleNp}
              onChange={(e) => setFormData({ ...formData, heroTitleNp: e.target.value })}
              className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs font-bold text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
              Hero Short Description (English)
            </label>
            <textarea
              rows={2}
              value={formData.heroSubtitle}
              onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
              Hero Short Description (नेपाली)
            </label>
            <textarea
              rows={2}
              value={formData.heroSubtitleNp}
              onChange={(e) => setFormData({ ...formData, heroSubtitleNp: e.target.value })}
              className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white leading-relaxed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
              Hero Tag Badge (English)
            </label>
            <input
              type="text"
              value={formData.heroBannerTag}
              onChange={(e) => setFormData({ ...formData, heroBannerTag: e.target.value })}
              className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1">
              Hero Tag Badge (नेपाली)
            </label>
            <input
              type="text"
              value={formData.heroBannerTagNp}
              onChange={(e) => setFormData({ ...formData, heroBannerTagNp: e.target.value })}
              className="w-full px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Static Impact Counter Numbers & Labels */}
      <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-4">
        <div className="border-b border-[#f0f3ff] pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
            3. Verified Impact Counters & Statistics (4 Core Cards Below Carousel)
          </h3>
          <p className="text-[11px] text-[#737784]">
            Update verified counter numbers (e.g. 142,500+ Garments, 86,000+ Trees), bilingual titles, and descriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(formData.impactStats || []).map((stat, index) => (
            <div key={stat.id} className="p-4 bg-[#f9f9ff] border border-[#d8e3fb] space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#e7eeff]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#003c90]">
                  Card #{index + 1}: {stat.id.toUpperCase()}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-[#737784]">Theme:</span>
                  <select
                    value={stat.color || 'primary'}
                    onChange={(e) => handleStatChange(index, 'color', e.target.value as 'primary' | 'secondary')}
                    className="text-[10px] font-bold px-2 py-0.5 border border-[#d8e3fb] bg-white text-[#111c2d] focus:outline-none"
                  >
                    <option value="primary">Blue (Primary)</option>
                    <option value="secondary">Green (Secondary)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#737784] uppercase mb-0.5">
                    Metric Value (Number)
                  </label>
                  <input
                    type="text"
                    required
                    value={stat.number}
                    onChange={(e) => handleStatChange(index, 'number', e.target.value)}
                    placeholder="e.g. 142,500+"
                    className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-white text-xs font-bold text-[#003c90] font-mono focus:outline-none focus:border-[#003c90]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#737784] uppercase mb-0.5">
                    Label (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={stat.label}
                    onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                    placeholder="e.g. Garments Distributed"
                    className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-white text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#737784] uppercase mb-0.5">
                  Label in Nepali (नेपाली शीर्षक)
                </label>
                <input
                  type="text"
                  value={stat.labelNp || ''}
                  onChange={(e) => handleStatChange(index, 'labelNp', e.target.value)}
                  placeholder="e.g. संकलित तथा वितरित कपडा"
                  className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-white text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#737784] uppercase mb-0.5">
                    Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={stat.description || ''}
                    onChange={(e) => handleStatChange(index, 'description', e.target.value)}
                    placeholder="e.g. Wearable clothes collected, sorted, cleaned, and handed over to families in need across Nepal."
                    className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-white text-[11px] text-[#434653] focus:outline-none focus:border-[#003c90]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#737784] uppercase mb-0.5">
                    Description (नेपाली विवरण)
                  </label>
                  <textarea
                    rows={2}
                    value={stat.descriptionNp || ''}
                    onChange={(e) => handleStatChange(index, 'descriptionNp', e.target.value)}
                    placeholder="e.g. नेपालभरिका विपन्न परिवार, बालबालिका तथा वृद्धवृद्धालाई निःशुल्क वितरित उपयोगी कपडा।"
                    className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-white text-[11px] text-[#434653] focus:outline-none focus:border-[#003c90]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="p-4 bg-white border border-[#d8e3fb] flex items-center justify-between">
        <span className="text-xs text-[#737784]">
          Changes will immediately take effect across all user browsers and home screen sections.
        </span>
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#00743a] hover:bg-[#005227] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Live Changes</span>
        </button>
      </div>
    </form>
  );
};

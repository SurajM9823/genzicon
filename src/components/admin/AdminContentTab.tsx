import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw,
  Eye,
  Layers
} from 'lucide-react';
import { SiteContentConfig, Language, StatMetric } from '../../types';
import { DEFAULT_SITE_CONTENT } from '../../data/mockData';

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

  // Curated Nepali NGO imagery presets
  const presetImages = [
    {
      title: 'Clothes Distribution in Village',
      url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80'
    },
    {
      title: 'Chure Reforestation & Green Nepal',
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80'
    },
    {
      title: 'Youth & Children Education',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80'
    },
    {
      title: 'Women Sewing & Livelihood Training',
      url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80'
    },
    {
      title: 'Himalayan Mountain Community Support',
      url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=80'
    }
  ];

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
    if (formData.heroCarouselImages.includes(customImageUrl.trim())) return;
    
    setFormData({
      ...formData,
      heroCarouselImages: [...formData.heroCarouselImages, customImageUrl.trim()]
    });
    setCustomImageUrl('');
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
            Update homepage carousel images, hero titles, descriptions, and verified impact stat counters.
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

      {/* Section 1: Hero / Carousel Images */}
      <div className="bg-white p-5 border border-[#d8e3fb] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#f0f3ff] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#003c90] text-white flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111c2d]">
                1. Hero Background & Carousel Banner Images
              </h3>
              <p className="text-[11px] text-[#737784]">
                Choose the primary hero banner image and maintain the photo carousel pool.
              </p>
            </div>
          </div>
        </div>

        {/* Current Active Hero Preview */}
        <div>
          <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-1.5">
            Active Display Hero Banner
          </label>
          <div className="relative h-48 w-full border-2 border-[#003c90] overflow-hidden group">
            <img
              src={formData.heroImageUrl}
              alt="Active Hero Preview"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 p-4 flex flex-col justify-end text-white">
              <div className="inline-block px-2 py-0.5 bg-[#00743a] text-[10px] font-bold uppercase tracking-wider w-fit mb-1">
                Active Live Hero Image
              </div>
              <h3 className="text-base font-bold font-heading">{formData.heroTitle}</h3>
              <p className="text-xs text-white/80 line-clamp-1">{formData.heroSubtitle}</p>
            </div>
          </div>
        </div>

        {/* Image Pool / Carousel Thumbnails */}
        <div>
          <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider mb-2">
            Carousel Image Pool (Click any image to set as Active Banner)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(formData.heroCarouselImages || []).map((imgUrl, index) => {
              const isSelected = formData.heroImageUrl === imgUrl;
              return (
                <div 
                  key={index}
                  className={`relative border-2 rounded-none overflow-hidden group transition-all ${
                    isSelected ? 'border-[#003c90] ring-2 ring-blue-200' : 'border-[#d8e3fb] hover:border-[#737784]'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Carousel banner ${index + 1}`}
                    className="w-full h-24 object-cover cursor-pointer"
                    onClick={() => handleSelectActiveHero(imgUrl)}
                  />
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

        {/* Add New Custom Image URL & Presets */}
        <div className="pt-3 border-t border-[#f0f3ff] space-y-3">
          <label className="block text-[11px] font-bold text-[#111c2d] uppercase tracking-wider">
            Add New Image to Carousel
          </label>
          
          <div className="flex gap-2">
            <input
              type="url"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              placeholder="Paste direct image URL (https://images.unsplash.com/...)"
              className="flex-1 px-3 py-2 border border-[#d8e3fb] bg-[#f9f9ff] text-xs text-[#111c2d] focus:outline-none focus:border-[#003c90] focus:bg-white font-mono"
            />
            <button
              type="button"
              onClick={handleAddCarouselImage}
              className="px-4 py-2 bg-[#003c90] hover:bg-[#002660] text-white text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Image</span>
            </button>
          </div>

          {/* Quick Presets Picker */}
          <div>
            <span className="text-[10px] font-bold text-[#737784] uppercase tracking-wider block mb-1.5">
              Or pick from curated Nepal NGO stock presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presetImages.map((preset, idx) => (
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
                  className="px-2.5 py-1 text-[11px] bg-[#f0f3ff] hover:bg-[#d8e3fb] text-[#003c90] font-semibold border border-blue-200 transition-colors"
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
            3. Verified Impact Counters & Statistics (4 Core Stats)
          </h3>
          <p className="text-[11px] text-[#737784]">
            Update verified numbers (e.g. 142,500+ Garments, 86,000+ Trees) and supporting explanation text.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(formData.impactStats || []).map((stat, index) => (
            <div key={stat.id} className="p-4 bg-[#f9f9ff] border border-[#d8e3fb] space-y-2.5">
              <div className="flex items-center justify-between pb-1 border-b border-[#e7eeff]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#003c90]">
                  Pillar Metric #{index + 1} ({stat.id})
                </span>
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
                    className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-white text-xs font-bold text-[#003c90] font-mono focus:outline-none focus:border-[#003c90]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#737784] uppercase mb-0.5">
                    Metric Label (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={stat.label}
                    onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-white text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#737784] uppercase mb-0.5">
                  Metric Label (नेपाली)
                </label>
                <input
                  type="text"
                  value={stat.labelNp || ''}
                  onChange={(e) => handleStatChange(index, 'labelNp', e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-white text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#003c90]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#737784] uppercase mb-0.5">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={stat.description || ''}
                  onChange={(e) => handleStatChange(index, 'description', e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#d8e3fb] bg-white text-[11px] text-[#434653] focus:outline-none focus:border-[#003c90]"
                />
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

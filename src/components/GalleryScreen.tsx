import React, { useState } from 'react';
import { Play, Image as ImageIcon, Video, MapPin, Calendar, X } from 'lucide-react';
import { GALLERY_ITEMS_DATA } from '../data/mockData';
import { Language, GalleryMedia } from '../types';

interface GalleryScreenProps {
  language: Language;
}

export const GalleryScreen: React.FC<GalleryScreenProps> = ({ language }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [activeMediaItem, setActiveMediaItem] = useState<GalleryMedia | null>(null);

  const isNp = language === 'np';

  const categories = ['All', 'Education', 'Clean Water', 'Healthcare', 'Disaster Relief', 'Agriculture & Environment'];

  const filteredItems = GALLERY_ITEMS_DATA.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesType = mediaTypeFilter === 'all' || item.type === mediaTypeFilter;
    return matchesCat && matchesType;
  });

  return (
    <div id="gallery-screen" className="w-full pt-16 pb-12 bg-[#f9f9ff]">
      {/* Header */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-6">
        <div className="border-b border-[#d8e3fb] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#003c90] block mb-0.5">
                {isNp ? 'फिल्ड मिडिया तथा भिडियो' : 'Media Gallery'}
              </span>
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111c2d]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {isNp ? 'फिल्ड तस्बिर तथा भिडियो रिल्स' : 'Field Photos & Videos'}
              </h1>
            </div>
            <p className="text-xs text-[#434653] max-w-md">
              {isNp
                ? 'कर्णाली, मधेस तथा पहाडी जिल्लाहरूमा सञ्चालित परियोजनाका वास्तविक तस्बिर र भिडियोहरू।'
                : 'Real on-ground footage and photos documenting project completion and community handovers.'}
            </p>
          </div>
        </div>

        {/* Filters Controls */}
        <div className="mt-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
          {/* Media Type Toggle */}
          <div className="inline-flex bg-white border border-[#d8e3fb] rounded-none sm:rounded-xs">
            <button
              onClick={() => setMediaTypeFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                mediaTypeFilter === 'all' ? 'bg-[#003c90] text-white' : 'text-[#434653]'
              }`}
            >
              {isNp ? 'सबै' : 'All'}
            </button>
            <button
              onClick={() => setMediaTypeFilter('photo')}
              className={`px-3 py-1.5 text-xs font-bold flex items-center gap-1 transition-colors ${
                mediaTypeFilter === 'photo' ? 'bg-[#003c90] text-white' : 'text-[#434653]'
              }`}
            >
              <ImageIcon className="w-3 h-3" />
              <span>{isNp ? 'तस्बिर' : 'Photos'}</span>
            </button>
            <button
              onClick={() => setMediaTypeFilter('video')}
              className={`px-3 py-1.5 text-xs font-bold flex items-center gap-1 transition-colors ${
                mediaTypeFilter === 'video' ? 'bg-[#003c90] text-white' : 'text-[#434653]'
              }`}
            >
              <Video className="w-3 h-3" />
              <span>{isNp ? 'भिडियो' : 'Videos'}</span>
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors rounded-none sm:rounded-xs ${
                  selectedCategory === cat
                    ? 'bg-[#00743a] text-white'
                    : 'bg-white text-[#434653] border border-[#d8e3fb] hover:border-[#00743a]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveMediaItem(item)}
              className="group bg-white rounded-none sm:rounded-xs border border-[#d8e3fb] overflow-hidden cursor-pointer flex flex-col hover:border-[#003c90] transition-colors"
            >
              {/* Media Preview Box */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Badge for Type */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider bg-black/75 text-white">
                    {item.category}
                  </span>
                </div>

                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-none bg-[#00743a] text-white flex items-center justify-center shadow-xs">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Bottom Meta */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <div className="flex items-center justify-between text-[10px] text-white/80 mb-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white line-clamp-1">
                    {isNp && item.titleNp ? item.titleNp : item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Video Modal */}
      {activeMediaItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-none sm:rounded-xs max-w-2xl w-full overflow-hidden shadow-2xl border border-[#d8e3fb] p-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0f3ff] mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#003c90]">
                  {activeMediaItem.category} • {activeMediaItem.location}
                </span>
                <h3 className="text-sm font-bold text-[#111c2d]">
                  {isNp && activeMediaItem.titleNp ? activeMediaItem.titleNp : activeMediaItem.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveMediaItem(null)}
                className="w-6 h-6 rounded-none bg-[#f0f3ff] text-[#434653] flex items-center justify-center hover:bg-[#e7eeff] font-bold text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative h-64 sm:h-80 bg-black rounded-none overflow-hidden mb-3">
              <img
                src={activeMediaItem.thumbnailUrl}
                alt={activeMediaItem.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <p className="text-xs text-[#434653] leading-relaxed mb-3">
              {isNp && activeMediaItem.descriptionNp ? activeMediaItem.descriptionNp : activeMediaItem.description}
            </p>

            <div className="flex justify-end pt-2 border-t border-[#f0f3ff]">
              <button
                onClick={() => setActiveMediaItem(null)}
                className="px-4 py-1.5 bg-[#003c90] text-white text-xs font-bold uppercase tracking-wider rounded-none sm:rounded-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

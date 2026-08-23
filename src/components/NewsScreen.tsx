import React, { useState } from 'react';
import { Newspaper, Calendar, ArrowRight, User } from 'lucide-react';
import { NEWS_ARTICLES_DATA } from '../data/mockData';
import { NewsArticle, Language } from '../types';

interface NewsScreenProps {
  language: Language;
}

export const NewsScreen: React.FC<NewsScreenProps> = ({ language }) => {
  const isNp = language === 'np';
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Field Reports', 'Transparency', 'Disaster Relief', 'Tech & Education', 'Environment'];

  const filteredNews = NEWS_ARTICLES_DATA.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  return (
    <div id="news-screen" className="w-full pt-16 pb-12 bg-[#f9f9ff]">
      {/* Header */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-6">
        <div className="border-b border-[#d8e3fb] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#003c90] block mb-0.5">
                {isNp ? 'समाचार तथा अपडेट' : 'News & Field Updates'}
              </span>
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111c2d]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {isNp ? 'फिल्ड प्रतिवेदन तथा ताजा समाचार' : 'Field Stories & Reports'}
              </h1>
            </div>
            <p className="text-xs text-[#434653] max-w-md">
              {isNp
                ? 'स्वयंसेवक तथा प्राविधिकहरूले फिल्डबाट पठाएका ताजा गतिविधि र सूचना।'
                : 'Audited field disclosures, emergency dispatch notes, and community updates.'}
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-none sm:rounded-xs text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#003c90] text-white'
                  : 'bg-white text-[#434653] border border-[#d8e3fb] hover:border-[#003c90]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNews.map((article) => (
            <article
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-white rounded-none sm:rounded-xs overflow-hidden border border-[#d8e3fb] flex flex-col group cursor-pointer hover:border-[#003c90] transition-colors"
            >
              <div className="h-44 overflow-hidden relative bg-slate-100">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-none">
                  {article.category}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-[#737784] mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {article.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {article.author}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#111c2d] mb-1.5 group-hover:text-[#003c90] transition-colors line-clamp-1">
                    {isNp && article.titleNp ? article.titleNp : article.title}
                  </h3>

                  <p className="text-xs text-[#434653] line-clamp-2 leading-relaxed mb-3">
                    {isNp
                      ? article.summaryNp || article.excerptNp || article.summary || article.excerpt
                      : article.summary || article.excerpt}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[#f0f3ff] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#003c90] flex items-center gap-1">
                    <span>{isNp ? 'पढ्नुहोस्' : 'Read Story'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-none sm:rounded-xs max-w-xl w-full max-h-[85vh] overflow-y-auto p-5 shadow-lg border border-[#d8e3fb]">
            <div className="flex justify-between items-center pb-3 border-b border-[#f0f3ff] mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#003c90] bg-[#e7eeff] px-2 py-0.5 rounded-none">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-6 h-6 rounded-none bg-[#f0f3ff] text-[#434653] flex items-center justify-center hover:bg-[#e7eeff] font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="h-48 rounded-none overflow-hidden mb-4">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <h2 className="text-base font-bold text-[#111c2d] mb-2 font-heading">
              {isNp && selectedArticle.titleNp ? selectedArticle.titleNp : selectedArticle.title}
            </h2>

            <div className="flex items-center gap-3 text-xs text-[#737784] mb-3 pb-2 border-b border-[#f0f3ff]">
              <span>{selectedArticle.date}</span>
              <span>•</span>
              <span>By {selectedArticle.author}</span>
            </div>

            <div className="text-xs text-[#434653] leading-relaxed space-y-2">
              <p>
                {isNp
                  ? selectedArticle.contentNp || selectedArticle.content || selectedArticle.summary
                  : selectedArticle.content || selectedArticle.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#f0f3ff] flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
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

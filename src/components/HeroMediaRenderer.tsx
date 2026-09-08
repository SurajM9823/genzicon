import React, { useEffect, useRef } from 'react';

export type ImageFitMode = 'ambient' | 'cover' | 'top' | 'bottom' | 'contain';

interface HeroMediaRendererProps {
  mediaUrl?: string;
  alt?: string;
  className?: string;
  interactive?: boolean;
  fitMode?: ImageFitMode;
}

/**
 * Normalizes Rive URLs to embeddable formats:
 * - https://rive.app/s/<id>/ -> https://rive.app/s/<id>/embed
 * - https://rive.app/community/<id>-<slug>/ -> https://rive.app/community/<id>-<slug>/embed
 * - Extracts src from <iframe src="...">
 */
export function parseRiveEmbedUrl(url?: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // If user pasted full <iframe ... src="..." ...> tag
  if (trimmed.toLowerCase().includes('<iframe')) {
    const match = trimmed.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      return match[1];
    }
  }

  // If it's a Rive share URL
  if (trimmed.includes('rive.app/s/') || trimmed.includes('rive.app/community/')) {
    if (trimmed.includes('/embed')) {
      return trimmed;
    }
    // Append /embed cleanly
    const cleaned = trimmed.replace(/\/+$/, '');
    return `${cleaned}/embed`;
  }

  return null;
}

export function isRiveMedia(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.trim().toLowerCase();
  return (
    lower.includes('rive.app/s/') ||
    lower.includes('rive.app/community/') ||
    lower.endsWith('.riv') ||
    lower.includes('.riv?') ||
    (lower.includes('<iframe') && lower.includes('rive.app'))
  );
}

export function isDirectRivFile(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.trim().toLowerCase();
  return lower.endsWith('.riv') || lower.includes('.riv?');
}

export function isVideoMedia(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.trim().toLowerCase();
  return (
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.ogg') ||
    lower.includes('.mp4?') ||
    lower.includes('.webm?')
  );
}

export const HeroMediaRenderer: React.FC<HeroMediaRendererProps> = ({
  mediaUrl,
  alt = 'Genzicon Hero Media',
  className = 'w-full h-full object-cover',
  interactive = false,
  fitMode = 'cover',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trimmedUrl = (mediaUrl || '').trim();

  // 1. Direct .riv binary file handling via @rive-app/canvas
  useEffect(() => {
    if (!isDirectRivFile(trimmedUrl) || !canvasRef.current) return;

    let riveInstance: any = null;
    let isCancelled = false;

    import('@rive-app/canvas')
      .then(({ Rive, Layout, Fit, Alignment }) => {
        if (isCancelled || !canvasRef.current) return;
        try {
          riveInstance = new Rive({
            src: trimmedUrl,
            canvas: canvasRef.current,
            autoplay: true,
            layout: new Layout({
              fit: fitMode === 'contain' ? Fit.Contain : Fit.Cover,
              alignment: Alignment.Center,
            }),
          });
        } catch (err) {
          console.warn('Could not initialize Rive canvas instance:', err);
        }
      })
      .catch((e) => {
        console.warn('Error loading @rive-app/canvas:', e);
      });

    return () => {
      isCancelled = true;
      if (riveInstance && typeof riveInstance.cleanup === 'function') {
        riveInstance.cleanup();
      }
    };
  }, [trimmedUrl, fitMode]);

  if (!trimmedUrl) {
    return (
      <div className={`bg-gradient-to-br from-[#003c90] to-[#001f4d] flex items-center justify-center ${className}`}>
        <span className="text-white/40 text-xs font-mono">No Media Configured</span>
      </div>
    );
  }

  // 1. Direct .riv Canvas
  if (isDirectRivFile(trimmedUrl)) {
    return (
      <div className={`relative w-full h-full overflow-hidden ${interactive ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <canvas
          ref={canvasRef}
          className={`w-full h-full block ${className}`}
        />
      </div>
    );
  }

  // 2. Rive Share URL / Embed iFrame
  const riveEmbedSrc = parseRiveEmbedUrl(trimmedUrl);
  if (riveEmbedSrc) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-slate-950">
        <iframe
          src={riveEmbedSrc}
          title={alt}
          className={`w-full h-full border-0 absolute inset-0 ${interactive ? 'pointer-events-auto' : 'pointer-events-none'}`}
          allow="autoplay"
          loading="eager"
        />
      </div>
    );
  }

  // 3. Video File (MP4, WebM)
  if (isVideoMedia(trimmedUrl)) {
    return (
      <video
        src={trimmedUrl}
        autoPlay
        loop
        muted
        playsInline
        className={className}
      />
    );
  }

  // 4. Standard Photo / Image with Smart Framing to avoid aggressive cut-offs
  const fallbackUrl = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1600';

  // Ambient Mode: Full uncropped image in center with blurred matching background filling wide desktop screens
  if (fitMode === 'ambient') {
    return (
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-slate-950">
        {/* Ambient Blurred Background Glow */}
        <img
          src={trimmedUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center blur-2xl opacity-45 brightness-75 scale-110 pointer-events-none select-none transition-all duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackUrl;
          }}
        />
        {/* Full Uncropped High-Res Foreground Photo */}
        <img
          src={trimmedUrl}
          alt={alt}
          className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain object-center drop-shadow-2xl transition-all duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackUrl;
          }}
        />
      </div>
    );
  }

  // Focus positioning classes
  let positionClass = 'object-[center_20%] md:object-[center_25%]'; // Smart Top-Center focus by default
  if (fitMode === 'top') {
    positionClass = 'object-top';
  } else if (fitMode === 'bottom') {
    positionClass = 'object-bottom';
  } else if (fitMode === 'contain') {
    positionClass = 'object-contain object-center bg-slate-950';
  } else if (fitMode === 'cover') {
    positionClass = 'object-[center_20%] md:object-[center_25%]';
  }

  return (
    <img
      src={trimmedUrl}
      alt={alt}
      className={`w-full h-full object-cover ${positionClass} transition-all duration-700 ${className}`}
      onError={(e) => {
        (e.target as HTMLImageElement).src = fallbackUrl;
      }}
    />
  );
};

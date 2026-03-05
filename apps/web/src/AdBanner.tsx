import { useEffect, useRef } from 'react';

interface AdBannerProps {
  adSlot: string;
  format?: 'horizontal' | 'rectangle' | 'vertical' | 'auto';
  width?: number;
  height?: number;
  className?: string;
}

const AD_SIZES: Record<string, { width: number; height: number }> = {
  horizontal: { width: 728, height: 90 },
  rectangle: { width: 300, height: 250 },
  vertical: { width: 160, height: 600 },
};

const isAdsEnabled = import.meta.env.PROD && import.meta.env.VITE_ADSENSE_PUBLISHER_ID;

export default function AdBanner({ adSlot, format = 'horizontal', width, height, className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const size = AD_SIZES[format] || AD_SIZES.horizontal;
  const w = width || size.width;
  const h = height || size.height;

  useEffect(() => {
    if (!isAdsEnabled || !adRef.current) return;
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch {
      // AdSense not loaded
    }
  }, []);

  if (!isAdsEnabled) return null;

  return (
    <div
      className={`ad-container ${className}`}
      style={{ width: w, maxWidth: '100%', height: h, margin: '0 auto' }}
      aria-hidden="true"
    >
      <div ref={adRef}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: w, height: h }}
          data-ad-client={import.meta.env.VITE_ADSENSE_PUBLISHER_ID}
          data-ad-slot={adSlot}
          data-ad-format={format === 'auto' ? 'auto' : undefined}
          data-full-width-responsive={format === 'auto' ? 'true' : undefined}
        />
      </div>
    </div>
  );
}

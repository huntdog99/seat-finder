import AdBanner from './AdBanner';

interface AdSidebarProps {
  adSlot: string;
  className?: string;
}

export default function AdSidebar({ adSlot, className = '' }: AdSidebarProps) {
  return (
    <AdBanner
      adSlot={adSlot}
      format="rectangle"
      width={300}
      height={250}
      className={`ad-sidebar ${className}`}
    />
  );
}

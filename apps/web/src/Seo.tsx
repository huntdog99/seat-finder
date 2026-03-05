import { useEffect } from 'react';

interface SeoProps {
  title?: string;
  description?: string;
  canonical?: string;
  structuredData?: object;
}

const BASE_TITLE = 'Seat Finder';
const BASE_URL = 'https://seatfinder.com';

export default function Seo({ title, description, canonical, structuredData }: SeoProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${BASE_TITLE}` : `${BASE_TITLE} - Find Your Perfect Flight Seat`;
    document.title = fullTitle;

    setMeta('description', description || 'Find flights with your preferred seat. Search by seat position, features, and cabin class.');
    setMeta('og:title', fullTitle);
    setMeta('og:description', description || 'Search flights by seat preference.');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description || 'Search flights by seat preference.');

    const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (link) {
      link.href = canonicalUrl;
    }
    setMeta('og:url', canonicalUrl);

    // Structured data
    let scriptEl = document.getElementById('structured-data') as HTMLScriptElement | null;
    if (structuredData) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = 'structured-data';
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(structuredData);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      const el = document.getElementById('structured-data');
      if (el) el.remove();
    };
  }, [title, description, canonical, structuredData]);

  return null;
}

function setMeta(nameOrProperty: string, content: string) {
  const isOg = nameOrProperty.startsWith('og:') || nameOrProperty.startsWith('twitter:');
  const attr = isOg ? 'property' : 'name';
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${nameOrProperty}"]`);
  if (el) {
    el.content = content;
  }
}

export function createFlightSearchStructuredData(from: string, to: string, date: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Seat Finder',
    url: 'https://seatfinder.com',
    applicationCategory: 'TravelApplication',
    description: `Flight search results from ${from} to ${to} on ${date}`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };
}

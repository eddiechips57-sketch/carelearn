import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  jsonLd?: object | object[];
}

const BASE_URL = 'https://carelearn.site';
const DEFAULT_IMAGE = `${BASE_URL}/Whisk_34b89fcdd778439a7284ea375647e3f0dr.png`;

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export default function SEOHead({ title, description, canonical, ogImage, jsonLd }: SEOHeadProps) {
  useEffect(() => {
    const fullTitle = title.includes('CareLearn') ? title : `${title} | CareLearn`;
    const image = ogImage || DEFAULT_IMAGE;
    const canon = canonical ? `${BASE_URL}${canonical}` : `${BASE_URL}${window.location.pathname}`;

    document.title = fullTitle;
    setMeta('description', description);
    setLink('canonical', canon);

    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:url', canon, 'property');
    setMeta('og:image', image, 'property');

    setMeta('twitter:title', fullTitle, 'name');
    setMeta('twitter:description', description, 'name');
    setMeta('twitter:image', image, 'name');

    // Inject page-level JSON-LD
    const prev = document.getElementById('page-jsonld');
    if (prev) prev.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.id = 'page-jsonld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd]);
      document.head.appendChild(script);
    }

    return () => {
      document.getElementById('page-jsonld')?.remove();
    };
  }, [title, description, canonical, ogImage, jsonLd]);

  return null;
}

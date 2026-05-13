import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
  schema?: object;
}

const DEFAULT_TITLE = "Panzerglas Großhandel Österreich — 2000+ Modelle in einer Box | SAIDA MagicBox";
const DEFAULT_DESCRIPTION = "Das B2B Lagersystem für Handy-Shops in Wien, Graz, Linz und ganz Österreich. 2000+ Smartphone-Modelle, 48+ Marken, ein intelligentes QR-Code-System. In Österreich entwickelt — für ganz Europa.";
const DEFAULT_OG_IMAGE = "https://saidamagicbox.com/og.jpg";
const SITE_URL = "https://saidamagicbox.com";

export const SEO = ({
  title,
  description,
  canonical,
  ogImage,
  noIndex = false,
  schema,
}: SEOProps) => {
  const finalTitle = title || DEFAULT_TITLE;
  const finalDescription = description || DEFAULT_DESCRIPTION;
  const finalCanonical = canonical || SITE_URL + "/";
  const finalOgImage = ogImage || DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={finalCanonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:locale" content="de_AT" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalOgImage} />
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
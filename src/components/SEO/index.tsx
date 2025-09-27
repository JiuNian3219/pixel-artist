import React from "react";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage,
  canonicalUrl,
}) => {
  return (
    <>
      <title>{title}</title>
      {description && (
        <meta
          name="description"
          content={description}
        />
      )}
      {keywords && (
        <meta
          name="keywords"
          content={keywords}
        />
      )}

      <meta
        property="og:type"
        content="website"
      />
      <meta
        property="og:title"
        content={title}
      />
      {description && (
        <meta
          property="og:description"
          content={description}
        />
      )}
      {ogImage && (
        <meta
          property="og:image"
          content={ogImage}
        />
      )}

      {canonicalUrl && (
        <link
          rel="canonical"
          href={canonicalUrl}
        />
      )}
    </>
  );
};

export default SEO;

import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";
const DEFAULT_IMAGE = "/og-image.png";
const SITE_NAME = "WoodCraft Pro";

export function SEO({
  title,
  description = "Plan and manage your DIY woodworking projects with detailed cut lists, material cost estimates, and build tracking.",
  image,
  url,
  type = "website",
  noindex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - DIY Woodworking Project Manager`;
  const imageUrl = image?.startsWith("http") ? image : `${BASE_URL}${image || DEFAULT_IMAGE}`;
  const canonicalUrl = url ? `${BASE_URL}${url}` : typeof window !== "undefined" ? window.location.href : "";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}

interface ProjectSEOProps {
  project: {
    id: string;
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    cutList?: Array<{ material: string; unitPrice: number; quantity: number }>;
  };
}

export function ProjectSEO({ project }: ProjectSEOProps) {
  const { id, title, description, imageUrl, cutList = [] } = project;
  
  const materials = [...new Set(cutList.map(item => item.material))];
  const estimatedCost = cutList.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  
  const metaDescription = description
    ? description.slice(0, 155) + (description.length > 155 ? "..." : "")
    : `View the complete cut list, materials, and build details for ${title}. Plan your next woodworking project with WoodCraft Pro.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description: metaDescription,
    image: imageUrl || DEFAULT_IMAGE,
    url: `${BASE_URL}/projects/${id}`,
    material: materials.join(", "),
    ...(estimatedCost > 0 && {
      offers: {
        "@type": "Offer",
        price: estimatedCost.toFixed(2),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${BASE_URL}/projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${BASE_URL}/projects/${id}`,
      },
    ],
  };

  return (
    <>
      <SEO
        title={title}
        description={metaDescription}
        image={imageUrl || undefined}
        url={`/projects/${id}`}
        type="article"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>
    </>
  );
}

export function HomeSEO() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: "Plan and manage your DIY woodworking projects with detailed cut lists, material cost estimates, and build tracking.",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/projects?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.png`,
    description: "DIY woodworking project management application",
  };

  return (
    <>
      <SEO
        title="DIY Woodworking Project Manager"
        description="Plan and manage your DIY woodworking projects with detailed cut lists, material cost estimates, Home Depot pricing, and material optimization. Track your builds from start to finish."
        url="/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(organizationJsonLd)}</script>
      </Helmet>
    </>
  );
}

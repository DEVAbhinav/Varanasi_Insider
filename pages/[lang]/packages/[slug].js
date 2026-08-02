// pages/[lang]/packages/[slug].js
// Dynamic, SEO-friendly package page backed by /content markdown
// Content file path: /content/<lang>/packages/<slug>.md
// Example: /content/en/packages/varanasi-customised-packages-tour.md

import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import NavBar from "../../../components/NavBar/NavBar";
import StickyContactBar from "../../../components/ServicePage/StickyContactBar";
import Footer from "../../../components/Footer/Footer";
import HeadForBlogs from "../../../components/SEO/HeadForBlogs"; // reuse central SEO head
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Phone, CheckCircle2, Clock, Ship, IndianRupee, Info, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { CONTACT, getCallTelHref } from "@/lib/contact";
import CommerceSection from "../../../components/commerce/CommerceSection";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
  viewport: { once: true, margin: "-80px" },
};

const currency = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const withBuffer = (n, pct = 10) => Math.round(Number(n || 0) * (1 + pct / 100));
const waLink = (text) => `${CONTACT.whatsappUrl}?text=${encodeURIComponent(text)}`;

export default function PackagePage({ pkgData, commerce = null, contentHtml, jsonLdData, allPackages, pageLang, pageSlug, alternateLanguages = [] }) {
  const { title, subtitle, heroImage, coverAlt, phone = CONTACT.callNumberRaw, components, tiers = [], addOns = [], vehicles = [], seasonNotes = {}, breadcrumbs = [], faqs = [] } = pkgData || {};
  const bufferPct = components?.buffer_percent ?? 10;
  const [imgSrc, setImgSrc] = useState(heroImage && heroImage.trim() ? heroImage : "https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png");

  // Build visible breadcrumb in-page (HeadForBlogs will also get JSON-LD)
  const packageOwnerUrl = "https://www.kashitaxi.in/en/packages/varanasi-tour-package";
  const crumbs = breadcrumbs?.length
    ? breadcrumbs
    : pageSlug === "varanasi-tour-package"
      ? [
        { name: "Home", item: "https://www.kashitaxi.in/" },
        { name: "Varanasi Tour Package", item: packageOwnerUrl },
      ]
      : [
        { name: "Home", item: "https://www.kashitaxi.in/" },
        { name: "Varanasi Tour Packages", item: packageOwnerUrl },
        { name: title || "Package", item: `https://www.kashitaxi.in/en/packages/${pageSlug}` },
      ];

  return (
    <>
      {/* Central SEO Head: pass slug with packages/ segment so canonical matches route */}
      <HeadForBlogs postData={{ title, description: subtitle, featuredImage: heroImage }} pageLang={pageLang} pageSlug={`packages/${pageSlug}`} jsonLdData={jsonLdData} alternateLanguages={alternateLanguages} />

      <NavBar />

      {/* Sticky mobile CTA bar (hidden on commerce pages — buy-box + floating icons cover it) */}
      {!commerce && (
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/85 backdrop-blur md:hidden">
        <div className="mx-auto max-w-6xl px-4 py-3 flex gap-2">
          <Button asChild className="flex-1">
            <a aria-label="WhatsApp Now" href={waLink(`Hi, I want to book ${title || "a package"}`)}>WhatsApp</a>
          </Button>
          <Button asChild variant="secondary" className="flex-1">
            <a aria-label="Call now" href={getCallTelHref(phone)}>Call</a>
          </Button>
        </div>
      </div>
      )}

      {/* Floating desktop CTA dock (hidden on commerce pages) */}
      {!commerce && (
      <div className="hidden md:block fixed right-6 bottom-6 z-40">
        <div className="flex flex-col gap-2">
          <Button size="lg" asChild>
            <a aria-label="WhatsApp Now" href={waLink(`Hi, I want to book ${title || "a package"}`)}>WhatsApp</a>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <a aria-label="Call now" href={getCallTelHref(phone)}>Call</a>
          </Button>
        </div>
      </div>
      )}

      <main className={`min-h-screen ${commerce ? "" : "pb-24"} md:pb-0`}>
        {/* Hero */}
        <section className="relative">
          {heroImage && (
            <div className="relative aspect-[16/7] w-full overflow-hidden">
              <Image src={imgSrc} alt={coverAlt || title || "Varanasi package"} fill priority className="object-cover" onError={() => setImgSrc('https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png')} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            </div>
          )}
          <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
            <motion.div {...fadeUp}>
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">{title}</h1>
              {subtitle && <p className="mt-3 text-muted-foreground md:text-lg max-w-3xl">{subtitle}</p>}

              {/* Trust pills — hidden on commerce pages, where the buy-box already shows badges */}
              {!commerce && (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                  <Badge variant="secondary" className="rounded-full px-3 py-1"><ShieldCheck className="mr-1 h-4 w-4" /> Commercial-permit fleet</Badge>
                  <Badge variant="outline" className="rounded-full px-3 py-1"><Sparkles className="mr-1 h-4 w-4" /> Transparent pricing</Badge>
                  <Badge variant="outline" className="rounded-full px-3 py-1"><BadgeCheck className="mr-1 h-4 w-4" /> Vetted guides & boats</Badge>
                </div>
              )}

              {/* Breadcrumbs */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs md:text-sm">
                {crumbs.map((c, i) => (
                  <span key={i} className="text-muted-foreground">
                    {i > 0 && <span className="mx-2">›</span>}
                    <a href={c.item} className="hover:underline">{c.name}</a>
                  </span>
                ))}
              </div>

              {/* Primary CTAs */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a aria-label="WhatsApp Now" href={waLink(`Hi, I want to book ${title || "a package"}`)}>WhatsApp Now</a>
                </Button>
                <Button variant="secondary" asChild size="lg">
                  <a aria-label="Call now" href={getCallTelHref(phone)}>Call {phone}</a>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <a aria-label="View plans" href={commerce ? "#book" : "#tiers"}>View Plans</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Commerce / ordering block (opt-in via `commerce` frontmatter) */}
        {commerce && <CommerceSection product={commerce} meta={{ slug: pageSlug, lang: pageLang }} />}

        {/* Quick highlights row */}
        <section className="bg-muted/30 py-4">
          <div className="mx-auto max-w-6xl px-4 grid gap-3 md:grid-cols-4">
            {(commerce?.productType === "tour_package"
              ? [{ label: "Hotel & Cab Planned Together", icon: CheckCircle2 }, { label: "Instant WhatsApp Quote", icon: Phone }, { label: "2 / 3 / 4 Day Options", icon: Clock }, { label: "Live Coordination", icon: Sparkles }]
              : [{ label: "Private Boats (not shared)", icon: Ship }, { label: "Instant WhatsApp Quote", icon: Phone }, { label: "Transparent Pricing", icon: IndianRupee }, { label: "Live Coordination", icon: CheckCircle2 }]
            ).map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-sm md:text-base"><h.icon className="h-4 w-4" /><span>{h.label}</span></div>
            ))}
          </div>
        </section>

        {/* Quick Price Sheet */}
        {components && (
          <section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
            <motion.div {...fadeUp}>
              <h2 className="text-2xl md:text-3xl font-semibold">Quick Price Sheet <span className="text-muted-foreground text-base">(incl. {bufferPct}% buffer)</span></h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: "Local Sightseeing (Sedan)", value: `${currency(withBuffer(components.sightseeing_sedan_min, bufferPct))}–${currency(withBuffer(components.sightseeing_sedan_max, bufferPct))} / day`, icon: Clock },
                  { label: "Private Boat • Assi → Manikarnika (Aarti)", value: `${currency(withBuffer(components.boat_short, bufferPct))} / boat`, icon: Ship },
                  { label: "Private Boat • Assi → Namo (Extended)", value: `${currency(withBuffer(components.boat_extended, bufferPct))} / boat`, icon: Ship },
                  { label: "Professional Local Guide", value: `${currency(withBuffer(components.guide_day, bufferPct))} / day`, icon: CheckCircle2 },
                  { label: "VIP Darshan Assistance", value: `${currency(withBuffer(components.vip_pp, bufferPct))} / person`, icon: BadgeCheck },
                  { label: "Relaxing Body Massage", value: `${currency(withBuffer(components.massage_pp, bufferPct))} / person`, icon: Info },
                ].map((item, idx) => (
                  <Card key={idx} className="rounded-2xl shadow-sm transition hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        {item.icon && React.createElement(item.icon, { className: "h-5 w-5" })}
                        {item.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-lg md:text-xl font-semibold tracking-tight">{item.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* Good–Better–Best Cards */}
        {tiers?.length > 0 && (
          <section id="tiers" className="bg-muted/30 py-10 md:py-14">
            <div className="mx-auto max-w-6xl px-4">
              <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-semibold">Pick Your Flow</motion.h2>
              <p className="mt-2 text-muted-foreground">Choose a ready template or mix-and-match add-ons. All plans are customisable to your arrival time.</p>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {tiers.map((t) => (
                  <Card key={t.key} className={`relative rounded-2xl shadow-sm border ${t.key === "better" ? "border-primary/40" : "border-border/60"} transition hover:shadow-md`}>
                    {t.key === "better" && (
                      <span className="absolute right-3 top-3 rounded-full bg-primary/10 text-primary px-2 py-1 text-xs font-medium">Most Popular</span>
                    )}
                    {t.key === "best" && (
                      <span className="absolute right-3 top-3 rounded-full bg-secondary/20 text-foreground px-2 py-1 text-xs font-medium">Best Value</span>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl md:text-2xl leading-tight">{t.name}</CardTitle>
                        <Badge variant={t.key === "best" ? "default" : t.key === "better" ? "secondary" : "outline"}>{t.duration}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {(t.includes || []).map((i, idx) => (
                          <li key={idx} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4" /> <span>{i}</span></li>
                        ))}
                      </ul>
                      {t.popular_addons?.length ? (
                        <div className="mt-4">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Popular add-ons</p>
                          <ul className="mt-1 space-y-1 text-sm">
                            {t.popular_addons.map((a, i) => (
                              <li key={i}>• {a}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {t.indicative_total ? (
                        <div className="mt-5 flex items-center gap-2">
                          <IndianRupee className="h-5 w-5" />
                          <div>
                            <p className="text-xs text-muted-foreground">Indicative land-only</p>
                            <p className="text-xl font-semibold">{currency(withBuffer(t.indicative_total, bufferPct))}</p>
                          </div>
                        </div>
                      ) : null}
                      <div className="mt-6 grid grid-cols-2 gap-2">
                        <Button className="w-full" asChild>
                          <a aria-label={`Book ${t.name}`} href={waLink(`I want to book the ${t.name} package`)}>Book {t.name}</a>
                        </Button>
                        <Button variant="secondary" className="w-full" asChild>
                          <a aria-label="Call now" href={getCallTelHref(phone)}>Call</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Vehicles */}
        {vehicles?.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
            <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-semibold">Choose Your Vehicle</motion.h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {vehicles.map((v, i) => (
                <Badge key={i} variant="outline" className="px-3 py-1 text-sm rounded-full">{v.label || v}</Badge>
              ))}
            </div>
          </section>
        )}

        {/* Season Notes */}
        {seasonNotes && (seasonNotes.winter || seasonNotes.summer || seasonNotes.monsoon) && (
          <section className="bg-muted/30 py-8 md:py-12">
            <div className="mx-auto max-w-6xl px-4">
              <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-semibold">Seasonal Notes</motion.h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {seasonNotes.winter && (
                  <Card className="rounded-2xl"><CardHeader><CardTitle>Winter</CardTitle></CardHeader><CardContent><p>{seasonNotes.winter}</p></CardContent></Card>
                )}
                {seasonNotes.summer && (
                  <Card className="rounded-2xl"><CardHeader><CardTitle>Summer</CardTitle></CardHeader><CardContent><p>{seasonNotes.summer}</p></CardContent></Card>
                )}
                {seasonNotes.monsoon && (
                  <Card className="rounded-2xl"><CardHeader><CardTitle>Monsoon</CardTitle></CardHeader><CardContent><p>{seasonNotes.monsoon}</p></CardContent></Card>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Optional long-form content from markdown body */}
        {contentHtml && (
          <section className="mx-auto max-w-3xl px-4 py-10 md:py-14 prose prose-zinc dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </section>
        )}

        {/* FAQs */}
        {faqs?.length > 0 && (
          <section className="mx-auto max-w-3xl px-4 py-10 md:py-14">
            <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-semibold">FAQs</motion.h2>
            <Accordion type="single" collapsible className="mt-4">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* Related packages grid (uses allPackages) */}
        {allPackages?.length > 1 && (
          <section className="mx-auto max-w-6xl px-4 pb-24 md:pb-14">
            <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-semibold">You might also like</motion.h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {allPackages.filter(p => p.slug !== pageSlug).slice(0, 6).map((p) => (
                <Card key={p.slug} className="rounded-2xl overflow-hidden transition hover:shadow-md">
                  {p.heroImage && (
                    <div className="relative h-40 w-full">
                      <Image src={p.heroImage} alt={p.title} fill className="object-cover" />
                    </div>
                  )}
                  <CardHeader className="pb-2"><CardTitle className="text-lg">{p.title}</CardTitle></CardHeader>
                  <CardContent className="pt-0">
                    <p className="line-clamp-2 text-sm text-muted-foreground">{p.subtitle}</p>
                    <div className="mt-4">
                      <Button variant="secondary" asChild className="w-full">
                        <a href={`/${p.lang}/packages/${p.slug}`}>View Package</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer allPosts={[]} />
      <StickyContactBar phone={CONTACT.callNumberRaw} floatingOnly={!!commerce} />
    </>
  );
}

export async function getStaticProps({ params }) {
  // Read markdown from /content/<lang>/packages/<slug>.md
  const fs = await import("fs/promises");
  const path = await import("path");
  const { loadMarkdownContent } = await import("../../../lib/posts");
  const { buildAlternateLanguageUrls } = await import("../../../lib/hreflang");
  const { sanitizeJsonLdData } = await import("../../../lib/jsonLdSanitizer");

  const contentDir = path.join(process.cwd(), "content", params.lang, "packages");
  const { frontmatter, contentHtml: rawContentHtml } = await loadMarkdownContent(params.lang, `packages/${params.slug}`);
  // The package hero renders the page <h1>, so demote the markdown body's
  // leading H1 to H2 to keep a single H1 per page.
  const { demoteContentHeadings } = await import("../../../lib/markdown");
  const contentHtml = demoteContentHeadings(rawContentHtml);

  // Parse opt-in commerce/ordering block (plan §18). Returns null when absent;
  // throws (failing the build) if a block is present but invalid — CI gate.
  const { getCommerceData } = await import("../../../lib/commercialPageData");
  const commerce = getCommerceData(frontmatter, { slug: params.slug, lang: params.lang });

  // Also collect all packages (for related grid)
  let allPackages = [];
  try {
    const entries = await fs.readdir(contentDir);
    allPackages = await Promise.all(
      entries
        .filter((f) => f.endsWith(".md"))
        .map(async (fname) => {
          const slug = fname.replace(/\.md$/, "");
          const { frontmatter: data } = await loadMarkdownContent(params.lang, `packages/${slug}`);
          return {
            title: data.title || "",
            subtitle: data.subtitle || "",
            slug,
            heroImage: data.heroImage || "",
            lang: data.lang || params.lang,
          };
        })
    );
  } catch { }

  // Build OfferCatalog JSON-LD based on tiers
  const FALLBACK_PRODUCT_IMAGE = "https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png";
  const resolveImageUrl = (img) => {
    if (typeof img !== "string" || !img.trim()) return FALLBACK_PRODUCT_IMAGE;
    const v = img.trim();
    if (/^https?:\/\//i.test(v)) return v; // already absolute
    return `https://www.kashitaxi.in${v.startsWith("/") ? v : `/${v}`}`;
  };
  const productImage = resolveImageUrl(frontmatter.heroImage);
  const offerCatalog = {
    "@type": "OfferCatalog",
    name: frontmatter.title,
    itemListElement: (frontmatter.tiers || []).map((t) => ({
      "@type": "Product",
      name: `${t.name} (${t.duration || ""})`,
      description: (t.includes || []).join("; "),
      image: productImage,
      brand: { "@type": "Brand", name: "Varanasi Taxi" },
      areaServed: "Varanasi",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "INR",
        lowPrice: String(withBuffer(t.indicative_total || 0, frontmatter.components?.buffer_percent ?? 10)),
        highPrice: String(withBuffer((t.indicative_total || 0) * 1.3, frontmatter.components?.buffer_percent ?? 10)),
        offerCount: 3,
        availability: "https://schema.org/InStock",
      },
    })),
  };

  let jsonLdData = { "@context": "https://schema.org", ...offerCatalog };

  // Attach a standalone Product node so Google has an unambiguous item to render
  // review stars for in the SERP (OfferCatalog itself is not review-snippet eligible).
  if (frontmatter.aggregateRating && frontmatter.aggregateRating.ratingValue != null) {
    const canonicalUrl = `https://www.kashitaxi.in/${params.lang}/packages/${params.slug}`;
    const ratingProduct = {
      "@type": "Product",
      name: frontmatter.title,
      description: frontmatter.description || frontmatter.subtitle || frontmatter.title,
      image: productImage,
      url: canonicalUrl,
      brand: { "@type": "Brand", name: "Varanasi Taxi" },
      areaServed: "Varanasi",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: frontmatter.aggregateRating.ratingValue,
        reviewCount: frontmatter.aggregateRating.reviewCount || frontmatter.aggregateRating.ratingCount,
        bestRating: "5",
        worstRating: "1",
      },
    };
    jsonLdData = { "@context": "https://schema.org", "@graph": [offerCatalog, ratingProduct] };
  }

  // When a commerce block is present, add a Product node with AggregateOffer
  // built from the real offers[] prices so Google sees a bookable product.
  if (commerce) {
    const canonicalUrl = `https://www.kashitaxi.in/${params.lang}/packages/${params.slug}`;
    const prices = commerce.offers
      .map((o) => Number(String(o.price).replace(/[,₹\s]/g, "")))
      .filter((n) => Number.isFinite(n) && n > 0);
    const commerceProduct = {
      "@type": commerce.schemaType || "Product",
      name: commerce.productName,
      description: frontmatter.description || frontmatter.subtitle || commerce.productName,
      image: productImage,
      url: canonicalUrl,
      brand: { "@type": "Brand", name: "Kashi Taxi" },
      areaServed: "Varanasi",
      offers: {
        "@type": prices.length > 1 ? "AggregateOffer" : "Offer",
        priceCurrency: commerce.offers[0]?.priceCurrency || "INR",
        ...(prices.length > 1
          ? {
              lowPrice: String(Math.min(...prices)),
              highPrice: String(Math.max(...prices)),
              offerCount: commerce.offers.length,
            }
          : { price: String(prices[0] || commerce.offers[0]?.price || "") }),
        availability: "https://schema.org/InStock",
      },
      ...(frontmatter.aggregateRating && frontmatter.aggregateRating.ratingValue != null
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: frontmatter.aggregateRating.ratingValue,
              reviewCount:
                frontmatter.aggregateRating.reviewCount || frontmatter.aggregateRating.ratingCount,
              bestRating: "5",
              worstRating: "1",
            },
          }
        : {}),
    };
    let graph = Array.isArray(jsonLdData["@graph"])
      ? jsonLdData["@graph"]
      : [offerCatalog];
    // The sanitizer dedupes singleton @types. When the commerce product is itself
    // a "Product", drop the standalone rating-only Product so the bookable node
    // (which already carries aggregateRating + offers) is the one that survives.
    if ((commerceProduct["@type"] || "Product") === "Product") {
      graph = graph.filter((n) => !(n && n["@type"] === "Product"));
    }
    jsonLdData = { "@context": "https://schema.org", "@graph": [...graph, commerceProduct] };
  }
  const sanitizedJsonLdData = sanitizeJsonLdData(jsonLdData);

  const alternateLanguages = buildAlternateLanguageUrls({
    relativeFilePath: path.join('packages', `${params.slug}.md`),
    routePath: `packages/${params.slug}`,
    fallbackLangs: [params.lang],
  });

  return {
    props: {
      pkgData: frontmatter,
      commerce: commerce ? JSON.parse(JSON.stringify(commerce)) : null,
      contentHtml,
      jsonLdData: sanitizedJsonLdData,
      allPackages,
      pageLang: params.lang,
      pageSlug: params.slug,
      alternateLanguages,
    },
  };
}

export async function getStaticPaths() {
  const fs = await import("fs/promises");
  const path = await import("path");
  const root = path.join(process.cwd(), "content");

  let paths = [];
  try {
    const langs = await fs.readdir(root);
    for (const lang of langs) {
      const dir = path.join(root, lang, "packages");
      try {
        const files = await fs.readdir(dir);
        files
          .filter((f) => f.endsWith(".md"))
          .forEach((f) => {
            const slug = f.replace(/\.md$/, "");
            paths.push({ params: { lang, slug } });
          });
      } catch { }
    }
  } catch (e) {
    // no-op if directory missing
  }

  return { paths, fallback: false };
}

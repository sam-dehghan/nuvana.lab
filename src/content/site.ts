/**
 * All homepage copy lives here so it can be edited without touching layout code.
 * Anything with `placeholder: true` renders with a visible "Platzhalter" badge and must be
 * replaced with real material before launch. Never fill these with invented clients,
 * numbers or quotes.
 */

export const brand = {
  name: "nuvana.lab",
  instagram: "https://www.instagram.com/nuvana.lab/",
  /** Set once a real address exists. The contact page only shows it when present. */
  email: null as string | null,
};

export const nav = [
  { label: "Das System", href: "/#system" },
  { label: "Kundenstimmen", href: "/#kundenstimmen" },
  { label: "Blog", href: "/blog" },
  { label: "Kontakt", href: "/kontakt" },
];

export const cta = { label: "Kostenloses Erstgespräch", href: "/kontakt" };

/** Entry point to the password-protected admin area (blog and FAQ editing). */
export const admin = { label: "Admin", href: "/admin" };

export const hero = {
  eyebrow: "Branding & Personal Branding aus Düsseldorf",
  title: "Wir machen aus Menschen und Unternehmen Marken, die man wiedererkennt",
  text: "Markenidentität, Personal Branding und Content aus einer Hand. Wir hören zuerst zu und entwickeln dann eine Marke, die zu dir passt und die richtigen Kunden anzieht.",
  secondary: { label: "Leistungen ansehen", href: "#system" },
  /** Path to a muted showreel in /public, e.g. "/video/showreel.mp4". */
  video: null as string | null,
};

export const clients = {
  title: "Marken, mit denen wir arbeiten",
  text: "Ein Auszug aus unseren Projekten",
  items: Array.from({ length: 8 }, (_, i) => ({
    name: `Kunde ${i + 1}`,
    logo: null as string | null,
    photo: null as string | null,
    placeholder: true,
  })),
};

export const system = {
  title: "Deine Kunden entscheiden in Sekunden",
  text: "Darum bauen wir deine Marke von innen nach außen. Ein System, in dem jedes Teil auf dieselbe Idee einzahlt.",
  center: "Deine Marke",
  /** Ordered from the core outwards; each layer is one ring in the diagram. */
  layers: [
    {
      name: "Strategie",
      title: "Erst Klarheit, dann Design.",
      text: "Wofür stehst du, und für wen? Wir schärfen deine Positionierung und deine Botschaft. Das ist der Kern, auf dem alles andere aufbaut.",
      tags: ["Positionierung", "Personal Branding", "Content-Strategie"],
    },
    {
      name: "Identität",
      title: "Der erste Eindruck entscheidet.",
      text: "Menschen entscheiden in wenigen Sekunden, ob sie dir vertrauen. Logo, Farben, Schrift und Bildsprache sorgen dafür, dass du überall sofort erkannt wirst.",
      tags: ["Logo", "Farben & Schrift", "Fotos"],
    },
    {
      name: "Sichtbarkeit",
      title: "Jeder Monat baut auf dem letzten auf.",
      text: "Wir bringen deine Marke dorthin, wo deine Kunden sind. Du startest nicht jedes Mal bei null: Mit jeder Veröffentlichung wird deine Marke klarer und bekannter.",
      tags: ["Reels", "Social Media", "Ads", "Website", "Print", "Außenwerbung"],
    },
  ],
};

export const team = {
  title: "Hinter nuvana.lab",
  intro:
    "Viele Marken starten mit einem Logo und hoffen, dass der Rest von allein kommt. Wir machen es anders: Wir starten mit dir, mit deiner Geschichte, deinen Werten und deinen Kunden.",
  members: [
    {
      name: "Hesam",
      role: "Gründer & Markenstrategie",
      bio: "Hesam begleitet dich vom ersten Gespräch bis zur fertigen Marke. Mit Erfahrung aus Management, Marketing und Content-Produktion sorgt er dafür, dass deine Marke nicht nur gut aussieht, sondern wirklich zu dir passt.",
      photo: null as string | null,
      placeholder: true,
    },
  ],
  gallery: {
    /** Three still categories above the moving row. Labels are placeholders until confirmed. */
    tiles: [
      { label: "Markenfilm", src: null as string | null, placeholder: true },
      { label: "Personal Branding", src: null as string | null, placeholder: true },
      { label: "Kundenstimmen", src: null as string | null, placeholder: true },
    ],
    /** Small label above the moving row. */
    reelsLabel: "Social Content",
    /** Vertical 9:16 stills for the moving row. */
    reels: Array.from({ length: 8 }, () => ({ src: null as string | null, placeholder: true })),
  },
};

export const testimonials = {
  title: "Das sagen unsere Kunden",
  text: "Echte Stimmen von Menschen, mit denen wir gearbeitet haben.",
  videos: [
    { src: null as string | null, placeholder: true },
    { src: null as string | null, placeholder: true },
  ],
  quotes: Array.from({ length: 4 }, (_, i) => ({
    quote: "Hier steht bald eine echte Kundenstimme.",
    name: `Name ${i + 1}`,
    role: "Unternehmen",
    placeholder: true,
  })),
};

export const approach = {
  title: "Unser Ansatz ist klar: Marke zuerst",
  text: "Erst Klarheit, dann Design, dann Sichtbarkeit. So entsteht Content, der nicht nur Reichweite bringt, sondern Vertrauen.",
  /** Vertical reel shown inside the phone frame. */
  video: null as string | null,
};

export const process = {
  eyebrow: "Dein nächster Schritt",
  title: "Lass uns deine Marke bauen",
  text: "Im Erstgespräch klären wir, wo du stehst und wohin du willst. Wenn es passt, entwickeln wir gemeinsam deinen Fahrplan.",
  steps: [
    {
      title: "Kostenloses Erstgespräch",
      text: "Wir lernen dich kennen und finden heraus, was deine Marke wirklich braucht.",
    },
    {
      title: "Strategie",
      text: "Wir entwickeln Positionierung, Botschaft und einen klaren Fahrplan für deine Marke.",
    },
    {
      title: "Deine Marke",
      text: "Wir gestalten deine Markenidentität und bringen sie dorthin, wo deine Kunden sind.",
    },
  ],
};

export const faq = {
  title: "Häufig gestellte Fragen",
};

export const blogTeaser = {
  title: "Aus dem Blog",
  text: "Wissen rund um Branding und Personal Branding, verständlich erklärt.",
  empty: "Bald erscheinen hier die ersten Artikel.",
};

export const finalCta = {
  eyebrow: "Jetzt kennenlernen",
  title: "Lass uns deine Marke sichtbar machen",
  text: "Im unverbindlichen Erstgespräch schauen wir uns deine aktuelle Situation, deine Positionierung und deine Ziele an.",
};

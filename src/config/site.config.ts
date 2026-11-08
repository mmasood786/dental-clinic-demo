/**
 * Single source of truth for every clinic-specific value.
 *
 * Reuse this template for another clinic by editing this file only.
 * Nothing in here should be duplicated in components.
 */

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceStep = {
  title: string;
  description: string;
};

export type Service = {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  /** Starting price in `siteConfig.currency`, or null when pricing is quoted per case. */
  priceFrom: number | null;
  /** Length of a standard appointment for this treatment, in minutes. */
  durationMinutes: number;
  /** Plain-language situations this treatment is usually right for. */
  whoFor: string[];
  /** The appointment or treatment in order, shown as numbered steps. */
  steps: ServiceStep[];
  faq: ServiceFaq[];
};

export type BookingConfig = {
  /** Booking is handled by an embedded Cal.com widget. */
  provider: "cal";
  /** Cal.com username that owns the event types. */
  calUsername: string;
  /** Map of service slug to Cal.com event link, e.g. "clinic/checkup". */
  eventTypes: Record<string, string>;
  /** Cal.com event link used when a service has no dedicated event type. */
  defaultEvent: string;
  /** Shown when the embed cannot load, next to the phone and WhatsApp fallbacks. */
  fallbackMessage: string;
};

export type OpeningHours = {
  day: string;
  /** 24-hour "HH:mm". Null means the clinic is closed that day. */
  opens: string | null;
  closes: string | null;
};

export type SocialPlatform =
  | "instagram"
  | "facebook"
  | "google"
  | "tiktok"
  | "youtube"
  | "linkedin";

export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  url: string;
};

export type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type GeoPoint = {
  lat: number;
  lng: number;
};

export type Location = {
  slug: string;
  city: string;
  area: string;
  /** Structured address, used for display text and schema.org markup. */
  address: Address;
  geo: GeoPoint;
  mapEmbedUrl: string;
  phone: string;
  /** Location-specific copy for the location page. */
  description: string;
};

export type SeoConfig = {
  /** schema.org priceRange band shown to search engines, e.g. "$$". */
  priceRange: string;
  /** Cities and towns the practice wants to rank in. */
  areaServed: string[];
};

export type PricingItem = {
  serviceSlug: string;
  treatment: string;
  price: number;
  note?: string;
};

export type InsurancePartner = {
  name: string;
  note?: string;
  /** True for a self-pay option that is not an insurance plan. */
  selfPay?: boolean;
};

export type HomeHeroContent = {
  /** Main H1 benefit statement. */
  heading: string;
  /** One-line supporting sentence below the H1. */
  supporting: string;
  /** Clinic or team photo. Null renders a soft branded placeholder. */
  image: { src: string; alt: string } | null;
};

export type TrustPoint = {
  value: string;
  label: string;
  /** Stable identifier, so a page can choose which facts to feature. */
  key?:
    | "rating"
    | "experience"
    | "patients"
    | "studios"
    | "emergency"
    | "insurance";
};

export type FirstVisitStep = {
  title: string;
  description: string;
};

export type FirstVisitContent = {
  intro: string;
  steps: FirstVisitStep[];
  /** Reassurance shown beside the booking CTA. */
  note: string;
};

export type Review = {
  quote: string;
  author: string;
  treatment: string;
  rating: number;
};

export type ReviewsContent = {
  intro: string;
  note: string;
  /** Rating shown when the Google Places API is unavailable (template placeholder). */
  fallbackRating: number;
  /** Review count shown with `fallbackRating`. */
  fallbackTotal: number;
  items: Review[];
};

export type GalleryCase = {
  slug: string;
  title: string;
  serviceSlug: string;
  caption: string;
  before: {
    src: string;
    alt: string;
  };
  after: {
    src: string;
    alt: string;
  };
};

export type GalleryContent = {
  intro: string;
  consentNote: string;
  cases: GalleryCase[];
};

export type AboutContent = {
  intro: string;
  story: string[];
  values: Array<{ title: string; description: string }>;
  team: Array<{
    name: string;
    role: string;
    bio: string;
    /** Team photo. Missing or null renders a soft initials placeholder. */
    photo?: { src: string; alt: string } | null;
  }>;
};

export type ContactFormContent = {
  intro: string;
  submitLabel: string;
  successTitle: string;
  successMessage: string;
  privacyNote: string;
};

export type BrandColors = {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  accentDark: string;
  ink: string;
  muted: string;
  surface: string;
  whatsapp: string;
};

export type NavItem = {
  label: string;
  href: string;
};

export type SiteConfig = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  currency: string;
  phone: string;
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  address: Address;
  geo: GeoPoint;
  openingHours: OpeningHours[];
  social: SocialLink[];
  brand: {
    colors: BrandColors;
  };
  googlePlaceId: string;
  /** IANA time zone the clinic operates in (used for reporting). */
  timeZone: string;
  booking: BookingConfig;
  seo: SeoConfig;
  homeHero: HomeHeroContent;
  firstVisit: FirstVisitContent;
  nav: NavItem[];
  services: Service[];
  locations: Location[];
  insurancePartners: InsurancePartner[];
  pricing: PricingItem[];
  pricingDisclaimer: string;
  /** Cancellation and reschedule terms, shown on /manage-appointment. */
  cancellationPolicy: string;
  trustPoints: TrustPoint[];
  homeFaqs: ServiceFaq[];
  reviews: ReviewsContent;
  gallery: GalleryContent;
  about: AboutContent;
  contactForm: ContactFormContent;
};

export const siteConfig: SiteConfig = {
  name: "Lumen Dental Studio",
  shortName: "Lumen Dental",
  tagline: "Gentle dentistry, brilliantly clear",
  description:
    "Lumen Dental Studio is a calm, modern dental practice in Austin, Texas. Implants, braces, whitening, emergency care and everyday check-ups from a team that explains every step.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lumendental.example",
  currency: "USD",

  phone: "+1 512 555 0142",
  whatsappNumber: "15125550142",
  whatsappMessage:
    "Hi Lumen Dental, I'd like to ask about booking an appointment.",
  email: "hello@lumendental.example",

  address: {
    line1: "2401 Riverside Drive",
    line2: "Suite 120",
    city: "Austin",
    state: "TX",
    postalCode: "78741",
    country: "US",
  },

  geo: {
    lat: 30.2394,
    lng: -97.7276,
  },

  openingHours: [
    { day: "Monday", opens: "08:00", closes: "18:00" },
    { day: "Tuesday", opens: "08:00", closes: "18:00" },
    { day: "Wednesday", opens: "08:00", closes: "18:00" },
    { day: "Thursday", opens: "08:00", closes: "18:00" },
    { day: "Friday", opens: "08:00", closes: "16:00" },
    { day: "Saturday", opens: "09:00", closes: "14:00" },
    { day: "Sunday", opens: null, closes: null },
  ],

  social: [
    {
      platform: "instagram",
      label: "Instagram",
      url: "https://www.instagram.com/lumendentalstudio",
    },
    {
      platform: "facebook",
      label: "Facebook",
      url: "https://www.facebook.com/lumendentalstudio",
    },
    {
      platform: "google",
      label: "Google Business Profile",
      url: "https://www.google.com/maps/place/?q=place_id:ChIJLumenPlaceholderPlaceId",
    },
    {
      platform: "tiktok",
      label: "TikTok",
      url: "https://www.tiktok.com/@lumendentalstudio",
    },
  ],

  brand: {
    colors: {
      primary: "#0F766E",
      primaryDark: "#115E59",
      primaryLight: "#E7F6F4",
      accent: "#F4A62A",
      accentDark: "#B45309",
      ink: "#0F1F22",
      muted: "#5C7376",
      surface: "#F5FAF9",
      whatsapp: "#25D366",
    },
  },

  googlePlaceId: "ChIJLumenPlaceholderPlaceId",
  timeZone: "America/Chicago",

  booking: {
    provider: "cal",
    /**
     * No API key or secret is needed for the embed.
     *
     * Use a booking Link (Cal.com sidebar → Links, app.cal.com/links), not a
     * one-off Event (app.cal.com/events). The value is the public link path:
     * "<username>/<event-slug>" from https://cal.com/<username>/<event-slug>.
     * A full https://cal.com/... URL also works.
     *
     * An app.cal.com editor URL cannot be embedded. Until these are real
     * public links, Cal.com answers 404 and /book shows its phone fallback.
     */
    calUsername: "kabeer-han-or8zf0",
    eventTypes: {
      /**
       * Only the general-checkup Link exists so far. Treatments without their
       * own entry below book this default Link, so nothing dead-ends. Create a
       * Cal.com Link per treatment and add it here when you are ready.
       */
      implants: "kabeer-han-or8zf0/general-checkup",
      braces: "kabeer-han-or8zf0/general-checkup",
      "teeth-whitening": "kabeer-han-or8zf0/general-checkup",
      "emergency-dentist": "kabeer-han-or8zf0/general-checkup",
      "general-checkup": "kabeer-han-or8zf0/general-checkup",
    },
    defaultEvent: "kabeer-han-or8zf0/general-checkup",
    fallbackMessage:
      "Online booking is taking longer than usual to load. Call the studio or message us on WhatsApp and we will find a time for you.",
  },

  seo: {
    priceRange: "$$",
    areaServed: ["Austin", "Round Rock", "Cedar Park", "Pflugerville"],
  },

  homeHero: {
    heading: "Dentistry that explains every step",
    supporting:
      "Gentle, unhurried care for the whole family — from routine check-ups to implants, with clear prices before treatment starts.",
    image: null,
  },

  firstVisit: {
    intro:
      "No surprises and no pressure. Here is exactly what happens from the moment you book to the moment you have a plan you understand.",
    steps: [
      {
        title: "Book online",
        description:
          "Pick a treatment and a time that suits you. You get an instant email confirmation, and every email includes a link to reschedule if plans change.",
      },
      {
        title: "Visit and examination",
        description:
          "We listen first, then examine your teeth and gums, take digital X-rays where they will help and show you what we see on screen. Nothing hurries you along.",
      },
      {
        title: "Your treatment plan",
        description:
          "You leave with a written summary and a price for anything we recommend. Nothing goes ahead until you agree — and watching a small problem is always an option.",
      },
    ],
    note: "Most first visits are booked for 45 minutes, including a hygiene clean. If you are nervous, tell us when you book and we will go at your pace.",
  },

  nav: [
    { label: "Services", href: "/services" },
    { label: "Locations", href: "/locations" },
    { label: "Pricing", href: "/insurance-pricing" },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  services: [
    {
      slug: "implants",
      title: "Dental implants",
      shortDescription:
        "Permanent, natural-looking replacements for missing teeth, planned with 3D imaging.",
      longDescription:
        "A dental implant replaces a missing tooth from the root up, so you can bite and smile with confidence again. We plan every case with a 3D scan, place the implant under local anaesthetic, and finish with a custom crown matched to your other teeth. Single teeth, bridges and full-arch cases are all handled in-house.",
      priceFrom: 3200,
      durationMinutes: 60,
      whoFor: [
        "You are missing one or more teeth and would rather not have a bridge or denture.",
        "A denture has become loose, or a bridge would mean cutting down healthy neighbouring teeth.",
        "You want a replacement that is cleaned like a normal tooth and does not come out at night.",
      ],
      steps: [
        {
          title: "Consultation and 3D scan",
          description:
            "We check your gums and bone, take a 3D scan and confirm whether an implant is the right option. You leave with a written plan and a fixed price.",
        },
        {
          title: "Placement",
          description:
            "The implant is placed under local anaesthetic in a single appointment, usually around an hour. Most people go back to normal routines the next day.",
        },
        {
          title: "Healing",
          description:
            "The bone fuses with the implant over three to four months. We check it is settling well before the final stage.",
        },
        {
          title: "Crown fitted",
          description:
            "A custom crown, shade-matched to your other teeth, is fitted and checked for bite and comfort. You then clean it like any other tooth.",
        },
      ],
      faq: [
        {
          question: "Does getting an implant hurt?",
          answer:
            "The procedure is done under local anaesthetic, so you should not feel pain while it happens. Most people describe mild soreness for two to three days afterwards, which is usually managed with over-the-counter pain relief.",
        },
        {
          question: "How long does the whole process take?",
          answer:
            "A straightforward single implant usually takes three to four months from placement to final crown, because the bone needs time to fuse with the implant. If a bone graft is needed, the timeline can be longer and we will talk you through it at your consultation.",
        },
        {
          question: "Will the implant look like my other teeth?",
          answer:
            "Yes. The crown is custom-made to match the shade, shape and translucency of your surrounding teeth, and we check the fit and appearance with you before it is permanently fitted.",
        },
      ],
    },
    {
      slug: "braces",
      title: "Braces & clear aligners",
      shortDescription:
        "Straighten your smile discreetly with clear aligners or traditional braces.",
      longDescription:
        "Crooked or crowded teeth are easier to clean and kinder to your jaw when they are aligned. We offer metal and ceramic braces as well as clear aligner therapy, with a digital treatment plan so you can see the projected result before you start. Retainers and follow-up reviews are included in every plan.",
      priceFrom: 4200,
      durationMinutes: 45,
      whoFor: [
        "Your teeth are crowded, spaced or out of line in a way that makes them harder to clean.",
        "You have been told your bite is causing wear, or find yourself hiding your smile in photos.",
        "You want the projected result before you commit to months of treatment.",
      ],
      steps: [
        {
          title: "Consultation and scan",
          description:
            "A 15-minute consultation with a digital scan, so you can see the projected result and the likely timeline before you decide anything.",
        },
        {
          title: "Fitting",
          description:
            "Braces are fitted or your first aligners are issued, with clear instructions on wearing, cleaning and what to expect in the first week.",
        },
        {
          title: "Reviews",
          description:
            "Short check-ins every six to eight weeks to change wires or issue the next aligners and keep the teeth moving as planned.",
        },
        {
          title: "Retainers",
          description:
            "Retainers are fitted at the end and included in the plan, because straightened teeth drift back without them.",
        },
      ],
      faq: [
        {
          question: "Clear aligners or braces — which is right for me?",
          answer:
            "Clear aligners suit many mild to moderate cases and are removable for eating and brushing. Complex bite corrections may work better with fixed braces. Your consultation includes a scan and a recommendation with no pressure to decide on the day.",
        },
        {
          question: "How long will treatment take?",
          answer:
            "Most courses run between six and twenty-four months, depending on how far the teeth need to move. You will get an estimated timeline after your digital scan.",
        },
        {
          question: "Do you offer payment plans?",
          answer:
            "Yes. Braces and aligner treatment can be split into monthly interest-free instalments, arranged at your consultation.",
        },
      ],
    },
    {
      slug: "teeth-whitening",
      title: "Teeth whitening",
      shortDescription:
        "Professional whitening that lifts stains without wrecking sensitive teeth.",
      longDescription:
        "Our whitening is supervised by a dentist, so the strength of the gel and the fit of the trays are matched to your teeth rather than guessed at. Choose a single in-chair session for a fast result or a custom take-home kit for gradual, controllable whitening. We assess sensitivity and existing restorations first, so you know what to expect.",
      priceFrom: 299,
      durationMinutes: 60,
      whoFor: [
        "Your teeth have yellowed gradually from coffee, tea, red wine or smoking.",
        "You have a wedding, interview or photos coming up and want a brighter smile without veneers.",
        "You have tried shop-bought whitening and want a dentist-supervised option with proper trays.",
      ],
      steps: [
        {
          title: "Shade check and sensitivity screen",
          description:
            "We record your current shade, check for decay and gum problems, and ask about sensitivity and existing crowns or fillings.",
        },
        {
          title: "Whitening",
          description:
            "An in-chair session takes about an hour, or we make custom trays and you whiten at home over one to two weeks.",
        },
        {
          title: "Review",
          description:
            "We compare the shade, check your gums and top up desensitising gel. Custom trays let you repeat a short course later at home.",
        },
      ],
      faq: [
        {
          question: "Will whitening make my teeth sensitive?",
          answer:
            "Some people feel brief sensitivity for a day or two. We use desensitising agents before and after treatment, and you can pause a take-home kit whenever you need to.",
        },
        {
          question: "How long do the results last?",
          answer:
            "Typically six to twelve months, depending on coffee, tea, red wine and smoking. Your custom trays let you top up at home when you notice stains returning.",
        },
        {
          question: "Does whitening work on crowns or fillings?",
          answer:
            "Whitening only changes the colour of natural teeth, not crowns, veneers or composite fillings. If those are visible when you smile, we can discuss replacing them after whitening so the shades match.",
        },
      ],
    },
    {
      slug: "emergency-dentist",
      title: "Emergency dentist",
      shortDescription:
        "Same-day appointments for toothache, chips, swelling and knocked-out teeth.",
      longDescription:
        "Dental pain rarely waits for a convenient moment. We keep same-day slots free for emergencies such as severe toothache, facial swelling, broken teeth or trauma, and our team will triage you by phone before you arrive. The first visit focuses on getting you out of pain, with a clear plan and cost for anything that needs a follow-up.",
      priceFrom: 120,
      durationMinutes: 30,
      whoFor: [
        "You have toothache that painkillers are not controlling.",
        "A tooth has chipped, cracked, been knocked out or a filling has come loose.",
        "Your face or gum is swelling, or you have bleeding after an extraction.",
      ],
      steps: [
        {
          title: "Call us first",
          description:
            "We triage on the phone so we know what to prepare and can tell you how soon to come in — and what to do while you wait.",
        },
        {
          title: "Same-day visit",
          description:
            "The emergency appointment is 30 minutes and focuses on diagnosis and getting you out of pain, usually with X-rays on the day.",
        },
        {
          title: "Plan and price",
          description:
            "You leave with the immediate problem treated, a written plan for anything that needs a follow-up and a clear price before you book it.",
        },
      ],
      faq: [
        {
          question: "What should I do if a tooth is knocked out?",
          answer:
            "Handle the tooth by the crown, not the root, rinse it gently with milk or saline and try to place it back in the socket. If that is not possible, keep it in milk and call us immediately — the first sixty minutes matter most.",
        },
        {
          question: "Can I be seen today?",
          answer:
            "We hold same-day emergency slots during opening hours. Call us as early as you can and we will tell you the soonest available time.",
        },
        {
          question: "What does an emergency visit cost?",
          answer:
            "The emergency consultation and pain relief starts at $120, and that fee is credited against treatment if you go ahead with it. You will always receive a written estimate before any further work.",
        },
      ],
    },
    {
      slug: "general-checkup",
      title: "General check-up",
      shortDescription:
        "Exams, hygiene and digital X-rays to catch small problems early.",
      longDescription:
        "A regular check-up is the cheapest dentistry you will ever have. Each visit includes a full soft-tissue and tooth-by-tooth examination, digital X-rays where needed, a hygiene clean and a written summary of anything we are watching. We explain findings on screen and never begin treatment without your agreement.",
      priceFrom: 99,
      durationMinutes: 45,
      whoFor: [
        "It is six months or more since your last check-up.",
        "You have noticed a sensitivity, a rough edge or bleeding when you brush.",
        "You have moved to Austin and need a practice that keeps your records and reminds you when you are due.",
      ],
      steps: [
        {
          title: "Examination",
          description:
            "A tooth-by-tooth check of your teeth, gums and soft tissues, with digital X-rays only where they will change a decision.",
        },
        {
          title: "Hygiene clean",
          description:
            "Scale and polish to remove plaque and staining, with coaching on the parts of your mouth that need more attention at home.",
        },
        {
          title: "Written summary",
          description:
            "Anything we are watching, anything that needs treatment and what it costs — on paper, before you leave.",
        },
      ],
      faq: [
        {
          question: "How often should I have a check-up?",
          answer:
            "Most adults benefit from a check-up every six months. If you have gum disease, a history of decay or wear, we may recommend three-monthly reviews for a while.",
        },
        {
          question: "Are X-rays included?",
          answer:
            "A new patient exam includes a set of digital X-rays. At recall visits we only take images when they will change a decision, which keeps your radiation exposure as low as reasonably possible.",
        },
        {
          question: "Do you see children?",
          answer:
            "Yes, we welcome children from around their first tooth. Early visits are short and friendly so the dentist does not become a scary place.",
        },
      ],
    },
  ],

  locations: [
    {
      slug: "riverside",
      city: "Austin",
      area: "Riverside",
      address: {
        line1: "2401 Riverside Drive",
        line2: "Suite 120",
        city: "Austin",
        state: "TX",
        postalCode: "78741",
        country: "US",
      },
      geo: { lat: 30.2394, lng: -97.7276 },
      mapEmbedUrl:
        "https://www.google.com/maps?q=2401+Riverside+Drive+Suite+120+Austin+TX+78741&output=embed",
      phone: "+1 512 555 0142",
      description:
        "Our Riverside studio is a short walk from Lady Bird Lake, with step-free access from the street, a bus stop two minutes away and a parking garage next door. It is the practice's original home and still where most implant and cosmetic planning happens.",
    },
    {
      slug: "northgate",
      city: "Austin",
      area: "Northgate",
      address: {
        line1: "8100 Burnet Road",
        line2: "Suite 210",
        city: "Austin",
        state: "TX",
        postalCode: "78757",
        country: "US",
      },
      geo: { lat: 30.3585, lng: -97.7358 },
      mapEmbedUrl:
        "https://www.google.com/maps?q=8100+Burnet+Road+Suite+210+Austin+TX+78757&output=embed",
      phone: "+1 512 555 0187",
      description:
        "The Northgate studio opened in 2019 on Burnet Road, with free parking behind the building and a lift to the second floor. It is built around family appointments, with Saturday morning slots and a quiet room for anxious patients.",
    },
  ],

  insurancePartners: [
    { name: "Delta Dental", note: "Direct billing" },
    { name: "Cigna", note: "Direct billing" },
    { name: "MetLife", note: "Direct billing" },
    { name: "Aetna", note: "Direct billing" },
    { name: "Guardian", note: "Direct billing" },
    { name: "Humana", note: "Direct billing" },
    { name: "United Concordia" },
    {
      name: "Self-pay",
      note: "Transparent fees, no insurance needed",
      selfPay: true,
    },
  ],

  pricing: [
    {
      serviceSlug: "general-checkup",
      treatment: "New patient exam, X-rays & clean",
      price: 99,
      note: "First visit",
    },
    {
      serviceSlug: "general-checkup",
      treatment: "Routine hygiene visit",
      price: 145,
    },
    {
      serviceSlug: "general-checkup",
      treatment: "Composite filling",
      price: 195,
      note: "From",
    },
    {
      serviceSlug: "teeth-whitening",
      treatment: "Custom take-home whitening kit",
      price: 299,
    },
    {
      serviceSlug: "teeth-whitening",
      treatment: "In-chair whitening session",
      price: 349,
    },
    {
      serviceSlug: "implants",
      treatment: "Implant consultation & 3D scan",
      price: 150,
      note: "Credited against treatment",
    },
    {
      serviceSlug: "implants",
      treatment: "Single implant, abutment & crown",
      price: 3200,
      note: "From",
    },
    {
      serviceSlug: "braces",
      treatment: "Clear aligner consultation",
      price: 0,
      note: "Complimentary",
    },
    {
      serviceSlug: "braces",
      treatment: "Metal braces, full treatment",
      price: 4200,
      note: "From",
    },
    {
      serviceSlug: "emergency-dentist",
      treatment: "Emergency visit & pain relief",
      price: 120,
      note: "Credited against treatment",
    },
  ],

  pricingDisclaimer:
    "Prices are starting points, not quotes. Your final cost depends on an examination, any X-rays and the treatment plan we agree with you — always confirmed in writing before work begins.",

  cancellationPolicy:
    "Plans change, and that's okay. Please give us at least 24 hours' notice if you need to cancel or reschedule so we can offer the slot to another patient. Appointments cancelled with less than 24 hours' notice, or missed without notice, may be charged 50% of the reserved treatment value. If you are unwell or have an emergency, call us — we will always work something out.",

  trustPoints: [
    { key: "rating", value: "4.9 / 5", label: "Average patient rating" },
    {
      key: "experience",
      value: "18 years",
      label: "Caring for Austin smiles",
    },
    { key: "studios", value: "2 studios", label: "Riverside & Northgate" },
    { key: "emergency", value: "Same day", label: "Emergency appointments" },
  ],

  homeFaqs: [
    {
      question: "Will treatment hurt?",
      answer:
        "We numb the area before treatment and check in as we go, so tell us if you would like more anaesthetic at any point. You should not feel pain during the appointment; mild soreness for a day or two afterwards is common and usually managed with ordinary pain relief.",
    },
    {
      question: "I'm anxious about the dentist. Can you help?",
      answer:
        "Yes. Tell us when you book and we will allow extra time, explain each step before it happens and agree a stop signal with you. There is a quiet room at our Northgate studio, and nothing goes ahead until you are comfortable with the plan.",
    },
    {
      question: "What will my treatment cost?",
      answer:
        "Prices on this site are starting points, and your final cost depends on an examination, any X-rays and the plan we agree with you. You get a written estimate before treatment starts, and larger plans such as implants, braces and aligners can be split into monthly interest-free instalments.",
    },
    {
      question: "How long will my appointment take?",
      answer:
        "A check-up is booked for 45 minutes, an emergency visit for 30, and implant or whitening appointments for an hour. If we find something that needs more time, we will tell you before we start rather than run over.",
    },
    {
      question: "Do you accept my dental insurance?",
      answer:
        "We bill most major plans directly — see the full list on our insurance and pricing page. If yours is not listed, call us with your plan details and we will check your out-of-network benefits before you book.",
    },
    {
      question: "How quickly can I be seen in an emergency?",
      answer:
        "We hold same-day slots every day we are open for pain, swelling, broken teeth and trauma. Call as early as you can and we will triage you by phone and tell you the soonest time we can see you.",
    },
    {
      question: "Are you accepting new patients?",
      answer:
        "Yes — new patients of all ages are welcome at both studios. Book online, call the studio or send us a message and we will find a time that works.",
    },
  ],

  reviews: {
    intro:
      "A few words from patients who let us look after their teeth — and their nerves.",
    note: "Sample reviews and rating shown until the Google Places API is connected — they are replaced automatically once GOOGLE_PLACES_API_KEY is set.",
    fallbackRating: 4.9,
    fallbackTotal: 218,
    items: [
      {
        quote:
          "I cracked a molar on a Saturday morning and was in the chair by lunchtime. They got me out of pain, explained every option and never once made me feel rushed.",
        author: "Priya S.",
        treatment: "Emergency dentist",
        rating: 5,
      },
      {
        quote:
          "The whitening was far gentler than I expected. My teeth look naturally brighter, not fake, and the sensitivity only lasted a day.",
        author: "Marcus L.",
        treatment: "Teeth whitening",
        rating: 5,
      },
      {
        quote:
          "I put off my implant for two years because I was scared. The team walked me through the scans, the cost and the timeline, and the final crown matches perfectly.",
        author: "Dana R.",
        treatment: "Dental implants",
        rating: 5,
      },
    ],
  },

  gallery: {
    intro:
      "Drag the handle — or use the arrow keys — to compare the start and finish of three recent treatment plans.",
    consentNote:
      "The images on this page are illustrations created for this template, not photographs of patients. When real patient photos are added, they are published only with written consent.",
    cases: [
      {
        slug: "whitening",
        title: "In-chair whitening",
        serviceSlug: "teeth-whitening",
        caption:
          "Two shades lighter after a single 60-minute session. Individual results vary.",
        before: {
          src: "/gallery/whitening-before.svg",
          alt: "Illustration of slightly yellowed teeth before professional whitening",
        },
        after: {
          src: "/gallery/whitening-after.svg",
          alt: "Illustration of brighter, whiter teeth after professional whitening",
        },
      },
      {
        slug: "braces",
        title: "Ceramic braces",
        serviceSlug: "braces",
        caption:
          "Crowding corrected over 14 months, with retainers included in the plan.",
        before: {
          src: "/gallery/braces-before.svg",
          alt: "Illustration of crowded teeth with braces before orthodontic treatment",
        },
        after: {
          src: "/gallery/braces-after.svg",
          alt: "Illustration of evenly aligned teeth after braces treatment",
        },
      },
      {
        slug: "implant",
        title: "Single implant",
        serviceSlug: "implants",
        caption:
          "A missing molar replaced with an implant and a shade-matched crown.",
        before: {
          src: "/gallery/implant-before.svg",
          alt: "Illustration of a smile with a missing molar before implant treatment",
        },
        after: {
          src: "/gallery/implant-after.svg",
          alt: "Illustration of a complete smile after an implant and crown were fitted",
        },
      },
    ],
  },

  about: {
    intro:
      "Independent, dentist-owned and deliberately unhurried — Lumen was built for people who would rather ask questions than be rushed.",
    story: [
      "Lumen Dental Studio opened on Riverside Drive in 2008 with two chairs, one dentist and a rule that still stands: no treatment starts until you understand why it is needed and what it costs.",
      "Today the practice has two Austin studios and a team of clinicians who share the same approach — prevention first, conservative treatment, and a written plan you agree to before anything begins.",
    ],
    values: [
      {
        title: "Explain first",
        description:
          "Findings are shown on screen, options are compared openly and nothing is decided for you in the chair.",
      },
      {
        title: "Treat only what is needed",
        description:
          "If a tooth can be watched or repaired simply, we will say so — even when a bigger treatment would pay better.",
      },
      {
        title: "Comfort is clinical",
        description:
          "Numbing that actually works, breaks whenever you need them and a team that checks in as we go.",
      },
    ],
    team: [
      {
        name: "Dr. Maya Okafor",
        role: "Principal dentist & founder",
        bio: "Maya founded Lumen in 2008 after a decade in community dentistry. She leads the practice's preventive and cosmetic work and is the person to ask about whitening or a nervous first visit.",
      },
      {
        name: "Dr. Leo Marchetti",
        role: "Implant and restorative dentist",
        bio: "Leo plans and places implants at both studios, with a particular interest in full-arch cases and rebuilding worn teeth without unnecessary work.",
      },
      {
        name: "Sofia Reyes",
        role: "Practice manager",
        bio: "Sofia runs the front desk, insurance checks and scheduling. If a plan needs to fit around work or a budget, she is the one who makes it work.",
      },
    ],
  },

  contactForm: {
    intro:
      "Tell us what you need and we will reply by email or phone within one business day.",
    submitLabel: "Send enquiry",
    successTitle: "Thanks — your message is on its way",
    successMessage:
      "We have sent your enquiry to the studio and will reply within one business day. If it is urgent, please call us instead.",
    privacyNote:
      "We use your details only to answer this enquiry. We never sell or share them.",
  },
};

export function getService(slug: string): Service | undefined {
  return siteConfig.services.find((service) => service.slug === slug);
}

export function getLocation(slug: string): Location | undefined {
  return siteConfig.locations.find((location) => location.slug === slug);
}

export type Villa = {
  slug: string;
  name: string;
  location: string;
  region: string;
  guests_min: number;
  guests_max: number;
  bedrooms: number;
  bathrooms: number;
  tag: string;
  short_description: string;
  long_description: string;
  price_per_night: number; // in EUR
  amenities: string[];
  highlights: string[];
  cover_icon: string;
  images: string[];
  published?: boolean;
};

export const villas: Villa[] = [
  {
    slug: "villa-tirta",
    name: "Villa Tirta",
    location: "Ubud, Bali",
    region: "Ubud",
    guests_min: 2,
    guests_max: 4,
    bedrooms: 2,
    bathrooms: 2,
    tag: "Meest geboekt",
    short_description: "Privé villa met infinity pool en uitzicht over de rijstterrassen van Ubud.",
    long_description: `Villa Tirta ligt verscholen tussen de weelderige rijstterrassen van Ubud, het culturele hart van Bali. Vanaf het moment dat je aankomt, word je omgeven door de rust van de natuur en de warme gastvrijheid van het Balinese personeel.

De villa beschikt over twee slaapkamers met kingsize bedden, elk voorzien van een en-suite badkamer met open-air douche. De privé infinity pool lijkt naadloos over te vloeien in het uitzicht op de rijstterrassen — het perfecte decor voor een onvergetelijke zonsopgang.

Een toegewijde butler regelt alles: van het dagelijks ontbijt op het terras tot het reserveren van een romantisch diner in het nabijgelegen Ubud. Edwin en Citty kennen deze villa als hun broekzak en zorgen dat alles perfect op elkaar is afgestemd.`,
    price_per_night: 350,
    amenities: [
      "Privé infinity pool",
      "Butler service",
      "Rijstterrassen uitzicht",
      "Dagelijks ontbijt",
      "Airconditioning",
      "Gratis WiFi",
      "Privé terras",
      "Buitendouche",
      "Keuken",
      "BBQ faciliteiten",
    ],
    highlights: [
      "Uitzicht over de rijstterrassen",
      "Volledig privé — geen gedeelde ruimtes",
      "10 min lopen van het centrum van Ubud",
      "Dagelijks schoonmaak inbegrepen",
    ],
    cover_icon: "🌾",
    images: [
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80&auto=format&fit=crop",
    ],
  },
  {
    slug: "villa-samudra",
    name: "Villa Samudra",
    location: "Seminyak, Bali",
    region: "Seminyak",
    guests_min: 2,
    guests_max: 2,
    bedrooms: 1,
    bathrooms: 1,
    tag: "Romantisch",
    short_description: "Intieme romantische villa met oceaan uitzicht en privé terras in het trendy Seminyak.",
    long_description: `Villa Samudra is dé keuze voor koppels die willen genieten van het beste wat Seminyak te bieden heeft. De villa is sfeervol ingericht met lokale Balinese kunst en design, en biedt een onbelemmerd uitzicht over de Indische Oceaan.

Geniet van de champagne die klaarstaat bij aankomst op jullie privé terras, terwijl de zon langzaam in de oceaan zakt. De slaapkamer is voorzien van een luxe kingsize bed met mousseline gordijnen, perfecte airconditioning en een privé badkamer met vrijstaand bad.

Alle spa-behandelingen kunnen op aanvraag in de villa plaatsvinden — van een Balinese massage tot een luxe bodyscrub met lokale ingrediënten. Edwin en Citty zorgen persoonlijk dat elk detail klopt voor jullie romantische verblijf.`,
    price_per_night: 280,
    amenities: [
      "Oceaan uitzicht",
      "Privé terras",
      "Champagne bij aankomst",
      "Spa behandelingen op aanvraag",
      "Kingsize bed",
      "Vrijstaand bad",
      "Airconditioning",
      "Gratis WiFi",
      "Dagtocht service",
      "Turndown service",
    ],
    highlights: [
      "Spectaculair uitzicht over de oceaan",
      "Op loopafstand van Seminyak's beste stranden",
      "Romantisch ingericht met lokale kunst",
      "Spa op aanvraag direct in de villa",
    ],
    cover_icon: "🌊",
    images: [
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1200&q=80&auto=format&fit=crop",
    ],
  },
  {
    slug: "villa-puri-agung",
    name: "Villa Puri Agung",
    location: "Canggu, Bali",
    region: "Canggu",
    guests_min: 8,
    guests_max: 12,
    bedrooms: 5,
    bathrooms: 5,
    tag: "Grote groep",
    short_description: "Monumentale villa voor grote groepen met volledig personeel, eigen chef en groot privézwembad.",
    long_description: `Villa Puri Agung is een indrukwekkend verblijf voor wie Bali in grote stijl wil vieren. Met vijf royale slaapkamers, een groot privézwembad en een volledig personeelsteam is deze villa perfect voor familievakanties, vriendengroepen of speciale gelegenheden.

De villa is gebouwd in traditionele Balinese architectuurstijl, met open-air woonruimtes en een grote entertainment area. De eigen chef bereidt dagelijks verse maaltijden op aanvraag — van Balinese specialiteiten tot internationaal comfort food.

Het volledig personeel — butler, kok, huishoudelijk medewerkers en beveiliger — zorgt ervoor dat elke gast zich als een VIP voelt. Edwin en Citty coördineren alles vooraf zodat jij alleen maar hoeft te genieten.`,
    price_per_night: 1200,
    amenities: [
      "Groot privézwembad",
      "Volledig personeel",
      "Entertainment ruimte",
      "Eigen chef",
      "5 en-suite slaapkamers",
      "Buitenbar",
      "Tuin met zithoeken",
      "24/7 beveiliging",
      "Airconditioning",
      "Gratis WiFi",
    ],
    highlights: [
      "Volledig personeel aanwezig 24/7",
      "Eigen chef met dagelijks vers menu",
      "Groot zwembad — ideaal voor groepen",
      "Op loopafstand van Canggu's surf beaches",
    ],
    cover_icon: "🏛️",
    images: [
      "https://images.unsplash.com/photo-1596436756869-e0a5af6e6fa6?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582610116397-edb72f9b8d14?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540541338537-71cf5d2e2b5e?w=1200&q=80&auto=format&fit=crop",
    ],
  },
  {
    slug: "villa-hijau",
    name: "Villa Hijau",
    location: "Ubud, Bali",
    region: "Ubud",
    guests_min: 4,
    guests_max: 6,
    bedrooms: 3,
    bathrooms: 3,
    tag: "Eco Luxury",
    short_description: "Duurzame eco-luxury villa midden in de jungle van Ubud, met yoga paviljoen en organisch ontbijt.",
    long_description: `Villa Hijau is een uniek verblijf voor de bewuste reiziger die luxe niet ten koste wil laten gaan van het milieu. De villa is volledig duurzaam gebouwd met lokale materialen, omringd door weelderig tropisch groen.

Begin elke ochtend met een yogasessie in het open-air paviljoen, gevolgd door een uitgebreid organisch ontbijt met producten van lokale boeren. De drie slaapkamers zijn sfeervol ingericht met lokaal hout en bamboe, en bieden een gevoel van totale verbondenheid met de natuur.

De jungle-omgeving biedt de ideale achtergrond voor meditatie, stilte en herstel. Edwin en Citty werken nauw samen met de villa-eigenaar — een Balinese familie die al generaties lang in Ubud woont — om een authentieke ervaring te bieden.`,
    price_per_night: 420,
    amenities: [
      "Duurzaam gebouwd",
      "Jungle omgeving",
      "Yoga paviljoen",
      "Organisch ontbijt",
      "Privé zwembad",
      "Bamboe meubels",
      "Buitendouche",
      "Meditatie ruimte",
      "Gratis WiFi",
      "Fietsen beschikbaar",
    ],
    highlights: [
      "100% duurzaam gebouwd met lokale materialen",
      "Dagelijks organisch ontbijt van lokale boeren",
      "Yoga en meditatie paviljoen",
      "Volledig omgeven door jungle — absolute rust",
    ],
    cover_icon: "🌿",
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&q=80&auto=format&fit=crop",
    ],
  },
  {
    slug: "villa-karang",
    name: "Villa Karang",
    location: "Uluwatu, Bali",
    region: "Uluwatu",
    guests_min: 2,
    guests_max: 4,
    bedrooms: 2,
    bathrooms: 2,
    tag: "Klif uitzicht",
    short_description: "Spectaculaire klif villa met onbegrensd uitzicht over de Indische Oceaan en privé strand toegang.",
    long_description: `Villa Karang staat op een van de meest adembenemende locaties op Bali: een klif met een direct, onbelemmerd uitzicht over de Indische Oceaan. De sunsets hier zijn legendarisch — je ziet ze letterlijk de oceaan inkleuren vanuit je eigen infinity pool.

De villa heeft twee luxe slaapkamers en een ruim buitenterras dat naadloos overloopt in een privé infinity pool. Direct vanuit de villa heb je toegang tot een privé trap die afdaalt naar een klein, afgelegen strand — perfect voor snorkelen of gewoon genieten van de zee.

Uluwatu is het domein van de surfer, de yogi en de zoeker van stilte. Edwin en Citty kennen alle locals hier en zorgen voor aanbevelingen die je niet in een reisgids vindt.`,
    price_per_night: 550,
    amenities: [
      "Spectaculair klif uitzicht",
      "Privé infinity pool",
      "Sunset lounge",
      "Privé toegang strand",
      "Buitenterras",
      "Kingsize bedden",
      "Airconditioning",
      "Gratis WiFi",
      "Ontbijt beschikbaar",
      "Surfer-friendly locatie",
    ],
    highlights: [
      "Directe klif-tot-oceaan uitzicht",
      "Privé strand toegang via villa trap",
      "Legendarische sunsets vanaf het terras",
      "Nabij Uluwatu tempel en surfers paradise",
    ],
    cover_icon: "🌅",
    images: [
      "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=1200&q=80&auto=format&fit=crop",
    ],
  },
  {
    slug: "villa-lotus",
    name: "Villa Lotus",
    location: "Nusa Dua, Bali",
    region: "Nusa Dua",
    guests_min: 6,
    guests_max: 8,
    bedrooms: 4,
    bathrooms: 4,
    tag: "Gezin",
    short_description: "Gezinsvriendelijke beachfront villa met spacieuze tuin, kindvriendelijke voorzieningen en 24/7 beveiliging.",
    long_description: `Villa Lotus is de ideale keuze voor gezinnen die Bali willen ontdekken zonder in te leveren op comfort of veiligheid. De villa ligt direct aan het strand van Nusa Dua — een van de rustigste en veiligste strandgebieden van Bali.

Met vier ruime slaapkamers en een grote tuin met zwembad is er volop ruimte voor het hele gezin. Het zwembad heeft een apart ondiep gedeelte voor de kleinsten, en de tuin biedt volop ruimte voor spelende kinderen. De villa is volledig beveiligd met 24/7 bewaking.

Edwin en Citty werken samen met kindercoaches en lokale activiteitenpartners die speciaal aanbod voor gezinnen organiseren — van kooklessen voor kinderen tot Balinese dansen en batik workshops.`,
    price_per_night: 750,
    amenities: [
      "Beachfront locatie",
      "Kindvriendelijk zwembad",
      "Spacieuze tuin",
      "24/7 beveiliging",
      "Babycot beschikbaar",
      "Kinderstoel",
      "Airconditioning",
      "Gratis WiFi",
      "Kinderactiviteiten op aanvraag",
      "Direct strand toegang",
    ],
    highlights: [
      "Direct aan het strand van Nusa Dua",
      "Kindvriendelijk zwembad met ondiep gedeelte",
      "24/7 beveiliging en beveiligde omgeving",
      "Kinderactiviteiten en workshops op aanvraag",
    ],
    cover_icon: "🏖️",
    images: [
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563789031959-4f1b0d300fba?w=1200&q=80&auto=format&fit=crop",
    ],
  },
];

export function getVillaBySlug(slug: string): Villa | undefined {
  return villas.find((v) => v.slug === slug);
}

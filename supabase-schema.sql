-- ============================================================
-- BaliLiving — Supabase Database Schema
-- Run this once in your Supabase SQL Editor
-- ============================================================

-- Villas table
CREATE TABLE IF NOT EXISTS villas (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text UNIQUE NOT NULL,
  name            text NOT NULL,
  location        text NOT NULL,
  region          text NOT NULL DEFAULT '',
  tag             text NOT NULL DEFAULT '',
  short_description text NOT NULL DEFAULT '',
  long_description  text NOT NULL DEFAULT '',
  guests_min      integer NOT NULL DEFAULT 1,
  guests_max      integer NOT NULL DEFAULT 2,
  bedrooms        integer NOT NULL DEFAULT 1,
  bathrooms       integer NOT NULL DEFAULT 1,
  price_per_night integer NOT NULL,
  amenities       text[] NOT NULL DEFAULT '{}',
  highlights      text[] NOT NULL DEFAULT '{}',
  cover_icon      text NOT NULL DEFAULT '🏡',
  published       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Villa media (photos & videos)
CREATE TABLE IF NOT EXISTS villa_media (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  villa_id    uuid NOT NULL REFERENCES villas(id) ON DELETE CASCADE,
  url         text NOT NULL,
  type        text NOT NULL CHECK (type IN ('photo', 'video')),
  sort_order  integer NOT NULL DEFAULT 0,
  caption     text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Blocked dates (booked or unavailable)
CREATE TABLE IF NOT EXISTS blocked_dates (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  villa_id    uuid NOT NULL REFERENCES villas(id) ON DELETE CASCADE,
  blocked_date date NOT NULL,
  reason      text NOT NULL DEFAULT 'booking',
  UNIQUE (villa_id, blocked_date)
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  villa_id      uuid NOT NULL REFERENCES villas(id),
  villa_name    text NOT NULL DEFAULT '',
  guest_name    text NOT NULL,
  guest_email   text NOT NULL,
  guest_phone   text NOT NULL DEFAULT '',
  guest_count   integer NOT NULL DEFAULT 1,
  check_in      date NOT NULL,
  check_out     date NOT NULL,
  total_nights  integer NOT NULL,
  total_price   integer NOT NULL,
  status        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  notes         text NOT NULL DEFAULT '',
  admin_notes   text NOT NULL DEFAULT '',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Admin devices (push tokens for mobile app notifications)
CREATE TABLE IF NOT EXISTS admin_devices (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  push_token  text NOT NULL UNIQUE,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE villas ENABLE ROW LEVEL SECURITY;
ALTER TABLE villa_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Villas: public can read published ones; only auth users can write
CREATE POLICY "Public read published villas"
  ON villas FOR SELECT
  USING (published = true);

CREATE POLICY "Auth users can manage villas"
  ON villas FOR ALL
  USING (auth.role() = 'authenticated');

-- Villa media: public can read; only auth users can write
CREATE POLICY "Public read villa media"
  ON villa_media FOR SELECT
  USING (true);

CREATE POLICY "Auth users can manage villa media"
  ON villa_media FOR ALL
  USING (auth.role() = 'authenticated');

-- Blocked dates: public can read; only auth users can write
CREATE POLICY "Public read blocked dates"
  ON blocked_dates FOR SELECT
  USING (true);

CREATE POLICY "Auth users can manage blocked dates"
  ON blocked_dates FOR ALL
  USING (auth.role() = 'authenticated');

-- Admin devices: only authenticated users can manage
ALTER TABLE admin_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth users can manage admin devices"
  ON admin_devices FOR ALL
  USING (auth.role() = 'authenticated');

-- Bookings: anyone can insert (guests booking); only auth users can read/update
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Auth users can read all bookings"
  ON bookings FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can update bookings"
  ON bookings FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- Seed villas from existing static data
-- ============================================================

INSERT INTO villas (slug, name, location, region, tag, short_description, long_description, guests_min, guests_max, bedrooms, bathrooms, price_per_night, amenities, highlights, cover_icon, published) VALUES

('villa-tirta', 'Villa Tirta', 'Ubud, Bali', 'Ubud', 'Meest geboekt',
 'Privé villa met infinity pool en uitzicht over de rijstterrassen van Ubud.',
 'Villa Tirta ligt verscholen tussen de weelderige rijstterrassen van Ubud, het culturele hart van Bali. Vanaf het moment dat je aankomt, word je omgeven door de rust van de natuur en de warme gastvrijheid van het Balinese personeel.

De villa beschikt over twee slaapkamers met kingsize bedden, elk voorzien van een en-suite badkamer met open-air douche. De privé infinity pool lijkt naadloos over te vloeien in het uitzicht op de rijstterrassen — het perfecte decor voor een onvergetelijke zonsopgang.

Een toegewijde butler regelt alles: van het dagelijks ontbijt op het terras tot het reserveren van een romantisch diner in het nabijgelegen Ubud. Edwin en Citty kennen deze villa als hun broekzak en zorgen dat alles perfect op elkaar is afgestemd.',
 2, 4, 2, 2, 350,
 ARRAY['Privé infinity pool','Butler service','Rijstterrassen uitzicht','Dagelijks ontbijt','Airconditioning','Gratis WiFi','Privé terras','Buitendouche','Keuken','BBQ faciliteiten'],
 ARRAY['Uitzicht over de rijstterrassen','Volledig privé — geen gedeelde ruimtes','10 min lopen van het centrum van Ubud','Dagelijks schoonmaak inbegrepen'],
 '🌾', true),

('villa-samudra', 'Villa Samudra', 'Seminyak, Bali', 'Seminyak', 'Romantisch',
 'Intieme romantische villa met oceaan uitzicht en privé terras in het trendy Seminyak.',
 'Villa Samudra is dé keuze voor koppels die willen genieten van het beste wat Seminyak te bieden heeft. De villa is sfeervol ingericht met lokale Balinese kunst en design, en biedt een onbelemmerd uitzicht over de Indische Oceaan.

Geniet van de champagne die klaarstaat bij aankomst op jullie privé terras, terwijl de zon langzaam in de oceaan zakt. De slaapkamer is voorzien van een luxe kingsize bed met mousseline gordijnen, perfecte airconditioning en een privé badkamer met vrijstaand bad.

Alle spa-behandelingen kunnen op aanvraag in de villa plaatsvinden — van een Balinese massage tot een luxe bodyscrub met lokale ingrediënten. Edwin en Citty zorgen persoonlijk dat elk detail klopt voor jullie romantische verblijf.',
 2, 2, 1, 1, 280,
 ARRAY['Oceaan uitzicht','Privé terras','Champagne bij aankomst','Spa behandelingen op aanvraag','Kingsize bed','Vrijstaand bad','Airconditioning','Gratis WiFi','Dagtocht service','Turndown service'],
 ARRAY['Spectaculair uitzicht over de oceaan','Op loopafstand van Seminyak''s beste stranden','Romantisch ingericht met lokale kunst','Spa op aanvraag direct in de villa'],
 '🌊', true),

('villa-puri-agung', 'Villa Puri Agung', 'Canggu, Bali', 'Canggu', 'Grote groep',
 'Monumentale villa voor grote groepen met volledig personeel, eigen chef en groot privézwembad.',
 'Villa Puri Agung is een indrukwekkend verblijf voor wie Bali in grote stijl wil vieren. Met vijf royale slaapkamers, een groot privézwembad en een volledig personeelsteam is deze villa perfect voor familievakanties, vriendengroepen of speciale gelegenheden.',
 8, 12, 5, 5, 1200,
 ARRAY['Groot privézwembad','Volledig personeel','Entertainment ruimte','Eigen chef','5 en-suite slaapkamers','Buitenbar','Tuin met zithoeken','24/7 beveiliging','Airconditioning','Gratis WiFi'],
 ARRAY['Volledig personeel aanwezig 24/7','Eigen chef met dagelijks vers menu','Groot zwembad — ideaal voor groepen','Op loopafstand van Canggu''s surf beaches'],
 '🏛️', true),

('villa-hijau', 'Villa Hijau', 'Ubud, Bali', 'Ubud', 'Eco Luxury',
 'Duurzame eco-luxury villa midden in de jungle van Ubud, met yoga paviljoen en organisch ontbijt.',
 'Villa Hijau is een uniek verblijf voor de bewuste reiziger die luxe niet ten koste wil laten gaan van het milieu. De villa is volledig duurzaam gebouwd met lokale materialen, omringd door weelderig tropisch groen.

Begin elke ochtend met een yogasessie in het open-air paviljoen, gevolgd door een uitgebreid organisch ontbijt met producten van lokale boeren.',
 4, 6, 3, 3, 420,
 ARRAY['Duurzaam gebouwd','Jungle omgeving','Yoga paviljoen','Organisch ontbijt','Privé zwembad','Bamboe meubels','Buitendouche','Meditatie ruimte','Gratis WiFi','Fietsen beschikbaar'],
 ARRAY['100% duurzaam gebouwd met lokale materialen','Dagelijks organisch ontbijt van lokale boeren','Yoga en meditatie paviljoen','Volledig omgeven door jungle — absolute rust'],
 '🌿', true),

('villa-karang', 'Villa Karang', 'Uluwatu, Bali', 'Uluwatu', 'Klif uitzicht',
 'Spectaculaire klif villa met onbegrensd uitzicht over de Indische Oceaan en privé strand toegang.',
 'Villa Karang staat op een van de meest adembenemende locaties op Bali: een klif met een direct, onbelemmerd uitzicht over de Indische Oceaan. De sunsets hier zijn legendarisch — je ziet ze letterlijk de oceaan inkleuren vanuit je eigen infinity pool.',
 2, 4, 2, 2, 550,
 ARRAY['Spectaculair klif uitzicht','Privé infinity pool','Sunset lounge','Privé toegang strand','Buitenterras','Kingsize bedden','Airconditioning','Gratis WiFi','Ontbijt beschikbaar','Surfer-friendly locatie'],
 ARRAY['Directe klif-tot-oceaan uitzicht','Privé strand toegang via villa trap','Legendarische sunsets vanaf het terras','Nabij Uluwatu tempel en surfers paradise'],
 '🌅', true),

('villa-lotus', 'Villa Lotus', 'Nusa Dua, Bali', 'Nusa Dua', 'Gezin',
 'Gezinsvriendelijke beachfront villa met spacieuze tuin, kindvriendelijke voorzieningen en 24/7 beveiliging.',
 'Villa Lotus is de ideale keuze voor gezinnen die Bali willen ontdekken zonder in te leveren op comfort of veiligheid. De villa ligt direct aan het strand van Nusa Dua — een van de rustigste en veiligste strandgebieden van Bali.',
 6, 8, 4, 4, 750,
 ARRAY['Beachfront locatie','Kindvriendelijk zwembad','Spacieuze tuin','24/7 beveiliging','Babycot beschikbaar','Kinderstoel','Airconditioning','Gratis WiFi','Kinderactiviteiten op aanvraag','Direct strand toegang'],
 ARRAY['Direct aan het strand van Nusa Dua','Kindvriendelijk zwembad met ondiep gedeelte','24/7 beveiliging en beveiligde omgeving','Kinderactiviteiten en workshops op aanvraag'],
 '🏖️', true)

ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Tours table
-- ============================================================
CREATE TABLE IF NOT EXISTS tours (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  location          text NOT NULL DEFAULT '',
  short_description text NOT NULL DEFAULT '',
  long_description  text NOT NULL DEFAULT '',
  price_per_person  integer NOT NULL DEFAULT 0,
  duration_hours    numeric NOT NULL DEFAULT 0,
  max_guests        integer NOT NULL DEFAULT 10,
  published         boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published tours"
  ON tours FOR SELECT
  USING (published = true);

CREATE POLICY "Auth users can manage tours"
  ON tours FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================
-- Transfers table
-- ============================================================
CREATE TABLE IF NOT EXISTS transfers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  from_location   text NOT NULL DEFAULT '',
  to_location     text NOT NULL DEFAULT '',
  description     text NOT NULL DEFAULT '',
  price           integer NOT NULL DEFAULT 0,
  vehicle_type    text NOT NULL DEFAULT 'car' CHECK (vehicle_type IN ('car', 'van', 'minibus')),
  max_passengers  integer NOT NULL DEFAULT 4,
  published       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published transfers"
  ON transfers FOR SELECT
  USING (published = true);

CREATE POLICY "Auth users can manage transfers"
  ON transfers FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================
-- Restaurants table
-- ============================================================
CREATE TABLE IF NOT EXISTS restaurants (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  location          text NOT NULL DEFAULT '',
  cuisine           text NOT NULL DEFAULT '',
  price_range       text NOT NULL DEFAULT '€€',
  short_description text NOT NULL DEFAULT '',
  long_description  text NOT NULL DEFAULT '',
  opening_hours     text NOT NULL DEFAULT '',
  phone             text NOT NULL DEFAULT '',
  website           text NOT NULL DEFAULT '',
  published         boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published restaurants"
  ON restaurants FOR SELECT
  USING (published = true);

CREATE POLICY "Auth users can manage restaurants"
  ON restaurants FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================
-- Transfer Requests table (customer-submitted on-demand transfers)
-- ============================================================
CREATE TABLE IF NOT EXISTS transfer_requests (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_location         text NOT NULL,
  to_location           text NOT NULL,
  transfer_date         date NOT NULL,
  transfer_time         text NOT NULL DEFAULT '',
  passengers            integer NOT NULL DEFAULT 1,
  tier                  text NOT NULL DEFAULT 'normaal' CHECK (tier IN ('normaal', 'luxe', 'vip')),
  guest_name            text NOT NULL,
  guest_email           text NOT NULL,
  guest_phone           text NOT NULL DEFAULT '',
  notes                 text NOT NULL DEFAULT '',
  ai_recommendation     text NOT NULL DEFAULT '',
  estimated_travel_time text NOT NULL DEFAULT '',
  luggage               text NOT NULL DEFAULT '',
  occasion              text NOT NULL DEFAULT '',
  status                text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  price_quoted          integer,
  price_type            text CHECK (price_type IN ('per_person', 'total')),
  created_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE transfer_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a transfer request
CREATE POLICY "Anyone can create transfer requests"
  ON transfer_requests FOR INSERT
  WITH CHECK (true);

-- Only authenticated users (admin) can read and update
CREATE POLICY "Auth users can read transfer requests"
  ON transfer_requests FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can update transfer requests"
  ON transfer_requests FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- Contact Inquiries table (contact form submissions)
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  naam        text NOT NULL,
  email       text NOT NULL,
  telefoon    text NOT NULL DEFAULT '',
  interesse   text NOT NULL DEFAULT '',
  reisdatum   text NOT NULL DEFAULT '',
  bericht     text NOT NULL,
  status      text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact inquiry
CREATE POLICY "Anyone can create contact inquiries"
  ON contact_inquiries FOR INSERT
  WITH CHECK (true);

-- Only authenticated users (admin) can read and update
CREATE POLICY "Auth users can read contact inquiries"
  ON contact_inquiries FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can update contact inquiries"
  ON contact_inquiries FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- Villa Reviews table (guest reviews per villa)
-- ============================================================
CREATE TABLE IF NOT EXISTS villa_reviews (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  villa_slug      text NOT NULL,
  booking_id      uuid REFERENCES bookings(id) ON DELETE SET NULL,
  reviewer_name   text NOT NULL,
  reviewer_email  text NOT NULL,
  rating          smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text     text NOT NULL,
  published       boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS villa_reviews_slug_idx ON villa_reviews (villa_slug);

ALTER TABLE villa_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read published reviews
CREATE POLICY "Public read published reviews"
  ON villa_reviews FOR SELECT
  USING (published = true);

-- Anyone can submit a review
CREATE POLICY "Anyone can create review"
  ON villa_reviews FOR INSERT
  WITH CHECK (true);

-- Only authenticated users (admin) can update/publish reviews
CREATE POLICY "Auth users can update reviews"
  ON villa_reviews FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can delete reviews"
  ON villa_reviews FOR DELETE
  USING (auth.role() = 'authenticated');

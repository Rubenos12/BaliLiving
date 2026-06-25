-- ============================================================
-- Visa Applications Table
-- Run this in the Supabase SQL editor for your project.
-- ============================================================

CREATE TABLE IF NOT EXISTS visa_applications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Applicant details
  applicant_name  TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT,
  nationality     TEXT NOT NULL,

  -- Passport
  passport_number TEXT,
  passport_expiry DATE,

  -- Travel
  travel_date     DATE NOT NULL,
  return_date     DATE NOT NULL,
  num_travelers   INTEGER NOT NULL DEFAULT 1,

  -- Visa
  visa_type       TEXT NOT NULL DEFAULT 'tourist',
  -- Allowed values: 'tourist', 'business', 'social', 'other'

  -- Notes
  notes           TEXT,   -- from applicant
  admin_notes     TEXT,   -- internal admin notes

  -- Status
  status          TEXT NOT NULL DEFAULT 'pending'
  -- Allowed values: 'pending', 'in_progress', 'approved', 'rejected'
);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER visa_applications_updated_at
  BEFORE UPDATE ON visa_applications
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================================
-- Admin helper: returns true only for users whose JWT
-- app_metadata.role === 'admin' (set via Supabase Auth admin API
-- or service role key — regular users cannot set this themselves).
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
$$;

-- ============================================================
-- Row Level Security
-- Enable RLS so only admins can read/write sensitive tables.
-- Public (anon) users can only INSERT where noted.
-- ============================================================

ALTER TABLE visa_applications ENABLE ROW LEVEL SECURITY;

-- Drop overly-permissive policies if they exist (idempotent fix)
DROP POLICY IF EXISTS "Authenticated users can manage visa_applications" ON visa_applications;
DROP POLICY IF EXISTS "Authenticated can manage bookings"                ON bookings;
DROP POLICY IF EXISTS "Authenticated can manage villas"                  ON villas;
DROP POLICY IF EXISTS "Authenticated can manage blocked_dates"           ON blocked_dates;
DROP POLICY IF EXISTS "Authenticated can manage restaurants"             ON restaurants;
DROP POLICY IF EXISTS "Authenticated can manage tours"                   ON tours;
DROP POLICY IF EXISTS "Authenticated can manage admin_devices"           ON admin_devices;

-- Admins only can read/update/delete visa applications
CREATE POLICY "Admins can manage visa_applications"
  ON visa_applications
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Public can submit a new application (INSERT only, no SELECT)
CREATE POLICY "Public can submit visa applications"
  ON visa_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- ============================================================
-- Also add RLS to other tables if not already present.
-- Run only the blocks that apply to your setup.
-- ============================================================

-- bookings: public can insert, only admins can manage all
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can create bookings" ON bookings;
CREATE POLICY "Public can create bookings"
  ON bookings FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Admins can manage bookings"
  ON bookings FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- villas: public can read published, only admins can manage
ALTER TABLE villas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published villas" ON villas;
CREATE POLICY "Public can read published villas"
  ON villas FOR SELECT TO anon USING (published = true);

CREATE POLICY "Admins can manage villas"
  ON villas FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- blocked_dates: public can read (needed for booking calendar), only admins can manage
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read blocked_dates" ON blocked_dates;
CREATE POLICY "Public can read blocked_dates"
  ON blocked_dates FOR SELECT TO anon USING (true);

CREATE POLICY "Admins can manage blocked_dates"
  ON blocked_dates FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- restaurants: public can read published, only admins can manage
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published restaurants" ON restaurants;
CREATE POLICY "Public can read published restaurants"
  ON restaurants FOR SELECT TO anon USING (published = true);

CREATE POLICY "Admins can manage restaurants"
  ON restaurants FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- tours: public can read published, only admins can manage
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published tours" ON tours;
CREATE POLICY "Public can read published tours"
  ON tours FOR SELECT TO anon USING (published = true);

CREATE POLICY "Admins can manage tours"
  ON tours FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- admin_devices: only admins
ALTER TABLE admin_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage admin_devices"
  ON admin_devices FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

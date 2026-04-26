-- ========== ENUMS ==========
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.booking_type AS ENUM ('course', 'room');
CREATE TYPE public.payment_status AS ENUM ('unpaid', 'paid', 'refunded');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE public.course_status AS ENUM ('Ada Tempat', 'Hampir Penuh', 'Penuh');
CREATE TYPE public.request_status AS ENUM ('new', 'in_review', 'contacted', 'closed');

-- ========== UPDATED_AT TRIGGER FN ==========
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ========== PROFILES ==========
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========== USER ROLES ==========
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ========== COURSES ==========
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  duration TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  group_price NUMERIC(10,2) CHECK (group_price IS NULL OR group_price >= 0),
  status course_status NOT NULL DEFAULT 'Ada Tempat',
  short_desc TEXT NOT NULL,
  image_url TEXT,
  syllabus JSONB NOT NULL DEFAULT '[]'::jsonb,
  prerequisites TEXT,
  facilitator TEXT,
  certificate TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER courses_updated BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX courses_active_idx ON public.courses(is_active);

CREATE POLICY "Public can view active courses" ON public.courses
  FOR SELECT TO anon, authenticated USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage courses" ON public.courses
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ========== COURSE SLOTS ==========
CREATE TABLE public.course_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  date_label TEXT NOT NULL,
  time_label TEXT NOT NULL,
  seats_total INTEGER NOT NULL CHECK (seats_total >= 0),
  seats_taken INTEGER NOT NULL DEFAULT 0 CHECK (seats_taken >= 0),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.course_slots ENABLE ROW LEVEL SECURITY;
CREATE INDEX course_slots_course_idx ON public.course_slots(course_id);

CREATE POLICY "Public can view slots" ON public.course_slots
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage slots" ON public.course_slots
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ========== ROOMS ==========
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  hourly_rate NUMERIC(10,2) NOT NULL CHECK (hourly_rate >= 0),
  daily_rate NUMERIC(10,2) NOT NULL CHECK (daily_rate >= 0),
  facilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER rooms_updated BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Public can view active rooms" ON public.rooms
  FOR SELECT TO anon, authenticated USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage rooms" ON public.rooms
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ========== BOOKINGS ==========
-- Booking ref sequence + generator
CREATE SEQUENCE public.booking_ref_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_booking_ref()
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
  v_year TEXT := to_char(now(), 'YYYY');
  v_seq BIGINT := nextval('public.booking_ref_seq');
BEGIN
  RETURN 'SYL-' || v_year || '-' || lpad(v_seq::TEXT, 6, '0');
END;
$$;

CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_no TEXT NOT NULL UNIQUE DEFAULT public.generate_booking_ref(),
  type booking_type NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- course bookings
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  slot_id UUID REFERENCES public.course_slots(id) ON DELETE SET NULL,
  -- room bookings
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  booking_date_from DATE,
  booking_date_to DATE,
  -- customer
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  num_pax INTEGER NOT NULL DEFAULT 1 CHECK (num_pax > 0),
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  payment_status payment_status NOT NULL DEFAULT 'unpaid',
  booking_status booking_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER bookings_updated BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX bookings_user_idx ON public.bookings(user_id);
CREATE INDEX bookings_ref_idx ON public.bookings(ref_no);
CREATE INDEX bookings_email_idx ON public.bookings(email);

-- Anyone (incl. guests) may create a booking
CREATE POLICY "Anyone can create booking" ON public.bookings
  FOR INSERT TO anon, authenticated WITH CHECK (true);
-- Logged-in users see their own bookings
CREATE POLICY "Users view own bookings" ON public.bookings
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage bookings" ON public.bookings
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Public lookup by ref_no via SECURITY DEFINER function (no need to expose row to anon)
CREATE OR REPLACE FUNCTION public.lookup_booking(_ref TEXT, _email TEXT)
RETURNS TABLE (
  ref_no TEXT,
  type booking_type,
  customer_name TEXT,
  email TEXT,
  num_pax INTEGER,
  total_amount NUMERIC,
  payment_status payment_status,
  booking_status booking_status,
  booking_date_from DATE,
  booking_date_to DATE,
  course_title TEXT,
  slot_label TEXT,
  room_name TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    b.ref_no, b.type, b.customer_name, b.email, b.num_pax, b.total_amount,
    b.payment_status, b.booking_status, b.booking_date_from, b.booking_date_to,
    c.title AS course_title,
    (cs.date_label || ' • ' || cs.time_label) AS slot_label,
    r.name AS room_name,
    b.created_at
  FROM public.bookings b
  LEFT JOIN public.courses c ON c.id = b.course_id
  LEFT JOIN public.course_slots cs ON cs.id = b.slot_id
  LEFT JOIN public.rooms r ON r.id = b.room_id
  WHERE upper(b.ref_no) = upper(_ref)
    AND lower(b.email) = lower(_email)
  LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.lookup_booking(TEXT, TEXT) TO anon, authenticated;

-- ========== HOST COURSE REQUESTS ==========
CREATE TABLE public.host_course_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  topic TEXT,
  num_participants INTEGER,
  location TEXT,
  notes TEXT,
  status request_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.host_course_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit host request" ON public.host_course_requests
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins view host requests" ON public.host_course_requests
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage host requests" ON public.host_course_requests
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ========== VENUE LISTINGS ==========
CREATE TABLE public.venue_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  capacity INTEGER,
  suggested_rate NUMERIC(10,2),
  facilities TEXT,
  status request_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.venue_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit venue listing" ON public.venue_listings
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins view venue listings" ON public.venue_listings
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage venue listings" ON public.venue_listings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ========== CONTACT MESSAGES ==========
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status request_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact" ON public.contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins view contact" ON public.contact_messages
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage contact" ON public.contact_messages
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
-- Fix function search_path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE OR REPLACE FUNCTION public.generate_booking_ref()
RETURNS TEXT LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  v_year TEXT := to_char(now(), 'YYYY');
  v_seq BIGINT := nextval('public.booking_ref_seq');
BEGIN
  RETURN 'SYL-' || v_year || '-' || lpad(v_seq::TEXT, 6, '0');
END;
$$;

-- Tighten anonymous insert policies with basic input validation
DROP POLICY IF EXISTS "Anyone can create booking" ON public.bookings;
CREATE POLICY "Anyone can create booking" ON public.bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(customer_name) BETWEEN 2 AND 200
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(email) <= 255
    AND length(phone) BETWEEN 6 AND 30
    AND num_pax > 0 AND num_pax <= 500
    AND total_amount >= 0
    AND (user_id IS NULL OR user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Anyone can submit host request" ON public.host_course_requests;
CREATE POLICY "Anyone can submit host request" ON public.host_course_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(company) BETWEEN 2 AND 200
    AND length(contact_name) BETWEEN 2 AND 200
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(email) <= 255
    AND length(phone) BETWEEN 6 AND 30
    AND (notes IS NULL OR length(notes) <= 2000)
    AND status = 'new'
  );

DROP POLICY IF EXISTS "Anyone can submit venue listing" ON public.venue_listings;
CREATE POLICY "Anyone can submit venue listing" ON public.venue_listings
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(venue_name) BETWEEN 2 AND 200
    AND length(owner_name) BETWEEN 2 AND 200
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(email) <= 255
    AND length(phone) BETWEEN 6 AND 30
    AND length(address) BETWEEN 5 AND 500
    AND (facilities IS NULL OR length(facilities) <= 2000)
    AND status = 'new'
  );

DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 2 AND 200
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(email) <= 255
    AND length(message) BETWEEN 5 AND 5000
    AND (subject IS NULL OR length(subject) <= 300)
    AND status = 'new'
  );
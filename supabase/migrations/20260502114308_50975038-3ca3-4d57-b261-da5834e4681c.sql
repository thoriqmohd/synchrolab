
-- Featured flag for courses
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_courses_is_featured ON public.courses (is_featured) WHERE is_featured = true;

-- Room add-ons (extras)
CREATE TABLE IF NOT EXISTS public.room_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.room_addons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active addons"
ON public.room_addons FOR SELECT
TO anon, authenticated
USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage addons"
ON public.room_addons FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_room_addons_updated_at
BEFORE UPDATE ON public.room_addons
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed a few common addons
INSERT INTO public.room_addons (name, description, price, sort_order) VALUES
  ('Jamuan minum (per pax)', 'Tea break pagi/petang dengan kuih', 15, 10),
  ('Makan tengah hari (per pax)', 'Set makanan ringan', 30, 20),
  ('Mikrofon tambahan', 'Mic wireless tambahan', 50, 30),
  ('Setup susunan teater', 'Susun semula kerusi gaya teater', 80, 40),
  ('Flipchart + marker', 'Flipchart penuh dengan marker', 40, 50)
ON CONFLICT DO NOTHING;

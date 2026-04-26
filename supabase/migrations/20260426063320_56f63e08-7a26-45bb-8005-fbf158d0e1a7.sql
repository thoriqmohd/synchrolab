
-- Create public bucket for catalog images (courses & rooms)
INSERT INTO storage.buckets (id, name, public)
VALUES ('catalog-images', 'catalog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
CREATE POLICY "Catalog images public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'catalog-images');

-- Admins can upload
CREATE POLICY "Admins upload catalog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'catalog-images' AND public.has_role(auth.uid(), 'admin'));

-- Admins can update
CREATE POLICY "Admins update catalog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'catalog-images' AND public.has_role(auth.uid(), 'admin'));

-- Admins can delete
CREATE POLICY "Admins delete catalog images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'catalog-images' AND public.has_role(auth.uid(), 'admin'));

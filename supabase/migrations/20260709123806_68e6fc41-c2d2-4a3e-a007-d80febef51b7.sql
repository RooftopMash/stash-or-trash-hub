
CREATE POLICY "Item images are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'item-images');

CREATE POLICY "Users can upload item images to their folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'item-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update their own item images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'item-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own item images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'item-images' AND (storage.foldername(name))[1] = auth.uid()::text);

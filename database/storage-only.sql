-- Storage Setup Only - Run this if you already have the products table
-- This script only creates the storage buckets and policies needed for file uploads

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('product-images', 'product-images', true),
  ('qr-codes', 'qr-codes', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policies for product images bucket (with existence checks)
DO $$
BEGIN
    -- Product images policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Allow public access to product images'
    ) THEN
        CREATE POLICY "Allow public access to product images" ON storage.objects
            FOR SELECT USING (bucket_id = 'product-images');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Allow authenticated uploads to product images'
    ) THEN
        CREATE POLICY "Allow authenticated uploads to product images" ON storage.objects
            FOR INSERT WITH CHECK (bucket_id = 'product-images');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Allow authenticated updates to product images'
    ) THEN
        CREATE POLICY "Allow authenticated updates to product images" ON storage.objects
            FOR UPDATE USING (bucket_id = 'product-images');
    END IF;

    -- QR codes policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Allow public access to QR codes'
    ) THEN
        CREATE POLICY "Allow public access to QR codes" ON storage.objects
            FOR SELECT USING (bucket_id = 'qr-codes');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Allow authenticated uploads to QR codes'
    ) THEN
        CREATE POLICY "Allow authenticated uploads to QR codes" ON storage.objects
            FOR INSERT WITH CHECK (bucket_id = 'qr-codes');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Allow authenticated updates to QR codes'
    ) THEN
        CREATE POLICY "Allow authenticated updates to QR codes" ON storage.objects
            FOR UPDATE USING (bucket_id = 'qr-codes');
    END IF;
END $$;

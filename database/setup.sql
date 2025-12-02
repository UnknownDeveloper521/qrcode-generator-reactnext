-- Product QR Code Generator Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create the products table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    qr_code_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now
-- In production, you might want more restrictive policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'products' 
        AND policyname = 'Allow all operations on products'
    ) THEN
        CREATE POLICY "Allow all operations on products" ON public.products
            FOR ALL USING (true);
    END IF;
END $$;

-- Create an index on created_at for better performance
CREATE INDEX IF NOT EXISTS products_created_at_idx ON public.products(created_at DESC);

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('product-images', 'product-images', true),
  ('qr-codes', 'qr-codes', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for product images bucket
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

-- Optional: Create a function to get product count
CREATE OR REPLACE FUNCTION get_products_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.products);
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a function to clean up old products (if needed)
CREATE OR REPLACE FUNCTION cleanup_old_products(days_old INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.products 
    WHERE created_at < NOW() - INTERVAL '1 day' * days_old;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

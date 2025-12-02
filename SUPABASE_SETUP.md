# Supabase Integration Setup Guide

This guide will help you set up Supabase integration for the Product QR Code Generator app.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- The QR Code Generator app already set up

## Step 1: Create a Supabase Project

1. **Go to [supabase.com](https://supabase.com)** and sign in
2. **Click "New Project"**
3. **Fill in project details**:
   - Project name: `qr-code-generator` (or your preferred name)
   - Database password: Create a strong password (save this!)
   - Region: Choose the closest region to your users
4. **Click "Create new project"**
5. **Wait for the project to be created** (this takes a few minutes)

## Step 2: Get Your Project Credentials

1. **Go to your project dashboard**
2. **Click on "Settings" in the sidebar**
3. **Click on "API"**
4. **Copy the following values**:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 3: Configure Environment Variables

1. **Open the `.env.local` file** in your project root
2. **Replace the placeholder values** with your actual Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-actual-anon-key
```

## Step 4: Create Database Tables and Storage Buckets

1. **Go to your Supabase dashboard**
2. **Click on "SQL Editor" in the sidebar**
3. **Click "New Query"**
4. **Copy and paste the following SQL** to create the products table and storage buckets:

```sql
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
CREATE POLICY "Allow all operations on products" ON public.products
    FOR ALL USING (true);

-- Create an index on created_at for better performance
CREATE INDEX IF NOT EXISTS products_created_at_idx ON public.products(created_at DESC);
```

5. **Click "Run"** to execute the SQL
6. **Verify the table was created** by going to "Table Editor" and checking for the "products" table
7. **Verify storage buckets were created** by going to "Storage" and checking for "product-images" and "qr-codes" buckets

## Step 5: Test the Connection

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Open your app** in the browser
3. **Try creating a new product** - it should now save to Supabase instead of localStorage
4. **Check your Supabase dashboard** under "Table Editor" > "products" to see the saved data

## Step 6: Verify Database Structure

Your `products` table should have the following columns:

| Column Name | Type | Constraints |
|-------------|------|-------------|
| `id` | TEXT | PRIMARY KEY |
| `name` | TEXT | NOT NULL |
| `description` | TEXT | NOT NULL |
| `image_url` | TEXT | NOT NULL |
| `qr_code_url` | TEXT | NOT NULL |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |

## Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables" error**:
   - Make sure your `.env.local` file has the correct variable names
   - Restart your development server after adding environment variables

2. **"Failed to create product" error**:
   - Check that your Supabase project is active
   - Verify your API credentials are correct
   - Check the browser console for detailed error messages

3. **"Connection test failed" error**:
   - Verify your project URL and anon key are correct
   - Check that your Supabase project is not paused (free tier projects pause after inactivity)

4. **Products not loading**:
   - Check the "Table Editor" in Supabase to see if data is being saved
   - Look at the browser console for any JavaScript errors

### Testing the Connection

You can test your Supabase connection by opening the browser console and running:

```javascript
// This will test the connection
supabaseService.testConnection().then(result => {
  console.log('Connection test:', result);
});
```

## Security Considerations

### For Production:

1. **Row Level Security (RLS)**:
   - The current setup allows all operations
   - For production, implement proper RLS policies based on user authentication

2. **Environment Variables**:
   - Never commit your actual credentials to version control
   - Use different Supabase projects for development and production

3. **API Keys**:
   - The anon key is safe to use in client-side code
   - Never expose your service role key in client-side code

## Database Migration from localStorage

If you have existing data in localStorage that you want to migrate:

1. **Export localStorage data** (run in browser console):
```javascript
const data = localStorage.getItem('qr_generator_products');
console.log(JSON.stringify(JSON.parse(data), null, 2));
```

2. **Save the output** and manually insert into Supabase using the SQL Editor

## Next Steps

- **Authentication**: Consider adding user authentication with Supabase Auth
- **File Storage**: Use Supabase Storage for storing product images instead of base64
- **Real-time Updates**: Implement real-time subscriptions for live updates
- **Backup**: Set up regular database backups

## Support

- **Supabase Documentation**: [docs.supabase.com](https://docs.supabase.com)
- **Community**: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)

---

Your QR Code Generator app is now connected to Supabase! 🎉

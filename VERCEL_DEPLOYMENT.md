# 🚀 Vercel Deployment Guide

This guide will help you deploy your QR Code Generator app to Vercel with Supabase integration.

## ✅ Pre-Deployment Checklist

- [x] Build passes without errors (`npm run build` ✓)
- [x] Supabase database is set up and configured
- [x] Environment variables are ready
- [x] Git repository is up to date

## 🌐 Step 1: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in with your GitHub account

2. **Click "New Project"**

3. **Import your GitHub repository**:
   - Search for: `qrcode-generator-reactnext`
   - Click "Import"

4. **Configure Project Settings**:
   - **Project Name**: `qrcode-generator` (or your preferred name)
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `.next` (should auto-detect)

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from your project directory
cd "t:\Tassos\TCS SOFTWARES\qrcode-generator"
vercel

# Follow the prompts:
# - Link to existing project? N
# - What's your project's name? qrcode-generator
# - In which directory is your code located? ./
```

## 🔐 Step 2: Configure Environment Variables

In your Vercel project dashboard:

1. **Go to Settings → Environment Variables**

2. **Add the following variables**:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://veghxqvsxvsplcfgaavz.supabase.co` | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |

3. **Click "Save"** for each variable

## 🗄️ Step 3: Verify Supabase Configuration

### Database Setup
Make sure your Supabase database has:
- ✅ Products table created
- ✅ Storage buckets (`product-images`, `qr-codes`) created
- ✅ RLS policies configured
- ✅ Storage policies configured

### Run this SQL if not done already:
```sql
-- Run the storage-only.sql or setup.sql in your Supabase SQL Editor
```

## 🌍 Step 4: Update Domain Configuration

### In Next.js Config
The `next.config.js` has been updated to include your Supabase domain:
```javascript
domains: ['localhost', 'veghxqvsxvsplcfgaavz.supabase.co']
```

### In Supabase (Optional)
If you want to restrict your Supabase project to only work with your Vercel domain:
1. Go to Supabase → Settings → API
2. Add your Vercel domain to allowed origins

## 🚀 Step 5: Deploy and Test

1. **Trigger Deployment**:
   - Push changes to GitHub (if using GitHub integration)
   - Or click "Redeploy" in Vercel dashboard

2. **Wait for Build**:
   - Monitor the build logs in Vercel dashboard
   - Should complete in 2-3 minutes

3. **Test Your Deployment**:
   - Visit your Vercel URL (e.g., `https://qrcode-generator-xyz.vercel.app`)
   - Test product creation
   - Test QR code generation
   - Test product page navigation
   - Test file uploads to Supabase

## 🔧 Troubleshooting

### Build Errors
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript types are correct

### Environment Variable Issues
- Double-check variable names (case-sensitive)
- Ensure variables are set for all environments
- Redeploy after adding variables

### Supabase Connection Issues
- Verify Supabase URL and key are correct
- Check Supabase project is not paused
- Ensure RLS policies allow operations

### Image Upload Issues
- Verify storage buckets exist
- Check storage policies are configured
- Ensure Supabase domain is in Next.js config

## 📊 Performance Optimization

### Vercel Analytics (Optional)
Add Vercel Analytics to track performance:
```bash
npm install @vercel/analytics
```

### Supabase Edge Functions (Future)
Consider using Supabase Edge Functions for server-side operations.

## 🎯 Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Product creation works
- [ ] Image upload to Supabase works
- [ ] QR code generation works
- [ ] QR code scanning redirects to product pages
- [ ] Product pages load correctly
- [ ] Database operations work
- [ ] Mobile responsiveness works

## 🌐 Your Live URLs

After deployment, you'll have:
- **Production**: `https://your-project-name.vercel.app`
- **Preview**: Automatic preview URLs for each commit
- **Development**: Your local `http://localhost:3000`

## 🔄 Continuous Deployment

With GitHub integration:
- Every push to `main` branch triggers production deployment
- Pull requests get preview deployments
- Automatic builds and deployments

## 🎉 Success!

Your QR Code Generator is now live on Vercel with:
- ✅ Supabase database integration
- ✅ File upload to Supabase Storage
- ✅ Dynamic product pages
- ✅ QR code scanning functionality
- ✅ Global CDN delivery
- ✅ Automatic HTTPS
- ✅ Continuous deployment

Share your live app URL and start generating QR codes! 🚀

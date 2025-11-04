# 🚀 Deployment Guide - DrawSync

Complete guide to deploy your DrawSync application to the internet.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Deployment Architecture](#deployment-architecture)
3. [Database Deployment](#1-deploy-database-postgresql)
4. [HTTP Backend Deployment](#2-deploy-http-backend)
5. [WebSocket Backend Deployment](#3-deploy-websocket-backend)
6. [Frontend Deployment](#4-deploy-frontend)
7. [Environment Variables](#5-configure-environment-variables)
8. [Testing Deployment](#6-test-your-deployment)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you start, create accounts on:

- ✅ **GitHub** (for code repository)
- ✅ **Vercel** (for frontend) - https://vercel.com
- ✅ **Railway** (for backends & database) - https://railway.app
- ✅ **Alternative: Render** (for backends) - https://render.com

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        INTERNET                              │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            ▼               ▼               ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │   Frontend   │ │ HTTP Backend │ │  WS Backend  │
    │   (Vercel)   │ │  (Railway)   │ │  (Railway)   │
    │  Next.js     │ │  Express.js  │ │  WebSocket   │
    └──────────────┘ └──────┬───────┘ └──────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  PostgreSQL  │
                    │  (Railway)   │
                    └──────────────┘
```

---

## Step-by-Step Deployment

---

## 1. Database Setup (PostgreSQL on Neon)

✅ **Your database is already deployed on Neon!**

### Get Your Neon Database URL

**Step 1:** Go to your Neon Dashboard at https://console.neon.tech

**Step 2:** Get Connection String
```
1. Select your project
2. Go to "Dashboard" or "Connection Details"
3. Copy the "Connection string" (pooled or direct)
```

**Example Neon URL:**
```
postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Step 3:** Verify Migrations Are Applied

```bash
# On your local machine
cd /Users/personal/Desktop/draw-app

# Add your Neon DATABASE_URL to packages/db/.env
echo "DATABASE_URL=your_neon_database_url_here" > packages/db/.env

# Check migration status
cd packages/db
pnpm prisma migrate status

# If migrations aren't applied, run:
pnpm prisma migrate deploy
```

### Neon Features You're Using

✅ **Serverless Postgres** - Automatically scales to zero when not in use  
✅ **Branching** - Can create database branches for testing  
✅ **Connection Pooling** - Built-in pgbouncer for better performance  
✅ **Generous Free Tier** - 0.5 GB storage, 100 hours compute/month  

### Important Neon Notes

- ⚡ Use **pooled connection** for serverless deployments (Railway, Vercel)
- 🔒 Always include `?sslmode=require` at the end of connection string
- 📊 Monitor usage in Neon dashboard to avoid hitting free tier limits

---

### Alternative Options (If Needed Later)

<details>
<summary><b>Option B: Railway PostgreSQL</b></summary>

**Step 1:** Go to https://railway.app and create new project

**Step 2:** Click "New Project" → "Provision PostgreSQL"

**Step 3:** Copy DATABASE_URL from Connect tab

</details>

<details>
<summary><b>Option C: Supabase</b></summary>

**Step 1:** Go to https://supabase.com and create project

**Step 2:** Get connection string from Settings → Database

</details>

---

## 2. Deploy HTTP Backend

### Option A: Railway

**Step 1:** Prepare for Deployment
```bash
cd /Users/personal/Desktop/draw-app/apps/http-backend

# Create a start script in package.json
# (Already exists, verify it has:)
# "start": "node ./dist/index.js"
# "build": "tsc -b"
```

**Step 2:** Push to GitHub
```bash
cd /Users/personal/Desktop/draw-app

# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/draw-app.git
git branch -M main
git push -u origin main
```

**Step 3:** Deploy on Railway
```
1. Go to Railway Dashboard
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your draw-app repository
4. Railway will detect monorepo - select "http-backend"
5. Configure:
   - Root Directory: apps/http-backend
   - Build Command: npm install && npm run build
   - Start Command: npm start
```

**Step 4:** Add Environment Variables
```
In Railway project settings, add:

JWT_SECRET=your-super-secret-key-change-this-in-production
DATABASE_URL=your_postgresql_url_from_step_1
```

**Step 5:** Get Public URL
```
1. Go to Settings → Networking
2. Click "Generate Domain"
3. Copy the URL (e.g., http-backend-production.up.railway.app)
```

### Option B: Render

**Step 1:** Go to https://render.com

**Step 2:** Create Web Service
```
1. Click "New +" → "Web Service"
2. Connect GitHub repository
3. Configure:
   - Name: draw-http-backend
   - Root Directory: apps/http-backend
   - Build Command: npm install && npm run build
   - Start Command: npm start
   - Instance Type: Free
```

**Step 3:** Environment Variables
```
JWT_SECRET=your-super-secret-key
DATABASE_URL=your_postgresql_url
```

---

## 3. Deploy WebSocket Backend

### Railway Deployment

**Step 1:** Create New Service
```
1. In Railway Dashboard, add service to same project
2. Click "New" → "GitHub Repo"
3. Select draw-app repo
4. Configure:
   - Root Directory: apps/ws-backend
   - Build Command: npm install && npm run build
   - Start Command: npm start
```

**Step 2:** Environment Variables
```
JWT_SECRET=your-super-secret-key-change-this
DATABASE_URL=your_postgresql_url
PORT=8080
```

**Step 3:** Enable WebSocket Support
```
1. Go to Settings → Networking
2. Generate Domain
3. Copy WebSocket URL (wss://ws-backend-production.up.railway.app)
```

**Important:** Change `ws://` to `wss://` for secure WebSocket connection in production!

---

## 4. Deploy Frontend

### Vercel Deployment (Recommended)

**Step 1:** Go to https://vercel.com and login with GitHub

**Step 2:** Import Project
```
1. Click "Add New" → "Project"
2. Import your draw-app repository
3. Vercel will auto-detect Next.js
```

**Step 3:** Configure Build Settings
```
Framework Preset: Next.js
Root Directory: apps/draw-frontend
Build Command: (auto-detected)
Output Directory: (auto-detected)
Install Command: (auto-detected)
```

**Step 4:** Environment Variables
```
Add these in Vercel project settings:

NEXT_PUBLIC_HTTP_BACKEND=https://your-http-backend.railway.app
NEXT_PUBLIC_WS_BACKEND=wss://your-ws-backend.railway.app
```

**Step 5:** Deploy
```
1. Click "Deploy"
2. Wait for build to complete
3. Get your URL (e.g., draw-app.vercel.app)
```

### Alternative: Netlify

**Step 1:** Go to https://netlify.com

**Step 2:** New Site from Git
```
1. Connect GitHub repository
2. Configure:
   - Base directory: apps/draw-frontend
   - Build command: npm run build
   - Publish directory: .next
```

**Step 3:** Environment Variables (same as Vercel)

---

## 5. Configure Environment Variables

### Summary of All Environment Variables

#### **Database (Neon - Already Deployed)**
```bash
# Get from Neon Console: https://console.neon.tech
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require
```

#### **HTTP Backend (Railway/Render)**
```bash
DATABASE_URL=your_neon_database_url_with_sslmode
JWT_SECRET=your-super-secret-key-min-32-chars
PORT=3001  # Railway sets this automatically
```

#### **WebSocket Backend (Railway/Render)**
```bash
DATABASE_URL=your_neon_database_url_with_sslmode
JWT_SECRET=your-super-secret-key-min-32-chars  # Must match HTTP backend
PORT=8080
```

#### **Frontend (Vercel/Netlify)**
```bash
NEXT_PUBLIC_HTTP_BACKEND=https://your-http-backend.railway.app
NEXT_PUBLIC_WS_BACKEND=wss://your-ws-backend.railway.app
```

### Generate Secure JWT_SECRET

```bash
# Run this in your terminal to generate a secure secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output example:
# 7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
```

---

## 6. Test Your Deployment

### Step 1: Test Backend APIs

**HTTP Backend:**
```bash
# Test signup endpoint
curl -X POST https://your-http-backend.railway.app/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Expected: { "userId": "some-uuid" }
```

**Test signin:**
```bash
curl -X POST https://your-http-backend.railway.app/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test@example.com",
    "password": "password123"
  }'

# Expected: { "token": "jwt-token-here" }
```

### Step 2: Test Frontend

1. Visit your Vercel URL (e.g., `https://draw-app.vercel.app`)
2. Click "Sign Up"
3. Create an account
4. Sign in
5. Create a room
6. Start drawing!

### Step 3: Test WebSocket Connection

```javascript
// Open browser console on your deployed site
const ws = new WebSocket('wss://your-ws-backend.railway.app?token=YOUR_JWT_TOKEN');
ws.onopen = () => console.log('✅ WebSocket connected!');
ws.onerror = (err) => console.log('❌ WebSocket error:', err);
```

---

## 7. Update CORS Settings

### HTTP Backend - Update CORS

Edit `apps/http-backend/src/index.ts`:

```typescript
import cors from 'cors';

// Update CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app',  // Add your Vercel URL
    'https://draw-app.vercel.app'   // Add any custom domains
  ],
  credentials: true
}));
```

---

## 8. Custom Domain (Optional)

### Vercel Custom Domain

```
1. Go to Vercel Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., drawsync.com)
4. Follow DNS configuration instructions
```

### Railway Custom Domain

```
1. Go to Railway Service Settings
2. Click "Networking" → "Custom Domain"
3. Add your domain
4. Update DNS records as instructed
```

---

## Quick Deployment Checklist

```
✅ 1. Database already on Neon - GET CONNECTION STRING
[ ] 2. Run database migrations with Neon URL
[ ] 3. Push code to GitHub
[ ] 4. Deploy HTTP Backend to Railway
[ ] 5. Add HTTP Backend environment variables (JWT_SECRET, DATABASE_URL from Neon)
[ ] 6. Deploy WebSocket Backend to Railway
[ ] 7. Add WS Backend environment variables (JWT_SECRET, DATABASE_URL from Neon)
[ ] 8. Deploy Frontend to Vercel
[ ] 9. Add Frontend environment variables (backend URLs)
[ ] 10. Test signup/signin on production
[ ] 11. Test room creation
[ ] 12. Test drawing functionality
[ ] 13. Update CORS settings with production URLs
[ ] 14. Set up custom domain (optional)
[ ] 15. Monitor Neon database usage in dashboard
```

---

## Cost Breakdown (Free Tier)

| Service | Free Tier | Cost After Free |
|---------|-----------|----------------|
| **Neon (Database)** | ✅ 0.5GB storage, 100h compute/month | $19/month (Launch) |
| **Railway** | $5 credit/month | ~$10-20/month |
| **Vercel** | Unlimited (hobby) | $20/month (Pro) |
| **Render** | 750 hours/month | $7/month/service |

**Your Setup Cost:** $0/month (using free tiers)  
✅ Neon Database: FREE  
✅ Railway Backends: ~$5 credit covers it  
✅ Vercel Frontend: FREE

---

## Troubleshooting

### Issue: "Failed to connect to backend"

**Solution:**
```bash
1. Check environment variables in Vercel
2. Ensure NEXT_PUBLIC_ prefix is used
3. Redeploy frontend after adding env vars
```

### Issue: "WebSocket connection failed"

**Solution:**
```bash
1. Use wss:// (not ws://) for production
2. Check WebSocket backend is running
3. Verify JWT_SECRET matches between backends
```

### Issue: "Database connection error"

**Solution:**
```bash
1. Verify DATABASE_URL in backend env vars includes ?sslmode=require
2. Check Neon database is active (console.neon.tech)
3. Ensure you're using POOLED connection string for serverless
4. Run migrations: pnpm prisma migrate deploy
5. Check Neon compute is not suspended (free tier auto-suspends)
```

### Issue: "Neon connection timeout"

**Solution:**
```bash
1. Use Neon's pooled connection string (includes pgbouncer)
2. Add connection timeout to DATABASE_URL:
   ?sslmode=require&connect_timeout=10
3. Check if you've hit Neon's compute hours limit (100h/month free)
4. Wake up suspended compute by visiting Neon dashboard
```

### Issue: "CORS error"

**Solution:**
```bash
1. Add frontend URL to CORS whitelist
2. Redeploy backend
3. Clear browser cache
```

### Issue: "JWT token invalid"

**Solution:**
```bash
1. Ensure JWT_SECRET is same in both backends
2. Check token is being sent in Authorization header
3. Verify middleware is working
```

---

## Post-Deployment Optimizations

### 1. Add Password Hashing
```bash
# Install bcrypt
cd apps/http-backend
pnpm add bcrypt
pnpm add -D @types/bcrypt

# Update signup/signin to use bcrypt.hash() and bcrypt.compare()
```

### 2. Add Rate Limiting
```bash
# Install express-rate-limit
pnpm add express-rate-limit

# Protect auth endpoints from brute force
```

### 3. Enable HTTPS Only
```typescript
// In production, enforce HTTPS
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

### 4. Add Monitoring
- **Sentry** for error tracking
- **LogRocket** for user session replay
- **Vercel Analytics** for frontend metrics
- **Railway Metrics** for backend monitoring

---

## Final URLs (Example)

After deployment, you'll have:

```
Frontend:     https://draw-app.vercel.app
HTTP API:     https://http-backend-production.up.railway.app
WebSocket:    wss://ws-backend-production.up.railway.app
Database:     postgresql://user:****@ep-xxx-xxx.neon.tech/neondb?sslmode=require (Neon)
```

### Your Current Setup:
```
✅ Database: Neon (already deployed)
⏳ HTTP Backend: Deploy to Railway (next step)
⏳ WS Backend: Deploy to Railway (next step)
⏳ Frontend: Deploy to Vercel (next step)
```

---

## 🎉 Congratulations!

Your DrawSync app is now live on the internet! 🚀

Share your URL with friends and start drawing together!

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Prisma Deploy: https://www.prisma.io/docs/guides/deployment

---

**Last Updated:** November 4, 2025

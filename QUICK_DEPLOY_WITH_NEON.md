# 🚀 Quick Deployment Guide - With Neon Database

## ✅ What You Have

- ✅ Database: **Neon PostgreSQL** (already deployed)
- ⏳ Need to deploy: HTTP Backend, WebSocket Backend, Frontend

---

## 📋 Quick Steps to Deploy

### Step 1: Get Your Neon Database URL

1. Go to https://console.neon.tech
2. Select your project
3. Copy **Connection String** (use POOLED for serverless)
4. Should look like:
   ```
   postgresql://username:password@ep-xxx.neon.tech/dbname?sslmode=require
   ```

### Step 2: Run Migrations on Neon

```bash
cd /Users/personal/Desktop/draw-app

# Add Neon URL to your .env
echo "DATABASE_URL=your_neon_connection_string" > packages/db/.env

# Run migrations
cd packages/db
pnpm prisma migrate deploy
```

### Step 3: Push to GitHub

```bash
cd /Users/personal/Desktop/draw-app

# Initialize git (if not done)
git init
git add .
git commit -m "Ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/draw-app.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy HTTP Backend to Railway

1. Go to https://railway.app → New Project → Deploy from GitHub
2. Select your `draw-app` repository
3. Configure service:
   ```
   Name: http-backend
   Root Directory: apps/http-backend
   Build Command: npm install && npm run build
   Start Command: npm start
   ```
4. Add environment variables:
   ```
   DATABASE_URL=your_neon_connection_string_here
   JWT_SECRET=run_this: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
5. Deploy and copy the generated URL (e.g., `https://http-backend-xxx.railway.app`)

### Step 5: Deploy WebSocket Backend to Railway

1. In same Railway project → New → GitHub Repo
2. Select `draw-app` again
3. Configure:
   ```
   Name: ws-backend
   Root Directory: apps/ws-backend
   Build Command: npm install && npm run build
   Start Command: npm start
   ```
4. Add environment variables:
   ```
   DATABASE_URL=your_neon_connection_string_here
   JWT_SECRET=same_secret_as_http_backend
   PORT=8080
   ```
5. Deploy and copy URL (e.g., `wss://ws-backend-xxx.railway.app`)

### Step 6: Deploy Frontend to Vercel

1. Go to https://vercel.com → New Project
2. Import your GitHub `draw-app` repository
3. Configure:
   ```
   Framework: Next.js
   Root Directory: apps/draw-frontend
   ```
4. Add environment variables:
   ```
   NEXT_PUBLIC_HTTP_BACKEND=https://your-http-backend-url.railway.app
   NEXT_PUBLIC_WS_BACKEND=wss://your-ws-backend-url.railway.app
   ```
5. Deploy!

### Step 7: Update CORS in Backend

Edit `apps/http-backend/src/index.ts`:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app'  // Add your Vercel URL
  ],
  credentials: true
}));
```

Commit and push - Railway will auto-deploy.

### Step 8: Test Everything! 🎉

1. Visit your Vercel URL
2. Sign up for an account
3. Sign in
4. Create a room
5. Start drawing!

---

## 🔑 Environment Variables Summary

### Neon Database
```
Already have: postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require
```

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### HTTP Backend (Railway)
```
DATABASE_URL=<your_neon_url>
JWT_SECRET=<generated_secret>
```

### WebSocket Backend (Railway)
```
DATABASE_URL=<your_neon_url>
JWT_SECRET=<same_as_http_backend>
PORT=8080
```

### Frontend (Vercel)
```
NEXT_PUBLIC_HTTP_BACKEND=https://<http-backend-url>.railway.app
NEXT_PUBLIC_WS_BACKEND=wss://<ws-backend-url>.railway.app
```

---

## ⚡ Neon-Specific Tips

### Use Pooled Connection
For Railway (serverless), use Neon's **pooled connection string**:
```
postgresql://user:pass@ep-xxx-pooler.neon.tech/dbname?sslmode=require
```

### Monitor Usage
- Free tier: 0.5 GB storage, 100 hours compute/month
- Check usage: https://console.neon.tech → Billing

### Auto-Suspend
- Neon auto-suspends after 5 min inactivity (free tier)
- First request after suspend may be slower (cold start)
- Upgrade to prevent auto-suspend

---

## 🐛 Troubleshooting

### "Connection timeout"
✅ Use pooled connection string  
✅ Add `?connect_timeout=10` to DATABASE_URL

### "SSL required"
✅ Always include `?sslmode=require` in Neon URL

### "Database suspended"
✅ Visit Neon dashboard to wake it up  
✅ Consider upgrading if you need always-on

### "Migration failed"
✅ Check Neon compute is active  
✅ Verify DATABASE_URL is correct  
✅ Run: `pnpm prisma migrate status`

---

## 💰 Cost: $0/month

✅ Neon Database: FREE (0.5GB, 100h compute)  
✅ Railway: FREE ($5 credit/month)  
✅ Vercel: FREE (hobby plan)  

**Total: FREE** 🎉

---

## 📚 Resources

- Neon Console: https://console.neon.tech
- Railway Dashboard: https://railway.app/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- Full Guide: See `DEPLOYMENT_GUIDE.md`

---

**Ready to deploy? Start with Step 1! 🚀**

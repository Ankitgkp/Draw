# ✅ Deployment Checklist - With Neon Database

Copy this checklist and check off items as you complete them!

---

## Pre-Deployment

```
[ ] Code is working locally (pnpm dev)
[ ] All features tested
[ ] GitHub account created
[ ] Railway account created (railway.app)
[ ] Vercel account created (vercel.com)
[x] ✅ Neon database already deployed
```

---

## 1. Database Setup (Neon)

```
[x] ✅ Neon PostgreSQL already deployed
[ ] Login to Neon console: https://console.neon.tech
[ ] Copy DATABASE_URL (use POOLED connection)
[ ] Save DATABASE_URL to packages/db/.env
[ ] Run: cd packages/db && pnpm prisma migrate deploy
[ ] Verify migrations: pnpm prisma migrate status
```

**Neon DATABASE_URL Format:**
```
postgresql://username:password@ep-xxx-pooler.neon.tech/dbname?sslmode=require
```

**Your DATABASE_URL:**
```
postgresql://___:___@ep-___-pooler.neon.tech/___?sslmode=require
```

---

## 2. Code Repository

```
[ ] Initialize git: git init
[ ] Add files: git add .
[ ] Commit: git commit -m "Initial commit"
[ ] Create GitHub repository
[ ] Add remote: git remote add origin https://github.com/YOUR_USERNAME/draw-app.git
[ ] Push code: git push -u origin main
[ ] Verify code on GitHub
```

**GitHub URL:** `https://github.com/_________/draw-app`

---

## 3. HTTP Backend Deployment

```
[ ] Go to Railway dashboard
[ ] Click "New" → "Deploy from GitHub repo"
[ ] Select draw-app repository
[ ] Set root directory: apps/http-backend
[ ] Set build command: npm install && npm run build
[ ] Set start command: npm start
[ ] Add environment variable: DATABASE_URL
[ ] Generate secure JWT_SECRET (32+ chars)
[ ] Add environment variable: JWT_SECRET
[ ] Wait for deployment to complete
[ ] Generate domain
[ ] Copy public URL
[ ] Test API: curl https://your-url.railway.app/signup
```

**HTTP Backend URL:** `https://___________-production.up.railway.app`

**JWT_SECRET:**
```bash
# Run this to generate:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Save it here: _________________________________________
```

---

## 4. WebSocket Backend Deployment

```
[ ] In Railway, add new service
[ ] Deploy from same GitHub repo
[ ] Set root directory: apps/ws-backend
[ ] Set build command: npm install && npm run build
[ ] Set start command: npm start
[ ] Add environment variable: DATABASE_URL (same as HTTP)
[ ] Add environment variable: JWT_SECRET (MUST be same as HTTP)
[ ] Wait for deployment
[ ] Generate domain
[ ] Copy WebSocket URL
[ ] Change ws:// to wss:// for production
```

**WebSocket URL:** `wss://___________-production.up.railway.app`

---

## 5. Frontend Deployment

```
[ ] Go to vercel.com
[ ] Login with GitHub
[ ] Click "Add New" → "Project"
[ ] Import draw-app repository
[ ] Set root directory: apps/draw-frontend
[ ] Click "Environment Variables"
[ ] Add: NEXT_PUBLIC_HTTP_BACKEND = https://your-http-backend.railway.app
[ ] Add: NEXT_PUBLIC_WS_BACKEND = wss://your-ws-backend.railway.app
[ ] Click "Deploy"
[ ] Wait for build to complete
[ ] Copy deployment URL
```

**Frontend URL:** `https://___________-git-main-__________.vercel.app`

---

## 6. Update CORS (Important!)

```
[ ] Edit apps/http-backend/src/index.ts
[ ] Add your Vercel URL to CORS origin array
[ ] Commit changes
[ ] Push to GitHub
[ ] Railway auto-redeploys
```

**Code to add:**
```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app'  // ← Add this
  ]
}));
```

---

## 7. Testing

```
[ ] Visit frontend URL
[ ] Test sign up with new account
[ ] Verify account created successfully
[ ] Test sign in
[ ] Verify redirected to home page
[ ] Create a new room
[ ] Verify redirected to canvas
[ ] Test drawing (rectangles should appear)
[ ] Open canvas in another browser/incognito
[ ] Join same room
[ ] Verify real-time drawing sync works
[ ] Test chat/shapes appear in both browsers
```

---

## 8. Final Checks

```
[ ] All 3 services running in Railway
[ ] Frontend deployed on Vercel
[ ] Database has data (check Railway dashboard)
[ ] No console errors in browser
[ ] WebSocket connection shows "Connected"
[ ] CORS configured correctly
[ ] Environment variables set correctly
[ ] Custom domain configured (optional)
```

---

## Environment Variables Reference

### HTTP Backend (Railway)
```
DATABASE_URL=postgresql://postgres:pass@host:5432/railway
JWT_SECRET=your_32_char_secret_here
```

### WebSocket Backend (Railway)
```
DATABASE_URL=postgresql://postgres:pass@host:5432/railway
JWT_SECRET=your_32_char_secret_here  ← MUST match HTTP backend
```

### Frontend (Vercel)
```
NEXT_PUBLIC_HTTP_BACKEND=https://http-backend-prod.up.railway.app
NEXT_PUBLIC_WS_BACKEND=wss://ws-backend-prod.up.railway.app
```

---

## Quick Links

| Service | URL |
|---------|-----|
| Railway Dashboard | https://railway.app/dashboard |
| Vercel Dashboard | https://vercel.com/dashboard |
| GitHub Repo | https://github.com/______/draw-app |
| Frontend (Live) | https://______.vercel.app |
| HTTP Backend | https://______.railway.app |
| WebSocket Backend | wss://______.railway.app |

---

## Troubleshooting

### ❌ "Network Error" on signup
```
[ ] Check HTTP backend is running (Railway dashboard)
[ ] Verify NEXT_PUBLIC_HTTP_BACKEND is set correctly
[ ] Check CORS includes Vercel URL
[ ] Hard refresh browser (Cmd+Shift+R)
```

### ❌ "WebSocket connection failed"
```
[ ] Check WS backend is running
[ ] Verify using wss:// (not ws://)
[ ] Check JWT_SECRET matches in both backends
[ ] Verify NEXT_PUBLIC_WS_BACKEND is correct
```

### ❌ "Database connection error"
```
[ ] Check DATABASE_URL in Railway env vars
[ ] Verify database is running
[ ] Run migrations: pnpm prisma migrate deploy
```

### ❌ "Invalid token"
```
[ ] JWT_SECRET MUST be identical in both backends
[ ] Regenerate secret and update both backends
[ ] Redeploy both backends
```

---

## Success Criteria

When everything is working:

✅ You can visit your Vercel URL  
✅ Sign up creates a new account  
✅ Sign in redirects to home  
✅ Can create a room  
✅ Can draw on canvas  
✅ Drawing syncs in real-time across browsers  
✅ No console errors  

---

## 🎉 You're Live!

**Share your app:**
```
🔗 My DrawSync App: https://your-app.vercel.app

Try it out and draw together!
```

---

## Next Steps

```
[ ] Add custom domain
[ ] Set up monitoring (Sentry)
[ ] Add analytics (Vercel Analytics)
[ ] Implement password hashing (bcrypt)
[ ] Add rate limiting
[ ] Set up backup strategy
[ ] Create user documentation
```

---

**Need help?** Check `DEPLOYMENT_GUIDE.md` for detailed instructions.

# 🎯 Your Deployment Plan - DrawSync with Neon

## Current Status

✅ **Database: DONE** - Neon PostgreSQL is deployed  
⏳ **Backends: TODO** - Deploy to Railway  
⏳ **Frontend: TODO** - Deploy to Vercel  

---

## What You Need

### From Neon (You have this)
- [ ] Database connection string from https://console.neon.tech
- [ ] Format: `postgresql://user:pass@ep-xxx-pooler.neon.tech/dbname?sslmode=require`

### To Create
- [ ] GitHub account & repository
- [ ] Railway account (for backends)
- [ ] Vercel account (for frontend)
- [ ] JWT secret (I'll show you how to generate)

---

## 3-Step Deployment Process

### Step 1️⃣: Prepare & Upload Code (5 min)

```bash
# 1. Generate JWT secret (copy the output)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. Push to GitHub
cd /Users/personal/Desktop/draw-app
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/draw-app.git
git push -u origin main
```

### Step 2️⃣: Deploy Backends to Railway (10 min)

**A. HTTP Backend:**
1. Go to https://railway.app → New Project → Deploy from GitHub
2. Select `draw-app` repo → Root: `apps/http-backend`
3. Add environment variables:
   ```
   DATABASE_URL=<your_neon_url_with_sslmode>
   JWT_SECRET=<generated_secret_from_step1>
   ```
4. Deploy → Copy URL

**B. WebSocket Backend:**
1. Same Railway project → New Service → GitHub Repo
2. Select `draw-app` again → Root: `apps/ws-backend`
3. Add environment variables:
   ```
   DATABASE_URL=<same_neon_url>
   JWT_SECRET=<same_secret_as_http>
   PORT=8080
   ```
4. Deploy → Copy URL (change `https://` to `wss://`)

### Step 3️⃣: Deploy Frontend to Vercel (5 min)

1. Go to https://vercel.com → New Project
2. Import `draw-app` from GitHub
3. Root directory: `apps/draw-frontend`
4. Add environment variables:
   ```
   NEXT_PUBLIC_HTTP_BACKEND=https://your-http-backend.railway.app
   NEXT_PUBLIC_WS_BACKEND=wss://your-ws-backend.railway.app
   ```
5. Deploy → Get your live URL! 🎉

---

## Post-Deployment

### Update CORS (Important!)

Edit `apps/http-backend/src/index.ts`:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',           // Local dev
    'https://your-app.vercel.app'      // Production
  ],
  credentials: true
}));
```

Commit & push → Railway auto-deploys.

---

## Environment Variables Quick Reference

### Neon Database
```bash
# Get from: https://console.neon.tech
# Use POOLED connection for better performance
DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.neon.tech/dbname?sslmode=require"
```

### JWT Secret
```bash
# Generate once, use everywhere
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Example output: 7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c...
```

### Railway HTTP Backend
```bash
DATABASE_URL="<neon_url_with_sslmode>"
JWT_SECRET="<your_generated_secret>"
```

### Railway WebSocket Backend
```bash
DATABASE_URL="<neon_url_with_sslmode>"
JWT_SECRET="<same_secret_as_http>"
PORT="8080"
```

### Vercel Frontend
```bash
NEXT_PUBLIC_HTTP_BACKEND="https://http-backend-xxx.railway.app"
NEXT_PUBLIC_WS_BACKEND="wss://ws-backend-xxx.railway.app"
```

---

## Testing Your Deployment

### 1. Test HTTP Backend
```bash
curl -X POST https://your-http-backend.railway.app/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"password123","name":"Test"}'

# Should return: {"userId":"..."}
```

### 2. Test Frontend
1. Visit your Vercel URL
2. Click "Sign Up"
3. Create account
4. Sign in
5. Create a room
6. Start drawing!

### 3. Test Real-time
1. Open 2 browser tabs with same room
2. Draw in one tab
3. Should appear in other tab instantly

---

## Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| Neon Database | Free Tier | $0 |
| Railway (2 services) | Free Credit | $0 |
| Vercel Frontend | Hobby | $0 |
| **TOTAL** | | **$0/month** ✨ |

**Free Tier Limits:**
- Neon: 0.5GB storage, 100 hours compute/month
- Railway: $5 credit/month (enough for 2 small services)
- Vercel: Unlimited deployments (hobby use)

---

## Troubleshooting

### "Can't connect to Neon"
✅ Make sure URL includes `?sslmode=require`  
✅ Use POOLED connection string  
✅ Check if compute is suspended (visit Neon console)

### "CORS error"
✅ Add Vercel URL to CORS whitelist in backend  
✅ Redeploy backend after updating  

### "WebSocket connection failed"
✅ Use `wss://` (not `ws://`)  
✅ Check JWT_SECRET matches in both backends  

### "JWT token invalid"
✅ Ensure same JWT_SECRET in both backends  
✅ Generate new secret and update both  

---

## Next Steps After Deployment

1. ✅ Share your live URL with friends!
2. ✅ Monitor Neon usage (console.neon.tech → Billing)
3. ✅ Set up custom domain (optional)
4. ✅ Add password hashing with bcrypt (security)
5. ✅ Set up error monitoring (Sentry)
6. ✅ Add analytics (Vercel Analytics)

---

## Support Resources

- **Neon Docs:** https://neon.tech/docs
- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Full Deployment Guide:** `DEPLOYMENT_GUIDE.md`
- **Quick Reference:** `QUICK_DEPLOY_WITH_NEON.md`
- **Step-by-Step:** `DEPLOYMENT_CHECKLIST.md`

---

## Ready to Deploy?

**Total time needed:** ~20-30 minutes

**Follow these files in order:**

1. 📝 Start here: `QUICK_DEPLOY_WITH_NEON.md`
2. ✅ Track progress: `DEPLOYMENT_CHECKLIST.md`
3. 📖 Full details: `DEPLOYMENT_GUIDE.md`
4. 🐛 Issues? `DEPLOYMENT_GUIDE.md` → Troubleshooting

---

**Let's get your app live! 🚀**

Start with generating your JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then push to GitHub and follow `QUICK_DEPLOY_WITH_NEON.md`!

# 🚀 Quick Deployment Steps

## TL;DR - Deploy in 30 Minutes

### 1. Database (5 min)
```bash
1. Go to railway.app → Sign up
2. New Project → Provision PostgreSQL
3. Copy DATABASE_URL
4. Run: cd packages/db && pnpm prisma migrate deploy
```

### 2. Push to GitHub (5 min)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/draw-app.git
git push -u origin main
```

### 3. Deploy HTTP Backend (5 min)
```bash
1. Railway → New → Deploy from GitHub
2. Select draw-app → Choose "http-backend"
3. Add environment variables:
   - DATABASE_URL=your_db_url
   - JWT_SECRET=generate_random_32_chars
4. Generate domain → Copy URL
```

### 4. Deploy WebSocket Backend (5 min)
```bash
1. Railway → Add Service → GitHub repo
2. Select draw-app → Choose "ws-backend"
3. Add environment variables:
   - DATABASE_URL=your_db_url
   - JWT_SECRET=same_as_http_backend
4. Generate domain → Copy URL (use wss://)
```

### 5. Deploy Frontend (10 min)
```bash
1. Go to vercel.com → Sign in with GitHub
2. Import draw-app repository
3. Root directory: apps/draw-frontend
4. Add environment variables:
   - NEXT_PUBLIC_HTTP_BACKEND=https://your-http-backend.railway.app
   - NEXT_PUBLIC_WS_BACKEND=wss://your-ws-backend.railway.app
5. Deploy → Copy URL
```

### 6. Done! 🎉
```
Visit your Vercel URL → Sign up → Start drawing!
```

---

## Environment Variables Summary

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### HTTP Backend
```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_here
```

### WS Backend
```
DATABASE_URL=postgresql://...
JWT_SECRET=same_as_http_backend
```

### Frontend
```
NEXT_PUBLIC_HTTP_BACKEND=https://your-backend.railway.app
NEXT_PUBLIC_WS_BACKEND=wss://your-ws.railway.app
```

---

## Costs

**Free Option:**
- Railway: $5 credit/month (enough for small apps)
- Vercel: Free unlimited (hobby)
- Total: $0/month

**Paid (Recommended for Production):**
- Railway: ~$15/month
- Vercel: Free
- Total: ~$15/month

---

## Quick Test

```bash
# Test backend
curl https://your-backend.railway.app/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"pass123","name":"Test"}'

# Visit frontend
https://your-app.vercel.app
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| CORS error | Add Vercel URL to CORS whitelist in backend |
| WebSocket fails | Use `wss://` not `ws://` |
| Database error | Check DATABASE_URL in env vars |
| Token invalid | JWT_SECRET must match in both backends |

---

**Full guide:** See `DEPLOYMENT_GUIDE.md`

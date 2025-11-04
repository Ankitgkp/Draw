# Railway Deployment Configuration

Railway-specific configuration files and settings for DrawSync.

---

## Railway Configuration Files

### For HTTP Backend

Create `apps/http-backend/railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### For WebSocket Backend

Create `apps/ws-backend/railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## Package.json Scripts

Verify these scripts exist in your package.json files:

### apps/http-backend/package.json
```json
{
  "scripts": {
    "build": "tsc -b",
    "start": "node ./dist/index.js",
    "dev": "npm run build && npm run start"
  }
}
```

### apps/ws-backend/package.json
```json
{
  "scripts": {
    "build": "tsc -b",
    "start": "node ./dist/index.js",
    "dev": "npm run build && npm run start"
  }
}
```

---

## Environment Variables in Railway

### Setting Environment Variables

**Via Railway Dashboard:**
```
1. Select your service
2. Click "Variables" tab
3. Click "New Variable"
4. Add key-value pairs
5. Click "Deploy" to apply changes
```

**Via Railway CLI:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Add variables
railway variables set DATABASE_URL=postgresql://...
railway variables set JWT_SECRET=your-secret-here
```

---

## Railway Build Settings

### Monorepo Detection

Railway auto-detects monorepos. If it doesn't:

**Set Root Directory:**
```
Settings → General → Root Directory
- For HTTP: apps/http-backend
- For WS: apps/ws-backend
```

**Set Build Command:**
```
Settings → Build → Custom Build Command
npm install && npm run build
```

**Set Start Command:**
```
Settings → Deploy → Custom Start Command
npm start
```

---

## Database Migration on Railway

### Option 1: Local Migration to Production DB

```bash
# Add production DATABASE_URL to local .env
cd packages/db
echo "DATABASE_URL=your_railway_db_url" > .env

# Run migrations
pnpm prisma migrate deploy

# Verify
pnpm prisma studio
```

### Option 2: Railway Deploy Hook

Add to `package.json` in both backends:

```json
{
  "scripts": {
    "build": "tsc -b",
    "start": "node ./dist/index.js",
    "postinstall": "cd ../../packages/db && npx prisma migrate deploy"
  }
}
```

---

## Networking Configuration

### HTTP Backend Port

Railway automatically assigns PORT. Update your code:

```typescript
// apps/http-backend/src/index.ts
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`HTTP backend listening on port ${PORT}`);
});
```

### WebSocket Backend Port

```typescript
// apps/ws-backend/src/index.ts
const PORT = process.env.PORT || 8080;

const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server running on port ${PORT}`);
```

---

## Health Checks

### Add Health Check Endpoints

**HTTP Backend:**
```typescript
// apps/http-backend/src/index.ts
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

**WebSocket Backend:**
```typescript
// apps/ws-backend/src/index.ts
import express from 'express';
const healthApp = express();

healthApp.get('/health', (req, res) => {
  res.json({ status: 'ok', connections: wss.clients.size });
});

const HEALTH_PORT = process.env.HEALTH_PORT || 3002;
healthApp.listen(HEALTH_PORT);
```

Configure in Railway:
```
Settings → Deploy → Health Check Path: /health
```

---

## Logging

### Railway Logs

**View Logs:**
```
1. Select service in Railway dashboard
2. Click "Deployments" tab
3. Click on active deployment
4. View real-time logs
```

**Via CLI:**
```bash
railway logs
```

### Add Logging to Your App

```typescript
// Simple logging
console.log('✅ Server started');
console.error('❌ Error:', error);

// Structured logging (recommended)
import pino from 'pino';
const logger = pino();

logger.info('Server started');
logger.error({ err: error }, 'Failed to connect');
```

---

## Auto-Deploy on Git Push

**Enable Auto-Deploy:**
```
1. Go to service settings
2. Scroll to "Deploy Triggers"
3. Enable "Deploy on Push"
4. Select branch (main)
```

Now every push to GitHub auto-deploys!

---

## Scaling

### Vertical Scaling (More Resources)

```
Settings → Resources → Change Plan
- Hobby: 512MB RAM, 1 vCPU (Free $5 credit)
- Pro: 8GB RAM, 8 vCPU ($20/month)
```

### Horizontal Scaling (Multiple Instances)

```
Settings → Replicas
- Add more instances
- Railway handles load balancing
```

---

## Domains & SSL

### Generate Railway Domain

```
Settings → Networking → Generate Domain
Example: http-backend-production-abc123.up.railway.app
```

### Custom Domain

```
1. Settings → Networking → Custom Domain
2. Add your domain: api.yourdomain.com
3. Add DNS record (Railway provides instructions)
4. SSL is automatic (Let's Encrypt)
```

---

## Cost Optimization

### Free Tier Limits

```
- $5 credit per month
- ~500 hours of usage
- Multiple services share the credit
```

### Reduce Costs

1. **Use Sleep Mode:**
   ```
   Settings → Deploy → Sleep After Inactivity
   ```

2. **Optimize Build:**
   ```
   Use smaller dependencies
   Remove dev dependencies from production
   ```

3. **Monitor Usage:**
   ```
   Account → Usage
   Check resource consumption
   ```

---

## Backup Strategy

### Database Backups

**Manual Backup:**
```bash
# From Railway PostgreSQL service
1. Click "Data" tab
2. Click "Backup"
3. Download backup file
```

**Automated Backups:**
```
Pro plan includes automatic daily backups
```

### Code Backups

```
✅ GitHub (already done)
✅ Multiple branches
✅ Regular commits
```

---

## Monitoring

### Railway Built-in Metrics

```
Service → Metrics tab
- CPU usage
- Memory usage
- Network traffic
- Request count
```

### External Monitoring

**Add Sentry (Error Tracking):**
```bash
pnpm add @sentry/node

# In your app
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## Troubleshooting Railway Issues

### Build Fails

```
1. Check build logs in Railway dashboard
2. Verify package.json scripts
3. Check dependencies are listed
4. Try: railway run npm install
```

### Service Crashes

```
1. Check deployment logs
2. Verify environment variables
3. Check DATABASE_URL connection
4. Review error messages
```

### Connection Timeouts

```
1. Check if service is running
2. Verify correct domain/URL
3. Check CORS settings
4. Review network logs
```

---

## Railway CLI Commands

### Useful Commands

```bash
# Login
railway login

# Link to project
railway link

# Deploy
railway up

# View logs
railway logs

# Run command in Railway environment
railway run npm install

# Shell into service
railway shell

# List variables
railway variables

# Set variable
railway variables set KEY=value

# Delete variable
railway variables delete KEY
```

---

## Security Best Practices

### 1. Secure JWT Secret

```bash
# Generate strong secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Set in Railway
railway variables set JWT_SECRET=your_generated_secret
```

### 2. Restrict CORS

```typescript
// Only allow your frontend
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'https://your-app.vercel.app'
  ],
  credentials: true
}));
```

### 3. Environment Variables

```
✅ Never commit secrets to Git
✅ Use Railway variables
✅ Rotate secrets periodically
✅ Use different secrets for dev/prod
```

---

## Production Checklist

```
[ ] All environment variables set
[ ] DATABASE_URL configured
[ ] JWT_SECRET is strong and secret
[ ] Health checks enabled
[ ] Logging configured
[ ] CORS properly restricted
[ ] Auto-deploy enabled
[ ] Monitoring set up
[ ] Backups configured
[ ] Custom domain added (optional)
[ ] SSL certificate active
```

---

## Quick Reference

| Task | Command/Location |
|------|------------------|
| View logs | Railway Dashboard → Service → Deployments |
| Set env var | Variables tab → New Variable |
| Redeploy | Deployments → ⋯ → Redeploy |
| Domain | Networking → Generate Domain |
| Metrics | Service → Metrics tab |
| Database | PostgreSQL service → Data tab |

---

**Railway Docs:** https://docs.railway.app

**Need help?** Check Railway Discord or documentation!

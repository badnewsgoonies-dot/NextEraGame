# 🚀 Vercel Production Setup Guide

**Complete setup for:**
- ✅ Analytics tracking
- ⏳ Custom domain (nextera.game)
- ⏳ GitHub auto-deployment

---

## ✅ **STEP 1: Analytics (COMPLETE)**

Vercel Analytics has been integrated into the code!

**What's Tracking:**
- Page views
- User interactions
- Performance metrics (Core Web Vitals)
- Geographic distribution

**View Analytics:**
1. Visit: https://vercel.com/next-era/dist/analytics
2. See real-time visitor data
3. Track engagement metrics

**No configuration needed** - Analytics automatically enabled in production! 📊

---

## 🌐 **STEP 2: Custom Domain Setup**

### **Option A: You Already Own nextera.game**

**In Vercel Dashboard:**
1. Visit: https://vercel.com/next-era/dist/settings/domains
2. Click **"Add Domain"**
3. Enter: `nextera.game`
4. Click **"Add"**

**Vercel will show DNS records to add:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

**In Your Domain Registrar:**
1. Log into your domain provider (Namecheap, GoDaddy, Cloudflare, etc.)
2. Go to DNS settings for `nextera.game`
3. Add the DNS records Vercel provided
4. Save changes

**Wait Time:** 5 minutes to 48 hours (usually ~15 minutes)

**Result:** 
- https://nextera.game → your game!
- https://www.nextera.game → also works
- Automatic SSL certificate (HTTPS)

---

### **Option B: Register nextera.game**

**Check Availability:**
1. Visit: https://www.namecheap.com/domains/
2. Search: `nextera.game`
3. Check price (usually $15-30/year)

**If Available:**
1. Purchase domain ($15-30/year)
2. Follow "Option A" instructions above

**If Unavailable:**
Consider alternatives:
- nextera.gg
- playnextera.com
- nextera-game.com
- nexteragame.io

---

### **Option C: Use Free Vercel Domain**

**Current URL:** https://dist-next-era.vercel.app

**To Get Better Vercel Subdomain:**
1. Visit: https://vercel.com/next-era/dist/settings
2. Rename project from "dist" to "nextera"
3. New URL: https://nextera.vercel.app

**Free, instant, and works great!**

---

## 🔄 **STEP 3: GitHub Auto-Deploy Setup**

Your code is now on GitHub: https://github.com/badnewsgoonies-dot/NextEraGame

### **Connect to Vercel (5 minutes):**

**1. Go to Vercel Dashboard:**
- Visit: https://vercel.com/new

**2. Import Git Repository:**
- Click **"Import Git Repository"**
- Select **"GitHub"** (authorize if needed)
- Choose: **badnewsgoonies-dot/NextEraGame**

**3. Configure Project:**
- **Project Name:** nextera (or keep default)
- **Framework Preset:** Vite
- **Root Directory:** ./
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- Click **"Deploy"**

**4. Deployment Protection:**
- After first deploy, go to Settings
- Set **"Deployment Protection"** to **"Only Preview Deployments"**
- Production will be public, PR previews protected

**5. Branch Settings:**
- Production Branch: `main`
- Preview Branches: All branches

---

### **What You Get:**

✅ **Auto-deploy on push** - Every `git push` triggers deployment  
✅ **Preview deployments** - Every PR gets a unique URL  
✅ **Instant rollback** - Revert to any previous deployment  
✅ **Build logs** - See what happened if build fails  
✅ **Environment variables** - Secure secrets management  
✅ **Analytics** - Already integrated!

---

### **Workflow After Setup:**

```bash
# Make changes locally
npm run dev

# Test
npm test

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push

# Vercel automatically:
# 1. Detects push
# 2. Runs npm install
# 3. Runs npm run build
# 4. Deploys to production
# 5. Updates https://nextera.vercel.app (or your custom domain)
```

**Time from push to live:** ~2 minutes ⚡

---

## 📊 **Analytics Dashboard**

### **Enable Advanced Analytics:**

**In Vercel Dashboard:**
1. Visit: https://vercel.com/next-era/dist/analytics
2. Click **"Upgrade Analytics"** (optional - free tier is generous)

**Free Tier Includes:**
- ✅ Page views (unlimited)
- ✅ Core Web Vitals (performance)
- ✅ Top pages/referrers
- ✅ Geographic data
- ✅ Real-time visitors

**Pro Features ($20/month):**
- Custom events tracking
- Conversion funnels
- A/B testing
- Longer data retention

**For this game, FREE tier is plenty!**

---

## 🔒 **Security & Performance**

### **Automatic Features:**

✅ **DDoS Protection** - Vercel Edge Network  
✅ **SSL Certificate** - Auto-renewed, free  
✅ **Global CDN** - 100+ edge locations  
✅ **Gzip/Brotli** - Automatic compression  
✅ **Cache Headers** - Optimized for assets  
✅ **Image Optimization** - Automatic (for future images)

---

## 🐛 **Troubleshooting**

### **Domain not working?**
- Check DNS propagation: https://dnschecker.org
- Wait up to 48 hours (usually 15 mins)
- Verify DNS records match Vercel's exactly

### **Build failing?**
- Check build logs in Vercel dashboard
- Verify `npm run build` works locally
- Check for environment-specific code

### **Auto-deploy not triggering?**
- Verify GitHub integration is active
- Check webhook settings in GitHub repo settings
- Try manual redeploy in Vercel dashboard

---

## 📈 **Monitoring Your Game**

### **Vercel Dashboard:**
https://vercel.com/next-era/dist

**Key Metrics to Watch:**
- **Deployments** - See all deployments and status
- **Analytics** - Visitor counts and behavior
- **Performance** - Core Web Vitals, load times
- **Logs** - Runtime errors and warnings
- **Firewall** - Security events

### **GitHub:**
https://github.com/badnewsgoonies-dot/NextEraGame

**Features:**
- **Issues** - Bug tracking
- **Pull Requests** - Code reviews
- **Actions** - CI/CD (can add later)
- **Releases** - Version tagging

---

## 🎯 **Next Steps**

### **Immediate (Today):**
1. ✅ Analytics - **DONE!**
2. ⏳ Set up custom domain (if you own nextera.game)
3. ⏳ Connect GitHub to Vercel for auto-deploy

### **This Week:**
- Test on iPhone (Safari)
- Share with friends for feedback
- Monitor analytics
- Fix any bugs reported

### **This Month:**
- Replace placeholder sprites
- Add sound effects
- Expand content (more units/items)
- Add achievements

---

## 📞 **Support & Resources**

**Vercel:**
- [Documentation](https://vercel.com/docs)
- [Status Page](https://vercel-status.com)
- [Community](https://github.com/vercel/vercel/discussions)

**This Project:**
- [Issues](https://github.com/badnewsgoonies-dot/NextEraGame/issues)
- [Discussions](https://github.com/badnewsgoonies-dot/NextEraGame/discussions)

---

## ✨ **Current Status**

**As of October 22, 2025:**
- ✅ Analytics integrated and tracking
- ✅ Code pushed to GitHub
- ⏳ Custom domain (pending setup)
- ⏳ Auto-deploy (pending Vercel-GitHub connection)

**Time to complete remaining steps:** ~10 minutes

---

**Questions?** Check the [Deployment Guide](./DEPLOYMENT_GUIDE.md) or [Quickstart](./QUICKSTART.md)!


# 🚀 Deployment Guide for ModularSpace

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Render account (free tier works)
- Git installed locally

## Step-by-Step Deployment

### Part 1: Prepare Your Code

1. **Initialize Git Repository**
```bash
cd modularspace-project
git init
git add .
git commit -m "Initial commit: ModularSpace furniture configurator"
```

2. **Create GitHub Repository**
- Go to GitHub.com
- Create new repository named "modularspace"
- Follow instructions to push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/modularspace.git
git branch -M main
git push -u origin main
```

---

### Part 2: Deploy Backend to Render

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign in or create account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository you just created

3. **Configure Service**
   ```
   Name: modularspace-api
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Environment Variables** (Optional for now)
   ```
   PORT: (leave empty, Render auto-assigns)
   NODE_ENV: production
   ```

5. **Deploy!**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Copy your backend URL (e.g., `https://modularspace-api.onrender.com`)

6. **Test Backend**
   - Visit `https://your-backend-url.onrender.com/api/health`
   - Should see: `{"status":"ok","message":"ModularSpace API is running"}`

---

### Part 3: Deploy Frontend to Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Project**
   ```
   Framework Preset: Next.js (auto-detected)
   Root Directory: frontend
   Build Command: npm run build (auto)
   Output Directory: .next (auto)
   Install Command: npm install (auto)
   ```

4. **Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     Name: NEXT_PUBLIC_API_URL
     Value: https://your-render-backend-url.onrender.com
     ```
   - Important: Use your actual Render URL from Part 2

5. **Deploy!**
   - Click "Deploy"
   - Wait for build (2-3 minutes)
   - Your site will be live at `https://your-project.vercel.app`

6. **Test Frontend**
   - Visit your Vercel URL
   - Navigate to all pages
   - Test the configurator at `/configurator`

---

### Part 4: Custom Domain (Optional)

#### For Frontend (Vercel):
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

#### For Backend (Render):
1. Go to Service Settings → Custom Domain
2. Add your custom domain
3. Follow DNS configuration instructions

---

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:

- **Push to GitHub** → Automatically deploys
- Every commit to `main` triggers new deployment
- View deployment logs in respective dashboards

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: 503 Service Unavailable
- **Solution**: Free tier spins down after inactivity. First request takes ~30 seconds to wake up.

**Problem**: API calls failing
- **Solution**: Check CORS settings in server.js. Make sure your Vercel URL is allowed.

**Problem**: Deployment failing
- **Solution**: Check logs in Render dashboard. Usually missing dependencies or wrong Node version.

### Frontend Issues

**Problem**: Build failing
- **Solution**: Check build logs. Usually missing dependencies or import errors.

**Problem**: Configurator not working
- **Solution**: Three.js needs client-side rendering. Make sure using `dynamic` import with `ssr: false`.

**Problem**: API calls failing
- **Solution**: Check `NEXT_PUBLIC_API_URL` environment variable is set correctly.

**Problem**: Images not loading
- **Solution**: Check `next.config.js` has correct image domains.

---

## 📊 Monitoring

### Backend Health Check
```bash
curl https://your-backend-url.onrender.com/api/health
```

### Frontend Monitoring
- Vercel provides built-in analytics
- Check deployment logs for errors
- Use browser console for client-side errors

---

## 🔐 Security Best Practices

1. **Never commit .env files**
   - Already in .gitignore
   - Use platform environment variables

2. **API Rate Limiting** (Future)
   - Add express-rate-limit
   - Implement API keys for production

3. **Database** (Future)
   - Current: In-memory storage (resets on restart)
   - Recommended: MongoDB Atlas or PostgreSQL on Render

---

## 📈 Scaling

### Free Tier Limitations

**Render:**
- Spins down after 15 min inactivity
- 750 hours/month free compute
- Perfect for demos and testing

**Vercel:**
- 100 GB bandwidth/month
- Serverless functions
- Great for production

### Upgrade Path

When ready to scale:
1. Upgrade Render to paid tier ($7/month)
2. Add database (MongoDB Atlas free tier)
3. Implement user authentication
4. Add Redis for caching
5. Set up monitoring (Sentry, LogRocket)

---

## 🎉 You're Done!

Your ModularSpace website is now live!
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-backend.onrender.com`

Share your configurator with the world! 🚀

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Next.js Docs: https://nextjs.org/docs
- Express Docs: https://expressjs.com/

Good luck! 🎨

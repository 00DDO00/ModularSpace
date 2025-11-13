# 🚀 Getting Started with ModularSpace

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Start (5 minutes)](#quick-start)
3. [Local Development](#local-development)
4. [Deployment](#deployment)
5. [Configurator Usage](#configurator-usage)
6. [Customization Guide](#customization-guide)

---

## 📖 Project Overview

**ModularSpace** is a complete, production-ready website for designing custom modular furniture with an interactive 3D configurator.

### What's Included

✅ **Complete Website** (5 pages)
- Home page with hero section
- Gallery with filterable products
- **3D Configurator** (the main feature!)
- About page
- Contact form

✅ **3D Configurator Features**
- Structure Mode: Create scaffolding
- Enclose Mode: Add colored walls
- Resize Mode: Adjust dimensions
- Real-time 3D preview
- 8 color options

✅ **Backend API**
- Save/load designs
- Contact form handler
- RESTful architecture

✅ **Ready for Deployment**
- Vercel configuration
- Render configuration
- Environment setup

---

## ⚡ Quick Start

### Option 1: View Locally (Fastest)

```bash
# 1. Navigate to project
cd modularspace-project/frontend

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open browser
# Visit: http://localhost:3000
```

That's it! Your site is running locally.

### Option 2: Deploy to Production (10 minutes)

Follow the **DEPLOYMENT_GUIDE.md** for step-by-step instructions.

---

## 💻 Local Development

### Prerequisites

```bash
# Check Node.js version (need 18+)
node --version

# Check npm
npm --version
```

Don't have Node.js? Download from [nodejs.org](https://nodejs.org)

### Setup Both Frontend & Backend

#### Terminal 1: Frontend

```bash
cd modularspace-project/frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

#### Terminal 2: Backend

```bash
cd modularspace-project/backend
npm install
cp .env.example .env
npm run dev
# Runs on http://localhost:5000
```

### Test Everything Works

1. **Frontend**: Visit http://localhost:3000
2. **Backend Health**: Visit http://localhost:5000/api/health
3. **Configurator**: Navigate to http://localhost:3000/configurator

---

## 🚀 Deployment

### Prerequisites

1. GitHub account
2. Vercel account (free)
3. Render account (free)

### Deployment Steps

**See DEPLOYMENT_GUIDE.md** for detailed instructions, but here's the summary:

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

2. **Deploy Backend** (Render)
   - Import from GitHub
   - Root: `backend`
   - Build: `npm install`
   - Start: `npm start`

3. **Deploy Frontend** (Vercel)
   - Import from GitHub
   - Root: `frontend`
   - Add env var: `NEXT_PUBLIC_API_URL`
   - Auto-deploys!

---

## 🎨 Configurator Usage

### For End Users

1. **Navigate to Configurator Page**
   - Click "Try Designer" in navbar
   - Or visit `/configurator`

2. **Structure Mode** (Default)
   - Click boxes to remove them
   - Creates open spaces
   - Rods disappear for removed boxes

3. **Enclose Walls Mode**
   - Select a color
   - Click compartments to add walls
   - Creates enclosed storage

4. **Resize Walls Mode**
   - Drag edges of enclosed boxes
   - Each box resizes independently
   - Updates 3D view in real-time

5. **View in 3D**
   - Drag to rotate
   - Zoom with scroll
   - See your design from all angles

---

## 🛠️ Customization Guide

### Change Brand Colors

**File**: `frontend/tailwind.config.js`

```javascript
theme: {
  extend: {
    colors: {
      primary: '#FF6B35',    // Change this
      secondary: '#004E89',  // And this
      accent: '#F7B801',     // And this
    },
  },
}
```

### Change Company Info

**Files to Update**:
- `frontend/components/Navbar.jsx` - Logo and name
- `frontend/components/Footer.jsx` - Contact info
- `frontend/pages/about.js` - Company story

### Add New Pages

1. Create new file in `frontend/pages/`
2. Example: `frontend/pages/pricing.js`
3. Add to navbar in `frontend/components/Navbar.jsx`

### Modify Configurator

**File**: `frontend/components/ShelfConfigurator.jsx`

**Default Grid Size**: Line ~7
```javascript
const [gridSize, setGridSize] = useState({ rows: 8, cols: 8 });
```

**Color Palette**: Line ~43
```javascript
const colors = ['#FF6B6B', '#4ECDC4', /* add more */];
```

**3D Camera Position**: Line ~70
```javascript
camera.position.set(12, 10, 12); // Adjust X, Y, Z
```

### Add Database (Future)

See **ARCHITECTURE.md** for database integration plans.

---

## 📁 File Structure Explained

```
modularspace-project/
├── README.md              ← You are here!
├── DEPLOYMENT_GUIDE.md    ← How to deploy
├── ARCHITECTURE.md        ← Deep dive into code
│
├── frontend/              ← Website (Vercel)
│   ├── components/        ← Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   └── ShelfConfigurator.jsx  ⭐ THE CONFIGURATOR
│   │
│   ├── pages/             ← Website pages
│   │   ├── index.js       → Home
│   │   ├── gallery.js     → Product gallery
│   │   ├── configurator.js → ⭐ Configurator page
│   │   ├── about.js       → About us
│   │   └── contact.js     → Contact form
│   │
│   └── styles/
│       └── globals.css    ← Global styles
│
└── backend/               ← API (Render)
    └── server.js          ← Express server
```

---

## 🎯 Common Tasks

### Change Default Grid Size

```javascript
// frontend/components/ShelfConfigurator.jsx
const [gridSize, setGridSize] = useState({ 
  rows: 10,  // Change from 8 to 10
  cols: 10   // Change from 8 to 10
});
```

### Add More Colors

```javascript
// frontend/components/ShelfConfigurator.jsx
const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
  '#YOUR_NEW_COLOR', '#ANOTHER_COLOR'  // Add here
];
```

### Change Contact Email

```javascript
// frontend/components/Footer.jsx
<span>info@modularspace.com</span>  // Change this
```

### Update Fonts

```javascript
// frontend/pages/_document.js
<Head>
  <link href="https://fonts.googleapis.com/css2?family=YOUR_FONT" />
</Head>
```

---

## 🐛 Troubleshooting

### "Module not found"
```bash
cd frontend  # or backend
rm -rf node_modules package-lock.json
npm install
```

### Configurator not loading
- Check browser console for errors
- Ensure Three.js is installed: `npm list three`
- Try clearing browser cache

### API calls failing
- Check backend is running
- Verify `NEXT_PUBLIC_API_URL` in Vercel
- Check CORS settings in `backend/server.js`

### Build errors on Vercel
- Check build logs in Vercel dashboard
- Ensure all dependencies in `package.json`
- Try building locally: `npm run build`

---

## 📚 Learn More

- **Next.js**: https://nextjs.org/docs
- **Three.js**: https://threejs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Express.js**: https://expressjs.com/
- **Vercel**: https://vercel.com/docs
- **Render**: https://render.com/docs

---

## 🎉 You're Ready!

You now have everything you need to:
- ✅ Run the project locally
- ✅ Deploy to production
- ✅ Customize the design
- ✅ Add new features

**Next Steps:**
1. Read DEPLOYMENT_GUIDE.md
2. Deploy your site
3. Share with the world!

---

## 💡 Tips for Success

1. **Test Locally First** - Always test changes locally before deploying
2. **Use Git Branches** - Create branches for new features
3. **Environment Variables** - Never commit .env files
4. **Browser Testing** - Test on Chrome, Firefox, Safari
5. **Mobile Friendly** - Check responsive design

---

## 📞 Need Help?

- Check ARCHITECTURE.md for technical details
- Review DEPLOYMENT_GUIDE.md for deployment issues
- Search issues on GitHub
- Contact: info@modularspace.com

---

**Happy Building! 🚀**

Made with ❤️ for furniture designers everywhere.

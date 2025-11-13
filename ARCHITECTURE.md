# 🏗️ ModularSpace Architecture Overview

## Project Structure Visualization

```
modularspace-project/
│
├── 📄 README.md                    # Main project documentation
├── 📄 DEPLOYMENT_GUIDE.md          # Step-by-step deployment
│
├── 🎨 frontend/                    # Next.js Application (→ Vercel)
│   ├── components/
│   │   ├── Navbar.jsx              # Navigation bar
│   │   ├── Footer.jsx              # Site footer
│   │   ├── Layout.jsx              # Page wrapper
│   │   └── ShelfConfigurator.jsx   # ⭐ 3D Configurator Component
│   │
│   ├── pages/
│   │   ├── _app.js                 # Next.js app wrapper
│   │   ├── _document.js            # HTML document
│   │   ├── index.js                # Home page
│   │   ├── gallery.js              # Product gallery
│   │   ├── configurator.js         # ⭐ Main configurator page
│   │   ├── about.js                # About us page
│   │   └── contact.js              # Contact form
│   │
│   ├── styles/
│   │   └── globals.css             # Global styles + Tailwind
│   │
│   ├── public/                     # Static assets
│   │
│   ├── 📄 package.json             # Dependencies
│   ├── 📄 next.config.js           # Next.js config
│   ├── 📄 tailwind.config.js       # Tailwind config
│   └── 📄 .gitignore
│
└── ⚙️ backend/                     # Express.js API (→ Render)
    ├── 📄 server.js                # Main API server
    ├── 📄 package.json             # Dependencies
    ├── 📄 .env.example             # Environment template
    └── 📄 .gitignore
```

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│                                                              │
│  ┌────────────┐  ┌──────────┐  ┌────────────────────────┐ │
│  │  Home Page │  │ Gallery  │  │  ⭐ Configurator Page │ │
│  └────────────┘  └──────────┘  └────────────────────────┘ │
│         │              │                    │               │
│         └──────────────┴────────────────────┘               │
│                        │                                     │
│              ┌─────────▼──────────┐                         │
│              │  Navbar + Footer    │                         │
│              │    (Layout)         │                         │
│              └─────────┬──────────┘                         │
└────────────────────────┼──────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   3D Scene   │  │  2D Editor   │  │    Color     │
│  (Three.js)  │  │   (React)    │  │   Picker     │
└──────────────┘  └──────────────┘  └──────────────┘
        │                │                │
        └────────────────┴────────────────┘
                         │
                         │ API Calls
                         │
                         ▼
         ┌───────────────────────────────┐
         │     Express.js Backend         │
         │    (Deployed on Render)        │
         │                                │
         │  Routes:                       │
         │  • POST /api/designs           │
         │  • GET  /api/designs/:id       │
         │  • PUT  /api/designs/:id       │
         │  • POST /api/contact           │
         └───────────────────────────────┘
                         │
                         │ (Future: Database)
                         ▼
              ┌──────────────────┐
              │  MongoDB/Postgres │
              │  (Not included)   │
              └──────────────────┘
```

---

## Component Architecture: ShelfConfigurator

```
┌──────────────────────────────────────────────────────────┐
│              ShelfConfigurator Component                  │
│                                                           │
│  State Management:                                        │
│  ├─ gridSize (rows, cols)                               │
│  ├─ boxes (Set of active compartments)                  │
│  ├─ coloredItems (Map of colored walls)                 │
│  ├─ boxDimensions (Map of custom sizes)                 │
│  └─ editorMode (structure/fill/resize)                  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │            Mode Selector Buttons                 │   │
│  │  [Structure] [Enclose Walls] [Resize Walls]    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
│  ┌───────────────────────┬───────────────────────────┐  │
│  │                       │                           │  │
│  │   3D Preview Panel    │    2D Editor Panel        │  │
│  │   ─────────────────   │    ──────────────────     │  │
│  │                       │                           │  │
│  │   ┌──────────────┐    │   • Grid View             │  │
│  │   │  Three.js    │    │   • Drag to Edit          │  │
│  │   │   Scene      │    │   • Visual Feedback       │  │
│  │   │              │    │   • Resize Handles        │  │
│  │   │  - Camera    │    │                           │  │
│  │   │  - Lights    │    │                           │  │
│  │   │  - Rods      │    │                           │  │
│  │   │  - Walls     │    │                           │  │
│  │   └──────────────┘    │                           │  │
│  │                       │                           │  │
│  │   🖱️ Drag to Rotate  │   🖱️ Click to Edit       │  │
│  │                       │                           │  │
│  └───────────────────────┴───────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Design Summary Statistics                │   │
│  │   Grid: 8×8  |  Compartments: 45  |  Walls: 12  │   │
│  └─────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## Technology Stack Deep Dive

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.0.4 | React framework with SSR, routing |
| **React** | 18.2.0 | UI component library |
| **Three.js** | 0.160.0 | 3D graphics rendering |
| **Tailwind CSS** | 3.3.6 | Utility-first styling |
| **Lucide React** | 0.263.1 | Icon library |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Express.js** | 4.18.2 | Web server framework |
| **CORS** | 2.8.5 | Cross-origin requests |
| **Body Parser** | 1.20.2 | Request body parsing |

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     PRODUCTION                           │
│                                                          │
│  ┌──────────────────┐         ┌──────────────────┐     │
│  │                  │         │                  │     │
│  │  Vercel CDN     │◄────────┤  User's Browser  │     │
│  │  (Frontend)     │         │                  │     │
│  │                  │         └──────────────────┘     │
│  │  • Static files  │                  │              │
│  │  • Next.js SSR   │                  │              │
│  │  • Edge caching  │                  │ API calls    │
│  └────────┬─────────┘                  │              │
│           │                            ▼              │
│           │                   ┌──────────────────┐    │
│           │                   │                  │    │
│           └──────────────────►│  Render Server   │    │
│                               │  (Backend API)   │    │
│                               │                  │    │
│                               │  • Node.js       │    │
│                               │  • Express API   │    │
│                               │  • REST endpoints│    │
│                               └──────────────────┘    │
│                                                        │
│  Auto-deploy on Git push to main branch               │
└─────────────────────────────────────────────────────────┘
```

---

## Key Features Implementation

### 1. Structure Mode
- **What**: Add/remove compartments from scaffolding
- **How**: Click detection → Update `boxes` Set → Re-render 3D rods
- **Files**: `ShelfConfigurator.jsx` lines ~400-500

### 2. Enclose Mode
- **What**: Add colored walls to compartments
- **How**: Click → Update `coloredItems` Map → Render 6 wall panels
- **Files**: `ShelfConfigurator.jsx` lines ~320-400

### 3. Resize Mode
- **What**: Drag individual walls to resize boxes
- **How**: Mouse events → Update `boxDimensions` Map → Recalculate wall positions
- **Files**: `ShelfConfigurator.jsx` lines ~500-600

### 4. 3D Rendering
- **What**: Real-time 3D visualization
- **How**: Three.js scene with camera, lights, and meshes
- **Files**: `ShelfConfigurator.jsx` lines ~150-320

---

## API Endpoints Reference

### Designs

```
GET    /api/designs          # List all designs
POST   /api/designs          # Save new design
GET    /api/designs/:id      # Get specific design
PUT    /api/designs/:id      # Update design
DELETE /api/designs/:id      # Delete design
```

### Contact

```
POST   /api/contact          # Submit contact form
GET    /api/contact          # List messages (admin)
```

### Health

```
GET    /api/health           # Server status check
```

---

## Performance Optimizations

1. **Dynamic Import** - Configurator loads client-side only (no SSR)
2. **Image Optimization** - Next.js automatic image optimization
3. **Code Splitting** - Each page loads independently
4. **Lazy Loading** - Components load on demand
5. **CDN Delivery** - Static assets served from edge

---

## Future Enhancements

- [ ] User authentication (NextAuth.js)
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Save/load designs to database
- [ ] Share designs via URL
- [ ] Export as PNG/STL
- [ ] Material/texture selection
- [ ] Price calculator
- [ ] Shopping cart integration
- [ ] Admin dashboard
- [ ] Email notifications

---

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Mobile browsers (limited 3D performance)

---

## License & Credits

**Project**: ModularSpace
**License**: MIT
**3D Graphics**: Three.js
**Framework**: Next.js
**Icons**: Lucide React
**Styling**: Tailwind CSS

---

Built with ❤️ for custom furniture design

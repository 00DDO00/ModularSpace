# ModularSpace - Custom Furniture Design Platform

A modern web application for designing custom modular furniture with an interactive 3D configurator.

## 🏗️ Project Structure

```
modularspace-project/
├── frontend/          # Next.js frontend (deploy to Vercel)
├── backend/           # Express.js API (deploy to Render)
└── README.md         # This file
```

## ✨ Features

- **Interactive 3D Configurator**: Design custom shelving units with Three.js
- **Three Design Modes**:
  - Structure Mode: Add/remove compartments
  - Enclose Mode: Add colored walls
  - Resize Mode: Adjust individual walls
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Built with Tailwind CSS
- **RESTful API**: Save and load designs

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Git

### Local Development

#### 1. Clone the repository

```bash
git clone <your-repo-url>
cd modularspace-project
```

#### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on http://localhost:3000

#### 3. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend will run on http://localhost:5000

## 📦 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Set root directory to `frontend`
5. Vercel will auto-detect Next.js
6. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL
7. Deploy!

### Backend (Render)

1. Push your code to GitHub
2. Go to [Render](https://render.com)
3. Create new Web Service
4. Connect your repository
5. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables as needed
7. Deploy!

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14
- React 18
- Three.js (3D rendering)
- Tailwind CSS
- Lucide React (icons)

**Backend:**
- Node.js
- Express.js
- CORS

## 📝 API Endpoints

- `GET /api/health` - Health check
- `GET /api/designs` - Get all designs
- `GET /api/designs/:id` - Get single design
- `POST /api/designs` - Save new design
- `PUT /api/designs/:id` - Update design
- `DELETE /api/designs/:id` - Delete design
- `POST /api/contact` - Submit contact form

## 🎨 Pages

- **Home** (`/`) - Landing page with features
- **Gallery** (`/gallery`) - Browse design examples
- **Configurator** (`/configurator`) - 3D design tool ⭐
- **About** (`/about`) - Company information
- **Contact** (`/contact`) - Contact form

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email info@modularspace.com or open an issue in the repository.

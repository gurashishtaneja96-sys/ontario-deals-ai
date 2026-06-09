# Ontario Deals AI

Real estate lead management, content generation, and analytics dashboard.

---

## Run locally (takes ~3 minutes)

### Prerequisites
- Node.js installed → download at https://nodejs.org (choose LTS version)

### Steps

```bash
# 1. Open your terminal, navigate to this folder
cd ontario-deals-ai

# 2. Install dependencies (one time only)
npm install

# 3. Start the development server
npm run dev
```

Then open your browser at **http://localhost:5173**

That's it. The dashboard is running.

---

## Deploy to Vercel (free, takes ~5 minutes)

### Option A — Vercel CLI (recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login (creates free account if you don't have one)
vercel login

# Deploy from inside the project folder
vercel --prod
```

Vercel will give you a live URL like:
`https://ontario-deals-ai.vercel.app`

---

### Option B — GitHub + Vercel (best for ongoing updates)

1. Create a free account at github.com
2. Create a new repository called `ontario-deals-ai`
3. Push this folder to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ontario-deals-ai.git
git push -u origin main
```

4. Go to vercel.com → "Add New Project" → import from GitHub
5. Click Deploy — done

Every time you push to GitHub, Vercel auto-deploys.

---

## Add a custom domain

1. Buy a domain at namecheap.com (~$12/year)
2. In Vercel dashboard → your project → Settings → Domains
3. Add your domain, follow the DNS instructions

---

## Project structure

```
ontario-deals-ai/
├── index.html          ← Entry HTML (don't touch)
├── vite.config.js      ← Vite config (don't touch)
├── package.json        ← Dependencies
├── vercel.json         ← Deployment config
├── public/
│   └── favicon.svg     ← Browser tab icon
└── src/
    ├── main.jsx        ← React entry point (don't touch)
    └── App.jsx         ← THE ENTIRE DASHBOARD (edit this)
```

All your UI, data, and logic is in `src/App.jsx`.

---

## Build for production

```bash
npm run build
```

Creates a `dist/` folder with optimised static files ready to deploy anywhere.

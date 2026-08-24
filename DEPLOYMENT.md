# 🚀 SportX Frontend — Production Deployment Guide (Vercel)

This document provides step-by-step instructions to deploy the `SportX-Frontend` React Vite application to **Vercel**.

---

## 1. Vercel Project Setup

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** → Select **Project**.
3. Import your GitHub Repository: `https://github.com/Prutwi17/SportX-Frontend`.
4. Configure Build Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Expand **Environment Variables** and add:

| Environment Variable Key | Production Value Example |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://sportx-backend.onrender.com` |

6. Click **Deploy**.

---

## 2. SPA Routing Rewrite Configuration (`vercel.json`)
The repository contains `vercel.json` with SPA rewrite rules to ensure direct page reloads on routes like `/products/438`, `/cart`, `/checkout`, and `/admin` return `index.html` without 404 errors.

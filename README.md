# 🌹 Boutique Management System

A professional, internal cloud-hosted website for managing boutique customers, product orders, delivery schedules, and payments.

## ✨ Features
- **Luxury Fashion UI:** Rose gold theme with smooth animations and responsive design.
- **Delivery Calendar:** Google Calendar style view for tracking upcoming deliveries.
- **Customer Database:** Full searchable master database with PDF/Excel exports.
- **Internal Auth:** Secure dashboard accessible only via login.
- **Cloud Hosted:** Works 24/7 on multiple devices with live database.

---

## 🚀 Deployment Guide (Host Free of Cost)

Follow these steps to get your boutique system online in 10 minutes.

### 1. Setup Database (Supabase)
1. Go to [Supabase](https://supabase.com/) and sign up.
2. Create a **New Project**.
3. Choose a name and regions (e.g., Mumbai for India).
4. Go to **SQL Editor** (left sidebar tab).
5. Open a **New Query** and paste the contents of `supabase_setup.sql`.
6. Click **Run**. Your tables and triggers are now ready!
7. Go to **Project Settings** > **API**.
8. Copy the `Project URL` and the `anon (public)` key. You will need these for the next step.

### 2. Prepare Code Reference
1. Create a **GitHub** repository.
2. Push all the project files to this repository.
3. Make sure you don't commit the `.env` file (keep the `.env.example`).

### 3. Deploy Frontend (Vercel)
1. Go to [Vercel](https://vercel.com/) and sign up with GitHub.
2. Click **Add New** > **Project**.
3. Import your boutique repository.
4. Expand **Environment Variables** and add:
   - `VITE_SUPABASE_URL`: (Paste your Supabase Project URL)
   - `VITE_SUPABASE_ANON_KEY`: (Paste your Supabase anon key)
5. Click **Deploy**.
6. Once finished, Vercel will give you a link (e.g., `boutique-manager.vercel.app`). Your app is now live!

---

## 🛠️ Configuration
You can change the Boutique name and login credentials in `src/config/config.js`:

```javascript
const config = {
  boutiqueName: "My Boutique",
  auth: {
    username: "admin",
    password: "123456"
  }
}
```

---

## 📊 Local Development
To run this project on your computer:
1. `npm install`
2. Create a `.env` file with your Supabase keys.
3. `npm run dev`

## 📦 Tech Stack
- **Frontend:** React + Vite
- **Styling:** Vanilla CSS (Custom Variable System)
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel
- **Libraries:** Lucide React, Recharts, jsPDF, XLSX, Date-fns.

---
*Created with elegance for premium boutique management.*

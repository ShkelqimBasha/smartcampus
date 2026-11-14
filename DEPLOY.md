# 🚀 Udhëzues Deploy – SMARTCAMPUS

## Rendi i Deploy
1. **Backend në Render (i pari)**
2. **Frontend në Vercel (pastaj)**

---

## 1. Backend – Render

1. Krijo llogari në https://render.com (Sign up with GitHub)
2. **New +** → **Web Service**
3. Lidh repo-n `smartcampus`
4. Konfiguro parametrat bazë:
   - **Name:** `smartcampus-api`
   - **Region:** Frankfurt (EU Central)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate && npx prisma db push && node prisma/seed.js`
   - **Start Command:** `node server.js`

> [!IMPORTANT]
> **Pse `node prisma/seed.js` në Build Command?**
> Në planin falas të Render, disku me SQLite është ephemeral (mund të rivendoset në rinisje). Duke e vendosur `node prisma/seed.js` direkt në **Build Command**, Render do të mbushë automatikisht dhe në mënyrë të sigurt (idempotente) bazën e të dhënave me të gjithë përdoruesit demo, sallat, oraret dhe detyrat në çdo deploy!

5. **Environment Variables:**
   - `DATABASE_URL` = `file:./dev.db`
   - `JWT_SECRET` = `smartcampus_2026_super_secret_key_xyz123abc`
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
6. **Instance Type:** Free
7. **Create Web Service**
8. Prit 3-5 min → merr URL: `https://smartcampus-api.onrender.com`
9. Testo në shfletues: duhet të shfaqë `{"message":"SMARTCAMPUS API v1.0"}`

---

## 2. Frontend – Vercel

1. Krijo llogari në https://vercel.com (Continue with GitHub)
2. **Add New** → **Project**
3. Importo repo-n `smartcampus`
4. Konfiguro:
   - **Project Name:** `smartcampus`
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` (kliko Edit dhe vendos `frontend`)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **Environment Variable:**
   - `VITE_API_URL` = `https://smartcampus-api.onrender.com/api` *(ose URL juaj nga Render)*
6. **Deploy**
7. Prit 1-2 min → merr URL: `https://smartcampus-xxxx.vercel.app`

---

## 3. Pas Deploy

- Përditëso `README.md` me linkun live të platformës dhe API-t
- Testo kyçjen me të 3 rolet (Student, Pedagog, Admin) duke përdorur butonat e shpejtë Demo
- Regjistro videon e prezantimit të projektit me URL live

---

## ⚠️ Probleme të zakonshme & Zgjidhje

| Problemi | Zgjidhja |
|---|---|
| **Backend build failed** | Kontrollo Build Command: `npm install && npx prisma generate && npx prisma db push && node prisma/seed.js` |
| **Network Error në Frontend** | Kontrollo që `VITE_API_URL` përfundon me `/api` (p.sh. `https://smartcampus-api.onrender.com/api`) |
| **404 kur rifreskon faqe të brendshme** | Sigurohu që ekziston skedari `frontend/vercel.json` me rregullin e rishkrimit (`rewrites`) |
| **Login error (kredenciale)** | Serveri në Render mund të jetë duke u zgjuar (cold start). Prit 30 sekonda dhe provo përsëri |
| **Humbja e të dhënave në Render** | Skedari `seed.js` ekzekutohet automatikisht në çdo deploy falë Build Command të përditësuar |

# 🚀 Udhëzues Deploy – SMARTCAMPUS

## Rendi i Deploy
1. Backend në Render (i pari)
2. Frontend në Vercel (pastaj)

---

## 1. Backend – Render

1. Krijo llogari në https://render.com (Sign up with GitHub)
2. **New +** → **Web Service**
3. Lidh repo `smartcampus`
4. Konfiguro:
   - **Name:** `smartcampus-api`
   - **Region:** Frankfurt (EU Central)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate && npx prisma db push`
   - **Start Command:** `node server.js`
5. **Environment Variables:**
   - `DATABASE_URL` = `file:./dev.db`
   - `JWT_SECRET` = `smartcampus_2026_super_secret_key_xyz123abc`
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
6. **Instance Type:** Free
7. **Create Web Service**
8. Prit 3-5 min → merr URL: `https://smartcampus-api.onrender.com`
9. Testo në shfletues: duhet të shfaqë `{"message":"SMARTCAMPUS API v1.0"}`
10. **Shell** → ekzekuto: `node prisma/seed.js` (për të dhëna fillestare)

---

## 2. Frontend – Vercel

1. Krijo llogari në https://vercel.com (Continue with GitHub)
2. **Add New** → **Project**
3. Importo repo `smartcampus`
4. Konfiguro:
   - **Project Name:** `smartcampus`
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` (kliko Edit dhe shkruaj)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **Environment Variable:**
   - `VITE_API_URL` = `https://smartcampus-api.onrender.com/api`
6. **Deploy**
7. Prit 2-3 min → merr URL: `https://smartcampus-xxxx.vercel.app`

---

## 3. Pas Deploy

- Përditëso README.md me linkun live
- Testo me 3 role
- Regjistro video demo me linkun live

---

## ⚠️ Probleme të zakonshme

| Problemi | Zgjidhja |
|---|---|
| Backend build failed | Kontrollo Build Command saktësisht |
| Network Error frontend | Kontrollo `VITE_API_URL` mbaron me `/api` |
| 404 kur rifreskon | Kontrollo `frontend/vercel.json` ekziston |
| Login nuk funksionon | Kontrollo `JWT_SECRET` në Render |
| Render fle | Prit 30-60 sek pas hapjes së linkut |


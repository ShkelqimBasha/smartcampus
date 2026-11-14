# 🎓 SMARTCAMPUS

**Platformë e integruar për shërbimet universitare**

Projekt kursi për lëndën "Hartim dhe Menaxhim Projektesh" – Prof.as.dr. Adrian Maho.

---

## 🌐 Demo Live

- **Platforma:** _(do të plotësohet pas deploy)_
- **API:** _(do të plotësohet pas deploy)_

---

## 🔑 Kredencialet Demo

Fjalëkalimi për të gjithë përdoruesit: `demo123`

| Roli | Email | Emri |
|---|---|---|
| 👨🎓 Student | student@smartcampus.al | Shkëlqim Basha |
| 👨🏫 Pedagog | pedagog@smartcampus.al | Adrian Maho |
| 🔧 Admin | admin@smartcampus.al | Admin SmartCampus |

Përdorues të tjerë demo: `student2@...` deri `student8@...`, `pedagog2@...`, `pedagog3@...` (të gjithë me `demo123`).

---

## ⚡ Si të ekzekutohet lokalisht

### Me 1 klik (Windows)
Kliko dy herë mbi `start.bat` në rrënjë.

### Manualisht

**Terminali 1 – Backend:**
```bash
cd backend
npm install
npx prisma db push
node prisma/seed.js
npm run dev
```

**Terminali 2 – Frontend:**
```bash
cd frontend
npm install
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api

---

## 🛠 Stack-u i Teknologjisë

| Shtresa | Teknologjia |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Backend | Node.js + Express |
| Baza e të dhënave | SQLite |
| ORM | Prisma |
| Autentikim | JWT + bcrypt |
| Upload files | Multer |
| Grafikë | Chart.js |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📦 Modulet

- **M1 – Autentikim & Role** (Student, Pedagog, Admin)
- **M2 – Njoftime me targetim** (ALL, FACULTY, GROUP)
- **M3 – Orari Akademik javor**
- **M4 – Detyra & Dorëzime** me upload file
- **M5 – Rezervim Sallash** me kontroll konflikti
- **M6 – Statistika** me Chart.js

---

## 🚀 Deployment

### Backend (Render)
- **Root Directory:** `backend`
- **Build Command:** `npm install && npx prisma generate && npx prisma db push`
- **Start Command:** `node server.js`
- **Environment Variables:**
  - `DATABASE_URL` = `file:./dev.db`
  - `JWT_SECRET` = `<string i gjatë random>`
  - `NODE_ENV` = `production`

### Frontend (Vercel)
- **Root Directory:** `frontend`
- **Framework Preset:** `Vite`
- **Environment Variable:**
  - `VITE_API_URL` = `https://<backend-url>.onrender.com/api`

---

## 📄 Licensa
Projekt akademik – Universiteti, 2026–2027.

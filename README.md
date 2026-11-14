# 🎓 SMARTCAMPUS

**Platformë e integruar për shërbimet universitare**

Projekt kursi për lëndën "Hartim dhe Menaxhim Projektesh" – Prof.as.dr. Adrian Maho.

---

## 🌐 Demo Live

- **Platforma (Vercel):** _(do të plotësohet pas deploy)_
- **API (Render):** _(do të plotësohet pas deploy)_

---

## 🔑 Kredencialet Demo

Fjalëkalimi për të gjithë përdoruesit: `demo123`

| Roli | Email | Emri | Grupi / Fakulteti |
|---|---|---|---|
| 👨‍🎓 Student | `student@smartcampus.al` | Shkëlqim Basha | FTI-1 (Informatikë Viti 2) |
| 👨‍🏫 Pedagog | `pedagog@smartcampus.al` | Adrian Maho | FTI (Departamenti i Informatikës) |
| 🔧 Admin | `admin@smartcampus.al` | Admin SmartCampus | Administrata Qendrore |

Përdorues të tjerë demo: `student2@...` deri `student8@...`, `pedagog2@...`, `pedagog3@...` (të gjithë me fjalëkalim `demo123`).

---

## ⚡ Si të ekzekutohet lokalisht

### Me 1 klik (Windows)
Kliko dy herë mbi `start.bat` në rrënjën e projektit.

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
| Upload skedarësh | Multer |
| Grafikë | Chart.js + react-chartjs-2 |
| Ikona | Lucide React |
| Deployment | Vercel (Frontend) + Render (Backend) |

---

## 📦 Modulet Kryesore

- **M1 – Autentikim & Role:** JWT, fjalëkalime të hash-uara me bcrypt, role të dedikuara (Student, Pedagog, Admin) dhe Quick Login 1-klik.
- **M2 – Njoftime me Targetim:** Targetim në 3 nivele (`ALL`, `FACULTY`, `GROUP`) me status leximi në kohë reale.
- **M3 – Orari Akademik Javor:** Pamje interaktive me tab-e ditore nga e Hëna në të Premte sipas grupit dhe fakultetit.
- **M4 – Detyra & Dorëzime:** Menaxhim afatesh, dorëzim skedarësh (PDF/ZIP/DOCX), detektim automatik i vonesave (`LATE`), dhe vlerësim me notë e komente.
- **M5 – Rezervim Sallash:** Katalog sallash, amfiteatrosh e laboratorësh me kontroll automatik të mbivendosjes së orareve.
- **M6 – Paneli Administrativ & Statistika:** Menaxhim përdoruesish (aktivizim/çaktivizim) dhe grafikë vizualë me Chart.js.

---

## 📂 Struktura e Projektit

```text
smartcampus/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Skema e të dhënave SQLite & modelet Prisma
│   │   └── seed.js                # Mbushja automatike idempotente e bazës
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── auth.js            # Verifikimi i JWT tokens
│   │   │   ├── roles.js           # Kontrolli i roleve RBAC (STUDENT, PROFESSOR, ADMIN)
│   │   │   └── errorHandler.js   # Menaxhimi qendror i gabimeve
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── announcements.routes.js
│   │   │   ├── schedules.routes.js
│   │   │   ├── assignments.routes.js
│   │   │   ├── submissions.routes.js
│   │   │   ├── rooms.routes.js
│   │   │   ├── bookings.routes.js
│   │   │   └── admin.routes.js
│   │   └── controllers/           # Logjika e biznesit për çdo modul
│   ├── uploads/                   # Dosja për ngarkimin e skedarëve të studentëve
│   ├── server.js                  # Pika kryesore hyrëse e backend-it Express
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx         # Layout-i kryesor me Sidebar dhe Navbar
│   │   │   ├── Navbar.jsx         # Shiriti i sipërm me kërkim dhe profil
│   │   │   ├── Sidebar.jsx        # Menuja anësore e personalizuar sipas rolit
│   │   │   └── ProtectedRoute.jsx # Mbrojtja e rrugëve me autentikim & role
│   │   ├── pages/
│   │   │   ├── Landing.jsx        # Faqja kryesore publike e mirëseardhjes
│   │   │   ├── Login.jsx          # Kyçja me kredenciale dhe 1-Click Demo
│   │   │   ├── Register.jsx       # Regjistrimi i studentëve të rinj
│   │   │   ├── Dashboard.jsx      # Paneli kryesor me metrika & widget-e
│   │   │   ├── Announcements.jsx  # Moduli i njoftimeve
│   │   │   ├── Schedule.jsx       # Orari mësimor javor
│   │   │   ├── Assignments.jsx    # Lista e detyrave të kursit
│   │   │   ├── AssignmentDetail.jsx # Detajet e detyrës, dorëzimi dhe vlerësimi
│   │   │   ├── Rooms.jsx          # Lista e sallave universitare
│   │   │   ├── Bookings.jsx       # Rezervimet dhe menaxhimi i statuseve
│   │   │   ├── AdminUsers.jsx     # Menaxhimi i llogarive nga Administratori
│   │   │   └── AdminStats.jsx     # Raportet statistikore & grafikët analitikë
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Menaxhimi i gjendjes së përdoruesit & JWT
│   │   │   ├── ToastContext.jsx   # Njoftimet Toast
│   │   │   └── ThemeContext.jsx   # Mbështetja për Dark / Light mode
│   │   ├── services/
│   │   │   └── api.js             # Konfigurimi i Axios me interceptors
│   │   ├── utils/
│   │   │   └── constants.js       # Konstantet e sistemit (ditët, ngjyrat, etiketat)
│   │   ├── App.jsx                # Përcaktimi i të gjitha rrugëve
│   │   ├── main.jsx               # Pika hyrëse e React 18
│   │   └── index.css              # Stilet Tailwind CSS
│   ├── vercel.json                # Konfigurimi i rishkrimit të rrugëve për Vercel
│   └── package.json
│
├── DEPLOY.md                      # Udhëzuesi i hollësishëm hap-pas-hapi për deploy
├── README.md                      # Dokumentacioni kryesor i projektit
├── start.bat                      # Skript nisës automatik me 1 klik për Windows
└── .gitignore                     # Rregullat e përjashtimit të Git
```

---

## 🤝 Si të kontribuohet

Kontributet dhe përmirësimet në projekt janë gjithmonë të mirëpritura! Për të kontribuar:

1. **Fork** këtë repository në llogarinë tuaj GitHub.
2. Krijo një degë të re pune (`branch`) për veçorinë tuaj:
   ```bash
   git checkout -b feature/emri-i-vecorise
   ```
3. Bëj ndryshimet e nevojshme në kod dhe sigurohu që ndërtohet me sukses:
   ```bash
   cd frontend && npm run build
   ```
4. Kryej commit-et me mesazhe të qarta konvencionale:
   ```bash
   git commit -m "feat: shto funksionalitetin e ri"
   ```
5. Dërgo ndryshimet në degën tuaj në GitHub:
   ```bash
   git push origin feature/emri-i-vecorise
   ```
6. Hap një **Pull Request (PR)** në repository-n kryesor duke shpjeguar përmirësimet e bëra.

---

## 🚀 Deployment

### Backend (Render)
- **Root Directory:** `backend`
- **Build Command:** `npm install && npx prisma generate && npx prisma db push && node prisma/seed.js`
- **Start Command:** `node server.js`
- **Environment Variables:**
  - `DATABASE_URL` = `file:./dev.db`
  - `JWT_SECRET` = `<string i gjatë sekret>`
  - `NODE_ENV` = `production`

### Frontend (Vercel)
- **Root Directory:** `frontend`
- **Framework Preset:** `Vite`
- **Environment Variable:**
  - `VITE_API_URL` = `https://<backend-url>.onrender.com/api`

---

## 📄 Licenca
Projekt akademik – Universiteti, 2026–2027.
Punuar nga **Shkëlqim Basha** për lëndën "Hartim dhe Menaxhim Projektesh".

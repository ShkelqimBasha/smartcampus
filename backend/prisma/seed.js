const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Duke filluar mbushjen e sigurt dhe të pasur të bazës së të dhënave (Idempotent Seed)...');

  // 1. Pastrimi i sigurt i të dhënave ekzistuese në rendin e duhur të varësive
  try {
    await prisma.announcementRead.deleteMany({});
    await prisma.submission.deleteMany({});
    await prisma.assignment.deleteMany({});
    await prisma.schedule.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.room.deleteMany({});
    await prisma.announcement.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('🧹 Pastrimi i tabelave të vjetra u krye me sukses.');
  } catch (cleanupErr) {
    console.warn('⚠️ Njoftim gjatë pastrimit fillestar (vazhdojmë me upsert):', cleanupErr.message);
  }

  const passwordHash = await bcrypt.hash('demo123', 10);

  // Helper funksion për krijim ose përditësim të sigurt (Idempotent Upsert)
  async function upsertUser(userData) {
    return await prisma.user.upsert({
      where: { email: userData.email },
      update: userData,
      create: userData
    });
  }

  // 2. Krijimi i 12 Përdoruesve (1 Admin, 3 Pedagogë, 8 Studentë)
  console.log('👤 Duke krijuar 12 përdoruesit me upsert...');

  const admin = await upsertUser({
    email: 'admin@smartcampus.al',
    password: passwordHash,
    firstName: 'Admin',
    lastName: 'SmartCampus',
    role: 'ADMIN',
    isActive: true
  });

  const prof1 = await upsertUser({
    email: 'pedagog@smartcampus.al',
    password: passwordHash,
    firstName: 'Adrian',
    lastName: 'Maho',
    role: 'PROFESSOR',
    faculty: 'Fakulteti i Teknologjisë së Informacionit',
    group: 'FTI-1',
    isActive: true
  });

  const prof2 = await upsertUser({
    email: 'pedagog2@smartcampus.al',
    password: passwordHash,
    firstName: 'Elena',
    lastName: 'Prifti',
    role: 'PROFESSOR',
    faculty: 'Fakulteti Ekonomik',
    group: 'BIZ-1',
    isActive: true
  });

  const prof3 = await upsertUser({
    email: 'pedagog3@smartcampus.al',
    password: passwordHash,
    firstName: 'Arben',
    lastName: 'Hoxha',
    role: 'PROFESSOR',
    faculty: 'Fakulteti i Teknologjisë së Informacionit',
    group: 'FTI-2',
    isActive: true
  });

  const student1 = await upsertUser({
    email: 'student@smartcampus.al',
    password: passwordHash,
    firstName: 'Shkëlqim',
    lastName: 'Basha',
    role: 'STUDENT',
    faculty: 'Fakulteti i Teknologjisë së Informacionit',
    group: 'FTI-1',
    isActive: true
  });

  const student2 = await upsertUser({
    email: 'student2@smartcampus.al',
    password: passwordHash,
    firstName: 'Sara',
    lastName: 'Hoxha',
    role: 'STUDENT',
    faculty: 'Fakulteti i Teknologjisë së Informacionit',
    group: 'FTI-1',
    isActive: true
  });

  const student3 = await upsertUser({
    email: 'student3@smartcampus.al',
    password: passwordHash,
    firstName: 'Erion',
    lastName: 'Malaj',
    role: 'STUDENT',
    faculty: 'Fakulteti i Teknologjisë së Informacionit',
    group: 'FTI-2',
    isActive: true
  });

  const student4 = await upsertUser({
    email: 'student4@smartcampus.al',
    password: passwordHash,
    firstName: 'Anisa',
    lastName: 'Dervishi',
    role: 'STUDENT',
    faculty: 'Fakulteti i Teknologjisë së Informacionit',
    group: 'FTI-2',
    isActive: true
  });

  const student5 = await upsertUser({
    email: 'student5@smartcampus.al',
    password: passwordHash,
    firstName: 'Klodian',
    lastName: 'Rama',
    role: 'STUDENT',
    faculty: 'Fakulteti Ekonomik',
    group: 'BIZ-1',
    isActive: true
  });

  const student6 = await upsertUser({
    email: 'student6@smartcampus.al',
    password: passwordHash,
    firstName: 'Keisi',
    lastName: 'Zeka',
    role: 'STUDENT',
    faculty: 'Fakulteti Ekonomik',
    group: 'BIZ-1',
    isActive: true
  });

  const student7 = await upsertUser({
    email: 'student7@smartcampus.al',
    password: passwordHash,
    firstName: 'Denisa',
    lastName: 'Kuqi',
    role: 'STUDENT',
    faculty: 'Fakulteti i Teknologjisë së Informacionit',
    group: 'FTI-1',
    isActive: true
  });

  const student8 = await upsertUser({
    email: 'student8@smartcampus.al',
    password: passwordHash,
    firstName: 'Besnik',
    lastName: 'Berisha',
    role: 'STUDENT',
    faculty: 'Fakulteti Ekonomik',
    group: 'BIZ-1',
    isActive: true
  });

  console.log('✅ U krijuan/përditësuan 12 përdorues (fjalëkalimi për të gjithë: demo123).');

  // 3. Krijimi i 8 Sallave Universitare me upsert
  console.log('🏢 Duke krijuar 8 sallat me upsert...');
  const roomsData = [
    { name: 'A101', capacity: 35, building: 'Ndërtesa A', equipment: 'Projektor, Tabelë e Bardhë, Wi-Fi' },
    { name: 'A102', capacity: 25, building: 'Ndërtesa A', equipment: 'Projektor, Sound System, Klimë' },
    { name: 'A103', capacity: 40, building: 'Ndërtesa A', equipment: 'Projektor, Tabelë e Zezë, Klimë' },
    { name: 'B201', capacity: 60, building: 'Ndërtesa B', equipment: 'Smart Board, Projektor, Mikrofon Wireless' },
    { name: 'B202', capacity: 50, building: 'Ndërtesa B', equipment: 'Smart Board, Projektor, Sound System' },
    { name: 'C301', capacity: 80, building: 'Amfiteatri Qendror', equipment: 'Projektor Dual, Sound System, 2x Mikrofon, Klimë' },
    { name: 'LAB1', capacity: 25, building: 'Ndërtesa C - Laboratorë', equipment: '25 PC Workstation, Projektor, Switch LAN Gigabit' },
    { name: 'LAB2', capacity: 30, building: 'Ndërtesa C - Laboratorë', equipment: '30 PC iMac, Smart Board, Set Pajisjesh Robotike' }
  ];

  const rooms = [];
  for (const r of roomsData) {
    const room = await prisma.room.upsert({
      where: { name: r.name },
      update: r,
      create: r
    });
    rooms.push(room);
  }
  console.log('✅ U shtuan/përditësuan 8 salla dhe amfiteatro.');

  // 4. Krijimi i 5 Njoftimeve me nivele të ndryshme targetimi
  console.log('📢 Duke krijuar 5 njoftime...');
  const ann1 = await prisma.announcement.create({
    data: {
      title: 'Mirësevini në semestrin e ri akademik 2026-2027',
      content: 'I urojmë mirëseardhjen të gjithë studentëve dhe stafit akademik! Ju lutemi kontrolloni oraret tuaja javore dhe përditësoni të dhënat tuaja të kontaktit.',
      target: 'ALL',
      authorId: admin.id
    }
  });

  const ann2 = await prisma.announcement.create({
    data: {
      title: 'Orari i ri i konsultimeve për departamentin e Informatikës',
      content: 'Të nderuar studentë të FTI-së, orët e hapura të konsultimeve do të zhvillohen çdo të premte ora 14:00 - 16:00 në sallën A101.',
      target: 'FACULTY',
      faculty: 'Fakulteti i Teknologjisë së Informacionit',
      authorId: prof1.id
    }
  });

  const ann3 = await prisma.announcement.create({
    data: {
      title: 'Regjistrimet për Hackathon-in Vjetor universitar SMARTCAMPUS',
      content: 'Ftohen të gjithë studentët e apasionuar pas inovacionit të regjistrohen në Hackathon-in universitar që do të zhvillohet më 25 Nëntor. Çmimet përfshijnë bursa studimi dhe pajisje teknologjike.',
      target: 'ALL',
      authorId: admin.id
    }
  });

  const ann4 = await prisma.announcement.create({
    data: {
      title: 'Materialet e leksionit dhe grupet e seminarit për FTI-1',
      content: 'Studentët e grupit FTI-1 mund të shkarkojnë setin e ri të ushtrimeve për lëndën Inxhinieri Softi në seksionin e detyrave.',
      target: 'GROUP',
      group: 'FTI-1',
      authorId: prof3.id
    }
  });

  const ann5 = await prisma.announcement.create({
    data: {
      title: 'Njoftim për provimin e ndërmjetëm në Menaxhim Biznesi',
      content: 'Provimi i ndërmjetëm për studentët e vitit të parë Biznes do të mbahet të martën e ardhshme në Amfiteatrin C301, ora 10:00.',
      target: 'GROUP',
      group: 'BIZ-1',
      authorId: prof2.id
    }
  });

  // Shënojmë ann1 si të lexuar për student1 për të testuar leximin
  await prisma.announcementRead.create({
    data: {
      userId: student1.id,
      announcementId: ann1.id
    }
  });
  console.log('✅ U krijuan 5 njoftime shembull.');

  // 5. Krijimi i 10 Orareve Mësimore për 3 Grupe
  console.log('📅 Duke krijuar 10 orare mësimore...');
  await prisma.schedule.createMany({
    data: [
      // FTI-1 (Informatikë Viti 2)
      {
        subject: 'Hartim dhe Menaxhim Projektesh',
        professorId: prof1.id,
        faculty: 'Fakulteti i Teknologjisë së Informacionit',
        group: 'FTI-1',
        dayOfWeek: 1, // E Hënë
        startTime: '09:00',
        endTime: '11:00',
        room: 'A101'
      },
      {
        subject: 'Baza të Dhënash të Avancuara',
        professorId: prof3.id,
        faculty: 'Fakulteti i Teknologjisë së Informacionit',
        group: 'FTI-1',
        dayOfWeek: 2, // E Martë
        startTime: '11:00',
        endTime: '13:00',
        room: 'LAB1'
      },
      {
        subject: 'Inxhinieri Softi',
        professorId: prof1.id,
        faculty: 'Fakulteti i Teknologjisë së Informacionit',
        group: 'FTI-1',
        dayOfWeek: 3, // E Mërkurë
        startTime: '10:00',
        endTime: '12:00',
        room: 'B201'
      },
      {
        subject: 'Rrjeta Kompjuterike & Siguri',
        professorId: prof3.id,
        faculty: 'Fakulteti i Teknologjisë së Informacionit',
        group: 'FTI-1',
        dayOfWeek: 4, // E Enjte
        startTime: '13:00',
        endTime: '15:00',
        room: 'LAB2'
      },

      // FTI-2 (Informatikë Viti 3)
      {
        subject: 'Inteligjencë Artificiale & Machine Learning',
        professorId: prof3.id,
        faculty: 'Fakulteti i Teknologjisë së Informacionit',
        group: 'FTI-2',
        dayOfWeek: 1, // E Hënë
        startTime: '12:00',
        endTime: '14:00',
        room: 'C301'
      },
      {
        subject: 'Arkitektura Cloud & Microservices',
        professorId: prof1.id,
        faculty: 'Fakulteti i Teknologjisë së Informacionit',
        group: 'FTI-2',
        dayOfWeek: 3, // E Mërkurë
        startTime: '14:00',
        endTime: '16:00',
        room: 'LAB1'
      },
      {
        subject: 'Siguri Kibernetike e Avancuar',
        professorId: prof3.id,
        faculty: 'Fakulteti i Teknologjisë së Informacionit',
        group: 'FTI-2',
        dayOfWeek: 5, // E Premte
        startTime: '09:00',
        endTime: '11:00',
        room: 'LAB2'
      },

      // BIZ-1 (Biznes Viti 1)
      {
        subject: 'Menaxhim Biznesi & Sipërmarrje',
        professorId: prof2.id,
        faculty: 'Fakulteti Ekonomik',
        group: 'BIZ-1',
        dayOfWeek: 1, // E Hënë
        startTime: '10:00',
        endTime: '12:00',
        room: 'B202'
      },
      {
        subject: 'Mikroekonomi e Aplikuar',
        professorId: prof2.id,
        faculty: 'Fakulteti Ekonomik',
        group: 'BIZ-1',
        dayOfWeek: 2, // E Martë
        startTime: '09:00',
        endTime: '11:00',
        room: 'C301'
      },
      {
        subject: 'Statistikë për Vendimmarrje',
        professorId: prof2.id,
        faculty: 'Fakulteti Ekonomik',
        group: 'BIZ-1',
        dayOfWeek: 4, // E Enjte
        startTime: '11:00',
        endTime: '13:00',
        room: 'A102'
      }
    ]
  });
  console.log('✅ U regjistruan 10 orare javore mësimore.');

  // 6. Krijimi i 6 Detyrave Kursi
  console.log('📝 Duke krijuar 6 detyrat...');
  const now = new Date();
  const pastDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 ditë më parë (për të testuar LATE/MISSING)
  const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const in14Days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const assign1 = await prisma.assignment.create({
    data: {
      title: 'Detyrë Kursi 1: Dokumentacioni i Projektit SMARTCAMPUS',
      description: 'Përgatitni specifikimin funksional, diagramet UML dhe arkitekturën teknike të aplikacionit sipas kërkesave të lëndës.',
      deadline: in7Days,
      professorId: prof1.id,
      faculty: 'Fakulteti i Teknologjisë së Informacionit',
      group: 'FTI-1'
    }
  });

  const assign2 = await prisma.assignment.create({
    data: {
      title: 'Lab 2: Optimizimi i Pyetëzimeve SQL dhe Indeksimi',
      description: 'Zbatoni indekset e duhura në SQLite/PostgreSQL dhe krahasoni kohën e ekzekutimit të pyetëzimeve me EXPLAIN QUERY PLAN.',
      deadline: pastDate, // Afat i kaluar për të provuar vonimet
      professorId: prof3.id,
      faculty: 'Fakulteti i Teknologjisë së Informacionit',
      group: 'FTI-1'
    }
  });

  const assign3 = await prisma.assignment.create({
    data: {
      title: 'Mini-Projekt: Integrimi i REST API me JWT & Middleware',
      description: 'Ndërtoni rrugët e mbrojtura me JWT, validoni rolet përkatëse dhe shkruani teste me Jest ose Postman collection.',
      deadline: in14Days,
      professorId: prof1.id,
      faculty: 'Fakulteti i Teknologjisë së Informacionit',
      group: 'FTI-1'
    }
  });

  const assign4 = await prisma.assignment.create({
    data: {
      title: 'Modelimi Prediktiv me Scikit-Learn',
      description: 'Ndërtoni një pipeline klasifikimi mbi dataset-in universitar dhe raportoni metrikat Accuracy, Precision dhe F1-Score.',
      deadline: in7Days,
      professorId: prof3.id,
      faculty: 'Fakulteti i Teknologjisë së Informacionit',
      group: 'FTI-2'
    }
  });

  const assign5 = await prisma.assignment.create({
    data: {
      title: 'Auditimi i Sigurisë së Rrjetit dhe Penetration Test',
      description: 'Analizoni trafikun me Wireshark, identifikoni portat e hapura dhe shkruani një raport me rekomandime sigurie.',
      deadline: in3Days,
      professorId: prof3.id,
      faculty: 'Fakulteti i Teknologjisë së Informacionit',
      group: 'FTI-2'
    }
  });

  const assign6 = await prisma.assignment.create({
    data: {
      title: 'Plani i Biznesit: FinTech Startup në Shqipëri',
      description: 'Zhvilloni analizën SWOT, modelin Canvas të të ardhurave dhe parashikimin financiar 3-vjeçar për një startup pagesash dixhitale.',
      deadline: in14Days,
      professorId: prof2.id,
      faculty: 'Fakulteti Ekonomik',
      group: 'BIZ-1'
    }
  });
  console.log('✅ U krijuan 6 detyra kursi.');

  // 7. Krijimi i 4 Dorëzimeve (SUBMITTED, GRADED, LATE)
  console.log('📤 Duke krijuar 4 dorëzimet...');

  // Dorëzim i vlerësuar (GRADED)
  await prisma.submission.create({
    data: {
      assignmentId: assign1.id,
      studentId: student1.id,
      fileUrl: '/uploads/demo-smartcampus-specifikim.pdf',
      content: 'I nderuar profesor, po ju dërgoj specifikimin e plotë arkitekturor të projektit SMARTCAMPUS bashkë me diagramet ER dhe sekvenciale.',
      status: 'GRADED',
      grade: 9.5,
      feedback: 'Punim i shkëlqyer! Diagramet janë të qarta dhe arkitektura modulare reflekton kërkesat e lëndës.',
      submittedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000)
    }
  });

  // Dorëzim në kohë, në pritje të vlerësimit (SUBMITTED)
  await prisma.submission.create({
    data: {
      assignmentId: assign1.id,
      studentId: student2.id,
      fileUrl: '/uploads/demo-sara-fti1-assignment.pdf',
      content: 'Bashkangjitur gjeni analizën e kërkesave për modulin e rezervimit të sallave.',
      status: 'SUBMITTED',
      submittedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000)
    }
  });

  // Dorëzim i vonuar (LATE) për detyrën 2
  await prisma.submission.create({
    data: {
      assignmentId: assign2.id,
      studentId: student1.id,
      fileUrl: '/uploads/demo-sql-optimization-report.pdf',
      content: 'Dorëzoj raportin e optimizimit të pyetëzimeve SQL me vonesë për arsye shëndetësore.',
      status: 'LATE',
      submittedAt: now
    }
  });

  // Dorëzim tjetër i vlerësuar (GRADED)
  await prisma.submission.create({
    data: {
      assignmentId: assign6.id,
      studentId: student5.id,
      fileUrl: '/uploads/demo-business-plan-fintech.pdf',
      content: 'Plani i biznesit për startup-in FinTech me analizën e tregut shqiptar.',
      status: 'GRADED',
      grade: 10.0,
      feedback: 'Analizë shumë e thelluar financiare dhe propozim vlere i qartë.',
      submittedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    }
  });
  console.log('✅ U regjistruan 4 dorëzime me statuse të ndryshme.');

  // 8. Krijimi i 5 Rezervimeve të Sallave (PENDING, APPROVED, REJECTED)
  console.log('🔖 Duke krijuar 5 rezervimet e sallave...');
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in5Days = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const in7DaysBooking = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  await prisma.booking.createMany({
    data: [
      {
        roomId: rooms[0].id, // A101
        userId: prof1.id,
        date: tomorrow,
        startTime: '14:00',
        endTime: '16:00',
        purpose: 'Seminar plotësues për studentët e diplomës mbi mikroshërbimet',
        status: 'APPROVED'
      },
      {
        roomId: rooms[3].id, // B201
        userId: prof1.id,
        date: in3Days,
        startTime: '10:00',
        endTime: '12:00',
        purpose: 'Provim i ndërmjetëm me studentët e vitit të dytë',
        status: 'APPROVED'
      },
      {
        roomId: rooms[6].id, // LAB1
        userId: student2.id,
        date: in5Days,
        startTime: '15:00',
        endTime: '17:00',
        purpose: 'Praktikë laboratorike me grupin e punës',
        status: 'APPROVED'
      },
      {
        roomId: rooms[5].id, // C301
        userId: prof2.id,
        date: in7DaysBooking,
        startTime: '12:00',
        endTime: '14:00',
        purpose: 'Leksion i hapur me të ftuar nga industria financiare',
        status: 'PENDING'
      },
      {
        roomId: rooms[1].id, // A102
        userId: student3.id,
        date: yesterday,
        startTime: '09:00',
        endTime: '11:00',
        purpose: 'Mbledhje studentore e klubit të teknologjisë',
        status: 'REJECTED'
      }
    ]
  });
  console.log('✅ U regjistruan 5 rezervime me statuse të ndryshme.');
  console.log('🎉 Mbushja e pasur e bazës së të dhënave përfundoi me sukses!');
}

main()
  .catch((e) => {
    console.error('❌ Gabim gjatë mbushjes së bazës:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

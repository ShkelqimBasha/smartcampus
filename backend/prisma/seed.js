const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Duke filluar mbushjen e pasur të bazës së të dhënave (Seed)...');

  // 1. Pastrimi i të dhënave ekzistuese në rendin e duhur
  await prisma.announcementRead.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.schedule.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('demo123', 10);

  // 2. Krijimi i 12 Përdoruesve (1 Admin, 3 Pedagogë, 8 Studentë)
  console.log('👤 Duke krijuar 12 përdoruesit...');

  const admin = await prisma.user.create({
    data: {
      email: 'admin@smartcampus.al',
      password: passwordHash,
      firstName: 'Admin',
      lastName: 'SmartCampus',
      role: 'ADMIN',
      isActive: true
    }
  });

  const prof1 = await prisma.user.create({
    data: {
      email: 'pedagog@smartcampus.al',
      password: passwordHash,
      firstName: 'Adrian',
      lastName: 'Maho',
      role: 'PROFESSOR',
      faculty: 'Fakulteti i Teknologjisë së Informacionit',
      group: 'FTI-1',
      isActive: true
    }
  });

  const prof2 = await prisma.user.create({
    data: {
      email: 'pedagog2@smartcampus.al',
      password: passwordHash,
      firstName: 'Elena',
      lastName: 'Prifti',
      role: 'PROFESSOR',
      faculty: 'Fakulteti Ekonomik',
      group: 'BIZ-1',
      isActive: true
    }
  });

  const prof3 = await prisma.user.create({
    data: {
      email: 'pedagog3@smartcampus.al',
      password: passwordHash,
      firstName: 'Arben',
      lastName: 'Hoxha',
      role: 'PROFESSOR',
      faculty: 'Fakulteti i Teknologjisë së Informacionit',
      group: 'FTI-2',
      isActive: true
    }
  });

  const student1 = await prisma.user.create({
    data: {
      email: 'student@smartcampus.al',
      password: passwordHash,
      firstName: 'Shkëlqim',
      lastName: 'Basha',
      role: 'STUDENT',
      faculty: 'Fakulteti i Teknologjisë së Informacionit',
      group: 'FTI-1',
      isActive: true
    }
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'student2@smartcampus.al',
      password: passwordHash,
      firstName: 'Sara',
      lastName: 'Hoxha',
      role: 'STUDENT',
      faculty: 'Fakulteti i Teknologjisë së Informacionit',
      group: 'FTI-1',
      isActive: true
    }
  });

  const student3 = await prisma.user.create({
    data: {
      email: 'student3@smartcampus.al',
      password: passwordHash,
      firstName: 'Erion',
      lastName: 'Malaj',
      role: 'STUDENT',
      faculty: 'Fakulteti i Teknologjisë së Informacionit',
      group: 'FTI-2',
      isActive: true
    }
  });

  const student4 = await prisma.user.create({
    data: {
      email: 'student4@smartcampus.al',
      password: passwordHash,
      firstName: 'Anisa',
      lastName: 'Dervishi',
      role: 'STUDENT',
      faculty: 'Fakulteti i Teknologjisë së Informacionit',
      group: 'FTI-2',
      isActive: true
    }
  });

  const student5 = await prisma.user.create({
    data: {
      email: 'student5@smartcampus.al',
      password: passwordHash,
      firstName: 'Klodian',
      lastName: 'Rama',
      role: 'STUDENT',
      faculty: 'Fakulteti Ekonomik',
      group: 'BIZ-1',
      isActive: true
    }
  });

  const student6 = await prisma.user.create({
    data: {
      email: 'student6@smartcampus.al',
      password: passwordHash,
      firstName: 'Keisi',
      lastName: 'Zeka',
      role: 'STUDENT',
      faculty: 'Fakulteti Ekonomik',
      group: 'BIZ-1',
      isActive: true
    }
  });

  const student7 = await prisma.user.create({
    data: {
      email: 'student7@smartcampus.al',
      password: passwordHash,
      firstName: 'Denisa',
      lastName: 'Kuqi',
      role: 'STUDENT',
      faculty: 'Fakulteti i Teknologjisë së Informacionit',
      group: 'FTI-1',
      isActive: true
    }
  });

  const student8 = await prisma.user.create({
    data: {
      email: 'student8@smartcampus.al',
      password: passwordHash,
      firstName: 'Besnik',
      lastName: 'Berisha',
      role: 'STUDENT',
      faculty: 'Fakulteti Ekonomik',
      group: 'BIZ-1',
      isActive: true
    }
  });

  console.log('✅ U krijuan 12 përdorues (fjalëkalimi për të gjithë: demo123).');

  // 3. Krijimi i 8 Sallave Universitare
  console.log('🏢 Duke krijuar 8 sallat...');
  const rooms = await Promise.all([
    prisma.room.create({
      data: {
        name: 'A101',
        capacity: 35,
        building: 'Ndërtesa A',
        equipment: 'Projektor, Tabelë e Bardhë, Wi-Fi'
      }
    }),
    prisma.room.create({
      data: {
        name: 'A102',
        capacity: 25,
        building: 'Ndërtesa A',
        equipment: 'Projektor, Sound System, Klimë'
      }
    }),
    prisma.room.create({
      data: {
        name: 'A103',
        capacity: 40,
        building: 'Ndërtesa A',
        equipment: 'Projektor, Tabelë e Zezë, Klimë'
      }
    }),
    prisma.room.create({
      data: {
        name: 'B201',
        capacity: 60,
        building: 'Ndërtesa B',
        equipment: 'Smart Board, Projektor, Mikrofon Wireless'
      }
    }),
    prisma.room.create({
      data: {
        name: 'B202',
        capacity: 50,
        building: 'Ndërtesa B',
        equipment: 'Smart Board, Projektor, Sound System'
      }
    }),
    prisma.room.create({
      data: {
        name: 'C301',
        capacity: 80,
        building: 'Amfiteatri Qendror',
        equipment: 'Projektor Dual, Sound System, 2x Mikrofon, Klimë'
      }
    }),
    prisma.room.create({
      data: {
        name: 'LAB1',
        capacity: 25,
        building: 'Ndërtesa C - Laboratorë',
        equipment: '25 PC Workstation, Projektor, Switch LAN Gigabit'
      }
    }),
    prisma.room.create({
      data: {
        name: 'LAB2',
        capacity: 30,
        building: 'Ndërtesa C - Laboratorë',
        equipment: '30 PC iMac, Smart Board, Set Pajisjesh Robotike'
      }
    })
  ]);
  console.log('✅ U shtuan 8 salla dhe amfiteatro.');

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
        subject: 'Inxhinieri Softi',
        professorId: prof3.id,
        faculty: 'Fakulteti i Teknologjisë së Informacionit',
        group: 'FTI-1',
        dayOfWeek: 2, // E Martë
        startTime: '10:00',
        endTime: '12:00',
        room: 'B201'
      },
      {
        subject: 'Laborator Programimi në Web',
        professorId: prof1.id,
        faculty: 'Fakulteti i Teknologjisë së Informacionit',
        group: 'FTI-1',
        dayOfWeek: 3, // E Mërkurë
        startTime: '12:00',
        endTime: '14:00',
        room: 'LAB1'
      },
      {
        subject: 'Bazat e të Dhënave',
        professorId: prof3.id,
        faculty: 'Fakulteti i Teknologjisë së Informacionit',
        group: 'FTI-1',
        dayOfWeek: 4, // E Enjte
        startTime: '09:00',
        endTime: '11:00',
        room: 'A102'
      },

      // FTI-2 (Informatikë Viti 3)
      {
        subject: 'Arkitekturë Kompjuterike & Sisteme',
        professorId: prof3.id,
        faculty: 'Fakulteti i Teknologjisë së Informacionit',
        group: 'FTI-2',
        dayOfWeek: 1, // E Hënë
        startTime: '11:00',
        endTime: '13:00',
        room: 'A103'
      },
      {
        subject: 'Inteligjencë Artificiale & Machine Learning',
        professorId: prof1.id,
        faculty: 'Fakulteti i Teknologjisë së Informacionit',
        group: 'FTI-2',
        dayOfWeek: 3, // E Mërkurë
        startTime: '09:00',
        endTime: '11:00',
        room: 'LAB2'
      },
      {
        subject: 'Siguri Informacioni & Rrjeta',
        professorId: prof3.id,
        faculty: 'Fakulteti i Teknologjisë së Informacionit',
        group: 'FTI-2',
        dayOfWeek: 5, // E Premte
        startTime: '10:00',
        endTime: '12:00',
        room: 'B202'
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
        room: 'C301'
      },
      {
        subject: 'Kontabilitet Financiar',
        professorId: prof2.id,
        faculty: 'Fakulteti Ekonomik',
        group: 'BIZ-1',
        dayOfWeek: 2, // E Martë
        startTime: '09:00',
        endTime: '11:00',
        room: 'B201'
      },
      {
        subject: 'Marketing Dixhital',
        professorId: prof2.id,
        faculty: 'Fakulteti Ekonomik',
        group: 'BIZ-1',
        dayOfWeek: 4, // E Enjte
        startTime: '11:00',
        endTime: '13:00',
        room: 'A101'
      }
    ]
  });
  console.log('✅ U regjistruan 10 orare javore mësimore.');

  // 6. Krijimi i 6 Detyrave Kursi
  console.log('📝 Duke krijuar 6 detyrat...');

  const in2Days = new Date();
  in2Days.setDate(in2Days.getDate() + 2);

  const in4Days = new Date();
  in4Days.setDate(in4Days.getDate() + 4);

  const in7Days = new Date();
  in7Days.setDate(in7Days.getDate() + 7);

  const in10Days = new Date();
  in10Days.setDate(in10Days.getDate() + 10);

  const in14Days = new Date();
  in14Days.setDate(in14Days.getDate() + 14);

  const inPast3Days = new Date();
  inPast3Days.setDate(inPast3Days.getDate() - 3);

  const ass1 = await prisma.assignment.create({
    data: {
      title: 'Detyrë Kursi: Zhvillimi i Platformës SMARTCAMPUS',
      description: 'Ndërtoni një aplikacion të plotë web sipas specifikimeve funksionale (FR-01 deri FR-18). Dorëzoni kodin e projektit (arkivë ZIP) dhe dokumentacionin.',
      deadline: in7Days,
      faculty: 'Fakulteti i Teknologjisë së Informacionit',
      group: 'FTI-1',
      professorId: prof1.id
    }
  });

  const ass2 = await prisma.assignment.create({
    data: {
      title: 'Projekt Kërkimor: Analiza e Kërkesave të Sistemeve Enterprise',
      description: 'Zgjidhni një organizatë reale dhe hartoni diagramat UML (Use Case, Activity, Sequence) për menaxhimin e proceseve të brendshme.',
      deadline: in2Days, // Afat i afërt (2 ditë) për të testuar paralajmërimin e kuq
      faculty: 'Fakulteti i Teknologjisë së Informacionit',
      group: 'FTI-1',
      professorId: prof3.id
    }
  });

  const ass3 = await prisma.assignment.create({
    data: {
      title: 'Laborator 3: Optimizimi i Pyetjeve SQL dhe Indeksimi',
      description: 'Zbatoni indekset B-Tree dhe matni kohën e ekzekutimit të query-ve në një dataset prej 100,000 rreshtash. Dorëzoni raportin PDF me shpjegimet.',
      deadline: in10Days,
      faculty: 'Fakulteti i Teknologjisë së Informacionit',
      group: 'FTI-1',
      professorId: prof3.id
    }
  });

  const ass4 = await prisma.assignment.create({
    data: {
      title: 'Ese mbi Transformimin Dixhital në Sektorin Financiar',
      description: 'Analizoni sfidat dhe mundësitë e teknologjisë Fintech dhe pagesave pa para fizike në tregun vendas.',
      deadline: in4Days,
      faculty: 'Fakulteti Ekonomik',
      group: 'BIZ-1',
      professorId: prof2.id
    }
  });

  const ass5 = await prisma.assignment.create({
    data: {
      title: 'Projekt Semestral: Modeli i Inteligjencës Artificiale për Klasifikim',
      description: 'Trajnoni një model me Python & Scikit-Learn mbi datasetin e paracaktuar dhe vlerësoni metrikat F1-score dhe Accuracy.',
      deadline: in14Days,
      faculty: 'Fakulteti i Teknologjisë së Informacionit',
      group: 'FTI-2',
      professorId: prof1.id
    }
  });

  const ass6 = await prisma.assignment.create({
    data: {
      title: 'Detyrë Hulumtuese: Metodologjitë Agile vs Waterfall',
      description: 'Krahasim i thelluar i metodologjive tradicionale kundrejt Scrum dhe Kanban në projekte softuerike.',
      deadline: inPast3Days, // Afat i kaluar për të testuar statusin LATE
      faculty: 'Fakulteti i Teknologjisë së Informacionit',
      group: 'FTI-1',
      professorId: prof1.id
    }
  });
  console.log('✅ U krijuan 6 detyra kursi.');

  // 7. Krijimi i 4 Dorëzimeve me statuse të ndryshme (SUBMITTED, GRADED, LATE)
  console.log('📤 Duke krijuar 4 dorëzimet...');
  await prisma.submission.createMany({
    data: [
      {
        assignmentId: ass1.id,
        studentId: student1.id,
        content: 'Përshëndetje profesor, kemi zbatuar të gjitha modulet dhe po punojmë në testimin e fundit.',
        status: 'SUBMITTED',
        submittedAt: new Date()
      },
      {
        assignmentId: ass1.id,
        studentId: student2.id,
        content: 'Dorëzimi i projektit të plotë nga grupi ynë me të gjitha kërkesat e plotësuara.',
        status: 'GRADED',
        grade: 96,
        feedback: 'Punë e shkëlqyer! Kodi është i pastër, arkitektura modulare dhe dokumentacioni i detajuar.',
        submittedAt: new Date(Date.now() - 24 * 3600 * 1000)
      },
      {
        assignmentId: ass6.id,
        studentId: student7.id,
        content: 'Dorëzimi i detyrës mbi metodologjitë Agile. Më falni për vonesën për arsye shëndetësore.',
        status: 'LATE',
        submittedAt: new Date(Date.now() - 12 * 3600 * 1000)
      },
      {
        assignmentId: ass4.id,
        studentId: student5.id,
        content: 'Ese e plotë mbi transformimin dixhital në bankat shqiptare me të dhëna nga Banka e Shqipërisë.',
        status: 'GRADED',
        grade: 88,
        feedback: 'Analizë shumë e mirë e rasteve studimore. Kujdes me bibliografinë.',
        submittedAt: new Date(Date.now() - 48 * 3600 * 1000)
      }
    ]
  });
  console.log('✅ U regjistruan 4 dorëzime me statuse të ndryshme.');

  // 8. Krijimi i 5 Rezervimeve me statuse të ndryshme (PENDING, APPROVED, REJECTED)
  console.log('🔖 Duke krijuar 5 rezervimet e sallave...');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const in3Days = new Date();
  in3Days.setDate(in3Days.getDate() + 3);

  const in5Days = new Date();
  in5Days.setDate(in5Days.getDate() + 5);

  const in7DaysBooking = new Date();
  in7DaysBooking.setDate(in7DaysBooking.getDate() + 7);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.booking.createMany({
    data: [
      {
        roomId: rooms[0].id, // A101
        userId: student1.id,
        date: tomorrow,
        startTime: '14:00',
        endTime: '16:00',
        purpose: 'Punë në grup për projektin e lëndës Hartim dhe Menaxhim Projektesh',
        status: 'PENDING'
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

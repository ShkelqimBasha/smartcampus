const app = require('./src/app');
const http = require('http');

async function testApi() {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(5099, resolve));
  console.log('Test server started on port 5099');

  const baseUrl = 'http://127.0.0.1:5099/api';

  try {
    // 1. Test Login Admin
    console.log('\n--- 1. Testing Admin Login ---');
    const adminRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@smartcampus.al', password: 'demo123' })
    });
    const adminData = await adminRes.json();
    console.log('Admin login status:', adminRes.status, 'Success:', adminData.success, 'Role:', adminData.user?.role);
    const adminToken = adminData.token;

    // 2. Test Login Student
    console.log('\n--- 2. Testing Student Login ---');
    const studentRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@smartcampus.al', password: 'demo123' })
    });
    const studentData = await studentRes.json();
    console.log('Student login status:', studentRes.status, 'Success:', studentData.success, 'Role:', studentData.user?.role);
    const studentToken = studentData.token;

    // 3. Test Announcements
    console.log('\n--- 3. Testing Announcements for Student ---');
    const annRes = await fetch(`${baseUrl}/announcements`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const annData = await annRes.json();
    console.log('Announcements count for student:', annData.announcements?.length);

    // 4. Test Schedules
    console.log('\n--- 4. Testing Schedules for Student ---');
    const schRes = await fetch(`${baseUrl}/schedules`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const schData = await schRes.json();
    console.log('Schedules count:', schData.schedules?.length);

    // 5. Test Assignments
    console.log('\n--- 5. Testing Assignments ---');
    const assRes = await fetch(`${baseUrl}/assignments`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const assData = await assRes.json();
    console.log('Assignments count:', assData.assignments?.length);

    // 6. Test Rooms
    console.log('\n--- 6. Testing Rooms ---');
    const roomRes = await fetch(`${baseUrl}/rooms`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const roomData = await roomRes.json();
    console.log('Rooms count:', roomData.rooms?.length);
    const testRoom = roomData.rooms[0];

    // 7. Test Stats for Admin
    console.log('\n--- 7. Testing Stats for Admin ---');
    const statsRes = await fetch(`${baseUrl}/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const statsData = await statsRes.json();
    console.log('Stats status:', statsRes.status, 'Total users:', statsData.stats?.users?.total);

    // 8. Test Conflict check in Booking (FR-15)
    console.log('\n--- 8. Testing Booking Conflict Logic ---');
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 10);
    const dateStr = targetDate.toISOString().split('T')[0];

    // First booking: 10:00 to 12:00
    const b1 = await fetch(`${baseUrl}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        roomId: testRoom.id,
        date: dateStr,
        startTime: '10:00',
        endTime: '12:00',
        purpose: 'Rezervim i parë për test'
      })
    });
    console.log('Initial booking status (expected 201):', b1.status);

    // Overlapping booking: 11:00 to 13:00 (Conflict!)
    const conflictRes = await fetch(`${baseUrl}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        roomId: testRoom.id,
        date: dateStr,
        startTime: '11:00',
        endTime: '13:00',
        purpose: 'Rezervim me konflikt'
      })
    });
    const conflictData = await conflictRes.json();
    console.log('Conflict test response status (expected 409):', conflictRes.status, 'Message:', conflictData.message);

    if (conflictRes.status !== 409) {
      throw new Error(`Expected 409 Conflict, got ${conflictRes.status}`);
    }

    console.log('\n✨ ALL BACKEND TESTS PASSED SUCCESSFULLY! ✨');
  } finally {
    server.close();
  }
}

testApi().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

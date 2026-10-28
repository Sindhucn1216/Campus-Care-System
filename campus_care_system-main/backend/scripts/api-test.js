/**
 * Integration tests against a running CampusCare API.
 * Usage: node scripts/api-test.js
 */
const BASE = process.env.API_BASE_URL || 'http://localhost:3000/api';
const PASSWORD = 'CampusCare123!';

let passed = 0;
let failed = 0;

async function req(method, path, { token, body, expectStatus } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (expectStatus && res.status !== expectStatus) {
    throw new Error(`${method} ${path} expected ${expectStatus} got ${res.status}: ${data?.message || ''}`);
  }
  return { status: res.status, data };
}

function assert(cond, name) {
  if (cond) {
    passed += 1;
    console.log(`  PASS  ${name}`);
  } else {
    failed += 1;
    console.log(`  FAIL  ${name}`);
  }
}

try {
  console.log(`Testing ${BASE}\n`);

  const health = await req('GET', '/health', { expectStatus: 200 });
  assert(health.data.status === 'ok', 'Health check');

  const badLogin = await req('POST', '/auth/login', {
    body: { email: 'aarav.sharma@student.campus.edu', password: 'wrong' },
    expectStatus: 401,
  });
  assert(badLogin.data.message.includes('Invalid'), 'Invalid credentials rejected');

  const aarav = await req('POST', '/auth/login', {
    body: { email: 'aarav.sharma@student.campus.edu', password: PASSWORD },
    expectStatus: 200,
  });
  const tokenA = aarav.data.token;
  assert(aarav.data.user.role === 'student', 'Student A login');

  const pooja = await req('POST', '/auth/login', {
    body: { email: 'pooja.hegde@student.campus.edu', password: PASSWORD },
    expectStatus: 200,
  });
  const tokenB = pooja.data.token;

  const unauth = await req('POST', '/complaints', {
    body: { title: 'Should fail unauthenticated complaint', description: 'This should not be stored in the system at all.', location: 'Library' },
    expectStatus: 401,
  });
  assert(unauth.status === 401, 'Unauthenticated cannot submit complaints');

  const listA = await req('GET', '/complaints', { token: tokenA, expectStatus: 200 });
  assert(Array.isArray(listA.data) && listA.data.every((c) => c.reporterId === aarav.data.user.id), 'Student A sees only own complaints');

  const listB = await req('GET', '/complaints', { token: tokenB, expectStatus: 200 });
  assert(Array.isArray(listB.data) && listB.data.every((c) => c.reporterId === pooja.data.user.id), 'Student B sees only own complaints');

  const steal = await req('GET', '/complaints/cmp-004', { token: tokenA, expectStatus: 404 });
  assert(steal.status === 404, 'Student A cannot open Student B complaint by ID');

  const created = await req('POST', '/complaints', {
    token: tokenA,
    expectStatus: 201,
    body: {
      title: 'Broken tap in Hostel Block A washroom',
      description: 'The left washbasin tap has been leaking continuously since morning lab hours.',
      categoryId: 'cat-5',
      categoryName: 'Water and Sanitation',
      location: 'Hostel Block A (Boys)',
      specificLocation: 'First floor washroom',
      priority: 'Medium',
    },
  });
  assert(created.data.reporterId === aarav.data.user.id && created.data.complaintCode, 'Student A can create a complaint owned by self');

  const impersonate = await req('POST', '/complaints', {
    token: tokenB,
    expectStatus: 201,
    body: {
      title: 'Library AC too cold during evening study',
      description: 'The central library reading hall AC is set far too low and students cannot study.',
      categoryId: 'cat-4',
      categoryName: 'Electrical',
      location: 'Central University Library',
      reporterId: aarav.data.user.id,
    },
  });
  assert(impersonate.data.reporterId === pooja.data.user.id, 'Reporter ID in body is ignored; owner is authenticated user');

  const adminLogin = await req('POST', '/auth/login', {
    body: { email: 'admin.grievance@campuscare.edu', password: PASSWORD },
    expectStatus: 200,
  });
  const tokenAdmin = adminLogin.data.token;

  const adminSubmit = await req('POST', '/complaints', {
    token: tokenAdmin,
    expectStatus: 403,
    body: {
      title: 'Admin should not file this ticket',
      description: 'Administrators are not permitted to report issues through this endpoint.',
      categoryId: 'cat-7',
      location: 'Administrative Bhavan',
    },
  });
  assert(adminSubmit.status === 403, 'Admin cannot submit complaints');

  const adminList = await req('GET', '/complaints', { token: tokenAdmin, expectStatus: 200 });
  assert(adminList.data.length >= 8, 'Admin can list all complaints');

  const staffIt = await req('POST', '/auth/login', {
    body: { email: 'venkatesh.rao@staff.campuscare.edu', password: PASSWORD },
    expectStatus: 200,
  });
  const tokenStaffIt = staffIt.data.token;
  const staffItList = await req('GET', '/complaints', { token: tokenStaffIt, expectStatus: 200 });
  assert(staffItList.data.every((c) => c.departmentId === 'dept-1'), 'IT staff only sees IT department tickets');

  const staffElec = await req('GET', '/complaints/cmp-002', { token: tokenStaffIt, expectStatus: 404 });
  assert(staffElec.status === 404, 'IT staff cannot open electrical department tickets');

  const staffCanUpdate = await req('PATCH', '/complaints/cmp-007/status', {
    token: tokenStaffIt,
    expectStatus: 200,
    body: { status: 'In Progress', note: 'Technician dispatched to seminar hall.' },
  });
  assert(staffCanUpdate.data.status === 'In Progress', 'IT staff can update own-department status');

  const staffCannotAssign = await req('PATCH', '/complaints/cmp-007/assign', {
    token: tokenStaffIt,
    expectStatus: 403,
    body: { departmentId: 'dept-4' },
  });
  assert(staffCannotAssign.status === 403, 'Staff cannot assign departments');

  const dup = await req('POST', '/auth/register', {
    expectStatus: 409,
    body: {
      name: 'Aarav Clone',
      email: 'aarav.sharma@student.campus.edu',
      password: 'AnotherPass1',
      role: 'student',
      rollNo: '9999XXX0000',
    },
  });
  assert(dup.status === 409, 'Duplicate email registration rejected');

  const adminRole = await req('POST', '/auth/register', {
    expectStatus: 403,
    body: {
      name: 'Fake Dean',
      email: 'fake.dean@campus.edu',
      password: 'AnotherPass1',
      role: 'admin',
      rollNo: 'ADMIN001',
    },
  });
  assert(adminRole.status === 403, 'Public registration cannot create admin');

  const missing = await req('GET', '/complaints/does-not-exist', { token: tokenAdmin, expectStatus: 404 });
  assert(missing.status === 404, 'Unknown complaint ID returns 404');

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
} catch (err) {
  console.error('Test runner error:', err.message);
  process.exit(1);
}

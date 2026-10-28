import bcrypt from 'bcryptjs';
import { pool, withTransaction } from '../src/config/db.js';

export const DEMO_PASSWORD = 'CampusCare123!';

const departments = [
  { id: 'dept-1', name: 'IT Support & Networks', code: 'IT', head: 'Prof. S. Rangan', contact: 'itsupport@campuscare.edu', staffCount: 6 },
  { id: 'dept-2', name: 'Infrastructure and Maintenance', code: 'INFRA', head: 'Er. Rajesh Verma', contact: 'estate@campuscare.edu', staffCount: 12 },
  { id: 'dept-3', name: 'Housekeeping & Sanitation', code: 'CLEAN', head: 'Mrs. Anita Rao', contact: 'sanitation@campuscare.edu', staffCount: 15 },
  { id: 'dept-4', name: 'Electrical Maintenance', code: 'ELEC', head: 'Er. Karthik M.', contact: 'electrical@campuscare.edu', staffCount: 8 },
  { id: 'dept-5', name: 'Water and Sanitation', code: 'WATER', head: 'Mr. B. Kulkarni', contact: 'waterworks@campuscare.edu', staffCount: 5 },
  { id: 'dept-6', name: 'Campus Transport Services', code: 'TRANS', head: 'Capt. D. Sharma', contact: 'transport@campuscare.edu', staffCount: 7 },
];

const categories = [
  { id: 'cat-1', name: 'Infrastructure', icon: 'Building2', description: 'Classrooms, benches, broken windows, doors, structural maintenance', dept: 'dept-2' },
  { id: 'cat-2', name: 'IT and Wi-Fi', icon: 'Wifi', description: 'Network connectivity, lab PCs, projectors, campus portals', dept: 'dept-1' },
  { id: 'cat-3', name: 'Cleanliness', icon: 'Sparkles', description: 'Washroom hygiene, corridor waste bins, canteen sanitation', dept: 'dept-3' },
  { id: 'cat-4', name: 'Electrical', icon: 'Zap', description: 'Power cuts, malfunctioning fans, air conditioning, loose wiring', dept: 'dept-4' },
  { id: 'cat-5', name: 'Water and Sanitation', icon: 'Droplets', description: 'Drinking water coolers, pipe leakage, tap water supply', dept: 'dept-5' },
  { id: 'cat-6', name: 'Transport', icon: 'Bus', description: 'Campus shuttle buses, parking facilities, transport passes', dept: 'dept-6' },
  { id: 'cat-7', name: 'Other', icon: 'HelpCircle', description: 'Hostel amenities, security, library, miscellaneous grievances', dept: null },
];

export async function resetDatabase() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  await withTransaction(async (conn) => {
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    await conn.query('DELETE FROM feedback');
    await conn.query('DELETE FROM complaint_updates');
    await conn.query('DELETE FROM complaints');
    await conn.query('DELETE FROM complaint_code_seq');
    await conn.query('DELETE FROM users');
    await conn.query('DELETE FROM complaint_categories');
    await conn.query('DELETE FROM departments');
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    for (const d of departments) {
      await conn.query(
        `INSERT INTO departments (id, name, code, active, head, contact, staff_count)
         VALUES (?, ?, ?, 1, ?, ?, ?)`,
        [d.id, d.name, d.code, d.head, d.contact, d.staffCount]
      );
    }

    for (const c of categories) {
      await conn.query(
        `INSERT INTO complaint_categories (id, name, description, icon, default_department_id)
         VALUES (?, ?, ?, ?, ?)`,
        [c.id, c.name, c.description, c.icon, c.dept]
      );
    }

    const users = [
      ['usr-student-1', 'Aarav Sharma', 'aarav.sharma@student.campus.edu', 'student', '2023CSB1042', 'Computer Science & Engineering', null, null, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'],
      ['usr-student-2', 'Pooja Hegde', 'pooja.hegde@student.campus.edu', 'student', '2023ECB1188', 'Electronics & Communication', null, null, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'],
      ['usr-student-3', 'Kunal Verma', 'kunal.verma@student.campus.edu', 'student', '2024ECE1099', 'Mechanical Engineering', null, null, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'],
      ['usr-faculty-1', 'Dr. Meera Iyer', 'meera.iyer@faculty.campus.edu', 'faculty', null, 'Electronics & Communication', null, 'Associate Professor, Dept. of Electronics', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'],
      ['usr-staff-1', 'Venkatesh Rao', 'venkatesh.rao@staff.campuscare.edu', 'staff', null, null, 'dept-1', 'Senior Network Administrator', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'],
      ['usr-staff-elec', 'Er. Karthik M.', 'karthik.m@staff.campuscare.edu', 'staff', null, null, 'dept-4', 'Electrical Maintenance Lead', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150'],
      ['usr-staff-clean', 'Mrs. Anita Rao', 'anita.rao@staff.campuscare.edu', 'staff', null, null, 'dept-3', 'Housekeeping Supervisor', null],
      ['usr-staff-water', 'Mr. B. Kulkarni', 'b.kulkarni@staff.campuscare.edu', 'staff', null, null, 'dept-5', 'Waterworks Supervisor', null],
      ['usr-staff-trans', 'Capt. D. Sharma', 'd.sharma@staff.campuscare.edu', 'staff', null, null, 'dept-6', 'Transport Coordinator', null],
      ['usr-admin-1', 'Dean Dr. Harish Chandra', 'admin.grievance@campuscare.edu', 'admin', null, 'Administration', null, 'Dean of Student Affairs & Campus Operations', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'],
    ];

    for (const u of users) {
      await conn.query(
        `INSERT INTO users (id, name, email, password_hash, role, roll_no, academic_department, department_id, designation, avatar)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [u[0], u[1], u[2], passwordHash, u[3], u[4], u[5], u[6], u[7], u[8]]
      );
    }

    const complaints = [
      {
        id: 'cmp-001', code: 'CMP-2026-001', title: 'High-speed Wi-Fi completely down in Turing Computer Lab 3',
        description: 'During CS301 lab sessions, students are unable to clone GitHub repositories or connect to university proxy servers. Router lights are blinking amber repeatedly.',
        categoryId: 'cat-2', location: 'Science & Technology Wing (Turing Block)', specific: 'Floor 3, Computer Lab 3B',
        priority: 'High', status: 'In Progress', reporter: 'usr-student-1', dept: 'dept-1', staff: 'usr-staff-1',
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600',
        created: '2026-10-22 08:30:00', updated: '2026-10-23 10:15:00', resolved: null, notes: null, overdue: 0,
      },
      {
        id: 'cmp-002', code: 'CMP-2026-002', title: 'Air conditioner leaking water onto lecturer podium',
        description: 'Water condensate is dripping directly on the audio-visual podium console and electrical cords, creating an active shock risk for teaching staff during morning lectures.',
        categoryId: 'cat-4', location: 'Main Academic Block (Aryabhata Hall)', specific: 'Lecture Hall 204 (Second Floor)',
        priority: 'Urgent', status: 'Resolved', reporter: 'usr-faculty-1', dept: 'dept-4', staff: 'usr-staff-elec',
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=600',
        created: '2026-10-20 04:15:00', updated: '2026-10-21 11:45:00', resolved: '2026-10-21 11:45:00',
        notes: 'Clogged AC drainage hose was cleared, re-insulated, and realigned away from AV cords. Drainage drip pan tested with 5L water without spills.', overdue: 0,
      },
      {
        id: 'cmp-003', code: 'CMP-2026-003', title: 'Overflowing waste disposal bins near Central Library East Gate',
        description: 'Food wrappers, beverage bottles, and paper trash have accumulated around the recycling receptacle outside the library entrance. Stray cats are scattering litter across the lawn.',
        categoryId: 'cat-3', location: 'Central University Library', specific: 'East Gate Lawn & Study Kiosk',
        priority: 'Medium', status: 'In Progress', reporter: 'usr-student-1', dept: 'dept-3', staff: 'usr-staff-clean',
        image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&q=80&w=600',
        created: '2026-10-23 06:00:00', updated: '2026-10-23 08:00:00', resolved: null, notes: null, overdue: 0,
      },
      {
        id: 'cmp-004', code: 'CMP-2026-004', title: 'Broken granite step and loose floor tiles creating trip hazard',
        description: 'Two large granite tiles on the central staircase between 1st and 2nd floors have cracked and come loose. A student almost tripped yesterday evening.',
        categoryId: 'cat-1', location: 'Main Academic Block (Aryabhata Hall)', specific: 'Central Staircase, between Landing 1 & 2',
        priority: 'High', status: 'Submitted', reporter: 'usr-student-2', dept: 'dept-2', staff: null,
        image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&q=80&w=600',
        created: '2026-10-23 11:20:00', updated: '2026-10-23 11:20:00', resolved: null, notes: null, overdue: 0,
      },
      {
        id: 'cmp-005', code: 'CMP-2026-005', title: 'Drinking water RO cooler continuous alarm & lukewarm temperature',
        description: 'The RO water purifier in Hostel Block A is emitting a continuous high-pitch filter alarm and the water dispensed is lukewarm with low flow pressure.',
        categoryId: 'cat-5', location: 'Hostel Block A (Boys)', specific: 'Ground Floor Dining Hall Entry',
        priority: 'Urgent', status: 'Overdue', reporter: 'usr-student-1', dept: 'dept-5', staff: 'usr-staff-water',
        image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&q=80&w=600',
        created: '2026-10-18 09:00:00', updated: '2026-10-19 14:00:00', resolved: null, notes: null, overdue: 1,
      },
      {
        id: 'cmp-006', code: 'CMP-2026-006', title: 'Campus Shuttle Bus Route 4 delayed by 45 minutes without notice',
        description: 'The scheduled 5:30 PM city shuttle from University Transport Terminal did not arrive until 6:15 PM, causing day scholars to miss connecting metro trains.',
        categoryId: 'cat-6', location: 'University Transport Terminal', specific: 'Platform 3, Metro Connector Bay',
        priority: 'Low', status: 'Resolved', reporter: 'usr-faculty-1', dept: 'dept-6', staff: 'usr-staff-trans',
        image: null, created: '2026-10-17 13:00:00', updated: '2026-10-18 16:00:00', resolved: '2026-10-18 16:00:00',
        notes: 'Bus 12 experienced tire puncture on Highway Ring Road. Standard protocol updated to immediately send SMS notification to passenger group and dispatch reserve bus.', overdue: 0,
      },
      {
        id: 'cmp-007', code: 'CMP-2026-007', title: 'Interactive Projector screen flickering violently with HDMI disconnects',
        description: 'During guest lectures in the seminar hall, the overhead projector HDMI input loses signal every 2 minutes. Color balance is distorted with magenta tint.',
        categoryId: 'cat-2', location: 'Science & Technology Wing (Turing Block)', specific: 'Mechanical Seminar Hall 102',
        priority: 'High', status: 'Submitted', reporter: 'usr-student-1', dept: 'dept-1', staff: null,
        image: null, created: '2026-10-24 02:00:00', updated: '2026-10-24 02:00:00', resolved: null, notes: null, overdue: 0,
      },
      {
        id: 'cmp-008', code: 'CMP-2026-008', title: 'Perimeter solar pole light non-functional near West Boundary Wall',
        description: 'Solar panel pole lamp #14 does not illuminate after dusk, leaving the pathway between hostel and cafeteria dimly lit.',
        categoryId: 'cat-4', location: 'Administrative Bhavan', specific: 'West Perimeter Pathway',
        priority: 'Medium', status: 'Rejected', reporter: 'usr-student-3', dept: 'dept-4', staff: 'usr-staff-elec',
        image: null, created: '2026-10-19 10:00:00', updated: '2026-10-20 08:30:00', resolved: null,
        notes: 'Duplicate ticket. West pathway solar lighting is currently undergoing master LED conversion under Project GreenCampus (Phase 2). Work is scheduled for next Monday.', overdue: 0,
      },
    ];

    for (const c of complaints) {
      await conn.query(
        `INSERT INTO complaints (
          id, complaint_code, title, description, category_id, location, specific_location, priority, status,
          reporter_id, department_id, assigned_staff_id, image_url, resolved_at, resolution_notes, is_overdue, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [c.id, c.code, c.title, c.description, c.categoryId, c.location, c.specific, c.priority, c.status, c.reporter, c.dept, c.staff, c.image, c.resolved, c.notes, c.overdue, c.created, c.updated]
      );
    }

    const updates = [
      ['upd-101', 'cmp-001', 'usr-admin-1', 'Submitted', 'In Progress', 'Assigned complaint to IT Support & Networks department. Priority confirmed as High.', '2026-10-22 09:00:00'],
      ['upd-102', 'cmp-001', 'usr-staff-1', 'In Progress', 'In Progress', 'Inspected switch rack. Core access point switch port 18 has an SFP transceiver fault. Replacement part ordered from vendor inventory.', '2026-10-23 10:15:00'],
      ['upd-201', 'cmp-002', 'usr-admin-1', 'Submitted', 'In Progress', 'Escalated to Electrical Maintenance emergency desk.', '2026-10-20 04:45:00'],
      ['upd-202', 'cmp-002', 'usr-staff-elec', 'In Progress', 'Resolved', 'Drainage pipe cleared and inspected. Normal cooling restored.', '2026-10-21 11:45:00'],
      ['upd-301', 'cmp-003', 'usr-admin-1', 'Submitted', 'In Progress', 'Dispatched morning sanitation crew for immediate waste clearance and bin washing.', '2026-10-23 08:00:00'],
      ['upd-501', 'cmp-005', 'usr-staff-water', 'Submitted', 'In Progress', 'Technician visited site. RO membrane requires complete overhaul. Vendor SLA exceeded.', '2026-10-19 14:00:00'],
      ['upd-601', 'cmp-006', 'usr-staff-trans', 'In Progress', 'Resolved', 'Driver debriefed. Standby bus protocol enacted for all peak-hour transit routes.', '2026-10-18 16:00:00'],
      ['upd-801', 'cmp-008', 'usr-staff-elec', 'Submitted', 'Rejected', 'Ticket rejected due to duplicate ongoing master renovation project.', '2026-10-20 08:30:00'],
    ];

    for (const u of updates) {
      await conn.query(
        `INSERT INTO complaint_updates (id, complaint_id, updated_by, old_status, new_status, note, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        u
      );
    }

    await conn.query(
      `INSERT INTO feedback (id, complaint_id, user_id, rating, comments, created_at)
       VALUES ('fb-001', 'cmp-002', 'usr-faculty-1', 5, 'Very prompt response by the electrical engineering team! Fixed within 24 hours before our departmental accreditation review.', '2026-10-21 14:30:00')`
    );
    await conn.query(
      `INSERT INTO feedback (id, complaint_id, user_id, rating, comments, created_at)
       VALUES ('fb-002', 'cmp-006', 'usr-faculty-1', 4, 'Appreciate the detailed explanation and backup driver protocol. Hopefully delays are mitigated in future.', '2026-10-19 09:20:00')`
    );

    await conn.query('INSERT INTO complaint_code_seq (year, last_seq) VALUES (2026, 8)');
  });
}

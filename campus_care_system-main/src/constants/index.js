// CampusCare System Constants

export const COMPLAINT_CATEGORIES = [
  { id: 'cat-1', name: 'Infrastructure', icon: 'Building2', description: 'Classrooms, benches, broken windows, doors, structural maintenance' },
  { id: 'cat-2', name: 'IT and Wi-Fi', icon: 'Wifi', description: 'Network connectivity, lab PCs, projectors, campus portals' },
  { id: 'cat-3', name: 'Cleanliness', icon: 'Sparkles', description: 'Washroom hygiene, corridor waste bins, canteen sanitation' },
  { id: 'cat-4', name: 'Electrical', icon: 'Zap', description: 'Power cuts, malfunctioning fans, air conditioning, loose wiring' },
  { id: 'cat-5', name: 'Water and Sanitation', icon: 'Droplets', description: 'Drinking water coolers, pipe leakage, tap water supply' },
  { id: 'cat-6', name: 'Transport', icon: 'Bus', description: 'Campus shuttle buses, parking facilities, transport passes' },
  { id: 'cat-7', name: 'Other', icon: 'HelpCircle', description: 'Hostel amenities, security, library, miscellaneous grievances' },
];

export const COMPLAINT_STATUSES = {
  SUBMITTED: 'Submitted',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  REJECTED: 'Rejected',
  OVERDUE: 'Overdue',
};

export const COMPLAINT_PRIORITIES = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export const CAMPUS_LOCATIONS = [
  'Main Academic Block (Aryabhata Hall)',
  'Science & Technology Wing (Turing Block)',
  'Central University Library',
  'Hostel Block A (Boys)',
  'Hostel Block B (Girls)',
  'Administrative Bhavan',
  'Campus Sports Complex & Gymnasium',
  'Student Activity Center & Canteen',
  'Mechanical Engineering Labs',
  'Auditorium & Convention Hall',
  'Campus Health Center',
  'University Transport Terminal',
];

export const USER_ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  STAFF: 'staff',
  ADMIN: 'admin',
};

export const INITIAL_DEPARTMENTS = [
  { id: 'dept-1', name: 'IT Support & Networks', code: 'IT', active: true, head: 'Prof. S. Rangan', contact: 'itsupport@campuscare.edu', assignedCount: 14, staffCount: 6 },
  { id: 'dept-2', name: 'Infrastructure and Maintenance', code: 'INFRA', active: true, head: 'Er. Rajesh Verma', contact: 'estate@campuscare.edu', assignedCount: 22, staffCount: 12 },
  { id: 'dept-3', name: 'Housekeeping & Sanitation', code: 'CLEAN', active: true, head: 'Mrs. Anita Rao', contact: 'sanitation@campuscare.edu', assignedCount: 18, staffCount: 15 },
  { id: 'dept-4', name: 'Electrical Maintenance', code: 'ELEC', active: true, head: 'Er. Karthik M.', contact: 'electrical@campuscare.edu', assignedCount: 9, staffCount: 8 },
  { id: 'dept-5', name: 'Water and Sanitation', code: 'WATER', active: true, head: 'Mr. B. Kulkarni', contact: 'waterworks@campuscare.edu', assignedCount: 7, staffCount: 5 },
  { id: 'dept-6', name: 'Campus Transport Services', code: 'TRANS', active: true, head: 'Capt. D. Sharma', contact: 'transport@campuscare.edu', assignedCount: 5, staffCount: 7 },
];

export const DEMO_USERS = [
  {
    id: 'usr-student-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@student.campus.edu',
    role: USER_ROLES.STUDENT,
    rollNo: '2023CSB1042',
    department: 'Computer Science & Engineering',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'usr-faculty-1',
    name: 'Dr. Meera Iyer',
    email: 'meera.iyer@faculty.campus.edu',
    role: USER_ROLES.FACULTY,
    designation: 'Associate Professor, Dept. of Electronics',
    department: 'Electronics & Communication',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'usr-staff-1',
    name: 'Venkatesh Rao',
    email: 'venkatesh.rao@staff.campuscare.edu',
    role: USER_ROLES.STAFF,
    departmentId: 'dept-1', // IT Support & Networks
    departmentName: 'IT Support & Networks',
    designation: 'Senior Network Administrator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'usr-admin-1',
    name: 'Dean Dr. Harish Chandra',
    email: 'admin.grievance@campuscare.edu',
    role: USER_ROLES.ADMIN,
    designation: 'Dean of Student Affairs & Campus Operations',
    department: 'Administration',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
  },
];

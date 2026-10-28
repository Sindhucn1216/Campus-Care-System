# CampusCare — Smart Campus Complaint & Grievance Management System

**CampusCare** is a centralized, transparent, and responsive university grievance management platform. It bridges campus students, faculty members, facility departments, and executive administrators to ensure rapid incident reporting, automated triage, real-time status tracking, and SLA resolution analytics.

---

## 🌟 Key Capabilities & Features

### 1. Public & Student Portal
- **High-Impact Landing Page**: Hero showcase, interactive simulated dashboard preview, 4-stage resolution explanation, category showcase, and live university statistics.
- **Instant Grievance Lodging (`/complaints/new`)**:
  - Auto-categorization (Infrastructure, IT & Wi-Fi, Cleanliness, Electrical, Water & Sanitation, Transport, Other).
  - Campus building and room/floor selector.
  - Interactive urgency / priority selection (Low, Medium, High, Urgent).
  - Live character counter for comprehensive problem descriptions.
  - Photo attachment support with drag & drop, file type/size validation (< 5MB), and 1-click sample presets.
  - Instant submission confirmation view with generated tracking ID (e.g., `CMP-2026-009`) and 1-click clipboard copy.
- **Public & Authenticated Tracking (`/track`)**:
  - Lookup by unique tracking code (`CMP-2026-XXX`).
  - 3-stage visual progress pipeline (`Submitted` ➔ `In Progress` ➔ `Resolved`).
  - Audit trail displaying technician timestamps, notes, and resolution summaries.
  - Interactive 5-star student satisfaction rating and review modal upon resolution.
- **My Complaints History (`/complaints`)**:
  - Live search, multi-attribute filtering (Status, Category, Priority), and sorting.
  - Paginated table with mobile-responsive card view.

### 2. Department Staff Queue (`/staff/dashboard`)
- Queue of grievances assigned to the department (e.g. IT Support, Electrical).
- Metric cards: Total Assigned, In Progress, Resolved, and Overdue SLA.
- Status update modal to add technical notes, escalate status, or record mandatory resolution details for ticket closure.

### 3. Executive Administrator Console (`/admin/dashboard` & `/admin/complaints`)
- **Executive Metrics**: Total Grievances, Pending Triage, Active Repairs, Resolved Tickets, SLA Breaches, and Average Resolution Time.
- **Dynamic Recharts Analytics**:
  - 7-day intake vs. resolution velocity area chart.
  - Domain distribution donut chart.
  - Department workload & SLA compliance bar chart.
- **Urgent Triage Queue**: High and Urgent tickets requiring administrative routing.
- **Master Ticket Directory**: Search, filter, reassign departments, escalate priorities, and export audit records as CSV.
- **Department Management (`/admin/departments`)**: View, add, configure heads, and toggle active status for resolution desks.

### 4. Interactive Hackathon Evaluation Bar
- Top banner with a **1-click Role Switcher** (`Student`, `Faculty`, `Staff`, `Admin`) to evaluate any persona without manual logins.
- **Reset Sample Data** button to quickly restore pristine demonstration records.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite 8
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v3.4 (with customized Navy/Blue foundation and Teal/Emerald accents)
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Area, Donut, and Bar charts)
- **State Management**: Centralized React Context (`ComplaintContext`, `AuthContext`, `ToastContext`)
- **API Service Layer**: `src/services/api/apiClient.js` (swappable from mock repository to real Express/MySQL endpoints)

---

## 📂 Project Structure

```
compliant_management/
├── public/
│   └── favicon.svg                    # University shield SVG favicon
├── src/
│   ├── assets/                        # Static assets
│   ├── components/
│   │   ├── charts/
│   │   │   ├── CategoryPieChart.jsx   # Recharts domain distribution
│   │   │   ├── ComplaintTrendsChart.jsx # Recharts weekly trends
│   │   │   └── DepartmentBarChart.jsx # Recharts department workloads
│   │   ├── common/
│   │   │   ├── DemoBanner.jsx         # Hackathon role switcher & reset button
│   │   │   ├── EmptyState.jsx         # Zero-records placeholder
│   │   │   ├── Footer.jsx             # Comprehensive university footer
│   │   │   ├── Modal.jsx              # Accessible backdrop blur dialog
│   │   │   ├── Navbar.jsx             # Responsive navigation & profile menu
│   │   │   ├── PriorityBadge.jsx      # Colored priority pill
│   │   │   ├── StatCard.jsx           # KPI card with icons & trends
│   │   │   ├── StatusBadge.jsx        # Pulsing status pill
│   │   │   └── ToastContainer.jsx     # Floating notifications
│   │   ├── complaints/
│   │   │   ├── AssignDepartmentModal.jsx # Admin department assignment
│   │   │   ├── ComplaintFilterBar.jsx    # Search, filters, and sorters
│   │   │   ├── ComplaintTable.jsx        # Desktop table & mobile card list
│   │   │   ├── FeedbackModal.jsx         # 5-star rating & review
│   │   │   ├── StatusTimeline.jsx        # Step progress & audit log
│   │   │   └── UpdateStatusModal.jsx     # Technician progress & resolution note
│   │   └── layout/
│   │       └── MainLayout.jsx         # Global shell wrapper
│   ├── constants/
│   │   └── index.js                   # Categories, statuses, demo users, desks
│   ├── context/
│   │   ├── AuthContext.jsx            # Authentication & role persona state
│   │   ├── ComplaintContext.jsx       # Global reactive complaint store
│   │   └── ToastContext.jsx           # Notification alerts context
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminComplaintsPage.jsx # Master ticket console
│   │   │   ├── AdminDashboard.jsx      # Executive analytics & triage
│   │   │   └── DepartmentManagementPage.jsx # Manage resolution desks
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx          # 1-click demo logins & credentials
│   │   │   └── RegisterPage.jsx       # Registration with role fields
│   │   ├── complaints/
│   │   │   └── ComplaintDetailPage.jsx # In-depth complaint inspection
│   │   ├── profile/
│   │   │   └── ProfilePage.jsx        # Profile details & system architecture
│   │   ├── public/
│   │   │   ├── LandingPage.jsx        # Hero, mockup, workflow, categories
│   │   │   └── TrackingPage.jsx       # Public tracking & live timeline
│   │   ├── staff/
│   │   │   └── StaffDashboard.jsx     # Department technician queue
│   │   └── student/
│   │       ├── MyComplaintsPage.jsx   # Dedicated user history
│   │       ├── StudentDashboard.jsx   # Student KPI cards & recent list
│   │       └── SubmitComplaintPage.jsx # Interactive submission form
│   ├── routes/
│   │   └── AppRoutes.jsx              # Centralized route tree
│   ├── services/
│   │   ├── api/
│   │   │   └── apiClient.js           # Centralized API service wrapper
│   │   └── mock/
│   │       ├── complaintService.js    # Repository functions & computations
│   │       └── mockData.js            # Initial realistic campus dataset
│   ├── utils/
│   │   └── formatters.js              # Dates, complaint codes, and styles
│   ├── App.jsx                        # Root React component
│   ├── index.css                      # Tailwind base & custom animations
│   └── main.jsx                       # Entrypoint
├── .env                               # Active environment config
├── .env.example                       # Example environment template
├── index.html                         # HTML template with Inter font & SEO meta
├── package.json                       # Dependencies & scripts
├── postcss.config.js                  # PostCSS configuration
├── tailwind.config.js                 # Theme configuration & custom colors
└── vite.config.js                     # Vite build configuration
```

---

## 🚀 Quickstart & Installation (Windows & VS Code)

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node v22.19.0)
- **npm**: v9.0.0 or higher (Tested on npm 10.9.3)

### Installation Steps

1. **Clone or Open Project**:
   Open the `compliant_management` folder in VS Code:
   ```powershell
   code "c:\Users\THEJAS KUMAR M\OneDrive\Desktop\compliant_management"
   ```

2. **Install Dependencies**:
   Open a PowerShell terminal in VS Code (`Ctrl + ~`) and run:
   ```powershell
   npm install
   ```

3. **Start the Local Development Server**:
   ```powershell
   npm run dev
   ```
   Open your browser to: **[http://localhost:5173](http://localhost:5173)**

4. **Build for Production**:
   ```powershell
   npm run build
   ```
   Generates optimized assets in the `/dist` directory.

---

## 🔄 Mock Data vs. Real Backend Readiness

All operations currently run against an isolated client service layer (`src/services/mock/complaintService.js`) with safe browser `localStorage` caching so page refreshes preserve state.

### Features Currently Powered by Mock Data:
- Seed campus records (`CMP-2026-001` to `CMP-2026-008`).
- Client-side Complaint ID generation (`CMP-2026-XXX`).
- Department routing & status workflow transitions.
- Student resolution satisfaction rating (1-5 stars).
- Dashboard velocity and turnaround computations.

---

## 🔌 Future Backend API Contract (Express & MySQL)

The frontend API layer (`src/services/api/apiClient.js`) is already structured to consume the following REST endpoints. To connect your Node.js/Express server, set:
```ini
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCK_DATA=false
```

### 1. Authentication Endpoints

#### `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "aarav.sharma@student.campus.edu",
    "password": "SamplePassword123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr-student-1",
      "name": "Aarav Sharma",
      "email": "aarav.sharma@student.campus.edu",
      "role": "student",
      "rollNo": "2023CSB1042",
      "department": "Computer Science & Engineering"
    }
  }
  ```

#### `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "name": "Kunal Verma",
    "email": "kunal.verma@campus.edu",
    "password": "SecurePassword123",
    "role": "student",
    "rollNo": "2024ECE1099"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "message": "User registered successfully",
    "userId": "usr-2026-092"
  }
  ```

---

### 2. Complaints Endpoints

#### `GET /api/complaints`
- **Query Parameters**: `status`, `category`, `priority`, `departmentId`, `search`, `reporterId`
- **Success Response (200 OK)**:
  ```json
  [
    {
      "id": "cmp-001",
      "complaintCode": "CMP-2026-001",
      "title": "High-speed Wi-Fi down in Turing Computer Lab 3",
      "description": "Router lights blinking amber repeatedly.",
      "categoryId": "cat-2",
      "categoryName": "IT and Wi-Fi",
      "location": "Science & Technology Wing (Turing Block)",
      "specificLocation": "Floor 3, Computer Lab 3B",
      "priority": "High",
      "status": "In Progress",
      "reporterId": "usr-student-1",
      "reporterName": "Aarav Sharma",
      "reporterRole": "Student",
      "departmentId": "dept-1",
      "departmentName": "IT Support & Networks",
      "assignedStaffId": "usr-staff-1",
      "assignedStaffName": "Venkatesh Rao",
      "imageUrl": "https://example.com/uploads/photo.jpg",
      "createdAt": "2026-10-22T08:30:00.000Z",
      "updatedAt": "2026-10-23T10:15:00.000Z",
      "resolvedAt": null,
      "resolutionNotes": null,
      "isOverdue": false
    }
  ]
  ```

#### `POST /api/complaints`
- **Request Body** (or `multipart/form-data` with photo file):
  ```json
  {
    "title": "Broken window latch in Library Study Pod 4",
    "categoryId": "cat-1",
    "categoryName": "Infrastructure",
    "location": "Central University Library",
    "specificLocation": "Pod 4, 2nd Floor",
    "description": "Wind causes the window pane to slam violently during rain.",
    "priority": "Medium",
    "imageUrl": "data:image/jpeg;base64,..."
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "id": "cmp-009",
    "complaintCode": "CMP-2026-009",
    "status": "Submitted",
    "message": "Complaint registered successfully"
  }
  ```

#### `PATCH /api/complaints/:id/status`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "status": "Resolved",
    "note": "Window latch replaced and caulked against rain.",
    "resolutionNotes": "Replaced brass latch unit. Inspected by Estate Officer."
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "id": "cmp-009",
    "status": "Resolved",
    "resolvedAt": "2026-10-24T09:40:00.000Z"
  }
  ```

#### `PATCH /api/complaints/:id/assign`
- **Headers**: `Authorization: Bearer <token>` (Admin only)
- **Request Body**:
  ```json
  {
    "departmentId": "dept-2",
    "staffId": "usr-staff-infra-1",
    "note": "Dispatched to civil maintenance team."
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "id": "cmp-009",
    "departmentId": "dept-2",
    "departmentName": "Infrastructure and Maintenance",
    "status": "In Progress"
  }
  ```

#### `POST /api/complaints/:id/feedback`
- **Request Body**:
  ```json
  {
    "rating": 5,
    "comments": "Fixed very quickly, thank you!"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "id": "fb-201",
    "complaintId": "cmp-009",
    "rating": 5,
    "message": "Feedback recorded"
  }
  ```

---

### 3. Departments Endpoints

#### `GET /api/departments`
- **Success Response (200 OK)**:
  ```json
  [
    {
      "id": "dept-1",
      "name": "IT Support & Networks",
      "code": "IT",
      "active": true,
      "head": "Prof. S. Rangan",
      "contact": "itsupport@campuscare.edu",
      "assignedCount": 14,
      "staffCount": 6
    }
  ]
  ```

#### `POST /api/departments`
- **Request Body**:
  ```json
  {
    "name": "Laboratory Equipment Support",
    "code": "LAB",
    "head": "Dr. K. Swaminathan",
    "contact": "labs@campuscare.edu",
    "staffCount": 4
  }
  ```

---

### 4. Admin Analytics Endpoint

#### `GET /api/admin/analytics`
- **Success Response (200 OK)**:
  ```json
  {
    "total": 38,
    "submitted": 6,
    "inProgress": 12,
    "resolved": 18,
    "overdue": 2,
    "resolutionRate": 85,
    "avgResolutionHours": 26.4,
    "trends": [
      { "day": "Mon", "submitted": 4, "resolved": 3 },
      { "day": "Tue", "submitted": 6, "resolved": 5 }
    ]
  }
  ```

---

## 🛡️ Security & Production Requirements Notice

1. **Role Enforcement**: Frontend UI permissions and demo switcher are for user convenience. The production Node.js backend must authenticate every API request via JWT and enforce role permissions (`req.user.role === 'admin'`).
2. **Password Security**: Never pass plain-text passwords; ensure TLS/HTTPS is active and passwords are hashed using `bcrypt` (salt rounds ≥ 10).
3. **Image Uploads**: In production, route multipart uploads to an S3/Cloud Storage bucket or local static volume, storing only sanitized CDN URLs in the database.
4. **Data Isolation**: Public tracking endpoints (`/track`) should only expose public milestone updates without leaking private contact numbers or other students' grievance archives.

---

## 🏆 Hackathon Presentation Checklist

- [x] **Visual Excellence**: Modern Navy/Blue university branding, crisp typography, clean micro-interactions, and glowing stats.
- [x] **Zero Dead Buttons**: Every button, link, filter, modal, and drawer executes a meaningful operation.
- [x] **Complaint Lifecycle**: Tested intake (`CMP-2026-XXX`), timeline updates, triage assignment, resolution notes, and star ratings.
- [x] **Interactive Demo Bar**: Instant switching between Student, Faculty, Staff, and Admin personas.
- [x] **Production Build Verified**: Passes `vite build` with zero errors.

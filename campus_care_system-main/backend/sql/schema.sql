CREATE DATABASE IF NOT EXISTS campuscare
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE campuscare;

CREATE TABLE IF NOT EXISTS departments (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(20) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  head VARCHAR(150) DEFAULT NULL,
  contact VARCHAR(150) DEFAULT NULL,
  staff_count INT NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_departments_name (name),
  UNIQUE KEY uq_departments_code (code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS complaint_categories (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500) DEFAULT NULL,
  icon VARCHAR(50) DEFAULT NULL,
  default_department_id VARCHAR(64) DEFAULT NULL,
  UNIQUE KEY uq_categories_name (name),
  CONSTRAINT fk_cat_dept FOREIGN KEY (default_department_id)
    REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(191) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student','faculty','staff','admin') NOT NULL,
  roll_no VARCHAR(50) DEFAULT NULL,
  academic_department VARCHAR(150) DEFAULT NULL,
  department_id VARCHAR(64) DEFAULT NULL,
  designation VARCHAR(150) DEFAULT NULL,
  avatar VARCHAR(500) DEFAULT NULL,
  notify_email TINYINT(1) NOT NULL DEFAULT 1,
  notify_sms TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_roll (roll_no),
  KEY idx_users_role (role),
  KEY idx_users_dept (department_id),
  CONSTRAINT fk_users_dept FOREIGN KEY (department_id)
    REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS complaint_code_seq (
  year INT NOT NULL PRIMARY KEY,
  last_seq INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS complaints (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  complaint_code VARCHAR(32) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category_id VARCHAR(64) NOT NULL,
  location VARCHAR(255) NOT NULL,
  specific_location VARCHAR(255) DEFAULT NULL,
  priority ENUM('Low','Medium','High','Urgent') NOT NULL DEFAULT 'Medium',
  status ENUM('Submitted','In Progress','Resolved','Rejected','Overdue') NOT NULL DEFAULT 'Submitted',
  reporter_id VARCHAR(64) NOT NULL,
  department_id VARCHAR(64) DEFAULT NULL,
  assigned_staff_id VARCHAR(64) DEFAULT NULL,
  image_url VARCHAR(2048) DEFAULT NULL,
  image_filename VARCHAR(255) DEFAULT NULL,
  resolved_at DATETIME DEFAULT NULL,
  resolution_notes TEXT DEFAULT NULL,
  is_overdue TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_complaint_code (complaint_code),
  KEY idx_complaints_reporter (reporter_id),
  KEY idx_complaints_dept (department_id),
  KEY idx_complaints_staff (assigned_staff_id),
  KEY idx_complaints_status (status),
  KEY idx_complaints_created (created_at),
  CONSTRAINT fk_cmp_cat FOREIGN KEY (category_id) REFERENCES complaint_categories(id),
  CONSTRAINT fk_cmp_reporter FOREIGN KEY (reporter_id) REFERENCES users(id),
  CONSTRAINT fk_cmp_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  CONSTRAINT fk_cmp_staff FOREIGN KEY (assigned_staff_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS complaint_updates (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  complaint_id VARCHAR(64) NOT NULL,
  updated_by VARCHAR(64) DEFAULT NULL,
  old_status VARCHAR(32) DEFAULT NULL,
  new_status VARCHAR(32) DEFAULT NULL,
  note TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_updates_complaint (complaint_id, created_at),
  CONSTRAINT fk_upd_cmp FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
  CONSTRAINT fk_upd_user FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS feedback (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  complaint_id VARCHAR(64) NOT NULL,
  user_id VARCHAR(64) NOT NULL,
  rating TINYINT NOT NULL,
  comments TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_feedback_complaint (complaint_id),
  CONSTRAINT fk_fb_cmp FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
  CONSTRAINT fk_fb_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_feedback_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB;

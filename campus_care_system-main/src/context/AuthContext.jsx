import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEMO_USERS, USER_ROLES } from '../constants';
import { api, getStoredToken, setStoredToken } from '../services/api/apiClient';

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'campuscare_current_user_v1';
const REGISTERED_USERS_STORAGE_KEY = 'campuscare_registered_users_v1';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const DEMO_LOGINS = {
  [USER_ROLES.STUDENT]: 'aarav.sharma@student.campus.edu',
  [USER_ROLES.FACULTY]: 'meera.iyer@faculty.campus.edu',
  [USER_ROLES.STAFF]: 'venkatesh.rao@staff.campuscare.edu',
  [USER_ROLES.ADMIN]: 'admin.grievance@campuscare.edu',
};

export const DEMO_PASSWORD = 'CampusCare123!';

function persistUser(user) {
  if (user) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(AUTH_STORAGE_KEY);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bootstrapped, setBootstrapped] = useState(false);

  const applySession = useCallback((user, token) => {
    if (token) setStoredToken(token);
    setCurrentUser(user);
    persistUser(user);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function restore() {
      if (USE_MOCK_DATA) {
        const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!cancelled) {
          setCurrentUser(savedUser ? JSON.parse(savedUser) : null);
          setIsLoading(false);
          setBootstrapped(true);
        }
        return;
      }

      const token = getStoredToken();
      if (!token) {
        persistUser(null);
        if (!cancelled) {
          setCurrentUser(null);
          setIsLoading(false);
          setBootstrapped(true);
        }
        return;
      }
      try {
        const data = await api.auth.me();
        if (!cancelled) applySession(data.user, token);
      } catch {
        setStoredToken(null);
        persistUser(null);
        if (!cancelled) setCurrentUser(null);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setBootstrapped(true);
        }
      }
    }
    restore();
    return () => {
      cancelled = true;
    };
  }, [applySession]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      if (USE_MOCK_DATA) {
        const normalizedEmail = email.trim().toLowerCase();
        const registeredUsers = JSON.parse(
          localStorage.getItem(REGISTERED_USERS_STORAGE_KEY) || '[]'
        );
        const registeredAccount = registeredUsers.find(
          (account) => account.email.toLowerCase() === normalizedEmail && account.password === password
        );
        const user = registeredAccount
          ? registeredAccount.user
          : DEMO_USERS.find((demoUser) => demoUser.email.toLowerCase() === normalizedEmail);

        if (!user || (!registeredAccount && !password)) {
          throw new Error('Account not found. Use a demo profile or register an account.');
        }

        applySession(user, null);
        return user;
      }

      const data = await api.auth.login(email, password);
      applySession(data.user, data.token);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (form) => {
    setIsLoading(true);
    try {
      if (USE_MOCK_DATA) {
        const registeredUsers = JSON.parse(
          localStorage.getItem(REGISTERED_USERS_STORAGE_KEY) || '[]'
        );
        const email = form.email.trim().toLowerCase();
        if (
          DEMO_USERS.some((user) => user.email.toLowerCase() === email) ||
          registeredUsers.some((account) => account.email.toLowerCase() === email)
        ) {
          throw new Error('An account with this email address already exists.');
        }

        const user = {
          id: `usr-${Date.now()}`,
          name: form.name.trim(),
          email,
          role: form.role,
          rollNo: form.rollNo,
          department: form.department,
          designation: form.designation,
        };
        localStorage.setItem(
          REGISTERED_USERS_STORAGE_KEY,
          JSON.stringify([...registeredUsers, { email, password: form.password, user }])
        );
        applySession(user, null);
        return user;
      }

      const data = await api.auth.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        rollNo: form.rollNo,
        department: form.department,
        departmentId: form.departmentId,
        designation: form.designation,
      });
      applySession(data.user, data.token);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = async (role) => {
    if (USE_MOCK_DATA) {
      const user = DEMO_USERS.find((demoUser) => demoUser.role === role) || DEMO_USERS[0];
      applySession(user, null);
      return user;
    }

    const email = DEMO_LOGINS[role] || DEMO_LOGINS[USER_ROLES.STUDENT];
    return login(email, DEMO_PASSWORD);
  };

  const switchRole = async (role) => loginAsDemo(role);

  const logout = async () => {
    try {
      if (!USE_MOCK_DATA && getStoredToken()) await api.auth.logout();
    } catch {
      // Token discard is still required locally.
    }
    setStoredToken(null);
    persistUser(null);
    setCurrentUser(null);
  };

  const updateProfile = async (updatedFields) => {
    if (USE_MOCK_DATA) {
      const user = { ...currentUser, ...updatedFields };
      applySession(user, null);
      return user;
    }

    const data = await api.auth.updateMe(updatedFields);
    applySession(data.user, getStoredToken());
    return data.user;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || 'guest',
        isAuthenticated: !!currentUser,
        bootstrapped,
        switchRole,
        loginAsDemo,
        login,
        register,
        logout,
        updateProfile,
        isLoading,
        demoUsers: DEMO_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

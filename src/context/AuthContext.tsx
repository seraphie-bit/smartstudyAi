import React, { createContext, useContext, useEffect, useState } from 'react';
import { StudentProfile } from '../types';

interface AuthContextType {
  user: StudentProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  register: (data: {
    name: string;
    email: string;
    password: string;
    gradeLevel: string;
    targetExam: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  addXP: (amount: number) => void;
  recordStudySession: (minutes: number) => void;
}

const DEFAULT_USER: StudentProfile = {
  id: 'student_default_1',
  name: 'Alex Rivera',
  email: 'alex.rivera@smartstudy.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  gradeLevel: 'Grade 11 · High School',
  targetExam: 'AP & SAT Exams 2026',
  studyGoalHoursWeekly: 14,
  joinedDate: '2026-09-10',
  streakDays: 6,
  lastStudyDate: new Date().toISOString().split('T')[0],
  xpPoints: 1420,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem('smart_study_current_user');
      if (saved) return JSON.parse(saved);
      // Initialize with default demo student
      localStorage.setItem('smart_study_current_user', JSON.stringify(DEFAULT_USER));
      
      const storedUsers = localStorage.getItem('smart_study_registered_users');
      if (!storedUsers) {
        localStorage.setItem(
          'smart_study_registered_users',
          JSON.stringify([
            { ...DEFAULT_USER, password: 'password123' },
          ])
        );
      }
      return DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('smart_study_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smart_study_current_user');
    }
  }, [user]);

  const login = (email: string, pass: string) => {
    try {
      const raw = localStorage.getItem('smart_study_registered_users');
      const users = raw ? JSON.parse(raw) : [];
      const match = users.find(
        (u: any) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!match) {
        return { success: false, error: 'No account found with this email. Please register.' };
      }
      if (match.password && match.password !== pass) {
        return { success: false, error: 'Incorrect password. Try again.' };
      }

      const { password, ...cleanProfile } = match;
      setUser(cleanProfile);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Login failed' };
    }
  };

  const register = (data: {
    name: string;
    email: string;
    password: string;
    gradeLevel: string;
    targetExam: string;
  }) => {
    try {
      const raw = localStorage.getItem('smart_study_registered_users');
      const users = raw ? JSON.parse(raw) : [];
      if (users.some((u: any) => u.email.toLowerCase() === data.email.trim().toLowerCase())) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      const avatars = [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      ];
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

      const newStudent: StudentProfile = {
        id: 'student_' + Date.now(),
        name: data.name.trim(),
        email: data.email.trim(),
        avatar: randomAvatar,
        gradeLevel: data.gradeLevel || 'High School Student',
        targetExam: data.targetExam || 'General Studies',
        studyGoalHoursWeekly: 10,
        joinedDate: new Date().toISOString().split('T')[0],
        streakDays: 1,
        lastStudyDate: new Date().toISOString().split('T')[0],
        xpPoints: 100,
      };

      users.push({ ...newStudent, password: data.password });
      localStorage.setItem('smart_study_registered_users', JSON.stringify(users));
      setUser(newStudent);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updated };
      // Also update in registered list
      try {
        const raw = localStorage.getItem('smart_study_registered_users');
        if (raw) {
          const users = JSON.parse(raw);
          const index = users.findIndex((u: any) => u.id === prev.id);
          if (index !== -1) {
            users[index] = { ...users[index], ...updated };
            localStorage.setItem('smart_study_registered_users', JSON.stringify(users));
          }
        }
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const addXP = (amount: number) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, xpPoints: prev.xpPoints + amount };
    });
  };

  const recordStudySession = (minutes: number) => {
    setUser((prev) => {
      if (!prev) return null;
      const today = new Date().toISOString().split('T')[0];
      let newStreak = prev.streakDays;
      if (prev.lastStudyDate !== today) {
        newStreak = prev.streakDays + 1;
      }
      const earnedXP = Math.round(minutes * 2);
      return {
        ...prev,
        streakDays: newStreak,
        lastStudyDate: today,
        xpPoints: prev.xpPoints + earnedXP,
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        addXP,
        recordStudySession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

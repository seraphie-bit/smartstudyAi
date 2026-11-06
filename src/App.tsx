import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header, NavTab } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { FocusTimerModal } from './components/FocusTimerModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer, ToastMessage } from './components/Toast';

import { DashboardView } from './views/DashboardView';
import { ChatbotView } from './views/ChatbotView';
import { MathSolverView } from './views/MathSolverView';
import { NotesView } from './views/NotesView';
import { QuizView } from './views/QuizView';
import { StudyMaterialsView } from './views/StudyMaterialsView';

import { getNotes, createNote, saveNotes } from './services/notesService';
import { Note, SubjectType } from './types';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [notes, setNotes] = useState<Note[]>(() => getNotes());

  // Modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Dynamic meta for tab transitions
  const [targetMathQuery, setTargetMathQuery] = useState('x^2 - 5x + 6 = 0');
  const [targetNoteId, setTargetNoteId] = useState<string | undefined>(undefined);
  const [targetSubject, setTargetSubject] = useState<SubjectType>('mathematics');

  // Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleNavigateWithMeta = (tab: NavTab, meta?: any) => {
    if (meta?.mathQuery) {
      setTargetMathQuery(meta.mathQuery);
    }
    if (meta?.noteId) {
      setTargetNoteId(meta.noteId);
    }
    if (meta?.subject) {
      setTargetSubject(meta.subject);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveToNotes = (title: string, content: string, subject: SubjectType) => {
    const fresh = createNote({
      title,
      content,
      subject,
      tags: ['study-notes', subject],
    });
    setNotes((prev) => [fresh, ...prev]);
    setTargetNoteId(fresh.id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-400 pb-20 md:pb-6">
      {/* 3-Zone Top Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => handleNavigateWithMeta(tab)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTimer={() => setIsTimerOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            onSelectTab={handleNavigateWithMeta}
            onOpenTimer={() => setIsTimerOpen(true)}
            recentNotes={notes}
          />
        )}

        {activeTab === 'chat' && (
          <ChatbotView
            onSaveToNotes={handleSaveToNotes}
            onNotify={addNotification}
          />
        )}

        {activeTab === 'math' && (
          <MathSolverView
            initialQuery={targetMathQuery}
            onSaveToNotes={(t, c, s) => handleSaveToNotes(t, c, s)}
            onNotify={addNotification}
          />
        )}

        {activeTab === 'notes' && (
          <NotesView
            notes={notes}
            onNotesChange={(newNotes) => setNotes(newNotes)}
            selectedNoteId={targetNoteId}
            onNotify={addNotification}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView onNotify={addNotification} />
        )}

        {activeTab === 'materials' && (
          <StudyMaterialsView
            initialSubject={targetSubject}
            onSelectTab={handleNavigateWithMeta}
            onSaveToNotes={handleSaveToNotes}
            onNotify={addNotification}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} onSelectTab={(tab) => handleNavigateWithMeta(tab)} />

      {/* Global Interactive Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigateWithMeta}
      />

      {/* Pomodoro Focus Timer Modal */}
      <FocusTimerModal
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        onNotify={addNotification}
      />

      {/* Student Registration / Login Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onNotify={addNotification}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Subtle Academic Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800/80 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Smart Study AI
            </span>
            <span aria-hidden="true">·</span>
            <span>All-in-one student learning environment</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavigateWithMeta('math')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Math Solver
            </button>
            <button
              onClick={() => handleNavigateWithMeta('chat')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              AI Tutor
            </button>
            <button
              onClick={() => handleNavigateWithMeta('quiz')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Quiz Generator
            </button>
            <button
              onClick={() => handleNavigateWithMeta('materials')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Study Materials
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

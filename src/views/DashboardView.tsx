import React from 'react';
import {
  Flame,
  Clock,
  Award,
  Sparkles,
  Calculator,
  MessageSquareText,
  HelpCircle,
  FilePlus,
  BookOpen,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NavTab } from '../components/Header';
import { CURRICULA } from '../services/studyMaterialsData';
import { Note } from '../types';

interface DashboardViewProps {
  onSelectTab: (tab: NavTab, meta?: any) => void;
  onOpenTimer: () => void;
  recentNotes: Note[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectTab,
  onOpenTimer,
  recentNotes,
}) => {
  const { user } = useAuth();
  const userName = user?.name ? user.name.split(' ')[0] : 'Student';

  const heroImagePath = '/src/assets/images/hero_study_banner_1793959262490.jpg';

  const kpis = [
    {
      title: 'Current Streak',
      value: `${user?.streakDays || 1} Days`,
      detail: 'Keep studying daily to maintain bonus',
      icon: Flame,
      color: 'text-amber-500',
    },
    {
      title: 'Weekly Study Time',
      value: '18.5 hrs',
      detail: `Goal: ${user?.studyGoalHoursWeekly || 14} hrs · Target reached`,
      icon: Clock,
      color: 'text-indigo-500',
    },
    {
      title: 'Quizzes Mastered',
      value: '14 Quizzes',
      detail: '88.4% average accuracy',
      icon: Award,
      color: 'text-emerald-500',
    },
    {
      title: 'Knowledge XP',
      value: `${user?.xpPoints || 1420} XP`,
      detail: 'Rank: Honor Scholar · Level 4',
      icon: Sparkles,
      color: 'text-violet-500',
    },
  ];

  const subjectsList = Object.values(CURRICULA).slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 text-white min-h-[260px] sm:min-h-[290px] flex flex-col justify-end p-6 sm:p-10 shadow-lg">
        {/* Background Image with Measured Contrast Scrim */}
        <img
          src={heroImagePath}
          alt="Modern Study Desk"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-90 mix-blend-luminosity"
          onError={(e) => {
            // Elegant CSS gradient fallback
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/30" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-indigo-400 uppercase">
            <span>{user?.gradeLevel || 'High School'}</span>
            <span aria-hidden="true">·</span>
            <span>{user?.targetExam || 'AP & SAT Prep'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white text-balance leading-tight">
            Welcome back, {userName}! Let's conquer today's study goals.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
            You are on a <strong className="text-amber-400">{user?.streakDays || 6}-day study streak</strong>. Ask the AI tutor complex questions, solve step-by-step calculus, generate exam quizzes, and capture organized notes.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectTab('chat')}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2"
            >
              <MessageSquareText className="w-4 h-4" />
              <span>Ask AI Tutor</span>
            </button>
            <button
              onClick={() => onSelectTab('math')}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Solve Math Problem</span>
            </button>
            <button
              onClick={onOpenTimer}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Pomodoro Focus</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4-Column KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {kpi.title}
                </span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                {kpi.value}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                {kpi.detail}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Launchpad & Study Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Study Features */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Study Workstations
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct access to your core learning tools
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* AI Tutor Card */}
            <div
              onClick={() => onSelectTab('chat')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <MessageSquareText className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  AI Question Tutor
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Ask deep conceptual questions across STEM and humanities with Socratic or exam coaching styles.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Start conversation</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Math Solver Card */}
            <div
              onClick={() => onSelectTab('math')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 dark:hover:border-sky-500/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Math Problem Solver
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Step-by-step breakdown for quadratic formulas, linear systems, derivatives, geometry, and graphing.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
                <span>Solve an equation</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Notes Manager Card */}
            <div
              onClick={() => onSelectTab('notes')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FilePlus className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Smart Notes & Cheat Sheets
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Organize markdown notes by subject and tag, with formula rendering and instant export.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Browse notes</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Quiz Generator Card */}
            <div
              onClick={() => onSelectTab('quiz')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 dark:hover:border-rose-500/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Exam Quiz Generator
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Test your mastery with timed multiple-choice exam drills and comprehensive answer explanations.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
                <span>Generate quiz</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Subject Overview Row */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Curriculum Progress
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Topic mastery across your active subjects
                </p>
              </div>
              <button
                onClick={() => onSelectTab('materials')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View all 8 subjects</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subjectsList.map((subj) => (
                <div
                  key={subj.id}
                  onClick={() => onSelectTab('materials', { subject: subj.id })}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {subj.name}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {subj.topics.length} chapters
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${60 + Math.random() * 30}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Recent Notes & Knowledge Bite */}
        <div className="space-y-6">
          {/* Recent Notes Panel */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Notes
              </h3>
              <button
                onClick={() => onSelectTab('notes')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all
              </button>
            </div>

            {recentNotes.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No notes created yet.</p>
            ) : (
              <div className="space-y-3">
                {recentNotes.slice(0, 3).map((note) => (
                  <div
                    key={note.id}
                    onClick={() => onSelectTab('notes', { noteId: note.id })}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                  >
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {note.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 capitalize">
                      <span>{note.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span>{note.tags.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Daily Formula & Study Principle */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-slate-900 dark:to-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Formula of the Day</span>
            </div>

            <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 border border-indigo-100/80 dark:border-indigo-800/40 my-3 text-center shadow-xs">
              <span className="font-mono text-base font-semibold text-indigo-950 dark:text-indigo-200">
                Δ = b² - 4ac
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Quadratic Discriminant: Determines number & nature of roots
              </p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If Δ &gt; 0, two distinct real roots exist. If Δ = 0, exactly one repeated root. If Δ &lt; 0, complex conjugate roots.
            </p>

            <button
              onClick={() => onSelectTab('math', { mathQuery: 'x^2 - 5x + 6 = 0' })}
              className="mt-4 w-full py-2 px-3 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Solve in Math Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

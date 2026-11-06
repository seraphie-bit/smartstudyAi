import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, FileText, Calculator, BookOpen, HelpCircle, ArrowRight } from 'lucide-react';
import { NavTab } from './Header';
import { getNotes } from '../services/notesService';
import { CURRICULA } from '../services/studyMaterialsData';
import { SAMPLE_MATH_PROBLEMS } from '../services/mathSolverEngine';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab, meta?: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const notes = useMemo(() => getNotes(), [isOpen]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: {
      type: 'note' | 'topic' | 'math' | 'quiz';
      title: string;
      subtitle: string;
      tab: NavTab;
      meta?: any;
    }[] = [];

    // Search Notes
    notes.forEach((n) => {
      if (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        results.push({
          type: 'note',
          title: n.title,
          subtitle: `Note in ${n.subject} · ${n.tags.join(', ')}`,
          tab: 'notes',
          meta: { noteId: n.id },
        });
      }
    });

    // Search Curricula & Topics
    Object.values(CURRICULA).forEach((curriculum) => {
      curriculum.topics.forEach((t) => {
        if (
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.keyConcepts.some((k) => k.toLowerCase().includes(q))
        ) {
          results.push({
            type: 'topic',
            title: t.title,
            subtitle: `${curriculum.name} Study Guide · ${t.keyConcepts.length} key concepts`,
            tab: 'materials',
            meta: { subject: curriculum.id, topicId: t.id },
          });
        }
      });
    });

    // Search Math Samples
    SAMPLE_MATH_PROBLEMS.forEach((s) => {
      if (s.label.toLowerCase().includes(q) || s.query.toLowerCase().includes(q)) {
        results.push({
          type: 'math',
          title: s.label,
          subtitle: `Math Solver: ${s.query}`,
          tab: 'math',
          meta: { mathQuery: s.query },
        });
      }
    });

    return results.slice(0, 8);
  }, [query, notes]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 p-4 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search notes, formulas, topics, or math problems..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
              <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">
                Quick Search across Smart Study AI
              </p>
              <p>Type keywords like "calculus", "newton", "photosynthesis", or "quadratic".</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No matching notes or study topics found for "{query}".
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onNavigate(item.tab, item.meta);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:group-hover:bg-indigo-950/50 dark:group-hover:text-indigo-400 transition-colors">
                      {item.type === 'note' && <FileText className="w-4 h-4" />}
                      {item.type === 'topic' && <BookOpen className="w-4 h-4" />}
                      {item.type === 'math' && <Calculator className="w-4 h-4" />}
                      {item.type === 'quiz' && <HelpCircle className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Press ESC to close</span>
          <span>Smart Study AI Search Engine</span>
        </div>
      </div>
    </div>
  );
};

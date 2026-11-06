import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Trash2,
  Download,
  Eye,
  Edit3,
  Tag,
  Check,
  FolderOpen,
} from 'lucide-react';
import { Note, SubjectType } from '../types';
import { createNote, updateNote, deleteNote } from '../services/notesService';
import { CURRICULA } from '../services/studyMaterialsData';
import { useAuth } from '../context/AuthContext';

interface NotesViewProps {
  notes: Note[];
  onNotesChange: (notes: Note[]) => void;
  selectedNoteId?: string;
  onNotify: (msg: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onNotesChange,
  selectedNoteId,
  onNotify,
}) => {
  const { addXP } = useAuth();
  const [activeNoteId, setActiveNoteId] = useState<string>(
    selectedNoteId || (notes[0]?.id ?? '')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | 'all'>('all');
  const [isPreview, setIsPreview] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  // Keep activeNote synced
  const activeNote = useMemo(() => {
    return notes.find((n) => n.id === activeNoteId) || notes[0] || null;
  }, [notes, activeNoteId]);

  // Filtered notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchSubject = selectedSubject === 'all' || n.subject === selectedSubject;
      const matchQuery =
        !searchQuery ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSubject && matchQuery;
    });
  }, [notes, selectedSubject, searchQuery]);

  const handleCreateNew = () => {
    const fresh = createNote({
      title: 'Untitled Study Note',
      content: '## Key Concepts & Review Notes\n\n- Add bulleted points here\n- Formulas: $E = mc^2$',
      subject: selectedSubject === 'all' ? 'mathematics' : selectedSubject,
      tags: ['study-notes'],
    });
    const updated = [fresh, ...notes];
    onNotesChange(updated);
    setActiveNoteId(fresh.id);
    addXP(10);
    onNotify('New note created! +10 XP');
  };

  const handleUpdate = (updates: Partial<Note>) => {
    if (!activeNote) return;
    const updated = updateNote(activeNote.id, updates);
    onNotesChange(updated);
  };

  const handleDelete = (id: string) => {
    const updated = deleteNote(id);
    onNotesChange(updated);
    if (activeNoteId === id) {
      setActiveNoteId(updated[0]?.id ?? '');
    }
    onNotify('Note deleted.');
  };

  const handleTogglePin = (id: string, currentPin: boolean) => {
    const updated = updateNote(id, { isPinned: !currentPin });
    onNotesChange(updated);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim() && activeNote) {
      e.preventDefault();
      const clean = newTagInput.trim().toLowerCase();
      if (!activeNote.tags.includes(clean)) {
        handleUpdate({ tags: [...activeNote.tags, clean] });
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!activeNote) return;
    handleUpdate({ tags: activeNote.tags.filter((t) => t !== tagToRemove) });
  };

  const handleExport = () => {
    if (!activeNote) return;
    const element = document.createElement('a');
    const file = new Blob([activeNote.content], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${activeNote.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onNotify('Note exported as Markdown!');
  };

  const wordCount = activeNote ? activeNote.content.split(/\s+/).filter(Boolean).length : 0;
  const charCount = activeNote ? activeNote.content.length : 0;

  return (
    <div className="h-[calc(100vh-8.5rem)] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row animate-in fade-in">
      {/* Left Sidebar: Notes Navigator */}
      <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/70 dark:bg-slate-950/40">
        {/* Top Action Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Smart Notes</h2>
            <span className="text-[10px] font-mono text-slate-400">({notes.length})</span>
          </div>

          <button
            onClick={handleCreateNew}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Note</span>
          </button>
        </div>

        {/* Search & Subject Filter Bar */}
        <div className="p-3 space-y-2 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as any)}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none capitalize"
          >
            <option value="all">All Subjects</option>
            {Object.keys(CURRICULA).map((k) => (
              <option key={k} value={k}>
                {CURRICULA[k as SubjectType]?.name || k}
              </option>
            ))}
          </select>
        </div>

        {/* Notes Scrollable List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredNotes.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No notes match your filters.
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = activeNote?.id === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border text-left group ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-800/80 shadow-xs ring-1 ring-indigo-500/10'
                      : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5 mb-1">
                    <h3
                      className={`text-xs font-semibold truncate ${
                        isSelected
                          ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'text-slate-900 dark:text-slate-200'
                      }`}
                    >
                      {note.title}
                    </h3>
                    {note.isPinned && (
                      <Pin className="w-3 h-3 text-amber-500 shrink-0 fill-amber-500" />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {note.content.replace(/[#*`\-_]/g, '')}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 capitalize">
                    <span>{note.subject}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {new Date(note.updatedAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Note Editor & Markdown Viewer */}
      {activeNote ? (
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
          {/* Note Top Bar */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <select
                value={activeNote.subject}
                onChange={(e) => handleUpdate({ subject: e.target.value as SubjectType })}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 capitalize focus:outline-none"
              >
                {Object.keys(CURRICULA).map((k) => (
                  <option key={k} value={k}>
                    {CURRICULA[k as SubjectType]?.name || k}
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleTogglePin(activeNote.id, activeNote.isPinned)}
                className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
                  activeNote.isPinned
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Pin Note to Top"
              >
                <Pin className={`w-3.5 h-3.5 ${activeNote.isPinned ? 'fill-amber-500' : ''}`} />
                <span className="text-[11px] hidden sm:inline">
                  {activeNote.isPinned ? 'Pinned' : 'Pin'}
                </span>
              </button>
            </div>

            {/* Action Tools */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
              >
                {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isPreview ? 'Edit' : 'Preview'}</span>
              </button>

              <button
                onClick={handleExport}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Export as Markdown"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleDelete(activeNote.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete Note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Note Title Input */}
          <div className="px-6 pt-4 pb-2">
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => handleUpdate({ title: e.target.value })}
              placeholder="Note Title"
              className="w-full text-lg sm:text-xl font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none placeholder:text-slate-400"
            />

            {/* Tags Strip */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <Tag className="w-3 h-3 text-slate-400 mr-1" />
              {activeNote.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="+ tag and press Enter"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="text-[11px] bg-transparent text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none px-1"
              />
            </div>
          </div>

          {/* Main Body: Markdown Editor or Preview */}
          <div className="flex-1 p-6 overflow-y-auto">
            {isPreview ? (
              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans text-slate-800 dark:text-slate-200">
                {activeNote.content}
              </div>
            ) : (
              <textarea
                value={activeNote.content}
                onChange={(e) => handleUpdate({ content: e.target.value })}
                placeholder="Write your study notes, formulas, or summaries here... Supports Markdown headers, lists, and LaTeX equations."
                className="w-full h-full bg-transparent resize-none focus:outline-none text-xs sm:text-sm leading-relaxed text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-mono"
              />
            )}
          </div>

          {/* Status Bar */}
          <div className="px-6 py-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>{wordCount} words</span>
              <span>·</span>
              <span>{charCount} characters</span>
            </div>
            <span>Auto-saved to localStorage</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <FolderOpen className="w-10 h-10 mb-2 text-slate-300 dark:text-slate-700" />
          <p className="text-sm font-medium">No note selected</p>
          <button
            onClick={handleCreateNew}
            className="mt-3 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white"
          >
            Create your first note
          </button>
        </div>
      )}
    </div>
  );
};

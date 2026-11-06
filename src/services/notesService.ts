import { Note, SubjectType } from '../types';

const INITIAL_NOTES: Note[] = [
  {
    id: 'note_1',
    title: 'Differential Calculus & Chain Rule Cheat Sheet',
    subject: 'mathematics',
    tags: ['calculus', 'derivatives', 'exam-prep'],
    isPinned: true,
    createdAt: '2026-11-04T10:30:00Z',
    updatedAt: '2026-11-05T14:20:00Z',
    content: `## Key Differential Calculus Rules

1. **Power Rule**:
   - $d/dx[x^n] = n x^{n-1}$
   - Example: $d/dx[4x^3] = 12x^2$

2. **The Chain Rule**:
   - For composite functions $y = f(g(x))$:
   - $dy/dx = f'(g(x)) \\cdot g'(x)$
   - Example: $d/dx[\\sin(3x^2)] = \\cos(3x^2) \\cdot 6x = 6x\\cos(3x^2)$

3. **Product & Quotient Rules**:
   - $(uv)' = u'v + uv'$
   - $(u/v)' = (u'v - uv') / v^2$

*Exam Tip*: When calculating tangent lines, remember that the derivative evaluates to the slope $m = f'(x_0)$ at point $(x_0, y_0)$.`,
  },
  {
    id: 'note_2',
    title: 'Newton\'s Three Laws & Free Body Diagrams',
    subject: 'physics',
    tags: ['mechanics', 'forces', 'free-body'],
    isPinned: true,
    createdAt: '2026-11-03T09:15:00Z',
    updatedAt: '2026-11-04T16:45:00Z',
    content: `## Classical Mechanics Overview

### Newton's Three Laws:
1. **Law of Inertia**: A body persists in state of rest or uniform motion unless acted upon by net force $\\Sigma F \\neq 0$.
2. **Fundamental Equation**: $\\Sigma F = m \\cdot a$ (Units: $N = \\text{kg}\\cdot\\text{m/s}^2$).
3. **Action-Reaction Pairs**: $F_{A \\to B} = - F_{B \\to A}$ (Acting on two distinct objects!).

### 4 Steps to Draw Free Body Diagrams:
1. Isolate the body as a single point mass.
2. Identify contact forces (Normal force, Friction, Tension).
3. Identify field forces (Gravity: $F_g = mg$).
4. Break vectors into orthogonal components ($x$ and $y$ axes).`,
  },
  {
    id: 'note_3',
    title: 'Cellular Respiration vs Photosynthesis',
    subject: 'biology',
    tags: ['bioenergetics', 'atp', 'mitochondria'],
    isPinned: false,
    createdAt: '2026-11-02T11:00:00Z',
    updatedAt: '2026-11-02T11:00:00Z',
    content: `## Bioenergetic Complementarity

- **Photosynthesis Equation**:
  $6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{light} \\to \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$
  Takes place in Chloroplasts (Thylakoids & Stroma).

- **Respiration Equation**:
  $\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\to 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\sim 32\\text{ ATP}$
  Takes place in Mitochondria (Matrix & Inner membrane cristae).

*Key distinction*: Plants perform BOTH photosynthesis and cellular respiration!`,
  },
];

export function getNotes(): Note[] {
  try {
    const raw = localStorage.getItem('smart_study_notes');
    if (raw) return JSON.parse(raw);
    localStorage.setItem('smart_study_notes', JSON.stringify(INITIAL_NOTES));
    return INITIAL_NOTES;
  } catch {
    return INITIAL_NOTES;
  }
}

export function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem('smart_study_notes', JSON.stringify(notes));
  } catch (err) {
    console.error('Failed to save notes', err);
  }
}

export function createNote(noteData: {
  title: string;
  content: string;
  subject: SubjectType;
  tags?: string[];
}): Note {
  const allNotes = getNotes();
  const newNote: Note = {
    id: 'note_' + Date.now(),
    title: noteData.title.trim() || 'Untitled Note',
    content: noteData.content,
    subject: noteData.subject,
    tags: noteData.tags || [],
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const updated = [newNote, ...allNotes];
  saveNotes(updated);
  return newNote;
}

export function updateNote(id: string, updates: Partial<Note>): Note[] {
  const allNotes = getNotes();
  const next = allNotes.map((n) =>
    n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
  );
  saveNotes(next);
  return next;
}

export function deleteNote(id: string): Note[] {
  const allNotes = getNotes();
  const next = allNotes.filter((n) => n.id !== id);
  saveNotes(next);
  return next;
}

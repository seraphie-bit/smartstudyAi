import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Calculator,
  ChevronRight,
  Layers,
  RotateCw,
  CheckCircle2,
  HelpCircle,
  FilePlus,
  Atom,
  FlaskConical,
  Dna,
  Terminal,
  Landmark,
  TrendingUp,
} from 'lucide-react';
import { CURRICULA } from '../services/studyMaterialsData';
import { Flashcard, SubjectType } from '../types';
import { NavTab } from '../components/Header';
import { useAuth } from '../context/AuthContext';

interface StudyMaterialsViewProps {
  initialSubject?: SubjectType;
  onSelectTab: (tab: NavTab, meta?: any) => void;
  onSaveToNotes: (title: string, content: string, subject: SubjectType) => void;
  onNotify: (msg: string) => void;
}

export const StudyMaterialsView: React.FC<StudyMaterialsViewProps> = ({
  initialSubject = 'mathematics',
  onSelectTab,
  onSaveToNotes,
  onNotify,
}) => {
  const { addXP } = useAuth();
  const [activeSubject, setActiveSubject] = useState<SubjectType>(initialSubject);
  const [activeTab, setActiveTab] = useState<'guides' | 'flashcards'>('guides');

  // Flashcard review state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<string[]>([]);

  const curriculum = CURRICULA[activeSubject] || CURRICULA.mathematics;
  const currentFlashcard = curriculum.flashcards[cardIndex] || curriculum.flashcards[0];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % curriculum.flashcards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCardIndex((prev) =>
      prev === 0 ? curriculum.flashcards.length - 1 : prev - 1
    );
  };

  const handleToggleMastered = (id: string) => {
    if (masteredCards.includes(id)) {
      setMasteredCards((prev) => prev.filter((c) => c !== id));
    } else {
      setMasteredCards((prev) => [...prev, id]);
      addXP(10);
      onNotify('Card marked as mastered! +10 XP');
    }
  };

  const handleSaveTopicToNotes = (topic: any) => {
    const content = `## ${topic.title} (${curriculum.name})\n\n${topic.summary}\n\n### Key Concepts:\n` +
      topic.keyConcepts.map((k: string) => `- ${k}`).join('\n') +
      (topic.formulas ? `\n\n### Core Formulas:\n` + topic.formulas.map((f: string) => `- $${f}$`).join('\n') : '');
    onSaveToNotes(topic.title, content, activeSubject);
    onNotify('Topic exported to Notes!');
  };

  const stemVisualImage = '/src/assets/images/learning_stem_visual_1793959261769.jpg';

  const getSubjectIcon = (id: SubjectType) => {
    switch (id) {
      case 'mathematics':
        return Calculator;
      case 'physics':
        return Atom;
      case 'chemistry':
        return FlaskConical;
      case 'biology':
        return Dna;
      case 'computer_science':
        return Terminal;
      case 'history':
        return Landmark;
      case 'economics':
        return TrendingUp;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header & Subject Tabs */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Curriculum & Knowledge Base</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Subject Study Materials
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Curated chapter outlines, core formulas, high-yield definitions, and interactive flashcard decks.
            </p>
          </div>

          {/* Mode Switch (Guides vs Flashcards) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('guides')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'guides'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Study Guides
            </button>
            <button
              onClick={() => {
                setActiveTab('flashcards');
                setCardIndex(0);
                setIsFlipped(false);
              }}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'flashcards'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Flashcards ({curriculum.flashcards.length})</span>
            </button>
          </div>
        </div>

        {/* 8 Subjects Horizontal Selector Bar */}
        <div className="pt-2 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          {Object.keys(CURRICULA).map((key) => {
            const subj = CURRICULA[key as SubjectType];
            const isSelected = activeSubject === key;
            const Icon = getSubjectIcon(key as SubjectType);
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveSubject(key as SubjectType);
                  setCardIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{subj.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. STUDY GUIDES VIEW */}
      {activeTab === 'guides' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Topics & Outlines */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {curriculum.name} Chapters & Cheatsheets
              </h2>
              <button
                onClick={() => onSelectTab('quiz')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Take {curriculum.name} Quiz</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {curriculum.topics.map((topic) => (
                <div
                  key={topic.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {topic.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSaveTopicToNotes(topic)}
                      className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                      title="Add to Notes"
                    >
                      <FilePlus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-indigo-600 dark:text-indigo-400">Chapter Summary: </strong>
                    {topic.summary}
                  </div>

                  {/* Key Concepts Grid */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Key Concepts to Master
                    </h4>
                    <ul className="grid grid-cols-1 gap-2">
                      {topic.keyConcepts.map((k, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                          <span>{k}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Formula Strip if available */}
                  {topic.formulas && topic.formulas.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Formula Reference
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {topic.formulas.map((f, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-1.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 font-mono text-xs font-semibold text-indigo-900 dark:text-indigo-200"
                          >
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Col: STEM Illustration & Quick Tools */}
          <div className="space-y-6">
            {/* Visual Subject Showcase Banner */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-sm">
              <div className="relative h-44 w-full">
                <img
                  src={stemVisualImage}
                  alt="STEM Visual Concepts"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-80"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                    High-Yield Curriculum
                  </span>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {curriculum.name} Deep Review
                  </h4>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-400 leading-relaxed">
                  {curriculum.description}
                </p>
                <button
                  onClick={() => setActiveTab('flashcards')}
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Review {curriculum.flashcards.length} Flashcards</span>
                </button>
              </div>
            </div>

            {/* Quick Math Jump if mathematics */}
            {activeSubject === 'mathematics' && (
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Math Problem Solver
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Need to check homework or see a quadratic derivation? Open the interactive calculator.
                </p>
                <button
                  onClick={() => onSelectTab('math')}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Open Math Studio</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. FLASHCARDS DECK VIEW */}
      {activeTab === 'flashcards' && currentFlashcard && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Card {cardIndex + 1} of {curriculum.flashcards.length}
            </span>
            <span className="capitalize">{currentFlashcard.category}</span>
            <span>
              Mastered: {masteredCards.filter((id) => curriculum.flashcards.some((c) => c.id === id)).length} / {curriculum.flashcards.length}
            </span>
          </div>

          {/* Flip Flashcard Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[300px] sm:min-h-[340px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-md cursor-pointer flex flex-col justify-between transition-all hover:border-indigo-500/50 group select-none relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {isFlipped ? 'Answer & Explanation' : 'Question / Concept'}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-indigo-600 transition-colors">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Click to flip</span>
              </div>
            </div>

            <div className="my-auto py-6 text-center">
              <p
                className={`text-base sm:text-xl font-bold leading-relaxed ${
                  isFlipped ? 'text-indigo-900 dark:text-indigo-200 font-medium' : 'text-slate-900 dark:text-white'
                }`}
              >
                {isFlipped ? currentFlashcard.back : currentFlashcard.front}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-400">
              <span>{curriculum.name}</span>
              <span>Tap space or click anywhere to flip</span>
            </div>
          </div>

          {/* Flashcard Navigation & Mastered Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrevCard}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Previous Card
            </button>

            <button
              onClick={() => handleToggleMastered(currentFlashcard.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                masteredCards.includes(currentFlashcard.id)
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {masteredCards.includes(currentFlashcard.id)
                  ? 'Mastered ✓'
                  : 'Mark as Mastered'}
              </span>
            </button>

            <button
              onClick={handleNextCard}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              Next Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

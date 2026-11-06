import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Play,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  History,
  ArrowRight,
} from 'lucide-react';
import { QuizAttempt, QuizQuestion, SubjectType } from '../types';
import { generateQuiz, saveQuizAttempt, getQuizAttempts } from '../services/quizEngine';
import { CURRICULA } from '../services/studyMaterialsData';
import { useAuth } from '../context/AuthContext';

interface QuizViewProps {
  onNotify: (msg: string) => void;
}

type QuizState = 'configure' | 'active' | 'results' | 'history';

export const QuizView: React.FC<QuizViewProps> = ({ onNotify }) => {
  const { addXP } = useAuth();
  const [state, setState] = useState<QuizState>('configure');

  // Configuration options
  const [subject, setSubject] = useState<SubjectType>('mathematics');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'all'>('all');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isTimed, setIsTimed] = useState(true);

  // Active quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedIndices, setFlaggedIndices] = useState<number[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  // Results state
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);
  const [historyList, setHistoryList] = useState<QuizAttempt[]>(() => getQuizAttempts());

  // Countdown timer in active exam mode
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (state === 'active' && isTimed && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
        setTotalTimeSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state, isTimed, secondsRemaining]);

  const handleStartQuiz = () => {
    const generated = generateQuiz(subject, difficulty, questionCount);
    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlaggedIndices([]);
    const allocatedTime = generated.length * 60; // 1 minute per question
    setSecondsRemaining(allocatedTime);
    setTotalTimeSpent(0);
    setState('active');
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleToggleFlag = (idx: number) => {
    setFlaggedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleFinishQuiz = () => {
    let correctCount = 0;
    const answerBreakdown = questions.map((q, idx) => {
      const selected = selectedAnswers[idx] ?? -1;
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        questionText: q.question,
        selectedIndex: selected,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    const attempt: QuizAttempt = {
      id: 'quiz_' + Date.now(),
      quizTitle: `${CURRICULA[subject]?.name || subject} Exam Prep`,
      subject,
      difficulty: difficulty === 'all' ? 'medium' : difficulty,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      scorePercentage: percentage,
      timeSpentSeconds: totalTimeSpent || (questions.length * 60 - secondsRemaining),
      date: new Date().toISOString(),
      answers: answerBreakdown,
    };

    saveQuizAttempt(attempt);
    setLastAttempt(attempt);
    setHistoryList(getQuizAttempts());
    setState('results');

    // Reward XP (+15 XP per correct question)
    const earnedXP = correctCount * 15;
    addXP(earnedXP);
    onNotify(`Quiz completed! You scored ${percentage}% (+${earnedXP} XP)`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Top Segmented Navigation (Configure / History) */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Exam Quiz Generator</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Targeted active-recall practice with timed exam drills and instant explanations
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setState('configure')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              state === 'configure' || state === 'active' || state === 'results'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Quiz Studio
          </button>
          <button
            onClick={() => {
              setHistoryList(getQuizAttempts());
              setState('history');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              state === 'history'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History ({historyList.length})</span>
          </button>
        </div>
      </div>

      {/* 1. CONFIGURE MODE */}
      {state === 'configure' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Step 1: Select Subject
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
              {Object.keys(CURRICULA).map((key) => {
                const s = CURRICULA[key as SubjectType];
                const isSelected = subject === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSubject(key as SubjectType)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {s.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {s.topics.length} topics
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                Step 2: Difficulty Level
              </h2>
              <div className="grid grid-cols-4 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs">
                {(['all', 'easy', 'medium', 'hard'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`py-2 rounded-xl capitalize font-semibold transition-all ${
                      difficulty === lvl
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                Step 3: Question Count
              </h2>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs">
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`py-2 rounded-xl font-semibold transition-all ${
                      questionCount === cnt
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cnt} Questions
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timed Exam Toggle */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Timed Exam Mode (1 min / question)
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Simulates realistic test-day pressure to build speed and accuracy
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isTimed}
                onChange={(e) => setIsTimed(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Generate & Launch Exam</span>
          </button>
        </div>
      )}

      {/* 2. ACTIVE EXAM MODE */}
      {state === 'active' && questions.length > 0 && (
        <div className="space-y-4">
          {/* Exam Header: Question Counter & Timer */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="font-mono text-indigo-600 dark:text-indigo-400 text-sm">
                Question {currentIndex + 1}
              </span>
              <span>of {questions.length}</span>
              <span className="text-slate-400">·</span>
              <span className="capitalize">{questions[currentIndex].difficulty}</span>
            </div>

            {isTimed && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold ${
                  secondsRemaining < 60
                    ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {Math.floor(secondsRemaining / 60)}:
                  {String(secondsRemaining % 60).padStart(2, '0')}
                </span>
              </div>
            )}

            <button
              onClick={() => handleToggleFlag(currentIndex)}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                flaggedIndices.includes(currentIndex)
                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Flag for review"
            >
              <Bookmark className={`w-3.5 h-3.5 ${flaggedIndices.includes(currentIndex) ? 'fill-amber-500' : ''}`} />
              <span className="hidden sm:inline">Review</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          {/* Current Question Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {questions[currentIndex].question}
            </h2>

            {/* Options List */}
            <div className="space-y-3">
              {questions[currentIndex].options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span>{opt}</span>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Question Controls */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={handleFinishQuiz}
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Exam</span>
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. RESULTS & EXPLANATION REVIEW MODE */}
      {state === 'results' && lastAttempt && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Award className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Quiz Completed!
            </h2>

            <div className="flex items-center justify-center gap-8 py-2">
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
                  {lastAttempt.scorePercentage}%
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Accuracy</div>
              </div>
              <div className="w-px h-12 bg-slate-200 dark:border-slate-800" />
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {lastAttempt.correctAnswers}/{lastAttempt.totalQuestions}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Correct Answers</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {lastAttempt.scorePercentage >= 80
                ? 'Outstanding performance! You have demonstrated strong conceptual command of this topic.'
                : lastAttempt.scorePercentage >= 60
                ? 'Solid attempt! Review the rationales below to target key areas of improvement.'
                : 'Good practice run. Deepen your understanding by reviewing the explanations below and checking your Notes.'}
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setState('configure')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Take Another Quiz</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white px-1">
              Detailed Question Explanations
            </h3>

            {lastAttempt.answers.map((ans, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border space-y-2.5 ${
                  ans.isCorrect
                    ? 'border-emerald-200 dark:border-emerald-900/60'
                    : 'border-rose-200 dark:border-rose-900/60'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {ans.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Q{idx + 1}: {ans.questionText}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {ans.isCorrect ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Correct Answer Chosen!
                        </span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 font-semibold">
                          Missed (Review explanation below)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 leading-relaxed">
                  <strong className="text-indigo-600 dark:text-indigo-400">Explanation: </strong>
                  {ans.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. HISTORY TAB */}
      {state === 'history' && (
        <div className="space-y-4">
          {historyList.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              No previous quizzes recorded yet. Take your first quiz!
            </div>
          ) : (
            historyList.map((hist) => (
              <div
                key={hist.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {hist.quizTitle}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 capitalize">
                    <span>{hist.subject}</span>
                    <span aria-hidden="true">·</span>
                    <span>{hist.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {new Date(hist.date).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {hist.scorePercentage}%
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {hist.correctAnswers}/{hist.totalQuestions} correct
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

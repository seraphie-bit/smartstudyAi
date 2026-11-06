import React, { useState } from 'react';
import {
  Calculator,
  ArrowRight,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  FilePlus,
  Copy,
  Check,
  TrendingUp,
} from 'lucide-react';
import { solveMathProblem, SAMPLE_MATH_PROBLEMS } from '../services/mathSolverEngine';
import { MathSolution } from '../types';
import { useAuth } from '../context/AuthContext';

interface MathSolverViewProps {
  initialQuery?: string;
  onSaveToNotes: (title: string, content: string, subject: 'mathematics') => void;
  onNotify: (msg: string) => void;
}

export const MathSolverView: React.FC<MathSolverViewProps> = ({
  initialQuery = 'x^2 - 5x + 6 = 0',
  onSaveToNotes,
  onNotify,
}) => {
  const { addXP } = useAuth();
  const [query, setQuery] = useState(initialQuery);
  const [solution, setSolution] = useState<MathSolution | null>(() =>
    solveMathProblem(initialQuery)
  );
  const [history, setHistory] = useState<string[]>([
    'x^2 - 5x + 6 = 0',
    '3x - 7 = 2x + 8',
    'd/dx(4x^3 - 6x^2 + 7x - 5)',
  ]);
  const [copied, setCopied] = useState(false);

  const handleSolve = (problemText?: string) => {
    const target = (problemText || query).trim();
    if (!target) return;
    const sol = solveMathProblem(target);
    setSolution(sol);
    if (!history.includes(target)) {
      setHistory((prev) => [target, ...prev.slice(0, 8)]);
    }
    addXP(20);
    onNotify('Math problem solved! +20 XP');
  };

  const handleInsertSymbol = (sym: string) => {
    setQuery((prev) => prev + sym);
  };

  const handleCopySolution = () => {
    if (!solution) return;
    const text = `Math Problem: ${solution.query}\nResult: ${solution.result}\n\nSteps:\n` +
      solution.steps
        .map((s) => `${s.stepNumber}. ${s.title}: ${s.expression} (${s.description})`)
        .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    onNotify('Copied solution to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSolutionToNotes = () => {
    if (!solution) return;
    const content = `## Mathematical Problem: ${solution.query}\n\n**Result:** ${solution.result}\n\n### Step-by-Step Solution:\n` +
      solution.steps
        .map(
          (s) => `**Step ${s.stepNumber}: ${s.title}**\n- Expression: $${s.expression}$\n- ${s.description}\n`
        )
        .join('\n') +
      (solution.tips ? `\n### Helpful Tips:\n` + solution.tips.map((t) => `- ${t}`).join('\n') : '');
    onSaveToNotes(`Math Solution: ${solution.query}`, content, 'mathematics');
    onNotify('Saved to Notes notebook!');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header & Prompt Formulation */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Calculator className="w-4 h-4" />
          <span>Interactive Mathematical Solver</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Step-by-Step Problem Solver
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Input algebraic equations, quadratic formulas, calculus derivatives, Pythagorean right triangles, or statistical datasets to inspect exhaustive derivations and interactive function graphs.
        </p>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSolve();
          }}
          className="mt-6 flex flex-col sm:flex-row gap-2.5"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. x^2 - 5x + 6 = 0, 3x + 12 = 24, or d/dx(3x^3 - 4x)"
              className="w-full px-4 py-3.5 text-sm sm:text-base font-mono rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Solve Step-by-Step</span>
          </button>
        </form>

        {/* Quick Mathematical Symbols Keyboard Bar */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar pt-1">
          <span className="text-[11px] text-slate-400 font-medium shrink-0 mr-1">Symbols:</span>
          {['x²', '√', 'π', 'Δ', '±', 'd/dx', '∫', '+', '-', '×', '÷', '^', '(', ')'].map((sym) => (
            <button
              key={sym}
              type="button"
              onClick={() => handleInsertSymbol(sym === 'x²' ? '^2' : sym === '×' ? '*' : sym === '÷' ? '/' : sym)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs transition-colors shrink-0"
            >
              {sym}
            </button>
          ))}
        </div>

        {/* Sample Problems Pill Strip */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] text-slate-400 font-medium shrink-0">Try Sample:</span>
          {SAMPLE_MATH_PROBLEMS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(s.query);
                handleSolve(s.query);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap text-xs transition-all shrink-0"
            >
              {s.label}: <span className="font-mono text-indigo-600 dark:text-indigo-400">{s.query}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Solution Area */}
      {solution && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Step-by-Step Derivation */}
          <div className="lg:col-span-2 space-y-4">
            {/* Final Answer Banner */}
            <div className="p-6 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                  Calculated Result
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySolution}
                    className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                    title="Copy Solution"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleSaveSolutionToNotes}
                    className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                    title="Save to Notes"
                  >
                    <FilePlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
                {solution.result}
              </div>
            </div>

            {/* Steps Container */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white px-1">
                Detailed Mathematical Derivation ({solution.steps.length} Steps)
              </h2>

              {solution.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center font-mono">
                      {step.stepNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-xs sm:text-sm text-indigo-700 dark:text-indigo-300 border border-slate-200/60 dark:border-slate-700/60 overflow-x-auto">
                    {step.expression}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Col: Interactive Visual Graph / Properties */}
          <div className="space-y-6">
            {/* Function Graph Plotter Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>Visual Graph Preview</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Cartesian Plane</span>
              </div>

              {solution.graphData && solution.graphData.points ? (
                <div className="space-y-3">
                  {/* Interactive SVG Cartesian Plot */}
                  <div className="w-full h-56 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center p-2">
                    <svg
                      viewBox="-50 -50 100 100"
                      className="w-full h-full transform scale-y-[-1]"
                    >
                      {/* Grid Lines */}
                      {[-40, -20, 0, 20, 40].map((v) => (
                        <g key={v}>
                          <line
                            x1="-50"
                            y1={v}
                            x2="50"
                            y2={v}
                            stroke="#1e293b"
                            strokeWidth="0.5"
                          />
                          <line
                            x1={v}
                            y1="-50"
                            x2={v}
                            y2="50"
                            stroke="#1e293b"
                            strokeWidth="0.5"
                          />
                        </g>
                      ))}

                      {/* X & Y Axis */}
                      <line x1="-50" y1="0" x2="50" y2="0" stroke="#475569" strokeWidth="1" />
                      <line x1="0" y1="-50" x2="0" y2="50" stroke="#475569" strokeWidth="1" />

                      {/* Curve Line */}
                      {solution.graphData.points.length > 1 && (
                        <polyline
                          fill="none"
                          stroke="#6366f1"
                          strokeWidth="2"
                          strokeLinecap="round"
                          points={solution.graphData.points
                            .map((p) => `${p.x * 6},${Math.max(-48, Math.min(48, p.y * 3))}`)
                            .join(' ')}
                        />
                      )}

                      {/* Highlight Roots & Points */}
                      {solution.graphData.points.slice(0, 5).map((p, i) => (
                        <circle
                          key={i}
                          cx={p.x * 6}
                          cy={Math.max(-48, Math.min(48, p.y * 3))}
                          r="1.8"
                          fill="#38bdf8"
                        />
                      ))}
                    </svg>

                    <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                      {solution.graphData.equation || solution.query}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {solution.graphData.description}
                  </p>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <p>Numerical or statistical evaluation completed.</p>
                  <p className="text-[11px] text-slate-500 mt-1">Try a quadratic equation like <code className="text-indigo-600">x^2 - 4x + 3 = 0</code> to see parabolic curves!</p>
                </div>
              )}
            </div>

            {/* Pro Tips & Common Mistakes */}
            {solution.tips && solution.tips.length > 0 && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Key Rules & Exam Tips
                </h3>
                <ul className="space-y-2">
                  {solution.tips.map((tip, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 leading-relaxed"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recent Solved History */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Solved History
                </h3>
                <button
                  onClick={() => setHistory([])}
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-1.5">
                {history.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(h);
                      handleSolve(h);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 truncate transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate">{h}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

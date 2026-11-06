import { QuizAttempt, QuizQuestion, SubjectType } from '../types';

export const QUESTION_BANK: Record<SubjectType, QuizQuestion[]> = {
  mathematics: [
    {
      id: 'm1',
      subject: 'mathematics',
      difficulty: 'easy',
      question: 'What are the real roots of the equation x² - 9 = 0?',
      options: ['x = 3 and x = -3', 'x = 9 and x = -9', 'x = 3 only', 'x = 0'],
      correctIndex: 0,
      explanation: 'Factor as a difference of squares: (x - 3)(x + 3) = 0. Therefore x = 3 or x = -3.',
    },
    {
      id: 'm2',
      subject: 'mathematics',
      difficulty: 'medium',
      question: 'What is the derivative of f(x) = 3x⁴ - 5x² + 7 with respect to x?',
      options: ['12x³ - 10x', '12x⁴ - 10x²', '3x³ - 5x', '12x³ - 10x + 7'],
      correctIndex: 0,
      explanation: 'Apply the power rule d/dx[xⁿ] = n·xⁿ⁻¹. For 3x⁴: 12x³. For -5x²: -10x. The constant 7 derives to 0.',
    },
    {
      id: 'm3',
      subject: 'mathematics',
      difficulty: 'medium',
      question: 'If a right triangle has legs of length a = 5 and b = 12, what is the length of hypotenuse c?',
      options: ['13', '17', '15', '14.5'],
      correctIndex: 0,
      explanation: 'Using the Pythagorean Theorem: c² = a² + b² = 25 + 144 = 169. Therefore c = √169 = 13.',
    },
    {
      id: 'm4',
      subject: 'mathematics',
      difficulty: 'hard',
      question: 'What is the value of the discriminant for 2x² - 4x + 5 = 0, and what does it reveal about the roots?',
      options: [
        'Δ = -24; Two complex conjugate roots',
        'Δ = 56; Two real roots',
        'Δ = 0; One repeated real root',
        'Δ = -16; No solutions exist in complex plane',
      ],
      correctIndex: 0,
      explanation: 'Δ = b² - 4ac = (-4)² - 4(2)(5) = 16 - 40 = -24. Because Δ < 0, there are two distinct complex roots.',
    },
    {
      id: 'm5',
      subject: 'mathematics',
      difficulty: 'easy',
      question: 'What is the value of sin²(θ) + cos²(θ) for any angle θ?',
      options: ['1', '0', 'tan(θ)', '2'],
      correctIndex: 0,
      explanation: 'This is the fundamental Pythagorean trigonometric identity derived directly from the unit circle.',
    },
    {
      id: 'm6',
      subject: 'mathematics',
      difficulty: 'hard',
      question: 'What is the integral ∫ (6x² + 4x) dx?',
      options: ['2x³ + 2x² + C', '3x³ + 4x² + C', '12x + 4 + C', '6x³ + 2x² + C'],
      correctIndex: 0,
      explanation: 'Using the power rule for integration: ∫ xⁿ dx = (xⁿ⁺¹)/(n+1). Thus 6(x³/3) + 4(x²/2) = 2x³ + 2x² + C.',
    },
  ],
  physics: [
    {
      id: 'p1',
      subject: 'physics',
      difficulty: 'easy',
      question: 'According to Newton’s First Law, what keeps an object in uniform motion?',
      options: [
        'No net external force acting on it (inertia)',
        'A constant propulsion force',
        'Gravitational equilibrium',
        'Thermal friction',
      ],
      correctIndex: 0,
      explanation: 'Newton’s First Law states that an object continues in its state of rest or uniform motion unless acted upon by a non-zero net external force.',
    },
    {
      id: 'p2',
      subject: 'physics',
      difficulty: 'medium',
      question: 'A 4 kg box is accelerated across a frictionless surface at 3 m/s². What net force is applied?',
      options: ['12 N', '7 N', '1.33 N', '0.75 N'],
      correctIndex: 0,
      explanation: 'Using Newton\'s Second Law: F = m × a = 4 kg × 3 m/s² = 12 Newtons.',
    },
    {
      id: 'p3',
      subject: 'physics',
      difficulty: 'hard',
      question: 'If the speed of a vehicle triples from 20 km/h to 60 km/h, by what factor does its kinetic energy increase?',
      options: ['9 times', '3 times', '6 times', '27 times'],
      correctIndex: 0,
      explanation: 'Kinetic energy is KE = 0.5·m·v². Tripling velocity scales kinetic energy by 3² = 9.',
    },
    {
      id: 'p4',
      subject: 'physics',
      difficulty: 'easy',
      question: 'What is the standard SI unit of electric resistance?',
      options: ['Ohm (Ω)', 'Volt (V)', 'Ampere (A)', 'Watt (W)'],
      correctIndex: 0,
      explanation: 'The Ohm (symbol: Ω) is the SI unit of electrical resistance, defined by Ohm\'s Law V = I·R.',
    },
  ],
  chemistry: [
    {
      id: 'c1',
      subject: 'chemistry',
      difficulty: 'easy',
      question: 'What type of bond forms between sodium (Na) and chlorine (Cl)?',
      options: ['Ionic bond', 'Non-polar covalent bond', 'Metallic bond', 'Hydrogen bond'],
      correctIndex: 0,
      explanation: 'Sodium transfers its single valence electron to chlorine, forming Na⁺ and Cl⁻ ions held together by strong electrostatic attraction (ionic bonding).',
    },
    {
      id: 'c2',
      subject: 'chemistry',
      difficulty: 'medium',
      question: 'What is the molecular geometry of methane (CH₄) according to VSEPR theory?',
      options: ['Tetrahedral (109.5°)', 'Trigonal planar (120°)', 'Linear (180°)', 'Bent (104.5°)'],
      correctIndex: 0,
      explanation: 'Methane has four bonding pairs around carbon with zero lone pairs, producing a symmetrical tetrahedral geometry with bond angles of 109.5°.',
    },
    {
      id: 'c3',
      subject: 'chemistry',
      difficulty: 'hard',
      question: 'What is the pH of a solution with a hydrogen ion concentration [H⁺] = 1 × 10⁻⁴ M?',
      options: ['4.0', '10.0', '7.0', '1.0'],
      correctIndex: 0,
      explanation: 'pH is defined as -log₁₀[H⁺]. Therefore pH = -log₁₀(10⁻⁴) = 4.0 (an acidic solution).',
    },
  ],
  biology: [
    {
      id: 'b1',
      subject: 'biology',
      difficulty: 'easy',
      question: 'Which organelle is often referred to as the "powerhouse" of eukaryotic cells because it synthesizes ATP?',
      options: ['Mitochondria', 'Endoplasmic reticulum', 'Ribosome', 'Golgi apparatus'],
      correctIndex: 0,
      explanation: 'Mitochondria generate the majority of cellular chemical energy (ATP) through the citric acid cycle and oxidative phosphorylation.',
    },
    {
      id: 'b2',
      subject: 'biology',
      difficulty: 'medium',
      question: 'In DNA, which nitrogenous base pairs with Adenine (A) via two hydrogen bonds?',
      options: ['Thymine (T)', 'Guanine (G)', 'Cytosine (C)', 'Uracil (U)'],
      correctIndex: 0,
      explanation: 'By Chargaff’s complementary base pairing rules, Adenine pairs with Thymine in DNA (with Uracil in RNA), and Cytosine pairs with Guanine via three hydrogen bonds.',
    },
    {
      id: 'b3',
      subject: 'biology',
      difficulty: 'hard',
      question: 'During which phase of meiosis does crossing over (homologous genetic recombination) occur?',
      options: ['Prophase I', 'Metaphase I', 'Anaphase II', 'Telophase I'],
      correctIndex: 0,
      explanation: 'Crossing over occurs between non-sister chromatids of homologous chromosomes during Prophase I of meiosis, creating novel genetic combinations.',
    },
  ],
  computer_science: [
    {
      id: 'cs1',
      subject: 'computer_science',
      difficulty: 'easy',
      question: 'What is the time complexity of accessing an element in an array by its index?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      correctIndex: 0,
      explanation: 'Arrays store elements in contiguous memory slots, allowing instant direct offset calculation in constant O(1) time.',
    },
    {
      id: 'cs2',
      subject: 'computer_science',
      difficulty: 'medium',
      question: 'Which data structure operates on a Last-In, First-Out (LIFO) protocol?',
      options: ['Stack', 'Queue', 'Linked List', 'Binary Tree'],
      correctIndex: 0,
      explanation: 'A Stack is a LIFO data structure, where the most recently pushed element is the first one popped (used in browser back buttons and call stacks).',
    },
    {
      id: 'cs3',
      subject: 'computer_science',
      difficulty: 'hard',
      question: 'What is the worst-case time complexity of searching in an unbalanced Binary Search Tree of n elements?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
      correctIndex: 0,
      explanation: 'If a BST is completely unbalanced (skewed like a linked list), searching requires inspecting all n nodes, degrading to O(n).',
    },
  ],
  history: [
    {
      id: 'h1',
      subject: 'history',
      difficulty: 'medium',
      question: 'Which Enlightenment philosopher proposed that government must derive legitimacy from the "consent of the governed" and protect natural rights?',
      options: ['John Locke', 'Thomas Hobbes', 'Niccolò Machiavelli', 'King Louis XIV'],
      correctIndex: 0,
      explanation: 'John Locke argued in his Two Treatises of Government that citizens have inalienable rights to life, liberty, and property, directly influencing modern democratic constitutions.',
    },
    {
      id: 'h2',
      subject: 'history',
      difficulty: 'easy',
      question: 'In which year did the French Revolution begin with the storming of the Bastille?',
      options: ['1789', '1776', '1804', '1815'],
      correctIndex: 0,
      explanation: 'The French Revolution commenced in July 1789 when Parisians stormed the royal Bastille fortress and prison.',
    },
  ],
  literature: [
    {
      id: 'l1',
      subject: 'literature',
      difficulty: 'easy',
      question: 'What literary device is used when an author directly compares two things using "like" or "as"?',
      options: ['Simile', 'Metaphor', 'Hyperbole', 'Personification'],
      correctIndex: 0,
      explanation: 'A simile makes an explicit comparison between two distinct things using connecting words such as "like" or "as".',
    },
    {
      id: 'l2',
      subject: 'literature',
      difficulty: 'medium',
      question: 'In Aristotle’s Rhetorical Triangle, which appeal relies on establishing credibility and moral authority?',
      options: ['Ethos', 'Pathos', 'Logos', 'Kairos'],
      correctIndex: 0,
      explanation: 'Ethos appeals to character, credibility, and authority, while Pathos targets emotions and Logos targets logic.',
    },
  ],
  economics: [
    {
      id: 'e1',
      subject: 'economics',
      difficulty: 'easy',
      question: 'What fundamental economic term describes the value of the next best alternative sacrificed when making a choice?',
      options: ['Opportunity Cost', 'Sunk Cost', 'Marginal Cost', 'Variable Cost'],
      correctIndex: 0,
      explanation: 'Opportunity cost is the benefit or value given up from the alternative option when selecting one course of action over another.',
    },
    {
      id: 'e2',
      subject: 'economics',
      difficulty: 'medium',
      question: 'If the price of coffee rises and the demand for tea increases as a result, coffee and tea are:',
      options: ['Substitute goods', 'Complementary goods', 'Inferior goods', 'Giffen goods'],
      correctIndex: 0,
      explanation: 'Substitute goods are alternatives to each other; an increase in the price of one increases consumer demand for the other.',
    },
  ],
};

export function generateQuiz(
  subject: SubjectType,
  difficulty: 'easy' | 'medium' | 'hard' | 'all',
  questionCount: number = 5
): QuizQuestion[] {
  const bank = QUESTION_BANK[subject] || QUESTION_BANK.mathematics;
  let pool = difficulty === 'all' ? bank : bank.filter((q) => q.difficulty === difficulty);

  // If pool is smaller than questionCount, backfill from other difficulties in same subject
  if (pool.length < questionCount) {
    const extra = bank.filter((q) => !pool.some((p) => p.id === q.id));
    pool = [...pool, ...extra];
  }

  // Shuffle pool
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(questionCount, shuffled.length));
}

export function saveQuizAttempt(attempt: QuizAttempt): void {
  try {
    const raw = localStorage.getItem('smart_study_quiz_history');
    const list: QuizAttempt[] = raw ? JSON.parse(raw) : [];
    list.unshift(attempt);
    // Keep last 30 attempts
    localStorage.setItem('smart_study_quiz_history', JSON.stringify(list.slice(0, 30)));
  } catch (err) {
    console.error('Failed to save quiz attempt', err);
  }
}

export function getQuizAttempts(): QuizAttempt[] {
  try {
    const raw = localStorage.getItem('smart_study_quiz_history');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

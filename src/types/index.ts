export type SubjectType =
  | 'mathematics'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'computer_science'
  | 'history'
  | 'literature'
  | 'economics';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  gradeLevel: string;
  targetExam: string;
  studyGoalHoursWeekly: number;
  joinedDate: string;
  streakDays: number;
  lastStudyDate: string;
  xpPoints: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: SubjectType;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TutorPersona = 'socratic' | 'explainer' | 'coach' | 'summary';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  persona?: TutorPersona;
  subject?: SubjectType;
  suggestedFollowUps?: string[];
}

export interface MathStep {
  stepNumber: number;
  title: string;
  description: string;
  expression: string;
  annotation?: string;
}

export interface MathSolution {
  query: string;
  category: 'algebra' | 'calculus' | 'geometry' | 'trigonometry' | 'statistics' | 'arithmetic';
  result: string;
  steps: MathStep[];
  graphData?: {
    type: 'function' | 'geometry' | 'bar';
    points?: { x: number; y: number }[];
    equation?: string;
    description?: string;
  };
  tips?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: SubjectType;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizAttempt {
  id: string;
  quizTitle: string;
  subject: SubjectType;
  difficulty: 'easy' | 'medium' | 'hard';
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  date: string;
  answers: {
    questionId: string;
    questionText: string;
    selectedIndex: number;
    correctIndex: number;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface StudyTopic {
  id: string;
  title: string;
  description: string;
  keyConcepts: string[];
  formulas?: string[];
  summary: string;
  practiceQuestionsCount: number;
}

export interface Flashcard {
  id: string;
  subject: SubjectType;
  front: string;
  back: string;
  category: string;
}

export interface SubjectCurriculum {
  id: SubjectType;
  name: string;
  iconName: string;
  color: string;
  bgLight: string;
  bgDark: string;
  description: string;
  topics: StudyTopic[];
  flashcards: Flashcard[];
}

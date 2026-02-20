// Enums
export enum Subject {
  MATEMATICA = 'MATEMATICA',
  PORTUGUES = 'PORTUGUES',
  CIENCIAS = 'CIENCIAS',
  HISTORIA = 'HISTORIA',
  GEOGRAFIA = 'GEOGRAFIA',
  HORTICULTURA = 'HORTICULTURA',
  ENSINO_RELIGIOSO = 'ENSINO_RELIGIOSO',
  ARTE_E_EDUCACAO = 'ARTE_E_EDUCACAO',
}

export enum Grade {
  FIRST_YEAR = 'FIRST_YEAR',
  SECOND_YEAR = 'SECOND_YEAR',
  THIRD_YEAR = 'THIRD_YEAR',
  FOURTH_YEAR = 'FOURTH_YEAR',
  FIFTH_YEAR = 'FIFTH_YEAR',
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum QuestionType {
  MCQ = 'MCQ',
  OPEN = 'OPEN',
  TRUE_FALSE = 'TRUE_FALSE',
  FILL_BLANK = 'FILL_BLANK',
  VARIABLE = 'VARIABLE',
}

export enum VersionType {
  STUDENT_A = 'STUDENT_A',
  TEACHER_A = 'TEACHER_A',
  STUDENT_B = 'STUDENT_B',
  TEACHER_B = 'TEACHER_B',
}

export enum VersionStatus {
  DRAFT = 'DRAFT',
  GENERATED = 'GENERATED',
  RENDERED = 'RENDERED',
  FAILED = 'FAILED',
}

export enum Audience {
  STUDENTS = 'STUDENTS',
  TEACHERS = 'TEACHERS',
}

// Mapeamentos para exibição (PT-BR)
export const SubjectLabels: Record<Subject, string> = {
  [Subject.MATEMATICA]: 'Matemática',
  [Subject.PORTUGUES]: 'Português',
  [Subject.CIENCIAS]: 'Ciências',
  [Subject.HISTORIA]: 'História',
  [Subject.GEOGRAFIA]: 'Geografia',
  [Subject.HORTICULTURA]: 'Horticultura',
  [Subject.ENSINO_RELIGIOSO]: 'Ensino Religioso',
  [Subject.ARTE_E_EDUCACAO]: 'Arte e Educação',
};

export const SubjectAbbreviations: Record<Subject, string> = {
  [Subject.MATEMATICA]: 'MAT',
  [Subject.PORTUGUES]: 'POR',
  [Subject.CIENCIAS]: 'CIE',
  [Subject.HISTORIA]: 'HIS',
  [Subject.GEOGRAFIA]: 'GEO',
  [Subject.HORTICULTURA]: 'HOR',
  [Subject.ENSINO_RELIGIOSO]: 'REL',
  [Subject.ARTE_E_EDUCACAO]: 'ART',
};

export const GradeLabels: Record<Grade, string> = {
  [Grade.FIRST_YEAR]: '1º Ano',
  [Grade.SECOND_YEAR]: '2º Ano',
  [Grade.THIRD_YEAR]: '3º Ano',
  [Grade.FOURTH_YEAR]: '4º Ano',
  [Grade.FIFTH_YEAR]: '5º Ano',
};

export const DifficultyLabels: Record<Difficulty, string> = {
  [Difficulty.EASY]: 'Fácil',
  [Difficulty.MEDIUM]: 'Médio',
  [Difficulty.HARD]: 'Difícil',
};

export const QuestionTypeLabels: Record<QuestionType, string> = {
  [QuestionType.MCQ]: 'Múltipla Escolha',
  [QuestionType.OPEN]: 'Dissertativa',
  [QuestionType.TRUE_FALSE]: 'Verdadeiro ou Falso',
  [QuestionType.FILL_BLANK]: 'Preencher Lacunas',
  [QuestionType.VARIABLE]: 'Variado',
};

// Auth Types
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

// User Types
export interface UserProfile {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  username: string;
  totalWorksheets: number;
  totalExercises: number;
}

export interface RecentActivity {
  version_id: number;
  worksheet_topic: string;
  subject: Subject;
  grade: Grade;
  difficulty: Difficulty;
  question_count: number;
  created_at: string;
}

export interface ActivitiesResponse {
  activities: RecentActivity[];
  currentPage: number;
  totalPages: number;
  totalActivities: number;
}

// Worksheet Types
export interface CreateWorksheetRequest {
  subject: Subject;
  grade: Grade;
  topic: string;
  difficulty: Difficulty;
  questionCount: number;
  description?: string;
  questionType: QuestionType;
}

export interface Worksheet {
  id: number;
  teacherName: string | null;
  subject: Subject;
  grade: Grade;
  topic: string;
  difficulty: Difficulty;
  questionCount: number;
  description: string;
  questionType: QuestionType;
  createdAt: string;
}

export interface WorksheetsResponse {
  content: Worksheet[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

// Version Types
export interface CreateVersionRequest {
  versionType: VersionType;
  includeAnswers: boolean;
  includeExplanations: boolean;
}

export interface WorksheetVersion {
  id: number;
  worksheetId: number;
  versionType: VersionType;
  seed: number;
  includeAnswers: boolean;
  includeExplanations: boolean;
  status: VersionStatus;
}

export interface QuestionOption {
  label: string;
  text: string;
}

export interface Question {
  orderNumber: number;
  type: QuestionType;
  statement: string;
  correctAnswer?: string;
  explanation?: string;
  options?: QuestionOption[];
}

export interface VersionSpec {
  description: string;
  questions: Question[];
}

// API Error
export interface ApiError {
  message: string;
  status?: number;
}

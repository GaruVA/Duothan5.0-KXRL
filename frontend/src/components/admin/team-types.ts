export interface TeamMember {
  name: string;
  email: string;
}

export interface Team {
  _id: string;
  teamName: string;
  email: string;
  members: TeamMember[];
  isActive: boolean;
  createdAt: string;
  totalSubmissions?: number;
  solvedChallenges?: number;
  points?: number;
  recentSubmissions?: Submission[];
}

export interface Submission {
  _id: string;
  teamId: string;
  challengeId: {
    _id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  sourceCode: string;
  languageId: number;
  languageName: string;
  status: {
    id: number;
    description: string;
  };
  stdout?: string;
  stderr?: string;
  compileOutput?: string;
  message?: string;
  time?: string;
  memory?: number;
  exitCode?: number;
  exitSignal?: number;
  createdAt: string;
  finishedAt?: string;
  testCases: TestCase[];
  score: number;
  isCorrect: boolean;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTime: string;
  memory: number;
}

export interface TeamsResponse {
  teams: Team[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface SubmissionsResponse {
  submissions: Submission[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface TeamFilters {
  search: string;
  isActive: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: Example[];
  testCases: TestCase[];
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  category: string;
  tags: string[];
  timeLimit: number;
  memoryLimit: number;
  allowedLanguages: AllowedLanguage[];
  points: number;
  isActive: boolean;
  startTime?: string;
  endTime?: string;
  hints: Hint[];
  createdAt: string;
  updatedAt: string;
  authorId?: {
    name?: string;
    email?: string;
  };
  submissionCount: number;
  solvedCount: number;
  flag: string;
  buildathonProblem: {
    description: string;
    requirements: string;
    deliverables: string[];
  };
}

export interface ChallengeListItem {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  category: string;
  tags: string[];
  points: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  authorId?: {
    name?: string;
    email?: string;
  };
  submissionCount: number;
  solvedCount: number;
}

export interface Example {
  input: string;
  output: string;
  explanation: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  points: number;
}

export interface AllowedLanguage {
  languageId: number;
  languageName: string;
}

export interface Hint {
  content: string;
  pointsDeduction: number;
}

export interface ChallengeFormData {
  title: string;
  description: string;
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: Example[];
  testCases: TestCase[];
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  category: string;
  tags: string[];
  timeLimit: number;
  memoryLimit: number;
  allowedLanguages: AllowedLanguage[];
  points: number;
  isActive: boolean;
  startTime: string;
  endTime: string;
  hints: Hint[];
  flag: string;
  buildathonProblem: {
    description: string;
    requirements: string;
    deliverables: string[];
  };
}

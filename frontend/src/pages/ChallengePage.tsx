import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { challengesAPI } from '../api/auth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  points: number;
}

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface Hint {
  content: string;
  pointsDeduction: number;
}

interface AllowedLanguage {
  languageId: number;
  languageName: string;
}

interface Challenge {
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
  startTime?: Date;
  endTime?: Date;
  hints: Hint[];
  submissionCount: number;
  solvedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ChallengePage = () => {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [usedHints, setUsedHints] = useState<number[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Expert':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatMemoryLimit = (memoryInKB: number) => {
    if (memoryInKB >= 1024) {
      return `${(memoryInKB / 1024).toFixed(0)} MB`;
    }
    return `${memoryInKB} KB`;
  };

  const handleUseHint = (hintIndex: number) => {
    if (!usedHints.includes(hintIndex)) {
      setUsedHints([...usedHints, hintIndex]);
    }
  };

  const handleStartCoding = () => {
    // TODO: Navigate to coding interface when implemented
    alert('Coding interface will be implemented soon!');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!id) {
        setError('Challenge ID not provided');
        setLoading(false);
        return;
      }

      try {
        const response = await challengesAPI.getChallengeById(id);
        setChallenge(response.challenge || response);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch challenge details');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading challenge details...</p>
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-red-800">Error Loading Challenge</h3>
            <p className="mt-1 text-sm text-red-600">{error}</p>
            <div className="mt-4">
              <Button onClick={handleBackToDashboard} variant="outline">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={handleBackToDashboard}
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Challenge Details</h1>
                <p className="text-sm text-indigo-600 font-medium">Solve the challenge, unveil the Buildathon</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.teamName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Challenge Header */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-6 py-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h2 className="text-3xl font-bold text-gray-900">{challenge.title}</h2>
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <p className="text-lg text-gray-600 mb-4">{challenge.description}</p>
                  
                  {/* Challenge Meta Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Category:</span>
                      <span className="ml-2 text-gray-900">{challenge.category}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Points:</span>
                      <span className="ml-2 text-gray-900">{challenge.points}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Time Limit:</span>
                      <span className="ml-2 text-gray-900">{challenge.timeLimit}s</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Memory Limit:</span>
                      <span className="ml-2 text-gray-900">{formatMemoryLimit(challenge.memoryLimit)}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {challenge.tags && challenge.tags.length > 0 && (
                    <div className="mt-4">
                      <span className="font-medium text-gray-500 text-sm">Tags:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {challenge.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>{challenge.submissionCount} submissions</span>
                      <span>{challenge.solvedCount} solved</span>
                      <span>Success rate: {challenge.submissionCount > 0 ? ((challenge.solvedCount / challenge.submissionCount) * 100).toFixed(1) : 0}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="ml-6">
                  <Button onClick={handleStartCoding} size="lg" className="bg-green-600 hover:bg-green-700">
                    Start Coding
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Problem Statement */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Problem Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700">{challenge.problemStatement}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Input/Output Format */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Input Format</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-gray-700 font-mono text-sm bg-gray-50 p-3 rounded">
                      {challenge.inputFormat}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Output Format</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-gray-700 font-mono text-sm bg-gray-50 p-3 rounded">
                      {challenge.outputFormat}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Constraints */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Constraints</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-gray-700 font-mono text-sm bg-gray-50 p-3 rounded">
                    {challenge.constraints}
                  </p>
                </CardContent>
              </Card>

              {/* Examples */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {challenge.examples.map((example, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="font-semibold text-gray-900 mb-3">Example {index + 1}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Input:</h5>
                            <pre className="bg-white p-3 rounded border text-sm font-mono overflow-x-auto">
                              {example.input}
                            </pre>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Output:</h5>
                            <pre className="bg-white p-3 rounded border text-sm font-mono overflow-x-auto">
                              {example.output}
                            </pre>
                          </div>
                        </div>
                        {example.explanation && (
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-700 mb-2">Explanation:</h5>
                            <p className="text-gray-600 text-sm">{example.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Allowed Languages */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Allowed Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {challenge.allowedLanguages.map((lang, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{lang.languageName}</span>
                        <Badge variant="outline" className="text-xs">ID: {lang.languageId}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Hints */}
              {challenge.hints && challenge.hints.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      Hints
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowHints(!showHints)}
                      >
                        {showHints ? 'Hide' : 'Show'}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  {showHints && (
                    <CardContent>
                      <div className="space-y-3">
                        {challenge.hints.map((hint, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">Hint {index + 1}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-red-600">-{hint.pointsDeduction} pts</span>
                                {!usedHints.includes(index) && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUseHint(index)}
                                    className="text-xs"
                                  >
                                    Reveal
                                  </Button>
                                )}
                              </div>
                            </div>
                            {usedHints.includes(index) ? (
                              <p className="text-sm text-gray-600">{hint.content}</p>
                            ) : (
                              <p className="text-sm text-gray-400 italic">Click "Reveal" to see this hint</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Challenge Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Challenge Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={challenge.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {challenge.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {challenge.startTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start Time:</span>
                        <span className="text-gray-900">
                          {new Date(challenge.startTime).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {challenge.endTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">End Time:</span>
                        <span className="text-gray-900">
                          {new Date(challenge.endTime).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900">
                        {new Date(challenge.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChallengePage;

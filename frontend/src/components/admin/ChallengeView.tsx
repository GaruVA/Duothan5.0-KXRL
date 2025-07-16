import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Challenge } from './types';

interface ChallengeViewProps {
  challenge: Challenge;
  onEdit: () => void;
  onClose: () => void;
}

const ChallengeView: React.FC<ChallengeViewProps> = ({ challenge, onEdit, onClose }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSuccessRate = () => {
    if (challenge.submissionCount === 0) return 0;
    return Math.round((challenge.solvedCount / challenge.submissionCount) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{challenge.title}</h1>
            <Badge className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
            <Badge variant={challenge.isActive ? "default" : "secondary"}>
              {challenge.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="text-gray-600">{challenge.description}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onEdit} variant="outline">
            Edit Challenge
          </Button>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>

      {/* Challenge Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Basic Info</h3>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Category:</span> {challenge.category}</div>
            <div><span className="font-medium">Points:</span> {challenge.points}</div>
            <div><span className="font-medium">Time Limit:</span> {challenge.timeLimit}s</div>
            <div><span className="font-medium">Memory Limit:</span> {challenge.memoryLimit / 1000}MB</div>
            <div><span className="font-medium">Flag:</span> {challenge.flag}</div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Statistics</h3>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Submissions:</span> {challenge.submissionCount}</div>
            <div><span className="font-medium">Solved:</span> {challenge.solvedCount}</div>
            <div><span className="font-medium">Success Rate:</span> {getSuccessRate()}%</div>
            <div><span className="font-medium">Test Cases:</span> {challenge.testCases.length}</div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Timeline</h3>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Created:</span> {new Date(challenge.createdAt).toLocaleDateString()}</div>
            <div><span className="font-medium">Updated:</span> {new Date(challenge.updatedAt).toLocaleDateString()}</div>
            {challenge.startTime && (
              <div><span className="font-medium">Start:</span> {new Date(challenge.startTime).toLocaleString()}</div>
            )}
            {challenge.endTime && (
              <div><span className="font-medium">End:</span> {new Date(challenge.endTime).toLocaleString()}</div>
            )}
          </div>
        </Card>
      </div>

      {/* Tags */}
      {challenge.tags.length > 0 && (
        <Card className="p-4 mb-6">
          <h3 className="font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {challenge.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                {tag}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Problem Statement */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Algorithmic Problem Statement</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap">{challenge.problemStatement}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Input Format</h4>
              <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap">{challenge.inputFormat}</div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Output Format</h4>
              <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap">{challenge.outputFormat}</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Constraints</h4>
            <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap">{challenge.constraints}</div>
          </div>
        </div>
      </Card>

      {/* Buildathon Problem */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Buildathon Problem (Revealed after flag submission)</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <div className="bg-blue-50 p-4 rounded whitespace-pre-wrap">{challenge.buildathonProblem.description}</div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Requirements</h4>
            <div className="bg-blue-50 p-4 rounded whitespace-pre-wrap">{challenge.buildathonProblem.requirements}</div>
          </div>

          {challenge.buildathonProblem.deliverables.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Deliverables</h4>
              <div className="bg-blue-50 p-4 rounded">
                <ul className="list-disc list-inside space-y-1">
                  {challenge.buildathonProblem.deliverables.map((deliverable, index) => (
                    <li key={index} className="text-sm">{deliverable}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Examples */}
      {challenge.examples.length > 0 && (
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Examples</h3>
          {challenge.examples.map((example, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <h4 className="font-medium mb-2">Example {index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">Input:</span>
                  <div className="bg-gray-50 p-2 rounded font-mono text-sm whitespace-pre">{example.input}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Output:</span>
                  <div className="bg-gray-50 p-2 rounded font-mono text-sm whitespace-pre">{example.output}</div>
                </div>
              </div>
              {example.explanation && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Explanation:</span>
                  <div className="bg-blue-50 p-2 rounded text-sm">{example.explanation}</div>
                </div>
              )}
            </div>
          ))}
        </Card>
      )}

      {/* Test Cases */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Test Cases ({challenge.testCases.length})</h3>
        <div className="space-y-4">
          {challenge.testCases.map((testCase, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Test Case {index + 1}</span>
                <div className="flex gap-2">
                  {testCase.isHidden && (
                    <Badge variant="secondary" className="text-xs">Hidden</Badge>
                  )}
                  <Badge variant="outline" className="text-xs">{testCase.points} points</Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Input:</span>
                  <div className="bg-gray-50 p-2 rounded font-mono text-sm whitespace-pre max-h-32 overflow-y-auto">
                    {testCase.input}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Expected Output:</span>
                  <div className="bg-gray-50 p-2 rounded font-mono text-sm whitespace-pre max-h-32 overflow-y-auto">
                    {testCase.expectedOutput}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Hints */}
      {challenge.hints.length > 0 && (
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Hints</h3>
          {challenge.hints.map((hint, index) => (
            <div key={index} className="border rounded-lg p-4 mb-3 last:mb-0">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Hint {index + 1}</span>
                <Badge variant="outline" className="text-xs">
                  -{hint.pointsDeduction} points
                </Badge>
              </div>
              <div className="text-sm">{hint.content}</div>
            </div>
          ))}
        </Card>
      )}

      {/* Allowed Languages */}
      {challenge.allowedLanguages.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Allowed Languages</h3>
          <div className="flex flex-wrap gap-2">
            {challenge.allowedLanguages.map((lang, index) => (
              <Badge key={index} variant="outline">
                {lang.languageName} (ID: {lang.languageId})
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ChallengeView;

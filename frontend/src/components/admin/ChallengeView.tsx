import React from 'react';
import { Button } from '../ui/button';
import type { Challenge } from './types';

interface ChallengeViewProps {
  challenge: Challenge;
  onEdit: () => void;
  onClose: () => void;
}

const ChallengeView: React.FC<ChallengeViewProps> = ({ challenge, onEdit, onClose }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Expert': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
            <h1 className="text-2xl font-bold text-gray-900">
              {challenge.title}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium border ${
              challenge.isActive 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}>
              {challenge.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-gray-600">{challenge.description}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={onEdit} 
            variant="outline"
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            Edit Challenge
          </Button>
          <Button 
            onClick={onClose} 
            variant="outline"
            className="text-gray-600 border-gray-200 hover:bg-gray-50"
          >
            Close
          </Button>
        </div>
      </div>

      {/* Challenge Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
          <h3 className="font-semibold text-lg text-gray-900 mb-4">
            Basic Info
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium text-gray-900">{challenge.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Points:</span>
              <span className="font-medium text-gray-900">{challenge.points}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time Limit:</span>
              <span className="font-medium text-gray-900">{challenge.timeLimit}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Memory Limit:</span>
              <span className="font-medium text-gray-900">{challenge.memoryLimit / 1000}MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Flag:</span>
              <span className="font-medium text-gray-900 font-mono">{challenge.flag}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
          <h3 className="font-semibold text-lg text-gray-900 mb-4">
            Statistics
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Submissions:</span>
              <span className="font-medium text-gray-900">{challenge.submissionCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Solved:</span>
              <span className="font-medium text-gray-900">{challenge.solvedCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Success Rate:</span>
              <span className="font-medium text-gray-900">{getSuccessRate()}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Test Cases:</span>
              <span className="font-medium text-gray-900">{challenge.testCases.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
          <h3 className="font-semibold text-lg text-gray-900 mb-4">
            Timeline
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Created:</span>
              <span className="font-medium text-gray-900">{new Date(challenge.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Updated:</span>
              <span className="font-medium text-gray-900">{new Date(challenge.updatedAt).toLocaleDateString()}</span>
            </div>
            {challenge.startTime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Start:</span>
                <span className="font-medium text-gray-900">{new Date(challenge.startTime).toLocaleString()}</span>
              </div>
            )}
            {challenge.endTime && (
              <div className="flex justify-between">
                <span className="text-gray-600">End:</span>
                <span className="font-medium text-gray-900">{new Date(challenge.endTime).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      {challenge.tags.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6 mb-6">
          <h3 className="font-semibold text-lg text-gray-900 mb-4">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {challenge.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Problem Statement */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Algorithmic Problem Statement
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Description</h4>
            <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap border border-gray-200">
              {challenge.problemStatement}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Input Format</h4>
              <div className="bg-blue-50 p-4 rounded-lg whitespace-pre-wrap border border-blue-200">
                {challenge.inputFormat}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Output Format</h4>
              <div className="bg-green-50 p-4 rounded-lg whitespace-pre-wrap border border-green-200">
                {challenge.outputFormat}
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Constraints</h4>
            <div className="bg-yellow-50 p-4 rounded-lg whitespace-pre-wrap border border-yellow-200">
              {challenge.constraints}
            </div>
          </div>
        </div>
      </div>

      {/* Buildathon Problem */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Buildathon Problem (Revealed after flag submission)
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Description</h4>
            <div className="bg-purple-50 p-4 rounded-lg whitespace-pre-wrap border border-purple-200">
              {challenge.buildathonProblem.description}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Requirements</h4>
            <div className="bg-purple-50 p-4 rounded-lg whitespace-pre-wrap border border-purple-200">
              {challenge.buildathonProblem.requirements}
            </div>
          </div>

          {challenge.buildathonProblem.deliverables.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Deliverables</h4>
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <ul className="list-disc list-inside space-y-1">
                  {challenge.buildathonProblem.deliverables.map((deliverable, index) => (
                    <li key={index} className="text-sm">{deliverable}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Examples */}
      {challenge.examples.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Examples
          </h3>
          {challenge.examples.map((example, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <h4 className="font-medium text-gray-800 mb-3">Example {index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Input:</span>
                  <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm whitespace-pre border border-gray-200">
                    {example.input}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Output:</span>
                  <div className="bg-green-50 p-3 rounded-lg font-mono text-sm whitespace-pre border border-green-200">
                    {example.output}
                  </div>
                </div>
              </div>
              {example.explanation && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Explanation:</span>
                  <div className="bg-blue-50 p-3 rounded-lg text-sm border border-blue-200">
                    {example.explanation}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Test Cases */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Test Cases ({challenge.testCases.length})
        </h3>
        <div className="space-y-4">
          {challenge.testCases.map((testCase, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-gray-800">Test Case {index + 1}</span>
                <div className="flex gap-2">
                  {testCase.isHidden && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Hidden</span>
                  )}
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                    {testCase.points} points
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Input:</span>
                  <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm whitespace-pre max-h-32 overflow-y-auto border border-gray-200 mt-1">
                    {testCase.input}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Expected Output:</span>
                  <div className="bg-green-50 p-3 rounded-lg font-mono text-sm whitespace-pre max-h-32 overflow-y-auto border border-green-200 mt-1">
                    {testCase.expectedOutput}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hints */}
      {challenge.hints.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hints
          </h3>
          {challenge.hints.map((hint, index) => (
            <div key={index} className="border border-yellow-200 rounded-lg p-4 mb-3 last:mb-0 bg-yellow-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-800">Hint {index + 1}</span>
                <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                  -{hint.pointsDeduction} points
                </span>
              </div>
              <div className="text-sm text-gray-700">{hint.content}</div>
            </div>
          ))}
        </div>
      )}

      {/* Allowed Languages */}
      {challenge.allowedLanguages.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Allowed Languages
          </h3>
          <div className="flex flex-wrap gap-2">
            {challenge.allowedLanguages.map((lang, index) => (
              <span key={index} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                {lang.languageName} (ID: {lang.languageId})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeView;

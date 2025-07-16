import React, { useState, useEffect } from 'react';
import type { Team, Submission } from './team-types';
import { teamAPI } from './team-api';
import { Badge } from '../ui/badge';

interface TeamViewProps {
  team: Team;
  onEdit: (team: Team) => void;
  onClose: () => void;
}

export const TeamView: React.FC<TeamViewProps> = ({ team, onEdit, onClose }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, [team._id, currentPage]);

  const fetchSubmissions = async () => {
    try {
      setSubmissionsLoading(true);
      const response = await teamAPI.getTeamSubmissions(team._id, currentPage, 20);
      setSubmissions(response.submissions);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const getStatusColor = (status: { id: number; description: string }) => {
    switch (status.id) {
      case 3: return 'bg-green-100 text-green-800'; // Accepted
      case 4: return 'bg-red-100 text-red-800'; // Wrong Answer
      case 5: return 'bg-red-100 text-red-800'; // Time Limit Exceeded
      case 6: return 'bg-orange-100 text-orange-800'; // Compilation Error
      case 7: return 'bg-red-100 text-red-800'; // Runtime Error
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSubmissions = submissions.filter(submission =>
    submission.challengeId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.languageName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50">
        <div className="px-6 py-4 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {team.teamName}
              </h1>
              <Badge variant={team.isActive ? "default" : "secondary"} className={team.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {team.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(team)}
                className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 border border-purple-200 hover:border-purple-300 rounded-lg transition-all duration-200 hover:bg-purple-50"
              >
                Edit Team
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-300 hover:border-gray-400 rounded-lg transition-all duration-200 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Team Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Email:</span> {team.email}</p>
                <p><span className="font-medium">Created:</span> {new Date(team.createdAt).toLocaleDateString()}</p>
                <p><span className="font-medium">Status:</span> {team.isActive ? 'Active' : 'Inactive'}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Statistics</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Total Submissions:</span> <span className="text-blue-600 font-semibold">{team.totalSubmissions || 0}</span></p>
                <p><span className="font-medium">Solved Challenges:</span> <span className="text-green-600 font-semibold">{team.solvedChallenges || 0}</span></p>
                <p><span className="font-medium">Points:</span> <span className="text-purple-600 font-semibold">{team.points || 0}</span></p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Team Members ({team.members.length})</h3>
            {team.members.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team.members.map((member, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No team members added</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50">
        <div className="px-6 py-4 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Submission History
            </h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-64"
              />
            </div>
          </div>
        </div>
        <div className="p-6">
          {submissionsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {searchTerm ? 'No submissions found matching your search.' : 'No submissions yet.'}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
                <div key={submission._id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{submission.challengeId.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getDifficultyColor(submission.challengeId.difficulty)}>
                          {submission.challengeId.difficulty}
                        </Badge>
                        <span className="text-sm text-gray-500">{submission.languageName}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status.description}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">
                        Score: {submission.score}/100
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Time:</span> {submission.time || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Memory:</span> {submission.memory ? `${(submission.memory / 1024).toFixed(2)} MB` : 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Test Cases:</span> {submission.testCases?.length || 0}
                    </div>
                    <div>
                      <span className="font-medium">Submitted:</span> {new Date(submission.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {submission.testCases && submission.testCases.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-sm font-medium mb-2">Test Cases:</p>
                      <div className="flex flex-wrap gap-2">
                        {submission.testCases.map((testCase, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded text-xs ${
                              testCase.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            Test {index + 1}: {testCase.passed ? 'Passed' : 'Failed'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-300 hover:border-gray-400 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-300 hover:border-gray-400 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

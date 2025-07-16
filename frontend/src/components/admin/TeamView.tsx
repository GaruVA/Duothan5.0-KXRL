import React, { useState, useEffect } from 'react';
import type { Team, Submission } from './team-types';
import { teamAPI } from './team-api';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';

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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-3">
              {team.teamName}
              <Badge variant={team.isActive ? "default" : "secondary"}>
                {team.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onEdit(team)}>
                Edit Team
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Team Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Email:</span> {team.email}</p>
                <p><span className="font-medium">Created:</span> {new Date(team.createdAt).toLocaleDateString()}</p>
                <p><span className="font-medium">Status:</span> {team.isActive ? 'Active' : 'Inactive'}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Statistics</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Total Submissions:</span> {team.totalSubmissions || 0}</p>
                <p><span className="font-medium">Solved Challenges:</span> {team.solvedChallenges || 0}</p>
                <p><span className="font-medium">Points:</span> {team.points || 0}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-3">Team Members ({team.members.length})</h3>
            {team.members.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team.members.map((member, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No team members added</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Submission History</CardTitle>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                <div key={submission._id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{submission.challengeId.title}</h4>
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
                    <div className="mt-3 pt-3 border-t">
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

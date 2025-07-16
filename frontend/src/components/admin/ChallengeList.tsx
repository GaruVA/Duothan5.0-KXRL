import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import type { ChallengeListItem } from './types';

interface ChallengeListProps {
  onEdit: (challenge: ChallengeListItem) => void;
  onDelete: (challengeId: string) => void;
  onView: (challenge: ChallengeListItem) => void;
}

const ChallengeList: React.FC<ChallengeListProps> = ({ onEdit, onDelete, onView }) => {
  const [challenges, setChallenges] = useState<ChallengeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalChallenges, setTotalChallenges] = useState(0);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(difficultyFilter && { difficulty: difficultyFilter }),
        ...(categoryFilter && { category: categoryFilter })
      });

      const response = await fetch(`${API_BASE_URL}/admin/challenges?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch challenges');
      }

      const data = await response.json();
      setChallenges(data.challenges || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalChallenges(data.pagination?.totalChallenges || 0);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [currentPage, searchTerm, difficultyFilter, categoryFilter]);

  const handleDelete = async (challengeId: string) => {
    if (window.confirm('Are you sure you want to delete this challenge? This action cannot be undone.')) {
      onDelete(challengeId);
      // Refresh the list after deletion
      fetchChallenges();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Expert': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSuccessRate = (challenge: ChallengeListItem) => {
    if (challenge.submissionCount === 0) return 0;
    return Math.round((challenge.solvedCount / challenge.submissionCount) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Search challenges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <Select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Expert">Expert</option>
            </Select>
          </div>
          <div>
            <Input
              placeholder="Filter by category..."
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <span className="text-sm text-gray-600 self-center font-medium">
              {totalChallenges} challenge(s) found
            </span>
          </div>
        </div>
      </div>

      {/* Challenge List */}
      <div className="space-y-4">
        {challenges.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges found</h3>
            <p className="text-gray-500">Create your first challenge to get started!</p>
          </div>
        ) : (
          challenges.map((challenge) => (
            <div key={challenge._id} className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {challenge.title}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      challenge.isActive 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      {challenge.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{challenge.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                      {challenge.category}
                    </span>
                    {challenge.tags.slice(0, 3).map((tag: string, index: number) => (
                      <span key={index} className="text-sm bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                    {challenge.tags.length > 3 && (
                      <span className="text-sm text-gray-500 px-2.5 py-0.5">+{challenge.tags.length - 3} more</span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Points:</span>
                      <div className="font-medium text-gray-900">{challenge.points}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Submissions:</span>
                      <div className="font-medium text-gray-900">{challenge.submissionCount}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Solved:</span>
                      <div className="font-medium text-gray-900">{challenge.solvedCount}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Success Rate:</span>
                      <div className="font-medium text-gray-900">{getSuccessRate(challenge)}%</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Created: {new Date(challenge.createdAt).toLocaleDateString()}
                    {challenge.updatedAt !== challenge.createdAt && (
                      <span> • Updated: {new Date(challenge.updatedAt).toLocaleDateString()}</span>
                    )}
                    {challenge.authorId && (
                      <span> • By: {challenge.authorId.name || challenge.authorId.email || 'Unknown'}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-6">
                  <Button
                    onClick={() => onView(challenge)}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => onEdit(challenge)}
                    variant="outline"
                    size="sm"
                    className="text-gray-600 border-gray-200 hover:bg-gray-50"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(challenge._id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="hover:bg-gray-50 border-gray-200"
          >
            Previous
          </Button>
          
          <span className="text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200/50">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="hover:bg-gray-50 border-gray-200"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChallengeList;

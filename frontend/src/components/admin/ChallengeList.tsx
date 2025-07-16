import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Badge } from '../ui/badge';
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
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSuccessRate = (challenge: ChallengeListItem) => {
    if (challenge.submissionCount === 0) return 0;
    return Math.round((challenge.solvedCount / challenge.submissionCount) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Search challenges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
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
            />
          </div>
          <div className="flex justify-end">
            <span className="text-sm text-gray-600 self-center">
              {totalChallenges} challenge(s) found
            </span>
          </div>
        </div>
      </Card>

      {/* Challenge List */}
      <div className="space-y-4">
        {challenges.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No challenges found. Create your first challenge!</p>
          </Card>
        ) : (
          challenges.map((challenge) => (
            <Card key={challenge._id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{challenge.title}</h3>
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                    <Badge variant={challenge.isActive ? "default" : "secondary"}>
                      {challenge.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">{challenge.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {challenge.category}
                    </span>
                    {challenge.tags.slice(0, 3).map((tag: string, index: number) => (
                      <span key={index} className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                    {challenge.tags.length > 3 && (
                      <span className="text-sm text-gray-500">+{challenge.tags.length - 3} more</span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Points:</span> {challenge.points}
                    </div>
                    <div>
                      <span className="font-medium">Submissions:</span> {challenge.submissionCount}
                    </div>
                    <div>
                      <span className="font-medium">Solved:</span> {challenge.solvedCount}
                    </div>
                    <div>
                      <span className="font-medium">Success Rate:</span> {getSuccessRate(challenge)}%
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Created: {new Date(challenge.createdAt).toLocaleDateString()}
                    {challenge.updatedAt !== challenge.createdAt && (
                      <span> • Updated: {new Date(challenge.updatedAt).toLocaleDateString()}</span>
                    )}
                    {challenge.authorId && (
                      <span> • By: {challenge.authorId.name || challenge.authorId.email || 'Unknown'}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    onClick={() => onView(challenge)}
                    variant="outline"
                    size="sm"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => onEdit(challenge)}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(challenge._id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChallengeList;

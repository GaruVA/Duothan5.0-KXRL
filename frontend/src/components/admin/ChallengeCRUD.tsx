import React, { useState } from 'react';
import { Button } from '../ui/button';
import ChallengeForm from './ChallengeForm';
import ChallengeList from './ChallengeList';
import ChallengeView from './ChallengeView';
import type { Challenge, ChallengeListItem } from './types';

type ViewMode = 'list' | 'create' | 'edit' | 'view';

const ChallengeCRUD: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const showMessage = (message: string, isError = false) => {
    if (isError) {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(''), 5000);
    } else {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  const handleCreateChallenge = async (formData: any) => {
    setIsLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/admin/challenges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create challenge');
      }

      await response.json();
      showMessage('Challenge created successfully!');
      setViewMode('list');
    } catch (error) {
      console.error('Error creating challenge:', error);
      showMessage(error instanceof Error ? error.message : 'Failed to create challenge', true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateChallenge = async (formData: any) => {
    if (!selectedChallenge) return;

    setIsLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/admin/challenges/${selectedChallenge._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update challenge');
      }

      await response.json();
      showMessage('Challenge updated successfully!');
      setViewMode('list');
      setSelectedChallenge(null);
    } catch (error) {
      console.error('Error updating challenge:', error);
      showMessage(error instanceof Error ? error.message : 'Failed to update challenge', true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChallenge = async (challengeId: string) => {
    setIsLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/admin/challenges/${challengeId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete challenge');
      }

      showMessage('Challenge deleted successfully!');
    } catch (error) {
      console.error('Error deleting challenge:', error);
      showMessage(error instanceof Error ? error.message : 'Failed to delete challenge', true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewChallenge = async (challenge: ChallengeListItem) => {
    // If we need full details, fetch them
    try {
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/admin/challenges/${challenge._id}`);
      if (response.ok) {
        const fullChallenge = await response.json();
        setSelectedChallenge(fullChallenge.challenge);
      } else {
        // Create a minimal challenge object for viewing
        setSelectedChallenge({
          ...challenge,
          problemStatement: '',
          inputFormat: '',
          outputFormat: '',
          constraints: '',
          examples: [],
          testCases: [],
          timeLimit: 2,
          memoryLimit: 128000,
          allowedLanguages: [],
          hints: [],
          flag: '',
          buildathonProblem: {
            description: '',
            requirements: '',
            deliverables: []
          }
        });
      }
      setViewMode('view');
    } catch (error) {
      console.error('Error fetching challenge details:', error);
      // Create a minimal challenge object for viewing
      setSelectedChallenge({
        ...challenge,
        problemStatement: '',
        inputFormat: '',
        outputFormat: '',
        constraints: '',
        examples: [],
        testCases: [],
        timeLimit: 2,
        memoryLimit: 128000,
        allowedLanguages: [],
        hints: [],
        flag: '',
        buildathonProblem: {
          description: '',
          requirements: '',
          deliverables: []
        }
      });
      setViewMode('view');
    }
  };

  const handleEditChallenge = async (challenge: ChallengeListItem) => {
    // Fetch full challenge details for editing
    try {
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/admin/challenges/${challenge._id}`);
      if (response.ok) {
        const fullChallenge = await response.json();
        setSelectedChallenge(fullChallenge.challenge);
      } else {
        // Create a minimal challenge object for editing
        setSelectedChallenge({
          ...challenge,
          problemStatement: '',
          inputFormat: '',
          outputFormat: '',
          constraints: '',
          examples: [],
          testCases: [],
          timeLimit: 2,
          memoryLimit: 128000,
          allowedLanguages: [],
          hints: [],
          flag: '',
          buildathonProblem: {
            description: '',
            requirements: '',
            deliverables: []
          }
        });
      }
      setViewMode('edit');
    } catch (error) {
      console.error('Error fetching challenge details:', error);
      // Create a minimal challenge object for editing
      setSelectedChallenge({
        ...challenge,
        problemStatement: '',
        inputFormat: '',
        outputFormat: '',
        constraints: '',
        examples: [],
        testCases: [],
        timeLimit: 2,
        memoryLimit: 128000,
        allowedLanguages: [],
        hints: [],
        flag: '',
        buildathonProblem: {
          description: '',
          requirements: '',
          deliverables: []
        }
      });
      setViewMode('edit');
    }
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedChallenge(null);
  };

  return (
    <div className="space-y-6">
      {/* Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      {/* Header */}
      {viewMode === 'list' && (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Challenge Management</h2>
            <p className="text-gray-600">Create, edit, and manage OASIS challenges</p>
          </div>
          <Button onClick={() => setViewMode('create')}>
            Create New Challenge
          </Button>
        </div>
      )}

      {viewMode === 'create' && (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Challenge</h2>
            <p className="text-gray-600">Add a new OASIS challenge to the platform</p>
          </div>
        </div>
      )}

      {viewMode === 'edit' && selectedChallenge && (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Challenge</h2>
            <p className="text-gray-600">Modify "{selectedChallenge.title}"</p>
          </div>
        </div>
      )}

      {viewMode === 'view' && selectedChallenge && (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">View Challenge</h2>
            <p className="text-gray-600">Challenge details and information</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div>
        {viewMode === 'list' && (
          <ChallengeList
            onEdit={handleEditChallenge}
            onDelete={handleDeleteChallenge}
            onView={handleViewChallenge}
          />
        )}

        {viewMode === 'create' && (
          <ChallengeForm
            onSubmit={handleCreateChallenge}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        )}

        {viewMode === 'edit' && selectedChallenge && (
          <ChallengeForm
            onSubmit={handleUpdateChallenge}
            onCancel={handleCancel}
            initialData={{
              ...selectedChallenge,
              startTime: selectedChallenge.startTime ? 
                new Date(selectedChallenge.startTime).toISOString().slice(0, 16) : '',
              endTime: selectedChallenge.endTime ? 
                new Date(selectedChallenge.endTime).toISOString().slice(0, 16) : ''
            }}
            isLoading={isLoading}
          />
        )}

        {viewMode === 'view' && selectedChallenge && (
          <ChallengeView
            challenge={selectedChallenge}
            onEdit={() => setViewMode('edit')}
            onClose={handleCancel}
          />
        )}
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
            <span>Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeCRUD;

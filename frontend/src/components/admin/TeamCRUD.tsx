import React, { useState, useEffect } from 'react';
import type { Team, TeamFilters } from './team-types';
import { teamAPI } from './team-api';
import { TeamList } from './TeamList';
import { TeamForm } from './TeamForm';
import { TeamView } from './TeamView';
import { Button } from '../ui/button';

type ViewMode = 'list' | 'create' | 'edit' | 'view';

export const TeamCRUD: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<TeamFilters>({
    search: '',
    isActive: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  useEffect(() => {
    fetchTeams();
  }, [currentPage, filters]);

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const response = await teamAPI.getTeams(currentPage, 10, filters);
      setTeams(response.teams);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedTeam(null);
    setViewMode('create');
  };

  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    setViewMode('edit');
  };

  const handleView = (team: Team) => {
    setSelectedTeam(team);
    setViewMode('view');
  };

  const handleDelete = async (team: Team) => {
    if (window.confirm(`Are you sure you want to delete team "${team.teamName}"? This action cannot be undone and will delete all related submissions.`)) {
      try {
        await teamAPI.deleteTeam(team._id);
        await fetchTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
        alert('Failed to delete team. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (team: Team) => {
    try {
      await teamAPI.toggleTeamStatus(team._id);
      await fetchTeams();
    } catch (error) {
      console.error('Error toggling team status:', error);
      alert('Failed to toggle team status. Please try again.');
    }
  };

  const handleSubmit = async (teamData: Omit<Team, '_id' | 'createdAt'>) => {
    try {
      if (selectedTeam) {
        await teamAPI.updateTeam(selectedTeam._id, teamData);
      } else {
        await teamAPI.createTeam(teamData);
      }
      await fetchTeams();
      setViewMode('list');
      setSelectedTeam(null);
    } catch (error) {
      console.error('Error saving team:', error);
      alert('Failed to save team. Please try again.');
    }
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedTeam(null);
  };

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof TeamFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (viewMode === 'view' && selectedTeam) {
    return (
      <TeamView
        team={selectedTeam}
        onEdit={handleEdit}
        onClose={handleCancel}
      />
    );
  }

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <TeamForm
        team={selectedTeam || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50">
        <div className="px-6 py-5 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Teams ({totalItems})
              </h2>
              <p className="text-sm text-gray-500 mt-1">Manage and monitor all registered teams</p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Create New Team
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search teams..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <select
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full sm:w-48"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <TeamList
            teams={teams}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            isLoading={isLoading}
          />

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

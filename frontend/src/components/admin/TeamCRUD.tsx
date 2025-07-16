import React, { useState, useEffect } from 'react';
import type { Team, TeamFilters } from './team-types';
import { teamAPI } from './team-api';
import { TeamList } from './TeamList';
import { TeamForm } from './TeamForm';
import { TeamView } from './TeamView';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Teams ({totalItems})</CardTitle>
            <Button onClick={handleCreate}>
              Create New Team
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search teams..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <Select
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              className="w-full sm:w-48"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Select>
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
        </CardContent>
      </Card>
    </div>
  );
};

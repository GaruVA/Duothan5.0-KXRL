import type { Team, TeamsResponse, SubmissionsResponse, TeamFilters } from './team-types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const teamAPI = {
  // Get all teams with pagination and filters
  getTeams: async (
    page: number = 1,
    limit: number = 10,
    filters: Partial<TeamFilters> = {}
  ): Promise<TeamsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters.search && { search: filters.search }),
      ...(filters.isActive && { isActive: filters.isActive }),
    });

    const response = await fetch(`${API_BASE_URL}/api/admin/teams?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch teams');
    }

    return response.json();
  },

  // Get single team by ID
  getTeam: async (id: string): Promise<Team> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/teams/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch team');
    }

    return response.json();
  },

  // Create new team
  createTeam: async (teamData: Omit<Team, '_id' | 'createdAt'>): Promise<Team> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/teams`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create team');
    }

    const result = await response.json();
    return result.team;
  },

  // Update team
  updateTeam: async (id: string, teamData: Partial<Team>): Promise<Team> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/teams/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update team');
    }

    const result = await response.json();
    return result.team;
  },

  // Delete team
  deleteTeam: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/teams/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete team');
    }
  },

  // Toggle team status
  toggleTeamStatus: async (id: string): Promise<Team> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/teams/${id}/toggle-status`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to toggle team status');
    }

    const result = await response.json();
    return result.team;
  },

  // Get team submissions
  getTeamSubmissions: async (
    teamId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<SubmissionsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/api/admin/teams/${teamId}/submissions?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch team submissions');
    }

    return response.json();
  },
};

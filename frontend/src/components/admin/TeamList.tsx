import React from 'react';
import type { Team } from './team-types';
import { Badge } from '../ui/badge';

interface TeamListProps {
  teams: Team[];
  onView: (team: Team) => void;
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void;
  onToggleStatus: (team: Team) => void;
  isLoading?: boolean;
}

export const TeamList: React.FC<TeamListProps> = ({
  teams,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white/60 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/50 p-6">
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50">
        <div className="p-12 text-center">
          <p className="text-gray-500 mb-4 text-lg">No teams found</p>
          <p className="text-sm text-gray-400">
            Try adjusting your search criteria or create a new team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {teams.map((team) => (
        <div key={team._id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {team.teamName}
                  </h3>
                  <Badge variant={team.isActive ? "default" : "secondary"} className={team.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {team.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {team.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Members:</span> {team.members.length}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Created:</span>{' '}
                    {new Date(team.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {team.members.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Team Members:</p>
                    <div className="flex flex-wrap gap-2">
                      {team.members.map((member, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-3 py-1 rounded-full text-xs border border-blue-200"
                        >
                          {member.name} ({member.email})
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(team.totalSubmissions !== undefined || team.solvedChallenges !== undefined) && (
                  <div className="flex gap-6 mb-4">
                    <div className="text-sm">
                      <span className="font-medium">Total Submissions:</span>{' '}
                      <span className="text-blue-600 font-semibold">{team.totalSubmissions || 0}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Solved Challenges:</span>{' '}
                      <span className="text-green-600 font-semibold">{team.solvedChallenges || 0}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Points:</span>{' '}
                      <span className="text-purple-600 font-semibold">{team.points || 0}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onView(team)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded-lg transition-all duration-200 hover:bg-blue-50"
                >
                  View
                </button>
                <button
                  onClick={() => onEdit(team)}
                  className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 border border-purple-200 hover:border-purple-300 rounded-lg transition-all duration-200 hover:bg-purple-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => onToggleStatus(team)}
                  className={`px-4 py-2 text-sm font-medium border rounded-lg transition-all duration-200 ${
                    team.isActive 
                      ? 'text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50' 
                      : 'text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  {team.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => onDelete(team)}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg transition-all duration-200 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

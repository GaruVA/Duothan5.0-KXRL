import React from 'react';
import type { Team } from './team-types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

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
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500 mb-4">No teams found</p>
          <p className="text-sm text-gray-400">
            Try adjusting your search criteria or create a new team.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {teams.map((team) => (
        <Card key={team._id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{team.teamName}</h3>
                  <Badge variant={team.isActive ? "default" : "secondary"}>
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
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
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
                      <span className="text-blue-600">{team.totalSubmissions || 0}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Solved Challenges:</span>{' '}
                      <span className="text-green-600">{team.solvedChallenges || 0}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Points:</span>{' '}
                      <span className="text-purple-600">{team.points || 0}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(team)}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(team)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleStatus(team)}
                  className={team.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                >
                  {team.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(team)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

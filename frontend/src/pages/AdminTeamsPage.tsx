import React from 'react';
import { TeamCRUD } from '../components/admin/TeamCRUD';

export const AdminTeamsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
          <p className="text-gray-600">
            Manage teams, view submission history, and monitor team performance.
          </p>
        </div>

        <TeamCRUD />
      </div>
    </div>
  );
};

export default AdminTeamsPage;

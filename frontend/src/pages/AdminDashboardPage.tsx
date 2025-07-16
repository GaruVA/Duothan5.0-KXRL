import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-red-600 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Administrative Control Panel</p>
              </div>
            </div>
            <Link
              to="/admin/login"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8 text-center">
            <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M9 7h6m-6 4h6m-6 4h6m-6 4h6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Admin Dashboard
            </h3>
            <p className="text-gray-500 mb-4">
              This is a placeholder for the admin dashboard. Here you would manage teams, challenges, and monitor the platform.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-medium text-gray-900 mb-2">Team Management</h4>
                <p className="text-sm text-gray-600">View and manage registered teams</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-medium text-gray-900 mb-2">Challenge Management</h4>
                <p className="text-sm text-gray-600">Create and manage algorithmic challenges</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-medium text-gray-900 mb-2">Platform Analytics</h4>
                <p className="text-sm text-gray-600">Monitor platform usage and performance</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;

import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Welcome to <span className="text-indigo-300">OASIS</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Algorithmic Challenge Platform
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Test your programming skills, compete with teams, and solve challenging algorithmic problems in a secure, authenticated environment.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Team Login
          </Link>
          <Link
            to="/register"
            className="bg-transparent hover:bg-white/10 text-white font-bold py-3 px-8 rounded-lg text-lg border-2 border-white/20 transition-colors"
          >
            Register Team
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-indigo-300 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure Authentication</h3>
            <p className="text-gray-300">Team-based authentication with unique registration and secure session management.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-indigo-300 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Algorithmic Challenges</h3>
            <p className="text-gray-300">Access to diverse programming challenges only after successful team authentication.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-indigo-300 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Team Collaboration</h3>
            <p className="text-gray-300">Register multiple team members and collaborate on solving complex problems.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

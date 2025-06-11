import React from 'react';
import { User, Calendar, MessageCircle, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';

const ProfileDashboard: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'consultant':
        return <Award className="h-6 w-6 text-purple-600" />;
      case 'resident':
        return <MessageCircle className="h-6 w-6 text-green-600" />;
      default:
        return <User className="h-6 w-6 text-blue-600" />;
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'consultant':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'resident':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                {getUserTypeIcon(currentUser.userType)}
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{currentUser.displayName}</h1>
                <p className="text-blue-100">{currentUser.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Basic Information
                </h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">User Type</span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getUserTypeColor(currentUser.userType)}`}>
                      {currentUser.userType.charAt(0).toUpperCase() + currentUser.userType.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Email</span>
                    <span className="text-sm text-gray-900">{currentUser.email}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Member Since</span>
                    <span className="text-sm text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(currentUser.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Activity Stats */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Activity Statistics
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-blue-800">Messages Sent</div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-green-800">Rooms Joined</div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-sm text-purple-800">Helped Users</div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">0</div>
                    <div className="text-sm text-orange-800">Active Days</div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Type Specific Information */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {currentUser.userType === 'consultant' ? 'Consultant Information' : 
                 currentUser.userType === 'resident' ? 'Resident Information' : 'User Information'}
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                {currentUser.userType === 'consultant' && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      As an AskAbroad consultant, you have the privilege to guide students and professionals 
                      in their international journey. Your expertise helps shape dreams into reality.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">Verified Consultant</span>
                    </div>
                  </div>
                )}
                
                {currentUser.userType === 'resident' && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      As a resident abroad, your real-world experience is invaluable to those considering 
                      a similar path. Share your insights and help others make informed decisions.
                    </p>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Community Resident</span>
                    </div>
                  </div>
                )}
                
                {currentUser.userType === 'user' && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Welcome to AskAbroad! Connect with consultants and residents to get personalized 
                      guidance for your international education, work, or immigration goals.
                    </p>
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Community Member</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => window.location.href = '/countries'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Browse Countries
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                  Edit Profile
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                  Account Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
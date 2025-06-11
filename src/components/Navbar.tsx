import React, { useState } from 'react';
import { LogOut, User, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LogoutModal from './LogoutModal';

const Navbar: React.FC = () => {
  const { currentUser } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!currentUser) return null;

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'consultant':
        return 'bg-purple-100 text-purple-800';
      case 'resident':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AskAbroad</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {currentUser.displayName}
                  </span>
                </div>
                
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUserTypeColor(currentUser.userType)}`}>
                  {currentUser.userType.charAt(0).toUpperCase() + currentUser.userType.slice(1)}
                </span>
              </div>
              
              <button
                onClick={() => setShowLogoutModal(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
};

export default Navbar;
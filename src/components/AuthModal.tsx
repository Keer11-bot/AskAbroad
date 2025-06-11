import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, User, UserCheck, Users, UserX, Phone, MessageCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'user' | 'consultant' | 'resident' | 'guest'>('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    mobileNumber: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const { login, signup, loginWithGoogle, loginAsGuest } = useAuth();

  useEffect(() => {
    // Initialize Google One Tap
    if (isOpen && window.google) {
      window.google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID", // Replace with your actual Google Client ID
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: false,
      });
    }
  }, [isOpen]);

  const handleGoogleResponse = async (response: any) => {
    try {
      setLoading(true);
      // The response contains the JWT token from Google
      // You would typically verify this token on your backend
      // For now, we'll use the popup method instead
      await loginWithGoogle();
      onClose();
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (userType === 'guest') {
        if (!formData.displayName.trim()) {
          throw new Error('Please enter your name');
        }
        await loginAsGuest(formData.displayName.trim());
      } else if (isLogin) {
        await login(formData.email, formData.password, userType === 'consultant' ? 'consultant' : 'user');
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await signup(
          formData.email, 
          formData.password, 
          formData.displayName, 
          formData.mobileNumber,
          userType as 'user' | 'resident'
        );
      }
      onClose();
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      onClose();
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      displayName: '',
      mobileNumber: '',
      confirmPassword: ''
    });
    setUserType('user');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full border border-gray-200">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-lg blur-sm"></div>
                  <div className="relative bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {isLogin ? 'Welcome Back!' : 'Join AskAbroad'}
                  </h3>
                  <p className="text-blue-100 text-sm">
                    {isLogin ? 'Continue your journey' : 'Start your global journey'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-white/70 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="bg-white px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I am a:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType('user')}
                    className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all duration-200 ${
                      userType === 'user'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <User className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Student/Seeker</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setUserType('guest')}
                    className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all duration-200 ${
                      userType === 'guest'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <UserX className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Guest (5 msgs)</span>
                  </button>
                  
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setUserType('consultant')}
                      className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all duration-200 ${
                        userType === 'consultant'
                          ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <UserCheck className="h-6 w-6 mb-2" />
                      <span className="text-sm font-medium">Consultant</span>
                    </button>
                  )}
                  
                  {!isLogin && userType !== 'guest' && (
                    <button
                      type="button"
                      onClick={() => setUserType('resident')}
                      className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all duration-200 ${
                        userType === 'resident'
                          ? 'border-green-500 bg-green-50 text-green-700 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Users className="h-6 w-6 mb-2" />
                      <span className="text-sm font-medium">Resident</span>
                    </button>
                  )}
                </div>
                {userType === 'consultant' && isLogin && (
                  <p className="text-xs text-purple-600 mt-2 flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Use your provided consultant credentials
                  </p>
                )}
                {userType === 'guest' && (
                  <p className="text-xs text-orange-600 mt-2 flex items-center">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Browse as guest with 5 message limit
                  </p>
                )}
              </div>

              {/* Display Name */}
              {(!isLogin || userType === 'guest') && (
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    required
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              {/* Mobile Number - Only for signup and not guest */}
              {!isLogin && userType !== 'guest' && (
                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="mobileNumber"
                      required
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              )}

              {/* Email and Password (not for guest) */}
              {userType !== 'guest' && (
                <>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {!isLogin && (
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Confirm your password"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <MessageCircle className="h-5 w-5 mr-2" />
                )}
                {loading ? 'Please wait...' : 
                 userType === 'guest' ? 'Start Chatting as Guest' :
                 (isLogin ? 'Sign In & Chat' : 'Create Account & Chat')}
              </button>

              {/* Google Sign-in Button */}
              {userType !== 'guest' && (
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex justify-center items-center py-4 px-6 border-2 border-gray-200 rounded-xl shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {loading ? 'Please wait...' : 'Continue with Google'}
                </button>
              )}
            </form>

            {/* Switch Mode */}
            {userType !== 'guest' && (
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={switchMode}
                    className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition-colors duration-200"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
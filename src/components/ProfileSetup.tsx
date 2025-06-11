import React, { useState } from 'react';
import { User, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileSetupProps {
  onComplete: () => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || '',
    reasonForJoining: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.displayName.trim() || !formData.reasonForJoining.trim()) return;

    setLoading(true);
    try {
      await updateUserProfile({
        displayName: formData.displayName.trim(),
        reasonForJoining: formData.reasonForJoining.trim()
      });
      onComplete();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h1>
            <p className="text-blue-100">Help us personalize your AskAbroad experience</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="displayName"
                required
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter your full name"
              />
            </div>

            {/* Reason for Joining */}
            <div>
              <label htmlFor="reasonForJoining" className="block text-sm font-medium text-gray-700 mb-2">
                What brings you to AskAbroad? *
              </label>
              <textarea
                id="reasonForJoining"
                required
                rows={4}
                value={formData.reasonForJoining}
                onChange={(e) => setFormData({ ...formData, reasonForJoining: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
                placeholder="Tell us about your goals, interests, or what you're looking to achieve through AskAbroad. For example: 'I'm planning to study computer science in Canada and need guidance on university applications and student visa requirements.'"
              />
              <p className="text-xs text-gray-500 mt-1">
                Share your specific goals, interests, or what you hope to achieve. This helps us connect you with the right experts.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.displayName.trim() || !formData.reasonForJoining.trim()}
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <>
                  <span>Continue to AskAbroad</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
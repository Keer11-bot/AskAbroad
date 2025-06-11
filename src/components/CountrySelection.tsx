import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowRight, Star, Users } from 'lucide-react';
import { getCountriesByCategory } from '../data/countries';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';

interface CountrySelectionProps {
  category: 'study' | 'travel';
  onBack: () => void;
}

const CountrySelection: React.FC<CountrySelectionProps> = ({ category, onBack }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const countries = getCountriesByCategory(category);

  const handleCountrySelect = (countryCode: string) => {
    navigate(`/chat/${countryCode}/${category}`);
  };

  const getCategoryInfo = () => {
    if (category === 'study') {
      return {
        title: 'Study Abroad Destinations',
        subtitle: 'Choose your dream study destination',
        description: 'Connect with education consultants and current students to get insights about universities, applications, scholarships, and student life.',
        icon: '🎓'
      };
    } else {
      return {
        title: 'Travel Destinations',
        subtitle: 'Explore the world with confidence',
        description: 'Get travel guidance from local residents and travel experts about visa requirements, cultural tips, and must-visit places.',
        icon: '✈️'
      };
    }
  };

  const categoryInfo = getCategoryInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={onBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200"
          >
            <ArrowRight className="h-4 w-4 mr-2 transform rotate-180" />
            Back to Categories
          </button>
          
          <div className="text-4xl mb-4">{categoryInfo.icon}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {categoryInfo.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-2">
            {categoryInfo.subtitle}
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {categoryInfo.description}
          </p>
        </div>

        {/* Popular Countries */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Star className="h-6 w-6 text-yellow-500 mr-2" />
            Popular Destinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {countries.filter(country => country.popular).map((country) => (
              <div
                key={country.code}
                onClick={() => handleCountrySelect(country.code)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 p-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 group"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{country.flag}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {country.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {category === 'study' ? country.studyDescription : country.travelDescription}
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">Join Chat</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Countries */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Users className="h-6 w-6 text-blue-500 mr-2" />
            All Destinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {countries.filter(country => !country.popular).map((country) => (
              <div
                key={country.code}
                onClick={() => handleCountrySelect(country.code)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 p-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 group"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{country.flag}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {country.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {category === 'study' ? country.studyDescription : country.travelDescription}
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">Join Chat</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Don't see your destination?
            </h2>
            <p className="text-gray-600 mb-6">
              We're constantly expanding our network. Contact us to request support for additional countries.
            </p>
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105">
              Contact Support
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountrySelection;
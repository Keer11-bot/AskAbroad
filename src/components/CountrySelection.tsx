import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowRight, Star, Globe, Sparkles } from 'lucide-react';
import { getCountriesByCategory } from '../data/countries';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';

interface CountrySelectionProps {
  category: 'study' | 'travel';
  onBack: () => void;
}

const CountrySelection: React.FC<CountrySelectionProps> = ({ category, onBack }) => {
  const navigate = useNavigate();
  useAuth();
  const countries = getCountriesByCategory(category);

  const handleCountrySelect = (countryCode: string) => {
    navigate(`/chat/${countryCode}/${category}`);
  };

  const getCategoryInfo = () => {
    if (category === 'study') {
      return {
        title: 'Study Abroad Chat Rooms',
        subtitle: 'Choose your dream study destination',
        description: 'Join live chat rooms with education consultants and current students to get real-time insights about universities, applications, scholarships, and student life.',
        icon: '🎓',
        gradient: 'from-blue-500 via-blue-600 to-indigo-600'
      };
    } else {
      return {
        title: 'Travel Chat Rooms',
        subtitle: 'Explore the world with confidence',
        description: 'Connect with local residents and travel experts in real-time chat rooms for visa guidance, cultural tips, and must-visit recommendations.',
        icon: '✈️',
        gradient: 'from-green-500 via-emerald-600 to-teal-600'
      };
    }
  };

  const categoryInfo = getCategoryInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <Navbar />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <button
            onClick={onBack}
            className="group inline-flex items-center text-blue-300 hover:text-white mb-8 transition-all duration-200 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-white/20"
          >
            <ArrowRight className="h-5 w-5 mr-2 transform rotate-180 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Categories
          </button>
          
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${categoryInfo.gradient} rounded-full blur-lg opacity-50 animate-pulse`}></div>
              <div className={`relative bg-gradient-to-r ${categoryInfo.gradient} p-6 rounded-full text-6xl`}>
                {categoryInfo.icon}
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {categoryInfo.title}
          </h1>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto mb-4 leading-relaxed">
            {categoryInfo.subtitle}
          </p>
          <p className="text-blue-200 max-w-3xl mx-auto leading-relaxed">
            {categoryInfo.description}
          </p>
        </div>

        {/* Popular Countries */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Popular Chat Destinations</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {countries.filter(country => country.popular).map((country) => (
              <div
                key={country.code}
                onClick={() => handleCountrySelect(country.code)}
                className="group relative cursor-pointer"
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${categoryInfo.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
                
                {/* Main card */}
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                  <div className="text-center">
                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {country.flag}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {country.name}
                    </h3>
                    <p className="text-sm text-blue-100 mb-6 leading-relaxed">
                      {category === 'study' ? country.studyDescription : country.travelDescription}
                    </p>
                    
                    {/* Chat indicator */}
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-300 font-medium">Live Chat Active</span>
                    </div>
                    
                    <div className={`flex items-center justify-center space-x-2 text-white bg-gradient-to-r ${categoryInfo.gradient} rounded-xl py-3 px-4 group-hover:shadow-lg transition-all duration-300`}>
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm font-medium">Join Chat Room</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Countries */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">All Chat Destinations</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {countries.filter(country => !country.popular).map((country) => (
              <div
                key={country.code}
                onClick={() => handleCountrySelect(country.code)}
                className="group relative cursor-pointer"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                
                {/* Main card */}
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                  <div className="text-center">
                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {country.flag}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {country.name}
                    </h3>
                    <p className="text-sm text-blue-100 mb-6 leading-relaxed">
                      {category === 'study' ? country.studyDescription : country.travelDescription}
                    </p>
                    
                    {/* Chat indicator */}
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-300 font-medium">Live Chat Active</span>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl py-3 px-4 group-hover:shadow-lg transition-all duration-300">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm font-medium">Join Chat Room</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-6">
                Don't see your destination?
              </h2>
              <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                We're constantly expanding our chat network. Contact us to request support for additional countries and we'll connect you with experts in your desired destination.
              </p>
              <button className="group inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <MessageSquare className="mr-3 h-5 w-5" />
                Contact Support
                <ArrowRight className="ml-3 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountrySelection;
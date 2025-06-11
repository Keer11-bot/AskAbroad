import React from 'react';
import { GraduationCap, Plane, ArrowRight, BookOpen, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';

interface CategorySelectionProps {
  onCategorySelect: (category: 'study' | 'travel') => void;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ onCategorySelect }) => {
  const { currentUser } = useAuth();

  const categories = [
    {
      id: 'study' as const,
      title: 'Study Abroad',
      description: 'Explore international education opportunities, university applications, scholarships, and academic guidance',
      icon: <GraduationCap className="h-12 w-12" />,
      features: [
        'University selection guidance',
        'Application process help',
        'Scholarship information',
        'Student visa assistance',
        'Academic program advice'
      ],
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50'
    },
    {
      id: 'travel' as const,
      title: 'Travel Abroad',
      description: 'Get guidance on travel planning, tourist places, visa requirements, cultural insights, and destination recommendations',
      icon: <Plane className="h-12 w-12" />,
      features: [
        'Travel visa guidance',
        'Destination recommendations',
        'Cultural insights',
        'Travel planning tips',
        'Local customs advice'
      ],
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome, {currentUser?.displayName}!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your area of interest to connect with the right experts and get personalized guidance
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`bg-gradient-to-br ${category.bgGradient} rounded-2xl p-8 cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl border border-gray-200 group`}
            >
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${category.gradient} text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {category.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {category.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 bg-gradient-to-r ${category.gradient} rounded-full`}></div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className={`flex items-center justify-center space-x-2 text-white bg-gradient-to-r ${category.gradient} rounded-lg py-3 px-6 group-hover:shadow-lg transition-all duration-300`}>
                {category.id === 'study' ? (
                  <BookOpen className="h-5 w-5" />
                ) : (
                  <MapPin className="h-5 w-5" />
                )}
                <span className="font-medium">Explore {category.title}</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Not sure which category fits you?
            </h3>
            <p className="text-gray-600 mb-6">
              You can always switch between categories later. Both sections have dedicated experts ready to help you achieve your international goals.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Expert Consultants</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Local Residents</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySelection;
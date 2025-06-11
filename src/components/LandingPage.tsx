import React, { useState } from 'react';
import { MessageCircle, Globe, Users, Award, ArrowRight, Star, Sparkles, MapPin, GraduationCap, Plane } from 'lucide-react';
import AuthModal from './AuthModal';

const LandingPage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
        </div>

        {/* Floating Chat Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 animate-float">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
              <MessageCircle className="h-6 w-6 text-blue-300" />
            </div>
          </div>
          <div className="absolute top-40 right-20 animate-float animation-delay-1000">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
              <Globe className="h-6 w-6 text-green-300" />
            </div>
          </div>
          <div className="absolute bottom-40 left-20 animate-float animation-delay-2000">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
              <GraduationCap className="h-6 w-6 text-purple-300" />
            </div>
          </div>
          <div className="absolute bottom-20 right-10 animate-float animation-delay-3000">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
              <Plane className="h-6 w-6 text-orange-300" />
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="relative z-10 px-4 lg:px-6 h-20 flex items-center border-b border-white/10 bg-white/5 backdrop-blur-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg blur-sm opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 p-2 rounded-lg">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent blur-sm">
                  <span className="text-2xl font-bold">AskAbroad</span>
                </div>
                <span className="relative text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AskAbroad
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowAuthModal(true)}
              className="group relative inline-flex items-center px-8 py-3 overflow-hidden text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative z-10 py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full">
                    <Sparkles className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                Your Gateway to
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Global Opportunities
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-4xl mx-auto">
                Connect instantly with expert consultants and residents worldwide through our 
                <span className="text-yellow-300 font-semibold"> real-time chat platform </span>
                for guidance on studying, working, and living abroad
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="group relative inline-flex items-center px-10 py-5 text-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center">
                    <MessageCircle className="mr-3 h-6 w-6" />
                    Start Chatting Now
                    <ArrowRight className="ml-3 h-6 w-6 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </button>
                
                <div className="flex items-center space-x-2 text-blue-200">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white"></div>
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full border-2 border-white"></div>
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="text-sm font-medium">Join 10,000+ users chatting live</span>
                </div>
              </div>

              {/* Live Chat Preview */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex items-center space-x-2 text-white/70">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm">Live Chat</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-white/20 rounded-2xl rounded-tl-sm p-4 max-w-xs">
                        <p className="text-white text-sm">Hi! I'm Sarah, a consultant. How can I help you with your study abroad plans? 🎓</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 justify-end">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl rounded-tr-sm p-4 max-w-xs">
                        <p className="text-white text-sm">I'm interested in studying computer science in Canada. What universities would you recommend?</p>
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-white/20 rounded-2xl rounded-tl-sm p-4 max-w-xs">
                        <p className="text-white text-sm">I'm a resident in Toronto! University of Toronto and Waterloo are excellent for CS. Happy to share my experience! 🇨🇦</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative z-10 py-20 bg-white/5 backdrop-blur-sm border-y border-white/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose Our Chat Platform?
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Real-time conversations with verified experts who understand your journey
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl mb-6 shadow-lg">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Expert Consultants</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Chat instantly with certified consultants who have guided thousands through their international journey. Get real-time answers to your questions.
                  </p>
                  <div className="mt-6 flex items-center text-blue-300">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    <span className="text-sm font-medium">500+ Verified Experts</span>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl mb-6 shadow-lg">
                    <Globe className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Global Residents</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Connect with people already living your dream destination. Get insider tips, cultural insights, and real experiences through live chat.
                  </p>
                  <div className="mt-6 flex items-center text-green-300">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">50+ Countries Covered</span>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl mb-6 shadow-lg">
                    <MessageCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Instant Messaging</h3>
                  <p className="text-blue-100 leading-relaxed">
                    No waiting for emails or scheduled calls. Get immediate responses in our real-time chat rooms organized by country and purpose.
                  </p>
                  <div className="mt-6 flex items-center text-purple-300">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">24/7 Active Chats</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative z-10 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">10K+</div>
                <div className="text-blue-200">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">50+</div>
                <div className="text-blue-200">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
                <div className="text-blue-200">Experts</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
                <div className="text-blue-200">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-20 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 backdrop-blur-sm border-y border-white/10">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Ready to Start Your International Journey?
              </h2>
              <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of successful students and professionals who found their path through our chat platform. 
                Connect with experts now and get personalized guidance in real-time.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="group relative inline-flex items-center px-12 py-6 text-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center">
                  <MessageCircle className="mr-3 h-6 w-6" />
                  Join AskAbroad Chat Now
                  <ArrowRight className="ml-3 h-6 w-6 transform group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 bg-black/20 backdrop-blur-sm border-t border-white/10 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg blur-sm opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 p-2 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AskAbroad
              </span>
            </div>
            <p className="text-blue-200 mb-4">
              Your gateway to global opportunities through real-time conversations
            </p>
            <p className="text-blue-300/60 text-sm">
              © 2024 AskAbroad. All rights reserved. Connect. Chat. Achieve.
            </p>
          </div>
        </footer>
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default LandingPage;
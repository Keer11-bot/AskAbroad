import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Users, Crown, Globe, MessageSquare, FileText, AlertCircle, Reply, X, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ref, push, onValue, off, query, orderByChild, startAt, set, remove, onDisconnect } from 'firebase/database';
import { database } from '../config/firebase';
import { Message, RoomUser } from '../types';
import { countries } from '../data/countries';
import Navbar from './Navbar';
import io from 'socket.io-client';

const ChatRoom: React.FC = () => {
  const { countryCode, category } = useParams<{ countryCode: string; category: string }>();
  const navigate = useNavigate();
  const { currentUser, incrementGuestMessageCount } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<RoomUser[]>([]);
  const [activeRoom, setActiveRoom] = useState<'general' | 'visa'>('general');
  const [showGuestLimitModal, setShowGuestLimitModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  const country = countries.find(c => c.code === countryCode);

  useEffect(() => {
    if (!currentUser || !countryCode || !category) return;

    const roomId = `${countryCode}-${category}-${activeRoom}`;

    // Add user to room presence
    const userPresenceRef = ref(database, `rooms/${roomId}/users/${currentUser.uid}`);
    const userPresenceData = {
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      userType: currentUser.userType,
      joinedAt: new Date().toISOString()
    };

    set(userPresenceRef, userPresenceData);

    // Remove user when they disconnect
    onDisconnect(userPresenceRef).remove();

    // Listen for room users
    const roomUsersRef = ref(database, `rooms/${roomId}/users`);
    const unsubscribeUsers = onValue(roomUsersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList = Object.values(data) as RoomUser[];
        setOnlineUsers(usersList);
      } else {
        setOnlineUsers([]);
      }
    });

    // Listen for Firebase messages (only non-expired ones)
    const messagesRef = ref(database, `messages/${countryCode}/${category}/${activeRoom}`);
    const now = new Date().toISOString();
    const validMessagesQuery = query(messagesRef, orderByChild('expiresAt'), startAt(now));
    
    const unsubscribeMessages = onValue(validMessagesQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesList = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value
        }));
        setMessages(messagesList.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
      } else {
        setMessages([]);
      }
    });

    return () => {
      unsubscribeUsers();
      unsubscribeMessages();
      // Remove user from room when component unmounts
      remove(userPresenceRef);
    };
  }, [currentUser, countryCode, category, activeRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close reply when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedMessage && !(event.target as Element).closest('.message-container')) {
        setSelectedMessage(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedMessage]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !countryCode || !category) return;

    // Check guest message limit
    if (currentUser.isGuest) {
      const messageCount = currentUser.messageCount || 0;
      if (messageCount >= 5) {
        setShowGuestLimitModal(true);
        return;
      }
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours from now

    const message: Omit<Message, 'id'> = {
      senderId: currentUser.uid,
      senderName: currentUser.displayName,
      senderType: currentUser.userType,
      content: newMessage.trim(),
      timestamp: now.toISOString(),
      country: countryCode,
      category: category as 'study' | 'travel',
      roomType: activeRoom,
      expiresAt: expiresAt.toISOString(),
      ...(replyingTo && {
        replyTo: {
          id: replyingTo.id,
          senderName: replyingTo.senderName,
          content: replyingTo.content.length > 50 
            ? replyingTo.content.substring(0, 50) + '...' 
            : replyingTo.content
        }
      })
    };

    try {
      if (currentUser.isGuest) {
        // For guest users, store message with guest ID
        await push(ref(database, `messages/${countryCode}/${category}/${activeRoom}`), message);
        await incrementGuestMessageCount();
      } else {
        // For authenticated users
        await push(ref(database, `messages/${countryCode}/${category}/${activeRoom}`), message);
      }
      
      setNewMessage('');
      setReplyingTo(null);
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleMessageClick = (message: Message) => {
    if (selectedMessage === message.id) {
      setSelectedMessage(null);
    } else {
      setSelectedMessage(message.id);
    }
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
    setSelectedMessage(null);
    // Focus on input field
    const inputField = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (inputField) {
      inputField.focus();
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'consultant':
        return <Crown className="h-4 w-4 text-purple-400" />;
      case 'resident':
        return <Globe className="h-4 w-4 text-green-400" />;
      case 'guest':
        return <Users className="h-4 w-4 text-orange-400" />;
      default:
        return null;
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'consultant':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'resident':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'guest':
        return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
      default:
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
    }
  };

  const getCategoryInfo = () => {
    if (category === 'study') {
      return {
        title: 'Study Abroad Chat',
        icon: '🎓',
        description: country?.studyDescription || country?.description,
        gradient: 'from-blue-500 via-blue-600 to-indigo-600'
      };
    } else {
      return {
        title: 'Travel Chat',
        icon: '✈️',
        description: country?.travelDescription || country?.description,
        gradient: 'from-green-500 via-emerald-600 to-teal-600'
      };
    }
  };

  if (!country) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h1 className="text-2xl font-bold text-white mb-4">Country not found</h1>
          <button
            onClick={() => navigate('/categories')}
            className="text-blue-300 hover:text-white transition-colors duration-200"
          >
            Back to categories
          </button>
        </div>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo();
  const guestMessageCount = currentUser?.messageCount || 0;
  const remainingMessages = currentUser?.isGuest ? Math.max(0, 5 - guestMessageCount) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <Navbar />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Guest Message Limit Warning */}
        {currentUser?.isGuest && remainingMessages !== null && remainingMessages <= 2 && (
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-300/30 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-orange-300 mr-3" />
              <p className="text-sm text-orange-100">
                You have <span className="font-bold text-orange-200">{remainingMessages}</span> message{remainingMessages !== 1 ? 's' : ''} remaining as a guest. 
                <button 
                  onClick={() => navigate('/')}
                  className="ml-2 font-medium text-orange-200 underline hover:no-underline transition-all duration-200"
                >
                  Sign up for unlimited messaging
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Chat Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 mb-6">
          <div className="px-6 py-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 text-white/70 hover:text-white"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{country.flag}</div>
                  <div>
                    <h1 className="text-2xl font-semibold text-white flex items-center space-x-3">
                      <span>{country.name}</span>
                      <span className="text-2xl">{categoryInfo.icon}</span>
                      <span className="text-lg text-blue-200">- {categoryInfo.title}</span>
                    </h1>
                    <p className="text-sm text-blue-200">{categoryInfo.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-blue-200 bg-white/10 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <Users className="h-4 w-4" />
                  <span>{onlineUsers.length} online</span>
                </div>
              </div>
            </div>

            {/* Room Tabs */}
            <div className="flex space-x-2 mt-6 bg-white/10 rounded-xl p-2">
              <button
                onClick={() => setActiveRoom('general')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeRoom === 'general'
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>General Discussion</span>
              </button>
              <button
                onClick={() => setActiveRoom('visa')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeRoom === 'visa'
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Visa Guidance</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-black/10">
            {messages.length === 0 ? (
              <div className="text-center text-blue-200 py-12">
                <div className="text-6xl mb-6">
                  {activeRoom === 'general' ? '💬' : '📋'}
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
                  <p className="text-xl font-medium mb-3 text-white">
                    {activeRoom === 'general' ? 'Start the conversation!' : 'Ask your visa questions!'}
                  </p>
                  <p className="text-sm text-blue-200">
                    {activeRoom === 'general' 
                      ? 'Share experiences, ask questions, and connect with others interested in ' + country.name
                      : 'Get expert guidance on visa requirements, application processes, and documentation for ' + country.name
                    }
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`message-container relative group ${
                    selectedMessage === message.id ? 'bg-white/10 rounded-xl p-3' : ''
                  }`}
                  onClick={() => handleMessageClick(message)}
                >
                  <div className="flex items-start space-x-3 cursor-pointer">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full ${getUserTypeColor(message.senderType)} flex items-center justify-center shadow-lg`}>
                        {getUserTypeIcon(message.senderType) || (
                          <span className="text-sm font-medium">
                            {message.senderName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-white">
                          {message.senderName}
                        </span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getUserTypeColor(message.senderType)}`}>
                          {message.senderType.charAt(0).toUpperCase() + message.senderType.slice(1)}
                        </span>
                        <span className="text-xs text-blue-300">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="text-xs text-blue-400 flex items-center">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Expires in {Math.ceil((new Date(message.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60))}h
                        </span>
                      </div>
                      
                      {/* Reply indicator */}
                      {message.replyTo && (
                        <div className="bg-white/10 border-l-4 border-blue-400 pl-4 py-2 mb-3 rounded-r-lg backdrop-blur-sm">
                          <div className="flex items-center space-x-1 mb-1">
                            <Reply className="h-3 w-3 text-blue-400" />
                            <span className="text-xs font-medium text-blue-300">
                              Replying to {message.replyTo.senderName}
                            </span>
                          </div>
                          <p className="text-xs text-blue-200 italic">
                            {message.replyTo.content}
                          </p>
                        </div>
                      )}
                      
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-white text-sm leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </div>
                    
                    {/* Reply button - shows on hover or when message is selected */}
                    {(selectedMessage === message.id) && (
                      <div className="flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReply(message);
                          }}
                          className="p-2 text-blue-300 hover:bg-white/10 rounded-full transition-all duration-200 hover:text-white"
                          title="Reply to this message"
                        >
                          <Reply className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Preview */}
          {replyingTo && (
            <div className="px-6 py-4 bg-blue-500/20 border-t border-blue-400/30 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Reply className="h-4 w-4 text-blue-300" />
                  <span className="text-sm font-medium text-blue-200">
                    Replying to {replyingTo.senderName}
                  </span>
                </div>
                <button
                  onClick={cancelReply}
                  className="p-1 text-blue-300 hover:bg-white/10 rounded transition-all duration-200 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-blue-100 mt-2 italic bg-white/10 rounded-lg p-2">
                {replyingTo.content.length > 100 
                  ? replyingTo.content.substring(0, 100) + '...' 
                  : replyingTo.content}
              </p>
            </div>
          )}

          {/* Message Input */}
          <div className="px-6 py-4 border-t border-white/10">
            <form onSubmit={sendMessage} className="flex space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`${replyingTo ? 'Reply to message...' : `Type your message in ${activeRoom === 'general' ? 'general discussion' : 'visa guidance'}...`}`}
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                disabled={currentUser?.isGuest && guestMessageCount >= 5}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || (currentUser?.isGuest && guestMessageCount >= 5)}
                className={`px-6 py-3 bg-gradient-to-r ${categoryInfo.gradient} text-white rounded-xl hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 transform hover:scale-105`}
              >
                <Send className="h-4 w-4" />
                <span>{replyingTo ? 'Reply' : 'Send'}</span>
              </button>
            </form>
            <div className="flex justify-between items-center mt-3">
              <p className="text-xs text-blue-300 flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Messages automatically expire after 48 hours to keep conversations fresh and relevant
                {replyingTo && ' • Click the X above to cancel reply'}
              </p>
              {currentUser?.isGuest && (
                <p className="text-xs text-orange-300 font-medium">
                  {remainingMessages} message{remainingMessages !== 1 ? 's' : ''} remaining
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Online Users Sidebar */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Online Users ({onlineUsers.length})
          </h3>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {onlineUsers.map((user) => (
              <div key={user.uid} className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
                <div className={`w-8 h-8 rounded-full ${getUserTypeColor(user.userType)} flex items-center justify-center shadow-lg`}>
                  {getUserTypeIcon(user.userType) || (
                    <span className="text-xs font-medium">
                      {user.displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-white font-medium truncate block">{user.displayName}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getUserTypeColor(user.userType)}`}>
                    {user.userType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guest Limit Modal */}
      {showGuestLimitModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
            </div>
            <div className="inline-block align-bottom bg-white/10 backdrop-blur-md rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-white/20">
              <div className="px-6 py-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-500/20 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-white">
                      Guest Message Limit Reached
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-blue-200">
                        You've reached the 5-message limit for guest users. Sign up for a free account to continue chatting with unlimited messages and access all features.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-base font-medium text-white hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                >
                  Sign Up Now
                </button>
                <button
                  type="button"
                  onClick={() => setShowGuestLimitModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-xl border border-white/20 shadow-sm px-6 py-3 bg-white/10 text-base font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Users, Crown, Globe, MessageSquare, FileText, AlertCircle, Reply, X } from 'lucide-react';
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
        return <Crown className="h-4 w-4 text-purple-600" />;
      case 'resident':
        return <Globe className="h-4 w-4 text-green-600" />;
      case 'guest':
        return <Users className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'consultant':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'resident':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'guest':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getCategoryInfo = () => {
    if (category === 'study') {
      return {
        title: 'Study Abroad',
        icon: '🎓',
        description: country?.studyDescription || country?.description
      };
    } else {
      return {
        title: 'Travel Abroad',
        icon: '✈️',
        description: country?.travelDescription || country?.description
      };
    }
  };

  if (!country) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Country not found</h1>
          <button
            onClick={() => navigate('/categories')}
            className="text-blue-600 hover:text-blue-800"
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Guest Message Limit Warning */}
        {currentUser?.isGuest && remainingMessages !== null && remainingMessages <= 2 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
              <p className="text-sm text-orange-800">
                You have {remainingMessages} message{remainingMessages !== 1 ? 's' : ''} remaining as a guest. 
                <button 
                  onClick={() => navigate('/')}
                  className="ml-1 font-medium underline hover:no-underline"
                >
                  Sign up for unlimited messaging
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Chat Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{country.flag}</span>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                      <span>{country.name}</span>
                      <span className="text-lg">{categoryInfo.icon}</span>
                      <span className="text-base text-gray-600">- {categoryInfo.title}</span>
                    </h1>
                    <p className="text-sm text-gray-600">{categoryInfo.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{onlineUsers.length} online</span>
              </div>
            </div>

            {/* Room Tabs */}
            <div className="flex space-x-1 mt-4 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveRoom('general')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeRoom === 'general'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>General Discussion</span>
              </button>
              <button
                onClick={() => setActiveRoom('visa')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeRoom === 'visa'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Visa Guidance</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-4">
                  {activeRoom === 'general' ? '💬' : '📋'}
                </div>
                <p className="text-lg font-medium mb-2">
                  {activeRoom === 'general' ? 'Start the conversation!' : 'Ask your visa questions!'}
                </p>
                <p className="text-sm">
                  {activeRoom === 'general' 
                    ? 'Share experiences, ask questions, and connect with others interested in ' + country.name
                    : 'Get expert guidance on visa requirements, application processes, and documentation for ' + country.name
                  }
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`message-container relative group ${
                    selectedMessage === message.id ? 'bg-blue-50 rounded-lg p-2' : ''
                  }`}
                  onClick={() => handleMessageClick(message)}
                >
                  <div className="flex items-start space-x-3 cursor-pointer">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full ${getUserTypeColor(message.senderType)} flex items-center justify-center`}>
                        {getUserTypeIcon(message.senderType) || (
                          <span className="text-xs font-medium">
                            {message.senderName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {message.senderName}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getUserTypeColor(message.senderType)}`}>
                          {message.senderType.charAt(0).toUpperCase() + message.senderType.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="text-xs text-gray-400">
                          • Expires in {Math.ceil((new Date(message.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60))}h
                        </span>
                      </div>
                      
                      {/* Reply indicator */}
                      {message.replyTo && (
                        <div className="bg-gray-100 border-l-4 border-blue-500 pl-3 py-2 mb-2 rounded-r-md">
                          <div className="flex items-center space-x-1 mb-1">
                            <Reply className="h-3 w-3 text-blue-500" />
                            <span className="text-xs font-medium text-blue-600">
                              Replying to {message.replyTo.senderName}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 italic">
                            {message.replyTo.content}
                          </p>
                        </div>
                      )}
                      
                      <p className="text-gray-800 text-sm leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                    
                    {/* Reply button - shows on hover or when message is selected */}
                    {(selectedMessage === message.id) && (
                      <div className="flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReply(message);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200"
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
            <div className="px-6 py-3 bg-blue-50 border-t border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Reply className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Replying to {replyingTo.senderName}
                  </span>
                </div>
                <button
                  onClick={cancelReply}
                  className="p-1 text-blue-600 hover:bg-blue-200 rounded transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-blue-700 mt-1 italic">
                {replyingTo.content.length > 100 
                  ? replyingTo.content.substring(0, 100) + '...' 
                  : replyingTo.content}
              </p>
            </div>
          )}

          {/* Message Input */}
          <div className="px-6 py-4 border-t border-gray-200">
            <form onSubmit={sendMessage} className="flex space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`${replyingTo ? 'Reply to message...' : `Type your message in ${activeRoom === 'general' ? 'general discussion' : 'visa guidance'}...`}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={currentUser?.isGuest && guestMessageCount >= 5}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || (currentUser?.isGuest && guestMessageCount >= 5)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>{replyingTo ? 'Reply' : 'Send'}</span>
              </button>
            </form>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                💡 Messages automatically expire after 48 hours to keep conversations fresh and relevant
                {replyingTo && ' • Click the X above to cancel reply'}
              </p>
              {currentUser?.isGuest && (
                <p className="text-xs text-orange-600">
                  {remainingMessages} message{remainingMessages !== 1 ? 's' : ''} remaining
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Online Users Sidebar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Online Users ({onlineUsers.length})
          </h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {onlineUsers.map((user) => (
              <div key={user.uid} className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full ${getUserTypeColor(user.userType)} flex items-center justify-center`}>
                  {getUserTypeIcon(user.userType) || (
                    <span className="text-xs font-medium">
                      {user.displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-700 truncate">{user.displayName}</span>
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${getUserTypeColor(user.userType)}`}>
                  {user.userType}
                </span>
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
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Guest Message Limit Reached
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You've reached the 5-message limit for guest users. Sign up for a free account to continue chatting with unlimited messages.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Sign Up Now
                </button>
                <button
                  type="button"
                  onClick={() => setShowGuestLimitModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
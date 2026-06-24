import React, { useState, useEffect } from 'react';
import { Search, Send, ArrowLeft, MoreVertical, Phone, Video, MessageSquare, Hash } from 'lucide-react';
import { cn, generateId } from '@/lib/utils';
import { mockEngineers } from '@/data';
import { Project, Task, TaskComment } from '@/types';

const initialMessages = [
  { id: 1, sender: 'them', text: 'Hey, are we still on track for the V2 release?', time: '10:30 AM' },
  { id: 2, sender: 'me', text: 'Yes, the API spec is mostly done. I just need to review the load balancer config.', time: '10:32 AM' },
  { id: 3, sender: 'them', text: 'Perfect. Let me know if you need help with that.', time: '10:35 AM' },
];

export interface MessagesViewProps {
  projects?: Project[];
  initialChatId?: string | null;
  onAddTaskComment?: (projectId: string, taskId: string, comment: TaskComment) => void;
}

export function MessagesView({ projects = [], initialChatId = null, onAddTaskComment }: MessagesViewProps) {
  const [selectedChat, setSelectedChat] = useState<string | null>(initialChatId);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    if (initialChatId) {
      setSelectedChat(initialChatId);
    }
  }, [initialChatId]);

  // Collect all tasks to form project discussions
  const taskChats = projects.flatMap(p => 
    p.tasks.map(t => ({
      id: `task-${t.id}`,
      name: t.title,
      role: `Project: ${p.name}`,
      isTask: true,
      originalTask: t,
      project: p
    }))
  );

  const allChats = [
    ...taskChats,
    ...mockEngineers.map(e => ({ ...e, isTask: false }))
  ];

  const activeChat = selectedChat ? allChats.find(c => c.id === selectedChat) : null;

  // Sync messages if activeChat is a task
  const activeTaskComments = activeChat?.isTask && activeChat.originalTask ? activeChat.originalTask.comments || [] : null;

  const filteredChats = allChats.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    if (activeChat?.isTask && onAddTaskComment) {
      // It's a task chat, add comment to project
      onAddTaskComment(activeChat.project.id, activeChat.originalTask.id, {
        id: generateId(),
        authorRole: 'MANAGER',
        authorName: 'Manager',
        content: messageText.trim(),
        createdAt: new Date().toISOString()
      });
    } else {
      // Regular chat, just add to local state
      setMessages([...messages, {
        id: Date.now(),
        sender: 'me',
        text: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
    setMessageText('');
  };

  return (
    <div className="w-full h-[calc(100vh-130px)] sm:h-[calc(100vh-80px)] flex flex-col sm:flex-row bg-[#fafafa] dark:bg-[#0a0a0a]">
      {/* Sidebar - Chat List */}
      <div className={cn(
        "w-full sm:w-80 md:w-96 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f0f11] h-full",
        selectedChat ? "hidden sm:flex" : "flex"
      )}>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Discussions</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search people or tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 dark:focus:ring-white/20 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={cn(
                "w-full flex items-center gap-3 p-4 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors text-left",
                selectedChat === chat.id ? "bg-gray-50 dark:bg-gray-900/50" : ""
              )}
            >
              <div className="relative">
                {chat.isTask ? (
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 shadow-sm">
                    <Hash className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold uppercase text-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    {chat.name.charAt(0)}
                  </div>
                )}
                {!chat.isTask && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#0f0f11] rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-400">10:35 AM</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.role}</p>
              </div>
            </button>
          ))}
          {filteredChats.length === 0 && (
             <div className="p-4 text-center text-sm text-gray-500">No discussions found.</div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={cn(
        "flex-1 flex-col h-full bg-[#fafafa] dark:bg-[#0a0a0a]",
        !selectedChat ? "hidden sm:flex items-center justify-center" : "flex"
      )}>
        {!selectedChat ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Select a conversation</h3>
            <p className="text-sm text-gray-500">Choose a person or task to start discussing.</p>
          </div>
        ) : activeChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-[#0f0f11] border-b border-gray-200 dark:border-gray-800 shadow-sm z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedChat(null)}
                  className="sm:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                {activeChat.isTask ? (
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 shadow-sm">
                    <Hash className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold uppercase border border-gray-200 dark:border-gray-700 shadow-sm">
                    {activeChat.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{activeChat.name}</h3>
                  <p className={cn("text-xs font-medium truncate", activeChat.isTask ? "text-gray-500 dark:text-gray-400" : "text-green-600 dark:text-green-400")}>
                    {activeChat.isTask ? activeChat.role : 'Online'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!activeChat.isTask && (
                  <>
                    <button className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden sm:block">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden sm:block">
                      <Video className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] dark:bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px]">
              {activeChat.isTask && (
                <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm mb-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Project Discussion Context</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This discussion is tied to the task <strong>{activeChat.name}</strong> in {activeChat.role}.
                  </p>
                </div>
              )}
              <div className="text-center text-xs font-medium text-gray-400 my-4">Today</div>
              {activeChat.isTask ? (
                <>
                  {!activeTaskComments || activeTaskComments.length === 0 ? (
                    <div className="text-center text-sm font-medium text-gray-500 my-8">No messages yet. Start the discussion.</div>
                  ) : (
                    activeTaskComments.map(msg => (
                      <div key={msg.id} className={cn("flex", msg.authorRole === 'MANAGER' ? "justify-end" : "justify-start")}>
                        <div className={cn(
                          "max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm relative group flex flex-col",
                          msg.authorRole === 'MANAGER' 
                            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-tr-none" 
                            : "bg-white dark:bg-[#18181b] text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800 rounded-tl-none"
                        )}>
                          <span className="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-70">
                            {msg.authorName}
                          </span>
                          {msg.imageUrl && (
                            <img src={msg.imageUrl} alt="attachment" className="w-full h-auto max-w-xs object-cover rounded-lg mb-2" />
                          )}
                          <p className="text-[15px] leading-relaxed">{msg.content}</p>
                          <span className={cn(
                            "text-[10px] mt-1.5 block opacity-70",
                            msg.authorRole === 'MANAGER' ? "text-right" : "text-left"
                          )}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div key={msg.id} className={cn("flex", msg.sender === 'me' ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm relative group",
                        msg.sender === 'me' 
                          ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-tr-none" 
                          : "bg-white dark:bg-[#18181b] text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800 rounded-tl-none"
                      )}>
                        <p className="text-[15px] leading-relaxed">{msg.text}</p>
                        <span className={cn(
                          "text-[10px] mt-1 block opacity-70",
                          msg.sender === 'me' ? "text-right" : "text-left"
                        )}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white dark:bg-[#0f0f11] border-t border-gray-200 dark:border-gray-800">
              <form onSubmit={handleSendMessage} className="flex flex-col gap-2 max-w-4xl mx-auto">
                <div className="flex items-center gap-2 relative">
                  <input 
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={activeChat.isTask ? "Discuss this task..." : "Type a message..."}
                    className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full pl-5 pr-14 py-3 sm:py-3.5 text-[15px] text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 dark:focus:ring-white/20 transition-all shadow-sm"
                  />
                  <button 
                    type="submit"
                    disabled={!messageText.trim()}
                    className="absolute right-1.5 p-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
                  </button>
                </div>
                {activeChat.isTask && (
                  <div className="flex justify-end mt-1">
                    <button
                      type="button"
                      disabled={!messageText.trim()}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!messageText.trim()) return;
                        if (activeChat?.isTask && onAddTaskComment) {
                          onAddTaskComment(activeChat.project.id, activeChat.originalTask.id, {
                            id: generateId(),
                            authorRole: 'ENGINEER',
                            authorName: 'Engineer (Simulated)',
                            content: messageText.trim(),
                            createdAt: new Date().toISOString()
                          });
                          setMessageText('');
                        }
                      }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-50"
                      title="Simulate Engineer Reply"
                    >
                      Engineer Reply
                    </button>
                  </div>
                )}
              </form>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

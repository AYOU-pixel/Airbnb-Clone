"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
};

type ConversationUser = {
  id: string;
  name: string | null;
  email: string | null;
  image?: string | null;
  lastMessage?: string;
  lastMessageDate?: string;
};

export default function MessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<ConversationUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = session?.user?.id as string;

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations list
  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/conversations");
        if (res.ok) {
          const data = await res.json();
          setConversations(data);
        }
      } catch (err) {
        console.error("Failed to fetch conversations", err);
      }
    };

    fetchConversations();
  }, [session?.user?.email]);

  // Fetch messages when user is selected
  useEffect(() => {
    if (!currentUserId || !selectedUserId) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/messages?userId=${currentUserId}&otherUserId=${selectedUserId}`
        );
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error("Failed to fetch messages", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [currentUserId, selectedUserId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedUserId,
          content: newMessage,
        }),
      });

      if (res.ok) {
        const msg = await res.json();
        setMessages((prev) => [...prev, msg]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectedUser = conversations.find((user) => user.id === selectedUserId);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-[90vh]">
        <p className="text-gray-500">Please sign in to view messages.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="flex h-[80vh] border rounded-lg overflow-hidden bg-white shadow-lg">
        {/* Sidebar - Conversations List */}
        <aside className="w-1/3 border-r bg-gray-50">
          <div className="p-4 border-b bg-white">
            <h2 className="text-lg font-semibold">Conversations</h2>
          </div>
          
          <div className="overflow-y-auto h-full">
            {conversations.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500">No conversations yet.</p>
                <p className="text-xs text-gray-400 mt-2">
                  Start a conversation by booking a property or contacting a host.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {conversations.map((user) => (
                  <li
                    key={user.id}
                    className={`p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
                      selectedUserId === user.id ? "bg-blue-50 border-r-2 border-blue-500" : ""
                    }`}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <div className="flex items-center space-x-3">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || "User"}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-sm font-medium">
                            {(user.name || user.email || "?").charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {user.name || user.email}
                        </p>
                        {user.lastMessage && (
                          <p className="text-sm text-gray-500 truncate">
                            {user.lastMessage}
                          </p>
                        )}
                        {user.lastMessageDate && (
                          <p className="text-xs text-gray-400">
                            {new Date(user.lastMessageDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex flex-col w-2/3">
          {selectedUserId ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center space-x-3">
                  {selectedUser?.image ? (
                    <Image
                      src={selectedUser.image}
                      alt={selectedUser.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-xs font-medium">
                        {(selectedUser?.name || selectedUser?.email || "?").charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900">
                    {selectedUser?.name || selectedUser?.email}
                  </h3>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {loading && messages.length === 0 ? (
                  <div className="flex justify-center">
                    <p className="text-gray-500">Loading messages...</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.senderId === currentUserId ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2 rounded-lg ${
                            msg.senderId === currentUserId
                              ? "bg-blue-500 text-white"
                              : "bg-white text-gray-900 border"
                          }`}
                        >
                          <p className="break-words">{msg.content}</p>
                          <div
                            className={`text-xs mt-1 ${
                              msg.senderId === currentUserId
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Send Message Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex gap-3">
                  <textarea
                    className="flex-1 border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={1}
                    disabled={loading}
                  />
                  <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={sendMessage}
                    disabled={loading || !newMessage.trim()}
                  >
                    {loading ? "..." : "Send"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                <p className="text-gray-500">Choose a conversation from the sidebar to start chatting.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

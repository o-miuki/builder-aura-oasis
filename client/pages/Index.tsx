import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  time: string;
  timestamp: number;
  conversationId: string;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  selected: boolean;
  messages: Message[];
  status: "online" | "offline";
  isWidget?: boolean;
}

export default function Index() {
  const [selectedConversation, setSelectedConversation] = useState("1");
  const [message, setMessage] = useState("");
  const [showConversations, setShowConversations] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [showWidgetChat, setShowWidgetChat] = useState(false);
  const [widgetMessage, setWidgetMessage] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      name: "John Doe",
      lastMessage: "Hello, please help me. For lorem impsun dolor....",
      time: "1 minute ago",
      unread: 2,
      avatar: "",
      selected: true,
      status: "online",
      isWidget: false,
      messages: [
        {
          id: "1",
          text: "Hello, please help me. For lorem impsun dolor lorem impsum?",
          sender: "user",
          time: "1 minute ago",
          timestamp: Date.now() - 60000,
          conversationId: "1",
        },
        {
          id: "2",
          text: "Hi, yes, my name is john",
          sender: "support",
          time: "1 minute ago",
          timestamp: Date.now() - 30000,
          conversationId: "1",
        },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  // WebSocket Connection
  useEffect(() => {
    // Simulating WebSocket connection
    setConnectionStatus("connecting");
    
    // Mock WebSocket connection
    const mockWs = {
      send: (data: string) => {
        console.log("WebSocket sending:", data);
      },
      close: () => {
        console.log("WebSocket closed");
      }
    };

    wsRef.current = mockWs as any;
    setConnectionStatus("connected");

    // Simulate real-time message reception
    const interval = setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance every second to receive a message
        const randomResponses = [
          "Thank you for contacting us!",
          "How can I help you today?",
          "I understand your concern.",
          "Let me check that for you.",
          "Is there anything else I can help with?"
        ];
        
        const randomResponse = randomResponses[Math.floor(Math.random() * randomResponses.length)];
        receiveMessage(randomResponse, selectedConversation);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const sendMessage = (conversationId?: string, messageText?: string) => {
    const text = messageText || message.trim();
    const targetConversationId = conversationId || selectedConversation;
    
    if (!text) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: "support",
      time: "now",
      timestamp: Date.now(),
      conversationId: targetConversationId,
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === targetConversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: text,
              time: "now",
            }
          : conv,
      ),
    );

    if (!conversationId) {
      setMessage("");
    }

    // Send via WebSocket
    if (wsRef.current && connectionStatus === "connected") {
      wsRef.current.send(JSON.stringify({
        type: "message",
        conversationId: targetConversationId,
        message: newMessage
      }));
    }

    // Auto-reply simulation
    setTimeout(() => {
      const autoReply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message! Our team will get back to you shortly.",
        sender: "user",
        time: "now",
        timestamp: Date.now(),
        conversationId: targetConversationId,
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === targetConversationId
            ? {
                ...conv,
                messages: [...conv.messages, autoReply],
                lastMessage: autoReply.text,
                time: "now",
                unread: conv.id !== selectedConversation ? conv.unread + 1 : conv.unread,
              }
            : conv,
        ),
      );
    }, 2000);
  };

  const receiveMessage = (text: string, conversationId: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: "user",
      time: "now",
      timestamp: Date.now(),
      conversationId: conversationId,
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: text,
              time: "now",
              unread: conv.id !== selectedConversation ? conv.unread + 1 : conv.unread,
            }
          : conv,
      ),
    );
  };

  const sendWidgetMessage = () => {
    const text = widgetMessage.trim();
    if (!text) return;

    // Check if there's already a widget conversation
    let widgetConversation = conversations.find(conv => conv.isWidget);
    
    if (!widgetConversation) {
      // Create new widget conversation
      const newConversation: Conversation = {
        id: "widget-" + Date.now(),
        name: "Website Visitor",
        lastMessage: text,
        time: "now",
        unread: 1,
        avatar: "",
        selected: false,
        status: "online",
        isWidget: true,
        messages: [],
      };

      setConversations(prev => [newConversation, ...prev]);
      widgetConversation = newConversation;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: "user",
      time: "now",
      timestamp: Date.now(),
      conversationId: widgetConversation.id,
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === widgetConversation!.id
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: text,
              time: "now",
              unread: conv.id !== selectedConversation ? conv.unread + 1 : conv.unread,
            }
          : conv,
      ),
    );

    setWidgetMessage("");

    // Send via WebSocket
    if (wsRef.current && connectionStatus === "connected") {
      wsRef.current.send(JSON.stringify({
        type: "widget_message",
        conversationId: widgetConversation.id,
        message: newMessage
      }));
    }

    // Auto-reply from support
    setTimeout(() => {
      const supportReply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Hello! Thank you for reaching out. How can I help you today?",
        sender: "support",
        time: "now",
        timestamp: Date.now(),
        conversationId: widgetConversation!.id,
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === widgetConversation!.id
            ? {
                ...conv,
                messages: [...conv.messages, supportReply],
                lastMessage: supportReply.text,
                time: "now",
              }
            : conv,
        ),
      );
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleWidgetKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendWidgetMessage();
    }
  };

  const currentConversation = conversations.find(
    (c) => c.id === selectedConversation,
  );
  const currentMessages = currentConversation?.messages || [];

  const downloadTranscript = () => {
    const transcript = currentMessages
      .map(
        (msg) =>
          `[${msg.time}] ${msg.sender === "user" ? currentConversation?.name : "Support"}: ${msg.text}`,
      )
      .join("\n");

    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-transcript-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen bg-[#EFF0EB] flex relative overflow-hidden">
      {/* Mobile Conversations Overlay */}
      {showConversations && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowConversations(false)}
        >
          <div
            className="w-[320px] bg-[#FBFBF9] h-full flex flex-col rounded-r-[20px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-medium text-[#363636]">
                  Conversas
                </h1>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-[#F8F8F7] rounded-full flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 17 17" fill="none">
                      <path
                        d="M2.83346 2.125H14.1669C14.5581 2.125 14.8752 2.44208 14.8752 2.83324L14.8753 3.95653C14.8754 4.14444 14.8007 4.32464 14.6679 4.45751L10.1243 9.00086C9.99145 9.13367 9.91679 9.31387 9.91679 9.50172V13.9678C9.91679 14.4286 9.48371 14.7668 9.03668 14.655L7.62002 14.3008C7.30467 14.222 7.08346 13.9387 7.08346 13.6136V9.50172C7.08346 9.31387 7.00883 9.13367 6.87598 9.00086L2.33259 4.45746C2.19975 4.32463 2.12512 4.14446 2.12512 3.9566V2.83333C2.12512 2.44213 2.44225 2.125 2.83346 2.125Z"
                        stroke="black"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-[#F8F8F7] rounded-full flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 19 19" fill="none">
                      <path
                        d="M13.4584 13.4584L16.625 16.625"
                        stroke="black"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.375 8.70833C2.375 12.2062 5.21053 15.0417 8.70833 15.0417C10.4603 15.0417 12.0461 14.3304 13.1927 13.1807C14.3353 12.0351 15.0417 10.4542 15.0417 8.70833C15.0417 5.21053 12.2062 2.375 8.70833 2.375C5.21053 2.375 2.375 5.21053 2.375 8.70833Z"
                        stroke="black"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    setSelectedConversation(conv.id);
                    setShowConversations(false);
                  }}
                  className={`mb-3 rounded-2xl p-3 cursor-pointer transition-colors ${
                    conv.selected ? "bg-black/[0.04]" : "hover:bg-black/[0.02]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-[#D9D9D9] rounded-full"></div>
                      {conv.isWidget && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm text-black flex items-center gap-1">
                          {conv.name}
                          {conv.isWidget && (
                            <span className="text-xs text-blue-600">(Widget)</span>
                          )}
                        </h3>
                        <span className="text-xs text-[#ACACAC]">
                          {conv.time}
                        </span>
                      </div>
                      <p className="text-sm text-black truncate">
                        {conv.lastMessage}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${conv.status === "online" ? "bg-green-500" : "bg-gray-400"}`}></div>
                          <span className="text-xs text-[#ACACAC]">{conv.status}</span>
                        </div>
                        {conv.unread > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Left Panel - Conversations (Desktop: 320px width) */}
      <div className="w-[320px] bg-[#FBFBF9] flex flex-col rounded-r-[20px] hidden lg:flex ml-4 mt-3 mb-5">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-medium text-[#363636]">Conversas</h1>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-[#F8F8F7] rounded-full flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 17 17" fill="none">
                  <path
                    d="M2.83346 2.125H14.1669C14.5581 2.125 14.8752 2.44208 14.8752 2.83324L14.8753 3.95653C14.8754 4.14444 14.8007 4.32464 14.6679 4.45751L10.1243 9.00086C9.99145 9.13367 9.91679 9.31387 9.91679 9.50172V13.9678C9.91679 14.4286 9.48371 14.7668 9.03668 14.655L7.62002 14.3008C7.30467 14.222 7.08346 13.9387 7.08346 13.6136V9.50172C7.08346 9.31387 7.00883 9.13367 6.87598 9.00086L2.33259 4.45746C2.19975 4.32463 2.12512 4.14446 2.12512 3.9566V2.83333C2.12512 2.44213 2.44225 2.125 2.83346 2.125Z"
                    stroke="black"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="w-8 h-8 bg-[#F8F8F7] rounded-full flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 19 19" fill="none">
                  <path
                    d="M13.4584 13.4584L16.625 16.625"
                    stroke="black"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.375 8.70833C2.375 12.2062 5.21053 15.0417 8.70833 15.0417C10.4603 15.0417 12.0461 14.3304 13.1927 13.1807C14.3353 12.0351 15.0417 10.4542 15.0417 8.70833C15.0417 5.21053 12.2062 2.375 8.70833 2.375C5.21053 2.375 2.375 5.21053 2.375 8.70833Z"
                    stroke="black"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={`mb-3 rounded-2xl p-3 cursor-pointer transition-colors ${
                conv.id === selectedConversation ? "bg-black/[0.04]" : "hover:bg-black/[0.02]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-[#D9D9D9] rounded-full"></div>
                  {conv.isWidget && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm text-black flex items-center gap-1">
                      {conv.name}
                      {conv.isWidget && (
                        <span className="text-xs text-blue-600">(Widget)</span>
                      )}
                    </h3>
                    <span className="text-xs text-[#ACACAC]">{conv.time}</span>
                  </div>
                  <p className="text-sm text-black truncate">
                    {conv.lastMessage}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${conv.status === "online" ? "bg-green-500" : "bg-gray-400"}`}></div>
                      <span className="text-xs text-[#ACACAC]">{conv.status}</span>
                    </div>
                    {conv.unread > 0 && (
                      <Badge className="bg-red-500 text-white text-xs">
                        {conv.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Panel - Messages (Flexible width) */}
      <div className="flex-1 flex flex-col bg-[#FBFBF9] rounded-[20px] mx-3 mt-3 mb-5 min-w-0">
        {/* Chat Header */}
        <div className="p-4 border-b border-[#F1F1F1]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2"
                onClick={() => setShowConversations(true)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
              <h2 className="text-lg font-medium text-[#363636]">
                {currentConversation
                  ? `Mensagens de ${currentConversation.name}${currentConversation.isWidget ? " (Widget)" : ""}`
                  : "Selecione uma conversa"}
              </h2>
              {currentConversation && (
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${currentConversation.status === "online" ? "bg-green-500" : "bg-gray-400"}`}></div>
                  <span className="text-sm text-[#ACACAC]">{currentConversation.status}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-2 py-1 rounded-full text-xs ${
                connectionStatus === "connected" 
                  ? "bg-green-100 text-green-800" 
                  : connectionStatus === "connecting" 
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {connectionStatus === "connected" ? "🟢 Online" : connectionStatus === "connecting" ? "🟡 Conectando" : "🔴 Offline"}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadTranscript}
                className="text-[#363636]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="7,10 12,15 17,10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="12"
                    y1="15"
                    x2="12"
                    y2="3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="xl:hidden p-2"
                onClick={() => setShowSidebar(true)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "support" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl p-3 ${
                  msg.sender === "support"
                    ? "bg-black text-white"
                    : "bg-white border border-[#F1F1F1]"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender === "support"
                      ? "text-gray-300"
                      : "text-[#ACACAC]"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Area */}
        <div className="p-4 border-t border-[#F1F1F1]">
          <div className="flex items-center gap-3 bg-white border border-[#F1F1F1] rounded-full px-4 py-2">
            <div className="flex gap-2">
              <button className="w-8 h-8 bg-[#F8F8F7] rounded-full flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M6.99999 0C5.52307 0 4.32153 1.20157 4.32153 2.67846V11.9475C4.32153 13.0792 5.24231 14 6.37406 14C7.50582 14 8.4266 13.0792 8.4266 11.9475V3.34991C8.4266 2.57534 7.79643 1.94513 7.02181 1.94513C6.24724 1.94513 5.61705 2.57532 5.61705 3.34991V11.4686H6.4742V3.34991C6.4742 3.04798 6.71985 2.80227 7.02184 2.80227C7.32382 2.80227 7.56948 3.04795 7.56948 3.34991V11.9474C7.56948 12.6066 7.03321 13.1428 6.37406 13.1428C1.71516 13.1428 1.17892 12.6066 1.17892 11.9474V2.67846C1.17892 1.6742 1.99595 0.857145 6.99999 0.857145C8.00427 0.857145 8.8213 1.6742 8.8213 2.67846V11.4686H9.67845V2.67846C9.67845 1.20157 8.47691 0 6.99999 0Z"
                    fill="black"
                  />
                </svg>
              </button>
              <button className="w-8 h-8 bg-[#F8F8F7] rounded-full flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 17 17" fill="none">
                  <path
                    d="M8.49996 15.5834C4.58794 15.5834 1.41663 12.412 1.41663 8.50002C1.41663 4.588 4.58794 1.41669 8.49996 1.41669C12.4119 1.41669 15.5833 4.588 15.5833 8.50002C15.5833 12.412 12.4119 15.5834 8.49996 15.5834Z"
                    stroke="black"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.6875 10.2708C11.6875 10.2708 10.625 11.6875 8.5 11.6875C6.375 11.6875 5.3125 10.2708 5.3125 10.2708"
                    stroke="black"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.9792 6.37502C10.7836 6.37502 10.625 6.21645 10.625 6.02085C10.625 5.82525 10.7836 5.66669 10.9792 5.66669C11.1747 5.66669 11.3333 5.82525 11.3333 6.02085C11.3333 6.21645 11.1747 6.37502 10.9792 6.37502Z"
                    fill="black"
                    stroke="black"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.02079 6.37502C5.82519 6.37502 5.66663 6.21645 5.66663 6.02085C5.66663 5.82525 5.82519 5.66669 6.02079 5.66669C6.21639 5.66669 6.37496 5.82525 6.37496 6.02085C6.37496 6.21645 6.21639 6.37502 6.02079 6.37502Z"
                    fill="black"
                    stroke="black"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="border-0 bg-transparent text-sm placeholder:text-[#9B9B9B] focus-visible:ring-0 px-0"
            />

            <Button
              onClick={() => sendMessage()}
              size="sm"
              className="w-8 h-8 bg-[#D9D9D9] rounded-full p-0 hover:bg-[#C9C9C9]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 21 21"
                fill="none"
                className="rotate-[-90deg]"
              >
                <path
                  d="M10.5 18.375L10.5 2.625M10.5 2.625L3.0625 10.0625M10.5 2.625L17.9375 10.0625"
                  stroke="#989898"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 xl:hidden"
          onClick={() => setShowSidebar(false)}
        >
          <div
            className="w-[300px] bg-[#FBFBF9] h-full ml-auto rounded-l-[20px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-medium text-[#363636]">Geral</h3>
                  <h3 className="text-lg font-medium text-[#363636]">
                    Copilot
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(false)}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-white rounded-lg border border-[#F1F1F1]">
                  <h4 className="font-medium text-sm mb-2">Status do Chat</h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${connectionStatus === "connected" ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span className="text-xs text-[#363636]">{connectionStatus === "connected" ? "Online" : "Offline"}</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-[#F1F1F1]">
                  <h4 className="font-medium text-sm mb-2">WebSocket</h4>
                  <div className="text-xs text-[#363636]">
                    Status: {connectionStatus}
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-[#F1F1F1]">
                  <h4 className="font-medium text-sm mb-2">Configurações</h4>
                  <button
                    onClick={downloadTranscript}
                    className="text-xs text-blue-600 hover:underline block mb-1"
                  >
                    Baixar transcrição
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Right Panel - Sidebar (Desktop: 300px width) */}
      <div className="w-[300px] bg-[#FBFBF9] rounded-l-[20px] hidden xl:block mr-5 mt-3 mb-5">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-medium text-[#363636]">Geral</h3>
              <h3 className="text-lg font-medium text-[#363636]">Copilot</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-white rounded-lg border border-[#F1F1F1]">
              <h4 className="font-medium text-sm mb-2">Status do Chat</h4>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${connectionStatus === "connected" ? "bg-green-500" : "bg-red-500"}`}></div>
                <span className="text-xs text-[#363636]">{connectionStatus === "connected" ? "Online" : "Offline"}</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-[#F1F1F1]">
              <h4 className="font-medium text-sm mb-2">WebSocket Status</h4>
              <div className="text-xs text-[#363636] space-y-1">
                <div>Conexão: {connectionStatus}</div>
                <div>Conversas ativas: {conversations.length}</div>
                <div>Widget conversations: {conversations.filter(c => c.isWidget).length}</div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-[#F1F1F1]">
              <h4 className="font-medium text-sm mb-2">Usuário Atual</h4>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#D9D9D9] rounded-full"></div>
                <span className="text-xs text-[#363636]">
                  {currentConversation?.name || "Nenhum usuário"}
                </span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-[#F1F1F1]">
              <h4 className="font-medium text-sm mb-2">Configurações</h4>
              <button
                onClick={downloadTranscript}
                className="text-xs text-blue-600 hover:underline block mb-1"
              >
                Baixar transcrição
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat Widget - Floating (Design baseado no HTML fornecido) */}
      <div className="fixed bottom-5 right-5 z-[1000] flex flex-col items-end">
        {/* Preview Bubble */}
        {!isWidgetOpen && (
          <div className="relative bg-white rounded-[22px] shadow-[0_0_21.2px_6px_rgba(0,0,0,0.02)] p-[15px_20px] mb-[15px] cursor-pointer opacity-0 translate-y-[10px] transition-all duration-[0.4s] ease-out pointer-events-none">
            <div className="hidden absolute -top-[10px] right-[10px] bg-black text-white px-3 py-1 text-xs font-medium rounded-[59px]">
              close
            </div>
            <div className="flex items-center">
              <div className="w-[35px] h-[35px] bg-[#E9E9E9] rounded-full mr-[15px] flex-shrink-0"></div>
              <div>
                <div className="text-[15px] text-black font-medium">Nova mensagem</div>
                <div className="text-[13px] text-[#8A8A8A] mt-1">Suporte • agora</div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Container */}
        {isWidgetOpen && (
          <div className="w-[370px] h-[630px] bg-white rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden mb-[15px] opacity-100 translate-y-0 transition-all duration-300 ease-out" style={{fontFamily: "'Saans TRIAL', sans-serif"}}>
            {/* Home View */}
            {!showWidgetChat ? (
              <div className="flex flex-col p-[30px_25px] h-full">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
                      <path d="M25 75C25 58.4315 38.4315 45 55 45C71.5685 45 85 58.4315 85 75" stroke="black" strokeWidth="10" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="flex">
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-[#FF8F8F] z-[2]"></div>
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-[#82CFFF] -ml-[10px] z-[1]"></div>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-[30px]">
                  <h1 className="text-[28px] font-medium leading-[1.3] text-black">
                    Olá! Como podemos te ajudar hoje?
                  </h1>
                  <p className="text-[15px] text-[#8A8A8A] mt-[10px] font-normal">
                    Fale conosco, estamos prontos para atender você.
                  </p>

                  {/* Copilot Button */}
                  <div 
                    onClick={() => setShowWidgetChat(true)}
                    className="flex items-center justify-between bg-black text-white rounded-[14px] p-4 mt-[25px] cursor-pointer"
                  >
                    <div>
                      <h2 className="font-medium text-[15px]">Pergunte ao Copilot</h2>
                      <p className="text-[13px] opacity-70 mt-1 font-normal">Responde em minutos</p>
                    </div>
                    <div>
                      <svg width="33" height="33" viewBox="0 0 33 33" fill="none">
                        <path d="M30.4597 4.88562L15.3686 28.881L13.0719 17.0607L2.75 10.8596L30.4597 4.88562Z" stroke="white" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13.0015 17.1099L30.4596 4.88562" stroke="white" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Knowledge Base */}
                  <div className="mt-[30px]">
                    <h3 className="text-[15px] text-[#8A8A8A] mb-[15px] font-normal">Nossa base de conhecimento</h3>
                    <button className="w-full text-left p-4 rounded-[14px] border border-[#EAEAEA] bg-white text-[15px] text-black cursor-pointer mb-3 font-normal transition-colors hover:bg-[#F9F9F9]">
                      Como criar uma conta de Email
                    </button>
                    <button className="w-full text-left p-4 rounded-[14px] border border-[#EAEAEA] bg-white text-[15px] text-black cursor-pointer mb-3 font-normal transition-colors hover:bg-[#F9F9F9]">
                      Configurar dns do domínio
                    </button>
                    <button className="w-full text-left p-4 rounded-[14px] border border-[#EAEAEA] bg-white text-[15px] text-black cursor-pointer mb-3 font-normal transition-colors hover:bg-[#F9F9F9]">
                      Acessar base de conhecimento
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Chat View */
              <div className="flex flex-col h-full">
                {/* Chat Header */}
                <div className="flex items-center p-[20px_25px] border-b border-[#EDEDED]">
                  <div 
                    onClick={() => setShowWidgetChat(false)}
                    className="cursor-pointer text-black flex items-center"
                  >
                    <svg width="33" height="33" strokeWidth="0.8" viewBox="0 0 24 24" fill="none">
                      <path d="M15 6L9 12L15 18" stroke="black" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="w-10 h-10 bg-[#E9E9E9] rounded-full mx-3"></div>
                  <div className="flex-grow">
                    <div className="font-medium text-base text-black">Equipa de Suporte</div>
                    <div className="text-[13px] text-[#8A8A8A] font-normal">Responde em minutos</div>
                  </div>
                  <div className="relative">
                    <div className="cursor-pointer text-black flex items-center">
                      <svg width="33" height="33" viewBox="0 0 33 33" fill="none">
                        <path d="M25.2623 19.1925C26.1955 19.1925 26.9523 18.4357 26.9523 17.5025C26.9523 16.5693 26.1955 15.8125 25.2623 15.8125C24.329 15.8125 23.5723 16.5693 23.5723 17.5025C23.5723 18.4357 24.329 19.1925 25.2623 19.1925Z" fill="#7A7A7A" stroke="#7A7A7A" strokeWidth="1.1"/>
                        <path d="M15.8824 19.1925C16.8156 19.1925 17.5724 18.4357 17.5724 17.5025C17.5724 16.5693 16.8156 15.8125 15.8824 15.8125C14.9492 15.8125 14.1924 16.5693 14.1924 17.5025C14.1924 18.4357 14.9492 19.1925 15.8824 19.1925Z" fill="#7A7A7A" stroke="#7A7A7A" strokeWidth="1.1"/>
                        <path d="M6.5025 19.1925C7.43585 19.1925 8.1925 18.4357 8.1925 17.5025C8.1925 16.5693 7.43585 15.8125 6.5025 15.8125C5.56915 15.8125 4.8125 16.5693 4.8125 17.5025C4.8125 18.4357 5.56915 19.1925 6.5025 19.1925Z" fill="#7A7A7A" stroke="#7A7A7A" strokeWidth="1.1"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Chat Body */}
                <div className="flex-grow p-5 overflow-y-auto flex flex-col">
                  <div className="flex flex-col mb-[18px] max-w-[80%] self-start items-start">
                    <div className="p-[12px_16px] text-[15px] leading-[1.5] font-normal bg-[#F1F1F1] text-black rounded-[18px_18px_18px_5px]">
                      Olá! Como posso ajudá-lo hoje?
                    </div>
                    <div className="text-[11px] text-[#8A8A8A] mt-[6px] font-normal pl-[5px]">
                      Agora
                    </div>
                  </div>
                  
                  {conversations.find(c => c.isWidget)?.messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col mb-[18px] max-w-[80%] ${msg.sender === "support" ? "self-end items-end" : "self-start items-start"}`}>
                      <div className={`p-[12px_16px] text-[15px] leading-[1.5] font-normal ${
                        msg.sender === "support" 
                          ? "bg-black text-white rounded-[18px_18px_5px_18px]"
                          : "bg-[#F1F1F1] text-black rounded-[18px_18px_18px_5px]"
                      }`}>
                        {msg.text}
                      </div>
                      <div className={`text-[11px] text-[#8A8A8A] mt-[6px] font-normal ${msg.sender === "support" ? "pr-[5px]" : "pl-[5px]"}`}>
                        {msg.time}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Footer */}
                <div className="p-[14px] bg-white border-2 border-[#F1F1F1] w-[83%] rounded-[27px] mx-auto mb-3 relative">
                  <div className="flex items-center bg-transparent rounded-[25px] p-0">
                    <Input
                      value={widgetMessage}
                      onChange={(e) => setWidgetMessage(e.target.value)}
                      onKeyPress={handleWidgetKeyPress}
                      placeholder="Digite sua mensagem..."
                      className="flex-grow border-none outline-none bg-transparent text-[15px] text-black font-normal placeholder:text-[#8A8A8A] focus-visible:ring-0 shadow-none"
                    />
                    <div className="flex items-center gap-[6px] mx-[6px]">
                      <div className="cursor-pointer text-[#5F5F5F] flex items-center">
                        <svg width="6" height="14" viewBox="0 0 6 14" fill="none">
                          <path d="M3.00023 0C1.52332 0 0.321777 1.20157 0.321777 2.67846V11.9475C0.321777 13.0792 1.24255 14 2.37431 14C3.50607 14 4.42684 13.0792 4.42684 11.9475V3.34991C4.42684 2.57534 3.79668 1.94513 3.02205 1.94513C2.24749 1.94513 1.6173 2.57532 1.6173 3.34991V11.4686H2.47444V3.34991C2.47444 3.04798 2.7201 2.80227 3.02208 2.80227C3.32407 2.80227 3.56972 3.04795 3.56972 3.34991V11.9474C3.56972 12.6066 3.03346 13.1428 2.37431 13.1428C1.71516 13.1428 1.17892 12.6066 1.17892 11.9474V2.67846C1.17892 1.6742 1.99595 0.857145 3.00023 0.857145C4.00452 0.857145 4.82155 1.6742 4.82155 2.67846V11.4686H5.67869V2.67846C5.67869 1.20157 4.47715 0 3.00023 0Z" fill="black"/>
                        </svg>
                      </div>
                      <div className="cursor-pointer text-[#5F5F5F] flex items-center">
                        <svg width="20" height="20" strokeWidth="0.8" viewBox="0 0 24 24" fill="none">
                          <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22Z" stroke="black" strokeWidth="0.8"/>
                          <path d="M16.5 14.5C16.5 14.5 15 16.5 12 16.5C9 16.5 7.5 14.5 7.5 14.5" stroke="black" strokeWidth="0.8"/>
                          <path d="M15.5 9C15.2239 9 15 8.77614 15 8.5C15 8.22386 15.2239 8 15.5 8C15.7761 8 16 8.22386 16 8.5C16 8.77614 15.7761 9 15.5 9Z" fill="black" stroke="black" strokeWidth="0.8"/>
                          <path d="M8.5 9C8.22386 9 8 8.77614 8 8.5C8 8.22386 8.22386 8 8.5 8C8.77614 8 9 8.22386 9 8.5C9 8.77614 8.77614 9 8.5 9Z" fill="black" stroke="black" strokeWidth="0.8"/>
                        </svg>
                      </div>
                    </div>
                    <div 
                      onClick={sendWidgetMessage}
                      className="w-[38px] h-[38px] bg-black text-white rounded-full flex justify-center items-center cursor-pointer transition-transform hover:scale-110 flex-shrink-0 ml-2"
                    >
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                        <path d="M8.49984 14.875L8.49984 2.125M8.49984 2.125L2.479 8.14583M8.49984 2.125L14.5207 8.14583" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Widget Toggle Button */}
        <div
          className="w-[60px] h-[60px] bg-black text-white rounded-full flex justify-center items-center cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-transform hover:scale-110"
          onClick={() => setIsWidgetOpen(!isWidgetOpen)}
        >
          <div className={`absolute transition-all duration-200 flex items-center justify-center ${isWidgetOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`}>
            <svg width="33" height="33" strokeWidth="0.8" viewBox="0 0 24 24" fill="none">
              <path d="M8 10L12 10L16 10" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 14L10 14L12 14" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={`absolute transition-all duration-200 flex items-center justify-center ${isWidgetOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`}>
            <svg width="33" height="33" strokeWidth="0.8" viewBox="0 0 24 24" fill="none">
              <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

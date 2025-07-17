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
}

export default function Index() {
  const [selectedConversation, setSelectedConversation] = useState("1");
  const [message, setMessage] = useState("");
  const [showConversations, setShowConversations] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      name: "John Doe",
      lastMessage: "Hello, please help me. For lorem impsun dolor....",
      time: "1 minute ago",
      unread: 2,
      avatar: "",
      selected: true,
      messages: [
        {
          id: "1",
          text: "Hello, please help me. For lorem impsun dolor lorem impsum?",
          sender: "user",
          time: "1 minute ago",
          timestamp: Date.now() - 60000,
        },
        {
          id: "2",
          text: "Hi, yes, my name is john",
          sender: "support",
          time: "1 minute ago",
          timestamp: Date.now() - 30000,
        },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "support",
      time: "now",
      timestamp: Date.now(),
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: message,
              time: "now",
            }
          : conv,
      ),
    );

    setMessage("");

    // Simulate user response after 3 seconds
    setTimeout(() => {
      const autoReply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your help! That's exactly what I needed.",
        sender: "user",
        time: "now",
        timestamp: Date.now(),
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation
            ? {
                ...conv,
                messages: [...conv.messages, autoReply],
                lastMessage: autoReply.text,
                time: "now",
                unread: conv.unread + 1,
              }
            : conv,
        ),
      );
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
                    <div className="w-8 h-8 bg-[#D9D9D9] rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm text-black">
                          {conv.name}
                        </h3>
                        <span className="text-xs text-[#ACACAC]">
                          {conv.time}
                        </span>
                      </div>
                      <p className="text-sm text-black truncate">
                        {conv.lastMessage}
                      </p>
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
                conv.selected ? "bg-black/[0.04]" : "hover:bg-black/[0.02]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#D9D9D9] rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm text-black">
                      {conv.name}
                    </h3>
                    <span className="text-xs text-[#ACACAC]">{conv.time}</span>
                  </div>
                  <p className="text-sm text-black truncate">
                    {conv.lastMessage}
                  </p>
                  {conv.unread > 0 && (
                    <Badge className="bg-red-500 text-white text-xs mt-1">
                      {conv.unread}
                    </Badge>
                  )}
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
                  ? `Mensagens de ${currentConversation.name}`
                  : "Selecione uma conversa"}
              </h2>
            </div>
            <div className="flex items-center gap-2">
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
                    d="M6.99999 0C5.52307 0 4.32153 1.20157 4.32153 2.67846V11.9475C4.32153 13.0792 5.24231 14 6.37406 14C7.50582 14 8.4266 13.0792 8.4266 11.9475V3.34991C8.4266 2.57534 7.79643 1.94513 7.02181 1.94513C6.24724 1.94513 5.61705 2.57532 5.61705 3.34991V11.4686H6.4742V3.34991C6.4742 3.04798 6.71985 2.80227 7.02184 2.80227C7.32382 2.80227 7.56948 3.04795 7.56948 3.34991V11.9474C7.56948 12.6066 7.03321 13.1428 6.37406 13.1428C5.71492 13.1428 5.17868 12.6066 5.17868 11.9474V2.67846C5.17868 1.6742 5.99571 0.857145 6.99999 0.857145C8.00427 0.857145 8.8213 1.6742 8.8213 2.67846V11.4686H9.67845V2.67846C9.67845 1.20157 8.47691 0 6.99999 0Z"
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
              onClick={sendMessage}
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
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-[#363636]">Online</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-[#F1F1F1]">
                  <h4 className="font-medium text-sm mb-2">Configurações</h4>
                  <button
                    onClick={downloadTranscript}
                    className="text-xs text-blue-600 hover:underline"
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
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-[#363636]">Online</span>
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
              <button
                onClick={() => setShowChatWidget(!showChatWidget)}
                className="text-xs text-blue-600 hover:underline block"
              >
                {showChatWidget ? "Ocultar" : "Mostrar"} widget
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Widget - Floating (42px circle) */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${showChatWidget ? "scale-100" : "scale-75"}`}
      >
        <div
          className="w-[42px] h-[42px] bg-black rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform"
          onClick={() => setShowChatWidget(!showChatWidget)}
        >
          <svg width="20" height="20" viewBox="0 0 33 33" fill="none">
            <path
              d="M23.375 17.1875C23.7546 17.1875 24.0625 16.8796 24.0625 16.5C24.0625 16.1204 23.7546 15.8125 23.375 15.8125C22.9954 15.8125 22.6875 16.1204 22.6875 16.5C22.6875 16.8796 22.9954 17.1875 23.375 17.1875Z"
              fill="white"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.5 17.1875C16.8796 17.1875 17.1875 16.8796 17.1875 16.5C17.1875 16.1204 16.8796 15.8125 16.5 15.8125C16.1204 15.8125 15.8125 16.1204 15.8125 16.5C15.8125 16.8796 16.1204 17.1875 16.5 17.1875Z"
              fill="white"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.625 17.1875C10.0047 17.1875 10.3125 16.8796 10.3125 16.5C10.3125 16.1204 10.0047 15.8125 9.625 15.8125C9.24531 15.8125 8.9375 16.1204 8.9375 16.5C8.9375 16.8796 9.24531 17.1875 9.625 17.1875Z"
              fill="white"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.5 30.25C24.0938 30.25 30.25 24.0938 30.25 16.5C30.25 8.90608 24.0938 2.75 16.5 2.75C8.90608 2.75 2.75 8.90608 2.75 16.5C2.75 19.0044 3.41958 21.3525 4.5895 23.375L3.4375 29.5625L9.625 28.4105C11.6474 29.5804 13.9956 30.25 16.5 30.25Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

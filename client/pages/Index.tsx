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
  status: "open" | "pending" | "resolved";
  isWidget?: boolean;
}

export default function Index() {
  const [selectedConversation, setSelectedConversation] = useState("1");
  const [message, setMessage] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [showWidgetChat, setShowWidgetChat] = useState(false);
  const [widgetMessage, setWidgetMessage] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "open" | "pending" | "resolved">("all");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
    const [showWidgetEmojiPanel, setShowWidgetEmojiPanel] = useState(false);
  const [previewMessages, setPreviewMessages] = useState<Message[]>([]);
  const [showPreviewMessages, setShowPreviewMessages] = useState(false);
  
    // Load conversations from localStorage or use default
  const loadConversations = (): Conversation[] => {
    try {
      const saved = localStorage.getItem('chat-conversations');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
    return [
    {
      id: "1",
      name: "John Doe",
      lastMessage: "Hello, please help me. For lorem impsun dolor....",
      time: "1 minute ago",
      unread: 2,
      avatar: "",
      selected: true,
      status: "open",
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
    {
      id: "2",
      name: "Maria Silva",
      lastMessage: "Need help with my account settings",
      time: "5 minutes ago",
      unread: 0,
      avatar: "",
      selected: false,
      status: "pending",
      isWidget: false,
      messages: [],
    },
    {
      id: "3",
      name: "Carlos Santos",
      lastMessage: "Thank you for the solution!",
      time: "1 hour ago",
      unread: 0,
      avatar: "",
      selected: false,
      status: "resolved",
      isWidget: false,
      messages: [],
    },
    {
      id: "4",
      name: "Ana Costa",
      lastMessage: "Can you help me with billing?",
      time: "2 hours ago",
      unread: 1,
      avatar: "",
      selected: false,
      status: "open",
      isWidget: false,
      messages: [],
    }
    ];
  };

  const [conversations, setConversations] = useState<Conversation[]>(loadConversations());

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('chat-conversations', JSON.stringify(conversations));
    } catch (error) {
      console.error('Failed to save conversations:', error);
    }
  }, [conversations]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connected");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const sendMessage = () => {
    const text = message.trim();
    if (!text) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: "support",
      time: "now",
      timestamp: Date.now(),
      conversationId: selectedConversation,
    };

        setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: text,
              time: "now",
            }
          : conv,
      ),
    );

    // Show preview message if this is an operator sending to a widget conversation
    const targetConversation = conversations.find(c => c.id === selectedConversation);
    if (targetConversation?.isWidget && newMessage.sender === "support") {
      showPreviewMessage(newMessage);
    }

    setMessage("");
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
        status: "open",
        isWidget: true,
        messages: [],
      };

      setConversations(prev => [newConversation, ...prev]);
      widgetConversation = newConversation;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: "user", // Corrected: widget messages are from user
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
  };

  const handleWidgetKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendWidgetMessage();
    }
  };

  const handleFilterSelect = (filter: "all" | "open" | "pending" | "resolved") => {
    setSelectedFilter(filter);
    setShowFilterDropdown(false);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesFilter = selectedFilter === "all" || conv.status === selectedFilter;
    const matchesSearch = !searchQuery || conv.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file upload in widget
      const fileMessage: Message = {
        id: Date.now().toString(),
        text: `📎 ${file.name}`,
        sender: "user",
        time: "now",
        timestamp: Date.now(),
        conversationId: conversations.find(c => c.isWidget)?.id || "",
      };

      if (conversations.find(c => c.isWidget)) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.isWidget
              ? {
                  ...conv,
                  messages: [...conv.messages, fileMessage],
                  lastMessage: `📎 ${file.name}`,
                  time: "now",
                }
              : conv,
          ),
        );
      }
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '👍', '👎', '✌️', '🤞', '🤟', '🤘', '🤙', '👌', '🙌', '👏', '🙏', '❤️', '💕', '💖', '💗', '����', '💚', '💛', '🧡', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💯', '🔥', '✨', '🎉', '🎊'];

  const handleEmojiSelect = (emoji: string) => {
    setWidgetMessage(prev => prev + emoji);
    setShowWidgetEmojiPanel(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'resolved': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

    const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Aberto';
      case 'pending': return 'Pendente';
      case 'resolved': return 'Resolvido';
      default: return status;
    }
  };

    const handleClosePreviewMessages = () => {
    setShowPreviewMessages(false);
    setTimeout(() => {
      setPreviewMessages([]);
    }, 300); // Wait for fade out animation
  };

    const showPreviewMessage = (message: Message) => {
    // Only show preview for support/operator messages when widget is closed
    if (!isWidgetOpen && message.sender === "support") {
      setPreviewMessages(prev => {
        const newMessages = [...prev, message];
        return newMessages.slice(-2); // Keep only last 2 messages
      });
      setShowPreviewMessages(true);

      // Auto-hide preview after 5 seconds
      setTimeout(() => {
        setShowPreviewMessages(false);
        setTimeout(() => setPreviewMessages([]), 300);
      }, 5000);
    }
  };

    const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000 / 60);
    if (diff < 1) return 'agora';
    if (diff === 1) return 'há 1 minuto';
    return `há ${diff} minutos`;
  };

  const generateAvatarUrl = (seed: string) => {
    return `https://tapback.co/api/avatar.webp?seed=${encodeURIComponent(seed)}`;
  };

  return (
    <div className="h-screen bg-[#EFF0EB] flex relative overflow-hidden" style={{fontFamily: "'Saans TRIAL', -apple-system, Roboto, Helvetica, sans-serif"}}>
      {/* Hidden file input for widget */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        >
          <div className="w-72 h-full bg-[#FBFBF9] flex flex-col">
            <div className="p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(false)}
                className="mb-4"
              >
                ✕ Fechar
              </Button>
            </div>
            {/* Navigation Icons */}
            <div className="flex flex-col gap-4 px-4">
              <div className="w-[42px] h-[42px] bg-white rounded-lg border border-[#F1F1F1] shadow-[0_0_9.2px_rgba(0,0,0,0.13)] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M3.87 1.8C2.74706 1.8 1.8 2.74706 1.8 3.87V8.82H3.87C5.00736 8.82 6.02118 9.44646 6.5391 10.3494C7.02816 11.1857 7.91916 11.79 9 11.79C10.073 11.79 10.9588 11.1945 11.4502 10.3676C11.9972 9.30372 13.0615 8.82 14.13 8.82H17.1C17.597 8.82 18 9.22296 18 9.72V14.13C18 16.247 16.247 18 14.13 18H3.87C1.75294 18 0 16.247 0 14.13V3.87C0 1.75294 1.75294 0 3.87 0H14.22C16.2648 0 18 1.7709 18 3.87V6.84C18 7.33704 17.597 7.74 17.1 7.74C16.603 7.74 16.2 7.33704 16.2 6.84V3.87C16.2 2.7291 15.2352 1.8 14.22 1.8H3.87ZM1.8 10.62V14.13C1.8 15.253 2.74706 16.2 3.87 16.2H14.13C15.253 16.2 16.2 15.253 16.2 14.13V10.62H14.13C13.5884 10.62 13.2226 10.8472 13.045 11.2025C13.0363 11.2198 13.0271 11.2368 13.0174 11.2535C12.2461 12.5757 10.7979 13.59 9 13.59C7.2021 13.59 5.75388 12.5757 4.98258 11.2535L4.97856 11.2465C4.77576 10.8917 4.35096 10.62 3.87 10.62H1.8Z" fill="#464646"/>
                </svg>
              </div>
              <div className="w-[42px] h-[42px] bg-transparent rounded-lg flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M4.58337 18.3333V17.4167C4.58337 13.8728 7.45622 11 11 11C14.5439 11 17.4167 13.8728 17.4167 17.4167V18.3333" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 11C13.025 11 14.6667 9.3583 14.6667 7.33329C14.6667 5.30825 13.025 3.66663 11 3.66663C8.975 3.66663 7.33337 5.30825 7.33337 7.33329C7.33337 9.3583 8.975 11 11 11Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

            {/* 1. Menu Column (Left Navigation) */}
            <div className="w-[70px] bg-transparent border-r border-[#F4F4F4] hidden lg:flex flex-col items-center flex-shrink-0 h-full relative">
        {/* Logo at top */}
        <div className="mt-12 mb-8">
          <svg width="21" height="21" viewBox="0 0 22 22" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M2.66101 4.68274C2.66101 3.35381 3.73833 2.27649 5.06726 2.27649H17.3173C18.6462 2.27649 19.7235 3.35381 19.7235 4.68274V13.4327C19.7235 14.7617 18.6462 15.839 17.3173 15.839H7.65835C7.32611 15.839 7.01186 15.99 6.80428 16.2495L4.76467 18.7989C4.06715 19.6709 2.66101 19.1777 2.66101 18.0611V4.68274Z" fill="black"/>
          </svg>
        </div>

        {/* Navigation Icons in middle */}
        <div className="flex flex-col gap-4">
          <div className="w-[42px] h-[42px] bg-white rounded-lg border border-[#F1F1F1] shadow-[0_0_9.2px_rgba(0,0,0,0.13)] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M3.87 1.8C2.74706 1.8 1.8 2.74706 1.8 3.87V8.82H3.87C5.00736 8.82 6.02118 9.44646 6.5391 10.3494C7.02816 11.1857 7.91916 11.79 9 11.79C10.073 11.79 10.9588 11.1945 11.4502 10.3676C11.9972 9.30372 13.0615 8.82 14.13 8.82H17.1C17.597 8.82 18 9.22296 18 9.72V14.13C18 16.247 16.247 18 14.13 18H3.87C1.75294 18 0 16.247 0 14.13V3.87C0 1.75294 1.75294 0 3.87 0H14.22C16.2648 0 18 1.7709 18 3.87V6.84C18 7.33704 17.597 7.74 17.1 7.74C16.603 7.74 16.2 7.33704 16.2 6.84V3.87C16.2 2.7291 15.2352 1.8 14.22 1.8H3.87ZM1.8 10.62V14.13C1.8 15.253 2.74706 16.2 3.87 16.2H14.13C15.253 16.2 16.2 15.253 16.2 14.13V10.62H14.13C13.5884 10.62 13.2226 10.8472 13.045 11.2025C13.0363 11.2198 13.0271 11.2368 13.0174 11.2535C12.2461 12.5757 10.7979 13.59 9 13.59C7.2021 13.59 5.75388 12.5757 4.98258 11.2535L4.97856 11.2465C4.77576 10.8917 4.35096 10.62 3.87 10.62H1.8Z" fill="#464646"/>
            </svg>
          </div>

          <div className="w-[42px] h-[42px] bg-transparent rounded-lg flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M4.58337 18.3333V17.4167C4.58337 13.8728 7.45622 11 11 11C14.5439 11 17.4167 13.8728 17.4167 17.4167V18.3333" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 11C13.025 11 14.6667 9.3583 14.6667 7.33329C14.6667 5.30825 13.025 3.66663 11 3.66663C8.975 3.66663 7.33337 5.30825 7.33337 7.33329C7.33337 9.3583 8.975 11 11 11Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Profile image at bottom */}
        <div className="absolute bottom-8 relative">
          <img
            src={generateAvatarUrl('operator-main')}
            alt="Operator Profile"
            className="w-[34px] h-[34px] rounded-full object-cover"
          />
          <div className="w-2 h-2 bg-[#2EBA85] rounded-full border border-white absolute -bottom-1 -right-1"></div>
        </div>
      </div>

            {/* 2. Message List Column (Conversations) */}
      <div className="w-[386px] bg-[#FBFBF9] flex flex-col rounded-[33px] overflow-hidden ml-[15px] mt-4 mb-5 flex-shrink-0 hidden lg:flex">
        {/* Header */}
        <div className="px-5 pt-[29px] pb-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[20px] font-medium text-[#363636]">Conversas</h1>
            <div className="flex gap-2 items-center">
              {/* Filter Dropdown */}
              <div className="relative">
                <div 
                  className={`w-[34px] h-[34px] bg-[#F8F8F7] rounded-[17px] flex items-center justify-center cursor-pointer transition-all duration-300 ${showSearch ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                >
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path d="M2.83346 2.125H14.1669C14.5581 2.125 14.8752 2.44208 14.8752 2.83324L14.8753 3.95653C14.8754 4.14444 14.8007 4.32464 14.6679 4.45751L10.1243 9.00086C9.99145 9.13367 9.91679 9.31387 9.91679 9.50172V13.9678C9.91679 14.4286 9.48371 14.7668 9.03668 14.655L7.62002 14.3008C7.30467 14.222 7.08346 13.9387 7.08346 13.6136V9.50172C7.08346 9.31387 7.00883 9.13367 6.87598 9.00086L2.33259 4.45746C2.19975 4.32463 2.12512 4.14446 2.12512 3.9566V2.83333C2.12512 2.44213 2.44225 2.125 2.83346 2.125Z" stroke="black" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {showFilterDropdown && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-[#F1F1F1] rounded-lg shadow-lg z-10 min-w-[120px]">
                    <div 
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                      onClick={() => handleFilterSelect("all")}
                    >
                      Todos
                    </div>
                    <div 
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                      onClick={() => handleFilterSelect("open")}
                    >
                      Aberto
                    </div>
                    <div 
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                      onClick={() => handleFilterSelect("pending")}
                    >
                      Pendente
                    </div>
                    <div 
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                      onClick={() => handleFilterSelect("resolved")}
                    >
                      Resolvido
                    </div>
                  </div>
                )}
              </div>

              {/* Search Toggle */}
              <div 
                className="w-[34px] h-[34px] bg-[#F8F8F7] rounded-[17px] flex items-center justify-center cursor-pointer"
                onClick={handleSearchToggle}
              >
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                  <path d="M13.4584 13.4584L16.625 16.625" stroke="black" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.375 8.70833C2.375 12.2062 5.21053 15.0417 8.70833 15.0417C10.4603 15.0417 12.0461 14.3304 13.1927 13.1807C14.3353 12.0351 15.0417 10.4542 15.0417 8.70833C15.0417 5.21053 12.2062 2.375 8.70833 2.375C5.21053 2.375 2.375 5.21053 2.375 8.70833Z" stroke="black" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div className="w-[34px] h-[34px] bg-[#F8F8F7] rounded-[17px] flex items-center justify-center">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M3.655 1.7C2.59444 1.7 1.7 2.59444 1.7 3.655V8.33H3.655C4.72917 8.33 5.68667 8.92166 6.17582 9.77443C6.63771 10.5643 7.47921 11.135 8.5 11.135C9.51337 11.135 10.35 10.5726 10.814 9.79166C11.3307 8.78685 12.3359 8.33 13.345 8.33H16.15C16.6194 8.33 17 8.71057 17 9.18V13.345C17 15.3444 15.3444 17 13.345 17H3.655C1.65556 17 0 15.3444 0 13.345V3.655C0 1.65556 1.65556 0 3.655 0H13.43C15.3612 0 17 1.67252 17 3.655V6.46C17 6.92943 16.6194 7.31 16.15 7.31C15.6806 7.31 15.3 6.92943 15.3 6.46V3.655C15.3 2.57748 14.3888 1.7 13.43 1.7H3.655ZM1.7 10.03V13.345C1.7 14.4056 2.59444 15.3 3.655 15.3H13.345C14.4056 15.3 15.3 14.4056 15.3 13.345V10.03H13.345C12.8335 10.03 12.488 10.2446 12.3202 10.5801C12.3121 10.5964 12.3034 10.6125 12.2942 10.6283C11.5658 11.8771 10.198 12.835 8.5 12.835C6.80198 12.835 5.43422 11.8771 4.70577 10.6283L4.70197 10.6217C4.51044 10.8866 4.10924 10.03 3.655 10.03H1.7Z" fill="black"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Search Input with Animation */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showSearch ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="mb-4">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search here..."
                className="w-full px-3 py-2 text-sm border border-[#F1F1F1] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
          {filteredConversations.map((conv, index) => (
            <div
              key={conv.id}
              onClick={() => {
                setConversations(prev => 
                  prev.map(c => ({ ...c, selected: c.id === conv.id }))
                );
                setSelectedConversation(conv.id);
              }}
              className={`rounded-[25px] p-[15px_12px] cursor-pointer transition-all ${
                conv.id === selectedConversation ? "bg-black/[0.04]" : "hover:bg-black/[0.02]"
              }`}
            >
              <div className="flex items-start gap-3">
                                <div className="relative">
                  <img
                    src={generateAvatarUrl(conv.name + conv.id)}
                    alt={`${conv.name} Profile`}
                    className="w-[36px] h-[36px] rounded-[18px] flex-shrink-0 object-cover"
                  />
                  {conv.isWidget && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-[16px] text-black">
                        {conv.name}
                      </h3>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(conv.status)}`}></div>
                    </div>
                    <span className="text-[10px] text-[#ACACAC]">
                      {conv.time}
                    </span>
                  </div>
                                    <p className="text-[14px] text-black font-normal truncate max-w-[264px]">
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

            {/* 3. Message Inbox Column (Center) */}
      <div className="flex-1 bg-[#FBFBF9] rounded-[33px] mx-3 mt-4 mb-5 flex flex-col min-w-0 w-auto max-w-[1023px]">
        {/* Header */}
        <div className="px-6 pt-[29px] pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2"
                onClick={() => setShowMobileMenu(true)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </Button>
              <h2 className="text-[20px] font-medium text-[#363636]">
                {currentConversation ? `Mensagens de ${currentConversation.name}` : "Selecione uma conversa"}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-[34px] h-[34px] bg-[#F8F8F7] rounded-[17px] flex items-center justify-center">
                  <svg width="33" height="33" viewBox="0 0 33 33" fill="none">
                    <path d="M23.4498 17.38C24.383 17.38 25.1398 16.6232 25.1398 15.69C25.1398 14.7568 24.383 14 23.4498 14C22.5165 14 21.7598 14.7568 21.7598 15.69C21.7598 16.6232 22.5165 17.38 23.4498 17.38Z" fill="#7A7A7A" stroke="#7A7A7A" strokeWidth="1.1"/>
                    <path d="M17.0699 17.38C18.0031 17.38 18.7599 16.6232 18.7599 15.69C18.7599 14.7568 18.0031 14 17.0699 14C16.1367 14 15.3799 14.7568 15.3799 15.69C15.3799 16.6232 16.1367 17.38 17.0699 17.38Z" fill="#7A7A7A" stroke="#7A7A7A" strokeWidth="1.1"/>
                    <path d="M10.69 17.38C11.6234 17.38 12.38 16.6232 12.38 15.69C12.38 14.7568 11.6234 14 10.69 14C9.75665 14 9 14.7568 9 15.69C9 16.6232 9.75665 17.38 10.69 17.38Z" fill="#7A7A7A" stroke="#7A7A7A" strokeWidth="1.1"/>
                  </svg>
                </div>
                <div className="w-[34px] h-[34px] bg-[#F8F8F7] rounded-[17px] flex items-center justify-center">
                  <div className="w-[17px] h-[17px] relative">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="absolute top-[2px] left-[2px]">
                      <path d="M0.125 6.15051C0.125 9.86437 3.13566 12.875 6.84949 12.875C9.4898 12.875 11.7747 11.3534 12.875 9.13918C6.84949 9.13918 3.86083 6.15051 3.86083 0.125C1.64665 1.22535 0.125 3.51023 0.125 6.15051Z" fill="#1B1B1B"/>
                    </svg>
                    <span className="absolute top-[-3px] left-[10px] text-[12px] font-bold text-[#1B1B1B]">z</span>
                  </div>
                </div>
                <div className="bg-[#1B1B1B] text-white px-4 py-2 rounded-[17px] text-[14px] font-normal flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M2.58 1.2C1.83137 1.2 1.2 1.83137 1.2 2.58V5.88H2.58C3.33824 5.88 4.01412 6.29764 4.3594 6.8996C4.68544 7.45716 5.27944 7.86 6 7.86C6.71532 7.86 7.30588 7.463 7.63344 6.91176C7.99812 6.20248 8.70768 5.88 9.42 5.88H11.4C11.7314 5.88 12 6.14864 12 6.48V9.42C12 10.8314 10.8314 12 9.42 12H2.58C1.16863 12 0 10.8314 0 9.42V2.58C0 1.16863 1.16863 0 2.58 0H9.48C10.8432 0 12 1.1806 12 2.58V4.56C12 4.89136 11.7314 5.16 11.4 5.16C11.0686 5.16 10.8 4.89136 10.8 4.56V2.58C10.8 1.8194 10.1568 1.2 9.48 1.2H2.58ZM1.2 7.08V9.42C1.2 10.1686 1.83137 10.8 2.58 10.8H9.42C10.1686 10.8 10.8 10.1686 10.8 9.42V7.08H9.42C9.05896 7.08 8.81508 7.23148 8.69664 7.46832C8.69088 7.47984 8.68476 7.4912 8.67828 7.50232C8.16408 8.3838 7.1986 9.06 6 9.06C4.8014 9.06 3.83592 8.3838 3.32172 7.50232L3.31904 7.49768C3.18384 7.26112 2.90064 7.08 2.58 7.08H1.2Z" fill="white"/>
                  </svg>
                  Close
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
          {currentMessages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg">Nenhuma mensagem ainda</p>
                <p className="text-sm">Comece uma conversa enviando uma mensagem</p>
              </div>
            </div>
          ) : (
            currentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[70%] rounded-[33px] p-6 ${
                    msg.sender === "user"
                      ? "bg-white border border-[#F1F1F1]"
                      : "bg-black text-white"
                  }`}
                >
                  <p className={`text-[16px] font-normal mb-3 ${msg.sender === "user" ? "text-black" : "text-white"}`}>
                    {msg.text}
                  </p>
                  <p className={`text-[12px] font-normal ${msg.sender === "user" ? "text-[#ACACAC]" : "text-[#ACACAC]"}`}>
                    {currentConversation?.name} - {msg.time}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Area */}
                <div className="p-6">
          <div className="bg-white border border-[#F1F1F1] rounded-[33px] relative h-[162px]" style={{fontFamily: "'Saans TRIAL', -apple-system, Roboto, Helvetica, sans-serif"}}>
            {/* Input Text */}
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Insira a sua mensagem"
              className="absolute top-[33px] left-[24px] right-[24px] border-0 bg-transparent text-[17px] text-[#9B9B9B] placeholder:text-[#9B9B9B] focus-visible:ring-0 px-0 font-normal h-auto"
              style={{fontWeight: 380}}
            />

            {/* Bottom Action Buttons */}
            <div className="absolute bottom-[24px] left-[24px] flex gap-2">
              <div className="w-[34px] h-[34px] bg-[#F8F8F7] rounded-[17px] flex items-center justify-center cursor-pointer hover:bg-[#EAEAEA] transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M6.99999 0C5.52307 0 4.32153 1.20157 4.32153 2.67846V11.9475C4.32153 13.0792 5.24231 14 6.37406 14C7.50582 14 8.4266 13.0792 8.4266 11.9475V3.34991C8.4266 2.57534 7.79643 1.94513 7.02181 1.94513C6.24724 1.94513 5.61705 2.57532 5.61705 3.34991V11.4686H6.4742V3.34991C6.4742 3.04798 6.71985 2.80227 7.02184 2.80227C7.32382 2.80227 7.56948 3.04795 7.56948 3.34991V11.9474C7.56948 12.6066 7.03321 13.1428 6.37406 13.1428C5.71492 13.1428 5.17868 12.6066 5.17868 11.9474V2.67846C5.17868 1.6742 5.99571 0.857145 6.99999 0.857145C8.00427 0.857145 8.8213 1.6742 8.8213 2.67846V11.4686H9.67845V2.67846C9.67845 1.20157 8.47691 0 6.99999 0Z" fill="black"/>
                </svg>
              </div>
              <div className="w-[34px] h-[34px] bg-[#F8F8F7] rounded-[17px] flex items-center justify-center cursor-pointer hover:bg-[#EAEAEA] transition-colors">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <g clipPath="url(#clip0_4_25)">
                    <path d="M8.49996 15.5834C4.58794 15.5834 1.41663 12.412 1.41663 8.50002C1.41663 4.588 4.58794 1.41669 8.49996 1.41669C12.4119 1.41669 15.5833 4.588 15.5833 8.50002C15.5833 12.412 12.4119 15.5834 8.49996 15.5834Z" stroke="black" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.6875 10.2708C11.6875 10.2708 10.625 11.6875 8.5 11.6875C6.375 11.6875 5.3125 10.2708 5.3125 10.2708" stroke="black" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.9792 6.37502C10.7836 6.37502 10.625 6.21645 10.625 6.02085C10.625 5.82525 10.7836 5.66669 10.9792 5.66669C11.1747 5.66669 11.3333 5.82525 11.3333 6.02085C11.3333 6.21645 11.1747 6.37502 10.9792 6.37502Z" fill="black" stroke="black" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.02079 6.37502C5.82519 6.37502 5.66663 6.21645 5.66663 6.02085C5.66663 5.82525 5.82519 5.66669 6.02079 5.66669C6.21639 5.66669 6.37496 5.82525 6.37496 6.02085C6.37496 6.21645 6.21639 6.37502 6.02079 6.37502Z" fill="black" stroke="black" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_4_25">
                      <rect width="17" height="17" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="w-[34px] h-[34px] bg-[#F8F8F7] rounded-[17px] flex items-center justify-center cursor-pointer hover:bg-[#EAEAEA] transition-colors">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <path d="M5.66663 9.91669H11.3333" stroke="black" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.66663 7.08331H7.08329" stroke="black" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.66663 12.75H8.49996" stroke="black" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.08337 2.12498H4.25004C3.46764 2.12498 2.83337 2.75924 2.83337 3.54165V14.1666C2.83337 14.9491 3.46764 15.5833 4.25004 15.5833H12.75C13.5325 15.5833 14.1667 14.9491 14.1667 14.1666V3.54165C14.1667 2.75924 13.5325 2.12498 12.75 2.12498H10.2709M7.08337 2.12498V0.708313M7.08337 2.12498V3.54165" stroke="black" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Send Button */}
            <div className="absolute bottom-[57px] right-[24px] w-[48px] h-[48px] bg-[#D9D9D9] rounded-[24px] flex items-center justify-center cursor-pointer hover:bg-[#CACACA] transition-colors" onClick={sendMessage}>
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" className="transform rotate-[-90deg]">
                <path d="M10.5 18.375L10.5 2.625M10.5 2.625L3.0625 10.0625M10.5 2.625L17.9375 10.0625" stroke="#989898" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Sidebar Column (Right) */}
      <div className="w-[382px] bg-[#FBFBF9] rounded-l-[33px] mr-[20px] mt-4 mb-5 flex-shrink-0 hidden xl:flex flex-col">
        {/* Header */}
        <div className="px-6 pt-[29px] pb-0">
          <div className="flex items-center gap-6 mb-6">
            <h3 className="text-[20px] font-medium text-[#363636]">Geral</h3>
            <h3 className="text-[20px] font-medium text-[#363636]">Copilot</h3>
          </div>
          <div className="w-full h-[1px] bg-[#F4F4F4] mb-6"></div>
          <div className="w-12 h-[1px] bg-[#005EFF] mb-6"></div>
        </div>

        {/* Assignee Section */}
        <div className="px-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[16px] text-[#5A5A5A] font-normal">Assignee</span>
                            <div className="flex items-center gap-2">
                                <img
                  src={generateAvatarUrl('operator-main')}
                  alt="Operator Profile"
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="text-[16px] text-black font-normal">James doe</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[16px] text-[#5A5A5A] font-normal">Team</span>
              <span className="text-[16px] text-black font-normal">Financial Team</span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#F4F4F4]"></div>

          {/* Conversation Attributes */}
          <div className="space-y-6">
            <h3 className="text-[20px] font-medium text-[#363636]">Conversation atributes</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[16px] text-[#5A5A5A] font-normal">Full name</span>
                <span className="text-[16px] text-black font-normal">{currentConversation?.name || "John Doe"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[16px] text-[#5A5A5A] font-normal">E-mail</span>
                <span className="text-[16px] text-black font-normal">johndoe@gmail.com</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[16px] text-[#5A5A5A] font-normal">Priority</span>
                <span className="text-[16px] text-black font-normal">Urgency</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[16px] text-[#5A5A5A] font-normal">Tag ID</span>
                <span className="text-[16px] text-black font-normal">123456</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[16px] text-[#5A5A5A] font-normal">Status</span>
                <span className="text-[16px] text-black font-normal">{getStatusLabel(currentConversation?.status || "open")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="px-6 mt-auto mb-6">
          <div className="flex items-center justify-end">
            <div className="w-[34px] h-[34px] bg-[#F8F8F7] rounded-[17px] flex items-center justify-center">
              <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                <path d="M15.0417 16.625H3.95833C3.08388 16.625 2.375 15.9161 2.375 15.0417V3.95833C2.375 3.08388 3.08388 2.375 3.95833 2.375H15.0417C15.9161 2.375 16.625 3.08388 16.625 3.95833V15.0417C16.625 15.9161 15.9161 16.625 15.0417 16.625Z" stroke="black" strokeWidth="1.1"/>
                <path d="M4.35409 7.91663L5.7395 9.49996L4.35409 11.0833" stroke="black" strokeWidth="1.1"/>
                <path d="M7.52075 16.625V2.375" stroke="black" strokeWidth="1.1"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat Widget - Floating (Design baseado no HTML fornecido) */}
      <div className="fixed bottom-5 right-5 z-[1000] flex flex-col items-end">
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
                    <img
                      src={generateAvatarUrl('operator-main')}
                      alt="Operator Profile"
                      className="w-7 h-7 rounded-full border-2 border-white object-cover"
                    />
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
                                                      <img
                    src={generateAvatarUrl('operator-main')}
                    alt="Operator Profile"
                    className="w-10 h-10 rounded-full mx-3 object-cover"
                  />
                  <div className="flex-grow">
                    <div className="font-medium text-base text-black">Equipa de Suporte</div>
                    <div className="text-[13px] text-[#8A8A8A] font-normal">Responde em minutos</div>
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
                    <div key={msg.id} className={`flex flex-col mb-[18px] max-w-[80%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}>
                      <div className={`p-[12px_16px] text-[15px] leading-[1.5] font-normal ${
                        msg.sender === "user" 
                          ? "bg-black text-white rounded-[18px_18px_5px_18px]"
                          : "bg-[#F1F1F1] text-black rounded-[18px_18px_18px_5px]"
                      }`}>
                        {msg.text}
                      </div>
                      <div className={`text-[11px] text-[#8A8A8A] mt-[6px] font-normal ${msg.sender === "user" ? "pr-[5px]" : "pl-[5px]"}`}>
                        {msg.time}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Emoji Panel */}
                {showWidgetEmojiPanel && (
                  <div className="absolute bottom-20 left-3 right-3 bg-white border border-[#F1F1F1] rounded-[18px] p-4 shadow-lg z-10">
                    <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto">
                      {emojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => handleEmojiSelect(emoji)}
                          className="text-lg hover:bg-gray-100 p-1 rounded"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Footer */}
                                <div className="bg-white border-2 border-[#F1F1F1] w-[83%] rounded-[33px] mx-auto mb-3 relative h-[113px]" style={{fontFamily: "'Saans TRIAL', -apple-system, Roboto, Helvetica, sans-serif"}}>
                                    {/* Input Text */}
                  <Input
                    value={widgetMessage}
                    onChange={(e) => setWidgetMessage(e.target.value)}
                    onKeyPress={handleWidgetKeyPress}
                    placeholder="Insira a sua mensagem"
                    className="absolute top-[20px] left-[20px] right-[20px] border-0 bg-transparent text-[17px] text-[#9B9B9B] placeholder:text-[#9B9B9B] focus-visible:ring-0 px-0 font-normal h-auto"
                    style={{fontWeight: 380}}
                  />

                  {/* Bottom Action Buttons */}
                  <div className="absolute bottom-[20px] left-[20px] flex gap-2">
                    <div className="flex items-center gap-[6px] mx-[6px]">
                      <div 
                        className="cursor-pointer text-[#5F5F5F] flex items-center"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <svg width="6" height="14" viewBox="0 0 6 14" fill="none">
                          <path d="M3.00023 0C1.52332 0 0.321777 1.20157 0.321777 2.67846V11.9475C0.321777 13.0792 1.24255 14 2.37431 14C3.50607 14 4.42684 13.0792 4.42684 11.9475V3.34991C4.42684 2.57534 3.79668 1.94513 3.02205 1.94513C2.24749 1.94513 1.6173 2.57532 1.6173 3.34991V11.4686H2.47444V3.34991C2.47444 3.04798 2.7201 2.80227 3.02208 2.80227C3.32407 2.80227 3.56972 3.04795 3.56972 3.34991V11.9474C3.56972 12.6066 3.03346 13.1428 2.37431 13.1428C1.71516 13.1428 1.17892 12.6066 1.17892 11.9474V2.67846C1.17892 1.6742 1.99595 0.857145 3.00023 0.857145C4.00452 0.857145 4.82155 1.6742 4.82155 2.67846V11.4686H5.67869V2.67846C5.67869 1.20157 4.47715 0 3.00023 0Z" fill="black"/>
                        </svg>
                      </div>
                      <div 
                        className="cursor-pointer text-[#5F5F5F] flex items-center"
                        onClick={() => setShowWidgetEmojiPanel(!showWidgetEmojiPanel)}
                      >
                        <svg width="20" height="20" strokeWidth="0.8" viewBox="0 0 24 24" fill="none">
                          <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22Z" stroke="black" strokeWidth="0.8"/>
                          <path d="M16.5 14.5C16.5 14.5 15 16.5 12 16.5C9 16.5 7.5 14.5 7.5 14.5" stroke="black" strokeWidth="0.8"/>
                          <path d="M15.5 9C15.2239 9 15 8.77614 15 8.5C15 8.22386 15.2239 8 15.5 8C15.7761 8 16 8.22386 16 8.5C16 8.77614 15.7761 9 15.5 9Z" fill="black" stroke="black" strokeWidth="0.8"/>
                          <path d="M8.5 9C8.22386 9 8 8.77614 8 8.5C8 8.22386 8.22386 8 8.5 8C8.77614 8 9 8.22386 9 8.5C9 8.77614 8.77614 9 8.5 9Z" fill="black" stroke="black" strokeWidth="0.8"/>
                        </svg>
                      </div>
                    </div>
                    <div 
                                            onClick={widgetMessage.trim() ? sendWidgetMessage : undefined}
                      className={`w-[38px] h-[38px] rounded-full flex justify-center items-center transition-all ${
                        widgetMessage.trim()
                          ? 'bg-black cursor-pointer hover:scale-110'
                          : 'bg-[#D9D9D9] cursor-not-allowed'
                      } flex-shrink-0 ml-2`}
                    >
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                                                <path
                          d="M8.49984 14.875L8.49984 2.125M8.49984 2.125L2.479 8.14583M8.49984 2.125L14.5207 8.14583"
                          stroke={widgetMessage.trim() ? "#FFFFFF" : "#989898"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
                )}

                {/* Preview Messages */}
        {showPreviewMessages && previewMessages.length > 0 && (
          <div className="flex flex-col gap-3 mb-4">
            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={handleClosePreviewMessages}
                className="bg-black text-white px-3 py-1 rounded-full text-xs font-normal hover:bg-gray-800 transition-colors"
              >
                close
              </button>
            </div>

            {/* Preview Message Bubbles */}
            {previewMessages.slice(-2).map((msg, index) => (
              <div
                key={msg.id}
                className={`bg-white rounded-[22px] p-4 shadow-[0_0_21.2px_6px_rgba(0,0,0,0.02)] max-w-[256px] preview-message-enter`}
                style={{
                  fontFamily: "'Inter', -apple-system, Roboto, Helvetica, sans-serif",
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both',
                }}
              >
                                <div className="flex items-start gap-3">
                                    <img
                    src={generateAvatarUrl('operator-main')}
                    alt="Operator Profile"
                    className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-black text-sm font-normal mb-1 truncate">
                      {msg.text.length > 25 ? `${msg.text.substring(0, 25)}...` : msg.text}
                    </div>
                    <div className="flex items-center gap-1 text-[#686868] text-xs font-normal">
                      <span>Karen</span>
                      <div className="w-1 h-1 bg-[#686868] rounded-full"></div>
                      <span>{formatTimeAgo(msg.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Widget Toggle Button */}
                <div
          className="w-[60px] h-[60px] bg-black text-white rounded-full flex justify-center items-center cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-transform hover:scale-110"
          onClick={() => {
            setIsWidgetOpen(!isWidgetOpen);
            if (!isWidgetOpen) {
              // Hide preview messages when opening widget
              setShowPreviewMessages(false);
              setTimeout(() => setPreviewMessages([]), 300);
            }
          }}
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

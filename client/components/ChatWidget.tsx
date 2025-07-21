import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ChatWidgetProps {
  isOpen?: boolean;
  onToggle?: () => void;
  config?: {
    headerTitle?: string;
    headerSubtitle?: string;
    placeholder?: string;
    welcomeMessage?: string;
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    buttonColor?: string;
    logoUrl?: string;
    showOperatorAvatar?: boolean;
    operatorName?: string;
  };
}

export function ChatWidget({ isOpen = false, onToggle, config = {} }: ChatWidgetProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: config.welcomeMessage || "Hello! How can I help you today?",
      sender: "support",
      time: "2:30 PM",
    },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: "user" as const,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Simulate support response
    setTimeout(() => {
      const supportResponse = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'll help you with that right away.",
        sender: "support" as const,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, supportResponse]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggle}
          size="lg"
          className="h-14 w-14 rounded-chat-widget shadow-lg"
          style={{
            backgroundColor: config.buttonColor || 'hsl(var(--primary))',
            color: 'white'
          }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 w-80 h-96 border border-border rounded-chat-widget shadow-xl flex flex-col"
      style={{
        backgroundColor: config.backgroundColor || 'hsl(var(--card))',
        color: config.textColor || 'hsl(var(--card-foreground))'
      }}
    >
      {/* Header */}
      <div 
        className="p-4 border-b border-border rounded-t-chat-widget"
        style={{
          backgroundColor: config.primaryColor || 'hsl(var(--primary))',
          color: 'white'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              config.showOperatorAvatar !== false && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary-foreground text-primary text-sm">
                    {config.operatorName ? config.operatorName.charAt(0).toUpperCase() : 'S'}
                  </AvatarFallback>
                </Avatar>
              )
            )}
            <div>
              <h3 className="font-semibold text-sm">{config.headerTitle || 'Support'}</h3>
              <p className="text-xs opacity-90">{config.headerSubtitle || 'Online'}</p>
            </div>
          </div>
          <Button
            onClick={onToggle}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            style={{ color: 'white' }}
          >
            <svg
              className="w-4 h-4"
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
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "support" && (
              <Avatar className="w-6 h-6 mt-1">
                <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                  S
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[80%] ${msg.sender === "user" ? "order-2" : ""}`}
            >
              <div
                className={`rounded-lg px-3 py-2 text-sm ${
                  msg.sender === "user"
                    ? "bg-chat-bubble-user text-white"
                    : "bg-chat-bubble-support text-foreground"
                }`}
              >
                {msg.text}
              </div>
              <p className="text-xs text-chat-timestamp mt-1 px-1">
                {msg.time}
              </p>
            </div>
            {msg.sender === "user" && (
              <Avatar className="w-6 h-6 mt-1 order-1">
                <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                  U
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={config.placeholder || "Type your message..."}
              className="text-sm pr-10"
            />
            <Button
              onClick={handleSendMessage}
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChatWidgetDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return <ChatWidget isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />;
}

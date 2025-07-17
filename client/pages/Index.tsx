import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChatWidgetDemo } from "@/components/ChatWidget";
import { useState } from "react";

export default function Index() {
  const [selectedConversation, setSelectedConversation] = useState("1");
  const [message, setMessage] = useState("");
  const [showConversations, setShowConversations] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const downloadTranscript = () => {
    const transcript = messages
      .map(
        (msg) =>
          `[${msg.time}] ${msg.sender === "user" ? "John Doe" : "Support"}: ${msg.text}`,
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

  const conversations = [
    {
      id: "1",
      name: "John Doe",
      lastMessage: "Hello, I need help with my account",
      time: "2:30 PM",
      unread: 2,
      avatar: "",
      online: true,
    },
    {
      id: "2",
      name: "John Doe",
      lastMessage: "Thank you for your assistance",
      time: "1:15 PM",
      unread: 0,
      avatar: "",
      online: false,
    },
    {
      id: "3",
      name: "John Doe",
      lastMessage: "Is there an update on my request?",
      time: "12:45 PM",
      unread: 1,
      avatar: "",
      online: true,
    },
  ];

  const messages = [
    {
      id: "1",
      text: "Hello, I need help with my account",
      sender: "user",
      time: "2:30 PM",
      avatar: "",
    },
    {
      id: "2",
      text: "Hi there! I'd be happy to help you with your account. What specific issue are you experiencing?",
      sender: "support",
      time: "2:31 PM",
      avatar: "",
    },
    {
      id: "3",
      text: "I can't seem to access my dashboard. It keeps showing an error message.",
      sender: "user",
      time: "2:32 PM",
      avatar: "",
    },
    {
      id: "4",
      text: "I understand how frustrating that must be. Let me help you resolve this issue. Can you please tell me what error message you're seeing exactly?",
      sender: "support",
      time: "2:33 PM",
      avatar: "",
    },
  ];

  return (
    <div className="h-screen bg-background flex relative">
      {/* Mobile Conversations Overlay */}
      {showConversations && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowConversations(false)}
        >
          <div
            className="w-80 bg-card h-full flex flex-col rounded-r-chat-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-semibold">Conversations</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConversations(false)}
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
              <div className="relative">
                <Input
                  placeholder="Search conversations..."
                  className="pl-9 h-9 text-sm"
                />
                <svg
                  className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    setSelectedConversation(conv.id);
                    setShowConversations(false);
                  }}
                  className={`p-4 border-b border-border cursor-pointer hover:bg-accent/50 transition-colors ${
                    selectedConversation === conv.id ? "bg-accent" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={conv.avatar} />
                        <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                          {conv.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm truncate">
                          {conv.name}
                        </h3>
                        <span className="text-xs text-chat-timestamp">
                          {conv.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                    {conv.unread > 0 && (
                      <Badge
                        variant="destructive"
                        className="text-xs min-w-[20px] h-5 flex items-center justify-center"
                      >
                        {conv.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Left Panel - Conversations */}
      <div className="w-80 bg-card border-r border-border flex flex-col rounded-r-chat-panel hidden lg:flex">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold">Conversations</h1>
            <Button variant="ghost" size="sm">
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
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </Button>
          </div>
          <div className="relative">
            <Input
              placeholder="Search conversations..."
              className="pl-9 h-9 text-sm"
            />
            <svg
              className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={`p-4 border-b border-border cursor-pointer hover:bg-accent/50 transition-colors ${
                selectedConversation === conv.id ? "bg-accent" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={conv.avatar} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                      {conv.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {conv.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm truncate">
                      {conv.name}
                    </h3>
                    <span className="text-xs text-chat-timestamp">
                      {conv.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unread > 0 && (
                  <Badge
                    variant="destructive"
                    className="text-xs min-w-[20px] h-5 flex items-center justify-center"
                  >
                    {conv.unread}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Panel - Messages */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Chat Header */}
        <div className="p-6 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
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
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card"></div>
              </div>
              <div>
                <h2 className="font-semibold">John Doe</h2>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="xl:hidden"
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
              <Button variant="ghost" size="sm">
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
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "support" && (
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                    S
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] ${msg.sender === "user" ? "order-2" : ""}`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    msg.sender === "user"
                      ? "bg-chat-bubble-user text-white"
                      : "bg-chat-bubble-support text-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <p className="text-xs text-chat-timestamp mt-1 px-1">
                  {msg.time}
                </p>
              </div>
              {msg.sender === "user" && (
                <Avatar className="w-8 h-8 mt-1 order-1">
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                    JD
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-6 border-t border-border bg-card">
          <div className="flex items-end gap-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
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
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </Button>
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[44px] pr-20 resize-none"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground h-8 w-8 p-0"
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
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Button>
                <Button size="sm" className="h-8 w-8 p-0">
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
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </Button>
              </div>
            </div>
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
            className="w-80 bg-card h-full ml-auto border-l border-border rounded-l-chat-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Customer Info</h3>
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
              <div className="text-center mb-6">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarFallback className="bg-muted text-muted-foreground text-xl">
                    JD
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">John Doe</h3>
                <p className="text-sm text-muted-foreground">
                  Customer since Jan 2024
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Online</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">
                    Contact Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>john.doe@email.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>+1 (555) 123-4567</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-medium text-sm mb-2">
                    Previous Conversations
                  </h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-accent/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">
                        Jan 15, 2024
                      </p>
                      <p className="text-sm">Account setup assistance</p>
                    </div>
                    <div className="p-3 bg-accent/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">
                        Jan 10, 2024
                      </p>
                      <p className="text-sm">Billing inquiry</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <Button
                    variant="outline"
                    className="w-full text-sm"
                    onClick={downloadTranscript}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download Transcript
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Right Panel - Sidebar */}
      <div className="w-80 bg-card border-l border-border rounded-l-chat-panel hidden xl:block">
        <div className="p-6">
          <div className="text-center mb-6">
            <Avatar className="w-20 h-20 mx-auto mb-4">
              <AvatarFallback className="bg-muted text-muted-foreground text-xl">
                JD
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">John Doe</h3>
            <p className="text-sm text-muted-foreground">
              Customer since Jan 2024
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-muted-foreground">Online</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>john.doe@email.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="font-medium text-sm mb-2">
                Previous Conversations
              </h4>
              <div className="space-y-2">
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">
                    Jan 15, 2024
                  </p>
                  <p className="text-sm">Account setup assistance</p>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">
                    Jan 10, 2024
                  </p>
                  <p className="text-sm">Billing inquiry</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <Button variant="outline" className="w-full text-sm">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download Transcript
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Widget Overlay */}
      <ChatWidgetDemo />
    </div>
  );
}

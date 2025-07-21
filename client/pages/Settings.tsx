import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarInset, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  Users, 
  User, 
  Home,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Search
} from "lucide-react";

interface WidgetConfig {
  // Textos
  headerTitle: string;
  headerSubtitle: string;
  placeholder: string;
  welcomeMessage: string;
  
  // Cores
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonHoverColor: string;
  
  // Logo e Avatar
  logoUrl: string;
  showOperatorAvatar: boolean;
  operatorName: string;
  
  // Configurações gerais
  position: 'bottom-right' | 'bottom-left';
  size: 'small' | 'medium' | 'large';
}

const defaultConfig: WidgetConfig = {
  headerTitle: "Suporte",
  headerSubtitle: "Online",
  placeholder: "Digite sua mensagem...",
  welcomeMessage: "Olá! Como posso ajudá-lo hoje?",
  primaryColor: "#000000",
  backgroundColor: "#ffffff",
  textColor: "#363636",
  buttonColor: "#000000",
  buttonHoverColor: "#333333",
  logoUrl: "",
  showOperatorAvatar: true,
  operatorName: "Suporte",
  position: "bottom-right",
  size: "medium"
};

// Mock data for conversations
const conversations = [
  {
    id: "1",
    name: "João Silva",
    lastMessage: "Obrigado pela ajuda!",
    time: "2 min",
    unread: 0,
    avatar: "",
    online: true,
  },
  {
    id: "2", 
    name: "Maria Santos",
    lastMessage: "Quando posso esperar uma resposta?",
    time: "5 min",
    unread: 2,
    avatar: "",
    online: false,
  },
  {
    id: "3",
    name: "Pedro Costa",
    lastMessage: "Perfeito, muito obrigado!",
    time: "1h",
    unread: 0,
    avatar: "",
    online: true,
  },
];

// Mock messages for the selected conversation
const messages = [
  {
    id: "1",
    text: "Olá! Como posso ajudá-lo hoje?",
    sender: "support",
    time: "14:30",
    avatar: "",
  },
  {
    id: "2", 
    text: "Oi! Estou com problemas para acessar minha conta.",
    sender: "user",
    time: "14:32",
    avatar: "",
  },
  {
    id: "3",
    text: "Entendo. Vou ajudá-lo com isso. Pode me informar seu email cadastrado?",
    sender: "support", 
    time: "14:33",
    avatar: "",
  },
  {
    id: "4",
    text: "Claro! É joao.silva@email.com",
    sender: "user",
    time: "14:34", 
    avatar: "",
  },
  {
    id: "5",
    text: "Perfeito! Encontrei sua conta. Vou enviar um link de redefinição de senha para seu email.",
    sender: "support",
    time: "14:35",
    avatar: "",
  },
];

export default function Settings() {
  const [config, setConfig] = useState<WidgetConfig>(defaultConfig);
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");

  const updateConfig = (key: keyof WidgetConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // In a real app, this would send the message
    setNewMessage("");
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MessageCircle className="h-4 w-4" />
              </div>
              <span className="font-semibold">LiveChat</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/" className="flex items-center gap-3">
                        <Home className="w-5 h-5" />
                        <span>Dashboard</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#" className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5" />
                        <span>Conversations</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#" className="flex items-center gap-3">
                        <Users className="w-5 h-5" />
                        <span>Contacts</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#" className="flex items-center gap-3">
                        <User className="w-5 h-5" />
                        <span>Profile</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <a href="/settings" className="flex items-center gap-3">
                        <svg width="20" height="20" stroke-width="0.8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"></path>
                          <path d="M19.6224 10.3954L18.5247 7.7448L20 6L18 4L16.2647 5.48295L13.5578 4.36974L12.9353 2H10.981L10.3491 4.40113L7.70441 5.51596L6 4L4 6L5.45337 7.78885L4.3725 10.4463L2 11V13L4.40111 13.6555L5.51575 16.2997L4 18L6 20L7.79116 18.5403L10.397 19.6123L11 22H13L13.6045 19.6132L16.2551 18.5155C16.6969 18.8313 18 20 18 20L20 18L18.5159 16.2494L19.6139 13.598L21.9999 12.9772L22 11L19.6224 10.3954Z" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <span>Settings</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <div className="flex h-full">
            {/* Settings Panel - Left Column */}
            <div className="w-1/2 border-r bg-background">
              <div className="border-b px-6 py-4">
                <div className="flex items-center gap-2">
                  <SidebarTrigger />
                  <h1 className="text-xl font-semibold">Widget Settings</h1>
                </div>
              </div>
              
              <ScrollArea className="h-[calc(100vh-73px)]">
                <div className="p-6 space-y-6">
                  {/* Textos do Widget */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Textos do Widget</CardTitle>
                      <CardDescription>
                        Personalize as mensagens e textos exibidos no widget
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="headerTitle">Título do Cabeçalho</Label>
                        <Input
                          id="headerTitle"
                          value={config.headerTitle}
                          onChange={(e) => updateConfig('headerTitle', e.target.value)}
                          placeholder="Ex: Suporte"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="headerSubtitle">Subtítulo do Cabeçalho</Label>
                        <Input
                          id="headerSubtitle"
                          value={config.headerSubtitle}
                          onChange={(e) => updateConfig('headerSubtitle', e.target.value)}
                          placeholder="Ex: Online"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="placeholder">Placeholder da Mensagem</Label>
                        <Input
                          id="placeholder"
                          value={config.placeholder}
                          onChange={(e) => updateConfig('placeholder', e.target.value)}
                          placeholder="Ex: Digite sua mensagem..."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="welcomeMessage">Mensagem de Boas-vindas</Label>
                        <Textarea
                          id="welcomeMessage"
                          value={config.welcomeMessage}
                          onChange={(e) => updateConfig('welcomeMessage', e.target.value)}
                          placeholder="Ex: Olá! Como posso ajudá-lo hoje?"
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cores do Widget */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Cores do Widget</CardTitle>
                      <CardDescription>
                        Defina as cores para combinar com seu site
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="primaryColor">Cor Primária</Label>
                          <div className="flex gap-2">
                            <Input
                              id="primaryColor"
                              type="color"
                              value={config.primaryColor}
                              onChange={(e) => updateConfig('primaryColor', e.target.value)}
                              className="w-16 h-10 p-1"
                            />
                            <Input
                              value={config.primaryColor}
                              onChange={(e) => updateConfig('primaryColor', e.target.value)}
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="buttonColor">Cor do Botão Toggle</Label>
                          <div className="flex gap-2">
                            <Input
                              id="buttonColor"
                              type="color"
                              value={config.buttonColor}
                              onChange={(e) => updateConfig('buttonColor', e.target.value)}
                              className="w-16 h-10 p-1"
                            />
                            <Input
                              value={config.buttonColor}
                              onChange={(e) => updateConfig('buttonColor', e.target.value)}
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="buttonHoverColor">Cor do Botão (Hover)</Label>
                          <div className="flex gap-2">
                            <Input
                              id="buttonHoverColor"
                              type="color"
                              value={config.buttonHoverColor}
                              onChange={(e) => updateConfig('buttonHoverColor', e.target.value)}
                              className="w-16 h-10 p-1"
                            />
                            <Input
                              value={config.buttonHoverColor}
                              onChange={(e) => updateConfig('buttonHoverColor', e.target.value)}
                              placeholder="#333333"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Logo e Avatar */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Logo e Avatar</CardTitle>
                      <CardDescription>
                        Configure a logo da empresa e avatar do operador
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="logoUrl">URL da Logo (canto superior esquerdo)</Label>
                        <Input
                          id="logoUrl"
                          value={config.logoUrl}
                          onChange={(e) => updateConfig('logoUrl', e.target.value)}
                          placeholder="https://exemplo.com/logo.png"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="operatorName">Nome do Operador</Label>
                        <Input
                          id="operatorName"
                          value={config.operatorName}
                          onChange={(e) => updateConfig('operatorName', e.target.value)}
                          placeholder="Ex: João Silva"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showOperatorAvatar"
                          checked={config.showOperatorAvatar}
                          onCheckedChange={(checked) => updateConfig('showOperatorAvatar', checked)}
                        />
                        <Label htmlFor="showOperatorAvatar">
                          Mostrar foto do operador (canto superior direito)
                        </Label>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Configurações Gerais */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Configurações Gerais</CardTitle>
                      <CardDescription>
                        Posição e tamanho do widget
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Posição do Widget</Label>
                        <div className="flex gap-2">
                          <Button
                            variant={config.position === 'bottom-right' ? 'default' : 'outline'}
                            onClick={() => updateConfig('position', 'bottom-right')}
                            className="flex-1"
                          >
                            Inferior Direito
                          </Button>
                          <Button
                            variant={config.position === 'bottom-left' ? 'default' : 'outline'}
                            onClick={() => updateConfig('position', 'bottom-left')}
                            className="flex-1"
                          >
                            Inferior Esquerdo
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Tamanho do Botão</Label>
                        <div className="flex gap-2">
                          <Button
                            variant={config.size === 'small' ? 'default' : 'outline'}
                            onClick={() => updateConfig('size', 'small')}
                            className="flex-1"
                          >
                            Pequeno
                          </Button>
                          <Button
                            variant={config.size === 'medium' ? 'default' : 'outline'}
                            onClick={() => updateConfig('size', 'medium')}
                            className="flex-1"
                          >
                            Médio
                          </Button>
                          <Button
                            variant={config.size === 'large' ? 'default' : 'outline'}
                            onClick={() => updateConfig('size', 'large')}
                            className="flex-1"
                          >
                            Grande
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </div>

            {/* Preview Panel - Right Column */}
            <div className="w-1/2 bg-background">
              <div className="border-b px-6 py-4">
                <h2 className="text-lg font-semibold">Preview do Widget</h2>
                <p className="text-sm text-muted-foreground">
                  Visualização em tempo real das suas configurações
                </p>
              </div>
              
              <div className="h-[calc(100vh-73px)] relative bg-gray-50">
                {/* Simulated website background */}
                <div className="p-8 text-center text-gray-500">
                  <h3 className="text-xl font-semibold mb-2">Simulação do seu site</h3>
                  <p>O widget aparecerá conforme configurado</p>
                </div>

                {/* Chat Widget Preview */}
                <div 
                  className="absolute z-50"
                  style={{
                    [config.position === 'bottom-left' ? 'left' : 'right']: '24px',
                    bottom: '24px'
                  }}
                >
                  {/* Widget Button */}
                  <div
                    className="rounded-full shadow-lg cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-105"
                    style={{
                      width: config.size === 'small' ? '50px' : config.size === 'large' ? '70px' : '60px',
                      height: config.size === 'small' ? '50px' : config.size === 'large' ? '70px' : '60px',
                      backgroundColor: config.buttonColor,
                    }}
                  >
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>

                  {/* Widget Window */}
                  <div 
                    className="absolute bottom-16 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col"
                    style={{
                      [config.position === 'bottom-left' ? 'left' : 'right']: '0',
                    }}
                  >
                    {/* Header */}
                    <div 
                      className="p-4 rounded-t-lg flex items-center justify-between"
                      style={{
                        backgroundColor: config.primaryColor,
                        color: 'white'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {config.logoUrl ? (
                          <img 
                            src={config.logoUrl} 
                            alt="Logo" 
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-sm">{config.headerTitle}</h3>
                          <p className="text-xs opacity-90">{config.headerSubtitle}</p>
                        </div>
                      </div>
                      {config.showOperatorAvatar && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-white/20 text-white text-xs">
                            {config.operatorName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                      <div className="flex gap-2">
                        <Avatar className="w-6 h-6 mt-1">
                          <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                            S
                          </AvatarFallback>
                        </Avatar>
                        <div className="max-w-[80%]">
                          <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
                            {config.welcomeMessage}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 px-1">14:30</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 justify-end">
                        <div className="max-w-[80%]">
                          <div 
                            className="rounded-lg px-3 py-2 text-sm text-white"
                            style={{ backgroundColor: config.primaryColor }}
                          >
                            Olá! Preciso de ajuda com minha conta.
                          </div>
                          <p className="text-xs text-gray-500 mt-1 px-1 text-right">14:32</p>
                        </div>
                        <Avatar className="w-6 h-6 mt-1">
                          <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                            U
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder={config.placeholder}
                          className="flex-1 text-sm"
                          disabled
                        />
                        <Button 
                          size="sm" 
                          className="px-3"
                          style={{ backgroundColor: config.primaryColor }}
                          disabled
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
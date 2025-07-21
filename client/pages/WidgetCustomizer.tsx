import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Copy, Download, Eye, Settings } from "lucide-react";
import { ChatWidget } from "@/components/ChatWidget";
import { useToast } from "@/hooks/use-toast";

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

export default function WidgetCustomizer() {
  const [config, setConfig] = useState<WidgetConfig>(defaultConfig);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("customize");
  const { toast } = useToast();

  const updateConfig = (key: keyof WidgetConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const generateEmbedCode = () => {
    const configJson = JSON.stringify(config, null, 2);
    return `<!-- Chat Widget -->
<div id="chat-widget-container"></div>
<script>
  window.ChatWidgetConfig = ${configJson};
  
  (function() {
    var script = document.createElement('script');
    script.src = '${window.location.origin}/widget.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>
<!-- End Chat Widget -->`;
  };

  const generateWidgetJS = () => {
    return `(function() {
  'use strict';
  
  // Widget configuration
  var config = window.ChatWidgetConfig || {};
  
  // Create widget HTML
  var widgetHTML = \`
    <div id="chat-widget" style="
      position: fixed;
      \${config.position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;'}
      bottom: 20px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div id="chat-toggle" style="
        width: \${config.size === 'small' ? '50px' : config.size === 'large' ? '70px' : '60px'};
        height: \${config.size === 'small' ? '50px' : config.size === 'large' ? '70px' : '60px'};
        background: \${config.buttonColor || '#000000'};
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
      ">
        <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </div>
      
      <div id="chat-window" style="
        position: absolute;
        bottom: \${config.size === 'small' ? '60px' : config.size === 'large' ? '80px' : '70px'};
        \${config.position === 'bottom-left' ? 'left: 0;' : 'right: 0;'}
        width: 350px;
        height: 500px;
        background: \${config.backgroundColor || '#ffffff'};
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        display: none;
        flex-direction: column;
        overflow: hidden;
      ">
        <!-- Widget content will be inserted here -->
      </div>
    </div>
  \`;
  
  // Insert widget into page
  document.body.insertAdjacentHTML('beforeend', widgetHTML);
  
  // Add event listeners
  var toggle = document.getElementById('chat-toggle');
  var window = document.getElementById('chat-window');
  var isOpen = false;
  
  toggle.addEventListener('click', function() {
    isOpen = !isOpen;
    window.style.display = isOpen ? 'flex' : 'none';
  });
  
  // Hover effects
  toggle.addEventListener('mouseenter', function() {
    this.style.background = config.buttonHoverColor || '#333333';
  });
  
  toggle.addEventListener('mouseleave', function() {
    this.style.background = config.buttonColor || '#000000';
  });
})();`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Código copiado para a área de transferência.",
    });
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Personalizador de Widget de Chat</h1>
          <p className="text-muted-foreground">
            Configure e personalize seu widget de chat para usar em qualquer site
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="customize" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Personalizar
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Visualizar
            </TabsTrigger>
            <TabsTrigger value="embed" className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Código
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customize" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Textos */}
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

              {/* Cores */}
              <Card>
                <CardHeader>
                  <CardTitle>Cores do Widget</CardTitle>
                  <CardDescription>
                    Defina as cores para combinar com seu site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
                      <Label htmlFor="backgroundColor">Cor de Fundo</Label>
                      <div className="flex gap-2">
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={config.backgroundColor}
                          onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={config.backgroundColor}
                          onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="buttonColor">Cor do Botão</Label>
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
                    <Label htmlFor="logoUrl">URL da Logo</Label>
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
                      Mostrar avatar do operador
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
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Visualização do Widget</CardTitle>
                <CardDescription>
                  Veja como o widget ficará no seu site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-100 rounded-lg p-8 min-h-[400px]">
                  <div className="text-center text-gray-500 mb-4">
                    Simulação da página do seu site
                  </div>
                  
                  {/* Widget Preview */}
                  <div 
                    className="fixed z-50"
                    style={{
                      [config.position === 'bottom-left' ? 'left' : 'right']: '32px',
                      bottom: '32px'
                    }}
                  >
                    <ChatWidget 
                      isOpen={isPreviewOpen} 
                      onToggle={() => setIsPreviewOpen(!isPreviewOpen)} 
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <Button onClick={() => setIsPreviewOpen(!isPreviewOpen)}>
                    {isPreviewOpen ? 'Fechar Preview' : 'Abrir Preview'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="embed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Código de Incorporação</CardTitle>
                <CardDescription>
                  Copie e cole este código no seu site para adicionar o widget
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Código HTML</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generateEmbedCode())}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(generateEmbedCode(), 'chat-widget-embed.html')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={generateEmbedCode()}
                    readOnly
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Arquivo JavaScript (widget.js)</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFile(generateWidgetJS(), 'widget.js')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar widget.js
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Faça upload deste arquivo para o seu servidor e certifique-se de que está acessível em /widget.js
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Instruções de Instalação:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                    <li>Faça upload do arquivo widget.js para o seu servidor</li>
                    <li>Cole o código HTML antes da tag &lt;/body&gt; do seu site</li>
                    <li>O widget aparecerá automaticamente em todas as páginas</li>
                    <li>Personalize as configurações conforme necessário</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
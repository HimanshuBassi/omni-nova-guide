import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Settings, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { VoiceButton } from './VoiceButton';
import { MessageBubble } from './MessageBubble';
import { ModeSelector } from './ModeSelector';
import { useToast } from '@/hooks/use-toast';

export type AIMode = 'chat' | 'study' | 'control' | 'research';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  mode?: AIMode;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm B, your ultimate personal intelligence assistant. I'm here to help you with studying, device control, research, and general assistance. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [currentMode, setCurrentMode] = useState<AIMode>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
      mode: currentMode,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI response based on mode
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageText, currentMode);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        mode: currentMode,
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (input: string, mode: AIMode): string => {
    const lowerInput = input.toLowerCase().trim();
    
    // Handle specific voice commands
    if (lowerInput.includes('search spotify') || (lowerInput.includes('spotify') && lowerInput.includes('search'))) {
      return "🎵 Searching Spotify for you... I'd open your Spotify app and search for music, but I need device integration for that. For now, I can help you discover new music - what genre or artist are you looking for?";
    }
    
    if (lowerInput.includes('hello b') || lowerInput.includes('hey b')) {
      return "Hello! I'm B, your AI assistant. I'm here and ready to help with anything you need - from device control to research to learning assistance!";
    }
    
    if (lowerInput.includes('play music') || lowerInput.includes('play song')) {
      return "🎵 I'd love to play music for you! Currently, I need device integration to control your music apps directly. You can ask me about music recommendations or open your preferred music app manually.";
    }
    
    if (lowerInput.includes('call') || lowerInput.includes('phone')) {
      return "📞 I can help you with calling! Currently, I need phone integration to make actual calls. You can tell me who you want to call and I'll guide you through it.";
    }
    
    if (lowerInput.includes('weather')) {
      return "🌤️ I'd check the weather for you! For real-time weather, I need internet access. You can ask me about weather patterns or tell me your location for general advice.";
    }
    
    if (lowerInput.includes('open') && (lowerInput.includes('app') || lowerInput.includes('application'))) {
      return "📱 I'd open that app for you! With proper device integration, I could launch applications directly. For now, you can open apps manually or tell me what you're trying to accomplish.";
    }
    
    // Default responses by mode
    const responses = {
      chat: [
        `I understand you're asking about "${input}". Let me help you with that right away.`,
        `That's an interesting question about "${input}". Here's what I can tell you...`,
        `I'd be happy to assist you with "${input}". Let me provide you with a comprehensive answer.`
      ],
      study: [
        `Great study question! For "${input}", let me break this down step by step for better understanding.`,
        `This is a perfect learning opportunity. Regarding "${input}", here's the key concept you need to grasp...`,
        `I'll help you master "${input}". Let's start with the fundamentals and build up your knowledge.`
      ],
      control: [
        `Device control request understood: "${input}". I'm initiating the requested action now.`,
        `Processing device command: "${input}". Please wait while I execute this operation.`,
        `Control instruction received: "${input}". I'll handle this task across your connected devices.`
      ],
      research: [
        `Research query: "${input}". Let me gather the latest information and provide you with comprehensive insights.`,
        `I'm analyzing "${input}" across multiple reliable sources. Here's what the current data shows...`,
        `Research initiated for "${input}". I'll provide you with evidence-based findings and expert perspectives.`
      ]
    };

    const modeResponses = responses[mode];
    return modeResponses[Math.floor(Math.random() * modeResponses.length)];
  };

  const handleVoiceResult = (transcript: string) => {
    if (transcript.trim()) {
      handleSendMessage(transcript);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-ai-surface px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ai-gradient flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-ai-gradient bg-clip-text text-transparent">
                B
              </h1>
              <p className="text-sm text-muted-foreground">Your Personal Intelligence Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ModeSelector currentMode={currentMode} onModeChange={setCurrentMode} />
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <MessageBubble
            message={{
              id: 'loading',
              text: 'Thinking...',
              isUser: false,
              timestamp: new Date(),
            }}
            isLoading={true}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-ai-surface px-6 py-4">
        <div className="flex items-center gap-3">
          <VoiceButton
            onResult={handleVoiceResult}
            isListening={isListening}
            onListeningChange={setIsListening}
          />
          <div className="flex-1">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask B anything... (${currentMode.toUpperCase()} mode)`}
              className="bg-ai-elevated border-border focus:ring-primary"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="bg-ai-gradient hover:opacity-90 shadow-elegant"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
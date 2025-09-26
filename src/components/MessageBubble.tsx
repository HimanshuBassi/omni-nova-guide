import React from 'react';
import { Bot, User, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Message } from './ChatInterface';

interface MessageBubbleProps {
  message: Message;
  isLoading?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLoading = false }) => {
  const { text, isUser, timestamp } = message;

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`
        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
        ${isUser 
          ? 'bg-secondary text-secondary-foreground' 
          : 'bg-ai-gradient text-primary-foreground shadow-elegant'
        }
      `}>
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>

      {/* Message */}
      <div className={`flex-1 max-w-3xl ${isUser ? 'flex justify-end' : ''}`}>
        <Card className={`
          px-4 py-3 relative transition-all duration-300
          ${isUser 
            ? 'bg-primary text-primary-foreground ml-12' 
            : 'bg-ai-elevated border-border mr-12'
          }
          ${isLoading ? 'animate-pulse' : ''}
        `}>
          <div className="flex items-start gap-2">
            {isLoading && (
              <Loader2 className="w-4 h-4 animate-spin flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {text}
            </p>
          </div>
          
          {/* Timestamp */}
          <div className={`
            text-xs mt-2 
            ${isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}
          `}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>

          {/* Message tail */}
          <div className={`
            absolute top-3 w-2 h-2 rotate-45
            ${isUser 
              ? 'right-[-4px] bg-primary' 
              : 'left-[-4px] bg-ai-elevated border-l border-t border-border'
            }
          `} />
        </Card>
      </div>
    </div>
  );
};
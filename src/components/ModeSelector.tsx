import React from 'react';
import { MessageCircle, GraduationCap, Smartphone, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { AIMode } from './ChatInterface';

interface ModeSelectorProps {
  currentMode: AIMode;
  onModeChange: (mode: AIMode) => void;
}

const modes = [
  {
    id: 'chat' as AIMode,
    label: 'General Chat',
    description: 'General conversation and assistance',
    icon: MessageCircle,
    color: 'text-primary',
  },
  {
    id: 'study' as AIMode,
    label: 'Study Assistant',
    description: 'Homework help and learning support',
    icon: GraduationCap,
    color: 'text-voice-processing',
  },
  {
    id: 'control' as AIMode,
    label: 'Device Control',
    description: 'Manage devices and automation',
    icon: Smartphone,
    color: 'text-voice-active',
  },
  {
    id: 'research' as AIMode,
    label: 'Research Hub',
    description: 'World knowledge and information',
    icon: Search,
    color: 'text-accent',
  },
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  const currentModeData = modes.find(mode => mode.id === currentMode);
  const CurrentIcon = currentModeData?.icon || MessageCircle;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 bg-ai-elevated border-border hover:bg-ai-surface"
        >
          <CurrentIcon className={`w-4 h-4 ${currentModeData?.color}`} />
          <span className="hidden sm:inline">{currentModeData?.label}</span>
          <span className="sm:hidden">{currentMode.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 bg-ai-elevated border-border">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <DropdownMenuItem
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`
                flex items-start gap-3 p-3 cursor-pointer
                hover:bg-ai-surface focus:bg-ai-surface
                ${currentMode === mode.id ? 'bg-ai-surface' : ''}
              `}
            >
              <Icon className={`w-4 h-4 mt-0.5 ${mode.color}`} />
              <div>
                <div className="font-medium text-sm">{mode.label}</div>
                <div className="text-xs text-muted-foreground">{mode.description}</div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
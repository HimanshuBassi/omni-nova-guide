import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface VoiceButtonProps {
  onResult: (transcript: string) => void;
  isListening: boolean;
  onListeningChange: (listening: boolean) => void;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onResult,
  isListening,
  onListeningChange,
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        onListeningChange(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        onListeningChange(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        onListeningChange(false);
        toast({
          title: "Voice Recognition Error",
          description: "There was an issue with voice recognition. Please try again.",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        onListeningChange(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onResult, onListeningChange, toast]);

  const toggleListening = () => {
    if (!isSupported) {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice recognition. Please use a modern browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        toast({
          title: "Voice Error",
          description: "Failed to start voice recognition. Please check your microphone permissions.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={toggleListening}
        variant={isListening ? "default" : "outline"}
        size="icon"
        className={`
          relative overflow-hidden transition-all duration-300
          ${isListening 
            ? 'bg-voice-listening text-primary-foreground shadow-glow animate-pulse' 
            : 'hover:bg-primary/10'
          }
        `}
      >
        {isListening ? (
          <MicOff className="w-4 h-4 relative z-10" />
        ) : (
          <Mic className="w-4 h-4 relative z-10" />
        )}
        
        {/* Voice ripple effect */}
        {isListening && (
          <>
            <div className="absolute inset-0 bg-voice-listening rounded-full voice-ripple opacity-30" />
            <div className="absolute inset-0 bg-voice-listening rounded-full voice-ripple opacity-20" style={{ animationDelay: '0.5s' }} />
          </>
        )}
      </Button>
      
      {/* Status indicator */}
      {isListening && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-voice-active rounded-full animate-pulse" />
      )}
    </div>
  );
};
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface ProfileAudioProps {
  audioUrl?: string;
  autoPlay?: boolean;
}

export function ProfileAudio({ audioUrl, autoPlay }: ProfileAudioProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.volume = 0.5;
      if (autoPlay) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
          // Autoplay blocked
          setIsPlaying(false);
        });
      }
    }
  }, [audioUrl, autoPlay]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!audioUrl) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex gap-2">
      <audio ref={audioRef} src={audioUrl} loop />
      <Button
        size="icon"
        variant="secondary"
        className="rounded-full w-12 h-12 shadow-lg bg-background/80 backdrop-blur-md border border-white/10"
        onClick={togglePlay}
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
      </Button>
      <Button
        size="icon"
        variant="secondary"
        className="rounded-full w-12 h-12 shadow-lg bg-background/80 backdrop-blur-md border border-white/10"
        onClick={toggleMute}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </Button>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

export function BackgroundMusic({ isPlaying }: { isPlaying: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(
        "/music_fx_create_a_calming_immersive_soundscape_design.mp3"
      );
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    if (isPlaying) {
      audioRef.current
        .play()
        .catch((error) => {
          console.error("Audio playback failed:", error);
          setError("Audio playback failed. Please try again.");
        });
    } else {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isPlaying]);

  if (error) {
    return (
      <div className="text-red-500 text-sm mt-2">
        {error}
      </div>
    );
  }

  return null;
}

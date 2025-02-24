"use client";

import { useEffect, useRef } from "react";

export function BackgroundMusic({ isPlaying }: { isPlaying: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
        .catch((error) => console.log("Audio playback failed:", error));
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

  return null;
}

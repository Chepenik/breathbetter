"use client";

import { useEffect, useRef, useState } from "react";
import { Phase } from "@/lib/patterns";

export function BackgroundMusic({ 
  isPlaying, 
  isMuted = false,
  phase = "inhale"
}: { 
  isPlaying: boolean; 
  isMuted?: boolean;
  phase?: Phase;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transitionSoundRef = useRef<HTMLAudioElement | null>(null);
  const previousPhaseRef = useRef<Phase>(phase);
  const [error, setError] = useState<string | null>(null);
  const [transitionSoundAvailable, setTransitionSoundAvailable] = useState(false);
  
  // Base and reduced volumes
  const baseVolume = 0.05;
  const transitionVolume = 0.01;
  const transitionDuration = 250; // ms
  const transitionSoundDuration = 500; // Play transition sound for 500ms only

  // Setup audio elements once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/music_fx_create_a_soothing_lofi_track_for_breath_work.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = baseVolume;
    }

    // Check if transition sound file exists before creating the audio element
    fetch("/sounds/transition_to_inhale.mp3", { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          console.log("Transition sound file found!");
          setTransitionSoundAvailable(true);
          
          // Create transition sound element only if file exists
          if (!transitionSoundRef.current) {
            transitionSoundRef.current = new Audio("/sounds/transition_to_inhale.mp3");
            transitionSoundRef.current.volume = 0.15;
            // Don't loop the transition sound
            transitionSoundRef.current.loop = false;
          }
        } else {
          console.warn("Transition sound file not found. Using volume modulation only.");
          setTransitionSoundAvailable(false);
        }
      })
      .catch(err => {
        console.error("Error checking for transition sound file:", err);
        setTransitionSoundAvailable(false);
      });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (transitionSoundRef.current) {
        transitionSoundRef.current.pause();
        transitionSoundRef.current = null;
      }
    };
  }, []);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error("Audio playback failed:", error);
        setError("Audio playback failed. Please try again.");
      });
    } else {
      audioRef.current.pause();
      // Reset volume when stopping
      audioRef.current.volume = baseVolume;
      
      // Also stop any transition sounds if available
      if (transitionSoundAvailable && transitionSoundRef.current) {
        transitionSoundRef.current.pause();
        transitionSoundRef.current.currentTime = 0;
      }
    }
  }, [isPlaying, transitionSoundAvailable]);

  // Handle phase transitions with volume modulation and transition sounds
  useEffect(() => {
    if (!isPlaying || !audioRef.current) return;
    
    // Only modulate volume when phase changes
    if (phase !== previousPhaseRef.current) {
      // Store the new phase
      previousPhaseRef.current = phase;
      
      // Play the transition sound if available
      if (transitionSoundAvailable && transitionSoundRef.current) {
        transitionSoundRef.current.currentTime = 0;
        transitionSoundRef.current.play().catch(error => {
          console.error("Transition sound playback failed:", error);
          // If playing fails, mark as unavailable to prevent further attempts
          setTransitionSoundAvailable(false);
        });
        
        // Stop the transition sound after specified duration
        setTimeout(() => {
          if (transitionSoundRef.current) {
            transitionSoundRef.current.pause();
            transitionSoundRef.current.currentTime = 0;
          }
        }, transitionSoundDuration);
      }
      
      // Smoothly lower volume for transition
      const startTime = Date.now();
      const startVolume = audioRef.current.volume;
      
      // First decrease volume
      const decreaseInterval = setInterval(() => {
        if (!audioRef.current) {
          clearInterval(decreaseInterval);
          return;
        }
        
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / transitionDuration, 1);
        
        // Linear interpolation from startVolume to transitionVolume
        audioRef.current.volume = startVolume - (progress * (startVolume - transitionVolume));
        
        if (progress >= 1) {
          clearInterval(decreaseInterval);
          
          // Then increase volume back to normal after a short delay
          setTimeout(() => {
            const increaseStartTime = Date.now();
            
            const increaseInterval = setInterval(() => {
              if (!audioRef.current) {
                clearInterval(increaseInterval);
                return;
              }
              
              const increaseElapsed = Date.now() - increaseStartTime;
              const increaseProgress = Math.min(increaseElapsed / transitionDuration, 1);
              
              // Linear interpolation from transitionVolume to baseVolume
              audioRef.current.volume = transitionVolume + (increaseProgress * (baseVolume - transitionVolume));
              
              if (increaseProgress >= 1) {
                clearInterval(increaseInterval);
              }
            }, 16); // ~60fps
          }, 100); // Short pause at low volume
        }
      }, 16); // ~60fps
    }
  }, [phase, isPlaying, transitionSoundAvailable]);

  // Handle mute/unmute for all audio elements
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
    if (transitionSoundAvailable && transitionSoundRef.current) {
      transitionSoundRef.current.muted = isMuted;
    }
  }, [isMuted, transitionSoundAvailable]);

  if (error) {
    return (
      <div className="text-red-500 text-sm mt-2">
        {error}
      </div>
    );
  }

  return null;
}

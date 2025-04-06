import { useEffect, useRef } from 'react';

/**
 * Audio manager utility for the dilemma experience
 * Handles playing sounds with error fallbacks
 */

// Sound types
export type SoundType = 'click' | 'transition' | 'complete' | 'background';

// Sound file mapping
const SOUND_FILES: Record<SoundType, string> = {
  click: '/sounds/click.mp3',
  transition: '/sounds/transition.mp3',
  complete: '/sounds/complete.mp3',
  background: '/sounds/ambient-background.mp3'
};

// Volume levels
const VOLUME_LEVELS: Record<SoundType, number> = {
  click: 0.3,
  transition: 0.2,
  complete: 0.4,
  background: 0.1
};

/**
 * Plays a sound with error handling
 */
export const playSound = (type: SoundType, isMuted: boolean = false): void => {
  if (isMuted || typeof window === 'undefined') return;
  
  try {
    const audio = new Audio(SOUND_FILES[type]);
    audio.volume = VOLUME_LEVELS[type];
    audio.play().catch(err => {
      console.log(`Audio play error for ${type}:`, err);
    });
  } catch (error) {
    console.log(`Failed to play sound ${type}:`, error);
  }
};

/**
 * Hook for managing background audio
 */
export const useBackgroundAudio = (
  isEnabled: boolean = true,
  isMuted: boolean = false
): { toggleMute: () => void } => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMutedRef = useRef<boolean>(isMuted);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio(SOUND_FILES.background);
      audioRef.current.loop = true;
      audioRef.current.volume = VOLUME_LEVELS.background;
    }
    
    if (isEnabled && !isMuted) {
      audioRef.current.play().catch(err => {
        console.log('Background audio play error:', err);
      });
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
    
    isMutedRef.current = isMuted;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isEnabled, isMuted]);
  
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMutedRef.current) {
      audioRef.current.volume = VOLUME_LEVELS.background;
      if (isEnabled) {
        audioRef.current.play().catch(err => {
          console.log('Background audio play error:', err);
        });
      }
    } else {
      audioRef.current.pause();
    }
    
    isMutedRef.current = !isMutedRef.current;
    return isMutedRef.current;
  };
  
  return { toggleMute };
};

// Sound preloading function to improve performance
export const preloadSounds = (): void => {
  if (typeof window === 'undefined') return;
  
  Object.values(SOUND_FILES).forEach(src => {
    const audio = new Audio();
    audio.src = src;
  });
};

export default {
  playSound,
  useBackgroundAudio,
  preloadSounds
};
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentBgm, setCurrentBgm] = useState(null); // { id, name, bgm_title, bgm_artist, bgm_url }
  const [unlocked, setUnlocked] = useState(false); // Autoplay bypass flag
  
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const targetVolume = 0.3; // Gentle background music volume

  useEffect(() => {
    // Initialize standard Audio element
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = targetVolume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      clearInterval(fadeIntervalRef.current);
    };
  }, []);

  // Sync mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Smoothly change the BGM source
  const changeBgm = (menu) => {
    if (!audioRef.current) return;
    
    // If the BGM is already the same, do nothing or just play if paused
    if (currentBgm && currentBgm.bgm_url === menu.bgm_url) {
      if (!isPlaying && unlocked) {
        playAudio();
      }
      return;
    }

    setCurrentBgm(menu);

    if (!unlocked) return; // Wait until audio is unlocked by user interaction

    // Fade out first
    let volume = audioRef.current.volume;
    clearInterval(fadeIntervalRef.current);
    
    fadeIntervalRef.current = setInterval(() => {
      volume -= 0.05;
      if (volume <= 0) {
        clearInterval(fadeIntervalRef.current);
        audioRef.current.volume = 0;
        
        // Change source and load
        audioRef.current.src = menu.bgm_url;
        audioRef.current.load();
        
        // Play and fade in
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            fadeIn();
          })
          .catch((err) => {
            console.error('Audio play failed:', err);
            setIsPlaying(false);
          });
      } else {
        audioRef.current.volume = volume;
      }
    }, 50);
  };

  const fadeIn = () => {
    let volume = 0;
    audioRef.current.volume = volume;
    clearInterval(fadeIntervalRef.current);

    fadeIntervalRef.current = setInterval(() => {
      volume += 0.03;
      if (volume >= targetVolume) {
        clearInterval(fadeIntervalRef.current);
        audioRef.current.volume = targetVolume;
      } else {
        audioRef.current.volume = volume;
      }
    }, 50);
  };

  const unlockAudio = (defaultMenu) => {
    setUnlocked(true);
    if (defaultMenu) {
      setCurrentBgm(defaultMenu);
      audioRef.current.src = defaultMenu.bgm_url;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error("Autoplay bypass play failed:", err);
        });
    }
  };

  const playAudio = () => {
    if (!audioRef.current || !unlocked) return;
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(err => console.error(err));
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <AudioContext.Provider value={{
      isPlaying,
      isMuted,
      currentBgm,
      unlocked,
      unlockAudio,
      changeBgm,
      togglePlay,
      toggleMute
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);

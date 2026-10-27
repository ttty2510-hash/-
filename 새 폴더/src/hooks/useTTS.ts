import { useEffect, useRef, useState } from 'react';

export const useTTS = (text: string, isPlaying: boolean, onEnd?: () => void) => {
  const synth = window.speechSynthesis;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // To keep track of the current text being spoken to prevent re-triggering same text
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    // If not playing, cancel and reset
    if (!isPlaying) {
      synth.cancel();
      setCurrentText("");
      return;
    }

    // If text changed and is playing, speak new text
    if (isPlaying && text && text !== currentText) {
      synth.cancel(); // Cancel any ongoing speech immediately
      
      // Small timeout helps ensure previous utterance is fully cancelled in some browsers
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        utterance.rate = 1.0; // Adjust rate if needed
        utterance.pitch = 1.0;
        
        if (onEnd) {
          utterance.onend = onEnd;
        }

        utteranceRef.current = utterance;
        setCurrentText(text);
        synth.speak(utterance);
      }, 50);
    }

    // Cleanup on unmount or when dependencies change significantly
    return () => {
      // Don't cancel here if just re-rendering, let the logic above handle text changes
    };
  }, [text, isPlaying, onEnd, synth, currentText]);
};
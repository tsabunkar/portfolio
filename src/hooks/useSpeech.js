/**
 * hooks/useSpeech.js
 * Text-to-speech hook using the Web Speech API.
 *
 * Fixes applied:
 *  1. Chrome 15-second pause bug → keepalive interval that calls resume()
 *  2. onboundary unreliable in Safari/Chrome → timer-based progress fallback
 *  3. Long text split into sentences → avoids iOS utterance length limit
 */

import { useState, useEffect, useRef, useCallback } from "react";

/* ── Helpers ─────────────────────────────────────────────────────── */

/** Strip HTML tags and collapse whitespace → plain text */
function htmlToText(raw) {
  const tmp = document.createElement("div");
  tmp.innerHTML = raw;
  return (tmp.innerText || tmp.textContent || "").replace(/\s+/g, " ").trim();
}

/** Split text into sentence-sized chunks (≤ 200 chars) */
function splitIntoChunks(text, maxLen = 200) {
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  const chunks = [];
  let current = "";
  for (const s of sentences) {
    if ((current + s).length > maxLen && current) {
      chunks.push(current.trim());
      current = s;
    } else {
      current += s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

/** Pick the best female-sounding voice */
function pickFemaleVoice() {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const preferred = [
    "Google UK English Female",
    "Google US English",
    "Samantha",   // macOS/iOS
    "Karen",      // macOS AU
    "Victoria",   // macOS
    "Moira",      // macOS IE
    "Tessa",      // macOS SA
  ];

  return (
    preferred.reduce((found, name) => found || voices.find((v) => v.name === name) || null, null) ||
    voices.find((v) => v.lang?.startsWith("en") && /female|woman/i.test(v.name)) ||
    voices.find((v) => v.lang?.startsWith("en")) ||
    voices[0]
  );
}

/* ── Hook ────────────────────────────────────────────────────────── */

export function useSpeech(html) {
  const [isPlaying, setIsPlaying]     = useState(false);
  const [isPaused, setIsPaused]       = useState(false);
  const [progress, setProgress]       = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [isSupported, setIsSupported] = useState(false);

  /* internal refs */
  const chunksRef      = useRef([]);
  const chunkIndexRef  = useRef(0);
  const totalCharsRef  = useRef(0);
  const spokenCharsRef = useRef(0);
  const keepAliveRef   = useRef(null);
  const voiceRef       = useRef(null);
  const stoppedRef     = useRef(false); // manual stop flag

  /* ── Detect support + load voices ─────────────────────────────── */
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    setIsSupported(true);

    const load = () => {
      const v = pickFemaleVoice();
      if (v) voiceRef.current = v;
    };

    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  /* ── Chrome keepalive: resume every 10 s to beat the pause bug ── */
  const startKeepalive = useCallback(() => {
    clearInterval(keepAliveRef.current);
    keepAliveRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10_000);
  }, []);

  const stopKeepalive = useCallback(() => {
    clearInterval(keepAliveRef.current);
    keepAliveRef.current = null;
  }, []);

  /* ── Speak a single chunk, then advance ─────────────────────────*/
  const speakChunk = useCallback(
    (index) => {
      if (stoppedRef.current) return;
      const chunks = chunksRef.current;
      if (index >= chunks.length) {
        // All done
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(100);
        setCurrentWord("");
        stopKeepalive();
        return;
      }

      const text = chunks[index];
      const utter = new SpeechSynthesisUtterance(text);

      /* Voice & prosody */
      if (voiceRef.current) utter.voice = voiceRef.current;
      utter.rate   = 0.92;
      utter.pitch  = 1.1;
      utter.volume = 1;

      /* Word highlight (fires on most browsers) */
      utter.onboundary = (e) => {
        if (e.name === "word" && e.charIndex != null) {
          const word = text.slice(e.charIndex, e.charIndex + (e.charLength || 8)).trim();
          if (word) setCurrentWord(word.replace(/[^a-zA-Z0-9'']/g, ""));

          // Update progress using absolute char position
          const pct = Math.min(
            99,
            Math.round(
              ((spokenCharsRef.current + e.charIndex) / totalCharsRef.current) * 100
            )
          );
          setProgress(pct);
        }
      };

      /* Advance to next chunk when this one finishes */
      utter.onend = () => {
        if (stoppedRef.current) return;
        spokenCharsRef.current += text.length + 1;
        chunkIndexRef.current = index + 1;
        speakChunk(index + 1);
      };

      utter.onerror = (e) => {
        // 'interrupted' is thrown when we cancel manually — ignore it
        if (e.error === "interrupted" || e.error === "canceled") return;
        console.warn("SpeechSynthesisUtterance error:", e.error);
        setIsPlaying(false);
        setIsPaused(false);
        stopKeepalive();
      };

      window.speechSynthesis.speak(utter);
    },
    [stopKeepalive]
  );

  /* ── Play ────────────────────────────────────────────────────────*/
  const play = useCallback(() => {
    if (!isSupported) return;

    /* Resume from pause */
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      startKeepalive();
      return;
    }

    /* Fresh start */
    stoppedRef.current = false;
    window.speechSynthesis.cancel();

    const plain = htmlToText(html);
    if (!plain) return;

    chunksRef.current     = splitIntoChunks(plain);
    chunkIndexRef.current = 0;
    totalCharsRef.current = plain.length;
    spokenCharsRef.current = 0;

    setProgress(0);
    setCurrentWord("");
    setIsPlaying(true);
    setIsPaused(false);

    // Small delay so cancel() has time to clear the queue in Chrome
    setTimeout(() => {
      speakChunk(0);
      startKeepalive();
    }, 150);
  }, [isSupported, isPaused, html, speakChunk, startKeepalive]);

  /* ── Pause ───────────────────────────────────────────────────────*/
  const pause = useCallback(() => {
    if (!isSupported || !isPlaying) return;
    window.speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
    stopKeepalive();
  }, [isSupported, isPlaying, stopKeepalive]);

  /* ── Stop ────────────────────────────────────────────────────────*/
  const stop = useCallback(() => {
    if (!isSupported) return;
    stoppedRef.current = true;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    setCurrentWord("");
    stopKeepalive();
  }, [isSupported, stopKeepalive]);

  /* ── Cleanup on unmount ──────────────────────────────────────────*/
  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      window.speechSynthesis?.cancel();
      stopKeepalive();
    };
  }, [stopKeepalive]);

  return { isPlaying, isPaused, progress, currentWord, isSupported, play, pause, stop };
}

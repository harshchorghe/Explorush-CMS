"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  Gauge,
  UserCheck,
} from "lucide-react";

export interface BlogAudioPlayerRef {
  playParagraph: (index: number) => void;
}

interface BlogAudioPlayerProps {
  title: string;
  paragraphs: string[];
  activeParagraphIndex: number | null;
  onParagraphChange: (index: number | null) => void;
  onPlayStateChange: (isPlaying: boolean, isPaused: boolean) => void;
}

const BlogAudioPlayer = forwardRef<BlogAudioPlayerRef, BlogAudioPlayerProps>(
  ({ title, paragraphs, activeParagraphIndex, onParagraphChange, onPlayStateChange }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [rate, setRate] = useState(1.0);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");

    // Maintain a ref to the utterance to control it or cancel
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // List of texts to read: title introduction followed by the paragraphs
    const textQueue = React.useMemo(() => {
      return [`Reading article: ${title}`, ...paragraphs];
    }, [title, paragraphs]);

    // Track state changes to notify parent component
    useEffect(() => {
      onPlayStateChange(isPlaying, isPaused);
    }, [isPlaying, isPaused, onPlayStateChange]);

    // Load available voices from SpeechSynthesis
    useEffect(() => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;

      const loadVoices = () => {
        const allVoices = window.speechSynthesis.getVoices();
        // Filter for English voices first as fallback or primary
        const englishVoices = allVoices.filter((v) => v.lang.startsWith("en"));
        const filtered = englishVoices.length > 0 ? englishVoices : allVoices;
        setVoices(filtered);

        // Pre-select a good sounding default voice if possible
        if (filtered.length > 0) {
          const defaultVoice =
            filtered.find(
              (v) =>
                v.name.includes("Google") ||
                v.name.includes("Natural") ||
                v.name.includes("Microsoft") ||
                v.name.includes("Apple")
            ) || filtered[0];
          setSelectedVoiceName(defaultVoice.name);
        }
      };

      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }

      // Cleanup: stop any speaking when component unmounts
      return () => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      };
    }, []);

    // Get current SpeechSynthesisVoice object based on selectedVoiceName state
    const getSelectedVoice = (): SpeechSynthesisVoice | null => {
      if (typeof window === "undefined" || !window.speechSynthesis) return null;
      return voices.find((v) => v.name === selectedVoiceName) || null;
    };

    // Speaks a given queue index
    const speakIndex = (queueIndex: number, currentRate = rate, voiceName = selectedVoiceName) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;

      window.speechSynthesis.cancel();

      if (queueIndex < 0 || queueIndex >= textQueue.length) {
        // Finished everything
        setIsPlaying(false);
        setIsPaused(false);
        onParagraphChange(null);
        return;
      }

      // Determine parent-facing paragraph index:
      // Index 0 in queue is the title introduction. We report it as -1 or 0 depending on highlight policy.
      // Let's report queue index 0 as paragraph index 0 (so first paragraph is highlighted while title intro reads),
      // or report it as null so highlight starts when paragraph 1 of queue (actual paragraph 0) starts.
      // Let's report queueIndex - 1 (meaning actual paragraphs starts from queueIndex = 1).
      // So queueIndex = 0 is introduction (parent index null), queueIndex = 1 is paragraph 0 (parent index 0), etc.
      const parentIndex = queueIndex === 0 ? null : queueIndex - 1;
      onParagraphChange(parentIndex);

      const text = textQueue[queueIndex];
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      utterance.rate = currentRate;
      const selectedVoice = voices.find((v) => v.name === voiceName);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        // Move to the next item in queue
        speakIndex(queueIndex + 1, currentRate, voiceName);
      };

      utterance.onerror = (event) => {
        // Don't treat manual cancel as error
        if (event.error !== "interrupted") {
          console.error("SpeechSynthesis error:", event);
          setIsPlaying(false);
          setIsPaused(false);
          onParagraphChange(null);
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    // Play paragraph triggered from body click
    const playParagraph = (paraIndex: number) => {
      // Map body paragraph index (0-indexed) to queue index (1-indexed, since queue index 0 is the title intro)
      const queueIndex = paraIndex + 1;
      speakIndex(queueIndex);
    };

    // Expose control method to parent
    useImperativeHandle(ref, () => ({
      playParagraph,
    }));

    const handlePlayPause = () => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;

      if (!isPlaying) {
        // Start from beginning (title intro)
        speakIndex(0);
      } else if (isPaused) {
        // Resume synthesis
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        // Pause synthesis
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    };

    const handleStop = () => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      onParagraphChange(null);
    };

    const handlePrev = () => {
      if (!isPlaying) return;
      // Get current queue index.
      // activeParagraphIndex is null for intro (queueIndex = 0), otherwise it is activeParagraphIndex.
      const currentQueueIndex = activeParagraphIndex === null ? 0 : activeParagraphIndex + 1;
      if (currentQueueIndex > 0) {
        speakIndex(currentQueueIndex - 1);
      }
    };

    const handleNext = () => {
      if (!isPlaying) return;
      const currentQueueIndex = activeParagraphIndex === null ? 0 : activeParagraphIndex + 1;
      if (currentQueueIndex < textQueue.length - 1) {
        speakIndex(currentQueueIndex + 1);
      }
    };

    const handleRateChange = (newRate: number) => {
      setRate(newRate);
      if (isPlaying) {
        const currentQueueIndex = activeParagraphIndex === null ? 0 : activeParagraphIndex + 1;
        speakIndex(currentQueueIndex, newRate, selectedVoiceName);
      }
    };

    const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const voiceName = e.target.value;
      setSelectedVoiceName(voiceName);
      if (isPlaying) {
        const currentQueueIndex = activeParagraphIndex === null ? 0 : activeParagraphIndex + 1;
        speakIndex(currentQueueIndex, rate, voiceName);
      }
    };

    // Calculate overall completion percentage
    // If not playing, 0. If playing intro, 5%. Otherwise, calculate based on paragraphs read
    const progressPercent = (() => {
      if (!isPlaying) return 0;
      if (activeParagraphIndex === null) return 5;
      const totalSteps = textQueue.length;
      const currentStep = activeParagraphIndex + 2; // +1 for 1-based index, +1 for title intro
      return Math.min(Math.round((currentStep / totalSteps) * 100), 100);
    })();

    return (
      <div className="bg-white border border-primary/10 rounded-2xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 space-y-4">
        {/* Top controls: Status & Settings */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isPlaying && !isPaused ? "bg-accent/20 text-primary" : "bg-primary/5 text-primary/60"
              }`}
            >
              <Volume2 className={`w-5 h-5 ${isPlaying && !isPaused ? "animate-bounce" : ""}`} />
            </div>
            <div>
              <h4 className="text-sm font-serif font-bold text-primary">
                {isPlaying
                  ? isPaused
                    ? "Reading Paused"
                    : activeParagraphIndex === null
                    ? "Reading Title Introduction..."
                    : `Reading Paragraph ${activeParagraphIndex + 1} of ${paragraphs.length}`
                  : "Listen to this Blog"}
              </h4>
              <p className="text-[11px] text-charcoal/50 font-sans">
                {isPlaying && !isPaused ? "Web Speech API Active" : "Click play to listen"}
              </p>
            </div>

            {/* Soundwave animation */}
            {isPlaying && !isPaused && (
              <div className="flex items-end gap-[3px] h-4 ml-1">
                <span className="w-[3px] h-3 bg-accent rounded-full animate-[pulse_0.8s_infinite] delay-100"></span>
                <span className="w-[3px] h-4 bg-primary rounded-full animate-[pulse_0.6s_infinite] delay-300"></span>
                <span className="w-[3px] h-2 bg-accent rounded-full animate-[pulse_0.7s_infinite] delay-200"></span>
                <span className="w-[3px] h-3 bg-primary rounded-full animate-[pulse_0.5s_infinite] delay-400"></span>
              </div>
            )}
          </div>

          {/* Voice & Speed selectors */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            {/* Speed Selector */}
            <div className="flex items-center gap-1.5 bg-cream px-2.5 py-1.5 rounded-lg border border-primary/5">
              <Gauge className="w-3.5 h-3.5 text-secondary" />
              <select
                value={rate}
                onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                className="bg-transparent border-none text-charcoal font-sans font-semibold focus:outline-none cursor-pointer"
                title="Playback Speed"
              >
                <option value="0.75">0.75x</option>
                <option value="1.0">1.0x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2.0">2.0x</option>
              </select>
            </div>

            {/* Voice Selector */}
            {voices.length > 0 && (
              <div className="flex items-center gap-1.5 bg-cream px-2.5 py-1.5 rounded-lg border border-primary/5 max-w-[200px] sm:max-w-[260px]">
                <UserCheck className="w-3.5 h-3.5 text-secondary shrink-0" />
                <select
                  value={selectedVoiceName}
                  onChange={handleVoiceChange}
                  className="bg-transparent border-none text-charcoal font-sans font-semibold focus:outline-none cursor-pointer truncate w-full"
                  title="Select Reader Voice"
                >
                  {voices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name.replace("Microsoft", "").replace("Google", "").trim()} ({v.lang.split("-")[0].toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Bottom controls: Audio buttons & progress bar */}
        <div className="space-y-3 pt-2 border-t border-primary/5">
          <div className="flex items-center justify-between gap-4">
            {/* Player Buttons */}
            <div className="flex items-center gap-2">
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                disabled={!isPlaying || (activeParagraphIndex === null)}
                className="p-2 bg-cream hover:bg-primary/5 disabled:opacity-40 disabled:hover:bg-cream rounded-lg border border-primary/5 transition-all text-charcoal cursor-pointer flex items-center justify-center"
                title="Previous Paragraph"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Play / Pause Toggle Button */}
              <button
                onClick={handlePlayPause}
                className="inline-flex items-center gap-2 px-5 py-2 bg-primary hover:bg-secondary text-cream rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm"
                title={isPlaying ? (isPaused ? "Resume" : "Pause") : "Listen"}
              >
                {isPlaying && !isPaused ? (
                  <>
                    <Pause className="w-4 h-4 fill-cream" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-cream" />
                    <span>{isPlaying && isPaused ? "Resume" : "Listen"}</span>
                  </>
                )}
              </button>

              {/* Stop Button */}
              <button
                onClick={handleStop}
                disabled={!isPlaying}
                className="p-2 bg-cream hover:bg-red-50 hover:text-red-600 disabled:opacity-40 disabled:hover:bg-cream disabled:hover:text-charcoal rounded-lg border border-primary/5 transition-all text-charcoal cursor-pointer flex items-center justify-center"
                title="Stop Reading"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                disabled={!isPlaying || (activeParagraphIndex !== null && activeParagraphIndex >= paragraphs.length - 1)}
                className="p-2 bg-cream hover:bg-primary/5 disabled:opacity-40 disabled:hover:bg-cream rounded-lg border border-primary/5 transition-all text-charcoal cursor-pointer flex items-center justify-center"
                title="Next Paragraph"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Percentage Display */}
            {isPlaying && (
              <span className="text-[11px] font-sans font-bold text-accent">
                {progressPercent}% Complete
              </span>
            )}
          </div>

          {/* Progress Bar Container */}
          {isPlaying && (
            <div className="w-full h-1.5 bg-cream rounded-full overflow-hidden border border-primary/5">
              <div
                className="h-full bg-accent transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

BlogAudioPlayer.displayName = "BlogAudioPlayer";

export default BlogAudioPlayer;

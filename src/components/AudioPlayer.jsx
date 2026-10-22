import { useEffect, useMemo, useRef, useState } from "react";
import { FastForward, Pause, Play, Rewind, Volume1, Volume2, VolumeX } from "lucide-react";
import "./AudioPlayer.css";

const MIN_BAR_HEIGHT = 3;
const MAX_BAR_HEIGHT = 36;
const DEFAULT_BAR_COUNT = 96;
const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5];

const clampVolume = (value) => Math.max(0, Math.min(1, Number.isFinite(Number(value)) ? Number(value) : 1));

const isCrossOriginUrl = (url) => {
  try {
    return new URL(url, globalThis.location?.href).origin !== globalThis.location?.origin;
  } catch {
    return false;
  }
};

/**
 * Basic fallback waveform generated when audio cannot be decoded or CORS blocked
 */
function generateBasicWaves({ audioUrl, callId, durationSeconds = 120, score = 75, segmentCount = DEFAULT_BAR_COUNT }) {
  let seed = 0;
  const str = `${callId || ""}-${audioUrl || ""}-${score || 75}-${durationSeconds || 120}`;
  for (let i = 0; i < str.length; i++) {
    seed = (seed * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  const random = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 4294967296;
  };

  const scoreFactor = Math.max(0.35, Math.min(1, score / 100));
  const bars = [];
  const sentenceRhythm = 4 + Math.round((durationSeconds / 28));

  for (let i = 0; i < segmentCount; i++) {
    const progress = i / segmentCount;
    const cadence = Math.sin(progress * Math.PI * sentenceRhythm);
    const isPause = cadence < -0.62;

    if (isPause) {
      bars.push(Math.round(MIN_BAR_HEIGHT + random() * 2));
      continue;
    }

    const syllableWave = Math.sin(progress * 52 * Math.PI) * 0.35 + 0.65;
    const pitchJitter = Math.sin(i * 0.85) * 0.25 + 0.75;
    const noise = (random() - 0.5) * 0.25;

    let amplitude = Math.abs(cadence) * syllableWave * pitchJitter * (0.55 + scoreFactor * 0.45) + noise;

    if (scoreFactor > 0.78 && random() > 0.78) {
      amplitude = Math.min(1, amplitude * 1.35);
    } else if (scoreFactor < 0.6) {
      amplitude = amplitude * 0.78;
    }

    amplitude = Math.max(0.06, Math.min(1, amplitude));
    const h = Math.round(MIN_BAR_HEIGHT + amplitude * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT));
    bars.push(h);
  }

  return bars;
}

const createWaveform = (audioBuffer, segmentCount) => {
  const channels = Array.from({ length: audioBuffer.numberOfChannels }, (_, index) => audioBuffer.getChannelData(index));
  const amplitudes = new Array(segmentCount).fill(0);
  let maxAmplitude = 0;

  for (let segment = 0; segment < segmentCount; segment += 1) {
    const start = Math.floor((segment * audioBuffer.length) / segmentCount);
    const end = Math.max(start + 1, Math.floor(((segment + 1) * audioBuffer.length) / segmentCount));
    let sumSquares = 0;
    let sampleCount = 0;

    for (const channel of channels) {
      for (let sample = start; sample < Math.min(end, channel.length); sample += 1) {
        sumSquares += channel[sample] * channel[sample];
        sampleCount += 1;
      }
    }

    const rms = sampleCount > 0 ? Math.sqrt(sumSquares / sampleCount) : 0;
    amplitudes[segment] = rms;
    maxAmplitude = Math.max(maxAmplitude, rms);
  }

  return amplitudes.map((amplitude) => {
    const normalized = maxAmplitude > 0 ? amplitude / maxAmplitude : 0;
    return Math.round(MIN_BAR_HEIGHT + normalized * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT));
  });
};

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
};

export default function AudioPlayer({
  audioUrl,
  callId = "",
  score = 75,
  durationSeconds = 120,
  initialVolume = 1,
  skipSeconds = 10,
  waveformBars = DEFAULT_BAR_COUNT,
  className = "",
}) {
  const startingVolume = clampVolume(initialVolume);
  const segmentCount = Math.max(1, Math.floor(Number(waveformBars) || DEFAULT_BAR_COUNT));
  const audioRef = useRef(null);
  const waveformRef = useRef(null);
  const audioContextRef = useRef(null);
  const waveformRequestRef = useRef(0);
  const volumeRef = useRef(startingVolume);
  const mutedRef = useRef(startingVolume === 0);
  const lastAudibleVolumeRef = useRef(startingVolume > 0 ? startingVolume : 1);
  const loadTimerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [waveform, setWaveform] = useState([]);
  const [isWaveformLoading, setIsWaveformLoading] = useState(Boolean(audioUrl));
  const [waveformError, setWaveformError] = useState("");
  const [volume, setVolume] = useState(startingVolume);
  const [isMuted, setIsMuted] = useState(startingVolume === 0);
  const [audioError, setAudioError] = useState("");

  // Basic waveform fallback if audio fails to decode
  const basicWaves = useMemo(() => {
    return generateBasicWaves({
      audioUrl,
      callId,
      durationSeconds: duration || durationSeconds || 120,
      score,
      segmentCount,
    });
  }, [audioUrl, callId, duration, durationSeconds, score, segmentCount]);

  // Audio element setup
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioError("");

    if (!audioUrl) {
      setAudioError("No audio URL provided.");
      return undefined;
    }

    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = volumeRef.current;
    audio.muted = mutedRef.current;
    audio.playbackRate = playbackSpeed;
    audioRef.current = audio;
    audio.src = audioUrl;

    const handleMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handlePlay = () => {
      setIsPlaying(true);
      setAudioError("");
    };
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio.duration || 0);
    };
    const handleError = () => {
      setIsPlaying(false);
      setAudioError("Audio playback failed to load.");
    };

    audio.addEventListener("loadedmetadata", handleMetadata);
    audio.addEventListener("durationchange", handleMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleMetadata);
      audio.removeEventListener("durationchange", handleMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeAttribute("src");
      audio.load();
      if (audioRef.current === audio) audioRef.current = null;
    };
  }, [audioUrl]);

  // Origin audio audioContext waves with required error handling
  useEffect(() => {
    const controller = new AbortController();
    const requestId = waveformRequestRef.current + 1;
    waveformRequestRef.current = requestId;
    setWaveform([]);
    setWaveformError("");
    setIsWaveformLoading(Boolean(audioUrl));

    if (!audioUrl) {
      setIsWaveformLoading(false);
      setWaveformError("Waveform is unavailable for this call.");
      return () => controller.abort();
    }

    const AudioContextConstructor = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContextConstructor) {
      setIsWaveformLoading(false);
      const errMsg = "Waveform analysis is not supported by this browser.";
      setWaveformError(errMsg);
      console.warn(errMsg);
      return () => controller.abort();
    }

    const generateWaveform = async () => {
      let stage = "context";
      try {
        let audioContext = audioContextRef.current;
        if (!audioContext || audioContext.state === "closed") {
          audioContext = new AudioContextConstructor();
          audioContextRef.current = audioContext;
        }
        stage = "fetch";
        const response = await fetch(audioUrl, { signal: controller.signal, mode: "cors" });
        if (controller.signal.aborted || waveformRequestRef.current !== requestId) return;
        if (!response.ok) {
          const errMsg = `Waveform request failed: the server returned HTTP ${response.status}. Playback remains available.`;
          setWaveformError(errMsg);
          console.warn(errMsg);
          return;
        }

        const audioData = await response.arrayBuffer();
        if (controller.signal.aborted || waveformRequestRef.current !== requestId) return;
        stage = "decode";
        const decodedAudio = await audioContext.decodeAudioData(audioData);
        if (controller.signal.aborted || waveformRequestRef.current !== requestId) return;

        // Origin audio AudioContext waves successfully generated
        setWaveform(createWaveform(decodedAudio, segmentCount));
      } catch (processingError) {
        if (!controller.signal.aborted && waveformRequestRef.current === requestId) {
          if (processingError.name === "AbortError") return;
          let errorMessage = "";
          if (stage === "decode") {
            errorMessage = "The audio was downloaded but its format could not be decoded. Playback and seeking remain available.";
            setWaveformError(errorMessage);
          } else if (stage === "context") {
            errorMessage = "This browser could not initialize audio analysis. Playback and seeking remain available.";
            setWaveformError(errorMessage);
          } else if (processingError instanceof TypeError && isCrossOriginUrl(audioUrl)) {
            errorMessage = "Waveform fetch was blocked or unreachable across origins. The audio host must allow CORS, or the file must be hosted same-origin. Playback remains available.";
            setWaveformError(errorMessage);
          } else {
            errorMessage = "The audio file could not be downloaded for waveform analysis. Check the URL and network connection. Playback remains available.";
            setWaveformError(errorMessage);
          }
          console.log(errorMessage);
        }
      } finally {
        if (!controller.signal.aborted && waveformRequestRef.current === requestId) {
          loadTimerRef.current = setTimeout(() => {
            if (!controller.signal.aborted && waveformRequestRef.current === requestId) {
              setIsWaveformLoading(false);
            }
          }, 380);
        }
      }
    };

    generateWaveform();
    return () => {
      clearTimeout(loadTimerRef.current);
      controller.abort();
      waveformRequestRef.current += 1;
    };
  }, [audioUrl, segmentCount]);

  useEffect(() => () => {
    const audioContext = audioContextRef.current;
    if (audioContext && audioContext.state !== "closed") {
      audioContext.close().catch(() => {});
      audioContextRef.current = null;
    }
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || audioError) return;

    if (audio.paused) {
      if (audio.ended) audio.currentTime = 0;
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
        setAudioError("Playback failed.");
      }
    } else {
      audio.pause();
    }
  };

  const seekTo = (clientX) => {
    const audio = audioRef.current;
    const waveformElement = waveformRef.current;
    if (!audio || !duration || !waveformElement) return;
    const bounds = waveformElement.getBoundingClientRect();
    if (!bounds.width) return;
    const ratio = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width));
    const nextTime = ratio * duration;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const skipAudio = (seconds) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds));
    setCurrentTime(audio.currentTime);
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const changeVolume = (event) => {
    const nextVolume = Number(event.currentTarget.value);
    const nextMuted = nextVolume === 0;
    setVolume(nextVolume);
    setIsMuted(nextMuted);
    volumeRef.current = nextVolume;
    mutedRef.current = nextMuted;
    if (nextVolume > 0) lastAudibleVolumeRef.current = nextVolume;
    if (audioRef.current) {
      audioRef.current.volume = nextVolume;
      audioRef.current.muted = nextMuted;
    }
  };

  const toggleMute = () => {
    const shouldUnmute = isMuted || volume === 0;
    const nextVolume = shouldUnmute && volume === 0 ? lastAudibleVolumeRef.current : volume;
    const nextMuted = !shouldUnmute;
    setVolume(nextVolume);
    setIsMuted(nextMuted);
    volumeRef.current = nextVolume;
    mutedRef.current = nextMuted;
    if (audioRef.current) {
      audioRef.current.volume = nextVolume;
      audioRef.current.muted = nextMuted;
    }
  };

  const progress = duration ? Math.min(currentTime / duration, 1) : 0;
  const volumeFill = isMuted ? 0 : volume;

  // Default straight line (height: 2px) shown initially while audio file is loading
  const straightLine = useMemo(() => {
    return new Array(segmentCount).fill(2);
  }, [segmentCount]);

  // Once loading finishes, dynamic wave as per audio file is shown
  const dynamicWaveform = waveform.length > 0 ? waveform : basicWaves;
  const isLoaded = !isWaveformLoading;
  const activeWaveform = isLoaded ? dynamicWaveform : straightLine;
  
  // Calculate which single bar is currently playing (only this one breathes!)
  const currentPlayIndex = Math.min(activeWaveform.length - 1, Math.floor(progress * activeWaveform.length));

  return (
    <div className={`modern-player-card ${className}`.trim()} role="group" aria-label="Audio player">
      {/* ── Dense Amplifier Acoustic Waveform Scrubber ── */}
      <div
        ref={waveformRef}
        className={`modern-player-waveform-box amplifier-mode ${!isLoaded ? "straight-line-mode" : ""}`}
        role="slider"
        tabIndex={duration && !audioError ? 0 : -1}
        aria-label="Seek audio waveform"
        aria-valuemin={0}
        aria-valuemax={duration || 0}
        aria-valuenow={Math.min(currentTime, duration || 0)}
        onPointerDown={(event) => {
          if (!duration || audioError || !isLoaded) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          seekTo(event.clientX);
        }}
        onPointerMove={(event) => {
          if (event.buttons > 0 && isLoaded) seekTo(event.clientX);
        }}
      >
        <div className={`modern-player-waveform ${!isLoaded ? "straight-line-active" : ""}`} aria-hidden="true">
          {activeWaveform.map((height, index) => {
            const isPlayed = index / activeWaveform.length <= progress;
            // ONLY the current playing bar breathes when audio is actively playing!
            const isCurrentPlayBar = isPlaying && index === currentPlayIndex && isLoaded;

            return (
              <span
                key={index}
                className={`modern-wave-bar amplifier-bar ${isPlayed ? "played" : "unplayed"} ${isCurrentPlayBar ? "breath-current" : ""}`}
                style={{
                  height: `${height}px`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ── Bottom Row: Controls, Duration, Speed Pills, Volume (All Aligned With Start/Pause) ── */}
      <div className="modern-player-bottom">
        <div className="modern-player-left">
          {/* Transport Controls */}
          <div className="modern-player-controls">
            {/* Skip Backward 10s */}
            <button
              type="button"
              className="modern-player-skip-btn"
              onClick={() => skipAudio(-skipSeconds)}
              disabled={!duration || Boolean(audioError)}
              title={`Rewind ${skipSeconds} seconds`}
            >
              <Rewind size={14} aria-hidden="true" />
            </button>

            {/* Play / Pause Toggle Button */}
            <button
              type="button"
              className="modern-player-play-btn"
              onClick={togglePlayback}
              disabled={!audioUrl || Boolean(audioError)}
              aria-label={isPlaying ? "Pause audio" : "Play audio"}
            >
              {isPlaying ? (
                <Pause size={17} fill="currentColor" aria-hidden="true" />
              ) : (
                <Play size={17} fill="currentColor" style={{ marginLeft: 2 }} aria-hidden="true" />
              )}
            </button>

            {/* Skip Forward 10s */}
            <button
              type="button"
              className="modern-player-skip-btn"
              onClick={() => skipAudio(skipSeconds)}
              disabled={!duration || Boolean(audioError)}
              title={`Forward ${skipSeconds} seconds`}
            >
              <FastForward size={14} aria-hidden="true" />
            </button>
          </div>

          {/* Time display: moved to bottom row, aligned with start/pause button */}
          <div className="modern-player-time">
            <span className="modern-player-time-current">{formatTime(currentTime)}</span>
            <span className="modern-player-time-sep">/</span>
            <span className="modern-player-time-total">{formatTime(duration || durationSeconds)}</span>
          </div>
        </div>

        <div className="modern-player-right">
          {/* Playback speed selector: moved to bottom row, aligned with start/pause button */}
          <div className="modern-player-speeds" role="toolbar" aria-label="Playback speed">
            {PLAYBACK_SPEEDS.map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => changeSpeed(speed)}
                className={`modern-speed-pill ${playbackSpeed === speed ? "active" : ""}`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Volume & Mute */}
          <div className="modern-player-volume-wrap">
            <button
              type="button"
              className="modern-player-mute-btn"
              onClick={toggleMute}
              disabled={Boolean(audioError)}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX size={15} />
              ) : volume < 0.5 ? (
                <Volume1 size={15} />
              ) : (
                <Volume2 size={15} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volumeFill}
              onChange={changeVolume}
              className="modern-player-volume-slider"
              style={{ "--volume-fill": `${volumeFill * 100}%` }}
              aria-label="Volume"
            />
          </div>
        </div>
      </div>

      {audioError && <p className="modern-player-error">{audioError}</p>}
    </div>
  );
}

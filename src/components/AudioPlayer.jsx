import { useEffect, useRef, useState } from "react";
import { FastForward, Pause, Play, Rewind, Volume1, Volume2, VolumeX } from "lucide-react";
import "./AudioPlayer.css";

const DEFAULT_WAVEFORM_BARS = 120;
const MIN_BAR_HEIGHT = 3;
const MAX_BAR_HEIGHT = 40;

const clampVolume = (value) => Math.max(0, Math.min(1, Number.isFinite(Number(value)) ? Number(value) : 1));

const isCrossOriginUrl = (url) => {
  try {
    return new URL(url, globalThis.location?.href).origin !== globalThis.location?.origin;
  } catch {
    return false;
  }
};

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
  initialVolume = 1,
  skipSeconds = 10,
  waveformBars = DEFAULT_WAVEFORM_BARS,
  className = "",
}) {
  const startingVolume = clampVolume(initialVolume);
  const segmentCount = Math.max(1, Math.floor(Number(waveformBars) || DEFAULT_WAVEFORM_BARS));
  const audioRef = useRef(null);
  const waveformRef = useRef(null);
  const audioContextRef = useRef(null);
  const waveformRequestRef = useRef(0);
  const volumeRef = useRef(startingVolume);
  const mutedRef = useRef(startingVolume === 0);
  const lastAudibleVolumeRef = useRef(startingVolume > 0 ? startingVolume : 1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(audioUrl));
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveform, setWaveform] = useState([]);
  const [isWaveformLoading, setIsWaveformLoading] = useState(Boolean(audioUrl));
  const [waveformError, setWaveformError] = useState("");
  const [volume, setVolume] = useState(startingVolume);
  const [isMuted, setIsMuted] = useState(startingVolume === 0);
  const [audioError, setAudioError] = useState("");

  useEffect(() => {
    setIsPlaying(false);
    setIsLoading(Boolean(audioUrl));
    setCurrentTime(0);
    setDuration(0);
    setAudioError("");

    if (!audioUrl) {
      setIsLoading(false);
      setAudioError("No audio file URL was provided.");
      return undefined;
    }

    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = volumeRef.current;
    audio.muted = mutedRef.current;
    audioRef.current = audio;
    audio.src = audioUrl;

    const handleMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setIsLoading(false);
    };
    const handleCanPlay = () => setIsLoading(false);
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
      setIsLoading(false);
      setIsPlaying(false);
      const mediaErrorMessages = {
        2: "Audio playback failed because of a network error.",
        3: "The audio file could not be decoded for playback.",
        4: "This audio format or source is not supported for playback.",
      };
      setAudioError(mediaErrorMessages[audio.error?.code] || "Audio playback could not be loaded.");
    };

    audio.addEventListener("loadedmetadata", handleMetadata);
    audio.addEventListener("durationchange", handleMetadata);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleMetadata);
      audio.removeEventListener("durationchange", handleMetadata);
      audio.removeEventListener("canplay", handleCanPlay);
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
      setWaveformError("Waveform analysis is not supported by this browser.");
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
          setWaveformError(`Waveform request failed: the server returned HTTP ${response.status}. Playback remains available.`);
          return;
        }

        const audioData = await response.arrayBuffer();
        if (controller.signal.aborted || waveformRequestRef.current !== requestId) return;
        stage = "decode";
        const decodedAudio = await audioContext.decodeAudioData(audioData);
        if (controller.signal.aborted || waveformRequestRef.current !== requestId) return;

        setWaveform(createWaveform(decodedAudio, segmentCount));
      } catch (processingError) {
        if (!controller.signal.aborted && waveformRequestRef.current === requestId) {
          if (processingError.name === "AbortError") return;
          if (stage === "decode") {
            setWaveformError("The audio was downloaded but its format could not be decoded. Playback and seeking remain available.");
          } else if (stage === "context") {
            setWaveformError("This browser could not initialize audio analysis. Playback and seeking remain available.");
          } else if (processingError instanceof TypeError && isCrossOriginUrl(audioUrl)) {
            setWaveformError("Waveform fetch was blocked or unreachable across origins. The audio host must allow CORS, or the file must be hosted same-origin. Playback remains available.");
          } else {
            setWaveformError("The audio file could not be downloaded for waveform analysis. Check the URL and network connection. Playback remains available.");
          }
        }
      } finally {
        if (!controller.signal.aborted && waveformRequestRef.current === requestId) setIsWaveformLoading(false);
      }
    };

    generateWaveform();
    return () => {
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
        setAudioError("Playback failed. Check the audio URL or browser permissions.");
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

  const handleWaveformKeyDown = (event) => {
    if (!duration) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      skipAudio(-5);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      skipAudio(5);
    } else if (event.key === "Home") {
      event.preventDefault();
      seekTo(-Infinity);
    } else if (event.key === "End") {
      event.preventDefault();
      seekTo(Infinity);
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
  const statusMessage = audioError || waveformError || (isWaveformLoading ? "Analyzing waveform…" : isLoading ? "Loading audio…" : "");
  const hasError = Boolean(audioError || waveformError);

  return (
    <div className={`audio-player ${className}`.trim()} role="group" aria-label="Audio player">
      <div className="audio-player__transport">
        <button
          type="button"
          className="audio-player__toggle"
          onClick={togglePlayback}
          disabled={!audioUrl || Boolean(audioError)}
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
          title={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? <Pause size={22} fill="currentColor" aria-hidden="true" /> : <Play size={22} fill="currentColor" aria-hidden="true" />}
        </button>
        <div className="audio-player__skip-row">
        <button type="button" className="audio-player__skip" onClick={() => skipAudio(-skipSeconds)} disabled={!duration || Boolean(audioError)} aria-label={`Rewind ${skipSeconds} seconds`} title={`Rewind ${skipSeconds} seconds`}>
          <Rewind size={16} aria-hidden="true" />
        </button>
        <button type="button" className="audio-player__skip" onClick={() => skipAudio(skipSeconds)} disabled={!duration || Boolean(audioError)} aria-label={`Forward ${skipSeconds} seconds`} title={`Forward ${skipSeconds} seconds`}>
          <FastForward size={16} aria-hidden="true" />
        </button>
        </div>
      </div>

      <div
        ref={waveformRef}
        className="audio-player__waveform-wrap"
        role="slider"
        tabIndex={duration && !audioError ? 0 : -1}
        aria-disabled={!duration || Boolean(audioError)}
        aria-label="Seek audio waveform"
        aria-valuemin={0}
        aria-valuemax={duration || 0}
        aria-valuenow={Math.min(currentTime, duration || 0)}
        aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        onPointerDown={(event) => {
          if (!duration || audioError) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          seekTo(event.clientX);
        }}
        onPointerMove={(event) => {
          if (event.buttons > 0) seekTo(event.clientX);
        }}
        onKeyDown={handleWaveformKeyDown}
      >
        <div className="audio-player__waveform" aria-hidden="true">
          {waveform.length > 0 ? waveform.map((height, index) => (
            <span
              key={index}
              className={`audio-player__bar${index / waveform.length < progress ? " audio-player__bar--played" : ""}`}
              style={{ height: `${height}px` }}
            />
          )) : (
            <span className="audio-player__fallback-track">
              <span className="audio-player__fallback-progress" style={{ width: `${progress * 100}%` }} />
            </span>
          )}
        </div>
      </div>

      <div className="audio-player__time" aria-live="off">
        <span>{formatTime(currentTime)}</span>
        <span aria-hidden="true">/</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="audio-player__volume">
        <button
          type="button"
          className="audio-player__mute"
          onClick={toggleMute}
          disabled={Boolean(audioError)}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          title={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {isMuted ? <VolumeX size={17} aria-hidden="true" /> : volume < 0.5 ? <Volume1 size={17} aria-hidden="true" /> : <Volume2 size={17} aria-hidden="true" />}
        </button>
        <input
          className="audio-player__volume-range"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volumeFill}
          onChange={changeVolume}
          style={{ "--volume-fill": `${volumeFill * 100}%` }}
          disabled={Boolean(audioError)}
          aria-label="Volume"
        />
      </div>

      {statusMessage && (
        <div className={`audio-player__message${hasError ? " audio-player__message--error" : ""}`} role={hasError ? "alert" : "status"}>
          {statusMessage}
        </div>
      )}
    </div>
  );
}

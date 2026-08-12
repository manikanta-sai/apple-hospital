import { useEffect } from "react";

/**
 * Build a tiny WAV file in memory — no external audio asset needed.
 * Returns an object-URL that can be fed straight to `new Audio(url)`.
 */
function createChimeWav() {
  const sampleRate = 22050;
  const duration = 0.5; // seconds
  const numSamples = Math.floor(sampleRate * duration);

  // Synthesise a two-tone chime with exponential decay.
  const samples = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-t * 8);
    const tone1 = Math.sin(2 * Math.PI * 830 * t) * 0.3;             // E5
    const tone2 = Math.sin(2 * Math.PI * 1245 * t) * 0.2 * (t > 0.06 ? 1 : 0); // B5, delayed
    samples[i] = (tone1 + tone2) * envelope;
  }

  // Convert to 16-bit PCM.
  const pcm = new Int16Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    pcm[i] = Math.max(-32768, Math.min(32767, Math.floor(samples[i] * 32767)));
  }

  // Assemble a minimal WAV container.
  const wavBuffer = new ArrayBuffer(44 + pcm.length * 2);
  const v = new DataView(wavBuffer);

  const writeStr = (offset, str) => {
    for (let i = 0; i < str.length; i++) v.setUint8(offset + i, str.charCodeAt(i));
  };

  writeStr(0, "RIFF");
  v.setUint32(4, 36 + pcm.length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  v.setUint32(16, 16, true);           // sub-chunk size
  v.setUint16(20, 1, true);            // PCM format
  v.setUint16(22, 1, true);            // mono
  v.setUint32(24, sampleRate, true);    // sample rate
  v.setUint32(28, sampleRate * 2, true);// byte rate
  v.setUint16(32, 2, true);            // block align
  v.setUint16(34, 16, true);           // bits per sample
  writeStr(36, "data");
  v.setUint32(40, pcm.length * 2, true);

  for (let i = 0; i < pcm.length; i++) {
    v.setInt16(44 + i * 2, pcm[i], true);
  }

  return URL.createObjectURL(new Blob([wavBuffer], { type: "audio/wav" }));
}

/**
 * useOpenSound
 * ------------
 * Plays a notification chime **once, immediately on page load**.
 * Uses an in-memory WAV via HTMLAudioElement for the best chance of
 * passing browser autoplay policy (especially on localhost / sites
 * with prior user engagement).
 */
export function useOpenSound() {
  useEffect(() => {
    const url = createChimeWav();
    const audio = new Audio(url);
    audio.volume = 0.5;

    // .play() returns a Promise — if the browser blocks autoplay it
    // rejects silently; we just swallow the error.
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      URL.revokeObjectURL(url);
    };
  }, []); // run once on mount
}

/**
 * High quality in-memory procedural audio generator for MS2 Music Player.
 * Generates genuine multi-layered melodic music (drums, bass, melodies, harmonies)
 * and returns clean blob URLs so that every demo track plays real music immediately.
 */

// Helper to write string into DataView
function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Convert audio buffer / Float32Array to 16-bit PCM WAV Blob
function bufferToWaveBlob(left: Float32Array, right: Float32Array, sampleRate: number): string {
  const numChannels = 2;
  const numSamples = left.length;
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;
  const buffer = new ArrayBuffer(44 + numSamples * blockAlign);
  const view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* file length */
  view.setUint32(4, 36 + numSamples * blockAlign, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 1, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate */
  view.setUint32(28, byteRate, true);
  /* block align */
  view.setUint16(32, blockAlign, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, numSamples * blockAlign, true);

  // Write interleaved 16-bit PCM samples with soft limiting
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    // Left channel
    let sampleL = Math.max(-1, Math.min(1, left[i]));
    sampleL = sampleL < 0 ? sampleL * 0x8000 : sampleL * 0x7fff;
    view.setInt16(offset, sampleL, true);
    offset += 2;

    // Right channel
    let sampleR = Math.max(-1, Math.min(1, right[i]));
    sampleR = sampleR < 0 ? sampleR * 0x8000 : sampleR * 0x7fff;
    view.setInt16(offset, sampleR, true);
    offset += 2;
  }

  const blob = new Blob([view], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

// Cache generated URLs so we don't recalculate multiple times
const audioCache = new Map<string, string>();

export function getProceduralAudioUrl(genreKey: string, durationSec: number = 38): string {
  if (audioCache.has(genreKey)) {
    return audioCache.get(genreKey)!;
  }

  const sampleRate = 22050; // Optimized for mobile 4GB RAM & instant generation
  const totalSamples = Math.floor(sampleRate * durationSec);
  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);

  // Scales & frequencies
  const notes = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.0
  };

  // Assamese Pentatonic Folk Scale (Sa, Re, Ma, Pa, Dha)
  const assameseScale = [notes.C4, notes.D4, notes.F4, notes.G4, notes.A4, notes.C5, notes.D5];
  // EDM / Synthwave minor scale
  const edmScale = [notes.A3, notes.C4, notes.D4, notes.E4, notes.G4, notes.A4, notes.C5];
  // Acoustic Folk Major scale
  const acousticScale = [notes.G3, notes.B3, notes.D4, notes.E4, notes.G4, notes.B4, notes.D5];
  // Himalayan Flute Scale
  const nepaliScale = [notes.D4, notes.F4, notes.G4, notes.A4, notes.C5, notes.D5];
  // Bengali Baul Melodic
  const baulScale = [notes.C4, notes.E4, notes.F4, notes.G4, notes.B4, notes.C5];

  let activeScale = assameseScale;
  let tempoBpm = 110;

  if (genreKey.includes('edm') || genreKey.includes('nightwave')) {
    activeScale = edmScale;
    tempoBpm = 126;
  } else if (genreKey.includes('acoustic') || genreKey.includes('embers')) {
    activeScale = acousticScale;
    tempoBpm = 86;
  } else if (genreKey.includes('nepali') || genreKey.includes('himalaya')) {
    activeScale = nepaliScale;
    tempoBpm = 95;
  } else if (genreKey.includes('bengali') || genreKey.includes('baul')) {
    activeScale = baulScale;
    tempoBpm = 102;
  } else if (genreKey.includes('assamese') || genreKey.includes('bihu')) {
    activeScale = assameseScale;
    tempoBpm = 118;
  }

  const beatDuration = 60 / tempoBpm;
  const samplesPerBeat = Math.floor(sampleRate * beatDuration);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const currentBeat = Math.floor(i / samplesPerBeat);
    const beatFraction = (i % samplesPerBeat) / samplesPerBeat;

    let drum = 0;
    let bass = 0;
    let melody = 0;
    let pad = 0;

    // 1. Kick / Dhol beat pattern
    if (genreKey.includes('assamese') || genreKey.includes('bihu')) {
      // Assamese Dhol rhythm: syncopated beats
      const dholHit = beatFraction < 0.18 ? Math.exp(-beatFraction * 20) * Math.sin(2 * Math.PI * 65 * t * (1 - beatFraction * 0.5)) : 0;
      // Pepa/Taal accent on off-beats
      const pepaHit = (currentBeat % 2 === 1 && beatFraction < 0.12) ? Math.exp(-beatFraction * 30) * Math.sin(2 * Math.PI * 450 * t) * 0.25 : 0;
      drum = dholHit * 0.45 + pepaHit;
    } else if (genreKey.includes('edm') || genreKey.includes('nightwave')) {
      // 4-on-the-floor kick
      const kickHit = beatFraction < 0.15 ? Math.exp(-beatFraction * 24) * Math.sin(2 * Math.PI * (120 - beatFraction * 80) * t) : 0;
      // Hi-hat on eighth notes
      const isEighth = (i % Math.floor(samplesPerBeat / 2)) / (samplesPerBeat / 2);
      const hihat = (isEighth < 0.08) ? (Math.random() * 2 - 1) * Math.exp(-isEighth * 40) * 0.15 : 0;
      drum = kickHit * 0.5 + hihat;
    } else {
      // Soft acoustic percussion / heartbeat
      const softBeat = beatFraction < 0.12 ? Math.exp(-beatFraction * 18) * Math.sin(2 * Math.PI * 80 * t) * 0.3 : 0;
      drum = softBeat;
    }

    // 2. Bassline
    const bassNoteIndex = (Math.floor(currentBeat / 2)) % activeScale.length;
    const bassFreq = (activeScale[bassNoteIndex] || 130) / 2;
    bass = Math.sin(2 * Math.PI * bassFreq * t) * 0.25;
    bass += Math.sin(2 * Math.PI * (bassFreq * 2) * t) * 0.08; // subtle overtone

    // 3. Melodic lead (pentatonic phrases with soothing release)
    const melodyIndex = (Math.floor(currentBeat * 1.5) + (currentBeat % 3)) % activeScale.length;
    const noteFreq = activeScale[melodyIndex] || 440;
    const noteEnv = Math.exp(-beatFraction * 4.5);
    // Flute / Lead synth character with subtle vibrato
    const vibrato = Math.sin(2 * Math.PI * 5 * t) * 2;
    melody = Math.sin(2 * Math.PI * (noteFreq + vibrato) * t) * noteEnv * 0.28;
    melody += Math.sin(2 * Math.PI * (noteFreq * 2) * t) * noteEnv * 0.08;

    // 4. Warm harmonic pad (rich ambient chords)
    const padFreq1 = activeScale[currentBeat % 3] || 261;
    const padFreq2 = activeScale[(currentBeat + 2) % activeScale.length] || 392;
    pad = (Math.sin(2 * Math.PI * padFreq1 * t) + Math.sin(2 * Math.PI * padFreq2 * t)) * 0.06;

    // Master sum
    const monoSignal = drum + bass + melody + pad;

    // Stereo panning (melody slightly left, pad slightly right, bass & drum center)
    left[i] = monoSignal * 0.85 + melody * 0.15;
    right[i] = monoSignal * 0.85 - melody * 0.15;
  }

  const url = bufferToWaveBlob(left, right, sampleRate);
  audioCache.set(genreKey, url);
  return url;
}

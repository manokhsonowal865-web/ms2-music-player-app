/**
 * MS2 Music Player - Core Audio Engine
 * Handles HTML5 audio playback, Web Audio API frequency analysis,
 * 5-Band Hardware Equalizer, and Android MediaSession integration.
 */

import { Song } from '../types/music';

export interface AudioEngineCallbacks {
  onTimeUpdate: (currentTime: number) => void;
  onDurationChange: (duration: number) => void;
  onEnded: () => void;
  onPlay: () => void;
  onPause: () => void;
  onError: (error: string) => void;
  onNextTrack?: () => void;
  onPrevTrack?: () => void;
}

export class AudioEngine {
  private audio: HTMLAudioElement;
  private audioCtx: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  private callbacks: AudioEngineCallbacks | null = null;
  private isInitialized = false;

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.audio.crossOrigin = 'anonymous';

    // HTML5 Audio Event Listeners
    this.audio.addEventListener('timeupdate', () => {
      if (this.callbacks && !isNaN(this.audio.currentTime)) {
        this.callbacks.onTimeUpdate(this.audio.currentTime);
      }
    });

    this.audio.addEventListener('durationchange', () => {
      if (this.callbacks && !isNaN(this.audio.duration)) {
        this.callbacks.onDurationChange(this.audio.duration);
      }
    });

    this.audio.addEventListener('ended', () => {
      if (this.callbacks) {
        this.callbacks.onEnded();
      }
    });

    this.audio.addEventListener('play', () => {
      if (this.callbacks) {
        this.callbacks.onPlay();
      }
      this.updateMediaSessionState('playing');
    });

    this.audio.addEventListener('pause', () => {
      if (this.callbacks) {
        this.callbacks.onPause();
      }
      this.updateMediaSessionState('paused');
    });

    this.audio.addEventListener('error', () => {
      const err = this.audio.error;
      const msg = err ? `Error code ${err.code}: ${err.message}` : 'Playback error occurred';
      if (this.callbacks) {
        this.callbacks.onError(msg);
      }
    });
  }

  public setCallbacks(callbacks: AudioEngineCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Initializes Web Audio context on user gesture (required by browser autoplay policy).
   */
  public initAudioContext(): void {
    if (this.isInitialized) return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioCtx = new AudioContextClass();
      this.analyserNode = this.audioCtx.createAnalyser();
      this.analyserNode.fftSize = 64; // lightweight for 60fps on 4GB Android phones
      this.analyserNode.smoothingTimeConstant = 0.8;

      // 5-Band Equalizer: 60Hz, 250Hz, 1kHz, 4kHz, 12kHz
      const freqs = [60, 250, 1000, 4000, 12000];
      const types: BiquadFilterType[] = ['lowshelf', 'peaking', 'peaking', 'peaking', 'highshelf'];

      this.eqFilters = freqs.map((freq, idx) => {
        const filter = this.audioCtx!.createBiquadFilter();
        filter.type = types[idx];
        filter.frequency.value = freq;
        filter.gain.value = 0;
        return filter;
      });

      // Chain: Audio -> Source -> EQ 0 -> EQ 1 -> EQ 2 -> EQ 3 -> EQ 4 -> Analyser -> Destination
      this.sourceNode = this.audioCtx.createMediaElementSource(this.audio);

      let prevNode: AudioNode = this.sourceNode;
      for (const filter of this.eqFilters) {
        prevNode.connect(filter);
        prevNode = filter;
      }

      prevNode.connect(this.analyserNode);
      this.analyserNode.connect(this.audioCtx.destination);

      this.isInitialized = true;
    } catch {
      // Graceful fallback to native audio element if Web Audio is restricted
      this.isInitialized = false;
    }
  }

  /**
   * Set 5-band equalizer gains in decibels (-12 to +12 dB)
   */
  public setEqualizerGains(gains: [number, number, number, number, number]): void {
    if (!this.eqFilters.length) return;
    gains.forEach((gain, index) => {
      if (this.eqFilters[index]) {
        this.eqFilters[index].gain.value = gain;
      }
    });
  }

  /**
   * Play a song with metadata and update Android MediaSession
   */
  public async playSong(song: Song): Promise<void> {
    this.initAudioContext();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      try {
        await this.audioCtx.resume();
      } catch {
        // ignore resume errors
      }
    }

    if (this.audio.src !== song.audioUrl) {
      this.audio.src = song.audioUrl;
      this.audio.load();
    }

    try {
      await this.audio.play();
    } catch (err) {
      if (this.callbacks) {
        this.callbacks.onError('Tap play to start audio playback');
      }
    }

    this.updateMediaSession(song);
  }

  public async resume(): Promise<void> {
    this.initAudioContext();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      try {
        await this.audioCtx.resume();
      } catch {
        // ignore
      }
    }
    return this.audio.play();
  }

  public pause(): void {
    this.audio.pause();
  }

  public seek(seconds: number): void {
    if (isFinite(seconds) && seconds >= 0) {
      this.audio.currentTime = seconds;
    }
  }

  public setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  public setMuted(muted: boolean): void {
    this.audio.muted = muted;
  }

  public getFrequencyData(array: Uint8Array): void {
    if (this.analyserNode) {
      this.analyserNode.getByteFrequencyData(array as any);
    }
  }

  public get analyser(): AnalyserNode | null {
    return this.analyserNode;
  }

  public getCurrentTime(): number {
    return this.audio.currentTime || 0;
  }

  public getDuration(): number {
    return this.audio.duration || 0;
  }

  /**
   * Android MediaSession integration for lock screen and notification shade controls
   */
  private updateMediaSession(song: Song) {
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: song.title,
          artist: song.artist,
          album: song.album || 'MS2.-SM Music',
          artwork: [
            { src: song.coverUrl, sizes: '512x512', type: 'image/jpeg' },
            { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' }
          ]
        });

        navigator.mediaSession.setActionHandler('play', () => {
          this.resume();
        });

        navigator.mediaSession.setActionHandler('pause', () => {
          this.pause();
        });

        navigator.mediaSession.setActionHandler('previoustrack', () => {
          if (this.callbacks?.onPrevTrack) this.callbacks.onPrevTrack();
        });

        navigator.mediaSession.setActionHandler('nexttrack', () => {
          if (this.callbacks?.onNextTrack) this.callbacks.onNextTrack();
        });

        navigator.mediaSession.setActionHandler('seekto', (details) => {
          if (details.seekTime !== undefined) {
            this.seek(details.seekTime);
          }
        });
      } catch {
        // mediaSession not supported or restricted
      }
    }
  }

  private updateMediaSessionState(state: 'playing' | 'paused' | 'none') {
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = state;
      } catch {
        // ignore
      }
    }
  }

  public destroy(): void {
    this.audio.pause();
    this.audio.src = '';
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
    }
  }
}

// Singleton audio engine instance for the application
export const audioEngine = new AudioEngine();

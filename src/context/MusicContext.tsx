import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Song, Playlist, RepeatMode, EqualizerPreset } from '../types/music';
import { INITIAL_SONGS, DEFAULT_PLAYLISTS } from '../data/initialSongs';
import { audioEngine } from '../services/audioEngine';

export const EQ_PRESETS: EqualizerPreset[] = [
  { name: 'Flat', gains: [0, 0, 0, 0, 0] },
  { name: 'Bass Boost', gains: [8, 5, 1, 0, 2] },
  { name: 'EDM / Club', gains: [7, 4, -1, 3, 6] },
  { name: 'Acoustic / Warm', gains: [3, 2, 0, 4, 3] },
  { name: 'Vocal Boost', gains: [-2, 1, 6, 4, 1] },
  { name: 'Rock / Dynamic', gains: [6, 3, -2, 4, 7] },
];

interface MusicContextType {
  allSongs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  queue: Song[];
  queueIndex: number;
  favorites: string[];
  recentlyPlayed: Song[];
  playlists: Playlist[];
  localSongs: Song[];
  currentEqPreset: string;
  eqGains: [number, number, number, number, number];
  sleepTimerRemaining: number | null;
  isFullPlayerOpen: boolean;
  activeTab: 'home' | 'search' | 'library' | 'assamese' | 'ms2-originals';
  searchQuery: string;
  selectedLanguage: string;
  playSong: (song: Song, customQueue?: Song[]) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seekTo: (seconds: number) => void;
  setVolumeLevel: (vol: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  toggleFavorite: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
  importLocalFiles: (files: FileList | File[]) => Promise<number>;
  createPlaylist: (name: string, description?: string) => Playlist;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  setEqualizerPreset: (presetName: string) => void;
  setEqualizerBandGain: (bandIndex: number, gain: number) => void;
  setSleepTimer: (minutes: number | null) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  setFullPlayerOpen: (open: boolean) => void;
  setActiveTab: (tab: 'home' | 'search' | 'library' | 'assamese' | 'ms2-originals') => void;
  setSearchQuery: (query: string) => void;
  setSelectedLanguage: (lang: string) => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

const STORAGE_FAVORITES = 'ms2_favorites_v1';
const STORAGE_RECENT = 'ms2_recent_v1';
const STORAGE_PLAYLISTS = 'ms2_playlists_v1';
const STORAGE_EQ = 'ms2_eq_preset_v1';

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localSongs, setLocalSongs] = useState<Song[]>([]);
  const [allSongs, setAllSongs] = useState<Song[]>(INITIAL_SONGS);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [queue, setQueue] = useState<Song[]>(INITIAL_SONGS);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>(DEFAULT_PLAYLISTS);
  const [currentEqPreset, setCurrentEqPresetState] = useState<string>('Flat');
  const [eqGains, setEqGains] = useState<[number, number, number, number, number]>([0, 0, 0, 0, 0]);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  const [isFullPlayerOpen, setFullPlayerOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'library' | 'assamese' | 'ms2-originals'>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');

  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize saved state from localStorage
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem(STORAGE_FAVORITES);
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedRecent = localStorage.getItem(STORAGE_RECENT);
      if (savedRecent) setRecentlyPlayed(JSON.parse(savedRecent));

      const savedPlaylists = localStorage.getItem(STORAGE_PLAYLISTS);
      if (savedPlaylists) {
        const parsed = JSON.parse(savedPlaylists);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPlaylists(parsed);
        }
      }

      const savedEq = localStorage.getItem(STORAGE_EQ);
      if (savedEq) {
        const found = EQ_PRESETS.find(p => p.name === savedEq);
        if (found) {
          setCurrentEqPresetState(found.name);
          setEqGains(found.gains);
          audioEngine.setEqualizerGains(found.gains);
        }
      }
    } catch {
      // localStorage failure fallback
    }
  }, []);

  // Sync allSongs whenever localSongs changes
  useEffect(() => {
    setAllSongs([...INITIAL_SONGS, ...localSongs]);
  }, [localSongs]);

  // Audio Engine Callbacks setup
  const playNextRef = useRef<() => void>(() => {});
  const playPrevRef = useRef<() => void>(() => {});

  const handleSongEnded = useCallback(() => {
    if (repeatMode === 'one' && currentSong) {
      audioEngine.seek(0);
      audioEngine.resume();
    } else {
      playNextRef.current();
    }
  }, [repeatMode, currentSong]);

  useEffect(() => {
    audioEngine.setCallbacks({
      onTimeUpdate: (t) => setCurrentTime(t),
      onDurationChange: (d) => setDuration(d),
      onEnded: handleSongEnded,
      onPlay: () => setIsPlaying(true),
      onPause: () => setIsPlaying(false),
      onError: (msg) => {
        setIsPlaying(false);
      },
      onNextTrack: () => playNextRef.current(),
      onPrevTrack: () => playPrevRef.current(),
    });
  }, [handleSongEnded]);

  // Play a specific song
  const playSong = useCallback((song: Song, customQueue?: Song[]) => {
    let nextQueue = customQueue || queue;
    if (customQueue && customQueue.length > 0) {
      setQueue(customQueue);
    } else if (!queue.some(s => s.id === song.id)) {
      nextQueue = [song, ...queue];
      setQueue(nextQueue);
    }

    const songIndex = nextQueue.findIndex(s => s.id === song.id);
    setQueueIndex(songIndex >= 0 ? songIndex : 0);
    setCurrentSong(song);
    audioEngine.playSong(song);

    // Record into recently played (limit 25)
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter(s => s.id !== song.id);
      const updated = [song, ...filtered].slice(0, 25);
      try {
        localStorage.setItem(STORAGE_RECENT, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [queue]);

  // Next / Previous
  const playNext = useCallback(() => {
    if (!queue.length) return;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      setQueueIndex(randomIndex);
      playSong(queue[randomIndex]);
      return;
    }

    const nextIdx = queueIndex + 1;
    if (nextIdx < queue.length) {
      setQueueIndex(nextIdx);
      playSong(queue[nextIdx]);
    } else if (repeatMode === 'all') {
      setQueueIndex(0);
      playSong(queue[0]);
    } else {
      setIsPlaying(false);
    }
  }, [queue, queueIndex, isShuffle, repeatMode, playSong]);

  const playPrevious = useCallback(() => {
    if (!queue.length) return;
    if (currentTime > 3) {
      audioEngine.seek(0);
      return;
    }
    const prevIdx = queueIndex - 1;
    if (prevIdx >= 0) {
      setQueueIndex(prevIdx);
      playSong(queue[prevIdx]);
    } else {
      setQueueIndex(queue.length - 1);
      playSong(queue[queue.length - 1]);
    }
  }, [queue, queueIndex, currentTime, playSong]);

  playNextRef.current = playNext;
  playPrevRef.current = playPrevious;

  const togglePlayPause = useCallback(() => {
    if (!currentSong) {
      if (allSongs.length > 0) {
        playSong(allSongs[0]);
      }
      return;
    }
    if (isPlaying) {
      audioEngine.pause();
    } else {
      audioEngine.resume();
    }
  }, [currentSong, isPlaying, allSongs, playSong]);

  const seekTo = useCallback((seconds: number) => {
    setCurrentTime(seconds);
    audioEngine.seek(seconds);
  }, []);

  const setVolumeLevel = useCallback((vol: number) => {
    setVolume(vol);
    setIsMuted(false);
    audioEngine.setVolume(vol);
  }, []);

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.setMuted(nextMuted);
  }, [isMuted]);

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev);
  }, []);

  const toggleFavorite = useCallback((songId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(songId);
      const next = exists ? prev.filter(id => id !== songId) : [...prev, songId];
      try {
        localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const isFavorite = useCallback((songId: string) => {
    return favorites.includes(songId);
  }, [favorites]);

  // Import local audio files from device
  const importLocalFiles = useCallback(async (files: FileList | File[]): Promise<number> => {
    const fileArray = Array.from(files);
    const audioFiles = fileArray.filter(f => f.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(f.name));

    if (!audioFiles.length) return 0;

    const brandCover = '/src/assets/images/ms2_brand_logo_1792664665840.jpg';

    const newSongs: Song[] = [];
    for (const file of audioFiles) {
      const blobUrl = URL.createObjectURL(file);
      // Clean up file name to form artist and title
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      let title = cleanName;
      let artist = 'Local Storage / Device';

      if (cleanName.includes('-')) {
        const parts = cleanName.split('-');
        artist = parts[0].trim();
        title = parts.slice(1).join('-').trim();
      }

      newSongs.push({
        id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title,
        artist,
        album: 'My Device Music',
        language: 'Instrumental',
        category: 'Local Storage',
        duration: 0, // will populate on playback
        coverUrl: brandCover,
        audioUrl: blobUrl,
        isLocal: true,
        genre: 'Local Audio',
        year: 'Device'
      });
    }

    setLocalSongs(prev => [...newSongs, ...prev]);
    // Also auto-play the first newly imported song if nothing is playing
    if (!currentSong && newSongs.length > 0) {
      playSong(newSongs[0], newSongs);
    }
    return newSongs.length;
  }, [currentSong, playSong]);

  // Playlists
  const createPlaylist = useCallback((name: string, description: string = ''): Playlist => {
    const brandCover = '/src/assets/images/ms2_brand_logo_1792664665840.jpg';
    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      name: name.trim() || 'My Playlist',
      description: description.trim() || 'Curated MS2 Playlist',
      coverUrl: brandCover,
      songIds: [],
      isCustom: true,
      createdAt: Date.now()
    };
    setPlaylists(prev => {
      const updated = [newPl, ...prev];
      try {
        localStorage.setItem(STORAGE_PLAYLISTS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return newPl;
  }, []);

  const addSongToPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists(prev => {
      const updated = prev.map(pl => {
        if (pl.id === playlistId && !pl.songIds.includes(songId)) {
          return { ...pl, songIds: [...pl.songIds, songId] };
        }
        return pl;
      });
      try {
        localStorage.setItem(STORAGE_PLAYLISTS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const removeSongFromPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists(prev => {
      const updated = prev.map(pl => {
        if (pl.id === playlistId) {
          return { ...pl, songIds: pl.songIds.filter(id => id !== songId) };
        }
        return pl;
      });
      try {
        localStorage.setItem(STORAGE_PLAYLISTS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists(prev => {
      const updated = prev.filter(pl => pl.id !== playlistId);
      try {
        localStorage.setItem(STORAGE_PLAYLISTS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Equalizer
  const setEqualizerPreset = useCallback((presetName: string) => {
    const found = EQ_PRESETS.find(p => p.name === presetName);
    if (found) {
      setCurrentEqPresetState(found.name);
      setEqGains(found.gains);
      audioEngine.setEqualizerGains(found.gains);
      try {
        localStorage.setItem(STORAGE_EQ, found.name);
      } catch {}
    }
  }, []);

  const setEqualizerBandGain = useCallback((bandIndex: number, gain: number) => {
    setEqGains(prev => {
      const next = [...prev] as [number, number, number, number, number];
      next[bandIndex] = gain;
      audioEngine.setEqualizerGains(next);
      setCurrentEqPresetState('Custom');
      return next;
    });
  }, []);

  // Sleep Timer
  const setSleepTimer = useCallback((minutes: number | null) => {
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }

    if (!minutes || minutes <= 0) {
      setSleepTimerRemaining(null);
      return;
    }

    let remainingSec = minutes * 60;
    setSleepTimerRemaining(remainingSec);

    sleepTimerRef.current = setInterval(() => {
      remainingSec -= 1;
      if (remainingSec <= 0) {
        if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
        sleepTimerRef.current = null;
        setSleepTimerRemaining(null);
        audioEngine.pause();
      } else {
        setSleepTimerRemaining(remainingSec);
      }
    }, 1000);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearQueue = useCallback(() => {
    if (currentSong) {
      setQueue([currentSong]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(0);
    }
  }, [currentSong]);

  return (
    <MusicContext.Provider
      value={{
        allSongs,
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        repeatMode,
        isShuffle,
        queue,
        queueIndex,
        favorites,
        recentlyPlayed,
        playlists,
        localSongs,
        currentEqPreset,
        eqGains,
        sleepTimerRemaining,
        isFullPlayerOpen,
        activeTab,
        searchQuery,
        selectedLanguage,
        playSong,
        togglePlayPause,
        playNext,
        playPrevious,
        seekTo,
        setVolumeLevel,
        toggleMute,
        toggleRepeat,
        toggleShuffle,
        toggleFavorite,
        isFavorite,
        importLocalFiles,
        createPlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        deletePlaylist,
        setEqualizerPreset,
        setEqualizerBandGain,
        setSleepTimer,
        removeFromQueue,
        clearQueue,
        setFullPlayerOpen,
        setActiveTab,
        setSearchQuery,
        setSelectedLanguage,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}

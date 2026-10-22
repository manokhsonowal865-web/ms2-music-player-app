export type Language = 'Assamese' | 'Hindi' | 'Bengali' | 'Nepali' | 'English' | 'All';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  language: 'Assamese' | 'Hindi' | 'Bengali' | 'Nepali' | 'English' | 'Instrumental';
  category: 'MS2 Original' | 'Trending' | 'Folk & Bihu' | 'Acoustic' | 'Party & EDM' | 'Local Storage';
  duration: number; // in seconds
  coverUrl: string;
  audioUrl: string; // real audio URL or synthesized data URL
  isLocal?: boolean;
  isMS2Original?: boolean;
  genre?: string;
  year?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  songIds: string[];
  isCustom?: boolean;
  createdAt: number;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface EqualizerPreset {
  name: string;
  gains: [number, number, number, number, number]; // 60Hz, 250Hz, 1kHz, 4kHz, 12kHz in dB (-12 to +12)
}

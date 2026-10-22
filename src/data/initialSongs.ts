import { Song } from '../types/music';
import { getProceduralAudioUrl } from '../services/synthAudio';

// High-fidelity image assets generated for MS2
const BRAND_LOGO = '/src/assets/images/ms2_brand_logo_1792664665840.jpg';
const ASSAMESE_COVER = '/src/assets/images/ms2_assamese_cover_1792664666965.jpg';
const NEON_BEATS_COVER = '/src/assets/images/ms2_neon_beats_1792664667509.jpg';
const ACOUSTIC_COVER = '/src/assets/images/ms2_acoustic_night_1792664668089.jpg';

export const INITIAL_SONGS: Song[] = [
  // MS2.-SM Originals
  {
    id: 'ms2-orig-1',
    title: 'MS2 Beatdrop Protocol',
    artist: 'MS2.-SM',
    album: 'MS2.-SM Studio Vol. 1',
    language: 'Instrumental',
    category: 'MS2 Original',
    duration: 38,
    coverUrl: NEON_BEATS_COVER,
    audioUrl: getProceduralAudioUrl('ms2_nightwave_edm_1', 38),
    isMS2Original: true,
    genre: 'Electronic / Synthwave',
    year: '2026'
  },
  {
    id: 'ms2-orig-2',
    title: 'Brahmaputra Waves (MS2 Remix)',
    artist: 'MS2.-SM x Axom Sound',
    album: 'Luit Express',
    language: 'Assamese',
    category: 'MS2 Original',
    duration: 38,
    coverUrl: ASSAMESE_COVER,
    audioUrl: getProceduralAudioUrl('ms2_assamese_remix_2', 38),
    isMS2Original: true,
    genre: 'Assamese Folk Fusion',
    year: '2026'
  },
  {
    id: 'ms2-orig-3',
    title: 'Midnight Embers (Unplugged)',
    artist: 'MS2.-SM Acoustic Lounge',
    album: 'Golden Hour Sessions',
    language: 'Hindi',
    category: 'MS2 Original',
    duration: 38,
    coverUrl: ACOUSTIC_COVER,
    audioUrl: getProceduralAudioUrl('ms2_acoustic_embers_3', 38),
    isMS2Original: true,
    genre: 'Indie Acoustic',
    year: '2026'
  },
  {
    id: 'ms2-orig-4',
    title: 'Guwahati Cyber Highway',
    artist: 'MS2.-SM',
    album: 'Neon Brahmaputra',
    language: 'Instrumental',
    category: 'MS2 Original',
    duration: 38,
    coverUrl: BRAND_LOGO,
    audioUrl: getProceduralAudioUrl('ms2_nightwave_edm_4', 38),
    isMS2Original: true,
    genre: 'Synthwave EDM',
    year: '2026'
  },

  // Dedicated Assamese Music Section
  {
    id: 'as-1',
    title: 'Bihu Bihuti Morom',
    artist: 'Pranab Bordoloi & Chorus',
    album: 'Rongali Dholor Maat',
    language: 'Assamese',
    category: 'Folk & Bihu',
    duration: 38,
    coverUrl: ASSAMESE_COVER,
    audioUrl: getProceduralAudioUrl('assamese_bihu_folk_1', 38),
    genre: 'Traditional Bihu',
    year: '2025'
  },
  {
    id: 'as-2',
    title: 'Majuli Noi Porot',
    artist: 'Zubeen Heritage Tribute Ensemble',
    album: 'Monor Pokhi',
    language: 'Assamese',
    category: 'Trending',
    duration: 38,
    coverUrl: ASSAMESE_COVER,
    audioUrl: getProceduralAudioUrl('assamese_bihu_folk_2', 38),
    genre: 'Assamese Modern Melody',
    year: '2025'
  },
  {
    id: 'as-3',
    title: 'Luit Pororia Sur',
    artist: 'Brahmaputra Melodies',
    album: 'Soponor Xondhiyat',
    language: 'Assamese',
    category: 'Folk & Bihu',
    duration: 38,
    coverUrl: BRAND_LOGO,
    audioUrl: getProceduralAudioUrl('assamese_bihu_folk_3', 38),
    genre: 'Borgeet & Folk Fusion',
    year: '2024'
  },
  {
    id: 'as-4',
    title: 'Kopou Phool Prem',
    artist: 'Ananya Hazarika',
    album: 'Bohagi Botaah',
    language: 'Assamese',
    category: 'Trending',
    duration: 38,
    coverUrl: ACOUSTIC_COVER,
    audioUrl: getProceduralAudioUrl('assamese_bihu_folk_4', 38),
    genre: 'Romantic Folk',
    year: '2026'
  },

  // Hindi Tracks
  {
    id: 'hi-1',
    title: 'Kesariya Shaam',
    artist: 'Aarav Malhotra',
    album: 'Dhundhli Yaadein',
    language: 'Hindi',
    category: 'Trending',
    duration: 38,
    coverUrl: ACOUSTIC_COVER,
    audioUrl: getProceduralAudioUrl('hindi_acoustic_shaam_1', 38),
    genre: 'Bollywood Acoustic',
    year: '2025'
  },
  {
    id: 'hi-2',
    title: 'Raftaar Dhadkan',
    artist: 'Kabir & Rhythm Crew',
    album: 'Mumbai Night Drive',
    language: 'Hindi',
    category: 'Party & EDM',
    duration: 38,
    coverUrl: NEON_BEATS_COVER,
    audioUrl: getProceduralAudioUrl('edm_nightwave_hindi_2', 38),
    genre: 'Urban Hip-Hop / EDM',
    year: '2026'
  },
  {
    id: 'hi-3',
    title: 'Khoya Safar',
    artist: 'Riya Sen',
    album: 'Chalte Chalte',
    language: 'Hindi',
    category: 'Acoustic',
    duration: 38,
    coverUrl: BRAND_LOGO,
    audioUrl: getProceduralAudioUrl('hindi_acoustic_safar_3', 38),
    genre: 'Lo-Fi Chill',
    year: '2025'
  },

  // Bengali Tracks
  {
    id: 'bn-1',
    title: 'Amar Shona Baul',
    artist: 'Subhashish Roy',
    album: 'Padma Theke Ganga',
    language: 'Bengali',
    category: 'Folk & Bihu',
    duration: 38,
    coverUrl: ASSAMESE_COVER,
    audioUrl: getProceduralAudioUrl('bengali_baul_folk_1', 38),
    genre: 'Baul Fusion',
    year: '2024'
  },
  {
    id: 'bn-2',
    title: 'Kolkata Brishti',
    artist: 'Mon Baul Studio',
    album: 'Neel Akash',
    language: 'Bengali',
    category: 'Trending',
    duration: 38,
    coverUrl: ACOUSTIC_COVER,
    audioUrl: getProceduralAudioUrl('bengali_baul_folk_2', 38),
    genre: 'Bengali Modern Indie',
    year: '2025'
  },

  // Nepali Tracks
  {
    id: 'ne-1',
    title: 'Himalayan Sunrise Flute',
    artist: 'Tenzing & Mountain Melodies',
    album: 'Pokhara Echoes',
    language: 'Nepali',
    category: 'Acoustic',
    duration: 38,
    coverUrl: ACOUSTIC_COVER,
    audioUrl: getProceduralAudioUrl('nepali_himalaya_flute_1', 38),
    genre: 'Nepali Mountain Flute',
    year: '2025'
  },
  {
    id: 'ne-2',
    title: 'Maya Baiguni',
    artist: 'Sunil Thapa',
    album: 'Kathmandu Nights',
    language: 'Nepali',
    category: 'Trending',
    duration: 38,
    coverUrl: NEON_BEATS_COVER,
    audioUrl: getProceduralAudioUrl('nepali_himalaya_folk_2', 38),
    genre: 'Nepali Pop Fusion',
    year: '2026'
  },

  // English Tracks
  {
    id: 'en-1',
    title: 'Golden Horizon',
    artist: 'MS2 Sound Lab',
    album: 'Velocity 2026',
    language: 'English',
    category: 'Party & EDM',
    duration: 38,
    coverUrl: NEON_BEATS_COVER,
    audioUrl: getProceduralAudioUrl('edm_nightwave_en_1', 38),
    genre: 'Future Synth / EDM',
    year: '2026'
  },
  {
    id: 'en-2',
    title: 'Echoes in the Rain',
    artist: 'Acoustic Waves',
    album: 'Solitude Whispers',
    language: 'English',
    category: 'Acoustic',
    duration: 38,
    coverUrl: BRAND_LOGO,
    audioUrl: getProceduralAudioUrl('acoustic_embers_en_2', 38),
    genre: 'Acoustic Indie Pop',
    year: '2025'
  }
];

export const DEFAULT_PLAYLISTS = [
  {
    id: 'pl-ms2-originals',
    name: 'MS2.-SM Channel Hits',
    description: 'Official original soundtrack releases from the MS2.-SM brand channel.',
    coverUrl: BRAND_LOGO,
    songIds: ['ms2-orig-1', 'ms2-orig-2', 'ms2-orig-3', 'ms2-orig-4'],
    createdAt: Date.now() - 1000000
  },
  {
    id: 'pl-assamese-gold',
    name: 'Brahmaputra Melodies & Bihu',
    description: 'Golden collection of Assam folk, Bihu rhythms, and modern Assamese melodies.',
    coverUrl: ASSAMESE_COVER,
    songIds: ['ms2-orig-2', 'as-1', 'as-2', 'as-3', 'as-4'],
    createdAt: Date.now() - 2000000
  },
  {
    id: 'pl-night-drive',
    name: 'Midnight Neon Beats',
    description: 'High octane EDM, Synthwave, and urban bass lines.',
    coverUrl: NEON_BEATS_COVER,
    songIds: ['ms2-orig-1', 'ms2-orig-4', 'hi-2', 'en-1'],
    createdAt: Date.now() - 3000000
  },
  {
    id: 'pl-chill-acoustic',
    name: 'Starlight Acoustic Cafe',
    description: 'Soulful acoustic guitars, soothing vocals, and quiet night melodies.',
    coverUrl: ACOUSTIC_COVER,
    songIds: ['ms2-orig-3', 'hi-1', 'hi-3', 'ne-1', 'en-2'],
    createdAt: Date.now() - 4000000
  }
];

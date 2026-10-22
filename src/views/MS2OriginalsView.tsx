import React from 'react';
import { Flame, Play, Sparkles, Radio, Music } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { SongCard } from '../components/SongCard';
import { SongRow } from '../components/SongRow';
import { Song } from '../types/music';

interface MS2OriginalsViewProps {
  onAddToPlaylist: (song: Song) => void;
}

export const MS2OriginalsView: React.FC<MS2OriginalsViewProps> = ({ onAddToPlaylist }) => {
  const { allSongs, playSong } = useMusic();

  const ms2Songs = allSongs.filter((s) => s.isMS2Original);

  return (
    <div className="pb-32 pt-2 max-w-7xl mx-auto px-4 space-y-6 animate-in fade-in">
      {/* Brand Hero Header */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c1326] via-[#101b38] to-[#060913] border border-amber-500/35 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black tracking-widest text-amber-400 bg-amber-500/20 border border-amber-400/40 px-2.5 py-1 rounded-full uppercase">
                Official Label & Channel
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-amber-300 font-semibold">MS2.-SM Sound Records</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white brand-font tracking-tight">
              MS2.-SM Original Studio Releases
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
              Original tracks composed and curated exclusively for the <strong className="text-amber-300">MS2.-SM</strong> sound channel. Blending Northeast Indian ethnic instruments with high-energy electronic basslines, synthwave textures, and heartfelt acoustic sessions.
            </p>

            <div className="flex items-center gap-3 mt-5 flex-wrap">
              <button
                onClick={() => ms2Songs.length > 0 && playSong(ms2Songs[0], ms2Songs)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-bold text-xs glow-gold hover:scale-105 active:scale-95 transition shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Play Channel Discography</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>4 Official Tracks</span>
              </div>
            </div>
          </div>

          {/* Brand Logo Box */}
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden border-2 border-amber-400/60 glow-gold bg-slate-950 shadow-2xl shrink-0 p-1">
            <img
              src="/src/assets/images/ms2_brand_logo_1792664665840.jpg"
              alt="MS2.-SM Brand Logo"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* Grid Showcase of MS2 Originals */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-white brand-font">
              Featured MS2.-SM Soundtracks
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Mastered 24-bit Audio</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ms2Songs.map((song) => (
            <SongCard key={song.id} song={song} onAddToPlaylist={onAddToPlaylist} />
          ))}
        </div>
      </section>

      {/* Track Details List */}
      <section className="bg-[#0a0f1d] border border-slate-800 rounded-3xl p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-white">Full Tracklist</span>
          </div>
          <span className="text-xs text-amber-400/80 font-mono">MS2.-SM Catalog</span>
        </div>

        <div className="space-y-1">
          {ms2Songs.map((song, idx) => (
            <SongRow
              key={song.id}
              song={song}
              index={idx}
              onAddToPlaylist={onAddToPlaylist}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

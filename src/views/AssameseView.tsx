import React, { useState } from 'react';
import { Play, Compass, Sparkles, Music2, Disc } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { SongRow } from '../components/SongRow';
import { SongCard } from '../components/SongCard';
import { Song } from '../types/music';

interface AssameseViewProps {
  onAddToPlaylist: (song: Song) => void;
}

export const AssameseView: React.FC<AssameseViewProps> = ({ onAddToPlaylist }) => {
  const { allSongs, playSong } = useMusic();
  const [filter, setFilter] = useState<'all' | 'bihu' | 'modern' | 'ms2'>('all');

  const assameseSongs = allSongs.filter(
    (s) => s.language === 'Assamese' || (s.isMS2Original && s.title.toLowerCase().includes('brahmaputra'))
  );

  const displayedSongs = assameseSongs.filter((song) => {
    if (filter === 'bihu') return song.category === 'Folk & Bihu';
    if (filter === 'modern') return song.category === 'Trending' || song.genre?.toLowerCase().includes('modern');
    if (filter === 'ms2') return song.isMS2Original;
    return true;
  });

  const bihuSpecial = assameseSongs.filter((s) => s.category === 'Folk & Bihu');

  return (
    <div className="pb-32 pt-2 max-w-7xl mx-auto px-4 space-y-6 animate-in fade-in">
      {/* Assamese Banner Header */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-[#0a0f1d] border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/ms2_assamese_cover_1792664666965.jpg"
            alt="Brahmaputra Melodies"
            className="w-full h-full object-cover opacity-25 filter blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050811] via-[#050811]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold tracking-widest text-amber-400 bg-amber-500/15 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase">
              Dedicated Regional Hub
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-amber-300 font-semibold">অসমীয়া সংগীত</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white brand-font tracking-tight">
            Assamese Music & Brahmaputra Melodies
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            The rich musical heritage of Assam — vibrant Rongali Bihu beats, soulful Luit river folk, Zubeen Garg style lyrical modern songs, and MS2.-SM folk-electronic fusion.
          </p>

          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={() => assameseSongs.length > 0 && playSong(assameseSongs[0], assameseSongs)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs glow-gold hover:scale-105 active:scale-95 transition shadow-lg cursor-pointer flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Play All Assamese ({assameseSongs.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: 'All Assamese Tracks' },
          { id: 'bihu', label: 'Bihu & Folk Dhol' },
          { id: 'modern', label: 'Assamese Modern' },
          { id: 'ms2', label: 'MS2.-SM Axom Specials' },
        ].map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-bold glow-gold-sm shadow'
                  : 'bg-[#0d1424] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Spotlight Folk Carousel */}
      {bihuSpecial.length > 0 && filter === 'all' && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Disc className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white brand-font">Rongali Bihu & Heritage</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {bihuSpecial.map((song) => (
              <SongCard key={song.id} song={song} onAddToPlaylist={onAddToPlaylist} />
            ))}
          </div>
        </section>
      )}

      {/* Song List */}
      <section className="bg-[#0a0f1d] border border-slate-800 rounded-3xl p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
          <div className="flex items-center gap-2">
            <Music2 className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-white">Tracks ({displayedSongs.length})</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Assam Soundboard</span>
        </div>

        <div className="space-y-1">
          {displayedSongs.map((song, idx) => (
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

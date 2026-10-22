import React, { useState } from 'react';
import { Play, Sparkles, Flame, Compass, ArrowRight, FolderPlus } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { SongCard } from '../components/SongCard';
import { SongRow } from '../components/SongRow';
import { Song } from '../types/music';

interface HomeViewProps {
  onAddToPlaylist: (song: Song) => void;
  onOpenAndroidGuide: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onAddToPlaylist, onOpenAndroidGuide }) => {
  const {
    allSongs,
    playlists,
    recentlyPlayed,
    playSong,
    setActiveTab,
    setSelectedLanguage,
  } = useMusic();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  // Filter songs based on quick category
  const filteredSongs = activeCategoryFilter === 'All'
    ? allSongs
    : allSongs.filter(s => s.language === activeCategoryFilter || s.category === activeCategoryFilter);

  // MS2 Originals
  const ms2Originals = allSongs.filter(s => s.isMS2Original);
  // Assamese songs
  const assameseSongs = allSongs.filter(s => s.language === 'Assamese');
  // Trending / popular
  const trendingSongs = allSongs.filter(s => s.category === 'Trending' || s.category === 'Party & EDM').slice(0, 6);

  const heroSong = ms2Originals[0] || allSongs[0];

  const categories = ['All', 'Assamese', 'Hindi', 'Bengali', 'Nepali', 'English'];

  return (
    <div className="pb-32 pt-2 max-w-7xl mx-auto px-4 space-y-7 animate-in fade-in">
      {/* Hero Spotlight: MS2.-SM Signature Showcase */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-[#0d1424] via-[#111a33] to-[#070b14] border border-amber-500/25 p-5 sm:p-7 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold tracking-widest text-amber-400 bg-amber-500/15 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase">
                Featured Original Release
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-amber-300 font-semibold">MS2.-SM Music Brand</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white brand-font tracking-tight leading-tight">
              MS2 Beatdrop Protocol & Brahmaputra Waves
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Experience original studio productions from the <strong className="text-amber-300 font-semibold">MS2.-SM</strong> channel.
              Featuring authentic Assamese folk fusion, modern synthwave, and lossless local Android playback.
            </p>

            <div className="flex items-center gap-3 mt-5 flex-wrap">
              <button
                onClick={() => heroSong && playSong(heroSong, ms2Originals)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 font-bold text-xs glow-gold hover:scale-105 active:scale-95 transition shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Play MS2 Originals</span>
              </button>

              <button
                onClick={() => setActiveTab('assamese')}
                className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Explore Assamese</span>
              </button>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-400/50 glow-gold-sm bg-slate-900 shadow-2xl relative group">
            <img
              src="/src/assets/images/ms2_brand_logo_1792664665840.jpg"
              alt="MS2.-SM Cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
              <span className="text-[11px] font-bold text-amber-300 brand-font">MS2.-SM Studio</span>
            </div>
          </div>
        </div>
      </div>

      {/* Language Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const isActive = activeCategoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setActiveCategoryFilter(cat);
                setSelectedLanguage(cat);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-slate-950 glow-gold-sm shadow font-bold'
                  : 'bg-[#0d1424] text-slate-300 hover:text-white border border-slate-800 hover:border-amber-500/30'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Section 1: MS2.-SM Originals Showcase */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-white brand-font">
              MS2.-SM Original Releases
            </h2>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30">
              Official
            </span>
          </div>
          <button
            onClick={() => setActiveTab('ms2-originals')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1">
          {ms2Originals.map((song) => (
            <SongCard key={song.id} song={song} onAddToPlaylist={onAddToPlaylist} />
          ))}
        </div>
      </section>

      {/* Section 2: Dedicated Assamese Music Spotlight */}
      <section className="p-4 sm:p-5 rounded-3xl bg-[#090e1c] border border-amber-500/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white brand-font">
                Assamese Folk & Brahmaputra Melodies
              </h2>
              <p className="text-[11px] text-slate-400">Bihu, folk rhythms, and modern classics</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('assamese')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Full Section</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
          {assameseSongs.slice(0, 4).map((song, idx) => (
            <SongRow
              key={song.id}
              song={song}
              index={idx}
              onAddToPlaylist={onAddToPlaylist}
              showIndex={false}
            />
          ))}
        </div>
      </section>

      {/* Section 3: Trending Music & Recently Played in Split Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-white brand-font">Trending Music</h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">Popular</span>
          </div>

          <div className="space-y-1.5 bg-[#0a0f1d] p-3 rounded-3xl border border-slate-800">
            {trendingSongs.map((song, idx) => (
              <SongRow key={song.id} song={song} index={idx} onAddToPlaylist={onAddToPlaylist} />
            ))}
          </div>
        </section>

        {/* Recently Played or Featured Playlists */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-white brand-font">
                {recentlyPlayed.length > 0 ? 'Recently Played' : 'Featured Playlists'}
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('library')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 cursor-pointer"
            >
              My Library
            </button>
          </div>

          {recentlyPlayed.length > 0 ? (
            <div className="space-y-1.5 bg-[#0a0f1d] p-3 rounded-3xl border border-slate-800">
              {recentlyPlayed.slice(0, 5).map((song, idx) => (
                <SongRow key={song.id} song={song} index={idx} onAddToPlaylist={onAddToPlaylist} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {playlists.slice(0, 4).map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => {
                    const plSongs = allSongs.filter(s => pl.songIds.includes(s.id));
                    if (plSongs.length > 0) {
                      playSong(plSongs[0], plSongs);
                    }
                  }}
                  className="group bg-[#0d1424] hover:bg-[#111a30] border border-slate-800 hover:border-amber-500/40 rounded-2xl p-3 cursor-pointer transition flex flex-col justify-between"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-800 mb-2 relative">
                    <img src={pl.coverUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center glow-gold-sm opacity-0 group-hover:opacity-100 transition shadow">
                      <Play className="w-4 h-4 fill-slate-950 translate-x-0.5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white truncate">{pl.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{pl.songIds.length} tracks</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Android Native Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-[#070b14] border border-amber-500/30 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-amber-300 brand-font uppercase tracking-wide">
            Android Optimization Engine
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Lightweight memory profile for 4 GB RAM phones, lock screen controls & offline audio file player.
          </p>
        </div>
        <button
          onClick={onOpenAndroidGuide}
          className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs glow-gold-sm transition cursor-pointer shrink-0"
        >
          View Guide
        </button>
      </div>
    </div>
  );
};

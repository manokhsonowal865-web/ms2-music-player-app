import React from 'react';
import { Play, Pause, Heart, Plus } from 'lucide-react';
import { Song } from '../types/music';
import { useMusic } from '../context/MusicContext';

interface SongCardProps {
  song: Song;
  onAddToPlaylist?: (song: Song) => void;
}

export const SongCard: React.FC<SongCardProps> = ({ song, onAddToPlaylist }) => {
  const { currentSong, isPlaying, playSong, togglePlayPause, isFavorite, toggleFavorite } = useMusic();

  const isCurrent = currentSong?.id === song.id;
  const isPlayingCurrent = isCurrent && isPlaying;
  const isFav = isFavorite(song.id);

  const handleCardClick = () => {
    if (isCurrent) {
      togglePlayPause();
    } else {
      playSong(song);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative w-38 sm:w-44 shrink-0 bg-[#0d1424]/60 hover:bg-[#111a30] border border-slate-800/80 hover:border-amber-500/40 rounded-2xl p-2.5 transition-all duration-200 cursor-pointer flex flex-col"
    >
      {/* Artwork container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md">
        <img
          src={song.coverUrl}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Play overlay button */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-200 ${
            isPlayingCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <div className="w-11 h-11 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center glow-gold-sm hover:scale-110 active:scale-95 transition shadow-lg">
            {isPlayingCurrent ? (
              <Pause className="w-5 h-5 fill-slate-950" />
            ) : (
              <Play className="w-5 h-5 fill-slate-950 translate-x-0.5" />
            )}
          </div>
        </div>

        {/* Brand badge or Language indicator */}
        <div className="absolute top-2 left-2 flex items-center gap-1">
          {song.isMS2Original ? (
            <span className="text-[9px] font-bold text-amber-300 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded border border-amber-400/40 shadow">
              MS2.-SM
            </span>
          ) : (
            <span className="text-[9px] font-semibold text-slate-200 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
              {song.language}
            </span>
          )}
        </div>

        {/* Favorite quick toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(song.id);
          }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-amber-400 opacity-0 group-hover:opacity-100 transition"
          aria-label="Favorite"
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
        </button>
      </div>

      {/* Meta */}
      <div className="mt-2.5 flex-1 min-w-0">
        <h4 className={`text-xs font-semibold truncate ${isCurrent ? 'text-amber-300' : 'text-white'}`}>
          {song.title}
        </h4>
        <p className="text-[11px] text-slate-400 truncate mt-0.5">{song.artist}</p>
      </div>

      {/* Footer info & playlist add */}
      <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
        <span className="font-mono tabular-nums">{song.genre || song.category}</span>
        {onAddToPlaylist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToPlaylist(song);
            }}
            className="text-slate-400 hover:text-amber-400 p-0.5 transition"
            title="Add to playlist"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

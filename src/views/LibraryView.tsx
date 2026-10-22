import React, { useState } from 'react';
import {
  Library as LibraryIcon,
  Heart,
  Clock,
  ListMusic,
  FolderPlus,
  Trash2,
  Play,
  Edit2,
  FolderOpen
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { SongRow } from '../components/SongRow';
import { LocalMusicImport } from '../components/LocalMusicImport';
import { Song, Playlist } from '../types/music';

interface LibraryViewProps {
  onAddToPlaylist: (song: Song) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onAddToPlaylist }) => {
  const {
    allSongs,
    localSongs,
    favorites,
    recentlyPlayed,
    playlists,
    playSong,
    deletePlaylist,
  } = useMusic();

  const [activeTab, setActiveTab] = useState<'local' | 'favorites' | 'playlists' | 'recent'>('local');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // Favorite song objects
  const favoriteSongs = allSongs.filter((s) => favorites.includes(s.id));

  // Current playlist songs if viewing specific playlist
  const currentPlaylistSongs = selectedPlaylist
    ? allSongs.filter((s) => selectedPlaylist.songIds.includes(s.id))
    : [];

  return (
    <div className="pb-32 pt-2 max-w-7xl mx-auto px-4 space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white brand-font tracking-tight">
            Personal Music Library
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your local Android audio files, custom playlists, favorites, and history.
          </p>
        </div>

        {/* Compact Import button */}
        <LocalMusicImport compact onSuccess={() => setActiveTab('local')} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'local', label: `Device Music (${localSongs.length})`, icon: FolderOpen },
          { id: 'favorites', label: `Favorites (${favoriteSongs.length})`, icon: Heart },
          { id: 'playlists', label: `Playlists (${playlists.length})`, icon: ListMusic },
          { id: 'recent', label: `Recently Played (${recentlyPlayed.length})`, icon: Clock },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as typeof activeTab);
                setSelectedPlaylist(null);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-bold glow-gold-sm shadow'
                  : 'bg-[#0d1424] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* 1. Device Local Audio */}
      {activeTab === 'local' && (
        <div className="space-y-4">
          <LocalMusicImport onSuccess={() => {}} />

          <div className="bg-[#0a0f1d] border border-slate-800 rounded-3xl p-4 sm:p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
              <span className="text-sm font-bold text-white">
                Stored on Device ({localSongs.length})
              </span>
              {localSongs.length > 0 && (
                <button
                  onClick={() => playSong(localSongs[0], localSongs)}
                  className="text-xs text-amber-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-amber-400" />
                  <span>Play All Local Songs</span>
                </button>
              )}
            </div>

            {localSongs.length === 0 ? (
              <div className="text-center py-10 px-4">
                <p className="text-sm font-medium text-slate-300">No local songs imported yet</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Tap the button above to select audio files (MP3, WAV, FLAC, M4A) directly from your Android phone's storage.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {localSongs.map((song, idx) => (
                  <SongRow
                    key={song.id}
                    song={song}
                    index={idx}
                    onAddToPlaylist={onAddToPlaylist}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Favorites */}
      {activeTab === 'favorites' && (
        <div className="bg-[#0a0f1d] border border-slate-800 rounded-3xl p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
            <span className="text-sm font-bold text-white">Favorite Songs ({favoriteSongs.length})</span>
            {favoriteSongs.length > 0 && (
              <button
                onClick={() => playSong(favoriteSongs[0], favoriteSongs)}
                className="text-xs text-amber-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-amber-400" />
                <span>Play Favorites</span>
              </button>
            )}
          </div>

          {favoriteSongs.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Heart className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-300">Your favorites list is empty</p>
              <p className="text-xs text-slate-500 mt-1">
                Tap the heart icon on any song to save it here for fast offline access.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {favoriteSongs.map((song, idx) => (
                <SongRow
                  key={song.id}
                  song={song}
                  index={idx}
                  onAddToPlaylist={onAddToPlaylist}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Playlists */}
      {activeTab === 'playlists' && (
        <div>
          {selectedPlaylist ? (
            /* Selected Playlist Detail View */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedPlaylist(null)}
                  className="text-xs text-amber-400 hover:underline cursor-pointer"
                >
                  ← Back to all playlists
                </button>

                {selectedPlaylist.isCustom && (
                  <button
                    onClick={() => {
                      deletePlaylist(selectedPlaylist.id);
                      setSelectedPlaylist(null);
                    }}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Playlist</span>
                  </button>
                )}
              </div>

              <div className="p-5 rounded-3xl bg-[#0a0f1d] border border-amber-500/25 flex flex-col sm:flex-row items-center gap-5">
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0 shadow-lg">
                  <img src={selectedPlaylist.coverUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="text-center sm:text-left min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                    Playlist
                  </span>
                  <h2 className="text-xl font-bold text-white brand-font">{selectedPlaylist.name}</h2>
                  <p className="text-xs text-slate-400 mt-1">{selectedPlaylist.description}</p>
                  <p className="text-xs text-slate-500 mt-1 font-mono">{currentPlaylistSongs.length} tracks</p>

                  {currentPlaylistSongs.length > 0 && (
                    <button
                      onClick={() => playSong(currentPlaylistSongs[0], currentPlaylistSongs)}
                      className="mt-3 px-4 py-2 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl glow-gold-sm flex items-center gap-1.5 mx-auto sm:mx-0 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Play Playlist</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-[#0a0f1d] border border-slate-800 rounded-3xl p-4 sm:p-5">
                {currentPlaylistSongs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-xs text-slate-400">This playlist has no songs yet.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {currentPlaylistSongs.map((song, idx) => (
                      <SongRow
                        key={song.id}
                        song={song}
                        index={idx}
                        onAddToPlaylist={onAddToPlaylist}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* All Playlists Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {playlists.map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => setSelectedPlaylist(pl)}
                  className="group bg-[#0d1424] hover:bg-[#111a30] border border-slate-800 hover:border-amber-500/40 rounded-2xl p-3 cursor-pointer transition flex flex-col justify-between shadow-md"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-800 mb-2 relative">
                    <img src={pl.coverUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center glow-gold-sm opacity-0 group-hover:opacity-100 transition shadow">
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
        </div>
      )}

      {/* 4. Recently Played */}
      {activeTab === 'recent' && (
        <div className="bg-[#0a0f1d] border border-slate-800 rounded-3xl p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
            <span className="text-sm font-bold text-white">Listening History ({recentlyPlayed.length})</span>
            {recentlyPlayed.length > 0 && (
              <button
                onClick={() => playSong(recentlyPlayed[0], recentlyPlayed)}
                className="text-xs text-amber-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-amber-400" />
                <span>Replay All</span>
              </button>
            )}
          </div>

          {recentlyPlayed.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Clock className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-300">No recently played tracks</p>
              <p className="text-xs text-slate-500 mt-1">Play any song to start logging your session history.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentlyPlayed.map((song, idx) => (
                <SongRow
                  key={song.id}
                  song={song}
                  index={idx}
                  onAddToPlaylist={onAddToPlaylist}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

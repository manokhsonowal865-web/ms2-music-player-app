import React, { useState } from 'react';
import { X, Plus, Check, ListMusic } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Song } from '../types/music';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSong?: Song | null;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  onClose,
  targetSong,
}) => {
  const {
    currentSong,
    playlists,
    createPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
  } = useMusic();

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const songToAdd = targetSong || currentSong;
  if (!songToAdd) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    const pl = createPlaylist(newPlaylistName.trim());
    addSongToPlaylist(pl.id, songToAdd.id);
    setNewPlaylistName('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-[#0a0f1d] border border-amber-500/30 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Add to Playlist</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="my-3 flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <img
            src={songToAdd.coverUrl}
            alt=""
            className="w-10 h-10 rounded-lg object-cover border border-amber-500/20"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{songToAdd.title}</p>
            <p className="text-[10px] text-slate-400 truncate">{songToAdd.artist}</p>
          </div>
        </div>

        {/* Existing Playlists */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5 my-2">
          {playlists.map((pl) => {
            const hasSong = pl.songIds.includes(songToAdd.id);
            return (
              <button
                key={pl.id}
                onClick={() => {
                  if (hasSong) {
                    removeSongFromPlaylist(pl.id, songToAdd.id);
                  } else {
                    addSongToPlaylist(pl.id, songToAdd.id);
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium transition cursor-pointer ${
                  hasSong
                    ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                    : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-semibold">{pl.name}</span>
                  <span className="text-[10px] text-slate-500">({pl.songIds.length})</span>
                </div>
                {hasSong ? (
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <Plus className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Create new playlist toggle */}
        {isCreating ? (
          <form onSubmit={handleCreate} className="mt-3 pt-3 border-t border-slate-800">
            <input
              type="text"
              autoFocus
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist name..."
              className="w-full bg-slate-900 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl glow-gold-sm cursor-pointer"
              >
                Create & Add
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full mt-2 py-2.5 rounded-xl border border-dashed border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Playlist</span>
          </button>
        )}
      </div>
    </div>
  );
};

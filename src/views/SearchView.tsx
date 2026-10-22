import React, { useState } from 'react';
import { Search, Mic, MicOff, X, Volume2, Globe } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { useVoiceSearch, SUPPORTED_VOICE_LANGS } from '../hooks/useVoiceSearch';
import { SongRow } from '../components/SongRow';
import { Song } from '../types/music';

interface SearchViewProps {
  onAddToPlaylist: (song: Song) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ onAddToPlaylist }) => {
  const { allSongs, searchQuery, setSearchQuery } = useMusic();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const {
    isListening,
    transcript,
    error: voiceError,
    activeLang,
    setActiveLang,
    startListening,
    stopListening,
  } = useVoiceSearch((query) => setSearchQuery(query));

  const languages = ['All', 'Assamese', 'Hindi', 'Bengali', 'Nepali', 'English'];

  // Filter songs based on search query and language
  const filteredSongs = allSongs.filter((song) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query) ||
      song.language.toLowerCase().includes(query) ||
      (song.album && song.album.toLowerCase().includes(query)) ||
      (song.genre && song.genre.toLowerCase().includes(query));

    const matchesLanguage = selectedLanguage === 'All' || song.language === selectedLanguage;

    return matchesQuery && matchesLanguage;
  });

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(activeLang);
    }
  };

  return (
    <div className="pb-32 pt-2 max-w-7xl mx-auto px-4 space-y-5 animate-in fade-in">
      {/* Search Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white brand-font tracking-tight">
          Search Music & Voice Input
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Search across Assamese, Hindi, Bengali, Nepali, and English tracks with voice support.
        </p>
      </div>

      {/* Search Bar Input Container */}
      <div className="relative w-full">
        <div className="relative flex items-center w-full bg-[#0d1424] border border-amber-500/30 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 rounded-2xl shadow-lg transition-all p-2 gap-2">
          <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by song, artist, album, or language..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="w-8 h-8 rounded-full text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition shrink-0"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Voice Language Selector Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer shrink-0"
              title="Voice Recognition Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{activeLang.split('-')[0].toUpperCase()}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 top-11 z-30 w-44 bg-[#0a0f1d] border border-amber-500/30 rounded-2xl p-2 shadow-2xl">
                <span className="text-[10px] font-bold text-slate-400 px-2 uppercase block mb-1">
                  Voice Language
                </span>
                {SUPPORTED_VOICE_LANGS.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setActiveLang(lang.code);
                      setShowLangMenu(false);
                      if (isListening) {
                        stopListening();
                        setTimeout(() => startListening(lang.code), 200);
                      }
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                      activeLang === lang.code
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mic Button */}
          <button
            onClick={toggleMic}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40'
                : 'bg-amber-400 text-slate-950 hover:bg-amber-300 glow-gold-sm font-bold'
            }`}
            title={isListening ? 'Listening... Tap to stop' : 'Voice Search (MahiVoiceInput)'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>

        {/* Listening banner / active transcript */}
        {isListening && (
          <div className="mt-2 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center gap-3 animate-in fade-in">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-amber-300">
                Listening in {SUPPORTED_VOICE_LANGS.find(l => l.code === activeLang)?.name}... Speak now
              </p>
              {transcript && (
                <p className="text-xs text-white italic truncate mt-0.5">"{transcript}"</p>
              )}
            </div>
          </div>
        )}

        {voiceError && (
          <div className="mt-2 p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
            {voiceError}
          </div>
        )}
      </div>

      {/* Language filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {languages.map((lang) => {
          const isActive = selectedLanguage === lang;
          return (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-bold glow-gold-sm shadow'
                  : 'bg-[#0d1424] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {lang}
            </button>
          );
        })}
      </div>

      {/* Results Section */}
      <div className="bg-[#0a0f1d] border border-slate-800 rounded-3xl p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Results ({filteredSongs.length})
          </span>
          {searchQuery && (
            <span className="text-xs text-amber-400/80 font-mono">
              Filtered by: "{searchQuery}"
            </span>
          )}
        </div>

        {filteredSongs.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-sm font-medium text-slate-300">No tracks found</p>
            <p className="text-xs text-slate-500 mt-1">
              Try searching by song name, artist, or language (e.g. "Assamese", "Bihu", "MS2", "Hindi").
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredSongs.map((song, idx) => (
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
  );
};

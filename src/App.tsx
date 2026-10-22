import React, { useState } from 'react';
import { MusicProvider, useMusic } from './context/MusicContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { MiniPlayer } from './components/MiniPlayer';
import { FullPlayerModal } from './components/FullPlayerModal';
import { EqualizerModal } from './components/EqualizerModal';
import { SleepTimerModal } from './components/SleepTimerModal';
import { AddToPlaylistModal } from './components/AddToPlaylistModal';
import { AndroidPackageModal } from './components/AndroidPackageModal';
import { SplashScreen } from './components/SplashScreen';
import { OfflineIndicator } from './components/OfflineIndicator';

import { HomeView } from './views/HomeView';
import { AssameseView } from './views/AssameseView';
import { MS2OriginalsView } from './views/MS2OriginalsView';
import { LibraryView } from './views/LibraryView';
import { SearchView } from './views/SearchView';
import { Song } from './types/music';

const MainAppContent: React.FC = () => {
  const { activeTab } = useMusic();
  const [showSplash, setShowSplash] = useState(true);
  const [isEqOpen, setIsEqOpen] = useState(false);
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState(false);
  const [isAndroidGuideOpen, setIsAndroidGuideOpen] = useState(false);
  const [playlistTargetSong, setPlaylistTargetSong] = useState<Song | null>(null);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);

  const handleOpenAddToPlaylist = (song?: Song) => {
    setPlaylistTargetSong(song || null);
    setIsAddToPlaylistOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* Top Navigation */}
      <Header
        onOpenEq={() => setIsEqOpen(true)}
        onOpenAndroidGuide={() => setIsAndroidGuideOpen(true)}
      />

      {/* View Router */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && (
          <HomeView
            onAddToPlaylist={handleOpenAddToPlaylist}
            onOpenAndroidGuide={() => setIsAndroidGuideOpen(true)}
          />
        )}
        {activeTab === 'assamese' && (
          <AssameseView onAddToPlaylist={handleOpenAddToPlaylist} />
        )}
        {activeTab === 'ms2-originals' && (
          <MS2OriginalsView onAddToPlaylist={handleOpenAddToPlaylist} />
        )}
        {activeTab === 'library' && (
          <LibraryView onAddToPlaylist={handleOpenAddToPlaylist} />
        )}
        {activeTab === 'search' && (
          <SearchView onAddToPlaylist={handleOpenAddToPlaylist} />
        )}
      </main>

      {/* Mini Player */}
      <MiniPlayer />

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Fullscreen Player Modal */}
      <FullPlayerModal
        onOpenEq={() => setIsEqOpen(true)}
        onOpenSleepTimer={() => setIsSleepTimerOpen(true)}
        onOpenAddToPlaylist={() => handleOpenAddToPlaylist()}
      />

      {/* Equalizer Modal */}
      <EqualizerModal
        isOpen={isEqOpen}
        onClose={() => setIsEqOpen(false)}
      />

      {/* Sleep Timer Modal */}
      <SleepTimerModal
        isOpen={isSleepTimerOpen}
        onClose={() => setIsSleepTimerOpen(false)}
      />

      {/* Add To Playlist Modal */}
      <AddToPlaylistModal
        isOpen={isAddToPlaylistOpen}
        onClose={() => {
          setIsAddToPlaylistOpen(false);
          setPlaylistTargetSong(null);
        }}
        targetSong={playlistTargetSong}
      />

      {/* Android Packaging & APK Guide Modal */}
      <AndroidPackageModal
        isOpen={isAndroidGuideOpen}
        onClose={() => setIsAndroidGuideOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <MusicProvider>
      <MainAppContent />
    </MusicProvider>
  );
}

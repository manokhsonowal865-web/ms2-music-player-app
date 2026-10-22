import React, { useRef, useState } from 'react';
import { UploadCloud, FolderPlus, Music, CheckCircle2 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

interface LocalMusicImportProps {
  onSuccess?: () => void;
  compact?: boolean;
}

export const LocalMusicImport: React.FC<LocalMusicImportProps> = ({ onSuccess, compact = false }) => {
  const { importLocalFiles } = useMusic();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importCount, setImportCount] = useState<number | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const count = await importLocalFiles(files);
    setImportCount(count);
    if (onSuccess) onSuccess();
    setTimeout(() => setImportCount(null), 4000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac,.aac"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {compact ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs glow-gold-sm transition cursor-pointer shadow"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Import Music</span>
        </button>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full p-6 sm:p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
            isDragging
              ? 'border-amber-400 bg-amber-500/15'
              : 'border-amber-500/30 bg-[#0d1424]/40 hover:bg-[#0d1424]/80 hover:border-amber-400/60'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3 glow-gold-sm">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-base font-bold text-white brand-font">
            Import Local Audio from Android Storage
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
            Select MP3, WAV, FLAC, M4A or AAC songs saved on your phone. Play them with full visualizer & equalizer.
          </p>

          <button
            type="button"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs glow-gold-sm hover:scale-105 active:scale-95 transition shadow cursor-pointer flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Choose Audio Files</span>
          </button>

          {importCount !== null && (
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {importCount > 0
                  ? `Successfully imported ${importCount} song${importCount > 1 ? 's' : ''}!`
                  : 'No valid audio files found.'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

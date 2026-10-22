import React, { useState } from 'react';
import { X, Smartphone, Download, Code2, Terminal, ExternalLink, Check, Copy, Flame } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AndroidPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidPackageModal: React.FC<AndroidPackageModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(id);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const bubblewrapSnippet = `# Step 1: Install Bubblewrap CLI (Google's official PWA to APK tool)
npm i -g @bubblewrap/cli

# Step 2: Initialize your Android APK project from your live PWA URL
bubblewrap init --manifest="${window.location.origin}/manifest.webmanifest"

# Step 3: Build the production signed Android APK / AAB
bubblewrap build

# Result: Output .apk file ready to install on any Android phone!`;

  const capacitorSnippet = `# Alternative with Capacitor Android:
npm i -D @capacitor/cli @capacitor/core @capacitor/android
npx cap init "MS2 Music Player" "com.mahiai.ms2" --web-dir dist
npm run build
npx cap add android
npx cap open android
# Build signed APK in Android Studio!`;

  const kotlinBridgeSnippet = `// Android Native Bridge: com.mahiai.voice.MahiVoiceInput
// Pair your Kotlin voice input with MS2 Music Player in Android WebView:
webView.addJavascriptInterface(object {
    @JavascriptInterface
    fun triggerVoiceInput(lang: String) {
        val voiceInput = MahiVoiceInput(context, 
            onResult = { text ->
                runOnUiThread {
                    webView.evaluateJavascript("window.onAndroidVoiceResult('$text')", null)
                }
            },
            onError = { err -> /* log */ }
        )
        voiceInput.startListening(lang)
    }
}, "AndroidVoiceBridge")`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#0a0f1d] border border-amber-500/30 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white brand-font">Android App & APK Guide</h3>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                  MS2.-SM
                </span>
              </div>
              <p className="text-xs text-slate-400">Run natively on Android phones or generate an installable APK</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Method 1: Instant PWA Install on Android */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Method 1: Instant 1-Tap Install (Recommended)</span>
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                MS2 Music Player is already fully PWA-configured with offline service worker, Web App Manifest, and adaptive icons.
                You can install it directly onto any Android phone home screen without needing the Play Store.
              </p>
            </div>

            {isInstallable ? (
              <button
                onClick={install}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs glow-gold-sm hover:scale-105 transition cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install Now</span>
              </button>
            ) : isInstalled ? (
              <span className="px-3 py-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 rounded-xl border border-emerald-500/30 shrink-0">
                Installed
              </span>
            ) : (
              <div className="text-right shrink-0">
                <span className="text-[11px] text-amber-400 font-medium">In Chrome: Menu &gt; Install App</span>
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-amber-500/20 text-xs text-slate-400 space-y-1">
            <p>• Opens in full-screen standalone mode just like a native app.</p>
            <p>• Supports lock-screen & notification media playback controls.</p>
            <p>• Works offline and loads your local MP3s directly from Android storage.</p>
          </div>
        </div>

        {/* Method 2: Package into signed Android APK */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>Method 2: Generate Signed Android APK (.apk / .aab)</span>
            </h4>
            <button
              onClick={() => copyCode(bubblewrapSnippet, 'bubblewrap')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-medium"
            >
              {copiedTab === 'bubblewrap' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTab === 'bubblewrap' ? 'Copied' : 'Copy Commands'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-1">
            Use Google's official <strong className="text-slate-200">Bubblewrap CLI</strong> (Trusted Web Activity) to wrap this PWA into an installable APK in under 2 minutes:
          </p>

          <pre className="mt-2 p-3 bg-black/60 rounded-xl text-[11px] font-mono text-amber-200/90 overflow-x-auto leading-relaxed border border-slate-800">
            {bubblewrapSnippet}
          </pre>
        </div>

        {/* Method 3: Kotlin MahiVoiceInput Integration */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>Native Android Kotlin Voice Integration</span>
            </h4>
            <button
              onClick={() => copyCode(kotlinBridgeSnippet, 'kotlin')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-medium"
            >
              {copiedTab === 'kotlin' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTab === 'kotlin' ? 'Copied' : 'Copy Kotlin Bridge'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-1">
            Your provided <code className="text-amber-300 font-mono">MahiVoiceInput</code> class connects directly to MS2's JavaScript runtime via <code className="text-amber-300 font-mono">window.onAndroidVoiceResult</code>:
          </p>

          <pre className="mt-2 p-3 bg-black/60 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed border border-slate-800">
            {kotlinBridgeSnippet}
          </pre>
        </div>

        {/* Note on APK transparency */}
        <div className="mt-4 p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-blue-300">
          <p>
            <strong>Engineering Notice:</strong> An APK file must be compiled using Android SDK / Gradle tools on an Android build machine. This web environment provides the production web app and PWA manifest; use the commands above to produce the signed <code className="text-white">.apk</code> binary.
          </p>
        </div>

        <div className="mt-4 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

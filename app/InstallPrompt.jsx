"use client";
import { useState, useEffect } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed before (respect for 7 days)
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show after a delay so user has time to explore
      setTimeout(() => setShowPrompt(true), 8000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => {
      setIsInstalled(true);
      setShowPrompt(false);
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: "#141420",
        border: "1px solid rgba(52,211,153,0.25)",
        borderRadius: 12,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        maxWidth: "calc(100vw - 32px)",
        width: 420,
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        animation: "slideUpInstall 0.4s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <style>{`
        @keyframes slideUpInstall {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* Icon */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "rgba(52,211,153,0.1)",
          border: "1px solid rgba(52,211,153,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L12 14M12 14L8 10M12 14L16 10M4 18H20"
            stroke="#34d399"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#e2ddd5",
            marginBottom: 2,
          }}
        >
          Install PeptaBase
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(226,221,213,0.45)",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Add to home screen for quick access
        </div>
      </div>

      {/* Buttons */}
      <button
        onClick={handleInstall}
        style={{
          background: "#34d399",
          color: "#08080f",
          border: "none",
          padding: "8px 16px",
          borderRadius: 6,
          fontSize: 12,
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 600,
          letterSpacing: "0.05em",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Install
      </button>
      <button
        onClick={handleDismiss}
        style={{
          background: "none",
          border: "none",
          color: "rgba(226,221,213,0.3)",
          fontSize: 18,
          cursor: "pointer",
          padding: "4px",
          lineHeight: 1,
          flexShrink: 0,
        }}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

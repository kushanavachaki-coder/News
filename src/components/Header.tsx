import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Search, User, Zap } from "lucide-react";

interface HeaderProps {
  onSearchClick: () => void;
  onProfileClick: () => void;
  onLogoClick: () => void;
  activeTab: string;
}

export default function Header({
  onSearchClick,
  onProfileClick,
  onLogoClick,
  activeTab,
}: HeaderProps) {
  const [isBlinking, setIsBlinking] = useState(false);

  // Automated blink effect every 4.5 seconds to delight the user
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 180);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleManualBlink = () => {
    setIsBlinking(true);
    setTimeout(() => {
      setIsBlinking(false);
    }, 180);
    onLogoClick();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sky-100/60 px-4 py-3.5 flex items-center justify-between shadow-sm">
      {/* Brand Logo & Icon */}
      <button
        onClick={handleManualBlink}
        className="flex items-center gap-2.5 group focus:outline-none"
        id="blink-logo-btn"
      >
        <div className="relative flex items-center justify-center w-9.5 h-9.5 rounded-2xl bg-gradient-to-tr from-sky-100 to-indigo-100/60 text-sky-600 overflow-hidden border border-sky-200/50 transition-all duration-300 group-hover:scale-105 active:scale-95 shadow-sm">
          {isBlinking ? (
            <EyeOff className="w-5 h-5 absolute text-indigo-500" />
          ) : (
            <Eye className="w-5 h-5 absolute text-sky-600 transition-transform duration-300 group-hover:rotate-6" />
          )}
        </div>
        <div className="flex flex-col items-start leading-none text-left">
          <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            BLINK
          </span>
          <span className="text-[8px] font-black tracking-widest text-indigo-400 uppercase">
            News before you blink
          </span>
        </div>
      </button>

      {/* Navigation actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSearchClick}
          className={`p-2.5 rounded-xl transition-all duration-200 ${
            activeTab === "explore"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/10"
              : "bg-sky-50/50 text-indigo-600 hover:bg-sky-50"
          }`}
          aria-label="Explore news"
          id="search-nav-btn"
        >
          <Search className="w-4.5 h-4.5" />
        </button>

        <button
          onClick={onProfileClick}
          className={`p-2.5 rounded-xl transition-all duration-200 ${
            activeTab === "profile"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/10"
              : "bg-sky-50/50 text-indigo-600 hover:bg-sky-50"
          }`}
          aria-label="User Profile"
          id="profile-nav-btn"
        >
          <User className="w-4.5 h-4.5" />
        </button>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAudio } from '../context/AudioContext';
import { Music, Volume2, VolumeX, Play, Pause, LogOut, Menu, X, Calendar, MessageSquare, Home } from 'lucide-react';

export default function Navbar() {
  const { isPlaying, isMuted, currentBgm, togglePlay, toggleMute } = useAudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-bakery-100/90 backdrop-blur-md border-b border-bakery-200/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-bold font-serif text-bakery-800 tracking-wide transition-colors group-hover:text-bakery-600">
                🍞 Crust & Cream
              </span>
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') ? 'text-bakery-800 font-semibold bg-bakery-200/50' : 'text-bakery-600 hover:text-bakery-800 hover:bg-bakery-200/20'
              }`}
            >
              <Home size={16} />
              <span>홈</span>
            </Link>
            <Link
              to="/pickup"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/pickup') ? 'text-bakery-800 font-semibold bg-bakery-200/50' : 'text-bakery-600 hover:text-bakery-800 hover:bg-bakery-200/20'
              }`}
            >
              <Calendar size={16} />
              <span>픽업 예약</span>
            </Link>
            <Link
              to="/reviews"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/reviews') ? 'text-bakery-800 font-semibold bg-bakery-200/50' : 'text-bakery-600 hover:text-bakery-800 hover:bg-bakery-200/20'
              }`}
            >
              <MessageSquare size={16} />
              <span>리뷰</span>
            </Link>
            
            {token ? (
              <div className="flex items-center space-x-4 border-l border-bakery-200 pl-4">
                <span className="text-xs text-bakery-600 font-medium">{user?.name}님 환영합니다</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} />
                  <span>로그아웃</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg text-sm font-medium border border-bakery-400 text-bakery-700 hover:bg-bakery-800 hover:text-white transition-all duration-300 ${
                  isActive('/login') ? 'bg-bakery-800 text-white' : ''
                }`}
              >
                로그인
              </Link>
            )}
          </div>

          {/* Mini BGM Player (Desktop) */}
          <div className="hidden lg:flex items-center bg-bakery-50 border border-bakery-200/60 rounded-full px-4 py-1.5 max-w-xs shadow-inner">
            <div className="flex items-center space-x-2 mr-3">
              {isPlaying ? (
                <div className="flex items-end space-x-0.5 h-3 w-3">
                  <div className="bg-bakery-600 w-0.5 animate-[bounce_0.8s_infinite] h-2"></div>
                  <div className="bg-bakery-600 w-0.5 animate-[bounce_0.5s_infinite] h-3"></div>
                  <div className="bg-bakery-600 w-0.5 animate-[bounce_0.7s_infinite] h-1.5"></div>
                </div>
              ) : (
                <Music size={14} className="text-bakery-400" />
              )}
            </div>
            
            <div className="flex flex-col text-left mr-4 overflow-hidden w-28">
              {currentBgm ? (
                <>
                  <span className="text-[10px] text-bakery-500 font-semibold truncate leading-tight">
                    {currentBgm.bgm_artist}
                  </span>
                  <span className="text-[11px] text-bakery-800 font-bold truncate leading-tight">
                    {currentBgm.bgm_title}
                  </span>
                </>
              ) : (
                <span className="text-xs text-bakery-400 italic">음악 준비 중...</span>
              )}
            </div>

            <div className="flex items-center space-x-1 border-l border-bakery-200 pl-2">
              <button
                onClick={togglePlay}
                disabled={!currentBgm}
                className="p-1 rounded-full text-bakery-700 hover:bg-bakery-200/50 disabled:opacity-50 transition-colors"
                title={isPlaying ? "일시정지" : "재생"}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button
                onClick={toggleMute}
                disabled={!currentBgm}
                className="p-1 rounded-full text-bakery-700 hover:bg-bakery-200/50 disabled:opacity-50 transition-colors"
                title={isMuted ? "음소거 해제" : "음소거"}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu & Player Toggle Buttons */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Tiny player for mobile */}
            {currentBgm && (
              <div className="flex items-center bg-bakery-50 border border-bakery-200/60 rounded-full px-2.5 py-1">
                <button
                  onClick={togglePlay}
                  className="p-1 text-bakery-700 hover:bg-bakery-200/50 rounded-full transition-colors mr-1"
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-1 text-bakery-700 hover:bg-bakery-200/50 rounded-full transition-colors"
                >
                  {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                </button>
              </div>
            )}
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-bakery-700 hover:bg-bakery-200/30 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-bakery-100 border-b border-bakery-200 shadow-md">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 block px-3 py-2 rounded-md text-base font-medium text-bakery-700 hover:bg-bakery-200/40"
            >
              <Home size={18} />
              <span>홈</span>
            </Link>
            <Link
              to="/pickup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 block px-3 py-2 rounded-md text-base font-medium text-bakery-700 hover:bg-bakery-200/40"
            >
              <Calendar size={18} />
              <span>픽업 예약</span>
            </Link>
            <Link
              to="/reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 block px-3 py-2 rounded-md text-base font-medium text-bakery-700 hover:bg-bakery-200/40"
            >
              <MessageSquare size={18} />
              <span>리뷰</span>
            </Link>

            {currentBgm && (
              <div className="px-3 py-2 text-xs border-t border-bakery-200 mt-2">
                <p className="text-bakery-500 font-semibold">BGM: {currentBgm.bgm_artist}</p>
                <p className="text-bakery-800 font-bold">{currentBgm.bgm_title}</p>
              </div>
            )}

            {token ? (
              <div className="border-t border-bakery-200 pt-2 mt-2 px-3 flex items-center justify-between">
                <span className="text-xs text-bakery-600">{user?.name}님</span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-1 text-sm font-medium text-red-600"
                >
                  <LogOut size={16} />
                  <span>로그아웃</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center mt-4 w-full px-4 py-2 border border-bakery-400 rounded-lg text-sm font-medium text-bakery-700"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

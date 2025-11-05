import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-indigo-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group" onClick={() => setMobileMenuOpen(false)}>
            <div className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">📅</div>
            <div>
              <h1 className="font-bold text-lg sm:text-2xl bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Daily Tracker
              </h1>
              <p className="hidden sm:block text-xs text-slate-500">Stay organized, stay productive</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive("/")
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              Today
            </Link>
            <Link
              to="/month"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive("/month")
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              Month
            </Link>
            <Link
              to="/editor"
              className="ml-2 px-4 py-2 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-105"
            >
              + Add Task
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-indigo-50"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-2 space-y-2 animate-in fade-in duration-200">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                isActive("/")
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-600 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              📆 Today
            </Link>
            <Link
              to="/month"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                isActive("/month")
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-600 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              📅 Month View
            </Link>
            <Link
              to="/editor"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg text-center"
            >
              ✨ Add New Task
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

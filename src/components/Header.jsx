import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileMenuOpen(false)}>
            <div className="text-2xl">📅</div>
            <h1 className="font-bold text-lg sm:text-xl text-slate-900">
              Daily Tracker
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition ${
                isActive("/")
                  ? "bg-indigo-600 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              Today
            </Link>
            <Link
              to="/month"
              className={`px-4 py-2 rounded-lg font-medium transition ${
                isActive("/month")
                  ? "bg-indigo-600 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              Month
            </Link>
            <Link
              to="/editor"
              className="ml-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium"
            >
              + Add
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
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
          <nav className="md:hidden mt-3 pb-2 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg font-medium transition ${
                isActive("/")
                  ? "bg-indigo-600 text-white"
                  : "text-slate-700 bg-slate-50 hover:bg-slate-100"
              }`}
            >
              Today
            </Link>
            <Link
              to="/month"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg font-medium transition ${
                isActive("/month")
                  ? "bg-indigo-600 text-white"
                  : "text-slate-700 bg-slate-50 hover:bg-slate-100"
              }`}
            >
              Month
            </Link>
            <Link
              to="/editor"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium text-center"
            >
              + Add Task
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

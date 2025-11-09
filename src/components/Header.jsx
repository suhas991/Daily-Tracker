import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  
  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileMenuOpen(false)}>
            <img src="/vite.png" alt="Daily Tracker Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
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
            {user && (
              <button
                onClick={handleSignOut}
                className="ml-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition font-medium"
              >
                Sign Out
              </button>
            )}
          </nav>

          {/* Mobile Buttons */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/editor"
              className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
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
            {user && (
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition font-medium"
              >
                Sign Out
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

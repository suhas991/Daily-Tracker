import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-indigo-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="text-3xl group-hover:scale-110 transition-transform">📅</div>
          <div>
            <h1 className="font-bold text-2xl bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Daily Tracker
            </h1>
            <p className="text-xs text-slate-500">Stay organized, stay productive</p>
          </div>
        </Link>
        <nav className="flex items-center gap-2">
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
      </div>
    </header>
  );
}

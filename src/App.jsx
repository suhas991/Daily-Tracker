// ------------------ App.js ------------------
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Today from "./pages/Today";
import Editor from "./pages/Editor";
import Month from "./pages/Month";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/month" element={<Month />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/editor/:id" element={<Editor />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

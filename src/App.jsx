// ------------------ App.js ------------------
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Today from "./pages/Today";
import Editor from "./pages/Editor";
import Month from "./pages/Month";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
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

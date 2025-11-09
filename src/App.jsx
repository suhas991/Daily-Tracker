// ------------------ App.js ------------------
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Today from "./pages/Today";
import Editor from "./pages/Editor";
import Month from "./pages/Month";
import Auth from "./pages/Auth";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Header />
                  <main className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
                    <Routes>
                      <Route path="/" element={<Today />} />
                      <Route path="/month" element={<Month />} />
                      <Route path="/editor" element={<Editor />} />
                      <Route path="/editor/:id" element={<Editor />} />
                    </Routes>
                  </main>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

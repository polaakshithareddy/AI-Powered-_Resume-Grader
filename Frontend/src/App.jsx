import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Analysis from './pages/Analysis';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Router>
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-dark-900 transition-colors duration-300">
        <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
        {/* Background glow effects */}
        <div className="print-hidden absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-600/20 blur-[120px] pointer-events-none" />
        <div className="print-hidden absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-500/20 blur-[120px] pointer-events-none" />
        
        <Navbar />
        
        <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/analysis/:id" element={
              <ProtectedRoute>
                <Analysis />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;

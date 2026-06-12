import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuBrainCircuit, LuSun, LuMoon } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <nav className="print-hidden sticky top-0 z-50 glass-card border-x-0 border-t-0 rounded-none rounded-b-3xl mb-8">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-xl text-white group-hover:scale-105 transition-transform">
            <LuBrainCircuit size={24} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
            ResumeAI
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsDark(!isDark)} 
            className="p-2 rounded-full hover:bg-dark-700 transition-colors text-gray-400 hover:text-gray-100"
            title="Toggle Dark Mode"
          >
            {isDark ? <LuSun size={20} /> : <LuMoon size={20} />}
          </button>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-gray-100 font-medium hover:text-primary-500 transition-colors">Dashboard</Link>
              <button onClick={handleLogout} className="btn-primary py-2 px-5 text-sm bg-dark-700 from-dark-700 to-dark-700 text-gray-100 border border-dark-700 shadow-none hover:from-dark-800 hover:to-dark-800 hover:-translate-y-0">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-gray-100 transition-colors font-medium">Login</Link>
              <Link to="/register" className="btn-primary py-2 px-5 text-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

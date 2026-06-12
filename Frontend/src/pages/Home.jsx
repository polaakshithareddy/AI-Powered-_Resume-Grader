import { Link } from 'react-router-dom';
import { LuCloud, LuZap, LuTarget } from 'react-icons/lu';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-in">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800 border border-dark-700 text-sm text-primary-400 mb-8 animate-slide-up">
        <LuZap size={16} />
        <span>Powered by Google Gemini 2.5</span>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
        Optimize Your Resume <br/>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-accent-400 to-primary-500 animate-gradient-x">
          Beat the ATS
        </span>
      </h1>
      
      <p className="text-xl text-gray-400 max-w-2xl mb-12 animate-slide-up" style={{ animationDelay: '200ms' }}>
        Upload your resume and get an instant ATS score, targeted job role analysis, and actionable AI suggestions to land your dream job.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <Link to="/dashboard" className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4">
          <LuCloud size={24} />
          Upload Resume Now
        </Link>
        <Link to="/analysis/1" className="glass-card flex items-center justify-center gap-2 text-lg px-8 py-4 hover:bg-dark-700/50 transition-colors">
          <LuTarget size={24} />
          View Sample Analysis
        </Link>
      </div>
    </div>
  );
};

export default Home;

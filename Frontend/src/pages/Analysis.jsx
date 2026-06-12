import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LuArrowLeft, LuDownload, LuCircleAlert, LuSparkles, LuTag, LuArrowRight } from 'react-icons/lu';
import api from '../services/api';

const Analysis = () => {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await api.get(`/resume/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch analysis. Ensure the backend is running.');
      }
    };
    fetchAnalysis();
  }, [id]);

  if (error) {
    return <div className="max-w-4xl mx-auto mt-12 p-6 bg-red-500/10 border border-red-500 text-red-500 rounded-lg">{error}</div>;
  }

  if (!data) {
    return <div className="max-w-4xl mx-auto mt-12 text-center text-gray-400">Loading analysis...</div>;
  }

  return (
    <>
      {/* Hidden Printable PDF Container (Rendered behind the main UI) */}
      <div className="print-only" style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: -50, opacity: 0.01, pointerEvents: 'none' }}>
        <div className="w-full bg-white print:p-0 p-8 text-gray-900 font-sans mx-auto box-border">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Analysis Report</h1>
          <p className="text-gray-600 mb-8 border-b pb-4">Target Role: <strong className="text-gray-900">{data.targetJobRole}</strong></p>

          <div className="flex items-center gap-6 mb-10">
            <div className="w-32 h-32 rounded-full border-8 border-primary-500 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-900">{data.atsScore}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">ATS Match Score</h2>
              <p className="text-gray-600">Based on standard Applicant Tracking System criteria.</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">AI Suggestions</h2>
          <div className="space-y-4 mb-8">
            {data.aiSuggestions && data.aiSuggestions.map((suggestion, index) => (
              <div key={index} className="flex gap-3 break-inside-avoid">
                <LuCircleAlert className="text-primary-600 mt-1 flex-shrink-0" size={20} />
                <p className="text-gray-700 leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>

          {data.missingKeywords && data.missingKeywords.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Missing Keywords</h2>
              <div className="flex flex-wrap gap-2">
                {data.missingKeywords.map((keyword, i) => (
                  <span key={i} className="inline-block px-3 py-1 mb-2 rounded-full text-sm font-medium border break-inside-avoid" style={{ backgroundColor: '#f8fafc', color: '#0f172a', borderColor: '#cbd5e1' }}>
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.rewrittenBullets && data.rewrittenBullets.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2 break-inside-avoid">Bullet Point Auto-Fixer</h2>
              <div className="space-y-6">
                {data.rewrittenBullets.map((bullet, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg overflow-hidden break-inside-avoid">
                    <div className="p-3 bg-red-50 border-b border-red-100">
                      <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Original (Weak)</div>
                      <p className="text-sm text-gray-700">"{bullet.original}"</p>
                    </div>
                    <div className="p-3 bg-green-50 border-b border-green-100">
                      <div className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">AI Optimized (Strong)</div>
                      <p className="text-sm text-gray-900 font-medium">"{bullet.rewritten}"</p>
                    </div>
                    <div className="p-3 bg-gray-50">
                      <p className="text-xs text-gray-600 flex items-start gap-2">
                        <LuArrowRight className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <span><strong>Why it's better:</strong> {bullet.explanation}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actual Screen UI */}
      <div className="print-hidden max-w-4xl mx-auto animate-fade-in">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-100 transition-colors mb-8">
        <LuArrowLeft size={20} />
        Back to Dashboard
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Score Section */}
        <div className="md:col-span-1">
          <div className="glass-card p-8 flex flex-col items-center justify-center text-center h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-primary-500/10 to-transparent -z-10" />
            
            <h2 className="text-xl font-semibold mb-6">ATS Match Score</h2>
            
            {/* Simple circular score indicator */}
            <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-4 border-dark-700 mb-6">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="80" cy="80" r="76" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-dark-700" />
                <circle cx="80" cy="80" r="76" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray="477" 
                  strokeDashoffset={477 - (477 * data.atsScore) / 100} 
                  className="text-primary-500 transition-all duration-1000 ease-out" 
                />
              </svg>
              <span className="text-5xl font-bold">{data.atsScore}</span>
            </div>
          </div>
        </div>

        {/* Suggestions Section */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">AI Suggestions</h2>
            <button onClick={() => window.print()} className="btn-primary py-2 px-4 flex items-center gap-2 text-sm">
              <LuDownload size={16} />
              Export PDF
            </button>
          </div>

          <div className="space-y-4">
            {data.aiSuggestions && data.aiSuggestions.map((suggestion, index) => (
              <div key={index} className="glass-card p-4 flex gap-4 items-start">
                <div className="mt-1">
                  <LuCircleAlert className="text-primary-500" size={24} />
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-gray-100">
                    AI Suggestion
                  </h4>
                  <p className="text-sm text-gray-400">{suggestion}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Missing Keywords Section */}
          {data.missingKeywords && data.missingKeywords.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <LuTag className="text-accent-500" size={20} />
                <h3 className="text-xl font-bold text-gray-100">Missing Keywords</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">Consider incorporating these keywords into your resume to better match the <strong>{data.targetJobRole}</strong> role.</p>
              <div className="flex flex-wrap gap-2">
                {data.missingKeywords.map((keyword, i) => (
                  <span key={i} className="px-3 py-1 bg-dark-800 border border-dark-700 text-accent-400 rounded-full text-sm font-medium">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bullet Point Auto-Fixer Section */}
          {data.rewrittenBullets && data.rewrittenBullets.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <LuSparkles className="text-yellow-500" size={20} />
                <h3 className="text-xl font-bold text-gray-100">Bullet Point Auto-Fixer</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">We identified some weak bullet points and used AI to rewrite them into stronger, action-oriented accomplishments.</p>
              
              <div className="space-y-4">
                {data.rewrittenBullets.map((bullet, i) => (
                  <div key={i} className="glass-card overflow-hidden">
                    <div className="p-4 bg-red-500/5 border-b border-red-500/10">
                      <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Original (Weak)</div>
                      <p className="text-sm text-gray-400">"{bullet.original}"</p>
                    </div>
                    <div className="p-4 bg-green-500/5 border-b border-green-500/10">
                      <div className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2">AI Optimized (Strong)</div>
                      <p className="text-sm text-gray-100 font-medium">"{bullet.rewritten}"</p>
                    </div>
                    <div className="p-4 bg-dark-900/50">
                      <p className="text-xs text-gray-400 flex items-start gap-2">
                        <LuArrowRight className="text-primary-500 mt-0.5" />
                        <span><strong>Why it's better:</strong> {bullet.explanation}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
    </>
  );
};

export default Analysis;

import { useState, useRef, useEffect } from 'react';
import { LuUpload, LuFileText, LuCheck, LuTrash2 } from 'react-icons/lu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';

const Dashboard = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const loadingMessages = [
    'Extracting text from PDF...',
    'Evaluating ATS criteria...',
    'Scanning for missing keywords...',
    'Formulating AI suggestions...',
    'Finalizing report...'
  ];
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    let interval;
    if (isUploading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 2500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isUploading]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/resume/history');
        setHistory(res.data);
      } catch (err) {
        console.error('Failed to fetch history', err);
        toast.error('Failed to load recent history');
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast((t) => (
      <div className="flex flex-col gap-4 text-gray-800 dark:text-gray-200">
        <p className="text-sm font-medium">Are you sure you want to delete this analysis? This will permanently delete the ATS scores and the uploaded PDF from the cloud.</p>
        <div className="flex gap-3 justify-end mt-2">
          <button 
            className="px-4 py-2 text-xs font-bold bg-dark-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-dark-300 dark:hover:bg-dark-600 transition-colors"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.delete(`/resume/${id}`);
                setHistory((prev) => prev.filter((item) => item._id !== id));
                toast.success("Analysis deleted successfully");
              } catch (err) {
                console.error(err);
                toast.error("Failed to delete analysis");
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ), { 
      duration: Infinity,
      style: {
        maxWidth: '400px',
        padding: '20px',
      }
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    if (!file) return false;
    
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Invalid file type. Only PDF resumes are currently supported.');
      return false;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please upload a file under 5MB.`);
      return false;
    }
    
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleUpload = async (e) => {
    e.stopPropagation();
    if (!selectedFile || !targetRole) {
      toast.error('Please provide both a resume and a target job role.');
      return;
    }
    setIsUploading(true);

    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('targetJobRole', targetRole);

    try {
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/analysis/${res.data._id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to upload resume. Ensure the backend is running.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
          <p className="text-gray-400">Upload a new resume or review your past analyses.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold mb-6">New Analysis</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Target Job Role</label>
              <input 
                type="text" 
                placeholder="e.g. Senior Frontend Developer" 
                className="input-field"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>

            <div 
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${dragActive ? 'border-primary-500 bg-primary-500/10' : 'border-dark-700 hover:border-primary-500/50 hover:bg-dark-800'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept=".pdf,application/pdf"
                onChange={handleChange}
              />
              
              <div className="flex flex-col items-center justify-center">
                {selectedFile ? (
                  <>
                    <div className="bg-primary-500/20 p-4 rounded-full mb-4 text-primary-600">
                      <LuCheck size={32} />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-primary-600">File Selected</h3>
                    <p className="text-sm text-gray-500 font-medium truncate max-w-xs">{selectedFile.name}</p>
                    <button 
                      className="btn-primary py-2 px-6 mt-6 w-full flex items-center justify-center gap-3" 
                      onClick={handleUpload}
                      disabled={isUploading}
                    >
                      {isUploading && (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {isUploading ? loadingMessages[loadingStep] : 'Analyze Resume'}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-dark-900 p-4 rounded-full mb-4">
                      <LuUpload size={32} className="text-primary-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Drag & Drop your resume</h3>
                    <p className="text-sm text-gray-500 mb-6">Supports PDF files up to 5MB</p>
                    <button className="btn-primary py-2 px-6">Select File</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-6 h-full">
            <h2 className="text-xl font-semibold mb-6">Recent History</h2>
            
            {/* Placeholder for history items */}
            <div className="space-y-4">
              {isLoadingHistory ? (
                <div className="text-center py-8 text-gray-500">Loading history...</div>
              ) : history.length > 0 ? (
                history.map((item) => (
                  <Link to={`/analysis/${item._id}`} key={item._id} className="block p-4 rounded-xl bg-dark-900/50 border border-dark-700 hover:border-primary-500/30 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-dark-800 rounded-lg text-accent-400 group-hover:text-primary-500 transition-colors">
                          <LuFileText size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm truncate max-w-[150px]">{item.targetJobRole}</h4>
                          <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-green-500/30 text-green-400 text-xs font-bold">
                          {item.atsScore}
                        </div>
                        <button 
                          onClick={(e) => handleDelete(e, item._id)}
                          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                          title="Delete Analysis"
                        >
                          <LuTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent analysis found.</p>
                  <p className="text-sm mt-2">Upload a resume to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

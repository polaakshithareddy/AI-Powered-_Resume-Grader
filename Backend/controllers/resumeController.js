const Resume = require('../Models/Resume');
const pdfParse = require('pdf-parse');
const { analyzeResumeWithGemini } = require('../services/aiService');
const cloudinary = require('../config/cloudinary');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { targetJobRole } = req.body;
    if (!targetJobRole) {
      return res.status(400).json({ message: 'Target job role is required' });
    }

    const fileUrl = req.file.path; // Cloudinary URL

    // Fetch the PDF from Cloudinary and parse it
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let parsedText = '';
    try {
      const pdfData = await pdfParse(buffer);
      parsedText = pdfData.text;
      
      // 1. Metadata Check (Bulletproof for browser-generated PDFs)
      if (pdfData.info && typeof pdfData.info.Title === 'string' && pdfData.info.Title.includes('ResumeAI')) {
        return res.status(400).json({ message: 'You uploaded an Analysis Report instead of a Resume. Please upload your actual Resume PDF.' });
      }

      // 2. Deep Text Check (Strips ALL whitespace, punctuation, and hidden characters)
      const pureText = parsedText.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (pureText.includes('resumeanalysisreport') || pureText.includes('atsmatchscore')) {
        return res.status(400).json({ message: 'You uploaded an Analysis Report instead of a Resume. Please upload your actual Resume PDF.' });
      }
    } catch (parseError) {
      console.error('PDF parsing error:', parseError);
      return res.status(400).json({ message: 'Failed to parse PDF file. Ensure it is a valid PDF.' });
    }

    // Call Gemini AI
    const analysis = await analyzeResumeWithGemini(parsedText, targetJobRole);

    if (analysis.atsScore === -1) {
      return res.status(400).json({ message: 'You uploaded a generated Analysis Report. Please upload your actual Resume.' });
    }

    // Save to Database
    const newResume = new Resume({
      userId: req.user.id,
      targetJobRole,
      resumeUrl: fileUrl,
      parsedText: parsedText.substring(0, 5000), // Optional: Limit text length in DB
      atsScore: analysis.atsScore,
      aiSuggestions: analysis.aiSuggestions,
      missingKeywords: analysis.missingKeywords || [],
      rewrittenBullets: analysis.rewrittenBullets || []
    });

    await newResume.save();

    res.status(201).json(newResume);
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: `Server error: ${error.message || error.toString()}` });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching history' });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    // Ensure the user owns this resume
    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching resume details' });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    // Ensure the user owns this resume
    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this resume' });
    }

    // Extract Cloudinary public_id from the resumeUrl
    // Example URL: http://res.cloudinary.com/.../resume-analyzer/xkh03pns.pdf
    const urlParts = resume.resumeUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const folder = urlParts[urlParts.length - 2];
    const public_id = `${folder}/${filename}`;

    // Delete the physical file from Cloudinary (using resource_type: raw for PDFs)
    try {
      await cloudinary.uploader.destroy(public_id, { resource_type: 'raw' });
    } catch (cloudinaryErr) {
      console.error('Failed to delete from Cloudinary:', cloudinaryErr);
      // We log the error but still proceed to delete the database record
    }

    // Delete the database record
    await Resume.findByIdAndDelete(req.params.id);

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Server error deleting resume' });
  }
};

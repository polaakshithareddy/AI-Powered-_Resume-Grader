# AI Powered Resume Grader

An enterprise-grade, AI-driven application that analyzes resumes against target job roles, providing instant ATS (Applicant Tracking System) match scores, missing keyword detection, and AI-powered bullet point optimization.

## 🚀 Features

*   **Smart ATS Scoring:** Evaluates your resume against a target job role and generates a precise match score using Google Gemini 2.0.
*   **Bullet Point Auto-Fixer:** Analyzes weak bullet points and generates high-impact, STAR-method optimized alternatives with detailed explanations.
*   **Keyword Extraction:** Identifies critical missing keywords necessary to pass modern ATS filters.
*   **Premium UI/UX:** Built with React, Tailwind CSS, and Framer Motion, featuring a sleek glassmorphism aesthetic and a dynamic Light/Dark mode.
*   **Secure & Intelligent:** Includes robust PDF parsing and AI-powered validation to prevent circular "Analysis Report" uploads.
*   **History Management:** Saves your previous analyses in a cloud database with an easy one-click delete function that automatically cleans up orphaned cloud storage files.

## 🛠️ Technology Stack

*   **Frontend:** React, Vite, Tailwind CSS, React Router, React Hot Toast
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB, Mongoose
*   **AI Engine:** Google Gemini 2.0 Flash
*   **Cloud Storage:** Cloudinary
*   **Parsing:** pdf-parse

## ⚙️ Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/polaakshithareddy/AI-Powered-_Resume-Grader.git
   ```
2. **Install Frontend Dependencies**
   ```bash
   cd Frontend
   npm install
   ```
3. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```
4. **Environment Variables**
   Create a `.env` file in the `Backend` directory with the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
5. **Run the Application**
   *   Start the Backend: `npm start` (inside the Backend folder)
   *   Start the Frontend: `npm run dev` (inside the Frontend folder)

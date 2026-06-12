const { GoogleGenAI } = require('@google/genai');

const analyzeResumeWithGemini = async (parsedText, targetJobRole) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      You are an expert ATS (Applicant Tracking System) and career coach.
      Analyze the following resume text against the target job role: "${targetJobRole}".

      Resume Text:
      ${parsedText}

      CRITICAL RULE: If the text provided appears to be a generated 'Resume Analysis Report' or an 'ATS Match Score' report rather than an actual resume, you MUST return an atsScore of -1 and leave the other fields empty.

      Please provide your analysis strictly in the following JSON format without any markdown blocks or extra text:
      {
        "atsScore": <number between 0 and 100, OR -1 if it is an analysis report instead of a resume>,
        "aiSuggestions": [
          "Suggestion 1",
          "Suggestion 2",
          "Suggestion 3"
        ],
        "missingKeywords": [
          "Keyword 1",
          "Keyword 2",
          "Keyword 3"
        ],
        "rewrittenBullets": [
          {
            "original": "original weak bullet point text exactly as it appears in the resume",
            "rewritten": "the optimized, much stronger version of this bullet point using action verbs and implied metrics",
            "explanation": "why this rewrite is stronger"
          }
        ]
      }
    `;

    let response;
    let retries = 3;
    
    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-lite',
          contents: prompt,
        });
        break; // Success, exit retry loop
      } catch (err) {
        if (retries === 1 || (err.status !== 503 && err.status !== 429)) {
          throw err; // Out of retries or not a transient error
        }
        console.warn(`Gemini API overloaded (status ${err.status}), retrying in 2 seconds...`);
        await new Promise(res => setTimeout(res, 2000));
        retries--;
      }
    }

    // Parse the JSON from Gemini's response
    const jsonString = response.text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error with Gemini API:', error);
    throw new Error('Failed to analyze resume: ' + (error.message || error.toString()));
  }
};

module.exports = { analyzeResumeWithGemini };

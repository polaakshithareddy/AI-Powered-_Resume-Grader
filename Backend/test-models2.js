require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testModels() {
  const modelsToTest = [
    'gemini-2.5-flash-lite',
    'gemini-2.5-pro-exp',
    'gemini-2.5-flash-exp',
    'learnlm-1.5-pro-experimental',
    'gemini-exp-1206'
  ];

  for (const model of modelsToTest) {
    try {
      console.log(`Testing ${model}...`);
      await ai.models.generateContent({ model: model, contents: 'Hi' });
      console.log(`SUCCESS: ${model} is working!`);
    } catch (err) {
      console.log(`FAILED ${model}: ${err.message || err.toString()}`);
    }
  }
}
testModels();

require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testModels() {
  const modelsToTest = [
    'gemini-2.5-flash-8b',
    'gemini-2.5-pro',
    'gemini-2.5-flash',
    'gemini-3.0-flash'
  ];

  for (const model of modelsToTest) {
    try {
      console.log(`Testing ${model}...`);
      const response = await ai.models.generateContent({
        model: model,
        contents: 'Hi'
      });
      console.log(`SUCCESS: ${model} is working!`);
    } catch (err) {
      console.log(`FAILED ${model}: ${err.message || err.toString()}`);
    }
  }
}

testModels();

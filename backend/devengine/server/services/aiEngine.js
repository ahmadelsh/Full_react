const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

/**
 * Ingests a raw database schema and outputs a structured React/Express JSON codebase.
 * @param {string|object} schema - The raw DB schema or JSON
 * @returns {Promise<object>} - The generated code JSON
 */
async function generateApplicationCode(schema, apiKey) {
    if (!apiKey) throw new Error('No Gemini API key provided.');
    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `
You are an expert Principal Full-Stack Architect.
I am providing you with a database schema/JSON data. 
Your task is to generate a fully functioning Web Application structure for this schema.

Here is the schema:
${typeof schema === 'object' ? JSON.stringify(schema, null, 2) : schema}

Output strictly valid JSON with no markdown formatting or extra text. 
The JSON must follow this exact structure:
{
  "serverRoutes": "Code string containing Express.js routes for the schema entities",
  "appJsx": "Code string containing the main App.jsx React component with state and API fetch calls",
  "components": {
    "TableNameView": "Code string for a React component rendering the list view",
    "TableNameForm": "Code string for a React component rendering the creation/edit form"
  }
}
Generate modern React (functional components, hooks, Tailwind CSS classes) and Node.js (ES6+).
Ensure all code is production-ready.
`;

    // List of official Gemini models to try in order of speed and capability
    const modelsToTry = [
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-2.0-flash-lite',
        'gemini-1.5-pro'
    ];

    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`[AI Engine] Attempting generation with model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            
            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.2,
                    responseMimeType: 'application/json',
                }
            });

            const responseText = result.response.text();
            console.log(`[AI Engine] Success with ${modelName}!`);
            
            // Clean markdown code fences if present
            const cleanedText = responseText
                .replace(/^```json\s*/i, '')
                .replace(/^```\s*/i, '')
                .replace(/\s*```$/i, '')
                .trim();

            return JSON.parse(cleanedText);
        } catch (error) {
            console.error(`[AI Engine] Model ${modelName} failed:`, error.message);
            lastError = error;
            // If it's an invalid key, don't keep trying models with the same broken key
            if (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID') || error.message.includes('401')) {
                throw new Error('Your Gemini API key is invalid. Please check your key in settings.');
            }
        }
    }

    throw new Error(lastError?.message || 'Failed to generate code with Gemini. Please try again.');
}

module.exports = { generateApplicationCode };
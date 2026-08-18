const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Ingests a raw database schema and outputs a structured React/Express JSON codebase.
 * @param {string|object} schema - The raw DB schema or JSON
 * @returns {Promise<object>} - The generated code JSON
 */
async function generateApplicationCode(schema) {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.7-flash' });

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

    // Fallback list of models to try if one is experiencing high demand
    const modelsToTry = [
        'gemini-3.7-flash',
        'gemini-3.6-flash',
        'gemini-3.5-flash',
        'gemini-flash-latest',
        'gemini-2.5-flash'
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
            return JSON.parse(responseText);
        } catch (error) {
            console.error(`[AI Engine] Model ${modelName} failed:`, error.message);
            lastError = error;
            // Only retry if it's a 503 Service Unavailable or 429 Too Many Requests
            if (!error.message.includes('503') && !error.message.includes('429')) {
                throw error;
            }
        }
    }

    throw new Error('All Gemini models are currently experiencing high demand. Please try again later.');
}

module.exports = { generateApplicationCode };
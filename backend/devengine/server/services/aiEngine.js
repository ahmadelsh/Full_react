const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

/**
 * Ingests a raw database schema and outputs a structured React/Express JSON codebase.
 * Supports both standard Google AI Studio keys (AIza...) and Google OAuth/Access tokens (AQ...).
 * 
 * @param {string|object} schema - The raw DB schema or JSON
 * @param {string} [apiKey] - Optional custom API key or token
 * @returns {Promise<object>} - The generated code JSON
 */
async function generateApplicationCode(schema, apiKey) {
    const key = (apiKey || process.env.GEMINI_API_KEY || '').trim();
    if (!key) {
        throw new Error('Server Gemini API key is not configured. Please set GEMINI_API_KEY on the backend.');
    }

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

    const modelsToTry = [
        'gemini-1.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-pro',
        'gemini-1.5-pro-latest'
    ];

    let lastError = null;

    // Helper to cleanly parse AI JSON output
    const parseJsonOutput = (text) => {
        const cleaned = (text || '')
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim();
        return JSON.parse(cleaned);
    };

    // If key starts with AQ. or is an OAuth access token, use direct REST API with Bearer Authorization header
    const isOAuthToken = key.startsWith('AQ.') || key.startsWith('ya29.');

    for (const modelName of modelsToTry) {
        try {
            console.log(`[AI Engine] Attempting generation with model: ${modelName} (${isOAuthToken ? 'Bearer OAuth' : 'API Key'})...`);

            if (isOAuthToken) {
                // Direct REST call with Bearer header (for AQ. and OAuth tokens)
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${key}`
                    },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { temperature: 0.2 }
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error?.message || `HTTP ${response.status}: Failed to generate with model ${modelName}`);
                }

                const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!responseText) {
                    throw new Error('Empty response received from Gemini API');
                }

                console.log(`[AI Engine] Success with ${modelName} via Bearer token!`);
                return parseJsonOutput(responseText);

            } else {
                // Standard GoogleGenerativeAI SDK (for AIza... keys)
                const genAI = new GoogleGenerativeAI(key);
                const model = genAI.getGenerativeModel({ model: modelName });
                
                const result = await model.generateContent({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.2 }
                });

                const responseText = result.response.text();
                console.log(`[AI Engine] Success with ${modelName} via GoogleGenerativeAI!`);
                return parseJsonOutput(responseText);
            }

        } catch (error) {
            console.error(`[AI Engine] Model ${modelName} attempt failed:`, error.message);
            lastError = error;
        }
    }

    throw new Error(lastError?.message || 'Failed to generate code with Gemini. Please verify your GEMINI_API_KEY.');
}

module.exports = { generateApplicationCode };
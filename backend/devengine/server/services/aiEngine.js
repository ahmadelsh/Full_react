require('dotenv').config();

/**
 * Ingests a raw database schema and outputs a structured React/Express JSON codebase.
 * Supports all official Google AI Studio keys (AQ... and AIza...).
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
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-2.5-flash',
        'gemini-1.5-pro'
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

    for (const modelName of modelsToTry) {
        try {
            console.log(`[AI Engine] Attempting generation with model: ${modelName}...`);

            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(key)}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': key
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: prompt }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.2
                    }
                })
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMsg = data.error?.message || `HTTP ${response.status}: Failed to generate with model ${modelName}`;
                console.error(`[AI Engine] Model ${modelName} returned error:`, errorMsg);
                throw new Error(errorMsg);
            }

            const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!responseText) {
                throw new Error('Empty response received from Gemini API');
            }

            console.log(`[AI Engine] Success with ${modelName}!`);
            return parseJsonOutput(responseText);

        } catch (error) {
            console.error(`[AI Engine] Model ${modelName} failed:`, error.message);
            lastError = error;
        }
    }

    throw new Error(lastError?.message || 'Failed to generate code with Gemini. Please check your GEMINI_API_KEY.');
}

module.exports = { generateApplicationCode };
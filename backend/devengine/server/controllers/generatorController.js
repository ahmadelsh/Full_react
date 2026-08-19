const { generateApplicationCode } = require('../services/aiEngine');

const generateCode = async (req, res) => {
    const { schema, apiKey } = req.body;

    if (!schema) {
        return res.status(400).json({ error: 'Schema is required' });
    }
    if (!apiKey) {
        return res.status(400).json({ error: 'Gemini API key is required. Please add your key in Settings.' });
    }

    try {
        const generatedCode = await generateApplicationCode(schema, apiKey);
        res.status(200).json({
            message: 'Code generated successfully',
            data: generatedCode
        });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal server error during generation' });
    }
};

module.exports = { generateCode };
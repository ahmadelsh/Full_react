const { generateApplicationCode } = require('../services/aiEngine');

const generateCode = async (req, res) => {
    const { schema, apiKey } = req.body;

    if (!schema) {
        return res.status(400).json({ error: 'Schema is required' });
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
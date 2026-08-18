const supabase = require('../config/supabase');

const register = async (req, res) => {
    const { email, password, username } = req.body;
    try {
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { username }
        });

        if (error) throw error;

        // Create profile
        const { error: profileError } = await supabase.from('profiles').insert([
            { id: data.user.id, username }
        ]);

        if (profileError) throw profileError;

        res.status(201).json({ message: 'User registered successfully', user: data.user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        res.status(200).json({ session: data.session, user: data.user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

module.exports = { register, login };
const supabase = require('../config/supabase');

const saveProject = async (req, res) => {
    const { user_id, title, description, raw_schema_json, generated_code_json, is_published } = req.body;
    console.log('saveProject received body:', req.body);

    try {
        const { data, error } = await supabase
            .from('projects')
            .insert([{ user_id, title, description, raw_schema_json, generated_code_json, is_published }])
            .select()
            .single();

        if (error) {
            console.error('saveProject database error:', error);
            throw error;
        }
        res.status(201).json({ message: 'Project saved', project: data });
    } catch (error) {
        console.error('saveProject catch error:', error);
        res.status(400).json({ error: error.message });
    }
};

const getProjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('projects')
            .select(`*, profiles(username, avatar_url)`)
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Project not found' });

        res.status(200).json({ project: data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getPublicProjects = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select(`id, title, description, created_at, is_published, profiles(username, avatar_url)`)
            .eq('is_published', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json({ projects: data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getMyProjects = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) {
            return res.status(401).json({ error: authError?.message || 'Invalid token' });
        }

        const { data, error } = await supabase
            .from('projects')
            .select(`id, title, description, created_at, is_published, profiles(username, avatar_url)`)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json({ projects: data });
    } catch (error) {
        console.error('getMyProjects error:', error);
        res.status(400).json({ error: error.message });
    }
};

module.exports = { saveProject, getProjectById, getPublicProjects, getMyProjects };
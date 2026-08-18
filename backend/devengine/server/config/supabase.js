const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

// Using service role key for backend operations to bypass RLS when necessary, 
// though we will validate tokens via middleware for user-specific actions.
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
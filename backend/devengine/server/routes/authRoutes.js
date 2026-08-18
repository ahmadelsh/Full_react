const express = require('express');
const { register, login } = require('../controllers/authController');
const supabase = require('../config/supabase');
const router = express.Router();


// Express Backend Route Example
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    try {
        const { data, error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
                shouldCreateUser: true, // Creates the user profile if they are new
            },
        });

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        return res.status(200).json({ message: 'Verification code sent successfully', data });
    } catch (err) {
        return res.status(500).json({ message: 'Server error sending verification code' });
    }
});

router.post('/verify-otp', async (req, res) => {
    const { email, token } = req.body;
    try {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email',
        });
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(200).json({ message: 'Verified successfully', data });
    } catch (err) {
        return res.status(500).json({ message: 'Server error verifying code' });
    }
});

router.post('/set-password', async (req, res) => {
    const { email, password, username } = req.body;
    try {
        // Use the admin API to find the user by email
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;
        
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updateParams = { password: password };
        if (username) {
            updateParams.user_metadata = { username };
        }

        // Update the user's password and metadata
        const { error } = await supabase.auth.admin.updateUserById(
            user.id,
            updateParams
        );
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        // Create profile if username is provided
        if (username) {
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .maybeSingle();

            if (!existingProfile) {
                const { error: profileError } = await supabase.from('profiles').insert([
                    { id: user.id, username }
                ]);
                if (profileError) {
                    console.error('Error creating profile in set-password:', profileError);
                }
            }
        }

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error setting password' });
    }
});

router.post('/register', register);
router.post('/login', login);

router.get('/me', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            console.error('getUser error:', error);
            return res.status(401).json({ error: error?.message || 'Invalid token' });
        }
        
        return res.status(200).json({ user });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
});

router.put('/update-profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const { username, password } = req.body;
    
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) {
            return res.status(401).json({ error: authError?.message || 'Invalid token' });
        }
        
        const updateData = {};
        if (username) {
            updateData.data = { username };
        }
        if (password) {
            updateData.password = password;
        }
        
        if (username || password) {
            const { data: updatedUser, error: updateError } = await supabase.auth.updateUser(updateData);
            if (updateError) {
                return res.status(400).json({ error: updateError.message });
            }
        }
        
        if (username) {
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({ id: user.id, username });
                
            if (profileError) throw profileError;
        }
        
        return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Update profile error:', err);
        return res.status(500).json({ error: err.message || 'Server error' });
    }
});

module.exports = router;
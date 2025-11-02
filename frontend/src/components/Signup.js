// frontend/src/components/Signup.js
import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Box, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { apiPost } from '../api';

export default function Signup({ onClose }) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState(''); // email
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [err, setErr] = useState('');
    const [success, setSuccess] = useState('');

    async function submit(e) {
        e.preventDefault();
        setErr('');
        setSuccess('');
        try {
            const res = await apiPost('/auth/signup', { name, username, password, role });
            const data = await res.json();
            if(!res.ok) return setErr(data.error || 'Signup failed');
            setSuccess('Account created and email sent (if email configured).');
            setTimeout(() => {
                onClose && onClose();
            }, 1400);
        } catch (e) {
            setErr('Server error');
        }
    }

    return (
        <Box sx={{ maxWidth: 520, mx: 'auto', mt: 4 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h6">Sign Up</Typography>
                <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>Create an account to get started</Typography>

                <Box component="form" onSubmit={submit}>
                    <TextField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="dense" />
                    <TextField label="Email" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth margin="dense" />
                    <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="dense" />
                    <Typography sx={{ mt: 1 }}>Role</Typography>
                    <RadioGroup value={role} onChange={(e) => setRole(e.target.value)}>
                        <FormControlLabel value="student" control={<Radio />} label="Student" />
                        <FormControlLabel value="staff" control={<Radio />} label="Staff/Teacher" />
                    </RadioGroup>

                    {err && <Typography color="error">{err}</Typography>}
                    {success && <Typography color="success.main">{success}</Typography>}

                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, bgcolor: '#050014', py: 1.5 }}>
                        Create Account
                    </Button>
                </Box>

                <Typography align="center" sx={{ mt: 2 }}>
                    Already have an account? <Button variant="text" onClick={onClose}>Sign in</Button>
                </Typography>
            </Paper>
        </Box>
    );
}

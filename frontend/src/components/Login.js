// frontend/src/components/Login.js
import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Box, Stack } from '@mui/material';
import { apiPost } from '../api';

export default function Login({ onLogin, openSignup }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');

    const demoAccounts = {
        admin: { username: 'admin', password: 'admin123' },
        student: { username: 'student1', password: 'student123' },
        staff: { username: 'staff', password: 'staff123' },
    };

    function fillDemo(role) {
        setUsername(demoAccounts[role].username);
        setPassword(demoAccounts[role].password);
    }

    async function submit(e) {
        e.preventDefault();
        setErr('');
        try {
            const res = await apiPost('/auth/login', { username, password });
            const data = await res.json();
            if (!res.ok) return setErr(data.error || 'Login failed');
            onLogin(data.token, data.user);
        } catch (e) {
            setErr('Server error');
        }
    }

    return (
        <Box sx={{ maxWidth: 520, mx: 'auto', mt: 6 }}>
            <Typography variant="h4" align="center" gutterBottom>School Equipment Portal</Typography>
            <Typography align="center" color="text.secondary" sx={{ mb: 3 }}>
                Manage and track equipment lending efficiently
            </Typography>

            <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>Login</Typography>
                <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                    Sign in to access the equipment lending portal
                </Typography>

                <Box component="form" onSubmit={submit}>
                    <Typography variant="subtitle2">Email</Typography>
                    <TextField value={username} onChange={(e) => setUsername(e.target.value)} fullWidth margin="dense" />
                    <Typography variant="subtitle2" sx={{ mt: 2 }}>Password</Typography>
                    <TextField type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="dense" />

                    {err && <Typography color="error" sx={{ mt: 1 }}>{err}</Typography>}

                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, bgcolor: '#050014', py: 1.5 }}>
                        Sign In
                    </Button>
                </Box>

                <Typography align="center" sx={{ mt: 2, mb: 1 }}>Demo Accounts:</Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button variant="outlined" onClick={() => fillDemo('admin')}>Admin</Button>
                    <Button variant="outlined" onClick={() => fillDemo('student')}>Student</Button>
                    <Button variant="outlined" onClick={() => fillDemo('staff')}>Staff</Button>
                </Stack>

                <Typography align="center" sx={{ mt: 3 }}>
                    Don't have an account? <Button variant="text" onClick={openSignup}>Sign up</Button>
                </Typography>
            </Paper>
        </Box>
    );
}
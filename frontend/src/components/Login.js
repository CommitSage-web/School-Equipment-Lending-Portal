// frontend/src/components/Login.js
import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Box } from '@mui/material';
import { apiPost } from '../api';

export default function Login({ onLogin }){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');

    async function submit(e){
        e.preventDefault();
        setErr('');
        try{
            const res = await apiPost('/auth/login', { username, password });
            const data = await res.json();
            if(!res.ok) return setErr(data.error || 'Login failed');
            onLogin(data.token, data.user);
        }catch(e){
            setErr('Server error');
        }
    }

    return (
        <Paper elevation={6} sx={{ p:4, maxWidth:480, mx:'auto', mt:6 }}>
            <Typography variant="h5" gutterBottom>Sign in</Typography>
            <Box component="form" onSubmit={submit}>
                <TextField label="Username" fullWidth margin="normal" value={username} onChange={e=>setUsername(e.target.value)} />
                <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e=>setPassword(e.target.value)} />
                {err && <Typography color="error">{err}</Typography>}
                <Button type="submit" variant="contained" fullWidth sx={{ mt:2 }}>Login</Button>
                <Typography variant="caption" display="block" sx={{ mt:1 }}>
                    Use admin/admin123, staff/staff123, student1/student123
                </Typography>
            </Box>
        </Paper>
    );
}

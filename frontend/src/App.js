import React, { useState, useEffect } from 'react';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Container, Paper, TextField } from '@mui/material';

export default function App(){
  const [user, setUser] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function login(e){
    e.preventDefault();
    const res = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if(res.ok) setUser(data.user); else alert(data.error);
  }

  async function loadEquipment(){
    const res = await fetch('http://localhost:4000/api/equipment');
    const data = await res.json();
    setEquipment(data);
  }

  useEffect(()=>{ if(user) loadEquipment(); }, [user]);

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow:1 }}>Equipment Lending Portal</Typography>
          {user && <Button color="inherit" onClick={()=>setUser(null)}>Logout</Button>}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt:4 }}>
        {!user ? (
          <Paper sx={{ p:3, maxWidth:400, mx:'auto' }}>
            <form onSubmit={login}>
              <TextField label="Username" fullWidth margin="normal" value={username} onChange={e=>setUsername(e.target.value)} />
              <TextField label="Password" fullWidth type="password" margin="normal" value={password} onChange={e=>setPassword(e.target.value)} />
              <Button type="submit" variant="contained" fullWidth>Login</Button>
            </form>
          </Paper>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>Welcome {user.name}</Typography>
            {equipment.map(eq => (
              <Paper key={eq.id} sx={{ p:2, mb:2 }}>
                <Typography variant="h6">{eq.name}</Typography>
                <Typography>Available: {eq.available} / {eq.quantity}</Typography>
                <Typography variant="body2">{eq.description}</Typography>
              </Paper>
            ))}
          </>
        )}
      </Container>
    </>
  );
}

// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App(){
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(()=> {
    setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    setToken(localStorage.getItem('token'));
  }, []);

  function onLogin(token, user){
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setToken(token);
  }
  function onLogout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  }

  return (
      <>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Equipment Lending Portal</Typography>
            {user ? <Typography sx={{ mr: 2 }}>{user.name} ({user.role})</Typography> : null}
            {user ? <Button color="inherit" onClick={onLogout}>Logout</Button> : null}
          </Toolbar>
        </AppBar>
        <Container sx={{ mt:4 }}>
          {!user ? <Login onLogin={onLogin} /> : <Dashboard user={user} token={token} />}
        </Container>
      </>
  );
}

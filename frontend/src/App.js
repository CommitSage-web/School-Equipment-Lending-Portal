// // frontend/src/App.js
// import React, { useState, useEffect } from 'react';
// import { CssBaseline, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
// import Login from './components/Login';
// import Dashboard from './components/Dashboard';

// export default function App(){
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
//   const [token, setToken] = useState(localStorage.getItem('token'));

//   useEffect(()=> {
//     setUser(JSON.parse(localStorage.getItem('user') || 'null'));
//     setToken(localStorage.getItem('token'));
//   }, []);

//   function onLogin(token, user){
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(user));
//     setUser(user);
//     setToken(token);
//   }
//   function onLogout(){
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//     setToken(null);
//   }

//   return (
//       <>
//         <CssBaseline />
//         <AppBar position="static">
//           <Toolbar>
//             <Typography variant="h6" sx={{ flexGrow: 1 }}>Equipment Lending Portal</Typography>
//             {user ? <Typography sx={{ mr: 2 }}>{user.name} ({user.role})</Typography> : null}
//             {user ? <Button color="inherit" onClick={onLogout}>Logout</Button> : null}
//           </Toolbar>
//         </AppBar>
//         <Container sx={{ mt:4 }}>
//           {!user ? <Login onLogin={onLogin} /> : <Dashboard user={user} token={token} />}
//         </Container>
//       </>
//   );
// }
// frontend/src/App.js
import React, { useState, useEffect } from "react";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Person as PersonIcon,
  Inventory2 as InventoryIcon,
} from "@mui/icons-material";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || "null"));
    setToken(localStorage.getItem("token"));
  }, []);

  function onLogin(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setToken(token);
  }

  function onLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  }

  return (
    <>
      <CssBaseline />
      <AppBar
        position="static"
        elevation={3}
        sx={{
          background:
            "linear-gradient(90deg, rgba(118,174,241,1) 0%, rgba(128,208,199,1) 100%)",
          backdropFilter: "blur(10px)",
          color: "#000",
        }}
      >
        <Toolbar>
          {/* App Icon & Title */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              gap: 1,
            }}
          >
            <InventoryIcon sx={{ fontSize: 28, color: "#0f172a" }} />
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                letterSpacing: "0.5px",
                color: "#0f172a",
              }}
            >
              Equipment Lending Portal
            </Typography>
          </Box>

          {/* User Info */}
          {user && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mr: 2,
                gap: 0.5,
                color: "#0f172a",
              }}
            >
              <PersonIcon sx={{ fontSize: 22 }} />
              <Typography
                sx={{
                  fontWeight: 500,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {user.name} ({user.role})
              </Typography>
            </Box>
          )}

          {/* Logout Button */}
          {user && (
            <Button
              color="inherit"
              onClick={onLogout}
              startIcon={<LogoutIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "10px",
                px: 2.5,
                color: "#0f172a",
                fontFamily: "'Poppins', sans-serif",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                },
              }}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 4, mb: 6 }}>
        {!user ? (
          <Login onLogin={onLogin} />
        ) : (
          <Dashboard user={user} token={token} />
        )}
      </Container>
    </>
  );
}


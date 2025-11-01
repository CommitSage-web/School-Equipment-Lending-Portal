// // frontend/src/components/Login.js
// import React, { useState } from 'react';
// import { Paper, TextField, Button, Typography, Box } from '@mui/material';
// import { apiPost } from '../api';

// export default function Login({ onLogin }){
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [err, setErr] = useState('');

//     async function submit(e){
//         e.preventDefault();
//         setErr('');
//         try{
//             const res = await apiPost('/auth/login', { username, password });
//             const data = await res.json();
//             if(!res.ok) return setErr(data.error || 'Login failed');
//             onLogin(data.token, data.user);
//         }catch(e){
//             setErr('Server error');
//         }
//     }

//     return (
//         <Paper elevation={6} sx={{ p:4, maxWidth:480, mx:'auto', mt:6 }}>
//             <Typography variant="h5" gutterBottom>Sign in</Typography>
//             <Box component="form" onSubmit={submit}>
//                 <TextField label="Username" fullWidth margin="normal" value={username} onChange={e=>setUsername(e.target.value)} />
//                 <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e=>setPassword(e.target.value)} />
//                 {err && <Typography color="error">{err}</Typography>}
//                 <Button type="submit" variant="contained" fullWidth sx={{ mt:2 }}>Login</Button>
//                 <Typography variant="caption" display="block" sx={{ mt:1 }}>
//                     Use admin/admin123, staff/staff123, student1/student123
//                 </Typography>
//             </Box>
//         </Paper>
//     );
// }
import React, { useState } from "react";
import { Paper, Typography, Box, TextField, Button } from "@mui/material";
import { motion } from "framer-motion";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (
      (username === "admin" && password === "admin123") ||
      (username === "staff" && password === "staff123") ||
      (username === "student1" && password === "student123")
    ) {
      const role =
        username === "admin"
          ? "Admin"
          : username === "staff"
          ? "Staff"
          : "Student";
      onLogin("fake-token-123", { name: username, role });
    } else {
      setErr("Invalid username or password");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 380,
          borderRadius: "20px",
          textAlign: "center",
          backdropFilter: "blur(18px)",
          backgroundColor: "rgba(255,255,255,0.4)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: "black",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Welcome 👋
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: "black",
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Please enter your credentials
        </Typography>

        <Box component="form" onSubmit={submit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "rgba(255,255,255,0.85)",
              },
            }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "rgba(255,255,255,0.85)",
              },
            }}
          />

          {err && (
            <Typography color="error" sx={{ mt: 1, fontWeight: 500 }}>
              {err}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.2,
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              color: "black",
              letterSpacing: "0.3px",
              background: "linear-gradient(90deg, #74EBD5 0%, #9FACE6 100%)",
              boxShadow: "0 6px 20px rgba(148,187,233,0.3)",
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 10px 25px rgba(148,187,233,0.4)",
              },
            }}
          >
            Login
          </Button>

          <Typography
            variant="caption"
            display="block"
            sx={{
              mt: 2,
              color: "black",
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Use <b>admin/admin123</b>, <b>staff/staff123</b>, or{" "}
            <b>student1/student123</b>
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
}

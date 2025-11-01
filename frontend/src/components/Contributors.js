// // frontend/src/components/Contributors.js
// import React, { useEffect, useState } from 'react';
// import { apiGet, apiPut } from '../api';
// import { Grid, Card, CardContent, Typography, TextField, Button } from '@mui/material';

// export default function Contributors({ token, user }){
//     const [list, setList] = useState([]);

//     async function load(){
//         const res = await apiGet('/contributors', token);
//         const data = await res.json();
//         setList(data);
//     }
//     useEffect(()=> { load(); }, []);

//     function change(idx, key, value){
//         const copy = [...list];
//         copy[idx][key] = value;
//         setList(copy);
//     }
//     async function save(){
//         await apiPut('/contributors', list, token);
//         alert('Saved');
//         load();
//     }

//     return (
//         <>
//             <Typography variant="h6" gutterBottom>Contributors</Typography>
//             <Grid container spacing={2}>
//                 {list.map((c, idx) => (
//                     <Grid item xs={12} md={6} key={idx}>
//                         <Card>
//                             <CardContent>
//                                 <TextField fullWidth label="Name" value={c.name} onChange={e=>change(idx,'name',e.target.value)} margin="dense" />
//                                 <TextField fullWidth label="Roll" value={c.roll} onChange={e=>change(idx,'roll',e.target.value)} margin="dense" />
//                                 <TextField fullWidth label="Contribution" value={c.contribution} onChange={e=>change(idx,'contribution',e.target.value)} margin="dense" />
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 ))}
//             </Grid>
//             { (user.role === 'admin' || user.role === 'staff') && <Button variant="contained" sx={{ mt:2 }} onClick={save}>Save Contributors</Button> }
//         </>
//     );
// }
// frontend/src/components/Contributors.js
import React, { useEffect, useState } from "react";
import { apiGet, apiPut } from "../api";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";

export default function Contributors({ token, user }) {
  const [list, setList] = useState([]);

  async function load() {
    try {
      const res = await apiGet("/contributors", token);
      const data = await res.json();
      if (Array.isArray(data)) setList(data);
      else setList([]);
    } catch (err) {
      console.error("Error loading contributors:", err);
      setList([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function change(idx, key, value) {
    const copy = [...list];
    copy[idx][key] = value;
    setList(copy);
  }

  async function save() {
    try {
      await apiPut("/contributors", list, token);
      alert("Contributors saved successfully!");
      load();
    } catch (err) {
      alert("Failed to save contributors.");
      console.error(err);
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 700,
          color: "#1e40af",
          textAlign: "center",
          letterSpacing: 0.5,
        }}
      >
        Contributors
      </Typography>

      {list.length === 0 ? (
        <Typography
          align="center"
          sx={{
            color: "#64748b",
            fontWeight: 500,
            mt: 4,
            fontSize: "1rem",
          }}
        >
          No contributors available.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {list.map((c, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
              >
                <Card
                  elevation={3}
                  sx={{
                    backdropFilter: "blur(6px)",
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.8), rgba(240,249,255,0.9))",
                    borderRadius: 3,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 8px 28px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent>
                    <TextField
                      fullWidth
                      label="Name"
                      value={c.name}
                      onChange={(e) => change(idx, "name", e.target.value)}
                      margin="dense"
                      sx={{
                        "& .MuiInputLabel-root": { color: "#334155" },
                        "& .MuiInputBase-input": {
                          color: "#0f172a",
                          fontWeight: 500,
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Roll Number"
                      value={c.roll}
                      onChange={(e) => change(idx, "roll", e.target.value)}
                      margin="dense"
                      sx={{
                        "& .MuiInputLabel-root": { color: "#334155" },
                        "& .MuiInputBase-input": {
                          color: "#0f172a",
                          fontWeight: 500,
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Contribution"
                      value={c.contribution}
                      onChange={(e) =>
                        change(idx, "contribution", e.target.value)
                      }
                      margin="dense"
                      multiline
                      minRows={2}
                      sx={{
                        "& .MuiInputLabel-root": { color: "#334155" },
                        "& .MuiInputBase-input": {
                          color: "#0f172a",
                          fontWeight: 500,
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {(user.role === "admin" || user.role === "staff") && (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            onClick={save}
            sx={{
              textTransform: "none",
              px: 4,
              py: 1.2,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: "0.95rem",
              background:
                "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)",
              "&:hover": {
                background:
                  "linear-gradient(90deg, #1d4ed8 0%, #1e3a8a 100%)",
              },
              boxShadow: "0 6px 16px rgba(37, 99, 235, 0.25)",
            }}
          >
            Save Contributors
          </Button>
        </Box>
      )}
    </Box>
  );
}

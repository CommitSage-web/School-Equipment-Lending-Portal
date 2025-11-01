// // frontend/src/components/RequestsPanel.js
// import React, { useEffect, useState } from 'react';
// import { apiGet, apiPut } from '../api';
// import { Card, CardContent, Typography, Button, Grid } from '@mui/material';

// export default function RequestsPanel({ token, user }){
//     const [items, setItems] = useState([]);

//     async function load(){
//         const res = await apiGet('/requests', token);
//         const data = await res.json();
//         setItems(data);
//     }
//     useEffect(()=> { load(); }, []);

//     async function approve(id){
//         const res = await apiPut(`/requests/${id}/approve`, {}, token);
//         if(res.ok) load();
//     }
//     async function reject(id){
//         const res = await apiPut(`/requests/${id}/reject`, {}, token);
//         if(res.ok) load();
//     }
//     async function markReturn(id){
//         const res = await apiPut(`/requests/${id}/return`, {}, token);
//         if(res.ok) load();
//     }

//     if(items.length===0) return <Typography>No requests found.</Typography>;

//     return (
//         <Grid container spacing={2}>
//             {items.map(r => (
//                 <Grid item xs={12} md={6} key={r.id}>
//                     <Card>
//                         <CardContent>
//                             <Typography><strong>#{r.id}</strong> — {r.equipment_name || ('Equipment '+r.equipment_id)}</Typography>
//                             <Typography>Requested by: {r.user_name || r.username || r.user_id}</Typography>
//                             <Typography>Quantity: {r.quantity}</Typography>
//                             <Typography>Status: {r.status}</Typography>
//                             <Typography>From: {r.borrow_from} To: {r.borrow_to}</Typography>
//                             <div style={{ marginTop:8 }}>
//                                 { (user.role === 'admin' || user.role === 'staff') && r.status === 'pending' && <>
//                                     <Button size="small" onClick={()=>approve(r.id)}>Approve</Button>
//                                     <Button size="small" onClick={()=>reject(r.id)}>Reject</Button>
//                                 </>}
//                                 { r.status === 'approved' && user.role !== 'student' && <Button size="small" onClick={()=>markReturn(r.id)}>Mark Returned</Button> }
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             ))}
//         </Grid>
//     );
// }
// frontend/src/components/RequestsPanel.js
import React, { useEffect, useState } from "react";
import { apiGet, apiPut } from "../api";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Chip,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";

export default function RequestsPanel({ token, user }) {
  const [items, setItems] = useState(null);

  async function load() {
    try {
      const res = await apiGet("/requests", token);
      const data = await res.json();

      if (!res.ok) {
        console.error("API error:", data);
        setItems([]);
        return;
      }

      setItems(Array.isArray(data) ? data : data.requests || []);
    } catch (e) {
      console.error("Error loading requests:", e);
      setItems([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id) {
    const res = await apiPut(`/requests/${id}/approve`, {}, token);
    if (res.ok) load();
  }
  async function reject(id) {
    const res = await apiPut(`/requests/${id}/reject`, {}, token);
    if (res.ok) load();
  }
  async function markReturn(id) {
    const res = await apiPut(`/requests/${id}/return`, {}, token);
    if (res.ok) load();
  }

  if (items === null)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress color="primary" />
      </Box>
    );

  if (!Array.isArray(items) || items.length === 0)
    return (
      <Typography
        align="center"
        sx={{ mt: 6, color: "text.secondary", fontWeight: 500 }}
      >
        No requests found.
      </Typography>
    );

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "returned":
        return "info";
      default:
        return "warning";
    }
  };

  return (
    <Box
      sx={{
        mt: 4,
        px: { xs: 2, sm: 4 },
        py: 2,
      }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{
          mb: 4,
          fontWeight: 600,
          letterSpacing: "0.5px",
          color: "#334155",
        }}
      >
        Equipment Requests
      </Typography>

      <Grid container spacing={3}>
        {items.map((r, index) => (
          <Grid item xs={12} md={6} key={r.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                sx={{
                  borderRadius: 4,
                  backdropFilter: "blur(10px)",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,245,255,0.9))",
                  boxShadow:
                    "0 4px 20px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)",
                  transition: "0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow:
                      "0 6px 25px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "#1e293b" }}
                    >
                      #{r.id} &nbsp; {r.equipment_name || `Equipment ${r.equipment_id}`}
                    </Typography>
                    <Chip
                      label={r.status.toUpperCase()}
                      color={getStatusColor(r.status)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ color: "#475569", mb: 0.5 }}
                  >
                    <strong>Requested by:</strong> {r.user_name || r.username}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#475569", mb: 0.5 }}
                  >
                    <strong>Quantity:</strong> {r.quantity}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#475569", mb: 0.5 }}
                  >
                    <strong>From:</strong> {r.borrow_from} &nbsp; <strong>To:</strong>{" "}
                    {r.borrow_to}
                  </Typography>

                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      gap: 1.5,
                      flexWrap: "wrap",
                      justifyContent: "flex-end",
                    }}
                  >
                    {(user.role === "admin" || user.role === "staff") &&
                      r.status === "pending" && (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            sx={{
                              background: "linear-gradient(90deg,#4ade80,#22c55e)",
                              color: "white",
                              fontWeight: 600,
                              textTransform: "none",
                              "&:hover": {
                                background:
                                  "linear-gradient(90deg,#22c55e,#16a34a)",
                              },
                            }}
                            onClick={() => approve(r.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            sx={{
                              borderWidth: 1.5,
                              fontWeight: 600,
                              textTransform: "none",
                            }}
                            onClick={() => reject(r.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}

                    {r.status === "approved" && user.role !== "student" && (
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          background: "linear-gradient(90deg,#60a5fa,#3b82f6)",
                          color: "white",
                          fontWeight: 600,
                          textTransform: "none",
                          "&:hover": {
                            background:
                              "linear-gradient(90deg,#3b82f6,#2563eb)",
                          },
                        }}
                        onClick={() => markReturn(r.id)}
                      >
                        Mark Returned
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

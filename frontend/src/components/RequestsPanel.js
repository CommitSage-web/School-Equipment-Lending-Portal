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
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";
import { Check, X, RotateCcw } from "lucide-react";
import { apiGet, apiPut } from "../api";

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
        <CircularProgress />
      </Box>
    );

  const stats = {
    pending: items.filter((i) => i.status === "pending").length,
    active: items.filter((i) => i.status === "approved").length,
    returned: items.filter((i) => i.status === "returned").length,
    overdue: items.filter((i) => i.status === "overdue").length,
  };

  const statusStyles = {
    pending: { color: "#334155", bg: "#f1f5f9" },
    approved: { color: "#fff", bg: "#000" },
    returned: { color: "#334155", bg: "#f1f5f9" },
    overdue: { color: "#b91c1c", bg: "#fee2e2" },
  };

  return (
    <Box sx={{ p: 3, mt: 2 }}>
      {/* Header */}
      <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f172a", mb: 3 }}>
        Requests Management
      </Typography>
      <Typography sx={{ color: "#475569", mb: 3 }}>
        Approve, track, and manage borrowing requests
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: "Pending", value: stats.pending },
          { label: "Active", value: stats.active },
          { label: "Returned", value: stats.returned },
          { label: "Overdue", value: stats.overdue },
        ].map((stat, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                boxShadow: "none",
              }}
            >
              <CardContent>
                <Typography
                  variant="body2"
                  sx={{ color: "#475569", fontWeight: 600 }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "#0f172a", fontWeight: 700 }}
                >
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* All Requests Table */}
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          boxShadow: "none",
        }}
      >
        <CardContent>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "#0f172a", mb: 0.5 }}
          >
            All Requests
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#64748b", mb: 2 }}
          >
            View and manage all borrowing requests
          </Typography>

          {/* Search + Filter */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 2,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TextField
              placeholder="Search by user or equipment..."
              size="small"
              fullWidth
              sx={{
                backgroundColor: "#f9fafb",
                borderRadius: 2,
              }}
            />
            <Select
              size="small"
              defaultValue=""
              displayEmpty
              sx={{ backgroundColor: "#f9fafb", borderRadius: 2, minWidth: 160 }}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Active</MenuItem>
              <MenuItem value="returned">Returned</MenuItem>
              <MenuItem value="overdue">Overdue</MenuItem>
            </Select>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                  <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Equipment</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500 }}>
                        {r.user_name || r.username}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        {r.role || "student"}
                      </Typography>
                    </TableCell>
                    <TableCell>{r.equipment_name}</TableCell>
                    <TableCell>{r.quantity}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: "0.85rem" }}>
                        {r.borrow_from}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#64748b", fontSize: "0.75rem" }}
                      >
                        to {r.borrow_to}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={r.status}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          color: statusStyles[r.status]?.color,
                          backgroundColor: statusStyles[r.status]?.bg,
                          textTransform: "lowercase",
                          px: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1.5 }}>
                        {r.status === "pending" && (
                          <>
                            <IconButton
                              size="small"
                              onClick={() => approve(r.id)}
                              sx={{ color: "#111" }}
                            >
                              <Check size={16} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => reject(r.id)}
                              sx={{ color: "#dc2626" }}
                            >
                              <X size={16} />
                            </IconButton>
                          </>
                        )}
                        {r.status === "approved" && (
                          <IconButton
                            size="small"
                            onClick={() => markReturn(r.id)}
                            sx={{ color: "#111" }}
                          >
                            <RotateCcw size={16} />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}


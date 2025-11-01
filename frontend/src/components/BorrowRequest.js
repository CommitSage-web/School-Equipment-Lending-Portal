// // frontend/src/components/BorrowRequest.js
// import React, { useState } from 'react';
// import { Paper, TextField, Button } from '@mui/material';
// import { apiPost } from '../api';

// export default function BorrowRequest({ equipment, token, user, onDone }){
//     const [quantity, setQuantity] = useState(1);
//     const [from, setFrom] = useState('');
//     const [to, setTo] = useState('');
//     const [notes, setNotes] = useState('');

//     async function submit(e){
//         e.preventDefault();
//         if(quantity < 1) return alert('Quantity at least 1');
//         if(quantity > equipment.available) return alert('Not enough available');
//         const res = await apiPost('/requests', {
//             equipment_id: equipment.id,
//             quantity,
//             borrow_from: from,
//             borrow_to: to,
//             notes
//         }, token);
//         if(res.ok){
//             alert('Request submitted');
//             onDone && onDone();
//         } else {
//             const d = await res.json();
//             alert(d.error || 'Failed');
//         }
//     }

//     return (
//         <Paper elevation={0} sx={{ p:2, mt:2 }}>
//             <form onSubmit={submit}>
//                 <TextField label="Quantity" type="number" value={quantity} onChange={e=>setQuantity(Number(e.target.value))} margin="dense" fullWidth />
//                 <TextField label="From (YYYY-MM-DD)" value={from} onChange={e=>setFrom(e.target.value)} margin="dense" fullWidth />
//                 <TextField label="To (YYYY-MM-DD)" value={to} onChange={e=>setTo(e.target.value)} margin="dense" fullWidth />
//                 <TextField label="Notes" value={notes} onChange={e=>setNotes(e.target.value)} margin="dense" fullWidth />
//                 <Button type="submit" variant="contained" sx={{ mt:1 }}>Request</Button>
//             </form>
//         </Paper>
//     );
// }
// frontend/src/components/BorrowRequest.js
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { apiPost } from "../api";
import { motion } from "framer-motion";

export default function BorrowRequest({ equipment, token, user, onDone }) {
  const [quantity, setQuantity] = useState(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [notes, setNotes] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (quantity < 1) return alert("Quantity must be at least 1.");
    if (quantity > equipment.available)
      return alert("Not enough equipment available.");

    const res = await apiPost(
      "/requests",
      {
        equipment_id: equipment.id,
        quantity,
        borrow_from: from,
        borrow_to: to,
        notes,
      },
      token
    );

    if (res.ok) {
      alert("Request submitted successfully!");
      onDone && onDone();
    } else {
      const d = await res.json();
      alert(d.error || "Request failed.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          backdropFilter: "blur(8px)",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.8), rgba(240,249,255,0.85))",
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#1e40af",
            mb: 2,
            textAlign: "center",
            letterSpacing: 0.4,
          }}
        >
          Borrow This Equipment
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box
          component="form"
          onSubmit={submit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            fullWidth
            variant="outlined"
            InputLabelProps={{ style: { color: "#334155" } }}
            inputProps={{ min: 1 }}
          />

          <TextField
            label="From Date"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
              style: { color: "#334155" },
            }}
          />

          <TextField
            label="To Date"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
              style: { color: "#334155" },
            }}
          />

          <TextField
            label="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            minRows={2}
            fullWidth
            variant="outlined"
            InputLabelProps={{ style: { color: "#334155" } }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              mt: 1,
              py: 1.2,
              borderRadius: 2,
              background:
                "linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)",
              "&:hover": {
                background:
                  "linear-gradient(90deg, #1d4ed8 0%, #1e40af 100%)",
              },
              boxShadow: "0 6px 14px rgba(37,99,235,0.25)",
            }}
          >
            Submit Request
          </Button>
        </Box>
      </Paper>
    </motion.div>
  );
}

// // frontend/src/components/EquipmentDetail.js
// import React from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
// import BorrowRequest from './BorrowRequest';

// export default function EquipmentDetail({ item, onClose, token, user }){
//     if(!item) return null;
//     return (
//         <Dialog open={true} onClose={onClose} fullWidth>
//             <DialogTitle>{item.name}</DialogTitle>
//             <DialogContent>
//                 <Typography>Category: {item.category}</Typography>
//                 <Typography>Condition: {item.condition}</Typography>
//                 <Typography>Available: {item.available} / {item.quantity}</Typography>
//                 <Typography sx={{ mt:2 }}>{item.description}</Typography>
//                 {user.role === 'student' && <BorrowRequest equipment={item} token={token} user={user} onDone={onClose} />}
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={onClose}>Close</Button>
//             </DialogActions>
//         </Dialog>
//     );
// }
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function EquipmentDetail({ item, onClose, token, user }) {
  const [quantity, setQuantity] = React.useState(1);
  const [start, setStart] = React.useState("");
  const [end, setEnd] = React.useState("");
  const [notes, setNotes] = React.useState("");

  if (!item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Request submitted successfully!");
    onClose();
  };

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, scale: 0.95, y: 30 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { duration: 0.3 },
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          backgroundColor: "#fff",
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          px: 3,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#0f172a",
              mb: 0.3,
              fontSize: "1.05rem",
            }}
          >
            Request Equipment
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#475569",
              fontSize: "0.9rem",
            }}
          >
            Submit a request to borrow {item.name}
          </Typography>
        </Box>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ p: 3, pt: 4 }}>
        <form onSubmit={handleSubmit}>
          {/* CURRENTLY AVAILABLE */}
          <Paper
            elevation={0}
            sx={{
              backgroundColor: "#f1f5f9",
              borderRadius: "10px",
              p: 2,
              mb: 3,
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "#334155", fontWeight: 600 }}
              >
                Currently Available
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#0f172a" }}
              >
                {item.available}
              </Typography>
            </Box>
          </Paper>

          {/* QUANTITY */}
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            margin="dense"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            InputProps={{
              sx: { borderRadius: "8px", backgroundColor: "#f8fafc" },
            }}
          />

          {/* DATES */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Start Date"
              type="text"
              placeholder="dd-mm-yyyy"
              fullWidth
              margin="dense"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              InputProps={{
                sx: { borderRadius: "8px", backgroundColor: "#f8fafc" },
              }}
            />
            <TextField
              label="End Date"
              type="text"
              placeholder="dd-mm-yyyy"
              fullWidth
              margin="dense"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              InputProps={{
                sx: { borderRadius: "8px", backgroundColor: "#f8fafc" },
              }}
            />
          </Box>

          {/* NOTES */}
          <TextField
            label="Notes (Optional)"
            placeholder="Purpose of borrowing..."
            multiline
            rows={2}
            fullWidth
            margin="dense"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            InputProps={{
              sx: { borderRadius: "8px", backgroundColor: "#f8fafc" },
            }}
          />

          {/* BUTTONS */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5,
              mt: 3,
            }}
          >
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                fontWeight: 600,
                px: 3,
                color: "#1e293b",
                borderColor: "#cbd5e1",
                "&:hover": {
                  borderColor: "#94a3b8",
                  backgroundColor: "#f8fafc",
                },
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                px: 3,
                backgroundColor: "#0f172a",
                "&:hover": { backgroundColor: "#1e293b" },
              }}
            >
              Submit Request
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}

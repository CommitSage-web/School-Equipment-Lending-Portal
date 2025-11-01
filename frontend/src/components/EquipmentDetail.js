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
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import BorrowRequest from "./BorrowRequest";

export default function EquipmentDetail({ item, onClose, token, user }) {
  if (!item) return null;

  // Color based on condition
  const getConditionColor = (condition) => {
    const c = condition?.toLowerCase();
    if (c.includes("excellent")) return "#16a34a"; // green
    if (c.includes("bad")) return "#dc2626"; // red
    if (c.includes("good")) return "#dca926ff"; // red
    if (c.includes("fair")) return "#ca8a04"; // yellow
    return "#475569"; // default
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
        sx: {
          backdropFilter: "blur(12px)",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(235,240,255,0.9))",
          borderRadius: "16px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.15)",
          overflow: "hidden",
          p: 0,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            "linear-gradient(90deg, rgba(59,130,246,0.2), rgba(96,165,250,0.3))",
          fontWeight: 700,
          color: "#1e3a8a",
          py: 2,
          px: 3,
          letterSpacing: 0.3,
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.05)",
        }}
      >
        {item.name}
        <IconButton
          onClick={onClose}
          sx={{
            color: "#ef4444",
            "&:hover": {
              color: "#dc2626",
              transform: "scale(1.1)",
            },
            transition: "0.2s",
          }}
        >
          <XCircle size={24} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          px: 4,
          py: 3,
          mt: 1,
          borderRadius: 3,
          background: "rgba(255,255,255,0.65)",
          mx: 2,
          mb: 2,
        }}
      >
        {/* Category */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1.5,
            mt: 1.5, // 👈 Added top margin
          }}
        >
          <Typography sx={{ fontWeight: 600, color: "#334155" }}>
            Category
          </Typography>
          <Typography sx={{ color: "#475569" }}>{item.category}</Typography>
        </Box>

        {/* Condition */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography sx={{ fontWeight: 600, color: "#334155" }}>
            Condition
          </Typography>
          <Typography sx={{ fontWeight: 600, color: getConditionColor(item.condition) }}>
            {item.condition}
          </Typography>
        </Box>

        {/* Availability */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography sx={{ fontWeight: 600, color: "#334155" }}>
            Availability
          </Typography>
          <Typography sx={{ color: "#475569" }}>
            {item.available} / {item.quantity}
          </Typography>
        </Box>

        {/* Description */}
        {item.description && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "#334155", mb: 0.5 }}
            >
              Description
            </Typography>
            <Typography
              sx={{
                color: "#475569",
                lineHeight: 1.6,
                fontSize: "0.95rem",
                whiteSpace: "pre-line",
              }}
            >
              {item.description}
            </Typography>
          </>
        )}

        {/* Borrow Request */}
        {user.role === "student" && (
          <Box sx={{ mt: 3 }}>
            <BorrowRequest
              equipment={item}
              token={token}
              user={user}
              onDone={onClose}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

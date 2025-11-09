// frontend/src/components/EquipmentDetail.js
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Alert,
  Snackbar,
  LinearProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { Calendar, Package, AlertCircle, CheckCircle } from "lucide-react";

export default function EquipmentDetail({ item, onClose, token, user }) {
  const [quantity, setQuantity] = React.useState(1);
  const [start, setStart] = React.useState("");
  const [end, setEnd] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [showSuccess, setShowSuccess] = React.useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  if (!item) return null;

  // Real-time validation
  const validateForm = () => {
    const newErrors = {};

    // Quantity validation
    if (!quantity || quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1";
    }
    if (quantity > item.available) {
      newErrors.quantity = `Only ${item.available} available`;
    }

    // Date validation
    if (!start) {
      newErrors.start = "Start date is required";
    }
    if (!end) {
      newErrors.end = "End date is required";
    }
    if (start && start < today) {
      newErrors.start = "Start date cannot be in the past";
    }
    if (start && end && end < start) {
      newErrors.end = "End date must be after start date";
    }
    if (start && end) {
      const daysDiff = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
      if (daysDiff > 30) {
        newErrors.end = "Maximum borrowing period is 30 days";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate on field changes
  React.useEffect(() => {
    if (quantity || start || end) {
      validateForm();
    }
  }, [quantity, start, end, item.available]);

  // Calculate borrowing duration
  const getDuration = () => {
    if (!start || !end) return null;
    const days = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
    return days;
  };

  const duration = getDuration();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:4000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          equipment_id: item.id,
          quantity: Number(quantity),
          borrow_from: start,
          borrow_to: end,
          notes,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to submit request");
      }

      const data = await res.json();

      // Show success message
      setShowSuccess(true);

      // Reset form and close after delay
      setTimeout(() => {
        setQuantity(1);
        setStart("");
        setEnd("");
        setNotes("");
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Request submission failed:", err);
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
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
        {/* Progress Bar */}
        {submitting && <LinearProgress />}

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
        <DialogContent sx={{ p: 3, pt: 3 }}>
          <form onSubmit={handleSubmit}>
            {/* Equipment Info Card */}
            <Paper
              elevation={0}
              sx={{
                backgroundColor: "#f8fafc",
                borderRadius: "10px",
                p: 2.5,
                mb: 3,
                border: "1px solid #e2e8f0",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", fontWeight: 600, mb: 0.5 }}
                  >
                    Equipment
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#0f172a" }}
                  >
                    {item.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    {item.category}
                  </Typography>
                </Box>
                <Package size={32} color="#64748b" />
              </Box>

              <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Available
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: item.available > 0 ? "#10b981" : "#ef4444",
                    }}
                  >
                    {item.available}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Total
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#64748b" }}
                  >
                    {item.quantity}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Condition
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "#0f172a" }}
                  >
                    {item.condition}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* QUANTITY */}
            <TextField
              label="Quantity Needed"
              type="number"
              fullWidth
              margin="dense"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              error={!!errors.quantity}
              helperText={errors.quantity}
              inputProps={{ min: 1, max: item.available }}
              InputProps={{
                sx: { borderRadius: "8px", backgroundColor: "#f8fafc" },
              }}
              sx={{ mb: 2 }}
            />

            {/* DATES */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                margin="dense"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                error={!!errors.start}
                helperText={errors.start}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: today }}
                InputProps={{
                  sx: { borderRadius: "8px", backgroundColor: "#f8fafc" },
                }}
              />
              <TextField
                label="End Date"
                type="date"
                fullWidth
                margin="dense"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                error={!!errors.end}
                helperText={errors.end}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: start || today }}
                InputProps={{
                  sx: { borderRadius: "8px", backgroundColor: "#f8fafc" },
                }}
              />
            </Box>

            {/* Duration Display */}
            {duration !== null && duration > 0 && (
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: "#eff6ff",
                  borderRadius: "8px",
                  p: 1.5,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  border: "1px solid #dbeafe",
                }}
              >
                <Calendar size={16} color="#3b82f6" />
                <Typography variant="body2" sx={{ color: "#1e40af", fontWeight: 500 }}>
                  Borrowing duration: {duration} {duration === 1 ? "day" : "days"}
                </Typography>
              </Paper>
            )}

            {/* NOTES */}
            <TextField
              label="Purpose / Notes (Optional)"
              placeholder="e.g., For science project, photography assignment..."
              multiline
              rows={3}
              fullWidth
              margin="dense"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              InputProps={{
                sx: { borderRadius: "8px", backgroundColor: "#f8fafc" },
              }}
              sx={{ mb: 2 }}
            />

            {/* Error Alert */}
            {errors.submit && (
              <Alert
                severity="error"
                sx={{ mb: 2, borderRadius: "8px" }}
                icon={<AlertCircle size={20} />}
              >
                {errors.submit}
              </Alert>
            )}

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
                disabled={submitting}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={submitting || Object.keys(errors).length > 0 || !start || !end}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                  px: 3,
                  backgroundColor: "#0f172a",
                  "&:hover": { backgroundColor: "#1e293b" },
                  "&:disabled": {
                    backgroundColor: "#e2e8f0",
                    color: "#94a3b8",
                  },
                }}
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          sx={{
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
          icon={<CheckCircle size={20} />}
        >
          Request submitted successfully!
        </Alert>
      </Snackbar>
    </>
  );
}
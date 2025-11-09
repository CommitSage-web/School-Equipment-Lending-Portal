// frontend/src/components/AnalyticsDashboard.js
import React, { useEffect, useState } from "react";
import { apiGet } from "../api";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";

export default function AnalyticsDashboard({ token, user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await apiGet("/analytics/overview", token);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error loading analytics:", err);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "40vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (!stats)
    return (
      <Typography
        align="center"
        sx={{ color: "#666", fontWeight: 500, mt: 4, fontSize: "1rem" }}
      >
        Failed to load analytics.
      </Typography>
    );

  const items = [
    { label: "Total Requests", value: stats.total, color: "#111827" },
    { label: "Approved", value: stats.approved, color: "#10b981" },
    { label: "Rejected", value: stats.rejected, color: "#ef4444" },
    { label: "Overdue", value: stats.overdue, color: "#f59e0b" },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 700,
          color: "#111",
          textAlign: "center",
          letterSpacing: 0.5,
        }}
      >
        Usage Analytics
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {items.map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
            >
              <Card
                elevation={2}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 3,
                  border: "1px solid #e5e5e5",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: item.color,
                      mb: 1,
                    }}
                  >
                    {item.value ?? 0}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#555", fontWeight: 500 }}
                  >
                    {item.label}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

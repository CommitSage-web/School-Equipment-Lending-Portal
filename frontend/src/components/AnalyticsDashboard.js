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
  Paper,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Package, Users, Clock } from "lucide-react";

export default function AnalyticsDashboard({ token, user }) {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdminOrStaff = user.role === "admin" || user.role === "staff";

  async function load() {
    try {
      // Load overview stats
      const statsRes = await apiGet("/analytics/overview", token);
      const statsData = await statsRes.json();
      setStats(statsData);

      // Load requests for charts
      const reqRes = await apiGet("/requests", token);
      const reqData = await reqRes.json();
      setRequests(Array.isArray(reqData) ? reqData : reqData.requests || []);

      // Load equipment for utilization
      const eqRes = await apiGet("/equipment", token);
      const eqData = await eqRes.json();
      setEquipment(Array.isArray(eqData) ? eqData : []);
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

  // Prepare data for Status Distribution Pie Chart
  const statusData = [
    { name: "Approved", value: stats.approved, color: "#10b981" },
    { name: "Rejected", value: stats.rejected, color: "#ef4444" },
    { name: "Overdue", value: stats.overdue, color: "#f59e0b" },
    { name: "Pending", value: stats.total - stats.approved - stats.rejected - stats.overdue, color: "#6366f1" },
  ].filter(item => item.value > 0);

  // Prepare data for Equipment Utilization Bar Chart
  const equipmentUtilization = equipment
    .map((item) => ({
      name: item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name,
      borrowed: item.quantity - item.available,
      available: item.available,
      utilization: ((item.quantity - item.available) / item.quantity * 100).toFixed(0),
    }))
    .sort((a, b) => b.borrowed - a.borrowed)
    .slice(0, 6);

  // Prepare data for Requests Over Time (last 7 days)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();
  const requestsOverTime = last7Days.map((day) => {
    const dayRequests = requests.filter(
      (r) => r.created_at && r.created_at.startsWith(day)
    );
    return {
      date: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      requests: dayRequests.length,
    };
  });

  // Most Requested Equipment
  const equipmentRequestCount = {};
  requests.forEach((req) => {
    const name = req.equipment_name;
    equipmentRequestCount[name] = (equipmentRequestCount[name] || 0) + 1;
  });

  const topEquipment = Object.entries(equipmentRequestCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const summaryItems = [
    { label: "Total Requests", value: stats.total, color: "#111827", icon: Package },
    { label: "Approved", value: stats.approved, color: "#10b981", icon: TrendingUp },
    { label: "Rejected", value: stats.rejected, color: "#ef4444", icon: Clock },
    { label: "Overdue", value: stats.overdue, color: "#f59e0b", icon: Users },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 700,
          color: "#111",
          letterSpacing: 0.5,
        }}
      >
        Usage Analytics
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryItems.map((item, idx) => {
          const Icon = item.icon;
          return (
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
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "#555", fontWeight: 500, mb: 1 }}
                        >
                          {item.label}
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 700,
                            color: item.color,
                          }}
                        >
                          {item.value ?? 0}
                        </Typography>
                      </Box>
                      <Icon size={32} color={item.color} opacity={0.3} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Requests Over Time */}
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e5e5e5",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: "#111" }}>
              Requests Trend
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mb: 3 }}>
              Daily request submissions over the last 7 days
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={requestsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="requests"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: "#6366f1", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Status Distribution Pie */}
        <Grid item xs={12} lg={4}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e5e5e5",
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: "#111" }}>
              Request Status
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
              Distribution by status
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Equipment Utilization Bar Chart */}
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e5e5e5",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: "#111" }}>
              Equipment Utilization
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mb: 3 }}>
              Current borrowing status of top equipment
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={equipmentUtilization}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="borrowed" stackId="a" fill="#ef4444" name="Borrowed" />
                <Bar dataKey="available" stackId="a" fill="#10b981" name="Available" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Most Requested Equipment */}
        <Grid item xs={12} lg={4}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e5e5e5",
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: "#111" }}>
              Popular Equipment
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mb: 3 }}>
              Most frequently requested
            </Typography>
            <Box>
              {topEquipment.length === 0 ? (
                <Typography sx={{ color: "#94a3b8", textAlign: "center", py: 4 }}>
                  No data available
                </Typography>
              ) : (
                topEquipment.map((item, idx) => (
                  <Box key={idx}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 1.5,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: `hsl(${(idx * 60)}, 70%, 50%)`,
                          }}
                        />
                        <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
                          {item.name}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#6366f1",
                          fontSize: "1rem",
                        }}
                      >
                        {item.count}
                      </Typography>
                    </Box>
                    {idx < topEquipment.length - 1 && <Divider />}
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
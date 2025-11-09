import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Users } from "lucide-react";
import { apiGet } from "../api";

export default function UsersPanel({ token, user }) {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const roleColors = {
    admin: { bg: "#000", color: "#fff" },
    student: { bg: "#f4f4f5", color: "#000" },
    staff: { bg: "#f4f4f5", color: "#000" },
  };

  // Load from backend
  const load = async () => {
    try {
      const res = await apiGet("/users", token);
      const data = await res.json();
      setUsers(data);
      setFiltered(data);
    } catch (err) {
      console.error("Error loading users:", err);
      setUsers([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Filter users by search query
  useEffect(() => {
    if (!query.trim()) {
      setFiltered(users);
    } else {
      setFiltered(
        users.filter(
          (u) =>
            u.name?.toLowerCase().includes(query.toLowerCase()) ||
            u.username?.toLowerCase().includes(query.toLowerCase()) ||
            u.role?.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [query, users]);

  // Compute stats
  const stats = [
    { label: "Total Users", value: users.length },
    {
      label: "Students",
      value: users.filter((u) => u.role === "student").length,
    },
    { label: "Staff", value: users.filter((u) => u.role === "staff").length },
    { label: "Admins", value: users.filter((u) => u.role === "admin").length },
  ];

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

  return (
    <Box sx={{ p: 3, mt: 2 }}>
      {/* Page Title */}
      <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
        User Management
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage system users and their access
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "none",
                border: "1px solid #e5e7eb",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography fontWeight={600}>{stat.label}</Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Users size={20} color="#6b7280" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Users Table */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "none",
          border: "1px solid #e5e7eb",
        }}
      >
        <CardContent>
          <Typography fontWeight={600} sx={{ mb: 0.5 }}>
            All Users
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            View and manage system users
          </Typography>

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search users..."
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#f9fafb",
              },
            }}
          />

          {/* Table */}
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, boxShadow: "none" }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#f9fafb" }}>
                <TableRow>
                  {["Name", "Username", "Role", "Roll No"].map(
                    (header, index) => (
                      <TableCell key={index} sx={{ fontWeight: 700 }}>
                        {header}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.username}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.role}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            textTransform: "lowercase",
                            backgroundColor: roleColors[item.role]?.bg,
                            color: roleColors[item.role]?.color,
                            fontSize: "0.7rem",
                          }}
                        />
                      </TableCell>
                      <TableCell>{item.roll_no || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

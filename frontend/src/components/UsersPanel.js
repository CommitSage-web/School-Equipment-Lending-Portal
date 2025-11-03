import React from "react";
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
} from "@mui/material";
import { Users } from "lucide-react";

const UsersPanel = () => {
  const stats = [
    { label: "Total Users", value: 3 },
    { label: "Students", value: 1 },
    { label: "Staff", value: 1 },
    { label: "Admins", value: 1 },
  ];

  const users = [
    {
      name: "Admin User",
      email: "admin@school.edu",
      role: "admin",
      totalRequests: 0,
      activeLoans: "-",
      pending: "-",
    },
    {
      name: "John Smith",
      email: "john@school.edu",
      role: "student",
      totalRequests: 2,
      activeLoans: "-",
      pending: 1,
    },
    {
      name: "Dr. Jane Davis",
      email: "jane@school.edu",
      role: "staff",
      totalRequests: 1,
      activeLoans: 1,
      pending: "-",
    },
  ];

  const roleColors = {
    admin: { bg: "#000", color: "#fff" },
    student: { bg: "#f4f4f5", color: "#000" },
    staff: { bg: "#f4f4f5", color: "#000" },
  };

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
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            View and manage system users
          </Typography>

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search users..."
            size="small"
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
                  {["Name", "Email", "Role", "Total Requests", "Active Loans", "Pending"].map(
                    (header, index) => (
                      <TableCell key={index} sx={{ fontWeight: 700 }}>
                        {header}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
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
                    <TableCell>{item.totalRequests}</TableCell>
                    <TableCell>
                      {item.activeLoans !== "-" ? (
                        <Chip
                          label={item.activeLoans}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            color: "#fff",
                            backgroundColor: "#000",
                            fontSize: "0.7rem",
                          }}
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {item.pending !== "-" ? (
                        <Chip
                          label={item.pending}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            color: "#111827",
                            backgroundColor: "#f3f4f6",
                            fontSize: "0.7rem",
                          }}
                        />
                      ) : (
                        "-"
                      )}
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
};

export default UsersPanel;

import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { Package, Calendar, TrendingUp } from "lucide-react";

const MyProfile = () => {
  const user = {
    name: "Admin User",
    email: "admin@school.edu",
    role: "admin",
  };

  const stats = [
    { label: "Total Requests", value: 0, icon: <Package size={16} /> },
    { label: "Active Loans", value: 0, icon: <Calendar size={16} /> },
    { label: "Completed Returns", value: 0, icon: <TrendingUp size={16} /> },
  ];

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Typography variant="h5" fontWeight={700}>
        My Profile
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        View your account information and history
      </Typography>

      {/* Profile Card */}
      <Card
        sx={{
          borderRadius: 3,
          mb: 3,
          boxShadow: "none",
          border: "1px solid #e5e7eb",
        }}
      >
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: "#f4f4f5",
              color: "#000",
              fontWeight: 600,
            }}
          >
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Avatar>
          <Box>
            <Typography fontWeight={600}>{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            <Chip
              label={user.role}
              size="small"
              sx={{
                mt: 0.8,
                fontWeight: 600,
                fontSize: "0.7rem",
                textTransform: "lowercase",
                backgroundColor: "#000",
                color: "#fff",
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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
                    <Typography fontWeight={600} fontSize="0.9rem">
                      {stat.label}
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {stat.value}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Request History */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "none",
          border: "1px solid #e5e7eb",
        }}
      >
        <CardContent>
          <Typography fontWeight={600}>Request History</Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Your complete borrowing history
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 120,
              color: "text.secondary",
              fontSize: "0.9rem",
            }}
          >
            No requests yet
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MyProfile;

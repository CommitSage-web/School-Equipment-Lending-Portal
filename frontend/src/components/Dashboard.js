// frontend/src/components/Dashboard.js
import React from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Inventory2 as EquipmentIcon,
  Assignment as RequestIcon,
  Settings as ManageIcon,
  People as UsersIcon,
  AccountCircle as ProfileIcon,
  BarChart as AnalyticsIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";
import EquipmentList from "./EquipmentList";
import RequestsPanel from "./RequestsPanel";
import AdminPanel from "./AdminPanel";
import UsersPanel from "./UsersPanel";
import MyProfile from "./MyProfile";
import AnalyticsDashboard from "./AnalyticsDashboard";

export default function Dashboard({ user, token }) {
  const [tab, setTab] = React.useState(0);
  const isMobile = useMediaQuery("(max-width:900px)");
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  React.useEffect(() => {
    if (user.role === "student") setTab(0);
    else setTab(1);
  }, [user.role]);

  const handleTabChange = (e, v) => setTab(v);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      {/* Left Panel - Navigation */}
      <Box
        sx={{
          width: isMobile ? "90px" : "270px",
          background: isDark ? "#1e293b" : "#fff",
          borderRight: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
          p: isMobile ? 1 : 2,
          display: "flex",
          flexDirection: "column",
          alignItems: isMobile ? "center" : "flex-start",
          pt: 4,
          boxShadow: isDark
            ? "2px 0 10px rgba(0,0,0,0.3)"
            : "2px 0 10px rgba(0,0,0,0.05)",
          transition: "all 0.3s ease",
        }}
      >
        <Typography
          variant={isMobile ? "body1" : "h6"}
          sx={{
            mb: 4,
            fontWeight: 700,
            color: isDark ? "#f1f5f9" : "#111827",
            textAlign: isMobile ? "center" : "left",
            letterSpacing: 0.2,
          }}
        >
          {isMobile ? "EQP" : "Equipment Portal"}
        </Typography>

        <Tabs
          orientation="vertical"
          value={tab}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              justifyContent: isMobile ? "center" : "flex-start",
              alignItems: "center",
              borderRadius: "10px",
              color: isDark ? "#cbd5e1" : "#374151",
              minHeight: 50,
              mb: 1,
              px: isMobile ? 0 : 2,
              width: isMobile ? "70px" : "240px",
              transition: "0.2s",
              "&:hover": {
                backgroundColor: isDark ? "#334155" : "#f3f4f6",
              },
            },
            "& .Mui-selected": {
              color: "#fff !important",
              backgroundColor: isDark ? "#6366f1" : "#000",
              fontWeight: 700,
              width: isMobile ? "75px" : "96%",
              "&:hover": {
                backgroundColor: isDark ? "#4f46e5" : "#000",
              },
            },
            "& .MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          <Tab
            icon={<EquipmentIcon />}
            iconPosition="start"
            label={isMobile ? "" : "Equipment"}
          />
          <Tab
            icon={<RequestIcon />}
            iconPosition="start"
            label={isMobile ? "" : "Requests"}
          />
          {(user.role === "admin" || user.role === "staff") && (
            <Tab
              icon={<ManageIcon />}
              iconPosition="start"
              label={isMobile ? "" : "Manage"}
            />
          )}
          {(user.role === "admin" || user.role === "staff") && (
            <Tab
              icon={<UsersIcon />}
              iconPosition="start"
              label={isMobile ? "" : "Users"}
            />
          )}
          <Tab
            icon={<ProfileIcon />}
            iconPosition="start"
            label={isMobile ? "" : "My Profile"}
          />
          <Tab
            icon={<AnalyticsIcon />}
            iconPosition="start"
            label={isMobile ? "" : "Analytics"}
          />
        </Tabs>
      </Box>

      {/* Right Panel - Content */}
      <Box
        component={motion.div}
        key={tab}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 2,
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: isDark ? "#f1f5f9" : "black",
            ml: 2.9,
          }}
        >
          Welcome, {user.name}
        </Typography>

        <Box>
          {tab === 0 && <EquipmentList token={token} user={user} />}
          {tab === 1 && <RequestsPanel token={token} user={user} />}
          {tab === 2 &&
            (user.role === "admin" || user.role === "staff") && (
              <AdminPanel token={token} user={user} />
            )}
          {tab === 3 &&
            (user.role === "admin" || user.role === "staff") && (
              <UsersPanel token={token} user={user} />
            )}
          {tab === 4 && <MyProfile token={token} user={user} />}
          {tab === 5 && <AnalyticsDashboard token={token} user={user} />}
        </Box>
      </Box>
    </Box>
  );
}
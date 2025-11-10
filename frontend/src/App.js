// frontend/src/App.js
import React, { useState, useEffect } from "react";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Person as PersonIcon,
  Inventory2 as InventoryIcon,
} from "@mui/icons-material";
import { Moon, Sun } from "lucide-react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Notifications from "./components/Notifications";
import { ThemeProvider, useTheme } from "./ThemeContext";

function AppContent() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || "null"));
    setToken(localStorage.getItem("token"));
  }, []);

  function onLogin(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setToken(token);
  }

  function onLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  }

  return (
    <>
      <CssBaseline />
      <AppBar
        position="static"
        elevation={3}
        sx={{
          background: isDarkMode
            ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
            : "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
          transition: "all 0.3s ease",
        }}
      >
        <Toolbar>
          {/* App Icon & Title */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              gap: 1,
            }}
          >
            <InventoryIcon sx={{ fontSize: 28, color: "white" }} />
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                letterSpacing: "0.5px",
                color: "white",
              }}
            >
              School Equipment Portal
            </Typography>
          </Box>

          {/* Theme Toggle */}
          <Tooltip title={isDarkMode ? "Light Mode" : "Dark Mode"}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: "white",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "rotate(180deg)",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </IconButton>
          </Tooltip>

          {/* User Info & Notifications */}
          {user && (
            <>
              {/* Notifications Bell */}
              <Notifications token={token} user={user} />

              {/* User Info */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mx: 2,
                  gap: 0.5,
                  color: "white",
                }}
              >
                <PersonIcon sx={{ fontSize: 22 }} />
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {user.name} ({user.role})
                </Typography>
              </Box>

              {/* Logout Button */}
              <Button
                color="inherit"
                onClick={onLogout}
                startIcon={<LogoutIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "10px",
                  px: 2.5,
                  color: "white",
                  fontFamily: "'Poppins', sans-serif",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.2)",
                  },
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          background: isDarkMode
            ? "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)"
            : "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
          transition: "all 0.3s ease",
        }}
      >
        {!user ? (
          showSignup ? (
            <Signup onClose={() => setShowSignup(false)} />
          ) : (
            <Login
              onLogin={onLogin}
              openSignup={() => setShowSignup(true)}
            />
          )
        ) : (
          <Dashboard user={user} token={token} />
        )}
      </Box>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
// frontend/src/components/Notifications.js
import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Chip,
} from "@mui/material";
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Package,
  User,
} from "lucide-react";
import { apiGet } from "../api";
import { motion, AnimatePresence } from "framer-motion";

export default function Notifications({ token, user }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const isAdminOrStaff = user.role === "admin" || user.role === "staff";

  // Load notifications
  async function loadNotifications() {
    try {
      const res = await apiGet("/requests", token);
      const data = await res.json();
      const requests = Array.isArray(data) ? data : data.requests || [];

      // Generate notifications based on request status
      const notifs = [];
      const now = new Date();

      requests.forEach((req) => {
        // For admin/staff: pending requests
        if (isAdminOrStaff && req.status === "pending") {
          notifs.push({
            id: `pending-${req.id}`,
            type: "pending",
            title: "New Request",
            message: `${req.user_name || req.username} requested ${req.equipment_name}`,
            timestamp: req.created_at || new Date().toISOString(),
            icon: Clock,
            color: "#f59e0b",
            bgColor: "#fef3c7",
          });
        }

        // For students: approved requests
        if (
          !isAdminOrStaff &&
          req.status === "approved" &&
          req.user_id === user.id
        ) {
          notifs.push({
            id: `approved-${req.id}`,
            type: "approved",
            title: "Request Approved",
            message: `Your request for ${req.equipment_name} was approved`,
            timestamp: req.acted_at || req.created_at || new Date().toISOString(),
            icon: CheckCircle,
            color: "#10b981",
            bgColor: "#d1fae5",
          });
        }

        // For students: rejected requests
        if (
          !isAdminOrStaff &&
          req.status === "rejected" &&
          req.user_id === user.id
        ) {
          notifs.push({
            id: `rejected-${req.id}`,
            type: "rejected",
            title: "Request Rejected",
            message: `Your request for ${req.equipment_name} was rejected`,
            timestamp: req.acted_at || req.created_at || new Date().toISOString(),
            icon: XCircle,
            color: "#ef4444",
            bgColor: "#fee2e2",
          });
        }

        // Overdue notifications (for everyone with active requests)
        if (req.status === "approved") {
          const endDate = new Date(req.borrow_to);
          if (endDate < now) {
            const isOwn = req.user_id === user.id;
            notifs.push({
              id: `overdue-${req.id}`,
              type: "overdue",
              title: "Overdue Equipment",
              message: isOwn
                ? `${req.equipment_name} is overdue for return`
                : `${req.user_name} has overdue ${req.equipment_name}`,
              timestamp: req.borrow_to,
              icon: AlertTriangle,
              color: "#dc2626",
              bgColor: "#fecaca",
            });
          }
        }
      });

      // Sort by timestamp (newest first)
      notifs.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      // Limit to 10 most recent
      const recentNotifs = notifs.slice(0, 10);
      setNotifications(recentNotifs);
      setUnreadCount(recentNotifs.length);
    } catch (err) {
      console.error("Error loading notifications:", err);
    }
  }

  useEffect(() => {
    loadNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [token, user]);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    handleClose();
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          color: "white",
          position: "relative",
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              animation: unreadCount > 0 ? "pulse 2s infinite" : "none",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.1)" },
                "100%": { transform: "scale(1)" },
              },
            },
          }}
        >
          <Bell size={22} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 380,
            maxWidth: "90vw",
            borderRadius: 3,
            mt: 1,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            maxHeight: 500,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1rem" }}>
            Notifications
          </Typography>
          {notifications.length > 0 && (
            <Button
              size="small"
              onClick={clearAll}
              sx={{
                textTransform: "none",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#64748b",
              }}
            >
              Clear all
            </Button>
          )}
        </Box>

        <Divider />

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Box
            sx={{
              py: 6,
              px: 3,
              textAlign: "center",
            }}
          >
            <Bell size={48} color="#cbd5e1" style={{ marginBottom: 12 }} />
            <Typography sx={{ color: "#64748b", fontWeight: 500 }}>
              No notifications
            </Typography>
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              You're all caught up!
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0, maxHeight: 400, overflow: "auto" }}>
            <AnimatePresence>
              {notifications.map((notif, index) => {
                const Icon = notif.icon;
                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ListItem
                      sx={{
                        py: 1.5,
                        px: 2,
                        "&:hover": {
                          backgroundColor: "#f8fafc",
                        },
                        borderLeft: `3px solid ${notif.color}`,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            backgroundColor: notif.bgColor,
                            width: 40,
                            height: 40,
                          }}
                        >
                          <Icon size={20} color={notif.color} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                color: "#0f172a",
                              }}
                            >
                              {notif.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "#94a3b8", fontSize: "0.75rem" }}
                            >
                              {formatTime(notif.timestamp)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#64748b",
                              fontSize: "0.85rem",
                              lineHeight: 1.4,
                            }}
                          >
                            {notif.message}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < notifications.length - 1 && <Divider />}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </List>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1.5, textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{ color: "#94a3b8", fontSize: "0.75rem" }}
              >
                Showing {notifications.length} most recent notification{notifications.length !== 1 ? "s" : ""}
              </Typography>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
}
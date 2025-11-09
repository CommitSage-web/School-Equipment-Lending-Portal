// frontend/src/components/RequestsPanel.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Chip,
  CircularProgress,
  Button,
  Tabs,
  Tab,
  Paper,
  Menu,
  MenuItem as MenuItemOption,
  Divider,
} from "@mui/material";
import {
  Check,
  X,
  RotateCcw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  FileText,
  Printer,
  MoreVertical,
} from "lucide-react";
import { apiGet, apiPut } from "../api";
import { motion } from "framer-motion";

export default function RequestsPanel({ token, user }) {
  const [items, setItems] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const isAdminOrStaff = user.role === "admin" || user.role === "staff";

  async function load() {
    try {
      const res = await apiGet("/requests", token);
      const data = await res.json();
      if (!res.ok) {
        console.error("API error:", data);
        setItems([]);
        return;
      }
      setItems(Array.isArray(data) ? data : data.requests || []);
    } catch (e) {
      console.error("Error loading requests:", e);
      setItems([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id) {
    const res = await apiPut(`/requests/${id}/approve`, {}, token);
    if (res.ok) load();
  }
  async function reject(id) {
    const res = await apiPut(`/requests/${id}/reject`, {}, token);
    if (res.ok) load();
  }
  async function markReturn(id) {
    const res = await apiPut(`/requests/${id}/return`, {}, token);
    if (res.ok) load();
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = isAdminOrStaff
      ? ["ID", "User", "Equipment", "Quantity", "Start Date", "End Date", "Status", "Notes"]
      : ["ID", "Equipment", "Quantity", "Start Date", "End Date", "Status", "Notes"];

    const rows = tabFilteredItems.map(item =>
      isAdminOrStaff
        ? [
          item.id,
          item.user_name || item.username,
          item.equipment_name,
          item.quantity,
          item.borrow_from,
          item.borrow_to,
          item.status,
          item.notes || ""
        ]
        : [
          item.id,
          item.equipment_name,
          item.quantity,
          item.borrow_from,
          item.borrow_to,
          item.status,
          item.notes || ""
        ]
    );

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `requests_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to Excel-like format (HTML table for Excel)
  const exportToExcel = () => {
    const headers = isAdminOrStaff
      ? ["ID", "User", "Equipment", "Quantity", "Start Date", "End Date", "Status", "Notes"]
      : ["ID", "Equipment", "Quantity", "Start Date", "End Date", "Status", "Notes"];

    const rows = tabFilteredItems.map(item =>
      isAdminOrStaff
        ? [
          item.id,
          item.user_name || item.username,
          item.equipment_name,
          item.quantity,
          item.borrow_from,
          item.borrow_to,
          item.status,
          item.notes || ""
        ]
        : [
          item.id,
          item.equipment_name,
          item.quantity,
          item.borrow_from,
          item.borrow_to,
          item.status,
          item.notes || ""
        ]
    );

    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>Equipment Requests Report</h2>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `requests_${new Date().toISOString().split('T')[0]}.xls`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print functionality
  const handlePrint = () => {
    const headers = isAdminOrStaff
      ? ["ID", "User", "Equipment", "Quantity", "Start Date", "End Date", "Status"]
      : ["ID", "Equipment", "Quantity", "Start Date", "End Date", "Status"];

    const rows = tabFilteredItems.map(item =>
      isAdminOrStaff
        ? [
          item.id,
          item.user_name || item.username,
          item.equipment_name,
          item.quantity,
          item.borrow_from,
          item.borrow_to,
          item.status
        ]
        : [
          item.id,
          item.equipment_name,
          item.quantity,
          item.borrow_from,
          item.borrow_to,
          item.status
        ]
    );

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Equipment Requests Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            .meta { color: #666; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .status { 
              display: inline-block;
              padding: 4px 8px;
              border-radius: 4px;
              font-weight: bold;
              font-size: 12px;
            }
            .status-pending { background-color: #fef3c7; color: #f59e0b; }
            .status-approved { background-color: #d1fae5; color: #10b981; }
            .status-returned { background-color: #e0e7ff; color: #6366f1; }
            .status-rejected { background-color: #fee2e2; color: #ef4444; }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Equipment Requests Report</h1>
          <div class="meta">
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Total Requests:</strong> ${tabFilteredItems.length}</p>
          </div>
          <table>
            <thead>
              <tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${rows.map(row => {
      const statusClass = `status-${row[row.length - 1]}`;
      return `<tr>${row.map((cell, idx) =>
        idx === row.length - 1
          ? `<td><span class="status ${statusClass}">${cell}</span></td>`
          : `<td>${cell}</td>`
      ).join("")}</tr>`;
    }).join("")}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (items === null)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );

  // Filter items based on search and status
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.equipment_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.username?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Filter by tab for students
  const tabFilteredItems = !isAdminOrStaff
    ? filteredItems.filter((item) => {
      if (activeTab === 0) return item.status === "pending";
      if (activeTab === 1) return item.status === "approved";
      if (activeTab === 2) return item.status === "returned";
      if (activeTab === 3) return item.status === "rejected";
      return true;
    })
    : filteredItems;

  const stats = {
    pending: items.filter((i) => i.status === "pending").length,
    active: items.filter((i) => i.status === "approved").length,
    returned: items.filter((i) => i.status === "returned").length,
    rejected: items.filter((i) => i.status === "rejected").length,
    overdue: items.filter((i) => i.status === "overdue").length,
  };

  const statusStyles = {
    pending: { color: "#f59e0b", bg: "#fef3c7", icon: Clock },
    approved: { color: "#10b981", bg: "#d1fae5", icon: CheckCircle },
    returned: { color: "#6366f1", bg: "#e0e7ff", icon: CheckCircle },
    rejected: { color: "#ef4444", bg: "#fee2e2", icon: XCircle },
    overdue: { color: "#dc2626", bg: "#fecaca", icon: AlertCircle },
  };

  const StatusIcon = ({ status }) => {
    const Icon = statusStyles[status]?.icon || Clock;
    return <Icon size={16} />;
  };

  return (
    <Box sx={{ p: 3, mt: 2 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f172a" }}>
            {isAdminOrStaff ? "Requests Management" : "My Requests"}
          </Typography>
          <Typography sx={{ color: "#475569" }}>
            {isAdminOrStaff
              ? "Approve, track, and manage borrowing requests"
              : "Track your equipment borrowing requests"}
          </Typography>
        </Box>

        {/* Export Menu - Only for Admin/Staff */}
        {isAdminOrStaff && tabFilteredItems.length > 0 && (
          <Box>
            <Button
              variant="outlined"
              startIcon={<Download size={18} />}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                borderColor: "#e2e8f0",
                color: "#475569",
                "&:hover": {
                  borderColor: "#cbd5e1",
                  backgroundColor: "#f8fafc",
                },
              }}
            >
              Export Report
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                sx: { borderRadius: 2, minWidth: 180 }
              }}
            >
              <MenuItemOption onClick={() => { exportToCSV(); setAnchorEl(null); }}>
                <FileText size={16} style={{ marginRight: 8 }} />
                Export as CSV
              </MenuItemOption>
              <MenuItemOption onClick={() => { exportToExcel(); setAnchorEl(null); }}>
                <FileText size={16} style={{ marginRight: 8 }} />
                Export as Excel
              </MenuItemOption>
              <Divider />
              <MenuItemOption onClick={() => { handlePrint(); setAnchorEl(null); }}>
                <Printer size={16} style={{ marginRight: 8 }} />
                Print Report
              </MenuItemOption>
            </Menu>
          </Box>
        )}
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 4, mt: 2 }}>
        {isAdminOrStaff ? (
          <>
            {[
              { label: "Pending", value: stats.pending, color: "#f59e0b" },
              { label: "Active", value: stats.active, color: "#10b981" },
              { label: "Returned", value: stats.returned, color: "#6366f1" },
              { label: "Overdue", value: stats.overdue, color: "#ef4444" },
            ].map((stat, i) => (
              <Grid item xs={6} md={3} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: "1px solid #e2e8f0",
                      boxShadow: "none",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="body2"
                        sx={{ color: "#475569", fontWeight: 600, mb: 0.5 }}
                      >
                        {stat.label}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ color: stat.color, fontWeight: 700 }}
                      >
                        {stat.value}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </>
        ) : (
          <>
            {[
              { label: "Pending", value: stats.pending, color: "#f59e0b", icon: Clock },
              { label: "Approved", value: stats.active, color: "#10b981", icon: CheckCircle },
              { label: "Completed", value: stats.returned, color: "#6366f1", icon: CheckCircle },
              { label: "Rejected", value: stats.rejected, color: "#ef4444", icon: XCircle },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Grid item xs={6} md={3} key={i}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card
                      sx={{
                        borderRadius: 3,
                        border: "1px solid #e2e8f0",
                        boxShadow: "none",
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ color: "#475569", fontWeight: 600, mb: 0.5 }}
                            >
                              {stat.label}
                            </Typography>
                            <Typography
                              variant="h4"
                              sx={{ color: stat.color, fontWeight: 700 }}
                            >
                              {stat.value}
                            </Typography>
                          </Box>
                          <Icon size={24} color={stat.color} />
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </>
        )}
      </Grid>

      {/* Student Tabs */}
      {!isAdminOrStaff && (
        <Paper
          sx={{
            borderRadius: 3,
            mb: 3,
            border: "1px solid #e2e8f0",
            boxShadow: "none",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                minHeight: 48,
              },
              "& .Mui-selected": {
                color: "#0f172a",
              },
            }}
          >
            <Tab label={`Pending (${stats.pending})`} />
            <Tab label={`Active (${stats.active})`} />
            <Tab label={`Completed (${stats.returned})`} />
            <Tab label={`Rejected (${stats.rejected})`} />
          </Tabs>
        </Paper>
      )}

      {/* All Requests Table */}
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          boxShadow: "none",
        }}
      >
        <CardContent>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "#0f172a", mb: 0.5 }}
          >
            {isAdminOrStaff ? "All Requests" : "Request History"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#64748b", mb: 2 }}
          >
            {isAdminOrStaff
              ? "View and manage all borrowing requests"
              : "View the status of your equipment requests"}
          </Typography>

          {/* Search + Filter */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <TextField
              placeholder={isAdminOrStaff ? "Search by user or equipment..." : "Search equipment..."}
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flex: 1,
                minWidth: 200,
                backgroundColor: "#f9fafb",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            {isAdminOrStaff && (
              <Select
                size="small"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                displayEmpty
                sx={{ backgroundColor: "#f9fafb", borderRadius: 2, minWidth: 160 }}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Active</MenuItem>
                <MenuItem value="returned">Returned</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
              </Select>
            )}
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                  {isAdminOrStaff && <TableCell sx={{ fontWeight: 600 }}>User</TableCell>}
                  <TableCell sx={{ fontWeight: 600 }}>Equipment</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  {isAdminOrStaff && <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {tabFilteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdminOrStaff ? 6 : 5} align="center" sx={{ py: 4 }}>
                      <Typography sx={{ color: "#94a3b8" }}>
                        No requests found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  tabFilteredItems.map((r) => (
                    <TableRow key={r.id} sx={{ "&:hover": { backgroundColor: "#f9fafb" } }}>
                      {isAdminOrStaff && (
                        <TableCell>
                          <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
                            {r.user_name || r.username}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#64748b" }}>
                            {r.role || "student"}
                          </Typography>
                        </TableCell>
                      )}
                      <TableCell>
                        <Typography sx={{ fontWeight: 500 }}>
                          {r.equipment_name}
                        </Typography>
                      </TableCell>
                      <TableCell>{r.quantity}</TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: "0.85rem" }}>
                          {r.borrow_from}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748b", fontSize: "0.75rem" }}
                        >
                          to {r.borrow_to}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<StatusIcon status={r.status} />}
                          label={r.status}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            color: statusStyles[r.status]?.color,
                            backgroundColor: statusStyles[r.status]?.bg,
                            textTransform: "capitalize",
                            px: 1,
                          }}
                        />
                      </TableCell>
                      {isAdminOrStaff && (
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1.5 }}>
                            {r.status === "pending" && (
                              <>
                                <IconButton
                                  size="small"
                                  onClick={() => approve(r.id)}
                                  sx={{
                                    color: "#10b981",
                                    "&:hover": { backgroundColor: "#d1fae5" },
                                  }}
                                  title="Approve"
                                >
                                  <Check size={16} />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => reject(r.id)}
                                  sx={{
                                    color: "#ef4444",
                                    "&:hover": { backgroundColor: "#fee2e2" },
                                  }}
                                  title="Reject"
                                >
                                  <X size={16} />
                                </IconButton>
                              </>
                            )}
                            {r.status === "approved" && (
                              <IconButton
                                size="small"
                                onClick={() => markReturn(r.id)}
                                sx={{
                                  color: "#6366f1",
                                  "&:hover": { backgroundColor: "#e0e7ff" },
                                }}
                                title="Mark as Returned"
                              >
                                <RotateCcw size={16} />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                      )}
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
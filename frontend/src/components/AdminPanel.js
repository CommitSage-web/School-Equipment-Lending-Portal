import React, { useEffect, useState } from "react";
import {
  Chip,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Avatar,
  IconButton,
  Divider,
  Grid,
  Alert,
} from "@mui/material";
import { apiGet, apiPost, apiPut } from "../api";
import { Plus, Edit2, Trash2, Upload, X, Image as ImageIcon } from "lucide-react";

export default function AdminPanel({ token }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    condition: "",
    quantity: 1,
    description: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState({});

  async function load() {
    const res = await apiGet("/equipment");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEdit(null);
    setForm({
      name: "",
      category: "",
      condition: "Good",
      quantity: 1,
      description: "",
      image: "",
    });
    setImagePreview(null);
    setErrors({});
    setOpen(true);
  }

  function openEdit(item) {
    setEdit(item);
    setForm({
      name: item.name,
      category: item.category,
      condition: item.condition,
      quantity: item.quantity,
      description: item.description,
      image: item.image || "",
    });
    setImagePreview(item.image || null);
    setErrors({});
    setOpen(true);
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!form.name?.trim()) {
      newErrors.name = "Equipment name is required";
    }
    if (!form.category?.trim()) {
      newErrors.category = "Category is required";
    }
    if (!form.condition) {
      newErrors.condition = "Condition is required";
    }
    if (!form.quantity || form.quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle image URL change
  const handleImageChange = (url) => {
    setForm({ ...form, image: url });
    setImagePreview(url);
  };

  async function save() {
    if (!validateForm()) {
      return;
    }

    try {
      if (edit) {
        await apiPut(`/equipment/${edit.id}`, form, token);
      } else {
        await apiPost("/equipment", form, token);
      }
      setOpen(false);
      load();
    } catch (err) {
      setErrors({ submit: "Failed to save equipment. Please try again." });
    }
  }

  async function remove(id) {
    if (!confirm("Delete this equipment?")) return;
    await fetch(`http://localhost:4000/api/equipment/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    load();
  }

  // Filter items based on search
  const filteredItems = items.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#000" }}>
            Equipment Management
          </Typography>
          <Typography sx={{ color: "#6b7280" }}>
            Manage your school&apos;s equipment inventory
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={openCreate}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            backgroundColor: "#000",
            color: "#fff",
            px: 2.5,
            py: 1,
            "&:hover": { backgroundColor: "#111" },
          }}
        >
          Add Equipment
        </Button>
      </Box>

      {/* Equipment Inventory Section */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          p: 3,
          mt: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Equipment Inventory
        </Typography>
        <Typography sx={{ color: "#6b7280", mb: 2 }}>
          View and manage all equipment
        </Typography>

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search equipment..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#f9fafb",
            },
          }}
        />

        {/* Table */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "12px",
            boxShadow: "none",
            border: "1px solid #e5e7eb",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {["Image", "Name", "Category", "Condition", "Quantity", "Available", "Actions"].map(
                  (head) => (
                    <TableCell
                      key={head}
                      sx={{
                        fontWeight: 600,
                        color: "#111827",
                        fontSize: "0.9rem",
                        backgroundColor: "#f9fafb",
                      }}
                    >
                      {head}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9fafb" } }}>
                  <TableCell>
                    <Avatar
                      src={item.image}
                      variant="rounded"
                      sx={{
                        width: 50,
                        height: 50,
                        backgroundColor: "#f3f4f6",
                        color: "#9ca3af",
                      }}
                    >
                      <ImageIcon size={24} />
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>{item.name}</Typography>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 1.5,
                        py: 0.3,
                        fontSize: "0.8rem",
                        borderRadius: "8px",
                        color:
                          item.condition === "Excellent"
                            ? "#0f766e"
                            : item.condition === "Good"
                              ? "#2563eb"
                              : "#b91c1c",
                        backgroundColor:
                          item.condition === "Excellent"
                            ? "#ccfbf1"
                            : item.condition === "Good"
                              ? "#dbeafe"
                              : "#fee2e2",
                        fontWeight: 600,
                      }}
                    >
                      {item.condition}
                    </Box>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.available}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        backgroundColor: item.available > 0 ? "#d1fae5" : "#fee2e2",
                        color: item.available > 0 ? "#065f46" : "#991b1b",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Edit2
                        size={18}
                        style={{
                          cursor: "pointer",
                          color: "#111",
                        }}
                        onClick={() => openEdit(item)}
                      />
                      <Trash2
                        size={18}
                        style={{
                          cursor: "pointer",
                          color: "#dc2626",
                        }}
                        onClick={() => remove(item.id)}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            backgroundColor: "#fff",
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "1.2rem",
            color: "#000",
            pb: 1,
          }}
        >
          {edit ? "Edit Equipment" : "Add New Equipment"}
        </DialogTitle>
        <Typography
          sx={{
            color: "#6b7280",
            fontSize: "0.9rem",
            mb: 2,
            ml: 3,
          }}
        >
          {edit
            ? "Update equipment details"
            : "Add a new item to the inventory"}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Content */}
        <DialogContent sx={{ mt: 1 }}>
          <Grid container spacing={3}>
            {/* Left Column - Image Upload */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  border: "2px dashed #e5e7eb",
                  borderRadius: 2,
                  p: 2,
                  textAlign: "center",
                  backgroundColor: "#f9fafb",
                  minHeight: 250,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {imagePreview ? (
                  <Box sx={{ position: "relative", width: "100%" }}>
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Preview"
                      sx={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        borderRadius: 2,
                        mb: 1,
                      }}
                      onError={() => setImagePreview(null)}
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        setImagePreview(null);
                        setForm({ ...form, image: "" });
                      }}
                      sx={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        backgroundColor: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                      }}
                    >
                      <X size={16} />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <Upload size={40} color="#9ca3af" />
                    <Typography
                      sx={{ mt: 2, color: "#6b7280", fontWeight: 500 }}
                    >
                      Equipment Image
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                      Enter image URL below
                    </Typography>
                  </>
                )}
              </Box>

              <TextField
                fullWidth
                label="Image URL"
                placeholder="https://example.com/image.jpg"
                value={form.image}
                onChange={(e) => handleImageChange(e.target.value)}
                margin="dense"
                size="small"
                sx={{ mt: 2 }}
              />
              <Typography variant="caption" sx={{ color: "#6b7280", mt: 0.5, display: "block" }}>
                Paste a direct image URL or leave blank for default
              </Typography>
            </Grid>

            {/* Right Column - Form Fields */}
            <Grid item xs={12} md={8}>
              {errors.submit && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.submit}
                </Alert>
              )}

              {/* Equipment Name */}
              <TextField
                fullWidth
                label="Equipment Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
                margin="dense"
              />

              {/* Category */}
              <TextField
                fullWidth
                label="Category *"
                placeholder="e.g., Sports, Lab Equipment, Photography"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                error={!!errors.category}
                helperText={errors.category}
                margin="dense"
              />

              {/* Description */}
              <TextField
                fullWidth
                label="Description"
                multiline
                minRows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                margin="dense"
                placeholder="Provide details about the equipment..."
              />

              {/* Condition */}
              <TextField
                fullWidth
                select
                label="Condition *"
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                error={!!errors.condition}
                helperText={errors.condition}
                margin="dense"
              >
                <MenuItem value="Excellent">Excellent</MenuItem>
                <MenuItem value="Good">Good</MenuItem>
                <MenuItem value="Fair">Fair</MenuItem>
                <MenuItem value="Poor">Poor</MenuItem>
              </TextField>

              {/* Conditional Fields */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {edit ? (
                  <>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Total Quantity *"
                        type="number"
                        value={form.quantity}
                        onChange={(e) =>
                          setForm({ ...form, quantity: Number(e.target.value) })
                        }
                        error={!!errors.quantity}
                        helperText={errors.quantity}
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Available"
                        type="number"
                        value={form.available}
                        onChange={(e) =>
                          setForm({ ...form, available: Number(e.target.value) })
                        }
                        inputProps={{ min: 0 }}
                      />
                    </Grid>
                  </>
                ) : (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Quantity *"
                      type="number"
                      value={form.quantity}
                      onChange={(e) =>
                        setForm({ ...form, quantity: Number(e.target.value) })
                      }
                      error={!!errors.quantity}
                      helperText={errors.quantity}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>

        {/* Buttons */}
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "#6b7280",
              borderRadius: 2,
              px: 3,
              "&:hover": { backgroundColor: "#f3f4f6" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={save}
            variant="contained"
            sx={{
              backgroundColor: "#000",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              "&:hover": { backgroundColor: "#111" },
            }}
          >
            {edit ? "Save Changes" : "Add Equipment"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
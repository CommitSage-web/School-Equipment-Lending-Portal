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
  MenuItem
} from "@mui/material";
import { apiGet, apiPost, apiPut } from "../api";
import { Plus, Edit2, Trash2 } from "lucide-react";

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
  });

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
      condition: "",
      quantity: 1,
      description: "",
    });
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
    });
    setOpen(true);
  }

  async function save() {
    if (edit) await apiPut(`/equipment/${edit.id}`, form, token);
    else await apiPost("/equipment", form, token);
    setOpen(false);
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this equipment?")) return;
    await fetch(`http://localhost:4000/api/equipment/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    load();
  }

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
                {["Name", "Category", "Condition", "Quantity", "Available", "Actions"].map(
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
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    {item.category}
                  </TableCell>
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
                  <TableCell>{item.available}</TableCell>
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
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1,
            backgroundColor: "#fff",
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "#000",
            pb: 0,
          }}
        >
          {edit ? "Edit Equipment" : "Add New Equipment"}
        </DialogTitle>
        <Typography
          sx={{
            color: "#6b7280",
            fontSize: "0.9rem",
            mb: 2,
            mt: 0.5,
            ml: 3,
          }}
        >
          {edit
            ? "Update equipment details"
            : "Add a new item to the inventory"}
        </Typography>

        {/* Content */}
        <DialogContent sx={{ mt: 1 }}>
          {/* Equipment Name */}
          <TextField
            fullWidth
            label="Equipment Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            margin="dense"
          />

          {/* Category */}
          <TextField
            fullWidth
            label="Category"
            placeholder="e.g., Sports, Lab Equipment, Photography"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
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
          />

          {/* Condition */}
          <TextField
            fullWidth
            select
            label="Condition"
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })}
            margin="dense"
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value="Excellent">Excellent</MenuItem>
            <MenuItem value="Good">Good</MenuItem>
            <MenuItem value="Fair">Fair</MenuItem>
            <MenuItem value="Poor">Poor</MenuItem>
          </TextField>


          {/* Conditional Fields */}
          {edit ? (
            <>
              <TextField
                fullWidth
                label="Total Quantity"
                type="number"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
                margin="dense"
              />
              <TextField
                fullWidth
                label="Available"
                type="number"
                value={form.available}
                onChange={(e) =>
                  setForm({ ...form, available: e.target.value })
                }
                margin="dense"
              />
            </>
          ) : (
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: e.target.value })
              }
              margin="dense"
            />
          )}

          {/* Image URL */}
          <TextField
            fullWidth
            label="Image URL (Optional)"
            placeholder="https://..."
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            margin="dense"
          />
        </DialogContent>

        {/* Buttons */}
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={save}
            variant="contained"
            sx={{
              flexGrow: 1,
              backgroundColor: "#000",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1,
              "&:hover": { backgroundColor: "#111" },
            }}
          >
            {edit ? "Save Changes" : "Add Equipment"}
          </Button>
          <Button
            onClick={() => setOpen(false)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "#000",
              borderRadius: 1,
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


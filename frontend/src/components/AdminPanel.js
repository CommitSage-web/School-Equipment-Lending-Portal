// // frontend/src/components/AdminPanel.js
// import React, { useEffect, useState } from 'react';
// import { apiGet, apiPost, apiPut } from '../api';
// import { Grid, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';

// export default function AdminPanel({ token }){
//     const [items, setItems] = useState([]);
//     const [open, setOpen] = useState(false);
//     const [edit, setEdit] = useState(null);
//     const [form, setForm] = useState({ name:'', category:'', condition:'', quantity:1, description:'' });

//     async function load(){
//         const res = await apiGet('/equipment');
//         const data = await res.json();
//         setItems(data);
//     }
//     useEffect(()=> { load(); }, []);

//     function openCreate(){ setEdit(null); setForm({ name:'', category:'', condition:'', quantity:1, description:'' }); setOpen(true); }
//     function openEdit(item){ setEdit(item); setForm({ name:item.name, category:item.category, condition:item.condition, quantity:item.quantity, description:item.description }); setOpen(true); }

//     async function save(){
//         if(edit){
//             await apiPut(`/equipment/${edit.id}`, form, token);
//         } else {
//             await apiPost('/equipment', form, token);
//         }
//         setOpen(false); load();
//     }

//     async function remove(id){
//         if(!confirm('Delete?')) return;
//         await fetch('http://localhost:4000/api/equipment/' + id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token }});
//         load();
//     }

//     return (
//         <>
//             <Button variant="contained" onClick={openCreate} sx={{ mb:2 }}>Add Equipment</Button>
//             <Grid container spacing={2}>
//                 {items.map(item => (
//                     <Grid item xs={12} md={6} key={item.id}>
//                         <Card>
//                             <CardContent>
//                                 <Typography variant="h6">{item.name}</Typography>
//                                 <Typography>Available: {item.available} / {item.quantity}</Typography>
//                                 <div style={{ marginTop:8 }}>
//                                     <Button size="small" onClick={()=>openEdit(item)}>Edit</Button>
//                                     <Button size="small" onClick={()=>remove(item.id)}>Delete</Button>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 ))}
//             </Grid>

//             <Dialog open={open} onClose={()=>setOpen(false)}>
//                 <DialogTitle>{edit ? 'Edit' : 'Create'} Equipment</DialogTitle>
//                 <DialogContent>
//                     <TextField fullWidth label="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} margin="dense" />
//                     <TextField fullWidth label="Category" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} margin="dense" />
//                     <TextField fullWidth label="Condition" value={form.condition} onChange={e=>setForm({...form, condition:e.target.value})} margin="dense" />
//                     <TextField fullWidth type="number" label="Quantity" value={form.quantity} onChange={e=>setForm({...form, quantity:Number(e.target.value)})} margin="dense" />
//                     <TextField fullWidth label="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} margin="dense" />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={()=>setOpen(false)}>Cancel</Button>
//                     <Button onClick={save}>Save</Button>
//                 </DialogActions>
//             </Dialog>
//         </>
//     );
// }
// frontend/src/components/AdminPanel.js
import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
  Divider,
} from "@mui/material";
import { apiGet, apiPost, apiPut } from "../api";
import { motion } from "framer-motion";
import { PlusCircle, Edit2, Trash2 } from "lucide-react";

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
    setItems(data);
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
    if (edit) {
      await apiPut(`/equipment/${edit.id}`, form, token);
    } else {
      await apiPost("/equipment", form, token);
    }
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
    <Box
      sx={{
        p: 2,
        backdropFilter: "blur(10px)",
        background: "linear-gradient(145deg, #f0f9ff, #ffffff)",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#1e3a8a",
            letterSpacing: 0.5,
          }}
        >
          Equipment Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<PlusCircle size={18} />}
          onClick={openCreate}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            background: "linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)",
            boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
            "&:hover": {
              background:
                "linear-gradient(90deg, #1d4ed8 0%, #1e40af 100%)",
            },
          }}
        >
          Add Equipment
        </Button>
      </Box>

      <Grid container spacing={2}>
        {items.map((item, index) => (
          <Grid item xs={12} md={6} key={item.id}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,249,255,0.95))",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1e40af",
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      color: "#475569",
                      mt: 0.5,
                    }}
                  >
                    Category: {item.category}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      color: "#475569",
                    }}
                  >
                    Condition: {item.condition}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      mt: 1,
                      color: "#1e3a8a",
                      fontWeight: 500,
                    }}
                  >
                    Available: {item.available} / {item.quantity}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
                    <Button
                      size="small"
                      startIcon={<Edit2 size={16} />}
                      onClick={() => openEdit(item)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#2563eb",
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Trash2 size={16} />}
                      onClick={() => remove(item.id)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#dc2626",
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            backdropFilter: "blur(6px)",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,249,255,0.9))",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: "#1e3a8a",
            textAlign: "center",
          }}
        >
          {edit ? "Edit Equipment" : "Add New Equipment"}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Condition"
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })}
            margin="dense"
          />
          <TextField
            fullWidth
            type="number"
            label="Quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: Number(e.target.value) })
            }
            margin="dense"
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            minRows={2}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            margin="dense"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "#475569",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={save}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
              "&:hover": {
                background: "linear-gradient(90deg, #1d4ed8, #1e40af)",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// frontend/src/components/AdminPanel.js
import React, { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut } from '../api';
import { Grid, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';

export default function AdminPanel({ token }){
    const [items, setItems] = useState([]);
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(null);
    const [form, setForm] = useState({ name:'', category:'', condition:'', quantity:1, description:'' });

    async function load(){
        const res = await apiGet('/equipment');
        const data = await res.json();
        setItems(data);
    }
    useEffect(()=> { load(); }, []);

    function openCreate(){ setEdit(null); setForm({ name:'', category:'', condition:'', quantity:1, description:'' }); setOpen(true); }
    function openEdit(item){ setEdit(item); setForm({ name:item.name, category:item.category, condition:item.condition, quantity:item.quantity, description:item.description }); setOpen(true); }

    async function save(){
        if(edit){
            await apiPut(`/equipment/${edit.id}`, form, token);
        } else {
            await apiPost('/equipment', form, token);
        }
        setOpen(false); load();
    }

    async function remove(id){
        if(!confirm('Delete?')) return;
        await fetch('http://localhost:4000/api/equipment/' + id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token }});
        load();
    }

    return (
        <>
            <Button variant="contained" onClick={openCreate} sx={{ mb:2 }}>Add Equipment</Button>
            <Grid container spacing={2}>
                {items.map(item => (
                    <Grid item xs={12} md={6} key={item.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{item.name}</Typography>
                                <Typography>Available: {item.available} / {item.quantity}</Typography>
                                <div style={{ marginTop:8 }}>
                                    <Button size="small" onClick={()=>openEdit(item)}>Edit</Button>
                                    <Button size="small" onClick={()=>remove(item.id)}>Delete</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={()=>setOpen(false)}>
                <DialogTitle>{edit ? 'Edit' : 'Create'} Equipment</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} margin="dense" />
                    <TextField fullWidth label="Category" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} margin="dense" />
                    <TextField fullWidth label="Condition" value={form.condition} onChange={e=>setForm({...form, condition:e.target.value})} margin="dense" />
                    <TextField fullWidth type="number" label="Quantity" value={form.quantity} onChange={e=>setForm({...form, quantity:Number(e.target.value)})} margin="dense" />
                    <TextField fullWidth label="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} margin="dense" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setOpen(false)}>Cancel</Button>
                    <Button onClick={save}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

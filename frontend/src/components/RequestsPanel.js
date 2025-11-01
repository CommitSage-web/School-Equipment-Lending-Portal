// frontend/src/components/RequestsPanel.js
import React, { useEffect, useState } from 'react';
import { apiGet, apiPut } from '../api';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';

export default function RequestsPanel({ token, user }){
    const [items, setItems] = useState([]);

    async function load(){
        const res = await apiGet('/requests', token);
        const data = await res.json();
        setItems(data);
    }
    useEffect(()=> { load(); }, []);

    async function approve(id){
        const res = await apiPut(`/requests/${id}/approve`, {}, token);
        if(res.ok) load();
    }
    async function reject(id){
        const res = await apiPut(`/requests/${id}/reject`, {}, token);
        if(res.ok) load();
    }
    async function markReturn(id){
        const res = await apiPut(`/requests/${id}/return`, {}, token);
        if(res.ok) load();
    }

    if(items.length===0) return <Typography>No requests found.</Typography>;

    return (
        <Grid container spacing={2}>
            {items.map(r => (
                <Grid item xs={12} md={6} key={r.id}>
                    <Card>
                        <CardContent>
                            <Typography><strong>#{r.id}</strong> — {r.equipment_name || ('Equipment '+r.equipment_id)}</Typography>
                            <Typography>Requested by: {r.user_name || r.username || r.user_id}</Typography>
                            <Typography>Quantity: {r.quantity}</Typography>
                            <Typography>Status: {r.status}</Typography>
                            <Typography>From: {r.borrow_from} To: {r.borrow_to}</Typography>
                            <div style={{ marginTop:8 }}>
                                { (user.role === 'admin' || user.role === 'staff') && r.status === 'pending' && <>
                                    <Button size="small" onClick={()=>approve(r.id)}>Approve</Button>
                                    <Button size="small" onClick={()=>reject(r.id)}>Reject</Button>
                                </>}
                                { r.status === 'approved' && user.role !== 'student' && <Button size="small" onClick={()=>markReturn(r.id)}>Mark Returned</Button> }
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

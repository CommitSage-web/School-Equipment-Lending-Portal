// frontend/src/components/BorrowRequest.js
import React, { useState } from 'react';
import { Paper, TextField, Button } from '@mui/material';
import { apiPost } from '../api';

export default function BorrowRequest({ equipment, token, user, onDone }){
    const [quantity, setQuantity] = useState(1);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [notes, setNotes] = useState('');

    async function submit(e){
        e.preventDefault();
        if(quantity < 1) return alert('Quantity at least 1');
        if(quantity > equipment.available) return alert('Not enough available');
        const res = await apiPost('/requests', {
            equipment_id: equipment.id,
            quantity,
            borrow_from: from,
            borrow_to: to,
            notes
        }, token);
        if(res.ok){
            alert('Request submitted');
            onDone && onDone();
        } else {
            const d = await res.json();
            alert(d.error || 'Failed');
        }
    }

    return (
        <Paper elevation={0} sx={{ p:2, mt:2 }}>
            <form onSubmit={submit}>
                <TextField label="Quantity" type="number" value={quantity} onChange={e=>setQuantity(Number(e.target.value))} margin="dense" fullWidth />
                <TextField label="From (YYYY-MM-DD)" value={from} onChange={e=>setFrom(e.target.value)} margin="dense" fullWidth />
                <TextField label="To (YYYY-MM-DD)" value={to} onChange={e=>setTo(e.target.value)} margin="dense" fullWidth />
                <TextField label="Notes" value={notes} onChange={e=>setNotes(e.target.value)} margin="dense" fullWidth />
                <Button type="submit" variant="contained" sx={{ mt:1 }}>Request</Button>
            </form>
        </Paper>
    );
}

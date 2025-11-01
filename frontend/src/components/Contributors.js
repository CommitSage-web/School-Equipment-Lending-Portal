// frontend/src/components/Contributors.js
import React, { useEffect, useState } from 'react';
import { apiGet, apiPut } from '../api';
import { Grid, Card, CardContent, Typography, TextField, Button } from '@mui/material';

export default function Contributors({ token, user }){
    const [list, setList] = useState([]);

    async function load(){
        const res = await apiGet('/contributors', token);
        const data = await res.json();
        setList(data);
    }
    useEffect(()=> { load(); }, []);

    function change(idx, key, value){
        const copy = [...list];
        copy[idx][key] = value;
        setList(copy);
    }
    async function save(){
        await apiPut('/contributors', list, token);
        alert('Saved');
        load();
    }

    return (
        <>
            <Typography variant="h6" gutterBottom>Contributors</Typography>
            <Grid container spacing={2}>
                {list.map((c, idx) => (
                    <Grid item xs={12} md={6} key={idx}>
                        <Card>
                            <CardContent>
                                <TextField fullWidth label="Name" value={c.name} onChange={e=>change(idx,'name',e.target.value)} margin="dense" />
                                <TextField fullWidth label="Roll" value={c.roll} onChange={e=>change(idx,'roll',e.target.value)} margin="dense" />
                                <TextField fullWidth label="Contribution" value={c.contribution} onChange={e=>change(idx,'contribution',e.target.value)} margin="dense" />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            { (user.role === 'admin' || user.role === 'staff') && <Button variant="contained" sx={{ mt:2 }} onClick={save}>Save Contributors</Button> }
        </>
    );
}

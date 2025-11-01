// frontend/src/components/EquipmentList.js
import React, { useEffect, useState } from 'react';
import { apiGet } from '../api';
import { Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import EquipmentDetail from './EquipmentDetail';

export default function EquipmentList({ token, user }){
    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(null);

    async function load(){
        const res = await apiGet('/equipment', token);
        const data = await res.json();
        setItems(data);
    }
    useEffect(()=> { load(); }, []);

    return (
        <>
            <Grid container spacing={2}>
                {items.map(item => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{item.name}</Typography>
                                <Typography variant="body2">Category: {item.category}</Typography>
                                <Typography variant="body2">Available: {item.available} / {item.quantity}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={()=>setSelected(item)}>Details</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {selected && <EquipmentDetail item={selected} onClose={()=>setSelected(null)} token={token} user={user} />}
        </>
    );
}

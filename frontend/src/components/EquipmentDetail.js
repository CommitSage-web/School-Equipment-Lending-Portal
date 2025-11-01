// frontend/src/components/EquipmentDetail.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import BorrowRequest from './BorrowRequest';

export default function EquipmentDetail({ item, onClose, token, user }){
    if(!item) return null;
    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogTitle>{item.name}</DialogTitle>
            <DialogContent>
                <Typography>Category: {item.category}</Typography>
                <Typography>Condition: {item.condition}</Typography>
                <Typography>Available: {item.available} / {item.quantity}</Typography>
                <Typography sx={{ mt:2 }}>{item.description}</Typography>
                {user.role === 'student' && <BorrowRequest equipment={item} token={token} user={user} onDone={onClose} />}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

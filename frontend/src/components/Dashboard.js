// frontend/src/components/Dashboard.js
import React from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import EquipmentList from './EquipmentList';
import RequestsPanel from './RequestsPanel';
import AdminPanel from './AdminPanel';
import Contributors from './Contributors';

export default function Dashboard({ user, token }){
    const [tab, setTab] = React.useState(0);

    // set default tab per role
    React.useEffect(()=> {
        if(user.role === 'student') setTab(0);
        else setTab(1);
    }, [user.role]);

    return (
        <Box sx={{ mt:3 }}>
            <Typography variant="h6" gutterBottom>Welcome, {user.name}</Typography>
            <Tabs value={tab} onChange={(e, v)=>setTab(v)}>
                <Tab label="Equipment" />
                <Tab label="Requests" />
                { (user.role === 'admin' || user.role === 'staff') && <Tab label="Manage" /> }
                <Tab label="Contributors" />
            </Tabs>

            <Box sx={{ mt:3 }}>
                {tab===0 && <EquipmentList token={token} user={user} />}
                {tab===1 && <RequestsPanel token={token} user={user} />}
                {tab===2 && (user.role === 'admin' || user.role === 'staff') && <AdminPanel token={token} user={user} />}
                {tab===3 && <Contributors token={token} user={user} />}
            </Box>
        </Box>
    );
}

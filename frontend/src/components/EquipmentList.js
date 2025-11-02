// // frontend/src/components/EquipmentList.js
// import React, { useEffect, useState } from 'react';
// import { apiGet } from '../api';
// import { Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';
// import EquipmentDetail from './EquipmentDetail';

// export default function EquipmentList({ token, user }){
//     const [items, setItems] = useState([]);
//     const [selected, setSelected] = useState(null);

//     async function load(){
//         const res = await apiGet('/equipment', token);
//         const data = await res.json();
//         setItems(data);
//     }
//     useEffect(()=> { load(); }, []);

//     return (
//         <>
//             <Grid container spacing={2}>
//                 {items.map(item => (
//                     <Grid item xs={12} sm={6} md={4} key={item.id}>
//                         <Card>
//                             <CardContent>
//                                 <Typography variant="h6">{item.name}</Typography>
//                                 <Typography variant="body2">Category: {item.category}</Typography>
//                                 <Typography variant="body2">Available: {item.available} / {item.quantity}</Typography>
//                             </CardContent>
//                             <CardActions>
//                                 <Button size="small" onClick={()=>setSelected(item)}>Details</Button>
//                             </CardActions>
//                         </Card>
//                     </Grid>
//                 ))}
//             </Grid>
//             {selected && <EquipmentDetail item={selected} onClose={()=>setSelected(null)} token={token} user={user} />}
//         </>
//     );
// }
// frontend/src/components/EquipmentList.js
import React, { useEffect, useState } from "react";
import { apiGet } from "../api";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import EquipmentDetail from "./EquipmentDetail";

export default function EquipmentList({ token, user }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  // Load equipment data
  async function load() {
    try {
      const res = await apiGet("/equipment", token);
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
      else setItems([]);
    } catch (err) {
      console.error("Error loading equipment:", err);
      setItems([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Empty state
  if (items.length === 0) {
    return (
      <Typography
        align="center"
        sx={{
          color: "#64748b",
          fontWeight: 500,
          mt: 4,
          fontSize: "1rem",
        }}
      >
        No equipment available.
      </Typography>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {items.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <Card sx={{ height: '100%' }}>
                {item.image && (
                    <Box sx={{ height: 160, overflow: 'hidden' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                )}
                <CardContent>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2">Category: {item.category}</Typography>
                  <Typography variant="body2">Available: {item.available} / {item.quantity}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => setSelected(item)}>Details</Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {selected && (
        <EquipmentDetail
          item={selected}
          onClose={() => setSelected(null)}
          token={token}
          user={user}
        />
      )}
    </>
  );
}

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
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  backgroundColor: "#f8fafc",
                  transition: "transform 0.25s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#1e40af",
                      mb: 1,
                      textTransform: "capitalize",
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: "#475569", fontWeight: 500, mb: 0.5 }}
                  >
                    Category:{" "}
                    <Box component="span" sx={{ color: "#2563eb" }}>
                      {item.category}
                    </Box>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: item.available > 0 ? "#059669" : "#dc2626",
                      fontWeight: 600,
                    }}
                  >
                    Available: {item.available} / {item.quantity}
                  </Typography>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setSelected(item)}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      px: 2.5,
                      background:
                        "linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)",
                      },
                    }}
                  >
                    View Details
                  </Button>
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

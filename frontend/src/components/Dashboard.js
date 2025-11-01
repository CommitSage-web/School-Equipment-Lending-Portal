// // frontend/src/components/Dashboard.js
// import React from 'react';
// import { Tabs, Tab, Box, Typography } from '@mui/material';
// import EquipmentList from './EquipmentList';
// import RequestsPanel from './RequestsPanel';
// import AdminPanel from './AdminPanel';
// import Contributors from './Contributors';

// export default function Dashboard({ user, token }){
//     const [tab, setTab] = React.useState(0);

//     // set default tab per role
//     React.useEffect(()=> {
//         if(user.role === 'student') setTab(0);
//         else setTab(1);
//     }, [user.role]);

//     return (
//         <Box sx={{ mt:3 }}>
//             <Typography variant="h6" gutterBottom>Welcome, {user.name}</Typography>
//             <Tabs value={tab} onChange={(e, v)=>setTab(v)}>
//                 <Tab label="Equipment" />
//                 <Tab label="Requests" />
//                 { (user.role === 'admin' || user.role === 'staff') && <Tab label="Manage" /> }
//                 <Tab label="Contributors" />
//             </Tabs>

//             <Box sx={{ mt:3 }}>
//                 {tab===0 && <EquipmentList token={token} user={user} />}
//                 {tab===1 && <RequestsPanel token={token} user={user} />}
//                 {tab===2 && (user.role === 'admin' || user.role === 'staff') && <AdminPanel token={token} user={user} />}
//                 {tab===3 && <Contributors token={token} user={user} />}
//             </Box>
//         </Box>
//     );
// }
// frontend/src/components/Dashboard.js
import React from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  useMediaQuery,
} from "@mui/material";
import {
  Inventory2 as EquipmentIcon,
  Assignment as RequestIcon,
  Settings as ManageIcon,
  Group as ContributorsIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import EquipmentList from "./EquipmentList";
import RequestsPanel from "./RequestsPanel";
import AdminPanel from "./AdminPanel";
import Contributors from "./Contributors";

export default function Dashboard({ user, token }) {
  const [tab, setTab] = React.useState(0);
  const isMobile = useMediaQuery("(max-width:600px)");

  React.useEffect(() => {
    if (user.role === "student") setTab(0);
    else setTab(1);
  }, [user.role]);

  const handleTabChange = (e, v) => setTab(v);

  return (
    <Box
      sx={{
        mt: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 1100,
          borderRadius: 5,
          p: { xs: 2, sm: 4 },
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(240,245,255,0.9))",
          backdropFilter: "blur(10px)",
          boxShadow:
            "0 4px 30px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.08)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Typography
            variant="h5"
            align="center"
            sx={{
              mb: 1,
              fontWeight: 700,
              color: "#1e293b",
              letterSpacing: "0.4px",
            }}
          >
            Welcome, {user.name}
          </Typography>

          <Typography
            variant="subtitle2"
            align="center"
            sx={{
              mb: 3,
              color: "blue",
              fontWeight: 600,
              textTransform: "capitalize",
              fontSize: "1rem",
            }}
          >
            Role: {user.role}
          </Typography>

          {/* Tabs */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto"
              TabIndicatorProps={{
                style: {
                  background:
                    "linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)",
                  height: "3px",
                  borderRadius: "3px",
                },
              }}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  color: "black",
                  fontSize: "1rem",
                  transition: "0.2s ease",
                  minWidth: isMobile ? "auto" : 140,
                },
                "& .MuiTab-root.Mui-selected": {
                  color: "#2563eb",
                },
                "& .MuiSvgIcon-root": {
                  color: "#2563eb",
                },
              }}
            >
              <Tab
                icon={<EquipmentIcon sx={{ color: "#2563eb" }} />}
                iconPosition="start"
                label="Equipment"
              />
              <Tab
                icon={<RequestIcon sx={{ color: "#2563eb" }} />}
                iconPosition="start"
                label="Requests"
              />
              {(user.role === "admin" || user.role === "staff") && (
                <Tab
                  icon={<ManageIcon sx={{ color: "#2563eb" }} />}
                  iconPosition="start"
                  label="Manage"
                />
              )}
              <Tab
                icon={<ContributorsIcon sx={{ color: "#2563eb" }} />}
                iconPosition="start"
                label="Contributors"
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mt: 2 }}>
              {tab === 0 && <EquipmentList token={token} user={user} />}
              {tab === 1 && <RequestsPanel token={token} user={user} />}
              {tab === 2 &&
                (user.role === "admin" || user.role === "staff") && (
                  <AdminPanel token={token} user={user} />
                )}
              {tab === 3 && <Contributors token={token} user={user} />}
            </Box>
          </motion.div>
        </motion.div>
      </Paper>
    </Box>
  );
}


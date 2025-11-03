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
  Grid,
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
  const isMobile = useMediaQuery("(max-width:900px)");

  React.useEffect(() => {
    if (user.role === "student") setTab(0);
    else setTab(1);
  }, [user.role]);

  const handleTabChange = (e, v) => setTab(v);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "calc(100vh - 64px)",
        background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
      }}
    >
      {/* Left Panel - Navigation */}
      <Box
        sx={{
          width: isMobile ? "90px" : "270px", // ⬅️ Increased width
          background: "#fff",
          borderRight: "1px solid #e5e7eb",
          p: isMobile ? 1 : 2,
          display: "flex",
          flexDirection: "column",
          alignItems: isMobile ? "center" : "flex-start",
          pt: 4,
          boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          variant={isMobile ? "body1" : "h6"}
          sx={{
            mb: 4,
            fontWeight: 700,
            color: "#111827",
            textAlign: isMobile ? "center" : "left",
            letterSpacing: 0.2,
          }}
        >
          {isMobile ? "EQP" : "Equipment Portal"}
        </Typography>

        <Tabs
          orientation="vertical"
          value={tab}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              justifyContent: isMobile ? "center" : "flex-start",
              alignItems: "center",
              borderRadius: "10px",
              color: "#374151",
              minHeight: 50,
              mb: 1,
              px: isMobile ? 0 : 2,
              width: isMobile ? "170px" : "240px", // 🔹 widen the tab background fill area
              transition: "0.2s",
              "&:hover": {
                backgroundColor: "#f3f4f6",
              },
            },
            "& .Mui-selected": {
              color: "#fff !important",
              backgroundColor: "#000",
              fontWeight: 700,
              width: isMobile ? "75px" : "96%", // 🔹 make selected tab box slightly wider
              "&:hover": {
                backgroundColor: "#000",
              },
            },
            "& .MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          <Tab
            icon={<EquipmentIcon />}
            iconPosition="start"
            label={isMobile ? "" : "Equipment"}
          />
          <Tab
            icon={<RequestIcon />}
            iconPosition="start"
            label={isMobile ? "" : "Requests"}
          />
          {(user.role === "admin" || user.role === "staff") && (
            <Tab
              icon={<ManageIcon />}
              iconPosition="start"
              label={isMobile ? "" : "Manage"}
            />
          )}
          <Tab
            icon={<ContributorsIcon />}
            iconPosition="start"
            label={isMobile ? "" : "Contributors"}
          />
        </Tabs>
      </Box>

      {/* Right Panel - Content */}
      <Box
        component={motion.div}
        key={tab}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 2,
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: "black",
            ml: 2.9, // 👈 adds left margin (you can adjust value as needed)
          }}
        >
          Welcome, {user.name}
        </Typography>

        <Box>
          {tab === 0 && <EquipmentList token={token} user={user} />}
          {tab === 1 && <RequestsPanel token={token} user={user} />}
          {tab === 2 &&
            (user.role === "admin" || user.role === "staff") && (
              <AdminPanel token={token} user={user} />
            )}
          {tab === 3 && <Contributors token={token} user={user} />}
        </Box>
      </Box>
    </Box>
  );
}

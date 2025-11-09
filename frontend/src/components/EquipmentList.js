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
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import EquipmentDetail from "./EquipmentDetail";
import images from "../images";

export default function EquipmentList({ token, user }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load equipment data
  async function load() {
    try {
      const res = await apiGet("/equipment", token);
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
        setFilteredItems(data);
      } else {
        setItems([]);
        setFilteredItems([]);
      }
    } catch (err) {
      console.error("Error loading equipment:", err);
      setItems([]);
      setFilteredItems([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Filter items based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = items.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.condition?.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  // list of bundled images from src/images (values are URLs)
  const imageList = Object.values(images || {});

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
      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search equipment by name, category, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#64748b" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: "12px",
              backgroundColor: "#f8fafc",
              "& fieldset": { border: "1px solid #e2e8f0" },
              "&:hover fieldset": { borderColor: "#cbd5e1" },
              "&.Mui-focused fieldset": { borderColor: "#0f172a" },
            },
          }}
        />

        {/* Results count */}
        <Typography
          variant="body2"
          sx={{ mt: 1, color: "#64748b", fontWeight: 500 }}
        >
          {filteredItems.length === items.length
            ? `Showing all ${items.length} items`
            : `Found ${filteredItems.length} of ${items.length} items`}
        </Typography>
      </Box>

      {/* No results message */}
      {filteredItems.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#64748b", fontWeight: 600, mb: 1 }}
          >
            No equipment found
          </Typography>
          <Typography sx={{ color: "#94a3b8" }}>
            Try adjusting your search terms
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredItems.map((item, index) => {
            // resolve image source
            const imgSrc = (() => {
              const nameMap = {
                "Digital Camera": "dslr.jpg",
                "Microscope": "Microscope.jpg",
                "Stylus": "guitar.jpg",
              };

              if (item.image) {
                if (/^(https?:)?\/\//i.test(item.image)) return item.image;
                const name = item.image.split("/").pop().toLowerCase();
                return images[name] || null;
              }

              if (item.name && nameMap[item.name]) {
                const mappedFile = nameMap[item.name].toLowerCase();
                if (images[mappedFile]) return images[mappedFile];
              }

              if (imageList.length > 0) return imageList[index % imageList.length];
              return null;
            })();

            return (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow:
                        "0 4px 12px rgba(0,0,0,0.05), 0 2px 6px rgba(0,0,0,0.04)",
                      border: "1px solid #e2e8f0",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow:
                          "0 6px 18px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.05)",
                      },
                      backgroundColor: "#fff",
                    }}
                  >
                    {/* Image Section */}
                    {imgSrc && (
                      <Box
                        sx={{
                          position: "relative",
                          height: 200,
                          overflow: "hidden",
                          "& img": {
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                          },
                          "&:hover img": {
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        <img src={imgSrc} alt={item.name} />
                        {/* Availability Tag */}
                        <Chip
                          label={`${item.available}/${item.quantity} available`}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            bgcolor: "#0f172a",
                            color: "#fff",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    )}

                    {/* Details Section */}
                    <CardContent
                      sx={{
                        px: 3,
                        py: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "#0f172a",
                        }}
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#475569",
                          fontWeight: 500,
                        }}
                      >
                        {item.category}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#64748b",
                          mt: 0.5,
                        }}
                      >
                        {item.description?.length > 70
                          ? item.description.slice(0, 70) + "..."
                          : item.description || "No description provided."}
                      </Typography>

                      <Chip
                        label={item.condition}
                        size="small"
                        sx={{
                          width: "fit-content",
                          mt: 1,
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          textTransform: "propercase",
                          color:
                            item.condition === "Excellent"
                              ? "#0f766e"
                              : item.condition === "Good"
                                ? "#2563eb"
                                : "#b91c1c",
                          backgroundColor:
                            item.condition === "Excellent"
                              ? "#ccfbf1"
                              : item.condition === "Good"
                                ? "#dbeafe"
                                : "#fee2e2",
                        }}
                      />
                    </CardContent>

                    {/* Action Section */}
                    <CardActions
                      sx={{
                        px: 3,
                        pb: 2,
                        pt: 0,
                      }}
                    >
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          backgroundColor: "#0f172a",
                          borderRadius: "10px",
                          textTransform: "none",
                          fontWeight: 600,
                          "&:hover": {
                            backgroundColor: "#1e293b",
                          },
                        }}
                        onClick={() => setSelected(item)}
                      >
                        Request
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      )}

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

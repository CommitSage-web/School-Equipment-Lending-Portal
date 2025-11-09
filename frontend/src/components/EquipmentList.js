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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";
import EquipmentDetail from "./EquipmentDetail";
import images from "../images";

export default function EquipmentList({ token, user }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

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

  // Get unique categories from items
  const categories = [...new Set(items.map(item => item.category).filter(Boolean))];

  // Filter and sort items
  useEffect(() => {
    let filtered = [...items];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.condition?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "category":
          return (a.category || "").localeCompare(b.category || "");
        case "available":
          return (b.available || 0) - (a.available || 0);
        case "condition":
          const conditionOrder = { "Excellent": 1, "Good": 2, "Fair": 3, "Poor": 4 };
          return (conditionOrder[a.condition] || 5) - (conditionOrder[b.condition] || 5);
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [searchQuery, categoryFilter, sortBy, items]);

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
      {/* Search and Filter Controls */}
      <Box sx={{ mb: 3 }}>
        {/* Search Bar */}
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

        {/* Filter and Sort Controls */}
        <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
          {/* Category Filter */}
          <FormControl
            size="small"
            sx={{
              minWidth: 200,
              flex: { xs: "1 1 100%", sm: "0 1 auto" }
            }}
          >
            <InputLabel>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Filter size={16} />
                <span>Category</span>
              </Box>
            </InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
              sx={{
                borderRadius: "10px",
                backgroundColor: "#f8fafc",
              }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Sort By */}
          <FormControl
            size="small"
            sx={{
              minWidth: 200,
              flex: { xs: "1 1 100%", sm: "0 1 auto" }
            }}
          >
            <InputLabel>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <ArrowUpDown size={16} />
                <span>Sort By</span>
              </Box>
            </InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
              sx={{
                borderRadius: "10px",
                backgroundColor: "#f8fafc",
              }}
            >
              <MenuItem value="name">Name (A-Z)</MenuItem>
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="available">Most Available</MenuItem>
              <MenuItem value="condition">Best Condition</MenuItem>
            </Select>
          </FormControl>

          {/* Clear Filters Button */}
          {(searchQuery || categoryFilter !== "all" || sortBy !== "name") && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
                setSortBy("name");
              }}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#e2e8f0",
                color: "#475569",
                "&:hover": {
                  borderColor: "#cbd5e1",
                  backgroundColor: "#f8fafc",
                },
              }}
            >
              Clear Filters
            </Button>
          )}
        </Box>

        {/* Results count */}
        <Typography
          variant="body2"
          sx={{ mt: 2, color: "#64748b", fontWeight: 500 }}
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
            Try adjusting your search terms or filters
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
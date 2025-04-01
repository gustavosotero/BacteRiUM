import React, { useState } from "react";
import Headers from "../../Components/Headers";
import {
  Box,
  Menu,
  MenuItem,
  Button as MUIButton,
  Typography,
  Grid,
  useTheme,
} from "@mui/material";
import {
  DatePicker,
  Button,
  Label,
  Group,
  DateInput,
  DateSegment,
  Popover,
  Dialog,
  Calendar,
  CalendarGrid,
  CalendarCell,
  Heading,
} from "react-aria-components";
import { parseDate } from "@internationalized/date";
import { tokens } from "../../theme";

const simulateImageUrls = (selectedDate) => {
  // Simulate 12 image URLs with selected date in the URL for now
  return Array.from({ length: 12 }).map((_, i) => ({
    url: `https://via.placeholder.com/300x200.png?text=Image+${i + 1}+(${selectedDate})`,
  }));
};

const PicturesPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDarkMode = theme.palette.mode === "dark";

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDate, setSelectedDate] = useState(parseDate("2025-03-01"));
  const [images, setImages] = useState([]);

  const handleDownloadClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleDownloadSelected = () => {
    console.log("Trigger API: Download images of selected date", selectedDate);
    handleClose();
  };

  const handleDownloadAll = () => {
    console.log("Trigger API: Download all stored images");
    handleClose();
  };

  const handleFilter = () => {
    const day = selectedDate.toString(); // Example: 2025-03-01
    const mockImageData = simulateImageUrls(day);
    setImages(mockImageData);
  };

  return (
    <Box margin="20px">
      <Headers title="Pictures" />

      {/* Top Control Row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={4}>
        {/* Download Button */}
        <Box sx={{mt:0.1}}>
          <MUIButton
            variant="contained"
            onClick={handleDownloadClick}
            sx={{ backgroundColor: colors.blueAccent[700] }}
          >
            Download Images
          </MUIButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleDownloadSelected}>Download Selected Date</MenuItem>
            <MenuItem onClick={handleDownloadAll}>Download All Images</MenuItem>
          </Menu>
        </Box>

        {/* Date Picker and Filter */}
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Box position="relative" sx={{mb:3.3}}>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              className={`react-aria-DatePicker ${isDarkMode ? "dark-mode" : ""}`}
            >
              <Label>Select Date</Label>
              <Group>
                <DateInput>
                  {(segment) => <DateSegment segment={segment} />}
                </DateInput>
                <Button>▼</Button>
              </Group>
              <Popover className={`react-aria-DatePickerPopover ${isDarkMode ? "dark-mode" : ""}`}>
                <Dialog className={`react-aria-DatePicker ${isDarkMode ? "dark-mode" : ""}`}>
                  <Calendar>
                    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Button slot="previous">◀</Button>
                      <Heading />
                      <Button slot="next">▶</Button>
                    </header>
                    <CalendarGrid>
                      {(date) => <CalendarCell date={date} />}
                    </CalendarGrid>
                  </Calendar>
                </Dialog>
              </Popover>
            </DatePicker>
          </Box>

          <MUIButton
            variant="contained"
            onClick={handleFilter}
            sx={{ backgroundColor: colors.blueAccent[700] }}
          >
            Filter
          </MUIButton>
        </Box>
      </Box>

      {/* Image Grid */}
      <Grid container spacing={2} justifyContent="center">
        {images.length === 0 ? (
          <Typography mt={4} variant="h6" color="textSecondary">
            No images loaded. Select a date and press "Filter".
          </Typography>
        ) : (
          images.map((img, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
              <Box
                component="img"
                src={img.url}
                alt={`Image ${idx + 1}`}
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default PicturesPage;

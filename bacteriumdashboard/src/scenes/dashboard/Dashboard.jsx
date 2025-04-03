import React, { useState, useEffect } from "react";
import Headers from "../../Components/Headers";
import {
  Box,
  Button as MUIButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { tokens } from "../../theme";
import {
  DateRangePicker,
  DateInput,
  DateSegment,
  Label,
  Group,
  Button,
  Popover,
  Dialog as AriaDialog,
  RangeCalendar,
  CalendarGrid,
  CalendarCell,
  Heading,
} from "react-aria-components";
import { parseDate } from "@internationalized/date";
import dayjs from "dayjs";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import axios from "axios";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale
);

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [newLightValue, setNewLightValue] = useState("");
  const [currentLightValue, setCurrentLightValue] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [pendingLightValue, setPendingLightValue] = useState("");

  // Fetch current light intensity on load
  useEffect(() => {
    fetchCurrentLightIntensity();
  }, []);

  const fetchCurrentLightIntensity = async () => {
    try {
      const response = await axios.get("http://api.cyanobox.online/light_intensity/");
      setCurrentLightValue(response.data.light_intensity);
    } catch (error) {
      console.error("Failed to fetch light intensity:", error);
      setCurrentLightValue("N/A");
    }
  };

  // Dummy chart data
  const dummyChartData = {
    labels: Array.from({ length: 30 }, (_, i) => dayjs().subtract(i, "day").format("YYYY-MM-DD")),
    datasets: [
      {
        label: "Value",
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100)),
        fill: false,
        borderColor: "#42A5F5",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  };

  return (
    <Box margin={"20px"}>
      <Headers title={"Dashboard"} />

      {/* Confirmation Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>Confirm Light Intensity Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit <strong>{pendingLightValue}</strong> as the new light intensity value?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MUIButton onClick={() => setShowDialog(false)} color="primary">
            Cancel
          </MUIButton>
          <MUIButton
            onClick={async () => {
              try {
                await axios.post("http://api.cyanobox.online/light_intensity/", {
                  value: parseFloat(pendingLightValue),
                });
                setShowDialog(false);
                setNewLightValue("");
                await fetchCurrentLightIntensity();
                alert("Light intensity successfully updated.");
              } catch (error) {
                console.error("Failed to update light intensity:", error);
                alert("Error submitting light intensity.");
              }
            }}
            color="secondary"
          >
            Confirm
          </MUIButton>
        </DialogActions>
      </Dialog>

      {/* Top Cards */}
      <Grid container spacing={3} justifyContent={"center"} alignItems={"center"}>
        {/* Temperature */}
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ height: "100px", width: "250px", backgroundColor: theme.palette.mode === "dark" ? "#2C2B30" : "#fff" }}>
            <CardContent sx={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <Typography variant="h4">Temperature</Typography>
              <Typography variant="h5">24°C</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Humidity */}
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ height: "100px", width: "250px", backgroundColor: theme.palette.mode === "dark" ? "#2C2B30" : "#fff" }}>
            <CardContent sx={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <Typography variant="h4">Humidity</Typography>
              <Typography variant="h5">65%</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Light Intensity */}
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ height: "100px", width: "250px", backgroundColor: theme.palette.mode === "dark" ? "#2C2B30" : "#fff" }}>
            <CardContent sx={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <Typography variant="h4">Light Intensity</Typography>
              <Typography variant="h5">
                {currentLightValue !== null ? `${currentLightValue} lux` : "Loading..."}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* User Input for Light Intensity */}
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ height: "100px", width: "250px", backgroundColor: theme.palette.mode === "dark" ? "#2C2B30" : "#fff" }}>
            <CardContent sx={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <Typography variant="h4">Update Light Intensity</Typography>
              <input
                type="numeric"
                value={newLightValue}
                onChange={(e) => setNewLightValue(e.target.value)}
                placeholder="Enter new value"
                style={{
                  width: "53%",
                  padding: "10px",
                  marginTop: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <MUIButton
                variant="contained"
                sx={{ marginTop: "-4px", marginLeft: "10px", bgcolor: colors.blueAccent[700] }}
                onClick={() => {
                  setPendingLightValue(newLightValue);
                  setShowDialog(true);
                }}
              >
                Submit
              </MUIButton>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} marginTop={-1} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Box minHeight="300px" bgcolor="#fff" p={2} borderRadius={2} boxShadow={2}>
            <Typography variant="h5" color="#000000" mb={2}>Monthly Temperature</Typography>
            <Line data={dummyChartData} options={chartOptions} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box minHeight="300px" bgcolor="#fff" p={2} borderRadius={2} boxShadow={2}>
            <Typography variant="h5" color="#000000" mb={2}>Monthly Humidity</Typography>
            <Line data={dummyChartData} options={chartOptions} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box minHeight="300px" bgcolor="#fff" p={2} borderRadius={2} boxShadow={2}>
            <Typography variant="h5" color="#000000" mb={2}>Monthly Light Intensity</Typography>
            <Line data={dummyChartData} options={chartOptions} />
          </Box>
        </Grid>
      </Grid>

      {/* Last Captured Picture */}
      <Box mt={2}>
        <Typography variant="h3">Last Captured Picture</Typography>
        <Box
          sx={{
            width: "100%",
            height: 300,
            border: "1px solid #ccc",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Image Placeholder
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

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
    maintainAspectRatio: false,
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
        ticks: {
          maxRotation: 45,
          minRotation: 0,
          autoSkip: true,
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
    layout: {
      padding: {
        bottom: 20,
      },
    },
  };

  return (
    <Box p={{ xs: 2, sm: 3, md: 4 }}>
      <Headers title={"Dashboard"} />

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

      {/* Responsive Grid Cards */}
      <Grid container spacing={2} justifyContent="center">
        {[
          { label: "Temperature", value: "24°C" },
          { label: "Humidity", value: "65%" },
          { label: "Light Intensity", value: currentLightValue !== null ? `${currentLightValue} lux` : "Loading..." },
          {
            label: "Update Light Intensity",
            custom: (
              <>
                <input
                  type="numeric"
                  value={newLightValue}
                  onChange={(e) => setNewLightValue(e.target.value)}
                  placeholder="Enter new value"
                  style={{
                    width: "50%",
                    padding: "6px",
                    marginTop: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <MUIButton
                  variant="contained"
                  sx={{ ml: 1, mt: 1, bgcolor: colors.blueAccent[700] }}
                  onClick={() => {
                    setPendingLightValue(newLightValue);
                    setShowDialog(true);
                  }}
                >
                  Submit
                </MUIButton>
              </>
            ),
          },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card sx={{ height: "100%", backgroundColor: theme.palette.mode === "dark" ? "#2C2B30" : "#fff" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6">{item.label}</Typography>
                {item.custom ? item.custom : <Typography variant="body1">{item.value}</Typography>}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={2} mt={2}>
        {["Monthly Temperature", "Monthly Humidity", "Monthly Light Intensity"].map((title, idx) => (
          <Grid item xs={12} sm={12} md={6} lg={4} key={idx}>
            <Box height={360} bgcolor="#fff" p={2} borderRadius={2} boxShadow={2}>
              <Typography variant="h6" mb={1}>{title}</Typography>
              <Box height={300}>
                <Line data={dummyChartData} options={chartOptions} />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Last Captured Picture */}
      <Box mt={4}>
        <Typography variant="h5" mb={2}>Last Captured Picture</Typography>
        <Box
          sx={{
            width: "100%",
            height: { xs: 200, sm: 250, md: 300 },
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

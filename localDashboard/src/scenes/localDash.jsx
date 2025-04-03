import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert
} from "@mui/material";
import { useState, useEffect } from "react";
import Headers from "../components/Headers";

const TouchScreen = () => {
  const [tempCelsius, setTempCelsius] = useState(22);
  const [humidity, setHumidity] = useState(60);
  const [fanSpeed, setFanSpeed] = useState("--");

  const [selectedTemp, setSelectedTemp] = useState(22);
  const [selectedHumidity, setSelectedHumidity] = useState(60);

  const [targetTemp, setTargetTemp] = useState(null);
  const [targetHumidity, setTargetHumidity] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  // 🚀 Fetch sensor data every 3 seconds
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch("http://localhost:3000/sensor-data-local");
        const data = await response.json();

        if (data.temperature !== undefined) {
          setTempCelsius(data.temperature);
          setHumidity(data.humidity);
          setFanSpeed(data.fan_speed || "--");
        }
      } catch (error) {
        console.error("Failed to fetch sensor data:", error);
      }
    };

    fetchSensorData(); // Fetch once on load
    const interval = setInterval(fetchSensorData, 3000); // Fetch every 3 seconds

    return () => clearInterval(interval); // Clean up
  }, []);

  // 🧪 Send user-defined values to the API
  const handleConfirm = async () => {
    setTargetTemp(selectedTemp);
    setTargetHumidity(selectedHumidity);
    setAlertMessage(null);

    try {
      const response = await fetch("http://localhost:3000/user-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_temperature: selectedTemp,
          target_humidity: selectedHumidity
        })
      });

      const result = await response.json();
      console.log("User control response:", result);
    } catch (err) {
      console.error("Failed to send user control:", err);
      setAlertMessage("❌ Failed to communicate with the system.");
      setTimeout(() => setAlertMessage(null), 4000);
    }
  };

  return (
    <Box minHeight="100vh" p={4}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box flex={1} textAlign="center" marginBottom={-60}>
          <Headers title="Local Dashboard" />
        </Box>
        <Box width={60} />
      </Box>

      {alertMessage && (
        <Box mt={2} display="flex" justifyContent="center">
          <Alert severity="error" sx={{ width: "100%", maxWidth: 400 }}>
            {alertMessage}
          </Alert>
        </Box>
      )}

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={3}
        flexWrap="wrap"
        mt={6}
        minHeight="50vh"
      >
        <Card sx={{ width: 300 }}>
          <CardContent>
            <Typography variant="h6" align="center">Temperature</Typography>
            <Typography variant="h4" align="center">{tempCelsius} °C</Typography>
          </CardContent>
        </Card>

        <Card sx={{ width: 300 }}>
          <CardContent>
            <Typography variant="h6" align="center">Humidity</Typography>
            <Typography variant="h4" align="center">{humidity}%</Typography>
          </CardContent>
        </Card>

        <Card sx={{ width: 300 }}>
          <CardContent>
            <Typography variant="h6" align="center">Fan Speed</Typography>
            <Typography variant="h4" align="center">{fanSpeed} RPM</Typography>
          </CardContent>
        </Card>
      </Box>

      <Box display="flex" justifyContent="center" gap={4} mt={5} flexWrap="wrap" marginTop={-30}>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Temperature (°C)</InputLabel>
          <Select
            value={selectedTemp}
            label="Temperature (°C)"
            onChange={(e) => setSelectedTemp(e.target.value)}
          >
            {[22, 23, 24, 25].map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Humidity (%)</InputLabel>
          <Select
            value={selectedHumidity}
            label="Humidity (%)"
            onChange={(e) => setSelectedHumidity(e.target.value)}
          >
            {[60, 65, 70, 75, 80].map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleConfirm} sx={{ height: "56px" }}>
          Confirm
        </Button>
      </Box>

      {(targetTemp !== null || targetHumidity !== null) && (
        <Box mt={3} textAlign="center">
          <Typography variant="subtitle1" color="textSecondary">
            Target set: {targetTemp} °C | {targetHumidity}%
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TouchScreen;

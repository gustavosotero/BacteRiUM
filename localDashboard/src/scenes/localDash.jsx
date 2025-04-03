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
import { useState } from "react";
import Headers from "../components/Headers";
// import logo from "../assets/logo.png"; // ✅ Replace with actual path to your logo

const TouchScreen = () => {
  const [tempCelsius, setTempCelsius] = useState(22);
  const [humidity, setHumidity] = useState(60);

  const [selectedTemp, setSelectedTemp] = useState(22);
  const [selectedHumidity, setSelectedHumidity] = useState(60);

  const [targetTemp, setTargetTemp] = useState(null);
  const [targetHumidity, setTargetHumidity] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  const handleConfirm = () => {
    setTargetTemp(selectedTemp);
    setTargetHumidity(selectedHumidity);
    setAlertMessage(null);

    console.log("Simulated user target:", {
      temperature: selectedTemp,
      humidity: selectedHumidity
    });

    const simulatedFail = Math.random() < 0.3;
    if (simulatedFail) {
      setAlertMessage("❌ El sistema no se reguló al valor deseado.");
      setTimeout(() => setAlertMessage(null), 4000); // auto-dismiss after 4 seconds
    }
  };

  return (
    <Box minHeight="100vh" p={4}>
      {/* Header Row: Logo + Centered Title */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        {/* <Box>
          <img 
          src="BacteRiUM logo.png" 
          style={{ height: "90px", marginRight: "20px" }} 
          />
        </Box> */}

        <Box flex={1} textAlign="center" marginBottom={-60}>
          <Headers title="Local Dashboard" />
        </Box>

        <Box width={60} /> {/* Empty box to balance logo space */}
      </Box>
 
      {/* Alert */}
      {alertMessage && (
        <Box mt={2} display="flex" justifyContent="center">
          <Alert severity="error" sx={{ width: "100%", maxWidth: 400 }}>
            {alertMessage}
          </Alert>
        </Box>
      )}

      {/* Sensor Data Cards */}
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
            <Typography variant="h4" align="center">-- RPM</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Controls */}
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

      {/* Target Display */}
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

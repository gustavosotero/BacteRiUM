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
  
  const TouchScreen = () => {
    const [tempCelsius, setTempCelsius] = useState(22); // simulated real sensor reading
    const [humidity, setHumidity] = useState(60);       // simulated real sensor reading
  
    const [selectedTemp, setSelectedTemp] = useState(22);       // user input
    const [selectedHumidity, setSelectedHumidity] = useState(60); // user input
  
    const [targetTemp, setTargetTemp] = useState(null);
    const [targetHumidity, setTargetHumidity] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null); // placeholder for regulation failure
  
    const handleConfirm = async () => {
      // Simulated user target submission
      setTargetTemp(selectedTemp);
      setTargetHumidity(selectedHumidity);
      setAlertMessage(null); // clear any old alert
  
      /*
      try {
        const response = await fetch("http://your-raspberrypi-ip/api/set-values", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            temperature: selectedTemp,
            humidity: selectedHumidity
          })
        });
  
        if (!response.ok) {
          throw new Error("Regulation failed");
        }
  
        const result = await response.json();
        if (!result.success) {
          setAlertMessage("❌ El sistema no se reguló al valor deseado.");
        }
      } catch (error) {
        setAlertMessage("❌ Error: el sistema no se reguló al valor deseado.");
      }
      */
  
      console.log("Simulated user target:", {
        temperature: selectedTemp,
        humidity: selectedHumidity
      });
  
      // simulate a random failure (for testing UI)
      const simulatedFail = Math.random() < 0.3;
      if (simulatedFail) {
        setAlertMessage("❌ El sistema no se reguló al valor deseado.");
      }
    };
  
    return (
      <Box m={4}>
        <Headers title="Local Dashboard" />
  
        {alertMessage && (
          <Box mb={2}>
            <Alert severity="error">{alertMessage}</Alert>
          </Box>
        )}
  
        {/* Sensor Data Display */}
        <Box display="flex" justifyContent="space-between" mt={4} gap={2}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6">Temperature</Typography>
              <Typography variant="h4">{tempCelsius} °C</Typography>
            </CardContent>
          </Card>
  
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6">Humidity</Typography>
              <Typography variant="h4">{humidity}%</Typography>
            </CardContent>
          </Card>
  
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6">Fan Speed</Typography>
              <Typography variant="h4">-- RPM</Typography>
            </CardContent>
          </Card>
        </Box>
  
        {/* Control Selectors */}
        <Box display="flex" justifyContent="center" mt={4} gap={4}>
          <FormControl>
            <InputLabel>Temperature (°C)</InputLabel>
            <Select
              value={selectedTemp}
              label="Temperature (°C)"
              onChange={(e) => setSelectedTemp(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              {[22, 23, 24, 25].map((val) => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <FormControl>
            <InputLabel>Humidity (%)</InputLabel>
            <Select
              value={selectedHumidity}
              label="Humidity (%)"
              onChange={(e) => setSelectedHumidity(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              {[60, 65, 70, 75, 80].map((val) => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <Button variant="contained" onClick={handleConfirm}>
            Confirm
          </Button>
        </Box>
  
        {/* Optional: Display Current Target (for user feedback) */}
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
  
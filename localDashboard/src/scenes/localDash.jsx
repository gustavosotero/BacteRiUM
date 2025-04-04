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
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles"; 
import Headers from "../components/Headers";
import { tokens } from "../theme";

const TouchScreen = () => {
  const theme = useTheme(); 
  const colors = tokens(theme.palette.mode);
  const [tempCelsius, setTempCelsius] = useState(22);
  const [humidity, setHumidity] = useState(60);
  const [fanSpeed, setFanSpeed] = useState("--");

  const [selectedTemp, setSelectedTemp] = useState(22);
  const [selectedHumidity, setSelectedHumidity] = useState(60);

  const [targetTemp, setTargetTemp] = useState(null);
  const [targetHumidity, setTargetHumidity] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  const [showFahrenheit, setShowFahrenheit] = useState(false);

  const toFahrenheit = (celsius) => ((celsius * 9) / 5 + 32).toFixed(1);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/sensor");

    socket.onopen = () => console.log("WebSocket connected");
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTempCelsius(data.temperature);
      setHumidity(data.humidity);
      setFanSpeed(data.fan_speed || "--");
    };
    socket.onerror = (err) => console.error("WebSocket error:", err);
    socket.onclose = () => console.warn("WebSocket connection closed");

    return () => socket.close();
  }, []);

  const handleConfirm = async () => {
    setTargetTemp(selectedTemp);
    setTargetHumidity(selectedHumidity);
    setAlertMessage(null);

    try {
      const response = await fetch("http://localhost:8000/user-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_temperature: selectedTemp,
          target_humidity: selectedHumidity,
        }),
      });

      const result = await response.json();
      console.log("User control response:", result);
    } catch (err) {
      console.error("Failed to send user control:", err);
      setAlertMessage("Failed to communicate with the system.");
      setTimeout(() => setAlertMessage(null), 4000);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        padding: "8px",
        boxSizing: "border-box",
      }}
    >
      {/* Header: Logo + Title */}
      <Box
        position="relative"
        display="flex"
        alignItems="center"
        mb={1}
        height="100px"
      >
        <Box position="absolute" left={0}>
          <img
            src="/BacteRiUM logo.png"
            alt="BacteRiUM Logo"
            style={{ height: "120px", marginLeft: "8px" }}
          />
        </Box>

        <Box flexGrow={1} textAlign="center">
          <Headers title="Local Dashboard" />
        </Box>
      </Box>

      {/* Error message */}
      {alertMessage && (
        <Box display="flex" justifyContent="center" mb={1}>
          <Alert severity="error" sx={{ width: "90%" }}>
            {alertMessage}
          </Alert>
        </Box>
      )}

      {/* Sensor Readings */}
      <Box
        display="flex"
        justifyContent="space-around"
        alignItems="center"
        flexWrap="wrap"
        mt={1}
        sx={{ gap: 1 }}
      >
        <Card sx={{ width: "32%", minWidth: "30%", padding: 1 }}>
          <CardContent sx={{ padding: "8px" }}>
            <Typography variant="h4" align="center">
              Temperature
            </Typography>
            <Typography variant="h5" align="center">
              {showFahrenheit
                ? `${toFahrenheit(tempCelsius)} °F`
                : `${tempCelsius} °C`}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ width: "32%", minWidth: "30%", padding: 1 }}>
          <CardContent sx={{ padding: "8px" }}>
            <Typography variant="h4" align="center">
              Humidity
            </Typography>
            <Typography variant="h5" align="center">
              {humidity}%
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ width: "32%", minWidth: "30%", padding: 1 }}>
          <CardContent sx={{ padding: "8px" }}>
            <Typography variant="h4" align="center">
              Fan Speed
            </Typography>
            <Typography variant="h5" align="center">
              {fanSpeed} RPM
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          onClick={() => setShowFahrenheit((prev) => !prev)}
          sx={{
            fontSize: "0.8rem",
            backgroundColor:
              theme.palette.mode === "dark" ? colors.primary[500] : "#fff",
            color:
              theme.palette.mode === "dark"
                ? colors.grey[100]
                : "#000", // black text in light mode
            border: `1px solid ${colors.grey[300]}`,
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark" ? colors.primary[400] : "#fff", // no hover color change in light mode
            },
            boxShadow: "none", // remove any elevation
          }}
        >
          Show in {showFahrenheit ? "Celsius (°C)" : "Fahrenheit (°F)"}
        </Button>
      </Box>

      {/* Controls */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mt={2}
      >

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel shrink>Temp ({showFahrenheit ? "°F" : "°C"})</InputLabel>
          <Select
            value={selectedTemp}
            label={`Temp (${showFahrenheit ? "°F" : "°C"})`}
            onChange={(e) => {
              setSelectedTemp(e.target.value);
            }}
          >
            {[22, 23, 24, 25].map((celsiusVal) => {
              const displayVal = showFahrenheit
                ? Math.round((celsiusVal * 9) / 5 + 32)
                : celsiusVal;
              return (
                <MenuItem key={celsiusVal} value={celsiusVal}>
                  {displayVal}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 100 }}>
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

        <Button
          onClick={handleConfirm}
          sx={{
            minHeight: "40px",
            fontSize: "0.9rem",
            backgroundColor:
              theme.palette.mode === "dark" ? colors.primary[500] : "#fff",
            color:
              theme.palette.mode === "dark" ? colors.grey[100] : "#000",
            border: `1px solid ${colors.grey[300]}`,
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
            },
            boxShadow: "none",
          }}
        >
          Confirm
        </Button>

      </Box>

      {/* Confirmation message */}
      {(targetTemp !== null || targetHumidity !== null) && (
        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Target set: {targetTemp} °C | {targetHumidity}%
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TouchScreen;

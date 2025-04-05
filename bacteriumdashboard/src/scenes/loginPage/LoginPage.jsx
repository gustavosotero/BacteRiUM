import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onLogin }) => {
  const [tabValue, setTabValue] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const users = [
    { email: "admin@example.com", password: "1234", role: "Admin" },
    { email: "user@example.com", password: "1234", role: "User" },
  ];

  const handleLogin = () => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      onLogin({ email: foundUser.email, role: foundUser.role });
      navigate("/Dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        background: `linear-gradient(135deg, #0f2027, #203a43, #2c5364)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 0,
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            borderRadius: "50%",
            filter: "blur(100px)",
            opacity: 0.3,
          },
          "&::before": {
            width: 300,
            height: 300,
            top: "20%",
            left: "10%",
            background: "#00e5ff",
          },
          "&::after": {
            width: 400,
            height: 400,
            bottom: "10%",
            right: "10%",
            background: "#00ffab",
          },
        }}
      />

      {/* Tabs */}
      <Box sx={{ display: "flex", justifyContent: "center", pt: 3, zIndex: 1, position: "relative" }}>
        <Paper elevation={3} sx={{ borderRadius: 8 }}>
          <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)}>
            <Tab icon={<PersonIcon />} label="About" />
            <Tab icon={<KeyIcon />} label="Login" />
          </Tabs>
        </Paper>
      </Box>

      {/* Form */}
      <Box
        sx={{
          height: "calc(100vh - 120px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
          position: "relative",
        }}
      >
        <Box sx={{ maxWidth: 400, width: "100%", textAlign: "center", color: "white" }}>
          <Typography variant="h3" fontWeight="bold" mb={1}>
            Welcome Back!
          </Typography>
          <Typography variant="body1" mb={3}>
            Login to access the Cyanobox system
          </Typography>

          <TextField
            fullWidth
            label="Email"
            variant="filled"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              sx: {
                color: "#000",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#333",
              },
            }}
            sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="filled"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              sx: {
                color: "#000",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#333",
              },
            }}
            sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
          />

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{
              borderRadius: 8,
              backgroundColor: "#00e5ff",
              color: "#000",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#00b8d4" },
            }}
          >
            LOGIN
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;

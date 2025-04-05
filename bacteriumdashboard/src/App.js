import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Dashboard from "./scenes/dashboard/Dashboard";
import FAQ from "./scenes/faq's/faq";
import ContactInfo from "./scenes/contactInformation/ContactInfo";
import AlertNotification from "./scenes/alertNotification/AlertNotification";
import Charts from "./scenes/charts/Charts";
import PicturesPage from "./scenes/picturesPage/PicturesPage";
import ManageTeam from "./scenes/manageTeam/ManageTeam";
import ProfileForm from "./scenes/profileForm/ProfileForm";
import MainLayout from "./Components/MainLayout";
import LoginPage from "./scenes/loginPage/LoginPage";
import { useState } from "react";

function App() {
  const [theme, colorMode] = useMode();

  // Load user from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const ProtectedRoute = ({ children, roles }) => {
    if (!user) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
    if (roles && !roles.includes(user.role)) {
      return <Navigate to="/Dashboard" replace />;
    }
    return children;
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

          <Route
            path="/Dashboard"
            element={
              <ProtectedRoute>
                <MainLayout user={user} onLogout={handleLogout}>
                  <Dashboard user={user} />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/charts"
            element={
              <ProtectedRoute>
                <MainLayout user={user} onLogout={handleLogout}>
                  <Charts />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/picturesPage"
            element={
              <ProtectedRoute>
                <MainLayout user={user} onLogout={handleLogout}>
                  <PicturesPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/manageTeam"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <MainLayout user={user} onLogout={handleLogout}>
                  <ManageTeam />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profileForm"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <MainLayout user={user} onLogout={handleLogout}>
                  <ProfileForm />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/contactInformation"
            element={
              <ProtectedRoute>
                <MainLayout user={user} onLogout={handleLogout}>
                  <ContactInfo />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/alertNotification"
            element={
              <ProtectedRoute>
                <MainLayout user={user} onLogout={handleLogout}>
                  <AlertNotification />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/faq's"
            element={
              <ProtectedRoute>
                <MainLayout user={user} onLogout={handleLogout}>
                  <FAQ />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

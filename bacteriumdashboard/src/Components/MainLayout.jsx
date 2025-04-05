import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../scenes/global/Sidebar";
import Topbar from "../scenes/global/Topbar";

const MainLayout = ({ user, onLogout, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Box display="flex">
      {/* Sidebar (collapsible) */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        user={user} // ✅ pass user here
      />

      {/* Main Content */}
      <Box
        component="main"
        flexGrow={1}
        ml={isCollapsed ? "80px" : "250px"}
        sx={{ transition: "margin 0.3s ease" }}
      >
        <Topbar user={user} onLogout={onLogout} />
        <Box p={{ xs: 2, sm: 3, md: 4 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;

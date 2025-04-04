import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { tokens } from "../../theme";

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Box
      sx={{
        height: "100vh",
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
              cursor: "default",
            }}
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <img
                src="/BacteRiUM logo.png" 
                alt="BacteRiUM Logo"
                style={{
                  height: isCollapsed ? "40px" : "90px",
                  transition: "height 0.3s",
                }}
              />
            </Box>
          </MenuItem>

          
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;

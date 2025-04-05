import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import React, { useState } from "react";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import BarChartIcon from "@mui/icons-material/BarChart";
import CropOriginalIcon from "@mui/icons-material/CropOriginal";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import ContactsIcon from "@mui/icons-material/Contacts";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import GridViewIcon from "@mui/icons-material/GridView";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({ isCollapsed, setIsCollapsed, user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1200,
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
          height: "100%",
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
          {/* MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <img
                  src="/BacteRiUM logo.png"
                  alt="logo"
                  style={{ height: "90px", marginRight: "20px" }}
                />
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/Dashboard"
              icon={<GridViewIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={isCollapsed ? { m: "15px 0 5px 5px" } : { m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Charts"
              to="/charts"
              icon={<BarChartIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pictures"
              to="/picturesPage"
              icon={<CropOriginalIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={isCollapsed ? { m: "15px 0 5px 5px" } : { m: "15px 0 5px 20px" }}
            >
              Account Managing
            </Typography>

            {user?.role === "Admin" && (
              <>
                <Item
                  title="Manage Team"
                  to="/manageTeam"
                  icon={<PeopleIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Profile Form"
                  to="/profileForm"
                  icon={<PersonAddAltIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}

            <Item
              title="Contact Information"
              to="/contactInformation"
              icon={<ContactsIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={isCollapsed ? { m: "15px 0 5px 5px" } : { m: "15px 0 5px 20px" }}
            >
              Others
            </Typography>
            <Item
              title="Alarm Notifications"
              to="/alertNotification"
              icon={<NotificationImportantIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQs"
              to="/faq's"
              icon={<HelpCenterIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;

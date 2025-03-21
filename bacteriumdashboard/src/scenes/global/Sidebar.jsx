import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
// import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ContactsIcon from '@mui/icons-material/Contacts';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
// import LogoutIcon from '@mui/icons-material/Logout'; // i have to add this later
import GridViewIcon from '@mui/icons-material/GridView';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
      <MenuItem
        active={selected === title}
        style={{
          color: colors.grey[100],
        }}
        onClick={() => setSelected(title)}
        icon={icon}
      >
        <Typography>{title}</Typography>
        <Link to={to} />
      </MenuItem>
    );
  };
  
const Sidebar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");

    return (
        <Box
        sx={{
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
                    {/* LOGO AND MENU ICON */}
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
                            <Typography variant="h3" color={colors.grey[100]}>
                            BacteRiUM
                            </Typography>
                            <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                            <MenuOutlinedIcon />
                            </IconButton>
                        </Box>
                        )}
                    </MenuItem>

                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                        <Item
                        title="Dashboard"
                        to="/"
                        icon={<GridViewIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        />

                        <Typography
                        variant="h6"
                        color={colors.grey[300]}
                        sx={{ m: "15px 0 5px 5px" }}
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
                        sx={{ m: "15px 0 5px 5px" }}
                        >
                        Account Managging
                        </Typography>
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
                        sx={{ m: "15px 0 5px 5px" }}
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
                        {/* <Item
                        title="Logout"
                        to="/pie"
                        icon={<PieChartOutlineOutlinedIcon />}     i have make the logout later
                        selected={selected}
                        setSelected={setSelected}
                        /> */}
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    )
}

export default Sidebar;
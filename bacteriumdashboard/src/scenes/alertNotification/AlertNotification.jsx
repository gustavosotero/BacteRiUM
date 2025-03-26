import Headers from "../../Components/Headers";
import { mockNotifications } from "../../data/mockData";
import { DataGrid } from "@mui/x-data-grid";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const AlertNotification = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "timestamp",
      headerName: "Timestamp",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "text",
      headerName: "Message",
      flex: 1,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
    }
  ];

  return (
    <Box m="20px">
      <Headers title="AlertNotification"/>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },
          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "inherit !important",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "inherit",
          },
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid  rows={mockNotifications} columns={columns} disableRowSelectionOnClick/>
      </Box>
    </Box>
  );
};

export default AlertNotification;
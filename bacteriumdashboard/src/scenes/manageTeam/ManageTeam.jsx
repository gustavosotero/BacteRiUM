import { useEffect, useState } from "react";
import {
  Box,
  Button,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import Headers from "../../Components/Headers";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const ManageTeam = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://api.cyanobox.online/users/");
      const data = response.data.map((user, index) => ({
        id: index + 1,
        fullName: user.name,
        email: user.email,
        role: user.role === 1 ? "Admin" : "User",
      }));
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      alert("Could not load users from server.");
    }
  };

  // Delete user by email
  const handleOnRemove = async (email) => {
    try {
      await axios.delete(`http://api.cyanobox.online/users/${email}`);
      alert(`User with email ${email} was successfully deleted.`);
      setUsers((prev) => prev.filter((user) => user.email !== email));
    } catch (error) {
      console.error("Delete error:", error);
      if (error.response) {
        alert(`Failed to delete user: ${error.response.status} - ${error.response.data.detail || "Unknown error"}`);
      } else {
        alert("Failed to connect to the server.");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "fullName", headerName: "Full Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        const email = params.row.email;
        const name = params.row.fullName;
        return (
          <Button
            color="secondary"
            onClick={() => {
              setSelectedUserEmail(email);
              setSelectedUserName(name);
              setOpenDialog(true);
            }}
          >
            Remove User
          </Button>
        );
      },
    },
  ];

  return (
    <Box margin="20px">
      <Headers title="Manage Team" />

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{selectedUserName}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleOnRemove(selectedUserEmail);
              setOpenDialog(false);
            }}
            color="secondary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Users Table */}
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: `${colors.blueAccent[700]} !important`,
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
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "inherit",
          },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
          disableRowSelectionOnClick
          getRowId={(row) => row.email}
        />
      </Box>
    </Box>
  );
};

export default ManageTeam;

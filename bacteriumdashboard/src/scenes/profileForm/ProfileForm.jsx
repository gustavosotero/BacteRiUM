import { useState } from "react";
import Headers from "../../Components/Headers";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

const checkSchema = yup.object().shape({
  fullName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  role: yup.string().oneOf(["Admin", "User"]).required("required"),
});

const initialValues = {
  fullName: "",
  email: "",
  role: "",
};

const ProfileForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [openDialog, setOpenDialog] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const handleFormSubmit = (values, formikHelpers) => {
    // Save user info and resetForm function inside pendingUser object
    setPendingUser({
      ...values,
      resetForm: formikHelpers.resetForm,
    });
    setOpenDialog(true); // open confirmation dialog
  };

  const handleConfirmCreate = async () => {
    if (!pendingUser) return;

    const roleMapping = {
      Admin: 1,
      User: 2,
    };

    const userPayload = {
      email: pendingUser.email,
      name: pendingUser.fullName,
      role: roleMapping[pendingUser.role],
    };

    try {
      const response = await axios.post("http://54.235.58.122:8000/users/", userPayload);
      console.log("User created:", response.data);
      alert("User successfully created!");
      pendingUser.resetForm(); 
    } catch (error) {
      console.error("Failed to create user:", error);
      if (error.response) {
        alert(`API error: ${error.response.status} - ${error.response.data.detail || "Unknown error"}`);
      } else {
        alert("Failed to connect to the server.");
      }
    }

    setPendingUser(null);
    setOpenDialog(false);
  };

  return (
    <Box margin="20px">
      <Headers title="Profile Form" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkSchema}
      >
        {({ handleBlur, handleChange, handleSubmit, values, touched, errors, setFieldValue, resetForm }) => (
          <>
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="20px"
                gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
                }}
              >
                <TextField
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="text"
                  label="Full Name"
                  value={values.fullName}
                  name="fullName"
                  error={!!touched.fullName && !!errors.fullName}
                  helperText={touched.fullName && errors.fullName}
                  fullWidth
                  variant="filled"
                  sx={{ gridColumn: "span 1" }}
                />

                <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 1" }}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={values.role}
                    onChange={(e) => setFieldValue("role", e.target.value)}
                    onBlur={handleBlur}
                    error={!!touched.role && !!errors.role}
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="User">User</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="email"
                  label="Email"
                  value={values.email}
                  name="email"
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  fullWidth
                  variant="filled"
                  sx={{ gridColumn: "span 2" }}
                />
              </Box>
              <Box display="flex" justifyContent="end" mt="10px">
                <Button type="submit" variant="contained" color="secondary">
                  Create New User
                </Button>
              </Box>
            </form>

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
              <DialogTitle>Confirm New User</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to add <strong>{pendingUser?.fullName}</strong> as a{" "}
                  <strong>{pendingUser?.role}</strong> with email <strong>{pendingUser?.email}</strong>?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDialog(false)} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmCreate} color="secondary">
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Formik>
    </Box>
  );
};

export default ProfileForm;

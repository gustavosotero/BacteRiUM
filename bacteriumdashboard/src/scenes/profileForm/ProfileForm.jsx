import Headers from "../../Components/Headers";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
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

  const handleFormSubmit = async (values, { resetForm }) => {
    const roleMapping = {
      Admin: 1,
      User: 2,
    };
  
    const userPayload = {
      email: values.email,
      name: values.fullName,
      role: roleMapping[values.role],
    };
  
    try {
      console.log("Sending userPayload:", userPayload);
  
      const response = await fetch("http://54.235.58.122:8000/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPayload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error ${response.status}: ${errorData.detail || "Unknown error"}`);
      }
  
      const result = await response.json();
      console.log("User created:", result);
      alert("User successfully created!");
      resetForm();
    } catch (error) {
      console.error("Failed to create user:", error);
      alert(`Failed to create user: ${error.message}`);
    }
  };
  

  return (
    <Box margin="20px">
      <Headers title="Profile Form" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkSchema}
      >
        {({ handleBlur, handleChange, handleSubmit, values, touched, errors, setFieldValue }) => (
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
        )}
      </Formik>
    </Box>
  );
};

export default ProfileForm;

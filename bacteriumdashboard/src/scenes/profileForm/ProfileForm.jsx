import Headers from "../../Components/Headers";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, useTheme, Typography, TextField, Button } from "@mui/material";
import { tokens } from "../../theme";
import { Formik } from "formik";
import * as yup from "yup";

const checkSchema = yup.object().shape({
  fullName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  role: yup.string().required("required"),
});

const initialValues = {
  fullName: "",
  email: "",
  role: "",
};

const ProfileForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    console.log("Submitted values:", values);
  };

  return (
    <Box margin="20px">
      <Headers title="Profile Form" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkSchema}
      >
        {({ handleBlur, handleChange, handleSubmit, values, touched, errors }) => (
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
              <TextField
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                label="Role"
                value={values.role}
                name="role"
                error={!!touched.role && !!errors.role}
                helperText={touched.role && errors.role}
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
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

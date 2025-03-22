import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import Headers from '../../Components/Headers';

const ContactInfo = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Headers title={"Contact Information"} />
      <Grid container spacing={3}>
        {/* Email */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h4" gutterBottom>Email</Typography>
              <Typography variant="h5">1@yahoo.com</Typography>
              <Typography variant="h5">2@gmail.com</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Phone Numbers */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h4" gutterBottom>Phone Numbers</Typography>
              <Typography variant="h5">...</Typography>
              <Typography variant="h5">...</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Location */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h4" gutterBottom>Location</Typography>
              <Typography variant="h5">Lab...</Typography>
              <Typography variant="h5">...</Typography>
              {/* <Typography variant="h5">...</Typography> */}
            </CardContent>
          </Card>
        </Grid>

        {/* Social Media URLs */}
        <Grid item xs={12} md={6} lg={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h4" gutterBottom>Social Media</Typography>
              <Typography variant="h5">
                <a href="https://twitter.com/bacteriumlab" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              </Typography>
              <Typography variant="h5">
                <a href="https://facebook.com/in/bacteriumlab" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </Typography>
              <Typography variant="h5">
                <a href="https://instagram.com/bacteriumlab" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Working Hours */}
        <Grid item xs={12} md={6} lg={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h4" gutterBottom>Working Hours</Typography>
              <Typography variant="h5">Monday - Friday: ... AM – ... PM</Typography>
              <Typography variant="h5">Saturday: ... AM – ... PM</Typography>
              <Typography variant="h5">Closed Days ...: Closed</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactInfo;

import React, { useState } from "react";
import Headers from "../../Components/Headers";
import {
  Box,
  Button as MUIButton,
  Menu,
  MenuItem,
  Typography,
  Grid,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import {
  DateRangePicker,
  DateInput,
  DateSegment,
  Label,
  Group,
  Button,
  Popover,
  Dialog,
  RangeCalendar,
  CalendarGrid,
  CalendarCell,
  Heading,
} from "react-aria-components";
import { parseDate } from "@internationalized/date";
import dayjs from "dayjs";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, TimeScale);

// Generate simulated data
const generateData = () => {
  const result = [];
  const startDate = new Date("2025-03-01T00:00:00");
  const totalHours = 24 * 92;
  for (let i = 0; i <= totalHours; i++) {
    const timestamp = new Date(startDate.getTime() + i * 3600 * 1000);
    result.push({
      timestamp: timestamp.toISOString(),
      temperature: +(22 + Math.random() * 4).toFixed(1),
      humidity: +(50 + Math.random() * 10).toFixed(1),
      light: Math.floor(280 + Math.random() * 70),
    });
  }
  return result;
};

const fullData = generateData();

const Charts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDarkMode = theme.palette.mode === 'dark';
  const [anchorEl, setAnchorEl] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: parseDate("2025-03-01"),
    end: parseDate("2025-03-10"),
  });
  //To set filtered data
  const [filteredData, setFilteredData] = useState(fullData);

  //For handleling download data event
  const handleDownloadClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  //For handleling custom download data (by dates)
  const handleCustomDownload = () => {
    downloadCSV(filteredData);
    handleClose();
  };

  //For handleing full download data
  const handleFullDownload = () => {
    downloadCSV(fullData);
    handleClose();
  };

  //For handleling the filter event
  const handleFilter = () => {
    if (dateRange?.start && dateRange?.end) {
      const from = new Date(dateRange.start.toString());
      const to = new Date(dateRange.end.toString());

      const filtered = fullData.filter((entry) => {
        const ts = new Date(entry.timestamp);
        return ts >= from && ts <= to;
      });

      setFilteredData(filtered);
    }
  };

  //Download CSV file function
  const downloadCSV = (data) => {
    const headers = "timestamp,temperature,humidity,light\n";
    const rows = data
      .map((d) => `${d.timestamp},${d.temperature},${d.humidity},${d.light}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sensor_data.csv";
    link.click();
  };

  //For handleling the time x-axis time units
  const getTimeUnit = () => {
    const start = new Date(dateRange.start.toString());
    const end = new Date(dateRange.end.toString());
    const diff = dayjs(end).diff(dayjs(start), "day");
    if (diff <= 1) return "hour";
    if (diff <= 30) return "day";
    return "month";
  };

  const chartDataTemplate = (label, key, color) => ({
    labels: filteredData.map((d) => d.timestamp),
    datasets: [
      {
        label,
        data: filteredData.map((d) => ({ x: d.timestamp, y: d[key] })),
        borderColor: color,
        fill: false,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: getTimeUnit(),
          tooltipFormat: "yyyy/MM/dd HH:mm",
        },
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        beginAtZero: false,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <Box margin="20px">
      <Headers title="Historical Charts" />

      {/* Top Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2} marginTop={"-20px"}>
        {/* Download Buttons */}
        <Box>
          <MUIButton
            variant="contained"
            onClick={handleDownloadClick}
            sx={{ backgroundColor: colors.blueAccent[700] }}
          >
            Download Data
          </MUIButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleCustomDownload}>Download Filtered Data</MenuItem>
            <MenuItem onClick={handleFullDownload}>Download All Data</MenuItem>
          </Menu>
        </Box>

        {/* Custom Date Picker */}
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Box position={"relative"} sx={{mb:3.3}}>
            <DateRangePicker value={dateRange} onChange={setDateRange} className={`react-aria-DateRangePicker ${isDarkMode ? "dark-mode" : ""}`}>
              <Label>Date Range</Label>
              <Group>
                <DateInput slot="start">
                  {(segment) => <DateSegment segment={segment} />}
                </DateInput>
                <span aria-hidden="true">–</span>
                <DateInput slot="end">
                  {(segment) => <DateSegment segment={segment} />}
                </DateInput>
                <Button>▼</Button>
              </Group>
              <Popover className={`react-aria-Popover ${isDarkMode ? "dark-mode" : ""}`} >
                <Dialog>
                <RangeCalendar value={dateRange} onChange={setDateRange}>
                    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Button slot="previous">◀</Button>
                        <Heading />
                        <Button slot="next">▶</Button>
                    </header>

                    <CalendarGrid>
                        {(date) => <CalendarCell date={date} />}
                    </CalendarGrid>
                </RangeCalendar>

                </Dialog>
              </Popover>
            </DateRangePicker>
          </Box>

          <MUIButton
            variant="contained"
            onClick={handleFilter}
            sx={{ backgroundColor: colors.blueAccent[700] }}
          >
            Filter
          </MUIButton>
        </Box>
      </Box>

      {/* Charts */}
      <Grid container spacing={2} justifyContent={"left"}>
        <Grid item xs={12} sm={6} md={4.5}>
          <Box minHeight="300px" bgcolor="#fff" p={2} borderRadius={2} boxShadow={2}>
            <Typography color="#000000"  variant="h5" mb={2}>Temperature</Typography>
            <Line data={chartDataTemplate("Temperature (°C)", "temperature", "blue")} options={chartOptions} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4.5}>
          <Box minHeight="300px" bgcolor="#fff" p={2} borderRadius={2} boxShadow={2}>
            <Typography color="#000000"  variant="h5" mb={2}>Humidity</Typography>
            <Line data={chartDataTemplate("Humidity (%)", "humidity", "green")} options={chartOptions} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4.5}>
          <Box minHeight="300px" bgcolor="#fff" p={2} borderRadius={2} boxShadow={2}>
            <Typography color="#000000"  variant="h5" mb={2}>Light Intensity</Typography>
            <Line data={chartDataTemplate("Light Intensity (ppfd)", "light", "orange")} options={chartOptions} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Charts;

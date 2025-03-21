import { Box, useTheme, Typography } from "@mui/material"; 
import Headers from "../../Components/Headers";
import { tokens } from "../../theme";
import React from "react";
import Accordion, { accordionClasses } from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails, { accordionDetailsClasses } from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Fade from "@mui/material/Fade";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [expanded, setExpanded] = React.useState(false);

  const handleExpansion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const accordionData = [
    {
      panel: "panel1",
      question: "What type of data can I view on the dashboard?",
      answer:
        "The dashboard displays real-time and historical records of temperature, humidity, and light intensity inside the incubator. Additionally, periodic images are stored to visually monitor cyanobacteria growth.",
    },
    {
      panel: "panel2",
      question: "How often is the data updated on the dashboard?",
      answer:
        "Sensor data is recorded every hour, and the system sends real-time updates to the dashboard via a REST API. Depending on the configuration, data can be displayed with customizable update intervals.",
    },
    {
      panel: "panel3",
      question: "How is data security ensured on the dashboard?",
      answer:
        "The system implements authentication and authorization to restrict access to authorized users only. Additionally, encryption protocols are used to protect data transmission between the server and the client.",
    },
    {
      panel: "panel4",
      question: "Can I download the collected data?",
      answer:
        "Yes, the dashboard provides an option to export data in formats like CSV or JSON, allowing users to analyze the information with external tools.",
    },
    {
      panel: "panel5",
      question: "Can I control the incubator settings from the dashboard?",
      answer:
        "Currently, the dashboard is designed for monitoring purposes only. However, future updates may include remote control features to adjust temperature, humidity, and light intensity settings directly from the interface.",
    },
  ];

  return (
    <Box margin={"20px"}>
      <Headers title={"FAQ's"} />
      {accordionData.map(({ panel, question, answer }) => (
        <Accordion
          key={panel}
          expanded={expanded === panel}
          onChange={handleExpansion(panel)}
          slots={{ transition: Fade }}
          slotProps={{ transition: { timeout: 400 } }}
          sx={[
            expanded === panel
              ? {
                  [`& .${accordionClasses.region}`]: { height: "auto" },
                  [`& .${accordionDetailsClasses.root}`]: { display: "block" },
                }
              : {
                  [`& .${accordionClasses.region}`]: { height: 0 },
                  [`& .${accordionDetailsClasses.root}`]: { display: "none" },
                },
          ]}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${panel}-content`}
            id={`${panel}-header`}
          >
            <Typography color={colors.greenAccent[500]} variant="h5">
              {question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FAQ;

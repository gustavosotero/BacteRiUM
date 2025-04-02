import { tokens } from "../theme";

export const mockDataTeam = [
  {
    id: 1,
    fullName: "Francisco",
    role: "admin",
    email: "francisco@upr.edu"
  },
  {
    id: 2,
    fullName: "Gustavo",
    role: "admin",
    email: "gustavo@upr.edu"
  },
  {
    id: 3,
    fullName: "Edgar",
    role: "user",
    email: "edgar@upr.edu"
  },
  {
    id: 4,
    fullName: "Anton",
    role: "user",
    email: "anton@upr.edu"
  },
];

export const mockEnvironmentData = [
  {
    temperature: 25,
    humidity: 65,
    lightIntensity: 286,
  },
  {
    temperature: 27,
    humidity: 70,
    lightIntensity: 290,
  },
  {
    temperature: 28,
    humidity: 60,
    lightIntensity: 230,
  },
  {
    temperature: 25,
    humidity: 65,
    lightIntensity: 240,
  },
  {
    temperature: 26,
    humidity: 75,
    lightIntensity: 296,
  },
  {
    temperature: 30,
    humidity: 60,
    lightIntensity: 270,
  },
  {
    temperature: "",
    humidity: "",
    lightIntensity: "",
  },
];

export const mockPhotos = [
  {
    url: "",
  },
];

export const mockNotifications = [
  {
    id: "1",
    timestamp: "3/25/2025",
    text: "The temperature value exceeded the threshold",
    type: 1, 
  },
  {
    id: "2",
    timestamp: "4/28/2025",
    text: "The humidity value exceeded the threshold",
    type: 1, 
  }
];

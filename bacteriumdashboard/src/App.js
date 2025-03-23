import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard/Dashboard";
import FAQ from "./scenes/faq's/faq";
import ContactInfo from "./scenes/contactInformation/ContactInfo";
// import AlertNotification from "./scenes/alertNotification/AlertNotification";
// import Charts from "./scenes/charts/charts";
// import PicturesPage from "./scenes/picturesPage/PicturesPage";
import ManageTeam from "./scenes/manageTeam/ManageTeam";
import ProfileForm from "./scenes/profileForm/ProfileForm";




function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar/>
            <Routes>
              <Route path="/" element={<Dashboard/>}/>
              {/* <Route path="/charts" element={<Charts/>}/> */}
              {/* <Route path="/picturesPage" element={<PicturesPage/>}/> */}
              <Route path="/manageTeam" element={<ManageTeam/>}/>
              <Route path="/profileForm" element={<ProfileForm/>}/>
              <Route path="/contactInformation" element={<ContactInfo/>}/>
              {/* <Route path="/alertNotification" element={<AlertNotification/>}/> */}
              <Route path="/faq's" element={<FAQ/>}/>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
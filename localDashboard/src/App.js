import TouchScreen from "./scenes/localDash";
import Topbar from "./scenes/global/topbar";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Sidebar from "./scenes/global/sidebar";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <Sidebar/> */}
        <div>
          <Topbar/>
          <TouchScreen />
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

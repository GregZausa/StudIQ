import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { StreakProvider } from "../src/context/StreakContext.jsx";
import { PomodoroProvider } from "./context/PomodoroContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <ThemeProvider>
        <PomodoroProvider>
          <StreakProvider>
            <App />
          </StreakProvider>
        </PomodoroProvider>
      </ThemeProvider>
    </UserProvider>
  </StrictMode>,
);

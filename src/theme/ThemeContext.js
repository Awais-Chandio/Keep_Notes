import React, { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { LightTheme, DarkTheme } from "./theme";

const ThemeContext = createContext({
  theme: LightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme(); // "light" | "dark"
  const [isDark, setIsDark] = useState(systemScheme === "dark");

  const theme = useMemo(() => (isDark ? DarkTheme : LightTheme), [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

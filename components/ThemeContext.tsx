import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeColors {
  bg: string;
  card: string;
  cardAlt: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
}

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
  cardStyle: Record<string, any>;
  inputStyle: Record<string, any>;
}

const THEME_KEY = "app_theme";

const DARK = {
  bg: "#0B0B0D",
  card: "#0F0F12",
  cardAlt: "#18181B",
  text: "#FFFFFF",
  textSecondary: "#A1A1AA",
  textMuted: "#6B7280",
  border: "#27272A",
};

const LIGHT = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  cardAlt: "#F1F5F9",
  text: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  border: "#E2E8F0",
};

const darkCardStyle = {
  backgroundColor: DARK.card,
  borderColor: DARK.border,
  borderWidth: 1,
};

const lightCardStyle = {
  backgroundColor: LIGHT.card,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 3,
  borderWidth: 0,
};

const darkInputStyle = {
  backgroundColor: DARK.cardAlt,
  borderColor: DARK.border,
  borderWidth: 1,
  color: DARK.text,
};

const lightInputStyle = {
  backgroundColor: LIGHT.cardAlt,
  borderColor: LIGHT.border,
  borderWidth: 1,
  color: LIGHT.text,
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  isDark: true,
  toggleTheme: () => {},
  colors: DARK,
  cardStyle: darkCardStyle,
  inputStyle: darkInputStyle,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((val) => {
      if (val === "light" || val === "dark") setTheme(val);
    });
  }, []);

  const toggleTheme = async () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    await AsyncStorage.setItem(THEME_KEY, next);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === "dark",
        toggleTheme,
        colors: theme === "dark" ? DARK : LIGHT,
        cardStyle: theme === "dark" ? darkCardStyle : lightCardStyle,
        inputStyle: theme === "dark" ? darkInputStyle : lightInputStyle,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

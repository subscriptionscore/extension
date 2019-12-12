import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';

import { useUser } from './user-provider';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [{ preferences }, dispatch] = useUser();
  const [theme, setTheme] = useState(initialTheme);

  const initialTheme = preferences.darkMode ? 'dark' : 'light';
  const value = useMemo(() => ({ theme, toggle: onToggle }), [theme, onToggle]);

  const onToggle = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    dispatch({ type: 'save-setting', data: { darkMode: theme === 'dark' } });
  }, [dispatch, theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

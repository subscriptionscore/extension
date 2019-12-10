import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import { useUser } from './user-provider';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [user, dispatch] = useUser();

  const initialTheme = user.settings.darkMode ? 'dark' : 'light';

  const [theme, setTheme] = useState(initialTheme);

  const value = useMemo(() => ({ theme, toggle: onToggle }), [theme, onToggle]);

  // useEffect(() => {

  //   return cleanup() {

  //   }
  // })

  const onToggle = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('toggle theme to:', newTheme);
    setTheme(newTheme);
    dispatch({ type: 'save-setting', data: { darkMode: theme === 'dark' } });
  }, [dispatch, theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

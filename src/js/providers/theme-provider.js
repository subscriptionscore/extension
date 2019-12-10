import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';

const ThemeContext = createContext({
  theme: 'light',
  toggle: () => {}
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // on mount
  useEffect(() => {
    const lsTheme = localStorage.getItem('theme');
    if (lsTheme) {
      console.log('local storage theme', lsTheme);
      setTheme(lsTheme);
    }
  }, []);

  // useEffect(() => {

  //   return cleanup() {

  //   }
  // })

  const onToggle = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('toggle theme to:', newTheme);
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme: theme,
        toggle: () => onToggle()
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

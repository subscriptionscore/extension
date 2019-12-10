import '../../styles/global/layout.scss';
import './app.scss';

import { ThemeProvider, useTheme } from '../providers/theme-provider';

import Layout from './pages/layout';
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  return (
    <ThemeProvider>
      <ThemeContainer />
    </ThemeProvider>
  );
};

const ThemeContainer = () => {
  const { theme } = useTheme();

  return (
    <div className="app-theme-wrapper" data-color-theme={theme}>
      <div className="app-container">
        <Layout />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));

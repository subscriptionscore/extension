import React from 'react';
import ReactDOM from 'react-dom';
import useCurrentUrl from '../hooks/use-current-url';
import DomainScore from './domain-score';

import './reset.scss';

const App = () => {
  const { loading: urlLoading, url } = useCurrentUrl();
  if (urlLoading) {
    return <span>Loading...</span>;
  }
  return <DomainScore url={url} />;
};

ReactDOM.render(<App />, document.querySelector('#root'));

import React from 'react';
import useStorage from '../../../hooks/use-storage';

const PreferencesPage = () => {
  return (
    <>
      <h1>Preferences (from Chrome Sync)</h1>
      <Prefs />
    </>
  );
};

function Prefs() {
  const [{ loading, value: preferences }] = useStorage();
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <p>Color set: {preferences.colorSet}</p>
      <p>Dark mode: {preferences.darkMode ? 'yes' : 'no'}</p>
    </>
  );
}

export default PreferencesPage;

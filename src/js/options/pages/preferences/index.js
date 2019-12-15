import { FormCheckbox, FormInput, InputGroup } from '../../../components/form';
// import Rank from '../../../components/rank';
import React, { useCallback, useState } from 'react';

import Button from '../../../components/button';
import styles from './preferences.module.scss';
import { useUser } from '../../../providers/user-provider';

const PreferencesPage = () => {
  return (
    <>
      <h1>Preferences</h1>
      <Prefs />
    </>
  );
};

function Prefs() {
  const [{ user }, dispatch] = useUser();

  const { alertOnSubmit } = user.preferences;

  const onChange = useCallback(
    (key, value) => {
      dispatch({ type: 'save-preference', data: { [key]: value } });
    },
    [dispatch]
  );

  return (
    <>
      <form>
        <div className={styles.pageSection}>
          <FormCheckbox
            name="alertOnSubmit"
            checked={alertOnSubmit}
            onChange={() => onChange('alertOnSubmit', !alertOnSubmit)}
            label="Alert when submitting forms with email address fields"
          />
        </div>
      </form>
      <div className={styles.pageSection}>
        <h2>Alert slider</h2>
        <p>Only be alerted if the score is below this rank:</p>
      </div>
      <div className={styles.pageSection}>
        <IgnoreForm />
        <IgnoreList />
      </div>
    </>
  );
}

function IgnoreForm() {
  const [{ loading }, dispatch] = useUser();
  const [value, setValue] = useState('');

  const onAddEmail = useCallback(
    email => {
      dispatch({ type: 'add-ignore-alert', data: email });
      setValue('');
    },
    [dispatch]
  );

  return (
    <form
      id="licence-key-form"
      className={styles.form}
      onSubmit={e => {
        e.preventDefault();
        return onAddEmail(value);
      }}
    >
      <h2>Alert Ignore List</h2>
      <p>Don't alert when entering these email addresses into forms</p>
      <InputGroup>
        <FormInput
          name="alertIgnoreList"
          type="email"
          value={value}
          disabled={loading}
          onChange={e => setValue(e.currentTarget.value)}
        />
        <Button
          type="submit"
          as="button"
          disabled={!value || loading}
          loading={loading}
        >
          Add
        </Button>
      </InputGroup>
    </form>
  );
}

const IgnoreList = React.memo(function IgnoreList() {
  const [{ user, loading }, dispatch] = useUser();
  const { alertIgnoreList } = user.preferences;

  const onRemoveEmail = useCallback(
    email => {
      dispatch({ type: 'remove-ignore-alert', data: email });
    },
    [dispatch]
  );

  if (!alertIgnoreList.length) {
    return (
      <p>Email addresses you don't want to be alerted for will show up here</p>
    );
  }
  return (
    <ul className={styles.list}>
      {alertIgnoreList.map(email => (
        <li key={email} className={styles.listItem}>
          <span className={styles.email}>{email}</span>
          <Button
            smaller
            onClick={() => onRemoveEmail(email)}
            disabled={loading}
          >
            x
          </Button>
        </li>
      ))}
    </ul>
  );
});

export default PreferencesPage;

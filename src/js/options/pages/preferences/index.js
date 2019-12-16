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

  const {
    alertOnSubmit,
    ignoredEmailAddresses = [],
    ignoredSites = []
  } = user.preferences;

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
        <h2>Alert Ignore List</h2>
        <p>
          Don't be alerted when submitting forms using these email addresses:
        </p>
        <IgnoreForm
          type="email"
          name="ignoredEmailAddresses"
          onSubmit={email =>
            dispatch({ type: 'add-ignored-email-address', data: email })
          }
        />
        <IgnoredList
          type="Email addresses"
          items={ignoredEmailAddresses}
          onRemove={value =>
            dispatch({ type: 'remove-ignored-email-address', data: value })
          }
        />
      </div>
      <div className={styles.pageSection}>
        <h2>Site Ignore List</h2>
        <p>Don't be alerted when submitting forms on these websites:</p>
        <IgnoreForm
          name="ignoredSites"
          onSubmit={email =>
            dispatch({ type: 'add-ignored-site', data: email })
          }
        />
        <IgnoredList
          type="Websites"
          items={ignoredSites}
          onRemove={value =>
            dispatch({ type: 'remove-ignored-site', data: value })
          }
        />
      </div>
    </>
  );
}

function IgnoreForm({ name, type = 'text', onSubmit }) {
  const [{ loading }] = useUser();
  const [value, setValue] = useState('');

  const submit = useCallback(() => {
    onSubmit(value);
    setValue('');
  }, [onSubmit, value]);

  return (
    <form
      className={styles.form}
      onSubmit={e => {
        e.preventDefault();
        return submit();
      }}
    >
      <InputGroup>
        <FormInput
          name={name}
          type={type}
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

const IgnoredList = React.memo(function IgnoredList({ type, items, onRemove }) {
  const [removing, setRemoving] = useState(false);

  const remove = useCallback(
    email => {
      setRemoving(true);
      onRemove(email);
      setRemoving(false);
    },
    [onRemove]
  );

  if (!items.length) {
    return (
      <p className={styles.listEmpty}>
        {type} you don't want to be alerted for will show up here
      </p>
    );
  }

  return (
    <ul className={styles.list}>
      {items.map(email => (
        <li key={email} className={styles.listItem}>
          <span className={styles.email}>{email}</span>
          <Button smaller onClick={() => remove(email)} disabled={removing}>
            x
          </Button>
        </li>
      ))}
    </ul>
  );
});

export default PreferencesPage;

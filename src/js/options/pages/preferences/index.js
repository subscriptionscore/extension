import { FormCheckbox, FormInput, InputGroup } from '../../../components/form';
// import Rank from '../../../components/rank';
import React, { useCallback, useState } from 'react';

import Button from '../../../components/button';
import styles from './preferences.module.scss';
import { useUser } from '../../../providers/user-provider';
import Radio from '../../../components/radio';
import Rank from '../../../components/rank';

const popupUrl =
  'https://cdn.leavemealone.app/images/subscriptionscore/example-popup.png';

const ranks = ['A+', 'A', 'B', 'C', 'D', 'E', 'F'];
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
    blockedRank = 'C',
    ignoredEmailAddresses = [],
    ignoredSites = [],
    colorSet = 'normal'
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
            label="Show alerts when submitting forms"
          />
          {alertOnSubmit ? null : (
            <div className={styles.helpText}>
              <p>
                We can show you an alert if you are subscribing to a mailing
                list that we think is particulaly bad.
              </p>
              <p>
                When you submit a form that you have entered your email address
                into then we will show you a popup like this;
              </p>
              <img src={popupUrl} alt="Example popup" />
            </div>
          )}
        </div>
      </form>
      <AlertContent
        show={alertOnSubmit}
        blockedRank={blockedRank}
        ignoredEmailAddresses={ignoredEmailAddresses}
        ignoredSites={ignoredSites}
        colorblind={colorSet === 'colorblind'}
        dispatch={dispatch}
      />
    </>
  );
}

function AlertContent({
  show,
  blockedRank,
  ignoredEmailAddresses,
  ignoredSites,
  colorblind,
  dispatch
}) {
  if (!show) {
    return null;
  }
  return (
    <>
      <div className={styles.pageSection}>
        <h2>Alert threshold</h2>
        <div className={styles.helpText}>
          <p>We will only show an alert if the rank is below this value.</p>
        </div>
        {ranks.map(rank => (
          <span key={rank}>
            <Radio
              vertical={true}
              name="blockedRank"
              className={styles.rankRadio}
              checked={blockedRank === rank}
              onChange={({ currentTarget }) => {
                if (currentTarget.checked) {
                  dispatch({
                    type: 'save-preference',
                    data: { blockedRank: rank }
                  });
                }
              }}
            >
              <Rank rank={rank} colorblind={colorblind} />
            </Radio>
          </span>
        ))}
        <div className={styles.helpText}>
          <p>
            An alert will show for sites ranked{' '}
            <strong>
              {blockedRank}
              <span>{blockedRank === 'F' ? null : ' or below'}</span>
            </strong>
            .
          </p>
        </div>
      </div>
      <div className={styles.pageSection}>
        <h2>Ignore Emails</h2>
        <div className={styles.helpText}>
          <p>
            We wont show you alerts if you are signing up with these email
            addresses.
          </p>
        </div>
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
        <h2>Ignore Websites</h2>
        <div className={styles.helpText}>
          <p>We wont show you alerts for form submissions on these websites.</p>
        </div>
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
        {/* {type} you don't want to be alerted for will show up here */}
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

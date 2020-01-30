import { FormCheckbox, FormInput, InputGroup } from '../../../components/form';
import browser from 'browser';
import React, { useCallback, useState } from 'react';

import Button from '../../../components/button';
import Radio from '../../../components/radio';
import Rank from '../../../components/rank';
import styles from './preferences.module.scss';
import { useUser } from '../../../providers/user-provider';

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
  const [
    { user },
    { setPreference, changeEmailIgnoreList, changeSiteIgnoreList }
  ] = useUser();

  const {
    alertOnSubmit,
    blockedRank = 'A',
    ignoredEmailAddresses = [],
    ignoredSites = [],
    colorSet = 'normal',
    autoAllow = true,
    autoAllowTimeout = 10
  } = user.preferences;

  const onChange = useCallback(
    (key, value) => {
      setPreference({ [key]: value });
    },
    [setPreference]
  );

  const requestPermission = useCallback(
    () =>
      browser.permissions.request(
        {
          permissions: [],
          origins: ['<all_urls>']
        },
        granted => {
          // The callback argument will be true if the user granted the permissions.
          if (granted) {
            onChange('alertOnSubmit', !alertOnSubmit);
          }
        }
      ),
    [alertOnSubmit, onChange]
  );

  return (
    <>
      <form>
        <div className={styles.pageSection}>
          <FormCheckbox
            name="alertOnSubmit"
            checked={alertOnSubmit}
            onChange={() => requestPermission()}
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
        colorSet={colorSet}
        autoAllow={autoAllow}
        autoAllowTimeout={autoAllowTimeout}
        setPreference={setPreference}
        changeEmailIgnoreList={changeEmailIgnoreList}
        changeSiteIgnoreList={changeSiteIgnoreList}
      />
    </>
  );
}

function AlertContent({
  show,
  blockedRank,
  ignoredEmailAddresses,
  ignoredSites,
  colorSet,
  autoAllow,
  autoAllowTimeout,
  setPreference,
  changeEmailIgnoreList,
  changeSiteIgnoreList
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
        <div className={styles.radios}>
          {ranks.map(rank => (
            <Radio
              key={rank}
              vertical={true}
              name="blockedRank"
              className={styles.rankRadio}
              checked={blockedRank === rank}
              onChange={({ currentTarget }) => {
                if (currentTarget.checked) {
                  setPreference({ blockedRank: rank });
                }
              }}
            >
              <Rank rank={rank} colorblind={colorSet === 'colorblind'} />
            </Radio>
          ))}
        </div>
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
        <h2>Form submission</h2>
        <p>We will automatically submit the form after the popup is shown.</p>
        <div className={styles.formGroup}>
          <FormCheckbox
            name="autoAllow"
            checked={autoAllow}
            onChange={() => setPreference({ autoAllow: !autoAllow })}
            label={`Automatically allow after ${autoAllowTimeout} seconds`}
          />
        </div>
        {!autoAllow ? null : (
          <div className={styles.formGroup}>
            <FormInput
              name={name}
              label="Seconds until auto submission"
              type="number"
              min="1"
              max="60"
              step="1"
              value={autoAllowTimeout}
              onChange={({ currentTarget }) => {
                setPreference({ autoAllowTimeout: +currentTarget.value });
              }}
            />
            <span className={styles.help}>Between 1 and 60 seconds</span>
          </div>
        )}
      </div>
      <div className={styles.pageSection}>
        <h2>Ignore emails</h2>
        <div className={styles.helpText}>
          <p>
            We wont show you alerts if you are signing up with these email
            addresses.
          </p>
        </div>
        <IgnoreForm
          type="email"
          name="ignoredEmailAddresses"
          onSubmit={email => changeEmailIgnoreList('add', email)}
        />
        <IgnoredList
          type="Email addresses"
          items={ignoredEmailAddresses}
          onRemove={value => changeEmailIgnoreList('remove', value)}
        />
      </div>
      <div className={styles.pageSection}>
        <h2>Ignore websites</h2>
        <div className={styles.helpText}>
          <p>We wont show you alerts for form submissions on these websites.</p>
        </div>
        <IgnoreForm
          name="ignoredSites"
          onSubmit={site => changeSiteIgnoreList('add', site)}
        />
        <IgnoredList
          type="Websites"
          items={ignoredSites}
          onRemove={site => changeSiteIgnoreList('remove', site)}
        />
      </div>
    </>
  );
}

function IgnoreForm({ name, type = 'text', onSubmit }) {
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
          onChange={e => setValue(e.currentTarget.value)}
        />
        <Button type="submit" as="button" disabled={!value}>
          Add
        </Button>
      </InputGroup>
      {name === 'ignoredSites' ? (
        <span className={styles.help}>
          Just domain part - e.g. linkedin.com or facebook.com
        </span>
      ) : null}
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

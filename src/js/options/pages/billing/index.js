import { FormError, FormInput } from '../../../components/form';
import React, { useMemo, useState } from 'react';

import Button from '../../../components/button';
import styles from './billing.module.scss';
import { useUser } from '../../../providers/user-provider';

const BillingPage = () => {
  return (
    <>
      <h1>Billing</h1>
      <LicenceKey />
    </>
  );
};

function LicenceKey() {
  const [{ user, loading, initialised, error }, dispatch] = useUser();
  const { licenceKey, email } = user;

  const [value, setValue] = useState('');
  const content = useMemo(() => {
    // settings havent been fetched from storage yet
    if (!initialised) {
      return <p>Loading...</p>;
    }

    if (licenceKey) {
      return (
        <div>
          <p>
            Licence key: <span className={styles.key}>{licenceKey}</span>
          </p>
          <p>
            Email address: <span className={styles.key}>{email}</span>
          </p>
        </div>
      );
    }

    const onSave = async () => {
      dispatch({ type: 'set-licence-key', data: value });
    };
    return (
      <>
        <form
          id="licence-key-form"
          className={styles.form}
          onSubmit={e => {
            e.preventDefault();
            return onSave();
          }}
        >
          <p>Enter licence key...</p>
          <div className={styles.inputContainer}>
            <FormInput
              name="licenceKey"
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
              Save
            </Button>
          </div>
          {error ? <FormError>{error}</FormError> : null}
        </form>
        <p>
          Need a licence key? Purchase one{' '}
          <a href="https://subscriptionscore.com">on our website</a>.
        </p>
      </>
    );
  }, [dispatch, email, error, initialised, licenceKey, loading, value]);

  return content;
}

export default BillingPage;

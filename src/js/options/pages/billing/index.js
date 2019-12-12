import React, { useMemo, useState } from 'react';

import Button from '../../../components/button';
import { FormInput } from '../../../components/form';
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
  const [{ licenceKey, email }, dispatch] = useUser();
  const [newLicenceKey, setNewLicenceKey] = useState('');

  const content = useMemo(() => {
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

    const onSave = () => {
      dispatch({ type: 'set-licence-key', data: newLicenceKey });
    };
    return (
      <form
        id="licence-key-form"
        onSubmit={e => {
          e.preventDefault();
          return onSave();
        }}
      >
        <p>Enter licence key...</p>
        <div className={styles['input-container']}>
          <FormInput
            name="licenceKey"
            value={newLicenceKey}
            onChange={e => setNewLicenceKey(e.currentTarget.value)}
          />
          <Button type="submit" as="button" disabled={!newLicenceKey}>
            Save
          </Button>
        </div>
      </form>
    );
  }, [dispatch, email, licenceKey, newLicenceKey]);

  return content;
}

export default BillingPage;

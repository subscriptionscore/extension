import React, { useMemo, useState } from 'react';

import Button from '../../../components/button';
import { FormInput } from '../../../components/form';
import styles from './billing.module.scss';
import { useUser } from '../../../providers/user-provider';

const BillingPage = () => {
  return (
    <>
      <h1>Billing</h1>
      <LicenseKey />
    </>
  );
};

function LicenseKey() {
  const [{ licenseKey }, dispatch] = useUser();
  const [val, setVal] = useState('');

  const content = useMemo(() => {
    if (licenseKey) {
      return (
        <p>
          License key: <span className={styles.key}>{licenseKey}</span>
        </p>
      );
    }

    const onSave = () => {
      dispatch({ type: 'set-license-key', data: val });
    };
    return (
      <form
        id="license-key-form"
        onSubmit={e => {
          e.preventDefault();
          return onSave();
        }}
      >
        <p>Enter license key...</p>
        <div className={styles['input-container']}>
          <FormInput
            name="licenseKey"
            value={val}
            onChange={e => setVal(e.currentTarget.value)}
          />
          <Button type="submit" as="button" disabled={!val}>
            Save
          </Button>
        </div>
      </form>
    );
  }, [dispatch, licenseKey, val]);

  return content;
}

export default BillingPage;

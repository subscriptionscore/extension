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
  const [{ licenceKey }, dispatch] = useUser();
  const [val, setVal] = useState('');

  const content = useMemo(() => {
    if (licenceKey) {
      return (
        <p>
          Licence key: <span className={styles.key}>{licenceKey}</span>
        </p>
      );
    }

    const onSave = () => {
      dispatch({ type: 'set-licence-key', data: val });
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
            value={val}
            onChange={e => setVal(e.currentTarget.value)}
          />
          <Button type="submit" as="button" disabled={!val}>
            Save
          </Button>
        </div>
      </form>
    );
  }, [dispatch, licenceKey, val]);

  return content;
}

export default BillingPage;

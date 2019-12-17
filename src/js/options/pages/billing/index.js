import { FormInput, InputGroup } from '../../../components/form';
import React, { useMemo, useState } from 'react';

import Button from '../../../components/button';
import { TextLink } from '../../../components/text';
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
  const [{ user, initialised }, dispatch] = useUser();
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
          <InputGroup>
            <FormInput
              name="licenceKey"
              value={value}
              onChange={e => setValue(e.currentTarget.value)}
              className={styles.licenceInput}
            />
            <Button type="submit" as="button" disabled={!value}>
              Save
            </Button>
          </InputGroup>
        </form>
        <p>
          Need a licence key? Purchase one{' '}
          <TextLink href="https://subscriptionscore.com">
            on our website
          </TextLink>
          .
        </p>
      </>
    );
  }, [dispatch, email, initialised, licenceKey, value]);

  return content;
}

export default BillingPage;

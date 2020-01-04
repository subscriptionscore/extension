import { FormInput, InputGroup } from '../../../components/form';
import React, { useMemo, useState } from 'react';

import Button from '../../../components/button';
import { TextLink } from '../../../components/text';
import styles from './billing.module.scss';
import { useUser } from '../../../providers/user-provider';

const toolbarUrl =
  'https://cdn.leavemealone.app/images/subscriptionscore/example-toolbar.png';
const popupUrl =
  'https://cdn.leavemealone.app/images/subscriptionscore/example-popup.png';

const BillingPage = ({ showWelcome }) => {
  const content = useMemo(() => {
    if (showWelcome) {
      return (
        <>
          <h1>Welcome!</h1>
          <div className={styles.pageSection}>
            <LicenceKeyForm />
          </div>
          <div className={styles.pageSection}>
            <p>Thanks for downloading Subscription Score!</p>
            <p>
              For each webpage you visit we will check our score database and
              show you the statistics of the emails that are sent from that
              domain.
            </p>

            <div className={styles.blocks}>
              <p>
                We grade each website from <strong>A+</strong> to{' '}
                <strong>F</strong>, and this grade will appear in your toolbar
                like this.
              </p>
              <img
                className={styles.toolbarImg}
                src={toolbarUrl}
                alt="Toolbar example"
              />
              <p>
                Clicking the toolbar icon will show you a summary of the current
                page.
              </p>
            </div>
            <div className={styles.blocks}>
              <p>
                Each time you submit an email capture form we can also show you
                a warning about the mailing list you are signing up for.
              </p>
              <img
                className={styles.popupImg}
                src={popupUrl}
                alt="Popup example"
              />
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <h1>Billing</h1>

        <LoggedInContent />
      </>
    );
  }, [showWelcome]);
  return content;
};

function LoggedInContent() {
  const [{ user, initialized }] = useUser();
  const { licenceKey, email, planName } = user;

  const content = useMemo(() => {
    // settings havent been fetched from storage yet
    if (!initialized) {
      return <p>Loading...</p>;
    }

    let planContent;
    if (!planName) {
      planContent = (
        <>
          <p>Your account has been activated for free!</p>
          <p>
            Please share Subscription Score to spread the word and help us grow
            :)
          </p>
        </>
      );
    } else {
      planContent = (
        <>
          <p>
            You are subscribed to the{' '}
            <span className={styles.key}>{planName} plan</span>
          </p>
          <p>
            Please{' '}
            <TextLink href="mailto:hello@subscriptionscore.com">
              contact us
            </TextLink>{' '}
            to make changes to or cancel your plan.
          </p>
        </>
      );
    }

    return (
      <>
        <div className={styles.pageSection}>
          <p>
            Licence key: <span className={styles.key}>{licenceKey}</span>
          </p>
          <p>
            Email address: <span className={styles.key}>{email}</span>
          </p>
        </div>
        <div className={styles.pageSection}>
          <h2>Plan</h2>
          {planContent}
        </div>
      </>
    );
  }, [email, initialized, licenceKey, planName]);

  return content;
}

function LicenceKeyForm() {
  const [, { setLicenceKey }] = useUser();
  const [value, setValue] = useState('');

  const onSave = async () => {
    setLicenceKey(value);
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
        <TextLink href="https://subscriptionscore.com">on our website</TextLink>
        .
      </p>
    </>
  );
}

export default BillingPage;

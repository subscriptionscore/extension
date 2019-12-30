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
            <LicenceKey />
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
        <div className={styles.pageSection}>
          <LicenceKey />
        </div>
        <div className={styles.pageSection}>
          <p>
            Enjoying Subscription Score? Take a look at some of our other email
            products...{' '}
          </p>
          <p>
            🙅‍♀️{' '}
            <TextLink href="https://leavemealone.app?ref=ss_plugin">
              Leave Me Alone App
            </TextLink>{' '}
            lets you see all of the subscription emails in your inbox together
            in one place, and unsubscribe from them with a single click.
          </p>
        </div>
      </>
    );
  }, [showWelcome]);
  return content;
};

function LicenceKey() {
  const [{ user, initialized }, { setLicenceKey }] = useUser();
  const { licenceKey, email } = user;

  const [value, setValue] = useState('');
  const content = useMemo(() => {
    // settings havent been fetched from storage yet
    if (!initialized) {
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
          <TextLink href="https://subscriptionscore.com">
            on our website
          </TextLink>
          .
        </p>
      </>
    );
  }, [email, initialized, licenceKey, setLicenceKey, value]);

  return content;
}

export default BillingPage;

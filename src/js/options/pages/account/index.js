import { FormInput, InputGroup } from '../../../components/form';
import React, { useCallback, useMemo, useState } from 'react';

import Button from '../../../components/button';
import CopyButton from '../../../components/copy-to-clipboard';
import { HelpContent } from '../help';
import InviteForm from './invite';
import { TextLink } from '../../../components/text';
import { TwitterIcon } from '../../../components/icons';
import { shareOnTwitter } from '../../../utils/social';
import styles from './account.module.scss';
import useGraphQl from '../../../hooks/use-graphql';
import { useUser } from '../../../providers/user-provider';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
];
const formatDate = d => {
  const date = new Date(d);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const paddedDay = day < 10 ? `0${day}` : day;

  return `${paddedDay} ${month} ${year}`;
};

const AccountPage = ({ showWelcome, onSetPage }) => {
  const content = useMemo(() => {
    if (showWelcome) {
      return (
        <div className={styles.accountPage}>
          <h1>Welcome!</h1>
          <div className={styles.pageSection}>
            <p>Thanks for downloading Subscription Score!</p>
            <p>
              For each webpage you visit we will{' '}
              <strong>
                check our score database and show you the statistics of the
                emails
              </strong>{' '}
              that are sent from that domain.
            </p>
            <p>
              Check out how it works below or on the{' '}
              <TextLink onClick={() => onSetPage('help')}>help page</TextLink>.
            </p>
            <LicenceKeyForm />
          </div>
          <h2 className={styles.subtitle}>How it works</h2>
          <HelpContent />
        </div>
      );
    }

    return (
      <>
        <h1>Account</h1>
        <Billing />
        <div className={styles.pageSection}>
          <Referral />
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
  }, [onSetPage, showWelcome]);
  return content;
};

function Referral() {
  const [{ user }, { setSuccess }] = useUser();
  const { referralCode, referralCount } = user;

  const referralUrl = `https://subscriptionscore.com/r/${referralCode}`;

  const tweetText = `I've been using this new browser extension to protect myself from spammy mailing lists! 💌 ${referralUrl}`;

  const onClickTweet = useCallback(() => {
    try {
      shareOnTwitter(tweetText);
    } catch (err) {
      console.error(err);
    }
  }, [tweetText]);

  return (
    <div>
      <h2>Refer</h2>
      <p>
        Get <strong>1 month free</strong> for every friend you invite that signs
        up to Subscription Score.
      </p>

      <p>
        You have referred{' '}
        <strong>
          {referralCount} {referralCount === 1 ? 'person' : 'people'}
        </strong>
        {referralCount > 0 ? (
          <span> - that's {referralCount} months free!</span>
        ) : (
          <span>- start sharing your referral link!</span>
        )}
      </p>

      <InviteForm onSuccess={() => setSuccess(`Invite sent!`)} />

      <div className={styles.btnGroup}>
        <CopyButton string={referralUrl}>Copy referral link</CopyButton>
        <Button onClick={onClickTweet}>
          <TwitterIcon /> Share on Twitter
        </Button>
      </div>
    </div>
  );
}

const gql = `
query {
  getUserPlan {
    id
    upcomingInvoiceDate
    upcomingInvoiceAmount
  }
}`;
function Plan() {
  const options = useMemo(
    () => ({
      variables: {}
    }),
    []
  );
  const { loading, value, error } = useGraphQl(gql, options);

  const content = useMemo(() => {
    if (loading) {
      return <p>Loading...</p>;
    }
    if (error) {
      return (
        <p>Failed to get plan details, please try again or contact support.</p>
      );
    }

    const { upcomingInvoiceDate, upcomingInvoiceAmount } = value.getUserPlan;

    return (
      <>
        <p>
          You will next be billed{' '}
          <span className={styles.key}>
            ${(upcomingInvoiceAmount / 100).toFixed(2)}
          </span>{' '}
          on the{' '}
          <span className={styles.key}>{formatDate(upcomingInvoiceDate)}</span>.
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
  }, [loading, value, error]);

  return content;
}

function Billing() {
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
          <Plan />
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
        {/* <p>Enter licence key...</p> */}
        <InputGroup>
          <FormInput
            name="licenceKey"
            label="Enter licence key..."
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

export default AccountPage;

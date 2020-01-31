import React from 'react';
import { TextLink } from '../../../components/text';
import styles from './help.module.scss';

const toolbarImgUrl =
  'https://cdn.leavemealone.app/images/subscriptionscore/example-toolbar-new.png';
const popupImgUrl =
  'https://cdn.leavemealone.app/images/subscriptionscore/example-popup-new.png';
const gmailImgUrl =
  'https://cdn.leavemealone.app/images/subscriptionscore/example-gmail-new.png';

const HelpPage = ({ onSetPage }) => {
  return (
    <div className={styles.help}>
      <h1>How it works</h1>
      <HelpContent onSetPage={onSetPage} />
    </div>
  );
};

export const HelpContent = ({ onSetPage }) => {
  return (
    <>
      <div className={styles.pageSection}>
        <p>
          For each webpage you visit we will{' '}
          <strong>
            check our score database and show you the statistics of the emails
          </strong>{' '}
          that are sent from that domain.
        </p>
      </div>
      <div className={styles.pageSection}>
        <h2>See scores for every email address you encounter</h2>
        <p>
          We grade each website from <strong>A+</strong> to <strong>F</strong>,
          and this grade will appear in your toolbar like this.
        </p>
        <p>
          See the rank by glancing at the icon. Click the toolbar icon for a
          summary of the current page.
        </p>
        <img
          className={styles.toolbarImg}
          src={toolbarImgUrl}
          alt="Example website score shown from clicking on the toolbar icon"
        />
      </div>

      <div className={styles.pageSection}>
        <h2>Receive alerts every time you're at risk</h2>
        <p>
          Each time you submit an email capture form we can also show you a
          warning about the mailing list you are signing up for.
        </p>
        <p>
          Set your alert threshold and control which sites and email addresses
          to be warned for in the{' '}
          <TextLink onClick={() => onSetPage('preferences')}>
            preferences
          </TextLink>{' '}
          settings.
        </p>
        <img
          className={styles.popupImg}
          src={popupImgUrl}
          alt="Example alert showing a warning for a spammy mailing list"
        />
      </div>

      <div className={styles.pageSection}>
        <h2>See scores in your inbox</h2>
        <p>
          Get mailing list scores right in your Gmail inbox so that you can see
          what emails are worth holding onto.
        </p>
        <p>
          Enable this setting in the{' '}
          <TextLink onClick={() => onSetPage('preferences')}>
            preferences
          </TextLink>{' '}
          settings.
        </p>
        <img
          className={styles.gmailImg}
          src={gmailImgUrl}
          alt="Gmail inbox showing mailing lists ranked from A-F"
        />
      </div>
    </>
  );
};

export default HelpPage;

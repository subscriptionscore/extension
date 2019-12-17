import React from 'react';
import { TextLink } from '../../../components/text';
import styles from './about.module.scss';

const teamImage =
  'https://cdn.leavemealone.app/images/subscriptionscore/about-us.png';

const AboutPage = () => {
  return (
    <div className={styles.about}>
      <h1>About</h1>
      <div className={styles.pageSection}>
        <h2>Our mission.</h2>
        <p>
          Helping people to <strong>keep</strong> control of their inbox.
        </p>
        <p>
          We're are passionate about helping reduce the impact of unwanted
          emails on the world.
        </p>
        <p>
          When we first began investigating how we could make a difference we
          were amazed to discover that the majority of unwanted emails were from
          mailing lists which had been subscribed to intentionally.
        </p>
        <p>
          Usually these types of emails wouldn't be considered spam, which makes
          them difficult to filter out. We set out to solve this problem by
          providing three things;
        </p>
        <ul>
          <li>a way to see all spam, newsletters, and subscription emails</li>
          <li>
            a way to unsubscribe (not filter out) and get rid of those emails
            forever
          </li>
          <li>a way to avoid subscribing to bad mailing lists</li>
        </ul>
        <p>
          <TextLink href="https://leavemealone.app">Leave Me Alone</TextLink>{' '}
          was born to help solve the first two problems. While{' '}
          <TextLink href="subscriptionscore.com">Subscription Score</TextLink>{' '}
          addresses the third.
        </p>
      </div>

      <div className={styles.pageSection}>
        <h2>Who are we?</h2>
        <div className={styles.block}>
          <div className={styles.left}>
            <p>
              Hey! 👋 We're Danielle and James, a couple of independent
              developers.
            </p>
            <p>
              We work on products that help people because it's rewarding and we
              love it, which we think is a good reason to do just about
              anything!
            </p>
            <p>
              We're building Leave Me Alone & Subscription Score on our own
              without funding or outside support. We're real people looking to
              help you, and others like you. ❤️
            </p>
          </div>
          <img
            className={styles.image}
            title="Image of Danielle and James"
            src={teamImage}
          />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

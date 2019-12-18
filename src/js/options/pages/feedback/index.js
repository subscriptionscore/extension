import {
  FormCheckbox,
  FormInput,
  FormTextarea
} from '../../../components/form';
import React, { useEffect, useReducer } from 'react';
import reducer, { initialState } from './reducer';

import Button from '../../../components/button';
import Radio from '../../../components/radio';
import styles from './feedback.module.scss';
import { useUser } from '../../../providers/user-provider';
import { TextLink } from '../../../components/text';

const FeedbackPage = ({ params }) => {
  return (
    <>
      <h1>Feedback</h1>
      <p>
        Something wrong with a score? Please use this form to submit
        corrections.
      </p>

      <Form domain={params.domain} />
      <p>
        Have more general comments, bugs or other feedback? Please{' '}
        <TextLink href="https://subscriptionscore.com/feedback">
          use the form here
        </TextLink>
        .
      </p>
    </>
  );
};

const Form = ({ domain }) => {
  const [{ feedback, loading, submitted, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const [, userDispatch] = useUser();

  useEffect(() => {
    if (domain) {
      dispatch({ type: 'set-domain', data: domain });
    }
  }, [domain]);

  useEffect(() => {
    if (submitted) {
      userDispatch({
        type: 'set-success',
        data: `Feedback received - thank you for helping us to improve Subscription Score!`
      });
    }
    if (error) {
      userDispatch({
        type: 'set-error',
        data: `Something went wrong submitting your feedback, please try again or contact support.`
      });
    }
  }, [submitted, error, userDispatch]);

  const onSave = async () => {
    console.log('submit feeback', feedback);
    try {
      dispatch({ type: 'set-loading', data: true });
      dispatch({ type: 'set-error', data: false });

      await submitFeedback(feedback);

      dispatch({ type: 'set-submitted', data: true });
      dispatch({ type: 'reset' });
    } catch (err) {
      dispatch({ type: 'set-error', data: err });
    } finally {
      dispatch({ type: 'set-loading', data: false });
    }
  };

  return (
    <form
      id="feeback-form"
      className={styles.form}
      onSubmit={e => {
        e.preventDefault();
        return onSave();
      }}
    >
      <div className={styles.pageSection}>
        <div className={styles.formGroup}>
          <FormInput
            name="domain"
            value={feedback.domain}
            label="Domain (required)"
            required
            onChange={e =>
              dispatch({ type: 'set-domain', data: e.currentTarget.value })
            }
            disabled={loading}
          />
          <span className={styles.help}>
            Just domain part - e.g. linkedin.com or facebook.com
          </span>
        </div>

        <div className={styles.formGroup}>
          <FormCheckbox
            name="isOwner"
            checked={feedback.isOwner}
            onChange={() =>
              dispatch({ type: 'set-is-owner', data: !feedback.isOwner })
            }
            label="I am the owner of this domain"
            disabled={loading}
          />
        </div>

        {feedback.isOwner ? (
          <div className={styles.formGroup}>
            <FormInput
              name="ownerEmail"
              type="email"
              value={feedback.ownerEmail}
              label="Your email (required)"
              required
              onChange={e =>
                dispatch({
                  type: 'set-owner-email',
                  data: e.currentTarget.value
                })
              }
              disabled={loading}
            />
          </div>
        ) : null}

        <div className={styles.formGroup}>
          <FormCheckbox
            name="isScoreInaccurate"
            checked={feedback.isScoreInaccurate}
            onChange={() =>
              dispatch({
                type: 'set-is-score-inaccurate',
                data: !feedback.isScoreInaccurate
              })
            }
            label="The score is inaccurate"
            disabled={loading}
          />
        </div>
        {feedback.isScoreInaccurate ? (
          <div className={styles.formGroup}>
            <p>What is inaccurate about the score?</p>
            <Radio
              className={styles.radio}
              name="score-inaccurate-reason"
              checked={feedback.scoreInaccurateReason === 'low'}
              onChange={() =>
                dispatch({ type: 'set-score-inaccurate-reason', data: 'low' })
              }
              disabled={loading}
            >
              <span>Too low</span>
            </Radio>

            <Radio
              className={styles.radio}
              name="score-inaccurate-reason"
              checked={feedback.scoreInaccurateReason === 'high'}
              onChange={() =>
                dispatch({ type: 'set-score-inaccurate-reason', data: 'high' })
              }
              disabled={loading}
            >
              <span>Too high</span>
            </Radio>
          </div>
        ) : null}

        <div className={styles.formGroup}>
          <FormTextarea
            name="otherDetails"
            value={feedback.otherDetails}
            label="Please provide any other information to help us"
            onChange={e =>
              dispatch({
                type: 'set-other-details',
                data: e.currentTarget.value
              })
            }
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          as="button"
          disabled={!feedback.domain || loading}
          loading={loading}
        >
          Submit feedback
        </Button>
      </div>
    </form>
  );
};

const submitFeedbackGql = `
mutation Feedback($licenceKey: ID!, $preferences: Preferences!) {
  updateUserPreferences(licenceKey: $licenceKey, preferences: $preferences) {
    preferences {
      darkMode
      colorSet
      alertOnSubmit
      ignoredEmailAddresses
      ignoredSites
      blockedRank
    }
  }
}
`;

function submitFeedback() {
  return new Promise(resolve =>
    setTimeout(() => {
      return resolve();
    }, 2000)
  );
  // return graphqlRequest(query, options);
}

export default FeedbackPage;

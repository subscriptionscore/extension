import {
  FormCheckbox,
  FormInput,
  FormTextarea
} from '../../../components/form';
import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import reducer, { initialState } from './reducer';

import Button from '../../../components/button';
import Radio from '../../../components/radio';
import { TextLink } from '../../../components/text';
import { graphqlRequest } from '../../../utils/request';
import styles from './feedback.module.scss';
import { useUser } from '../../../providers/user-provider';

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
  const [, { setSuccess, setError }] = useUser();

  useEffect(() => {
    if (domain) {
      dispatch({ type: 'set-domain', data: domain });
    }
  }, [domain]);

  useEffect(() => {
    if (submitted) {
      setSuccess(
        `Feedback received - thank you for helping us to improve Subscription Score!`
      );
    }
    if (error) {
      setError(
        `Something went wrong submitting your feedback, please try again or contact support.`
      );
    }
  }, [submitted, error, setSuccess, setError]);

  const onSave = useCallback(async feedbackData => {
    try {
      dispatch({ type: 'set-loading', data: true });

      const {
        domain,
        isOwner,
        ownerEmail,
        isScoreInaccurate,
        scoreInaccurateReason,
        otherDetails
      } = feedbackData;

      let data = {
        otherDetails
      };
      if (isOwner) {
        data = {
          ...data,
          ownerEmail
        };
      }
      if (isScoreInaccurate) {
        data = {
          ...data,
          scoreInaccurateReason
        };
      }

      await submitFeedback(domain, data);
      await new Promise(resolve => {
        return setTimeout(() => {
          dispatch({ type: 'set-submitted', data: true });
          resolve();
        }, 2000);
      });
    } catch (err) {
      dispatch({ type: 'set-error', data: err });
    }
  }, []);

  const isValid = useMemo(() => {
    const {
      domain,
      isOwner,
      ownerEmail,
      isScoreInaccurate,
      scoreInaccurateReason,
      otherDetails
    } = feedback;

    const ownerDets = isOwner && !!ownerEmail;
    const inaccurateDets = isScoreInaccurate && !!scoreInaccurateReason;

    const isValid = !!domain && (ownerDets || inaccurateDets || !!otherDetails);
    return isValid;
  }, [feedback]);

  return (
    <form
      id="feeback-form"
      className={styles.form}
      onSubmit={e => {
        e.preventDefault();
        return onSave(feedback);
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
            <p>What is inaccurate about the score? (required)</p>
            <Radio
              className={styles.radio}
              name="score-inaccurate-reason"
              value="low"
              checked={feedback.scoreInaccurateReason === 'low'}
              onChange={() =>
                dispatch({ type: 'set-score-inaccurate-reason', data: 'low' })
              }
              disabled={loading}
              required
            >
              <span>Too low</span>
            </Radio>

            <Radio
              className={styles.radio}
              name="score-inaccurate-reason"
              value="high"
              checked={feedback.scoreInaccurateReason === 'high'}
              onChange={() =>
                dispatch({ type: 'set-score-inaccurate-reason', data: 'high' })
              }
              disabled={loading}
              required
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
          disabled={!isValid || loading}
          loading={loading}
        >
          Submit feedback
        </Button>
      </div>
    </form>
  );
};

const submitFeedbackGql = `
mutation Feedback($domain: String!, $feedback: Feedback!) {
  addFeedback(domain: $domain, feedback: $feedback) {
    success
  }
}
`;

async function submitFeedback(domain, data) {
  const options = {
    variables: {
      domain,
      feedback: data
    }
  };
  const { addFeedback } = await graphqlRequest(submitFeedbackGql, options);
  return addFeedback;
}

export default FeedbackPage;

import {
  FormCheckbox,
  FormInput,
  FormTextarea
} from '../../../components/form';
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useContext
} from 'react';
import reducer, { initialState } from './reducer';

import Button from '../../../components/button';
import Radio from '../../../components/radio';
import { TextLink } from '../../../components/text';
import { Arrow as ArrowIcon } from '../../../components/icons';
import { graphqlRequest } from '../../../utils/request';
import styles from './feedback.module.scss';
import { useUser } from '../../../providers/user-provider';

const FeedbackContext = createContext(null);

const FeedbackPage = ({ params }) => {
  const [view, setView] = useState('select');

  const [, { setSuccess, setError }] = useUser();

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (params.domain) {
      dispatch({ type: 'set-domain', data: params.domain });
    }
  }, [params.domain]);

  useEffect(() => {
    if (state.submitted) {
      setSuccess(
        `Feedback received - thank you for helping us to improve Subscription Score!`
      );
    }
    if (state.error) {
      setError(
        `Something went wrong submitting your feedback, please try again or contact support.`
      );
    }
  }, [state.submitted, state.error, setSuccess, setError]);

  const onSubmit = useCallback(async () => {
    try {
      dispatch({ type: 'set-loading', data: true });

      const {
        domain,
        isOwner,
        ownerEmail,
        scoreInaccurateReason,
        otherDetails
      } = state.feedback;

      let data = {
        otherDetails
      };

      if (isOwner) {
        data = {
          ...data,
          ownerEmail
        };
      }
      data = {
        ...data,
        scoreInaccurateReason
      };

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
  }, [state.feedback]);

  const onChangeView = useCallback(name => {
    setView(name);
  }, []);
  const onBack = useCallback(() => {
    setView('select');
  }, []);

  const value = useMemo(() => [state, dispatch], [state, dispatch]);

  const content = useMemo(() => {
    if (view === 'select') {
      return (
        <div className={styles.select}>
          <div
            className={styles.option}
            onClick={() => onChangeView('score-inaccurate')}
          >
            Score is too high or too low
          </div>

          <div
            className={styles.option}
            onClick={() => onChangeView('wrong-website')}
          >
            A score is showing for the wrong website
          </div>

          <div className={styles.option} onClick={() => onChangeView('other')}>
            Something else
          </div>
        </div>
      );
    }
    if (view === 'score-inaccurate') {
      return <DomainForm onSubmit={onSubmit} onBack={onBack} />;
    }
    if (view === 'wrong-website') {
      return <ContributeForm onBack={onBack} />;
    }
    if (view === 'other') {
      return <OtherForm onSubmit={onSubmit} onBack={onBack} />;
    }
  }, [onChangeView, onSubmit, view, onBack]);

  return (
    <FeedbackContext.Provider value={value}>
      <h1>Feedback</h1>
      <p>
        Something wrong with a score? Please use this form to submit
        corrections.
      </p>

      {content}

      <p>
        Have more general comments, bugs or other feedback? Please{' '}
        <TextLink href="https://subscriptionscore.com/feedback">
          use the form here
        </TextLink>
        .
      </p>
    </FeedbackContext.Provider>
  );
};

const DomainForm = ({ onSubmit, onBack }) => {
  const [state, dispatch] = useContext(FeedbackContext);
  const { feedback, loading } = state;

  const isValid = useMemo(() => {
    const {
      domain,
      isOwner,
      ownerEmail,
      scoreInaccurateReason
    } = state.feedback;

    if (isOwner && !ownerEmail) return false;
    return !!domain && !!scoreInaccurateReason;
  }, [state.feedback]);

  return (
    <form
      id="feeback-form"
      className={styles.form}
      onSubmit={e => {
        e.preventDefault();
        return onSubmit();
      }}
    >
      <div className={styles.pageSection}>
        <h2>
          Score is too high or too low <ArrowIcon />
        </h2>
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

        <div className={styles.buttons}>
          <Button
            type="submit"
            as="button"
            disabled={!isValid || loading}
            loading={loading}
          >
            Submit feedback
          </Button>
          <Button muted onClick={onBack}>
            Back
          </Button>
        </div>
      </div>
    </form>
  );
};

const ContributeForm = ({ onBack }) => {
  const aliasUrl = 'https://github.com/subscriptionscore/alias-list';
  return (
    <div className={styles.pageSection}>
      <h2>
        A score is showing for the wrong website <ArrowIcon />
      </h2>
      <p>
        Sometimes mailing lists are sent from different domains than the ones
        used for the public website, for example <strong>facebook.com</strong>{' '}
        sends emails from <strong>facebookmail.com</strong>.
      </p>
      <p>
        We provide a public list of aliases such as this so that we can link
        these domains together. If you're seeing this kind of problem then you
        can <TextLink href={aliasUrl}>contribute to this list here</TextLink>.
      </p>
      <div className={styles.buttons}>
        <Button as="a" href={aliasUrl} target="_">
          Contribute
        </Button>
        <Button muted onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
};

const OtherForm = ({ onSubmit, onBack }) => {
  const [state, dispatch] = useContext(FeedbackContext);
  const { feedback, loading } = state;

  return (
    <form
      id="feeback-form"
      className={styles.form}
      onSubmit={e => {
        e.preventDefault();
        return onSubmit();
      }}
    >
      <div className={styles.pageSection}>
        <h2>
          Other feedback <ArrowIcon />
        </h2>
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

        <div className={styles.buttons}>
          <Button
            type="submit"
            as="button"
            disabled={!feedback.otherDetails || loading}
            loading={loading}
          >
            Submit feedback
          </Button>
          <Button muted onClick={onBack}>
            Back
          </Button>
        </div>
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

async function submitFeedback(url, data) {
  let domain = url;
  if (/^http(s)?/.test(url)) {
    domain = new URL(url).hostname;
  }
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

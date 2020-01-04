import React, { useState, useCallback, useRef, useEffect } from 'react';

import styles from './emails.module.scss';
import { useUser } from '../../../providers/user-provider';
import Button from '../../../components/button';
import { Arrow } from '../../../components/icons';
import EmailsList from './list';

const EmailsPage = () => {
  const [{ user }, { createEmail, deleteEmail, setEmailStatus }] = useUser();
  const { emails, email } = user;
  return (
    <>
      <h1>Emails</h1>
      <p>
        All emails sent to a{' '}
        <strong className="email">@leavemealone.email</strong> address will be
        automatically filtered for spam and subscription emails, and the rest
        will be forwarded to your regular email address.
      </p>
      {emails.length ? (
        <EmailsList
          emails={emails}
          deleteEmail={deleteEmail}
          setEmailStatus={setEmailStatus}
        />
      ) : (
        <EmptyState email={email} createEmail={createEmail} />
      )}
    </>
  );
};

function EmptyState({ email = 'example@gmail.com', createEmail }) {
  const [emailPrefix, setEmailPrefix] = useState(email.split('@')[0]);
  const [emailError, setEmailError] = useState(null);
  const [forwardingEmail, setForwardingEmail] = useState(email);
  const inputRef = useRef(null);
  const mounted = useRef(false);
  const onSubmit = useCallback(
    async e => {
      let error;
      e.preventDefault();
      setEmailError(null);
      const { error: testError, success } = testEmail({ emailPrefix });
      error = testError;
      if (success) {
        const email = `${emailPrefix}@leavemealone.email`;
        const { error: createError, value } = await createEmail({
          email,
          forwardingAddress: forwardingEmail
        });
        if (createError) {
          error = createError;
        }
      }
      if (error) {
        console.log(error);
        setEmailError(error);
      }
      return false;
    },
    [createEmail, emailPrefix, forwardingEmail]
  );

  useEffect(() => {
    if (inputRef.current && !mounted.current) {
      inputRef.current.focus();
      mounted.current = true;
    }
  }, [inputRef, mounted]);
  return (
    <>
      <p>Choose an email address.</p>
      <div className="setup">
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <span className={styles.emailForm}>
              <span
                ref={inputRef}
                className={styles.emailInput}
                contentEditable
                onBlur={({ currentTarget }) =>
                  setEmailPrefix(currentTarget.innerText)
                }
                dangerouslySetInnerHTML={{ __html: emailPrefix }}
              />
              <span>@leavemealone.email</span>
            </span>
          </div>
          <div className={styles.formGroup} style={{ marginBottom: '2em' }}>
            <span className={styles.emailForm}>
              <span className={styles.arrow}>
                forward to
                <Arrow width="20" height="20" />
              </span>
              <input
                className={styles.forwardingEmailInput}
                disabled
                onChange={({ currentTarget }) =>
                  setForwardingEmail(currentTarget.innerText)
                }
                value={forwardingEmail}
                placeholder="Forwarding email"
              />
            </span>
          </div>
          <div className={styles.error}>{emailError}</div>
          <Button as="button" type="submit">
            Save
          </Button>
        </form>
      </div>
    </>
  );
}

const prefixRegex = /^[a-zA-Z0-9][a-zA-Z0-9_\-.]{1,63}[a-zA-Z0-9]$/;

function testEmail({ emailPrefix }) {
  if (emailPrefix.includes('..')) {
    return { error: `Please do not include a double period ('..')` };
  }
  if (emailPrefix.includes('--')) {
    return { error: `Please do not include a double dash ('--')` };
  }
  if (emailPrefix.includes('__')) {
    return { error: `Please do not include a double underscore ('__')` };
  }
  if (emailPrefix.length < 3 || emailPrefix.length > 63) {
    return {
      error: `We only support addresses between 3 and 64 characters long.`
    };
  }
  if (!prefixRegex.test(emailPrefix)) {
    return {
      error: `For simplicity we only support alphanumberic characters and some special characters (-, _ and .) so long as they are not at the start or end.`
    };
  }
  return { success: true };
}
export default EmailsPage;

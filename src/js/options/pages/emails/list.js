import React, { useCallback, useState } from 'react';
import styles from './emails.module.scss';
import { FormCheckbox } from '../../../components/form';
import { Arrow } from '../../../components/icons';

function EmailsList({ emails, setEmailStatus, deleteEmail }) {
  const [error, setError] = useState(null);
  const onEnableChange = useCallback(
    async ({ currentTarget }, email) => {
      const { error } = await setEmailStatus(email, currentTarget.checked);
      if (error) {
        setError(error);
      } else {
        setError(null);
      }
    },
    [setEmailStatus]
  );
  const onClickDelete = useCallback(
    async email => {
      const { error } = await deleteEmail(email);
      if (error) {
        setError(error);
      } else {
        setError(null);
      }
    },
    [deleteEmail]
  );

  return (
    <div className={styles.list}>
      <table className={styles.table}>
        <thead>
          <tr>
            <td className={styles.filteringCol}>Filtering</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {emails.map(({ forwardingAddress, email, enabled }) => {
            const [prefix, domain] = email.split('@');
            return (
              <tr className={styles.item} key={email}>
                <td className={styles.enableCell}>
                  <FormCheckbox
                    name={`${email}-enabled`}
                    checked={enabled}
                    onChange={e => onEnableChange(e, email)}
                    label={enabled ? 'On' : 'Off'}
                  />
                </td>
                <td>
                  <span className={styles.listEmail}>
                    <span className={styles.emailPrefix}>{prefix}</span>
                    <span className={styles.emailDomain}>@{domain}</span>
                  </span>
                </td>
                <td className={styles.arrowCell}>
                  <Arrow />
                </td>
                <td>
                  <span className={styles.listEmail}>{forwardingAddress}</span>
                </td>
                <td>
                  <a
                    onClick={() => onClickDelete(email)}
                    className={styles.delete}
                  >
                    delete
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={styles.error}>{error}</div>
    </div>
  );
}

export default EmailsList;

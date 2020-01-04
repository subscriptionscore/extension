import { FormInput, InputGroup } from '../../../components/form';
import React, { useCallback, useState } from 'react';

import Button from '../../../components/button';
import { graphqlRequest } from '../../../utils/request';

const sendInviteGql = `
mutation($email: String!) {
  sendInvite(email: $email) {
    success
  }
}
`;

async function sendInvite(email) {
  const options = {
    variables: {
      email
    }
  };
  const { sendInvite } = await graphqlRequest(sendInviteGql, options);
  return sendInvite;
}

const InviteForm = ({ onSuccess }) => {
  const [state, setState] = useState({
    email: '',
    loading: false,
    success: false
  });

  const onClickInvite = useCallback(async () => {
    setState({
      loading: true,
      success: false
    });
    await sendInvite(state.email);
    setTimeout(() => {
      setState({
        loading: false,
        success: true,
        email: ''
      });
      onSuccess();
    }, 2000);
  }, [state.email, onSuccess]);

  return (
    <form
      id="invite-form"
      onSubmit={e => {
        e.preventDefault();
        return onClickInvite();
      }}
    >
      <InputGroup>
        <FormInput
          name="referral"
          type="email"
          placeholder="friend@example.com"
          disabled={state.loading}
          required
          value={state.email}
          onChange={({ currentTarget }) =>
            setState({ ...state, email: currentTarget.value })
          }
          button={
            <span>
              <Button
                type="submit"
                as="button"
                disabled={state.loading || !state.email}
                loading={state.loading}
              >
                Invite
              </Button>
            </span>
          }
        />
      </InputGroup>
    </form>
  );
};

export default InviteForm;

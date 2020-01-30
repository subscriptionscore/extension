import { graphqlRequest } from '../utils/request';
import { get, put } from '../utils/cache';
import { pushPreference, getItem } from '../utils/storage';
import { updateUserPreferences } from '../utils/preferences';
import digest from '../utils/digest';

// just get the rank to show in the
// subscription score icon
const gql = `
query SearchAddresses($emails: [String]!) {
  emailScores(emails: $emails) {    
    scores {      
      rank
      email      
    }
  }
}
`;

export async function* getAddressScores(addresses) {
  let errors = [];
  // hash all the addresses before we send, we
  // dont want to send plaintext email addresses
  const hashedAddresses = await Promise.all(
    addresses.map(a => digest(a, 'SHA-1'))
  );
  console.log(
    `[subscriptionscore]: fetching scores for ${hashedAddresses.length} emails`
  );
  for (let i = 0; i < hashedAddresses.length; i = i + 20) {
    const emails = hashedAddresses.slice(i, i + 20);
    try {
      const options = {
        variables: {
          emails
        }
      };
      const { emailScores } = await graphqlRequest(gql, options);
      if (emailScores && emailScores.scores) {
        yield emailScores.scores;
      }
    } catch (err) {
      errors = [...errors, err];
    }
  }
  return errors;
}

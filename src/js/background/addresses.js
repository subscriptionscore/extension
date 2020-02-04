import { graphqlRequest } from '../utils/request';
import {
  getAddressScores as getAll,
  putAddressScore as put
} from '../utils/cache';
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
  const hashedAddressMap = await Promise.all(
    addresses.map(async a => ({
      hash: await digest(a.toLowerCase(), 'SHA-1'),
      email: a.toLowerCase()
    }))
  );
  const hashedAddresses = hashedAddressMap.map(a => a.hash);
  const cachedScores = await getAll(hashedAddresses);
  const uncached = hashedAddresses.filter(address =>
    cachedScores.every(cs => cs.address !== address)
  );

  yield mapHashedAddress(
    hashedAddressMap,
    cachedScores.reduce(
      (out, { address, rank }) =>
        rank ? [...out, { email: address, rank }] : out,
      []
    )
  );

  console.log(
    `[subscriptionscore]: fetching scores for ${hashedAddresses.length} emails`
  );
  for (let i = 0; i < uncached.length; i = i + 20) {
    const emails = uncached.slice(i, i + 20);
    try {
      const options = {
        variables: {
          emails
        }
      };
      const { emailScores } = await graphqlRequest(gql, options);
      if (emailScores && emailScores.scores) {
        // cache the hits and return them
        emailScores.scores.forEach(({ rank, email }) => put(email, rank));
        yield mapHashedAddress(hashedAddressMap, emailScores.scores);
      }
      // cache the misses so we don't re-fetch them for a while
      emails
        .filter(uc => emailScores.scores.every(s => s.email !== uc))
        .forEach(email => put(email, null));
    } catch (err) {
      errors = [...errors, err];
    }
  }
  return errors;
}

function mapHashedAddress(addressHashes, hashes) {
  return hashes.map(({ email, ...rest }) => ({
    email: addressHashes.find(ah => ah.hash === email).email,
    ...rest
  }));
}

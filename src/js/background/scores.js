import { graphqlRequest } from '../utils/request';
import isMailProvider from '../utils/is-mail-provider';

// just get the rank to show in the
// subscription score icon
const gql = `
query Search($domain: String!) {
  searchDomain(domain: $domain) {    
    rank
  }
}
`;

export async function getDomainScore(url) {
  const { hostname: domain } = new URL(url);
  if (isMailProvider(domain)) {
    return null;
  }
  const options = {
    variables: {
      domain
    }
  };
  const d = await graphqlRequest(gql, options);
  return d.searchDomain;
}

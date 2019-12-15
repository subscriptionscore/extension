import { graphqlRequest } from '../utils/request';
import isMailProvider from '../utils/is-mail-provider';
import { get, put } from '../utils/cache';

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
  const cachedResult = await get(domain);
  if (cachedResult) {
    return cachedResult;
  }
  const options = {
    variables: {
      domain
    }
  };
  const d = await graphqlRequest(gql, options);
  const rank = d.searchDomain ? d.searchDomain.rank : null;
  put(domain, rank);
  return d.searchDomain;
}
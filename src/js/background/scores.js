import { graphqlRequest } from '../utils/request';
import isMailProvider from '../utils/is-mail-provider';
import { get, put } from '../utils/cache';
import { pushPreference, getItem } from '../utils/storage';
import { updateUserPreferences } from '../utils/preferences';

// just get the rank to show in the
// subscription score icon
const gql = `
query Search($domain: String!) {
  searchDomain(domain: $domain) {    
    rank
    domain
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

const gqlBlocked = `
mutation SignupRequest($domain: String!, $allowed: Boolean) {
  addSignupRequest(domain: $domain, allowed: $allowed) {    
    success
  }
}
`;
export function addSignupBlockedRequest(domain) {
  return graphqlRequest(gqlBlocked, {
    variables: {
      domain,
      allowed: false
    }
  });
}

export function addSignupAllowedRequest(domain) {
  return graphqlRequest(gqlBlocked, {
    variables: {
      domain,
      allowed: true
    }
  });
}

export async function addIgnoreEmail(email) {
  const preferences = await getItem('preferences');
  if (preferences.ignoredEmailAddresses.some(d => d === email)) {
    return null;
  }
  pushPreference('ignoredEmailAddresses', email);
  const newArr = [...preferences.ignoredEmailAddresses, email];
  return updateUserPreferences({
    ...preferences,
    ignoredEmailAddresses: newArr
  });
}
export async function addIgnoreSite(domain) {
  const preferences = await getItem('preferences');
  if (preferences.ignoredSites.some(d => d === domain)) {
    return null;
  }
  pushPreference('ignoredSites', domain);
  const newArr = [...preferences.ignoredSites, domain];
  return updateUserPreferences({ ...preferences, ignoredSites: newArr });
}

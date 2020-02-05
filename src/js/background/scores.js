import { getDomainScore as get, putDomainScore as put } from '../utils/cache';
import { getItem, pushPreference } from '../utils/storage';

import { graphqlRequest } from '../utils/request';
import isMailProvider from '../utils/is-mail-provider';
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
  if (cachedResult && cachedResult.normalizedDomain) {
    return {
      ...cachedResult,
      domain: cachedResult.normalizedDomain
    };
  }
  const options = {
    variables: {
      domain
    }
  };
  const d = await graphqlRequest(gql, options);
  const rank = d.searchDomain ? d.searchDomain.rank : null;
  // this should always be returned by the gql search query but check in case
  const normalizedDomain = d.searchDomain ? d.searchDomain.domain : domain;
  put(domain, rank, normalizedDomain);
  return d.searchDomain;
}

const gqlBlocked = `
mutation SignupRequest($domain: String!, $allowed: Boolean!) {
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

export async function addIgnoreEmail(emails) {
  let ignoreEmails = emails.length ? emails : [emails];
  const preferences = await getItem('preferences');
  ignoreEmails = ignoreEmails.filter(email => {
    return !preferences.ignoredEmailAddresses.includes(email);
  });
  if (!ignoreEmails.length) {
    return null;
  }
  pushPreference('ignoredEmailAddresses', ignoreEmails);
  const newArr = [...preferences.ignoredEmailAddresses, ...ignoreEmails];
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

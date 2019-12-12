import { useMemo } from 'react';
import useGraphQl from './use-graphql';

const gql = `
query Search($domain: String!) {
  searchDomain(domain: $domain) {
    count
    score
    rank
    domain
    unsubscribeRate
    frequencyPerWeek
    unsubscribeDifficulty
    contentQuality
    scores {
        rank
        score
        email
    }
  }
}
`;

export default url => {
  const { hostname: domain } = new URL(url);
  if (!/http(s)?:\/\//.test(url)) {
    return { loading: false, error: null, value: {}, domain };
  }
  const options = useMemo(
    () => ({
      variables: {
        domain
      }
    }),
    [domain]
  );
  return { domain, ...useGraphQl(gql, options) };
};

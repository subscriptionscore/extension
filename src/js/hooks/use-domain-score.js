import useGraphQl from './use-graphql';
import { useMemo } from 'react';

const gql = `
query Search($domain: String!) {
  searchDomain(domain: $domain) {
    score
    rank
    domain
    unsubscribeAvg
    frequencyPerWeek
    unsubscribeDifficulty
    contentQuality
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

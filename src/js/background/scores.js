import { graphqlRequest } from '../utils/request';

// just get the rank
const gql = `
query Search($domain: String!) {
  searchDomain(domain: $domain) {    
    rank
  }
}
`;

const mailProviders = ['gmail.com', 'outlook.com', 'yahoo.com'];

export async function getDomainScore(url) {
  const { hostname: domain } = new URL(url);
  // if the url is a common mail provider then
  // don't do the lookup as scores from every
  // person who sends from @gmail.com is not useful
  const isMailProvider = mailProviders.includes(domain);
  if (isMailProvider) {
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

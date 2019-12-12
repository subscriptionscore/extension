import scoreCache from './cache';
const GRAPHQL_URL = 'http://localhost:2346/graphql';

const cacheAvailable = 'caches' in self;

// const scoreCache = (async () => {
//   if (cacheAvailable) {
//     const c = await caches.open('subscriptionscores');
//     return {
//       get: req => c.match(req),
//       put: (req, res) => c.put(req, res)
//     };
//   }
//   return {
//     get: () => null,
//     put: () => null
//   };
// })();

async function doRequest(url, params = {}) {
  const method = params.method || 'GET';
  const opts = {
    method,
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    ...params
  };
  const request = new Request(url, opts);
  return fetch(request);
}

export async function graphqlRequest(gql, options = {}) {
  const { variables, useCache } = options;
  let data = {
    query: gql
  };
  if (variables) {
    data = {
      ...data,
      variables
    };
  }
  const response = await doRequest(
    GRAPHQL_URL,
    {
      body: JSON.stringify({
        query: gql,
        ...data
      }),
      method: 'POST'
    },
    { useCache }
  );
  const json = await response.json();
  return json.data;
}

const GRAPHQL_URL = 'http://localhost:2346/graphql';

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
  console.log(opts);
  const response = await fetch(url, opts);
  return response;
}

export async function graphqlRequest(gql, options = {}) {
  const { variables } = options;
  let data = {
    query: gql
  };
  if (variables) {
    data = {
      ...data,
      variables
    };
  }
  const response = await doRequest(GRAPHQL_URL, {
    body: JSON.stringify({
      query: gql,
      ...data
    }),
    method: 'POST'
  });
  const json = await response.json();
  return json.data;
}

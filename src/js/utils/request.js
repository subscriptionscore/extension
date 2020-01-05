import { getLicenceKey, onStorageChange } from './storage';
import { GRAPHQL_URL, VERSION } from '../constants.js';
let licenceKey = getLicenceKey();

const HEADERS = {
  'x-app-version': VERSION,
  'Content-Type': 'application/json; charset=utf-8'
};

onStorageChange(prefs => {
  if (prefs.licenceKey) {
    licenceKey = prefs.licenceKey.newValue;
  }
});

async function doRequest(url, params = {}) {
  const key = await licenceKey;
  const method = params.method || 'GET';
  let headers = HEADERS;
  if (key) {
    headers = {
      ...headers,
      Authorization: `Bearer ${key}`
    };
  }
  const opts = {
    method,
    cache: 'no-cache',
    credentials: 'same-origin',
    headers,
    ...params
  };
  const request = new Request(url, opts);
  return fetch(request);
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
  if (json.errors) {
    throw json.errors[0].message;
  }
  return json.data;
}

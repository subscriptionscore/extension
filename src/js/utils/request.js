import { getLicenceKey } from './preferences';
import { GRAPHQL_URL, VERSION } from '../constants.js';
let licenceKey = getLicenceKey('licenceKey');

const HEADERS = {
  'x-app-version': VERSION,
  'Content-Type': 'application/json; charset=utf-8'
};

chrome.storage.onChanged.addListener(({ preferences }) => {
  if (preferences && preferences.licenceKey) {
    licenceKey = preferences.licenceKey;
  }
});

async function doRequest(url, params = {}) {
  try {
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
    return fetch(url, opts);
  } catch (err) {
    console.error(err);
  }
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
  debugger;
  return json.data;
}

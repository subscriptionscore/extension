import { graphqlRequest } from './request';

const updateGql = `
mutation User($preferences: Preferences!) {
  updateUserPreferences(preferences: $preferences) {
    preferences {
      darkMode
      colorSet
      alertOnSubmit
      ignoredEmailAddresses
      ignoredSites
      blockedRank
      autoAllow
      autoAllowTimeout
      gmailEnabled
    }
  }
}
`;

// update the user preferences using the licence key as the ID
export async function updateUserPreferences(preferences) {
  console.log('[user]: saving user preferences', preferences);
  const options = { variables: { preferences } };
  const response = await graphqlRequest(updateGql, options);
  return response.updateUserPreferences;
}

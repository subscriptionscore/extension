// if the url is a common mail provider then we usually don't
// want to do a scores lookup on it, because scores from every
// person who sends from @gmail.com for example is not useful

// this is just a short selection of common mail providers,
// there is a more extensive one at the API layer to make sure
// we never bother to query them
const mailProviders = ['gmail.com', 'outlook.com', 'yahoo.com'];

export default domain => {
  const isMailProvider = mailProviders.includes(domain);
  return isMailProvider;
};

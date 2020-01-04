import OPTIONS from './window';

const twitterWindowOpts = [...OPTIONS, 'height=300'].join(',');

export function openTweetIntent(text) {
  try {
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, 'twitter', twitterWindowOpts);
  } catch (err) {
    console.error(err);
  }
}

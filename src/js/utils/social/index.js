import { openShareArticle } from './linkedin';
import { openShareDialog } from './facebook';
import { openTweetIntent } from './twitter';

export const shareOnFacebook = openShareDialog;
export const shareOnTwitter = openTweetIntent;
export const shareOnLinkedIn = openShareArticle;

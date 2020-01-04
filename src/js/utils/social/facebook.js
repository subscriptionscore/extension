// // https://www.facebook.com/dialog/share?
// // &app_id=422456355046520
// // &display=popup
// // &href=https%3A%2F%2Fleavemealone.app%2Fr%2F7ugHCSgK
// // &redirect_uri=https%3A%2F%2Fleavemealone.app%2Fapp
// // &quote=I+have+been+using+@LeaveMeAloneApp+to+easily+unsubscribe+from+emails.+Join+me+and+get+5+extra+credits+for+free!
// import OPTIONS from './window';

// const windowOpts = [...OPTIONS, 'height=700'].join(',');
// const baseUrl = `https://www.facebook.com/dialog/share?app_id=422456355046520&display=popup`;

// export function openShareDialog(text, { referralCode }) {
//   try {
//     const url = [
//       baseUrl,
//       `href=${encodeURIComponent(
//         `https://leavemealone.app/r/${referralCode}`
//       )}`,
//       `quote=${encodeURIComponent(text)}`
//     ].join('&');

//     window.open(url, 'linkedin-share', windowOpts);
//   } catch (err) {
//     console.error(err);
//   }
// }

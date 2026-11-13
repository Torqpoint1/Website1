/**
 * Instagram feed source.
 *
 * We render the live grid from a Behold JSON feed (https://behold.so) — a free,
 * privacy-friendly service that connects to the Instagram account with
 * Instagram's official login and serves stable, cached post images + permalinks.
 *
 * To switch the live feed ON: create a feed in the Behold dashboard, copy its
 * feed ID (the code at the end of the JSON feed URL, e.g.
 * https://feeds.behold.so/XXXXXXXXXXXX) and paste it below. While this is empty
 * the site shows the styled "Follow" card instead, so nothing looks broken.
 */
export const BEHOLD_FEED_ID = 'uELkUH8Mzveu8MUtDFUN';

export const BEHOLD_FEED_URL = BEHOLD_FEED_ID
  ? `https://feeds.behold.so/${BEHOLD_FEED_ID}`
  : '';

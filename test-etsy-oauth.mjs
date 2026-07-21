import fetch from 'node-fetch';
import crypto from 'crypto';

const clientId = 'testtesttesttesttesttest';
const redirectUri = 'https://printysell.com/api/etsy/callback';

const codeVerifier = crypto.randomBytes(32).toString('base64url');
const codeChallenge = crypto
  .createHash('sha256')
  .update(codeVerifier)
  .digest('base64url');

const url = `https://www.etsy.com/oauth/connect?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
  redirectUri
)}&scope=email_r%20listings_r%20listings_w%20orders_r%20orders_w%20profile_r%20profile_w%20shops_r%20shops_w%20transactions_r&code_challenge=${codeChallenge}&code_challenge_method=S256`;

console.log("Fetching URL:", url);

try {
  const res = await fetch(url);
  const text = await res.text();
  console.log("Status:", res.status);
  
  if (text.includes("is not recognized")) {
    console.log("Error found in HTML: is not recognized");
  } else if (text.includes("Redirect URI")) {
    console.log("Error found in HTML: Redirect URI");
  } else {
    // try to find the error message
    const match = text.match(/<div class="[^"]*error[^"]*">([^<]+)<\/div>/i);
    if (match) {
        console.log("Error div found:", match[1].trim());
    } else {
        console.log("No specific error div found.");
    }
  }
} catch (e) {
  console.error("Fetch error:", e);
}

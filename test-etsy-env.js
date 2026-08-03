require('dotenv').config({ path: '.env.local' });
const apiKey = process.env.ETSY_API_KEY;
const secret = process.env.ETSY_SHARED_SECRET;
console.log("Key length:", apiKey ? apiKey.length : 0);
console.log("Secret length:", secret ? secret.length : 0);
const url = `https://api.etsy.com/v3/application/listings/active?keywords=mug&limit=1`;
fetch(url, { headers: { "x-api-key": `${apiKey}:${secret}` } })
.then(res => res.text().then(text => console.log(res.status, text)))
.catch(err => console.error(err));

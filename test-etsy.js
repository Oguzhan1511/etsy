const apiKey = process.env.ETSY_API_KEY;
const url = `https://api.etsy.com/v3/application/listings/active?keywords=mug&limit=1`;

fetch(url, {
  headers: {
    "x-api-key": apiKey
  }
})
.then(res => res.text().then(text => console.log(res.status, text)))
.catch(err => console.error(err));

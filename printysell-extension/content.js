// Content Script - Sadece Etsy sayfasında çalışır
console.log('PrintySell Extension: Content Script Loaded!');

// URL'deki boyut değerini parse et (il_570xN -> 570)
function parseImageSize(src) {
  const match = src.match(/il_(\d+)x/);
  return match ? parseInt(match[1], 10) : 0;
}

// Sayfadaki en yüksek çözünürlüklü etsystatic görselini bul
function findBestEtsyImage() {
  // Hem src hem de data-src attribute'larına bak (lazy loading için)
  const candidates = [];

  document.querySelectorAll('img').forEach(img => {
    const src = img.src || img.getAttribute('data-src') || '';
    if (src.includes('etsystatic.com') && src.includes('il_')) {
      candidates.push(src);
    }
    // srcset'e de bak
    const srcset = img.srcset || img.getAttribute('data-srcset') || '';
    if (srcset) {
      srcset.split(',').forEach(entry => {
        const url = entry.trim().split(' ')[0];
        if (url.includes('etsystatic.com') && url.includes('il_')) {
          candidates.push(url);
        }
      });
    }
  });

  if (candidates.length === 0) return '';

  // En büyük boyutlu URL'yi seç
  let best = '';
  let bestSize = 0;
  for (const src of candidates) {
    const size = parseImageSize(src);
    // Avatar/thumbnail (<100px) ve büyük listing (>100px) ayrımı
    if (size > bestSize && size >= 100) {
      bestSize = size;
      best = src;
    }
  }

  if (!best && candidates.length > 0) best = candidates[0];

  // URL'deki boyutu 1140xN'e yükselt
  return best
    .replace(/il_\d+xN/g, 'il_1140xN')
    .replace(/il_\d+x\d+/g, 'il_1140xN');
}

// Popup'tan gelen mesajları dinleme
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageInfo') {
    const title = document.querySelector('h1')?.innerText || '';
    const url = window.location.href;
    const imageUrl = findBestEtsyImage();
    sendResponse({ title, url, imageUrl });
  }
  return true;
});

// Content Script - Sadece Etsy sayfasında çalışır
console.log('PrintySell Extension: Content Script Loaded!');

// Popup'tan gelen mesajları dinleme
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageInfo') {
    const title = document.querySelector('h1')?.innerText || '';
    const url = window.location.href;
    
    // Sayfadaki ana ürün görselini bul
    // Etsy'de ana görsel genellikle carousel içindeki ilk büyük img'dir
    let imageUrl = '';
    const selectors = [
      'img[data-listing-id]',
      '.listing-page-image-carousel img',
      '[data-testid="listing-page-image"] img',
      '.wt-max-width-full.wt-display-block img',
      'img[src*="etsystatic.com"]'
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.src && el.src.includes('etsystatic.com')) {
        // Yüksek çözünürlükleri tercih et (il=1140xN)
        imageUrl = el.src.replace(/il_\d+xN/, 'il_1140xN');
        break;
      }
    }
    
    sendResponse({ title, url, imageUrl });
  }
  return true;
});

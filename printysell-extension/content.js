// Content Script - Sadece Etsy sayfasında çalışır
console.log('PrintySell Extension: Content Script Loaded!');

// Popup'tan gelen mesajları dinleme
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageInfo') {
    const title = document.querySelector('h1')?.innerText || '';
    const url = window.location.href;
    
    // Sayfadaki en yüksek çözünürlüklü ürün görselini bul
    let imageUrl = '';
    
    // Tüm etsystatic.com resimlerini topla, en büyüğünü seç
    const allImgs = Array.from(document.querySelectorAll('img[src*="etsystatic.com"]'));
    let bestImg = null;
    let bestSize = 0;
    for (const img of allImgs) {
      const area = img.naturalWidth * img.naturalHeight;
      // Thumbnail veya avatar olanları atla
      if (img.naturalWidth < 200) continue;
      if (area > bestSize) {
        bestSize = area;
        bestImg = img;
      }
    }
    
    if (bestImg) {
      // URL'den boyut kısmını al, en büyüğe çevir
      imageUrl = bestImg.src
        .replace(/il_\d+xN/, 'il_1140xN')
        .replace(/il_\d+x\d+/, 'il_1140xN');
    }
    
    sendResponse({ title, url, imageUrl });
  }
  return true;
});

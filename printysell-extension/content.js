// Content Script - Sadece Etsy sayfasında çalışır
// Gerekirse sayfadan başlık, fiyat veya resim gibi ekstra verileri çekip popup'a gönderebilir.

console.log('PrintySell Extension: Content Script Loaded!');

// Popup'tan gelen mesajları dinleme
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageInfo') {
    const title = document.querySelector('h1')?.innerText || '';
    const url = window.location.href;
    
    // İstediğimiz bilgileri popup'a geri gönderiyoruz
    sendResponse({ 
      title: title,
      url: url
    });
  }
  return true;
});

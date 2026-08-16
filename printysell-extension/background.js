// Background Script (Service Worker) - V3 manifest'te zorunlu arkada çalışan ajan
// Tarayıcı açıldığında veya sekmeler değiştiğinde tetiklenir.

chrome.runtime.onInstalled.addListener(() => {
  console.log('PrintySell Extension başarıyla kuruldu.');
});

// Gerekirse ileride belirli saat aralıklarıyla veri çekme veya 
// Etsy dışındaki sekmelerde ikon rengini soldurma (disable) işlemleri burada yapılabilir.

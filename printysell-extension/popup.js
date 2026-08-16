document.addEventListener('DOMContentLoaded', () => {
  // UI Elementlerini seçme
  const loginView = document.getElementById('loginView');
  const mainView = document.getElementById('mainView');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const pageContextText = document.getElementById('pageContextText');
  const resultsBox = document.getElementById('resultsBox');
  const tagsContainer = document.getElementById('tagsContainer');
  const copyTagsBtn = document.getElementById('copyTagsBtn');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const errorMsg = document.getElementById('errorMsg');
  const generateBtn = document.getElementById('generateBtn');

  let currentListingId = null;
  let currentTags = [];
  let currentImageUrl = '';  // Analiz API'sinden gelen görsel URL'si
  let authToken = null;

  // Canlıya alırken IS_DEV = false yapın.
  const IS_DEV = false;
  const API_BASE = IS_DEV ? 'http://localhost:3005' : 'https://www.printysell.com';

  // Çerezleri (Cookies) kontrol ederek oturum durumunu anlama
  function checkAuthStatus() {
    chrome.cookies.get({ url: API_BASE, name: 'auth_token' }, (cookie) => {
      if (cookie && cookie.value) {
        authToken = cookie.value;
        showMainView();
      } else {
        authToken = null;
        showLoginView();
      }
    });
  }

  // Başlangıç durumu
  checkAuthStatus();

  // Siteye Yönlendir (Kayıt / Giriş İçin)
  loginBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: `${API_BASE}/login` });
  });

  // Çıkış Yap (Sadece eklentiden log out olur, isterseniz siteye de yönlendirebilirsiniz)
  logoutBtn.addEventListener('click', () => {
    authToken = null;
    showLoginView();
  });

  // Analiz Et
  analyzeBtn.addEventListener('click', async () => {
    if (!currentListingId) return;
    if (!authToken) {
      showError('Oturum bulunamadı. Lütfen giriş yapın.');
      return;
    }

      showLoading(true);
      hideError();
      resultsBox.classList.add('hidden');

      try {
        const apiUrl = `${API_BASE}/api/extension/analyze`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ listing_id: currentListingId })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Analiz sırasında bir hata oluştu');
        }

        currentTags = data.tags || [];
        currentImageUrl = data.imageUrl || '';  // Görsel URL'yi sakla
        displayTags(currentTags);
        
        // İstatistikleri ekrana bas
        if (data.stats) {
          document.getElementById('statViews').innerText = data.stats.views || 0;
          document.getElementById('statSales').innerText = data.stats.sales || 0;
          document.getElementById('statFavs').innerText = data.stats.favorites || 0;
        }
      } catch (err) {
        showError(err.message);
        if (err.message.includes('Kimlik doğrulama') || err.message.includes('Oturum')) {
          authToken = null;
          showLoginView();
        }
      } finally {
        showLoading(false);
      }
  });

  // Benzerini Üret Butonu
  generateBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab) return;

      // Sayfa başlığını al (prompt için)
      chrome.tabs.sendMessage(activeTab.id, { action: 'getPageInfo' }, (pageInfo) => {
        const pageTitle = (pageInfo && pageInfo.title) ? pageInfo.title : '';
        if (chrome.runtime.lastError) console.warn(chrome.runtime.lastError.message);

        // Prompt öneri
        const shortTitle = pageTitle.split(',')[0].trim().slice(0, 80);
        const prompt = shortTitle
          ? `"${shortTitle}" tasarımının benzerini, ürün görseli üzerinden, yüksek kaliteli ve Etsy marka stilinde üret.`
          : 'Bu Etsy ürününün görsel tasarımının bir benzerini üret.';

        // API'den gelen görsel URL'sini kullan (sayfa scrape'e gerek yok)
        let studioUrl = `${API_BASE}/ai-design-studio?source=extension&prompt=${encodeURIComponent(prompt)}`;
        if (currentImageUrl) {
          studioUrl += `&image=${encodeURIComponent(currentImageUrl)}`;
        }
        chrome.tabs.create({ url: studioUrl });
      });
    });
  });

  // Tagleri Kopyala
  copyTagsBtn.addEventListener('click', () => {
    if (currentTags.length > 0) {
      const tagsString = currentTags.join(', ');
      navigator.clipboard.writeText(tagsString).then(() => {
        const originalText = copyTagsBtn.innerText;
        copyTagsBtn.innerText = 'Kopyalandı! ✓';
        setTimeout(() => {
          copyTagsBtn.innerText = originalText;
        }, 2000);
      });
    }
  });

  // Fonksiyonlar
  function showLoginView() {
    loginView.classList.remove('hidden');
    mainView.classList.add('hidden');
  }

  function showMainView() {
    loginView.classList.add('hidden');
    mainView.classList.remove('hidden');
    checkCurrentTab();
  }

  function checkCurrentTab() {
    // Aktif sekmeyi sorgula
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab || !activeTab.url) return;

      // Etsy listing sayfasında mıyız kontrol et
      if (activeTab.url.includes('etsy.com/listing/')) {
        // URL'den Listing ID'yi çekme (örn: etsy.com/listing/123456789/...)
        const match = activeTab.url.match(/listing\/(\d+)/);
        if (match && match[1]) {
          currentListingId = match[1];
          pageContextText.innerHTML = `Bulunan Ürün ID: <strong style="color:#fff">${currentListingId}</strong>`;
          analyzeBtn.classList.remove('hidden');
        }
      } else {
        pageContextText.innerText = 'Lütfen bir Etsy ürün sayfasına gidin.';
        analyzeBtn.classList.add('hidden');
      }
    });
  }

  function displayTags(tags) {
    tagsContainer.innerHTML = '';
    tags.forEach(tag => {
      const tagEl = document.createElement('div');
      tagEl.className = 'tag';
      tagEl.textContent = tag;
      tagsContainer.appendChild(tagEl);
    });
    resultsBox.classList.remove('hidden');
  }

  function showLoading(show) {
    if (show) {
      loadingSpinner.classList.remove('hidden');
      analyzeBtn.classList.add('hidden');
    } else {
      loadingSpinner.classList.add('hidden');
      analyzeBtn.classList.remove('hidden');
    }
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
  }
  function hideError() {
    errorMsg.classList.add('hidden');
  }
});

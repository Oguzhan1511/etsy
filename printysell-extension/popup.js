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

  let currentListingId = null;
  let currentTags = [];
  let authToken = null;

  // Çerezleri (Cookies) kontrol ederek oturum durumunu anlama
  // Not: Geliştirme aşamasında localhost, canlıda printysell.com domaini aranır.
  function checkAuthStatus() {
    chrome.cookies.get({ url: 'https://www.printysell.com', name: 'auth_token' }, (cookie) => {
      if (cookie && cookie.value) {
        authToken = cookie.value;
        showMainView();
      } else {
        // Eğer printysell.com'da yoksa localhost'a bakalım (Dev ortamı)
        chrome.cookies.get({ url: 'http://localhost:3005', name: 'auth_token' }, (devCookie) => {
          if (devCookie && devCookie.value) {
            authToken = devCookie.value;
            showMainView();
          } else {
            authToken = null;
            showLoginView();
          }
        });
      }
    });
  }

  // Başlangıç durumu
  checkAuthStatus();

  // Siteye Yönlendir (Kayıt / Giriş İçin)
  loginBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://www.printysell.com/login' });
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
        const apiUrl = 'http://localhost:3005/api/extension/analyze';
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
        displayTags(currentTags);
        
        // İstatistikleri ekrana bas
        if (data.stats) {
          document.getElementById('statViews').innerText = data.stats.views7d || 0;
          document.getElementById('statSales').innerText = data.stats.sales7d || 0;
          document.getElementById('statFavs').innerText = data.stats.favorites7d || 0;
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

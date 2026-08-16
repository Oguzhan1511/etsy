"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl backdrop-blur-sm">
        
        <Link href="/login" className="inline-flex items-center text-sm text-violet-400 hover:text-violet-300 transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Geri Dön
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
          Kullanıcı ve Abonelik Sözleşmesi
        </h1>

        <div className="space-y-8 text-foreground/80 leading-relaxed text-sm">
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Taraflar</h2>
            <p>
              İşbu Kullanıcı ve Abonelik Sözleşmesi ("Sözleşme"), PrintySell platformunu ("Platform") işleten PrintySell ("Şirket") ile Platform'a üye olan veya Platform'u kullanan kişi ("Kullanıcı") arasında, Kullanıcı'nın Platform'a kayıt olması anında elektronik ortamda kabul edilmesiyle yürürlüğe girmiştir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Hizmetin Tanımı</h2>
            <p>
              PrintySell, Kullanıcılarına yapay zeka destekli görsel tasarımı yapma, mockup (örnek ürün) oluşturma, Etsy vb. pazar yerleri ile entegrasyon sağlama ve ürün listeleme gibi e-ticaret ve tasarım süreçlerini kolaylaştıran bir hizmet yazılımı (SaaS) sunar.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Üyelik ve Abonelik Koşulları</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Kullanıcı, kayıt olurken verdiği tüm bilgilerin doğru ve güncel olduğunu kabul eder.</li>
              <li>Platform üzerindeki hizmetler, farklı özelliklere sahip aylık veya yıllık abonelik paketleri ("Paketler") şeklinde veya kredi (token) sistemi ile sunulabilir.</li>
              <li>Abonelikler, Kullanıcı iptal etmediği sürece seçilen faturalandırma dönemi sonunda otomatik olarak yenilenir.</li>
              <li>Kullanıcı, aboneliğini dilediği zaman hesap ayarları üzerinden iptal edebilir. İptal işlemi bir sonraki faturalandırma dönemi için geçerli olur. Mevcut döneme ait ücret iadesi yapılmaz.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Ücretlendirme ve İade Koşulları</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Hizmet bedelleri ve ödeme koşulları Platform üzerinde açıkça belirtilmiştir. Şirket, paket içeriklerinde ve fiyatlarda önceden haber vermek koşuluyla değişiklik yapma hakkını saklı tutar.</li>
              <li>Dijital hizmetlerin doğası gereği (yapay zeka model tüketimi, sunucu kaynak kullanımı), satın alınan paketlerin, aboneliklerin veya token'ların cayma hakkı kapsamında <strong>kısmi veya tam iadesi yapılmamaktadır</strong> (Tüketicinin Korunması Hakkında Kanun mesafeli sözleşmeler yönetmeliği, anında ifa edilen hizmetler).</li>
              <li>Sistemsel bir hata nedeniyle mükerrer çekim yapılması durumunda Kullanıcı destek talebi oluşturabilir.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Fikri Mülkiyet ve Lisans</h2>
            <p>
              Kullanıcı'nın PrintySell üzerinden kendi komutları (prompt) ile ürettiği görsellerin telif ve ticari kullanım hakları Kullanıcı'ya aittir. Kullanıcı, ürettiği görselleri Etsy gibi platformlarda dilediği gibi satabilir. Ancak Kullanıcı, ürettiği içeriklerin üçüncü şahısların telif veya marka haklarını ihlal etmemesinden bizzat sorumludur. PrintySell, üretilen içeriklerden doğacak hukuki ihtilaflarda hiçbir sorumluluk kabul etmez.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Kullanım Sınırlandırmaları ve Yasaklar</h2>
            <p>
              Kullanıcı, Platform'u hukuka ve ahlaka aykırı amaçlarla, üçüncü şahıslara zarar verecek veya Platform'un teknik altyapısını tehdit edecek şekilde (tersine mühendislik, saldırı vb.) kullanamaz. Platform'un kötüye kullanıldığının tespiti halinde Şirket, Kullanıcı'nın hesabını hiçbir bildirim yapmaksızın ve ücret iadesi olmaksızın derhal askıya alma veya kalıcı olarak silme hakkına sahiptir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Sorumluluk Reddi (Disclaimer)</h2>
            <p>
              Platform "olduğu gibi" sunulmaktadır. Şirket; Platform'un kesintisiz, hatasız olacağını, veya üretilen görsellerin ticari başarısını garanti etmez. Etsy veya benzeri üçüncü taraf entegrasyonlarda yaşanacak politika değişiklikleri, API kesintileri veya Kullanıcı mağazasının Etsy tarafından kapatılması gibi durumlardan PrintySell sorumlu tutulamaz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Sözleşme Değişiklikleri</h2>
            <p>
              Şirket, işbu Sözleşme şartlarını dilediği zaman tek taraflı olarak değiştirme hakkını saklı tutar. Değişiklikler Platform üzerinde yayınlandığı tarihte yürürlüğe girer.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Uyuşmazlıkların Çözümü</h2>
            <p>
              İşbu Sözleşme'den doğabilecek uyuşmazlıklarda Türkiye Cumhuriyeti kanunları uygulanacak olup, İstanbul Merkez Mahkemeleri ve İcra Daireleri münhasıran yetkilidir.
            </p>
          </section>

          <p className="mt-8 text-xs text-foreground/50 border-t border-white/10 pt-4">
            Son Güncelleme Tarihi: {new Date().toLocaleDateString('tr-TR')}
          </p>

        </div>
      </div>
    </div>
  );
}

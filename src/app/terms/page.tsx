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
            <p className="mb-2">
              İşbu Kullanıcı ve Abonelik Sözleşmesi ("Sözleşme"), PrintySell platformunu ("Platform") işleten [Şirket Unvanı / Ticaret Sicil No / MERSİS No / Adres] ("Şirket") ile Platform'a üye olan veya Platform'u kullanan gerçek veya tüzel kişi ("Kullanıcı") arasında, Kullanıcı'nın Platform'a kayıt olması ve işbu Sözleşme'yi elektronik ortamda onaylaması anında akdedilmiş ve yürürlüğe girmiştir.
            </p>
            <p>
              <strong>1.1 Ehliyet ve Yaş Sınırı:</strong> Kullanıcı, işbu Sözleşme'yi onaylayarak on sekiz (18) yaşını doldurduğunu ve/veya Platform'u bir tüzel kişi adına kullanıyorsa o tüzel kişiyi temsile yetkili olduğunu beyan ve taahhüt eder. Reşit olmayan kişilerin Platform'u kullanması yasaktır; bu durumun tespiti halinde Şirket ilgili hesabı askıya alabilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Hizmetin Kapsamı ve Tanımı</h2>
            <p>
              PrintySell, Kullanıcılarına yapay zekâ destekli görsel tasarım oluşturma, mockup (örnek ürün görseli) üretme, Etsy ve benzeri pazar yerleri ile entegrasyon sağlama ve ürün listeleme gibi e-ticaret ve tasarım süreçlerini kolaylaştıran bir hizmet yazılımı (SaaS) sunar. İşbu hizmetlerin ifası sırasında üçüncü taraf API'ler ve servisler kullanılabilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Üyelik, Abonelikler ve Otomatik Yenileme</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Kullanıcı, hesap güvenliğinden, şifresinin gizliliğinden ve hesabında yapılan tüm işlemlerden bizzat sorumludur. Hesabın yetkisiz kişilerce kullanımı sonucu doğacak zararlardan Şirket sorumlu tutulamaz.</li>
              <li>Platform üzerindeki hizmetler, farklı özelliklere sahip aylık veya yıllık abonelik paketleri ("Paketler") şeklinde sunulur.</li>
              <li><strong>Otomatik Yenileme:</strong> Abonelikler, Kullanıcı iptal etmediği sürece seçilen faturalandırma dönemi sonunda aynı paket üzerinden otomatik olarak yenilenir.</li>
              <li><strong>İptal Süreci:</strong> Kullanıcı, aboneliğini dilediği zaman hesap ayarları üzerinden iptal edebilir. İptal işlemi bir sonraki faturalandırma dönemi itibarıyla geçerli olur.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Token (Kredi) Sistemi ve Kullanım Koşulları</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Platform içerisindeki yapay zeka görsel oluşturma ve benzeri işlemler, "Token" (Kredi) harcanarak gerçekleştirilir. Token tahsisi, seçilen abonelik paketine göre aylık olarak tanımlanır.</li>
              <li><strong>Kullanım Ömrü ve Devir:</strong> Kullanılmayan tokenlar bir sonraki faturalandırma ayına devretmez ve silinir.</li>
              <li><strong>Abonelik İptali ve Token Durumu:</strong> Kullanıcı aboneliğini iptal ettiğinde veya yenilemediğinde hesabı "Demo" statüsüne düşer. <strong>Abonelik pasif duruma (Demo) düştüğü anda, Kullanıcının hesabında önceden kalan kullanılmamış tokenlar tamamen silinir ve kullanılamaz.</strong> Token kullanımı yalnızca aktif ücretli aboneliği bulunan Kullanıcılar için geçerlidir.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Ücretlendirme, Faturalandırma ve Ödeme Başarısızlığı</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Şirket, paket içeriklerinde ve fiyatlarda değişiklik yapma hakkını saklı tutar. Fiyat artışları mevcut abonelik döneminin sonunda uygulanır ve Kullanıcı'ya en az 15 gün önceden bildirilir. Kullanıcı güncel fiyatı kabul etmezse dönem sonunda aboneliğini cezasız sonlandırabilir.</li>
              <li><strong>Ödeme Başarısızlığı:</strong> Otomatik yenileme sırasında kredi kartından tahsilat yapılamaması durumunda, sistem tahsilatı [örn: 3 gün] boyunca aralıklarla dener. Bu süre sonunda tahsilat yapılamazsa abonelik iptal edilerek hesap Demo statüsüne çekilir ve mevcut tokenlar sıfırlanır.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Cayma Hakkı ve İade Politikası</h2>
            <p className="mb-2">
              Dijital hizmetlerin anlık ifası (yapay zekâ model tüketimi, sunucu kaynak kullanımı ve token tahsisi) nedeniyle, Mesafeli Sözleşmeler Yönetmeliği m.15 (ğ) bendi uyarınca, elektronik ortamda anında ifa edilen hizmetlerde tüketici cayma hakkını kullanamaz.
            </p>
            <p>
              Kullanıcı, abonelik satın alıp hesabına token tanımlandığı andan itibaren cayma hakkının ortadan kalktığını kabul, beyan ve taahhüt eder. Satın alınan paketlerin, aboneliklerin veya kısmen/tamamen kullanılmış token'ların iadesi yapılmamaktadır. Sistemsel bir hata nedeniyle mükerrer tahsilat yapılması halinde 10 iş günü içinde iade gerçekleştirilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Yapay Zeka Çıktıları, Fikri Mülkiyet ve Ticari Kullanım</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Kullanım İzni ve Sınırlar:</strong> Şirket, Kullanıcı'nın PrintySell üzerinden ürettiği görseller için Kullanıcı'ya ticari kullanım hakkı (lisansı) verir. Ancak yapay zeka ile üretilen görsellerin hukuki olarak mutlak ve münhasır bir "telif hakkı" oluşturup oluşturmadığı uluslararası hukuka ve 3. taraf AI servis sağlayıcılarının şartlarına tabidir.</li>
              <li>Kullanıcı ürettiği bu içerikleri Etsy gibi platformlarda satabilir. Ancak Şirket, bu görsellerin telif hakkı ihlaline sebep olmayacağını, özgünlüğünü veya ticari başarısını garanti etmez.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Kullanıcı İçeriği, Sorumluluğu ve Tazminat (Indemnification)</h2>
            <p className="mb-2">
              Kullanıcı; sisteme yüklediği referans görsellerin, yazdiği komutların (prompt) ve oluşturduğu ürünlerin hiçbir şekilde üçüncü şahıslara ait marka (ör: logolar), telif hakları, patent, ticari sır veya kişisel verileri ihlal etmediğini garanti eder.
            </p>
            <p>
              <strong>Tazminat:</strong> Kullanıcının yüklediği veya ürettiği içerikler nedeniyle Şirket'e yöneltilebilecek her türlü yasal iddia, dava, idari para cezası durumunda Kullanıcı; Şirket'in uğrayacağı tüm maddi ve manevi zararları ile avukatlık ücretlerini ilk talepte derhal ve nakden Şirket'e tazmin etmekle yükümlüdür.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Etsy ve Üçüncü Taraf Entegrasyonları</h2>
            <p className="mb-2">
              PrintySell platformunun merkezinde yer alan Etsy entegrasyonu "olduğu gibi" sunulur. Şirket, Etsy, Inc. şirketinin veya bağlı kuruluşlarının resmi bir ortağı değildir.
            </p>
            <p>
              Aşağıdaki durumlardan Şirket sorumlu tutulamaz:
              <br/>- Etsy'nin API yapısını değiştirmesi veya erişimi kesmesi,
              <br/>- Kullanıcı'nın Etsy mağazasının, Etsy politikaları ihlali sebebiyle uyarılması, askıya alınması veya kapatılması,
              <br/>- Kullanıcı tarafından PrintySell üzerinden aktarılan ürün açıklamaları veya görsellerindeki hatalar.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Üçüncü Taraf Yapay Zeka Servisleri</h2>
            <p>
              PrintySell; görsel üretimi, analiz ve benzeri işlemler için OpenAI, Fal AI, Google vb. bağımsız 3. taraf yapay zeka sağlayıcılarının altyapılarını kullanmaktadır. Bu servis sağlayıcıların:
              API kesintileri yaşamasından, içerik filtreleme (NSFW vb.) politikalarını değiştirmesinden, belirli komutları reddetmesinden veya hizmeti durdurmasından Şirket sorumlu tutulamaz. Bu kesintiler iade veya tazminat sebebi oluşturmaz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Yasaklı Kullanımlar ve Hesabın Kapatılması</h2>
            <p className="mb-2">
              Kullanıcı, Platform'u; tersine mühendislik yapmak, siber saldırı düzenlemek, yetkisiz veri kazımak (scraping) veya diğer kullanıcılara zarar vermek amacıyla kullanamaz. 
            </p>
            <p>
              Şirket, Platform'un kötüye kullanıldığını veya bu Sözleşme'nin ağır şekilde ihlal edildiğini tespit ederse, Kullanıcı'nın hesabını derhal askıya alma veya kapatma hakkına sahiptir. Kapatılan hesaplarda, mevzuattan doğan yasal iade yükümlülükleri saklı kalmak kaydıyla ücret ve token iadesi yapılmaz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Sorumluluk Sınırlaması ve Hizmet Düzeyi (Uptime)</h2>
            <p>
              Platform SaaS tabanlı olup, bakım, güncelleme veya plansız teknik arızalar sebebiyle kısa süreli erişim kesintileri yaşanabilir. Şirket %100 kesintisiz hizmet (uptime) garantisi vermez. Şirketin, kasıt veya ağır ihmali dışında kalan her türlü performans düşüklüğü veya dolaylı zarardan kaynaklanan tazminat yükümlülüğü, Kullanıcının son 12 ay içerisinde Şirket'e ödediği toplam hizmet bedeli ile sınırlıdır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">13. Mücbir Sebep</h2>
            <p>
              Doğal afet, savaş, siber saldırı, genel altyapı ve internet çöküşleri, salgın hastalık, idari veya yasal kısıtlamalar mücbir sebep sayılır. Mücbir sebep süresince Şirket'in edim yükümlülükleri askıya alınır.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">14. Kişisel Verilerin Korunması (KVKK)</h2>
            <p>
              Şirket, Kullanıcı'ya ait kişisel verileri 6698 sayılı Kişisel Verilerin Korunması Kanunu ve ilgili mevzuata uygun olarak işler. Veri işleme şartları, kayıt sırasında kullanıcıya sunulan <strong>Aydınlatma Metni</strong> ve <strong>Gizlilik Politikası</strong> (bu sözleşmeden bağımsız ayrı belgelerdir) içerisinde düzenlenmiştir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">15. Sözleşme Değişiklikleri</h2>
            <p>
              Şirket, ilgili mevzuata uygun olmak ve aleyhte değişiklikleri en az 15 gün önceden e-posta ile bildirmek kaydıyla Sözleşme şartlarını değiştirebilir. Güncel sözleşmeyi kabul etmeyen Kullanıcı aboneliğini sonlandırma hakkına sahiptir.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">16. Uyuşmazlıkların Çözümü</h2>
            <p>
              İşbu Sözleşme'den doğabilecek uyuşmazlıklarda Türkiye Cumhuriyeti kanunları uygulanır. Tüketici sıfatına haiz Kullanıcılar bakımından, parasal sınırlar dahilinde Kullanıcı'nın veya Şirket'in yerleşim yerindeki Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir. Tüketici olmayan Kullanıcılar ile yaşanacak uyuşmazlıklarda İstanbul (Merkez) Mahkemeleri münhasıran yetkilidir.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

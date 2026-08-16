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

        <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
          Kullanıcı ve Abonelik Sözleşmesi
        </h1>
        
        <p className="text-xs text-foreground/50 mb-8 italic">
          Not: Köşeli parantezli alanlar şirketin gerçek bilgileriyle doldurulmalı; bu doküman ayrıca Ön Bilgilendirme Formu ve KVKK Aydınlatma Metni ile birlikte kullanılmalıdır. Yayına almadan önce bir hukuk danışmanına onaylatılması önerilir.
        </p>

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
            <h2 className="text-xl font-semibold text-white mb-3">2. Hizmetin Tanımı</h2>
            <p>
              PrintySell, Kullanıcılarına yapay zekâ destekli görsel tasarım oluşturma, mockup (örnek ürün görseli) üretme, Etsy ve benzeri pazar yerleri ile entegrasyon sağlama ve ürün listeleme gibi e-ticaret ve tasarım süreçlerini kolaylaştıran bir hizmet yazılımı (SaaS) sunar.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Ön Bilgilendirme ve Mesafeli Sözleşme İlişkisi</h2>
            <p>
              Kullanıcı, ücretli bir Paket veya kredi (token) satın almadan önce, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca hazırlanan Ön Bilgilendirme Formu'nu ayrıca onaylar. İşbu Sözleşme, Ön Bilgilendirme Formu ile birlikte bütün oluşturur; hükümler arasında çelişki olması halinde Ön Bilgilendirme Formu'nda yer alan tüketici lehine hükümler esas alınır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Üyelik ve Abonelik Koşulları</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Kullanıcı, kayıt olurken verdiği tüm bilgilerin doğru, güncel ve eksiksiz olduğunu kabul eder.</li>
              <li>Platform üzerindeki hizmetler, farklı özelliklere sahip aylık veya yıllık abonelik paketleri ("Paketler") şeklinde ve/veya kredi (token) sistemi ile sunulabilir.</li>
              <li>Abonelikler, Kullanıcı iptal etmediği sürece seçilen faturalandırma dönemi sonunda otomatik olarak yenilenir. Şirket, yenilemeden makul bir süre (en az 3 gün) önce Kullanıcı'yı kayıtlı e-posta adresi üzerinden bilgilendirir.</li>
              <li>Kullanıcı, aboneliğini dilediği zaman hesap ayarları üzerinden, ek bir işleme gerek kalmaksızın iptal edebilir. İptal işlemi bir sonraki faturalandırma dönemi itibarıyla geçerli olur; mevcut ödenmiş döneme ait hizmet, dönem sonuna kadar kesintisiz sunulmaya devam eder.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Ücretlendirme, Faturalandırma ve İade Koşulları</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Hizmet bedelleri ve ödeme koşulları Platform üzerinde açıkça belirtilir. Şirket, paket içeriklerinde ve fiyatlarda değişiklik yapma hakkını saklı tutar; ancak fiyat artışları mevcut abonelik döneminin sonunda ve Kullanıcı'ya en az 15 gün önceden e-posta ile bildirilmek suretiyle uygulanır.</li>
              <li>Her satış işlemi için Kullanıcı'ya, ilgili mevzuata uygun şekilde (e-arşiv fatura/fatura) belge düzenlenir ve Kullanıcı'nın kayıtlı e-posta adresine iletilir.</li>
              <li><strong>Cayma Hakkı:</strong> Dijital hizmetlerin anlık ifası (yapay zekâ model tüketimi, sunucu kaynak kullanımı) nedeniyle, Kullanıcı'nın açıkça onay verdiği ve ifasına başlanmış hizmetler bakımından Mesafeli Sözleşmeler Yönetmeliği m.15 kapsamında cayma hakkı bulunmamaktadır. Şu kadar ki, henüz hiç kullanılmamış (tüketilmemiş) token/kredi bakiyeleri için, satın alma tarihinden itibaren 14 gün içinde destek talebi oluşturulması halinde Şirket, kısmi veya tam iade talebini değerlendirme hakkını saklı tutar.</li>
              <li>Sistemsel bir hata nedeniyle mükerrer çekim yapılması durumunda Kullanıcı destek talebi oluşturabilir; tespit edilen mükerrer tahsilatlar 10 iş günü içinde iade edilir.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Fikri Mülkiyet ve Lisans</h2>
            <p className="mb-2">
              Kullanıcı'nın PrintySell üzerinden kendi komutları (prompt) ile ürettiği görsellerin telif ve ticari kullanım hakları Kullanıcı'ya aittir. Kullanıcı, ürettiği görselleri Etsy gibi platformlarda dilediği gibi satabilir.
            </p>
            <p>
              Kullanıcı, ürettiği içeriklerin üçüncü şahısların telif, marka veya diğer fikri mülkiyet haklarını ihlal etmemesinden bizzat sorumludur. Şirket, açıkça tespit edilebilir hak ihlali bildirimleri (ör. yasal bir hak sahibi bildirimi) üzerine makul ölçüde içerik moderasyonu yapma hakkını saklı tutar; ancak bu, Şirket'e önleyici bir denetim yükümlülüğü doğurmaz. PrintySell, Kullanıcı tarafından üretilen içeriklerden doğacak hukuki ihtilaflarda taraf değildir ve sorumluluk kabul etmez.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Kullanım Sınırlandırmaları ve Yasaklar</h2>
            <p className="mb-2">
              Kullanıcı, Platform'u hukuka ve ahlaka aykırı amaçlarla, üçüncü şahıslara zarar verecek veya Platform'un teknik altyapısını tehdit edecek şekilde (tersine mühendislik, siber saldırı, yetkisiz erişim vb.) kullanamaz.
            </p>
            <p>
              Platform'un kötüye kullanıldığının makul şüphe ile tespiti halinde Şirket, durumun ciddiyetiyle orantılı olarak önce Kullanıcı'yı uyarabilir veya hesabı geçici olarak askıya alabilir; hukuka aykırılığın açık ve ağır olduğu hallerde (dolandırıcılık, siber saldırı, üçüncü taraf hakların ağır ihlali vb.) hesabı bildirimsiz ve ücret iadesiz olarak kalıcı olarak kapatabilir. Kullanıcı, hesabının askıya alınması/kapatılmasına itiraz etme ve destek kanalı üzerinden açıklama talep etme hakkına sahiptir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Sorumluluk Reddi (Disclaimer) ve Mücbir Sebep</h2>
            <p className="mb-2">
              Platform "olduğu gibi" (as is) sunulmaktadır. Şirket; Platform'un kesintisiz veya hatasız çalışacağını ya da üretilen görsellerin ticari başarısını garanti etmez. Etsy veya benzeri üçüncü taraf entegrasyonlarında yaşanacak politika değişiklikleri, API kesintileri veya Kullanıcı mağazasının ilgili pazar yeri tarafından kapatılması gibi durumlardan PrintySell sorumlu tutulamaz.
            </p>
            <p className="mb-2">
              <strong>Mücbir Sebep:</strong> Doğal afet, savaş, seferberlik, salgın hastalık, altyapı sağlayıcılarından (bulut/sunucu, ödeme kuruluşu, yapay zekâ model sağlayıcısı) kaynaklanan genel kesintiler, mevzuat değişiklikleri ve makul kontrol dışındaki benzeri haller mücbir sebep sayılır. Mücbir sebep süresince tarafların edim yükümlülükleri askıya alınır; durum 3 iş günü içinde karşı tarafa bildirilir.
            </p>
            <p>
              İşbu madde, Şirket'in kasıt veya ağır ihmalinden doğan sorumluluğunu ortadan kaldırmaz.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Kişisel Verilerin Korunması (KVKK)</h2>
            <p>
              Şirket, Kullanıcı'ya ait kişisel verileri (ad-soyad, e-posta, ödeme/fatura bilgileri, kullanım verileri vb.) 6698 sayılı Kişisel Verilerin Korunması Kanunu ve ilgili mevzuata uygun olarak işler. Veri işleme amaçları, hukuki sebepleri, aktarım halleri ve Kullanıcı'nın KVKK m.11 kapsamındaki hakları, Platform'da ayrıca yayımlanan Aydınlatma Metni ve Gizlilik Politikası'nda düzenlenmiştir. Kullanıcı, kayıt sırasında bu metinleri okuduğunu ve anladığını beyan eder. İşbu Sözleşme, ilgili Aydınlatma Metni'nin ayrılmaz bir parçasıdır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Sözleşme Değişiklikleri</h2>
            <p>
              Şirket, işbu Sözleşme şartlarını, ilgili mevzuata uygun olmak ve Kullanıcı aleyhine esaslı değişiklikleri en az 15 gün önceden e-posta ve/veya Platform içi bildirim yoluyla duyurmak kaydıyla değiştirme hakkını saklı tutar. Kullanıcı'nın değişiklik sonrasında Platform'u kullanmaya devam etmesi, güncel Sözleşme'yi kabul ettiği anlamına gelir; esaslı değişikliklere itiraz eden Kullanıcı, aboneliğini iptal etme ve/veya hesabını kapatma hakkına sahiptir.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Uyuşmazlıkların Çözümü</h2>
            <p>
              İşbu Sözleşme'den doğabilecek uyuşmazlıklarda Türkiye Cumhuriyeti kanunları uygulanır. Tüketici sıfatını haiz Kullanıcılar bakımından, 6502 sayılı Kanun'un ilgili maddeleri uyarınca parasal sınırlar dahilinde Kullanıcı'nın veya Şirket'in yerleşim yerindeki Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir. Tüketici sıfatını haiz olmayan Kullanıcılar (tacir/tüzel kişi) ile aradaki uyuşmazlıklarda İstanbul (Merkez) Mahkemeleri ve İcra Daireleri münhasıran yetkilidir.
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

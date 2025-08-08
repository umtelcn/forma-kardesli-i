import { FAQ } from './types';

export const teamStyles = {
  Galatasaray: {
    borderColor: 'border-red-600',
    buttonBg: 'bg-yellow-500',
    buttonHoverBg: 'hover:bg-yellow-600',
    buttonText: 'text-red-700',
    gradientFrom: 'from-red-50',
  },
  Fenerbahçe: {
    borderColor: 'border-blue-900',
    buttonBg: 'bg-blue-900',
    buttonHoverBg: 'hover:bg-blue-950',
    buttonText: 'text-yellow-400',
    gradientFrom: 'from-blue-50',
  },
  Beşiktaş: {
    borderColor: 'border-gray-900',
    buttonBg: 'bg-black',
    buttonHoverBg: 'hover:bg-gray-800',
    // DÜZELTME: Siyah arka plan üzerinde görünür olması için
    // buton metni ve ikon rengi 'beyaz' olarak ayarlandı.
    buttonText: 'text-white',
    gradientFrom: 'from-gray-100',
  },
};

export const faqData: FAQ[] = [
  {
    q: 'Askıda Forma nedir?',
    a: 'Askıda Forma, futbol tutkusunu bir iyilik köprüsüne dönüştüren, ihtiyaç sahibi çocuklarımıza tuttukları takımların formalarını ulaştırmak amacıyla kurulmuş bir sosyal sorumluluk platformudur.',
  },
  {
    q: 'Askıda Forma resmi bir kuruluş mu?',
    a: "Evet, platformumuz tamamen yasal ve şeffaf bir zeminde faaliyet göstermektedir. Askıda Forma, <strong>'Çocuklar Üşümesin Yardımlaşma ve Dayanışma Derneği'</strong> bünyesinde yürütülen resmi bir projedir. Yaptığınız her bağış, derneğimiz güvencesi altındadır.",
  },
  {
    q: 'Formalar nereden temin ediliyor?',
    a: 'Çocuklarımıza en kalitelisini ulaştırma hassasiyetiyle, tüm formalar doğrudan kulüplerin resmi mağazalarından (GSStore, Fenerium, Kartal Yuvası vb.) temin edilmektedir. Bağışınızla çocuklarımıza hediye edilen <strong>her forma orijinal ve lisanslıdır.</strong>',
  },
];

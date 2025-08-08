import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // SAFELIST: Bu bölüm, Tailwind'in dinamik sınıfları silmesini önler.
  safelist: [
    // DÜZELTME: Beşiktaş kartı için gerekli olan sınıfları
    // silinmeye karşı korumak için açıkça ekliyoruz.
    'bg-black',
    'text-white',
    {
      // Bu desen, diğer takımların kullandığı renk-ton yapısındaki
      // sınıfları korumaya devam eder.
      pattern:
        /(border|bg|text|from)-(red|yellow|blue|gray|emerald)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;

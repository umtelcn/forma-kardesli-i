// components/ThankYouPage.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHome } from '@fortawesome/free-solid-svg-icons';

interface ThankYouPageProps {
  onFinish: () => void;
}

export default function ThankYouPage({ onFinish }: ThankYouPageProps) {
  return (
    <div className="container mx-auto px-4 py-8 text-center animate-fadeIn">
      <div className="max-w-lg mx-auto bg-white p-10 md:p-16 rounded-2xl shadow-xl">
        <FontAwesomeIcon
          icon={faHeart}
          className="text-6xl text-red-500 mb-6"
        />
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Teşekkür Ederiz!
        </h2>
        <p className="text-gray-600 text-lg mb-10">
          Bir çocuğun daha yüzündeki gülümsemenin sebebi oldunuz.
        </p>
        <button
          onClick={onFinish}
          className="w-full bg-emerald-600 text-white font-semibold py-4 px-6 rounded-xl text-lg hover:bg-emerald-700 transition"
        >
          <FontAwesomeIcon icon={faHome} className="mr-2 w-5 h-5" /> Anasayfaya
          Dön
        </button>
      </div>
    </div>
  );
}

import Link from 'next/link';

/**
 * Hero component for the home page. Displays a colourful gradient banner
 * introducing the AA Clothing brand with a call to action that anchors to
 * the products section on the same page. The gradient colours and
 * messaging can be customised to suit the brand identity.
 */
export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white py-24 px-8 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Välkommen till AA Clothing
      </h1>
      <p className="text-lg md:text-xl mb-8">
        Upptäck trendiga plagg för varje stil och tillfälle.
      </p>
      <Link href="#produkter">
        <a className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition">
          Handla nu
        </a>
      </Link>
    </section>
  );
}
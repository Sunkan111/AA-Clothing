import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';

// Cart page that lists items in the cart, allows removal and clearing,
// and displays the total price. It assumes CartContext stores each
// cart item as an extension of a product (i.e. the item itself has
// product fields like id, name, price, image, etc.).
export default function CartPage() {
  const { items, removeFromCart, clearCart } = useCart();
  // Calculate the total cost by multiplying price and quantity for each item.
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Varukorg</h1>
      {items.length === 0 ? (
        <p>Din varukorg är tom.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center space-x-4 border-b pb-4"
              >
                <div className="w-20 h-20 relative flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm">Antal: {item.quantity}</p>
                  <p className="font-bold">{item.price * item.quantity} kr</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Ta bort
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between items-center">
            <p className="text-lg font-bold">Totalt: {total} kr</p>
            <button
              onClick={clearCart}
              className="bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300"
            >
              Töm varukorg
            </button>
          </div>
        </>
      )}
      <div className="mt-4">
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          Fortsätt handla
        </Link>
      </div>
    </div>
  );
}
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';

export type Product = {
  /** Unique identifier for the product. Although the underlying JSON stores IDs as strings,
   *  we type it as a string here so it can be used directly in route paths without
   *  conversion. */
  id: string;
  /** Name of the product */
  name: string;
  /** Description of the product */
  description: string;
  /** Price in Swedish kronor */
  price: number;
  /** Available sizes for the product */
  size: string[];
  /** Fit description, e.g. slim, regular, loose */
  fit: string;
  /** Image path relative to the public directory */
  image: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  return (
    <div className="border rounded-md overflow-hidden bg-white shadow-sm flex flex-col">
      {/* Wrap image and text in a link so users can navigate to the product details page */}
      <Link href={`/product/${product.id}`}>
        <a className="flex-1">
          {/* Note: width and height are required for next/image. Adjust as necessary. */}
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="object-cover w-full h-48"
          />
          <div className="p-2 flex flex-col">
            <h3 className="font-semibold text-sm md:text-base">
              {product.name}
            </h3>
            <p className="text-xs md:text-sm text-gray-600 flex-grow">
              {product.description}
            </p>
            <p className="font-bold mt-1">{product.price} kr</p>
          </div>
        </a>
      </Link>
      {/* Add to cart button sits outside of the link to avoid accidental navigation */}
      <button
        className="m-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
        onClick={() => addToCart(product)}
      >
        Lägg i varukorgen
      </button>
    </div>
  );
}

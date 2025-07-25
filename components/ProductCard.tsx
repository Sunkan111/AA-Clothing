import Image from 'next/image';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  size: string;
  fit: string;
  image: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-md overflow-hidden bg-white shadow-sm">
      {/* Note: width and height are required for next/image. Adjust as necessary. */}
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={300}
        className="object-cover w-full h-48"
      />
      <div className="p-2">
        <h3 className="font-semibold text-sm md:text-base">{product.name}</h3>
        <p className="text-xs md:text-sm text-gray-600">{product.description}</p>
        <p className="font-bold mt-1">{product.price} kr</p>
      </div>
    </div>
  );
}

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import { useCart } from '../../contexts/CartContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  size: string[];
  fit: string;
  image: string;
  category: string;
}

/**
 * Dynamic product details page. Fetches product information based on the
 * `id` parameter from the route and displays the details along with an
 * Add to Cart button. It also shows recommended products from the same
 * category, excluding the current product.
 */
export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    /**
     * Load product data using a dynamic import rather than fetching from
     * "/data/products.json". Static JSON files in the project are not exposed
     * via Next.js' public directory by default, so importing ensures the data
     * is bundled at build time. We import from '../../data/products.json'
     * because this page is located in `pages/product`, two levels down from
     * the project root. If the module has a `default` export we use that;
     * otherwise we use the module itself. After loading, we set the full
     * product list and extract the product matching the current `id`.
     */
    import('../../data/products.json')
      .then((module) => {
        const data: Product[] = (module as any).default || module;
        setProducts(data);
        const found = data.find((p) => p.id === id);
        if (found) setProduct(found);
      })
      .catch((err) => {
        console.error('Failed to load product data', err);
      });
  }, [id]);

  if (!product) {
    return (
      <Layout search="" onSearch={() => {}}>
        <div className="p-8">Laddar produkt...</div>
      </Layout>
    );
  }

  const recommended = products.filter(
    (p) => p.id !== product.id && p.category === product.category
  );

  return (
    <Layout search="" onSearch={() => {}}>
      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product image */}
          <div className="flex-1">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
          {/* Product details */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="mb-4 text-gray-700">{product.description}</p>
            <p className="text-xl font-semibold mb-4">{product.price} kr</p>
            <button
              onClick={() => addToCart(product)}
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
            >
              Lägg i varukorg
            </button>
          </div>
        </div>
        {/* Recommended products */}
        {recommended.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">
              Rekommenderade produkter
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
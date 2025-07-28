
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({ size: "", color: "", price: 0 });

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const filtered = products.filter((p) =>
    (!filter.size || p.size.includes(filter.size)) &&
    (!filter.color || p.color === filter.color) &&
    (!filter.price || p.price <= filter.price)
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h1>AA-Clothing</h1>
      <div>
        <label>Storlek:</label>
        <select onChange={(e) => setFilter({ ...filter, size: e.target.value })}>
          <option value="">Alla</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
        </select>

        <label>Färg:</label>
        <select onChange={(e) => setFilter({ ...filter, color: e.target.value })}>
          <option value="">Alla</option>
          <option value="black">Svart</option>
          <option value="blue">Blå</option>
        </select>

        <label>Maxpris:</label>
        <input
          type="number"
          onChange={(e) => setFilter({ ...filter, price: parseInt(e.target.value) })}
        />
      </div>

      <div>
        {filtered.map((product) => (
          <div key={product.id} style={{ marginTop: "1rem" }}>
            <img src={product.image} alt={product.name} width="100" />
            <h3>{product.name}</h3>
            <p>{product.price} kr</p>
          </div>
        ))}
      </div>
    </div>
  );
}

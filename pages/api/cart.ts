let cart = [];

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(cart);
  } else if (req.method === "POST") {
    const { productId } = req.body;
    cart.push(productId);
    res.status(200).json({ message: "Added to cart", cart });
  } else {
    res.status(405).end();
  }
}

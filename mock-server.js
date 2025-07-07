const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Mock user data
const users = [
  { id: 1, email: 'john.doe@example.com', firstName: 'John', lastName: 'Doe' },
  { id: 2, email: 'jane.smith@example.com', firstName: 'Jane', lastName: 'Smith' }
];

// Mock product data
const products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', inStock: true },
  { id: 2, name: 'Coffee Mug', price: 15.99, category: 'Home & Kitchen', inStock: true },
  { id: 3, name: 'Running Shoes', price: 89.99, category: 'Sports', inStock: true }
];

// Mock cart data
let carts = {};

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  const user = users.find(u => u.email === email);
  if (user && password === 'TestPassword123!') {
    res.json({ 
      token: 'mock-jwt-token', 
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  
  if (!email || !firstName || !lastName || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }
  
  const newUser = {
    id: users.length + 1,
    email,
    firstName,
    lastName
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// Product endpoints
app.get('/api/products', (req, res) => {
  const { category, q } = req.query;
  let filteredProducts = products;
  
  if (category) {
    filteredProducts = products.filter(p => 
      p.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  
  if (q) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(q.toLowerCase())
    );
  }
  
  res.json(filteredProducts);
});

app.get('/api/products/search', (req, res) => {
  const { q } = req.query;
  const results = products.filter(p => 
    p.name.toLowerCase().includes(q.toLowerCase())
  );
  res.json(results);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Cart endpoints
app.get('/api/cart', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization required' });
  }
  
  const userId = 'mock-user';
  const cart = carts[userId] || { items: [] };
  res.json(cart);
});

app.post('/api/cart/items', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization required' });
  }
  
  const { productId, quantity } = req.body;
  const userId = 'mock-user';
  
  if (!carts[userId]) {
    carts[userId] = { items: [] };
  }
  
  const cartItem = { productId, quantity };
  carts[userId].items.push(cartItem);
  
  res.status(201).json(cartItem);
});

app.put('/api/cart/items/:productId', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization required' });
  }
  
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = 'mock-user';
  
  if (carts[userId]) {
    const item = carts[userId].items.find(i => i.productId === productId);
    if (item) {
      item.quantity = quantity;
      res.json(item);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

app.delete('/api/cart/items/:productId', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization required' });
  }
  
  const { productId } = req.params;
  const userId = 'mock-user';
  
  if (carts[userId]) {
    carts[userId].items = carts[userId].items.filter(i => i.productId !== productId);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Mock API server running at http://localhost:${port}`);
});

module.exports = app;
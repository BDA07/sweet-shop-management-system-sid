import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  LogIn,
  LogOut,
  User,
  Package,
  Trash2,
  Heart,
  Edit,
  Plus,
  Minus,
  X
} from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

/* ================= TYPES ================= */
interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  imageUrl?: string;
}

interface CartItem {
  sweet: Sweet;
  quantity: number;
}

interface UserType {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface AuthState {
  user: UserType | null;
  token: string | null;
}

// Sample products to show when API is not available
const sampleSweets: Sweet[] = [
  {
    id: 1,
    name: 'Kaju Katli',
    category: 'Traditional',
    price: 450,
    stock: 25,
    description: 'Premium cashew sweet',
    imageUrl: 'https://i.ibb.co/2m1pkp9/Gemini-Generated-Image-e67wwle67wwle67w.png'
  },
  {
    id: 2,
    name: 'Motichoor Ladoo',
    category: 'Traditional',
    price: 380,
    stock: 30,
    description: 'Traditional gram flour sweet',
    imageUrl: 'https://i.ibb.co/bgZ4KrRJ/Gemini-Generated-Image-89bygb89bygb89by.png'
  },
  {
    id: 3,
    name: 'Gulab Jamun',
    category: 'Traditional',
    price: 320,
    stock: 40,
    description: 'Soft milk solid balls in sugar syrup',
    imageUrl: 'https://i.ibb.co/hv82nNz/Gemini-Generated-Image-1jbp1s1jbp1s1jbp.png'
  },
  {
    id: 4,
    name: 'Soan Papdi',
    category: 'Traditional',
    price: 280,
    stock: 35,
    description: 'Flaky, crispy sweet',
    imageUrl: 'https://i.ibb.co/392Jc0Pp/Gemini-Generated-Image-7twmr07twmr07twm.png'
  },
  {
    id: 5,
    name: 'Rasgulla',
    category: 'Traditional',
    price: 300,
    stock: 28,
    description: 'Soft cottage cheese balls in syrup',
    imageUrl: 'https://i.ibb.co/Pv4Wt9Hd/Gemini-Generated-Image-v2bwzqv2bwzqv2bw.png'
  },
  {
    id: 6,
    name: 'Barfi Mix',
    category: 'Traditional',
    price: 420,
    stock: 20,
    description: 'Assorted milk-based sweets',
    imageUrl: 'https://i.ibb.co/pjQH0kHj/Gemini-Generated-Image-8vqmot8vqmot8vqm.png'
  },
  {
    id: 7,
    name: 'Chocolate Barfi',
    category: 'Fusion',
    price: 480,
    stock: 22,
    description: 'Modern twist on traditional barfi',
    imageUrl: 'https://i.ibb.co/spZgC0GW/Gemini-Generated-Image-p8bxx5p8bxx5p8bx.png'
  },
  {
    id: 8,
    name: 'Dry Fruit Mix',
    category: 'Dry Fruits',
    price: 650,
    stock: 15,
    description: 'Premium selection of dry fruits',
    imageUrl: 'https://i.ibb.co/jk5LkCy9/Gemini-Generated-Image-qguuyiqguuyiqguu.png'
  }
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1514849302-984523450cf4?auto=format&fit=crop&w=800&q=80';

const getImageForSweet = (name: string, imageUrl?: string) => {
  return imageUrl || FALLBACK_IMAGE;
};

/* ================= APP ================= */
const App = () => {
  const [auth, setAuth] = useState<AuthState>({ user: null, token: null });
  const [sweets, setSweets] = useState<Sweet[]>(sampleSweets);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>(sampleSweets);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'shop' | 'auth' | 'admin' | 'cart'>('shop');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartSidebar, setShowCartSidebar] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const [sweetForm, setSweetForm] = useState({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    description: '',
    imageUrl: ''
  });

  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);

  /* ================= EFFECTS ================= */
  useEffect(() => {
    fetchSweets();
    const stored = localStorage.getItem('auth');
    if (stored) setAuth(JSON.parse(stored));
    
    const storedCart = localStorage.getItem('cart');
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    let result = sweets;
    if (searchTerm) {
      result = result.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredSweets(result);
  }, [searchTerm, sweets]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  /* ================= CART FUNCTIONS ================= */
  const addToCart = (sweet: Sweet) => {
    const existingItem = cart.find(item => item.sweet.id === sweet.id);
    
    if (existingItem) {
      if (existingItem.quantity < sweet.stock) {
        setCart(cart.map(item =>
          item.sweet.id === sweet.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        alert('Cannot add more than available stock');
      }
    } else {
      setCart([...cart, { sweet, quantity: 1 }]);
    }
    setShowCartSidebar(true);
  };

  const updateQuantity = (sweetId: number, newQuantity: number) => {
    const item = cart.find(item => item.sweet.id === sweetId);
    if (item && newQuantity > item.sweet.stock) {
      alert('Cannot exceed available stock');
      return;
    }
    
    if (newQuantity <= 0) {
      removeFromCart(sweetId);
    } else {
      setCart(cart.map(item =>
        item.sweet.id === sweetId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const removeFromCart = (sweetId: number) => {
    setCart(cart.filter(item => item.sweet.id !== sweetId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.sweet.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert(`Order placed successfully! Total: ₹${getTotalPrice()}`);
    clearCart();
    setShowCartSidebar(false);
  };

  /* ================= API ================= */
  const fetchSweets = async () => {
    try {
      const res = await fetch(`${API_URL}/sweets`);
      const data = await res.json();
      setSweets(data);
      setFilteredSweets(data);
    } catch (error) {
      console.log('Using sample data');
    }
  };

  const handleAuth = async () => {
    try {
      const endpoint = authMode === 'login' ? 'login' : 'register';
      const res = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setAuth({ user: data.user, token: data.token });
        localStorage.setItem('auth', JSON.stringify({ user: data.user, token: data.token }));
        setView('shop');
        setEmail('');
        setPassword('');
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (error) {
      console.log('Auth failed');
      alert('Authentication failed. Please try again.');
    }
  };

  const handleLogout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem('auth');
    setView('shop');
  };

  const handleCreateSweet = async () => {
    try {
      await fetch(`${API_URL}/sweets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify(sweetForm)
      });
      fetchSweets();
      setSweetForm({ name: '', category: '', price: 0, stock: 0, description: '', imageUrl: '' });
    } catch (error) {
      console.log('Create failed');
    }
  };

  const handleUpdateSweet = async () => {
    if (!editingSweet) return;
    try {
      await fetch(`${API_URL}/sweets/${editingSweet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify(sweetForm)
      });
      fetchSweets();
      setEditingSweet(null);
      setSweetForm({ name: '', category: '', price: 0, stock: 0, description: '', imageUrl: '' });
    } catch (error) {
      console.log('Update failed');
    }
  };

  const handleDeleteSweet = async (id: number) => {
    try {
      await fetch(`${API_URL}/sweets/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      fetchSweets();
    } catch (error) {
      console.log('Delete failed');
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">

      {/* HEADER */}
      <header className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white drop-shadow-lg">
            <ShoppingCart size={36} className="animate-pulse" />
            <span className="font-serif">Mithai Junction</span>
          </h1>
          <div className="flex gap-3 items-center">
            <button 
              onClick={() => setView('shop')}
              className={`px-5 py-2 rounded-full font-semibold transition-all ${
                view === 'shop' 
                  ? 'bg-white text-pink-600 shadow-lg' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Shop
            </button>
            {auth.user?.role === 'ADMIN' && (
              <button 
                onClick={() => setView('admin')}
                className={`px-5 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                  view === 'admin' 
                    ? 'bg-white text-purple-600 shadow-lg' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Package size={18} /> Admin
              </button>
            )}
            
            {/* Cart Button */}
            <button 
              onClick={() => setShowCartSidebar(!showCartSidebar)}
              className="relative px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full font-semibold transition-all flex items-center gap-2"
            >
              <ShoppingCart size={18} />
              Cart
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {auth.user ? (
              <button 
                onClick={handleLogout}
                className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full font-semibold transition-all flex items-center gap-2"
              >
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <button 
                onClick={() => setView('auth')}
                className="px-5 py-2 bg-white text-pink-600 rounded-full font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <LogIn size={18} /> Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* CART SIDEBAR */}
      {showCartSidebar && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowCartSidebar(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-orange-500 to-pink-500">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <ShoppingCart size={24} />
                Your Cart
              </h2>
              <button 
                onClick={() => setShowCartSidebar(false)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mt-2">Add some delicious sweets!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.sweet.id} className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-4 shadow-md">
                      <div className="flex gap-4">
                        <img 
                          src={getImageForSweet(item.sweet.name, item.sweet.imageUrl)}
                          className="w-20 h-20 object-cover rounded-lg"
                          alt={item.sweet.name}
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_IMAGE;
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800">{item.sweet.name}</h3>
                          <p className="text-sm text-gray-600">₹{item.sweet.price}/kg</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button 
                              onClick={() => updateQuantity(item.sweet.id, item.quantity - 1)}
                              className="bg-white p-1 rounded-lg hover:bg-gray-100 transition-all"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-semibold px-3">{item.quantity} kg</span>
                            <button 
                              onClick={() => updateQuantity(item.sweet.id, item.quantity + 1)}
                              className="bg-white p-1 rounded-lg hover:bg-gray-100 transition-all"
                            >
                              <Plus size={16} />
                            </button>
                            <button 
                              onClick={() => removeFromCart(item.sweet.id)}
                              className="ml-auto text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-right">
                        <span className="text-lg font-bold text-pink-600">
                          ₹{item.sweet.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-6 bg-gray-50">
                <div className="flex justify-between mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-pink-600">₹{getTotalPrice()}</span>
                </div>
                <button 
                  onClick={checkout}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Checkout
                </button>
                <button 
                  onClick={clearCart}
                  className="w-full mt-2 py-2 text-red-500 hover:bg-red-50 rounded-xl font-semibold transition-all"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* SHOP VIEW */}
        {view === 'shop' && (
          <>
            {/* Search Bar */}
            <div className="mb-10">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                <input
                  placeholder="Search for your favorite sweets..."
                  className="w-full pl-14 pr-6 py-4 text-lg border-2 border-pink-200 rounded-full shadow-lg focus:border-pink-500 focus:ring-4 focus:ring-pink-200 focus:outline-none transition-all"
                  onChange={e => setSearchTerm(e.target.value)}
                  value={searchTerm}
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredSweets.map((sweet) => (
                <div 
                  key={sweet.id} 
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-pink-100">
                    <img
                      src={getImageForSweet(sweet.name, sweet.imageUrl)}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={sweet.name}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-pink-500 hover:text-white transition-all">
                        <Heart size={18} />
                      </button>
                    </div>
                    {sweet.stock < 10 && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          Limited!
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
                      {sweet.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                        ₹{sweet.price}
                      </span>
                      <span className="text-xs text-gray-500">/kg</span>
                    </div>
                    <button 
                      onClick={() => addToCart(sweet)}
                      className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredSweets.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🍬</div>
                <p className="text-gray-500 text-xl">No sweets found matching your search</p>
              </div>
            )}
          </>
        )}

        {/* AUTH VIEW */}
        {view === 'auth' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-t-4 border-pink-500">
              <div className="text-center mb-6">
                <div className="inline-block p-4 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full mb-4">
                  <User className="text-white" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {authMode === 'login' ? 'Welcome Back!' : 'Create Account'}
                </h2>
                <p className="text-gray-500 mt-2">
                  {authMode === 'login' ? 'Login to your sweet account' : 'Join Mithai Junction today'}
                </p>
              </div>
              
              <div className="space-y-4">
                <input 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all" 
                  placeholder="Email" 
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)} 
                />
                <input 
                  type="password" 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all" 
                  placeholder="Password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleAuth()}
                />
                <button 
                  onClick={handleAuth} 
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  {authMode === 'login' ? 'Login' : 'Register'}
                </button>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-pink-600 hover:text-pink-700 font-medium transition-colors"
                >
                  {authMode === 'login' 
                    ? "Don't have an account? Register" 
                    : 'Already have an account? Login'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN VIEW */}
        {view === 'admin' && auth.user?.role === 'ADMIN' && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="text-3xl font-bold mb-2">{sweets.length}</div>
                <div className="text-orange-100">Total Products</div>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="text-3xl font-bold mb-2">{sweets.reduce((acc, s) => acc + s.stock, 0)}</div>
                <div className="text-pink-100">Total Stock (kg)</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="text-3xl font-bold mb-2">{sweets.filter(s => s.stock < 10).length}</div>
                <div className="text-purple-100">Low Stock Items</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="text-3xl font-bold mb-2">₹{Math.round(sweets.reduce((acc, s) => acc + s.price, 0) / sweets.length)}</div>
                <div className="text-indigo-100">Average Price</div>
              </div>
            </div>

            {/* Create/Edit Form */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input 
                    type="text"
                    placeholder="e.g., Kaju Katli"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all"
                    value={sweetForm.name}
                    onChange={e => setSweetForm({...sweetForm, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all"
                    value={sweetForm.category}
                    onChange={e => setSweetForm({...sweetForm, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Fusion">Fusion</option>
                    <option value="Dry Fruits">Dry Fruits</option>
                    <option value="Seasonal">Seasonal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹/kg)</label>
                  <input 
                    type="number"
                    placeholder="450"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all"
                    value={sweetForm.price || ''}
                    onChange={e => setSweetForm({...sweetForm, price: Number(e.target.value)})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stock (kg)</label>
                  <input 
                    type="number"
                    placeholder="25"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all"
                    value={sweetForm.stock || ''}
                    onChange={e => setSweetForm({...sweetForm, stock: Number(e.target.value)})}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea 
                    placeholder="Describe the sweet..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all resize-none"
                    rows={3}
                    value={sweetForm.description}
                    onChange={e => setSweetForm({...sweetForm, description: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                  <input 
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all"
                    value={sweetForm.imageUrl}
                    onChange={e => setSweetForm({...sweetForm, imageUrl: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => {
                    if (editingSweet) {
                      handleUpdateSweet();
                    } else {
                      handleCreateSweet();
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  {editingSweet ? 'Update Sweet' : 'Create Sweet'}
                </button>
                {editingSweet && (
                  <button 
                    onClick={() => {
                      setEditingSweet(null);
                      setSweetForm({ name: '', category: '', price: 0, stock: 0, description: '', imageUrl: '' });
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                Manage Products
              </h2>
              
              <div className="space-y-3">
                {sweets.map(s => (
                  <div key={s.id} className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 flex-1">
                      <img 
                        src={getImageForSweet(s.name, s.imageUrl)} 
                        className="w-20 h-20 object-cover rounded-lg shadow-md"
                        alt={s.name}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 text-lg">{s.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{s.category}</div>
                        <div className="flex gap-4 mt-2">
                          <span className="text-sm font-semibold text-purple-600">₹{s.price}/kg</span>
                          <span className={`text-sm font-semibold ${s.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                            Stock: {s.stock}kg
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingSweet(s);
                          setSweetForm({
                            name: s.name,
                            category: s.category,
                            price: s.price,
                            stock: s.stock,
                            description: s.description,
                            imageUrl: s.imageUrl || ''
                          });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-blue-600 hover:bg-blue-50 p-3 rounded-lg transition-all"
                      >
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Delete ${s.name}?`)) {
                            handleDeleteSweet(s.id);
                          }
                        }}
                        className="text-red-500 hover:bg-red-50 p-3 rounded-lg transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-700 text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">🍬 Mithai Junction - Sweetening Lives Since 1990 🍬</p>
          <p className="text-white/80">Made with ❤️ and lots of sugar</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
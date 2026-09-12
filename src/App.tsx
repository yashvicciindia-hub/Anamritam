import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, CircleUserRound,
  Clock3, Globe, Instagram, Leaf, Menu, Minus, Moon, Plus, Search, ShoppingBag, Sparkles,
  Star, Sun, Trash2, Truck, UserRound, X, Zap,
} from 'lucide-react';
import { CONTACT_DETAILS, GOOGLE_FORM_FIELD_IDS, GOOGLE_FORM_URL } from '@/config';
import Chatbot from '@/components/Chatbot/Chatbot';

type Theme = 'light' | 'dark';
type Category = 'Ladoos' | 'Protein Bars';
type Page = 'home' | 'products' | 'story' | 'why' | 'contact' | 'cart' | 'login' | 'register' | 'checkout' | 'success' | 'product';
type ProductFilter = 'All' | Category;
type Product = { id: string; name: string; category: Category; description: string; price: number; image: string; hoverImage?: string; ingredients: string; pack: string; nutrition: string };
type CartLine = { product: Product; quantity: number };
type User = { name: string; email: string; phone: string; password: string };
type Checkout = { name: string; phone: string; email: string; address: string; city: string; state: string; pincode: string };

const LANGUAGES = [
  { code: 'en', label: 'English (EN)' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
];

function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<string>(() => {
    try {
      const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
      return match ? match[1] : 'en';
    } catch {
      return 'en';
    }
  });

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);
    try {
      if (langCode === 'en') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${window.location.hostname}; path=/;`;
      } else {
        document.cookie = `googtrans=/en/${langCode}; path=/;`;
        document.cookie = `googtrans=/en/${langCode}; domain=.${window.location.hostname}; path=/;`;
      }
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
      } else {
        window.location.reload();
      }
    } catch {}
  };

  return (
    <div className="language-selector" title="Change Language">
      <Globe size={15} className="lang-icon" />
      <select
        value={currentLang}
        onChange={e => handleLanguageChange(e.target.value)}
        aria-label="Select website language"
        className="lang-select"
      >
        {LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Edit product names, descriptions, prices, images, ingredients and nutrition here.
const products: Product[] = [
  { id: 'plain-elaichi', name: 'Plain Elaichi', category: 'Ladoos', description: 'A rich, wholesome ladoo made with traditional ingredients and fragrant elaichi — sweetened naturally, rooted in tradition.', price: 599, image: '/images/products/plainelaichi.jpg', hoverImage: '/images/products/plainelaichi_hover.jpg', ingredients: 'Mahua flower, almonds, cashews, sesame seeds, flax seeds, jaggery, pure ghee, elaichi', pack: 'Box of 6 · 250 g', nutrition: 'Serving size 42 g · Approx. 175 kcal' },
  { id: 'mirchi', name: 'Mirchi', category: 'Ladoos', description: 'A rich, wholesome ladoo made with traditional ingredients and a gentle touch of mirchi — sweetened naturally, rooted in tradition.', price: 599, image: '/images/products/mirchi.png', hoverImage: '/images/products/mirchi_hover.png', ingredients: 'Mahua flower, almonds, cashews, sesame seeds, flax seeds, jaggery, pure ghee, mirchi', pack: 'Box of 6 · 250 g', nutrition: 'Serving size 42 g · Approx. 175 kcal' },
  { id: 'masala', name: 'Masala', category: 'Ladoos', description: 'A rich, wholesome ladoo made with traditional ingredients and warming masala — sweetened naturally, rooted in tradition.', price: 599, image: '/images/products/masala.png', hoverImage: '/images/products/masala_hover.png', ingredients: 'Mahua flower, almonds, cashews, sesame seeds, flax seeds, jaggery, pure ghee, masala spices', pack: 'Box of 6 · 250 g', nutrition: 'Serving size 42 g · Approx. 175 kcal' },
  { id: 'elaichi-ginger-saunf', name: 'Elaichi Ginger Saunf', category: 'Ladoos', description: 'A rich, wholesome ladoo made with traditional ingredients, fragrant elaichi, ginger and saunf — sweetened naturally, rooted in tradition.', price: 599, image: '/images/products/elaichigingersaunf.png', hoverImage: '/images/products/elaichigingersaunf_hover.png', ingredients: 'Mahua flower, almonds, cashews, sesame seeds, flax seeds, jaggery, pure ghee, elaichi, ginger, saunf', pack: 'Box of 6 · 250 g', nutrition: 'Serving size 42 g · Approx. 175 kcal' },
  { id: 'protein-bar-1', name: 'Protein Bar 1', category: 'Protein Bars', description: 'A high-protein bar crafted from natural ingredients — no added sugar, made for active everyday life.', price: 299, image: '/images/products/proteinbar1.png', hoverImage: '/images/products/proteinbar1_hover.png', ingredients: 'Peanut protein, oats, dates, chia seeds, roasted grains, natural flavours', pack: 'Pack of 1 · 60 g', nutrition: 'Serving size 60 g · Approx. 220 kcal · Protein 12 g' },
  { id: 'protein-bar-2', name: 'Protein Bar 2', category: 'Protein Bars', description: 'Wholesome energy in every bite — made from real ingredients, naturally sweetened, suitable for active lifestyles.', price: 299, image: '/images/products/proteinbar2.png', hoverImage: '/images/products/proteinbar2_hover.png', ingredients: 'Peanut protein, almonds, oats, dates, sesame, natural cocoa', pack: 'Pack of 1 · 60 g', nutrition: 'Serving size 60 g · Approx. 225 kcal · Protein 13 g' },
  { id: 'nutri-bites', name: 'Nutri Bites', category: 'Protein Bars', description: 'A wholesome protein bar made specially for kids, with a delicious bite for growing everyday adventures.', price: 299, image: '/images/products/nutribites.png', hoverImage: '/images/products/nutribar_hover.png', ingredients: 'Oats, peanuts, almonds, cashews, seeds, dates and chocolate coating', pack: 'Pack of 1 · 60 g', nutrition: 'Serving size 60 g · See pack for details' },
];

const instagramUrl = 'https://www.instagram.com/anamritam?igsi=N3U3MXB3OHlmNGxy';

function readStorage<T>(key: string, fallback: T): T { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; } }
function money(value: number) { return `₹${value.toLocaleString('en-IN')}`; }
function generateOrderId(): string { const now = new Date(); const year = now.getFullYear(); const month = String(now.getMonth() + 1).padStart(2, '0'); const date = String(now.getDate()).padStart(2, '0'); const randomNum = String(Math.floor(Math.random() * 10000)).padStart(4, '0'); return `ANM-${year}${month}${date}-${randomNum}`; }

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('anamritam-theme');
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });
  const [page, setPage] = useState<Page>('home');
  const [productFilter, setProductFilter] = useState<ProductFilter>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [cart, setCart] = useState<CartLine[]>(() => readStorage('anamritam-cart', []));
  const [user, setUser] = useState<User | null>(() => readStorage('anamritam-session', null));
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('anamritam-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {}
  }, [theme]);

  useEffect(() => { localStorage.setItem('anamritam-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { if (user) localStorage.setItem('anamritam-session', JSON.stringify(user)); else localStorage.removeItem('anamritam-session'); }, [user]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [page]);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 2400); return () => window.clearTimeout(timer); }, [toast]);

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const navigate = (next: Page) => { setPage(next); setMenuOpen(false); setCartOpen(false); };
  const navigateToProducts = (filter: ProductFilter = 'All') => { setProductFilter(filter); navigate('products'); };
  const openProduct = (product: Product) => { setSelectedProduct(product); navigate('product'); };
  const addToCart = (product: Product, quantity = 1) => {
    setCart(current => { const existing = current.find(line => line.product.id === product.id); return existing ? current.map(line => line.product.id === product.id ? { ...line, quantity: line.quantity + quantity } : line) : [...current, { product, quantity }]; });
    setToast(`${product.name} added to your cart`);
  };
  const changeQuantity = (id: string, delta: number) => setCart(current => current.map(line => line.product.id === id ? { ...line, quantity: Math.max(0, line.quantity + delta) } : line).filter(line => line.quantity > 0));
  const removeItem = (id: string) => setCart(current => current.filter(line => line.product.id !== id));

  return <div className="app-shell">
    <Announcement />
    <Navbar
      itemCount={itemCount}
      user={user}
      theme={theme}
      currentPage={page}
      onProductFilter={navigateToProducts}
      onToggleTheme={toggleTheme}
      onNavigate={navigate}
      onCart={() => setCartOpen(true)}
      onMenu={() => setMenuOpen(value => !value)}
      menuOpen={menuOpen}
      onLogout={() => { setUser(null); navigate('home'); }}
    />
    <MobileMenu
      isOpen={menuOpen}
      currentPage={page}
      itemCount={itemCount}
      user={user}
      theme={theme}
      onProductFilter={navigateToProducts}
      onToggleTheme={toggleTheme}
      onNavigate={navigate}
      onCart={() => { setMenuOpen(false); setCartOpen(true); }}
      onClose={() => setMenuOpen(false)}
      onLogout={() => { setUser(null); setMenuOpen(false); navigate('home'); }}
    />
    <main>
      {page === 'home' && <Home onNavigate={navigate} onProduct={openProduct} onAdd={addToCart} />}
      {page === 'products' && <Products filter={productFilter} onFilterChange={setProductFilter} onProduct={openProduct} onAdd={addToCart} />}
      {page === 'product' && <ProductDetails product={selectedProduct} onAdd={addToCart} onBack={() => navigate('products')} />}
      {page === 'story' && <Story onNavigate={navigate} />}
      {page === 'why' && <WhyAnamritam onNavigate={navigate} />}
      {page === 'contact' && <Contact />}
      {page === 'cart' && <CartPage cart={cart} subtotal={subtotal} onChange={changeQuantity} onRemove={removeItem} onNavigate={navigate} />}
      {page === 'register' && <Register onRegister={setUser} onNavigate={navigate} />}
      {page === 'login' && <Login onLogin={setUser} onNavigate={navigate} />}
      {page === 'checkout' && <Checkout user={user} cart={cart} subtotal={subtotal} onNavigate={navigate} />}
      {page === 'success' && <Success onNavigate={navigate} />}
    </main>
    <Footer onNavigate={navigate} />
    <Chatbot
      products={products}
      onViewProduct={productId => {
        const product = products.find(item => item.id === productId);
        if (product) openProduct(product);
      }}
      onAddToCart={productId => {
        const product = products.find(item => item.id === productId);
        if (product) addToCart(product);
      }}
      onExplore={navigateToProducts}
      onOpenCart={() => setCartOpen(true)}
      onContact={() => navigate('contact')}
    />
    {cartOpen && <CartDrawer cart={cart} subtotal={subtotal} onChange={changeQuantity} onRemove={removeItem} onClose={() => setCartOpen(false)} onNavigate={navigate} />}
    {toast && <div className="toast"><Check size={17} />{toast}</div>}
  </div>;
}

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      type="button"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function Announcement() {
  const items = (
    <>
      <span>Thoughtfully made in India</span>
      <span className="announcement-separator">•</span>
      <span>Free shipping on orders above ₹999</span>
      <span className="announcement-separator">•</span>
      <span>Pure · Fresh · Wholesome</span>
      <span className="announcement-separator">•</span>
      <span>Thoughtfully made in India</span>
      <span className="announcement-separator">•</span>
      <span>Free shipping on orders above ₹999</span>
      <span className="announcement-separator">•</span>
      <span>Pure · Fresh · Wholesome</span>
      <span className="announcement-separator">•</span>
    </>
  );

  return (
    <div className="announcement" role="region" aria-label="Announcement">
      <div className="announcement-track">
        <div className="announcement-content">{items}</div>
        <div className="announcement-content" aria-hidden="true">{items}</div>
      </div>
    </div>
  );
}

interface NavbarProps {
  itemCount: number;
  user: User | null;
  theme: Theme;
  currentPage: Page;
    onProductFilter: (filter: ProductFilter) => void;
  menuOpen: boolean;
  onToggleTheme: () => void;
  onNavigate: (page: Page) => void;
  onCart: () => void;
  onMenu: () => void;
  onLogout: () => void;
}

function Navbar({
  itemCount,
  user,
  theme,
  currentPage,
  onProductFilter,
  onToggleTheme,
  onNavigate,
  onCart,
  onMenu,
  menuOpen,
  onLogout,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const productsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!productsMenuRef.current?.contains(event.target as Node)) setProductsOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const selectProductFilter = (filter: ProductFilter) => {
    onProductFilter(filter);
    setProductsOpen(false);
  };

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav-inner">
        <button
          className="mobile-menu-button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={onMenu}
          type="button"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <button className="brand-lockup" onClick={() => onNavigate('home')} aria-label="Anamritam Home">
          <img src="/images/anamritum_logo.jpg" alt="Anamritam" className="brand-logo-img" />
          <span className="brand-title">Anamritam</span>
        </button>

        <nav className="desktop-nav" aria-label="Main Navigation">
          <button
            className={`nav-link ${currentPage === 'home' ? 'is-active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            Home
          </button>
          <div
            className="nav-dropdown"
            ref={productsMenuRef}
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button
              className={`nav-link ${currentPage === 'products' || currentPage === 'product' ? 'is-active' : ''}`}
              onClick={() => setProductsOpen(value => !value)}
              aria-haspopup="menu"
              aria-expanded={productsOpen}
              type="button"
            >
              Products <ChevronDown size={13} aria-hidden="true" />
            </button>
            {productsOpen && <div className="nav-dropdown-menu" role="menu">
              {(['All', 'Ladoos', 'Protein Bars'] as const).map(filter => (
                <button key={filter} type="button" role="menuitem" onClick={() => selectProductFilter(filter)}>{filter}</button>
              ))}
            </div>}
          </div>
          <button
            className={`nav-link ${currentPage === 'story' ? 'is-active' : ''}`}
            onClick={() => onNavigate('story')}
          >
            Our Story
          </button>
          <button
            className={`nav-link ${currentPage === 'why' ? 'is-active' : ''}`}
            onClick={() => onNavigate('why')}
          >
            Why Anamritam
          </button>
          <button
            className={`nav-link ${currentPage === 'contact' ? 'is-active' : ''}`}
            onClick={() => onNavigate('contact')}
          >
            Contact
          </button>
        </nav>

        <div className="nav-actions">
          <LanguageSelector />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          <button
            className={`account-link ${currentPage === 'login' || currentPage === 'register' ? 'is-active' : ''}`}
            onClick={() => onNavigate(user ? 'story' : 'login')}
            aria-label={user ? `Account: ${user.name}` : 'Login or Register'}
          >
            <CircleUserRound size={19} />
            <span className="account-text">{user ? user.name.split(' ')[0] : 'Account'}</span>
          </button>

          {user && (
            <button className="logout-link" onClick={onLogout} title="Sign out">
              Sign out
            </button>
          )}

          <button
            className="cart-button"
            onClick={onCart}
            aria-label={`Open cart with ${itemCount} items`}
          >
            <ShoppingBag size={19} />
            <span className="cart-label">Cart</span>
            {itemCount > 0 && <b className="cart-badge">{itemCount}</b>}
          </button>
        </div>
      </div>
    </header>
  );
}

interface MobileMenuProps {
  isOpen: boolean;
  currentPage: Page;
  itemCount: number;
  user: User | null;
  theme: Theme;
  onProductFilter: (filter: ProductFilter) => void;
  onToggleTheme: () => void;
  onNavigate: (page: Page) => void;
  onCart: () => void;
  onClose: () => void;
  onLogout: () => void;
}

function MobileMenu({
  isOpen,
  currentPage,
  itemCount,
  user,
  theme,
  onProductFilter,
  onToggleTheme,
  onNavigate,
  onCart,
  onClose,
  onLogout,
}: MobileMenuProps) {
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navItems = [
    { label: 'Home', page: 'home' as Page, num: '01' },
    { label: 'Products', page: 'products' as Page, num: '02' },
    { label: 'Our Story', page: 'story' as Page, num: '03' },
    { label: 'Why Anamritam', page: 'why' as Page, num: '04' },
    { label: 'Contact', page: 'contact' as Page, num: '05' },
  ];

  return (
    <div className="mobile-menu-overlay" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
      <div className="mobile-menu-backdrop" onClick={onClose} />
      <div className="mobile-menu-panel">
        <div className="mobile-menu-header">
          <div className="brand-lockup mobile" onClick={() => onNavigate('home')}>
            <img src="/images/anamritum_logo.jpg" alt="Anamritam" className="brand-logo-img" />
            <span className="brand-title">Anamritam</span>
          </div>
          <div className="mobile-menu-header-actions">
            <LanguageSelector />
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button className="mobile-close-btn" onClick={onClose} aria-label="Close navigation">
              <X size={22} />
            </button>
          </div>
        </div>

        <nav className="mobile-nav-list" aria-label="Mobile Navigation Links">
          {navItems.map((item, index) => {
            const isActive =
              item.page === currentPage ||
              (item.page === 'products' && currentPage === 'product');
            if (item.page === 'products') {
              return <div className="mobile-products-group" key={item.label}>
                <button
                  className={`mobile-nav-link ${isActive ? 'is-active' : ''}`}
                  style={{ animationDelay: `${0.04 * (index + 1)}s` }}
                  onClick={() => setProductsOpen(value => !value)}
                  aria-expanded={productsOpen}
                  aria-haspopup="menu"
                >
                  <span className="mobile-nav-num">{item.num}</span>
                  <span className="mobile-nav-label">Products</span>
                  <ChevronDown className={productsOpen ? 'is-open' : ''} size={18} aria-hidden="true" />
                  {isActive && <span className="mobile-active-dot" />}
                </button>
                {productsOpen && <div className="mobile-products-submenu" role="menu">
                  {(['All', 'Ladoos', 'Protein Bars'] as const).map(filter => <button key={filter} type="button" role="menuitem" onClick={() => onProductFilter(filter)}>{filter}</button>)}
                </div>}
              </div>;
            }
            return (
              <button
                key={item.label}
                className={`mobile-nav-link ${isActive ? 'is-active' : ''}`}
                style={{ animationDelay: `${0.04 * (index + 1)}s` }}
                onClick={() => onNavigate(item.page)}
              >
                <span className="mobile-nav-num">{item.num}</span>
                <span className="mobile-nav-label">{item.label}</span>
                {isActive && <span className="mobile-active-dot" />}
              </button>
            );
          })}
        </nav>

        <div className="mobile-menu-footer">
          <div className="mobile-user-section">
            {user ? (
              <div className="mobile-user-card">
                <div className="mobile-user-info">
                  <CircleUserRound size={22} />
                  <div>
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                </div>
                <button className="mobile-logout-btn" onClick={onLogout}>
                  Sign out
                </button>
              </div>
            ) : (
              <div className="mobile-auth-actions">
                <button
                  className="button button-dark full-width"
                  onClick={() => onNavigate('login')}
                >
                  Sign In <ArrowRight size={15} />
                </button>
                <button
                  className="button button-light full-width"
                  onClick={() => onNavigate('register')}
                >
                  Create Account
                </button>
              </div>
            )}
          </div>

          <button className="mobile-cart-cta" onClick={onCart}>
            <div className="mobile-cart-cta-left">
              <ShoppingBag size={18} />
              <span>Shopping Cart</span>
            </div>
            <span className="mobile-cart-cta-badge">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
          </button>

          <p className="mobile-menu-tagline">Pure · Fresh · Wholesome</p>
        </div>
      </div>
    </div>
  );
}
function HomeContent({ onNavigate, onProduct, onAdd }: { onNavigate: (page: Page) => void; onProduct: (p: Product) => void; onAdd: (p: Product, q?: number) => void }) {
  return <><section className="hero"><div className="hero-copy"><p className="eyebrow">Nourishment, made the Indian way</p><h1>Goodness that<br /><em>comes naturally.</em></h1><p className="hero-subtitle">Pure, fresh and wholesome ladoos and protein bars crafted for everyday nourishment.</p><div className="hero-actions"><button className="button button-dark" onClick={() => onNavigate('products')}>Shop now <ArrowRight size={17} /></button><button className="text-button" onClick={() => onNavigate('products')}>Explore our products <ArrowRight size={16} /></button></div><div className="hero-trust"><span><Leaf size={17} /> Thoughtfully sourced</span><span><Sparkles size={17} /> Small-batch made</span></div></div></section><section className="intro section"><div className="intro-mark">A</div><div><p className="eyebrow">A little about us</p><h2>Welcome to <em>Anamritam</em></h2><p className="body-copy">We bring together the goodness of traditional Indian ingredients and the ease of modern nutrition. Honest food, made with care, for the everyday moments that matter.</p><button className="underlined-link" onClick={() => onNavigate('story')}>Our story <ArrowRight size={15} /></button></div></section><CategorySection onNavigate={onNavigate} /><section className="section featured-section"><SectionHeading eyebrow="Made for your everyday" title="Favourites, for good reason" action="Shop all" onAction={() => onNavigate('products')} /><div className="product-grid featured-grid">{products.slice(0, 4).map(product => <ProductCard key={product.id} product={product} onAdd={onAdd} onView={onProduct} />)}</div></section><WhySection /><section className="story-banner"><div className="story-banner-image"><img src="https://images.pexels.com/photos/34142354/pexels-photo-34142354.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Peanuts and grains prepared for a wholesome recipe" /></div><div className="story-banner-copy"><p className="eyebrow">The Anamritam way</p><h2>Rooted in tradition.<br /><em>Made for today.</em></h2><p>We believe nourishing food can be joyful, convenient and deeply connected to where we come from.</p><button className="button button-light" onClick={() => onNavigate('story')}>Discover our story <ArrowRight size={17} /></button></div></section><InstagramSection /></>;
}
function Home({ onNavigate, onProduct, onAdd }: { onNavigate: (page: Page) => void; onProduct: (p: Product) => void; onAdd: (p: Product, q?: number) => void }) {
  const nutriBites = products.find(product => product.id === 'nutri-bites')!;
  return <><HomeContent onNavigate={onNavigate} onProduct={onProduct} onAdd={onAdd} /><FeaturedNutriBites product={nutriBites} onProduct={onProduct} /></>;
}
function FeaturedNutriBites({ product, onProduct }: { product: Product; onProduct: (p: Product) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const intro = document.querySelector('.intro.section');
    if (section && intro?.parentElement) {
      intro.parentElement.insertBefore(section, intro);
    }
  }, []);

  return <section ref={sectionRef} className={`featured-nutri ${isVisible ? 'is-visible' : ''}`}>
    <div className="featured-nutri-copy">
      <p className="eyebrow">NEW · KIDS' RANGE</p>
      <h2>Made for Little <em>Superheroes</em></h2>
      <p>A wholesome protein bar made specially for kids, from Anamritam.</p>
      <button className="button button-dark" onClick={() => onProduct(product)}>Shop Nutri Bites <ArrowRight size={17} /></button>
    </div>
      <button className="featured-nutri-visual" onClick={() => onProduct(product)} aria-label="View Nutri Bites product details">
      <span className="featured-nutri-star star-one">✦</span>
      <span className="featured-nutri-star star-two">✧</span>
      <span className="featured-nutri-dot dot-one" />
      <span className="featured-nutri-stage" aria-hidden="true" />
      <img className="featured-nutri-image featured-nutri-image-hover" src={product.hoverImage} alt="" />
      <img className="featured-nutri-image featured-nutri-image-default" src={product.image} alt="Nutri Bites protein bar for kids" />
    </button>
  </section>;
}
function SectionHeading({ eyebrow, title, action, onAction }: { eyebrow: string; title: string; action?: string; onAction?: () => void }) { return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{action && <button className="underlined-link" onClick={onAction}>{action} <ArrowRight size={15} /></button>}</div>; }
function CategorySection({ onNavigate }: { onNavigate: (page: Page) => void }) { return <section className="section category-section"><SectionHeading eyebrow="Find your kind of good" title="Shop by category" /><div className="category-grid"><button className="category-card category-ladoo" onClick={() => onNavigate('products')}><div><span className="category-number">01</span><h3>Ladoos</h3><p>Traditional goodness,<br />thoughtfully crafted.</p><span className="category-link">Explore ladoos <ArrowRight size={16} /></span></div><img src="https://images.pexels.com/photos/27695747/pexels-photo-27695747.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Traditional Indian ladoos" /></button><button className="category-card category-bar" onClick={() => onNavigate('products')}><div><span className="category-number">02</span><h3>Protein bars</h3><p>Wholesome energy for<br />modern everyday life.</p><span className="category-link">Explore protein bars <ArrowRight size={16} /></span></div><img src="https://images.pexels.com/photos/13898315/pexels-photo-13898315.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Wholesome nut protein bars" /></button></div></section>; }
function ProductCard({ product, onAdd, onView }: { product: Product; onAdd: (p: Product, q?: number) => void; onView: (p: Product) => void }) { const [quantity, setQuantity] = useState(1); return <article className="product-card"><button className="product-image-button" onClick={() => onView(product)}><div className="product-image">{product.hoverImage && <img className="product-img-hover" src={product.hoverImage} alt="" aria-hidden="true" />}<img className="product-img-default" src={product.image} alt={product.name} /><span className="product-tag">{product.category === 'Ladoos' ? 'Ladoo' : 'Bar'}</span></div></button><div className="product-card-copy"><div className="product-card-top"><div><p className="product-category">{product.category}</p><h3>{product.name}</h3></div><strong>{money(product.price)}</strong></div><p className="product-description">{product.description}</p><div className="product-card-actions"><QuantitySelector quantity={quantity} onChange={setQuantity} /><button className="button button-small" onClick={() => onAdd(product, quantity)}>Add to cart</button></div><button className="view-details" onClick={() => onView(product)}>View details <ArrowRight size={14} /></button></div></article>; }
function QuantitySelector({ quantity, onChange }: { quantity: number; onChange: (q: number) => void }) { return <div className="quantity-selector"><button onClick={() => onChange(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus size={14} /></button><span>{quantity}</span><button onClick={() => onChange(quantity + 1)} aria-label="Increase quantity"><Plus size={14} /></button></div>; }
function WhySection() { const items = [{ icon: Leaf, title: 'Pure ingredients', text: 'Thoughtfully selected ingredients.' }, { icon: Sparkles, title: 'Freshly crafted', text: 'Made with care for freshness.' }, { icon: Zap, title: 'Wholesome nutrition', text: 'Balanced nourishment, every day.' }, { icon: Star, title: 'Rooted in tradition', text: 'Indian food, thoughtfully reimagined.' }]; return <section className="section why-section"><SectionHeading eyebrow="Why Anamritam" title="The good stuff, made simple" /><div className="why-grid">{items.map(item => <div className="why-item" key={item.title}><item.icon size={25} strokeWidth={1.5} /><h3>{item.title}</h3><p>{item.text}</p></div>)}</div></section>; }
function InstagramSection() { return <section className="instagram-section"><div><Instagram size={28} /><p className="eyebrow">From our kitchen to your feed</p><h2>Follow <em>Anamritam</em></h2><p>Discover our products, stories and journey.</p><a className="button button-dark" href={instagramUrl} target="_blank" rel="noreferrer">Follow us on Instagram <ArrowRight size={17} /></a></div><div className="insta-grid"><img src="https://images.pexels.com/photos/15741144/pexels-photo-15741144.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Colourful spices at a market" /><img src="https://images.pexels.com/photos/57042/pexels-photo-57042.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Almonds ready for snacking" /><img src="https://images.pexels.com/photos/7932705/pexels-photo-7932705.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Natural ingredients on a table" /></div></section>; }
function Products({ filter, onFilterChange, onProduct, onAdd }: { filter: ProductFilter; onFilterChange: (filter: ProductFilter) => void; onProduct: (p: Product) => void; onAdd: (p: Product, q?: number) => void }) { const [sort, setSort] = useState('Featured'); const shown = useMemo(() => [...products.filter(p => filter === 'All' || p.category === filter)].sort((a, b) => sort === 'Price: Low to High' ? a.price - b.price : sort === 'Price: High to Low' ? b.price - a.price : 0), [filter, sort]); return <section className="products-page"><div className="page-hero"><div><p className="eyebrow">A little good goes a long way</p><h1>Shop Anamritam</h1><p>Wholesome Indian nourishment, made for everyday life.</p></div><span className="page-hero-count">{products.length} products</span></div><div className="products-toolbar"><div className="filter-tabs">{(['All', 'Ladoos', 'Protein Bars'] as const).map(option => <button key={option} className={filter === option ? 'active' : ''} onClick={() => onFilterChange(option)}>{option}</button>)}</div><label className="sort-select"><span>Sort by</span><select value={sort} onChange={event => setSort(event.target.value)}><option>Featured</option><option>Price: Low to High</option><option>Price: High to Low</option></select><ChevronDown size={15} /></label></div><div className="section products-grid-section"><div className="product-grid all-products-grid">{shown.map(product => <ProductCard key={product.id} product={product} onAdd={onAdd} onView={onProduct} />)}</div></div></section>; }
function ProductDetails({ product, onAdd, onBack }: { product: Product; onAdd: (p: Product, q?: number) => void; onBack: () => void }) { const [quantity, setQuantity] = useState(1); const [tab, setTab] = useState('Description'); const [activeImg, setActiveImg] = useState(product.image); return <section className="product-detail-page"><button className="back-link" onClick={onBack}><ChevronLeft size={17} /> Back to products</button><div className="product-detail"><div className="detail-image-col"><div className="detail-image"><img src={activeImg} alt={product.name} /></div>{product.hoverImage && <div className="detail-thumbnails"><button className={`detail-thumb ${activeImg === product.image ? 'is-active' : ''}`} onClick={() => setActiveImg(product.image)}><img src={product.image} alt={product.name} /></button><button className={`detail-thumb ${activeImg === product.hoverImage ? 'is-active' : ''}`} onClick={() => setActiveImg(product.hoverImage!)}><img src={product.hoverImage} alt={`${product.name} alternate view`} /></button></div>}</div><div className="detail-copy"><p className="product-category">{product.category}</p><h1>{product.name}</h1><div className="detail-rating"><span>★★★★★</span> <small>Made with care</small></div><p className="detail-price">{money(product.price)}</p><p className="detail-description">{product.description}</p><div className="detail-meta"><span>Pack size<strong>{product.pack}</strong></span><span>Made with<strong>Real ingredients</strong></span></div><div className="detail-buy"><QuantitySelector quantity={quantity} onChange={setQuantity} /><button className="button button-dark" onClick={() => onAdd(product, quantity)}>Add to cart <ShoppingBag size={17} /></button></div><p className="delivery-note"><Truck size={17} /> Carefully packed and delivered fresh</p></div></div><div className="detail-tabs"><div>{['Description', 'Ingredients', 'Nutrition information'].map(item => <button className={tab === item ? 'active' : ''} key={item} onClick={() => setTab(item)}>{item}</button>)}</div><p>{tab === 'Description' ? product.description : tab === 'Ingredients' ? product.ingredients : product.nutrition}</p></div></section>; }
function CartDrawer({ cart, subtotal, onChange, onRemove, onClose, onNavigate }: { cart: CartLine[]; subtotal: number; onChange: (id: string, d: number) => void; onRemove: (id: string) => void; onClose: () => void; onNavigate: (p: Page) => void }) { return <div className="drawer-backdrop" onClick={onClose}><aside className="cart-drawer" onClick={event => event.stopPropagation()}><div className="drawer-header"><h2>Your cart <span>{cart.length}</span></h2><button onClick={onClose} aria-label="Close cart"><X size={21} /></button></div>{cart.length === 0 ? <EmptyCart onNavigate={onNavigate} /> : <><div className="drawer-items">{cart.map(line => <CartItem key={line.product.id} line={line} onChange={onChange} onRemove={onRemove} />)}</div><div className="drawer-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Shipping calculated at checkout.</p><button className="button button-dark full-width" onClick={() => onNavigate('checkout')}>Checkout <ArrowRight size={17} /></button><button className="view-cart-button" onClick={() => onNavigate('cart')}>View full cart</button></div></>}</aside></div>; }
function CartItem({ line, onChange, onRemove }: { line: CartLine; onChange: (id: string, d: number) => void; onRemove: (id: string) => void }) { return <div className="cart-item"><img src={line.product.image} alt={line.product.name} /><div className="cart-item-content"><div><h3>{line.product.name}</h3><p>{money(line.product.price)}</p></div><button className="remove-button" aria-label={`Remove ${line.product.name}`} onClick={() => onRemove(line.product.id)}><Trash2 size={15} /></button><div className="cart-item-bottom"><div className="mini-quantity"><button onClick={() => onChange(line.product.id, -1)}><Minus size={12} /></button><span>{line.quantity}</span><button onClick={() => onChange(line.product.id, 1)}><Plus size={12} /></button></div><strong>{money(line.product.price * line.quantity)}</strong></div></div></div>; }
function EmptyCart({ onNavigate }: { onNavigate: (p: Page) => void }) { return <div className="empty-cart"><ShoppingBag size={35} /><h3>Your cart is empty</h3><p>Find something good to bring home.</p><button className="button button-dark" onClick={() => onNavigate('products')}>Continue shopping</button></div>; }
function CartPage({ cart, subtotal, onChange, onRemove, onNavigate }: { cart: CartLine[]; subtotal: number; onChange: (id: string, d: number) => void; onRemove: (id: string) => void; onNavigate: (p: Page) => void }) { return <section className="cart-page"><div className="page-hero compact"><div><p className="eyebrow">Almost yours</p><h1>Your cart</h1></div><span className="page-hero-count">{cart.reduce((sum, line) => sum + line.quantity, 0)} items</span></div>{cart.length === 0 ? <EmptyCart onNavigate={onNavigate} /> : <div className="cart-layout"><div className="cart-page-items">{cart.map(line => <CartItem key={line.product.id} line={line} onChange={onChange} onRemove={onRemove} />)}</div><div className="cart-summary"><h2>Order summary</h2><div className="summary-row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="summary-row muted"><span>Shipping</span><span>Calculated at checkout</span></div><div className="summary-total"><span>Total</span><strong>{money(subtotal)}</strong></div><button className="button button-dark full-width" onClick={() => onNavigate('checkout')}>Proceed to checkout <ArrowRight size={17} /></button><button className="continue-shopping" onClick={() => onNavigate('products')}><ChevronLeft size={15} /> Continue shopping</button></div></div>}</section>; }
function Register({ onRegister, onNavigate }: { onRegister: (u: User) => void; onNavigate: (p: Page) => void }) { const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' }); const [error, setError] = useState(''); const submit = (event: FormEvent) => { event.preventDefault(); if (!form.name || !form.email || !form.phone || !form.password) return setError('Please fill in all fields.'); if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Please enter a valid email address.'); if (!/^[0-9+\s-]{10,}$/.test(form.phone)) return setError('Please enter a valid mobile number.'); if (form.password !== form.confirm) return setError('Your passwords do not match.'); onRegister({ name: form.name, email: form.email, phone: form.phone, password: form.password }); onNavigate('home'); }; return <AccountShell eyebrow="A warmer welcome" title="Create your Anamritam account" copy="Save your details for a smoother checkout and stay close to the good stuff."><form className="account-form" onSubmit={submit}>{['name', 'email', 'phone', 'password', 'confirm'].map(field => <FormField key={field} label={field === 'name' ? 'Full name' : field === 'confirm' ? 'Confirm password' : field === 'phone' ? 'Mobile number' : field[0].toUpperCase() + field.slice(1)} type={field.includes('password') || field === 'confirm' ? 'password' : field === 'email' ? 'email' : 'text'} value={form[field as keyof typeof form]} onChange={value => setForm(current => ({ ...current, [field]: value }))} />)}{error && <p className="form-error">{error}</p>}<button className="button button-dark full-width" type="submit">Create account <ArrowRight size={17} /></button><p className="account-switch">Already have an account? <button type="button" onClick={() => onNavigate('login')}>Login</button></p></form></AccountShell>; }
function Login({ onLogin, onNavigate }: { onLogin: (u: User) => void; onNavigate: (p: Page) => void }) { const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const submit = (event: FormEvent) => { event.preventDefault(); const saved = readStorage<User | null>('anamritam-account', null); if (saved && saved.email === email && saved.password === password) { onLogin(saved); onNavigate('home'); } else { const fallback = { name: email.split('@')[0] || 'Anamritam friend', email, phone: '', password }; if (!email || !password) setError('Please enter your email and password.'); else { localStorage.setItem('anamritam-account', JSON.stringify(fallback)); onLogin(fallback); onNavigate('home'); } } }; return <AccountShell eyebrow="Welcome back" title="Good to see you again" copy="Your favourite wholesome things are never far away."><form className="account-form" onSubmit={submit}><FormField label="Email" type="email" value={email} onChange={setEmail} /><FormField label="Password" type="password" value={password} onChange={setPassword} /><div className="forgot-row"><button type="button" onClick={() => setError('Password recovery will be available in a future version.')}>Forgot password?</button></div>{error && <p className="form-error">{error}</p>}<button className="button button-dark full-width" type="submit">Login <ArrowRight size={17} /></button><p className="account-switch">New to Anamritam? <button type="button" onClick={() => onNavigate('register')}>Create an account</button></p></form></AccountShell>; }
function AccountShell({ eyebrow, title, copy, children }: { eyebrow: string; title: string; copy: string; children: ReactNode }) { return <section className="account-page"><div className="account-panel"><img src="/images/anamritum_logo.jpg" alt="Anamritam" className="account-logo" /><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{copy}</p>{children}</div><div className="account-image"><img src="https://images.pexels.com/photos/15741144/pexels-photo-15741144.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="A colourful spread of Indian spices" /></div></section>; }
function FormField({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (value: string) => void }) { return <label className="form-field"><span>{label}</span><input required type={type} value={value} onChange={event => onChange(event.target.value)} /></label>; }
function Checkout({ user, cart, subtotal, onNavigate }: { user: User | null; cart: CartLine[]; subtotal: number; onNavigate: (p: Page) => void }) { const [review, setReview] = useState(false); const [error, setError] = useState(''); const [form, setForm] = useState<Checkout>({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '', address: '', city: '', state: '', pincode: '' }); const totalQuantity = cart.reduce((sum, line) => sum + line.quantity, 0); const update = (key: keyof Checkout, value: string) => setForm(current => ({ ...current, [key]: value })); const submit = (event: FormEvent) => { event.preventDefault(); if (Object.values(form).some(value => !value.trim())) setError('Please complete every delivery field.'); else setReview(true); }; const confirm = () => { const orderId = generateOrderId(); const orderDetails = cart.map(line => `${line.quantity} × ${line.product.name}`).join('\n'); const values: Record<string, string> = { name: form.name, email: form.email, address: form.address, phone: form.phone, city: form.city, state: form.state, pincode: form.pincode, orderDetails, quantity: String(totalQuantity), total: money(subtotal), orderId }; const query = Object.entries(GOOGLE_FORM_FIELD_IDS).map(([key, id]) => `${encodeURIComponent(id)}=${encodeURIComponent(values[key])}`).join('&'); window.location.href = `${GOOGLE_FORM_URL}${GOOGLE_FORM_URL.includes('?') ? '&' : '?'}${query}`; }; if (cart.length === 0) return <section className="checkout-page"><EmptyCart onNavigate={onNavigate} /></section>; return <section className="checkout-page"><button className="back-link" onClick={() => onNavigate('cart')}><ChevronLeft size={17} /> Back to cart</button><div className="checkout-header"><div><p className="eyebrow">Nearly there</p><h1>{review ? 'Review your order' : 'Checkout'}</h1></div><div className="checkout-steps"><span className={!review ? 'active' : ''}>01 Details</span><span className={review ? 'active' : ''}>02 Review</span></div></div>{review ? <ReviewOrder form={form} cart={cart} subtotal={subtotal} onBack={() => setReview(false)} onConfirm={confirm} error={error} /> : <div className="checkout-layout"><form className="checkout-form" onSubmit={submit}><h2>Customer information</h2><p className="form-hint">We’ll use these details to prepare your order.</p><div className="form-grid"><FormField label="Full name" type="text" value={form.name} onChange={value => update('name', value)} /><FormField label="Mobile number" type="text" value={form.phone} onChange={value => update('phone', value)} /><FormField label="Email" type="email" value={form.email} onChange={value => update('email', value)} /></div><h2 className="address-heading">Delivery address</h2><div className="form-grid"><label className="form-field full-span"><span>Address line</span><input required value={form.address} onChange={event => update('address', event.target.value)} /></label><FormField label="City" type="text" value={form.city} onChange={value => update('city', value)} /><FormField label="State" type="text" value={form.state} onChange={value => update('state', value)} /><FormField label="Pincode" type="text" value={form.pincode} onChange={value => update('pincode', value)} /></div>{error && <p className="form-error">{error}</p>}<button className="button button-dark" type="submit">Continue to review <ArrowRight size={17} /></button></form><OrderSummary cart={cart} subtotal={subtotal} /></div>}</section>; }
function OrderSummary({ cart, subtotal }: { cart: CartLine[]; subtotal: number }) { return <aside className="order-summary"><h2>Order summary</h2>{cart.map(line => <div className="order-line" key={line.product.id}><img src={line.product.image} alt="" /><div><p>{line.product.name}</p><span>Qty {line.quantity}</span></div><strong>{money(line.product.price * line.quantity)}</strong></div>)}<div className="summary-total"><span>Total</span><strong>{money(subtotal)}</strong></div><p className="secure-note"><Leaf size={15} /> Simple, transparent ordering</p></aside>; }
function ReviewOrder({ form, cart, subtotal, onBack, onConfirm, error }: { form: Checkout; cart: CartLine[]; subtotal: number; onBack: () => void; onConfirm: () => void; error: string }) { return <div className="review-layout"><div className="review-card"><div className="review-card-heading"><h2>Review your order</h2><button onClick={onBack}>Edit details</button></div>{cart.map(line => <div className="review-line" key={line.product.id}><span>{line.quantity} × {line.product.name}</span><strong>{money(line.product.price * line.quantity)}</strong></div>)}<div className="summary-total"><span>Total</span><strong>{money(subtotal)}</strong></div><div className="customer-review"><h3>Delivering to</h3><p>{form.name}<br />{form.phone} · {form.email}<br />{form.address}, {form.city}, {form.state} - {form.pincode}</p></div>{error && <p className="form-error">{error}</p>}<button className="button button-dark full-width" onClick={onConfirm}>Confirm & continue <ArrowRight size={17} /></button><p className="review-disclaimer">You’ll complete the final order submission in the next step.</p></div></div>; }
function Success({ onNavigate }: { onNavigate: (p: Page) => void }) { return <section className="success-page"><div className="success-icon"><Check size={30} /></div><p className="eyebrow">One last step</p><h1>Your order is ready.</h1><p>Please complete the final order submission in the next step. Your details are already filled in for you.</p><button className="button button-dark" onClick={() => onNavigate('home')}>Return home <ArrowRight size={17} /></button></section>; }
function Story({ onNavigate }: { onNavigate: (p: Page) => void }) { return <section className="story-page"><div className="story-intro"><p className="eyebrow">Our story</p><h1>Food that feels<br /><em>like a good idea.</em></h1><p>At Anamritam, we’re bringing the familiar comfort of Indian nourishment into the rhythm of modern life.</p></div><img className="story-wide-image" src="/images/story.jpg" alt="Ingredients laid out for a wholesome recipe" /><div className="story-columns"><div><p className="eyebrow">Our belief</p><h2>Simple ingredients.<br />Thoughtful making.</h2></div><div><p>We look to the foods, flavours and rituals that have always made Indian kitchens special. Then we make them fit the way we live now: busy mornings, in-between moments and everyday celebrations.</p><p>Our ladoos and protein bars are made to be picked up, shared and enjoyed — with no fuss and nothing to prove.</p><button className="underlined-link" onClick={() => onNavigate('products')}>Taste the good stuff <ArrowRight size={15} /></button></div></div><WhySection /></section>; }
function WhyAnamritam({ onNavigate }: { onNavigate: (p: Page) => void }) { const benefits = [{ icon: Leaf, title: 'Thoughtfully made', text: 'Every product is crafted with care, with attention to the ingredients and the joy of preparation.' }, { icon: Sparkles, title: 'Wholesome ingredients', text: 'We focus on familiar, carefully selected ingredients that make everyday nourishment feel good.' }, { icon: Star, title: 'Made in India', text: 'Our point of view is rooted in Indian ingredients, flavours and food traditions.' }, { icon: Zap, title: 'Naturally delicious', text: 'Wholesome food should be something you look forward to, so flavour is always part of the experience.' }, { icon: Clock3, title: 'Made for everyday nourishment', text: 'Anamritam fits into real routines with food that is simple, approachable and easy to enjoy.' }]; return <section className="why-page"><div className="why-page-intro"><div><p className="eyebrow">Why Anamritam</p><h1>Goodness You Can <em>Trust.</em></h1><p>At Anamritam, we believe everyday nourishment should be simple, wholesome and genuinely enjoyable.</p></div><img src="/images/why.jpg" alt="Wholesome ingredients prepared for Anamritam" /></div><div className="why-page-benefits"><div><p className="eyebrow">Why choose Anamritam?</p><h2>A better kind of everyday good.</h2></div><div className="why-page-grid">{benefits.map(item => <article className="why-page-item" key={item.title}><item.icon size={25} strokeWidth={1.5} /><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div><div className="why-page-cta"><p>Discover wholesome goodness, made for everyday life.</p><button className="button button-dark" onClick={() => onNavigate('products')}>Explore our products <ArrowRight size={17} /></button></div></section>; }
function Contact() { return <section className="contact-page"><div className="contact-intro"><p className="eyebrow">We’d love to hear from you</p><h1>Let’s talk<br /><em>good food.</em></h1><p>Questions about an order, our products or just want to say hello? We’re here.</p></div><div className="contact-details"><div><span>Email</span><a href={`mailto:${CONTACT_DETAILS.email}`}>{CONTACT_DETAILS.email}</a></div><div><span>Phone</span><p>{CONTACT_DETAILS.phone}</p></div><div><span>Address</span><p>{CONTACT_DETAILS.address}</p></div><a className="button button-dark" href={`mailto:${CONTACT_DETAILS.email}`}>Send us a note <ArrowRight size={17} /></a></div></section>; }
function Footer({ onNavigate }: { onNavigate: (p: Page) => void }) { return <footer className="footer"><div className="footer-main"><div className="footer-brand"><img src="/images/anamritum_logo.jpg" alt="Anamritam" /><p>Pure · Fresh · Wholesome</p><a href={instagramUrl} target="_blank" rel="noreferrer"><Instagram size={18} /> Instagram</a></div><div className="footer-links"><div><h3>Explore</h3><button onClick={() => onNavigate('home')}>Home</button><button onClick={() => onNavigate('products')}>Products</button><button onClick={() => onNavigate('story')}>Our story</button><button onClick={() => onNavigate('contact')}>Contact</button></div><div><h3>Customer</h3><button onClick={() => onNavigate('login')}>Login</button><button onClick={() => onNavigate('register')}>Register</button><button onClick={() => onNavigate('cart')}>Cart</button></div><div className="footer-contact"><h3>Say hello</h3><p>{CONTACT_DETAILS.email}</p><p>{CONTACT_DETAILS.phone}</p></div><div className="footer-visit"><h3>Visit Us</h3><p>13, Institutional Area,<br />Lodhi Road,<br />New Delhi-110003</p></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Anamritam</span><span>Made with care in India</span></div></footer>; }

export default App;

import React, { useState, useEffect } from 'react';
import { useAudio } from '../context/AudioContext';
import { ShoppingBag, Music, Volume2, ArrowRight, Sparkles, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { unlocked, unlockAudio, changeBgm, currentBgm, isPlaying } = useAudio();
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  // Load menus from Backend
  useEffect(() => {
    fetch('http://localhost:5000/api/menus')
      .then((res) => {
        if (!res.ok) throw new Error('메뉴를 불러오는데 실패했습니다.');
        return res.json();
      })
      .then((data) => {
        setMenus(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Save cart to local storage so Pickup page can read it
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleStartWithBgm = () => {
    if (menus.length > 0) {
      // Unlock audio using the first menu item (Salt Bread - Mozart)
      unlockAudio(menus[0]);
    }
  };

  const handleSelectMenu = (menu) => {
    changeBgm(menu);
  };

  const addToCart = (menu, e) => {
    e.stopPropagation(); // Avoid triggering card click BGM twice if we want distinct actions
    
    // Play menu's BGM
    changeBgm(menu);

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === menu.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === menu.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...menu, quantity: 1 }];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + amount;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    navigate('/pickup');
  };

  return (
    <div className="relative min-h-screen pb-16 bg-bakery-50">
      
      {/* 1. Autoplay Unlock Modal */}
      {!unlocked && !loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bakery-900/40 backdrop-blur-md">
          <div className="bg-bakery-50 rounded-2xl p-8 max-w-md w-full mx-4 border border-bakery-200 shadow-2xl text-center animate-fade-in">
            <div className="mx-auto w-16 h-16 bg-bakery-100 rounded-full flex items-center justify-center mb-6 text-bakery-600">
              <Music className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-bakery-800 mb-3">
              Crust & Cream에 오신 것을 환영합니다
            </h2>
            <p className="text-bakery-600 mb-8 text-sm leading-relaxed">
              저희 베이커리는 각 메뉴와 어우러지는 클래식 음악을 함께 선사합니다. 
              소리와 미각이 어우러지는 오감 만족 베이커리를 음악과 함께 둘러보세요.
            </p>
            <button
              onClick={handleStartWithBgm}
              className="w-full py-3.5 bg-bakery-800 hover:bg-bakery-700 text-white rounded-xl font-medium tracking-wide shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Volume2 className="w-5 h-5" />
              <span>음악과 함께 베이커리 둘러보기</span>
            </button>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <div className="relative bg-bakery-800 py-24 text-center px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-15 mix-blend-overlay">
          <img 
            src="/images/bakery-background.jpg" 
            alt="Bakery background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <span className="inline-flex items-center space-x-1 text-xs text-bakery-300 uppercase tracking-widest font-semibold mb-3">
            <Sparkles size={12} />
            <span>Classic Music & Premium Bakery</span>
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            귀로 듣고 입으로 즐기는<br />예술적인 오감 베이커리
          </h1>
          <p className="text-bakery-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            프랑스 정통 베이킹 기법으로 구워낸 고품격 빵과 마스터가 선곡한 최고의 클래식 음악이 어우러져 깊은 힐링을 선사합니다.
          </p>
          <a
            href="#menu-section"
            className="inline-flex items-center space-x-2 bg-bakery-200 hover:bg-bakery-100 text-bakery-800 px-6 py-3 rounded-full font-medium shadow-md transition-all duration-300 hover:scale-105"
          >
            <span>메뉴 둘러보기</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>

      {/* Main Menu Section */}
      <div id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-bakery-800">시그니처 메뉴 & BGM 페어링</h2>
          <p className="text-bakery-500 mt-2 text-sm">원하는 빵을 선택하여 분위기를 전환해 보세요. 각 빵마다 다른 클래식 곡이 재생됩니다.</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bakery-600 mb-2"></div>
            <p className="text-bakery-500 text-sm">메뉴를 로딩하고 있습니다...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-600">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {menus.map((menu) => {
              const isCurrentBgm = currentBgm && currentBgm.bgm_url === menu.bgm_url;
              return (
                <div
                  key={menu.id}
                  onClick={() => handleSelectMenu(menu)}
                  className={`bg-white rounded-2xl overflow-hidden border transition-all duration-500 cursor-pointer group shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                    isCurrentBgm && isPlaying
                      ? 'border-bakery-500 ring-2 ring-bakery-200/50'
                      : 'border-bakery-200/60'
                  }`}
                >
                  {/* Menu Image */}
                  <div className="h-56 relative overflow-hidden bg-bakery-100">
                    <img
                      src={menu.image_url}
                      alt={menu.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* BGM Overlay Badge */}
                    <div className="absolute top-4 left-4 bg-bakery-900/75 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs flex items-center space-x-1.5">
                      <Music size={12} className={isCurrentBgm && isPlaying ? 'animate-bounce text-bakery-300' : ''} />
                      <span className="font-medium truncate max-w-[150px]">{menu.bgm_title}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-bakery-800 font-serif">{menu.name}</h3>
                      <span className="text-lg font-bold text-bakery-700">
                        {menu.price.toLocaleString()}원
                      </span>
                    </div>
                    <p className="text-bakery-600 text-sm leading-relaxed mb-6 h-12 overflow-hidden">
                      {menu.description}
                    </p>

                    {/* Classic pairing card detail */}
                    <div className="bg-bakery-50 rounded-xl p-3 mb-6 border border-bakery-100/80 flex items-center justify-between">
                      <div className="overflow-hidden">
                        <p className="text-[10px] text-bakery-400 font-semibold uppercase tracking-wider">Pairing BGM</p>
                        <p className="text-xs text-bakery-700 font-bold truncate">{menu.bgm_title}</p>
                        <p className="text-[10px] text-bakery-500 truncate">{menu.bgm_artist}</p>
                      </div>
                      
                      {isCurrentBgm && isPlaying && (
                        <div className="bg-bakery-200/50 text-bakery-700 p-2 rounded-full">
                          <Volume2 size={16} className="animate-pulse" />
                        </div>
                      )}
                    </div>

                    {/* Add to Cart button */}
                    <button
                      onClick={(e) => addToCart(menu, e)}
                      className="w-full py-2.5 bg-bakery-100 hover:bg-bakery-800 text-bakery-700 hover:text-white rounded-xl text-sm font-semibold tracking-wide border border-bakery-300 hover:border-transparent transition-all duration-300 flex items-center justify-center space-x-1.5"
                    >
                      <ShoppingBag size={15} />
                      <span>픽업 장바구니 담기</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Floating Shopping Cart Drawer */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-30">
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="flex items-center space-x-2 bg-bakery-800 hover:bg-bakery-700 text-white px-5 py-3.5 rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <ShoppingCart size={20} />
            <span className="font-semibold text-sm">픽업 바구니</span>
            <span className="bg-white text-bakery-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </button>
        </div>
      )}

      {/* Cart Side/Modal Drawer */}
      {isCartOpen && cart.length > 0 && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col p-6 animate-[slideIn_0.3s_ease-out]">
            <div className="flex justify-between items-center border-b border-bakery-100 pb-4 mb-4">
              <h3 className="text-xl font-bold font-serif text-bakery-800 flex items-center space-x-2">
                <ShoppingCart />
                <span>선택한 픽업 상품</span>
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-bakery-400 hover:text-bakery-600 text-sm"
              >
                닫기
              </button>
            </div>

            {/* Cart Items list */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 border border-bakery-100 rounded-xl hover:bg-bakery-50 transition-colors">
                  <div className="flex-1 min-w-0 mr-4">
                    <h4 className="text-sm font-bold text-bakery-800 truncate">{item.name}</h4>
                    <p className="text-xs text-bakery-500 mt-0.5">
                      {item.price.toLocaleString()}원 × {item.quantity}
                    </p>
                    <span className="text-[10px] text-bakery-400 bg-bakery-100 px-2 py-0.5 rounded-full inline-block mt-1">
                      BGM: {item.bgm_title}
                    </span>
                  </div>
                  
                  {/* Quantity adjustments */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 border border-bakery-200 rounded text-bakery-600 hover:bg-bakery-100"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 border border-bakery-200 rounded text-bakery-600 hover:bg-bakery-100"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded ml-2"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total and Checkout */}
            <div className="border-t border-bakery-100 pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-bakery-600">합계 금액</span>
                <span className="text-xl font-bold text-bakery-800">
                  {getCartTotal().toLocaleString()}원
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-bakery-800 hover:bg-bakery-700 text-white rounded-xl font-semibold tracking-wide transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <span>픽업 예약하러 가기</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

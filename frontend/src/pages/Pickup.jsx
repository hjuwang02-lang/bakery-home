import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, ShoppingCart, CheckCircle, ShieldAlert } from 'lucide-react';

export default function Pickup() {
  const [cart, setCart] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');

  // Time slots for pickup
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  // 1. Authentication Redirect check
  useEffect(() => {
    if (!token) {
      // Redirect to login, storing current location to return to
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [token, navigate, location]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (cart.length === 0) {
      setError('장바구니가 비어 있습니다. 홈으로 이동하여 빵을 담아주세요.');
      return;
    }

    if (!date || !time) {
      setError('픽업 날짜와 시간을 선택해주세요.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date,
          time,
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            bgm_title: item.bgm_title
          })),
          total_price: getCartTotal()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '예약 등록에 실패했습니다.');
      }

      setSuccess(true);
      // Empty the cart
      setCart([]);
      localStorage.removeItem('cart');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get tomorrow's date string (min value for datepicker)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get max date string (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  if (!token) {
    return null; // Don't render anything while redirecting
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold font-serif text-bakery-800 mb-3">픽업 예약 완료!</h2>
        <p className="text-bakery-600 mb-8 text-sm leading-relaxed">
          선택하신 일시에 매장을 방문해 주시면 갓 구워낸 맛있는 빵을 준비해 놓겠습니다. 
          매장에서 매력적인 BGM과 함께 픽업해 가세요.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-bakery-800 hover:bg-bakery-700 text-white rounded-xl font-medium tracking-wide shadow-md transition-colors"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-bakery-50 min-h-[80vh]">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-serif font-bold text-bakery-800">픽업 예약 신청</h1>
        <p className="text-bakery-500 mt-2 text-sm">일시를 정하고 매장 픽업을 신청하세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-bakery-200 shadow-lg">
          <h2 className="text-xl font-serif font-bold text-bakery-800 mb-6 flex items-center space-x-2">
            <CalendarIcon className="text-bakery-600" />
            <span>예약 시간 및 일정 선택</span>
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm flex items-start space-x-2 mb-6">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleReservationSubmit} className="space-y-6">
            
            {/* Date Pick */}
            <div>
              <label className="block text-sm font-semibold text-bakery-700 mb-2">픽업 날짜</label>
              <input
                type="date"
                required
                min={getMinDate()}
                max={getMaxDate()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full px-4 py-3 border border-bakery-300 rounded-xl bg-bakery-50/30 text-bakery-800 focus:outline-none focus:ring-2 focus:ring-bakery-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Time Slot Select */}
            <div>
              <label className="block text-sm font-semibold text-bakery-700 mb-3 flex items-center space-x-1">
                <Clock size={16} className="text-bakery-500" />
                <span>픽업 희망 시간</span>
              </label>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {timeSlots.map((slot) => {
                  const isSelected = time === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-bakery-800 border-transparent text-white shadow-md font-bold'
                          : 'border-bakery-200 bg-white text-bakery-700 hover:bg-bakery-100 hover:border-bakery-300'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="w-full py-4 bg-bakery-800 hover:bg-bakery-700 disabled:bg-bakery-400 text-white rounded-xl font-bold tracking-wide shadow-md hover:shadow-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>{loading ? '예약 신청 중...' : '픽업 예약 확정하기'}</span>
            </button>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5 bg-bakery-100/50 p-8 rounded-2xl border border-bakery-200 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-bakery-800 mb-6 flex items-center space-x-2">
              <ShoppingCart className="text-bakery-600" />
              <span>장바구니 내역</span>
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-12 text-bakery-400 italic">
                담긴 빵이 없습니다.<br />홈에서 마음에 드는 상품을 선택해 주세요.
              </div>
            ) : (
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b border-bakery-200/60 last:border-0">
                    <div>
                      <h4 className="text-sm font-bold text-bakery-800">{item.name}</h4>
                      <p className="text-xs text-bakery-500 mt-0.5">
                        수량: {item.quantity}개 / BGM: {item.bgm_title}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-bakery-800">
                      {(item.price * item.quantity).toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-bakery-200 pt-6 mt-6">
            <div className="flex justify-between items-center text-lg font-bold text-bakery-800">
              <span>최종 결제 금액</span>
              <span className="text-xl text-bakery-900">
                {getCartTotal().toLocaleString()}원
              </span>
            </div>
            <p className="text-[11px] text-bakery-500 mt-2 leading-relaxed">
              * 결제는 매장에서 픽업 시 현장(카드/현금/페이)에서 진행됩니다.<br />
              * 예약 시간 최소 1시간 전까지는 취소가 가능합니다.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

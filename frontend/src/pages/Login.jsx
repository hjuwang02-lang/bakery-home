import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { KeyRound, Mail, User, ShieldAlert, ArrowRight } from 'lucide-react';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target (e.g. from pickup page redirection)
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const url = isRegister 
      ? 'http://localhost:5000/api/auth/register' 
      : 'http://localhost:5000/api/auth/login';

    const payload = isRegister 
      ? { username, password, name } 
      : { username, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '처리 중 오류가 발생했습니다.');
      }

      if (isRegister) {
        setSuccess('회원가입이 완료되었습니다. 로그인 해주세요.');
        setIsRegister(false);
        setPassword('');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Custom window event to notify Navbar of status change
        window.dispatchEvent(new Event('storage'));
        
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-bakery-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-bakery-200 shadow-xl">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold font-serif text-bakery-800">
            {isRegister ? '회원가입' : '로그인'}
          </h2>
          <p className="mt-2 text-sm text-bakery-500">
            {isRegister 
              ? 'Crust & Cream의 회원이 되어 특별한 혜택을 누리세요.' 
              : '로그인하여 픽업 예약 및 리뷰를 작성해 보세요.'}
          </p>
        </div>

        {/* Error/Success Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm flex items-start space-x-2">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 rounded-xl p-4 text-sm">
            {success}
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Real Name (Only for Register) */}
            {isRegister && (
              <div>
                <label className="block text-sm font-semibold text-bakery-700 mb-1">이름</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-bakery-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="홍길동"
                    className="block w-full pl-10 pr-3 py-3 border border-bakery-300 rounded-xl bg-bakery-50/30 text-bakery-800 placeholder-bakery-400 focus:outline-none focus:ring-2 focus:ring-bakery-400 focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>
            )}

            {/* Username/ID */}
            <div>
              <label className="block text-sm font-semibold text-bakery-700 mb-1">사용자 아이디</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-bakery-400">
                  <Mail size={16} />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="block w-full pl-10 pr-3 py-3 border border-bakery-300 rounded-xl bg-bakery-50/30 text-bakery-800 placeholder-bakery-400 focus:outline-none focus:ring-2 focus:ring-bakery-400 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-bakery-700 mb-1">비밀번호</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-bakery-400">
                  <KeyRound size={16} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-3 border border-bakery-300 rounded-xl bg-bakery-50/30 text-bakery-800 placeholder-bakery-400 focus:outline-none focus:ring-2 focus:ring-bakery-400 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-bakery-800 hover:bg-bakery-700 disabled:bg-bakery-400 text-white rounded-xl font-semibold tracking-wide shadow-md transition-colors flex items-center justify-center space-x-2"
            >
              <span>{loading ? '처리 중...' : (isRegister ? '가입하기' : '로그인')}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </div>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-4 border-t border-bakery-100">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setSuccess('');
            }}
            className="text-sm font-medium text-bakery-600 hover:text-bakery-800 hover:underline"
          >
            {isRegister 
              ? '이미 계정이 있으신가요? 로그인하기' 
              : '아직 회원이 아니신가요? 회원가입하기'}
          </button>
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  // Load reviews list
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reviews');
      if (!response.ok) throw new Error('리뷰 목록을 불러오지 못했습니다.');
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
      setError('리뷰 목록을 로드하는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!comment.trim()) {
      setError('리뷰 내용을 입력해주세요.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '리뷰 등록에 실패했습니다.');
      }

      setSuccess('리뷰가 정상적으로 등록되었습니다!');
      setComment('');
      setRating(5);
      
      // Update review list with the new review
      setReviews((prev) => [data.review, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to render stars
  const renderStars = (count, size = 16, onClick = null, onMouseEnter = null, onMouseLeave = null) => {
    return (
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= count;
          return (
            <Star
              key={star}
              size={size}
              onClick={onClick ? () => onClick(star) : null}
              onMouseEnter={onMouseEnter ? () => onMouseEnter(star) : null}
              onMouseLeave={onMouseLeave ? () => onMouseLeave() : null}
              className={`transition-colors ${
                onClick ? 'cursor-pointer' : ''
              } ${
                filled 
                  ? 'fill-amber-400 text-amber-400' 
                  : 'text-bakery-300 fill-transparent'
              }`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-bakery-50 min-h-[80vh]">
      
      <div className="text-center mb-12">
        <h1 className="text-3xl font-serif font-bold text-bakery-800">베이커리 리뷰 게시판</h1>
        <p className="text-bakery-500 mt-2 text-sm">소중한 후기와 BGM 경험을 공유해 주세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Create Review Form */}
        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-2xl border border-bakery-200 shadow-lg sticky top-28">
            <h2 className="text-xl font-serif font-bold text-bakery-800 mb-6 flex items-center space-x-2">
              <MessageSquare className="text-bakery-600" />
              <span>리뷰 작성하기</span>
            </h2>

            {token ? (
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                
                {/* Alert Messages */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm flex items-start space-x-2">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-600 rounded-xl p-4 text-sm flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Star rating picker */}
                <div>
                  <label className="block text-sm font-semibold text-bakery-700 mb-2">만족도 별점</label>
                  <div className="flex items-center space-x-2 bg-bakery-50 p-3 rounded-xl border border-bakery-100">
                    {renderStars(
                      hoverRating || rating,
                      28,
                      (val) => setRating(val),
                      (val) => setHoverRating(val),
                      () => setHoverRating(0)
                    )}
                    <span className="text-sm font-bold text-bakery-600 ml-2">
                      {hoverRating || rating}점
                    </span>
                  </div>
                </div>

                {/* Comment textarea */}
                <div>
                  <label className="block text-sm font-semibold text-bakery-700 mb-2">리뷰 내용</label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="빵의 맛과 어울렸던 클래식 음악에 대한 소감을 자유롭게 적어주세요."
                    className="block w-full px-4 py-3 border border-bakery-300 rounded-xl bg-bakery-50/30 text-bakery-800 placeholder-bakery-400 focus:outline-none focus:ring-2 focus:ring-bakery-400 focus:border-transparent transition-all text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-bakery-800 hover:bg-bakery-700 disabled:bg-bakery-400 text-white rounded-xl font-bold tracking-wide shadow-md transition-colors"
                >
                  {submitting ? '등록 중...' : '리뷰 등록하기'}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-bakery-600 text-sm mb-6 leading-relaxed">
                  리뷰는 로그인한 회원만 작성할 수 있습니다.<br />로그인 후 솔직한 리뷰를 들려주세요.
                </p>
                <button
                  onClick={() => navigate('/login', { state: { from: { pathname: '/reviews' } } })}
                  className="w-full py-3 bg-bakery-850 hover:bg-bakery-800 text-bakery-800 border border-bakery-400 hover:bg-bakery-800 hover:text-white rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-1.5"
                >
                  <span>로그인하러 가기</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Reviews List */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xl font-serif font-bold text-bakery-800 mb-2">방문자 리뷰 ({reviews.length})</h2>

          {loading ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-bakery-200/60 shadow-sm">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bakery-600 mb-2"></div>
              <p className="text-bakery-500 text-sm">리뷰를 불러오고 있습니다...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-bakery-200/60 shadow-sm text-bakery-400 italic">
              첫 번째 리뷰의 주인공이 되어 보세요!
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-6 rounded-2xl border border-bakery-200/60 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-bakery-800 text-sm">{rev.username}</h4>
                      <span className="text-[10px] text-bakery-400">
                        {new Date(rev.created_at).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    {renderStars(rev.rating, 14)}
                  </div>
                  
                  <p className="text-bakery-700 text-sm leading-relaxed whitespace-pre-line">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

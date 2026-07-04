const db = require('../db/database');

exports.getReviews = (req, res) => {
  db.all('SELECT * FROM reviews ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: '리뷰 목록을 불러오는데 실패했습니다.' });
    }
    res.json(rows);
  });
};

exports.createReview = (req, res) => {
  const userId = req.user.id;
  const username = req.user.name || req.user.username;
  const { rating, comment } = req.body;

  if (rating === undefined || !comment) {
    return res.status(400).json({ error: '별점과 리뷰 내용을 입력해주세요.' });
  }

  const createdAt = new Date().toISOString();

  db.run(
    'INSERT INTO reviews (user_id, username, rating, comment, created_at) VALUES (?, ?, ?, ?, ?)',
    [userId, username, rating, comment, createdAt],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '리뷰 등록에 실패했습니다.' });
      }
      res.status(201).json({
        message: '리뷰가 등록되었습니다.',
        reviewId: this.lastID,
        review: {
          id: this.lastID,
          user_id: userId,
          username,
          rating,
          comment,
          created_at: createdAt
        }
      });
    }
  );
};

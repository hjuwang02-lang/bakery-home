const db = require('../db/database');

exports.getMyReservations = (req, res) => {
  const userId = req.user.id;

  db.all('SELECT * FROM reservations WHERE user_id = ? ORDER BY id DESC', [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: '예약 내역을 조회하는데 실패했습니다.' });
    }
    // Parse items back to JSON array
    const reservations = rows.map(row => {
      try {
        return { ...row, items: JSON.parse(row.items) };
      } catch (e) {
        return { ...row, items: [] };
      }
    });
    res.json(reservations);
  });
};

exports.createReservation = (req, res) => {
  const userId = req.user.id;
  const { date, time, items, total_price } = req.body;

  if (!date || !time || !items || !total_price) {
    return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
  }

  const itemsString = JSON.stringify(items);

  db.run(
    'INSERT INTO reservations (user_id, date, time, items, total_price) VALUES (?, ?, ?, ?, ?)',
    [userId, date, time, itemsString, total_price],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '예약 처리에 실패했습니다.' });
      }
      res.status(201).json({ message: '예약이 완료되었습니다.', reservationId: this.lastID });
    }
  );
};

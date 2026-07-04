const db = require('../db/database');

exports.getMenus = (req, res) => {
  db.all('SELECT * FROM menus', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: '메뉴 정보를 가져오는데 실패했습니다.' });
    }
    res.json(rows);
  });
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

exports.register = (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
  }

  // Check if user exists
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      return res.status(500).json({ error: '데이터베이스 조회 오류' });
    }
    if (row) {
      return res.status(400).json({ error: '이미 존재하는 사용자 이름(아이디)입니다.' });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: '비밀번호 암호화 실패' });
      }

      db.run(
        'INSERT INTO users (username, password, name) VALUES (?, ?, ?)',
        [username, hashedPassword, name],
        function(err) {
          if (err) {
            return res.status(500).json({ error: '사용자 등록 실패' });
          }
          res.status(201).json({ message: '회원가입이 완료되었습니다.', userId: this.lastID });
        }
      );
    });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: '아이디와 비밀번호를 입력해주세요.' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: '데이터베이스 조회 오류' });
    }
    if (!user) {
      return res.status(400).json({ error: '가입되지 않은 아이디입니다.' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: '비밀번호 비교 실패' });
      }
      if (!isMatch) {
        return res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, name: user.name },
        process.env.JWT_SECRET || 'crust_and_cream_secret_key_123',
        { expiresIn: '1d' }
      );

      res.json({
        message: '로그인 성공',
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name
        }
      });
    });
  });
};

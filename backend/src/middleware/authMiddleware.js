const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: '인증 헤더가 누락되었습니다.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: '인증 토큰이 누락되었습니다.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'crust_and_cream_secret_key_123');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
  }
};

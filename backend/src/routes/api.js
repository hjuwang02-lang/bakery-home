const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const menuController = require('../controllers/menuController');
const reservationController = require('../controllers/reservationController');
const reviewController = require('../controllers/reviewController');

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Menu routes
router.get('/menus', menuController.getMenus);

// Reservation routes
router.get('/reservations/me', authMiddleware, reservationController.getMyReservations);
router.post('/reservations', authMiddleware, reservationController.createReservation);

// Review routes
router.get('/reviews', reviewController.getReviews);
router.post('/reviews', authMiddleware, reviewController.createReview);

module.exports = router;

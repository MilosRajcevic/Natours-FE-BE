const express = require('express');
const reviewControler = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(reviewControler.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('users'),
    reviewControler.createReview
  );

router
  .route('/:id')
  .delete(reviewControler.deleteReview)
  .get(reviewControler.getReview);

module.exports = router;

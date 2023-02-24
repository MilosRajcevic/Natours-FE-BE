const express = require('express');
const reviewControler = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// mergeParams:true allow us to access /:tourId
const router = express.Router({ mergeParams: true });

// POST /tour/2313fasa/reviews
// GET /tour/2313fasa/reviews
// GET /tour/2313fasa/reviews/32141214fs

router
  .route('/')
  .get(reviewControler.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewControler.createReview
  );

router
  .route('/:id')
  .delete(reviewControler.deleteReview)
  .get(reviewControler.getReview);

module.exports = router;

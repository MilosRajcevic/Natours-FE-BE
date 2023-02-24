const express = require('express');
const reviewControler = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// mergeParams:true allow us to access /:tourId
const router = express.Router({ mergeParams: true });

// POST /tour/2313fasa/reviews
// GET /tour/2313fasa/reviews
// GET /tour/2313fasa/reviews/32141214fs

router.use(authController.protect);

router
  .route('/')
  .get(reviewControler.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewControler.setTourUserIds,
    reviewControler.createReview
  );

router
  .route('/:id')
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewControler.deleteReview
  )
  .get(reviewControler.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewControler.updateReview
  );

module.exports = router;

const Review = require('../models/reviewModel');
const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');

// 1) Get all reviews
// 2) Creating new reviews

exports.getAllReviews = catchAsyncError(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews },
  });
});

exports.getReview = catchAsyncError(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('There is no review with that ID'), 404);
  }

  res.status(200).json({
    status: 'success',
    data: { review },
  });
});

exports.createReview = catchAsyncError(async (req, res, next) => {
  const newReview = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    tour: req.body.tour,
    user: req.body.user,
  });

  res.status(200).json({
    status: 'succes',
    data: {
      review: newReview,
    },
  });
});

exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return next(new AppError('No review find with that ID'), 404);
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

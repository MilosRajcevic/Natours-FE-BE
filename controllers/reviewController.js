const Review = require('../models/reviewModel');
const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// 1) Get all reviews
// 2) Creating new reviews

exports.getAllReviews = catchAsyncError(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

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

// Create this middleware function and call it before create review to set tour & user ids
// because this par is neccessary in creating review but we can not use it directly in factory function
exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);

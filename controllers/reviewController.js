const Review = require('../models/reviewModel');
// const catchAsyncError = require('../utils/catchAsyncError');
// const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// Create this middleware function and call it before create review to set tour & user ids
// because this par is neccessary in creating review but we can not use it directly in factory function
exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

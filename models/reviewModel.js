const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review must have description'],
    },
    rating: { type: Number, min: 1, max: 5, default: 0 },
    createdAt: { type: Date, default: Date.now(), select: false },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  { toJSON: { virtuals: true } }
);

// DOCUMENT MIDDLEWARE

// QUERY MIDDLEWARE
reviewSchema.pre(/^find/, function (next) {
  // this.populate({ path: 'tour', select: 'name _id' }).populate({
  //   path: 'user',
  //   select: 'name _id',
  // });
  this.populate({
    path: 'user',
    select: 'name _id',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

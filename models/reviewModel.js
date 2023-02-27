const mongoose = require('mongoose');
const Tour = require('./tourModel');

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

// STATIC METHOD
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: {
        tour: tourId,
      },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  // Update stats in Tour Model
  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: stats[0].nRating,
    ratingsQuantity: stats[0].averageRating,
  });
};

reviewSchema.post('save', function () {
  // this.constructor because this is what points to the current model.
  this.constructor.calcAverageRatings(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
